# プロジェクト概要
飲食店「SHWE THA ZIN」のWebサービス。
メニュー、予約、注文、お店用管理画面を作る。
# 使う技術
- Next.js 16（App Router、src/フォルダ）
- TypeScript
- Tailwind CSS v4
- shadcn/ui（UI部品）
- Supabase（DB、認証、RLS、Realtime）
- パッケージ管理: npm
# 作る機能
## お客さん用
- About Us（お店の紹介）
- メニューの閲覧
- 予約
- 注文
## お店用（管理画面 /admin）
- ログイン（Supabase Auth）
- メニュー編集
- 予約・注文の確認
- 新しい注文の通知（Realtime）
# 進める順番
1. DB設計
2. ログイン
3. メニュー表示
4. 予約
5. 管理画面
6. 注文と通知
# ルール
- すべてのテーブルでRLSを有効にする
- キーやパスワードをコードに書かない（.env.localを使う）
- .env.localはGitに入れない
- 型はTypeScriptでちゃんと書く（anyを使わない）
- 1つの機能ができたら、コミットする
- 大きな変更の前に、何をするか先に説明する
- 説明は、やさしい日本語で
- UI はすべて DESIGN.md にしたがう
