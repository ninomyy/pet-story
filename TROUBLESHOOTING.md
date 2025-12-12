# トラブルシューティングガイド

## 真っ白なページが表示される場合

### 解決方法

1. **ブラウザを完全にリフレッシュ**
   - `Ctrl + Shift + R` (Windows)
   - `Cmd + Shift + R` (Mac)
   - これでCSSファイルが再読み込みされます

2. **LocalStorageをリセット** (サンプル投稿が表示されない場合)
   
   ブラウザの開発者ツールを開いて：
   - `F12`キーを押す
   - 「Console」タブを開く
   - 以下のコマンドを入力してEnterキー:
   ```javascript
   localStorage.clear()
   ```
   - ページをリロード (`F5`)

3. **シークレット/プライベートウィンドウで開く**
   - `Ctrl + Shift + N` (Chrome)
   - `Ctrl + Shift + P` (Firefox)
   - 新しいウィンドウでPetStoryを開く

## CSS修正内容

以下のCSSを`pages.css`に追加しました：

```css
/* タイムライン */
#timelinePage {
    min-height: 80vh;
    padding-bottom: var(--spacing-2xl);
}

.timeline-posts {
    min-height: 200px;
}

/* 投稿作成 */
#createPage {
    min-height: 80vh;
    padding-bottom: var(--spacing-2xl);
}

/* プロフィール */
#profilePage {
    min-height: 80vh;
    padding-bottom: var(--spacing-2xl);
}
```

これにより、ページが必ず最小高さを持ち、コンテンツが表示されるようになりました。

## 期待される表示

修正後、タイムラインページには以下が表示されるはずです：

1. **タイトル**: 「タイムライン」
2. **サンプル投稿3件**:
   - ポチ（犬）- 公園での投稿
   - ミケ（猫）- 日向ぼっこ
   - ピーちゃん（鳥）- 新しいおもちゃ

もしサンプル投稿が表示されない場合は、上記の手順2でLocalStorageをリセットしてください。
