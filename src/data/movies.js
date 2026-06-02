const POSTER_STRANGER = '/assets/image_33-7537346e-4a10-45ff-a221-bfdda19e15a5.png';

export const platformMeta = {
  netflix: { short: 'N', label: 'Netflix' },
  hbo: { short: 'HBO', label: 'HBO Max' },
  'disney-plus': { short: 'D+', label: 'Disney+' },
};

export const movies = [
  {
    id: 'harry-potter-1',
    title: 'Harry Potter 1',
    genre: 'Fantasía - Aventura',
    poster: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd7fe93?w=400&h=225&fit=crop',
    ageRating: 12,
    platform: 'netflix',
    trending: true,
    synopsis:
      'Harry Potter descubre en su undécimo cumpleaños que es un mago y que ha sido aceptado en la Escuela de Magia y Hechicería de Hogwarts.',
  },
  {
    id: 'harry-potter-7',
    title: 'Harry Potter 7',
    genre: 'Fantasía - Aventura',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
    ageRating: 13,
    platform: 'netflix',
    synopsis: 'Harry, Ron y Hermione emprenden la búsqueda de los Horrocruxes para destruir a Voldemort.',
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    genre: 'Anime - Aventura',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=225&fit=crop',
    ageRating: 12,
    platform: 'netflix',
    trending: true,
    badge: 'TOP 10',
    synopsis: 'Monkey D. Luffy y su tripulación buscan el legendario tesoro One Piece.',
  },
  {
    id: 'the-crown',
    title: 'The Crown',
    genre: 'Drama - Histórico',
    poster: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=225&fit=crop',
    ageRating: 16,
    platform: 'netflix',
    badge: 'TOP 10',
    trending: true,
    synopsis: 'Drama sobre la vida de la reina Isabel II y los eventos que dieron forma a la segunda mitad del siglo XX.',
  },
  {
    id: 'vikingos',
    title: 'Vikingos',
    genre: 'Acción - Histórico',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop',
    ageRating: 16,
    platform: 'netflix',
    trending: true,
    synopsis: 'Las aventuras del legendario héroe vikingo Ragnar Lothbrok y su familia.',
  },
  {
    id: 'walking-dead',
    title: 'The Walking Dead',
    genre: 'Terror - Drama',
    poster: 'https://images.unsplash.com/photo-1509281371737-b9777fbb0f42?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'netflix',
    synopsis: 'Un grupo de supervivientes lucha por mantenerse con vida en un mundo postapocalíptico dominado por zombis.',
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    genre: 'Anime - Acción',
    poster: 'https://images.unsplash.com/photo-1613376023733-0a73315d9a06?w=400&h=225&fit=crop',
    ageRating: 16,
    platform: 'netflix',
    trending: true,
    synopsis: 'Tanjiro Kamado se convierte en cazador de demonios para salvar a su hermana y vengar a su familia.',
  },
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    genre: 'Terror - Suspenso',
    poster: POSTER_STRANGER,
    ageRating: 16,
    platform: 'netflix',
    badge: 'TOP 10',
    trending: true,
    synopsis:
      'La historia narra la súbita desaparición de un niño en esta ciudad durante la década de los 80, hecho que destapa los extraños sucesos que tienen lugar en la zona, producto de una serie de experimentos que realiza el gobierno.',
  },
  {
    id: 'peaky-blinders',
    title: 'Peaky Blinders',
    genre: 'Drama - Crimen',
    poster: 'https://images.unsplash.com/photo-1485846232355-8fb90e8963f2?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'netflix',
    trending: true,
    synopsis: 'Una familia de gánsteres ingleses en los años 20 controla la ciudad de Birmingham.',
  },
  {
    id: 'whiplash',
    title: 'Whiplash',
    genre: 'Drama - Música',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    ageRating: 16,
    platform: 'netflix',
    synopsis: 'Un joven baterista de jazz lucha por alcanzar la perfección bajo un instructor implacable.',
  },
  {
    id: 'house-of-dragon',
    title: 'House of the Dragon',
    genre: 'Fantasía - Drama',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2179?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'hbo',
    badge: 'TOP 10',
    trending: true,
    synopsis: 'La historia de la casa Targaryen doscientos años antes de los eventos de Game of Thrones.',
  },
  {
    id: 'the-last-of-us',
    title: 'The Last of Us',
    genre: 'Drama - Postapocalíptico',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'hbo',
    badge: 'TOP 10',
    trending: true,
    synopsis: 'Joel y Ellie atraviesan un Estados Unidos devastado por una pandemia en busca de esperanza.',
  },
  {
    id: 'succession',
    title: 'Succession',
    genre: 'Drama - Sátira',
    poster: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'hbo',
    trending: true,
    synopsis: 'Los hijos del magnate mediático Logan Roy compiten por el control del imperio familiar.',
  },
  {
    id: 'euphoria',
    title: 'Euphoria',
    genre: 'Drama - Adolescente',
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'hbo',
    trending: true,
    synopsis: 'Un grupo de estudiantes de secundaria navega el amor, la identidad y la adicción en la era digital.',
  },
  {
    id: 'the-mandalorian',
    title: 'The Mandalorian',
    genre: 'Ciencia ficción - Aventura',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=225&fit=crop',
    ageRating: 13,
    platform: 'disney-plus',
    badge: 'TOP 10',
    trending: true,
    synopsis: 'Un cazarrecompensas solitario recorre los confines de la galaxia lejos de la autoridad de la Nueva República.',
  },
  {
    id: 'loki',
    title: 'Loki',
    genre: 'Ciencia ficción - Superhéroes',
    poster: 'https://images.unsplash.com/photo-1535016120720-40f38c630cae?w=400&h=225&fit=crop',
    ageRating: 12,
    platform: 'disney-plus',
    trending: true,
    synopsis: 'Loki es capturado por la Autoridad de Variación Temporal y debe corregir las líneas temporales.',
  },
  {
    id: 'andor',
    title: 'Andor',
    genre: 'Ciencia ficción - Drama',
    poster: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=225&fit=crop',
    ageRating: 14,
    platform: 'disney-plus',
    badge: 'TENDENCIA',
    trending: true,
    synopsis: 'La historia de Cassian Andor en los años previos a unirse a la Rebelión contra el Imperio.',
  },
  {
    id: 'shogun',
    title: 'Shōgun',
    genre: 'Drama - Histórico',
    poster: 'https://images.unsplash.com/photo-1528164344727-37edd9cc8f4f?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'disney-plus',
    trending: true,
    synopsis: 'Un piloto inglés varado en Japón feudal se ve envuelto en una lucha por el poder.',
  },
  {
    id: 'the-bear',
    title: 'The Bear',
    genre: 'Drama - Comedia',
    poster: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=225&fit=crop',
    ageRating: 16,
    platform: 'hbo',
    synopsis: 'Un chef de alta cocina regresa a Chicago para salvar el restaurante de sándwiches de su hermano.',
  },
  {
    id: 'wednesday',
    title: 'Wednesday',
    genre: 'Comedia - Terror',
    poster: 'https://images.unsplash.com/photo-1509242565062-9334ebea1d20?w=400&h=225&fit=crop',
    ageRating: 14,
    platform: 'netflix',
    badge: 'TENDENCIA',
    trending: true,
    synopsis: 'Wednesday Addams investiga misterios sobrenaturales en la Academia Nevermore.',
  },
];

const popularityTrends = {
  'harry-potter-1': 'up',
  'harry-potter-7': 'down',
  'one-piece': 'up',
  'the-crown': 'down',
  'vikingos': 'up',
  'walking-dead': 'down',
  'demon-slayer': 'up',
  'stranger-things': 'up',
  'peaky-blinders': 'down',
  'whiplash': 'down',
  'house-of-dragon': 'up',
  'the-last-of-us': 'up',
  'succession': 'down',
  'euphoria': 'up',
  'the-mandalorian': 'up',
  'loki': 'down',
  'andor': 'up',
  'shogun': 'up',
  'the-bear': 'up',
  'wednesday': 'up',
};

/** Orden actual de popularidad (1 = lo más popular en este momento). */
const popularityRanks = {
  'stranger-things': 1,
  'the-last-of-us': 2,
  'wednesday': 3,
  'house-of-dragon': 4,
  'the-mandalorian': 5,
  'one-piece': 6,
  'andor': 7,
  'demon-slayer': 8,
  'shogun': 9,
  'euphoria': 10,
  'harry-potter-1': 11,
  'vikingos': 12,
  'the-crown': 13,
  'peaky-blinders': 14,
  'succession': 15,
  'loki': 16,
};

movies.forEach((movie) => {
  if (popularityTrends[movie.id]) {
    movie.popularityTrend = popularityTrends[movie.id];
  }
  if (popularityRanks[movie.id]) {
    movie.popularityRank = popularityRanks[movie.id];
  }
});

export function sortByPopularityNow(list) {
  return [...list].sort((a, b) => {
    const rankA = a.popularityRank ?? Number.MAX_SAFE_INTEGER;
    const rankB = b.popularityRank ?? Number.MAX_SAFE_INTEGER;
    if (rankA !== rankB) return rankA - rankB;

    const badgeScore = (m) => {
      if (m.badge?.includes('TOP')) return 0;
      if (m.badge) return 1;
      return 2;
    };
    const badgeDiff = badgeScore(a) - badgeScore(b);
    if (badgeDiff !== 0) return badgeDiff;

    const trendScore = (m) => (m.popularityTrend === 'up' ? 0 : 1);
    return trendScore(a) - trendScore(b);
  });
}

export const getMovieById = (id) => movies.find((m) => m.id === id);

export const tabFilters = {
  novedades: (list) => list,
  recientes: (list) => [...list].reverse(),
  populares: (list) => sortByPopularityNow(list.filter((m) => m.trending)),
};

export const popularNow = sortByPopularityNow(movies.filter((m) => m.trending));
