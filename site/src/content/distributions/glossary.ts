import type { GlossaryTerm } from '../../types'

export const glossary: GlossaryTerm[] = [
  {
    term: 'ベルヌーイ試行',
    reading: 'べるぬーいしこう',
    lesson: 'distributions-binomial',
    meaning: '結果が「成功」「失敗」の2通りしかない試行。成功確率 $p$ が毎回同じで、各回が独立なものをくり返すことが多い。',
    easy: '「当たりかはずれか」のように、結果が2つしかない1回の試し。',
  },
  {
    term: 'ベルヌーイ分布',
    reading: 'べるぬーいぶんぷ',
    lesson: 'distributions-binomial',
    meaning: '1回のベルヌーイ試行で、成功なら1、失敗なら0をとる確率変数の分布。期待値 $p$、分散 $p(1-p)$。二項分布 $B(1, p)$ と同じ。',
    easy: '1回だけ試したときの「当たりなら1、はずれなら0」の分布。',
  },
  {
    term: '二項分布',
    reading: 'にこうぶんぷ',
    lesson: 'distributions-binomial',
    meaning:
      '成功確率 $p$ のベルヌーイ試行を独立に $n$ 回行ったときの成功回数の分布 $B(n, p)$。$P(X=k) = {}_{n}C_{k}\\,p^k(1-p)^{n-k}$、期待値 $np$、分散 $np(1-p)$。',
    easy: '「n 回やって何回うまくいくか」の確率の分布。',
  },
  {
    term: 'パラメータ（母数）',
    reading: 'ぱらめーた（ぼすう）',
    lesson: 'distributions-binomial',
    meaning: '確率分布の形を決める定数。二項分布の $n, p$、ポアソン分布の $\\lambda$、正規分布の $\\mu, \\sigma^2$ など。',
    easy: '分布の「設定値」。これを決めるとグラフの形が1つに決まる。',
  },
  {
    term: 'ポアソン分布',
    reading: 'ぽあそんぶんぷ',
    lesson: 'distributions-poisson',
    meaning:
      '一定の時間・範囲で平均 $\\lambda$ 回起こる稀な事象の発生回数の分布 $Po(\\lambda)$。$P(X=k) = \\lambda^k e^{-\\lambda}/k!$、期待値も分散も $\\lambda$。',
    easy: '「1時間に客が何人来るか」のような、決まった時間の中で起こる回数の分布。',
  },
  {
    term: '稀な事象',
    reading: 'まれなじしょう',
    lesson: 'distributions-poisson',
    meaning: '起こるチャンスは多いが、1回あたりの起こる確率がとても小さい出来事。二項分布で $n$ が大きく $p$ が小さい状況で、ポアソン分布で近似できる。',
    easy: 'めったに起こらないけれど、チャンスがたくさんあるので、ときどき起こる出来事。',
  },
  {
    term: '再生性',
    reading: 'さいせいせい',
    lesson: 'distributions-poisson',
    meaning:
      '独立な確率変数の和が、もとと同じ種類の分布に従う性質。例：$Po(\\lambda_1) + Po(\\lambda_2) = Po(\\lambda_1 + \\lambda_2)$、正規分布の和も正規分布。',
    easy: '同じ種類の分布どうしを足しても、また同じ種類の分布になること。',
  },
  {
    term: '幾何分布',
    reading: 'きかぶんぷ',
    lesson: 'distributions-geometric-hypergeometric',
    meaning:
      '成功確率 $p$ のベルヌーイ試行を、初めて成功するまでくり返したときの試行回数の分布。$P(X=k) = (1-p)^{k-1}p$、期待値 $1/p$、分散 $(1-p)/p^2$。失敗の回数で定義する流儀もある。',
    easy: '「初めて当たるまで何回かかるか」の分布。',
  },
  {
    term: '無記憶性',
    reading: 'むきおくせい',
    lesson: 'distributions-geometric-hypergeometric',
    meaning: '$P(X > s + t \\mid X > s) = P(X > t)$ が成り立つ性質。離散型では幾何分布、連続型では指数分布がもつ。',
    easy: 'これまでどれだけ待ったか（失敗したか）が、この先の確率に影響しないこと。',
  },
  {
    term: '負の二項分布',
    reading: 'ふのにこうぶんぷ',
    lesson: 'distributions-geometric-hypergeometric',
    meaning:
      '成功確率 $p$ のベルヌーイ試行で、$r$ 回目の成功が起こるまでの試行回数の分布。期待値 $r/p$、分散 $r(1-p)/p^2$。$r = 1$ が幾何分布。失敗の回数で定義する流儀もある。',
    easy: '「r 回当たるまで何回かかるか」の分布。',
  },
  {
    term: '超幾何分布',
    reading: 'ちょうきかぶんぷ',
    lesson: 'distributions-geometric-hypergeometric',
    meaning:
      '$N$ 個（うち当たり $M$ 個）から $n$ 個を非復元抽出したときの当たりの個数の分布。期待値 $np$、分散 $np(1-p)\\frac{N-n}{N-1}$（$p = M/N$）。',
    easy: 'くじを「戻さずに」何本か引いたとき、当たりが何本かの分布。',
  },
  {
    term: '非復元抽出',
    reading: 'ひふくげんちゅうしゅつ',
    lesson: 'distributions-geometric-hypergeometric',
    meaning: '取り出したものを元に戻さずに、次を取り出す抽出の方法。戻す方法は復元抽出という。',
    easy: '一度引いたくじは戻さないで、次を引くやり方。',
  },
  {
    term: '有限母集団修正',
    reading: 'ゆうげんぼしゅうだんしゅうせい',
    lesson: 'distributions-geometric-hypergeometric',
    meaning: '非復元抽出のときに分散にかかる係数 $\\frac{N-n}{N-1}$。母集団の大きさ $N$ が抽出数 $n$ より十分大きければほぼ1になる。',
    easy: '戻さずに取り出すと散らばりが少し小さくなる、その「小さくなる割合」。',
  },
  {
    term: '連続一様分布',
    reading: 'れんぞくいちようぶんぷ',
    lesson: 'distributions-uniform-exponential',
    meaning: '区間 $[a, b]$ 上で確率密度が一定 $1/(b-a)$ の分布 $U(a, b)$。期待値 $(a+b)/2$、分散 $(b-a)^2/12$。',
    easy: 'a から b までの、どの値も同じくらい出やすい分布。グラフは長方形。',
  },
  {
    term: '指数分布',
    reading: 'しすうぶんぷ',
    lesson: 'distributions-uniform-exponential',
    meaning:
      '確率密度関数 $f(x) = \\lambda e^{-\\lambda x}$（$x \\ge 0$）の分布。$P(X > t) = e^{-\\lambda t}$、期待値 $1/\\lambda$、分散 $1/\\lambda^2$。ポアソン過程の到着間隔の分布。',
    easy: '「次の出来事が起こるまでの待ち時間」の分布。',
  },
  {
    term: '正規分布',
    reading: 'せいきぶんぷ',
    lesson: 'distributions-normal',
    meaning: '平均 $\\mu$・分散 $\\sigma^2$ をパラメータとする左右対称のつりがね形の連続分布 $N(\\mu, \\sigma^2)$。',
    easy: '平均のあたりが一番多く、左右に同じようになだらかに減っていく、つりがね形の分布。',
  },
  {
    term: '標準正規分布',
    reading: 'ひょうじゅんせいきぶんぷ',
    lesson: 'distributions-normal',
    meaning: '平均0・分散1の正規分布 $N(0, 1)$。確率は標準正規分布表から読み取る。',
    easy: '平均0、標準偏差1にそろえた「基準の」正規分布。',
  },
  {
    term: '上側確率',
    reading: 'うわがわかくりつ',
    lesson: 'distributions-normal',
    meaning: '確率変数がある値以上になる確率。標準正規分布では $Q(z) = P(Z \\ge z)$。',
    easy: 'その値より右側（大きい側）の面積。',
  },
  {
    term: '2変量正規分布',
    reading: 'にへんりょうせいきぶんぷ',
    lesson: 'distributions-normal-properties',
    meaning:
      '2つの確率変数の組 $(X, Y)$ の分布で、平均 $\\mu_X, \\mu_Y$、分散 $\\sigma_X^2, \\sigma_Y^2$、相関係数 $\\rho$ の5つで決まる。それぞれ単独では正規分布で、確率密度の等高線は楕円になる。',
    easy: '身長と体重のように、2つの正規分布の量が組になって、関係（相関）をもっている分布。',
  },
  {
    term: '条件付き期待値',
    reading: 'じょうけんつききたいち',
    lesson: 'distributions-normal-properties',
    meaning: '$X = x$ と分かったときの $Y$ の期待値 $E(Y \\mid X = x)$。2変量正規分布では $x$ の1次式（直線）になる。',
    easy: '「X がこの値の人たちだけ」を集めたときの、Y の平均。',
  },
]
