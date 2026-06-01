const POSTER_STRANGER = '/assets/image_33-7537346e-4a10-45ff-a221-bfdda19e15a5.png';

export const movies = [
  {
    id: 'harry-potter-1',
    title: 'Harry Potter 1',
    genre: 'Fantasía - Aventura',
    poster: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd7fe93?w=400&h=225&fit=crop',
    ageRating: 12,
    platform: 'netflix',
    synopsis:
      'Harry Potter descubre en su undécimo cumpleaños que es un mago y que ha sido aceptado en la Escuela de Magia y Hechicería de Hogwarts.',
  },
  {
    id: 'harry-potter-7',
    title: 'Harry Potter 7 p',
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
    synopsis: 'Drama sobre la vida de la reina Isabel II y los eventos que dieron forma a la segunda mitad del siglo XX.',
  },
  {
    id: 'vikingos',
    title: 'Vikingos',
    genre: 'Acción - Histórico',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop',
    ageRating: 16,
    platform: 'netflix',
    synopsis: 'Las aventuras del legendario héroe vikingo Ragnar Lothbrok y su familia.',
  },
  {
    id: 'walking-dead',
    title: 'The Walking de',
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
    synopsis: 'Tanjiro Kamado se convierte en cazador de demonios para salvar a su hermana y vengar a su familia.',
  },
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    genre: 'Terror - Suspenso',
    poster: POSTER_STRANGER,
    ageRating: 16,
    platform: 'netflix',
    synopsis:
      'La historia narra la súbita desaparición de un niño en esta ciudad durante la década de los 80, hecho que destapa los extraños sucesos que tienen lugar en la zona, producto de una serie de experimentos que realiza el gobierno. Además, en la ciudad aparecen fuerzas sobrenaturales inquietantes y una niña muy perturbadora.',
  },
  {
    id: 'peaky-blinders',
    title: 'Peaky Blinders',
    genre: 'Drama - Crimen',
    poster: 'https://images.unsplash.com/photo-1485846232355-8fb90e8963f2?w=400&h=225&fit=crop',
    ageRating: 18,
    platform: 'netflix',
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
];

export const getMovieById = (id) => movies.find((m) => m.id === id);

export const tabFilters = {
  novedades: (list) => list,
  recientes: (list) => [...list].reverse(),
  populares: (list) => [...list].sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0)),
};
