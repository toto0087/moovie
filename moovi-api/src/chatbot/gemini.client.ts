import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type GeminiSchema = Record<string, any>;

@Injectable()
export class GeminiClient {
  private readonly logger = new Logger(GeminiClient.name);

  constructor(
    private readonly http: HttpService,
    private readonly cfg: ConfigService,
  ) {}

  /**
   * Llama a Gemini y devuelve el texto del primer candidato.
   * Si se pasa `schema`, le pide a Gemini salida JSON con ese formato.
   */
  async generate(opts: {
    system: string;
    user: string;
    schema?: GeminiSchema;
  }): Promise<string> {
    const apiKey = this.cfg.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY no está configurada en el .env');
      throw new ServiceUnavailableException('Chatbot no configurado');
    }

    const body: Record<string, any> = {
      system_instruction: { parts: [{ text: opts.system }] },
      contents: [{ role: 'user', parts: [{ text: opts.user }] }],
      generationConfig: {
        temperature: 0.7,
        ...(opts.schema
          ? { responseMimeType: 'application/json', responseSchema: opts.schema }
          : {}),
      },
    };

    try {
      const res = await firstValueFrom(
        this.http.post(GEMINI_URL, body, { params: { key: apiKey } }),
      );
      const text: string | undefined =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        this.logger.warn(
          `Gemini respondió sin texto: ${JSON.stringify(res.data)?.slice(0, 500)}`,
        );
        throw new ServiceUnavailableException('El chatbot no devolvió respuesta');
      }
      return text;
    } catch (err: any) {
      if (err instanceof ServiceUnavailableException) throw err;
      const detail = err?.response?.data ?? err?.message ?? err;
      this.logger.error(
        `Error llamando a Gemini: ${JSON.stringify(detail)?.slice(0, 500)}`,
      );
      throw new ServiceUnavailableException('No se pudo contactar al chatbot');
    }
  }
}
