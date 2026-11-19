import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Choice, Marker, Text } from '../../sampling/figures/parts'

const SIGMA = 10
const XBAR = 50
const LEVELS = [
  { value: 90, z: 1.645, color: 'c3' },
  { value: 95, z: 1.96, color: 'c1' },
  { value: 99, z: 2.576, color: 'c4' },
] as const
type Level = (typeof LEVELS)[number]['value']

/**
 * 信頼区間の幅 2 × z × σ/√n が、標本の大きさ n と信頼係数でどう変わるかの図（σ = 10 で固定）。
 */
export function CiWidth() {
  const [n, setN] = useState(25)
  const [level, setLevel] = useState<Level>(95)
  const cur = LEVELS.find((l) => l.value === level)!
  const half = (cur.z * SIGMA) / Math.sqrt(n)
  return (
    <div>
      <Plot x={[XBAR - 15, XBAR + 15]} y={[0, 2]} height={110} hideY grid={false} xLabel="x̄ ± 幅の半分">
        <Segment x1={XBAR - half} y1={1} x2={XBAR + half} y2={1} color={cur.color} width={8} />
        <Marker x={XBAR} color="ink" from={0.6} to={1.4} dashed={false} />
        <Text x={XBAR - half} y={1} dy={-10} color={cur.color}>
          {round(XBAR - half, 2)}
        </Text>
        <Text x={XBAR + half} y={1} dy={-10} color={cur.color}>
          {round(XBAR + half, 2)}
        </Text>
      </Plot>
      <p className="figure-readout">
        信頼係数 {level}%・n = {n}：区間の幅 = 2 × {cur.z} × {SIGMA}/√{n} ≒ <strong>{round(2 * half, 2)}</strong>
      </p>
      <Plot x={[0, 200]} y={[0, 30]} height={220} xLabel="標本の大きさ n" yLabel="区間の幅">
        {LEVELS.map((l) => (
          <Curve key={l.value} f={(x) => (2 * l.z * SIGMA) / Math.sqrt(x)} from={3} to={200} color={l.color} width={l.value === level ? 3 : 1.5} dashed={l.value !== level} />
        ))}
        <Points data={[{ x: n, y: 2 * half }]} color="c2" r={7} opacity={1} />
      </Plot>
      <Legend items={LEVELS.map((l) => ({ color: l.color, label: `${l.value}%（z = ${l.z}）` }))} />
      <Controls>
        <Choice<Level> options={LEVELS.map((l) => ({ value: l.value, label: `${l.value}%` }))} value={level} onChange={setLevel} />
      </Controls>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={4} max={200} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
