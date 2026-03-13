'use client';

import { useAuth } from '@/lib/auth-context';

type ViewTab = 'news' | 'favorites';

interface HeaderProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  favCount: number;
}

export default function Header({
  activeTab,
  onTabChange,
  favCount,
}: HeaderProps) {
  const { auth, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-surface-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-surface-800 leading-tight truncate">
              Tech News
            </h1>
            <p className="text-[10px] sm:text-xs text-surface-400 leading-tight">
              {auth.isCloud && auth.nickname ? (
                <span>{auth.nickname} さん</span>
              ) : (
                'DX / AI / Technology'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <nav className="flex bg-surface-100 rounded-xl p-1 gap-1">
            <TabButton
              active={activeTab === 'news'}
              onClick={() => onTabChange('news')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" />
              </svg>
              <span className="hidden sm:inline">ニュース</span>
            </TabButton>
            <TabButton
              active={activeTab === 'favorites'}
              onClick={() => onTabChange('favorites')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={activeTab === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={activeTab === 'favorites' ? 0 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="hidden sm:inline">お気に入り</span>
              {favCount > 0 && (
                <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-amber-400 text-white text-[10px] font-bold leading-none px-1">
                  {favCount}
                </span>
              )}
            </TabButton>
          </nav>

          {auth.isCloud && auth.userId && (
            <button
              onClick={logout}
              className="px-2 py-1.5 rounded-lg text-xs text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors"
              title="ログアウト"
            >
              ログアウト
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function TabButton({
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-white text-surface-800 shadow-sm'
          : 'text-surface-500 hover:text-surface-700'
      }`}
    >
      {children}
    </button>
  );
}
