import type { Article } from './types';

export function filterArticlesBySearch(articles: Article[], query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return articles;

  const keywords = q.split(/\s+/).filter(Boolean);

  return articles.filter((article) => {
    const searchableText = [
      article.title,
      article.titleJa,
      article.summary,
      article.summaryJa,
      article.source,
      article.category,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return keywords.every((kw) => searchableText.includes(kw));
  });
}
