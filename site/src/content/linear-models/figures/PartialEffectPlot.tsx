import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { rent, rentMultiple, rentSimple } from './rentData'

const BAND = 5

/**
 * 単回帰では「駅から遠いほど家賃が高い」（右上がり）のに、
 * 広さをそろえて見ると右下がりになる、という偏回帰係数の意味を見せる図。
 */
export function PartialEffectPlot() {
  const [size, setSize] = useState(37)
  const pts = rent.walk.map((w, i) => ({ x: w, y: rent.rent[i], size: rent.size[i] }))
  const near = pts.filter((p) => Math.abs(p.size - size) <= BAND)
  const far = pts.filter((p) => Math.abs(p.size - size) > BAND)
  const m = rentMultiple
  const fixed = (w: number) => m.b0 + m.b1 * size + m.b2 * w
  return (
    <div>
      <Plot x={[0, 22]} y={[2, 11]} xLabel="駅から徒歩（分）" yLabel="家賃（万円）" height={320}>
        <Segment x1={0} y1={rentSimple.a} x2={22} y2={rentSimple.a + 22 * rentSimple.b} color="c5" width={2} dashed />
        <Points data={far} r={5} color="muted" opacity={0.3} />
        <Points data={near} r={6} color="c1" opacity={0.85} />
        <Segment x1={0} y1={fixed(0)} x2={22} y2={fixed(22)} color="c1" width={3} />
      </Plot>
      <Legend
        items={[
          { color: 'c5', label: `単回帰：家賃 = ${rentSimple.a} + ${rentSimple.b} × 徒歩（右上がり）` },
          { color: 'c1', label: `広さ ${size} m² に固定した重回帰の直線（傾き ${m.b2}）` },
        ]}
      />
      <p className="figure-readout">
        青い点：広さが {size - BAND}〜{size + BAND} m² の物件（{near.length} 件）。重回帰の式で広さ = {size} を代入すると　家賃 ={' '}
        <strong>
          {round(m.b0 + m.b1 * size, 2)} − {Math.abs(m.b2)} × 徒歩
        </strong>
      </p>
      <Controls>
        <Slider label="広さを固定する値" value={size} min={20} max={50} step={1} onChange={setSize} format={(v) => `${v} m²`} />
      </Controls>
    </div>
  )
}
