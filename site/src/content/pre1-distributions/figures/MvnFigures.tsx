import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Curve, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { createRng, normalPdf, randomNormal, round } from '../../../lib/stats'
import { Polyline } from './parts'

// 標準正規分布の独立な組。どの図でも同じ組を変換して使い、パラメータを動かしても「同じ偶然」のまま形だけが変わるようにする
const Z_PAIRS = (() => {
  const rng = createRng(31)
  return Array.from({ length: 300 }, () => [randomNormal(rng), randomNormal(rng)] as const)
})()

const fmt = (v: number) => String(round(v, 2))

/** 2×2 行列の TeX */
function matTex(a: number, b: number, c: number, d: number): string {
  return `\\begin{pmatrix} ${fmt(a)} & ${fmt(b)} \\\\ ${fmt(c)} & ${fmt(d)} \\end{pmatrix}`
}

/** 分散共分散行列 Σ のコレスキー分解 L（Σ = L Lᵀ）で、円を楕円に、独立な組を相関のある組に変える */
function transform(s1: number, s2: number, rho: number, z1: number, z2: number) {
  return { x: s1 * z1, y: s2 * (rho * z1 + Math.sqrt(1 - rho * rho) * z2) }
}

function ellipse(s1: number, s2: number, rho: number, c: number) {
  return Array.from({ length: 121 }, (_, i) => {
    const t = (2 * Math.PI * i) / 120
    return transform(s1, s2, rho, c * Math.cos(t), c * Math.sin(t))
  })
}

/** 2変量正規分布の等高線。等高線は「マハラノビス距離が一定」の楕円 */
export function MvnContour() {
  const [rho, setRho] = useState(0.6)
  const [s1, setS1] = useState(1)
  const [s2, setS2] = useState(1)
  const cov = rho * s1 * s2
  const det = s1 * s1 * s2 * s2 * (1 - rho * rho)
  const pts = Z_PAIRS.map(([z1, z2]) => transform(s1, s2, rho, z1, z2))
  const slope = (rho * s2) / s1
  return (
    <div>
      <Plot x={[-4.5, 4.5]} y={[-4.5, 4.5]} width={420} height={400} xLabel="X₁" xTicks={[-4, -2, 0, 2, 4]} yTicks={[-4, -2, 0, 2, 4]}>
        <Points data={pts} color="muted" r={2.5} opacity={0.45} />
        <Polyline points={ellipse(s1, s2, rho, 1)} color="c1" width={2.5} />
        <Polyline points={ellipse(s1, s2, rho, 2)} color="c1" width={1.8} dashed />
        <Segment x1={-4.5} y1={-4.5 * slope} x2={4.5} y2={4.5 * slope} color="c3" width={2} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '内側の楕円：マハラノビス距離 1（中に入る確率 0.393）' },
          { color: 'c1', label: '点線：距離 2（0.865）' },
          { color: 'c3', label: 'X₁ を決めたときの X₂ の平均（回帰直線）' },
        ]}
      />
      <p className="figure-readout">
        <M>{`\\Sigma = ${matTex(s1 * s1, cov, cov, s2 * s2)}`}</M>　<M>{`|\\Sigma| = ${fmt(det)}`}</M>
      </p>
      <Controls>
        <Slider label="相関係数 ρ" value={rho} min={-0.95} max={0.95} step={0.05} onChange={(v) => setRho(round(v, 2))} format={(v) => v.toFixed(2)} />
        <Slider label="X₁ の標準偏差 σ₁" value={s1} min={0.5} max={2} step={0.1} onChange={(v) => setS1(round(v, 1))} format={(v) => v.toFixed(1)} />
        <Slider label="X₂ の標準偏差 σ₂" value={s2} min={0.5} max={2} step={0.1} onChange={(v) => setS2(round(v, 1))} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** X₁ = x と分かったときの X₂ の分布（条件つき分布）と、何も分からないときの X₂ の分布（周辺分布） */
export function ConditionalSlice() {
  const [rho, setRho] = useState(0.7)
  const [x0, setX0] = useState(1.5)
  const condMean = rho * x0
  const condSd = Math.sqrt(1 - rho * rho)
  const pts = Z_PAIRS.map(([z1, z2]) => transform(1, 1, rho, z1, z2))
  const near = pts.filter((p) => Math.abs(p.x - x0) < 0.25)
  return (
    <div>
      <Plot x={[-3.5, 3.5]} y={[-3.5, 3.5]} width={420} height={330} xLabel="X₁" xTicks={[-3, -2, -1, 0, 1, 2, 3]} yTicks={[-3, -2, -1, 0, 1, 2, 3]}>
        <Points data={pts} color="muted" r={2.5} opacity={0.35} />
        <Points data={near} color="c2" r={3.5} opacity={0.9} />
        <Polyline points={ellipse(1, 1, rho, 1)} color="c1" width={2} />
        <VLine x={x0} color="c2" />
        <Points data={[{ x: x0, y: condMean }]} color="c3" r={6} opacity={1} />
      </Plot>
      <Plot x={[-3.5, 3.5]} y={[0, 1.4]} width={420} height={200} xLabel="X₂" xTicks={[-3, -2, -1, 0, 1, 2, 3]} hideY>
        <Curve f={(y) => normalPdf(y)} color="muted" dashed />
        <Curve f={(y) => normalPdf(y, condMean, condSd)} color="c2" samples={300} />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: '周辺分布 N(0, 1)（X₁ を知らないとき）' },
          { color: 'c2', label: `条件つき分布 N(${fmt(condMean)}, ${fmt(condSd * condSd)})（X₁ = ${fmt(x0)} と分かったとき）` },
        ]}
      />
      <p className="figure-readout">
        条件つき平均 <M>{'\\rho x'}</M> = <strong>{fmt(condMean)}</strong>　条件つき分散 <M>{'1 - \\rho^2'}</M> = <strong>{fmt(condSd * condSd)}</strong>（x を動かしても変わらない）
        <br />
        上の図のオレンジの点は、X₁ が {fmt(x0)} の近く（±0.25）にあった {near.length} 組
      </p>
      <Controls>
        <Slider label="相関係数 ρ" value={rho} min={-0.95} max={0.95} step={0.05} onChange={(v) => setRho(round(v, 2))} format={(v) => v.toFixed(2)} />
        <Slider label="分かった X₁ の値 x" value={x0} min={-2.5} max={2.5} step={0.1} onChange={(v) => setX0(round(v, 1))} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

const PRESETS: { label: string; m: [number, number, number, number] }[] = [
  { label: 'そのまま', m: [1, 0, 0, 1] },
  { label: '和と差', m: [1, 1, 1, -1] },
  { label: '横に2倍', m: [2, 0, 0, 1] },
  { label: '45°回転', m: [0.7, -0.7, 0.7, 0.7] },
  { label: '片方を混ぜる', m: [1, 0, 0.8, 0.6] },
]

/** 独立な標準正規分布の組 X に行列 A をかけた Y = AX。分散共分散行列は AAᵀ になる */
export function LinearTransform() {
  const [m, setM] = useState<[number, number, number, number]>([1, 0, 0.8, 0.6])
  const [a, b, c, d] = m
  const pts = Z_PAIRS.map(([z1, z2]) => ({ x: a * z1 + b * z2, y: c * z1 + d * z2 }))
  const v1 = a * a + b * b
  const v2 = c * c + d * d
  const cv = a * c + b * d
  const r = v1 > 0 && v2 > 0 ? cv / Math.sqrt(v1 * v2) : 0
  const set = (i: number) => (v: number) => setM((old) => old.map((o, j) => (j === i ? round(v, 1) : o)) as [number, number, number, number])
  return (
    <div>
      <Plot x={[-6, 6]} y={[-6, 6]} width={420} height={400} xLabel="Y₁" xTicks={[-6, -4, -2, 0, 2, 4, 6]} yTicks={[-6, -4, -2, 0, 2, 4, 6]}>
        <Points data={Z_PAIRS.map(([z1, z2]) => ({ x: z1, y: z2 }))} color="muted" r={2} opacity={0.3} />
        <Points data={pts} color="c1" r={2.5} opacity={0.55} />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: 'X：独立な N(0, 1) の組（分散共分散行列は単位行列 I）' },
          { color: 'c1', label: 'Y = AX' },
        ]}
      />
      <p className="figure-readout">
        <M>{`A = ${matTex(a, b, c, d)}`}</M>　→　<M>{`AA^{\\top} = ${matTex(v1, cv, cv, v2)}`}</M>
        <br />
        Y₁ と Y₂ の相関係数 = <strong>{fmt(r)}</strong>
      </p>
      <Controls>
        {PRESETS.map((p) => (
          <Button key={p.label} variant={p.m.every((v, i) => v === m[i]) ? 'primary' : 'default'} onClick={() => setM(p.m)}>
            {p.label}
          </Button>
        ))}
      </Controls>
      <Controls>
        <Slider label="a₁₁" value={a} min={-2} max={2} step={0.1} onChange={set(0)} format={(v) => v.toFixed(1)} />
        <Slider label="a₁₂" value={b} min={-2} max={2} step={0.1} onChange={set(1)} format={(v) => v.toFixed(1)} />
        <Slider label="a₂₁" value={c} min={-2} max={2} step={0.1} onChange={set(2)} format={(v) => v.toFixed(1)} />
        <Slider label="a₂₂" value={d} min={-2} max={2} step={0.1} onChange={set(3)} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
