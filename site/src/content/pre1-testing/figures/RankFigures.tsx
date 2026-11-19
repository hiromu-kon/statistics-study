import { useRef, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Bars, Label, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { correlation, createRng, mean, round, tCdf, variance } from '../../../lib/stats'
import { Toggle } from './parts'

/** 小さい順の順位（同順位はないものとする） */
function ranks(xs: number[]): number[] {
  const order = xs.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v)
  const r = Array.from({ length: xs.length }, () => 0)
  order.forEach((o, k) => (r[o.i] = k + 1))
  return r
}

/** 1, 2, …, total から size 個選んだときの順位和を全部数える */
function rankSumCounts(total: number, size: number): Map<number, number> {
  const counts = new Map<number, number>()
  const walk = (start: number, left: number, s: number) => {
    if (left === 0) {
      counts.set(s, (counts.get(s) ?? 0) + 1)
      return
    }
    for (let r = start; r <= total - left + 1; r++) walk(r + 1, left - 1, s + r)
  }
  walk(1, size, 0)
  return counts
}

const A = [5.1, 5.8, 6.2, 6.9, 7.4]
const B_BASE = [6.8, 7.5, 8.1, 8.6]

/**
 * 外れ値の影響。B 群の最大値を右へ動かすと、t 検定の p 値は大きくなっていく（分散が膨らむため）が、
 * 順位和検定の p 値は順位が変わらないので動かない。
 */
export function OutlierDemo() {
  const [xMax, setXMax] = useState(9)
  const B = [...B_BASE, xMax]
  const n1 = A.length
  const n2 = B.length
  const sp2 = ((n1 - 1) * variance(A, 1) + (n2 - 1) * variance(B, 1)) / (n1 + n2 - 2)
  const t = (mean(B) - mean(A)) / Math.sqrt(sp2 * (1 / n1 + 1 / n2))
  const pT = 2 * (1 - tCdf(Math.abs(t), n1 + n2 - 2))
  const r = ranks([...A, ...B])
  const wB = r.slice(n1).reduce((s, v) => s + v, 0)
  const counts = rankSumCounts(n1 + n2, n2)
  let upper = 0
  let lower = 0
  for (const [s, c] of counts) {
    if (s >= wB) upper += c
    if (s <= wB) lower += c
  }
  const total = [...counts.values()].reduce((s, v) => s + v, 0)
  const pW = Math.min(1, (2 * Math.min(upper, lower)) / total)
  return (
    <div>
      <Plot x={[4.5, 31]} y={[0, 3]} hideY height={170} grid={false} xTicks={[5, 10, 15, 20, 25, 30]} xLabel="測定値">
        <Points data={A.map((x) => ({ x, y: 2 }))} color="c1" r={6} opacity={0.85} />
        <Points data={B.map((x) => ({ x, y: 1 }))} color="c2" r={6} opacity={0.85} />
        <Label x={4.6} y={2} dy={-12} anchor="start" color="c1">
          A 群
        </Label>
        <Label x={4.6} y={1} dy={-12} anchor="start" color="c2">
          B 群
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `2標本 t 検定：t = ${round(t, 3)}、p 値 = ${round(pT, 4)}` },
          { color: 'c2', label: `順位和検定：B の順位和 = ${wB}、p 値 = ${round(pW, 4)}（正確な値）` },
        ]}
      />
      <p className="figure-readout">両側検定。t 検定は {pT <= 0.05 ? '5% で有意' : '5% で有意でない'}、順位和検定は {pW <= 0.05 ? '5% で有意' : '5% で有意でない'}</p>
      <Controls>
        <Slider label="B 群のいちばん大きい値" value={xMax} min={9} max={30} step={0.5} onChange={setXMax} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

const PA = [12, 15, 17, 20]
const PB = [8, 10, 11, 14]
const ALL = [...PA, ...PB]
const OBS = mean(PA) - mean(PB)

function diffOf(groupA: number[]): number {
  const sa = groupA.reduce((s, v) => s + v, 0)
  const total = ALL.reduce((s, v) => s + v, 0)
  return sa / 4 - (total - sa) / 4
}

/** 8個から4個を A に選ぶ 70 通りすべての平均の差 */
const EXACT: number[] = (() => {
  const out: number[] = []
  const walk = (start: number, chosen: number[]) => {
    if (chosen.length === 4) {
      out.push(diffOf(chosen.map((i) => ALL[i])))
      return
    }
    for (let i = start; i < ALL.length; i++) walk(i + 1, [...chosen, i])
  }
  walk(0, [])
  return out
})()

function toBars(diffs: number[]): { x: number; y: number }[] {
  const counts = new Map<number, number>()
  for (const d of diffs) counts.set(d, (counts.get(d) ?? 0) + 1)
  return [...counts].map(([x, c]) => ({ x, y: c / diffs.length }))
}

/**
 * 並べ替え検定。8個の値に付いた A/B のラベルをシャッフルして平均の差を計算し、
 * それをくり返してできる分布の中で、観測した差 5.25 がどれくらい端にあるかを見る。
 */
export function PermutationDemo() {
  const rng = useRef(createRng(3))
  const [diffs, setDiffs] = useState<number[]>([])
  const [last, setLast] = useState<boolean[] | null>(null)
  const [exact, setExact] = useState(false)

  const shuffleOnce = (): { d: number; labels: boolean[] } => {
    const idx = ALL.map((_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rng.current() * (i + 1))
      const tmp = idx[i]
      idx[i] = idx[j]
      idx[j] = tmp
    }
    const labels = Array.from({ length: ALL.length }, () => false)
    idx.slice(0, 4).forEach((i) => (labels[i] = true))
    return { d: diffOf(idx.slice(0, 4).map((i) => ALL[i])), labels }
  }
  const run = (times: number) => {
    const next: number[] = []
    let lab: boolean[] | null = null
    for (let k = 0; k < times; k++) {
      const s = shuffleOnce()
      next.push(s.d)
      lab = s.labels
    }
    setDiffs((prev) => [...prev, ...next])
    setLast(lab)
    setExact(false)
  }

  const shown = exact ? EXACT : diffs
  const bars = toBars(shown)
  const yMax = Math.max(0.12, ...bars.map((b) => b.y * 1.15))
  const hits = shown.filter((d) => d >= OBS - 1e-9).length
  const labels = last ?? ALL.map((_, i) => i < 4)
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '4px 0 8px' }}>
        {ALL.map((v, i) => (
          <span
            key={i}
            style={{
              padding: '2px 10px',
              borderRadius: 6,
              border: `2px solid ${labels[i] ? 'var(--c1)' : 'var(--c2)'}`,
              color: labels[i] ? 'var(--c1)' : 'var(--c2)',
              fontWeight: 600,
            }}
          >
            {labels[i] ? 'A' : 'B'} {v}
          </span>
        ))}
      </div>
      <Plot x={[-7, 7]} y={[0, yMax]} xTicks={[-6, -4, -2, 0, 2, 4, 6]} xLabel="（A の平均）−（B の平均）" yLabel="割合">
        <Bars data={bars} width={0.4} color="c1" highlight={(x) => x >= OBS - 1e-9} highlightColor="c5" />
        <VLine x={OBS} color="c5" label={`観測 ${OBS}`} />
      </Plot>
      <p className="figure-readout">
        {exact ? '全 70 通り' : `並べ替え ${diffs.length} 回`}のうち、差が {OBS} 以上になったのは {hits} 回
        {shown.length > 0 && (
          <>
            {' '}→ 片側 p 値 ≒ <strong>{round(hits / shown.length, 4)}</strong>
          </>
        )}
        {last === null && !exact && <>（上は実際のラベル。ボタンでラベルを並べ替える）</>}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        <Button variant="primary" onClick={() => run(1)}>
          1回並べ替える
        </Button>
        <Button onClick={() => run(100)}>100回</Button>
        <Button onClick={() => setExact(true)}>全70通りを数える</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setDiffs([])
            setLast(null)
            setExact(false)
          }}
        >
          リセット
        </Button>
      </div>
    </div>
  )
}

const DATASETS = {
  curve: {
    label: '単調だが曲がった関係',
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [1.6, 2.6, 4.1, 6.6, 10.5, 16.8, 26.8, 42.9, 68.7, 110],
  },
  outlier: {
    label: '外れ値が1つ',
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 30],
    y: [5.2, 3.1, 6.4, 2.2, 7.5, 4.3, 6.9, 1.8, 4.9, 30],
  },
} as const

type DatasetKey = keyof typeof DATASETS

function kendall(xs: readonly number[], ys: readonly number[]): number {
  let s = 0
  const n = xs.length
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s += Math.sign((xs[i] - xs[j]) * (ys[i] - ys[j]))
  return s / ((n * (n - 1)) / 2)
}

/** ピアソンの相関係数と順位相関係数の違い。順位相関は「同じ向きに並んでいるか」だけを見る */
export function RankCorrPlot() {
  const [key, setKey] = useState<DatasetKey>('curve')
  const ds = DATASETS[key]
  const xs = [...ds.x]
  const ys = [...ds.y]
  const pearson = correlation(xs, ys)
  const spearman = correlation(ranks(xs), ranks(ys))
  const tau = kendall(xs, ys)
  const xMax = Math.max(...xs) * 1.08
  const yMax = Math.max(...ys) * 1.1
  return (
    <div>
      <Plot x={[0, xMax]} y={[0, yMax]} xLabel="x" yLabel="y" height={260}>
        <Points data={xs.map((x, i) => ({ x, y: ys[i] }))} color="c1" r={5} opacity={0.9} />
      </Plot>
      <p className="figure-readout">
        ピアソン r = <strong>{round(pearson, 3)}</strong>、スピアマン r<sub>s</sub> = <strong>{round(spearman, 3)}</strong>、ケンドール τ = <strong>{round(tau, 3)}</strong>
      </p>
      <Toggle
        options={(Object.keys(DATASETS) as DatasetKey[]).map((k) => ({ value: k, label: DATASETS[k].label }))}
        value={key}
        onChange={setKey}
      />
    </div>
  )
}
