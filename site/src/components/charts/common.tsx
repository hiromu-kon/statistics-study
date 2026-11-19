import { useState } from 'react'
import { Controls, Slider } from '../blocks'
import { normalCdf, normalPdf, round } from '../../lib/stats'
import { Area, Curve, Plot, VLine, colorVar, usePlot, type Color } from './Plot'

/** 生データからヒストグラムの棒を作る。区間は [start + k*width, start + (k+1)*width) */
export function binData(values: number[], start: number, width: number, bins: number): { x: number; y: number }[] {
  const counts = Array.from({ length: bins }, () => 0)
  for (const v of values) {
    const k = Math.floor((v - start) / width)
    if (k >= 0 && k < bins) counts[k]++
    else if (k === bins && v === start + bins * width) counts[bins - 1]++
  }
  return counts.map((c, k) => ({ x: start + (k + 0.5) * width, y: c }))
}

/** 横向きの箱ひげ図。複数並べて比べられる */
export function BoxPlot({
  boxes,
  x,
  width = 560,
  xLabel,
}: {
  boxes: { label: string; min: number; q1: number; median: number; q3: number; max: number; mean?: number; color?: Color }[]
  x: [number, number]
  width?: number
  xLabel?: string
}) {
  const rowH = 56
  const height = boxes.length * rowH + (xLabel ? 50 : 36)
  return (
    <Plot x={x} y={[0, boxes.length]} width={width} height={height} hideY grid={false} xLabel={xLabel}>
      <BoxRows boxes={boxes} />
    </Plot>
  )
}


function BoxRows({ boxes }: { boxes: Parameters<typeof BoxPlot>[0]['boxes'] }) {
  const s = usePlot()
  return (
    <g>
      {boxes.map((b, i) => {
        const cy = s.y(boxes.length - i - 0.5)
        const h = 22
        const c = colorVar(b.color ?? 'c1')
        return (
          <g key={b.label}>
            <line x1={s.x(b.min)} x2={s.x(b.q1)} y1={cy} y2={cy} stroke={c} strokeWidth={2} />
            <line x1={s.x(b.q3)} x2={s.x(b.max)} y1={cy} y2={cy} stroke={c} strokeWidth={2} />
            <line x1={s.x(b.min)} x2={s.x(b.min)} y1={cy - h / 3} y2={cy + h / 3} stroke={c} strokeWidth={2} />
            <line x1={s.x(b.max)} x2={s.x(b.max)} y1={cy - h / 3} y2={cy + h / 3} stroke={c} strokeWidth={2} />
            <rect x={s.x(b.q1)} y={cy - h / 2} width={s.x(b.q3) - s.x(b.q1)} height={h} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={2} rx={2} />
            <line x1={s.x(b.median)} x2={s.x(b.median)} y1={cy - h / 2} y2={cy + h / 2} stroke={c} strokeWidth={3} />
            {b.mean !== undefined && (
              <text x={s.x(b.mean)} y={cy + 5} textAnchor="middle" className="plot-annot" fill={c}>
                +
              </text>
            )}
            <text x={s.left + 2} y={cy - h / 2 - 6} className="plot-annot">
              {b.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/**
 * 正規分布の曲線と、指定した範囲の面積（確率）。
 * interactive にすると、範囲をスライダーで動かせる。
 */
export function NormalArea({
  mu = 0,
  sigma = 1,
  from: from0 = -1,
  to: to0 = 1,
  interactive = false,
  xLabel,
  width,
}: {
  mu?: number
  sigma?: number
  from?: number
  to?: number
  interactive?: boolean
  xLabel?: string
  width?: number
}) {
  const [fromState, setFrom] = useState(from0)
  const [toState, setTo] = useState(to0)
  // スライダーで動かさない図は props の値をそのまま使い、親が値を変えたら追従させる
  const from = interactive ? fromState : from0
  const to = interactive ? toState : to0
  const lo = mu - 4 * sigma
  const hi = mu + 4 * sigma
  const peak = normalPdf(mu, mu, sigma)
  const a = Math.max(from, lo - 100)
  const b = Math.min(to, hi + 100)
  const p = normalCdf(b, mu, sigma) - normalCdf(a, mu, sigma)
  const ticks = [-3, -2, -1, 0, 1, 2, 3].map((k) => mu + k * sigma)
  return (
    <div>
      <Plot x={[lo, hi]} y={[0, peak * 1.15]} hideY xTicks={ticks} xLabel={xLabel} width={width}>
        <Area f={(t) => normalPdf(t, mu, sigma)} from={a} to={b} color="c1" opacity={0.35} />
        <Curve f={(t) => normalPdf(t, mu, sigma)} />
        {from > lo && <VLine x={from} color="c2" />}
        {to < hi && <VLine x={to} color="c2" />}
      </Plot>
      <p className="figure-readout">
        塗った部分の面積 = 確率 ≒ <strong>{round(p, 4)}</strong>
      </p>
      {interactive && (
        <Controls>
          <Slider label="左端" value={from} min={lo} max={hi} step={sigma / 20} onChange={(v) => setFrom(Math.min(v, to))} format={(v) => String(round(v, 2))} />
          <Slider label="右端" value={to} min={lo} max={hi} step={sigma / 20} onChange={(v) => setTo(Math.max(v, from))} format={(v) => String(round(v, 2))} />
        </Controls>
      )}
    </div>
  )
}
