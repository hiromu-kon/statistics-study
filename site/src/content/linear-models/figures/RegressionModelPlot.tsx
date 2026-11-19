import { useMemo, useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Label, Plot, Points, Segment, colorVar, usePlot } from '../../../components/charts/Plot'
import { createRng, normalPdf, randomNormal } from '../../../lib/stats'

const B0 = 2
const B1 = 0.5
const line = (x: number) => B0 + B1 * x

/** 直線上の点 x0 を中心に、縦向きの正規分布の山を横に寝かせて描く */
function SidewaysNormal({ x0, sigma, width = 1.4 }: { x0: number; sigma: number; width?: number }) {
  const s = usePlot()
  const peak = normalPdf(0, 0, sigma)
  const pts: string[] = []
  for (let i = 0; i <= 80; i++) {
    const e = -3 * sigma + (6 * sigma * i) / 80
    const dx = (normalPdf(e, 0, sigma) / peak) * width
    pts.push(`${s.x(x0 + dx).toFixed(2)},${s.y(line(x0) + e).toFixed(2)}`)
  }
  return (
    <g>
      <line x1={s.x(x0)} x2={s.x(x0)} y1={s.y(line(x0) - 3 * sigma)} y2={s.y(line(x0) + 3 * sigma)} stroke={colorVar('muted')} strokeDasharray="3 3" />
      <polyline points={pts.join(' ')} fill={colorVar('c2')} fillOpacity={0.15} stroke={colorVar('c2')} strokeWidth={2} />
    </g>
  )
}

/**
 * 回帰モデル y = β0 + β1 x + ε の図。
 * 「本当の直線」のまわりに、どの x でも同じ形の正規分布の誤差がある、というイメージを見せる。
 */
export function RegressionModelPlot() {
  const [sigma, setSigma] = useState(1)
  // 誤差は標準正規の値を固定しておき、σ 倍するだけにする（スライダーで点が飛び回らないように）
  const base = useMemo(() => {
    const rng = createRng(7)
    return Array.from({ length: 30 }, () => ({ x: 0.3 + rng() * 9.4, z: randomNormal(rng) }))
  }, [])
  const pts = base.map((p) => ({ x: p.x, y: line(p.x) + sigma * p.z }))
  return (
    <div>
      <Plot x={[0, 10]} y={[-2, 11]} xLabel="x" yLabel="y" height={320}>
        <Segment x1={0} y1={line(0)} x2={10} y2={line(10)} color="c1" width={3} />
        {[2, 5, 8].map((x0) => (
          <SidewaysNormal key={x0} x0={x0} sigma={sigma} />
        ))}
        <Points data={pts} r={4} color="ink" opacity={0.55} />
        <Label x={9.6} y={line(9.6) + 1.2} color="c1" anchor="end">
          本当の直線 β0 + β1x
        </Label>
        <Label x={5.2} y={line(5) - 3 * sigma - 0.5} color="c2" anchor="start">
          誤差 ε の分布
        </Label>
      </Plot>
      <p className="figure-readout">
        誤差の標準偏差 σ = <strong>{sigma.toFixed(1)}</strong>（どの x でも同じ大きさ）
      </p>
      <Controls>
        <Slider label="誤差の大きさ σ" value={sigma} min={0.2} max={2} step={0.1} onChange={setSigma} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
