# ワードウルフ

1台のスマートフォンを順番に回して遊ぶワードウルフです。ログイン不要、お題は自由に追加・編集できます（ブラウザの localStorage に保存）。

## 遊び方

`index.html` をブラウザで開くだけで遊べます。GitHub Pages で公開すればスマホから URL で開けます。

## 開発

```bash
npm install
npm run build   # src/ を変更したら実行 → index.html が更新される
```

## フォルダ構成

```
src/
  main.jsx               エントリ
  App.jsx                画面遷移・状態管理
  styles.css             デザイン
  data/defaultTopics.js  初期お題
  lib/game.js            配役・お題選択などのゲームロジック
  lib/topics.js          お題の入力チェック・復元
  lib/storage.js         localStorage 読み書き
  lib/sound.js           トーク終了の音とバイブ
  hooks/                 保存付きstate・タイマー・誤タップ防止
  components/            ボタン・ステッパー・確認ダイアログなど
  screens/               ホーム／お題管理／設定／お題選択／お題確認／トーク／結果
```
