import type { Formula } from '../../types'

export const formulas: Formula[] = [
  // 分数・小数・割合
  {
    id: 'math-fraction-multiply-divide',
    lesson: 'math-fraction-percent',
    title: '分数のかけ算・わり算',
    tex: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}, \\qquad \\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}',
    note: 'かけ算は分子どうし・分母どうし。わり算は割る数をひっくり返してかける。確率のかけ算で毎回使う。',
  },
  {
    id: 'math-ratio',
    lesson: 'math-fraction-percent',
    title: '割合',
    tex: 'p = \\frac{A}{B}, \\qquad A = B \\times p',
    note: 'p が割合、A が比べる量、B がもとにする量。相対度数・確率・標本比率は、どれもこの「全体のうちどれだけか」の形。',
  },

  // 文字式と方程式
  {
    id: 'math-distributive',
    lesson: 'math-algebra',
    title: '分配法則',
    tex: 'a(b + c) = ab + ac',
    note: 'かっこをはずすときに使う。$-(x - 3) = -x + 3$ のように、マイナスも中の全部にかかる。',
  },
  {
    id: 'math-standardize-inverse',
    lesson: 'math-algebra',
    title: '標準化の式と、その逆',
    tex: 'z = \\frac{x - \\mu}{\\sigma} \\iff x = \\mu + z\\sigma',
    note: '元の値 x を z に直す式と、z から元の値に戻す式。正規分布表を使ったあと、元の単位に戻すときに使う。',
  },

  // 2乗と平方根
  {
    id: 'math-sqrt-rules',
    lesson: 'math-square-root',
    title: 'ルートの計算ルール',
    tex: '\\sqrt{a}\\sqrt{b} = \\sqrt{ab}, \\qquad \\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}, \\qquad \\sqrt{a + b} \\ne \\sqrt{a} + \\sqrt{b}',
    note: 'かけ算・わり算はルートの中でまとめられるが、たし算はまとめられない。',
  },
  {
    id: 'math-sigma-over-root-n',
    lesson: 'math-square-root',
    title: 'σ/√n（標準誤差の形）',
    tex: '\\frac{\\sigma}{\\sqrt{n}} = \\sqrt{\\frac{\\sigma^2}{n}}',
    note: 'n 個のデータの平均のぶれの大きさ。n を4倍にすると半分になる。電卓では「分散 ÷ n」を先に計算して √ を押してもよい。',
  },

  // Σ記号と添字
  {
    id: 'math-sigma-rules',
    lesson: 'math-sigma',
    title: 'Σ の性質',
    tex: '\\sum c\\,x_i = c\\sum x_i, \\qquad \\sum (x_i + y_i) = \\sum x_i + \\sum y_i, \\qquad \\sum_{i=1}^{n} c = nc',
    note: '定数倍は外に出せる、たし算は分けられる、定数を n 回足すと n 倍。平均・分散・期待値の式を変形するときに使う。',
  },
  {
    id: 'math-sum-of-squared-deviations',
    lesson: 'math-sigma',
    title: '偏差の2乗の合計',
    tex: '\\sum_{i=1}^{n} (x_i - \\bar{x})^2 = \\sum_{i=1}^{n} x_i^2 - n\\bar{x}^2',
    note: '$\\sum x_i$ と $\\sum x_i^2$ だけがわかっているときに、分散を求めるのに使う。',
  },

  // 関数・グラフ・面積
  {
    id: 'math-slope',
    lesson: 'math-function-graph-area',
    title: '直線の傾き',
    tex: 'y = a + bx, \\qquad b = \\frac{y_2 - y_1}{x_2 - x_1}',
    note: 'a が切片、b が傾き（x が1増えたときの y の増加量）。回帰直線を読むときに使う。',
  },
  {
    id: 'math-exponent-rules',
    lesson: 'math-function-graph-area',
    title: '指数のルール',
    tex: 'a^m a^n = a^{m+n}, \\qquad a^{-n} = \\frac{1}{a^n}, \\qquad a^0 = 1',
    note: '指数分布 $\\lambda e^{-\\lambda x}$ やポアソン分布の $e^{-\\lambda}$ を計算するときに使う。',
  },

  // 場合の数
  {
    id: 'math-factorial',
    lesson: 'math-counting',
    title: '階乗',
    tex: 'n! = n \\times (n-1) \\times \\cdots \\times 2 \\times 1, \\qquad 0! = 1',
    note: 'n 個のものを1列に並べる方法の数。',
  },
  {
    id: 'math-permutation',
    lesson: 'math-counting',
    title: '順列',
    tex: '{}_nP_r = \\frac{n!}{(n-r)!}',
    note: 'n 個から r 個を選んで、順番（役割）をつけて並べる方法の数。',
  },
  {
    id: 'math-combination',
    lesson: 'math-counting',
    title: '組合せ',
    tex: '{}_nC_r = \\frac{n!}{r!\\,(n-r)!} = {}_nC_{n-r}',
    note: 'n 個から r 個を選ぶ方法の数（順番は区別しない）。「n 回中 r 回成功する並び方の数」として二項分布で使う。',
  },
]
