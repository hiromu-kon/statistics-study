import type { Problem } from '../../types'

export const problems: Problem[] = [
  // ---------- 微分の考え方 ----------
  {
    id: 'pre1-math-derivative-01',
    lesson: 'pre1-math-derivative',
    level: 1,
    question: '$f(x) = x^4$ を微分した導関数 $f\'(x)$ として正しいものはどれか。',
    choices: ['$x^3$', '$4x^4$', '$4x^3$', '$\\frac{x^5}{5}$', '$3x^4$'],
    answer: 2,
    explanation:
      '$(x^n)\' = n x^{n-1}$ を使います。指数の 4 を前に下ろし、指数を 1 減らして $4x^3$。\n$4x^4$ は指数を減らし忘れた答え、$\\frac{x^5}{5}$ は積分（微分の逆）をしてしまった答えです。',
  },
  {
    id: 'pre1-math-derivative-02',
    lesson: 'pre1-math-derivative',
    level: 2,
    kind: 'numeric',
    question: '$f(x) = 2x^3 - 5x^2 + 3x - 7$ のとき、$x = 2$ での接線の傾き $f\'(2)$ を求めよ。',
    answerValue: 7,
    tolerance: 0.01,
    unit: '整数で',
    explanation:
      '接線の傾きは導関数に代入した値です。1 項ずつ微分して足します。\n$(2x^3)\' = 6x^2$、$(-5x^2)\' = -10x$、$(3x)\' = 3$、$(-7)\' = 0$ なので $f\'(x) = 6x^2 - 10x + 3$。\n$f\'(2) = 6 \\times 4 - 10 \\times 2 + 3 = 24 - 20 + 3 = 7$。\n定数 −7 を微分して 0 にせず残してしまう間違い（答えが 0 になる）や、$f(2)$（関数の値 = −5）を答えてしまう間違いに注意。',
  },
  {
    id: 'pre1-math-derivative-03',
    lesson: 'pre1-math-derivative',
    level: 2,
    question: '$f(x) = (3x - 1)^4$ を微分した導関数として正しいものはどれか。',
    choices: ['$4(3x - 1)^3$', '$12(3x - 1)^4$', '$(3x - 1)^3$', '$12x(3x - 1)^3$', '$12(3x - 1)^3$'],
    answer: 4,
    explanation:
      '合成関数の微分（チェーンルール）です。$u = 3x - 1$ とおくと $f = u^4$。\n外側を微分：$\\frac{d}{du}u^4 = 4u^3$。内側を微分：$\\frac{du}{dx} = 3$。\nかけて $4u^3 \\times 3 = 12(3x - 1)^3$。\n$4(3x - 1)^3$ は内側の微分 3 をかけ忘れた答え、$12(3x - 1)^4$ は指数を減らし忘れた答えです。',
  },
  {
    id: 'pre1-math-derivative-04',
    lesson: 'pre1-math-derivative',
    level: 2,
    question: '関数 $f(x) = x^3 - 6x^2 + 9x + 1$ の極大値はどれか。',
    choices: ['$5$', '$1$', '$3$', '$9$', '$-3$'],
    answer: 0,
    explanation:
      '微分して 0 とおき、極値の候補を探します。\n$f\'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x - 1)(x - 3)$ なので、$x = 1, 3$ で傾きが 0。\n$x < 1$ では $f\' > 0$（増加）、$1 < x < 3$ では $f\' < 0$（減少）、$x > 3$ では $f\' > 0$（増加）。上りから下りに変わる $x = 1$ が極大。\n極大値は $f(1) = 1 - 6 + 9 + 1 = 5$。\n1 は極小値 $f(3) = 27 - 54 + 27 + 1 = 1$、3 は極小になる x の位置です。',
  },
  {
    id: 'pre1-math-derivative-05',
    lesson: 'pre1-math-derivative',
    level: 3,
    kind: 'numeric',
    question:
      'あるくじを 5 回引いたところ、当たり・当たり・はずれ・当たり・はずれ だった。当たりの確率を p とすると、この結果が出る確率は $L(p) = p^3 (1 - p)^2$ である。$0 < p < 1$ の範囲で $L(p)$ を最大にする p を求めよ。',
    answerValue: 0.6,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '最大になる点では接線の傾きが 0 なので、微分して 0 とおきます。\n積の微分とチェーンルールを使うと\n$L\'(p) = 3p^2 (1 - p)^2 + p^3 \\times 2(1 - p) \\times (-1) = p^2 (1 - p)\\{3(1 - p) - 2p\\} = p^2 (1 - p)(3 - 5p)$。\n$0 < p < 1$ では $p^2 (1 - p) > 0$ なので、$3 - 5p = 0$ より $p = 0.6$。p が 0.6 より小さいと $L\' > 0$、大きいと $L\' < 0$ なので、ここが最大です。\n5 回中 3 回当たったので $\\frac{3}{5}$、という直感とも一致します（対数をとって $\\frac{3}{p} - \\frac{2}{1 - p} = 0$ を解いても同じ）。\n$(1 - p)^2$ の微分で内側の −1 を忘れると、0 になる p が見つからなくなります。',
  },
  {
    id: 'pre1-math-derivative-06',
    lesson: 'pre1-math-derivative',
    level: 1,
    question: "関数 $f(x)$ が $x = a$ で $f'(a) = 0$ を満たす。このことの意味として正しいものはどれか。",
    choices: [
      'x = a でグラフが横軸（x 軸）と交わる',
      'x = a で f の値が最大になることが必ず保証される',
      'x = a の前後で、f の値がずっと一定である',
      'x = a での接線の傾きが 0（接線が水平）である',
      'x = a でグラフが原点を通る',
    ],
    answer: 3,
    explanation:
      "$f'(a)$ は x = a での接線の傾きなので、$f'(a) = 0$ は「接線が水平」という意味です。\n山の頂上（極大）や谷の底（極小）ではこうなりますが、谷の底のこともあるので「最大が保証される」は誤り。最大かどうかは増減表や2回微分で確かめます。\n横軸と交わるのは $f(a) = 0$ のときで、$f'(a) = 0$ とは別のことです。",
  },

  // ---------- 積分の考え方 ----------
  {
    id: 'pre1-math-integral-01',
    lesson: 'pre1-math-integral',
    level: 1,
    question: '不定積分 $\\int x^3\\,dx$ として正しいものはどれか（C は積分定数）。',
    choices: ['$3x^2 + C$', '$\\frac{x^4}{4} + C$', '$x^4 + C$', '$\\frac{x^3}{3} + C$', '$4x^4 + C$'],
    answer: 1,
    explanation:
      '$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$ を使います。指数を 1 増やして 4、その 4 で割って $\\frac{x^4}{4} + C$。\n確かめ：$\\left(\\frac{x^4}{4}\\right)\' = \\frac{4x^3}{4} = x^3$。\n$3x^2$ は微分してしまった答え、$x^4$ は 4 で割り忘れた答えです。',
  },
  {
    id: 'pre1-math-integral-02',
    lesson: 'pre1-math-integral',
    level: 2,
    kind: 'numeric',
    question: '確率変数 X の確率密度関数が $f(x) = \\frac{3}{8}x^2$（$0 \\le x \\le 2$、それ以外では 0）のとき、$P(1 \\le X \\le 2)$ を求めよ。',
    answerValue: 0.875,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '確率は密度の下の面積なので、1 から 2 まで積分します。\n$\\frac{3}{8}x^2$ の原始関数は $\\frac{3}{8} \\times \\frac{x^3}{3} = \\frac{x^3}{8}$。\n$P(1 \\le X \\le 2) = \\Big[\\frac{x^3}{8}\\Big]_1^2 = \\frac{8}{8} - \\frac{1}{8} = \\frac{7}{8} = 0.875$。\n密度の値 $f(2) - f(1)$ のように「高さの差」を計算するのは誤りです。',
  },
  {
    id: 'pre1-math-integral-03',
    lesson: 'pre1-math-integral',
    level: 2,
    question: '$f(x) = c\\,x^2$（$0 \\le x \\le 3$、それ以外では 0）が確率密度関数になるような定数 c はどれか。',
    choices: ['$3$', '$\\frac{1}{3}$', '$9$', '$\\frac{1}{9}$', '$\\frac{1}{27}$'],
    answer: 3,
    explanation:
      '全体の面積（積分）が 1 になるように c を決めます。\n$\\int_0^3 x^2\\,dx = \\Big[\\frac{x^3}{3}\\Big]_0^3 = \\frac{27}{3} = 9$ なので、$9c = 1$ より $c = \\frac{1}{9}$。\n$\\frac{1}{27}$ は $x^2$ の原始関数を $x^3$ として 3 で割り忘れた答えです。',
  },
  {
    id: 'pre1-math-integral-04',
    lesson: 'pre1-math-integral',
    level: 2,
    question: '確率変数 X の確率密度関数が $f(x) = 2x$（$0 \\le x \\le 1$、それ以外では 0）のとき、期待値 $E[X]$ はどれか。',
    choices: ['$\\frac{2}{3}$', '$\\frac{1}{2}$', '$1$', '$\\frac{1}{3}$', '$\\frac{3}{4}$'],
    answer: 0,
    explanation:
      '期待値は $E[X] = \\int x\\,f(x)\\,dx$ です（離散の $\\sum x\\,p(x)$ の積分版）。\n$E[X] = \\int_0^1 x \\times 2x\\,dx = \\int_0^1 2x^2\\,dx = \\Big[\\frac{2x^3}{3}\\Big]_0^1 = \\frac{2}{3}$。\n$\\frac{1}{2}$ は範囲 0〜1 の真ん中で、密度が右上がりなのを無視した答え。$1$ は $\\int_0^1 2x\\,dx$（全体の面積）を計算してしまった答えです。',
  },
  {
    id: 'pre1-math-integral-05',
    lesson: 'pre1-math-integral',
    level: 3,
    kind: 'numeric',
    question: '確率変数 X の確率密度関数が $f(x) = 2x$（$0 \\le x \\le 1$、それ以外では 0）のとき、分散 $V[X]$ を求めよ。',
    answerValue: 1 / 18,
    tolerance: 0.0006,
    unit: '小数第3位まで（第4位を四捨五入）',
    explanation:
      '$V[X] = E[X^2] - (E[X])^2$ で計算します。\n$E[X] = \\int_0^1 2x^2\\,dx = \\frac{2}{3}$。\n$E[X^2] = \\int_0^1 x^2 \\times 2x\\,dx = \\int_0^1 2x^3\\,dx = \\Big[\\frac{x^4}{2}\\Big]_0^1 = \\frac{1}{2}$。\n$V[X] = \\frac{1}{2} - \\frac{4}{9} = \\frac{9 - 8}{18} = \\frac{1}{18} \\approx 0.056$。\n$E[X^2]$ の代わりに $(E[X])^2$ を2回使ったり、$E[X^2] = \\frac{1}{2}$ をそのまま答えたりしないように。',
  },
  {
    id: 'pre1-math-integral-06',
    lesson: 'pre1-math-integral',
    level: 3,
    question: '確率変数 X の確率密度関数が $f(x) = \\frac{3}{4}(1 - x^2)$（$-1 \\le x \\le 1$、それ以外では 0）のとき、分散 $V[X]$ はどれか。',
    choices: ['$\\frac{1}{10}$', '$\\frac{1}{3}$', '$\\frac{1}{5}$', '$\\frac{4}{15}$', '$\\frac{3}{5}$'],
    answer: 2,
    explanation:
      '密度は 0 を中心に左右対称なので $E[X] = 0$。よって $V[X] = E[X^2]$。\n$E[X^2] = \\int_{-1}^{1} x^2 \\times \\frac{3}{4}(1 - x^2)\\,dx = \\frac{3}{4}\\int_{-1}^{1} (x^2 - x^4)\\,dx = \\frac{3}{4}\\Big[\\frac{x^3}{3} - \\frac{x^5}{5}\\Big]_{-1}^{1}$。\n$\\Big[\\ \\Big]_{-1}^{1} = \\left(\\frac{1}{3} - \\frac{1}{5}\\right) - \\left(-\\frac{1}{3} + \\frac{1}{5}\\right) = \\frac{4}{15}$ なので、$V[X] = \\frac{3}{4} \\times \\frac{4}{15} = \\frac{1}{5}$。\n$\\frac{4}{15}$ は $\\frac{3}{4}$ をかけ忘れた答え、$\\frac{1}{10}$ は 0〜1 だけ積分した答え、$\\frac{1}{3}$ は −1〜1 の一様分布の分散です。',
  },
  {
    id: 'pre1-math-integral-07',
    lesson: 'pre1-math-integral',
    level: 2,
    question:
      '確率変数 X の確率密度関数が $f(x) = 2e^{-2x}$（$x \\ge 0$、それ以外では 0）のとき、$P(1 \\le X \\le 2)$ に最も近いものはどれか。必要なら $e^{-2} = 0.1353$、$e^{-4} = 0.0183$ を使ってよい。',
    choices: ['$0.1353$', '$0.0183$', '$0.8647$', '$0.1536$', '$0.1170$'],
    answer: 4,
    explanation:
      '$2e^{-2x}$ の原始関数は $-e^{-2x}$（微分すると $-e^{-2x} \\times (-2) = 2e^{-2x}$）。\n$P(1 \\le X \\le 2) = \\Big[-e^{-2x}\\Big]_1^2 = -e^{-4} + e^{-2} = 0.1353 - 0.0183 = 0.1170$。\n0.1353 は $P(X \\ge 1)$、0.8647 は $P(X \\le 1) = 1 - e^{-2}$、0.1536 は引くところを足してしまった答えです。',
  },

  // ---------- 指数・対数と微分 ----------
  {
    id: 'pre1-math-exp-log-01',
    lesson: 'pre1-math-exp-log',
    level: 1,
    question: '正の数 a, b について、$\\log(ab)$ と等しいものはどれか（log は自然対数）。',
    choices: ['$\\log a \\times \\log b$', '$\\log(a + b)$', '$\\frac{\\log a}{\\log b}$', '$\\log a - \\log b$', '$\\log a + \\log b$'],
    answer: 4,
    explanation:
      '対数は「かけ算をたし算に変える」ので $\\log(ab) = \\log a + \\log b$。\n理由：$a = e^s$、$b = e^t$ とすると $ab = e^{s+t}$ なので、$\\log(ab) = s + t$。\n$\\log a - \\log b$ は $\\log\\frac{a}{b}$ です。$\\log(a + b)$ は一般にこれ以上簡単になりません。',
  },
  {
    id: 'pre1-math-exp-log-02',
    lesson: 'pre1-math-exp-log',
    level: 2,
    kind: 'numeric',
    question: '$\\log 2 = 0.6931$、$\\log 3 = 1.0986$ を使って、$\\log 12$ の値を求めよ（log は自然対数）。',
    answerValue: 2.4848,
    tolerance: 0.005,
    unit: '小数第2位まで（第3位を四捨五入）',
    explanation:
      '12 を 2 と 3 のかけ算に分けます：$12 = 2^2 \\times 3$。\n$\\log 12 = \\log 2^2 + \\log 3 = 2\\log 2 + \\log 3 = 1.3862 + 1.0986 = 2.4848$。小数第2位までで 2.48。\n$\\log 2 \\times \\log 2 \\times \\log 3$ のように、log どうしをかけてしまう間違いに注意します（かけ算になるのは log の中身のほう）。',
  },
  {
    id: 'pre1-math-exp-log-03',
    lesson: 'pre1-math-exp-log',
    level: 2,
    question: '$f(x) = \\log(2x + 1)$ を微分した導関数として正しいものはどれか（$x > -\\frac{1}{2}$）。',
    choices: ['$\\frac{1}{2x + 1}$', '$\\frac{2}{2x + 1}$', '$2\\log(2x + 1)$', '$\\frac{1}{2}\\log(2x + 1)$', '$\\frac{2x}{2x + 1}$'],
    answer: 1,
    explanation:
      '$\\{\\log g(x)\\}\' = \\frac{g\'(x)}{g(x)}$（チェーンルール）を使います。\n$g(x) = 2x + 1$、$g\'(x) = 2$ なので $f\'(x) = \\frac{2}{2x + 1}$。\n$\\frac{1}{2x + 1}$ は内側の微分 2 をかけ忘れた答えです。',
  },
  {
    id: 'pre1-math-exp-log-04',
    lesson: 'pre1-math-exp-log',
    level: 2,
    kind: 'numeric',
    question:
      'ある製品を 20 個検査したところ 5 個が不良品だった。不良品の確率を p とし、尤度を $L(p) = p^5 (1 - p)^{15}$ とする。対数尤度 $\\log L(p)$ を p で微分して 0 とおき、最尤推定値を求めよ。',
    answerValue: 0.25,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '対数をとると、かけ算がたし算になります：$\\log L(p) = 5\\log p + 15\\log(1 - p)$。\n微分：$\\frac{d}{dp}\\log L(p) = \\frac{5}{p} - \\frac{15}{1 - p}$（$\\log(1 - p)$ の微分は内側の −1 で $-\\frac{1}{1 - p}$）。\n0 とおいて両辺に $p(1 - p)$ をかける：$5(1 - p) = 15p$、$5 = 20p$、$p = 0.25$。\n20 個中 5 個の不良なので $\\frac{5}{20}$ と一致します。$\\frac{5}{15}$（不良 ÷ 良品）としないように。',
  },
  {
    id: 'pre1-math-exp-log-05',
    lesson: 'pre1-math-exp-log',
    level: 3,
    question:
      '待ち時間（分）が確率密度関数 $f(x) = \\lambda e^{-\\lambda x}$（$x \\ge 0$）の指数分布に従うとする。4 回の待ち時間が 2, 3, 5, 6 だったとき、λ の最尤推定値はどれか。',
    choices: ['$4$', '$16$', '$\\frac{1}{16}$', '$\\frac{1}{4}$', '$\\frac{1}{2}$'],
    answer: 3,
    explanation:
      '尤度は 4 つの密度のかけ算：$L(\\lambda) = \\lambda e^{-2\\lambda} \\times \\lambda e^{-3\\lambda} \\times \\lambda e^{-5\\lambda} \\times \\lambda e^{-6\\lambda} = \\lambda^4 e^{-16\\lambda}$（指数法則で指数を足す）。\n対数：$\\log L(\\lambda) = 4\\log\\lambda - 16\\lambda$。\n微分して 0：$\\frac{4}{\\lambda} - 16 = 0$ より $\\lambda = \\frac{4}{16} = \\frac{1}{4}$。\nこれは平均の待ち時間 $\\bar{x} = 4$ の逆数です。4 は平均そのもの（指数分布の平均は $\\frac{1}{\\lambda}$）を答えてしまった間違いです。',
  },
  {
    id: 'pre1-math-exp-log-06',
    lesson: 'pre1-math-exp-log',
    level: 3,
    kind: 'numeric',
    question:
      '標本平均 $\\bar{X}$ の期待値が 9、分散が 0.36 である。1次近似（デルタ法の考え方）$\\sqrt{\\bar{X}} \\approx \\sqrt{9} + g\'(9)(\\bar{X} - 9)$（$g(x) = \\sqrt{x}$）を使って、$\\sqrt{\\bar{X}}$ の分散の近似値を求めよ。',
    answerValue: 0.01,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '$g(x) = \\sqrt{x} = x^{1/2}$ の微分は $g\'(x) = \\frac{1}{2\\sqrt{x}}$ なので、$g\'(9) = \\frac{1}{6}$。\n近似式 $3 + \\frac{1}{6}(\\bar{X} - 9)$ は $\\bar{X}$ の1次式なので、$V[aX + b] = a^2 V[X]$ が使えます。\n$V[\\sqrt{\\bar{X}}] \\approx \\left(\\frac{1}{6}\\right)^2 \\times 0.36 = \\frac{0.36}{36} = 0.010$。\n$\\frac{1}{6} \\times 0.36 = 0.06$ は、係数を2乗し忘れた答えです。',
  },
  {
    id: 'pre1-math-exp-log-07',
    lesson: 'pre1-math-exp-log',
    level: 2,
    question: '$f(x) = \\log x$ の $x = 1$ での1次近似 $f(x) \\approx f(1) + f\'(1)(x - 1)$ を使うと、$\\log 1.02$ のおよその値はどれか。',
    choices: ['$0.02$', '$1.02$', '$0.2$', '$0.002$', '$2$'],
    answer: 0,
    explanation:
      '$f(1) = \\log 1 = 0$、$f\'(x) = \\frac{1}{x}$ より $f\'(1) = 1$。\n$\\log 1.02 \\approx 0 + 1 \\times (1.02 - 1) = 0.02$（本当の値は 0.0198…）。\n「1 に近い数の log は、1 からのずれとほぼ同じ」と覚えておくと便利です。1.02 は $f(1) = 1$ と思ってしまった答えです。',
  },

  // ---------- 偏微分と重積分 ----------
  {
    id: 'pre1-math-multivariable-01',
    lesson: 'pre1-math-multivariable',
    level: 1,
    question: '$f(x, y) = x^3 y^2$ の、x についての偏微分 $\\frac{\\partial f}{\\partial x}$ として正しいものはどれか。',
    choices: ['$3x^2 y^2$', '$2x^3 y$', '$6x^2 y$', '$3x^2$', '$3x^2 + 2y$'],
    answer: 0,
    explanation:
      'x で偏微分するときは、y を定数（数と同じ）として扱います。$y^2$ は定数倍としてそのまま残り、$x^3$ を微分して $3x^2$。\nよって $\\frac{\\partial f}{\\partial x} = 3x^2 y^2$。\n$2x^3 y$ は y で偏微分した答え、$6x^2 y$ は両方を微分してかけてしまった答えです。',
  },
  {
    id: 'pre1-math-multivariable-02',
    lesson: 'pre1-math-multivariable',
    level: 2,
    question: '$f(x, y) = 3x^2 + 2xy + y^2 - 8x$ について、$\\frac{\\partial f}{\\partial x} = 0$ と $\\frac{\\partial f}{\\partial y} = 0$ を同時に満たす点 (x, y) はどれか。',
    choices: ['$(-2, 2)$', '$(\\frac{4}{3}, 0)$', '$(2, -2)$', '$(2, 2)$', '$(1, -1)$'],
    answer: 2,
    explanation:
      '2つの偏微分を計算します（もう一方の変数は定数扱い）。\n$\\frac{\\partial f}{\\partial x} = 6x + 2y - 8$、$\\frac{\\partial f}{\\partial y} = 2x + 2y$。\n2つ目 = 0 より $y = -x$。1つ目に入れて $6x - 2x - 8 = 0$、$x = 2$、$y = -2$。\n$(\\frac{4}{3}, 0)$ は $2xy$ の項を両方の偏微分で落とした（$6x - 8 = 0$、$2y = 0$ とした）答えです。$2xy$ は x で偏微分すると $2y$、y で偏微分すると $2x$ が残ります。',
  },
  {
    id: 'pre1-math-multivariable-03',
    lesson: 'pre1-math-multivariable',
    level: 2,
    kind: 'numeric',
    question: '確率変数 X, Y の同時確率密度関数が $f(x, y) = x + y$（$0 \\le x \\le 1$, $0 \\le y \\le 1$、それ以外では 0）のとき、$P(X \\le 0.5,\\ Y \\le 1)$ を求めよ。',
    answerValue: 0.375,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '長方形の範囲なので、内側（y）から積分します。\n内側：$\\int_0^1 (x + y)\\,dy = \\Big[xy + \\frac{y^2}{2}\\Big]_0^1 = x + \\frac{1}{2}$。\n外側：$\\int_0^{0.5} \\left(x + \\frac{1}{2}\\right) dx = \\Big[\\frac{x^2}{2} + \\frac{x}{2}\\Big]_0^{0.5} = 0.125 + 0.25 = 0.375$。\nY ≤ 1 は Y の範囲全体なので、これは X の周辺密度 $x + \\frac{1}{2}$ を 0〜0.5 で積分したのと同じです。「面積の半分だから 0.5」としないように（密度は右ほど大きい）。',
  },
  {
    id: 'pre1-math-multivariable-04',
    lesson: 'pre1-math-multivariable',
    level: 2,
    question: '確率変数 X, Y の同時確率密度関数が $f(x, y) = 6xy^2$（$0 \\le x \\le 1$, $0 \\le y \\le 1$、それ以外では 0）のとき、X の周辺確率密度関数 $f_X(x)$（$0 \\le x \\le 1$）はどれか。',
    choices: ['$6x$', '$2xy^2$', '$3y^2$', '$x$', '$2x$'],
    answer: 4,
    explanation:
      'X の周辺密度は、y について全部の範囲で積分して y を消したものです。\n$f_X(x) = \\int_0^1 6xy^2\\,dy = 6x\\Big[\\frac{y^3}{3}\\Big]_0^1 = 6x \\times \\frac{1}{3} = 2x$。\n確かめ：$\\int_0^1 2x\\,dx = 1$。\n$3y^2$ は x で積分した Y の周辺密度、$6x$ は $\\int_0^1 y^2\\,dy = \\frac{1}{3}$ を忘れた答え、$2xy^2$ は y が消えていないので周辺密度ではありません。',
  },
  {
    id: 'pre1-math-multivariable-05',
    lesson: 'pre1-math-multivariable',
    level: 3,
    kind: 'numeric',
    question: 'データ 3, 5, 7, 9 が正規分布 $N(\\mu, \\sigma^2)$ からの標本であるとする。対数尤度を μ と σ² で偏微分して 0 とおいて得られる、σ² の最尤推定値を求めよ。',
    answerValue: 5,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '偏微分して 0 とおくと、$\\hat{\\mu} = \\bar{x}$、$\\hat{\\sigma}^2 = \\frac{1}{n}\\sum (x_i - \\bar{x})^2$ が得られます。\n$\\bar{x} = \\frac{3 + 5 + 7 + 9}{4} = 6$。\n偏差の2乗和：$(-3)^2 + (-1)^2 + 1^2 + 3^2 = 20$。\n$\\hat{\\sigma}^2 = \\frac{20}{4} = 5.00$。\n不偏分散のように n − 1 = 3 で割ると 6.67 になりますが、最尤推定値は n で割ります。',
  },
  {
    id: 'pre1-math-multivariable-06',
    lesson: 'pre1-math-multivariable',
    level: 3,
    question: '確率変数 X の確率密度関数が $f_X(x) = 2x$（$0 < x < 1$）のとき、$Y = X^2$ の確率密度関数 $f_Y(y)$（$0 < y < 1$）はどれか。',
    choices: ['$2y$', '$1$', '$2\\sqrt{y}$', '$\\frac{1}{2\\sqrt{y}}$', '$4y$'],
    answer: 1,
    explanation:
      '変数変換の公式 $f_Y(y) = f_X(x)\\left|\\frac{dx}{dy}\\right|$ を使います（x は y で表す）。\n$y = x^2$ より $x = \\sqrt{y}$、$\\frac{dx}{dy} = \\frac{1}{2\\sqrt{y}}$。\n$f_Y(y) = 2\\sqrt{y} \\times \\frac{1}{2\\sqrt{y}} = 1$。Y は 0〜1 の一様分布です。\n$2\\sqrt{y}$ は $\\left|\\frac{dx}{dy}\\right|$ をかけ忘れた答え、$4y$ は逆向きの $\\frac{dy}{dx} = 2x$ をかけた答え、$\\frac{1}{2\\sqrt{y}}$ は X が一様分布のときの答えです。',
  },

  // ---------- ベクトルと行列 ----------
  {
    id: 'pre1-math-matrix-01',
    lesson: 'pre1-math-matrix',
    level: 1,
    question: 'A が 2 行 3 列の行列、B が 3 行 4 列の行列のとき、積 AB は何行何列の行列か。',
    choices: ['3 行 3 列', '2 行 3 列', '3 行 4 列', '2 行 4 列', '積は計算できない'],
    answer: 3,
    explanation:
      '(m × n) と (n × p) の積は m × p です。A の列の数 3 と B の行の数 3 がそろっているので計算でき、結果は外側の 2 と 4 で 2 行 4 列。\nAB の (i, j) 成分は「A の i 行目（長さ 3）と B の j 列目（長さ 3）の内積」で、i は 1〜2、j は 1〜4 をとります。',
  },
  {
    id: 'pre1-math-matrix-02',
    lesson: 'pre1-math-matrix',
    level: 2,
    kind: 'numeric',
    question: '$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$、$B = \\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix}$ のとき、積 AB の 2 行 1 列の成分を求めよ。',
    answerValue: 10,
    tolerance: 0.01,
    unit: '整数で',
    explanation:
      'AB の 2 行 1 列は「A の 2 行目 (3, 4)」と「B の 1 列目 (2, 1)」の内積です。\n$3 \\times 2 + 4 \\times 1 = 6 + 4 = 10$。\n同じ位置どうしをかけて $3 \\times 1 = 3$ としたり、B の 1 行目 (2, 0) を使って $6 + 0 = 6$ としたりする間違いに注意。',
  },
  {
    id: 'pre1-math-matrix-03',
    lesson: 'pre1-math-matrix',
    level: 2,
    question: '行列 $\\begin{pmatrix} 4 & 3 \\\\ 1 & 1 \\end{pmatrix}$ の逆行列はどれか。',
    choices: [
      '$\\begin{pmatrix} 1 & -3 \\\\ -1 & 4 \\end{pmatrix}$',
      '$\\begin{pmatrix} 4 & -3 \\\\ -1 & 1 \\end{pmatrix}$',
      '$\\begin{pmatrix} 1 & 3 \\\\ 1 & 4 \\end{pmatrix}$',
      '$\\begin{pmatrix} -1 & 3 \\\\ 1 & -4 \\end{pmatrix}$',
      '$\\begin{pmatrix} 1/4 & 1/3 \\\\ 1 & 1 \\end{pmatrix}$',
    ],
    answer: 0,
    explanation:
      '2 × 2 の逆行列は $\\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$。\n行列式 $4 \\times 1 - 3 \\times 1 = 1$ なので、対角の 4 と 1 を入れかえ、3 と 1 の符号を変えて $\\begin{pmatrix} 1 & -3 \\\\ -1 & 4 \\end{pmatrix}$。\n確かめ：$\\begin{pmatrix} 4 & 3 \\\\ 1 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & -3 \\\\ -1 & 4 \\end{pmatrix} = \\begin{pmatrix} 4 - 3 & -12 + 12 \\\\ 1 - 1 & -3 + 4 \\end{pmatrix} = I$。\n2つ目は対角を入れかえ忘れた答え、成分ごとの逆数（最後の選択肢）は逆行列ではありません。',
  },
  {
    id: 'pre1-math-matrix-04',
    lesson: 'pre1-math-matrix',
    level: 2,
    question: '次の行列のうち、逆行列をもたないものはどれか。',
    choices: [
      '$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$',
      '$\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$',
      '$\\begin{pmatrix} 2 & 6 \\\\ 1 & 3 \\end{pmatrix}$',
      '$\\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$',
      '$\\begin{pmatrix} 2 & 3 \\\\ -2 & 3 \\end{pmatrix}$',
    ],
    answer: 2,
    explanation:
      '逆行列をもたないのは、行列式 $ad - bc = 0$ のときです。\n順に $4 - 6 = -2$、$4 - 1 = 3$、$6 - 6 = 0$、$6 - 0 = 6$、$6 - (-6) = 12$。\n0 になるのは $\\begin{pmatrix} 2 & 6 \\\\ 1 & 3 \\end{pmatrix}$ で、2列目が1列目のちょうど 3 倍（平行四辺形がつぶれて面積 0）になっています。\n最後の行列は $ad + bc$ と計算すると 0 になってしまう、引っかけです。',
  },
  {
    id: 'pre1-math-matrix-05',
    lesson: 'pre1-math-matrix',
    level: 3,
    question:
      '単回帰モデル $y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i$ のデータから $X\'X = \\begin{pmatrix} 5 & 10 \\\\ 10 & 30 \\end{pmatrix}$、$X\'\\boldsymbol{y} = \\begin{pmatrix} 20 \\\\ 50 \\end{pmatrix}$ が得られた。正規方程式 $X\'X\\boldsymbol{\\beta} = X\'\\boldsymbol{y}$ を解いて得られる $(\\hat{\\beta}_0, \\hat{\\beta}_1)$ はどれか。',
    choices: ['$(4, \\frac{5}{3})$', '$(1, 2)$', '$(100, 50)$', '$(2, -1)$', '$(2, 1)$'],
    answer: 4,
    explanation:
      '$\\hat{\\boldsymbol{\\beta}} = (X\'X)^{-1}X\'\\boldsymbol{y}$ を計算します。\n行列式：$5 \\times 30 - 10 \\times 10 = 50$。逆行列：$\\frac{1}{50}\\begin{pmatrix} 30 & -10 \\\\ -10 & 5 \\end{pmatrix}$。\n$\\hat{\\boldsymbol{\\beta}} = \\frac{1}{50}\\begin{pmatrix} 30 \\times 20 - 10 \\times 50 \\\\ -10 \\times 20 + 5 \\times 50 \\end{pmatrix} = \\frac{1}{50}\\begin{pmatrix} 100 \\\\ 50 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$。\n確かめ：$5 \\times 2 + 10 \\times 1 = 20$、$10 \\times 2 + 30 \\times 1 = 50$ ✓。\n$(100, 50)$ は行列式 50 で割り忘れた答え、$(4, \\frac{5}{3})$ は成分ごとに割った（$20 \\div 5$、$50 \\div 30$）間違いです。',
  },
  {
    id: 'pre1-math-matrix-06',
    lesson: 'pre1-math-matrix',
    level: 3,
    kind: 'numeric',
    question: '確率変数 X, Y の分散共分散行列が $\\Sigma = \\begin{pmatrix} 4 & 3 \\\\ 3 & 9 \\end{pmatrix}$ のとき、$2X - Y$ の分散を求めよ。',
    answerValue: 13,
    tolerance: 0.01,
    unit: '整数で',
    explanation:
      '係数ベクトル $\\boldsymbol{a} = (2, -1)$ として $V[2X - Y] = \\boldsymbol{a}\'\\Sigma\\boldsymbol{a}$ を計算します。\n$\\Sigma\\boldsymbol{a} = \\begin{pmatrix} 4 \\times 2 + 3 \\times (-1) \\\\ 3 \\times 2 + 9 \\times (-1) \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ -3 \\end{pmatrix}$、$\\boldsymbol{a}\'\\Sigma\\boldsymbol{a} = 2 \\times 5 + (-1) \\times (-3) = 13$。\n公式で書くと $2^2 V[X] + 2 \\times 2 \\times (-1)\\,\\mathrm{Cov}(X, Y) + (-1)^2 V[Y] = 16 - 12 + 9 = 13$。\n共分散の項の符号をプラスにすると $16 + 12 + 9 = 37$、係数を2乗し忘れると $2 \\times 4 - 12 + (-1) \\times 9 = -13$ のような、分散としてありえない値になります。',
  },
  {
    id: 'pre1-math-matrix-07',
    lesson: 'pre1-math-matrix',
    level: 1,
    question: '行列 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}$ の転置行列 $A\'$ はどれか。',
    choices: [
      '$\\begin{pmatrix} 3 & 2 & 1 \\\\ 6 & 5 & 4 \\end{pmatrix}$',
      '$\\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$',
      '$\\begin{pmatrix} 4 & 5 & 6 \\\\ 1 & 2 & 3 \\end{pmatrix}$',
      '$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\\\ 5 & 6 \\end{pmatrix}$',
      '$\\begin{pmatrix} 6 & 5 & 4 \\\\ 3 & 2 & 1 \\end{pmatrix}$',
    ],
    answer: 1,
    explanation:
      '転置は行と列を入れかえる操作で、A の 1 行目 (1, 2, 3) が A′ の 1 列目に、2 行目 (4, 5, 6) が 2 列目になります。2 × 3 行列の転置は 3 × 2 行列です。\n$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\\\ 5 & 6 \\end{pmatrix}$ は数を順に詰め直しただけで、転置ではありません。',
  },

  // ---------- 固有値と固有ベクトル ----------
  {
    id: 'pre1-math-eigen-01',
    lesson: 'pre1-math-eigen',
    level: 1,
    question: '正方行列 A と 0 でないベクトル v、数 λ が $A\\boldsymbol{v} = \\lambda\\boldsymbol{v}$ を満たすとき、このことの意味として正しいものはどれか。',
    choices: [
      'A をかけると、v は λ 度だけ回転する',
      'A をかけると、v の向きは直角に変わり、長さは λ 倍になる',
      'A をかけても v は同じ直線の上にとどまり、λ 倍されるだけである',
      'A のすべての成分が λ である',
      'v のすべての成分が λ である',
    ],
    answer: 2,
    explanation:
      '$A\\boldsymbol{v} = \\lambda\\boldsymbol{v}$ は「A をかけた結果が、v を λ 倍したものと同じ」という意味です。向き（v を通る直線）は変わらず、伸び縮みするだけ（λ が負なら反対向き）。\nこのとき v を固有ベクトル、λ を固有値といいます。回転や直角への変化は、ふつうのベクトルに A をかけたときに起こることです。',
  },
  {
    id: 'pre1-math-eigen-02',
    lesson: 'pre1-math-eigen',
    level: 2,
    question: '行列 $\\begin{pmatrix} 5 & 2 \\\\ 2 & 2 \\end{pmatrix}$ の固有値の組はどれか。',
    choices: ['5 と 2', '7 と −1', '3 と 4', '6 と 1', '7 と 6'],
    answer: 3,
    explanation:
      '固有方程式 $\\det(A - \\lambda I) = 0$ を解きます。\n$(5 - \\lambda)(2 - \\lambda) - 2 \\times 2 = \\lambda^2 - 7\\lambda + 10 - 4 = \\lambda^2 - 7\\lambda + 6 = 0$。\n「かけて 6、足して −7」になる −1 と −6 で $(\\lambda - 1)(\\lambda - 6) = 0$、$\\lambda = 6, 1$。\n確かめ：和 7 = 対角の和 5 + 2、積 6 = 行列式 10 − 4。\n「5 と 2」は対角の成分をそのまま答えた間違い、「7 と 6」は和と積そのものを答えた間違いです。',
  },
  {
    id: 'pre1-math-eigen-03',
    lesson: 'pre1-math-eigen',
    level: 2,
    question: '行列 $\\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}$ の固有値 2 に対する固有ベクトルはどれか。',
    choices: ['$(1, 0)$', '$(1, -1)$', '$(1, 1)$', '$(0, 1)$', '$(2, 1)$'],
    answer: 1,
    explanation:
      '$(A - 2I)\\boldsymbol{v} = \\boldsymbol{0}$ を解きます。$A - 2I = \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}$ なので $v_1 + v_2 = 0$。たとえば $(1, -1)$。\n確かめ：$\\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ -2 \\end{pmatrix} = 2\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}$ ✓。\n$(1, 0)$ は $A(1, 0) = (3, 0)$ なので、固有値 3 の固有ベクトルです。',
  },
  {
    id: 'pre1-math-eigen-04',
    lesson: 'pre1-math-eigen',
    level: 2,
    kind: 'numeric',
    question: '2つの変数の分散共分散行列が $\\Sigma = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$ である。この行列で主成分分析をしたとき、第1主成分の寄与率を求めよ。',
    answerValue: 2 / 3,
    tolerance: 0.005,
    unit: '小数第2位まで（第3位を四捨五入）',
    explanation:
      '寄与率は「最大固有値 ÷ 固有値の合計」です。\n固有方程式：$(3 - \\lambda)^2 - 1 = 0$ より $3 - \\lambda = \\pm 1$、$\\lambda = 4, 2$。\n寄与率：$\\frac{4}{4 + 2} = \\frac{2}{3} \\approx 0.67$。\n固有値の合計 6 は、対角の和（分散の合計）3 + 3 と一致します。固有値の平方根で $\\frac{2}{2 + \\sqrt{2}}$ としないように。',
  },
  {
    id: 'pre1-math-eigen-05',
    lesson: 'pre1-math-eigen',
    level: 3,
    question:
      '2 × 2 の対称行列 A は固有値 5 と 1 をもち、固有値 5 に対する固有ベクトルが $(1, 2)$ である。固有値 1 に対する固有ベクトルとして正しいものはどれか。',
    choices: ['$(2, -1)$', '$(2, 1)$', '$(1, -2)$', '$(1, 0)$', '$(-1, 2)$'],
    answer: 0,
    explanation:
      '対称行列では、異なる固有値の固有ベクトルどうしは直交します（内積が 0）。\n$(1, 2)$ との内積が 0 になるのは $(2, -1)$：$1 \\times 2 + 2 \\times (-1) = 0$。\nほかは $(2, 1)$ → 4、$(1, -2)$ → −3、$(1, 0)$ → 1、$(-1, 2)$ → 3 で、どれも 0 になりません。\n（実際、$A = \\frac{1}{5}\\begin{pmatrix} 9 & 8 \\\\ 8 & 21 \\end{pmatrix}$ で、$A(1, 2) = (5, 10)$、$A(2, -1) = (2, -1)$ となります。）',
  },
  {
    id: 'pre1-math-eigen-06',
    lesson: 'pre1-math-eigen',
    level: 3,
    kind: 'numeric',
    question:
      '2つの変数の分散共分散行列が $\\Sigma = \\begin{pmatrix} 6 & 2 \\\\ 2 & 3 \\end{pmatrix}$ である。長さ 1 のベクトル u の向きにデータを落とした値の分散 $\\boldsymbol{u}\'\\Sigma\\boldsymbol{u}$ の最大値（第1主成分の分散）を求めよ。',
    answerValue: 7,
    tolerance: 0.01,
    unit: '整数で',
    explanation:
      '$\\boldsymbol{u}\'\\Sigma\\boldsymbol{u}$ の最大値は、Σ の最大固有値です（そのときの u が最大固有値の固有ベクトル）。\n固有方程式：$(6 - \\lambda)(3 - \\lambda) - 4 = \\lambda^2 - 9\\lambda + 14 = 0$、$(\\lambda - 2)(\\lambda - 7) = 0$。最大固有値は 7。\n確かめ：固有ベクトルは $(\\Sigma - 7I)\\boldsymbol{v} = \\boldsymbol{0}$ より $-v_1 + 2v_2 = 0$、$\\boldsymbol{u} = \\frac{1}{\\sqrt{5}}(2, 1)$。$\\boldsymbol{u}\'\\Sigma\\boldsymbol{u} = \\frac{1}{5}(6 \\times 4 + 2 \\times 2 \\times 2 \\times 1 + 3 \\times 1) = \\frac{35}{5} = 7$ ✓。\n対角の最大の成分 6（X だけの分散）を答えるのは誤りで、共分散の分だけ斜めの向きのほうが分散が大きくなります。',
  },
  {
    id: 'pre1-math-eigen-07',
    lesson: 'pre1-math-eigen',
    level: 2,
    question: '$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$、$\\boldsymbol{x} = (1, -2)$ のとき、2次形式 $\\boldsymbol{x}\'A\\boldsymbol{x}$ の値はどれか。',
    choices: ['$12$', '$18$', '$14$', '$-10$', '$10$'],
    answer: 4,
    explanation:
      '2 × 2 の2次形式は $a x_1^2 + 2b\\,x_1 x_2 + c\\,x_2^2$（非対角の b は2回出てくる）。\n$2 \\times 1^2 + 2 \\times 1 \\times 1 \\times (-2) + 3 \\times (-2)^2 = 2 - 4 + 12 = 10$。\n行列の積で確かめると、$A\\boldsymbol{x} = (2 - 2, 1 - 6) = (0, -5)$、$\\boldsymbol{x}\'A\\boldsymbol{x} = 1 \\times 0 + (-2) \\times (-5) = 10$。\n12 は積の項の 2 を忘れた答え、18 は積の項の符号を間違えた答え、14 は積の項を落とした答えです。',
  },
]
