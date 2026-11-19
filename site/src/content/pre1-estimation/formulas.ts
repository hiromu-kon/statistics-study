import type { Formula } from '../../types'

export const formulas: Formula[] = [
  // ---------- 十分統計量 ----------
  {
    id: 'pre1-estimation-sufficiency-factorization',
    lesson: 'pre1-estimation-sufficiency',
    title: 'フィッシャー・ネイマンの分解定理',
    tex: 'f(x_1, \\dots, x_n;\\, \\theta) = g\\big(T(x);\\, \\theta\\big)\\, h(x)',
    note: 'g は θ を含み、データは T を通してだけ入る。h は θ を含まない。この形に分けられれば T が十分統計量。',
  },
  {
    id: 'pre1-estimation-sufficiency-examples',
    lesson: 'pre1-estimation-sufficiency',
    title: 'よく出る十分統計量',
    tex: '\\text{Bernoulli, Poisson, Exp}: \\sum X_i \\qquad N(\\mu, \\sigma^2): \\left(\\sum X_i, \\sum X_i^2\\right) \\qquad U(0, \\theta): X_{(n)}',
    note: 'ベルヌーイ・ポアソン・指数分布は合計、正規分布（両方未知）は合計と2乗の和、一様分布 U(0, θ) は最大値。',
  },
  // ---------- 最尤法とモーメント法 ----------
  {
    id: 'pre1-estimation-mle-likelihood',
    lesson: 'pre1-estimation-mle',
    title: '尤度と対数尤度',
    tex: 'L(\\theta) = \\prod_{i=1}^{n} f(x_i;\\theta), \\qquad \\ell(\\theta) = \\sum_{i=1}^{n} \\log f(x_i;\\theta)',
    note: 'データを固定して θ の関数として見る。ℓ を θ で微分して 0 とおき、最尤推定量を求める。',
  },
  {
    id: 'pre1-estimation-mle-results',
    lesson: 'pre1-estimation-mle',
    title: '代表的な最尤推定量',
    tex: '\\hat{p} = \\bar{X},\\quad \\hat{\\lambda}_{\\mathrm{Pois}} = \\bar{X},\\quad \\hat{\\lambda}_{\\mathrm{Exp}} = \\frac{1}{\\bar{X}},\\quad \\hat{\\mu} = \\bar{X},\\quad \\hat{\\sigma}^2 = \\frac{1}{n}\\sum (X_i - \\bar{X})^2',
    note: 'ベルヌーイの p、ポアソンの λ、指数分布の率 λ、正規分布の μ と σ²。σ² は n で割る（不偏ではない）。一様分布 U(0, θ) は最大値。',
  },
  {
    id: 'pre1-estimation-mle-moment',
    lesson: 'pre1-estimation-mle',
    title: 'モーメント法',
    tex: 'E(X^k) = \\frac{1}{n}\\sum_{i=1}^{n} x_i^k \\quad (k = 1, 2, \\dots)',
    note: '母数の数だけ式を立てて解く。U(0, θ) なら θ/2 = x̄ より 2x̄、ガンマ分布なら θ = S²/x̄、k = x̄²/S²。',
  },
  {
    id: 'pre1-estimation-mle-invariance',
    lesson: 'pre1-estimation-mle',
    title: '最尤推定量の不変性',
    tex: '\\widehat{g(\\theta)} = g(\\hat{\\theta})',
    note: '母数を変換した量の最尤推定値は、最尤推定値を同じように変換すればよい。例：ポアソン分布の P(X = 0) は e^(−x̄)。',
  },
  // ---------- 推定量の良さ ----------
  {
    id: 'pre1-estimation-properties-mse',
    lesson: 'pre1-estimation-properties',
    title: 'バイアス・バリアンス分解',
    tex: 'E\\big[(\\hat{\\theta} - \\theta)^2\\big] = \\big\\{E(\\hat{\\theta}) - \\theta\\big\\}^2 + V(\\hat{\\theta})',
    note: '平均二乗誤差 = バイアス² + 分散。バイアスのある推定量のほうが MSE が小さいこともある。',
  },
  {
    id: 'pre1-estimation-properties-efficiency',
    lesson: 'pre1-estimation-properties',
    title: '相対効率',
    tex: '\\operatorname{eff}(\\hat{\\theta}_1, \\hat{\\theta}_2) = \\frac{V(\\hat{\\theta}_2)}{V(\\hat{\\theta}_1)}',
    note: '1 より大きければ θ̂₁ のほうが有効。正規分布で平均に対する中央値の相対効率は、n が大きいとき 2/π ≒ 0.64。',
  },
  {
    id: 'pre1-estimation-properties-cramer-rao',
    lesson: 'pre1-estimation-properties',
    title: 'クラーメル・ラオの不等式',
    tex: 'V(\\hat{\\theta}) \\ge \\frac{1}{nI(\\theta)}',
    note: 'θ の不偏推定量の分散の下限（正則条件のもと）。ベルヌーイなら p(1 − p)/n で、標本比率が下限を達成する。範囲が θ で決まる分布（一様分布など）では使えない。',
  },
  // ---------- フィッシャー情報量と漸近的性質 ----------
  {
    id: 'pre1-estimation-asymptotics-fisher',
    lesson: 'pre1-estimation-asymptotics',
    title: 'フィッシャー情報量（1個分）',
    tex: 'I(\\theta) = E\\left[\\left(\\frac{\\partial}{\\partial\\theta}\\log f(X;\\theta)\\right)^2\\right] = -E\\left[\\frac{\\partial^2}{\\partial\\theta^2}\\log f(X;\\theta)\\right]',
    note: '2つの式は正則条件のもとで等しく、計算は2つ目の式が楽。ベルヌーイ 1/(p(1 − p))、ポアソン 1/λ、正規の μ は 1/σ²、指数の λ は 1/λ²。n 個なら n 倍。',
  },
  {
    id: 'pre1-estimation-asymptotics-normality',
    lesson: 'pre1-estimation-asymptotics',
    title: '最尤推定量の漸近正規性と近似信頼区間',
    tex: '\\hat{\\theta} \\approx N\\!\\left(\\theta,\\ \\frac{1}{nI(\\theta)}\\right), \\qquad \\hat{\\theta} \\pm 1.96\\frac{1}{\\sqrt{nI(\\hat{\\theta})}}',
    note: 'n が大きいときの近似。I の中の θ には推定値を入れる。ベルヌーイなら 2級の母比率の区間と同じ式。',
  },
  {
    id: 'pre1-estimation-asymptotics-jackknife',
    lesson: 'pre1-estimation-asymptotics',
    title: 'ジャックナイフ法',
    tex: '\\hat{\\theta}_J = n\\hat{\\theta} - (n-1)\\hat{\\theta}_{(\\cdot)}, \\qquad \\hat{V}_J = \\frac{n-1}{n}\\sum_{i=1}^{n}\\big(\\hat{\\theta}_{(i)} - \\hat{\\theta}_{(\\cdot)}\\big)^2',
    note: 'θ̂₍ᵢ₎ は i 番目を抜いて計算した値、θ̂₍·₎ はその平均。バイアスの推定値は (n − 1)(θ̂₍·₎ − θ̂)。',
  },
  {
    id: 'pre1-estimation-asymptotics-kl',
    lesson: 'pre1-estimation-asymptotics',
    title: 'カルバック・ライブラー情報量',
    tex: 'D(g\\,\\|\\,f) = E_g\\left[\\log\\frac{g(X)}{f(X)}\\right] \\ge 0',
    note: '同じ分布のときだけ 0。対称ではない。正規分布（分散が同じ）なら (μ₁ − μ₂)²/(2σ²)。',
  },
  // ---------- 区間推定の構成 ----------
  {
    id: 'pre1-estimation-interval-pivot',
    lesson: 'pre1-estimation-interval',
    title: '枢軸量による信頼区間',
    tex: 'P\\big(a \\le Q(X;\\theta) \\le b\\big) = 1 - \\alpha \\ \\Longrightarrow\\ L(X) \\le \\theta \\le U(X)',
    note: 'Q の分布が θ によらないので a、b が表で決まる。不等式を θ について解くとき、割り算・逆数で向きが変わるのに注意。',
  },
  {
    id: 'pre1-estimation-interval-exponential',
    lesson: 'pre1-estimation-interval',
    title: '指数分布の λ の信頼区間',
    tex: '2\\lambda\\sum X_i \\sim \\chi^2(2n) \\ \\Longrightarrow\\ \\frac{\\chi^2_{0.975}(2n)}{2\\sum x_i} \\le \\lambda \\le \\frac{\\chi^2_{0.025}(2n)}{2\\sum x_i}',
    note: 'n が小さくても正確な区間。χ²₀.₉₇₅ は下側 2.5% 点、χ²₀.₀₂₅ は上側 2.5% 点（2級と同じ書き方）。',
  },
  {
    id: 'pre1-estimation-interval-one-sided',
    lesson: 'pre1-estimation-interval',
    title: '片側信頼限界（母平均、σ 既知）',
    tex: '\\mu \\le \\bar{x} + z_{\\alpha}\\frac{\\sigma}{\\sqrt{n}}',
    note: '片側に α をまとめるので z_α（95% なら 1.645）を使う。母分散の上側限界は (n − 1)s²/χ²（下側 α 点）。',
  },
]
