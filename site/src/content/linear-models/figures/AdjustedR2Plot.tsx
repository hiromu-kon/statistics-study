import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

// n = 20 の架空データで、本当に効く変数 x1 のあとに「でたらめな乱数の変数」を1つずつ足したときの R²（numpy で計算）。
const N = 20
const R2 = [0.6263, 0.6288, 0.6511, 0.6577, 0.6729, 0.6885, 0.6972, 0.7067, 0.7226, 0.7355]
const adj = (r2: number, p: number) => 1 - ((1 - r2) * (N - 1)) / (N - p - 1)

/**
 * 役に立たない変数を足しても R² は必ず増えるが、自由度調整済み R² は増えない（むしろ下がる）ことを見せる図。
 */
export function AdjustedR2Plot() {
  const [p, setP] = useState(1)
  const r2Pts = R2.map((v, i) => ({ x: i + 1, y: v }))
  const adjPts = R2.map((v, i) => ({ x: i + 1, y: adj(v, i + 1) }))
  return (
    <div>
      <Plot x={[0.5, 10.5]} y={[0.4, 0.8]} xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} xLabel="説明変数の個数 p（2個目からは乱数）" height={280}>
        <VLine x={p} color="muted" />
        {r2Pts.slice(1).map((q, i) => (
          <Segment key={`r${i}`} x1={r2Pts[i].x} y1={r2Pts[i].y} x2={q.x} y2={q.y} color="c1" width={2.5} />
        ))}
        {adjPts.slice(1).map((q, i) => (
          <Segment key={`a${i}`} x1={adjPts[i].x} y1={adjPts[i].y} x2={q.x} y2={q.y} color="c2" width={2.5} />
        ))}
        <Points data={r2Pts} r={4} color="c1" opacity={0.9} />
        <Points data={adjPts} r={4} color="c2" opacity={0.9} />
        <Points data={[r2Pts[p - 1], adjPts[p - 1]]} r={8} color="ink" opacity={0.5} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '決定係数 R²' },
          { color: 'c2', label: '自由度調整済み決定係数' },
        ]}
      />
      <p className="figure-readout">
        p = {p}：R² = <strong>{R2[p - 1].toFixed(4)}</strong>　調整済み R² = 1 − (1 − {R2[p - 1].toFixed(4)}) × {N - 1} ÷ {N - p - 1} ={' '}
        <strong>{round(adj(R2[p - 1], p), 3).toFixed(3)}</strong>
      </p>
      <Controls>
        <Slider label="説明変数の個数 p" value={p} min={1} max={10} step={1} onChange={setP} />
      </Controls>
    </div>
  )
}
