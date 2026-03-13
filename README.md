# Tech News Aggregator

世界中のDX・AI・テクノロジーの最新ニュースを毎朝自動収集するWebアプリケーション。

## 機能

- **自動ニュース収集**: 20以上のRSSフィードから最新記事を自動取得
- **カレンダー選択**: 日付を選んでその日のニュースを閲覧
- **お気に入り**: 記事を保存し、カテゴリ別に整理
- **マルチユーザー**: 4桁ID + ニックネームでログイン、IDごとにお気に入りを保存
- **レスポンシブ対応**: PC・スマホ両対応

## クラウドデプロイ（iPhone・外出先からアクセス可能）

PCの電源がオフでも、iPhoneのモバイル通信からアクセスできます。

### 1. Supabaseのセットアップ

1. [Supabase](https://supabase.com) でアカウント作成
2. 新規プロジェクトを作成
3. **SQL Editor** で `supabase/migrations/001_initial.sql` の内容を実行
4. **Settings → API** から以下をコピー:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - service_role key（Secret）→ `SUPABASE_SERVICE_ROLE_KEY`

### 2. Vercelへのデプロイ

1. [Vercel](https://vercel.com) でアカウント作成
2. GitHubにリポジトリをプッシュ
3. Vercelで「Import Project」→ リポジトリを選択
4. **Environment Variables** に追加:
   - `NEXT_PUBLIC_SUPABASE_URL` = SupabaseのProject URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabaseのservice_role key
5. Deploy

デプロイ後、`https://あなたのプロジェクト.vercel.app` でアクセスできます。iPhoneのSafariでこのURLを開けば、外出先からも利用可能です。

### ログインの流れ

1. **4桁のIDを入力**（例: 1234）
2. **初回の場合**: ニックネームを10文字以内で設定
3. **2回目以降**: 「ニックネームは「〇〇」でお間違いないですか？」と確認 → はい/いいえ
4. 別人のIDを入力した場合は「いいえ」でやり直し

## ローカル開発

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

**ローカルではSupabaseなしで動作**します（お気に入りはlocalStorageに保存）。クラウド機能を試す場合は `.env.local` に環境変数を設定してください。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **DB**: Supabase (PostgreSQL)
- **ホスティング**: Vercel
- **スタイル**: Tailwind CSS 4
- **RSS解析**: rss-parser
