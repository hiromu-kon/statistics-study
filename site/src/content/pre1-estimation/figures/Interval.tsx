import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Area, Curve, HLine, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { binomialPmf, chi2Pdf, chi2Quantile, createRng, round } from '../../../lib/stats'
import { Choice, Marker, Text } from '../../sampling/figures/parts'

const Z = 1.96
type Method = 'wald' | 'wilson'

/** 表が k 回のときの 95% 信頼区間 */
function interval(k: number, n: number, method: Method): [number, number] {
  const ph = k / n
  if (method === 'wald') {
    const h = Z * Math.sqrt((ph * (1 - ph)) / n)
    return [ph - h, ph + h]
  }
  const d = 1 + (Z * Z) / n
  const c = (ph + (Z * Z) / (2 * n)) / d
  const h = (Z / d) * Math.sqrt((ph * (1 - ph)) / n + (Z * Z) / (4 * n * n))
  return [c - h, c + h]
}

/** 被覆確率：区間が本当の p を含む k について、二項分布の確率を足したもの（シミュレーションではなく正確な値） */
function coverage(p: number, n: number, method: Method): number {
  let total = 0
  for (let k = 0; k <= n; k++) {
    const [lo, hi] = interval(k, n, method)
    if (lo <= p && p <= hi) total += binomialPmf(k, n, p)
  }
  return total
}

const SIMS = 1000

/**
 * 母比率の 95% 信頼区間の、実際の被覆確率を p の関数として描く図。
 * ワルド型（p̂ ± 1.96√(p̂(1−p̂)/n)）は、名目の 95% を大きく下回る p がある。ウィルソン型と比べられる。
 * ボタンで、選んだ p から 1000 回標本をとるシミュレーションもできる。
 */
export function CoverageProportion() {
  const [n, setN] = useState(30)
  const [p, setP] = useState(0.1)
  const [method, setMethod] = useState<Method>('wald')
  const [sim, setSim] = useState<{ key: string; hit: number } | null>(null)
  const [seed, setSeed] = useState(1)
  const key = `${n}-${p}-${method}`
  const exact = coverage(p, n, method)
  const run = () => {
    const rng = createRng(seed * 7919 + n)
    let hit = 0
    for (let r = 0; r < SIMS; r++) {
      let k = 0
      for (let i = 0; i < n; i++) if (rng() < p) k++
      const [lo, hi] = interval(k, n, method)
      if (lo <= p && p <= hi) hit++
    }
    setSim({ key, hit })
    setSeed(seed + 1)
  }
  return (
    <div>
      <Plot x={[0, 1]} y={[0.6, 1]} height={260} xLabel="本当の母比率 p" yLabel="実際の被覆確率" yTicks={[0.6, 0.7, 0.8, 0.9, 0.95, 1]}>
        <HLine y={0.95} color="c5" label="名目の信頼係数 0.95" />
        <Curve f={(q) => coverage(q, n, method === 'wald' ? 'wilson' : 'wald')} from={0.005} to={0.995} color="muted" width={1} samples={400} />
        <Curve f={(q) => coverage(q, n, method)} from={0.005} to={0.995} color="c1" width={1.8} samples={400} />
        <Points data={[{ x: p, y: exact }]} color="c2" r={7} opacity={1} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: method === 'wald' ? 'ワルド型（2級で学んだ式）' : 'ウィルソン型' },
          { color: 'muted', label: method === 'wald' ? 'ウィルソン型（比較用）' : 'ワルド型（比較用）' },
        ]}
      />
      <p className="figure-readout">
        n = {n}、p = {p.toFixed(2)}：正確な被覆確率 = <strong>{exact.toFixed(3)}</strong>
        {sim && sim.key === key && (
          <>
            　シミュレーション {SIMS} 回で含んだ割合 = <strong>{(sim.hit / SIMS).toFixed(3)}</strong>
          </>
        )}
      </p>
      <Controls>
        <Choice<Method>
          options={[
            { value: 'wald', label: 'ワルド型' },
            { value: 'wilson', label: 'ウィルソン型' },
          ]}
          value={method}
          onChange={setMethod}
        />
        <Button variant="primary" onClick={run}>
          この p で {SIMS} 回やってみる
        </Button>
      </Controls>
      <Controls>
        <Slider label="本当の p" value={p} min={0.02} max={0.98} step={0.01} onChange={setP} format={(v) => v.toFixed(2)} />
      </Controls>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={10} max={100} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}

/**
 * 指数分布の λ の信頼区間を、枢軸量 2λΣX ~ χ²(2n) から作る図。
 * 上：自由度 2n のカイ二乗分布の両側 2.5%。下：その2点を 2Σx で割った λ の区間。
 */
export function ExpPivot() {
  const [n, setN] = useState(5)
  const [total, setTotal] = useState(10)
  const df = 2 * n
  const lowerQ = chi2Quantile(0.025, df)
  const upperQ = chi2Quantile(0.975, df)
  const lo = lowerQ / (2 * total)
  const hi = upperQ / (2 * total)
  const lamHat = n / total
  const xMax = chi2Quantile(0.999, df)
  const yMax = chi2Pdf(Math.max(df - 2, 0.5), df) * 1.3
  const f = (x: number) => chi2Pdf(x, df)
  const xRange = Math.max(1, hi * 1.15)
  return (
    <div>
      <p className="figure-readout">枢軸量 2λΣX は自由度 {df} のカイ二乗分布に従う（λ がいくつでも同じ分布）</p>
      <Plot x={[0, xMax]} y={[0, yMax]} height={190} hideY>
        <Area f={f} from={0} to={lowerQ} color="c5" opacity={0.45} />
        <Area f={f} from={upperQ} to={xMax} color="c5" opacity={0.45} />
        <Curve f={f} color="c3" samples={300} />
        <Marker x={lowerQ} color="c5" label={lowerQ.toFixed(3)} anchor="end" labelY={yMax * 0.85} />
        <Marker x={upperQ} color="c5" label={upperQ.toFixed(3)} labelY={yMax * 0.85} />
      </Plot>
      <p className="figure-readout">
        {lowerQ.toFixed(3)} ≦ 2λ × {total} ≦ {upperQ.toFixed(3)}　→　<strong>{round(lo, 3)} ≦ λ ≦ {round(hi, 3)}</strong>
      </p>
      <Plot x={[0, xRange]} y={[0, 2]} height={110} hideY grid={false} xLabel="λ の 95% 信頼区間">
        <Segment x1={lo} y1={1} x2={hi} y2={1} color="c1" width={8} />
        <Marker x={lamHat} color="c2" from={0.5} to={1.5} dashed={false} />
        <Text x={lamHat} y={1.5} dy={-6} color="c2">
          最尤推定値 n/Σx = {round(lamHat, 3)}
        </Text>
      </Plot>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={2} max={30} step={1} onChange={setN} />
      </Controls>
      <Controls>
        <Slider label="合計 Σx" value={total} min={2} max={40} step={1} onChange={setTotal} />
      </Controls>
    </div>
  )
}
