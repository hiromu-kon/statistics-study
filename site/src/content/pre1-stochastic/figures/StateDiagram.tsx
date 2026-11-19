import { useId } from 'react'
import { colorVar } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import type { ChainSpec } from './chains'

// 状態遷移図。共通の Plot は座標軸のある図のための部品なので、円と矢印だけの図はここで直接 SVG に描く。

const R = 30

type Vec = { x: number; y: number }
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k })
const rot = (a: Vec, t: number): Vec => ({ x: a.x * Math.cos(t) - a.y * Math.sin(t), y: a.x * Math.sin(t) + a.y * Math.cos(t) })
const unit = (a: Vec): Vec => {
  const l = Math.hypot(a.x, a.y)
  return l === 0 ? { x: 0, y: -1 } : { x: a.x / l, y: a.y / l }
}

const fmtP = (p: number) => String(round(p, 2))

const haloStyle = { paintOrder: 'stroke' as const, stroke: 'var(--surface)', strokeWidth: 4, strokeLinejoin: 'round' as const }

export function StateDiagram({
  chain,
  dist,
  width = 420,
  height = 330,
}: {
  chain: ChainSpec
  /** 各状態にいる確率。円の濃さと、円の下の数字で表す */
  dist?: number[]
  width?: number
  height?: number
}) {
  const id = useId().replace(/:/g, '')
  const { labels, P, pos, colors } = chain
  const n = labels.length
  const center = mul(pos.reduce(add, { x: 0, y: 0 }), 1 / n)

  const edges: { d: string; label: Vec; p: number; key: string }[] = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const p = P[i][j]
      if (p <= 0) continue
      if (i === j) {
        const v = unit({ x: pos[i].x - center.x, y: pos[i].y - center.y })
        const s = add(pos[i], mul(rot(v, -0.55), R))
        const e = add(pos[i], mul(rot(v, 0.55), R + 4))
        const c1 = add(pos[i], mul(rot(v, -0.7), R * 2.5))
        const c2 = add(pos[i], mul(rot(v, 0.7), R * 2.5))
        edges.push({
          d: `M${s.x},${s.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${e.x},${e.y}`,
          label: add(pos[i], mul(v, R * 2.35)),
          p,
          key: `${i}-${j}`,
        })
        continue
      }
      const u = unit({ x: pos[j].x - pos[i].x, y: pos[j].y - pos[i].y })
      const nv = { x: -u.y, y: u.x }
      // 逆向きの矢印もあるときは、2本が重ならないように左右にふくらませる
      const curved = P[j][i] > 0
      const a = curved ? 0.4 : 0
      const s = add(pos[i], add(mul(u, R * Math.cos(a)), mul(nv, R * Math.sin(a))))
      const e = add(pos[j], add(mul(u, -(R + 4) * Math.cos(a)), mul(nv, (R + 4) * Math.sin(a))))
      const mid = mul(add(s, e), 0.5)
      const c = add(mid, mul(nv, curved ? 28 : 0))
      const onCurve = add(add(mul(s, 0.25), mul(c, 0.5)), mul(e, 0.25))
      edges.push({ d: `M${s.x},${s.y} Q${c.x},${c.y} ${e.x},${e.y}`, label: add(onCurve, mul(nv, 12)), p, key: `${i}-${j}` })
    }
  }

  return (
    <svg className="plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="状態遷移図" style={{ maxWidth: width + 40 }}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-2)" />
        </marker>
      </defs>
      {edges.map((e) => (
        <path key={e.key} d={e.d} fill="none" stroke="var(--ink-2)" strokeWidth={1.6} markerEnd={`url(#${id})`} />
      ))}
      {edges.map((e) => (
        <text key={`t${e.key}`} className="plot-annot" x={e.label.x} y={e.label.y + 4} textAnchor="middle" style={haloStyle}>
          {fmtP(e.p)}
        </text>
      ))}
      {labels.map((label, i) => {
        const prob = dist?.[i]
        return (
          <g key={label}>
            <circle
              cx={pos[i].x}
              cy={pos[i].y}
              r={R}
              fill={colorVar(colors[i])}
              fillOpacity={prob === undefined ? 0.18 : 0.1 + 0.75 * prob}
              stroke={colorVar(colors[i])}
              strokeWidth={2.5}
            />
            <text className="plot-annot" x={pos[i].x} y={pos[i].y + (prob === undefined ? 5 : -2)} textAnchor="middle" style={haloStyle}>
              {label}
            </text>
            {prob !== undefined && (
              <text className="plot-annot" x={pos[i].x} y={pos[i].y + 15} textAnchor="middle" style={haloStyle}>
                {round(prob, 3)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
