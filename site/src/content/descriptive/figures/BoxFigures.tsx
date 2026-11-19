import { useMemo, useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Bars, Label, Plot, Points, VLine, colorVar, usePlot, type Color } from '../../../components/charts/Plot'
import { binData } from '../../../components/charts/common'
import { createRng, randomNormal } from '../../../lib/stats'
import { WAIT_TIMES, quartiles, summarize, type BoxSummary } from './summary'

// 共通の BoxPlot（components/charts/common.tsx）は外れ値の点を描けないので、この章では外れ値つきの箱ひげ図を自前で描く。

function BoxRows({ boxes, colors }: { boxes: BoxSummary[]; colors: Color[] }) {
  const s = usePlot()
  return (
    <g>
      {boxes.map((b, i) => {
        const cy = s.y(boxes.length - i - 0.5)
        const h = 22
        const c = colorVar(colors[i % colors.length])
        return (
          <g key={b.label}>
            <line x1={s.x(b.min)} x2={s.x(b.q1)} y1={cy} y2={cy} stroke={c} strokeWidth={2} />
            <line x1={s.x(b.q3)} x2={s.x(b.max)} y1={cy} y2={cy} stroke={c} strokeWidth={2} />
            <line x1={s.x(b.min)} x2={s.x(b.min)} y1={cy - h / 3} y2={cy + h / 3} stroke={c} strokeWidth={2} />
            <line x1={s.x(b.max)} x2={s.x(b.max)} y1={cy - h / 3} y2={cy + h / 3} stroke={c} strokeWidth={2} />
            <rect x={s.x(b.q1)} y={cy - h / 2} width={s.x(b.q3) - s.x(b.q1)} height={h} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={2} rx={2} />
            <line x1={s.x(b.median)} x2={s.x(b.median)} y1={cy - h / 2} y2={cy + h / 2} stroke={c} strokeWidth={3} />
            {(b.outliers ?? []).map((o, j) => (
              <circle key={j} cx={s.x(o)} cy={cy} r={4.5} fill="none" stroke={c} strokeWidth={2} />
            ))}
            {b.label && (
              <text x={s.left + 2} y={cy - h / 2 - 6} className="plot-annot">
                {b.label}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

/** 外れ値（○）も描ける横向きの箱ひげ図 */
export function BoxPlotX({
  boxes,
  x,
  xTicks,
  xLabel,
  colors = ['c1'],
  rowHeight = 56,
}: {
  boxes: BoxSummary[]
  x: [number, number]
  xTicks?: number[]
  xLabel?: string
  colors?: Color[]
  rowHeight?: number
}) {
  return (
    <Plot x={x} y={[0, boxes.length]} height={boxes.length * rowHeight + (xLabel ? 50 : 36)} hideY grid={false} xTicks={xTicks} xLabel={xLabel}>
      <BoxRows boxes={boxes} colors={colors} />
    </Plot>
  )
}

/** ヒストグラムと箱ひげ図を同じ横軸で上下に並べる */
export function HistBox({
  data,
  x,
  binWidth,
  xTicks,
  withOutliers = false,
  color = 'c1',
  histHeight = 150,
  showLabels = false,
}: {
  data: number[]
  x: [number, number]
  binWidth: number
  xTicks?: number[]
  withOutliers?: boolean
  color?: Color
  histHeight?: number
  showLabels?: boolean
}) {
  const bins = binData(data, x[0], binWidth, Math.round((x[1] - x[0]) / binWidth))
  const max = Math.max(...bins.map((b) => b.y))
  const box = summarize(data, '', withOutliers)
  return (
    <div>
      <Plot x={x} y={[0, max * 1.2]} height={histHeight} hideY grid={false} xTicks={xTicks}>
        <Bars data={bins} width={binWidth} color={color} opacity={0.6} labels={showLabels ? (y) => (y > 0 ? String(y) : '') : undefined} />
        <VLine x={box.q1} color="muted" />
        <VLine x={box.median} color="ink" />
        <VLine x={box.q3} color="muted" />
      </Plot>
      <BoxPlotX boxes={[box]} x={x} xTicks={xTicks} colors={[color]} rowHeight={44} />
    </div>
  )
}

const SHAPES: { title: string; make: (rng: () => number) => number }[] = [
  { title: '左右対称', make: (rng) => randomNormal(rng, 50, 10) },
  { title: '右に裾が長い', make: (rng) => 22 + 14 * -Math.log(1 - rng()) * (0.6 + rng() * 0.8) },
  { title: '左に裾が長い', make: (rng) => 78 - 14 * -Math.log(1 - rng()) * (0.6 + rng() * 0.8) },
]

/** 3つの形のヒストグラムと箱ひげ図の対応 */
export function HistBoxGallery() {
  const sets = useMemo(
    () =>
      SHAPES.map((sh, k) => {
        const rng = createRng(500 + k)
        return Array.from({ length: 300 }, () => Math.max(0.5, Math.min(99.5, sh.make(rng))))
      }),
    [],
  )
  return (
    <Compare>
      {SHAPES.map((sh, k) => (
        <Card key={sh.title} title={sh.title}>
          <HistBox data={sets[k]} x={[0, 100]} binWidth={5} xTicks={[0, 50, 100]} color={(['c1', 'c2', 'c3'] as Color[])[k]} histHeight={130} />
        </Card>
      ))}
    </Compare>
  )
}

const POOL = [2, 4, 5, 7, 8, 10, 12, 13, 15, 18, 20, 23]

/** データの個数を変えて、四分位数をどこで区切るかを見る */
export function QuartileDots() {
  const [n, setN] = useState(9)
  const data = POOL.slice(0, n)
  const half = Math.floor(n / 2)
  const { q1, median, q3 } = quartiles(data)
  const pos = {
    q1: (half + 1) / 2,
    q2: (n + 1) / 2,
    q3: n - half + (half + 1) / 2,
  }
  const colorOf = (i: number): Color => (i < half ? 'c1' : i >= n - half ? 'c3' : 'c2')
  return (
    <div>
      <Plot x={[0.3, n + 0.7]} y={[0, 3]} height={190} hideY grid={false} xTicks={[]}>
        <Points data={data.map((_, i) => ({ x: i + 1, y: 2, color: colorOf(i) }))} r={13} opacity={0.85} />
        {data.map((v, i) => (
          <Label key={i} x={i + 1} y={2} dy={5}>
            <tspan style={{ fill: 'var(--surface)' }}>{v}</tspan>
          </Label>
        ))}
        {data.map((_, i) => (
          <Label key={`n${i}`} x={i + 1} y={2} dy={-20} color="muted">
            {`${i + 1}番目`}
          </Label>
        ))}
        <Marker x={pos.q1} label={`Q1 = ${q1}`} color="c1" />
        <Marker x={pos.q2} label={`Q2 = ${median}`} color="c2" />
        <Marker x={pos.q3} label={`Q3 = ${q3}`} color="c3" />
      </Plot>
      <p className="figure-readout">
        {n % 2 === 1
          ? `n = ${n}（奇数）：真ん中の ${(n + 1) / 2}番目が中央値。前半・後半には入れずに、それぞれ ${half}個ずつで Q1・Q3 を求める。`
          : `n = ${n}（偶数）：${n / 2}番目と${n / 2 + 1}番目の平均が中央値。前半・後半を ${half}個ずつに分けて Q1・Q3 を求める。`}
      </p>
      <Controls>
        <Slider label="データの個数 n" value={n} min={5} max={12} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}

function Marker({ x, label, color }: { x: number; label: string; color: Color }) {
  const s = usePlot()
  const y0 = s.y(2) + 18
  const y1 = s.y(0.6)
  return (
    <g>
      <line x1={s.x(x)} x2={s.x(x)} y1={y0} y2={y1} stroke={colorVar(color)} strokeWidth={2} strokeDasharray="4 3" />
      <text x={s.x(x)} y={y1 + 16} textAnchor="middle" className="plot-annot" fill={colorVar(color)}>
        {label}
      </text>
    </g>
  )
}

/** 待ち時間50人分のヒストグラム。箱ひげ図との対応の問題で、箱ひげ図と横軸をそろえて使う */
export function WaitTimeHistogram() {
  return (
    <Plot x={[0, 35]} y={[0, 21]} height={170} hideY grid={false} xTicks={[0, 5, 10, 15, 20, 25, 30, 35]}>
      <Bars data={binData(WAIT_TIMES, 0, 5, 7)} width={5} opacity={0.7} labels={(y) => String(y)} />
    </Plot>
  )
}
