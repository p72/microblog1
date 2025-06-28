requirements.md

1. Project Overview

シンプルなマイクロブログ（短文ブログ）を 純 HTML／CSS／JavaScript で実装し、GitHub → Vercel へ静的デプロイする。

2. Goals
	•	気軽に短文を投稿・公開できる場を用意する。
	•	ビルドなし・高速表示 を重視（PageSpeed/Lighthouse 90+）。
	•	モバイル優先設計（レスポンシブ、PWA 化も視野）。
	•	Cursor AI 上でのペアプロを想定し、後から React/Next.js へ拡張可能な構成にしておく。

3. Functional Requirements

ID	要件	優先度
FR‑1	タイムラインを最新順で表示（投稿数制限 100 件まで）	★★★
FR‑2	投稿は 日付＋本文 のみで構成。改行・リンク自動検出。	★★★
FR‑3	投稿データは posts/*.md または posts.json から自動読み込み	★★☆
FR‑4	追加した Markdown ファイルを差分デプロイで即反映	★★☆
FR‑5	RSS/Atom フィードを /feed.xml で提供	★☆☆
FR‑6	404 ページ／OGP メタを用意し SNS シェアに対応	★★☆

4. Non‑Functional Requirements

ID	要件	指標／備考
NFR‑1	表示速度	LCP < 2.5 s（4 G 回線）
NFR‑2	バンドルサイズ	50 KB 未満（CSS＋JS 合計、gzip 後）
NFR‑3	ブラウザ対応	Edge / Chrome / Safari / Firefox 各最新 2 世代
NFR‑4	アクセシビリティ	WCAG 2.1 AA 相当（コントラスト、ラベル）
NFR‑5	CI / CD	GitHub Push → Vercel Preview → main merge で Prod

5. Tech Stack
	•	Frontend: HTML5, CSS3, Vanilla JS (ES modules)
	•	Styling: CSS カスタムプロパティ＋ BEM 命名
	•	Markdown パース: marked.js（CDN 版、optional）
	•	Dev Environment: Cursor AI（VS Code ベース）
	•	Version Control: GitHub (main / preview ブランチ運用)
	•	Hosting: Vercel Static Hosting （Framework Preset: Other）

6. Folder Structure (initial)

my-microblog/
├─ index.html          # タイムライン
├─ style.css           # 共有スタイル
├─ scripts/
│  └─ main.js          # 投稿読み込み＋描画
├─ posts/
│  └─ 2025-06-28-hello.md
└─ vercel.json         # 静的ルーティング・ヘッダ設定

7. Deployment Workflow
	1.	git push origin <branch> で GitHub へプッシュ
	2.	Vercel が自動で Preview デプロイ (URL: https://‑.vercel.app)
	3.	main ブランチへマージで Production デプロイ
	4.	独自ドメインは Vercel Dashboard → Domains で設定

8. Testing / Quality Gates
	•	Lint: HTMLHint, Stylelint
	•	Unit: N/A（ロジック少ないため）。将来的に Jest/Playwright 追加
	•	E2E: Lighthouse CI (GitHub Actions) でスコア検証

9. Roadmap (Post‑MVP)

Phase	追加機能	備考
1	GitHub Issues → 投稿自動生成	gh CLI or GitHub Actions Bot
2	コメント機能 (Staticman / Hyvor)	外部サービス連携でサーバレス維持
3	PWA 対応 (Service Worker)	オフライン閲覧、ホーム画面アイコン
4	Next.js 移行	ISR でパフォーマンス最適化

10. Constraints
	•	サーバーサイド ロジックなし（フル静的）
	•	データベース禁止。ファイルベースのみ。

11. Out‑of‑Scope
	•	ユーザーアカウント／認証
	•	WYSIWYG 投稿エディタ
	•	マルチメディア投稿（画像・動画アップロード）

12. Acceptance Criteria (MVP)
	•	GitHub main ブランチに index.html があり、https://<project>.vercel.app で表示可能
	•	posts/ に Markdown を追加して push すると Production URL に 1 分以内で反映
	•	Lighthouse Performance 90 以上（モバイル）
	•	HTML & CSS Lint で重大エラー 0 件

⸻

Note: このファイルは「要件定義」の共有・レビュー用。Cursor AI 上で議論しながら随時アップデートしていく想定。