import type { GlossaryTerm } from '../../types'

export const glossary: GlossaryTerm[] = [
  // 分数・小数・割合
  {
    term: '約分',
    reading: 'やくぶん',
    lesson: 'math-fraction-percent',
    meaning: '分数の分母と分子を同じ数で割って、簡単な形にすること。例：$\\frac{6}{8} = \\frac{3}{4}$。',
    easy: '量は変えずに、数を小さくして見やすくすること。',
  },
  {
    term: '通分',
    reading: 'つうぶん',
    lesson: 'math-fraction-percent',
    meaning: '分母のちがう分数を、分母が同じ分数に直すこと。分数のたし算・ひき算の前に行う。',
    easy: '大きさのちがうマスを、同じ大きさのマスに切り直すこと。',
  },
  {
    term: '割合',
    reading: 'わりあい',
    lesson: 'math-fraction-percent',
    meaning: '比べる量 ÷ もとにする量。もとにする量を1としたときの大きさ。',
    easy: '「全体のうち、どれだけか」を0〜1の数で表したもの。',
  },
  {
    term: '百分率',
    reading: 'ひゃくぶんりつ',
    lesson: 'math-fraction-percent',
    meaning: '割合を100倍して % をつけたもの。0.3 = 30%。',
    easy: '全体を100としたときに、いくつ分か。',
  },
  {
    term: '%ポイント',
    reading: 'パーセントポイント',
    lesson: 'math-fraction-percent',
    meaning: '百分率どうしの差。20%から30%への変化は「10ポイント増」。',
    easy: '%の数字そのものが、いくつ増えたか・減ったか。「何%増えたか」とは別物。',
  },
  {
    term: '四捨五入と ≒（≈）',
    reading: 'ししゃごにゅう',
    lesson: 'math-fraction-percent',
    meaning: '切る位置のすぐ右の数字が0〜4なら切り捨て、5〜9なら切り上げること。四捨五入した値はもとの値と「ほぼ等しい」ので、= の代わりに ≒ や $\\approx$（ニアリーイコール）を使う。',
    easy: 'きりのいいところで数を丸めること。丸めた値には「だいたい同じ」の記号をつける。',
  },

  // 文字式と方程式
  {
    term: '代入',
    reading: 'だいにゅう',
    lesson: 'math-algebra',
    meaning: '式の中の文字に、具体的な数を入れること。負の数はかっこをつけて入れる。',
    easy: '文字という「入れ物」に、数を入れてみること。',
  },
  {
    term: '分配法則',
    reading: 'ぶんぱいほうそく',
    lesson: 'math-algebra',
    meaning: '$a(b + c) = ab + ac$ が成り立つというきまり。',
    easy: 'かっこの外の数を、かっこの中の全部にかけてよい。',
  },
  {
    term: '一次方程式',
    reading: 'いちじほうていしき',
    lesson: 'math-algebra',
    meaning: '$2x + 3 = 11$ のように、文字が2乗などにならずにそのまま出てくる方程式。',
    easy: '天秤がつり合うような x の値を探す式。',
  },
  {
    term: '移項',
    reading: 'いこう',
    lesson: 'math-algebra',
    meaning: '等式の一方の辺の項を、符号を変えて他方の辺へ移すこと。両辺に同じ数を足す（引く）ことと同じ。',
    easy: '「+3」を反対側に移すと「−3」になる。',
  },
  {
    term: '式の変形（〜について解く）',
    reading: 'しきのへんけい',
    lesson: 'math-algebra',
    meaning: '文字を含む等式を、ある文字 = … の形に直すこと。例：$z = \\frac{x - \\mu}{\\sigma}$ を x について解くと $x = \\mu + z\\sigma$。',
    easy: 'やった操作を、逆の順番で逆にたどること。',
  },
  {
    term: '展開',
    reading: 'てんかい',
    lesson: 'math-algebra',
    meaning: 'かっこのついた式を、分配法則でかっこのない式に直すこと。例：$(x - a)^2 = x^2 - 2ax + a^2$。',
    easy: 'かっこの中身を、1つずつかけてばらすこと。',
  },
  {
    term: '不等号',
    reading: 'ふとうごう',
    lesson: 'math-algebra',
    meaning: '$<$、$>$、$\\le$（≦、以下）、$\\ge$（≧、以上）のように大小関係を表す記号。不等式の両辺に負の数をかけたり割ったりすると、向きが逆になる。',
    easy: '口が開いているほうが大きい。「以上・以下」はちょうど等しいときも含む。',
  },

  // 2乗と平方根
  {
    term: '累乗',
    reading: 'るいじょう',
    lesson: 'math-square-root',
    meaning: '同じ数をくり返しかけること。$2^3 = 2 \\times 2 \\times 2$。右上の数を指数という。',
    easy: '「何回かけるか」を右上の小さい数で書いたもの。',
  },
  {
    term: '平方根',
    reading: 'へいほうこん',
    lesson: 'math-square-root',
    meaning: '2乗すると a になる数。正と負の2つがあり、正のほうを $\\sqrt{a}$ と書く。',
    easy: '面積が a の正方形の、1辺の長さ。',
  },
  {
    term: 'ルート',
    lesson: 'math-square-root',
    meaning: '記号 √ のこと。$\\sqrt{a}$ は a の正の平方根。',
    easy: '2乗の反対の操作。分散から標準偏差に戻るときに使う。',
  },

  // Σ記号と添字
  {
    term: '添字',
    reading: 'そえじ',
    lesson: 'math-sigma',
    meaning: '$x_1, x_2, \\dots$ の右下の小さい数。何番目のデータかを表す。',
    easy: 'データにつけた背番号。値そのものではない。',
  },
  {
    term: 'Σ（シグマ）',
    reading: 'シグマ',
    lesson: 'math-sigma',
    meaning: '$\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$ のように、足し算をまとめて書く記号。',
    easy: '「下の番号から上の番号まで、右の式を全部足す」という命令。',
  },

  // 関数・グラフ・面積
  {
    term: '関数',
    reading: 'かんすう',
    lesson: 'math-function-graph-area',
    meaning: 'x の値を1つ決めると、y の値がただ1つに決まる対応のきまり。',
    easy: '数を入れると、決まった数が1つ出てくる機械。',
  },
  {
    term: '傾き',
    reading: 'かたむき',
    lesson: 'math-function-graph-area',
    meaning: '直線 $y = a + bx$ の b。x が1増えたときの y の増加量。',
    easy: '横に1進んだとき、上に何進むか。マイナスなら右下がり。',
  },
  {
    term: '切片',
    reading: 'せっぺん',
    lesson: 'math-function-graph-area',
    meaning: '直線 $y = a + bx$ の a。x = 0 のときの y の値。',
    easy: 'グラフが縦の軸と交わる高さ。',
  },
  {
    term: '積分',
    reading: 'せきぶん',
    lesson: 'math-function-graph-area',
    meaning: '関数のグラフの下の面積を求める操作。$\\int_a^b f(x)\\,dx$ と書く。',
    easy: '曲線の下の、a から b までの面積。連続な分布では確率になる。',
  },
  {
    term: 'ネイピア数',
    reading: 'ネイピアすう',
    lesson: 'math-function-graph-area',
    meaning: '$e = 2.71828\\ldots$ という定数。指数分布・正規分布・ポアソン分布の式に出てくる。',
    easy: '統計や自然科学でよく使われる、2より少し大きい特別な数。',
  },
  {
    term: '対数',
    reading: 'たいすう',
    lesson: 'math-function-graph-area',
    meaning: '「何乗すればその数になるか」を表す数。$10^2 = 100$ なので $\\log_{10} 100 = 2$。',
    easy: '桁の数のようなもの。桁ちがいに広がったデータを見やすくするのに使う。',
  },

  // 場合の数
  {
    term: '樹形図',
    reading: 'じゅけいず',
    lesson: 'math-counting',
    meaning: '起こりうる場合を、枝分かれの図でもれなく書き出したもの。',
    easy: '「次はどれ？」を枝で全部書いた図。',
  },
  {
    term: '積の法則',
    reading: 'せきのほうそく',
    lesson: 'math-counting',
    meaning: 'A の選び方が m 通りあり、そのそれぞれに対して B の選び方が n 通りあるとき、全部で $m \\times n$ 通り。',
    easy: '「それぞれに」と言えたら、かけ算。',
  },
  {
    term: '階乗',
    reading: 'かいじょう',
    lesson: 'math-counting',
    meaning: '$n! = n \\times (n-1) \\times \\cdots \\times 1$。$0! = 1$ と決める。',
    easy: 'n 個のものを1列に並べる方法の数。',
  },
  {
    term: '順列',
    reading: 'じゅんれつ',
    lesson: 'math-counting',
    meaning: 'n 個から r 個を選んで順番に並べる方法の数 $ {}_nP_r = \\frac{n!}{(n-r)!}$。',
    easy: '選んで、順番や役割もつける数え方。',
  },
  {
    term: '組合せ',
    reading: 'くみあわせ',
    lesson: 'math-counting',
    meaning: 'n 個から r 個を選ぶ方法の数（順番は区別しない）$ {}_nC_r = \\frac{n!}{r!(n-r)!}$。',
    easy: '選ぶだけで、順番は気にしない数え方。「n 回中 r 回成功する並び方」の数でもある。',
  },
  {
    term: 'パスカルの三角形',
    reading: 'パスカルのさんかくけい',
    lesson: 'math-counting',
    meaning: '組合せ $ {}_nC_r$ を三角形に並べたもの。各数は左上と右上の数の和になる。',
    easy: '上の2つを足して下に書いていく、数の三角形。',
  },
]
