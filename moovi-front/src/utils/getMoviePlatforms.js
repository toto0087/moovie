export function getMoviePlatforms(movie) {
  if (!movie) return [];
  if (Array.isArray(movie.platforms) && movie.platforms.length > 0) {
    return movie.platforms;
  }
  return movie.platform ? [movie.platform] : [];
}
