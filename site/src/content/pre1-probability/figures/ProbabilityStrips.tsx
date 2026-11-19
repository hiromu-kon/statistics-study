import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Curve, Plot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Rect } from './parts'

const STRIPS = 10

/**
 * X が 0〜1 の一様分布のとき、Y = X^a の密度を「確率の帯」で見せる図。
 * x 軸を確率 0.1 ずつの帯に分けると、それぞれが y 軸のどこかの区間に移る。区間が狭いほど確率 0.1 が詰めこまれ、密度が高くなる。
 * 帯の高さ（0.1 ÷ 区間の幅）が、公式 f_Y(y) = f_X(x)|dx/dy| の曲線に重なる。
 */
export function ProbabilityStrips() {
  const [a, setA] = useState(2)
  const g = (x: number) => x ** a
  const edges = Array.from({ length: STRIPS + 1 }, (_, i) => i / STRIPS)
  // 逆関数 x = y^(1/a)、dx/dy = (1/a) y^(1/a − 1)
  const fY = (y: number) => (y <= 0 ? NaN : (1 / a) * y ** (1 / a - 1))
  const yMax = 4
  return (
    <div>
      <Compare>
        <Card title={`y = x^${a} で帯を移す`}>
          <Plot x={[0, 1]} y={[0, 1]} width={300} height={280} xLabel="x（一様分布）" yLabel="y" xTicks={[0, 0.5, 1]} yTicks={[0, 0.5, 1]}>
            {edges.slice(0, -1).map((x0, i) => (
              <g key={i}>
                <Rect x0={x0} x1={edges[i + 1]} y0={0} y1={0.06} color={i % 2 ? 'c2' : 'c1'} opacity={0.6} />
                <Rect x0={0} x1={0.04} y0={g(x0)} y1={g(edges[i + 1])} color={i % 2 ? 'c2' : 'c1'} opacity={0.6} />
                <Rect x0={x0} x1={edges[i + 1]} y0={0.06} y1={g(edges[i + 1])} color={i % 2 ? 'c2' : 'c1'} opacity={0.08} />
              </g>
            ))}
            <Curve f={g} color="ink" width={2} />
          </Plot>
        </Card>
        <Card title="Y の密度（帯の確率 0.1 ÷ 区間の幅）">
          <Plot x={[0, 1]} y={[0, yMax]} width={300} height={280} xLabel="y" xTicks={[0, 0.5, 1]} yTicks={[0, 1, 2, 3, 4]}>
            {edges.slice(0, -1).map((x0, i) => {
              const lo = g(x0)
              const hi = g(edges[i + 1])
              return <Rect key={i} x0={lo} x1={hi} y0={0} y1={Math.min(0.1 / (hi - lo), yMax)} color={i % 2 ? 'c2' : 'c1'} opacity={0.45} />
            })}
            <Curve f={fY} from={0.001} to={1} color="ink" width={2} samples={300} />
          </Plot>
        </Card>
      </Compare>
      <p className="figure-readout">
        公式：f_Y(y) = f_X(x)·|dx/dy| = 1 × (1/{a})·y^({round(1 / a - 1, 2)})（黒い曲線）。帯の高さがこれに沿う
      </p>
      <Controls>
        <Slider label="べき a（Y = X^a）" value={a} min={0.5} max={3} step={0.5} onChange={setA} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
