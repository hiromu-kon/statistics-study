import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Plot, Points } from '../../../components/charts/Plot'
import { correlation, round } from '../../../lib/stats'
import { outlierCluster } from './data'
import { PlotText } from './PlotText'

/** 関係のない10点に、遠くの1点（外れ値）を加えると相関係数がどう動くかを見る図 */
export function OutlierPlot() {
  const [oy, setOy] = useState(10)
  const { xs, ys } = outlierCluster
  const rWith = correlation([...xs, 10], [...ys, oy])
  return (
    <div>
      <Plot x={[0, 11]} y={[-0.5, 12]} height={320} xLabel="x" yLabel="y">
        <Points data={xs.map((x, i) => ({ x, y: ys[i] }))} r={6} />
        <Points data={[{ x: 10, y: oy }]} color="c5" r={8} opacity={0.95} />
        <PlotText x={10} y={oy} dy={-14} color="c5">
          外れ値
        </PlotText>
      </Plot>
      <p className="figure-readout">
        10点だけの r = <strong>{round(correlation(xs, ys), 2)}</strong>　→　外れ値を入れた r = <strong>{round(rWith, 2)}</strong>
      </p>
      <Controls>
        <Slider label="外れ値の高さ y" value={oy} min={0} max={10} step={0.5} onChange={setOy} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
