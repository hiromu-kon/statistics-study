# 統計検定ノート（学習サイト）

統計検定の合格を目標にした、自分専用の学習サイトです。いまは2級と準1級の教材があり、1級はコースの枠だけ用意しています。中学数学をあまり覚えていない状態からでも読めるように、図・具体例・確認問題を中心に作っています。

## 使い方

```sh
cd site
npm install
npm run dev      # http://localhost:5173 で開く
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー。ファイルを保存するとすぐ反映される |
| `npm run build` | 型チェックと本番用ビルド（`dist/`） |
| `npm run lint` | oxlint |
| `npm test` | 教材のチェック（全レッスンが描画できる、問題の数と難しさの配分、正解の位置の偏り、数式の書き間違いなど） |
| `npm run verify` | 統計関数（分布表の値）を scipy と突き合わせる（要 Python + scipy） |
| `npm run deploy` | lint・テスト・ビルドのあと、公開用のビルドに個人的なメモが入っていないかを確かめて、Cloudflare Workers にデプロイする |

学習の記録（読み終えたレッスン・問題の正誤・模擬試験）はブラウザの localStorage に保存されます。別の環境に移すときは「記録のバックアップ」ページで書き出してください。

## デプロイ（Cloudflare Workers）

ビルドした `dist/` を、Cloudflare Workers の静的アセットとして手元から公開します（設定は `wrangler.jsonc`）。

```sh
cd site
npx wrangler login   # 初回だけ。ブラウザで Cloudflare にログインする
npm run deploy
```

「学習ログ」ページ（リポジトリ直下の `learning-log/`・`questions/`・`mistakes/`・`glossary/`・`roadmap/`・`references/`）は個人的なメモなので、公開用のビルドには入れず、`npm run dev` のときだけ表示します。`npm run deploy` は、これらの Markdown の本文が `dist/` に入っていないことを `scripts/check-public-build.ts` で確かめてからデプロイします。

公開したサイトの学習の記録は、手元（`localhost`）の記録とは別になります。移すときは「記録のバックアップ」ページを使います。

## 構成

```text
src/
  content/
    courses.ts             # コース（2級・準1級・1級）の一覧と模擬試験の設定
    chapters.ts            # 章の一覧（どのコースの章か、出題範囲表の大項目との対応）
    guides/                # コースごとの「試験と学習の進め方」
    registry.ts            # 各章フォルダのファイルを自動で集める
    <章ID>/
      lessons/NN-slug.tsx  # レッスン本文（meta と default export）
      problems.tsx         # その章の問題
      glossary.ts          # その章の用語
      formulas.ts          # その章の公式
      figures/             # その章専用の図
  components/
    blocks.tsx             # Point / Example / Pitfall などの解説ボックス、表、スライダー
    Math.tsx               # M（文中の数式）、MathBlock、RichText
    charts/Plot.tsx        # SVG の図の土台（Plot, Curve, Area, Bars, Points, Segment, VLine, HLine, Label, Legend）
    charts/common.tsx      # BoxPlot, NormalArea, binData
    Quiz.tsx               # 問題カード
  lib/stats.ts             # 統計計算（正規・t・χ²・F 分布など）
  lib/progress.ts          # 学習の記録
  pages/                   # 各ページ
```

レッスン・問題・用語・公式は、章フォルダにファイルを置くだけで自動的にメニューや一覧に載ります。

## コース（級）

ホーム・メニューの章一覧・試験案内・模擬試験・問題演習・公式集・用語集は、選んでいるコースの分だけを表示します。分布表・学習ログ（手元のみ）・復習リスト・バックアップはコース共通です。

上の級の教材を作り始めるときは、次の順に足します。

1. `src/content/courses.ts` のコースを `status: 'active'` にする。試験の形式（問題数・時間・合格ライン）を公式サイトで確かめたら `mockExam` に書く。確かめるまでは `null` のままにする（模擬試験のメニューが出ない）
2. `src/content/chapters.ts` に章を足す。`course` にコース ID を入れ、章 ID はコース ID で始める（例：`pre1-multivariate`）。章フォルダは全コースで1つの階層に並ぶため
3. `src/content/<章ID>/` にレッスン・問題・用語・公式を置く（書き方は下の「教材を書くときのルール」と同じ）
4. 必要なら `src/content/guides/` に試験案内を足し、`guides/index.ts` に登録する。ないコースは「準備中」と表示される

## 教材を書くときのルール

### 読者

- 中学数学をほとんど忘れた大人。数式に苦手意識がある。
- 「何を知りたい式なのか」「どんな場面で使うのか」を必ず書く。公式の暗記に寄せない。
- 説明は **直感 → 具体例 → 式** の順。難しい用語は、出てきたその場で言い換える。

### レッスンの型

`src/content/descriptive/lessons/04-spread.tsx` が見本です。次の流れを基本にします（リポジトリの AGENTS.md の「ノートを書くときの型」と同じ）。

1. `<Point>`（一言でいうと）
2. 具体例（身近な数字で。`<Example>`、`<DataTable>`、図）
3. 定義・式（`<MathBlock caption="何を求める式か">`）
4. 直感的な理解（`<Intuition>`、動かせる図）
5. よくある勘違い（`<Pitfall>`）
6. 統計検定での出方（`<ExamTip>`）

関連用語は `glossary.ts` に書くと用語集ページに出ます。

### 図

- 1レッスンに最低1つ、できれば2つ以上の図を入れる。文字だけのレッスンにしない。
- 図は `components/charts/Plot.tsx` の部品で描く。章専用の図は `src/content/<章>/figures/` に置く。
- スライダーで動かして「変えると何が変わるか」が見える図は理解に効くので、積極的に作る（`<Slider>` と `useState`）。
- 色は `c1`〜`c5`・`muted`・`ink` だけを使う（ダークモードでも読めるように CSS 変数で定義している）。
- 図の乱数は `createRng(seed)` を使い、毎回同じ形になるようにする。

### 数式

- 文中は `<M>{'\\bar{x}'}</M>`、1行の式は `<MathBlock>{'...'}</MathBlock>`（KaTeX）。JSX の文字列なのでバックスラッシュは `\\` と2つ書く。
- 数式の中に日本語を書かない（`\text{平均}` も含む）。KaTeX のフォントで崩れるため。日本語は `caption` や本文に書く。
- JSX の行頭・行末の全角スペースは改行と一緒に消える。残したいときは `{'　'}` と書く。
- 問題文・解説・用語・公式の `note` は文字列で書き、`$...$` が数式、`**...**` が太字、`\n` が改行になる。

### 問題

- 1レッスンにつき4問以上。基本（level 1）を1問以上、標準（level 2）を2問以上、本番レベル（level 3）を1問以上。
- 問題は1問ずつばらばらに出る（模擬試験・絞り込み）ので、「前の問題と同じ…」のように他の問題に頼らない。
- 本番と同じく **5択**（どうしても作れなければ4択）。正解の位置は偏らせない。
- 解説は「どう考えるか → 計算の途中式 → 答え」。間違えやすい選択肢がなぜ違うかも書く。
- **過去問・問題集の本文を転載しない。** 数値も場面も自作する。
- 数値は必ず Python などで検算する。分布表の値は2級で一般的な値（`z₀.₀₂₅ = 1.96`、`z₀.₀₅ = 1.645` など）を使い、t・χ²・F の値は `lib/stats.ts` の値（サイトの分布表ページに出る値）と一致させる。
- ID は `<レッスンID>-NN`（例：`descriptive-spread-01`）。
- 数値を入力して答える問題は `kind: 'numeric'` にして、`answerValue`（答え）・`tolerance`（許すずれの幅。小数第2位まで答えるなら 0.005）・`unit`（「小数第2位まで」などの答え方の指示）を書く。`choices` と `answer` は書かない。準1級は本番に数値入力問題があるので、各レッスンに1問以上入れる。

### ID と並び順

- 章 ID は `chapters.ts` を参照。レッスン ID は `<章ID>-<slug>`。
- ファイル名の先頭の番号と `meta.order` を一致させる。

### 断定しないこと

- 試験の形式など、事実として書くことは公式サイトなどで確認し、出典を書く。
- 確認できないことは「〜と言われることがある」などと事実と分けて書くか、書かない。
