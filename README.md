# 統計学習ログ

統計検定 準2級から始め、ゆくゆくは1級まで目指すための学習記録です。

このリポジトリは、完成された教材ではなく、自分の理解を育てるための作業場です。YouTubeなどの無料教材から始め、基礎が固まってきたら書籍・問題集・過去問へ進みます。わからなかったこと、言葉が難しかったこと、間違えた問題、AIに確認した内容を残して、あとから復習しやすくします。

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

  roadmap/                  # 目標・学習計画・教材リスト
    goals.md
    study-plan.md
    resources.md

  learning-log/             # 日々・月ごとの学習ログ
    2026/
      2026-07.md

  notes/                    # 理解できた内容を整理するHTMLノート
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

  exercises/                # 自作問題・演習解説のHTMLページ
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

最初は `notes/00_math-basics/README.md` を入口に進めます。統計そのものに急ぎすぎず、割合・比・文字式・方程式・グラフの読み方を思い出しながら、統計の用語に少しずつ慣れます。

毎回の学習では、まず `learning-log/2026/2026-07.md` に雑に記録します。理解できた内容だけをあとで `notes/` のHTMLページに移し、未解決の疑問は `questions/unresolved.md` に残します。

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
