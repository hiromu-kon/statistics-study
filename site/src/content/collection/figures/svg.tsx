import type { CSSProperties, ReactNode } from 'react'
import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

// この章の図で使う小さな描画部品。
// 共通の <Label> は fill を属性で渡しているが、.plot-annot の CSS（fill: var(--ink)）が優先されて色が付かないため、
// 色付きの文字は style で fill を指定するこの章専用の部品で描く。

/** 折れ線（データ座標）。dots で各点に丸を付ける */
export function Line({
  data,
  color = 'c1',
  width = 2.5,
  dashed,
  dots,
  opacity = 1,
}: {
  data: { x: number; y: number }[]
  color?: Color
  width?: number
  dashed?: boolean
  dots?: boolean
  opacity?: number
}) {
  const s = usePlot()
  const pts = data.map((d) => `${s.x(d.x).toFixed(2)},${s.y(d.y).toFixed(2)}`).join(' ')
  return (
    <g opacity={opacity}>
      <polyline
        points={pts}
        fill="none"
        stroke={colorVar(color)}
        strokeWidth={width}
        strokeDasharray={dashed ? '6 5' : undefined}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {dots && data.map((d, i) => <circle key={i} cx={s.x(d.x)} cy={s.y(d.y)} r={4} fill={colorVar(color)} />)}
    </g>
  )
}

/** データ座標に置く色付きの文字 */
export function Txt({
  x,
  y,
  children,
  color = 'ink',
  anchor = 'middle',
  dy = 0,
  size = 13,
  weight = 600,
}: {
  x: number
  y: number
  children: ReactNode
  color?: Color
  anchor?: 'start' | 'middle' | 'end'
  dy?: number
  size?: number
  weight?: number
}) {
  const s = usePlot()
  return (
    <text x={s.x(x)} y={s.y(y) + dy} textAnchor={anchor} style={textStyle(color, size, weight)}>
      {children}
    </text>
  )
}

function textStyle(color: Color, size = 13, weight = 600): CSSProperties {
  return { fill: colorVar(color), fontSize: size, fontWeight: weight, fontFamily: 'var(--font)' }
}

/**
 * 座標軸のいらない図（因果の矢印図、区画図など）の土台。
 * <Plot> は必ず横軸を描くので、軸が邪魔になる図はこちらで描く。
 */
export function Diagram({ width, height, children, ariaLabel }: { width: number; height: number; children: ReactNode; ariaLabel?: string }) {
  return (
    <svg className="plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
      {children}
    </svg>
  )
}

/** Diagram の中で使う、ピクセル座標の文字 */
export function DText({
  x,
  y,
  children,
  color = 'ink',
  anchor = 'middle',
  size = 13,
  weight = 600,
}: {
  x: number
  y: number
  children: ReactNode
  color?: Color
  anchor?: 'start' | 'middle' | 'end'
  size?: number
  weight?: number
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" style={textStyle(color, size, weight)}>
      {children}
    </text>
  )
}

/** Diagram の中で使う矢印 */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = 'ink',
  width = 2,
  dashed,
  id,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: Color
  width?: number
  dashed?: boolean
  /** 図の中で一意な id（矢じりの marker に使う） */
  id: string
}) {
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={colorVar(color)} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={colorVar(color)}
        strokeWidth={width}
        strokeDasharray={dashed ? '6 5' : undefined}
        markerEnd={`url(#${id})`}
      />
    </g>
  )
}

/** ボタンを並べて選ぶ。選ばれているものは primary で表示 */
export function Choice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`btn ${o.value === value ? 'btn-primary' : 'btn-default'}`}
          onClick={() => onChange(o.value)}
          aria-pressed={o.value === value}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
