# AGENTS.md — recruit-site（クリニック求人専用ページ）

## プロジェクト概要

クリニックの求人情報を魅力的に伝えるための専用WEBサイトです。
`maps` プロジェクトと同様に、Git (GitHub) からの Push をトリガーとして自動ビルド＆FTPデプロイを実行する仕組みを持ちます。

- **本番URL**: `https://recruit.mainichi.clinic/`
- **リポジトリ**: 調整中（例: `ohnishi-med/recruit`）
- **デプロイ方式**: GitHub Actions + FTP Deploy

---

## 技術スタック

- **フロントエンド**: HTML5, Vanilla CSS (プレミアムなダークモード/ライトモード対応、微細アニメーション付き), Vanilla JS (ルーティングやフォーム連携など)
- **ビルドツール**: Python スクリプト (`tools/build.py`) による `src` から `dist` へのビルド・最適化
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)

---

## フォルダ構成

```text
recruit-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # FTP自動デプロイ設定
├── src/                        # ソースコード
│   ├── index.html              # メインHTML
│   ├── assets/
│   │   ├── style.css           # プレミアムデザインCSS
│   │   └── app.js              # フロントエンドロジック
│   └── data/
│       └── jobs.json           # 求人要項データ（保守性を高めるためJSON分離）
├── tools/
│   └── build.py                # 静的サイトビルドスクリプト
├── AGENTS.md                   # プロジェクト用ルール（本ファイル）
├── requirements.md             # 要件定義書
└── devlog.md                   # 開発履歴
```

---

## 重要なルール

- **機密情報の保護**: FTPのパスワードやサーバー情報は絶対に直接コードに書き込まず、GitHub Secrets を使用すること。
- **デザインの妥協を許さない**: プレミアムでモダンなデザイン（Glassmorphism, 適切なタイポグラフィ、アニメーション）を適用する。
- **マルチデバイス対応**: スマートフォン（iOS/Android）およびPCでの完全なレスポンシブ表示。

---

*最終更新: 2026-05-18*
