import type { Formula } from '../../types'

export const formulas: Formula[] = [
  {
    id: 'pre1-stochastic-markov-step',
    lesson: 'pre1-stochastic-markov',
    title: '1ステップ後の分布',
    tex: '\\boldsymbol{\\mu}_{n+1} = \\boldsymbol{\\mu}_n P, \\quad P(X_{n+1} = j) = \\sum_i P(X_n = i)\\, p_{ij}',
    note: '「いま i にいる確率 × i から j へ移る確率」を全部足す。分布は横ベクトルで、右から P をかける。',
  },
  {
    id: 'pre1-stochastic-markov-nstep',
    lesson: 'pre1-stochastic-markov',
    title: 'n ステップ後の分布',
    tex: '\\boldsymbol{\\mu}_n = \\boldsymbol{\\mu}_0 P^n',
    note: 'P^n の (i, j) 成分は、i から出発して n ステップ後に j にいる確率。2〜3 ステップなら場合分けして「かけて足す」でもよい。',
  },
  {
    id: 'pre1-stochastic-markov-stationary',
    lesson: 'pre1-stochastic-markov',
    title: '定常分布の条件',
    tex: '\\boldsymbol{\\pi} P = \\boldsymbol{\\pi}, \\quad \\sum_i \\pi_i = 1',
    note: '長い目で見た割合を求める連立方程式。式は 1 本余分なので、「足して 1」を必ず加える。',
  },
  {
    id: 'pre1-stochastic-markov-two-state',
    lesson: 'pre1-stochastic-markov',
    title: '2状態の定常分布',
    tex: '(\\pi_1, \\pi_2) = \\left( \\frac{b}{a+b},\\ \\frac{a}{a+b} \\right)',
    note: 'a は 1→2、b は 2→1 へ移る確率。「出ていく量 aπ₁ = 入ってくる量 bπ₂」から出る。',
  },
  {
    id: 'pre1-stochastic-markov-return-time',
    lesson: 'pre1-stochastic-markov',
    title: '平均再帰時間',
    tex: 'E[\\text{return time to } i] = \\frac{1}{\\pi_i}',
    note: '状態が有限で既約のとき、i を出てから i に初めて戻るまでの平均ステップ数。1 歩目で場合分けする方法でも確かめられる。',
  },
  {
    id: 'pre1-stochastic-processes-random-walk',
    lesson: 'pre1-stochastic-processes',
    title: 'ランダムウォークの期待値と分散',
    tex: 'E[S_n] = n(2p-1), \\quad V[S_n] = 4np(1-p)',
    note: '+1 の確率 p、−1 の確率 1−p で n 歩動いたあとの位置。p = 1/2 なら期待値 0、分散 n。確率は「+1 の回数」の二項分布に直して計算する。',
  },
  {
    id: 'pre1-stochastic-processes-poisson-count',
    lesson: 'pre1-stochastic-processes',
    title: 'ポアソン過程の区間の回数',
    tex: 'P(N(t) = k) = e^{-\\lambda t}\\frac{(\\lambda t)^k}{k!}, \\quad E[N(t)] = V[N(t)] = \\lambda t',
    note: '強さ λ のポアソン過程で、長さ t の区間に k 回起こる確率。区間の長さだけで決まり、どこから測るかによらない。',
  },
  {
    id: 'pre1-stochastic-processes-poisson-gap',
    lesson: 'pre1-stochastic-processes',
    title: 'ポアソン過程の到着間隔',
    tex: 'P(T > t) = P(N(t) = 0) = e^{-\\lambda t}, \\quad E[T] = \\frac{1}{\\lambda}',
    note: '次の出来事までの待ち時間は指数分布。「t 以上待つ」と「長さ t の区間に 0 回」は同じ出来事。',
  },
  {
    id: 'pre1-stochastic-processes-brownian',
    lesson: 'pre1-stochastic-processes',
    title: 'ブラウン運動の増分',
    tex: 'W(t) - W(s) \\sim N(0,\\ t - s), \\quad W(t) \\sim N(0,\\ t)',
    note: '分散は経過した時間。確率は標準偏差 √(t − s) で標準化して正規分布表で求める。',
  },
  {
    id: 'pre1-stochastic-processes-brownian-cov',
    lesson: 'pre1-stochastic-processes',
    title: 'ブラウン運動の共分散',
    tex: '\\mathrm{Cov}(W(s), W(t)) = \\min(s, t)',
    note: '共通部分（0 から早いほうの時刻まで）の分散が残る。W(s) と W(t) は独立ではない。',
  },
]
