import type { Problem } from '../../types'

export const problems: Problem[] = [
  // ---------- 十分統計量 ----------
  {
    id: 'pre1-estimation-sufficiency-01',
    lesson: 'pre1-estimation-sufficiency',
    level: 1,
    question: 'データ $X_1, \\dots, X_n$ から計算した統計量 $T$ が、母数 $\\theta$ の**十分統計量**であることの意味として正しいものはどれか。',
    choices: [
      '$T$ の期待値が $\\theta$ に等しい。',
      '$T$ の分散が、$\\theta$ のどの推定量よりも小さい。',
      '$T = t$ を与えたときのデータ $X_1, \\dots, X_n$ の条件つき分布が $\\theta$ によらない。',
      '$T$ の分布そのものが $\\theta$ によらない。',
      '$n$ を大きくすると、$T$ が $\\theta$ に近づく確率が 1 に近づく。',
    ],
    answer: 2,
    explanation:
      '十分統計量の定義は「T = t を知ったあとのデータの条件つき分布に θ が残らない」ことです。T を知ったあとのデータの残りは θ と関係のない偶然なので、θ についての情報は T に全部入っています。\n1 番目は不偏性、2 番目は有効性（最小分散）、5 番目は一致性の説明です。4 番目は「分布が θ によらない」量で、十分統計量とは逆に θ の情報を持ちません（データと θ を含めば枢軸量の考え方に近い）。',
  },
  {
    id: 'pre1-estimation-sufficiency-02',
    lesson: 'pre1-estimation-sufficiency',
    level: 2,
    question:
      '$X_1, \\dots, X_n$ は独立に、確率関数 $f(x;\\lambda) = \\dfrac{\\lambda^x e^{-\\lambda}}{x!}$（$x = 0, 1, 2, \\dots$）のポアソン分布に従う。分解定理から、$\\lambda$ の十分統計量として正しいものはどれか。',
    choices: ['$\\sum_{i=1}^{n} X_i$', '$\\max(X_1, \\dots, X_n)$', '$X_1$', '$\\sum_{i=1}^{n} X_i^2$', '$\\prod_{i=1}^{n} X_i$'],
    answer: 0,
    explanation:
      '同時確率を λ を含む部分と含まない部分に分けます。\n$\\prod \\frac{\\lambda^{x_i}e^{-\\lambda}}{x_i!} = \\lambda^{\\sum x_i}e^{-n\\lambda} \\times \\frac{1}{\\prod x_i!}$\n前半（g）でデータは $\\sum x_i$ の形でしか入っていません。後半（h）はデータを含みますが λ を含みません。よって $\\sum X_i$ が十分統計量です。\n$\\prod X_i$ は h の分母の $x_i!$ と見まちがえた誤りです。h に入っているものは十分統計量を決めません。',
  },
  {
    id: 'pre1-estimation-sufficiency-03',
    lesson: 'pre1-estimation-sufficiency',
    level: 2,
    question:
      '$X_1, \\dots, X_n$ は独立に、区間 $[0, \\theta]$ の一様分布（密度 $1/\\theta$）に従う（$\\theta > 0$ は未知）。$\\theta$ の十分統計量として正しいものはどれか。',
    choices: ['$\\sum_{i=1}^{n} X_i$', '$\\bar{X}$', '$\\min(X_1, \\dots, X_n)$', '$\\max(X_1, \\dots, X_n)$', '$\\sum_{i=1}^{n} X_i^2$'],
    answer: 3,
    explanation:
      '密度は 0 ≦ x ≦ θ のときだけ $1/\\theta$ で、それ以外は 0 です。範囲の条件を指示関数で書くと、\n$\\prod \\frac{1}{\\theta}\\mathbf{1}\\{0 \\le x_i \\le \\theta\\} = \\frac{1}{\\theta^n}\\mathbf{1}\\{\\max x_i \\le \\theta\\} \\times \\mathbf{1}\\{\\min x_i \\ge 0\\}$\nθ とデータが一緒に出てくるのは「最大値 ≦ θ」の部分だけなので、最大値が十分統計量です。\n$1/\\theta^n$ にはデータが入っていないので、範囲の条件を忘れると「十分統計量がない」と誤ります。合計や標本平均は、この分布では十分統計量ではありません。',
  },
  {
    id: 'pre1-estimation-sufficiency-04',
    lesson: 'pre1-estimation-sufficiency',
    level: 2,
    question:
      '$X_1, \\dots, X_n$ は独立に正規分布 $N(\\mu, \\sigma^2)$ に従い、$\\mu$ と $\\sigma^2$ はどちらも未知である。$(\\mu, \\sigma^2)$ の十分統計量として正しいものはどれか。',
    choices: [
      '$\\sum X_i$ だけ',
      '$\\sum X_i^2$ だけ',
      '$\\max X_i$ と $\\min X_i$ の組',
      '$\\sum X_i$ と $\\max X_i$ の組',
      '$\\sum X_i$ と $\\sum X_i^2$ の組',
    ],
    answer: 4,
    explanation:
      '同時密度の exp の中は $-\\frac{1}{2\\sigma^2}\\sum (x_i - \\mu)^2 = -\\frac{1}{2\\sigma^2}\\left(\\sum x_i^2 - 2\\mu\\sum x_i + n\\mu^2\\right)$ です。\nσ² が未知なので、$\\sum x_i^2$ の項も σ² と一緒に出てきて h に入れられません。よって $\\left(\\sum X_i, \\sum X_i^2\\right)$ の組が十分統計量です（標本平均と不偏分散の組と同じ情報）。\nσ² が既知なら $\\sum X_i$ だけで十分です（1 番目はその場合の答え）。',
  },
  {
    id: 'pre1-estimation-sufficiency-05',
    lesson: 'pre1-estimation-sufficiency',
    kind: 'numeric',
    level: 3,
    question:
      '表の出る確率が $p$（未知）のコインを独立に 6 回投げ、$i$ 回目が表なら $X_i = 1$、裏なら $X_i = 0$ とする。表の回数 $T = X_1 + \\cdots + X_6$ が 2 だったと知ったとき、1 回目が表である条件つき確率 $P(X_1 = 1 \\mid T = 2)$ を求めよ。',
    answerValue: 0.33,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      'T = 2 を知ったあとは、表が 2 回になる並び ${}_6C_2 = 15$ 通りが、p によらず同じ確率 1/15 です（どの並びも確率 $p^2(1-p)^4$ で、約分で消える）。\nそのうち 1 回目が表の並びは、残り 5 回のどこか 1 回が表なので ${}_5C_1 = 5$ 通り。\n$P(X_1 = 1 \\mid T = 2) = 5/15 = 1/3 \\approx 0.33$\n答えに p が入らないことが、T が十分統計量であることの表れです。1/15 ≒ 0.07 は特定の並び1つの確率、2/6 を「6 回のうち 2 回」と考えるのは結果的に同じ 0.33 です。',
  },
  {
    id: 'pre1-estimation-sufficiency-06',
    lesson: 'pre1-estimation-sufficiency',
    level: 3,
    question:
      '$X_1, \\dots, X_n$ は独立に、密度 $f(x;\\theta) = \\theta x^{\\theta - 1}$（$0 < x < 1$、$\\theta > 0$）に従う。$\\theta$ の十分統計量として正しいものはどれか。',
    choices: ['$\\sum_{i=1}^{n} X_i$', '$\\prod_{i=1}^{n} X_i$', '$\\max(X_1, \\dots, X_n)$', '$\\sum_{i=1}^{n} X_i^2$', '$\\min(X_1, \\dots, X_n)$'],
    answer: 1,
    explanation:
      'n 個かけると、指数法則で $x_i^{\\theta - 1}$ がまとまります。\n$\\prod \\theta x_i^{\\theta - 1} = \\theta^n \\left(\\prod x_i\\right)^{\\theta - 1} \\times 1$\nθ とデータが出会うのは $\\prod x_i$ だけなので、積 $\\prod X_i$ が十分統計量です（1対1に対応する $\\sum \\log X_i$ でも同じ）。\n範囲 0 < x < 1 は θ によらないので、最大値や最小値は関係ありません。「十分統計量はいつも合計」と覚えていると 1 番目を選んでしまいます。',
  },

  // ---------- 最尤法とモーメント法 ----------
  {
    id: 'pre1-estimation-mle-01',
    lesson: 'pre1-estimation-mle',
    level: 1,
    question: '尤度関数 $L(\\theta)$ と最尤法の説明として正しいものはどれか。',
    choices: [
      '尤度 $L(\\theta)$ は θ が正しい確率なので、θ について積分するといつも 1 になる。',
      '尤度は θ を固定してデータの関数として見たもので、θ を動かしても値は変わらない。',
      '対数尤度を最大にする θ と、尤度を最大にする θ は一般に異なる。',
      '尤度はデータを固定して θ の関数として見た同時確率（密度）で、それを最大にする θ が最尤推定値である。',
      '最尤推定量は、どんな分布でも必ず不偏推定量になる。',
    ],
    answer: 3,
    explanation:
      '尤度は「θ がこの値なら、手もとのデータが出る確率（密度）」を θ の関数として見たものです。最大にする θ が最尤推定値です。\n1 番目：尤度は θ の確率分布ではなく、θ について積分しても 1 とは限りません。2 番目は確率関数（密度関数）の見方で、尤度とは見る向きが逆です。3 番目：log は単調増加なので最大の位置は同じです。5 番目：正規分布の σ² の最尤推定量（n で割る）は不偏ではありません。',
  },
  {
    id: 'pre1-estimation-mle-02',
    lesson: 'pre1-estimation-mle',
    kind: 'numeric',
    level: 2,
    question:
      'ある窓口で客が来るまでの時間（分）を 5 回測ったら、2.0、0.5、1.5、3.0、1.0 だった。時間は密度 $f(x;\\lambda) = \\lambda e^{-\\lambda x}$（$x \\ge 0$）の指数分布に従うとする。$\\lambda$ の最尤推定値を求めよ。',
    answerValue: 0.625,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '対数尤度は $\\ell(\\lambda) = n\\log\\lambda - \\lambda\\sum x_i$。\n微分して 0 とおく：$\\frac{n}{\\lambda} - \\sum x_i = 0$ より $\\hat{\\lambda} = \\frac{n}{\\sum x_i} = \\frac{1}{\\bar{x}}$。\n合計 8.0、n = 5 なので $\\bar{x} = 1.6$、$\\hat{\\lambda} = 1/1.6 = 0.625$。\n1.6 と答えるのは、平均 θ で書いた指数分布（密度 $e^{-x/\\theta}/\\theta$）の最尤推定値と混同した誤りです。',
  },
  {
    id: 'pre1-estimation-mle-03',
    lesson: 'pre1-estimation-mle',
    level: 2,
    question:
      '区間 $[0, \\theta]$ の一様分布から 5 個の値 2.1、5.4、3.3、0.8、4.4 を得た。$\\theta$ のモーメント推定値と最尤推定値の組として正しいものはどれか。',
    choices: [
      'モーメント推定値 6.4、最尤推定値 5.4',
      'モーメント推定値 3.2、最尤推定値 5.4',
      'モーメント推定値 6.4、最尤推定値 6.4',
      'モーメント推定値 5.4、最尤推定値 6.4',
      'モーメント推定値 6.4、最尤推定値 6.48',
    ],
    answer: 0,
    explanation:
      'モーメント法：$E(X) = \\theta/2$ を標本平均に合わせて $\\theta/2 = \\bar{x}$。$\\bar{x} = 16/5 = 3.2$ なので $\\tilde{\\theta} = 6.4$。\n最尤法：尤度は θ ≧ 最大値のとき $1/\\theta^5$ で、θ が小さいほど大きいので、θ = 最大値 5.4 で最大になります。\n3.2 は標本平均をそのまま答えた誤り、6.48 は最大値を不偏になるよう 6/5 倍した値で、最尤推定値ではありません。',
  },
  {
    id: 'pre1-estimation-mle-04',
    lesson: 'pre1-estimation-mle',
    level: 2,
    question: '正規分布 $N(\\mu, \\sigma^2)$（$\\mu, \\sigma^2$ はともに未知）から 5 個の値 4、6、7、9、9 を得た。$\\sigma^2$ の最尤推定値はどれか。',
    choices: ['1.90', '4.50', '3.60', '18.0', '0.72'],
    answer: 2,
    explanation:
      '対数尤度を μ と σ² で偏微分して 0 とおくと、$\\hat{\\mu} = \\bar{x}$、$\\hat{\\sigma}^2 = \\frac{1}{n}\\sum (x_i - \\bar{x})^2$（n で割る）になります。\n平均は 35/5 = 7、偏差は −3、−1、0、2、2 で、2乗和は 9 + 1 + 0 + 4 + 4 = 18。\n$\\hat{\\sigma}^2 = 18/5 = 3.60$。\n4.50 は n − 1 = 4 で割った不偏分散（最尤推定値ではない）、1.90 は 3.6 のルート（σ の最尤推定値）、18.0 は2乗和のまま、0.72 はさらに n で割った値です。',
  },
  {
    id: 'pre1-estimation-mle-05',
    lesson: 'pre1-estimation-mle',
    kind: 'numeric',
    level: 3,
    question:
      'ある店の 6 日間の来店数は 2、0、1、3、1、2 人だった。1 日の来店数はポアソン分布 $P(X = x) = \\dfrac{\\lambda^x e^{-\\lambda}}{x!}$ に従うとする。「1 日に 1 人も来ない確率」$P(X = 0)$ の最尤推定値を求めよ。必要なら $e^{-1} = 0.3679$、$e^{-1.5} = 0.2231$、$e^{-2} = 0.1353$ を使ってよい。',
    answerValue: 0.223,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      'まず λ の最尤推定値：対数尤度 $\\ell(\\lambda) = (\\sum x_i)\\log\\lambda - n\\lambda + \\text{const}$ を微分して 0 とおくと $\\hat{\\lambda} = \\bar{x}$。合計 9、n = 6 なので $\\hat{\\lambda} = 1.5$。\n$P(X = 0) = e^{-\\lambda}$ なので、最尤推定量の不変性から、その最尤推定値は $e^{-\\hat{\\lambda}} = e^{-1.5} = 0.2231 \\approx 0.223$。\n6 日中 1 日だけ 0 人だったので 1/6 ≒ 0.167 と答えるのは、ポアソン分布のモデルを使わない推定で、最尤推定値ではありません。',
  },
  {
    id: 'pre1-estimation-mle-06',
    lesson: 'pre1-estimation-mle',
    level: 3,
    question:
      '形状 $k$・尺度 $\\theta$ のガンマ分布（平均 $k\\theta$、分散 $k\\theta^2$）から大きさ $n$ の標本をとり、標本平均 $\\bar{x} = 6$、$n$ で割った標本分散 $S^2 = 12$ を得た。平均と分散を合わせるモーメント法による $(k, \\theta)$ の推定値はどれか。',
    choices: ['$k = 2,\\ \\theta = 3$', '$k = 0.5,\\ \\theta = 12$', '$k = 6,\\ \\theta = 1$', '$k = 3,\\ \\theta = 0.5$', '$k = 3,\\ \\theta = 2$'],
    answer: 4,
    explanation:
      '2 本の式 $k\\theta = \\bar{x} = 6$、$k\\theta^2 = S^2 = 12$ を立てます。\n2 本目を 1 本目で割ると $\\theta = S^2/\\bar{x} = 12/6 = 2$、1 本目に戻して $k = 6/2 = 3$。\n$(k, \\theta) = (3, 0.5)$ は割り算を逆にした（$\\theta = \\bar{x}/S^2$）誤りです。$(2, 3)$ は k と θ を取りちがえたもの。答えを $k\\theta = 6$、$k\\theta^2 = 12$ に入れて確かめるとよいでしょう。',
  },
  {
    id: 'pre1-estimation-mle-07',
    lesson: 'pre1-estimation-mle',
    level: 3,
    question:
      '$X_1, \\dots, X_n$ は独立に、密度 $f(x;\\theta) = \\theta x^{\\theta - 1}$（$0 < x < 1$、$\\theta > 0$）に従う。$\\theta$ の最尤推定量はどれか。',
    choices: [
      '$\\hat{\\theta} = \\bar{X}$',
      '$\\hat{\\theta} = -\\dfrac{n}{\\sum_{i=1}^{n} \\log X_i}$',
      '$\\hat{\\theta} = \\dfrac{n}{\\sum_{i=1}^{n} \\log X_i}$',
      '$\\hat{\\theta} = \\dfrac{\\bar{X}}{1 - \\bar{X}}$',
      '$\\hat{\\theta} = \\max(X_1, \\dots, X_n)$',
    ],
    answer: 1,
    explanation:
      '対数尤度は $\\ell(\\theta) = n\\log\\theta + (\\theta - 1)\\sum \\log x_i$。\nθ で微分して 0 とおく：$\\frac{n}{\\theta} + \\sum \\log x_i = 0$ より $\\hat{\\theta} = -\\frac{n}{\\sum \\log x_i}$。\n0 < x < 1 なので $\\log x_i < 0$ で、マイナスがついて正の値になります。符号を落とすと 3 番目（負の値になってしまう）。\n4 番目は $E(X) = \\theta/(\\theta + 1)$ を $\\bar{x}$ に合わせたモーメント推定量で、最尤推定量とは異なります。',
  },

  // ---------- 推定量の良さ ----------
  {
    id: 'pre1-estimation-properties-01',
    lesson: 'pre1-estimation-properties',
    level: 1,
    question: '推定量 $\\hat{\\theta}$ の平均二乗誤差 $E[(\\hat{\\theta} - \\theta)^2]$ について、バイアス・バリアンス分解として正しいものはどれか。ただしバイアスは $E(\\hat{\\theta}) - \\theta$ とする。',
    choices: [
      '平均二乗誤差 = バイアス + 分散',
      '平均二乗誤差 = バイアス² + 分散',
      '平均二乗誤差 = バイアス² − 分散',
      '平均二乗誤差 = (バイアス + 標準偏差)²',
      '平均二乗誤差 = 分散 ÷ バイアス²',
    ],
    answer: 1,
    explanation:
      '$\\hat{\\theta} - \\theta = \\{\\hat{\\theta} - E(\\hat{\\theta})\\} + \\{E(\\hat{\\theta}) - \\theta\\}$ と分けて2乗し、期待値をとると、交差項は $E\\{\\hat{\\theta} - E(\\hat{\\theta})\\} = 0$ で消えます。\n残るのは分散とバイアスの2乗なので、MSE = バイアス² + 分散。\n不偏推定量（バイアス 0）なら MSE = 分散です。(バイアス + 標準偏差)² は交差項を消し忘れた形です。',
  },
  {
    id: 'pre1-estimation-properties-02',
    lesson: 'pre1-estimation-properties',
    kind: 'numeric',
    level: 2,
    question:
      '$X_1, \\dots, X_4$ は独立に平均 $\\mu = 5$、分散 $\\sigma^2 = 10$ の同じ分布に従う。$\\mu$ の推定量 $T = \\dfrac{X_1 + X_2 + X_3 + X_4}{5}$ の平均二乗誤差 $E[(T - \\mu)^2]$ を求めよ。',
    answerValue: 2.6,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '期待値：$E(T) = \\frac{4 \\times 5}{5} = 4$ なので、バイアスは $4 - 5 = -1$。\n分散：$V(T) = \\frac{4 \\times 10}{5^2} = 1.6$（独立な和の分散は分散の和、5 で割ると分散は 1/25 倍）。\nMSE = バイアス² + 分散 = 1 + 1.6 = 2.60。\n標本平均（4 で割る）の MSE は 10/4 = 2.5 なので、この T のほうが少し悪い。1.6 と答えるのはバイアスを忘れた誤りです。',
  },
  {
    id: 'pre1-estimation-properties-03',
    lesson: 'pre1-estimation-properties',
    level: 2,
    question:
      '正規分布 $N(\\mu, \\sigma^2)$ から大きさ $n$ の標本をとり、$\\mu$ を標本平均と標本中央値で推定する。$n$ が大きいとき、標本平均に対する標本中央値の相対効率（標本平均の分散 ÷ 標本中央値の分散）に最も近いものはどれか。',
    choices: ['0.32', '1.57', '2.00', '0.64', '1.00'],
    answer: 3,
    explanation:
      'n が大きいとき、標本中央値の分散はおよそ $\\frac{\\pi\\sigma^2}{2n}$、標本平均の分散は $\\frac{\\sigma^2}{n}$。\n相対効率 = $\\frac{\\sigma^2/n}{\\pi\\sigma^2/(2n)} = \\frac{2}{\\pi} \\approx 0.64$。\n1 より小さいので、正規分布では標本中央値のほうが効率が悪く、同じ精度を出すのにデータが約 1.57 倍要ります（1.57 は逆数）。2.00 は裾の重いラプラス分布での値です。',
  },
  {
    id: 'pre1-estimation-properties-04',
    lesson: 'pre1-estimation-properties',
    kind: 'numeric',
    level: 2,
    question:
      '成功確率 $p$ のベルヌーイ分布から独立に 50 個のデータをとる。1 個分のフィッシャー情報量は $I(p) = \\dfrac{1}{p(1-p)}$ である。$p = 0.2$ のとき、$p$ の不偏推定量の分散のクラーメル・ラオの下限を求めよ。',
    answerValue: 0.0032,
    tolerance: 0.00005,
    unit: '小数第4位まで',
    explanation:
      'クラーメル・ラオの下限は $\\frac{1}{nI(p)} = \\frac{p(1-p)}{n}$。\n$\\frac{0.2 \\times 0.8}{50} = \\frac{0.16}{50} = 0.0032$。\n標本比率 $\\hat{p}$ の分散も $p(1-p)/n = 0.0032$ でぴったり一致するので、標本比率は有効推定量です。n をかけ忘れると 0.16 になります。',
  },
  {
    id: 'pre1-estimation-properties-05',
    lesson: 'pre1-estimation-properties',
    level: 3,
    question: '線形模型 $y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i$ に関するガウス・マルコフの定理の説明として正しいものはどれか。',
    choices: [
      '誤差の平均が 0、分散が等しく、互いに無相関なら、最小二乗推定量はデータ $y$ の1次式で表せる不偏推定量の中で分散が最小である。',
      'ガウス・マルコフの定理が成り立つには、誤差が正規分布に従う必要がある。',
      '最小二乗推定量は、バイアスのある推定量も含めたすべての推定量の中で平均二乗誤差が最小である。',
      '誤差の分散が観測ごとに異なっていても、通常の最小二乗推定量が最良線形不偏推定量である。',
      '最小二乗推定量は $y$ の1次式で表せないので、定理の対象にならない。',
    ],
    answer: 0,
    explanation:
      'ガウス・マルコフの定理は「誤差の平均 0・等分散・無相関」のもとで、最小二乗推定量が線形不偏推定量の中で分散最小（BLUE）であることを述べます。\n2 番目：正規性は要りません。3 番目：比べる相手は線形かつ不偏な推定量だけで、バイアスのある推定量（リッジ回帰など）のほうが MSE が小さいこともあります。4 番目：不均一分散では重みつき最小二乗法のほうが良くなります。5 番目：最小二乗推定量は y の1次式（線形推定量）です。',
  },
  {
    id: 'pre1-estimation-properties-06',
    lesson: 'pre1-estimation-properties',
    level: 3,
    question:
      '同じ母数 $\\theta$ の不偏推定量 $T_1$（分散 4）と $T_2$（分散 1）があり、互いに独立である。$w T_1 + (1 - w) T_2$ の形の推定量のうち、分散が最小になる $w$ はどれか。',
    choices: ['$w = 0.5$', '$w = 0.8$', '$w = 0.2$', '$w = 0.25$', '$w = 0$'],
    answer: 2,
    explanation:
      '係数の和が 1 なので、どの w でも不偏です。分散は独立なので $V = 4w^2 + (1 - w)^2$。\nw で微分して 0 とおく：$8w - 2(1 - w) = 0$ より $10w = 2$、$w = 0.2$。\nこのとき分散は $4 \\times 0.04 + 0.64 = 0.8$ で、良いほうの $T_2$ だけ（w = 0、分散 1）より小さくなります。\n分散の小さい推定量に大きな重み（分散の逆数に比例：1/4 と 1 → 0.2 と 0.8）をつけるのが最良です。0.8 は重みを逆にした誤りです。',
  },
  {
    id: 'pre1-estimation-properties-07',
    lesson: 'pre1-estimation-properties',
    level: 2,
    question:
      '$X_1, \\dots, X_n$ は独立に平均 $\\mu$・分散 $\\sigma^2$ の同じ分布に従う。次の3つの推定量について、不偏性と一致性の組み合わせとして正しいものはどれか。\nA：$\\mu$ の推定量としての $X_1$\nB：$\\mu$ の推定量としての $\\bar{X}$\nC：$\\sigma^2$ の推定量としての $\\frac{1}{n}\\sum (X_i - \\bar{X})^2$',
    choices: [
      'A：不偏・一致、B：不偏・一致、C：不偏・一致',
      'A：不偏でない・一致、B：不偏・一致、C：不偏・一致でない',
      'A：不偏・一致でない、B：不偏・一致、C：不偏・一致',
      'A：不偏でない・一致でない、B：不偏・一致、C：不偏でない・一致でない',
      'A：不偏・一致でない、B：不偏・一致、C：不偏でない・一致',
    ],
    answer: 4,
    explanation:
      'A：$E(X_1) = \\mu$ で不偏。しかし n を増やしても 1 個目しか使わず分散が $\\sigma^2$ のままなので、一致ではありません。\nB：期待値 μ、分散 $\\sigma^2/n \\to 0$ なので、不偏かつ一致。\nC：期待値は $\\frac{n-1}{n}\\sigma^2$ で不偏ではありません。ただしバイアス $-\\sigma^2/n$ も分散も n → ∞ で 0 に近づくので一致です。\n「不偏 ⇔ 一致」ではない、というのがポイントです。',
  },

  // ---------- フィッシャー情報量と漸近的性質 ----------
  {
    id: 'pre1-estimation-asymptotics-01',
    lesson: 'pre1-estimation-asymptotics',
    level: 1,
    question: 'フィッシャー情報量 $I(\\theta)$ の説明として正しいものはどれか。',
    choices: [
      'フィッシャー情報量が大きいほど、最尤推定量の漸近分散は大きくなる。',
      'フィッシャー情報量は、対数尤度の値そのものの期待値である。',
      '独立な n 個のデータのフィッシャー情報量は、1 個分と同じ $I(\\theta)$ である。',
      'フィッシャー情報量は、山の頂上で2回微分が負になるので、つねに負の値をとる。',
      'フィッシャー情報量はスコア関数の分散に等しく、対数尤度の頂上付近の曲がり具合の大きさを表す。',
    ],
    answer: 4,
    explanation:
      '$I(\\theta) = E[U^2] = -E[\\partial^2 \\log f/\\partial\\theta^2]$ で、スコア U（対数尤度の傾き）の分散であり、曲がり具合の大きさです。\n1 番目：漸近分散は $1/(nI(\\theta))$ なので、情報量が大きいほど小さい。3 番目：n 個なら $nI(\\theta)$。4 番目：2回微分にマイナスをつけて定義するので、正（0 以上）の値です。',
  },
  {
    id: 'pre1-estimation-asymptotics-02',
    lesson: 'pre1-estimation-asymptotics',
    level: 2,
    question: '確率関数 $f(x;\\lambda) = \\dfrac{\\lambda^x e^{-\\lambda}}{x!}$ のポアソン分布について、1 個のデータのフィッシャー情報量 $I(\\lambda)$ はどれか。',
    choices: ['$\\lambda$', '$1/\\lambda$', '$1/\\lambda^2$', '$\\lambda^2$', '$n/\\lambda$'],
    answer: 1,
    explanation:
      '$\\log f = x\\log\\lambda - \\lambda - \\log x!$。\n1回微分：$\\frac{x}{\\lambda} - 1$、2回微分：$-\\frac{x}{\\lambda^2}$。\nマイナスをつけて期待値（$E(X) = \\lambda$）をとると $I(\\lambda) = \\frac{\\lambda}{\\lambda^2} = \\frac{1}{\\lambda}$。\n$1/\\lambda^2$ は期待値をとらずに x = 1 とした誤り（指数分布の答えとも同じ形）、$n/\\lambda$ は n 個分の情報量です。',
  },
  {
    id: 'pre1-estimation-asymptotics-03',
    lesson: 'pre1-estimation-asymptotics',
    kind: 'numeric',
    level: 2,
    question:
      'ある交差点の 1 日の事故件数はポアソン分布に従うとする。50 日間の平均は 3.2 件だった。最尤推定量の漸近正規性を使った、$\\lambda$ の近似 95% 信頼区間 $\\hat{\\lambda} \\pm 1.96/\\sqrt{nI(\\hat{\\lambda})}$ の**上限**を求めよ。',
    answerValue: 3.7,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      'ポアソン分布では $\\hat{\\lambda} = \\bar{x} = 3.2$、$I(\\lambda) = 1/\\lambda$ なので、標準誤差は $\\frac{1}{\\sqrt{nI(\\hat{\\lambda})}} = \\sqrt{\\frac{\\hat{\\lambda}}{n}} = \\sqrt{\\frac{3.2}{50}} = \\sqrt{0.064} \\approx 0.2530$。\n上限：$3.2 + 1.96 \\times 0.2530 \\approx 3.2 + 0.4958 = 3.6958 \\approx 3.70$。\nルートをとり忘れて $3.2 + 1.96 \\times 0.064$ とすると 3.33 になります。',
  },
  {
    id: 'pre1-estimation-asymptotics-04',
    lesson: 'pre1-estimation-asymptotics',
    kind: 'numeric',
    level: 3,
    question:
      'データ 3、5、7、9 について、推定量 $\\hat{\\theta} = \\frac{1}{n}\\sum (x_i - \\bar{x})^2$（$n$ で割る分散）を考える。1 個ずつデータを抜いて計算し直すジャックナイフ法で、バイアスを補正した推定値 $n\\hat{\\theta} - (n-1)\\hat{\\theta}_{(\\cdot)}$ を求めよ。ここで $\\hat{\\theta}_{(\\cdot)}$ は、1 個抜いた $n - 1$ 個で計算した $\\hat{\\theta}$ の平均である。',
    answerValue: 6.67,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '全体：平均 6、偏差の2乗和 9 + 1 + 1 + 9 = 20 なので $\\hat{\\theta} = 20/4 = 5$。\n1 個ずつ抜く（残り 3 個を 3 で割る）：\n3 を抜く：5, 7, 9 → 平均 7、2乗和 8 → 8/3 ≒ 2.667\n5 を抜く：3, 7, 9 → 平均 19/3、2乗和 56/3 → 56/9 ≒ 6.222\n7 を抜く：3, 5, 9 → 同じく 56/9 ≒ 6.222\n9 を抜く：3, 5, 7 → 8/3 ≒ 2.667\n平均 $\\hat{\\theta}_{(\\cdot)} = 40/9 \\approx 4.444$。\n補正値：$4 \\times 5 - 3 \\times 4.444 = 20 - 13.333 = 6.667 \\approx 6.67$。\nこれは不偏分散 20/3 と一致します。バイアスの推定値は $3 \\times (4.444 - 5) \\approx -1.67$ です。',
  },
  {
    id: 'pre1-estimation-asymptotics-05',
    lesson: 'pre1-estimation-asymptotics',
    level: 2,
    question: '分布 $g$ と $f$ のカルバック・ライブラー情報量 $D(g\\|f) = E_g\\left[\\log\\frac{g(X)}{f(X)}\\right]$ について正しいものはどれか。',
    choices: [
      '$D(g\\|f) \\ge 0$ で、等号は $g$ と $f$ が同じ分布のときに限る。',
      '$D(g\\|f) = D(f\\|g)$ がつねに成り立つ。',
      '$D(g\\|f)$ は負の値をとることがある。',
      'カルバック・ライブラー情報量は三角不等式を満たすので、分布の間の距離である。',
      '最尤法は、本当の分布とのカルバック・ライブラー情報量を最大にするモデルを選ぶ方法と解釈できる。',
    ],
    answer: 0,
    explanation:
      'KL 情報量は非負で、0 になるのは 2 つの分布が同じときだけです（$\\log t \\le t - 1$ から示せる）。\n一般に $D(g\\|f) \\ne D(f\\|g)$ で対称ではなく、三角不等式も成り立たないので距離ではありません。\n最尤法は対数尤度（$E_g[\\log f]$ の推定）を最大にする＝KL 情報量を**最小**にするモデルを選ぶ方法と解釈できます。',
  },
  {
    id: 'pre1-estimation-asymptotics-06',
    lesson: 'pre1-estimation-asymptotics',
    level: 3,
    question:
      '密度 $f(x;\\lambda) = \\lambda e^{-\\lambda x}$ の指数分布から 100 個のデータをとり、標本平均 0.5 を得た。$\\lambda$ の最尤推定量の漸近正規性（1 個分のフィッシャー情報量は $1/\\lambda^2$）による、$\\lambda$ の近似 95% 信頼区間はどれか。',
    choices: ['[0.402, 0.598]', '[1.961, 2.039]', '[1.723, 2.277]', '[1.608, 2.392]', '[1.671, 2.329]'],
    answer: 3,
    explanation:
      '最尤推定値は $\\hat{\\lambda} = 1/\\bar{x} = 2$。漸近分散は $\\frac{1}{nI(\\lambda)} = \\frac{\\lambda^2}{n}$ なので、標準誤差は $\\hat{\\lambda}/\\sqrt{n} = 2/10 = 0.2$。\n区間：$2 \\pm 1.96 \\times 0.2 = 2 \\pm 0.392$ より [1.608, 2.392]。\n[0.402, 0.598] は平均の区間、[1.961, 2.039] は標準誤差を $\\hat{\\lambda}/n$ とした誤り、[1.723, 2.277] はポアソン分布の式 $\\sqrt{\\hat{\\lambda}/n}$ を使った誤り、[1.671, 2.329] は 1.96 の代わりに 1.645 を使った誤りです。',
  },
  {
    id: 'pre1-estimation-asymptotics-07',
    lesson: 'pre1-estimation-asymptotics',
    kind: 'numeric',
    level: 2,
    question:
      '本当は表の確率 0.5 のコイン（分布 $g$）を、表の確率 0.8 のモデル（分布 $f$）で表す。カルバック・ライブラー情報量 $D(g\\|f) = \\sum_x g(x)\\log\\dfrac{g(x)}{f(x)}$ を求めよ。log は自然対数で、$\\log 2 = 0.6931$、$\\log 5 = 1.6094$ を使ってよい。',
    answerValue: 0.223,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '表と裏の2つについて足します。\n$D = 0.5\\log\\frac{0.5}{0.8} + 0.5\\log\\frac{0.5}{0.2} = 0.5\\left(\\log\\frac{5}{8} + \\log\\frac{5}{2}\\right) = 0.5\\log\\frac{25}{16}$\n$\\log\\frac{25}{16} = 2\\log 5 - 4\\log 2 = 3.2188 - 2.7724 = 0.4464$\nよって $D \\approx 0.5 \\times 0.4464 = 0.2232 \\approx 0.223$。\n0.5 をかけ忘れると 0.446 になります。',
  },

  // ---------- 区間推定の構成 ----------
  {
    id: 'pre1-estimation-interval-01',
    lesson: 'pre1-estimation-interval',
    level: 1,
    question: '信頼区間を作るときに使う**枢軸量**の説明として正しいものはどれか。',
    choices: [
      'データだけから計算でき、母数を含まない量',
      '母数の不偏推定量のうち、分散が最小のもの',
      'データと母数の両方を含むが、その分布が母数によらない量',
      '信頼区間の幅の半分',
      '母数を含み、その分布も母数によって変わる量',
    ],
    answer: 2,
    explanation:
      '枢軸量（例：$\\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}}$）は母数 μ を含みますが、分布は N(0, 1) で μ によりません。だから % 点が表で決まり、不等式を μ について解けます。\n1 番目は統計量の説明です（母数を含まないと母数について解けない）。5 番目のように分布が母数で変わると、% 点が決められません。',
  },
  {
    id: 'pre1-estimation-interval-02',
    lesson: 'pre1-estimation-interval',
    kind: 'numeric',
    level: 2,
    question:
      '母標準偏差 $\\sigma = 8$ がわかっている正規母集団から 16 個とり、標本平均 50 を得た。母平均 $\\mu$ の 95% **上側**信頼限界（$\\mu \\le U$ となる U）を求めよ。標準正規分布の上側 5% 点は 1.645、上側 2.5% 点は 1.96 とする。',
    answerValue: 53.29,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '片側に 5% をまとめるので、上側 5% 点 1.645 を使います。\n$P\\left(\\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\ge -1.645\\right) = 0.95$ を μ について解くと $\\mu \\le \\bar{x} + 1.645\\frac{\\sigma}{\\sqrt{n}}$。\n$50 + 1.645 \\times \\frac{8}{4} = 50 + 3.29 = 53.29$。\n1.96 を使うと 53.92（両側 95% 区間の上端）になってしまいます。',
  },
  {
    id: 'pre1-estimation-interval-03',
    lesson: 'pre1-estimation-interval',
    level: 2,
    question:
      '$X_1, \\dots, X_n$ は独立に、密度 $\\lambda e^{-\\lambda x}$（$x \\ge 0$）の指数分布に従う。$\\lambda$ の信頼区間を作るための枢軸量 $2\\lambda\\sum_{i=1}^{n} X_i$ が従う分布はどれか。',
    choices: ['標準正規分布 $N(0, 1)$', '自由度 $n - 1$ の t 分布', '自由度 $n$ のカイ二乗分布', '自由度 $(2, 2n)$ の F 分布', '自由度 $2n$ のカイ二乗分布'],
    answer: 4,
    explanation:
      '$\\lambda X_i$ は率 1 の指数分布に従い、$2\\lambda X_i$ は率 1/2 の指数分布＝自由度 2 のカイ二乗分布です（自由度 2 のカイ二乗分布の密度は $\\frac{1}{2}e^{-x/2}$）。\n独立なカイ二乗分布の和は自由度が足されるので、$2\\lambda\\sum X_i \\sim \\chi^2(2n)$。分布が λ によらないので枢軸量になります。\n「n 個の和だから自由度 n」と考えるのは、1 個分の自由度が 2 であることを忘れた誤りです。',
  },
  {
    id: 'pre1-estimation-interval-04',
    lesson: 'pre1-estimation-interval',
    kind: 'numeric',
    level: 3,
    question:
      '密度 $\\lambda e^{-\\lambda x}$ の指数分布に従う待ち時間を 5 回測り、合計 $\\sum x_i = 20$ を得た。枢軸量 $2\\lambda\\sum X_i \\sim \\chi^2(10)$ を使って、$\\lambda$ の 95% 信頼区間の**上限**を求めよ。自由度 10 のカイ二乗分布の下側 2.5% 点は 3.247、上側 2.5% 点は 20.483 とする。',
    answerValue: 0.512,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '$P(3.247 \\le 2\\lambda\\sum X_i \\le 20.483) = 0.95$ の中を λ について解きます。\n$2\\sum x_i = 40$ なので $\\frac{3.247}{40} \\le \\lambda \\le \\frac{20.483}{40}$、つまり $0.081 \\le \\lambda \\le 0.512$。\n上限は 0.512。最尤推定値 $\\hat{\\lambda} = 5/20 = 0.25$ に対して右に長い区間です。\n2 をかけ忘れて 20 で割ると 1.024 になります。',
  },
  {
    id: 'pre1-estimation-interval-05',
    lesson: 'pre1-estimation-interval',
    level: 2,
    question: '信頼区間の被覆確率についての説明として正しいものはどれか。',
    choices: [
      '信頼係数 95% と表示された区間は、どんな作り方でも被覆確率がちょうど 0.95 になる。',
      '母比率のワルド型区間 $\\hat{p} \\pm 1.96\\sqrt{\\hat{p}(1-\\hat{p})/n}$ は正規近似を使うので、$p$ が 0 や 1 に近いと被覆確率が 0.95 を大きく下回ることがある。',
      '被覆確率とは、計算し終えた区間 [L, U] の中に母数が入っている確率のことである。',
      '二項分布のような離散分布でも、n を十分大きくすれば、すべての $p$ で被覆確率をちょうど 0.95 にできる。',
      '被覆確率は母数の値によらず一定である。',
    ],
    answer: 1,
    explanation:
      '被覆確率は「区間の作り方」が母数を含む確率で、母数の値ごとに決まります。近似を使う区間では名目の信頼係数からずれ、ワルド型は p が 0 や 1 に近いと大きく下回ります（例：n = 20、p = 0.1 で約 0.876）。\n3 番目：計算し終えた区間が母数を含むかどうかは決まっていて、確率の話ではありません。4 番目：表の回数が整数なので区間は n + 1 通りしかなく、被覆確率は p によって上下し、ちょうど 0.95 にはできません。',
  },
  {
    id: 'pre1-estimation-interval-06',
    lesson: 'pre1-estimation-interval',
    kind: 'numeric',
    level: 3,
    question:
      '区間 $[0, \\theta]$ の一様分布から 10 個とったところ、最大値は 8.0 だった。$Q = X_{(10)}/\\theta$ が $P(Q \\le q) = q^{10}$（$0 \\le q \\le 1$）に従うことを使い、$P(Q \\ge 0.05^{1/10}) = 0.95$ から作った $\\theta$ の 95% 信頼区間 $X_{(10)} \\le \\theta \\le X_{(10)}/0.05^{1/10}$ の上限を求めよ。$0.05^{1/10} = 0.7411$ とする。',
    answerValue: 10.79,
    tolerance: 0.01,
    unit: '小数第2位まで',
    explanation:
      '$P(Q \\ge c) = 1 - c^{10}$ なので、$c = 0.05^{1/10}$ なら確率は 1 − 0.05 = 0.95。\n$X_{(10)}/\\theta \\ge 0.7411$ を θ について解くと（両辺に θ をかけて 0.7411 で割る）$\\theta \\le X_{(10)}/0.7411$。\n$8.0/0.7411 \\approx 10.79$。\n0.7411 をかけて 5.93 とするのは、不等式を解く向きをまちがえた誤りです（最大値 8.0 より小さい θ はありえない）。',
  },
  {
    id: 'pre1-estimation-interval-07',
    lesson: 'pre1-estimation-interval',
    level: 2,
    question:
      '正規母集団から 10 個とり、不偏分散 $s^2 = 4$ を得た。母分散 $\\sigma^2$ の 95% 上側信頼限界（$\\sigma^2 \\le U$ となる U）に最も近いものはどれか。自由度 9 のカイ二乗分布の下側 5% 点は 3.325、上側 5% 点は 16.919、下側 2.5% 点は 2.700 とする。',
    choices: ['2.13', '12.03', '13.33', '10.83', '16.92'],
    answer: 3,
    explanation:
      '$\\frac{(n-1)s^2}{\\sigma^2} \\sim \\chi^2(9)$ を使います。σ² の上限は、枢軸量が小さい側（下側 5%）で決まります。\n$P\\left(\\frac{9 \\times 4}{\\sigma^2} \\ge 3.325\\right) = 0.95$ を σ² について解くと $\\sigma^2 \\le \\frac{36}{3.325} \\approx 10.83$。\n2.13 は上側 5% 点 16.919 で割った値（下側信頼限界）、13.33 は両側用の 2.5% 点 2.700 を使った値、12.03 は n − 1 の代わりに n = 10 を使った値（40/3.325）、16.92 は % 点そのものです。',
  },
]
