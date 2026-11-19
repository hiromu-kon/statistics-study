import { useId } from 'react'
import { colorVar, type Color } from '../../../components/charts/Plot'

export type VennShade = 'none' | 'A' | 'B' | 'union' | 'intersection' | 'notA' | 'onlyA'

/**
 * 全体（標本空間）の四角と、事象 A・B の円。shade で塗る部分を選ぶ。
 * disjoint にすると、A と B が重ならない（排反な）図になる。
 */
export function VennDiagram({
  shade,
  disjoint = false,
  color = 'c1',
  ariaLabel,
}: {
  shade: VennShade
  disjoint?: boolean
  color?: Color
  ariaLabel?: string
}) {
  const id = useId().replace(/:/g, '')
  const a = disjoint ? { cx: 78, cy: 92, r: 46 } : { cx: 104, cy: 92, r: 56 }
  const b = disjoint ? { cx: 182, cy: 92, r: 46 } : { cx: 156, cy: 92, r: 56 }
  const fill = colorVar(color)
  const box = { x: 8, y: 8, w: 244, h: 166 }
  return (
    <svg className="plot" viewBox="0 0 260 182" role="img" aria-label={ariaLabel}>
      <defs>
        <clipPath id={`${id}-a`}>
          <circle {...a} />
        </clipPath>
        <mask id={`${id}-notA`}>
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="white" />
          <circle {...a} fill="black" />
        </mask>
        <mask id={`${id}-onlyA`}>
          <circle {...a} fill="white" />
          <circle {...b} fill="black" />
        </mask>
      </defs>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill="none" stroke={colorVar('ink')} strokeWidth={1.5} />
      <g opacity={0.45}>
        {shade === 'A' && <circle {...a} fill={fill} />}
        {shade === 'B' && <circle {...b} fill={fill} />}
        {shade === 'union' && (
          <>
            <circle {...a} fill={fill} />
            <circle {...b} fill={fill} />
          </>
        )}
        {shade === 'intersection' && <circle {...b} fill={fill} clipPath={`url(#${id}-a)`} />}
        {shade === 'notA' && <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill={fill} mask={`url(#${id}-notA)`} />}
        {shade === 'onlyA' && <circle {...a} fill={fill} mask={`url(#${id}-onlyA)`} />}
      </g>
      <circle {...a} fill="none" stroke={colorVar('ink')} strokeWidth={2} />
      <circle {...b} fill="none" stroke={colorVar('ink')} strokeWidth={2} />
      <text className="plot-annot" x={a.cx - a.r * 0.45} y={a.cy + 5} textAnchor="middle">
        A
      </text>
      <text className="plot-annot" x={b.cx + b.r * 0.45} y={b.cy + 5} textAnchor="middle">
        B
      </text>
      <text className="plot-tick" x={box.x + 8} y={box.y + 16}>
        全体（標本空間）
      </text>
    </svg>
  )
}
