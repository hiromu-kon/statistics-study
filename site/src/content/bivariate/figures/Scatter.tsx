import { Curve, HLine, Plot, Points, VLine, type Color } from '../../../components/charts/Plot'
import { correlation, linearRegression, mean, round } from '../../../lib/stats'
import { extent } from './data'

/**
 * 散布図。平均の線・回帰直線・相関係数の表示をオプションで重ねられる。
 * 点ごとに色を変えたいときは colors に色の配列を渡す。
 */
export function Scatter({
  xs,
  ys,
  x,
  y,
  width = 560,
  height = 300,
  xLabel,
  yLabel,
  colors,
  color = 'c1',
  meanLines = false,
  fitLine = false,
  showR = false,
  r = 5,
  xTicks,
  yTicks,
}: {
  xs: number[]
  ys: number[]
  x?: [number, number]
  y?: [number, number]
  width?: number
  height?: number
  xLabel?: string
  yLabel?: string
  colors?: Color[]
  color?: Color
  meanLines?: boolean
  fitLine?: boolean
  showR?: boolean
  r?: number
  xTicks?: number[]
  yTicks?: number[]
}) {
  const xd = x ?? extent(xs)
  const yd = y ?? extent(ys)
  const fit = linearRegression(xs, ys)
  return (
    <div>
      <Plot x={xd} y={yd} width={width} height={height} xLabel={xLabel} yLabel={yLabel} xTicks={xTicks} yTicks={yTicks}>
        {meanLines && (
          <>
            <VLine x={mean(xs)} color="muted" />
            <HLine y={mean(ys)} color="muted" />
          </>
        )}
        {fitLine && <Curve f={(t) => fit.a + fit.b * t} color="c2" width={2.5} />}
        <Points data={xs.map((v, i) => ({ x: v, y: ys[i], color: colors?.[i] }))} color={color} r={r} />
      </Plot>
      {showR && (
        <p className="figure-readout">
          相関係数 r = <strong>{round(correlation(xs, ys), 2)}</strong>
        </p>
      )}
    </div>
  )
}
