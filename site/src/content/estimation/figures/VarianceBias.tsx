import { useMemo, useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { Curve, HLine, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { createRng, mean, randomNormal, round } from '../../../lib/stats'
import { Marker } from '../../sampling/figures/parts'

const MU = 50
const SIGMA = 10

/**
 * 1つの標本で、「標本平均からのずれ」と「本当の平均からのずれ」の2乗和をくらべる図。
 * 標本平均は標本のちょうど真ん中にあるので、前者はいつも後者以下になる。
 */
export function DeviationFromMean() {
  const [seed, setSeed] = useState(3)
  const xs = useMemo(() => {
    const rng = createRng(seed * 97)
    return Array.from({ length: 5 }, () => round(randomNormal(rng, MU, SIGMA), 1))
  }, [seed])
  const xbar = mean(xs)
  const ssBar = xs.reduce((a, x) => a + (x - xbar) ** 2, 0)
  const ssMu = xs.reduce((a, x) => a + (x - MU) ** 2, 0)
  const rows = xs.map((x, i) => ({ x, y: xs.length - i }))
  return (
    <div>
      <Plot x={[20, 80]} y={[0, xs.length + 1]} height={230} hideY grid={false} xLabel="測った値">
        <Marker x={MU} color="c5" label="本当の平均 μ = 50" />
        <Marker x={xbar} color="c2" label={`標本平均 ${round(xbar, 1)}`} labelY={0.4} />
        {rows.map((r, i) => (
          <Segment key={`m${i}`} x1={MU} y1={r.y + 0.15} x2={r.x} y2={r.y + 0.15} color="c5" width={2} />
        ))}
        {rows.map((r, i) => (
          <Segment key={`b${i}`} x1={xbar} y1={r.y - 0.15} x2={r.x} y2={r.y - 0.15} color="c2" width={2} />
        ))}
        <Points data={rows} color="c1" r={6} opacity={0.9} />
      </Plot>
      <p className="figure-readout">
        μ からのずれの2乗和 = <strong>{round(ssMu, 1)}</strong>　≧　標本平均からのずれの2乗和 = <strong>{round(ssBar, 1)}</strong>
      </p>
      <Controls>
        <Button variant="primary" onClick={() => setSeed(seed + 1)}>
          別の5人を選ぶ
        </Button>
      </Controls>
    </div>
  )
}

const REPS = 3000
const NS = Array.from({ length: 19 }, (_, i) => i + 2)

/**
 * n で割る分散と n − 1 で割る分散を、それぞれ何千回も計算して平均した値。
 * n で割るほうは平均的に σ² より小さく（(n − 1)/n 倍に）なる。
 */
export function DivisorSim() {
  const [seed, setSeed] = useState(1)
  const rows = useMemo(() => {
    const rng = createRng(seed * 7 + 1)
    return NS.map((n) => {
      let sumN = 0
      let sumN1 = 0
      for (let r = 0; r < REPS; r++) {
        const xs = Array.from({ length: n }, () => randomNormal(rng, MU, SIGMA))
        const m = mean(xs)
        const ss = xs.reduce((a, x) => a + (x - m) ** 2, 0)
        sumN += ss / n
        sumN1 += ss / (n - 1)
      }
      return { n, byN: sumN / REPS, byN1: sumN1 / REPS }
    })
  }, [seed])
  const at = (n: number) => rows.find((r) => r.n === n)!
  return (
    <div>
      <Plot x={[1, 21]} y={[40, 120]} height={280} xLabel="標本の大きさ n" yLabel="分散の平均" xTicks={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}>
        <HLine y={SIGMA * SIGMA} color="c5" label="本当の母分散 σ² = 100" />
        <Curve f={(n) => (SIGMA * SIGMA * (n - 1)) / n} from={1.6} to={20.5} color="c2" dashed width={1.5} />
        <Points data={rows.map((r) => ({ x: r.n, y: r.byN }))} color="c2" r={5} opacity={0.9} />
        <Points data={rows.map((r) => ({ x: r.n, y: r.byN1 }))} color="c1" r={5} opacity={0.9} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'n − 1 で割った分散（不偏分散）の平均' },
          { color: 'c2', label: 'n で割った分散の平均（点線は理論値 σ²(n−1)/n）' },
        ]}
      />
      <p className="figure-readout">
        n = 3 のとき：n で割る ≒ <strong>{round(at(3).byN, 1)}</strong>、n − 1 で割る ≒ <strong>{round(at(3).byN1, 1)}</strong>（各 {REPS} 回の平均）
      </p>
      <Controls>
        <Button onClick={() => setSeed(seed + 1)}>シミュレーションをやり直す</Button>
      </Controls>
    </div>
  )
}
