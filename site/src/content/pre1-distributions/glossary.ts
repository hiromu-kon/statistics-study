import type { GlossaryTerm } from '../../types'

export const glossary: GlossaryTerm[] = [
  {
    term: '離散一様分布',
    reading: 'りさんいちようぶんぷ',
    lesson: 'pre1-distributions-discrete',
    meaning: '1, 2, …, N のどの値も確率 1/N でとる分布。平均 $(N+1)/2$、分散 $(N^2-1)/12$。',
    easy: '公正なサイコロのように、どの目も同じくらい出る分布。',
  },
  {
    term: 'ベルヌーイ分布',
    reading: 'べるぬーいぶんぷ',
    lesson: 'pre1-distributions-discrete',
    meaning: '確率 p で 1、確率 1 − p で 0 をとる分布。平均 p、分散 $p(1-p)$。n 個の独立な和が二項分布。',
    easy: '1回だけの「成功（1）か失敗（0）か」。',
  },
  {
    term: '多項分布',
    reading: 'たこうぶんぷ',
    lesson: 'pre1-distributions-discrete',
    meaning:
      'k 種類の結果が確率 $p_1, \\dots, p_k$ で起こる試行を独立に n 回くり返したときの、各結果の回数の組の分布。$E(X_i) = np_i$、$V(X_i) = np_i(1-p_i)$、$\\mathrm{Cov}(X_i, X_j) = -np_ip_j$。',
    easy: '二項分布の「成功・失敗」を3種類以上に広げたもの。合計が決まっているので、ある結果が多いと他は少なくなる。',
  },
  {
    term: 'ガンマ分布',
    reading: 'がんまぶんぷ',
    lesson: 'pre1-distributions-continuous',
    meaning:
      '形状 k・尺度 θ の密度 $x^{k-1}e^{-x/\\theta}/(\\Gamma(k)\\theta^k)$ をもつ分布。平均 $k\\theta$、分散 $k\\theta^2$。率 $\\lambda = 1/\\theta$ で書く流儀もある。',
    easy: '待ち時間（指数分布）を k 個足したものの分布。k = 1 なら指数分布、θ = 2 なら χ² 分布。',
  },
  {
    term: 'ガンマ関数',
    reading: 'がんまかんすう',
    lesson: 'pre1-distributions-continuous',
    meaning: '$\\Gamma(k) = \\int_0^\\infty x^{k-1}e^{-x}dx$。$\\Gamma(k+1) = k\\Gamma(k)$、$\\Gamma(n) = (n-1)!$、$\\Gamma(1/2) = \\sqrt{\\pi}$。',
    easy: '階乗を整数以外にも広げたもの。密度の面積を 1 にそろえるのに使う。',
  },
  {
    term: 'ベータ分布',
    reading: 'べーたぶんぷ',
    lesson: 'pre1-distributions-continuous',
    meaning: '0 < x < 1 で密度が $x^{a-1}(1-x)^{b-1}/B(a, b)$ の分布。平均 $a/(a+b)$、分散 $ab/((a+b)^2(a+b+1))$。$Be(1, 1)$ は一様分布。',
    easy: '割合や確率のように 0〜1 の値をとる量の分布。a, b で 0 寄り・1 寄り・真ん中寄りに形を変えられる。',
  },
  {
    term: 'コーシー分布',
    reading: 'こーしーぶんぷ',
    lesson: 'pre1-distributions-continuous',
    meaning: '密度 $1/(\\pi(1+x^2))$ の分布（標準形）。平均・分散・積率母関数が存在しない。自由度 1 の t 分布と同じ。',
    easy: '山形だがすそが非常に厚く、とんでもない値がときどき出る分布。データをいくら集めても平均が落ち着かない。',
  },
  {
    term: '対数正規分布',
    reading: 'たいすうせいきぶんぷ',
    lesson: 'pre1-distributions-continuous',
    meaning: '$\\log X$ が $N(\\mu, \\sigma^2)$ に従うときの X の分布。中央値 $e^{\\mu}$、平均 $e^{\\mu + \\sigma^2/2}$。',
    easy: 'log をとると正規分布になるもの。所得や資産のように、かけ算で増え、右にすそが長い量に使う。',
  },
  {
    term: '多変量正規分布',
    reading: 'たへんりょうせいきぶんぷ',
    lesson: 'pre1-distributions-mvn',
    meaning: '平均ベクトル μ と分散共分散行列 Σ で決まる、ベクトル値の正規分布 $N_p(\\boldsymbol{\\mu}, \\Sigma)$。周辺分布・条件つき分布・線形変換がすべて正規分布になる。',
    easy: 'いくつもの量の組をまとめて扱う正規分布。',
  },
  {
    term: '分散共分散行列',
    reading: 'ぶんさんきょうぶんさんぎょうれつ',
    lesson: 'pre1-distributions-mvn',
    meaning: 'i 行 j 列に $\\mathrm{Cov}(X_i, X_j)$（対角は分散）を並べた行列 Σ。対称で、正定値（または半正定値）。',
    easy: '各変数のばらつきと、変数どうしの「一緒に動く度合い」を一覧にした表。',
  },
  {
    term: 'マハラノビス距離',
    reading: 'まはらのびすきょり',
    lesson: 'pre1-distributions-mvn',
    meaning: '$\\sqrt{(\\boldsymbol{x}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\boldsymbol{x}-\\boldsymbol{\\mu})}$。多変量正規分布の等高線はこの距離が一定の楕円（楕円体）。',
    easy: 'ばらつきと相関を考えに入れて測った「平均からのはなれ具合」。1次元なら「標準偏差何個分か」。',
  },
  {
    term: '非心分布',
    reading: 'ひしんぶんぷ',
    lesson: 'pre1-distributions-sampling',
    meaning:
      'χ²・t・F 分布の作り方で、正規分布の平均が 0 でない場合の分布（非心 χ²・非心 t・非心 F）。中心からのずれを非心度という。対立仮説のもとでの検定統計量の分布で、検出力の計算に使う。',
    easy: '「本当は差があるとき」に検定統計量が従う、中心がずれた分布。',
  },
  {
    term: '順序統計量',
    reading: 'じゅんじょとうけいりょう',
    lesson: 'pre1-distributions-sampling',
    meaning: '標本を小さい順に並べた $X_{(1)} \\le \\cdots \\le X_{(n)}$。最大値の累積分布関数は $F(x)^n$、一様分布の k 番目は $Be(k, n-k+1)$。',
    easy: 'データを小さい順に並べたときの、k 番目の値。最小値・最大値・中央値など。',
  },
]
