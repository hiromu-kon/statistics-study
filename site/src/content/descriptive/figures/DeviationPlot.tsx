import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Label, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { mean, round, sd, variance } from '../../../lib/stats'

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
        分散 = <strong>{round(variance(xs), 3)}</strong>　標準偏差 = <strong>{round(sd(xs), 3)}</strong>（n で割った場合）
      </p>
      {interactive && (
        <Controls>
          <Slider label="広げ具合 k" value={k} min={0} max={2} step={0.1} onChange={setK} format={(v) => `${v.toFixed(1)}倍`} />
        </Controls>
      )}
    </div>
  )
}
