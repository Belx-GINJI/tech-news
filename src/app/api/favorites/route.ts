import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

function getUserId(request: NextRequest): string | null {
  const cookie = request.cookies.get('tech-news-user');
  if (!cookie?.value) return null;
  try {
    const raw = decodeURIComponent(cookie.value);
    const { userId } = JSON.parse(raw);
    return typeof userId === 'string' && /^[0-9]{4}$/.test(userId) ? userId : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'config_error' }, { status: 503 });
    }
    const { data, error } = await supabase
      .from('user_favorites')
      .select('articles')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ articles: [] });
    }

    const articles = Array.isArray(data.articles) ? data.articles : [];
    return NextResponse.json({ articles });
  } catch (e) {
    console.error('[Favorites] GET:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const article = await request.json();
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'config_error' }, { status: 503 });
    }

    const { data: row } = await supabase
      .from('user_favorites')
      .select('articles')
      .eq('user_id', userId)
      .single();

    let articles = Array.isArray(row?.articles) ? row.articles : [];
    if (articles.some((a: { url?: string }) => a?.url === article?.url)) {
      return NextResponse.json({ success: true, articles });
    }

    articles = [article, ...articles];

    const { error } = await supabase
      .from('user_favorites')
      .upsert(
        { user_id: userId, articles, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('[Favorites] POST:', error);
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, articles });
  } catch (e) {
    console.error('[Favorites] POST:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const url = searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'missing_url' }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'config_error' }, { status: 503 });
    }
    const { data: row } = await supabase
      .from('user_favorites')
      .select('articles')
      .eq('user_id', userId)
      .single();

    let articles = Array.isArray(row?.articles) ? row.articles : [];
    articles = articles.filter((a: { url?: string }) => a?.url !== url);

    const { error } = await supabase
      .from('user_favorites')
      .upsert(
        { user_id: userId, articles, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('[Favorites] DELETE:', error);
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, articles });
  } catch (e) {
    console.error('[Favorites] DELETE:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
