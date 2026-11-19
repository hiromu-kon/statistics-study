import type { Problem } from '../../types'

export const problems: Problem[] = [
  // ---------- 離散型分布の整理と多項分布 ----------
  {
    id: 'pre1-distributions-discrete-01',
    lesson: 'pre1-distributions-discrete',
    level: 1,
    question:
      '二項分布 $Bin(n, p)$ で、平均 $np = \\lambda$ を一定に保ったまま n を大きく（したがって p を小さく）していくと、ある分布に近づく。その分布はどれか。',
    choices: ['幾何分布', '超幾何分布', 'ポアソン分布 $Po(\\lambda)$', '負の二項分布', '離散一様分布'],
    answer: 2,
    explanation:
      '「機会はたくさんあるが、1回あたりにはめったに起こらない」出来事の回数は、ポアソン分布に近づきます。\n積率母関数で確かめると、$(1 + \\lambda(e^t - 1)/n)^n \\to e^{\\lambda(e^t - 1)}$ で、右辺は $Po(\\lambda)$ の積率母関数です。\n超幾何分布は「くじの本数 N を大きくすると二項分布に近づく」側の分布、負の二項分布は幾何分布の和です。',
  },
  {
    id: 'pre1-distributions-discrete-02',
    lesson: 'pre1-distributions-discrete',
    level: 2,
    kind: 'numeric',
    question:
      'ある商品の評価は「良い」「ふつう」「悪い」の3種類で、1人の客がそれぞれを選ぶ確率は 0.5、0.3、0.2 である。客 6 人が独立に評価したとき、「良い」が 3 人、「ふつう」が 2 人、「悪い」が 1 人になる確率を求めよ。',
    answerValue: 0.135,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '多項分布の確率関数を使います。\n並べ方の数：$\\frac{6!}{3!\\,2!\\,1!} = \\frac{720}{12} = 60$ 通り。\n1つの並べ方の確率：$0.5^3 \\times 0.3^2 \\times 0.2 = 0.125 \\times 0.09 \\times 0.2 = 0.00225$。\nかけて $60 \\times 0.00225 = 0.135$。\n並べ方を ${}_{6}C_{3} = 20$ だけにすると 0.045 になってしまいます（「ふつう」と「悪い」の並べ方を数え忘れている）。',
  },
  {
    id: 'pre1-distributions-discrete-03',
    lesson: 'pre1-distributions-discrete',
    level: 2,
    question:
      '1回の試行で結果 A, B, C がそれぞれ確率 0.2、0.3、0.5 で起こる。独立に 50 回くり返し、A, B が起こった回数を $X_A$、$X_B$ とする。共分散 $\\mathrm{Cov}(X_A, X_B)$ はいくらか。',
    choices: ['$3$', '$0$', '$-0.06$', '$-1.5$', '$-3$'],
    answer: 4,
    explanation:
      '$(X_A, X_B, X_C)$ は多項分布に従い、$\\mathrm{Cov}(X_i, X_j) = -np_ip_j$ です。\n$-50 \\times 0.2 \\times 0.3 = -3$。\n合計が 50 回に決まっているので、A が多いと B は少なくなりがち（負の共分散）。\n「0」は各成分を独立とみなした誤り、「−0.06」は n をかけ忘れた場合、「3」は符号の誤りです。',
  },
  {
    id: 'pre1-distributions-discrete-04',
    lesson: 'pre1-distributions-discrete',
    level: 2,
    question: '確率変数 X の積率母関数が $M(t) = (0.7 + 0.3e^t)^{10}$ である。X の分散はいくらか。',
    choices: ['$3$', '$2.1$', '$0.21$', '$7$', '$30$'],
    answer: 1,
    explanation:
      '二項分布 $Bin(n, p)$ の積率母関数は $(1 - p + pe^t)^n$ なので、形を見くらべて $n = 10,\\ p = 0.3$ の二項分布です（積率母関数が同じなら分布も同じ）。\n分散は $np(1-p) = 10 \\times 0.3 \\times 0.7 = 2.1$。\n「3」は平均 $np$、「0.21」は1回分（ベルヌーイ分布）の分散、「7」は $n(1-p)$ です。',
  },
  {
    id: 'pre1-distributions-discrete-05',
    lesson: 'pre1-distributions-discrete',
    level: 2,
    question:
      '1回の試行で結果 1, 2, 3 がそれぞれ確率 0.3、0.2、0.5 で起こる。独立に 20 回くり返し、結果 1, 2 が起こった回数を $X_1$、$X_2$ とする。$V(X_1 + X_2)$ はいくらか。',
    choices: ['$7.4$', '$4.2$', '$3.2$', '$5$', '$9.8$'],
    answer: 3,
    explanation:
      '「結果1か2」と「結果3」に分けると、$X_1 + X_2$ は $Bin(20,\\ 0.3 + 0.2) = Bin(20, 0.5)$ に従うので、$V(X_1 + X_2) = 20 \\times 0.5 \\times 0.5 = 5$。\n分散の和の式で確かめると、$V(X_1) = 20 \\times 0.3 \\times 0.7 = 4.2$、$V(X_2) = 20 \\times 0.2 \\times 0.8 = 3.2$、$\\mathrm{Cov}(X_1, X_2) = -20 \\times 0.3 \\times 0.2 = -1.2$ で、$4.2 + 3.2 + 2 \\times (-1.2) = 5$。\n「7.4」は共分散を忘れた場合、「9.8」は共分散の符号を逆にした場合です。',
  },
  {
    id: 'pre1-distributions-discrete-06',
    lesson: 'pre1-distributions-discrete',
    level: 3,
    question:
      '1回の試行で結果 A, B, C がそれぞれ確率 0.5、0.3、0.2 で起こる。独立に 10 回くり返し、A, B が起こった回数を $X_A$、$X_B$ とする。$X_A = 6$ であったと分かったとき、$X_B$ の条件つき期待値 $E(X_B \\mid X_A = 6)$ はいくらか。',
    choices: ['$2.4$', '$3$', '$1.2$', '$4$', '$1.6$'],
    answer: 0,
    explanation:
      'A 以外が起こったのは残りの $10 - 6 = 4$ 回です。その4回はそれぞれ B か C で、A でないという条件のもとで B である確率は $0.3/(0.3 + 0.2) = 0.6$。\nしたがって $X_B \\mid X_A = 6 \\sim Bin(4, 0.6)$ で、期待値は $4 \\times 0.6 = 2.4$。\n「3」は条件を使わない平均 $10 \\times 0.3$、「1.2」は確率を 0.3 のまま使った $4 \\times 0.3$、「1.6」は C の確率 $0.2/0.5 = 0.4$ を使った場合です。',
  },

  // ---------- ガンマ・ベータ・コーシー・対数正規分布 ----------
  {
    id: 'pre1-distributions-continuous-01',
    lesson: 'pre1-distributions-continuous',
    level: 1,
    question: '次の分布のうち、期待値（平均）が存在しないものはどれか。',
    choices: ['ガンマ分布 $Ga(2, 1)$', 'ベータ分布 $Be(0.5, 0.5)$', '対数正規分布 $LN(0, 1)$', '標準コーシー分布', '自由度 3 の t 分布'],
    answer: 3,
    explanation:
      'コーシー分布はすそが厚く、$\\int |x| f(x)\\,dx$ が無限大になるので、平均も分散も存在しません。\nベータ分布は 0〜1 の値しかとらないので平均は必ず存在し、ガンマ分布・対数正規分布も平均が存在します（対数正規分布なら $e^{1/2}$）。\nt 分布は自由度が 2 以上なら平均 0 が存在します。平均が存在しないのは自由度 1 の t 分布（= コーシー分布）です。',
  },
  {
    id: 'pre1-distributions-continuous-02',
    lesson: 'pre1-distributions-continuous',
    level: 2,
    question:
      'ある窓口には、客が1分あたり平均 0.5 人の割合でばらばらに（ポアソン過程にしたがって）来る。開店から3人目の客が来るまでの時間 T（分）の期待値と分散の組として正しいものはどれか。',
    choices: ['期待値 6 分、分散 12', '期待値 6 分、分散 36', '期待値 1.5 分、分散 0.75', '期待値 6 分、分散 6', '期待値 2 分、分散 4'],
    answer: 0,
    explanation:
      '客と客の間の時間は、平均 $1/0.5 = 2$ 分の指数分布で、たがいに独立です。T はその3つの和なので、ガンマ分布 $Ga(3, 2)$（形状 3、尺度 2）に従います。\n期待値 $k\\theta = 3 \\times 2 = 6$、分散 $k\\theta^2 = 3 \\times 4 = 12$。\n「1.5 分、0.75」は率 0.5 を尺度と取りちがえた場合、「2 分、4」は1人目までの時間（指数分布1つ）、「分散 36」は期待値を2乗した誤りです。',
  },
  {
    id: 'pre1-distributions-continuous-03',
    lesson: 'pre1-distributions-continuous',
    level: 2,
    kind: 'numeric',
    question: '確率変数 X がベータ分布 $Be(2, 3)$ に従うとき、X の標準偏差を求めよ。',
    answerValue: 0.2,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      'ベータ分布 $Be(a, b)$ の分散は $\\frac{ab}{(a+b)^2(a+b+1)}$ です。\n$a = 2,\\ b = 3$ を入れると $\\frac{6}{25 \\times 6} = \\frac{1}{25} = 0.04$。\n標準偏差はそのルートで $\\sqrt{0.04} = 0.2$。\n（平均は $a/(a+b) = 0.4$ です。）',
  },
  {
    id: 'pre1-distributions-continuous-04',
    lesson: 'pre1-distributions-continuous',
    level: 2,
    question: '確率変数 X の密度関数が $f(x) = 4x e^{-2x}\\ (x > 0)$ で与えられている。X の平均と分散の組として正しいものはどれか。',
    choices: ['平均 4、分散 8', '平均 2、分散 2', '平均 1、分散 0.5', '平均 0.5、分散 0.25', '平均 1、分散 1'],
    answer: 2,
    explanation:
      '$x^{k-1}e^{-x/\\theta}$ の形を見ると、$k - 1 = 1$ より形状 $k = 2$、$e^{-2x} = e^{-x/(1/2)}$ より尺度 $\\theta = 1/2$（率で書けば $\\lambda = 2$）のガンマ分布です。\n確認：$\\frac{1}{\\Gamma(2)\\theta^2} = \\frac{1}{1 \\times 1/4} = 4$ で係数も合います。\n平均 $k\\theta = 2 \\times 0.5 = 1$、分散 $k\\theta^2 = 2 \\times 0.25 = 0.5$。\n「平均 4、分散 8」は 2 を尺度と読んだ場合です。パラメータの流儀に迷ったら、密度の式で確かめます。',
  },
  {
    id: 'pre1-distributions-continuous-05',
    lesson: 'pre1-distributions-continuous',
    level: 2,
    question:
      'ある町の世帯の年収 X（万円）について、$\\log X$ が正規分布 $N(6, 0.8)$（平均 6、分散 0.8）に従うとする。X の平均は X の中央値の何倍か。必要なら $e^{0.4} \\approx 1.492$、$e^{0.8} \\approx 2.226$、$e^{2} \\approx 7.389$、$e^{2.4} \\approx 11.02$ を使ってよい。',
    choices: ['1 倍（平均と中央値は等しい）', '約 2.226 倍', '約 7.389 倍', '約 11.02 倍', '約 1.492 倍'],
    answer: 4,
    explanation:
      '対数正規分布の中央値は $e^{\\mu}$、平均は $e^{\\mu + \\sigma^2/2}$ です。\n比は $e^{\\sigma^2/2} = e^{0.8/2} = e^{0.4} \\approx 1.492$ 倍（μ によらない）。\n「1 倍」は左右対称の正規分布と同じだと考えた誤り、「2.226 倍」は $\\sigma^2/2$ ではなく $\\sigma^2$ を使った場合です。右にすそが長いので、平均は中央値より大きくなります。',
  },
  {
    id: 'pre1-distributions-continuous-06',
    lesson: 'pre1-distributions-continuous',
    level: 3,
    question:
      '$X_1, \\dots, X_{100}$ が独立に標準コーシー分布（密度 $\\frac{1}{\\pi(1+x^2)}$）に従うとき、標本平均 $\\bar{X}$ について $P(|\\bar{X}| > 1)$ はいくらか。標準コーシー分布の累積分布関数は $F(x) = \\frac{1}{2} + \\frac{1}{\\pi}\\arctan x$ で、$\\arctan 1 = \\pi/4$ である。',
    choices: ['ほぼ 0（n が大きいので）', '$0.5$', '$0.3173$', '$0.25$', '$0.0027$'],
    answer: 1,
    explanation:
      '独立な標準コーシー分布の標本平均は、n によらず**また標準コーシー分布**に従います（平均が存在しないので、大数の法則も中心極限定理も使えない）。\nだから $P(|\\bar{X}| > 1) = 2(1 - F(1)) = 2\\left(1 - \\frac{1}{2} - \\frac{1}{4}\\right) = 0.5$。\n「ほぼ 0」は中心極限定理が使えると考えた誤り。「0.3173」は $\\bar{X}$ を標準正規分布とみなした $P(|Z| > 1)$、「0.0027」は $P(|Z| > 3)$ です。',
  },
  {
    id: 'pre1-distributions-continuous-07',
    lesson: 'pre1-distributions-continuous',
    level: 3,
    kind: 'numeric',
    question:
      '$X_1, X_2, X_3$ は独立に、平均 2 の指数分布に従う。$S = X_1 + X_2 + X_3$ について、$P(S > c) = 0.05$ となる c を、カイ二乗分布表を使って求めよ。',
    answerValue: 12.592,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '平均 2 の指数分布は $Ga(1, 2)$ で、尺度が同じなので和 S は $Ga(3, 2)$（形状が足し算）に従います。\n$\\chi^2(m) = Ga(m/2, 2)$ なので、$Ga(3, 2) = \\chi^2(6)$。\nしたがって c は自由度 6 のカイ二乗分布の上側 5% 点 $\\chi^2_{0.05}(6) = 12.592$。答えは 12.59。\n（確かめ：$\\chi^2(6)$ の平均 6 は $E(S) = 3 \\times 2 = 6$ と一致します。）',
  },

  // ---------- 多変量正規分布 ----------
  {
    id: 'pre1-distributions-mvn-01',
    lesson: 'pre1-distributions-mvn',
    level: 1,
    question: '$(X, Y)$ が2変量正規分布に従うとき、正しいものはどれか。',
    choices: [
      '相関係数が 0 でも、X と Y が独立とは限らない',
      'X だけの分布（周辺分布）は、正規分布とは限らない',
      'X = x が分かったときの Y の条件つき分散は、x が大きいほど大きい',
      'X と Y が独立かどうかは、相関係数だけからは決まらない',
      '相関係数が 0 なら、X と Y は独立である',
    ],
    answer: 4,
    explanation:
      '2変量正規分布では、相関係数が 0 なら密度が X の密度と Y の密度の積に分かれるので、**無相関なら独立**です（一般の分布では成り立たない）。\n周辺分布は必ず正規分布、条件つき分散 $\\sigma_Y^2(1 - \\rho^2)$ は x によりません。\n「独立かどうかは相関係数だけからは決まらない」は一般の分布の話で、2変量正規分布では相関係数 0 ⇔ 独立です。',
  },
  {
    id: 'pre1-distributions-mvn-02',
    lesson: 'pre1-distributions-mvn',
    level: 2,
    kind: 'numeric',
    question:
      '2つのテストの得点 $(X, Y)$ が2変量正規分布に従い、X の平均 50・標準偏差 10、Y の平均 60・標準偏差 15、相関係数 0.6 である。X = 65 のときの Y の条件つき期待値 $E(Y \\mid X = 65)$ を求めよ。',
    answerValue: 73.5,
    tolerance: 0.05,
    unit: '小数第1位まで',
    explanation:
      '条件つき期待値は $E(Y \\mid X = x) = \\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X)$ です。\n傾き：$0.6 \\times \\frac{15}{10} = 0.9$。X の平均からのずれ：$65 - 50 = 15$。\n$60 + 0.9 \\times 15 = 60 + 13.5 = 73.5$。\n$\\sigma_Y/\\sigma_X$ をかけ忘れると $60 + 0.6 \\times 15 = 69$ になります。',
  },
  {
    id: 'pre1-distributions-mvn-03',
    lesson: 'pre1-distributions-mvn',
    level: 2,
    question:
      '$(X, Y)$ が2変量正規分布に従い、X の標準偏差 5、Y の標準偏差 20、相関係数 0.8 である。X = x と分かったときの Y の条件つき標準偏差はいくらか。',
    choices: ['$16$', '$12$', '$20$', '$7.2$', '$4$'],
    answer: 1,
    explanation:
      '条件つき分散は $\\sigma_Y^2(1 - \\rho^2) = 400 \\times (1 - 0.64) = 400 \\times 0.36 = 144$ で、x によりません。\n標準偏差はそのルートで $\\sqrt{144} = 12$（$= 20 \\times \\sqrt{0.36} = 20 \\times 0.6$）。\n「16」は $\\rho\\sigma_Y$、「7.2」はルートをとらずに $\\sigma_Y(1 - \\rho^2)$ とした場合、「4」は $\\sigma_Y(1 - \\rho)$ とした場合です。X の標準偏差は条件つき分散には出てきません。',
  },
  {
    id: 'pre1-distributions-mvn-04',
    lesson: 'pre1-distributions-mvn',
    level: 2,
    question:
      '$(X_1, X_2)$ が分散共分散行列 $\\Sigma = \\begin{pmatrix} 4 & 1 \\\\ 1 & 9 \\end{pmatrix}$ の2変量正規分布に従う。$Y_1 = X_1 + X_2$、$Y_2 = X_1 - X_2$ とするとき、$(Y_1, Y_2)$ の分散共分散行列はどれか。',
    choices: [
      '$\\begin{pmatrix} 13 & -5 \\\\ -5 & 13 \\end{pmatrix}$',
      '$\\begin{pmatrix} 13 & 0 \\\\ 0 & 13 \\end{pmatrix}$',
      '$\\begin{pmatrix} 15 & 5 \\\\ 5 & 11 \\end{pmatrix}$',
      '$\\begin{pmatrix} 15 & -5 \\\\ -5 & 11 \\end{pmatrix}$',
      '$\\begin{pmatrix} 11 & -5 \\\\ -5 & 15 \\end{pmatrix}$',
    ],
    answer: 3,
    explanation:
      '$A = \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$ として $A\\Sigma A^{\\top}$ を計算します。成分ごとに求めると：\n$V(Y_1) = 4 + 9 + 2 \\times 1 = 15$\n$V(Y_2) = 4 + 9 - 2 \\times 1 = 11$\n$\\mathrm{Cov}(Y_1, Y_2) = V(X_1) - \\mathrm{Cov}(X_1, X_2) + \\mathrm{Cov}(X_2, X_1) - V(X_2) = 4 - 9 = -5$\n共分散 1 を無視すると対角が 13 になり、和と差を取りちがえると対角の 15 と 11 が入れかわります。',
  },
  {
    id: 'pre1-distributions-mvn-05',
    lesson: 'pre1-distributions-mvn',
    level: 3,
    question:
      '$(X_1, X_2)$ が2変量正規分布に従うとき、和 $X_1 + X_2$ と差 $X_1 - X_2$ が独立になるための必要十分条件はどれか。',
    choices: [
      '$\\mathrm{Cov}(X_1, X_2) = 0$',
      '$E(X_1) = E(X_2)$',
      '$V(X_1) = V(X_2)$',
      'どんな場合でも独立になる',
      'どんな場合でも独立にならない',
    ],
    answer: 2,
    explanation:
      '和と差 $(X_1 + X_2, X_1 - X_2)$ は線形変換なのでまた2変量正規分布に従い、独立 ⇔ 共分散が 0 です。\n$\\mathrm{Cov}(X_1 + X_2, X_1 - X_2) = V(X_1) - \\mathrm{Cov}(X_1, X_2) + \\mathrm{Cov}(X_2, X_1) - V(X_2) = V(X_1) - V(X_2)$。\nよって独立 ⇔ $V(X_1) = V(X_2)$。$X_1$ と $X_2$ の共分散は打ち消しあうので関係なく、平均も関係ありません。',
  },
  {
    id: 'pre1-distributions-mvn-06',
    lesson: 'pre1-distributions-mvn',
    level: 3,
    kind: 'numeric',
    question:
      '$\\boldsymbol{X} = (X_1, X_2, X_3)^{\\top}$ が平均ベクトル $\\boldsymbol{0}$、分散共分散行列 $\\Sigma = \\begin{pmatrix} 1 & 0.5 & 0 \\\\ 0.5 & 1 & 0.5 \\\\ 0 & 0.5 & 1 \\end{pmatrix}$ の3変量正規分布に従う。$Y = X_1 - 2X_2 + X_3$ の分散を求めよ。',
    answerValue: 2,
    tolerance: 0.01,
    unit: '整数で',
    explanation:
      '$\\boldsymbol{a} = (1, -2, 1)^{\\top}$ として $V(Y) = \\boldsymbol{a}^{\\top}\\Sigma\\boldsymbol{a}$ を計算します。\n分散の部分：$1^2 \\times 1 + (-2)^2 \\times 1 + 1^2 \\times 1 = 6$\n共分散の部分：$2 \\times [1 \\times (-2) \\times 0.5 + 1 \\times 1 \\times 0 + (-2) \\times 1 \\times 0.5] = 2 \\times (-1 + 0 - 1) = -4$\n合計 $6 - 4 = 2$。Y は $N(0, 2)$ に従います。\n共分散を忘れると 6 になります。',
  },

  // ---------- 標本分布と順序統計量 ----------
  {
    id: 'pre1-distributions-sampling-01',
    lesson: 'pre1-distributions-sampling',
    level: 1,
    question: '確率変数 T が自由度 m の t 分布に従うとき、$T^2$ が従う分布はどれか。',
    choices: ['$F(1, m)$', '$F(m, 1)$', '$\\chi^2(m)$', '$\\chi^2(1)$', '$t(m^2)$'],
    answer: 0,
    explanation:
      '$T = Z/\\sqrt{V/m}$（Z は標準正規、V は独立な $\\chi^2(m)$）なので、$T^2 = \\frac{Z^2/1}{V/m}$。\n分子の $Z^2$ は $\\chi^2(1)$ なので、F 分布の定義そのままに $F(1, m)$（分子の自由度 1、分母の自由度 m）です。\n自由度の順番を逆にした $F(m, 1)$ は別の分布です。',
  },
  {
    id: 'pre1-distributions-sampling-02',
    lesson: 'pre1-distributions-sampling',
    level: 2,
    question:
      '$X_1, X_2, X_3, X_4$ は独立で、$X_i \\sim N(\\mu_i, 1)$、$(\\mu_1, \\mu_2, \\mu_3, \\mu_4) = (1, -1, 1, -1)$ とする。$W = X_1^2 + X_2^2 + X_3^2 + X_4^2$ の平均と分散の組として正しいものはどれか。',
    choices: ['平均 4、分散 8', '平均 6、分散 16', '平均 8、分散 16', '平均 8、分散 24', '平均 4、分散 24'],
    answer: 3,
    explanation:
      'W は自由度 4、非心度 $\\lambda = \\sum\\mu_i^2 = 1 + 1 + 1 + 1 = 4$ の非心カイ二乗分布に従います。\n平均 $m + \\lambda = 4 + 4 = 8$（$E(X_i^2) = 1 + \\mu_i^2 = 2$ を4つ足しても同じ）。\n分散 $2(m + 2\\lambda) = 2 \\times (4 + 8) = 24$。\n「平均 4、分散 8」は μ を無視して $\\chi^2(4)$ とした場合。$\\mu_i$ の符号は2乗すると消えるので、打ち消しあって λ = 0 になるわけではありません。',
  },
  {
    id: 'pre1-distributions-sampling-03',
    lesson: 'pre1-distributions-sampling',
    level: 2,
    kind: 'numeric',
    question: '$U_1, U_2, U_3$ は独立に一様分布 $U(0, 1)$ に従う。最大値 $\\max(U_1, U_2, U_3)$ が 0.8 以下になる確率を求めよ。',
    answerValue: 0.512,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '最大値が 0.8 以下 ⇔ 3つとも 0.8 以下。独立なので確率はかけ算できます。\n$P(\\max \\le 0.8) = P(U_1 \\le 0.8)P(U_2 \\le 0.8)P(U_3 \\le 0.8) = 0.8^3 = 0.512$。\n$3 \\times 0.8$ のように足し算で考えると 1 を超えてしまいます。$1 - 0.2^3 = 0.992$ は「少なくとも1つが 0.8 以下」、つまり最小値が 0.8 以下になる確率です。',
  },
  {
    id: 'pre1-distributions-sampling-04',
    lesson: 'pre1-distributions-sampling',
    level: 2,
    question:
      '寿命が平均 6 年の指数分布に独立に従う部品 3 個を直列につないだ装置は、どれか1つが壊れると止まる。装置の寿命の期待値はいくらか。',
    choices: ['18 年', '6 年', '2 年', '11 年', '0.5 年'],
    answer: 2,
    explanation:
      '装置の寿命は3個の寿命の**最小値**です。$P(\\min > x) = P(X > x)^3 = (e^{-x/6})^3 = e^{-x/2}$ なので、最小値は平均 2 年の指数分布に従います。\n期待値は 2 年。\n「18 年」は寿命の合計、「11 年」は最大値の期待値 $6 \\times (1 + 1/2 + 1/3)$（並列につないだ場合）です。',
  },
  {
    id: 'pre1-distributions-sampling-05',
    lesson: 'pre1-distributions-sampling',
    level: 2,
    question: '一様分布 $U(0, 1)$ から独立に 5 個取り、小さい順に並べたときの 3 番目の値（標本の中央値）が従う分布はどれか。',
    choices: ['$U(0, 1)$', '$Be(3, 2)$', '$Be(2, 3)$', '$N(0.5,\\ 1/12)$', '$Be(3, 3)$'],
    answer: 4,
    explanation:
      '一様分布の k 番目の順序統計量は $Be(k,\\ n - k + 1)$ に従います。\n$n = 5,\\ k = 3$ なので $Be(3,\\ 5 - 3 + 1) = Be(3, 3)$。平均は $3/6 = 0.5$ で、真ん中の値らしく 0.5 を中心に左右対称です。\n密度で考えると「3番目が x の近く」は「下に2個、近くに1個、上に2個」なので $x^2(1-x)^2$ に比例し、$Be(3, 3)$ の形になります。',
  },
  {
    id: 'pre1-distributions-sampling-06',
    lesson: 'pre1-distributions-sampling',
    level: 3,
    question:
      '正規母集団 $N(\\mu, \\sigma^2)$（σ は未知）から大きさ 16 の標本を取り、$H_0: \\mu = \\mu_0$ を統計量 $T = (\\bar{X} - \\mu_0)/(s/\\sqrt{16})$ で検定する（s は不偏分散の平方根）。本当の平均が $\\mu = \\mu_0 + 0.5\\sigma$ のとき、T が従う分布はどれか。',
    choices: ['$t(15)$', '自由度 15、非心度 2 の非心 t 分布', '自由度 16、非心度 0.5 の非心 t 分布', '自由度 15、非心度 8 の非心 t 分布', '$N(2, 1)$'],
    answer: 1,
    explanation:
      '分子を σ で標準化すると $(\\bar{X} - \\mu_0)/(\\sigma/\\sqrt{16})$ は $N(\\delta, 1)$ で、$\\delta = \\frac{0.5\\sigma}{\\sigma/4} = 0.5 \\times \\sqrt{16} = 2$。\n分母の $s/\\sigma$ は自由度 15 の χ² から作られるので、T は自由度 15、非心度 2 の非心 t 分布に従います。\n「t(15)」は帰無仮説が正しいときの分布、「非心度 8」は $\\sqrt{n}$ ではなく n をかけた誤り、「N(2, 1)」は σ が分かっている z 検定の場合です。',
  },
  {
    id: 'pre1-distributions-sampling-07',
    lesson: 'pre1-distributions-sampling',
    level: 3,
    kind: 'numeric',
    question:
      '自由度 15 の t 分布の上側 2.5% 点は $t_{0.025}(15) = 2.131$ である。この値を使って、F 分布の上側 5% 点 $F_{0.05}(1, 15)$ を求めよ。',
    answerValue: 4.541,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '$T \\sim t(15)$ なら $T^2 \\sim F(1, 15)$ です。\n$P(T^2 > c) = P(T > \\sqrt{c}) + P(T < -\\sqrt{c}) = 2P(T > \\sqrt{c})$ なので、$P(T^2 > c) = 0.05$ となるのは $\\sqrt{c} = t_{0.025}(15)$ のとき。\n$F_{0.05}(1, 15) = 2.131^2 \\approx 4.54$。\n片側の $t_{0.05}(15) = 1.753$ を2乗すると 3.07 になってしまいます。$T^2$ が大きいのは T が正にも負にも大きいときだからです。',
  },
]
