import { useMemo, useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Curve, Plot, Points } from '../../../components/charts/Plot'
import { createRng, randomNormal, round } from '../../../lib/stats'

/**
 * 多重共線性の図。説明変数 x1 と x2 の相関 r を上げると、
 * 偏回帰係数の標準誤差が 1/√(1 − r²) 倍に膨らむ（説明変数が2つのとき）。
 */
export function CollinearityPlot() {
  const [r, setR] = useState(0.5)
  const base = useMemo(() => {
    const rng = createRng(11)
    return Array.from({ length: 60 }, () => ({ z1: randomNormal(rng), z2: randomNormal(rng) }))
  }, [])
  const pts = base.map((p) => ({ x: p.z1, y: r * p.z1 + Math.sqrt(1 - r * r) * p.z2 }))
  const factor = 1 / Math.sqrt(1 - r * r)
  return (
    <div>
      <Compare>
        <Card title="説明変数どうしの散布図">
          <Plot x={[-3, 3]} y={[-3, 3]} width={300} height={260} xLabel="x1" yLabel="x2">
            <Points data={pts} r={3.5} color="c4" opacity={0.6} />
          </Plot>
        </Card>
        <Card title="標準誤差が何倍になるか">
          <Plot x={[0, 1]} y={[0, 8]} width={300} height={260} xLabel="x1 と x2 の相関係数 r" xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
            <Curve f={(v) => 1 / Math.sqrt(1 - v * v)} from={0} to={0.995} color="c5" />
            <Points data={[{ x: r, y: Math.min(factor, 7.9) }]} r={7} color="c5" opacity={1} />
          </Plot>
        </Card>
      </Compare>
      <p className="figure-readout">
        相関 r = <strong>{r.toFixed(2)}</strong>　→　VIF = 1 ÷ (1 − r²) = <strong>{round(1 / (1 - r * r), 2)}</strong>、標準誤差は相関0のときの{' '}
        <strong>{round(factor, 2)} 倍</strong>
      </p>
      <Controls>
        <Slider label="x1 と x2 の相関 r" value={r} min={0} max={0.99} step={0.01} onChange={setR} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
