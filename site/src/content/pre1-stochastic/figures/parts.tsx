import type { ReactNode } from 'react'
import { Button } from '../../../components/blocks'
import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

// この章の図で共通に使う小さな部品。
// 標本分布の章にも同じような部品があるが、章ごとに並行して書き換えるため、他の章の figures には依存しない。

/** データ座標の折れ線（ランダムウォークや経路を描く） */
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
