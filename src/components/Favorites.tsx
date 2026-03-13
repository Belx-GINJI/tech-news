'use client';

import { useState } from 'react';
import type { Article } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/feeds';
import { filterArticlesBySearch } from '@/lib/search';
import ArticleCard from './ArticleCard';
import SearchBar from './SearchBar';

interface FavoritesProps {
  favorites: Article[];
  onToggleFav: (article: Article) => void;
}

const CATEGORY_ORDER = ['ai', 'tech', 'dx', 'jp-tech'] as const;

const CATEGORY_ICONS: Record<string, string> = {
  ai: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
  tech: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  dx: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6',
  'jp-tech': 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
};

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  ai: 'border-l-violet-400',
  tech: 'border-l-emerald-400',
  dx: 'border-l-amber-400',
  'jp-tech': 'border-l-sky-400',
};

export default function Favorites({ favorites, onToggleFav }: FavoritesProps) {
  if (favorites.length === 0) {
    return (
      <div className="fade-in flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-16 h-16 text-surface-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <p className="text-surface-500 font-medium text-lg">お気に入りはまだありません</p>
        <p className="text-surface-400 text-sm mt-1">
          ニュース一覧で星マークをクリックすると<br />ここに保存されます
        </p>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const filteredFavorites = filterArticlesBySearch(favorites, searchQuery);

  const grouped = new Map<string, Article[]>();
  for (const article of filteredFavorites) {
    const cat = article.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(article);
  }

  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped.has(c));
  const otherCategories = [...grouped.keys()].filter(
    (c) => !CATEGORY_ORDER.includes(c as (typeof CATEGORY_ORDER)[number])
  );

  const favoriteUrls = new Set(favorites.map((f) => f.url));

  if (filteredFavorites.length === 0) {
    return (
      <div className="fade-in">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-surface-800">お気に入り</h2>
          <p className="text-sm text-surface-500 mt-0.5">{favorites.length} 件の記事</p>
        </div>
        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="お気に入り内を検索..." />
        </div>
        <p className="text-center text-surface-400 py-10">検索に一致する記事がありません</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-surface-800">お気に入り</h2>
        <p className="text-sm text-surface-500 mt-0.5">
          {searchQuery ? `${filteredFavorites.length} / ${favorites.length} 件` : `${favorites.length} 件の記事`}
        </p>
      </div>

      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="お気に入り内を検索..."
        />
      </div>

      <div className="space-y-6">
        {[...sortedCategories, ...otherCategories].map((category) => {
          const articles = grouped.get(category) || [];
          const label = CATEGORY_LABELS[category] || category;
          const iconPath = CATEGORY_ICONS[category];
          const borderColor = CATEGORY_BORDER_COLORS[category] || 'border-l-surface-300';

          return (
            <div key={category} className={`border-l-4 ${borderColor} pl-4`}>
              <div className="flex items-center gap-2 mb-3">
                {iconPath && (
                  <svg className="w-5 h-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                  </svg>
                )}
                <h3 className="text-base font-semibold text-surface-700">
                  {label}
                </h3>
                <span className="text-xs text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full">
                  {articles.length}
                </span>
              </div>
              <div className="space-y-3">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.url}
                    article={article}
                    isFav={favoriteUrls.has(article.url)}
                    onToggleFav={onToggleFav}
                    showDate
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
