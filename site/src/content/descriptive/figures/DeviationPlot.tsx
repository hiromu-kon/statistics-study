import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Label, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { mean, round, sd, variance } from '../../../lib/stats'
import { CountHistogram } from './HistogramFigures'

/**
 * データの点と平均からの距離（偏差）を見せる図。
 * 「広げ具合」を動かすと、偏差が k 倍・分散が k² 倍・標準偏差が k 倍になる様子がわかる。
 */
export function DeviationPlot({ data, interactive = false, width }: { data: number[]; interactive?: boolean; width?: number }) {
  const [k, setK] = useState(1)
  const m = mean(data)
  const xs = data.map((x) => m + (x - m) * k)
  const rows = xs.map((x, i) => ({ x, y: data.length - i }))
  return (
    <div>
      <Plot x={[-2, 12]} y={[0, data.length + 1]} width={width} height={60 + data.length * 34} hideY grid={false} xTicks={[-2, 0, 2, 4, 6, 8, 10, 12]}>
        <VLine x={m} color="c2" label={`平均 ${round(m, 2)}`} />
        {rows.map((r, i) => (
          <Segment key={i} x1={m} y1={r.y} x2={r.x} y2={r.y} color="c1" width={3} />
        ))}
        <Points data={rows} r={7} opacity={0.9} />
        {rows.map((r, i) => (
          <Label key={`l${i}`} x={r.x} y={r.y} dy={-12} color="c1">
            {`${round(r.x - m, 2) > 0 ? '+' : ''}${round(r.x - m, 2)}`}
          </Label>
        ))}
      </Plot>
      <p className="figure-readout">
        n で割る：分散 <strong>{round(variance(xs), 3)}</strong>・標準偏差 <strong>{round(sd(xs), 3)}</strong>
        <br />
        n − 1 で割る：分散 <strong>{round(variance(xs, 1), 3)}</strong>・標準偏差 <strong>{round(sd(xs, 1), 3)}</strong>
      </p>
      {interactive && (
        <Controls>
          <Slider label="広げ具合 k" value={k} min={0} max={2} step={0.1} onChange={setK} format={(v) => `${v.toFixed(1)}倍`} />
        </Controls>
      )}
    </div>
  )
}

/** 平均も範囲も同じで、形だけが違う3つの分布（値は 1〜9 の整数） */
const SPREAD_SHAPES: { title: string; counts: number[] }[] = [
  { title: '山形（真ん中に集まる）', counts: [1, 2, 4, 6, 8, 6, 4, 2, 1] },
  { title: '一様（どの値も同じ人数）', counts: [4, 4, 4, 4, 4, 4, 4, 4, 4] },
  { title: 'U字形（両端に集まる）', counts: [8, 6, 4, 2, 1, 2, 4, 6, 8] },
]

/** 範囲が同じでも、平均から遠い値が多いほど標準偏差は大きい */
export function SpreadShapes({
  showSd = true,
  labels,
  order = [0, 1, 2],
}: {
  showSd?: boolean
  /** カードの見出し。省略すると形の名前 */
  labels?: string[]
  /** 並べる順番（SPREAD_SHAPES の番号）。問題で形の順に並ばないようにするため */
  order?: number[]
}) {
  return (
    <Compare>
      {order.map((idx, k) => {
        const sh = SPREAD_SHAPES[idx]
        const xs = sh.counts.flatMap((c, i) => Array.from({ length: c }, () => i + 1))
        return (
          <Card key={sh.title} title={labels ? labels[k] : sh.title}>
            <CountHistogram counts={sh.counts} start={0.5} width={1} xTicks={[1, 3, 5, 7, 9]} height={150} color={(['c1', 'c2', 'c3'] as const)[idx]} />
            {showSd && (
              <p className="figure-readout">
                {xs.length}人・平均 {round(mean(xs), 2)}・標準偏差 <strong>{round(sd(xs, 1), 2)}</strong>（n − 1 で割る）
              </p>
            )}
          </Card>
        )
      })}
    </Compare>
  )
}
