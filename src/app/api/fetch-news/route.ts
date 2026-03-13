import { NextRequest, NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/rss-fetcher';
import { translateArticles } from '@/lib/translator';
import { saveArticles } from '@/lib/storage';

export const maxDuration = 120;

function computeTimeWindow(dateStr: string): { since: Date; until: Date } {
  const since = new Date(dateStr + 'T00:00:00+09:00');
  const until = new Date(dateStr + 'T23:59:59+09:00');
  return { since, until };
}

function getTodayJST(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const dateStr = body.date || getTodayJST();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const { since, until } = computeTimeWindow(dateStr);

    console.log(`[Fetch] Target date: ${dateStr}`);
    console.log(`[Fetch] Window: ${since.toISOString()} → ${until.toISOString()}`);

    const articles = await fetchAllFeeds(since, until);
    const translated = await translateArticles(articles);
    await saveArticles(dateStr, translated);

    return NextResponse.json({
      success: true,
      date: dateStr,
      count: translated.length,
      message: `Fetched ${translated.length} articles for ${dateStr}`,
    });
  } catch (error) {
    console.error('[Fetch] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
