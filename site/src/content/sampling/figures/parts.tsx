import type { ReactNode } from 'react'
import { Button } from '../../../components/blocks'
import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

// 標本分布・推定の章の図で共通に使う小さな部品。

/**
 * 色つきの文字。
 * 共通の Label に色が付かなかった時期に作った部品。今は Label でも同じ表示になるが、
 * この章の図はこの部品で位置を調整しているので置き換えていない。
 */
export function Text({
  x,
  y,
  children,
  color = 'ink',
  anchor = 'middle',
  dy = 0,
  dx = 0,
}: {
  x: number
  y: number
  children: ReactNode
  color?: Color
  anchor?: 'start' | 'middle' | 'end'
  dy?: number
  dx?: number
}) {
  const s = usePlot()
  return (
    <text className="plot-annot" x={s.x(x) + dx} y={s.y(y) + dy} textAnchor={anchor} style={{ fill: colorVar(color) }}>
      {children}
    </text>
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

/** 縦線（ラベルの色が効く版）。from/to で縦方向の範囲をデータ座標で指定できる */
export function Marker({
  x,
  color = 'c2',
  label,
  dashed = true,
  from,
  to,
  labelY,
  anchor = 'start',
}: {
  x: number
  color?: Color
  label?: string
  dashed?: boolean
  from?: number
  to?: number
  /** ラベルを置く高さ（データ座標）。省略すると上端 */
  labelY?: number
  anchor?: 'start' | 'middle' | 'end'
}) {
  const s = usePlot()
  const y1 = from === undefined ? s.bottom : s.y(from)
  const y2 = to === undefined ? s.top : s.y(to)
  const ly = labelY === undefined ? s.top + 12 : s.y(labelY)
  const lx = s.x(x) + (anchor === 'start' ? 5 : anchor === 'end' ? -5 : 0)
  return (
    <g>
      <line x1={s.x(x)} x2={s.x(x)} y1={y1} y2={y2} stroke={colorVar(color)} strokeWidth={2} strokeDasharray={dashed ? '6 4' : undefined} />
      {label && (
        <text className="plot-annot" x={lx} y={ly} textAnchor={anchor} style={{ fill: colorVar(color) }}>
          {label}
        </text>
      )}
    </g>
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
