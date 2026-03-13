import fs from 'fs';
import path from 'path';
import type { Article, DailyArticles } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(date: string): string {
  return path.join(DATA_DIR, `${date}.json`);
}

function useSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function saveArticles(date: string, articles: Article[]): Promise<void> {
  if (useSupabase()) {
    const { getSupabase } = await import('./supabase');
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('daily_articles').upsert(
      {
        date,
        articles,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: 'date' }
    );
    if (error) throw error;
    console.log(`[Storage] Saved ${articles.length} articles for ${date} (Supabase)`);
    return;
  }
  ensureDataDir();
  const data: DailyArticles = {
    date,
    fetchedAt: new Date().toISOString(),
    articles,
  };
  fs.writeFileSync(getFilePath(date), JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[Storage] Saved ${articles.length} articles for ${date}`);
}

export async function loadArticles(date: string): Promise<DailyArticles | null> {
  if (useSupabase()) {
    const { getSupabase } = await import('./supabase');
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('daily_articles')
      .select('date, articles, fetched_at')
      .eq('date', date)
      .single();
    if (error || !data) return null;
    return {
      date: data.date,
      fetchedAt: data.fetched_at || new Date().toISOString(),
      articles: Array.isArray(data.articles) ? data.articles : [],
    };
  }
  const filePath = getFilePath(date);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as DailyArticles;
  } catch {
    console.error(`[Storage] Failed to load articles for ${date}`);
    return null;
  }
}

export async function getAvailableDates(): Promise<string[]> {
  if (useSupabase()) {
    const { getSupabase } = await import('./supabase');
    const supabase = getSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('daily_articles')
      .select('date')
      .order('date', { ascending: false });
    if (error || !data) return [];
    return data.map((r) => r.date).filter(Boolean);
  }
  ensureDataDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
    .sort()
    .reverse();
}
