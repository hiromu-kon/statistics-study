import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, HLine, Plot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

/**
 * 2群ずつの t 検定を全部の組合せで繰り返すと、「どこかで間違って有意と言ってしまう」確率が増えることを見せる図。
 * 検定どうしを独立とみなした近似 1 − (1 − α)^m で描いている。
 */
export function MultipleComparisonPlot() {
  const [alpha, setAlpha] = useState(0.05)
  const data = [2, 3, 4, 5, 6, 7].map((k) => {
    const m = (k * (k - 1)) / 2
    return { x: k, y: 1 - (1 - alpha) ** m, m }
  })
  return (
    <div>
      <Plot x={[1.4, 7.6]} y={[0, 1]} xTicks={[2, 3, 4, 5, 6, 7]} xLabel="群の数 k" yLabel="少なくとも1回間違える確率" height={260}>
        <HLine y={alpha} color="c5" label={`1回だけなら ${alpha}`} />
        <Bars data={data} width={0.6} color="c4" labels={(y) => round(y, 3).toFixed(3)} />
      </Plot>
      <p className="figure-readout">
        {data.map((d) => `${d.x}群→${d.m}回`).join('　')}
      </p>
      <Controls>
        <Slider label="1回の検定の有意水準 α" value={alpha} min={0.01} max={0.1} step={0.01} onChange={setAlpha} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
