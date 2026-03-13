export interface Article {
  id: string;
  title: string;
  summary: string;
  titleJa?: string;
  summaryJa?: string;
  url: string;
  source: string;
  category: string;
  language: string;
  publishedAt: string;
  fetchedAt: string;
  imageUrl?: string;
}

export interface DailyArticles {
  date: string;
  fetchedAt: string;
  articles: Article[];
}
