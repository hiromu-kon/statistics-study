import { Bars, HLine, Label, Plot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

/** n 通の手紙を n 枚の封筒にでたらめに入れたとき、少なくとも1通が正しい封筒に入る確率（包除原理） */
function matchingProb(n: number): number {
  let p = 0
  let fact = 1
  for (let k = 1; k <= n; k++) {
    fact *= k
    p += (k % 2 === 1 ? 1 : -1) / fact
  }
  return p
}

/**
 * 「少なくとも1通が正しい封筒に入る確率」を n = 1〜10 で並べた図。
 * n を増やしても 0 や 1 に向かわず、1 − 1/e ≒ 0.632 に落ち着く。
 */
export function MatchingBars() {
  const data = Array.from({ length: 10 }, (_, i) => ({ x: i + 1, y: matchingProb(i + 1) }))
  return (
    <Plot x={[0.4, 10.6]} y={[0, 1.25]} yTicks={[0, 0.25, 0.5, 0.75, 1]} height={250} xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} xLabel="手紙の数 n" yLabel="確率">
      <Bars data={data} width={0.7} color="c1" opacity={0.75} labels={(y) => String(round(y, 3))} />
      <HLine y={1 - Math.exp(-1)} color="c2" />
      <Label x={10.5} y={1.15} anchor="end" color="c2">
        破線 = 1 − 1/e ≒ 0.632
      </Label>
    </Plot>
  )
}
