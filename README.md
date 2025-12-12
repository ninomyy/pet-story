# PetStory

ペットが主役のSNSプラットフォーム 🐾

## 概要

PetStoryは、ペットが主人公となって自分の視点で日常を共有できる革新的なSNSです。
飼い主がペットになりきって投稿できる楽しい体験を提供します。

## 主な機能

- 🎭 **ペット目線の投稿** - ペットが話しているような文章を自動生成
- 📸 **写真共有** - 大切な瞬間を美しく保存・共有
- 🏆 **バッジシステム** - 投稿や活動で特別なバッジを獲得
- 💕 **いいね・コメント** - 他のペットと交流
- 📊 **プロフィール** - ペットの成長記録を一覧表示

## GitHub Pagesでの公開

このプロジェクトはGitHub Pagesで公開できます。

### デプロイ手順

1. GitHubでリポジトリを作成
2. プロジェクトファイルをプッシュ
```bash
git init
git add .
git commit -m "Initial commit: PetStory SNS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pet-story.git
git push -u origin main
```

3. GitHubリポジトリの設定でGitHub Pagesを有効化
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

4. 数分後、`https://YOUR_USERNAME.github.io/pet-story/` でアクセス可能になります

## ローカルでの実行

このプロジェクトは静的HTMLサイトなので、シンプルなHTTPサーバーで実行できます。

### Python 3を使用する場合
```bash
cd pet-story
python -m http.server 8000
```

### その他のHTTPサーバー
- VS Code Live Server拡張機能
- `npx serve .`（Node.jsインストール済みの場合）

ブラウザで `http://localhost:8000` を開いてください。

## 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **ストレージ**: LocalStorage（クライアントサイド）
- **画像**: Unsplash（サンプル画像）
- **デザイン**: カスタムCSSデザインシステム

## プロジェクト構造

```
pet-story/
├── index.html          # メインHTMLファイル
├── css/
│   ├── styles.css      # デザインシステム
│   └── pages.css       # ページ固有のスタイル
├── js/
│   ├── app.js          # メインアプリケーションロジック
│   └── data.js         # データ管理
├── images/             # 画像アセット
└── data/               # データファイル
```

## ブラウザサポート

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します！

---

Made with ❤️ for pet lovers
