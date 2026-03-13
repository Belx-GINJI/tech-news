import Parser from 'rss-parser';
import { FEED_SOURCES, type FeedSource } from './feeds';
import type { Article } from './types';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'TechNewsAggregator/1.0',
    Accept: 'application/rss+xml, application/xml, text/xml, application/atom+xml',
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function generateId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

async function fetchSingleFeed(
  source: FeedSource,
  since: Date,
  until: Date
): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const articles: Article[] = [];

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const publishedAt = item.pubDate
        ? new Date(item.pubDate)
        : item.isoDate
          ? new Date(item.isoDate)
          : null;

      if (!publishedAt || isNaN(publishedAt.getTime())) continue;
      if (publishedAt < since || publishedAt > until) continue;

      const rawSummary =
        item.contentSnippet || item.content || item.summary || '';
      const summary = truncate(stripHtml(rawSummary), 300);

      articles.push({
        id: generateId(item.link),
        title: stripHtml(item.title),
        summary,
        url: item.link,
        source: source.name,
        category: source.category,
        language: source.language,
        publishedAt: publishedAt.toISOString(),
        fetchedAt: new Date().toISOString(),
        imageUrl: extractImageUrl(item),
      });
    }

    return articles;
  } catch (error) {
    console.error(`[RSS] Failed to fetch ${source.name}: ${error}`);
    return [];
  }
}

function extractImageUrl(item: Record<string, unknown>): string | undefined {
  const enclosure = item.enclosure as
    | { url?: string; type?: string }
    | undefined;
  if (enclosure?.url && enclosure.type?.startsWith('image/')) {
    return enclosure.url;
  }

  const mediaContent = (item as Record<string, unknown>)['media:content'] as
    | { $?: { url?: string } }
    | undefined;
  if (mediaContent?.$?.url) {
    return mediaContent.$.url;
  }

  const content = (item.content || item.summary || '') as string;
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch?.[1]) {
    return imgMatch[1];
  }

  return undefined;
}

export async function fetchAllFeeds(
  since: Date,
  until: Date
): Promise<Article[]> {
  console.log(
    `[RSS] Fetching articles from ${since.toISOString()} to ${until.toISOString()} (${FEED_SOURCES.length} sources)`
  );

  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchSingleFeed(source, since, until))
  );

  const allArticles: Article[] = [];
  let successCount = 0;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
      successCount++;
      console.log(
        `[RSS] ${FEED_SOURCES[i].name}: ${result.value.length} articles`
      );
    } else {
      console.error(`[RSS] ${FEED_SOURCES[i].name}: FAILED`);
    }
  }

  console.log(
    `[RSS] Done. ${successCount}/${FEED_SOURCES.length} feeds, ${allArticles.length} total articles`
  );

  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  unique.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return unique;
}
