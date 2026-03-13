import type { Article } from './types';

const STORAGE_KEY = 'tech-news-favorites';

export function getFavorites(): Article[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(article: Article): Article[] {
  const favs = getFavorites();
  if (favs.some((f) => f.url === article.url)) return favs;
  const updated = [article, ...favs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFavorite(url: string): Article[] {
  const favs = getFavorites();
  const updated = favs.filter((f) => f.url !== url);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isFavorite(url: string): boolean {
  return getFavorites().some((f) => f.url === url);
}

export function getFavoriteUrls(): Set<string> {
  return new Set(getFavorites().map((f) => f.url));
}
