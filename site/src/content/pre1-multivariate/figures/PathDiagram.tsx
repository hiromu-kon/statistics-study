import { useId } from 'react'

// パス図（因果図）。座標軸のない図なので Plot は使わずに SVG で描く。
// 潜在変数は楕円、観測変数は四角、誤差は小さな円、という SEM の慣習に合わせている。

export type PathNode = {
  id: string
  label: string
  x: number
  y: number
  kind: 'latent' | 'observed' | 'error'
  /** 観測されない交絡などを点線で描く */
  dashed?: boolean
}

export type PathEdge = {
  from: string
  to: string
  label?: string
  /** double は両向きの矢印（相関・共分散） */
  kind?: 'single' | 'double'
  dashed?: boolean
  color?: 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'muted' | 'ink'
  /** ラベルを線のどちら側に寄せるか（線の向きに対して左が正） */
  labelSide?: number
}

const SIZE = {
  latent: { w: 128, h: 50 },
  observed: { w: 104, h: 40 },
  error: { w: 32, h: 32 },
}

/** 図形の中心から向き (dx, dy) に進んだとき、図形の縁に当たる点までの倍率 */
function edgeT(n: PathNode, dx: number, dy: number): number {
  const { w, h } = SIZE[n.kind]
  if (n.kind === 'observed') return Math.min(w / 2 / Math.abs(dx || 1e-9), h / 2 / Math.abs(dy || 1e-9))
  return 1 / Math.sqrt((dx / (w / 2)) ** 2 + (dy / (h / 2)) ** 2)
}

export function PathDiagram({ nodes, edges, width = 560, height = 300, ariaLabel }: { nodes: PathNode[]; edges: PathEdge[]; width?: number; height?: number; ariaLabel: string }) {
  const id = useId().replace(/:/g, '')
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const colors = ['c1', 'c2', 'c3', 'c4', 'c5', 'muted', 'ink'] as const
  return (
    <svg className="plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
      <defs>
        {colors.map((c) => (
          <marker key={c} id={`${id}-${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={`var(--${c})`} />
          </marker>
        ))}
      </defs>
      {edges.map((e, i) => {
        const a = byId.get(e.from)!
        const b = byId.get(e.to)!
        const color = e.color ?? 'ink'
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy)
        const ux = dx / len
        const uy = dy / len
        // 左向きの法線（ラベルや曲線のふくらみの向き）
        const nx = uy
        const ny = -ux
        const marker = `url(#${id}-${color})`
        if (e.kind === 'double') {
          const bend = 40 * (e.labelSide ?? 1)
          const cx = (a.x + b.x) / 2 + nx * bend
          const cy = (a.y + b.y) / 2 + ny * bend
          const ta = edgeT(a, cx - a.x, cy - a.y)
          const tb = edgeT(b, cx - b.x, cy - b.y)
          const sx = a.x + (cx - a.x) * ta
          const sy = a.y + (cy - a.y) * ta
          const ex = b.x + (cx - b.x) * tb
          const ey = b.y + (cy - b.y) * tb
          return (
            <g key={i}>
              <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" stroke={`var(--${color})`} strokeWidth={2} strokeDasharray={e.dashed ? '6 4' : undefined} markerStart={marker} markerEnd={marker} />
              {e.label && (
                <text x={cx} y={cy + 4} textAnchor="middle" className="plot-annot" style={{ fill: `var(--${color})`, fontWeight: 700 }}>
                  {e.label}
                </text>
              )}
            </g>
          )
        }
        const ta = edgeT(a, ux, uy)
        const tb = edgeT(b, -ux, -uy)
        const x1 = a.x + ux * ta
        const y1 = a.y + uy * ta
        const x2 = b.x - ux * (tb + 2)
        const y2 = b.y - uy * (tb + 2)
        const side = e.labelSide ?? 1
        const lx = (x1 + x2) / 2 + nx * 13 * side
        const ly = (y1 + y2) / 2 + ny * 13 * side
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`var(--${color})`} strokeWidth={2.2} strokeDasharray={e.dashed ? '6 4' : undefined} markerEnd={marker} />
            {e.label && (
              <text x={lx} y={ly + 4} textAnchor="middle" className="plot-annot" style={{ fill: `var(--${color})`, fontWeight: 700 }}>
                {e.label}
              </text>
            )}
          </g>
        )
      })}
      {nodes.map((n) => {
        const { w, h } = SIZE[n.kind]
        const stroke = n.kind === 'latent' ? 'var(--c1)' : n.kind === 'observed' ? 'var(--c2)' : 'var(--muted)'
        const dash = n.dashed ? '6 4' : undefined
        return (
          <g key={n.id}>
            {n.kind === 'observed' ? (
              <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx={4} fill="var(--surface)" stroke={stroke} strokeWidth={2.2} strokeDasharray={dash} />
            ) : (
              <ellipse cx={n.x} cy={n.y} rx={w / 2} ry={h / 2} fill="var(--surface)" stroke={stroke} strokeWidth={2.2} strokeDasharray={dash} />
            )}
            <text x={n.x} y={n.y + 5} textAnchor="middle" className="plot-annot" style={{ fill: 'var(--ink)', fontSize: n.kind === 'error' ? 12 : 14 }}>
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
