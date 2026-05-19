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
**ステータス**: ⚠️ FAILED (Login Incorrect - Retry 2)

**作業内容**:
- ユーザーによるFTPアカウントの設定修正に伴い、デプロイおよび公開検証をリトライ。
- `devlog.md` への記録追記をトリガーとして、GitHub Actionsによる自動デプロイを開始。
- **デプロイ結果(1回目)**: `FTPError: 530 Login incorrect` により失敗。
- **デプロイ結果(2回目)**: ユーザーによるGitHub Secrets再設定完了後も、再び `FTPError: 530 Login incorrect` が発生しデプロイ失敗。
- **次のアクション**: ユーザーに「入力値の半角スペース混入等の確認」およびエックスサーバーの「国外IPアクセス制限（FTP制限）」が有効になっていないかの確認を依頼。

## [2026-05-19 16:04] Step 1-5: サーバー障害復旧後のデプロイ再試行と公開確認
**ステータス**: ✅ DONE

**作業内容**:
- ユーザーよりサーバー障害の復旧完了の連絡を受け、再デプロイを試みる。
- `devlog.md` への履歴追記をトリガーとして、GitHub Actionsによる自動デプロイを開始。
- **デプロイ結果**: ビルドおよびFTP転送が正常に完了 (`🎉 Sync complete`)。
- **動作確認結果**:
  - `https://recruit.mainichi.clinic/` へブラウザからアクセスし、正常に「毎日クリニック採用」ページがロードされることを確認。
  - 「募集職種（キャリア）」セクション内の「看護師（外来 / 訪問看護）」アコーディオンをクリックしたところ、想定通りにアコーディオンがトグル開閉され、詳細情報（仕事内容・給与等）が展開されることを確認。
  - アコーディオンが展開された状態のスクリーンショット (`nurse_job_accordion_1779174471945.png`) を撮影しエビデンスとして保存。

---

## [2026-05-19 16:30] Step 1-6: 施工写真素材の反映とクリーンなクリニックデザインへの刷新
**ステータス**: ✅ DONE

**作業内容**:
- Zドライブ（`Z:\01全員共用\90_写真\春日部クリニック様　施工写真`）から選定したWeb用軽量施工写真5枚（外観、受付、透析室、スタッフステーション、スタッフルーム）を `src/assets/images/` にコピー。
- Clinicの正式名称を写真看板等に基づき「春日部 大西毎日腎クリニック」に統一（`index.html`の修正）。
- AI/SaaS系プロダクト風の派手なグラデーションやGlassmorphism、暗いSlate-Teal配色を廃止し、クリニックにふさわしい「クリーン、明るい、清潔感、信頼感」のある配色（白と品のあるブルーベース、優しいグリーンアクセント）に `style.css` を全面的に刷新。
- 求人要項アコーディオンの応募ボタンを、押しやすく清潔感のあるグリーン（`#4caf50`）に変更。
- 院内環境の魅力を伝える「院内設備・環境 (Facilities)」セクションを新設し、透析室やスタッフルームの写真を詳細説明付きでレイアウト。
- `app.js` のスクロールアニメーション監視対象に、新設した `facility-card` を追加。

**特記事項・判断メモ**:
- Windows上のZドライブから画像を動的にコピーしてビルドすることはGitHub Actions上では不可能なため、選定画像を事前にプロジェクト内のGit管理対象（`src/assets/images/`）にコピーしてコミットすることで、デプロイ時に正常に画像が配信される設計にした。
- クリーンで品の良いデザインを実現するため、フォントは `Noto Sans JP` を最優先に設定し、背景はほぼ純白の `#ffffff` または非常に淡いブルー `#f8fafd` とした。
- 簡易サーバー（`py -m http.server 8080`）を立ち上げ、ブラウザサブエージェントによる検証で、新規追加した施設カードの滑らかなアニメーション表示、アコーディオンの開閉、および全体のクリーンな見栄えが完璧に動作することを確認した。

**動作確認結果**:
- **ローカルビルド (`py tools/build.py`)**: 正常に成功。`dist/` 配下に画像を含むアセットが複製された。
- **ブラウザQA動作確認**: 正常動作確認完了。新デザインが非常に清潔感がありクリーンなクリニック向けになっていることを確認し、アコーディオンを展開した状態のスクリーンショット（`nurse_job_accordion_verified_1779175591842.png`）を撮影。

