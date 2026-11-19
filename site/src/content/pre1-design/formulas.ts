import type { Formula } from '../../types'

export const formulas: Formula[] = [
  {
    id: 'pre1-design-two-way-decomposition',
    lesson: 'pre1-design-two-way',
    title: '繰り返しのある2元配置の平方和の分解',
    tex: 'S_T = S_A + S_B + S_{A\\times B} + S_E',
    note: '自由度は a − 1、b − 1、(a − 1)(b − 1)、ab(r − 1)、合計 abr − 1。F 比はどれも「その要因の平均平方 ÷ 誤差の平均平方」（母数模型）。',
  },
  {
    id: 'pre1-design-two-way-interaction',
    lesson: 'pre1-design-two-way',
    title: '交互作用の平方和',
    tex: 'S_{A\\times B} = r\\sum_{i}\\sum_{j}(\\bar{x}_{ij\\cdot} - \\bar{x}_{i\\cdot\\cdot} - \\bar{x}_{\\cdot j\\cdot} + \\bar{x})^2',
    note: '組合せの平均が、主効果の足し算からどれだけずれるか。繰り返しがない（r = 1）と誤差と区別できない。',
  },
  {
    id: 'pre1-design-blocks-randomized-block',
    lesson: 'pre1-design-blocks',
    title: '乱塊法の平方和の分解',
    tex: 'S_T = S_A + S_B + S_E,\\quad \\phi_E = (t-1)(b-1)',
    note: '処理 t 個・ブロック b 個。ブロックの差を誤差から取り除くので、ブロックの差が大きいほど処理の F 比が大きくなる。',
  },
  {
    id: 'pre1-design-blocks-bib',
    lesson: 'pre1-design-blocks',
    title: '釣合い型不完備ブロック計画の条件',
    tex: 'bk = tr,\\qquad \\lambda(t-1) = r(k-1)',
    note: '処理 t、ブロック b、ブロックの大きさ k、反復数 r、各組が一緒になる回数 λ。どちらも数え上げで導ける。',
  },
  {
    id: 'pre1-design-blocks-column-ss',
    lesson: 'pre1-design-blocks',
    title: '2水準直交配列表の列の平方和',
    tex: 'S = \\frac{(T_1 - T_2)^2}{N}',
    note: 'T₁・T₂ はその列の水準1・水準2のデータの合計、N は実験の回数（L8 なら 8）。自由度は 1。',
  },
  {
    id: 'pre1-design-survey-fpc',
    lesson: 'pre1-design-survey',
    title: '非復元抽出の標本平均の分散（有限修正）',
    tex: 'V(\\bar{X}) = \\frac{N-n}{N-1}\\cdot\\frac{\\sigma^2}{n} = (1-f)\\frac{S^2}{n}',
    note: 'σ² は N で割った母分散、S² は N − 1 で割った母分散、f = n/N。標準誤差にはそのルートがかかる。',
  },
  {
    id: 'pre1-design-survey-total',
    lesson: 'pre1-design-survey',
    title: '母総計の推定',
    tex: '\\hat{\\tau} = N\\bar{x},\\qquad \\hat{V}(\\hat{\\tau}) = N^2(1-f)\\frac{s^2}{n}',
    note: '平均を N 倍するので、分散は N² 倍、標準誤差は N 倍。',
  },
  {
    id: 'pre1-design-survey-stratified',
    lesson: 'pre1-design-survey',
    title: '層化抽出の推定量の分散',
    tex: 'V(\\bar{x}_{st}) = \\sum_h W_h^2(1-f_h)\\frac{S_h^2}{n_h}',
    note: '有限修正を無視すると、比例配分で $\\frac{1}{n}\\sum W_hS_h^2$、ネイマン配分（$n_h \\propto N_hS_h$）で $\\frac{1}{n}(\\sum W_hS_h)^2$。',
  },
  {
    id: 'pre1-design-survey-two-stage',
    lesson: 'pre1-design-survey',
    title: '2段抽出の分散（集落の大きさが等しいとき）',
    tex: 'V(\\bar{x}) = \\left(1-\\frac{m}{M}\\right)\\frac{S_1^2}{m} + \\left(1-\\frac{l}{L}\\right)\\frac{S_2^2}{ml}',
    note: '1項目は「どの集落を選んだか」、2項目は「集落の中で誰を選んだか」によるばらつき。l = L で集落抽出、m = M で層化抽出になる。',
  },
]
