import { HLine, Plot, VLine, colorVar, usePlot, type Color } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

export type Joint = { x: number; y: number; p: number }[]

function Bubbles({ joint, mx, my, scale }: { joint: Joint; mx: number; my: number; scale: number }) {
  const s = usePlot()
  return (
    <g>
      {joint.map((d) => {
        const sign = (d.x - mx) * (d.y - my)
        const c: Color = Math.abs(sign) < 1e-12 ? 'muted' : sign > 0 ? 'c1' : 'c5'
        return (
          <g key={`${d.x},${d.y}`}>
            {d.p > 1e-9 && <circle cx={s.x(d.x)} cy={s.y(d.y)} r={Math.sqrt(d.p) * scale} fill={colorVar(c)} opacity={0.55} />}
            <text className="plot-tick" x={s.x(d.x)} y={s.y(d.y) + 4} textAnchor="middle" style={{ fill: colorVar('ink') }}>
              {round(d.p, 3)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/**
 * 同時分布を「円の面積 = 確率」で描く図。点線は X と Y の期待値。
 * 期待値から見て右上・左下（青）は (x − μx)(y − μy) が正、左上・右下（赤）は負になり、共分散の符号を決める。
 */
export function BubblePlot({
  joint,
  x,
  y,
  xTicks,
  yTicks,
  xLabel = 'X',
  yLabel = 'Y',
  scale = 70,
  ariaLabel,
}: {
  joint: Joint
  x: [number, number]
  y: [number, number]
  xTicks: number[]
  yTicks: number[]
  xLabel?: string
  yLabel?: string
  scale?: number
  ariaLabel?: string
}) {
  const mx = joint.reduce((s, d) => s + d.x * d.p, 0)
  const my = joint.reduce((s, d) => s + d.y * d.p, 0)
  return (
    <Plot x={x} y={y} height={300} xTicks={xTicks} yTicks={yTicks} xLabel={xLabel} yLabel={yLabel} grid={false} ariaLabel={ariaLabel}>
      <VLine x={mx} color="muted" />
      <HLine y={my} color="muted" />
      <Bubbles joint={joint} mx={mx} my={my} scale={scale} />
    </Plot>
  )
}
