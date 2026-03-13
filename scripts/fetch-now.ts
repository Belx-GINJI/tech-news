/**
 * ニュースを即座に取得するスクリプト
 *
 * 使い方:
 *   npm run fetch-news
 *   npm run fetch-news -- --date 2026-03-08
 */
import path from 'path';
import { fetchAllFeeds } from '../src/lib/rss-fetcher';
import { translateArticles } from '../src/lib/translator';
import { saveArticles } from '../src/lib/storage';

const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

function getTargetDate(): string {
  const dateArg = process.argv.find((a) => a.startsWith('--date='));
  if (dateArg) return dateArg.split('=')[1];

  const idx = process.argv.indexOf('--date');
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];

  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

export async function fetchAndSave(dateStr?: string) {
  const target = dateStr || getTargetDate();
  const since = new Date(target + 'T00:00:00+09:00');
  const until = new Date(target + 'T23:59:59+09:00');

  console.log(`[Fetch] Date: ${target}`);
  console.log(`[Fetch] Window: ${since.toISOString()} → ${until.toISOString()}`);

  const articles = await fetchAllFeeds(since, until);
  const translated = await translateArticles(articles);
  saveArticles(target, translated);

  console.log(`[Fetch] Complete! ${translated.length} articles saved.`);
  return translated.length;
}

if (require.main === module) {
  fetchAndSave()
    .then((count) => {
      console.log(`\nDone. ${count} articles fetched and saved.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}
