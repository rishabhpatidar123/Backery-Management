/** Deterministic display rating from product id (no DB field). */
export function getProductRating(id: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const rating = 4 + (Math.abs(hash) % 10) / 10;
  const count = 12 + (Math.abs(hash) % 88);
  return { rating: Math.round(rating * 10) / 10, count };
}
