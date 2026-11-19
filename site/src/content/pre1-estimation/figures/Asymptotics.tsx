import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { binData } from '../../../components/charts/common'
import { Bars, Curve, HLine, Legend, Plot } from '../../../components/charts/Plot'
import { createRng, mean, normalPdf, round, sd } from '../../../lib/stats'
import { Choice, Marker } from '../../sampling/figures/parts'

const P_HAT = 0.3
const HALF_95 = (1.96 * 1.96) / 2

/**
 * ベルヌーイ分布（表の割合 0.3）の対数尤度を、頂上の値が 0 になるようにずらして描く図。
 * n が大きいほど頂上のまわりが急に曲がる（＝フィッシャー情報量 nI(p) が大きい）。
 * 点線は頂上のまわりの2次式の近似 −nI(p̂)(p − p̂)²/2。
 */
export function LogLikCurvature() {
  const [n, setN] = useState(30)
  const k = P_HAT * n
  const ell = (p: number) => k * Math.log(p / P_HAT) + (n - k) * Math.log((1 - p) / (1 - P_HAT))
  const info = n / (P_HAT * (1 - P_HAT))
  const quad = (p: number) => (-info * (p - P_HAT) ** 2) / 2
  const se = 1 / Math.sqrt(info)
  return (
    <div>
      <Plot x={[0.02, 0.7]} y={[-5, 0.4]} height={260} xLabel="p" yLabel="log L(p) − log L(p̂)">
        <HLine y={-HALF_95} color="muted" label="−1.96²/2 ≒ −1.92" />
        <Curve f={quad} color="c2" dashed width={2} />
        <Curve f={ell} color="c1" samples={300} />
        <Marker x={P_HAT} color="ink" label="p̂ = 0.3" labelY={0.25} />
        <Marker x={P_HAT - 1.96 * se} color="c3" from={-5} to={-HALF_95} />
        <Marker x={P_HAT + 1.96 * se} color="c3" from={-5} to={-HALF_95} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '対数尤度（頂上を 0 にそろえた）' },
          { color: 'c2', label: '頂上のまわりの2次式の近似' },
          { color: 'c3', label: 'p̂ ± 1.96 × 標準誤差' },
        ]}
      />
      <p className="figure-readout">
        n = {n}：曲がり具合 nI(p̂) = n/(p̂(1 − p̂)) = <strong>{round(info, 1)}</strong>　→　標準誤差 1/√(nI) = <strong>{round(se, 4)}</strong>
      </p>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={10} max={400} step={10} onChange={setN} />
      </Controls>
    </div>
  )
}

const LAMBDA = 2
const REPS = 3000
type Size = 5 | 10 | 30 | 100

/**
 * 指数分布（λ = 2）から n 個とって最尤推定値 λ̂ = 1/x̄ を計算する、を 3000 回くり返したヒストグラム。
 * n が大きくなると、正規分布 N(λ, λ²/n)（点線）に近づく。
 */
export function MleAsymptotic() {
  const [n, setN] = useState<Size>(10)
  const [seed, setSeed] = useState(1)
  const est = useMemo(() => {
    const rng = createRng(seed * 211 + n)
    return Array.from({ length: REPS }, () => {
      const xs = Array.from({ length: n }, () => -Math.log(1 - rng()) / LAMBDA)
      return 1 / mean(xs)
    })
  }, [n, seed])
  const width = 0.1
  const bars = binData(est, 0, width, 60).map((b) => ({ x: b.x, y: b.y / (REPS * width) }))
  const asd = LAMBDA / Math.sqrt(n)
  const yMax = Math.max(normalPdf(LAMBDA, LAMBDA, asd), ...bars.map((b) => b.y)) * 1.15
  return (
    <div>
      <Plot x={[0, 6]} y={[0, yMax]} height={240} hideY xLabel="最尤推定値 λ̂ = 1/x̄（本当の λ = 2）">
        <Bars data={bars} width={width} color="c1" opacity={0.6} />
        <Curve f={(x) => normalPdf(x, LAMBDA, asd)} color="c2" dashed samples={300} />
        <Marker x={LAMBDA} color="ink" dashed={false} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `λ̂ のヒストグラム（${REPS} 回）` },
          { color: 'c2', label: '漸近分布 N(λ, λ²/n)' },
        ]}
      />
      <p className="figure-readout">
        λ̂ の平均 {round(mean(est), 3)}・標準偏差 {round(sd(est), 3)}　／　漸近理論の標準偏差 λ/√n = <strong>{round(asd, 3)}</strong>
      </p>
      <Controls>
        <Choice<Size>
          options={[
            { value: 5, label: 'n = 5' },
            { value: 10, label: 'n = 10' },
            { value: 30, label: 'n = 30' },
            { value: 100, label: 'n = 100' },
          ]}
          value={n}
          onChange={setN}
        />
        <Button onClick={() => setSeed(seed + 1)}>やり直す</Button>
      </Controls>
    </div>
  )
}

/** 正規分布どうしのカルバック・ライブラー情報量 D(N(m1, s1²) ‖ N(m2, s2²)) */
const klNormal = (m1: number, s1: number, m2: number, s2: number) =>
  Math.log(s2 / s1) + (s1 * s1 + (m1 - m2) ** 2) / (2 * s2 * s2) - 0.5

/**
 * 標準正規分布 p = N(0, 1) と、動かせる正規分布 q = N(m, s²) のカルバック・ライブラー情報量。
 * 2つが重なると 0、ずれるほど大きい。D(p‖q) と D(q‖p) は一般に等しくない。
 */
export function KlDivergence() {
  const [m, setM] = useState(1)
  const [s, setS] = useState(1)
  const dpq = klNormal(0, 1, m, s)
  const dqp = klNormal(m, s, 0, 1)
  return (
    <div>
      <Plot x={[-5, 6]} y={[0, 0.85]} height={220} hideY xLabel="x">
        <Curve f={(x) => normalPdf(x, 0, 1)} color="c1" samples={300} />
        <Curve f={(x) => normalPdf(x, m, s)} color="c2" samples={300} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'p = N(0, 1)（本当の分布とする）' },
          { color: 'c2', label: `q = N(${m.toFixed(1)}, ${s.toFixed(2)}²)（モデル）` },
        ]}
      />
      <p className="figure-readout">
        D(p‖q) = <strong>{round(dpq, 3)}</strong>　　D(q‖p) = <strong>{round(dqp, 3)}</strong>
        {Math.abs(dpq - dqp) > 0.0005 ? '（向きを変えると値が変わる）' : ''}
      </p>
      <Controls>
        <Slider label="q の平均 m" value={m} min={-3} max={3} step={0.1} onChange={setM} format={(v) => v.toFixed(1)} />
      </Controls>
      <Controls>
        <Slider label="q の標準偏差 s" value={s} min={0.5} max={2.5} step={0.05} onChange={setS} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
