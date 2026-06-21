import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiClient } from './gemini.client';
import { MovieEntity } from '../movies/movie.entity';
import { MoviesService } from '../movies/movies.service';
import {
  FormattedMovie,
  MoviesLocalizationService,
} from '../movies/movies-localization.service';

// Cuántos títulos del catálogo le pasamos a Gemini como contexto.
const CATALOG_LIMIT = 120;
// Tope de películas que devolvemos al front.
const MAX_RECOMMENDATIONS = 12;

// Formato de salida que le exigimos a Gemini (JSON estructurado).
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    movieIds: { type: 'ARRAY', items: { type: 'INTEGER' } },
  },
  required: ['reply', 'movieIds'],
};

export type ChatResult = { reply: string; movies: FormattedMovie[] };

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
    private readonly gemini: GeminiClient,
    private readonly moviesService: MoviesService,
    private readonly localization: MoviesLocalizationService,
  ) {}

  async chat(message: string, lang?: string): Promise<ChatResult> {
    const catalog = await this.loadCatalog();
    const catalogText = catalog.map((m) => this.toCatalogLine(m)).join('\n');

    const system = this.buildSystemPrompt(lang);
    const user =
      'Catálogo disponible (SOLO podés recomendar de esta lista, identificada por id):\n' +
      `${catalogText}\n\n` +
      `Pedido del usuario: "${message}"`;

    const raw = await this.gemini.generate({ system, user, schema: RESPONSE_SCHEMA });

    const { reply, movieIds } = this.parse(raw);
    const movies = await this.resolveMovies(movieIds, catalog, lang);

    return { reply, movies };
  }

  /** Trae un subconjunto del catálogo, priorizando lo más popular. */
  private loadCatalog(): Promise<MovieEntity[]> {
    return this.movieRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.platform', 'platform')
      .orderBy('m.popularity_rank', 'ASC')
      .addOrderBy('m.trending', 'DESC')
      .take(CATALOG_LIMIT)
      .getMany();
  }

  private toCatalogLine(m: MovieEntity): string {
    const genres = this.parseGenres(m.genres).join(', ') || 's/género';
    const year = m.release_year ?? 's/año';
    const type = m.media_type === 'tv' ? 'serie' : 'película';
    const platform = m.platform?.name ?? 's/plataforma';
    return `#${m.id} | ${m.title} (${year}) | ${type} | ${genres} | ${platform}`;
  }

  private buildSystemPrompt(lang?: string): string {
    const language = this.languageName(lang);
    return [
      'Sos "Moovi", un asistente de recomendación de películas y series de una app de streaming.',
      'Tu tarea: a partir del pedido del usuario, elegir los títulos MÁS relevantes del catálogo que se te entrega.',
      'Reglas estrictas:',
      '- SOLO podés recomendar títulos presentes en el catálogo. Nunca inventes títulos ni ids.',
      `- Devolvé entre 1 y ${MAX_RECOMMENDATIONS} ids en "movieIds", ordenados del más al menos relevante.`,
      '- Si nada del catálogo encaja, devolvé "movieIds" vacío y explicá amablemente en "reply" que no encontraste algo para ese pedido.',
      `- "reply" es un mensaje breve, amable y conversacional, en ${language}, que presenta tus recomendaciones (podés nombrar algunos títulos).`,
      '- No menciones ids, ni que recibiste una lista, ni que sos una IA. Hablá como un recomendador humano.',
    ].join('\n');
  }

  private parse(raw: string): { reply: string; movieIds: number[] } {
    try {
      const data = JSON.parse(raw);
      const reply = typeof data.reply === 'string' ? data.reply.trim() : '';
      const movieIds = Array.isArray(data.movieIds)
        ? data.movieIds
            .map((n: any) => Number(n))
            .filter((n: number) => Number.isInteger(n))
        : [];
      if (!reply) throw new Error('reply vacío');
      return { reply, movieIds };
    } catch {
      this.logger.warn(`No pude parsear el JSON de Gemini: ${raw?.slice(0, 300)}`);
      // Fallback: usar el texto crudo como respuesta, sin películas.
      return {
        reply: raw?.trim() || 'No pude generar una recomendación en este momento.',
        movieIds: [],
      };
    }
  }

  private async resolveMovies(
    movieIds: number[],
    catalog: MovieEntity[],
    lang?: string,
  ): Promise<FormattedMovie[]> {
    if (movieIds.length === 0) return [];
    const byId = new Map(catalog.map((m) => [m.id, m]));
    const picked = movieIds
      .slice(0, MAX_RECOMMENDATIONS)
      .map((id) => byId.get(id))
      .filter((m): m is MovieEntity => !!m);

    const formatted = picked.map((m) => this.moviesService.format(m));
    return this.localization.localizeMany(formatted, lang);
  }

  private parseGenres(genres: string | null): string[] {
    if (!genres) return [];
    try {
      const parsed = JSON.parse(genres);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private languageName(lang?: string): string {
    const names: Record<string, string> = {
      es: 'español',
      en: 'inglés',
      fr: 'francés',
      pt: 'portugués',
      zh: 'chino',
      ja: 'japonés',
    };
    return names[lang ?? 'es'] ?? 'español';
  }
}
