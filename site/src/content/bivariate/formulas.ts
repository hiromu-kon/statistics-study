import type { Formula } from '../../types'

export const formulas: Formula[] = [
  {
    id: 'bivariate-covariance',
    lesson: 'bivariate-scatter-correlation',
    title: '共分散',
    tex: 's_{xy} = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})',
    note: '2つの量が「いっしょに増えるか」の向きを知りたいときに使う。n − 1 で割る定義もあるので問題文の指定を確認する。',
  },
  {
    id: 'bivariate-correlation',
    lesson: 'bivariate-scatter-correlation',
    title: '相関係数',
    tex: 'r = \\frac{s_{xy}}{s_x s_y} = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2}\\sqrt{\\sum (y_i - \\bar{y})^2}}',
    note: '直線的な関係の強さを −1〜1 で表したいときに使う。単位を変えても値は変わらない。',
  },
  {
    id: 'bivariate-sum-of-products',
    lesson: 'bivariate-scatter-correlation',
    title: '偏差の積の合計を合計から求める',
    tex: '\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = \\sum x_i y_i - \\frac{(\\sum x_i)(\\sum y_i)}{n}',
    note: 'Σx・Σy・Σxy などの合計だけが与えられたときに、共分散や相関係数を計算するのに使う。x と y を同じにすれば偏差の2乗の合計になる。',
  },
  {
    id: 'bivariate-partial-correlation',
    lesson: 'bivariate-spurious-partial',
    title: '偏相関係数',
    tex: 'r_{xy\\cdot z} = \\frac{r_{xy} - r_{xz}\\,r_{yz}}{\\sqrt{1 - r_{xz}^2}\\,\\sqrt{1 - r_{yz}^2}}',
    note: '第3の変数 z の影響を取り除いても x と y に相関が残るか（みかけの相関ではないか）を知りたいときに使う。',
  },
  {
    id: 'bivariate-expected-count',
    lesson: 'bivariate-cross-table',
    title: '関連がないときに期待される度数',
    tex: 'E_{ij} = \\frac{R_i \\times C_j}{N}',
    note: '$R_i$ は行の合計、$C_j$ は列の合計、$N$ は総数。クロス集計表の2つの変数に関連がないとしたら、各セルが何人になるはずかを知りたいときに使う（独立性の検定の準備）。',
  },
  {
    id: 'bivariate-regression-slope',
    lesson: 'bivariate-simple-regression',
    title: '回帰直線の傾き',
    tex: 'b = \\frac{s_{xy}}{s_x^2} = r\\,\\frac{s_y}{s_x}',
    note: 'x が1増えたときに y の予測がどれだけ増えるかを求めるときに使う。',
  },
  {
    id: 'bivariate-regression-intercept',
    lesson: 'bivariate-simple-regression',
    title: '回帰直線の切片',
    tex: 'a = \\bar{y} - b\\,\\bar{x}',
    note: '回帰直線が平均の点を通ることから決まる。傾き b を求めたあとに使う。',
  },
  {
    id: 'bivariate-variation-decomposition',
    lesson: 'bivariate-r-squared-residual',
    title: '変動の分解',
    tex: '\\sum (y_i - \\bar{y})^2 = \\sum (\\hat{y}_i - \\bar{y})^2 + \\sum (y_i - \\hat{y}_i)^2',
    note: '全変動 ＝ 回帰変動 ＋ 残差変動。どれか2つから残りの1つを求めたり、分散分析表を作ったりするときに使う。',
  },
  {
    id: 'bivariate-r-squared',
    lesson: 'bivariate-r-squared-residual',
    title: '決定係数',
    tex: 'R^2 = \\frac{\\sum (\\hat{y}_i - \\bar{y})^2}{\\sum (y_i - \\bar{y})^2} = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}',
    note: '回帰直線の当てはまりのよさを 0〜1 で表したいときに使う。単回帰では相関係数の2乗 $r^2$ と等しい。',
  },
  {
    id: 'bivariate-regression-se',
    lesson: 'bivariate-r-squared-residual',
    title: '回帰の標準誤差',
    tex: 's = \\sqrt{\\frac{\\sum (y_i - \\hat{y}_i)^2}{n - 2}}',
    note: '直線による予測がだいたいどれくらいずれるかを知りたいときに使う。単回帰では n − 2 で割る。',
  },
]
