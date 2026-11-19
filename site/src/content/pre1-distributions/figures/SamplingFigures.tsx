import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { binData } from '../../../components/charts/common'
import { Area, Bars, Curve, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { betaPdf, chi2Pdf, chi2Quantile, createRng, round, tPdf, tQuantile } from '../../../lib/stats'
import { ncChi2Pdf, ncChi2Sf, ncTPdf, ncTSf } from './noncentral'
import { Choice, RelationDiagram, type DiagramEdge, type DiagramNode } from './parts'

const FAMILY_NODES: Record<string, DiagramNode> = {
  normal: { label: 'N(0, 1)', x: 280, y: 36 },
  chi2: { label: 'χ²(m)', x: 95, y: 140 },
  t: { label: 't(m)', x: 280, y: 140 },
  cauchy: { label: 'コーシー', x: 465, y: 140 },
  gamma: { label: 'ガンマ', x: 95, y: 250 },
  f: { label: 'F(m, n)', x: 280, y: 250 },
  beta: { label: 'ベータ', x: 465, y: 250 },
}

const FAMILY_EDGES: DiagramEdge[] = [
  { from: 'normal', to: 'chi2', label: 'm 個の2乗の和', dy: -10, dx: -18 },
  { from: 'normal', to: 't', label: 'Z ÷ √(χ²/m)' },
  { from: 'chi2', to: 't', label: '' },
  { from: 't', to: 'cauchy', label: 'm = 1' },
  { from: 'chi2', to: 'f', label: '2つの比', dy: 16, dx: -10 },
  { from: 't', to: 'f', label: '2乗すると F(1, m)' },
  { from: 'chi2', to: 'gamma', label: 'Ga(m/2, 2) と同じ', dashed: true },
  { from: 'f', to: 'beta', label: 'mF/(mF + n)' },
]

/** 標準正規分布から t・χ²・F 分布を作る道筋と、ほかの分布とのつながり */
export function SamplingFamily() {
  return <RelationDiagram nodes={FAMILY_NODES} edges={FAMILY_EDGES} height={285} ariaLabel="標本分布どうしの関係図" />
}

function NcChi2() {
  const [m, setM] = useState(3)
  const [lambda, setLambda] = useState(6)
  const c = chi2Quantile(0.95, m)
  const power = ncChi2Sf(c, m, lambda)
  const xMax = 40
  const yMax = m <= 2 ? 0.5 : chi2Pdf(m - 2, m) * 1.3
  return (
    <>
      <Plot x={[0, xMax]} y={[0, yMax]} height={250} xLabel="検定統計量の値" hideY>
        <Area f={(x) => ncChi2Pdf(x, m, lambda)} from={c} to={xMax} color="c2" opacity={0.35} />
        <Area f={(x) => chi2Pdf(x, m)} from={c} to={xMax} color="c5" opacity={0.5} />
        <Curve f={(x) => chi2Pdf(x, m)} from={0.05} color="muted" dashed samples={300} />
        <Curve f={(x) => ncChi2Pdf(x, m, lambda)} from={0.05} color="c1" samples={300} />
        <VLine x={c} color="c5" label={`棄却の境目 ${round(c, 3)}`} />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: `帰無仮説が正しいとき：χ²(${m})` },
          { color: 'c1', label: `対立仮説が正しいとき：非心 χ²(${m}, λ = ${lambda})` },
        ]}
      />
      <p className="figure-readout">
        有意水準（赤）= 0.05　検出力（オレンジ）= <strong>{round(power, 3)}</strong>
        <br />
        非心 χ² の平均 m + λ = {m + lambda}、分散 2(m + 2λ) = {2 * (m + 2 * lambda)}
      </p>
      <Controls>
        <Slider label="自由度 m" value={m} min={1} max={10} step={1} onChange={setM} />
        <Slider label="非心度 λ" value={lambda} min={0} max={20} step={1} onChange={setLambda} />
      </Controls>
    </>
  )
}

function NcT() {
  const [n, setN] = useState(16)
  const [effect, setEffect] = useState(0.5)
  const df = n - 1
  const delta = effect * Math.sqrt(n)
  const c = tQuantile(0.95, df)
  const power = ncTSf(c, df, delta)
  return (
    <>
      <Plot x={[-4, 9]} y={[0, 0.45]} height={250} xLabel="t 統計量の値" hideY xTicks={[-4, -2, 0, 2, 4, 6, 8]}>
        <Area f={(x) => ncTPdf(x, df, delta)} from={c} to={9} color="c2" opacity={0.35} samples={80} />
        <Area f={(x) => tPdf(x, df)} from={c} to={9} color="c5" opacity={0.5} />
        <Curve f={(x) => tPdf(x, df)} color="muted" dashed />
        <Curve f={(x) => ncTPdf(x, df, delta)} color="c1" samples={120} />
        <VLine x={c} color="c5" label={`棄却の境目 ${round(c, 3)}`} />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: `帰無仮説が正しいとき：t(${df})` },
          { color: 'c1', label: `対立仮説が正しいとき：非心 t(${df}, δ = ${round(delta, 2)})` },
        ]}
      />
      <p className="figure-readout">
        片側検定・有意水準 0.05。δ = (μ − μ₀)/σ × √n = {effect} × √{n} = {round(delta, 2)}
        <br />
        検出力（オレンジの面積）= <strong>{round(power, 3)}</strong>
      </p>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={4} max={40} step={1} onChange={setN} />
        <Slider label="ずれの大きさ (μ − μ₀)/σ" value={effect} min={0} max={1.5} step={0.1} onChange={(v) => setEffect(round(v, 1))} format={(v) => v.toFixed(1)} />
      </Controls>
    </>
  )
}

/** 帰無仮説のもとの分布（中心）と、対立仮説のもとの分布（非心）。境目より右の面積が検出力 */
export function NoncentralExplorer() {
  const [kind, setKind] = useState<'chi2' | 't'>('t')
  return (
    <div>
      <Controls>
        <Choice
          options={[
            { value: 't' as const, label: '非心 t 分布（t 検定）' },
            { value: 'chi2' as const, label: '非心 χ² 分布' },
          ]}
          value={kind}
          onChange={setKind}
        />
      </Controls>
      {kind === 't' ? <NcT /> : <NcChi2 />}
    </div>
  )
}

const ORDER_SIMS = 2000
const ORDER_MAX_N = 20
const ORDER_U = (() => {
  const rng = createRng(41)
  return Array.from({ length: ORDER_SIMS * ORDER_MAX_N }, () => rng())
})()

/** 一様分布 U(0, 1) から n 個取って小さい順に並べたときの k 番目。ヒストグラムはベータ分布 Be(k, n − k + 1) に重なる */
export function OrderStatExplorer() {
  const [n, setN] = useState(5)
  const [k, setK] = useState(5)
  const kk = Math.min(k, n)
  const values: number[] = []
  let first: number[] = []
  for (let i = 0; i < ORDER_SIMS; i++) {
    const sample = ORDER_U.slice(i * ORDER_MAX_N, i * ORDER_MAX_N + n).sort((a, b) => a - b)
    if (i === 0) first = sample
    values.push(sample[kk - 1])
  }
  const width = 0.025
  const bars = binData(values, 0, width, 40).map((b) => ({ x: b.x, y: b.y / (ORDER_SIMS * width) }))
  const a = kk
  const b = n - kk + 1
  let peak = 0
  for (let i = 1; i < 200; i++) peak = Math.max(peak, betaPdf(i / 200, a, b))
  const yMax = Math.max(peak, ...bars.map((d) => d.y)) * 1.15
  return (
    <div>
      <Plot x={[0, 1]} y={[0, 1]} height={90} hideY grid={false} xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
        <Segment x1={0} y1={0.5} x2={1} y2={0.5} color="muted" />
        <Points data={first.map((x, i) => ({ x, y: 0.5, color: i === kk - 1 ? 'c2' : 'c1' }))} r={6} opacity={0.85} />
      </Plot>
      <p className="figure-readout">1回目の {n} 個（オレンジが小さいほうから {kk} 番目）</p>
      <Plot x={[0, 1]} y={[0, yMax]} height={250} xLabel={`小さいほうから ${kk} 番目の値`} hideY xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
        <Bars data={bars} width={width * 0.95} color="c1" opacity={0.45} />
        <Curve f={(x) => betaPdf(x, a, b)} from={0.002} to={0.998} color="c2" samples={300} />
        <VLine x={kk / (n + 1)} color="c3" label={`平均 k/(n+1) = ${round(kk / (n + 1), 3)}`} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `${ORDER_SIMS} 回くり返したときの k 番目の値` },
          { color: 'c2', label: `ベータ分布 Be(${a}, ${b})` },
        ]}
      />
      <p className="figure-readout">
        k = n は最大値（密度 <M>{'nx^{n-1}'}</M>）、k = 1 は最小値（密度 <M>{'n(1-x)^{n-1}'}</M>）
      </p>
      <Controls>
        <Slider label="個数 n" value={n} min={1} max={ORDER_MAX_N} step={1} onChange={setN} />
        <Slider label="小さいほうから k 番目" value={kk} min={1} max={n} step={1} onChange={setK} />
      </Controls>
    </div>
  )
}
