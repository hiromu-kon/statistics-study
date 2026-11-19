import { useMemo, useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { HLine, Legend, Plot } from '../../../components/charts/Plot'
import { createRng, round } from '../../../lib/stats'
import { Polyline } from './parts'
import { rollDie } from './sim'

const ROLLS = 500
const COLORS = ['c1', 'c3', 'c4'] as const

/** サイコロを振り続けたときの「それまでの平均」の推移（大数の法則） */
export function RunningMean() {
  const [seed, setSeed] = useState(1)
  const series = useMemo(
    () =>
      COLORS.map((_, k) => {
        const rng = createRng(seed * 101 + k)
        let total = 0
        return Array.from({ length: ROLLS }, (_, i) => {
          total += rollDie(rng)
          return { x: i + 1, y: total / (i + 1) }
        })
      }),
    [seed],
  )
  return (
    <div>
      <Plot x={[0, ROLLS]} y={[1, 6]} height={280} xLabel="振った回数" yLabel="それまでの平均" yTicks={[1, 2, 3, 3.5, 4, 5, 6]}>
        <HLine y={3.5} color="c5" />
        {series.map((pts, k) => (
          <Polyline key={k} points={pts} color={COLORS[k]} width={2} />
        ))}
      </Plot>
      <Legend
        items={[
          ...series.map((pts, k) => ({ color: COLORS[k], label: `${k + 1}人目：${ROLLS}回後の平均 ${round(pts[ROLLS - 1].y, 3)}` })),
          { color: 'c5' as const, label: '期待値 3.5' },
        ]}
      />
      <Controls>
        <Button variant="primary" onClick={() => setSeed(seed + 1)}>
          別の3人で振り直す
        </Button>
      </Controls>
    </div>
  )
}
