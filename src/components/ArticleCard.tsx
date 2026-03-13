'use client';

import { format } from 'date-fns';
import type { Article } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/feeds';

const CATEGORY_COLORS: Record<string, string> = {
  tech: 'bg-emerald-100 text-emerald-700',
  ai: 'bg-violet-100 text-violet-700',
  dx: 'bg-amber-100 text-amber-700',
  'jp-tech': 'bg-sky-100 text-sky-700',
};

interface ArticleCardProps {
  article: Article;
  isFav: boolean;
  onToggleFav: (article: Article) => void;
  showDate?: boolean;
}

export default function ArticleCard({
  article,
  isFav,
  onToggleFav,
  showDate = false,
}: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeStr = showDate
    ? format(publishedDate, 'M/d HH:mm')
    : format(publishedDate, 'HH:mm');

  const displayTitle = article.titleJa || article.title;
  const displaySummary = article.summaryJa || article.summary;
  const isTranslated = article.language === 'en' && !!article.titleJa;

  return (
    <div className="article-card bg-white rounded-xl border border-surface-200 p-4 sm:p-5 hover:border-primary-200">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                CATEGORY_COLORS[article.category] || 'bg-surface-100 text-surface-600'
              }`}
            >
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
            <span className="text-[10px] font-medium text-surface-400 bg-surface-50 px-1.5 py-0.5 rounded">
              {article.source}
            </span>
            {isTranslated && (
              <span className="text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                翻訳済
              </span>
            )}
            <span className="text-[10px] text-surface-400">{timeStr}</span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <h3 className="text-sm sm:text-base font-semibold text-surface-800 leading-snug mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {displayTitle}
            </h3>

            {isTranslated && (
              <p className="text-[11px] text-surface-400 leading-snug mb-1.5 line-clamp-1 italic">
                {article.title}
              </p>
            )}

            {displaySummary && (
              <p className="text-xs sm:text-sm text-surface-500 leading-relaxed line-clamp-3">
                {displaySummary}
              </p>
            )}
          </a>
        </div>

        <div className="flex flex-col items-center gap-2 flex-shrink-0 mt-0.5">
          <button
            onClick={() => onToggleFav(article)}
            className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
            aria-label={isFav ? 'お気に入りから削除' : 'お気に入りに追加'}
            title={isFav ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            {isFav ? (
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-surface-300 hover:text-amber-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            )}
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-surface-300 hover:text-primary-500 transition-colors"
            aria-label="元記事を開く"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
