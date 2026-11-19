import type { Formula } from '../../types'

export const formulas: Formula[] = [
  // 微分の考え方
  {
    id: 'pre1-math-derivative-power',
    lesson: 'pre1-math-derivative',
    title: 'x の n 乗・定数倍・和の微分',
    tex: "(x^n)' = n x^{n-1}, \\quad (c\\,f)' = c\\,f', \\quad (f + g)' = f' + g'",
    note: '指数を前に下ろして 1 減らす。定数だけの項は微分すると 0。n は負の数や分数でもよい（$\\frac{1}{x} = x^{-1}$、$\\sqrt{x} = x^{1/2}$）。',
  },
  {
    id: 'pre1-math-derivative-product-chain',
    lesson: 'pre1-math-derivative',
    title: '積の微分と合成関数の微分',
    tex: "(fg)' = f'g + fg', \\qquad \\frac{dy}{dx} = \\frac{dy}{du}\\,\\frac{du}{dx}",
    note: '尤度 $p^k(1 - p)^{n-k}$ のような積や「かっこの何乗」を微分するときに使う。$(1 - p)^k$ の微分では内側の −1 がかかる。',
  },
  {
    id: 'pre1-math-derivative-extremum',
    lesson: 'pre1-math-derivative',
    title: '極値の条件',
    tex: "f'(a) = 0, \\quad f''(a) < 0 \\ \\Rightarrow\\ \\text{local max}",
    note: '傾きが 0 で、2回微分が負なら山の頂上（極大）、正なら谷の底（極小）。最尤法・最小二乗法は「微分して 0 とおく」計算。',
  },
  // 積分の考え方
  {
    id: 'pre1-math-integral-power-exp',
    lesson: 'pre1-math-integral',
    title: 'x の n 乗と指数関数の積分',
    tex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C, \\qquad \\int e^{-\\lambda x}\\,dx = -\\frac{1}{\\lambda}e^{-\\lambda x} + C',
    note: '指数を 1 増やして、その数で割る（n ≠ −1）。答えは微分して元に戻るかで確かめられる。',
  },
  {
    id: 'pre1-math-integral-definite',
    lesson: 'pre1-math-integral',
    title: '定積分と確率',
    tex: "\\int_a^b f(x)\\,dx = F(b) - F(a), \\qquad P(a \\le X \\le b) = \\int_a^b f(x)\\,dx",
    note: 'F は f の原始関数（$F\' = f$）。確率密度の下の面積が確率で、全体の積分は 1。',
  },
  {
    id: 'pre1-math-integral-expectation',
    lesson: 'pre1-math-integral',
    title: '連続分布の期待値と分散',
    tex: 'E[X] = \\int x\\,f(x)\\,dx, \\qquad V[X] = \\int x^2 f(x)\\,dx - (E[X])^2',
    note: '離散の $\\sum x\\,p(x)$ の $p(x)$ を $f(x)\\,dx$ に置きかえたもの。',
  },
  {
    id: 'pre1-math-integral-parts',
    lesson: 'pre1-math-integral',
    title: '部分積分',
    tex: "\\int_a^b f\\,g'\\,dx = \\Big[\\,f g\\,\\Big]_a^b - \\int_a^b f'\\,g\\,dx",
    note: '$x \\times$（指数関数）のような積の積分で、x を微分する側にする。指数分布の期待値 $\\frac{1}{\\lambda}$ が求まる。',
  },
  {
    id: 'pre1-math-integral-gamma',
    lesson: 'pre1-math-integral',
    title: 'よく使う積分（ガンマ関数）',
    tex: '\\int_0^{\\infty} x^n e^{-x}\\,dx = n!, \\qquad \\Gamma(\\alpha) = \\int_0^{\\infty} x^{\\alpha - 1} e^{-x}\\,dx',
    note: 'n は 0 以上の整数（0! = 1）。右のガンマ関数は α > 0 の一般の数に広げたもので、$\\Gamma(n + 1) = n!$、$\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$。ガンマ分布・ベータ分布の式に出てくる。',
  },
  // 指数・対数と微分
  {
    id: 'pre1-math-exp-log-rules',
    lesson: 'pre1-math-exp-log',
    title: '指数法則と対数の性質',
    tex: 'a^m a^n = a^{m+n}, \\quad \\log(ab) = \\log a + \\log b, \\quad \\log a^n = n\\log a',
    note: 'log は「かけ算をたし算に、何乗を何倍に」変える。尤度（積）を対数尤度（和）にするときに使う。',
  },
  {
    id: 'pre1-math-exp-log-derivative',
    lesson: 'pre1-math-exp-log',
    title: '指数関数・対数関数の微分',
    tex: "(e^{ax})' = a\\,e^{ax}, \\qquad (\\log x)' = \\frac{1}{x}, \\qquad \\{\\log g(x)\\}' = \\frac{g'(x)}{g(x)}",
    note: '対数尤度を微分するときに使う。$\\log(1 - p)$ の微分は $-\\frac{1}{1 - p}$。',
  },
  {
    id: 'pre1-math-exp-log-linear-approx',
    lesson: 'pre1-math-exp-log',
    title: '1次近似（デルタ法の準備）',
    tex: "f(x) \\approx f(a) + f'(a)(x - a), \\qquad V[g(\\bar{X})] \\approx \\{g'(\\mu)\\}^2\\,V[\\bar{X}]",
    note: 'a の近くで曲線を接線で置きかえる。右の式は、それと $V[aX + b] = a^2V[X]$ を組み合わせたデルタ法の形。',
  },
  // 偏微分と重積分
  {
    id: 'pre1-math-multivariable-normal-mle',
    lesson: 'pre1-math-multivariable',
    title: '正規分布の最尤推定量',
    tex: '\\hat{\\mu} = \\bar{x}, \\qquad \\hat{\\sigma}^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2',
    note: '対数尤度を μ と σ² でそれぞれ偏微分して 0 とおいた連立方程式の解。σ² は n で割る（不偏分散とは違う）。',
  },
  {
    id: 'pre1-math-multivariable-double-integral',
    lesson: 'pre1-math-multivariable',
    title: '重積分と周辺密度',
    tex: 'P(a \\le X \\le b,\\ c \\le Y \\le d) = \\int_a^b \\int_c^d f(x, y)\\,dy\\,dx, \\qquad f_X(x) = \\int f(x, y)\\,dy',
    note: '内側（y）から積分する。内側の積分では x を定数として扱う。周辺密度は、もう一方の変数で全部積分して消したもの。',
  },
  {
    id: 'pre1-math-multivariable-jacobian',
    lesson: 'pre1-math-multivariable',
    title: '変数変換（ヤコビアン）',
    tex: 'f_Y(y) = f_X(x)\\left|\\frac{dx}{dy}\\right|, \\qquad f_{U,V}(u, v) = f_{X,Y}(x, y)\\,|J|',
    note: 'x を y で表してから微分する。2変数では、x, y を u, v で偏微分して並べた行列の行列式 J（ヤコビアン）の絶対値をかける。',
  },
  // ベクトルと行列
  {
    id: 'pre1-math-matrix-product',
    lesson: 'pre1-math-matrix',
    title: '内積と行列の積',
    tex: "\\boldsymbol{a}'\\boldsymbol{b} = \\sum_i a_i b_i, \\qquad (AB)_{ij} = \\sum_k a_{ik} b_{kj}",
    note: 'AB の (i, j) 成分は A の i 行目と B の j 列目の内積。(m × n)(n × p) = m × p。AB と BA は一般に違う。',
  },
  {
    id: 'pre1-math-matrix-inverse',
    lesson: 'pre1-math-matrix',
    title: '2 × 2 の行列式と逆行列',
    tex: '\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc, \\qquad \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}',
    note: '対角を入れかえ、残りの符号を変えて、行列式で割る。行列式が 0 なら逆行列はない。',
  },
  {
    id: 'pre1-math-matrix-normal-equation',
    lesson: 'pre1-math-matrix',
    title: '正規方程式と最小二乗推定量',
    tex: "X'X\\boldsymbol{\\beta} = X'\\boldsymbol{y}, \\qquad \\hat{\\boldsymbol{\\beta}} = (X'X)^{-1}X'\\boldsymbol{y}",
    note: 'X は1列目が全部 1 の計画行列。単回帰なら $X\'X = \\begin{pmatrix} n & \\sum x \\\\ \\sum x & \\sum x^2 \\end{pmatrix}$、$X\'\\boldsymbol{y} = (\\sum y, \\sum xy)\'$。',
  },
  {
    id: 'pre1-math-matrix-covariance',
    lesson: 'pre1-math-matrix',
    title: '分散共分散行列と線形結合の分散',
    tex: "V[aX + bY] = \\begin{pmatrix} a & b \\end{pmatrix}\\Sigma\\begin{pmatrix} a \\\\ b \\end{pmatrix} = a^2V[X] + 2ab\\,\\mathrm{Cov}(X, Y) + b^2V[Y]",
    note: 'Σ は対角に分散、それ以外に共分散を並べた対称行列。2級の「和の分散」の公式を行列で書いたもの。',
  },
  // 固有値と固有ベクトル
  {
    id: 'pre1-math-eigen-equation',
    lesson: 'pre1-math-eigen',
    title: '固有方程式（2 × 2）',
    tex: '\\det(A - \\lambda I) = 0 \\ \\Longleftrightarrow\\ \\lambda^2 - (a + d)\\lambda + (ad - bc) = 0',
    note: '解いた λ が固有値。固有値の和 = 対角の和、積 = 行列式。固有ベクトルは $(A - \\lambda I)\\boldsymbol{v} = \\boldsymbol{0}$ を解いて求める（比だけが決まる）。',
  },
  {
    id: 'pre1-math-eigen-pca',
    lesson: 'pre1-math-eigen',
    title: '分散共分散行列の固有値と主成分',
    tex: "\\max_{|\\boldsymbol{u}| = 1} \\boldsymbol{u}'\\Sigma\\boldsymbol{u} = \\lambda_1, \\qquad \\frac{\\lambda_1}{\\lambda_1 + \\lambda_2}",
    note: '向き u に落とした分散は最大固有値の固有ベクトルの向きで最大（第1主成分）。右は第1主成分の寄与率。対称行列なので固有ベクトルは直交する。',
  },
]
