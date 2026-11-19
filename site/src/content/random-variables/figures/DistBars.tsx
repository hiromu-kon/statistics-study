import { Bars, Plot, Segment, colorVar, usePlot, type Color } from '../../../components/charts/Plot'
import { expectation, type Dist } from './dist'

/** 棒の上に文字を置く。Plot の Bars の labels は y しか受け取れないので、x ごとの文字はこちらで描く */
function TopLabels({ dist, label }: { dist: Dist; label: (x: number, p: number) => string }) {
  const s = usePlot()
  return (
    <g>
      {dist.map(({ x, p }) => (
        <text key={x} className="plot-tick" x={s.x(x)} y={s.y(p) - 6} textAnchor="middle" style={{ fill: colorVar('ink') }}>
          {label(x, p)}
        </text>
      ))}
    </g>
  )
}

/** 期待値の位置に置く「支点」の三角形。棒の土台（y = 0）の下に描く */
export function Fulcrum({ x, color = 'c2' }: { x: number; color?: Color }) {
  const s = usePlot()
  const cx = s.x(x)
  const top = s.y(0)
  const h = Math.min(16, s.bottom - top)
  return <path d={`M${cx},${top} L${cx - 10},${top + h} L${cx + 10},${top + h} Z`} fill={colorVar(color)} />
}

/**
 * 確率分布の棒グラフ。棒の高さ = その値をとる確率。
 * showMean にすると、期待値の位置に支点（三角形）と線を描き、「釣り合いの点」として見せる。
 */
export function DistBars({
  dist,
  x,
  yMax,
  xTicks,
  xLabel = '値 x',
  label,
  showMean = false,
  color = 'c1',
  highlight,
  barWidth = 0.7,
  height = 240,
  width,
  ariaLabel,
}: {
  dist: Dist
  x: [number, number]
  yMax: number
  xTicks?: number[]
  xLabel?: string
  label?: (x: number, p: number) => string
  showMean?: boolean
  color?: Color
  highlight?: (x: number) => boolean
  barWidth?: number
  height?: number
  /** カードの中など狭い場所では小さくすると、文字が縮みすぎない */
  width?: number
  ariaLabel?: string
}) {
  const m = expectation(dist)
  const yMin = showMean ? -yMax * 0.09 : 0
  const ticks = [0, yMax / 2, yMax].map((v) => Number(v.toFixed(4)))
  return (
    <Plot x={x} y={[yMin, yMax * 1.15]} width={width} height={height} xTicks={xTicks} yTicks={ticks} xLabel={xLabel} yLabel="確率" ariaLabel={ariaLabel}>
      <Bars data={dist.map((d) => ({ x: d.x, y: d.p }))} width={barWidth} color={color} highlight={highlight} />
      {label && <TopLabels dist={dist} label={label} />}
      {showMean && (
        <>
          <Segment x1={x[0]} y1={0} x2={x[1]} y2={0} color="ink" width={2.5} />
          <Segment x1={m} y1={0} x2={m} y2={yMax * 1.1} color="c2" dashed width={2} />
          <Fulcrum x={m} />
        </>
      )}
    </Plot>
  )
}
