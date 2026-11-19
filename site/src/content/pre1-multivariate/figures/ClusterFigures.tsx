import { useState } from 'react'
import { Button, Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Label, Plot, Points, Segment, colorVar, usePlot, type Color } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import type { Vec2 } from './linalg'

// ---------- 5点の階層型クラスター分析 ----------

const FIVE: { name: string; p: Vec2 }[] = [
  { name: 'A', p: [1, 1] },
  { name: 'B', p: [2, 1] },
  { name: 'C', p: [4, 1] },
  { name: 'D', p: [6, 3] },
  { name: 'E', p: [7, 5] },
]

export type Method = 'single' | 'complete' | 'average' | 'ward'

const METHOD_LABEL: Record<Method, string> = {
  single: '最短距離法',
  complete: '最長距離法',
  average: '群平均法',
  ward: 'ウォード法',
}

/**
 * 併合の記録。番号 0〜4 が A〜E、5 以降は併合してできたクラスター（scipy の linkage と同じ番号の付け方）。
 * 高さは scipy.cluster.hierarchy.linkage の出力。ウォード法は √(2 × 平方和の増加) で、2点どうしならふつうの距離と一致する。
 */
const MERGES: Record<Method, [number, number, number][]> = {
  single: [
    [0, 1, 1],
    [2, 5, 2],
    [3, 4, 2.236],
    [6, 7, 2.828],
  ],
  complete: [
    [0, 1, 1],
    [3, 4, 2.236],
    [2, 5, 3],
    [6, 7, 7.211],
  ],
  average: [
    [0, 1, 1],
    [3, 4, 2.236],
    [2, 5, 2.5],
    [6, 7, 5.217],
  ],
  ward: [
    [0, 1, 1],
    [3, 4, 2.236],
    [2, 5, 2.887],
    [6, 7, 7.954],
  ],
}

const CLUSTER_COLORS: Color[] = ['c1', 'c2', 'c3', 'c4', 'c5']

/** 高さ cut より下の併合だけを行ったときの、各点のクラスター番号（0 から順） */
function clustersAt(method: Method, cut: number): number[] {
  const parent = [0, 1, 2, 3, 4]
  const find = (i: number): number => (parent[i] === i ? i : find(parent[i]))
  const members: number[][] = [[0], [1], [2], [3], [4]]
  MERGES[method].forEach(([a, b, h]) => {
    members.push([...members[a], ...members[b]])
    if (h <= cut) {
      const ra = find(members[a][0])
      const rb = find(members[b][0])
      parent[rb] = ra
    }
  })
  const roots = new Map<number, number>()
  return [0, 1, 2, 3, 4].map((i) => {
    const r = find(i)
    if (!roots.has(r)) roots.set(r, roots.size)
    return roots.get(r)!
  })
}

function DendrogramLines({ method, labels }: { method: Method; labels: number[] }) {
  const s = usePlot()
  const pos: number[] = [1, 2, 3, 4, 5]
  const height: number[] = [0, 0, 0, 0, 0]
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (const [a, b, h] of MERGES[method]) {
    lines.push({ x1: pos[a], y1: height[a], x2: pos[a], y2: h })
    lines.push({ x1: pos[b], y1: height[b], x2: pos[b], y2: h })
    lines.push({ x1: pos[a], y1: h, x2: pos[b], y2: h })
    pos.push((pos[a] + pos[b]) / 2)
    height.push(h)
  }
  return (
    <g>
      {lines.map((l, i) => (
        <line key={i} x1={s.x(l.x1)} y1={s.y(l.y1)} x2={s.x(l.x2)} y2={s.y(l.y2)} stroke="var(--ink)" strokeWidth={2} />
      ))}
      {FIVE.map((f, i) => (
        <text key={f.name} x={s.x(i + 1)} y={s.y(0) + 18} textAnchor="middle" className="plot-annot" style={{ fill: colorVar(CLUSTER_COLORS[labels[i]]), fontWeight: 700 }}>
          {f.name}
        </text>
      ))}
    </g>
  )
}

export function FivePointsMap({ labels, width = 340 }: { labels?: number[]; width?: number }) {
  return (
    <Plot x={[0, 8]} y={[0, 6]} width={width} height={Math.round(((width - 68) * 6) / 8) + 58} xLabel="変数1" yLabel="変数2" xTicks={[0, 2, 4, 6, 8]} yTicks={[0, 2, 4, 6]}>
      <Points data={FIVE.map((f, i) => ({ x: f.p[0], y: f.p[1], color: CLUSTER_COLORS[labels?.[i] ?? 0] }))} r={7} opacity={0.9} />
      {FIVE.map((f) => (
        <Label key={f.name} x={f.p[0]} y={f.p[1]} dy={-12}>
          {f.name}
        </Label>
      ))}
    </Plot>
  )
}

export function DendrogramDemo() {
  const [method, setMethod] = useState<Method>('single')
  const [cut, setCut] = useState(2.5)
  const labels = clustersAt(method, cut)
  const k = new Set(labels).size
  const top = method === 'single' ? 3.5 : 8.5
  return (
    <div>
      <Compare>
        <Card title="デンドログラム">
          <Plot x={[0.4, 5.6]} y={[0, top]} width={340} height={300} xTicks={[]} yLabel="併合した高さ（距離）">
            <DendrogramLines method={method} labels={labels} />
            <Segment x1={0.4} y1={cut} x2={5.6} y2={cut} color="c5" width={2} dashed />
          </Plot>
        </Card>
        <Card title="切った高さでのクラスター">
          <FivePointsMap labels={labels} />
        </Card>
      </Compare>
      <p className="figure-readout">
        {METHOD_LABEL[method]}：高さ <strong>{cut.toFixed(2)}</strong> で切ると <strong>{k}</strong> 個のクラスター
      </p>
      <Controls>
        {(Object.keys(METHOD_LABEL) as Method[]).map((m) => (
          <Button key={m} variant={m === method ? 'primary' : 'default'} onClick={() => setMethod(m)}>
            {METHOD_LABEL[m]}
          </Button>
        ))}
        <Slider label="切る高さ" value={cut} min={0.5} max={top - 0.3} step={0.05} onChange={setCut} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

// ---------- K-means 法 ----------

const KM_POINTS: Vec2[] = [
  [1, 1],
  [1.5, 2],
  [2, 1.2],
  [2.2, 2.3],
  [5, 1],
  [6, 1.5],
  [5.5, 2.4],
  [6.3, 0.8],
  [3.5, 5],
  [4, 6],
  [3, 6.2],
  [4.5, 5.5],
]

/** 初期値のプリセット。2つめはわざと悪い置き方にしてある（局所的な解に落ちる例） */
const KM_INITS: { name: string; centers: Vec2[] }[] = [
  {
    name: '初期値 1',
    centers: [
      [1, 5],
      [3, 1],
      [6, 4],
    ],
  },
  {
    name: '初期値 2',
    centers: [
      [1, 1],
      [2, 2],
      [5, 4],
    ],
  },
]

const sq = (p: Vec2, q: Vec2) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2

function assign(centers: Vec2[]): number[] {
  return KM_POINTS.map((p) => {
    let best = 0
    centers.forEach((c, k) => {
      if (sq(p, c) < sq(p, centers[best])) best = k
    })
    return best
  })
}

function update(labels: number[], old: Vec2[]): Vec2[] {
  return old.map((c, k) => {
    const mine = KM_POINTS.filter((_, i) => labels[i] === k)
    if (mine.length === 0) return c
    return [mine.reduce((s, p) => s + p[0], 0) / mine.length, mine.reduce((s, p) => s + p[1], 0) / mine.length]
  })
}

export function KMeansDemo() {
  const [init, setInit] = useState(0)
  const [centers, setCenters] = useState<Vec2[]>(KM_INITS[0].centers)
  const [labels, setLabels] = useState<number[] | null>(null)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const reset = (i: number) => {
    setInit(i)
    setCenters(KM_INITS[i].centers)
    setLabels(null)
    setStep(0)
    setDone(false)
  }
  const next = () => {
    // 偶数ステップ：各点を近い中心に割り当てる。奇数ステップ：中心を重心に動かす
    if (step % 2 === 0) {
      const nl = assign(centers)
      if (labels && nl.every((v, i) => v === labels[i])) setDone(true)
      setLabels(nl)
    } else if (labels) {
      setCenters(update(labels, centers))
    }
    setStep(step + 1)
  }
  const w = labels ? KM_POINTS.reduce((s, p, i) => s + sq(p, centers[labels[i]]), 0) : null
  const message =
    step === 0
      ? '中心（大きな◆）を3つ置いた。「次へ」で、各点をいちばん近い中心のグループに割り当てる'
      : done
        ? '割り当てが変わらなくなった：ここで終わり（収束）'
        : step % 2 === 1
          ? '割り当てた。次は、各グループの重心（平均の位置）に中心を動かす'
          : '中心を重心に動かした。次は、もう一度いちばん近い中心に割り当て直す'
  return (
    <div>
      <KMeansPlot centers={centers} labels={labels} />
      <p className="figure-readout">
        {message}
        <br />
        {w !== null && (
          <>
            グループ内の平方和（各点と自分の中心の距離²の合計）= <strong>{round(w, 2)}</strong>
          </>
        )}
      </p>
      <Controls>
        <Button variant="primary" onClick={next} disabled={done}>
          次へ（1ステップ）
        </Button>
        {KM_INITS.map((it, i) => (
          <Button key={it.name} variant={i === init ? 'primary' : 'default'} onClick={() => reset(i)}>
            {it.name}からやり直す
          </Button>
        ))}
      </Controls>
    </div>
  )
}

function KMeansPlot({ centers, labels }: { centers: Vec2[]; labels: number[] | null }) {
  return (
    <Plot x={[0, 7]} y={[0, 7]} width={400} height={390} xLabel="変数1" yLabel="変数2">
      <Points data={KM_POINTS.map((p, i) => ({ x: p[0], y: p[1], color: labels ? CLUSTER_COLORS[labels[i]] : 'muted' }))} r={6} opacity={0.85} />
      <Diamonds centers={centers} />
    </Plot>
  )
}

function Diamonds({ centers }: { centers: Vec2[] }) {
  const s = usePlot()
  return (
    <g>
      {centers.map((c, k) => {
        const x = s.x(c[0])
        const y = s.y(c[1])
        return (
          <path
            key={k}
            d={`M${x},${y - 12} L${x + 12},${y} L${x},${y + 12} L${x - 12},${y} Z`}
            fill={colorVar(CLUSTER_COLORS[k])}
            stroke="var(--ink)"
            strokeWidth={2}
          />
        )
      })}
    </g>
  )
}
