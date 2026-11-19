import { useId } from 'react'

const box = { w: 150, h: 44 }

function Node({ cx, cy, label, color }: { cx: number; cy: number; label: string; color: string }) {
  return (
    <g>
      <rect x={cx - box.w / 2} y={cy - box.h / 2} width={box.w} height={box.h} rx={10} fill="var(--surface)" stroke={color} strokeWidth={2.5} />
      <text x={cx} y={cy + 5} textAnchor="middle" className="plot-annot" style={{ fill: 'var(--ink)', fontSize: 15 }}>
        {label}
      </text>
    </g>
  )
}

/**
 * 第3の変数 z が x と y の両方に影響していると、x と y の間に因果がなくても相関が出る、という関係図。
 * 座標軸のない図なので Plot は使わずに SVG で描いている。
 */
export function CausalDiagram({ z, x, y }: { z: string; x: string; y: string }) {
  const id = useId().replace(/:/g, '')
  const zc = { cx: 280, cy: 40 }
  const xc = { cx: 110, cy: 190 }
  const yc = { cx: 450, cy: 190 }
  return (
    <svg className="plot" viewBox="0 0 560 230" role="img" aria-label={`${z} が ${x} と ${y} の両方に影響している図`}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--c1)" />
        </marker>
      </defs>
      <line x1={zc.cx - 40} y1={zc.cy + box.h / 2} x2={xc.cx + 30} y2={xc.cy - box.h / 2 - 4} stroke="var(--c1)" strokeWidth={3} markerEnd={`url(#${id})`} />
      <line x1={zc.cx + 40} y1={zc.cy + box.h / 2} x2={yc.cx - 30} y2={yc.cy - box.h / 2 - 4} stroke="var(--c1)" strokeWidth={3} markerEnd={`url(#${id})`} />
      <line x1={xc.cx + box.w / 2} y1={xc.cy} x2={yc.cx - box.w / 2} y2={yc.cy} stroke="var(--c5)" strokeWidth={2.5} strokeDasharray="7 5" />
      <text x={280} y={182} textAnchor="middle" className="plot-annot" style={{ fill: 'var(--c5)' }}>
        相関はあるが、直接の因果はない
      </text>
      <text x={150} y={110} textAnchor="end" className="plot-annot" style={{ fill: 'var(--c1)' }}>
        影響する
      </text>
      <text x={410} y={110} textAnchor="start" className="plot-annot" style={{ fill: 'var(--c1)' }}>
        影響する
      </text>
      <Node {...zc} label={z} color="var(--c1)" />
      <Node {...xc} label={x} color="var(--c2)" />
      <Node {...yc} label={y} color="var(--c2)" />
    </svg>
  )
}
