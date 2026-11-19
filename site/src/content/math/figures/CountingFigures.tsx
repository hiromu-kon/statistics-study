import { useState, type ReactNode } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { combination } from '../../../lib/stats'

type TreeNode = { label: string; path: string[]; children: TreeNode[] }

function buildTree(path: string[], depth: number, childrenOf: (path: string[]) => string[]): TreeNode[] {
  if (path.length >= depth) return []
  return childrenOf(path).map((label) => {
    const p = [...path, label]
    return { label, path: p, children: buildTree(p, depth, childrenOf) }
  })
}

const LEVEL_COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)']

/**
 * 樹形図。levels を渡すと「各段の選び方が決まっている」積の法則の図、
 * items と depth を渡すと「使ったものはもう選べない」並べ方（順列）の図になる。
 */
export function TreeDiagram({
  levels,
  items,
  depth: depth0,
  headers,
}: {
  levels?: string[][]
  items?: string[]
  depth?: number
  headers?: string[]
}) {
  const depth = levels ? levels.length : (depth0 ?? items?.length ?? 0)
  const childrenOf = (path: string[]) => (levels ? levels[path.length] : (items ?? []).filter((it) => !path.includes(it)))
  const roots = buildTree([], depth, childrenOf)
  const rowH = 28
  const top = headers ? 40 : 18
  const colW = 110
  const x0 = 24
  let leafIndex = 0
  const elements: ReactNode[] = []
  const leaves: { y: number; path: string[] }[] = []

  const place = (node: TreeNode, d: number): number => {
    let y: number
    if (node.children.length === 0) {
      y = top + leafIndex * rowH
      leafIndex++
      leaves.push({ y, path: node.path })
    } else {
      const ys = node.children.map((c) => place(c, d + 1))
      y = (ys[0] + ys[ys.length - 1]) / 2
      node.children.forEach((c, i) => {
        elements.push(
          <line key={`l-${c.path.join('-')}`} x1={x0 + (d + 1) * colW + 12} y1={y} x2={x0 + (d + 2) * colW - 12} y2={ys[i]} stroke="var(--muted)" strokeWidth={1.5} />,
        )
      })
    }
    const cx = x0 + (d + 1) * colW
    elements.push(
      <g key={`n-${node.path.join('-')}`}>
        <circle cx={cx} cy={y} r={11} fill={LEVEL_COLORS[d % LEVEL_COLORS.length]} fillOpacity={0.2} stroke={LEVEL_COLORS[d % LEVEL_COLORS.length]} strokeWidth={1.5} />
        <text className="plot-annot" x={cx} y={y + 4.5} textAnchor="middle">
          {node.label}
        </text>
      </g>,
    )
    return y
  }

  const rootYs = roots.map((r) => place(r, 0))
  const rootY = (rootYs[0] + rootYs[rootYs.length - 1]) / 2
  roots.forEach((r, i) => {
    elements.push(<line key={`root-${r.label}`} x1={x0 + 4} y1={rootY} x2={x0 + colW - 12} y2={rootYs[i]} stroke="var(--muted)" strokeWidth={1.5} />)
  })
  const height = top + leaves.length * rowH
  const resultX = x0 + (depth + 1) * colW - 40
  return (
    <svg className="plot" viewBox={`0 0 560 ${height}`} role="img" aria-label="樹形図">
      {headers?.map((h, d) => (
        <text key={h} className="plot-label" x={x0 + (d + 1) * colW} y={16} textAnchor="middle">
          {h}
        </text>
      ))}
      <circle cx={x0} cy={rootY} r={4} fill="var(--ink-2)" />
      {elements}
      {leaves.map((l, i) => (
        <text key={`r-${i}`} className="plot-tick" x={resultX + 22} y={l.y + 4.5}>
          {`${i + 1}. ${l.path.join(' → ')}`}
        </text>
      ))}
    </svg>
  )
}

/**
 * パスカルの三角形。n 段目の左から r 番目が nCr。
 * 選んだ数が「左上と右上の和」になっていることを色で見せる。
 */
export function PascalTriangle({ rows = 8 }: { rows?: number }) {
  const [n, setN] = useState(4)
  const [r, setR] = useState(2)
  const dx = 52
  const dy = 34
  const cx = 280
  const cells: ReactNode[] = []
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= i; j++) {
      const x = cx + (j - i / 2) * dx
      const y = 22 + i * dy
      const isTarget = i === n && j === r
      const isParent = i === n - 1 && (j === r - 1 || j === r)
      const fill = isTarget ? 'var(--c2)' : isParent ? 'var(--c1)' : 'var(--surface)'
      cells.push(
        <g key={`${i}-${j}`}>
          <rect x={x - 22} y={y - 13} width={44} height={26} rx={7} fill={fill} fillOpacity={isTarget || isParent ? 0.35 : 1} stroke={isTarget ? 'var(--c2)' : isParent ? 'var(--c1)' : 'var(--line)'} strokeWidth={isTarget || isParent ? 2 : 1} />
          <text className={isTarget || isParent ? 'plot-annot' : 'plot-tick'} x={x} y={y + 4.5} textAnchor="middle">
            {combination(i, j)}
          </text>
        </g>,
      )
    }
    cells.push(
      <text key={`row-${i}`} className="plot-tick" x={8} y={22 + i * dy + 4.5}>
        {`n = ${i}`}
      </text>,
    )
  }
  const parents =
    n >= 1 && r >= 1 && r <= n - 1
      ? `= {}_{${n - 1}}C_{${r - 1}} + {}_{${n - 1}}C_{${r}} = ${combination(n - 1, r - 1)} + ${combination(n - 1, r)}`
      : ''
  return (
    <div>
      <svg className="plot" viewBox={`0 0 560 ${32 + rows * dy + 14}`} role="img" aria-label="パスカルの三角形">
        {cells}
      </svg>
      <p className="figure-readout">
        <M>{`{}_{${n}}C_{${r}} = ${combination(n, r)} ${parents}`}</M>　（この段の合計は <M>{`2^{${n}} = ${2 ** n}`}</M>）
      </p>
      <Controls>
        <Slider label="n（段）" value={n} min={0} max={rows} step={1} onChange={(v) => { setN(v); setR((x) => Math.min(x, v)) }} />
        <Slider label="r（左から何番目か、0から数える）" value={r} min={0} max={n} step={1} onChange={setR} />
      </Controls>
    </div>
  )
}

function combinationsOf(n: number, r: number): number[][] {
  const out: number[][] = []
  const rec = (start: number, acc: number[]) => {
    if (acc.length === r) {
      out.push(acc)
      return
    }
    for (let i = start; i < n; i++) rec(i + 1, [...acc, i])
  }
  rec(0, [])
  return out
}

/** n 回中 r 回成功する並び方をすべて並べる（二項分布の準備）。● が成功、○ が失敗 */
export function Arrangements() {
  const [n, setN] = useState(4)
  const [r, setR] = useState(2)
  const list = combinationsOf(n, r)
  const d = 16
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', justifyContent: 'center', padding: '6px 0' }}>
        {list.map((pos, k) => (
          <svg key={k} width={n * (d + 4)} height={d + 6} viewBox={`0 0 ${n * (d + 4)} ${d + 6}`} role="img" aria-label={`並び方${k + 1}`}>
            {Array.from({ length: n }, (_, i) => (
              <circle
                key={i}
                cx={i * (d + 4) + d / 2 + 2}
                cy={d / 2 + 3}
                r={d / 2}
                fill={pos.includes(i) ? 'var(--c1)' : 'var(--surface)'}
                stroke={pos.includes(i) ? 'var(--c1)' : 'var(--muted)'}
                strokeWidth={1.5}
              />
            ))}
          </svg>
        ))}
      </div>
      <p className="figure-readout">
        {n} 回中 {r} 回成功する並び方は <strong>{list.length} 通り</strong> = <M>{`{}_{${n}}C_{${r}} = ${combination(n, r)}`}</M>
      </p>
      <p className="figure-readout small">● = 成功、○ = 失敗。左から1回目、2回目…</p>
      <Controls>
        <Slider label="回数 n" value={n} min={1} max={7} step={1} onChange={(v) => { setN(v); setR((x) => Math.min(x, v)) }} />
        <Slider label="成功の回数 r" value={r} min={0} max={n} step={1} onChange={setR} />
      </Controls>
    </div>
  )
}
