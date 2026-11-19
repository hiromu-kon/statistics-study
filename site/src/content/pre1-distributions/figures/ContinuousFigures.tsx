import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { binData } from '../../../components/charts/common'
import { Bars, Curve, HLine, Legend, Plot, VLine } from '../../../components/charts/Plot'
import { betaPdf, cauchyPdf, chi2Pdf, createRng, gammaPdf, logNormalPdf, normalPdf, randomNormal, round } from '../../../lib/stats'
import { Polyline } from './parts'
import { randomCauchy, randomExp } from './random'

/** 曲線の山の高さ（図の縦軸を決めるため）。x = 0 付近で無限大になる形は cap で切る */
function peakOf(f: (x: number) => number, from: number, to: number, cap: number): number {
  let m = 0
  for (let i = 1; i <= 400; i++) {
    const v = f(from + ((to - from) * i) / 400)
    if (Number.isFinite(v)) m = Math.max(m, v)
  }
  return Math.min(cap, m)
}

/** ガンマ分布 Ga(k, θ)。形状 k で形が、尺度 θ で横の伸び方が変わる */
export function GammaExplorer() {
  const [k, setK] = useState(2)
  const [theta, setTheta] = useState(2)
  const xMax = 30
  const f = (x: number) => gammaPdf(x, k, theta)
  const yMax = peakOf(f, 0, xMax, 1.2) * 1.2
  const mean = k * theta
  const isChi2 = theta === 2
  const df = 2 * k
  return (
    <div>
      <Plot x={[0, xMax]} y={[0, yMax]} height={260} xLabel="x" hideY>
        {isChi2 && <Curve f={(x) => chi2Pdf(x, df)} color="c2" dashed width={4} samples={300} />}
        <Curve f={f} from={0.01} samples={300} />
        <VLine x={mean} color="c3" label={`平均 kθ = ${round(mean, 2)}`} />
      </Plot>
      {isChi2 && <Legend items={[{ color: 'c2', label: `θ = 2 なので χ²(${df}) と重なる（自由度 = 2k）` }]} />}
      <p className="figure-readout">
        平均 <M>{'k\\theta'}</M> = <strong>{round(mean, 2)}</strong>　分散 <M>{'k\\theta^2'}</M> = <strong>{round(k * theta * theta, 2)}</strong>
        <br />
        率（rate）で書くと λ = 1/θ = {round(1 / theta, 3)}：平均 k/λ、分散 k/λ² でも同じ値になる
      </p>
      <Controls>
        <Slider label="形状 k" value={k} min={0.5} max={10} step={0.5} onChange={setK} format={(v) => v.toFixed(1)} />
        <Slider label="尺度 θ" value={theta} min={0.5} max={3} step={0.25} onChange={setTheta} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

const SUM_SIMS = 3000
const SUM_MAX_K = 8
const SUM_U = (() => {
  const rng = createRng(21)
  return Array.from({ length: SUM_SIMS * SUM_MAX_K }, () => rng())
})()

/** 平均 2 分の待ち時間（指数分布）を k 個足したもののヒストグラムと、ガンマ分布 Ga(k, 2) の曲線 */
export function GammaSumSim() {
  const [k, setK] = useState(3)
  const theta = 2
  const sums: number[] = []
  for (let i = 0; i < SUM_SIMS; i++) {
    let s = 0
    for (let j = 0; j < k; j++) s += randomExp(() => SUM_U[i * SUM_MAX_K + j], theta)
    sums.push(s)
  }
  const width = 1
  const bars = binData(sums, 0, width, 40).map((b) => ({ x: b.x, y: b.y / (SUM_SIMS * width) }))
  const yMax = Math.max(...bars.map((b) => b.y), gammaPdf(Math.max(0.01, (k - 1) * theta), k, theta)) * 1.2
  return (
    <div>
      <Plot x={[0, 40]} y={[0, yMax]} height={250} xLabel={`${k} 人目が来るまでの時間（分）`} hideY>
        <Bars data={bars} width={width * 0.95} color="c1" opacity={0.45} />
        <Curve f={(x) => gammaPdf(x, k, theta)} from={0.01} color="c2" samples={300} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `平均 2 分の指数分布を ${k} 個足した値（${SUM_SIMS} 回）` },
          { color: 'c2', label: `ガンマ分布 Ga(${k}, 2)` },
        ]}
      />
      <Controls>
        <Slider label="足す個数 k" value={k} min={1} max={SUM_MAX_K} step={1} onChange={setK} />
      </Controls>
    </div>
  )
}

const BETA_PRESETS: { a: number; b: number; label: string }[] = [
  { a: 1, b: 1, label: '一様 (1, 1)' },
  { a: 2, b: 5, label: '(2, 5)' },
  { a: 5, b: 2, label: '(5, 2)' },
  { a: 5, b: 5, label: '(5, 5)' },
  { a: 0.5, b: 0.5, label: '(0.5, 0.5)' },
]

/** ベータ分布 Be(a, b)。0 から 1 の値だけをとる */
export function BetaExplorer() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(5)
  const f = (x: number) => betaPdf(x, a, b)
  const yMax = peakOf(f, 0.005, 0.995, 5) * 1.15
  const mean = a / (a + b)
  const variance = (a * b) / ((a + b) ** 2 * (a + b + 1))
  return (
    <div>
      <Plot x={[0, 1]} y={[0, Math.max(1.3, yMax)]} height={260} xLabel="x（割合・確率）" xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
        <Curve f={f} from={0.002} to={0.998} samples={300} />
        <VLine x={mean} color="c3" label={`平均 ${round(mean, 3)}`} />
      </Plot>
      <p className="figure-readout">
        平均 <M>{'\\frac{a}{a+b}'}</M> = <strong>{round(mean, 3)}</strong>　分散 <M>{'\\frac{ab}{(a+b)^2(a+b+1)}'}</M> = <strong>{round(variance, 4)}</strong>
        {a === 1 && b === 1 && <><br />a = b = 1 は高さ 1 の一様分布 U(0, 1)</>}
      </p>
      <Controls>
        {BETA_PRESETS.map((p) => (
          <Button key={p.label} variant={p.a === a && p.b === b ? 'primary' : 'default'} onClick={() => { setA(p.a); setB(p.b) }}>
            {p.label}
          </Button>
        ))}
      </Controls>
      <Controls>
        <Slider label="a" value={a} min={0.5} max={10} step={0.5} onChange={setA} format={(v) => v.toFixed(1)} />
        <Slider label="b" value={b} min={0.5} max={10} step={0.5} onChange={setB} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** 標準正規分布と標準コーシー分布の形。真ん中は似ているが、すそ（両はし）の厚さがまるで違う */
export function CauchyShape() {
  return (
    <div>
      <Plot x={[-8, 8]} y={[0, 0.45]} height={240} xTicks={[-8, -6, -4, -2, 0, 2, 4, 6, 8]} hideY>
        <Curve f={(x) => normalPdf(x)} color="c1" />
        <Curve f={(x) => cauchyPdf(x)} color="c5" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '標準正規分布 N(0, 1)' },
          { color: 'c5', label: '標準コーシー分布（= 自由度 1 の t 分布）' },
        ]}
      />
      <p className="figure-readout">
        |x| が 4 より大きくなる確率：正規分布は約 0.00006、コーシー分布は約 <strong>0.156</strong>
      </p>
    </div>
  )
}

const RUN_N = 1000

function runningMean(values: number[]): { x: number; y: number }[] {
  let s = 0
  return values.map((v, i) => {
    s += v
    return { x: i + 1, y: s / (i + 1) }
  })
}

/** 標本平均を n を増やしながら計算した線。正規分布は 0 に落ち着くが、コーシー分布はときどき大きく跳ねて落ち着かない */
export function CauchyMeanSim() {
  const [seed, setSeed] = useState(1)
  const rng = createRng(seed * 101)
  const cauchy: number[] = []
  const normal: number[] = []
  for (let i = 0; i < RUN_N; i++) {
    cauchy.push(randomCauchy(rng))
    normal.push(randomNormal(rng))
  }
  const cm = runningMean(cauchy)
  const nm = runningMean(normal)
  const clampY = (p: { x: number; y: number }) => ({ x: p.x, y: Math.max(-6, Math.min(6, p.y)) })
  return (
    <div>
      <Plot x={[0, RUN_N]} y={[-5, 5]} height={260} xLabel="標本の大きさ n" yLabel="標本平均">
        <HLine y={0} color="muted" />
        <Polyline points={nm.map(clampY)} color="c1" width={2} />
        <Polyline points={cm.map(clampY)} color="c5" width={2} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '正規分布から取った標本平均' },
          { color: 'c5', label: 'コーシー分布から取った標本平均' },
        ]}
      />
      <p className="figure-readout">
        n = {RUN_N} での標本平均：正規 <strong>{round(nm[RUN_N - 1].y, 3)}</strong>、コーシー <strong>{round(cm[RUN_N - 1].y, 3)}</strong>
        （図の外にはみ出した分は端で切っている）
      </p>
      <Controls>
        <Button onClick={() => setSeed(seed + 1)}>別の乱数でやり直す</Button>
      </Controls>
    </div>
  )
}

/** 対数正規分布 LN(μ, σ²)。log X が N(μ, σ²)。右にすそが長く、最頻値 < 中央値 < 平均 */
export function LogNormalExplorer() {
  const [mu, setMu] = useState(1)
  const [sigma, setSigma] = useState(0.6)
  const median = Math.exp(mu)
  const mean = Math.exp(mu + (sigma * sigma) / 2)
  const mode = Math.exp(mu - sigma * sigma)
  const xMax = Math.min(60, Math.exp(mu + 2.5 * sigma))
  const f = (x: number) => logNormalPdf(x, mu, sigma)
  const yMax = peakOf(f, 0.001, xMax, 10) * 1.25
  return (
    <div>
      <Plot x={[0, xMax]} y={[0, yMax]} height={260} xLabel="x" hideY>
        <Curve f={f} from={0.001} samples={400} />
        <VLine x={mode} color="muted" />
        <VLine x={median} color="c3" />
        <VLine x={mean} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: `最頻値 e^(μ−σ²) = ${round(mode, 2)}` },
          { color: 'c3', label: `中央値 e^μ = ${round(median, 2)}` },
          { color: 'c2', label: `平均 e^(μ+σ²/2) = ${round(mean, 2)}` },
        ]}
      />
      <p className="figure-readout">
        平均 ÷ 中央値 = <M>{'e^{\\sigma^2/2}'}</M> = <strong>{round(mean / median, 3)}</strong>。σ を大きくすると、すそが伸びて平均だけが右へ離れていく
      </p>
      <Controls>
        <Slider label="μ（log X の平均）" value={mu} min={0} max={2} step={0.1} onChange={(v) => setMu(round(v, 1))} format={(v) => v.toFixed(1)} />
        <Slider label="σ（log X の標準偏差）" value={sigma} min={0.1} max={1.2} step={0.05} onChange={(v) => setSigma(round(v, 2))} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
