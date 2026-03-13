'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Article } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/feeds';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  date: string;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  favoriteUrls: Set<string>;
  onToggleFav: (article: Article) => void;
}

type CategoryFilter = 'all' | 'tech' | 'ai' | 'dx' | 'jp-tech';
type LanguageFilter = 'all' | 'ja' | 'en';

export default function ArticleList({
  articles,
  date,
  isLoading,
  isFetching,
  error,
  favoriteUrls,
  onToggleFav,
}: ArticleListProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all');

  const filtered = articles.filter((a) => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (languageFilter !== 'all' && a.language !== languageFilter) return false;
    return true;
  });

  const categoryCounts = articles.reduce(
    (acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full spinner" />
        <p className="mt-4 text-surface-700 font-medium">
          {format(new Date(date + 'T00:00:00'), 'M月d日', { locale: ja })} のニュースを取得中...
        </p>
        <p className="mt-1.5 text-sm text-surface-400">
          RSSフィードの取得と翻訳を行っています（20〜30秒程度）
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full spinner" />
        <p className="mt-4 text-surface-500">記事を読み込んでいます...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-red-800 font-medium">ニュースの取得に失敗しました</p>
        <p className="text-red-600 text-sm mt-1">ネットワーク接続を確認して、もう一度お試しください</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-surface-800">
            {format(new Date(date + 'T00:00:00'), 'M月d日（E）', { locale: ja })}
            のニュース
          </h2>
          <p className="text-sm text-surface-500 mt-0.5">
            {filtered.length} / {articles.length} 件の記事
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex flex-wrap gap-1.5">
          <FilterButton active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
            すべて ({articles.length})
          </FilterButton>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <FilterButton
              key={key}
              active={categoryFilter === key}
              onClick={() => setCategoryFilter(key as CategoryFilter)}
            >
              {label} ({categoryCounts[key] || 0})
            </FilterButton>
          ))}
        </div>

        <div className="w-px bg-surface-200 mx-1 hidden sm:block" />

        <div className="flex gap-1.5">
          <FilterButton active={languageFilter === 'all'} onClick={() => setLanguageFilter('all')}>
            全言語
          </FilterButton>
          <FilterButton active={languageFilter === 'ja'} onClick={() => setLanguageFilter('ja')}>
            日本語
          </FilterButton>
          <FilterButton active={languageFilter === 'en'} onClick={() => setLanguageFilter('en')}>
            English
          </FilterButton>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-surface-400 py-10">該当する記事がありません</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFav={favoriteUrls.has(article.url)}
              onToggleFav={onToggleFav}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-primary-500 text-white shadow-sm'
          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
      }`}
    >
      {children}
    </button>
  );
}
