import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, Points } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Rect } from './parts'

const logit = (p: number) => Math.log(p / (1 - p))

/**
 * デルタ法の図：標本比率 p̂ のばらつき（横の帯、p ± 2SE）が、対数オッズ g(p) = log(p/(1−p)) で縦の帯に移る様子。
 * n が大きく帯が狭いほど、曲線は帯の中でほぼ直線（接線）とみなせ、縦の帯の幅 ≒ 傾き g′(p) × 横の帯の幅 になる。
 */
export function DeltaMethodPlot() {
  const [p, setP] = useState(0.2)
  const [n, setN] = useState(100)
  const se = Math.sqrt((p * (1 - p)) / n)
  const slope = 1 / (p * (1 - p))
  const lo = Math.max(0.005, p - 2 * se)
  const hi = Math.min(0.995, p + 2 * se)
  const yLo = -4
  const yHi = 4
  return (
    <div>
      <Plot x={[0, 1]} y={[yLo, yHi]} height={300} xLabel="比率 p" yLabel="log(p/(1−p))" xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]} yTicks={[-4, -2, 0, 2, 4]}>
        <Rect x0={lo} x1={hi} y0={yLo} y1={yHi} color="c1" opacity={0.12} />
        <Rect x0={0} x1={1} y0={Math.max(yLo, logit(lo))} y1={Math.min(yHi, logit(hi))} color="c2" opacity={0.12} />
        <Curve f={logit} from={0.005} to={0.995} color="ink" width={2} samples={300} />
        <Curve f={(x) => logit(p) + slope * (x - p)} color="c2" dashed />
        <Points data={[{ x: p, y: logit(p) }]} color="c2" r={5} opacity={1} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '横の帯：p̂ のばらつき（p ± 2 × 標準誤差）' },
          { color: 'c2', label: '縦の帯：対数オッズのばらつき。破線は p での接線' },
        ]}
      />
      <p className="figure-readout">
        p̂ の標準誤差 √(p(1−p)/n) = {round(se, 4)}　×　傾き 1/(p(1−p)) = {round(slope, 3)}　→　対数オッズの標準誤差 ≒ <strong>{round(se * slope, 4)}</strong>（= 1/√(np(1−p))）
      </p>
      <Controls>
        <Slider label="比率 p" value={p} min={0.1} max={0.9} step={0.05} onChange={(v) => setP(round(v, 2))} format={(v) => v.toFixed(2)} />
        <Slider label="標本の大きさ n" value={n} min={10} max={1000} step={10} onChange={setN} />
      </Controls>
    </div>
  )
}
