# 開発ログ (devlog.md) — クリニック求人専用ページ

## [2026-05-18 17:15] Step 1-1: プロジェクト新規立ち上げと初期要件定義の作成
**ステータス**: ✅ DONE

**作業内容**:
- `projects/clinic/recruit-site` ディレクトリの作成
- プロジェクト独自の開発標準を定義する [AGENTS.md](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/AGENTS.md) の作成
- `maps` プロジェクトの自動デプロイ (GitHub Actions + FTP Deploy) を踏襲した設計の [requirements.md](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/requirements.md) を作成
- 開発者・ユーザー間での認識合わせのための「質問・確認事項」の整理

**動作確認結果**:
- 初期構成案の設計完了。

---

## [2026-05-18 17:22] Step 1-2: ユーザー要望の反映とドメイン修正
**ステータス**: ✅ DONE

**作業内容**:
- `AGENTS.md` および `requirements.md` のドメイン表記を正しい `mainichi.clinic` に修正。
- 応募方法の要件（Googleフォーム入力により自動でメール連絡が届く構成）の決定事項を追記。
- FTP接続先、GoogleフォームURL、募集内容に関する新規質問を整理。

**動作確認結果**:
- 要件定義書・設定のアップデート完了。

---

## [2026-05-18 17:30] Step 1-3: 求人サイト（HTML/CSS/JS/JSON）の実装と動作検証
**ステータス**: ✅ DONE

**作業内容**:
- プレミアムなUI/UX、モバイルレスポンシブに対応した [style.css](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/src/assets/style.css) の実装。
- `jobs.json` からデータを非同期フェッチして動的に求人要項アコーディオンを生成する [app.js](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/src/assets/app.js) の実装。
- 医師、看護師、医療事務の求人データ [jobs.json](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/src/data/jobs.json) の作成。
- SEO対策、院長メッセージ、数字で見るクリニック等を盛り込んだメイン [index.html](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/src/index.html) の実装。
- ビルド用スクリプト [build.py](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/tools/build.py) および自動デプロイ用 [deploy.yml](file:///c:/Users/coino/AntigravityWorkspace/projects/clinic/recruit-site/.github/workflows/deploy.yml) の実装。

**特記事項・判断メモ**:
- ユーザー要望である「Googleフォーム入力時にメールで自動通知が来る」仕様を実現するため、フォームURLに職種パラメータ（`?entry.2005620554=看護師`など）を自動付与してプリフィル送信できる高度なURL生成ロジックをJSに実装。
- ローカル環境で簡易サーバーを立ち上げ、ブラウザサブエージェントによる検証を実施。アコーディオンのスムーズな開閉、フェードインアニメーション、Googleフォーム遷移ロジックが正常に作動することを確認。

**動作確認結果**:
- **ローカルビルド (`py tools/build.py`)**: 正常に成功。`dist/` ディレクトリ配下に完全な静的ファイルが生成されることを確認。
- **ブラウザQA動作確認**: 正常動作確認完了。UIデザインも期待通りのプレミアム品質であることを確認。

---

## [2026-05-19 13:20] Step 1-4: FTP設定修正後のデプロイ再試行と動作検証
**ステータス**: ⏳ RUNNING (Secrets更新後の再試行)

**作業内容**:
- ユーザーによるFTPアカウントの設定修正に伴い、デプロイおよび公開検証をリトライ。
- `devlog.md` への記録追記をトリガーとして、GitHub Actionsによる自動デプロイを開始。
- **デプロイ結果(1回目)**: `FTPError: 530 Login incorrect` により失敗。
- **デプロイ結果(2回目)**: ユーザーによるGitHub Secrets再設定完了を受け、デプロイを再実行。

---
