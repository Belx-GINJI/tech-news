'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Calendar from '@/components/Calendar';
import ArticleList from '@/components/ArticleList';
import Favorites from '@/components/Favorites';
import type { Article } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getFavoriteUrls,
} from '@/lib/favorites';

type ViewTab = 'news' | 'favorites';

export default function Home() {
  const { auth } = useAuth();
  const isCloud = auth.isCloud;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [articles, setArticles] = useState<Article[]>([]);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const [activeTab, setActiveTab] = useState<ViewTab>('news');
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [favoriteUrls, setFavoriteUrls] = useState<Set<string>>(new Set());

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const loadFavorites = useCallback(async () => {
    if (isCloud) {
      try {
        const res = await fetch('/api/favorites');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data.articles) ? data.articles : [];
          setFavorites(list);
          setFavoriteUrls(new Set(list.map((a: Article) => a.url)));
        }
      } catch {
        setFavorites([]);
        setFavoriteUrls(new Set());
      }
    } else {
      setFavorites(getFavorites());
      setFavoriteUrls(getFavoriteUrls());
    }
  }, [isCloud]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleFav = useCallback(
    async (article: Article) => {
      if (isCloud) {
        const isFav = favoriteUrls.has(article.url);
        try {
          if (isFav) {
            await fetch(`/api/favorites?url=${encodeURIComponent(article.url)}`, {
              method: 'DELETE',
            });
          } else {
            await fetch('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(article),
            });
          }
          await loadFavorites();
        } catch {
          /* ignore */
        }
      } else {
        const updated = favoriteUrls.has(article.url)
          ? removeFavorite(article.url)
          : addFavorite(article);
        setFavorites(updated);
        setFavoriteUrls(new Set(updated.map((f) => f.url)));
      }
    },
    [isCloud, favoriteUrls, loadFavorites]
  );

  const loadAvailableDates = useCallback(async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.dates) {
        setAvailableDates(new Set(data.dates));
      }
    } catch {
      /* silently fail */
    }
  }, []);

  const fetchNewsForDate = useCallback(
    async (date: string) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setIsFetching(true);
      setError(null);
      try {
        const res = await fetch('/api/fetch-news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date }),
        });
        const data = await res.json();
        if (data.success) {
          setArticles([]);
          await loadAvailableDates();
          const articlesRes = await fetch(`/api/articles?date=${date}`);
          if (articlesRes.ok) {
            const articlesData = await articlesRes.json();
            setArticles(articlesData.articles || []);
          }
        } else {
          setError('fetch_error');
        }
      } catch {
        setError('fetch_error');
      } finally {
        setIsFetching(false);
        fetchingRef.current = false;
      }
    },
    [loadAvailableDates]
  );

  useEffect(() => {
    loadAvailableDates();
  }, [loadAvailableDates]);

  useEffect(() => {
    fetchNewsForDate(dateStr);
  }, [dateStr, fetchNewsForDate]);

  const handleDateSelect = (date: Date) => {
    setActiveTab('news');
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favCount={favorites.length}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                availableDates={availableDates}
              />

              {activeTab === 'news' && articles.length > 0 && (
                <div className="mt-4 bg-white rounded-2xl shadow-sm border border-surface-200 p-4">
                  <h3 className="text-sm font-semibold text-surface-700 mb-3">
                    記事統計
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="総記事数" value={articles.length} color="text-primary-600" />
                    <StatCard label="日本語" value={articles.filter((a) => a.language === 'ja').length} color="text-sky-600" />
                    <StatCard label="英語" value={articles.filter((a) => a.language === 'en').length} color="text-emerald-600" />
                    <StatCard label="ソース数" value={new Set(articles.map((a) => a.source)).size} color="text-violet-600" />
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section className="flex-1 min-w-0">
            {activeTab === 'news' ? (
              <ArticleList
                articles={articles}
                date={dateStr}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
                favoriteUrls={favoriteUrls}
                onToggleFav={handleToggleFav}
              />
            ) : (
              <Favorites
                favorites={favorites}
                onToggleFav={handleToggleFav}
              />
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-surface-200 bg-white/50 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-surface-400">
          Tech News Aggregator &mdash; 毎朝8時に世界中のDX・AI・テクノロジーニュースを自動収集
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-surface-50 rounded-lg p-2.5 text-center">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-surface-400 font-medium">{label}</div>
    </div>
  );
}
