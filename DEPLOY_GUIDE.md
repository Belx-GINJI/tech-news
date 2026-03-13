# 環境変数の入力ガイド

## Vercel の Environment Variables に入力する内容

Vercel の「New Project」画面の **Environment Variables** で、以下を追加してください。

### 1. 削除するもの
- `EXAMPLE_NAME` と `9JU23NF39476HH` の行は削除してOKです。

### 2. 追加する環境変数（2つ）

| Key（左の欄） | Value（右の欄） |
|---------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ukrhwipcyzgngngpjvyg.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | （下記で取得したキーを貼り付け） |

---

## SUPABASE_SERVICE_ROLE_KEY の取得方法

画像の Supabase 画面には **service_role** キーは表示されていません。

1. Supabase の「Connect to your project」画面で **「API settings」** ボタンをクリック
2. 開いたページで **「service_role」** の行を探す
3. **「Reveal」** をクリックしてキーを表示
4. 表示された長い文字列をコピー
5. Vercel の `SUPABASE_SERVICE_ROLE_KEY` の Value 欄に貼り付け

※ **anon key** や **publishable key** ではなく、必ず **service_role** を使用してください。

---

## 入力後の手順

1. 上記2つの環境変数を Vercel に追加
2. **Deploy** ボタンをクリック
3. デプロイ完了後、表示されたURL（例: https://tech-news-xxx.vercel.app）にアクセス
