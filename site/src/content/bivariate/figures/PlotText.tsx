import type { ReactNode } from 'react'
import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

/**
 * データ座標に色つきの文字を置く。
 * 共通の Label は fill 属性で色を指定しているが、.plot-annot の CSS の fill が優先されて色が消えるため、
 * style で指定するこの部品を章内で使う。
 */
export function PlotText({
  x,
  y,
  children,
  color = 'ink',
  anchor = 'middle',
  dx = 0,
  dy = 0,
  size,
}: {
  x: number
  y: number
  children: ReactNode
  color?: Color
  anchor?: 'start' | 'middle' | 'end'
  dx?: number
  dy?: number
  size?: number
}) {
  const s = usePlot()
  return (
    <text
      className="plot-annot"
      x={s.x(x) + dx}
      y={s.y(y) + dy}
      textAnchor={anchor}
      style={{ fill: colorVar(color), fontSize: size }}
    >
      {children}
    </text>
  )
}
