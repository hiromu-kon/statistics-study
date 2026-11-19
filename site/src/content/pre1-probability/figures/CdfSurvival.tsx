import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { exponentialPdf, round } from '../../../lib/stats'

/**
 * 指数分布（平均 1/λ）で、累積分布関数 F(x) と生存関数 S(x) = 1 − F(x) を並べる図。
 * 左：密度の左側の面積が F(x)、右側の面積が S(x)。右：F と S のグラフ。どの x でも足すと 1。
 */
export function CdfSurvival() {
  const [x0, setX0] = useState(1.5)
  const [lambda, setLambda] = useState(0.5)
  const F = (x: number) => (x < 0 ? 0 : 1 - Math.exp(-lambda * x))
  const S = (x: number) => 1 - F(x)
  const xMax = 8
  return (
    <div>
      <Compare>
        <Card title="密度 f(x) と面積">
          <Plot x={[0, xMax]} y={[0, 1.05]} width={300} height={240} xLabel="寿命 x（年）" hideY>
            <Area f={(x) => exponentialPdf(x, lambda)} from={0} to={x0} color="c1" opacity={0.35} />
            <Area f={(x) => exponentialPdf(x, lambda)} from={x0} to={xMax} color="c2" opacity={0.35} />
            <Curve f={(x) => exponentialPdf(x, lambda)} color="ink" width={2} />
            <VLine x={x0} color="muted" />
          </Plot>
        </Card>
        <Card title="F(x) と S(x)">
          <Plot x={[0, xMax]} y={[0, 1]} width={300} height={240} xLabel="寿命 x（年）" yTicks={[0, 0.25, 0.5, 0.75, 1]}>
            <Curve f={F} color="c1" />
            <Curve f={S} color="c2" />
            <VLine x={x0} color="muted" />
            <Points
              data={[
                { x: x0, y: F(x0), color: 'c1' },
                { x: x0, y: S(x0), color: 'c2' },
              ]}
              r={5}
              opacity={1}
            />
          </Plot>
        </Card>
      </Compare>
      <Legend
        items={[
          { color: 'c1', label: '累積分布関数 F(x) = P(X ≦ x)：x 年までに壊れる確率' },
          { color: 'c2', label: '生存関数 S(x) = P(X > x)：x 年より長く持つ確率' },
        ]}
      />
      <p className="figure-readout">
        F({x0}) = <strong>{round(F(x0), 3)}</strong>、S({x0}) = e^(−{lambda}×{x0}) = <strong>{round(S(x0), 3)}</strong>　（足すと 1）
      </p>
      <Controls>
        <Slider label="x" value={x0} min={0} max={xMax} step={0.25} onChange={setX0} format={(v) => v.toFixed(2)} />
        <Slider label="λ（平均 1/λ 年）" value={lambda} min={0.2} max={1} step={0.1} onChange={(v) => setLambda(round(v, 1))} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
