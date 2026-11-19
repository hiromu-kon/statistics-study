import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Curve, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Rect } from './parts'

const triangle = (u: number) => (u < 0 || u > 2 ? 0 : u <= 1 ? u : 2 - u)

/**
 * X、Y が独立にそれぞれ 0〜1 の一様分布のとき、U = X + Y の密度をたたみこみの式で求める図。
 * f_U(u) = ∫ f_X(u − v) f_Y(v) dv は、「Y の範囲 [0, 1]」と「X = u − v が 0〜1 になる v の範囲 [u − 1, u]」の重なりの長さ。
 */
export function ConvolutionTriangle() {
  const [u, setU] = useState(0.6)
  const overlap = Math.max(0, Math.min(1, u) - Math.max(0, u - 1))
  return (
    <div>
      <Compare>
        <Card title="v の数直線の上で、2つの範囲が重なる長さ">
          <Plot x={[-1.2, 2.2]} y={[0, 2.4]} width={300} height={220} xLabel="v" hideY xTicks={[-1, 0, 1, 2]}>
            <Rect x0={0} x1={1} y0={0} y1={1} color="c1" opacity={0.3} />
            <Rect x0={u - 1} x1={u} y0={1.1} y1={2.1} color="c2" opacity={0.3} />
            <Rect x0={Math.max(0, u - 1)} x1={Math.max(Math.max(0, u - 1), Math.min(1, u))} y0={0} y1={2.1} color="c3" opacity={0.25} />
          </Plot>
        </Card>
        <Card title="U = X + Y の密度（三角形）">
          <Plot x={[-0.2, 2.2]} y={[0, 1.2]} width={300} height={220} xLabel="u" xTicks={[0, 0.5, 1, 1.5, 2]} yTicks={[0, 0.5, 1]}>
            <Curve f={triangle} color="c3" />
            <Segment x1={u} y1={0} x2={u} y2={overlap} color="c3" dashed />
            <Points data={[{ x: u, y: overlap }]} color="c3" r={5} opacity={1} />
          </Plot>
        </Card>
      </Compare>
      <p className="figure-readout">
        青：Y の範囲 0 ≦ v ≦ 1　オレンジ：X = u − v が 0〜1 になる範囲 {round(u - 1, 2)} ≦ v ≦ {round(u, 2)}　緑：重なりの長さ = f_U({round(u, 2)}) ={' '}
        <strong>{round(overlap, 2)}</strong>
      </p>
      <Controls>
        <Slider label="u" value={u} min={0} max={2} step={0.05} onChange={(v) => setU(round(v, 2))} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
