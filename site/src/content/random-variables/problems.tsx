import type { Problem } from '../../types'

export const problems: Problem[] = [
  // ---------- 確率変数と確率分布 ----------
  {
    id: 'random-variables-intro-01',
    lesson: 'random-variables-intro',
    level: 1,
    question: '次のうち、**連続型**の確率変数として扱うのが自然なものはどれか。',
    choices: ['サイコロを1回投げたときの出た目', 'コインを10回投げたときの表の回数', '1日にお店に来た客の人数', 'バス停でバスが来るまでの待ち時間', '10個の製品の中の不良品の個数'],
    answer: 3,
    explanation:
      '待ち時間は 3分、3.5分、3.27分…と、ある範囲のどんな値でもとれるので連続型です。\nほかの4つは 0, 1, 2, … のように「数えられる」とびとびの値しかとらないので離散型です。',
  },
  {
    id: 'random-variables-intro-02',
    lesson: 'random-variables-intro',
    level: 2,
    question:
      '確率変数 $X$ の確率分布が次のとおりであるとき、$P(X \\ge 3)$ はいくらか。\n$P(X = 1) = 0.1$、$P(X = 2) = 0.3$、$P(X = 3) = a$、$P(X = 4) = 0.2$',
    choices: ['$0.2$', '$0.4$', '$0.5$', '$0.6$', '$0.9$'],
    answer: 3,
    explanation:
      '確率の合計は1なので、$0.1 + 0.3 + a + 0.2 = 1$ より $a = 0.4$。\n$P(X \\ge 3) = P(X = 3) + P(X = 4) = 0.4 + 0.2 = 0.6$。\n$0.4$ は $a$ の値そのもの（$X = 3$ だけ）で、$X = 4$ を足し忘れています。',
  },
  {
    id: 'random-variables-intro-03',
    lesson: 'random-variables-intro',
    level: 2,
    question: 'サイコロの出た目を $X$ とし、累積分布関数を $F(x) = P(X \\le x)$ とする。$F(4.5)$ の値はいくらか。',
    choices: ['$0$', '$\\frac{1}{6}$', '$\\frac{1}{2}$', '$\\frac{2}{3}$', '$\\frac{5}{6}$'],
    answer: 3,
    explanation:
      '$F(4.5)$ は「出た目が4.5以下になる確率」です。4.5以下の目は 1, 2, 3, 4 の4つなので $F(4.5) = \\frac{4}{6} = \\frac{2}{3}$。\nサイコロの目に4.5はないので「ちょうど4.5の確率 = 0」と考えて $0$ を選ぶのは、$F(x)$ を $P(X = x)$ と取り違えた誤りです。',
  },
  {
    id: 'random-variables-intro-04',
    lesson: 'random-variables-intro',
    level: 3,
    question:
      '連続型確率変数 $X$ の確率密度関数が、$0 \\le x \\le 2$ で $f(x) = \\frac{x}{2}$、それ以外で $f(x) = 0$ である。$P(1 \\le X \\le 2)$ はいくらか。',
    choices: ['$0.25$', '$0.5$', '$1$', '$1.5$', '$0.75$'],
    answer: 4,
    explanation:
      'グラフは原点から点 $(2, 1)$ まで上がる直線で、下の部分は底辺2・高さ1の三角形（面積1）になります。\n$P(X \\le 1)$ は底辺1・高さ $f(1) = 0.5$ の三角形の面積で $\\frac{1 \\times 0.5}{2} = 0.25$。\nよって $P(1 \\le X \\le 2) = 1 - 0.25 = 0.75$。\n$1$ は $f(2)$ の高さで、確率ではありません（確率は面積）。$0.25$ は $P(X \\le 1)$ のほうです。',
  },
  {
    id: 'random-variables-intro-05',
    lesson: 'random-variables-intro',
    level: 3,
    question: 'サイコロを2個投げ、出た目の大きいほう（同じならその目）を $X$ とする。$P(X = 3)$ はいくらか。',
    choices: ['$\\frac{1}{6}$', '$\\frac{5}{36}$', '$\\frac{1}{4}$', '$\\frac{1}{9}$', '$\\frac{7}{36}$'],
    answer: 1,
    explanation:
      '累積分布関数を使うと楽です。「大きいほうが3以下」⇔「2個とも3以下」なので $F(3) = P(X \\le 3) = \\left(\\frac{3}{6}\\right)^2 = \\frac{9}{36}$。\n同様に $F(2) = \\left(\\frac{2}{6}\\right)^2 = \\frac{4}{36}$。\n$P(X = 3) = F(3) - F(2) = \\frac{9 - 4}{36} = \\frac{5}{36}$。\n（数えると (1,3), (2,3), (3,3), (3,2), (3,1) の5通り。）$\\frac{1}{4}$ は $F(3)$ で、「3以下」の確率です。',
  },
  {
    id: 'random-variables-intro-06',
    lesson: 'random-variables-intro',
    level: 2,
    question: '確率密度関数 $f(x)$ をもつ連続型確率変数 $X$ についての記述として、正しいものはどれか。ただし $a$ は定数とする。',
    choices: [
      '$P(X = a)$ は確率密度関数の値 $f(a)$ に等しい',
      '確率密度関数の値 $f(x)$ が1を超えることはない',
      '累積分布関数 $F(x) = P(X \\le x)$ は、$x$ が大きくなると減ることがある',
      '確率密度関数のグラフと横軸で囲まれた部分の面積は、$X$ のとりうる値の範囲の幅に等しい',
      '$P(X \\le a)$ と $P(X < a)$ は等しい',
    ],
    answer: 4,
    explanation:
      '連続型では、1点ちょうどの確率は幅0の区間の面積なので $P(X = a) = 0$ です。だから $P(X \\le a) = P(X < a) + P(X = a) = P(X < a)$ になります。\n$f(a)$ は曲線の高さで、確率ではありません（1番目は誤り）。高さは1を超えることもあります（たとえば0から0.5の範囲で一様なら高さは2）。\n$F(x)$ は左から確率を積み重ねたものなので減りません。全体の面積は、とりうる値の範囲の幅に関係なく必ず1です。',
  },

  // ---------- 期待値・分散・標準偏差 ----------
  {
    id: 'random-variables-expectation-variance-01',
    lesson: 'random-variables-expectation-variance',
    level: 1,
    question: '確率変数の期待値についての説明として、正しいものはどれか。',
    choices: [
      '最も起こりやすい値のことである',
      'とりうる値をすべて足して、値の個数で割ったものである',
      '必ずとりうる値のどれかと一致する',
      '確率分布の範囲（最大値 − 最小値）の半分である',
      'とりうる値にその確率をかけて足したもので、くり返したときの平均と考えられる',
    ],
    answer: 4,
    explanation:
      '期待値は $E(X) = \\sum x_i p_i$ で、試行を何度もくり返したときの平均にあたります。\n最も起こりやすい値（最頻値）とは限らず、サイコロの3.5のように、とりうる値と一致しないこともあります。\n「値を足して個数で割る」のは、すべての値の確率が等しいときだけ期待値と一致します。',
  },
  {
    id: 'random-variables-expectation-variance-02',
    lesson: 'random-variables-expectation-variance',
    level: 2,
    question:
      '1000本のくじがあり、1等（5000円）が2本、2等（500円）が20本、3等（100円）が100本、残りははずれ（0円）である。1本引いたときの賞金の期待値はいくらか。',
    choices: ['20円', '30円', '50円', '100円', '1400円'],
    answer: 1,
    explanation:
      '期待値 $= 5000 \\times \\frac{2}{1000} + 500 \\times \\frac{20}{1000} + 100 \\times \\frac{100}{1000} + 0 = 10 + 10 + 10 = 30$ 円。\n全部買ったときの賞金の合計 $10000 + 10000 + 10000 = 30000$ 円を1000本で割っても同じです。\n1400円は4種類の賞金をただ平均した $(5000 + 500 + 100 + 0) \\div 4$ で、本数（確率）の違いを無視しています。',
  },
  {
    id: 'random-variables-expectation-variance-03',
    lesson: 'random-variables-expectation-variance',
    level: 2,
    question:
      '確率変数 $X$ は 0, 1, 2 の値をとり、$P(X = 0) = 0.2$、$P(X = 1) = 0.5$、$P(X = 2) = 0.3$ である。$X$ の分散 $V(X)$ はいくらか。',
    choices: ['$0.49$', '$0.7$', '$1.1$', '$1.21$', '$1.7$'],
    answer: 0,
    explanation:
      '$E(X) = 0 \\times 0.2 + 1 \\times 0.5 + 2 \\times 0.3 = 1.1$。\n$E(X^2) = 0 \\times 0.2 + 1 \\times 0.5 + 4 \\times 0.3 = 1.7$。\n$V(X) = E(X^2) - \\{E(X)\\}^2 = 1.7 - 1.21 = 0.49$。\n$1.7$ は $E(X^2)$、$1.21$ は $\\{E(X)\\}^2$、$0.7$ は標準偏差 $\\sqrt{0.49}$ です。',
  },
  {
    id: 'random-variables-expectation-variance-04',
    lesson: 'random-variables-expectation-variance',
    level: 3,
    question:
      '確率変数 $X$ は 1, 2, 3 の値をとり、$P(X = 1) = 0.2$、$P(X = 2) = a$、$P(X = 3) = b$ である。$E(X) = 2.2$ のとき、$V(X)$ はいくらか。',
    choices: ['$0.36$', '$0.48$', '$0.56$', '$0.64$', '$5.4$'],
    answer: 2,
    explanation:
      '確率の合計から $0.2 + a + b = 1$、つまり $a + b = 0.8$。\n期待値から $1 \\times 0.2 + 2a + 3b = 2.2$、つまり $2a + 3b = 2.0$。\n$a = 0.8 - b$ を代入して $1.6 + b = 2.0$、$b = 0.4$、$a = 0.4$。\n$E(X^2) = 1 \\times 0.2 + 4 \\times 0.4 + 9 \\times 0.4 = 5.4$。\n$V(X) = 5.4 - 2.2^2 = 5.4 - 4.84 = 0.56$。\n$5.4$ は $E(X^2)$ のままで、期待値の2乗を引き忘れています。',
  },
  {
    id: 'random-variables-expectation-variance-05',
    lesson: 'random-variables-expectation-variance',
    level: 2,
    question: 'あるゲームでは、確率0.2で1000円がもらえ、確率0.8で何ももらえない。もらえる金額を $X$ 円とするとき、$X$ の標準偏差はいくらか。',
    choices: ['200円', '400円', '447円', '800円', '160000円'],
    answer: 1,
    explanation:
      '$E(X) = 1000 \\times 0.2 + 0 \\times 0.8 = 200$ 円。\n$E(X^2) = 1000^2 \\times 0.2 + 0^2 \\times 0.8 = 200000$。\n$V(X) = E(X^2) - \\{E(X)\\}^2 = 200000 - 200^2 = 200000 - 40000 = 160000$。\n標準偏差は $\\sqrt{160000} = 400$ 円。\n200円は期待値、160000円は分散（単位は円の2乗）、447円は $\\sqrt{200000}$ で期待値の2乗を引き忘れた値、800円は $1000 \\times 0.8$ で確率の対応を取り違えた値です。',
  },

  // ---------- 確率変数の1次変換 ----------
  {
    id: 'random-variables-linear-transform-01',
    lesson: 'random-variables-linear-transform',
    level: 1,
    question: '確率変数 $X$ の分散が $V(X) = 4$ のとき、$V(X + 5)$ はいくらか。',
    choices: ['$4$', '$9$', '$20$', '$25$', '$29$'],
    answer: 0,
    explanation:
      'すべての値に5を足すと分布は横にずれるだけで、期待値からのずれは変わりません。だから $V(X + 5) = V(X) = 4$。\n$9 = 4 + 5$ は分散にも5を足してしまった誤りです。',
  },
  {
    id: 'random-variables-linear-transform-02',
    lesson: 'random-variables-linear-transform',
    level: 2,
    question: '$E(X) = 10$、$V(X) = 4$ である確率変数 $X$ について、$Y = 3X - 5$ とする。$E(Y)$ と $V(Y)$ の組として正しいものはどれか。',
    choices: [
      '$E(Y) = 25$、$V(Y) = 7$',
      '$E(Y) = 25$、$V(Y) = 12$',
      '$E(Y) = 30$、$V(Y) = 36$',
      '$E(Y) = 25$、$V(Y) = 31$',
      '$E(Y) = 25$、$V(Y) = 36$',
    ],
    answer: 4,
    explanation:
      '$E(Y) = 3E(X) - 5 = 30 - 5 = 25$。\n$V(Y) = 3^2 V(X) = 9 \\times 4 = 36$（$-5$ は分散に影響しない）。\n$12 = 3 \\times 4$ は a を2乗し忘れた値、$31 = 36 - 5$ や $7 = 12 - 5$ は b まで分散に入れた値です。',
  },
  {
    id: 'random-variables-linear-transform-03',
    lesson: 'random-variables-linear-transform',
    level: 2,
    question: '確率変数 $X$ の標準偏差が3のとき、$Y = -2X + 7$ の標準偏差はいくらか。',
    choices: ['$-6$', '$1$', '$6$', '$12$', '$36$'],
    answer: 2,
    explanation:
      '標準偏差は $|a|$ 倍になるので、$|-2| \\times 3 = 6$。\n散らばりの大きさはマイナスにならないので $-6$ は誤り。$36 = (-2)^2 \\times 3^2$ は分散 $V(Y)$ の値です。$1 = -6 + 7$ は標準偏差に b を足した誤りです。',
  },
  {
    id: 'random-variables-linear-transform-04',
    lesson: 'random-variables-linear-transform',
    level: 3,
    question:
      'あるパン屋で1日に売れるパンの数 $X$ は、期待値40個・標準偏差5個である。パン1個の利益は300円で、1日の固定費は2000円かかる。1日の利益 $Y = 300X - 2000$（円）の期待値と標準偏差の組として正しいものはどれか。',
    choices: [
      '期待値 10000円、標準偏差 1500円',
      '期待値 12000円、標準偏差 1500円',
      '期待値 10000円、標準偏差 −500円',
      '期待値 10000円、標準偏差 2250000円',
      '期待値 10000円、標準偏差 3500円',
    ],
    answer: 0,
    explanation:
      '期待値：$E(Y) = 300 \\times 40 - 2000 = 10000$ 円。\n標準偏差：$300 \\times 5 = 1500$ 円。固定費2000円は毎日同じなので、ばらつきには効きません。\n$2250000 = 1500^2$ は分散です。$3500 = 1500 + 2000$ や $-500 = 1500 - 2000$ は固定費を標準偏差に入れてしまった誤り、12000円は固定費を引き忘れた値です。',
  },
  {
    id: 'random-variables-linear-transform-05',
    lesson: 'random-variables-linear-transform',
    level: 3,
    question: '$E(X) = 50$、$V(X) = 16$ の確率変数 $X$ に対し、$Z = aX + b$（$a > 0$）の期待値が0、分散が1になるようにしたい。$a$ と $b$ の組として正しいものはどれか。',
    choices: [
      '$a = \\frac{1}{16}$、$b = -\\frac{50}{16}$',
      '$a = \\frac{1}{4}$、$b = -50$',
      '$a = 4$、$b = -50$',
      '$a = \\frac{1}{4}$、$b = -12.5$',
      '$a = \\frac{1}{16}$、$b = -50$',
    ],
    answer: 3,
    explanation:
      '標準化 $Z = \\frac{X - \\mu}{\\sigma}$ を使います。$\\sigma = \\sqrt{16} = 4$ なので $Z = \\frac{X - 50}{4} = \\frac{1}{4}X - 12.5$。\nよって $a = \\frac{1}{4}$、$b = -\\frac{50}{4} = -12.5$。\n確かめると $E(Z) = \\frac{50}{4} - 12.5 = 0$、$V(Z) = \\frac{1}{16} \\times 16 = 1$。\n分散16で割る（$a = \\frac{1}{16}$）と $V(Z) = \\frac{16}{256} = \\frac{1}{16}$ になってしまいます。$b = -50$ のままだと $E(Z) = 12.5 - 50 \\neq 0$ です。',
  },
  {
    id: 'random-variables-linear-transform-06',
    lesson: 'random-variables-linear-transform',
    level: 2,
    question:
      'ある地域の明日の最高気温 $X$（℃）は、期待値20、標準偏差5の確率変数とする。これを華氏（℉）に直した $Y = 1.8X + 32$ の分散はいくらか。',
    choices: ['$5$', '$9$', '$25$', '$45$', '$81$'],
    answer: 4,
    explanation:
      '1次変換の分散は $V(aX + b) = a^2 V(X)$ で、足した32は効きません。\n$V(X) = 5^2 = 25$ なので、$V(Y) = 1.8^2 \\times 25 = 3.24 \\times 25 = 81$。\n$9 = 1.8 \\times 5$ は標準偏差、$45 = 1.8 \\times 25$ は a を2乗し忘れた値、$25$ はもとの $V(X)$ のままです。',
  },

  // ---------- 和と差・共分散と相関 ----------
  {
    id: 'random-variables-sum-covariance-01',
    lesson: 'random-variables-sum-covariance',
    level: 1,
    question: '2つの確率変数 $X$, $Y$ について、**独立かどうかに関係なくいつでも**成り立つものはどれか。',
    choices: [
      '$V(X + Y) = V(X) + V(Y)$',
      '$E(XY) = E(X)E(Y)$',
      '$E(X + Y) = E(X) + E(Y)$',
      '$V(X - Y) = V(X) - V(Y)$',
      '$\\mathrm{Cov}(X, Y) = 0$',
    ],
    answer: 2,
    explanation:
      '和の期待値 $E(X + Y) = E(X) + E(Y)$ は、X と Y がどんな関係でも成り立ちます。\n$V(X + Y) = V(X) + V(Y)$、$E(XY) = E(X)E(Y)$、$\\mathrm{Cov}(X, Y) = 0$ は、独立（正確には共分散が0）のときに成り立つものです。\n$V(X - Y) = V(X) - V(Y)$ は独立のときでも誤りで、正しくは $V(X) + V(Y)$ です。',
  },
  {
    id: 'random-variables-sum-covariance-02',
    lesson: 'random-variables-sum-covariance',
    level: 2,
    question: '互いに独立な確率変数 $X$, $Y$ の分散が $V(X) = 9$、$V(Y) = 16$ のとき、$X - Y$ の標準偏差はいくらか。',
    choices: ['$1$', '$\\sqrt{7}$', '$5$', '$7$', '$25$'],
    answer: 2,
    explanation:
      '独立なので、差でも分散は足し算です。$V(X - Y) = V(X) + V(Y) = 9 + 16 = 25$。\n標準偏差は $\\sqrt{25} = 5$。\n$\\sqrt{7} = \\sqrt{16 - 9}$ は分散を引いてしまった誤り、$7 = 3 + 4$ は標準偏差どうしを足した誤り、$25$ は分散です。',
  },
  {
    id: 'random-variables-sum-covariance-03',
    lesson: 'random-variables-sum-covariance',
    level: 2,
    question:
      '確率変数 $X$, $Y$ はどちらも 1 か 2 の値をとり、同時確率が次のとおりである。$\\mathrm{Cov}(X, Y)$ はいくらか。\n$P(X = 1, Y = 1) = 0.3$、$P(X = 1, Y = 2) = 0.2$、$P(X = 2, Y = 1) = 0.1$、$P(X = 2, Y = 2) = 0.4$',
    choices: ['$-0.1$', '$0$', '$0.1$', '$0.25$', '$2.5$'],
    answer: 2,
    explanation:
      '周辺分布：$P(X = 1) = 0.3 + 0.2 = 0.5$、$P(X = 2) = 0.5$ なので $E(X) = 1.5$。\n$P(Y = 1) = 0.3 + 0.1 = 0.4$、$P(Y = 2) = 0.6$ なので $E(Y) = 1.6$。\n$E(XY) = 1 \\times 0.3 + 2 \\times 0.2 + 2 \\times 0.1 + 4 \\times 0.4 = 2.5$。\n$\\mathrm{Cov}(X, Y) = E(XY) - E(X)E(Y) = 2.5 - 1.5 \\times 1.6 = 2.5 - 2.4 = 0.1$。\n$2.5$ は $E(XY)$ のままで、$E(X)E(Y)$ を引き忘れています。',
  },
  {
    id: 'random-variables-sum-covariance-04',
    lesson: 'random-variables-sum-covariance',
    level: 3,
    question: '確率変数 $X$, $Y$ について、$V(X) = 4$、$V(Y) = 9$、相関係数が $0.5$ である。$V(2X - Y)$ はいくらか。',
    choices: ['$1$', '$13$', '$19$', '$25$', '$31$'],
    answer: 1,
    explanation:
      'まず共分散：$\\mathrm{Cov}(X, Y) = \\rho\\,\\sigma_X \\sigma_Y = 0.5 \\times 2 \\times 3 = 3$。\n$V(2X - Y) = 2^2 V(X) + (-1)^2 V(Y) + 2 \\times 2 \\times (-1) \\times \\mathrm{Cov}(X, Y) = 16 + 9 - 12 = 13$。\n$25 = 16 + 9$ は共分散の項を忘れた値（独立なら正しい）。$19 = 4 + 9 + 6$ は $V(X + Y)$ で、係数 2 を2乗し忘れています。$1 = 16 + 9 - 24$ は共分散の項の係数まで2乗してしまった誤りです。',
  },
  {
    id: 'random-variables-sum-covariance-05',
    lesson: 'random-variables-sum-covariance',
    level: 3,
    question:
      '確率変数 $X$ は $-1$, $0$, $1$ をそれぞれ確率 $\\frac{1}{3}$ でとり、$Y = X^2$ とする。$X$ と $Y$ についての記述として正しいものはどれか。',
    choices: [
      '共分散は正で、X と Y は独立ではない',
      '共分散は0なので、X と Y は独立である',
      '共分散は負で、X と Y は独立ではない',
      '共分散は0だが、X と Y は独立ではない',
      '共分散は正で、X と Y は独立である',
    ],
    answer: 3,
    explanation:
      '$E(X) = 0$、$E(XY) = E(X^3) = \\frac{(-1) + 0 + 1}{3} = 0$ なので、$\\mathrm{Cov}(X, Y) = 0 - 0 \\times E(Y) = 0$。\n一方、$P(X = 0, Y = 0) = \\frac{1}{3}$ ですが、$P(X = 0)P(Y = 0) = \\frac{1}{3} \\times \\frac{1}{3} = \\frac{1}{9}$ で一致しないので独立ではありません（Y は X で完全に決まります）。\n「独立 ⇒ 共分散0」は正しいですが、「共分散0 ⇒ 独立」は成り立ちません。',
  },
  {
    id: 'random-variables-sum-covariance-06',
    lesson: 'random-variables-sum-covariance',
    level: 3,
    question:
      '確率変数 $X$ は 0 か 1、$Y$ は 0, 1, 2 のいずれかの値をとり、同時確率は次のとおりである。$V(X + Y)$ はいくらか。\n$P(X = 0, Y = 0) = 0.2$、$P(X = 0, Y = 1) = 0.2$、$P(X = 0, Y = 2) = 0.1$\n$P(X = 1, Y = 0) = 0.1$、$P(X = 1, Y = 1) = 0.2$、$P(X = 1, Y = 2) = 0.2$',
    choices: ['$1.05$', '$0.65$', '$0.85$', '$0.95$', '$1.25$'],
    answer: 0,
    explanation:
      '$V(X + Y) = V(X) + V(Y) + 2\\,\\mathrm{Cov}(X, Y)$ を使います。\n周辺分布：$P(X = 0) = 0.2 + 0.2 + 0.1 = 0.5$、$P(X = 1) = 0.5$ なので $E(X) = 0.5$、$E(X^2) = 0.5$、$V(X) = 0.5 - 0.5^2 = 0.25$。\n$P(Y = 0) = 0.3$、$P(Y = 1) = 0.4$、$P(Y = 2) = 0.3$ なので $E(Y) = 0.4 + 0.6 = 1$、$E(Y^2) = 0.4 + 4 \\times 0.3 = 1.6$、$V(Y) = 1.6 - 1^2 = 0.6$。\n$E(XY)$ は $x = 1$ の行だけが0でなく、$1 \\times 1 \\times 0.2 + 1 \\times 2 \\times 0.2 = 0.6$。$\\mathrm{Cov}(X, Y) = 0.6 - 0.5 \\times 1 = 0.1$。\n$V(X + Y) = 0.25 + 0.6 + 2 \\times 0.1 = 1.05$。\n$0.85$ は共分散の項を忘れた値、$0.95$ は共分散を2倍し忘れた値、$0.65$ は差 $V(X - Y)$ の値です。',
  },
  {
    id: 'random-variables-sum-covariance-07',
    lesson: 'random-variables-sum-covariance',
    level: 2,
    question: '確率変数 $X$ と $Y$ の相関係数は $0.6$ である。$U = 2X + 3$、$W = -Y + 1$ とするとき、$U$ と $W$ の相関係数はいくらか。',
    choices: ['$-1.2$', '$-0.6$', '$0$', '$0.6$', '$1.2$'],
    answer: 1,
    explanation:
      '$\\mathrm{Cov}(2X + 3, -Y + 1) = 2 \\times (-1) \\times \\mathrm{Cov}(X, Y) = -2\\,\\mathrm{Cov}(X, Y)$。足した3と1は消えます。\n標準偏差は $\\sigma_U = 2\\sigma_X$、$\\sigma_W = |-1|\\sigma_Y = \\sigma_Y$。\n相関係数は $\\frac{-2\\,\\mathrm{Cov}(X, Y)}{2\\sigma_X \\sigma_Y} = -0.6$。かける数の符号が違うので、符号だけが反対になります。\n$-1.2$ や $1.2$ は係数をそのままかけた値で、相関係数は $-1$ から $1$ の範囲を超えません。',
  },
]
