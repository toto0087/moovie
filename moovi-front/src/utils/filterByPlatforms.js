export function filterByPlatforms(movies, activePlatforms) {
  if (!activePlatforms?.length) return [];
  const allowed = new Set(activePlatforms);
  return movies.filter((movie) => movie.platform && allowed.has(movie.platform));
}
