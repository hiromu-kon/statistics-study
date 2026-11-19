# 統計学習ログ

統計検定 準2級から始め、ゆくゆくは1級まで目指すための学習記録です。

学習の中心は `site/` の **学習サイト「統計検定2級 ノート」** です。統計検定2級の出題範囲に沿って、中学数学の復習から線形モデルまでを、図・動かせるグラフ・確認問題つきでまとめています。学習ログや疑問メモ（Markdown）は、学習の記録としてこのリポジトリに残し、サイトの「学習ログ」ページからも読めます。

## 学習サイトの起動

```sh
cd site
npm install
npm run dev
```

ブラウザで表示された URL（`http://localhost:5173`）を開きます。詳しくは [site/README.md](site/README.md) を参照してください。

| ページ | 内容 |
| --- | --- |
| 教科書 | 章ごとのレッスン。読み終えたら「読み終えた」を押すと進み具合が記録される |
| 問題演習 | 章・難しさ・解いた状況で絞り込んで解く |
| 模擬試験 | 本番と同じ1問あたりの時間で、まとめて採点する |
| 復習リスト | 直近で間違えた問題が自動でたまる |
| 公式集・用語集・分布表 | 式の意味、用語の言い換え、標準正規分布表・t分布表など |
| 学習ログ | このリポジトリの `learning-log/`・`questions/`・`mistakes/` を表示する |

## 現在の前提

- 開始日: 2026-07-22
- 数学の出発点: 中学数学もあまり覚えていない状態から再スタート
- 最初の目標: 統計検定 準2級の土台を作る
- 長期目標: 統計検定 1級レベルの内容まで理解を広げる

## 学習方針

1. まずは無料教材で全体像をつかむ
2. わからないことは `questions/unresolved.md` に残す
3. 理解できた内容は `notes/` に整理する
4. 問題演習を始めたら、間違いを `mistakes/` に残す
5. 難しい表現は `glossary/easy-explanations.md` で自分の言葉に直す
6. 月ごとに `learning-log/` を見直して、次の学習計画を調整する

## ディレクトリ構成

```text
statistics-learning-log/
  README.md

  site/                     # 学習サイト（教材・問題・公式集・用語集・分布表）← 学習の中心

  roadmap/                  # 目標・学習計画・教材リスト
    goals.md
    study-plan.md
    resources.md

  learning-log/             # 日々・月ごとの学習ログ
    2026/
      2026-07.md

  notes/                    # 旧形式のHTMLノート（学習サイト以前）
    README.md               # ディレクトリの案内
    00_math-basics/         # 中学数学・高校数学の復習
    01_descriptive-statistics/
    02_probability/
    03_random-variables/
    04_distributions/
    05_estimation/
    06_hypothesis-testing/
    07_regression/
    08_multivariate-analysis/
    09_bayesian-statistics/
    10_time-series/
    11_experimental-design/
    12_machine-learning-basics/

  questions/                # 未解決・解決済みの疑問
    unresolved.md
    resolved.md

  mistakes/                 # 問題演習でのミス記録
    pre2.md
    grade2.md
    grade1.md

  exam/                     # 統計検定向けの直前確認・弱点管理
    pre2/
    grade2/
    grade1/

  exercises/                # 旧形式の自作問題HTMLページ（学習サイト以前）
    README.md               # ディレクトリの案内
    pre2/
    grade2/
    grade1/

  notebooks/                # Python/Rなどでのシミュレーション
    simulations/
    exercises/

  glossary/                 # 用語集・難しい表現の言い換え
    terms.md
    easy-explanations.md

  assets/                   # HTMLページ用の共通CSS
    learning-page.css

  templates/                # 記録用テンプレート

  references/               # 教材・書籍・Webサイト・論文など
```

## 最初の進め方

学習サイトの「試験と学習の進め方」ページの順に進めます。最初は「数学の準備」の章から始め、分数・割合・文字式・2乗とルートを思い出してから統計に入ります。

毎回の学習では、まず `learning-log/` に雑に記録します。未解決の疑問は `questions/unresolved.md` に、問題演習のミスは `mistakes/` に残します。

`notes/` と `exercises/` の HTML ページは、学習サイトを作る前に YouTube 教材をもとに書いた旧形式のノートです。

## AIとの使い方

AIに聞くときは、なるべくこのリポジトリの文脈を渡します。

```text
この unresolved.md を見て、今の疑問を初学者向けに整理してください。
```

```text
このノートを読んで、説明が曖昧なところや誤解していそうなところを指摘してください。
```

```text
このミスノートを見て、次に復習すべき単元を優先順位付きで出してください。
```

## 著作権について

問題集・過去問・動画教材の内容をそのまま転載しません。記録するのは、自分の解答、自分の間違い方、自分の理解、参照元の情報に留めます。
