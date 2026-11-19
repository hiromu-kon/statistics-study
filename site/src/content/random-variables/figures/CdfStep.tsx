import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Plot, Segment, VLine, colorVar, usePlot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { DistBars } from './DistBars'
import type { Dist } from './dist'

/** 階段の段の端にある点。黒丸 = その値を含む、白丸 = 含まない */
function Dots({ points }: { points: { x: number; y: number; filled: boolean }[] }) {
  const s = usePlot()
  return (
    <g>
      {points.map((d, i) => (
        <circle
          key={i}
          cx={s.x(d.x)}
          cy={s.y(d.y)}
          r={4.5}
          fill={d.filled ? colorVar('c1') : 'var(--surface)'}
          stroke={colorVar('c1')}
          strokeWidth={2}
        />
      ))}
    </g>
  )
}

/**
 * 累積分布関数 F(x) = P(X ≤ x) の階段グラフ。
 * スライダーの位置 x 以下の棒（オレンジ）を全部足した高さが F(x)。
 */
export function CdfStep({
  dist,
  x,
  xTicks,
  label,
  initial,
}: {
  dist: Dist
  x: [number, number]
  xTicks: number[]
  label: (x: number, p: number) => string
  /** スライダーの最初の位置 */
  initial: number
}) {
  const [t, setT] = useState(initial)
  const sorted = [...dist].sort((a, b) => a.x - b.x)
  const cum: number[] = []
  let acc = 0
  for (const d of sorted) {
    acc += d.p
    cum.push(acc)
  }
  const F = (v: number) => sorted.reduce((s, d) => (d.x <= v + 1e-12 ? s + d.p : s), 0)
  const steps = [
    { from: x[0], to: sorted[0].x, y: 0 },
    ...sorted.map((d, i) => ({ from: d.x, to: i + 1 < sorted.length ? sorted[i + 1].x : x[1], y: cum[i] })),
  ]
  const dots = sorted.flatMap((d, i) => [
    { x: d.x, y: i === 0 ? 0 : cum[i - 1], filled: false },
    { x: d.x, y: cum[i], filled: true },
  ])
  const maxP = Math.max(...sorted.map((d) => d.p))
  return (
    <div>
      <DistBars
        dist={sorted}
        x={x}
        yMax={Math.ceil(maxP * 10) / 10}
        xTicks={xTicks}
        label={label}
        highlight={(v) => v <= t + 1e-12}
        height={200}
        ariaLabel="確率分布の棒グラフ"
      />
      <Plot x={x} y={[0, 1.1]} height={220} xTicks={xTicks} yTicks={[0, 0.5, 1]} xLabel="x" yLabel="F(x)" ariaLabel="累積分布関数の階段グラフ">
        {steps.map((s, i) => (
          <Segment key={i} x1={s.from} y1={s.y} x2={s.to} y2={s.y} color="c1" width={3} />
        ))}
        <Dots points={dots} />
        <VLine x={t} color="c2" />
      </Plot>
      <p className="figure-readout">
        F({round(t, 2)}) = P(X ≤ {round(t, 2)}) = <strong>{round(F(t), 4)}</strong>（上のオレンジの棒の合計）
      </p>
      <Controls>
        <Slider label="x の位置" value={t} min={x[0]} max={x[1]} step={0.05} onChange={setT} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
