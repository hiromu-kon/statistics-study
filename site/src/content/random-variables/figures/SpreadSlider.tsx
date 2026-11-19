import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Plot, Segment, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { expectation, varianceOf, type Dist } from './dist'

/**
 * 値 1, 3, 5 をとる確率変数。両はしの確率 q を増やすと、期待値は 3 のまま、分散だけが大きくなる。
 * 横の矢印は「期待値 ± 標準偏差」の幅。
 */
export function SpreadSlider() {
  const [q, setQ] = useState(0.1)
  const dist: Dist = [
    { x: 1, p: q },
    { x: 3, p: 1 - 2 * q },
    { x: 5, p: q },
  ]
  const m = expectation(dist)
  const v = varianceOf(dist)
  const sd = Math.sqrt(v)
  return (
    <div>
      <Plot x={[0, 6]} y={[0, 1.15]} height={240} xTicks={[0, 1, 2, 3, 4, 5, 6]} yTicks={[0, 0.5, 1]} xLabel="値 x" yLabel="確率">
        <Bars data={dist.map((d) => ({ x: d.x, y: d.p }))} width={0.6} labels={(y) => String(round(y, 2))} />
        <VLine x={m} color="c2" label="期待値 3" />
        {sd > 0 && (
          <>
            <Segment x1={m} y1={1.05} x2={m + sd} y2={1.05} color="c3" width={2.5} arrow />
            <Segment x1={m} y1={1.05} x2={m - sd} y2={1.05} color="c3" width={2.5} arrow />
          </>
        )}
      </Plot>
      <p className="figure-readout">
        分散 V(X) = (1−3)²×{round(q, 2)} + (3−3)²×{round(1 - 2 * q, 2)} + (5−3)²×{round(q, 2)} = <strong>{round(v, 3)}</strong>　標準偏差 ={' '}
        <strong>{round(sd, 3)}</strong>（緑の矢印の長さ）
      </p>
      <Controls>
        <Slider label="両はし（1と5）の確率" value={q} min={0} max={0.5} step={0.01} onChange={setQ} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
