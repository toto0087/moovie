const STORAGE_KEY = 'moovi-search-history';
const MAX_ITEMS = 8;

export function readSearchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addSearchQuery(query) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return readSearchHistory();

  const prev = readSearchHistory().filter(
    (item) => item.toLowerCase() !== trimmed.toLowerCase()
  );
  const next = [trimmed, ...prev].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearSearchHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
