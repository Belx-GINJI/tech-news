import { NextRequest, NextResponse } from 'next/server';
import { loadArticles, getAvailableDates } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get('date');

  if (!date) {
    const dates = await getAvailableDates();
    return NextResponse.json({ dates });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD.' },
      { status: 400 }
    );
  }

  const data = await loadArticles(date);
  if (!data) {
    return NextResponse.json(
      { error: 'No articles found for this date.', date },
      { status: 404 }
    );
  }

  const category = searchParams.get('category');
  const language = searchParams.get('language');

  let articles = data.articles;

  if (category) {
    articles = articles.filter((a) => a.category === category);
  }
  if (language) {
    articles = articles.filter((a) => a.language === language);
  }

  return NextResponse.json({
    date: data.date,
    fetchedAt: data.fetchedAt,
    total: articles.length,
    articles,
  });
}
