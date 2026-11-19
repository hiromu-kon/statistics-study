import type { GlossaryTerm } from '../../types'

export const glossary: GlossaryTerm[] = [
  // 散布図・共分散・相関係数
  {
    term: '散布図',
    reading: 'さんぷず',
    lesson: 'bivariate-scatter-correlation',
    meaning: '2つの量的変数の組 $(x_i, y_i)$ を、平面上の点として描いた図。',
    easy: '1人を1つの点にして、横に x、縦に y をとった図。点の並び方で2つの量の関係が見える。',
  },
  {
    term: '共分散',
    reading: 'きょうぶんさん',
    lesson: 'bivariate-scatter-correlation',
    meaning: 'x の偏差と y の偏差の積の平均 $s_{xy} = \\frac{1}{n}\\sum (x_i - \\bar{x})(y_i - \\bar{y})$。n − 1 で割る定義もある。',
    easy: '「x が平均より大きいとき、y も平均より大きいか」を測る数。プラスなら右上がり、マイナスなら右下がり。単位によって大きさが変わる。',
  },
  {
    term: '相関係数',
    reading: 'そうかんけいすう',
    lesson: 'bivariate-scatter-correlation',
    meaning: '共分散を2つの標準偏差の積で割った値 $r = s_{xy} / (s_x s_y)$。$-1 \\le r \\le 1$ で、単位によらない。',
    easy: '点が直線のまわりにどれくらい細く集まっているかを、−1〜1 で表した数。直線的な関係しか測れない。',
  },
  {
    term: '正の相関・負の相関',
    reading: 'せいのそうかん・ふのそうかん',
    lesson: 'bivariate-scatter-correlation',
    meaning: '相関係数が正のとき正の相関、負のとき負の相関という。0 に近いときは相関がない（無相関）という。',
    easy: '正の相関は「片方が大きいともう片方も大きい」（右上がり）、負の相関は「片方が大きいともう片方は小さい」（右下がり）。',
  },

  // 層別・みかけの相関・偏相関
  {
    term: '層別',
    reading: 'そうべつ',
    lesson: 'bivariate-spurious-partial',
    meaning: 'データを性別・年代・学年などの別の変数でグループ（層）に分けて、グループごとに集計・図示すること。',
    easy: 'グループに分けて見ること。全体では見えなかった関係や、みかけの関係に気づける。',
  },
  {
    term: '相関行列',
    reading: 'そうかんぎょうれつ',
    lesson: 'bivariate-spurious-partial',
    meaning: '複数の変数について、2つずつの相関係数を並べた表。対角成分は 1 で、対角線について対称になる。',
    easy: '「どの変数とどの変数がどれくらい相関しているか」を1枚にまとめた表。',
  },
  {
    term: 'みかけの相関（擬相関）',
    reading: 'みかけのそうかん（ぎそうかん）',
    lesson: 'bivariate-spurious-partial',
    meaning: '2つの変数の間に直接の因果関係がないのに、両方に影響する第3の変数のために生じる相関。',
    easy: 'アイスの売上と水の事故のように、本当は「気温」のせいで、いっしょに増えて見えるだけの相関。',
  },
  {
    term: '偏相関係数',
    reading: 'へんそうかんけいすう',
    lesson: 'bivariate-spurious-partial',
    meaning: '第3の変数 z の影響を取り除いた x と y の相関係数 $r_{xy\\cdot z} = \\frac{r_{xy} - r_{xz} r_{yz}}{\\sqrt{1 - r_{xz}^2}\\sqrt{1 - r_{yz}^2}}$。',
    easy: '「z が同じくらいの人どうしで比べたら、x と y に相関は残るか」を表す数。',
  },

  // 度数表とクロス集計表
  {
    term: '度数表',
    reading: 'どすうひょう',
    lesson: 'bivariate-cross-table',
    meaning: '変数のカテゴリー（または階級）ごとに、データの個数（度数）をまとめた表。',
    easy: '答えごとに人数を数えた表。',
  },
  {
    term: 'クロス集計表（2元クロス表）',
    reading: 'くろすしゅうけいひょう',
    lesson: 'bivariate-cross-table',
    meaning: '2つの質的変数のカテゴリーの組み合わせごとに度数をまとめた表。分割表ともいう。',
    easy: '「年代 × 朝ごはん」のように、2つの分け方を縦と横にとって人数を数えた表。',
  },
  {
    term: '周辺度数',
    reading: 'しゅうへんどすう',
    lesson: 'bivariate-cross-table',
    meaning: 'クロス集計表の各行の合計と各列の合計。',
    easy: '表のいちばん右といちばん下に書く「合計」の数。',
  },
  {
    term: '行パーセント・列パーセント',
    reading: 'ぎょうぱーせんと・れつぱーせんと',
    lesson: 'bivariate-cross-table',
    meaning: '各セルの度数を、行の合計で割った割合が行パーセント、列の合計で割った割合が列パーセント。',
    easy: '「〜のうち何％？」の「〜」で割る。「20代のうち」なら行の合計、「毎日食べる人のうち」なら列の合計で割る。',
  },
  {
    term: 'シンプソンのパラドックス',
    reading: 'しんぷそんのぱらどっくす',
    lesson: 'bivariate-cross-table',
    meaning: 'グループごとに見たときの傾向と、グループを合わせて見たときの傾向が逆になる現象。',
    easy: 'どのグループでも A のほうがよいのに、合計すると B のほうがよく見えてしまうこと。グループの人数の偏りが原因。',
  },

  // 最小二乗法と回帰直線
  {
    term: '説明変数・目的変数',
    reading: 'せつめいへんすう・もくてきへんすう',
    lesson: 'bivariate-simple-regression',
    meaning: '回帰分析で、予測に使う変数 x を説明変数、予測したい変数 y を目的変数（被説明変数）という。',
    easy: '「x を使って y を当てたい」ときの、手がかりが説明変数、当てたいものが目的変数。',
  },
  {
    term: '回帰直線',
    reading: 'かいきちょくせん',
    lesson: 'bivariate-simple-regression',
    meaning: '最小二乗法で求めた直線 $\\hat{y} = a + bx$。必ず $(\\bar{x}, \\bar{y})$ を通る。',
    easy: '散布図の点の並びにいちばん当てはまる直線。x から y を予測するのに使う。',
  },
  {
    term: '回帰係数',
    reading: 'かいきけいすう',
    lesson: 'bivariate-simple-regression',
    meaning: '回帰直線の傾き $b = s_{xy} / s_x^2 = r\\, s_y / s_x$。切片 a を含めて回帰係数と呼ぶこともある。',
    easy: 'x が1増えたとき、y の予測が平均してどれだけ増えるか。',
  },
  {
    term: '最小二乗法',
    reading: 'さいしょうにじょうほう',
    lesson: 'bivariate-simple-regression',
    meaning: '残差の2乗和 $\\sum (y_i - \\hat{y}_i)^2$ が最小になるように直線の係数を決める方法。',
    easy: '直線と点の縦のずれを2乗して足した合計が、いちばん小さくなる直線を選ぶ方法。',
  },
  {
    term: '観測値と予測値',
    reading: 'かんそくちとよそくち',
    lesson: 'bivariate-simple-regression',
    meaning: '実際に観測された $y_i$ を観測値、回帰直線から計算した $\\hat{y}_i = a + b x_i$ を予測値という。',
    easy: '観測値は「実際の値」、予測値は「直線が言う値」。',
  },
  {
    term: '残差',
    reading: 'ざんさ',
    lesson: 'bivariate-simple-regression',
    meaning: '観測値と予測値の差 $e_i = y_i - \\hat{y}_i$。最小二乗法で求めた直線では残差の合計は 0 になる。',
    easy: '実際の値が、直線の予測からどれだけずれたか。点が直線より上ならプラス。',
  },
  {
    term: '外挿',
    reading: 'がいそう',
    lesson: 'bivariate-simple-regression',
    meaning: '回帰式を、データが得られた x の範囲の外の値の予測に使うこと。',
    easy: 'データがない範囲を予測すること。関係がそこでも同じとは限らないので注意が必要。',
  },

  {
    term: '平均への回帰',
    reading: 'へいきんへのかいき',
    lesson: 'bivariate-simple-regression',
    meaning: '相関係数 r の大きさが 1 より小さいとき、標準偏差を単位にして測ると、予測値の平均からのはなれ方が x のはなれ方の |r| 倍に縮むこと。',
    easy: 'x がとびぬけて大きい人でも、y の予測は平均の近くに少し戻ってくること。',
  },

  // 決定係数・残差プロット・変数変換
  {
    term: '全変動・回帰変動・残差変動',
    reading: 'ぜんへんどう・かいきへんどう・ざんさへんどう',
    lesson: 'bivariate-r-squared-residual',
    meaning: '全変動 $\\sum (y_i - \\bar{y})^2$ は、回帰変動 $\\sum (\\hat{y}_i - \\bar{y})^2$ と残差変動 $\\sum (y_i - \\hat{y}_i)^2$ の和に分解できる。',
    easy: 'y のばらつき全体を、「直線で説明できた分」と「説明できなかった残り」に分けたもの。',
  },
  {
    term: '決定係数',
    reading: 'けっていけいすう',
    lesson: 'bivariate-r-squared-residual',
    meaning: '回帰変動 ÷ 全変動 で表される $R^2$。0 以上 1 以下で、単回帰では相関係数の2乗に等しい。寄与率ともいう。',
    easy: 'y のばらつきのうち、直線で説明できた割合。1 に近いほどよく当てはまっている。',
  },
  {
    term: '分散分析表（回帰）',
    reading: 'ぶんさんぶんせきひょう',
    lesson: 'bivariate-r-squared-residual',
    meaning: '回帰と残差の平方和・自由度・平均平方・F 値をまとめた表。単回帰では自由度は回帰 1、残差 n − 2。',
    easy: '変動の分解の結果を、決まった形の表にまとめたもの。統計ソフトの出力によく出てくる。',
  },
  {
    term: '回帰の標準誤差',
    reading: 'かいきのひょうじゅんごさ',
    lesson: 'bivariate-r-squared-residual',
    meaning: '残差の標準偏差の推定値 $s = \\sqrt{\\sum (y_i - \\hat{y}_i)^2 / (n - 2)}$。',
    easy: '直線による予測が、だいたいどれくらいずれるかの目安。',
  },
  {
    term: '残差プロット',
    reading: 'ざんさぷろっと',
    lesson: 'bivariate-r-squared-residual',
    meaning: '横軸に説明変数（または予測値）、縦軸に残差をとった散布図。モデルの当てはまりの診断に使う。',
    easy: '残差に模様がないかを見る図。U 字やラッパ形の模様があれば、直線では表しきれていないサイン。',
  },
  {
    term: '変数変換',
    reading: 'へんすうへんかん',
    lesson: 'bivariate-r-squared-residual',
    meaning: '対数をとるなど、変数を別の形に変えてから分析すること。曲線の関係を直線に近づけたり、散らばりをそろえたりするために使う。',
    easy: '「かけ算で増える」データは対数をとると、まっすぐな関係に直せる。',
  },
]
