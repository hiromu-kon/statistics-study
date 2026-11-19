import type { ReactNode } from 'react'
import { Button } from '../../../components/blocks'
import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

// 「確率と確率変数」（準1級）の図で共通に使う小さな部品。

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

/** データ座標の長方形（塗りつぶし） */
export function Rect({
  x0,
  x1,
  y0,
  y1,
  color = 'c1',
  opacity = 0.3,
}: {
  x0: number
  x1: number
  y0: number
  y1: number
  color?: Color
  opacity?: number
}) {
  const s = usePlot()
  const left = Math.min(s.x(x0), s.x(x1))
  const top = Math.min(s.y(y0), s.y(y1))
  return (
    <rect
      x={left}
      y={top}
      width={Math.abs(s.x(x1) - s.x(x0))}
      height={Math.abs(s.y(y1) - s.y(y0))}
      fill={colorVar(color)}
      opacity={opacity}
    />
  )
}
