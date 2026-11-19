import type { Color } from '../../../components/charts/Plot'

// 状態遷移図で使うマルコフ連鎖のデータと計算。図の部品と分けているのは、部品だけのファイルにしておくと開発中の自動更新が効くため。

export type ChainSpec = {
  labels: string[]
  /** 推移確率行列。P[i][j] は「いま i のとき、次に j になる確率」 */
  P: number[][]
  /** 各状態の円の中心（viewBox の座標） */
  pos: { x: number; y: number }[]
  colors: Color[]
}

/** 本文の天気の例（晴・曇・雨）。定常分布は (7/18, 6/18, 5/18) */
export const WEATHER: ChainSpec = {
  labels: ['晴', '曇', '雨'],
  P: [
    [0.6, 0.3, 0.1],
    [0.3, 0.4, 0.3],
    [0.2, 0.3, 0.5],
  ],
  pos: [
    { x: 100, y: 100 },
    { x: 320, y: 100 },
    { x: 210, y: 240 },
  ],
  colors: ['c2', 'c1', 'c3'],
}

export const WEATHER_PI = [7 / 18, 6 / 18, 5 / 18]

/** 分布（横ベクトル）に推移確率行列を右からかけて、1ステップ後の分布を求める */
export function step(dist: number[], P: number[][]): number[] {
  return dist.map((_, j) => dist.reduce((acc, di, i) => acc + di * P[i][j], 0))
}
