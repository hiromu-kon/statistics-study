import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, HLine, Legend, Plot, Points } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Choice, Line } from '../../collection/figures/svg'
import { N, acf, ar1, noiseSeries, pacfFromAcf, theoreticalAcf, type ModelKind } from './series'

const eps = noiseSeries(N, 7)
const toPts = (xs: number[]) => xs.map((y, x) => ({ x, y }))
const LAGS = 15

/** AR(1) の φ を動かして、系列の見た目と自己相関 φ^k の形がどう変わるかを見る */
export function Ar1Explorer() {
  const [phi, setPhi] = useState(0.7)
  const xs = ar1(phi, eps)
  const stationary = Math.abs(phi) < 1
  const lim = Math.max(4, ...xs.map(Math.abs)) * 1.05
  const sample = Array.from({ length: LAGS }, (_, i) => ({ x: i + 1, y: acf(xs, i + 1) }))
  const theory = Array.from({ length: LAGS }, (_, i) => ({ x: i + 1, y: phi ** (i + 1) }))
  return (
    <div>
      <Plot x={[-1, N]} y={[-lim, lim]} height={190} xTicks={[0, 30, 60, 90, 119]} xLabel="時点 t" yLabel="x_t">
        <HLine y={0} color="muted" />
        <Line data={toPts(xs)} color="c1" width={1.6} />
      </Plot>
      <Plot x={[0, LAGS + 1]} y={[-1, 1]} height={190} xTicks={[1, 5, 10, 15]} yTicks={[-1, -0.5, 0, 0.5, 1]} xLabel="ラグ k" yLabel="自己相関">
        <HLine y={0} color="muted" dashed={false} />
        <Bars data={sample} width={0.55} color="c1" opacity={0.6} />
        {stationary && <Points data={theory} r={4.5} color="c2" opacity={1} />}
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '左の系列から計算した標本自己相関' },
          { color: 'c2', label: '理論の自己相関 φ^k（定常のときだけ）' },
        ]}
      />
      <Controls>
        <Slider label="φ（1期前の値をどれだけ引き継ぐか）" value={phi} min={-0.95} max={1} step={0.05} onChange={setPhi} format={(v) => v.toFixed(2)} />
      </Controls>
      {stationary ? (
        <p className="figure-readout">
          |φ| &lt; 1 なので<strong>定常</strong>。分散 = σ² / (1 − φ²) = <strong>{round(1 / (1 - phi * phi), 2)}</strong>（σ² = 1）、ρ₁ = {round(phi, 2)}、ρ₂ = {round(phi ** 2, 2)}、ρ₃ = {round(phi ** 3, 2)}
          {phi < 0 && '。φ が負なので、自己相関は + と − を交互にくり返しながら小さくなる'}
        </p>
      ) : (
        <p className="figure-readout">
          φ = 1 は<strong style={{ color: 'var(--c5)' }}>ランダムウォーク（単位根）</strong>で定常ではない。標本自己相関は 1 に近い値から、ゆっくりとしか下がらない
        </p>
      )}
    </div>
  )
}

const MODELS: Record<ModelKind, { label: string; note: string }> = {
  ar1pos: { label: 'AR(1) φ = 0.7', note: '自己相関は 0.7, 0.49, 0.34, … と指数的に減衰。偏自己相関はラグ1だけで、ラグ2から先は 0（切断）' },
  ar1neg: { label: 'AR(1) φ = −0.7', note: '自己相関は符号を交互に変えながら減衰。偏自己相関はやはりラグ1だけ' },
  ar2: { label: 'AR(2) φ₁ = 0.5, φ₂ = 0.3', note: '自己相関はゆっくり減衰。偏自己相関はラグ2まであって、ラグ3から先は 0（ラグ2の値は φ₂ = 0.3）' },
  ma1: { label: 'MA(1) θ = 0.8', note: '自己相関はラグ1（= 0.8/1.64 ≈ 0.49）だけで、ラグ2から先は 0（切断）。偏自己相関は符号を変えながら減衰' },
  arma11: { label: 'ARMA(1,1) φ = 0.7, θ = 0.5', note: '自己相関も偏自己相関も、どちらも切断せずに減衰する。こうなると AR と MA の両方を考える' },
}

/** 理論上の自己相関と偏自己相関を並べ、モデルの次数を見分けるパターンを見せる */
export function AcfPacfPatterns() {
  const [kind, setKind] = useState<ModelKind>('ar1pos')
  const rho = theoreticalAcf(kind, 10)
  const pacf = pacfFromAcf(rho)
  const lagPlot = (values: number[], label: string, color: 'c1' | 'c2') => (
    <Plot x={[0, 11]} y={[-1, 1]} height={170} xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} yTicks={[-1, -0.5, 0, 0.5, 1]} xLabel="ラグ k" yLabel={label}>
      <HLine y={0} color="muted" dashed={false} />
      <Bars data={values.map((y, i) => ({ x: i + 1, y: Math.abs(y) < 1e-9 ? 0 : y }))} width={0.5} color={color} />
    </Plot>
  )
  return (
    <div>
      <Choice options={(Object.keys(MODELS) as ModelKind[]).map((v) => ({ value: v, label: MODELS[v].label }))} value={kind} onChange={setKind} />
      {lagPlot(rho, '自己相関 ρ_k', 'c1')}
      {lagPlot(pacf, '偏自己相関 φ_kk', 'c2')}
      <p className="figure-readout">{MODELS[kind].note}</p>
    </div>
  )
}

/** AR(1) の予測：先へ行くほど予測値は平均に戻り、予測の幅は広がって系列の標準偏差の幅に近づく */
export function ForecastFan() {
  const [phi, setPhi] = useState(0.8)
  const mu = 50
  const sigma = 2
  const past = 40
  const H = 20
  const xs = ar1(phi, noiseSeries(past, 23)).map((x) => mu + sigma * x)
  const last = xs[past - 1]
  const fc = Array.from({ length: H + 1 }, (_, h) => {
    const m = mu + phi ** h * (last - mu)
    const v = Math.abs(phi) < 1 ? (sigma ** 2 * (1 - phi ** (2 * h))) / (1 - phi * phi) : sigma ** 2 * h
    return { x: past - 1 + h, m, lo: m - 1.96 * Math.sqrt(v), hi: m + 1.96 * Math.sqrt(v) }
  })
  const yLo = Math.floor(Math.min(36, ...xs, ...fc.map((d) => d.lo)) / 5) * 5
  const yHi = Math.ceil(Math.max(64, ...xs, ...fc.map((d) => d.hi)) / 5) * 5
  return (
    <div>
      <Plot x={[0, past + H]} y={[yLo, yHi]} height={260} xTicks={[0, 10, 20, 30, 39, 50, 59]} xLabel="時点（39 が最後の観測）" yLabel="x_t">
        <HLine y={mu} color="muted" label="平均 μ = 50" />
        <Line data={toPts(xs)} color="c1" width={1.8} dots />
        <Line data={fc.map((d) => ({ x: d.x, y: d.hi }))} color="c2" width={1.8} dashed />
        <Line data={fc.map((d) => ({ x: d.x, y: d.lo }))} color="c2" width={1.8} dashed />
        <Line data={fc.map((d) => ({ x: d.x, y: d.m }))} color="c2" width={3} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '観測した系列' },
          { color: 'c2', label: '予測値と 95% 予測区間' },
        ]}
      />
      <Controls>
        <Slider label="φ" value={phi} min={0} max={1} step={0.05} onChange={setPhi} format={(v) => v.toFixed(2)} />
      </Controls>
      <p className="figure-readout">
        最後の値 {round(last, 1)} → 1期先 {round(fc[1].m, 1)}、5期先 {round(fc[5].m, 1)}、20期先 {round(fc[20].m, 1)}。
        {phi < 1 ? ' φ が小さいほど早く平均 50 に戻り、予測区間の幅も早く一定になる' : ' φ = 1（ランダムウォーク）では予測値は最後の値のまま。予測区間は √h に比例して広がり続ける'}
      </p>
    </div>
  )
}
