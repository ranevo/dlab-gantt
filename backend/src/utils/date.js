export function toISODate(value) {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  return value.toISOString().slice(0, 10);
}
