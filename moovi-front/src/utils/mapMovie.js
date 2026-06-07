export function mapMovie(apiMovie) {
  if (!apiMovie) return null;

  const platformSlug = apiMovie.platform?.slug ?? null;

  return {
    id: apiMovie.id,
    title: apiMovie.title,
    poster: apiMovie.poster_url,
    backdrop: apiMovie.backdrop_url,
    genre: Array.isArray(apiMovie.genres) ? apiMovie.genres.join(' · ') : '',
    synopsis: apiMovie.overview ?? '',
    ageRating: apiMovie.age_rating ?? null,
    platform: platformSlug,
    platforms: platformSlug ? [platformSlug] : [],
    badge: apiMovie.badge,
    popularityTrend: apiMovie.popularity_trend,
    popularityRank: apiMovie.popularity_rank,
    trending: apiMovie.trending,
    mediaType: apiMovie.media_type,
    releaseYear: apiMovie.release_year,
    runtime: apiMovie.runtime,
    tmdbId: apiMovie.tmdb_id,
    slug: apiMovie.slug,
  };
}

export function mapMovies(list) {
  return (list ?? []).map(mapMovie).filter(Boolean);
}
