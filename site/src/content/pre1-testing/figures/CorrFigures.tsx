import { useMemo, useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { binData } from '../../../components/charts/common'
import { Area, Bars, Curve, Label, Plot, VLine } from '../../../components/charts/Plot'
import { correlation, createRng, logGamma, normalPdf, randomNormal, round, tQuantile } from '../../../lib/stats'

/** ρ = 0 の2変量正規分布から n 組とったときの標本相関係数 r の密度 */
function rNullPdf(r: number, n: number): number {
  if (Math.abs(r) >= 1) return 0
  const logB = logGamma(0.5) + logGamma((n - 2) / 2) - logGamma((n - 1) / 2)
  return Math.exp(((n - 4) / 2) * Math.log(1 - r * r) - logB)
}

/**
 * 母相関 0 のとき r がどれくらいばらつくか。両側 5% の境目 r* を t 分布から逆算して塗る。
 * n が小さいと、かなり大きな r でも偶然で出てしまうことが見える。
 */
export function CorrNullDemo() {
  const [n, setN] = useState(20)
  const t = tQuantile(0.975, n - 2)
  const rc = t / Math.sqrt(n - 2 + t * t)
  const f = (r: number) => rNullPdf(r, n)
  const yMax = f(0) * 1.25
  return (
    <div>
      <Plot x={[-1, 1]} y={[0, yMax]} hideY xTicks={[-1, -0.5, 0, 0.5, 1]} xLabel="標本相関係数 r（母相関 ρ = 0 のとき）">
        <Area f={f} from={-1} to={-rc} color="c5" opacity={0.45} />
        <Area f={f} from={rc} to={1} color="c5" opacity={0.45} />
        <Curve f={f} color="c1" samples={300} />
        <VLine x={rc} color="c5" label={`r* = ${round(rc, 3)}`} />
        <VLine x={-rc} color="c5" />
      </Plot>
      <p className="figure-readout">
        n = {n} なら |r| が <strong>{round(rc, 3)}</strong> を超えたとき両側 5% で「ρ = 0」を棄却（t<sub>0.025</sub>({n - 2}) = {round(t, 3)} から逆算）
      </p>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={5} max={100} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}

const REPS = 2000
const SIZE = 20

function simulateR(rho: number): number[] {
  const rng = createRng(11)
  const rs: number[] = []
  for (let k = 0; k < REPS; k++) {
    const xs: number[] = []
    const ys: number[] = []
    for (let i = 0; i < SIZE; i++) {
      const x = randomNormal(rng)
      const e = randomNormal(rng)
      xs.push(x)
      ys.push(rho * x + Math.sqrt(1 - rho * rho) * e)
    }
    rs.push(correlation(xs, ys))
  }
  return rs
}

/**
 * フィッシャーの z 変換。ρ が 0 から離れると r の分布は片側に詰まって歪むが、
 * z = artanh r にすると左右対称に近く、幅（分散 1/(n − 3)）も ρ によらなくなる。
 */
export function FisherZDemo() {
  const [rho, setRho] = useState(0.6)
  const rs = useMemo(() => simulateR(rho), [rho])
  const zs = rs.map((r) => Math.atanh(Math.min(0.999999, Math.max(-0.999999, r))))
  const wr = 0.05
  const wz = 0.1
  const rBars = binData(rs, -1, wr, 40).map((b) => ({ x: b.x, y: b.y / (REPS * wr) }))
  const zBars = binData(zs, -1.5, wz, 40).map((b) => ({ x: b.x, y: b.y / (REPS * wz) }))
  const rTop = Math.max(...rBars.map((b) => b.y)) * 1.2
  const zTop = Math.max(...zBars.map((b) => b.y), 1.7) * 1.2
  const zMean = Math.atanh(rho)
  const zSd = 1 / Math.sqrt(SIZE - 3)
  return (
    <div>
      <Plot x={[-1, 1]} y={[0, rTop]} hideY height={200} xTicks={[-1, -0.5, 0, 0.5, 1]} xLabel="標本相関係数 r">
        <Bars data={rBars} width={wr * 0.9} color="c1" />
        <Label x={-0.95} y={rTop * 0.85} anchor="start">
          r の分布（{rho > 0.3 ? '右に詰まって左に裾が長い' : 'ほぼ左右対称'}）
        </Label>
      </Plot>
      <Plot x={[-1.5, 2.5]} y={[0, zTop]} hideY height={200} xTicks={[-1, 0, 1, 2]} xLabel="z = artanh r">
        <Bars data={zBars} width={wz * 0.9} color="c3" />
        <Curve f={(z) => normalPdf(z, zMean, zSd)} color="ink" />
        <Label x={-1.45} y={zTop * 0.85} anchor="start">
          z の分布と N(artanh ρ, 1/17)
        </Label>
      </Plot>
      <p className="figure-readout">
        n = {SIZE} の標本を {REPS} 回とった結果。z の平均の目安 artanh {rho.toFixed(1)} = {round(zMean, 3)}、標準偏差 1/√17 ≒ {round(zSd, 3)}
      </p>
      <Controls>
        <Slider label="母相関係数 ρ" value={rho} min={0} max={0.9} step={0.1} onChange={setRho} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
