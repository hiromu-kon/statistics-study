import { useMemo, useState } from 'react'
import { Button, Controls, DataTable, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Curve, HLine, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { createRng, randomNormal, round } from '../../../lib/stats'
import { det3, inverse3, type Vec2 } from './linalg'
import { PathDiagram } from './PathDiagram'

// ---------- 因子の回転 ----------

const FACTOR_VARS = ['国語', '英語', '社会', '数学', '物理', '化学']

/**
 * 回転前の因子負荷量。相関行列（共通性を対角に入れたもの）を固有値分解した主因子法の解を numpy で求めた値。
 * もとにした相関行列は、単純構造の負荷量 [[.8,.1],[.7,.2],[.75,0],[.1,.8],[.2,.7],[0,.6]] から作った。
 */
const UNROTATED: Vec2[] = [
  [0.688, -0.42],
  [0.672, -0.279],
  [0.587, -0.467],
  [0.576, 0.564],
  [0.592, 0.423],
  [0.374, 0.469],
]

function rotate(deg: number): Vec2[] {
  const t = (deg * Math.PI) / 180
  // 軸を時計回りに deg 度まわす。新しい軸への負荷量は、もとの負荷量と新しい軸の向きの内積
  const u1: Vec2 = [Math.cos(t), -Math.sin(t)]
  const u2: Vec2 = [Math.sin(t), Math.cos(t)]
  return UNROTATED.map((l) => [l[0] * u1[0] + l[1] * u1[1], l[0] * u2[0] + l[1] * u2[1]])
}

/** バリマックス基準：各因子の「負荷量の2乗」の分散の合計。大きいほど、0 に近い値と大きい値にはっきり分かれる */
function varimaxCriterion(L: Vec2[]): number {
  let total = 0
  for (const j of [0, 1]) {
    const q = L.map((l) => l[j] ** 2)
    const m = q.reduce((s, v) => s + v, 0) / q.length
    total += q.reduce((s, v) => s + (v - m) ** 2, 0)
  }
  return total
}

export function FactorRotation() {
  const best = useMemo(() => {
    let bd = 0
    let bc = -1
    for (let d = 0; d <= 80; d += 0.1) {
      const c = varimaxCriterion(rotate(d))
      if (c > bc) {
        bc = c
        bd = Math.round(d * 10) / 10
      }
    }
    return bd
  }, [])
  const [deg, setDeg] = useState(0)
  const t = (deg * Math.PI) / 180
  const L = rotate(deg)
  const u1: Vec2 = [Math.cos(t), -Math.sin(t)]
  const u2: Vec2 = [Math.sin(t), Math.cos(t)]
  return (
    <div>
      <Plot x={[-0.4, 1.1]} y={[-0.75, 0.95]} width={400} height={440} xLabel="回転前の因子1" yLabel="回転前の因子2" xTicks={[-0.4, 0, 0.4, 0.8]} yTicks={[-0.4, 0, 0.4, 0.8]}>
        <Segment x1={0} y1={0} x2={1.05 * u1[0]} y2={1.05 * u1[1]} color="c1" width={3} arrow />
        <Segment x1={0} y1={0} x2={0.9 * u2[0]} y2={0.9 * u2[1]} color="c3" width={3} arrow />
        <Label x={1.05 * u1[0]} y={1.05 * u1[1]} dy={18} anchor="end" color="c1">
          新しい因子1
        </Label>
        <Label x={0.9 * u2[0]} y={0.9 * u2[1]} dy={-8} anchor="start" color="c3">
          新しい因子2
        </Label>
        <Points data={UNROTATED.map((l, i) => ({ x: l[0], y: l[1], color: i < 3 ? 'c2' : 'c4' }))} r={6} opacity={0.9} />
        {UNROTATED.map((l, i) => (
          <Label key={i} x={l[0]} y={l[1]} dy={-10} anchor="middle">
            {FACTOR_VARS[i]}
          </Label>
        ))}
      </Plot>
      <DataTable
        head={['科目', '新しい因子1', '新しい因子2', <>共通性 <M>{'h^2'}</M></>, <>独自性 <M>{'1-h^2'}</M></>]}
        rows={L.map((l, i) => {
          const h2 = l[0] ** 2 + l[1] ** 2
          return [FACTOR_VARS[i], round(l[0], 3).toFixed(3), round(l[1], 3).toFixed(3), round(h2, 3).toFixed(3), round(1 - h2, 3).toFixed(3)]
        })}
        caption={`回転角 ${deg.toFixed(1)}°（軸を時計回りに）。バリマックス基準 = ${round(varimaxCriterion(L), 3)}`}
      />
      <Controls>
        <Slider label="軸の回転角" value={deg} min={0} max={80} step={0.1} onChange={setDeg} format={(v) => `${v.toFixed(1)}°`} />
        <Button variant="primary" onClick={() => setDeg(best)}>
          バリマックス回転にする
        </Button>
      </Controls>
    </div>
  )
}

// ---------- パス図 ----------

/** 1因子モデル：数学の力（潜在因子）が3つのテストの点を生む */
export function OneFactorPath() {
  return (
    <PathDiagram
      ariaLabel="潜在因子「数学の力」から3つのテストへの矢印と、それぞれの独自因子"
      width={560}
      height={260}
      nodes={[
        { id: 'f', label: '数学の力', x: 280, y: 50, kind: 'latent' },
        { id: 'x1', label: '計算', x: 110, y: 160, kind: 'observed' },
        { id: 'x2', label: '図形', x: 280, y: 160, kind: 'observed' },
        { id: 'x3', label: '文章題', x: 450, y: 160, kind: 'observed' },
        { id: 'e1', label: 'e₁', x: 110, y: 235, kind: 'error' },
        { id: 'e2', label: 'e₂', x: 280, y: 235, kind: 'error' },
        { id: 'e3', label: 'e₃', x: 450, y: 235, kind: 'error' },
      ]}
      edges={[
        { from: 'f', to: 'x1', label: '0.9', color: 'c1' },
        { from: 'f', to: 'x2', label: '0.8', color: 'c1', labelSide: -1 },
        { from: 'f', to: 'x3', label: '0.7', color: 'c1', labelSide: -1 },
        { from: 'e1', to: 'x1', color: 'muted' },
        { from: 'e2', to: 'x2', color: 'muted' },
        { from: 'e3', to: 'x3', color: 'muted' },
      ]}
    />
  )
}

/** 構造方程式モデル：潜在変数「意欲」→ 勉強時間 → 成績、と 意欲 → 成績 の直接の矢印 */
export function SemPath() {
  return (
    <PathDiagram
      ariaLabel="意欲（潜在変数）から勉強時間と成績への矢印、勉強時間から成績への矢印"
      width={600}
      height={300}
      nodes={[
        { id: 'q1', label: '質問1', x: 70, y: 70, kind: 'observed' },
        { id: 'q2', label: '質問2', x: 70, y: 230, kind: 'observed' },
        { id: 'f', label: '意欲', x: 230, y: 150, kind: 'latent' },
        { id: 'm', label: '勉強時間', x: 400, y: 60, kind: 'observed' },
        { id: 'y', label: '成績', x: 520, y: 220, kind: 'observed' },
        { id: 'd1', label: 'd₁', x: 530, y: 40, kind: 'error' },
        { id: 'd2', label: 'd₂', x: 520, y: 285, kind: 'error' },
      ]}
      edges={[
        { from: 'f', to: 'q1', label: '0.8', color: 'muted', labelSide: 1 },
        { from: 'f', to: 'q2', label: '0.7', color: 'muted', labelSide: -1 },
        { from: 'f', to: 'm', label: 'a = 0.5', color: 'c1' },
        { from: 'm', to: 'y', label: 'b = 0.6', color: 'c1', labelSide: -1 },
        { from: 'f', to: 'y', label: 'c = 0.2', color: 'c4', labelSide: -1 },
        { from: 'd1', to: 'm', color: 'muted' },
        { from: 'd2', to: 'y', color: 'muted' },
      ]}
    />
  )
}

/** 操作変数：Z は X だけを動かし、観測されない交絡 U は X と Y の両方に効く */
export function IvPath() {
  return (
    <PathDiagram
      ariaLabel="操作変数 Z から X、X から Y への矢印と、観測されない交絡 U から X と Y への点線の矢印"
      width={560}
      height={230}
      nodes={[
        { id: 'z', label: 'Z（操作変数）', x: 80, y: 170, kind: 'observed' },
        { id: 'x', label: 'X（原因）', x: 280, y: 170, kind: 'observed' },
        { id: 'y', label: 'Y（結果）', x: 480, y: 170, kind: 'observed' },
        { id: 'u', label: 'U（観測できない）', x: 380, y: 50, kind: 'latent', dashed: true },
      ]}
      edges={[
        { from: 'z', to: 'x', color: 'c1', label: '関連あり', labelSide: -1 },
        { from: 'x', to: 'y', color: 'c2', label: '知りたい効果 β', labelSide: -1 },
        { from: 'u', to: 'x', color: 'c5', dashed: true, labelSide: 1 },
        { from: 'u', to: 'y', color: 'c5', dashed: true, labelSide: -1 },
      ]}
    />
  )
}

// ---------- 操作変数のシミュレーション ----------

/**
 * Z, U, e₁, e₂ を独立な標準正規乱数として、X = 0.8Z + γU + e₁、Y = 0.5X + γU + e₂ を作る（本当の効果は 0.5）。
 * 交絡の強さ γ を変えたときの、最小二乗法の傾きと操作変数法の推定値をくらべる。
 */
function useIvData() {
  return useMemo(() => {
    const rng = createRng(5)
    const n = 500
    return Array.from({ length: n }, () => [randomNormal(rng), randomNormal(rng), randomNormal(rng), randomNormal(rng)] as const)
  }, [])
}

function estimates(data: readonly (readonly [number, number, number, number])[], g: number) {
  const xs = data.map(([z, u, e1]) => 0.8 * z + g * u + e1)
  const ys = data.map(([, u, , e2], i) => 0.5 * xs[i] + g * u + e2)
  const zs = data.map(([z]) => z)
  const m = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length
  const cov = (a: number[], b: number[]) => {
    const ma = m(a)
    const mb = m(b)
    return a.reduce((s, v, i) => s + (v - ma) * (b[i] - mb), 0) / a.length
  }
  return { ols: cov(xs, ys) / cov(xs, xs), iv: cov(zs, ys) / cov(zs, xs) }
}

export function IvDemo() {
  const data = useIvData()
  const [g, setG] = useState(0.8)
  const now = estimates(data, g)
  return (
    <div>
      <Plot x={[0, 1.5]} y={[0.2, 1.2]} width={520} height={280} xLabel="交絡の強さ γ" yLabel="推定値" yTicks={[0.2, 0.4, 0.6, 0.8, 1, 1.2]}>
        <HLine y={0.5} color="muted" label="本当の効果 0.5" />
        <Curve f={(x) => estimates(data, x).ols} color="c5" samples={60} />
        <Curve f={(x) => estimates(data, x).iv} color="c1" samples={60} />
        <VLine x={g} color="c4" />
        <Points
          data={[
            { x: g, y: now.ols, color: 'c5' },
            { x: g, y: now.iv, color: 'c1' },
          ]}
          r={6}
          opacity={1}
        />
      </Plot>
      <Legend
        items={[
          { color: 'c5', label: '最小二乗法の傾き Cov(X,Y)/Var(X)' },
          { color: 'c1', label: '操作変数法 Cov(Z,Y)/Cov(Z,X)' },
        ]}
      />
      <p className="figure-readout">
        γ = {g.toFixed(2)}：最小二乗法 <strong>{round(now.ols, 3)}</strong>　／　操作変数法 <strong>{round(now.iv, 3)}</strong>（500 人分の乱数）
      </p>
      <Controls>
        <Slider label="交絡の強さ γ" value={g} min={0} max={1.5} step={0.05} onChange={setG} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

// ---------- グラフィカルモデル ----------

const GM_NAMES = ['アイスの売上', '気温', '水の事故']

/**
 * 相関行列 R の逆行列（精度行列）Ω の非対角成分が 0 ⇔ 残りの変数を固定したときの偏相関が 0。
 * r₁₂ = 0.6、r₂₃ = 0.5 に固定し、r₁₃ をスライダーで動かす。
 */
export function GraphicalModelDemo() {
  const [r13, setR13] = useState(0.3)
  const R = [
    [1, 0.6, r13],
    [0.6, 1, 0.5],
    [r13, 0.5, 1],
  ]
  const ok = det3(R) > 1e-6
  const O = ok ? inverse3(R) : null
  const pc = (i: number, j: number) => (O ? -O[i][j] / Math.sqrt(O[i][i] * O[j][j]) : 0)
  const pos: Vec2[] = [
    [90, 190],
    [280, 50],
    [470, 190],
  ]
  const pairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 2],
  ]
  const fmt = (v: number) => (Math.abs(v) < 0.0005 ? '0.000' : v.toFixed(3))
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 240" role="img" aria-label="3つの変数を偏相関の強さに応じた太さの線で結んだグラフ">
        {pairs.map(([i, j]) => {
          const p = pc(i, j)
          const none = Math.abs(p) < 0.005
          const [x1, y1] = pos[i]
          const [x2, y2] = pos[j]
          return (
            <g key={`${i}${j}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={none ? 'var(--muted)' : p > 0 ? 'var(--c1)' : 'var(--c5)'}
                strokeWidth={none ? 1.5 : 2 + 14 * Math.abs(p)}
                strokeDasharray={none ? '4 6' : undefined}
                opacity={none ? 0.6 : 0.85}
              />
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + (i === 0 && j === 2 ? 22 : -10)} textAnchor="middle" className="plot-annot" style={{ fill: 'var(--ink)' }}>
                {none ? '辺なし（偏相関 0）' : `偏相関 ${fmt(p)}`}
              </text>
            </g>
          )
        })}
        {pos.map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={68} ry={24} fill="var(--surface)" stroke="var(--c2)" strokeWidth={2.2} />
            <text x={x} y={y + 5} textAnchor="middle" className="plot-annot" style={{ fill: 'var(--ink)', fontSize: 14 }}>
              {GM_NAMES[i]}
            </text>
          </g>
        ))}
      </svg>
      {O ? (
        <DataTable
          head={['精度行列 Ω = R⁻¹', ...GM_NAMES]}
          rows={O.map((row, i) => [GM_NAMES[i], ...row.map((v, j) => (i === 0 && j === 2) || (i === 2 && j === 0) ? <strong key={j}>{fmt(v)}</strong> : fmt(v))])}
          caption={`r₁₂ = 0.6、r₂₃ = 0.5、r₁₃ = ${r13.toFixed(2)}。r₁₃ = 0.6 × 0.5 = 0.30 のとき、Ω の (1, 3) 成分がちょうど 0 になる`}
        />
      ) : (
        <p className="figure-readout">この組み合わせの相関行列はありえない（行列式が 0 以下）</p>
      )}
      <Controls>
        <Slider label="アイスと水の事故の相関 r₁₃" value={r13} min={-0.35} max={0.95} step={0.05} onChange={setR13} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
