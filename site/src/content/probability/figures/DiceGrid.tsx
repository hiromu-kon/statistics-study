import { colorVar, type Color } from '../../../components/charts/Plot'

const CELL = 40
const LEFT = 52
const TOP = 40

/**
 * サイコロ2個の出方 36 通りを 6×6 のマスで並べた図。
 * 横が1個目の目、縦が2個目の目。color が返した色でマスを塗る。
 */
export function DiceGrid({
  color,
  text,
  ariaLabel,
}: {
  /** 1個目の目 a、2個目の目 b のマスを塗る色。塗らないなら null */
  color: (a: number, b: number) => Color | null
  /** マスに書く文字。省略すると目の組 "a,b" */
  text?: (a: number, b: number) => string
  ariaLabel?: string
}) {
  const faces = [1, 2, 3, 4, 5, 6]
  const size = CELL * 6
  return (
    <svg className="plot" viewBox={`0 0 ${LEFT + size + 12} ${TOP + size + 12}`} role="img" aria-label={ariaLabel} style={{ maxWidth: 360, margin: '0 auto' }}>
      <text className="plot-label" x={LEFT + size / 2} y={14} textAnchor="middle">
        1個目の目 →
      </text>
      <text className="plot-label" x={14} y={TOP + size / 2} textAnchor="middle" transform={`rotate(-90 14 ${TOP + size / 2})`}>
        2個目の目 →
      </text>
      {faces.map((a) => (
        <text key={`ha${a}`} className="plot-tick" x={LEFT + (a - 0.5) * CELL} y={TOP - 8} textAnchor="middle">
          {a}
        </text>
      ))}
      {faces.map((b) => (
        <text key={`hb${b}`} className="plot-tick" x={LEFT - 10} y={TOP + (b - 0.5) * CELL + 4} textAnchor="end">
          {b}
        </text>
      ))}
      {faces.flatMap((a) =>
        faces.map((b) => {
          const c = color(a, b)
          const x = LEFT + (a - 1) * CELL
          const y = TOP + (b - 1) * CELL
          return (
            <g key={`${a}-${b}`}>
              <rect
                x={x + 1}
                y={y + 1}
                width={CELL - 2}
                height={CELL - 2}
                rx={4}
                fill={c ? colorVar(c) : 'transparent'}
                fillOpacity={c ? 0.55 : 0}
                stroke={colorVar('muted')}
                strokeOpacity={0.5}
              />
              <text className="plot-tick" x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" style={c ? { fill: colorVar('ink') } : undefined}>
                {text ? text(a, b) : `${a},${b}`}
              </text>
            </g>
          )
        }),
      )}
    </svg>
  )
}
