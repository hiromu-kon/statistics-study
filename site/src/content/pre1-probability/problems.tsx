import type { Problem } from '../../types'

export const problems: Problem[] = [
  // ---------- 事象と確率（包除原理） ----------
  {
    id: 'pre1-probability-events-01',
    lesson: 'pre1-probability-events',
    level: 1,
    question: '3つの事象 A、B、C が**互いに独立**であるための条件として正しいものはどれか。',
    choices: [
      '$P(A \\cap B \\cap C) = P(A)P(B)P(C)$ だけが成り立つこと',
      '$P(A \\cap B) = P(A)P(B)$、$P(A \\cap C) = P(A)P(C)$、$P(B \\cap C) = P(B)P(C)$ の3つだけが成り立つこと',
      '$P(A \\cap B \\cap C) = 0$ であること',
      '2つずつの3つの式と、$P(A \\cap B \\cap C) = P(A)P(B)P(C)$ の、合わせて4つがすべて成り立つこと',
      '$P(A \\cup B \\cup C) = P(A) + P(B) + P(C)$ が成り立つこと',
    ],
    answer: 3,
    explanation:
      '3つの事象が互いに独立であるには、2つずつの3つの式と、3つ同時の式の**4つすべて**が必要です。\n2番目の3つだけが成り立つ状態は「対ごとに独立」で、コインを2回投げて A「1回目が表」、B「2回目が表」、C「2回とも同じ面」とすると、3つの式は成り立つのに $P(A \\cap B \\cap C) = 1/4 \\ne 1/8$ になります。1番目だけでも不十分です。\n3番目と5番目は、3つが同時に起きない・どの2つも同時に起きない（排反）の条件で、独立とは別のものです。',
  },
  {
    id: 'pre1-probability-events-02',
    lesson: 'pre1-probability-events',
    level: 2,
    kind: 'numeric',
    question:
      '事象 A、B、C について、$P(A) = 0.40$、$P(B) = 0.35$、$P(C) = 0.25$、$P(A \\cap B) = 0.15$、$P(A \\cap C) = 0.10$、$P(B \\cap C) = 0.08$、$P(A \\cap B \\cap C) = 0.04$ である。A、B、C の**どれも起きない**確率を求めよ。',
    answerValue: 0.29,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '「どれも起きない」は「どれか1つ以上起きる」の余事象なので、まず包除原理で $P(A \\cup B \\cup C)$ を求めます。\n1つずつ足す：$0.40 + 0.35 + 0.25 = 1.00$\n2つの重なりを引く：$1.00 - (0.15 + 0.10 + 0.08) = 0.67$\n3つの重なりを足す：$0.67 + 0.04 = 0.71$\nどれも起きない確率は $1 - 0.71 = 0.29$。\n3つの重なりを足し忘れると $1 - 0.67 = 0.33$、余事象にし忘れると 0.71 になります。',
  },
  {
    id: 'pre1-probability-events-03',
    lesson: 'pre1-probability-events',
    level: 2,
    question:
      '3人の選手がそれぞれ独立にシュートを打ち、成功する確率は 0.2、0.3、0.5 である。**少なくとも1人が成功する**確率はどれか。',
    choices: ['0.03', '0.72', '1.00', '0.28', '0.50'],
    answer: 1,
    explanation:
      '「少なくとも1人が成功」の余事象は「3人とも失敗」。独立なので、失敗の確率をかけ算できます。\n3人とも失敗：$(1-0.2)(1-0.3)(1-0.5) = 0.8 \\times 0.7 \\times 0.5 = 0.28$\n少なくとも1人成功：$1 - 0.28 = 0.72$。\n0.28 は余事象のまま、1.00 は確率を単純に足したもの（重なりを数えすぎ）、0.03 は3人とも成功する確率です。',
  },
  {
    id: 'pre1-probability-events-04',
    lesson: 'pre1-probability-events',
    level: 2,
    question:
      'ある会社の社員の通勤手段は、電車 60%、バス 25%、車 15% である（どれか1つだけを使う）。ある日に遅刻する確率は、電車の人が 2%、バスの人が 6%、車の人が 4% である。遅刻した社員を1人選んだとき、その人が**バス通勤**である確率に最も近いものはどれか。',
    choices: ['0.015', '0.060', '0.250', '0.364', '0.455'],
    answer: 4,
    explanation:
      'ベイズの定理を表で計算します。\n各手段の「割合 × 遅刻率」：電車 $0.60 \\times 0.02 = 0.012$、バス $0.25 \\times 0.06 = 0.015$、車 $0.15 \\times 0.04 = 0.006$。\n遅刻する確率（分母）：$0.012 + 0.015 + 0.006 = 0.033$。\nバスの事後確率：$0.015 \\div 0.033 \\approx 0.455$。\n0.250 は遅刻を知る前の割合（事前確率）、0.060 は「バス通勤の人が遅刻する確率」で条件の向きが逆、0.015 は分母で割り忘れたもの、0.364 は電車の事後確率です。',
  },
  {
    id: 'pre1-probability-events-05',
    lesson: 'pre1-probability-events',
    level: 3,
    question: '公正なサイコロを4回投げる。1、2、3 の目が**どれも少なくとも1回ずつ**出る確率はどれか。',
    choices: ['$\\dfrac{1}{12}$', '$\\dfrac{7}{48}$', '$\\dfrac{1}{16}$', '$\\dfrac{1}{6}$', '$\\dfrac{2}{9}$'],
    answer: 0,
    explanation:
      '$A_i$ を「4回のうち目 i が1回も出ない」とすると、求める確率は $1 - P(A_1 \\cup A_2 \\cup A_3)$ です。包除原理を使います。\n1つ：$P(A_i) = (5/6)^4 = 625/1296$。3つあるので $1875/1296$。\n2つ：$P(A_i \\cap A_j) = (4/6)^4 = 256/1296$。3組あるので $768/1296$。\n3つ：$P(A_1 \\cap A_2 \\cap A_3) = (3/6)^4 = 81/1296$。\n$P(A_1 \\cup A_2 \\cup A_3) = (1875 - 768 + 81)/1296 = 1188/1296$。\n求める確率：$1 - 1188/1296 = 108/1296 = 1/12$。\n3つの重なりの 81 を入れ忘れると $189/1296 = 7/48$ になります。',
  },
  {
    id: 'pre1-probability-events-06',
    lesson: 'pre1-probability-events',
    level: 3,
    question:
      '公正なサイコロを2個投げる。A を「1個目の目が偶数」、B を「2個目の目が偶数」、C を「2個の目の和が偶数」とする。正しい記述はどれか。',
    choices: [
      'A と C は独立ではない',
      'A、B、C は互いに独立である',
      'A と B、A と C、B と C はどれも独立だが、A、B、C は互いに独立ではない',
      'A と B は排反である',
      '$P(A \\cap B \\cap C) = \\dfrac{1}{8}$ である',
    ],
    answer: 2,
    explanation:
      '$P(A) = P(B) = P(C) = 1/2$ です（和が偶数になるのは「偶数どうし」か「奇数どうし」で、$1/4 + 1/4 = 1/2$）。\nA かつ C は「1個目が偶数で2個目も偶数」なので $1/4 = 1/2 \\times 1/2$。B かつ C も同じく $1/4$、A かつ B も $1/4$。よって**対ごとに独立**です。\nしかし A と B が両方起きれば C は必ず起きるので、$P(A \\cap B \\cap C) = P(A \\cap B) = 1/4$。確率の積 $1/8$ と等しくないので、互いに独立ではありません。\nA と B は同時に起きうる（確率 1/4）ので排反でもありません。',
  },
  // ---------- 同時分布・周辺分布・条件つき分布 ----------
  {
    id: 'pre1-probability-joint-01',
    lesson: 'pre1-probability-joint',
    level: 1,
    question: '確率変数 X の累積分布関数を $F(x)$ とする。X の**生存関数** $S(x)$ の説明として正しいものはどれか。',
    choices: [
      '$S(x) = P(X \\le x)$ で、x 以下の値をとる確率',
      '$S(x) = P(X = x)$ で、ちょうど x になる確率',
      '$S(x) = P(X > x) = 1 - F(x)$ で、x より大きい値をとる確率',
      '$S(x)$ は確率密度関数 $f(x)$ を微分したもの',
      '$S(x) = F(x) + 1$ で、x が大きくなるほど大きくなる',
    ],
    answer: 2,
    explanation:
      '生存関数は「x より大きい値をとる確率」$S(x) = P(X > x) = 1 - F(x)$ です。寿命なら「x より長く生きのびる確率」で、x が大きくなるほど小さくなります。\n1番目は累積分布関数 $F(x)$ そのもの、2番目は離散の確率関数です。密度 $f(x)$ は $F(x)$ を微分したもので、生存関数とは別です。',
  },
  {
    id: 'pre1-probability-joint-02',
    lesson: 'pre1-probability-joint',
    level: 2,
    kind: 'numeric',
    question:
      '確率変数 X（1 または 2）と Y（0, 1, 2）の同時確率が次のように与えられている。\n$P(X=1, Y=0) = 0.15$、$P(X=1, Y=1) = 0.10$、$P(X=1, Y=2) = 0.05$\n$P(X=2, Y=0) = 0.20$、$P(X=2, Y=1) = 0.35$、$P(X=2, Y=2) = 0.15$\nX = 2 であるとわかったとき、Y が 1 以上である条件つき確率 $P(Y \\ge 1 \\mid X = 2)$ を求めよ。',
    answerValue: 0.7143,
    tolerance: 0.0005,
    unit: '小数第3位まで（第4位を四捨五入）',
    explanation:
      'X = 2 の行だけを取り出し、行の合計（X の周辺確率）で割ります。\n$P(X = 2) = 0.20 + 0.35 + 0.15 = 0.70$\n$P(X = 2, Y \\ge 1) = 0.35 + 0.15 = 0.50$\n$P(Y \\ge 1 \\mid X = 2) = 0.50 \\div 0.70 \\approx 0.714$\n行の合計で割り忘れると 0.50、表全体の $P(Y \\ge 1) = 0.65$ を答えると条件を無視したことになります。',
  },
  {
    id: 'pre1-probability-joint-03',
    lesson: 'pre1-probability-joint',
    level: 2,
    question:
      '(X, Y) の同時確率密度関数が $f(x, y) = c(x + 2y)$（$0 \\le x \\le 1$、$0 \\le y \\le 1$）、それ以外では 0 である。定数 c と、X の周辺確率密度関数 $f_X(x)$（$0 \\le x \\le 1$）の組として正しいものはどれか。',
    choices: [
      '$c = \\dfrac{2}{3}$、$f_X(x) = \\dfrac{2}{3}(x + 1)$',
      '$c = \\dfrac{2}{3}$、$f_X(x) = \\dfrac{2}{3}(x + 2y)$',
      '$c = \\dfrac{1}{2}$、$f_X(x) = \\dfrac{1}{2}(x + 1)$',
      '$c = \\dfrac{2}{3}$、$f_X(x) = \\dfrac{2}{3}\\left(\\dfrac{1}{2} + 2y\\right)$',
      '$c = 1$、$f_X(x) = x + 1$',
    ],
    answer: 0,
    explanation:
      'まず y で積分すると $\\int_0^1 (x + 2y)\\,dy = \\left[xy + y^2\\right]_0^1 = x + 1$。\n全体が 1：$c\\int_0^1 (x + 1)\\,dx = c\\left(\\dfrac{1}{2} + 1\\right) = \\dfrac{3}{2}c = 1$ より $c = \\dfrac{2}{3}$。\n周辺密度は y で積分した $f_X(x) = \\dfrac{2}{3}(x + 1)$ です（x で積分して 1 になることも確かめられます）。\n2番目は積分していない（y が残っている）、4番目は x のほうで積分してしまったもの、3番目と5番目は全体の積分を 1 にする計算の誤りです。',
  },
  {
    id: 'pre1-probability-joint-04',
    lesson: 'pre1-probability-joint',
    level: 2,
    question: '次の同時確率密度関数（示した範囲の外では 0）のうち、X と Y が**独立**になるものはどれか。',
    choices: [
      '$f(x, y) = x + y$（$0 \\le x \\le 1$、$0 \\le y \\le 1$）',
      '$f(x, y) = 8xy$（$0 < x < y < 1$）',
      '$f(x, y) = 2$（$0 < y < x < 1$）',
      '$f(x, y) = 4xy$（$0 \\le x \\le 1$、$0 \\le y \\le 1$）',
      '$f(x, y) = \\dfrac{3}{2}(x^2 + y^2)$（$0 \\le x \\le 1$、$0 \\le y \\le 1$）',
    ],
    answer: 3,
    explanation:
      '独立になるのは「x だけの式 × y だけの式」に分かれ、**しかも 0 でない範囲が長方形**のときです。\n$4xy$ は $2x \\times 2y$ に分かれ、範囲も正方形なので独立です（$f_X(x) = 2x$、$f_Y(y) = 2y$）。\n$8xy$ と $2$ は式は分かれていますが、範囲が三角形で y のとれる範囲が x で変わるので独立ではありません。たとえば $8xy$ では $f_X(x) = 4x(1 - x^2)$、$f_Y(y) = 4y^3$ で、積は $8xy$ になりません。\n$x + y$ と $\\frac{3}{2}(x^2 + y^2)$ は和の形で、積に分かれません。',
  },
  {
    id: 'pre1-probability-joint-05',
    lesson: 'pre1-probability-joint',
    level: 3,
    kind: 'numeric',
    question:
      '(X, Y) の同時確率密度関数が $f(x, y) = 2$（$0 < y < x < 1$）、それ以外では 0 である。X = 0.8 であるとき、Y が 0.5 以下になる条件つき確率 $P(Y \\le 0.5 \\mid X = 0.8)$ を求めよ。',
    answerValue: 0.625,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      'X の周辺密度：$f_X(x) = \\int_0^x 2\\,dy = 2x$（$0 < x < 1$）。\n条件つき密度：$f(y \\mid x) = \\dfrac{2}{2x} = \\dfrac{1}{x}$（$0 < y < x$）。X = x のとき Y は 0〜x の一様分布です。\nx = 0.8 なら $P(Y \\le 0.5 \\mid X = 0.8) = \\int_0^{0.5} \\dfrac{1}{0.8}\\,dy = \\dfrac{0.5}{0.8} = 0.625$。\n周辺密度で割らずに $\\int_0^{0.5} 2\\,dy = 1$ とすると確率として大きすぎ、y の範囲を 0〜1 とみて 0.5 と答えるのも誤りです。',
  },
  {
    id: 'pre1-probability-joint-06',
    lesson: 'pre1-probability-joint',
    level: 3,
    question:
      'ある機械の寿命 X（年）の生存関数が $S(x) = e^{-x/4}$（$x \\ge 0$）である。すでに 5 年使えている機械が、さらに 4 年以上使える確率に最も近いものはどれか。必要なら $e^{-1} = 0.368$、$e^{-5/4} = 0.287$、$e^{-9/4} = 0.105$ を使ってよい。',
    choices: ['0.105', '0.368', '0.287', '0.632', '0.895'],
    answer: 1,
    explanation:
      '「5 年使えた」という条件のもとで「9 年より長く持つ」確率です。\n$P(X > 9 \\mid X > 5) = \\dfrac{P(X > 9)}{P(X > 5)} = \\dfrac{S(9)}{S(5)} = \\dfrac{e^{-9/4}}{e^{-5/4}} = e^{-1} \\approx 0.368$。\nこれは新品が 4 年以上持つ確率 $S(4)$ と同じで、指数分布の無記憶性です。\n0.105 は条件を無視した $S(9)$、0.287 は $S(5)$、0.632 は $1 - e^{-1}$（4 年以内に壊れる確率）、0.895 は $1 - S(9)$ です。',
  },

  // ---------- 分布の特性値と条件つき期待値 ----------
  {
    id: 'pre1-probability-moments-01',
    lesson: 'pre1-probability-moments',
    level: 1,
    question:
      '大人のゾウの体重（平均 5000 kg 程度）と、ハツカネズミの体重（平均 20 g 程度）について、「平均の大きさに対して、どちらのばらつきが大きいか」を比べたい。使う指標として最も適切なものはどれか。',
    choices: ['分散', '標準偏差', '範囲（最大値 − 最小値）', '歪度', '変動係数'],
    answer: 4,
    explanation:
      '変動係数 $CV = \\sigma/\\mu$ は、標準偏差を平均で割った単位のない量で、平均の大きさが大きく違うものどうしのばらつきを比べるのに使います。\n分散・標準偏差・範囲は単位があり、平均が大きいものほど大きくなりやすいので、この比較には向きません。歪度は分布の左右のかたよりを表す指標で、ばらつきの大きさではありません。',
  },
  {
    id: 'pre1-probability-moments-02',
    lesson: 'pre1-probability-moments',
    level: 2,
    kind: 'numeric',
    question:
      '確率変数 X は、確率 0.2 で 1、確率 0.8 で 0 をとる。X の歪度 $\\dfrac{E[(X - \\mu)^3]}{\\sigma^3}$ を求めよ（$\\mu = E[X]$、$\\sigma^2 = V[X]$）。',
    answerValue: 1.5,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '0 と 1 は何乗しても同じなので $E[X] = E[X^2] = E[X^3] = 0.2$。\n平均 $\\mu = 0.2$、分散 $\\sigma^2 = 0.2 - 0.2^2 = 0.16$、$\\sigma = 0.4$。\n3次の中心モーメント：$E[(X - \\mu)^3] = E[X^3] - 3\\mu E[X^2] + 2\\mu^3 = 0.2 - 0.12 + 0.016 = 0.096$。\n（直接計算しても $0.2 \\times 0.8^3 + 0.8 \\times (-0.2)^3 = 0.1024 - 0.0064 = 0.096$。）\n歪度：$0.096 \\div 0.4^3 = 0.096 \\div 0.064 = 1.5$。\nまれに 1 が出るので右に裾が長く、正の値になります。$\\sigma^2$ で割ると 0.6 になってしまいます。',
  },
  {
    id: 'pre1-probability-moments-03',
    lesson: 'pre1-probability-moments',
    level: 2,
    question:
      'ある集団は男性 40%、女性 60% からなる。身長（cm）の平均と分散は、男性が 170 と 36、女性が 158 と 25 である。この集団全体から1人を選んだときの身長の分散はいくらか。',
    choices: ['29.40', '63.96', '34.56', '30.50', '61.00'],
    answer: 1,
    explanation:
      '性別を X として、分散の分解 $V[Y] = E[V[Y \\mid X]] + V[E[Y \\mid X]]$ を使います。\n全体の平均：$0.4 \\times 170 + 0.6 \\times 158 = 68 + 94.8 = 162.8$\nグループの中の分散の平均：$0.4 \\times 36 + 0.6 \\times 25 = 14.4 + 15 = 29.4$\nグループの平均の分散：$0.4 \\times (170 - 162.8)^2 + 0.6 \\times (158 - 162.8)^2 = 0.4 \\times 51.84 + 0.6 \\times 23.04 = 20.736 + 13.824 = 34.56$\n全体の分散：$29.4 + 34.56 = 63.96$。\n29.40 はグループの中の分散だけ、34.56 は平均の差の分だけ、30.50 は2つの分散を単純に平均したもの、61.00 は2つの分散を足したものです。',
  },
  {
    id: 'pre1-probability-moments-04',
    lesson: 'pre1-probability-moments',
    level: 2,
    question:
      '待ち時間 X（分）が平均 2 分の指数分布にしたがう（累積分布関数 $F(x) = 1 - e^{-x/2}$、$x \\ge 0$）。X の中央値（分位点関数の $Q(0.5)$）に最も近いものはどれか。必要なら $\\log 2 = 0.693$（自然対数）を使ってよい。',
    choices: ['0.347', '0.693', '1.386', '2.000', '2.773'],
    answer: 2,
    explanation:
      '$F(x) = 0.5$ を x について解きます。\n$1 - e^{-x/2} = 0.5$ → $e^{-x/2} = 0.5$ → $-\\dfrac{x}{2} = \\log 0.5 = -\\log 2$ → $x = 2\\log 2 \\approx 1.386$。\n平均 2.000 より小さいのは、右に裾が長い分布だからです。\n0.347 は率 λ = 2 と取り違えた $\\log 2 / 2$、0.693 は平均 1 のときの中央値、2.773 は $4\\log 2$ です。',
  },
  {
    id: 'pre1-probability-moments-05',
    lesson: 'pre1-probability-moments',
    level: 3,
    kind: 'numeric',
    question:
      'ある店に1時間に来る客の数 N は平均 4 のポアソン分布にしたがう。客1人の支払額 $X_i$（千円）は平均 3、分散 2 で、互いに独立で、N とも独立である。1時間の売上 $S = X_1 + X_2 + \\cdots + X_N$（N = 0 なら S = 0）の分散 $V[S]$ を求めよ。',
    answerValue: 44,
    tolerance: 0.005,
    unit: '整数で',
    explanation:
      'N を条件にして、分散の分解 $V[S] = E[V[S \\mid N]] + V[E[S \\mid N]]$ を使います。\nN = n のとき：$E[S \\mid N = n] = 3n$、$V[S \\mid N = n] = 2n$（独立な n 個の和）。\n$E[V[S \\mid N]] = E[2N] = 2 \\times 4 = 8$\n$V[E[S \\mid N]] = V[3N] = 9 \\times V[N] = 9 \\times 4 = 36$（ポアソン分布は分散 = 平均）\n$V[S] = 8 + 36 = 44$。\n2つ目の項を忘れると 8、N を定数 4 とみると $4 \\times 2 = 8$ になってしまいます。',
  },
  {
    id: 'pre1-probability-moments-06',
    lesson: 'pre1-probability-moments',
    level: 3,
    question:
      '(X, Y) の同時確率密度関数が $f(x, y) = 2$（$0 < y < x < 1$）、それ以外では 0 である。X = x のとき Y は 0〜x の一様分布になる。繰り返し期待値の法則と分散の分解を使って求めた $V[Y]$ はどれか。',
    choices: ['$\\dfrac{1}{18}$', '$\\dfrac{1}{24}$', '$\\dfrac{1}{72}$', '$\\dfrac{1}{12}$', '$\\dfrac{1}{9}$'],
    answer: 0,
    explanation:
      '0〜x の一様分布なので $E[Y \\mid X] = \\dfrac{X}{2}$、$V[Y \\mid X] = \\dfrac{X^2}{12}$。\nX の周辺密度は $f_X(x) = 2x$ なので、$E[X] = \\int_0^1 2x^2\\,dx = \\dfrac{2}{3}$、$E[X^2] = \\int_0^1 2x^3\\,dx = \\dfrac{1}{2}$、$V[X] = \\dfrac{1}{2} - \\dfrac{4}{9} = \\dfrac{1}{18}$。\n$E[V[Y \\mid X]] = \\dfrac{E[X^2]}{12} = \\dfrac{1}{24}$、$V[E[Y \\mid X]] = \\dfrac{V[X]}{4} = \\dfrac{1}{72}$。\n$V[Y] = \\dfrac{1}{24} + \\dfrac{1}{72} = \\dfrac{3 + 1}{72} = \\dfrac{1}{18}$。\n（Y の周辺密度 $2(1 - y)$ から直接計算しても $E[Y^2] - E[Y]^2 = \\frac{1}{6} - \\frac{1}{9} = \\frac{1}{18}$。）\n1/24 と 1/72 は2つの項の片方だけ、1/9 は $E[Y]^2$ です。',
  },
  {
    id: 'pre1-probability-moments-07',
    lesson: 'pre1-probability-moments',
    level: 2,
    kind: 'numeric',
    question:
      '3つの変数 X、Y、Z の相関係数が $r_{XY} = 0.5$、$r_{XZ} = 0.6$、$r_{YZ} = 0.7$ である。Z の影響を取り除いた X と Y の偏相関係数 $r_{XY \\cdot Z}$ を求めよ。',
    answerValue: 0.14,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '$r_{XY \\cdot Z} = \\dfrac{r_{XY} - r_{XZ}r_{YZ}}{\\sqrt{(1 - r_{XZ}^2)(1 - r_{YZ}^2)}}$ に代入します。\n分子：$0.5 - 0.6 \\times 0.7 = 0.5 - 0.42 = 0.08$\n分母：$\\sqrt{(1 - 0.36)(1 - 0.49)} = \\sqrt{0.64 \\times 0.51} = \\sqrt{0.3264} \\approx 0.571$\n$r_{XY \\cdot Z} \\approx 0.08 \\div 0.571 \\approx 0.14$。\n0.5 の相関の多くは Z を通したもので、Z を固定すると弱い相関しか残りません。分母のルートを忘れると $0.08 \\div 0.3264 \\approx 0.25$ になります。',
  },

  // ---------- 積率母関数と確率母関数 ----------
  {
    id: 'pre1-probability-mgf-01',
    lesson: 'pre1-probability-mgf',
    level: 1,
    question: '確率変数 X の積率母関数 $M_X(t) = E[e^{tX}]$ についての記述として正しいものはどれか。',
    choices: [
      'どんな分布でも $M_X(1) = 1$ である',
      '$M_X(t)$ を t で1回微分して $t = 1$ を代入すると $E[X]$ になる',
      'どんな分布にも、0 を含む範囲で有限な積率母関数がある',
      'X と Y が独立なら $M_{X+Y}(t) = M_X(t)\\,M_Y(t)$ である',
      '$M_X(t)$ を t で2回微分して $t = 0$ を代入すると $V[X]$ になる',
    ],
    answer: 3,
    explanation:
      '独立なら $E[e^{t(X+Y)}] = E[e^{tX}]E[e^{tY}]$ と分かれるので、和の積率母関数は積になります。\n1番目：いつも成り立つのは $M_X(0) = E[e^0] = 1$。\n2番目：微分して代入するのは $t = 0$。\n3番目：コーシー分布や対数正規分布のように、積率母関数がない分布もあります。\n5番目：2回微分して $t = 0$ を入れたものは $E[X^2]$ で、分散は $M\'\'(0) - M\'(0)^2$ です。',
  },
  {
    id: 'pre1-probability-mgf-02',
    lesson: 'pre1-probability-mgf',
    level: 2,
    question:
      '独立な確率変数 X、Y の積率母関数が $M_X(t) = \\exp\\{3(e^t - 1)\\}$、$M_Y(t) = \\exp\\{2(e^t - 1)\\}$ である。$X + Y$ の分布と分散の組として正しいものはどれか。',
    choices: [
      '平均 6 のポアソン分布、分散 6',
      '二項分布 B(5, 0.5)、分散 1.25',
      '正規分布 N(5, 5)、分散 5',
      '平均 5 のポアソン分布、分散 25',
      '平均 5 のポアソン分布、分散 5',
    ],
    answer: 4,
    explanation:
      '$\\exp\\{\\lambda(e^t - 1)\\}$ は平均 λ のポアソン分布の積率母関数です。\n独立なので $M_{X+Y}(t) = \\exp\\{3(e^t - 1)\\}\\exp\\{2(e^t - 1)\\} = \\exp\\{5(e^t - 1)\\}$。\nこれは平均 5 のポアソン分布の積率母関数なので、X + Y は平均 5 のポアソン分布で、分散も 5 です。\n指数の中を足すところを掛けると 6、ポアソン分布の分散を平均の2乗とすると 25 になります。',
  },
  {
    id: 'pre1-probability-mgf-03',
    lesson: 'pre1-probability-mgf',
    level: 2,
    kind: 'numeric',
    question: '確率変数 X の積率母関数が $M(t) = (0.3 + 0.7e^t)^{10}$ である。X の分散を求めよ。',
    answerValue: 2.1,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      '$(1 - p + pe^t)^n$ の形なので、X は二項分布 $B(10, 0.7)$ です。分散は $np(1 - p) = 10 \\times 0.7 \\times 0.3 = 2.1$。\n微分で確かめると、$M\'(t) = 7e^t(0.3 + 0.7e^t)^9$ より $E[X] = M\'(0) = 7$。\n$M\'\'(t) = 7e^t(0.3 + 0.7e^t)^9 + 63\\,e^{2t}(0.3 + 0.7e^t)^8 \\times 0.7$ より $E[X^2] = M\'\'(0) = 7 + 44.1 = 51.1$。\n$V[X] = 51.1 - 49 = 2.1$。\n$p = 0.3$ と読みちがえても分散は同じですが、平均は 3 になってしまうので注意します。',
  },
  {
    id: 'pre1-probability-mgf-04',
    lesson: 'pre1-probability-mgf',
    level: 2,
    question:
      'X が $N(1, 4)$、Y が $N(2, 5)$ にしたがい、独立である（N(平均, 分散)）。$X - Y$ の積率母関数はどれか。',
    choices: [
      '$\\exp\\left(-t + \\dfrac{9t^2}{2}\\right)$',
      '$\\exp\\left(3t + \\dfrac{9t^2}{2}\\right)$',
      '$\\exp\\left(-t - \\dfrac{t^2}{2}\\right)$',
      '$\\exp\\left(-t + 9t^2\\right)$',
      '$\\exp\\left(-t + \\dfrac{41t^2}{2}\\right)$',
    ],
    answer: 0,
    explanation:
      '$M_{X-Y}(t) = E[e^{tX}]E[e^{-tY}] = M_X(t)\\,M_Y(-t)$ です。\n$M_X(t) = \\exp(t + 2t^2)$、$M_Y(-t) = \\exp(-2t + 2.5t^2)$（$(-t)^2 = t^2$ なので2乗の項の符号は変わらない）。\n積：$\\exp(-t + 4.5t^2) = \\exp\\left(-t + \\dfrac{9t^2}{2}\\right)$。X − Y は $N(-1, 9)$ です。\n2番目は和 X + Y、3番目は分散を引き算してしまったもの、4番目は 1/2 を忘れたもの、5番目は分散をさらに2乗して足した（$16 + 25 = 41$）ものです。',
  },
  {
    id: 'pre1-probability-mgf-05',
    lesson: 'pre1-probability-mgf',
    level: 3,
    kind: 'numeric',
    question: '確率変数 X の積率母関数が $M(t) = (1 - 2t)^{-3}$（$t < 1/2$）である。X の分散を求めよ。',
    answerValue: 12,
    tolerance: 0.005,
    unit: '整数で',
    explanation:
      '合成関数の微分で、t = 0 での1階・2階微分を求めます。\n$M\'(t) = -3(1 - 2t)^{-4} \\times (-2) = 6(1 - 2t)^{-4}$ → $E[X] = M\'(0) = 6$\n$M\'\'(t) = 6 \\times (-4)(1 - 2t)^{-5} \\times (-2) = 48(1 - 2t)^{-5}$ → $E[X^2] = M\'\'(0) = 48$\n$V[X] = 48 - 6^2 = 12$。\n（これは形状 3・尺度 2 のガンマ分布の積率母関数で、分散は 形状 × 尺度² $= 3 \\times 4 = 12$ と一致します。）\n$M\'\'(0) = 48$ を分散と答える誤りに注意します。',
  },
  {
    id: 'pre1-probability-mgf-06',
    lesson: 'pre1-probability-mgf',
    level: 3,
    question:
      '0, 1, 2 の値をとる確率変数 X の確率母関数が $G(s) = 0.2 + 0.5s + 0.3s^2$ である。Y は X と独立で、X と同じ分布にしたがう。$P(X + Y = 2)$ はどれか。',
    choices: ['0.09', '0.25', '0.37', '0.30', '0.12'],
    answer: 2,
    explanation:
      '独立な和の確率母関数は積なので、$G(s)^2$ の $s^2$ の係数が $P(X + Y = 2)$ です。\n$s^2$ が出る組み合わせは「定数 × $s^2$」（2通り）と「$s \\times s$」：\n$2 \\times 0.2 \\times 0.3 + 0.5 \\times 0.5 = 0.12 + 0.25 = 0.37$。\n（直接数えると、(X, Y) = (0, 2), (2, 0), (1, 1) の確率の和で同じ。）\n0.25 は (1, 1) だけ、0.12 は (0, 2) と (2, 0) だけ、0.09 は $0.3^2$ で X + Y = 4 の確率です。',
  },

  // ---------- 変数変換 ----------
  {
    id: 'pre1-probability-transformation-01',
    lesson: 'pre1-probability-transformation',
    level: 1,
    question: 'Box-Cox 変換 $y^{(\\lambda)} = (y^{\\lambda} - 1)/\\lambda$（$\\lambda \\ne 0$）についての記述として正しいものはどれか。',
    choices: [
      '負の値を含むデータにも、そのまま使える',
      '正の値のデータを正規分布に近い形にするために使い、λ = 0 のときは対数変換 log y とする',
      'λ = 1 のときが対数変換にあたる',
      'λ を大きくするほど、右に長い裾を強く縮める',
      '2つの変数の相関係数を 0 にするための変換である',
    ],
    answer: 1,
    explanation:
      'Box-Cox 変換は、右に裾が長いなどの正の値のデータを、正規分布に近い形（左右対称・散らばりがそろった形）に変えるために使います。λ = 0 のときは log y と定め、これは λ → 0 の極限になっています。\nλ = 1 では y − 1 で形は変わりません。λ を**小さく**するほど大きな値を強く縮めます。\n$y^{\\lambda}$ や log y を使うので、y > 0 が必要です。',
  },
  {
    id: 'pre1-probability-transformation-02',
    lesson: 'pre1-probability-transformation',
    level: 2,
    question: 'X が区間 0〜2 の一様分布にしたがうとき、$Y = X^2$ の確率密度関数はどれか（示した範囲の外では 0）。',
    choices: [
      '$f_Y(y) = \\dfrac{1}{2\\sqrt{y}}$（0 < y < 4）',
      '$f_Y(y) = \\dfrac{1}{2}$（0 < y < 4）',
      '$f_Y(y) = \\dfrac{1}{4\\sqrt{y}}$（0 < y < 2）',
      '$f_Y(y) = \\dfrac{1}{4\\sqrt{y}}$（0 < y < 4）',
      '$f_Y(y) = \\dfrac{\\sqrt{y}}{2}$（0 < y < 4）',
    ],
    answer: 3,
    explanation:
      'X は 0〜2 なので Y は 0〜4。X の密度は $\\frac{1}{2}$ です。\n累積分布関数：$F_Y(y) = P(X \\le \\sqrt{y}) = \\dfrac{\\sqrt{y}}{2}$（0 < y < 4）。\n微分：$f_Y(y) = \\dfrac{1}{2} \\times \\dfrac{1}{2\\sqrt{y}} = \\dfrac{1}{4\\sqrt{y}}$。\n公式でも $f_X(x)|dx/dy| = \\frac{1}{2} \\times \\frac{1}{2\\sqrt{y}}$ で同じです。\n1番目は X の密度 1/2 をかけ忘れたもの（積分すると 2 になる）、5番目は累積分布関数のまま微分していないもの、3番目は Y の範囲の誤りです。',
  },
  {
    id: 'pre1-probability-transformation-03',
    lesson: 'pre1-probability-transformation',
    level: 2,
    kind: 'numeric',
    question:
      'X が $N(10, 4)$、Y が $N(5, 9)$ にしたがい、独立である（N(平均, 分散)）。$W = 2X - Y$ について $P(W > 21)$ を求めよ。必要なら、標準正規分布にしたがう Z について $P(Z > 1.0) = 0.1587$、$P(Z > 1.2) = 0.1151$、$P(Z > 1.5) = 0.0668$、$P(Z > 1.8) = 0.0359$ を使ってよい。',
    answerValue: 0.1151,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '独立な正規分布の線形結合は正規分布です。\n平均：$2 \\times 10 - 5 = 15$\n分散：$2^2 \\times 4 + (-1)^2 \\times 9 = 16 + 9 = 25$、標準偏差 5\n$P(W > 21) = P\\left(Z > \\dfrac{21 - 15}{5}\\right) = P(Z > 1.2) = 0.1151$。\n分散を $16 - 9 = 7$ と引き算したり、$2 \\times 4 + 9$ と係数を2乗し忘れたりすると、表にない値になります。',
  },
  {
    id: 'pre1-probability-transformation-04',
    lesson: 'pre1-probability-transformation',
    level: 2,
    question: 'X が平均 1 の指数分布（密度 $e^{-x}$、$x > 0$）にしたがうとき、$Y = \\sqrt{X}$ の確率密度関数（$y > 0$）はどれか。',
    choices: [
      '$e^{-y^2}$',
      '$\\dfrac{1}{2\\sqrt{y}}e^{-\\sqrt{y}}$',
      '$2y\\,e^{-y}$',
      '$y^2 e^{-y^2}$',
      '$2y\\,e^{-y^2}$',
    ],
    answer: 4,
    explanation:
      '$y = \\sqrt{x}$ は増える関数なので公式が使えます。戻す式は $x = y^2$、$\\dfrac{dx}{dy} = 2y$。\n$f_Y(y) = f_X(y^2) \\times |2y| = 2y\\,e^{-y^2}$（$y > 0$）。\n積分すると $\\int_0^\\infty 2y e^{-y^2}dy = [-e^{-y^2}]_0^\\infty = 1$ で確かに密度です。\n1番目は $|dx/dy|$ をかけ忘れたもの、2番目は逆向き（$Y = X^2$ のとき）の式、3番目は指数の中に $y^2$ を入れ忘れたものです。',
  },
  {
    id: 'pre1-probability-transformation-05',
    lesson: 'pre1-probability-transformation',
    level: 3,
    kind: 'numeric',
    question:
      'X、Y が独立にそれぞれ平均 1 の指数分布にしたがうとき、$U = X + Y$ の確率密度関数は $f_U(u) = u\\,e^{-u}$（$u > 0$）である。$P(U \\le 1)$ を求めよ。必要なら $e^{-1} = 0.3679$ を使ってよい。',
    answerValue: 0.2642,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      '部分積分で $\\int_0^1 u\\,e^{-u}\\,du$ を計算します。\n$\\int u e^{-u}du = -u e^{-u} + \\int e^{-u}du = -u e^{-u} - e^{-u}$\n$P(U \\le 1) = \\left[-u e^{-u} - e^{-u}\\right]_0^1 = (-e^{-1} - e^{-1}) - (0 - 1) = 1 - 2e^{-1}$\n$= 1 - 2 \\times 0.3679 = 0.2642$。\n（$f_U$ は2変数の変数変換 $U = X + Y$、$V = X/(X+Y)$ で、ヤコビアン $|J| = u$ から求まります。）\n$1 - e^{-1} = 0.632$ は X 1つが 1 以下になる確率で、和の確率ではありません。',
  },
  {
    id: 'pre1-probability-transformation-06',
    lesson: 'pre1-probability-transformation',
    level: 3,
    question: 'U が区間 0〜1 の一様分布にしたがうとき、$Y = -2\\log U$（log は自然対数）の分布はどれか。',
    choices: [
      '平均 2 の指数分布（自由度 2 のカイ二乗分布と同じ）',
      '平均 1/2 の指数分布',
      '区間 0〜2 の一様分布',
      '標準正規分布',
      '平均 2 のポアソン分布',
    ],
    answer: 0,
    explanation:
      'Y は 0 以上の値をとります。累積分布関数から求めます（y > 0）。\n$P(Y \\le y) = P(-2\\log U \\le y) = P\\left(\\log U \\ge -\\dfrac{y}{2}\\right) = P(U \\ge e^{-y/2}) = 1 - e^{-y/2}$\nこれは平均 2（率 1/2）の指数分布の累積分布関数で、自由度 2 のカイ二乗分布と同じ分布です。\n率と平均を取りちがえると「平均 1/2」になります。ポアソン分布は整数の値しかとらないので当てはまりません。',
  },

  // ---------- 極限定理と漸近理論 ----------
  {
    id: 'pre1-probability-limits-01',
    lesson: 'pre1-probability-limits',
    level: 1,
    question: '確率変数の列の収束の関係として正しいものはどれか。',
    choices: [
      '分布収束するなら、必ず概収束する',
      '確率収束するなら、必ず概収束する',
      '概収束するなら確率収束し、確率収束するなら分布収束する',
      '分布収束と確率収束は、いつも同じ意味である',
      '大数の弱法則は、標本平均が母平均に分布収束することだけを主張し、確率収束は主張しない',
    ],
    answer: 2,
    explanation:
      '強さの関係は「概収束 ⇒ 確率収束 ⇒ 分布収束」で、逆向きは一般に成り立ちません。\n分布収束は分布の形が近づくだけで、$X_n = -Z$（Z は標準正規分布）のように、分布は同じでも値は近づかない例があります。ただし、収束先が定数のときは分布収束と確率収束が同じになります。\n大数の弱法則は、標本平均が母平均に**確率収束**することを主張します。',
  },
  {
    id: 'pre1-probability-limits-02',
    lesson: 'pre1-probability-limits',
    level: 2,
    kind: 'numeric',
    question:
      '不良率 0.4% の製品を 500 個検査する。不良品の個数 X をポアソン分布で近似して、$P(X \\le 1)$ を求めよ。必要なら $e^{-2} = 0.1353$ を使ってよい。',
    answerValue: 0.4059,
    tolerance: 0.0005,
    unit: '小数第3位まで',
    explanation:
      'X は $B(500, 0.004)$ で、n が大きく p が小さいので、少数法則により平均 $\\lambda = np = 500 \\times 0.004 = 2$ のポアソン分布で近似します。\n$P(X = 0) = e^{-2} = 0.1353$\n$P(X = 1) = 2e^{-2} = 0.2706$\n$P(X \\le 1) = 3e^{-2} = 0.4059 \\approx 0.406$。\n（二項分布で正確に計算すると約 0.4055 で、よく合っています。）\nX = 1 の項を忘れると 0.135、$P(X = 1)$ だけなら 0.271 です。',
  },
  {
    id: 'pre1-probability-limits-03',
    lesson: 'pre1-probability-limits',
    level: 2,
    question:
      '1日の問い合わせ件数 X が平均 100 のポアソン分布にしたがう。$P(X \\ge 115)$ を、連続修正をした正規近似で求めた値として最も近いものはどれか。必要なら標準正規分布にしたがう Z について $P(Z \\ge 0.145) = 0.4424$、$P(Z \\ge 1.45) = 0.0735$、$P(Z \\ge 1.50) = 0.0668$、$P(Z \\ge 1.55) = 0.0606$ を使ってよい。',
    choices: ['0.0668', '0.0735', '0.0606', '0.4424', '0.9265'],
    answer: 1,
    explanation:
      '平均 λ のポアソン分布は、λ が大きいと平均 λ・分散 λ の正規分布で近似できます。平均 100、分散 100、標準偏差 10。\n連続修正：「115 以上」は連続な値では「114.5 以上」とみなします。\n$P(X \\ge 115) \\approx P\\left(Z \\ge \\dfrac{114.5 - 100}{10}\\right) = P(Z \\ge 1.45) = 0.0735$。\n（ポアソン分布で正確に計算すると約 0.0759。）\n0.0668 は連続修正なし、0.0606 は 115.5 と向きを逆に修正したもの、0.4424 は分散 100 を標準偏差と取りちがえて 100 で割ったもの、0.9265 は反対側の確率です。',
  },
  {
    id: 'pre1-probability-limits-04',
    lesson: 'pre1-probability-limits',
    level: 2,
    kind: 'numeric',
    question:
      '$X_1, \\dots, X_n$ が独立に平均 4 のポアソン分布にしたがい、$\\bar{X}_n$ を標本平均とする。デルタ法によると、$\\sqrt{n}\\left(\\sqrt{\\bar{X}_n} - 2\\right)$ は $N(0, v)$ に分布収束する。v を求めよ。',
    answerValue: 0.25,
    tolerance: 0.005,
    unit: '小数第2位まで',
    explanation:
      'デルタ法：$\\sqrt{n}(g(\\bar{X}_n) - g(\\mu)) \\to N(0, g\'(\\mu)^2\\sigma^2)$。\nポアソン分布なので $\\mu = \\sigma^2 = 4$。$g(x) = \\sqrt{x}$ で $g\'(x) = \\dfrac{1}{2\\sqrt{x}}$、$g\'(4) = \\dfrac{1}{4}$。\n$v = \\left(\\dfrac{1}{4}\\right)^2 \\times 4 = \\dfrac{4}{16} = 0.25$。\n（一般に $\\frac{1}{4\\lambda} \\times \\lambda = \\frac{1}{4}$ で λ によらないので、平方根はポアソン分布の分散をそろえる変換として使われます。）\n傾きを2乗し忘れると $\\frac{1}{4} \\times 4 = 1$ になります。',
  },
  {
    id: 'pre1-probability-limits-05',
    lesson: 'pre1-probability-limits',
    level: 3,
    question:
      '$X_1, \\dots, X_n$ は独立に同じ分布にしたがい、平均 μ、分散 $\\sigma^2$（$0 < \\sigma^2 < \\infty$）をもつが、正規分布とは限らない。$\\bar{X}_n$ を標本平均、$S_n$ を標本標準偏差とする。正しい記述はどれか。',
    choices: [
      '$\\sqrt{n}(\\bar{X}_n - \\mu)/S_n$ は、どんな n でもちょうど自由度 n − 1 の t 分布にしたがう',
      '$\\bar{X}_n$ は正規分布 $N(\\mu, \\sigma^2)$ に分布収束する',
      '$\\sqrt{n}(\\bar{X}_n - \\mu)$ は 0 に確率収束する',
      '$\\sqrt{n}(\\bar{X}_n - \\mu)/S_n$ は、標準正規分布に分布収束する',
      'スルツキーの補題を使うには、$S_n$ が確率変数に分布収束すればよく、定数に収束する必要はない',
    ],
    answer: 3,
    explanation:
      '中心極限定理から $\\sqrt{n}(\\bar{X}_n - \\mu)/\\sigma \\to N(0, 1)$（分布収束）。大数の法則と連続写像定理から $\\sigma/S_n \\to 1$（確率収束）。スルツキーの補題で積をとると、$\\sqrt{n}(\\bar{X}_n - \\mu)/S_n \\to N(0, 1)$ です。\n1番目：ちょうど t 分布になるのは母集団が正規分布のとき。\n2番目：$\\bar{X}_n$ 自体は μ（定数）に収束します。正規分布に近づくのは $\\sqrt{n}$ 倍したずれです。\n3番目：$\\sqrt{n}(\\bar{X}_n - \\mu)$ は $N(0, \\sigma^2)$ に分布収束し、0 には近づきません。\n5番目：スルツキーの補題では、片方が**定数に確率収束**することが必要です。',
  },
  {
    id: 'pre1-probability-limits-06',
    lesson: 'pre1-probability-limits',
    level: 3,
    question:
      '$X_1, \\dots, X_n$ が独立に区間 0〜1 の一様分布にしたがい、$M_n = \\max(X_1, \\dots, X_n)$ とする。正しい記述はどれか。',
    choices: [
      '$P(M_n \\le x) = nx$（$0 \\le x \\le 1/n$）である',
      '$M_n$ は 1 に確率収束しない',
      '$n(1 - M_n)$ は 0 に確率収束する',
      '$M_n$ を標準化したものは、中心極限定理により正規分布に分布収束する',
      '$n(1 - M_n)$ は平均 1 の指数分布に分布収束する',
    ],
    answer: 4,
    explanation:
      '最大値の累積分布関数は $P(M_n \\le x) = x^n$（$0 \\le x \\le 1$）です。\n$t > 0$ について $P(n(1 - M_n) > t) = P\\left(M_n < 1 - \\dfrac{t}{n}\\right) = \\left(1 - \\dfrac{t}{n}\\right)^n \\to e^{-t}$。これは平均 1 の指数分布の生存関数なので、$n(1 - M_n)$ は平均 1 の指数分布に分布収束します（極値分布の一例）。\n$M_n$ 自体は $P(M_n \\le 1 - \\varepsilon) = (1 - \\varepsilon)^n \\to 0$ なので 1 に確率収束します。最大値は和ではないので、中心極限定理は使えません。1番目は $x^n$ と $nx$ の取りちがえです。',
  },
]
