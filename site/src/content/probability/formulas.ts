import type { Formula } from '../../types'

export const formulas: Formula[] = [
  {
    id: 'prob-equally-likely',
    lesson: 'probability-basics',
    title: '確率（どの結果も同じくらい起こるとき）',
    tex: 'P(A) = \\frac{n(A)}{n(\\Omega)}',
    note: 'A になる場合の数 ÷ 全部の場合の数。サイコロやくじの確率を数えて求めるときに使う。',
  },
  {
    id: 'prob-addition',
    lesson: 'probability-basics',
    title: '加法定理',
    tex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
    note: '「A または B」の確率。重なりを2回数えないように引く。排反なら最後の項は0。',
  },
  {
    id: 'prob-complement',
    lesson: 'probability-basics',
    title: '余事象の確率',
    tex: 'P(\\bar{A}) = 1 - P(A)',
    note: '「少なくとも1回」「〜でない」を求めるとき、反対側を数えて1から引く。',
  },
  {
    id: 'prob-conditional',
    lesson: 'probability-conditional',
    title: '条件付き確率',
    tex: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}',
    note: 'B が起きた場合だけを全体として見たときの A の割合。分母が「見る範囲」。',
  },
  {
    id: 'prob-multiplication',
    lesson: 'probability-conditional',
    title: '乗法定理',
    tex: 'P(A \\cap B) = P(A)\\,P(B \\mid A)',
    note: '「A が起きて、さらに B が起きる」確率。戻さないくじなど、順番に起きることを樹形図で計算するときに使う。',
  },
  {
    id: 'prob-independence',
    lesson: 'probability-conditional',
    title: '独立のときの積',
    tex: 'P(A \\cap B) = P(A)\\,P(B)',
    note: 'A と B が独立のときだけ使える。逆に、この式が成り立つかどうかで独立かを確かめられる。',
  },
  {
    id: 'prob-total',
    lesson: 'probability-bayes',
    title: '全確率の公式',
    tex: 'P(B) = P(A)\\,P(B \\mid A) + P(\\bar{A})\\,P(B \\mid \\bar{A})',
    note: '原因で場合分けして、結果 B になる道すじの確率を全部足す。ベイズの定理の分母。',
  },
  {
    id: 'prob-bayes',
    lesson: 'probability-bayes',
    title: 'ベイズの定理',
    tex: 'P(A \\mid B) = \\frac{P(A)\\,P(B \\mid A)}{P(B)}',
    note: '結果 B がわかったときの原因 A の確率（事後確率）。「B の中で A の割合」を求めている。',
  },
]
