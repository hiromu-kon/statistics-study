import { useState, type CSSProperties } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { HLine, Label, Legend, Plot, Segment, VLine } from '../../../components/charts/Plot'
import { Polygon } from './parts'
import { fix } from './format'

/**
 * 2つのベクトル a, b の内積 a·b = a₁b₁ + a₂b₂ を、矢印の図と一緒に見せる。
 * b の向きを回すと、a と同じ向きで最大、直角で 0、反対向きでマイナスになる。
 */
export function InnerProductFigure() {
  const [deg, setDeg] = useState(60)
  const [len, setLen] = useState(2)
  const a = { x: 3, y: 1 }
  const baseDeg = (Math.atan2(a.y, a.x) * 180) / Math.PI
  const th = ((baseDeg + deg) * Math.PI) / 180
  const b = { x: len * Math.cos(th), y: len * Math.sin(th) }
  const dot = a.x * b.x + a.y * b.y
  const norm = Math.hypot(a.x, a.y)
  // b を a の向きに落とした影（射影）
  const proj = dot / (norm * norm)
  const state = Math.abs(dot) < 0.005 ? '直交（直角）なので内積は 0' : dot > 0 ? '同じ側を向いているので内積はプラス' : '反対側を向いているので内積はマイナス'
  return (
    <div>
      <Plot x={[-4, 4]} y={[-4, 4]} width={420} height={410} xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} yTicks={[-4, -2, 0, 2, 4]} xLabel="1番目の成分" grid>
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        <Segment x1={-a.x * 1.3} y1={-a.y * 1.3} x2={a.x * 1.3} y2={a.y * 1.3} color="muted" dashed width={1} />
        <Segment x1={b.x} y1={b.y} x2={proj * a.x} y2={proj * a.y} color="c4" dashed />
        <Segment x1={0} y1={0} x2={proj * a.x} y2={proj * a.y} color="c4" width={6} />
        <Segment x1={0} y1={0} x2={a.x} y2={a.y} color="c1" width={3} arrow />
        <Segment x1={0} y1={0} x2={b.x} y2={b.y} color="c2" width={3} arrow />
        <Label x={a.x} y={a.y} dy={-8} anchor="start" color="c1">
          {' a'}
        </Label>
        <Label x={b.x} y={b.y} dy={-8} anchor="start" color="c2">
          {' b'}
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'a = (3, 1)' },
          { color: 'c2', label: `b = (${fix(b.x, 2)}, ${fix(b.y, 2)})` },
          { color: 'c4', label: 'b を a の向きに落とした影' },
        ]}
      />
      <p className="figure-readout">
        <M>{`a \\cdot b = 3 \\times (${fix(b.x, 2)}) + 1 \\times (${fix(b.y, 2)}) = ${fix(dot, 2)}`}</M>
        <br />
        {state}（a と b のなす角 {Math.abs(deg)}°）
      </p>
      <Controls>
        <Slider label="a から測った b の角度" value={deg} min={-180} max={180} step={5} onChange={setDeg} format={(v) => `${v}°`} />
        <Slider label="b の長さ" value={len} min={0.5} max={3} step={0.5} onChange={setLen} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

const A = [
  [1, 2, 3],
  [4, 5, 6],
]
const B = [
  [7, 8],
  [9, 10],
  [11, 12],
]

const cellBase: CSSProperties = {
  width: '2.6em',
  height: '2.2em',
  textAlign: 'center',
  border: '1px solid var(--line)',
  fontVariantNumeric: 'tabular-nums',
}

const tint = (c: string, pct: number): CSSProperties => ({ background: `color-mix(in srgb, var(--${c}) ${pct}%, transparent)`, fontWeight: 700 })

function Grid({ m, style, label }: { m: (number | string)[][]; style: (i: number, j: number) => CSSProperties | undefined; label: string }) {
  return (
    <div style={{ display: 'inline-block', textAlign: 'center' }}>
      <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
        <tbody>
          {m.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) => (
                <td key={j} style={{ ...cellBase, ...style(i, j) }}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="small muted">{label}</div>
    </div>
  )
}

/**
 * 行列の積 AB の (i, j) 成分を、A の i 行目と B の j 列目の内積として1マスずつ計算する。
 * 「次のマス」を押すと、塗る行と列が動き、計算式が出る。
 */
export function MatrixProductStepper() {
  const [step, setStep] = useState(0)
  const i = Math.floor(step / 2)
  const j = step % 2
  const C = A.map((row) => B[0].map((_, jj) => row.reduce((s, v, k) => s + v * B[k][jj], 0)))
  const shown = C.map((row, ii) => row.map((v, jj) => (ii * 2 + jj <= step ? v : '?')))
  const terms = A[i].map((v, k) => `${v} \\times ${B[k][j]}`).join(' + ')
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', justifyContent: 'center', alignItems: 'center' }}>
        <Grid m={A} style={(ii) => (ii === i ? tint('c1', 30) : undefined)} label="A（2行3列）" />
        <span aria-hidden>×</span>
        <Grid m={B} style={(_, jj) => (jj === j ? tint('c2', 30) : undefined)} label="B（3行2列）" />
        <span aria-hidden>=</span>
        <Grid
          m={shown}
          style={(ii, jj) => (ii === i && jj === j ? tint('c3', 40) : ii * 2 + jj < step ? undefined : { color: 'var(--muted)' })}
          label="AB（2行2列）"
        />
      </div>
      <p className="figure-readout">
        AB の {i + 1} 行 {j + 1} 列 = A の {i + 1} 行目 · B の {j + 1} 列目 = <M>{`${terms} = ${C[i][j]}`}</M>
      </p>
      <Controls>
        <Button onClick={() => setStep((s) => (s + 1) % 4)} variant="primary">
          次のマス
        </Button>
        <Button onClick={() => setStep(0)}>最初から</Button>
      </Controls>
    </div>
  )
}

/**
 * 2×2 行列 [[a, b], [c, d]] の2つの列ベクトルが作る平行四辺形。面積（向きつき）が行列式 ad − bc。
 * 2つの列が同じ直線に乗ると面積が 0 になり、逆行列がなくなる。
 */
export function DeterminantFigure() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(1)
  const [c, setC] = useState(0.5)
  const [d, setD] = useState(1.5)
  const det = a * d - b * c
  const p = (v: number) => (v < 0 ? `(${v})` : String(v))
  const flat = Math.abs(det) < 1e-9
  return (
    <div>
      <Plot x={[-4, 4]} y={[-4, 4]} width={420} height={410} xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} yTicks={[-4, -2, 0, 2, 4]} xLabel="1番目の成分">
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        <Polygon
          points={[
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
          ]}
          color="muted"
          opacity={0.15}
          stroke="muted"
        />
        <Polygon
          points={[
            { x: 0, y: 0 },
            { x: a, y: c },
            { x: a + b, y: c + d },
            { x: b, y: d },
          ]}
          color={flat ? 'c5' : 'c1'}
          opacity={0.25}
          stroke={flat ? 'c5' : 'c1'}
        />
        <Segment x1={0} y1={0} x2={a} y2={c} color="c2" width={3} arrow />
        <Segment x1={0} y1={0} x2={b} y2={d} color="c3" width={3} arrow />
        <Label x={a} y={c} dy={14} anchor="start" color="c2">
          {' 1列目'}
        </Label>
        <Label x={b} y={d} dy={-8} anchor="start" color="c3">
          {' 2列目'}
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: 'もとの正方形（面積 1）' },
          { color: flat ? 'c5' : 'c1', label: '行列で移した平行四辺形' },
        ]}
      />
      <p className="figure-readout">
        <M>{`\\det \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix} = ${p(a)} \\times ${p(d)} - ${p(b)} \\times ${p(c)} = ${fix(det, 2)}`}</M>
        <br />
        {flat
          ? '面積が 0：平面がつぶれて直線になった。もとに戻せないので逆行列はない'
          : `面積は ${fix(Math.abs(det), 2)} 倍${det < 0 ? '（マイナスは裏返ったという意味）' : ''}。0 でないので逆行列がある`}
      </p>
      <Controls>
        <Slider label="a" value={a} min={-3} max={3} step={0.5} onChange={setA} format={(v) => v.toFixed(1)} />
        <Slider label="b" value={b} min={-3} max={3} step={0.5} onChange={setB} format={(v) => v.toFixed(1)} />
        <Slider label="c" value={c} min={-3} max={3} step={0.5} onChange={setC} format={(v) => v.toFixed(1)} />
        <Slider label="d" value={d} min={-3} max={3} step={0.5} onChange={setD} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
