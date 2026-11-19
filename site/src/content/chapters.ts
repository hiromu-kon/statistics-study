import type { ChapterMeta } from '../types'

// 章立ては統計検定2級の出題範囲表（2018/12/14版）に合わせている。
// https://www.toukei-kentei.jp/hubfs/files/grade_range/grade2_hani_20181214.pdf
export const chapters: ChapterMeta[] = [
  {
    id: 'math',
    order: 0,
    title: '数学の準備',
    summary: '分数・割合・文字式・2乗とルート・Σ記号・グラフと面積。2級で使う中学〜高校の数学だけを復習します。',
    scope: '（出題範囲の前提）',
    prep: true,
  },
  {
    id: 'descriptive',
    order: 1,
    title: '1変数データの要約',
    summary: 'データの種類、ヒストグラム、平均・中央値、分散・標準偏差、箱ひげ図、標準化など。',
    scope: 'データソース／データの分布／1変数データ',
  },
  {
    id: 'bivariate',
    order: 2,
    title: '2変数データと回帰の入口',
    summary: '散布図、共分散、相関係数、クロス表、最小二乗法による回帰直線と決定係数。',
    scope: '2変数以上のデータ／データの活用（単回帰と予測）',
  },
  {
    id: 'collection',
    order: 3,
    title: '時系列とデータの集め方',
    summary: '成長率・幾何平均・移動平均などの時系列の扱いと、観察研究・実験研究・標本抽出法。',
    scope: 'データの活用（時系列）／推測のためのデータ収集法',
  },
  {
    id: 'probability',
    order: 4,
    title: '確率',
    summary: '確率の基本ルール、条件付き確率、ベイズの定理。',
    scope: '確率モデルの導入（確率）',
  },
  {
    id: 'random-variables',
    order: 5,
    title: '確率変数',
    summary: '確率変数、期待値、分散、和と差、共分散と相関。',
    scope: '確率モデルの導入（確率変数）',
  },
  {
    id: 'distributions',
    order: 6,
    title: '確率分布',
    summary: '二項分布・ポアソン分布・幾何分布などの離散分布と、一様分布・指数分布・正規分布などの連続分布。',
    scope: '確率モデルの導入（確率分布）',
  },
  {
    id: 'sampling',
    order: 7,
    title: '標本分布',
    summary: '標本平均の分布、大数の法則、中心極限定理、正規近似、t分布・カイ二乗分布・F分布。',
    scope: '推測（標本分布）',
  },
  {
    id: 'estimation',
    order: 8,
    title: '推定',
    summary: '点推定（不偏性・一致性）と、母平均・母比率・母分散などの区間推定。',
    scope: '推測（推定）',
  },
  {
    id: 'testing',
    order: 9,
    title: '仮説検定',
    summary: '検定の考え方（p値・過誤・検出力）、平均・比率・分散の検定、適合度検定と独立性の検定。',
    scope: '推測（仮説検定）',
  },
  {
    id: 'linear-models',
    order: 10,
    title: '線形モデル',
    summary: '回帰係数の検定、重回帰分析、実験計画と分散分析、統計ソフトの出力の読み方。',
    scope: '線形モデル／活用',
  },
]

export const chapterById = new Map(chapters.map((c) => [c.id, c]))
