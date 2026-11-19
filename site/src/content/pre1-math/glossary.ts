import type { GlossaryTerm } from '../../types'

export const glossary: GlossaryTerm[] = [
  // 微分の考え方
  {
    term: '微分係数',
    reading: 'びぶんけいすう',
    lesson: 'pre1-math-derivative',
    meaning: "点 a での変化の割合 $\\frac{f(a + h) - f(a)}{h}$ で、h を 0 に近づけたときの値 $f'(a)$。グラフの接線の傾き。",
    easy: 'その一点での「傾き」。その瞬間にどれくらいの速さで増えているか。',
  },
  {
    term: '導関数',
    reading: 'どうかんすう',
    lesson: 'pre1-math-derivative',
    meaning: "各点 x での微分係数を返す関数 $f'(x)$。$\\frac{dy}{dx}$ とも書く。導関数を求めることを「微分する」という。",
    easy: '「x を入れると、そこでの傾きが出てくる」関数。',
  },
  {
    term: '合成関数の微分（チェーンルール）',
    reading: 'ごうせいかんすうのびぶん',
    lesson: 'pre1-math-derivative',
    meaning: '$y = f(u)$、$u = g(x)$ のとき $\\frac{dy}{dx} = \\frac{dy}{du} \\times \\frac{du}{dx}$。例：$\\{(2x + 1)^3\\}\' = 3(2x + 1)^2 \\times 2$。',
    easy: 'かっこの中に式があるときは、外側を微分してから、中身の微分をかける。',
  },
  {
    term: '極値',
    reading: 'きょくち',
    lesson: 'pre1-math-derivative',
    meaning: '増加から減少に変わる点の値（極大値）と、減少から増加に変わる点の値（極小値）。微分可能な関数では、極値をとる点で導関数が 0 になる。',
    easy: '山の頂上と谷の底の高さ。そこでは傾きが 0。',
  },
  // 積分の考え方
  {
    term: '原始関数（不定積分）',
    reading: 'げんしかんすう',
    lesson: 'pre1-math-integral',
    meaning: '微分すると f(x) になる関数 F(x)。定数 C を足しても原始関数なので、$\\int f(x)\\,dx = F(x) + C$ と書く。',
    easy: '「微分する前の関数」。微分を逆にたどったもの。',
  },
  {
    term: '定積分',
    reading: 'ていせきぶん',
    lesson: 'pre1-math-integral',
    meaning: '$\\int_a^b f(x)\\,dx = F(b) - F(a)$。a から b までの、曲線 f(x) の下の（向きつきの）面積。',
    easy: 'グラフの下の、a から b までの面積。確率密度なら、その範囲に入る確率。',
  },
  {
    term: '部分積分',
    reading: 'ぶぶんせきぶん',
    lesson: 'pre1-math-integral',
    meaning: "$\\int f g'\\,dx = fg - \\int f' g\\,dx$。積の微分を逆に使う積分の方法。指数分布の期待値などで使う。",
    easy: 'かけ算の積分で、片方を微分して簡単にし、もう片方を積分する方法。',
  },
  {
    term: '正規化定数',
    reading: 'せいきかていすう',
    lesson: 'pre1-math-integral',
    meaning: '関数の全体の積分が 1 になるようにかける定数。例：$c\\,x(1 - x)$（0 ≤ x ≤ 1）なら c = 6。',
    easy: '面積の合計をちょうど 1 にするための調整の数。',
  },
  // 指数・対数と微分
  {
    term: '自然対数',
    reading: 'しぜんたいすう',
    lesson: 'pre1-math-exp-log',
    meaning: 'e（≒ 2.718）を底とする対数。$e^y = x$ のとき $y = \\log x$。ln x とも書く。',
    easy: '「e を何乗すると x になるか」の答え。',
  },
  {
    term: '対数尤度',
    reading: 'たいすうゆうど',
    lesson: 'pre1-math-exp-log',
    meaning: '尤度 L の自然対数 log L。独立なデータの尤度は積なので、対数をとると和になり、微分しやすい。log は増加関数なので、最大になるパラメータは L と同じ。',
    easy: '尤度（かけ算）を log で足し算に直したもの。一番高い場所は変わらない。',
  },
  {
    term: '1次近似',
    reading: 'いちじきんじ',
    lesson: 'pre1-math-exp-log',
    meaning: "$f(x) \\approx f(a) + f'(a)(x - a)$。点 a の近くで関数を接線で置きかえる近似。テイラー展開の1次の項まで。デルタ法の基礎。",
    easy: '曲線を、近くでは接線（まっすぐな線）とみなして計算すること。',
  },
  // 偏微分と重積分
  {
    term: '偏微分',
    reading: 'へんびぶん',
    lesson: 'pre1-math-multivariable',
    meaning: '多変数の関数で、ほかの変数を定数とみなして1つの変数について微分すること。$\\frac{\\partial f}{\\partial x}$ と書く。',
    easy: 'ほかの変数は止めておいて、1つだけ動かしたときの傾き。',
  },
  {
    term: '重積分',
    reading: 'じゅうせきぶん',
    lesson: 'pre1-math-multivariable',
    meaning: '2変数以上の関数の積分。長方形の範囲なら、1つの変数で積分してから、もう1つの変数で積分する。同時確率密度関数を積分すると確率になる。',
    easy: '曲面の下の体積。薄切りの面積を足し合わせて求める。',
  },
  {
    term: 'ヤコビアン',
    lesson: 'pre1-math-multivariable',
    meaning: '変数変換で、もとの変数を新しい変数で偏微分して並べた行列の行列式。変換後の密度は「もとの密度 × |ヤコビアン|」。1変数なら $\\left|\\frac{dx}{dy}\\right|$。',
    easy: '変数を変えたときに、面積（長さ）が何倍に伸び縮みするかの調整の倍率。',
  },
  // ベクトルと行列
  {
    term: '内積',
    reading: 'ないせき',
    lesson: 'pre1-math-matrix',
    meaning: '2つのベクトルの同じ位置の成分をかけて足したもの $\\sum a_i b_i$。$|\\boldsymbol{a}||\\boldsymbol{b}|\\cos\\theta$ に等しく、0 なら2つは直交する。',
    easy: '「かけて足す」。2つの矢印の向きがそろっているほど大きく、直角なら 0。',
  },
  {
    term: '逆行列',
    reading: 'ぎゃくぎょうれつ',
    lesson: 'pre1-math-matrix',
    meaning: '$A^{-1}A = AA^{-1} = I$ となる行列。2 × 2 なら $\\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$。行列式が 0 のときは存在しない。',
    easy: '数の「逆数」にあたる行列。かけると元に戻る。',
  },
  {
    term: '行列式',
    reading: 'ぎょうれつしき',
    lesson: 'pre1-math-matrix',
    meaning: '2 × 2 なら $ad - bc$。行列で図形を移したときに面積が何倍になるか（向きつき）を表す。0 なら逆行列がない。',
    easy: '行列で動かしたときの「面積の倍率」。0 なら平面がつぶれている。',
  },
  {
    term: '正規方程式',
    reading: 'せいきほうていしき',
    lesson: 'pre1-math-matrix',
    meaning: "回帰の最小二乗法で、残差の2乗和を各係数で偏微分して 0 とおいた連立方程式 $X'X\\boldsymbol{\\beta} = X'\\boldsymbol{y}$。解は $\\hat{\\boldsymbol{\\beta}} = (X'X)^{-1}X'\\boldsymbol{y}$。",
    easy: '回帰係数を決めるための連立方程式を、行列でまとめて書いたもの。',
  },
  {
    term: '分散共分散行列',
    reading: 'ぶんさんきょうぶんさんぎょうれつ',
    lesson: 'pre1-math-matrix',
    meaning: '対角に各変数の分散、それ以外に共分散を並べた対称行列 Σ。線形結合 $\\boldsymbol{a}\'\\boldsymbol{X}$ の分散は $\\boldsymbol{a}\'\\Sigma\\boldsymbol{a}$。',
    easy: '分散と共分散をまとめて1つの表にしたもの。',
  },
  // 固有値と固有ベクトル
  {
    term: '固有値・固有ベクトル',
    reading: 'こゆうち・こゆうベクトル',
    lesson: 'pre1-math-eigen',
    meaning: '$A\\boldsymbol{v} = \\lambda\\boldsymbol{v}$（v ≠ 0）を満たす λ と v。λ は固有方程式 $\\det(A - \\lambda I) = 0$ の解。',
    easy: '行列をかけても向きが変わらない特別な矢印（固有ベクトル）と、そのときの伸び縮みの倍率（固有値）。',
  },
  {
    term: '固有値分解',
    reading: 'こゆうちぶんかい',
    lesson: 'pre1-math-eigen',
    meaning: "対称行列を、直交する固有ベクトルを並べた行列 P と固有値を対角に並べた行列 Λ で $P\\Lambda P'$ と表すこと。分散共分散行列の固有値分解が主成分分析。",
    easy: '散らばりを、直角に交わる「主な向き」ごとの散らばりに分けて書き直すこと。',
  },
  {
    term: '2次形式',
    reading: 'にじけいしき',
    lesson: 'pre1-math-eigen',
    meaning: "対称行列 A とベクトル x で作る $\\boldsymbol{x}'A\\boldsymbol{x}$。2 × 2 なら $a x_1^2 + 2b x_1 x_2 + c x_2^2$。",
    easy: '各変数の2乗と、2つずつの積だけでできた式を、行列でまとめて書いたもの。',
  },
]
