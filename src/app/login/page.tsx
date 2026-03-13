'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'id' | 'nickname' | 'confirm';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('id');
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [existingNickname, setExistingNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setCookie = (uid: string, nick: string) => {
    const val = JSON.stringify({ userId: uid, nickname: nick });
    document.cookie = `tech-news-user=${encodeURIComponent(val)}; path=/; max-age=2592000; SameSite=Lax`;
  };

  const handleSubmitId = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const id = userId.replace(/\D/g, '').slice(0, 4);
    if (id.length !== 4) {
      setError('4桁の数字を入力してください');
      return;
    }
    setUserId(id);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.exists) {
        setExistingNickname(data.nickname);
        setStep('confirm');
      } else {
        setStep('nickname');
      }
    } catch {
      setError('通信エラーです。しばらくしてからお試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const nick = nickname.trim();
    if (!nick || nick.length > 10) {
      setError('ニックネームは1〜10文字で入力してください');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, nickname: nick }),
      });
      const data = await res.json();
      if (data.error === 'id_taken') {
        setError('このIDは既に使用されています。別のIDをお試しください。');
        setStep('id');
        return;
      }
      if (!res.ok) {
        setError(data.message || '登録に失敗しました');
        return;
      }
      setCookie(userId, nick);
      router.push('/');
      router.refresh();
    } catch {
      setError('通信エラーです。しばらくしてからお試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = (ok: boolean) => {
    if (!ok) {
      setStep('id');
      setUserId('');
      setExistingNickname('');
      setError('');
      return;
    }
    setCookie(userId, existingNickname);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-surface-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-surface-800">Tech News</h1>
          <p className="text-sm text-surface-500 mt-1">4桁のIDでログイン</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 'id' && (
          <form onSubmit={handleSubmitId} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                4桁のIDを入力
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={userId}
                onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                placeholder="例: 1234"
                className="w-full px-4 py-3 rounded-xl border border-surface-200 text-center text-xl tracking-[0.3em] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || userId.replace(/\D/g, '').length !== 4}
              className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '確認中...' : '次へ'}
            </button>
          </form>
        )}

        {step === 'nickname' && (
          <form onSubmit={handleSubmitNickname} className="space-y-4">
            <p className="text-sm text-surface-600">
              ID <strong>{userId}</strong> は初めてのご利用ですね。
              <br />
              ニックネームを設定してください（10文字以内）
            </p>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                ニックネーム
              </label>
              <input
                type="text"
                maxLength={10}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例: たろう"
                className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                autoFocus
              />
              <p className="mt-1 text-xs text-surface-400">{nickname.length}/10文字</p>
            </div>
            <button
              type="submit"
              disabled={loading || !nickname.trim()}
              className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '登録中...' : '登録して始める'}
            </button>
          </form>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <p className="text-sm text-surface-600">
              ニックネームは
              <strong className="text-surface-800">「{existingNickname}」</strong>
              でお間違いないですか？
            </p>
            <p className="text-xs text-surface-400">
              別人のIDを入力した場合は「いいえ」を選んでください。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-surface-200 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
              >
                いいえ
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="flex-1 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
              >
                はい
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
