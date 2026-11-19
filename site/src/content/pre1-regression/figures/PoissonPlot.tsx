import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Plot, Points, VLine } from '../../../components/charts/Plot'
import { poissonPmf, round } from '../../../lib/stats'
import { accidentData, poissonFit } from './glmData'

/** ポアソン回帰の当てはめ（平均 μ = e^(β0 + β1x) の曲線）と、ある x での件数の分布 */
export function PoissonPlot() {
  const [x0, setX0] = useState(10)
  const mu = (x: number) => Math.exp(poissonFit.b0 + poissonFit.b1 * x)
  const m = mu(x0)
  return (
    <div>
      <Compare>
        <Card title="交通量と事故件数">
          <Plot x={[0, 18]} y={[0, 14]} width={320} height={260} xLabel="交通量 x（千台/日）" yLabel="事故件数">
            <Curve f={mu} color="c1" />
            <VLine x={x0} color="c2" />
            <Points data={accidentData.traffic.map((x, i) => ({ x, y: accidentData.count[i] }))} r={5} color="ink" opacity={0.55} />
          </Plot>
        </Card>
        <Card title={`x = ${x0} のときの件数の分布（ポアソン分布）`}>
          <Plot x={[-0.5, 14.5]} y={[0, 0.4]} width={320} height={260} xLabel="事故件数" xTicks={[0, 2, 4, 6, 8, 10, 12, 14]} yTicks={[0, 0.1, 0.2, 0.3, 0.4]}>
            <Bars data={Array.from({ length: 15 }, (_, k) => ({ x: k, y: poissonPmf(k, m) }))} width={0.7} color="c3" />
          </Plot>
        </Card>
      </Compare>
      <p className="figure-readout">
        x = {x0} のとき　μ = e^({poissonFit.b0} + {poissonFit.b1} × {x0}) ≒ <strong>{round(m, 2)}</strong> 件
      </p>
      <Controls>
        <Slider label="交通量 x" value={x0} min={2} max={16} step={1} onChange={setX0} />
      </Controls>
    </div>
  )
}
