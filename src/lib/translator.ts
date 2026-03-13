import type { Article } from './types';

const TRANSLATE_API =
  'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=';

async function translateText(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  try {
    const res = await fetch(TRANSLATE_API + encodeURIComponent(text), {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const segments: string[] = [];
    if (Array.isArray(data[0])) {
      for (const seg of data[0]) {
        if (seg[0]) segments.push(seg[0]);
      }
    }
    return segments.join('') || text;
  } catch (err) {
    console.error(`[Translate] Failed: ${err}`);
    return text;
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function translateArticles(
  articles: Article[]
): Promise<Article[]> {
  const enArticles = articles.filter((a) => a.language === 'en');
  if (enArticles.length === 0) return articles;

  console.log(`[Translate] Translating ${enArticles.length} English articles...`);

  const BATCH_SIZE = 5;
  for (let i = 0; i < enArticles.length; i += BATCH_SIZE) {
    const batch = enArticles.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (article) => {
        article.titleJa = await translateText(article.title);
        if (article.summary) {
          article.summaryJa = await translateText(article.summary);
        }
      })
    );
    if (i + BATCH_SIZE < enArticles.length) {
      await sleep(300);
    }
  }

  const successCount = enArticles.filter((a) => a.titleJa && a.titleJa !== a.title).length;
  console.log(
    `[Translate] Done. ${successCount}/${enArticles.length} articles translated.`
  );

  return articles;
}
