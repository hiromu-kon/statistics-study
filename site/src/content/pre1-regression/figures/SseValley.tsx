import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Label, Plot, Points, colorVar, usePlot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

/**
 * 多重共線性の図。標準化した2つの説明変数の相関を r とすると X'X/n = [[1, r], [r, 1]]。
 * 残差平方和が同じ値になる (β1, β2) の組は楕円になり、r が 1 に近いほど (1, −1) の向きに細長く伸びる。
 */
function Ellipse({ r, c, color }: { r: number; c: number; color: 'c1' | 'c3' | 'c4' }) {
  const s = usePlot()
  // 固有値 1 + r の向き (1, 1)/√2、固有値 1 − r の向き (1, −1)/√2
  const a = Math.sqrt(c / (1 + r))
  const b = Math.sqrt(c / (1 - r))
  const pts: string[] = []
  for (let i = 0; i <= 120; i++) {
    const t = (2 * Math.PI * i) / 120
    const u = a * Math.cos(t)
    const v = b * Math.sin(t)
    const x = 1 + (u + v) / Math.SQRT2
    const y = 1 + (u - v) / Math.SQRT2
    pts.push(`${s.x(x).toFixed(1)},${s.y(y).toFixed(1)}`)
  }
  return <polygon points={pts.join(' ')} fill={colorVar(color)} fillOpacity={0.08} stroke={colorVar(color)} strokeWidth={2} />
}

export function SseValley() {
  const [r, setR] = useState(0.5)
  const det = 1 - r * r
  const inv = 1 / det
  return (
    <div>
      <Compare>
        <Card title="残差平方和の等高線（β1, β2 の平面）">
          <Plot x={[-2, 4]} y={[-2, 4]} width={320} height={300} xLabel="β1" yLabel="β2" xTicks={[-2, -1, 0, 1, 2, 3, 4]} yTicks={[-2, 0, 2, 4]}>
            <Ellipse r={r} c={0.5} color="c4" />
            <Ellipse r={r} c={0.2} color="c3" />
            <Ellipse r={r} c={0.05} color="c1" />
            <Points data={[{ x: 1, y: 1 }]} r={5} color="ink" opacity={1} />
            <Label x={1.15} y={1.15} anchor="start" dy={-4}>
              最小の点
            </Label>
          </Plot>
        </Card>
        <Card title="X'X と、その逆行列（n で割った値）">
          <div style={{ padding: '8px 4px', lineHeight: 2 }}>
            <p>
              <M>{`\\frac{1}{n}X^\\top X = \\begin{pmatrix} 1 & ${r.toFixed(2)} \\\\ ${r.toFixed(2)} & 1 \\end{pmatrix}`}</M>
            </p>
            <p>
              行列式 <M>{`1 - r^2 = ${round(det, 4)}`}</M>
            </p>
            <p>
              <M>{`n (X^\\top X)^{-1} = \\begin{pmatrix} ${round(inv, 2)} & ${round(-r * inv, 2)} \\\\ ${round(-r * inv, 2)} & ${round(inv, 2)} \\end{pmatrix}`}</M>
            </p>
          </div>
        </Card>
      </Compare>
      <p className="figure-readout">
        相関 r = <strong>{r.toFixed(2)}</strong>　→　係数の分散は相関0のときの <strong>{round(inv, 2)} 倍</strong>（VIF）
      </p>
      <Controls>
        <Slider label="x1 と x2 の相関 r" value={r} min={0} max={0.99} step={0.01} onChange={setR} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
