import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { colorVar, type Color } from '../../../components/charts/Plot'
import { createRng, randomNormal, round } from '../../../lib/stats'
import { Choice, DText, Diagram } from './svg'
import { shuffle } from './shuffle'

// ---------- 標本抽出法の格子図 ----------

const COLS = 10
const ROWS = 10
const N = COLS * ROWS
const SAMPLE = 10

type Stratum = { name: string; rows: [number, number]; color: Color }
const STRATA: Stratum[] = [
  { name: '層A', rows: [0, 1], color: 'c1' },
  { name: '層B', rows: [2, 6], color: 'c3' },
  { name: '層C', rows: [7, 9], color: 'c4' },
]
const stratumOf = (i: number) => {
  const r = Math.floor(i / COLS)
  return STRATA.findIndex((s) => r >= s.rows[0] && r <= s.rows[1])
}
/** 集落（クラスター）は 横5人 × 縦2行 のかたまり。全部で10個 */
const clusterOf = (i: number) => Math.floor(Math.floor(i / COLS) / 2) * 2 + (i % COLS < 5 ? 0 : 1)
const ids = Array.from({ length: N }, (_, i) => i)

type Method = 'simple' | 'systematic' | 'stratified' | 'cluster' | 'multistage'

const METHOD_NOTE: Record<Method, string> = {
  simple: '100人全員から、くじで10人を選ぶ。どの10人の組も同じ確率で選ばれる',
  systematic: '1〜10番から最初の1人をくじで決め、あとは10番おきに選ぶ（抽出間隔 = 100 ÷ 10 = 10）',
  stratified: '層ごとの人数に比例させて、層A 2人・層B 5人・層C 3人を、それぞれの層の中からくじで選ぶ',
  cluster: '10人ずつの集落（点線のかたまり）を1つくじで選び、その中の全員を調べる',
  multistage: 'まず集落を2つくじで選び（1段目）、選んだ集落の中から5人ずつくじで選ぶ（2段目）',
}

function pick(method: Method, seed: number): { chosen: Set<number>; clusters: Set<number> } {
  const rng = createRng(seed * 101 + method.length)
  if (method === 'simple') return { chosen: new Set(shuffle(ids, rng).slice(0, SAMPLE)), clusters: new Set() }
  if (method === 'systematic') {
    const start = Math.floor(rng() * (N / SAMPLE))
    return { chosen: new Set(Array.from({ length: SAMPLE }, (_, j) => start + j * (N / SAMPLE))), clusters: new Set() }
  }
  if (method === 'stratified') {
    const alloc = [2, 5, 3]
    const chosen = STRATA.flatMap((_, k) =>
      shuffle(
        ids.filter((i) => stratumOf(i) === k),
        rng,
      ).slice(0, alloc[k]),
    )
    return { chosen: new Set(chosen), clusters: new Set() }
  }
  const all = shuffle(
    Array.from({ length: 10 }, (_, c) => c),
    rng,
  )
  if (method === 'cluster') {
    const c = all[0]
    return { chosen: new Set(ids.filter((i) => clusterOf(i) === c)), clusters: new Set([c]) }
  }
  const cs = all.slice(0, 2)
  const chosen = cs.flatMap((c) =>
    shuffle(
      ids.filter((i) => clusterOf(i) === c),
      rng,
    ).slice(0, 5),
  )
  return { chosen: new Set(chosen), clusters: new Set(cs) }
}

/** 同じ母集団（100人・3つの層）で、抽出法ごとに誰が選ばれるかを見せる */
export function SamplingGrid() {
  const [method, setMethod] = useState<Method>('simple')
  const [seed, setSeed] = useState(1)
  const { chosen, clusters } = useMemo(() => pick(method, seed), [method, seed])
  const x0 = 78
  const cw = 46
  const ch = 32
  const y0 = 10
  const cx = (i: number) => x0 + (i % COLS) * cw + 14
  const cy = (i: number) => y0 + Math.floor(i / COLS) * ch + ch / 2
  const showClusters = method === 'cluster' || method === 'multistage'
  const counts = STRATA.map((_, k) => [...chosen].filter((i) => stratumOf(i) === k).length)
  return (
    <div>
      <Choice
        options={[
          { value: 'simple', label: '単純無作為抽出' },
          { value: 'systematic', label: '系統抽出法' },
          { value: 'stratified', label: '層化抽出法' },
          { value: 'cluster', label: 'クラスター抽出法' },
          { value: 'multistage', label: '多段抽出法' },
        ]}
        value={method}
        onChange={setMethod}
      />
      <Diagram width={550} height={y0 * 2 + ROWS * ch} ariaLabel="母集団100人の格子と選ばれた人">
        {STRATA.map((s) => (
          <g key={s.name}>
            <rect
              x={x0 - 4}
              y={y0 + s.rows[0] * ch + 2}
              width={COLS * cw}
              height={(s.rows[1] - s.rows[0] + 1) * ch - 4}
              rx={8}
              fill={colorVar(s.color)}
              opacity={0.1}
            />
            <DText x={36} y={y0 + ((s.rows[0] + s.rows[1] + 1) / 2) * ch - 9} color={s.color}>
              {s.name}
            </DText>
            <DText x={36} y={y0 + ((s.rows[0] + s.rows[1] + 1) / 2) * ch + 9} color={s.color} size={11} weight={500}>
              {`${(s.rows[1] - s.rows[0] + 1) * COLS}人`}
            </DText>
          </g>
        ))}
        {showClusters &&
          Array.from({ length: 10 }, (_, c) => (
            <rect
              key={c}
              x={x0 + (c % 2) * 5 * cw - 2}
              y={y0 + Math.floor(c / 2) * 2 * ch + 1}
              width={5 * cw - 4}
              height={2 * ch - 2}
              rx={8}
              fill="none"
              stroke={colorVar(clusters.has(c) ? 'c2' : 'muted')}
              strokeWidth={clusters.has(c) ? 3 : 1.2}
              strokeDasharray={clusters.has(c) ? undefined : '4 4'}
            />
          ))}
        {ids.map((i) => {
          const on = chosen.has(i)
          const c = colorVar(STRATA[stratumOf(i)].color)
          return (
            <g key={i}>
              <circle cx={cx(i)} cy={cy(i)} r={on ? 9 : 6.5} fill={c} opacity={on ? 1 : 0.28} stroke={on ? 'var(--ink)' : 'none'} strokeWidth={2.5} />
              <DText x={cx(i) + 13} y={cy(i)} anchor="start" color={on ? 'ink' : 'muted'} size={10} weight={on ? 700 : 400}>
                {i + 1}
              </DText>
            </g>
          )
        })}
      </Diagram>
      <p className="figure-readout">{METHOD_NOTE[method]}</p>
      <p className="figure-readout">
        選ばれた人数：{STRATA.map((s, k) => `${s.name} ${counts[k]}人`).join('・')}（合計 {chosen.size}人）
      </p>
      <Controls>
        <Button onClick={() => setSeed((s) => s + 1)}>もう一度選び直す</Button>
      </Controls>
    </div>
  )
}

// ---------- 的当ての図（標本誤差と偏り） ----------

const UNIT = 100 / 6

/** 的（真ん中 = 母集団の本当の値）と、推定値（矢）の散らばり */
export function TargetBoard({ bias, spread, shots = 30, seed = 1, size = 240 }: { bias: number; spread: number; shots?: number; seed?: number; size?: number }) {
  const pts = useMemo(() => {
    const rng = createRng(seed)
    const d = bias / Math.SQRT2
    return Array.from({ length: shots }, () => ({ x: d + randomNormal(rng, 0, spread), y: d + randomNormal(rng, 0, spread) }))
  }, [bias, spread, shots, seed])
  const c = 120
  const mx = pts.reduce((a, p) => a + p.x, 0) / pts.length
  const my = pts.reduce((a, p) => a + p.y, 0) / pts.length
  return (
    <svg className="plot" viewBox="0 0 240 240" style={{ maxWidth: size, margin: '0 auto' }} role="img" aria-label="的当ての図">
      {[100, 75, 50, 25].map((r, k) => (
        <circle key={r} cx={c} cy={c} r={r} fill={colorVar(k % 2 === 0 ? 'muted' : 'c1')} opacity={k % 2 === 0 ? 0.12 : 0.1} stroke="var(--line)" />
      ))}
      <circle cx={c} cy={c} r={4} fill="var(--ink)" />
      {pts.map((p, i) => (
        <circle key={i} cx={c + p.x * UNIT} cy={c - p.y * UNIT} r={4.5} fill={colorVar('c2')} opacity={0.8} />
      ))}
      <g stroke={colorVar('c5')} strokeWidth={3}>
        <line x1={c + mx * UNIT - 7} y1={c - my * UNIT - 7} x2={c + mx * UNIT + 7} y2={c - my * UNIT + 7} />
        <line x1={c + mx * UNIT - 7} y1={c - my * UNIT + 7} x2={c + mx * UNIT + 7} y2={c - my * UNIT - 7} />
      </g>
    </svg>
  )
}

const SIZES = [4, 9, 16, 25, 49, 100, 400]
const SIGMA = 6

/** 偏りと標本サイズを動かす的当て。n を大きくすると散らばりは小さくなるが、ずれ（偏り）は残る */
export function TargetDemo() {
  const [bias, setBias] = useState(2.5)
  const [idx, setIdx] = useState(1)
  const n = SIZES[idx]
  const se = SIGMA / Math.sqrt(n)
  return (
    <div>
      <TargetBoard bias={bias} spread={se / Math.SQRT2} shots={40} seed={5} size={300} />
      <p className="figure-readout">
        偏り（中心からのずれ）= <strong>{bias}</strong>　ばらつきの目安（標準誤差 ∝ 1/√n）= <strong>{round(se, 2)}</strong>
      </p>
      <p className="figure-readout small muted">オレンジの点 = 1回の調査で得た推定値（40回分）、赤い × = その平均、黒い点 = 本当の値</p>
      <Controls>
        <Slider label="偏り" value={bias} min={0} max={3} step={0.5} onChange={setBias} format={(v) => (v === 0 ? 'なし' : String(v))} />
        <Slider label="標本の大きさ n" value={idx} min={0} max={SIZES.length - 1} step={1} onChange={setIdx} format={(i) => `${SIZES[i]}人`} />
      </Controls>
    </div>
  )
}
