import type { Formula } from '../../types'

export const formulas: Formula[] = [
  {
    id: 'collection-growth-rate',
    lesson: 'collection-growth-rate',
    title: '成長率',
    tex: 'r_t = \\frac{x_t - x_{t-1}}{x_{t-1}} = \\frac{x_t}{x_{t-1}} - 1',
    note: '前の時点から何%増えたかを知りたいときに使う。$x_t$ は今の値、$x_{t-1}$ は1つ前の時点の値。割るのは**前の時点**の値。',
  },
  {
    id: 'collection-geometric-mean',
    lesson: 'collection-growth-rate',
    title: '幾何平均',
    tex: 'G = \\sqrt[n]{x_1 x_2 \\cdots x_n}',
    note: '「何倍」のように掛け算で積み重なる量の平均を知りたいときに使う。4乗根は√を2回とれば求められる。',
  },
  {
    id: 'collection-average-growth-rate',
    lesson: 'collection-growth-rate',
    title: '平均成長率',
    tex: '\\bar{r} = \\sqrt[n]{(1+r_1)(1+r_2)\\cdots(1+r_n)} - 1 = \\sqrt[n]{\\frac{x_n}{x_0}} - 1',
    note: 'n 期間で、毎期同じ率で成長したとしたら何%ずつかを知りたいときに使う。成長率の算術平均では正しく求められない。',
  },
  {
    id: 'collection-index',
    lesson: 'collection-growth-rate',
    title: '指数（基準時点 = 100）',
    tex: 'I_t = \\frac{x_t}{x_0} \\times 100',
    note: '規模のちがう系列の伸び方を比べたいときに使う。$x_0$ は基準時点の値。基準を変えるときは、指数どうしの割り算でよい。',
  },
  {
    id: 'collection-moving-average-3',
    lesson: 'collection-moving-average',
    title: '3項移動平均',
    tex: '\\tilde{x}_t = \\frac{x_{t-1} + x_t + x_{t+1}}{3}',
    note: '時系列の細かいでこぼこをならして、全体の動きを見たいときに使う。両端の時点は計算できない。',
  },
  {
    id: 'collection-centered-moving-average-12',
    lesson: 'collection-moving-average',
    title: '中心化12か月移動平均',
    tex: '\\tilde{x}_t = \\frac{1}{12}\\left(\\frac{1}{2}x_{t-6} + x_{t-5} + \\cdots + x_{t+5} + \\frac{1}{2}x_{t+6}\\right)',
    note: '月次データから季節変動を取り除いてトレンドを見たいときに使う。12か月は偶数なので、両端の月の重みを半分にして中心を月にそろえる。',
  },
  {
    id: 'collection-autocorrelation',
    lesson: 'collection-moving-average',
    title: '自己相関係数（ラグ k）',
    tex: 'r_k = \\frac{\\sum_{t=1}^{n-k}(x_t - \\bar{x})(x_{t+k} - \\bar{x})}{\\sum_{t=1}^{n}(x_t - \\bar{x})^2}',
    note: '今の値と k 時点前の値がどれくらい似ているかを知りたいときに使う。k を並べて棒グラフにしたものがコレログラム。分母は全体の偏差の2乗の合計。',
  },
  {
    id: 'collection-proportional-allocation',
    lesson: 'collection-sampling-methods',
    title: '層化抽出法の比例配分',
    tex: 'n_h = n \\times \\frac{N_h}{N}',
    note: '層化抽出法で、層 h から何人選ぶかを決めたいときに使う。$N_h$ は層 h の大きさ、$N$ は母集団全体の大きさ、$n$ は標本全体の大きさ。',
  },
  {
    id: 'collection-systematic-interval',
    lesson: 'collection-sampling-methods',
    title: '系統抽出法の抽出間隔',
    tex: 'k = \\frac{N}{n}',
    note: '名簿（N 人）から n 人を系統抽出法で選ぶとき、何番おきに選ぶかを決める。最初の1人は 1〜k 番からくじで選ぶ。',
  },
]
