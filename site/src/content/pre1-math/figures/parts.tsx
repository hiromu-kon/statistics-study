import type { ReactNode } from 'react'
import { Button } from '../../../components/blocks'
import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

// 数学の準備（準1級）の章の図で共通に使う小さな部品。
// 共通の Plot には多角形と長方形がないため、この章の中に置いている。

/** データ座標の折れ線（等高線・楕円など） */
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

/** データ座標の塗った多角形（平行四辺形など） */
export function Polygon({
  points,
  color = 'c1',
  opacity = 0.25,
  stroke,
}: {
  points: { x: number; y: number }[]
  color?: Color
  opacity?: number
  stroke?: Color
}) {
  const s = usePlot()
  const d = points.map((p) => `${s.x(p.x).toFixed(2)},${s.y(p.y).toFixed(2)}`).join(' ')
  return (
    <g>
      <polygon points={d} fill={colorVar(color)} opacity={opacity} />
      {stroke && <polygon points={d} fill="none" stroke={colorVar(stroke)} strokeWidth={1.5} />}
    </g>
  )
}

/** データ座標の長方形（x0〜x1, y0〜y1） */
export function Rect({
  x0,
  x1,
  y0,
  y1,
  color = 'c1',
  opacity = 0.3,
  stroke,
}: {
  x0: number
  x1: number
  y0: number
  y1: number
  color?: Color
  opacity?: number
  stroke?: Color
}) {
  const s = usePlot()
  const left = Math.min(s.x(x0), s.x(x1))
  const top = Math.min(s.y(y0), s.y(y1))
  const w = Math.abs(s.x(x1) - s.x(x0))
  const h = Math.abs(s.y(y1) - s.y(y0))
  return (
    <rect
      x={left}
      y={top}
      width={w}
      height={h}
      fill={colorVar(color)}
      fillOpacity={opacity}
      stroke={stroke ? colorVar(stroke) : 'none'}
      strokeWidth={stroke ? 1.5 : 0}
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
