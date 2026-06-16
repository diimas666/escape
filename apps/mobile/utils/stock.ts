export function normalizeInStock(value: unknown): boolean {
  if (value === false || value === 0 || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized !== 'false' && normalized !== '0' && normalized !== 'no';
  }

  return true;
}
