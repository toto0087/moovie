export function hasAgeRating(age) {
  return age != null && age !== '' && !Number.isNaN(Number(age));
}

export function formatAgeRating(age) {
  if (!hasAgeRating(age)) return null;
  const n = Number(age);
  if (n === 0) return 'ATP';
  return `+${n}`;
}
