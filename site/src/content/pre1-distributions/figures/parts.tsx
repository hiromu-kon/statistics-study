import { useId, type ReactNode } from 'react'
import { Button } from '../../../components/blocks'
import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

// 種々の確率分布の章の図で共通に使う小さな部品。
// 他の章の figures/ にも似た部品があるが、章どうしの依存を作らないためにこの章の中に置く。

/** データ座標の折れ線 */
export function Polyline({
  points,
  color = 'c1',
  width = 2,
  dashed,
  opacity = 1,
}: {
  points: { x: number; y: number }[]
  color?: Color
  width?: number
  dashed?: boolean
  opacity?: number
}) {
  const s = usePlot()
  return (
    <polyline
      points={points.map((p) => `${s.x(p.x).toFixed(2)},${s.y(p.y).toFixed(2)}`).join(' ')}
      fill="none"
      stroke={colorVar(color)}
      strokeWidth={width}
      strokeDasharray={dashed ? '6 5' : undefined}
      strokeLinejoin="round"
      opacity={opacity}
    />
  )
}

/** いくつかの選択肢から1つを選ぶボタンの列 */
export function Choice<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <>
      {options.map((o) => (
        <Button key={String(o.value)} variant={o.value === value ? 'primary' : 'default'} onClick={() => onChange(o.value)}>
          {o.label}
        </Button>
      ))}
    </>
  )
}

// ---------- 関係図（箱と矢印） ----------

export type DiagramNode = { label: string; x: number; y: number; accent?: boolean }
export type DiagramEdge = { from: string; to: string; label: string; dashed?: boolean; dy?: number; dx?: number }

const BOX_W = 104
const BOX_H = 34

/** 2つの箱の中心を結ぶ線を、箱の縁で切る */
function clipToBoxes(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const tx = dx === 0 ? Infinity : (BOX_W / 2 + 4) / Math.abs(dx)
  const ty = dy === 0 ? Infinity : (BOX_H / 2 + 4) / Math.abs(dy)
  const t = Math.min(tx, ty)
  return { x1: from.x + dx * t, y1: from.y + dy * t, x2: to.x - dx * t, y2: to.y - dy * t }
}

/** 分布どうしの関係を箱と矢印で描く。onSelect を渡すと箱を押せる */
export function RelationDiagram({
  nodes,
  edges,
  height,
  selected,
  onSelect,
  ariaLabel,
}: {
  nodes: Record<string, DiagramNode>
  edges: DiagramEdge[]
  height: number
  selected?: string
  onSelect?: (id: string) => void
  ariaLabel: string
}) {
  const uid = useId()
  const markerId = `rel-arrow-${uid.replace(/:/g, '')}`
  return (
    <svg className="plot" viewBox={`0 0 560 ${height}`} role="img" aria-label={ariaLabel}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--muted)" />
        </marker>
      </defs>
      {edges.map((e) => {
        const a = nodes[e.from]
        const b = nodes[e.to]
        const l = clipToBoxes(a, b)
        const mx = (l.x1 + l.x2) / 2
        const my = (l.y1 + l.y2) / 2
        const vertical = Math.abs(a.x - b.x) < 1
        return (
          <g key={`${e.from}-${e.to}`}>
            <line
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="var(--muted)"
              strokeWidth={1.8}
              strokeDasharray={e.dashed ? '5 4' : undefined}
              markerEnd={`url(#${markerId})`}
            />
            <text
              className="plot-annot"
              x={(vertical ? mx + 8 : mx) + (e.dx ?? 0)}
              y={vertical ? my + 4 : my + (e.dy ?? -7)}
              textAnchor={vertical ? 'start' : 'middle'}
              style={{ fontSize: 11, fill: 'var(--ink-2)' }}
            >
              {e.label}
            </text>
          </g>
        )
      })}
      {Object.entries(nodes).map(([id, n]) => {
        const active = id === selected
        return (
          <g key={id} onClick={onSelect ? () => onSelect(id) : undefined} style={onSelect ? { cursor: 'pointer' } : undefined}>
            <rect
              x={n.x - BOX_W / 2}
              y={n.y - BOX_H / 2}
              width={BOX_W}
              height={BOX_H}
              rx={8}
              fill={active ? 'var(--accent-soft)' : 'var(--surface)'}
              stroke={n.accent ? 'var(--c2)' : 'var(--c1)'}
              strokeWidth={active ? 3 : 1.8}
            />
            <text x={n.x} y={n.y + 5} textAnchor="middle" style={{ fontSize: 14, fill: 'var(--ink)', fontWeight: active ? 700 : 400 }}>
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
