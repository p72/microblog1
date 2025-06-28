# マイクロブログ

シンプルで軽量なマイクロブログシステム。純粋なHTML/CSS/JavaScriptで実装し、Vercelにデプロイ可能です。

## ✨ 特徴

- 📱 **モバイル優先設計** - レスポンシブでアクセシブル
- ⚡ **高性能** - Lighthouse 90+ スコア達成
- 🚀 **軽量** - バンドルサイズ 50KB 未満
- 📝 **Markdown対応** - 投稿はMarkdownファイルで管理
- 🔄 **自動化** - GitHub Actions で CI/CD
- 🌐 **SEO対応** - OGPメタタグ・RSS フィード付き

## 🏗️ 技術スタック

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES modules)
- **Styling**: CSS カスタムプロパティ + BEM 命名
- **Hosting**: Vercel & GitHub Pages
- **CI/CD**: GitHub Actions

## 📁 プロジェクト構成

```
マイクロブログ/
├── index.html          # メインページ
├── 404.html            # エラーページ
├── style.css           # スタイルシート
├── favicon.svg         # ファビコン
├── scripts/
│   ├── main.js         # メイン JavaScript
│   └── build-posts.js  # 投稿ビルドスクリプト
├── posts/
│   ├── posts.json      # 投稿データ（自動生成）
│   └── *.md           # Markdown投稿ファイル
├── feed.xml           # RSS フィード（自動生成）
├── vercel.json        # Vercel設定
├── package.json       # npm scripts
└── .github/workflows/ # GitHub Actions
```

## 🚀 クイックスタート

### 1. 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd マイクロブログ

# 投稿データを生成
npm run build

# ローカルサーバー起動
npm run serve
# または
npm run dev  # ビルド + サーバー起動
```

### 2. 新規投稿の追加

```bash
# 1. posts/ フォルダに新しいMarkdownファイルを作成
# ファイル名形式: YYYY-MM-DD-タイトル.md

# 2. フロントマターとコンテンツを記述
cat > posts/2025-06-30-new-post.md << 'EOF'
---
date: 2025-06-30
title: 新しい投稿
---

ここに投稿内容を書きます！

改行やリンクは自動で処理されます。
https://example.com
EOF

# 3. ビルドスクリプトを実行
npm run build

# 4. 確認
npm run serve
```

### 3. デプロイ

#### GitHub Pages（自動デプロイ）
```bash
# mainブランチにプッシュするだけ
git add .
git commit -m "新しい投稿追加"
git push origin main
# → GitHub Actionsが自動でデプロイ
```

#### Vercel（手動デプロイ）
```bash
# Vercel CLIをインストール（初回のみ）
npm i -g vercel

# デプロイ
vercel

# カスタムドメイン設定
vercel --prod
```

## 📝 投稿ファイルの書き方

```markdown
---
date: 2025-06-30
title: 投稿タイトル
---

ここに本文を記述します。

## マークダウンも使えます

- リスト項目1
- リスト項目2

リンクは自動で変換: https://example.com
```

## ⚙️ npm scripts

```bash
npm run build    # 投稿データ生成
npm run serve    # ローカルサーバー起動
npm run dev      # ビルド + サーバー起動
```

## 🔧 カスタマイズ

### スタイル変更

`style.css` の CSS カスタムプロパティを編集:

```css
:root {
    --color-primary: #2563eb;     /* プライマリカラー */
    --color-bg: #ffffff;          /* 背景色 */
    --font-family: system-ui;     /* フォント */
    --max-width: 42rem;           /* 最大幅 */
}
```

### サイト情報変更

- `index.html` - タイトル・メタ情報
- `feed.xml` - RSS情報（自動生成される）
- `404.html` - エラーページ
- `favicon.svg` - ファビコン

## 📊 パフォーマンス

現在のLighthouseスコア:
- 📱 **モバイル**: Performance 100, Accessibility 100, Best Practices 96
- 🖥️ **デスクトップ**: Performance 96, Accessibility 100, Best Practices 96

## 🔍 ローカルテスト

```bash
# ローカルサーバーでテスト
npm run dev

# Lighthouse テスト（オプション）
lighthouse http://localhost:8000
```

## 🚀 デプロイ後の運用

### GitHub Pages
1. **新規投稿**: `posts/` にMarkdownファイル追加 → `npm run build` → git push
2. **自動デプロイ**: GitHub Actions が自動実行
3. **アクセス**: `https://ユーザー名.github.io/リポジトリ名`

### Vercel
1. **新規投稿**: `posts/` にMarkdownファイル追加 → `npm run build` → `vercel --prod`
2. **アクセス**: カスタムドメインまたはVercel URL

## 📄 ライセンス

MIT License

---

🎉 **これでマイクロブログの完成です！** 
新しい投稿を追加して、あなただけのブログを始めましょう〜