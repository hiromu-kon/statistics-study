import { useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { Curve, HLine, Plot, Points } from '../../../components/charts/Plot'
import { linearRegression, round } from '../../../lib/stats'
import { extent, growthData } from './data'

/** 上に散布図と回帰直線、下にその残差プロット（横軸 x、縦軸 残差）を並べる */
export function ResidualPlot({
  xs,
  ys,
  xLabel = 'x',
  yLabel = 'y',
  width = 560,
  yTickFormat,
}: {
  xs: number[]
  ys: number[]
  xLabel?: string
  yLabel?: string
  width?: number
  yTickFormat?: (v: number) => string
}) {
  const { a, b } = linearRegression(xs, ys)
  const res = ys.map((y, i) => y - (a + b * xs[i]))
  const m = Math.max(...res.map(Math.abs)) * 1.2
  const xd = extent(xs)
  return (
    <div>
      <Plot x={xd} y={extent(ys)} width={width} height={240} yLabel={yLabel} yTickFormat={yTickFormat}>
        <Curve f={(t) => a + b * t} color="c2" width={2.5} />
        <Points data={xs.map((x, i) => ({ x, y: ys[i] }))} r={4.5} />
      </Plot>
      <Plot x={xd} y={[-m, m]} width={width} height={180} xLabel={xLabel} yLabel="残差" yTickFormat={yTickFormat}>
        <HLine y={0} color="c2" dashed={false} />
        <Points data={xs.map((x, i) => ({ x, y: res[i] }))} r={4.5} color="c4" />
      </Plot>
    </div>
  )
}

/** 会員数の増え方のデータを、そのままと「縦軸を対数にしたもの」で切りかえて比べる図 */
export function LogTransformPlot() {
  const [log, setLog] = useState(false)
  const { xs, ys } = growthData
  const shown = log ? ys.map((y) => Math.log10(y)) : ys
  const { r2 } = linearRegression(xs, shown)
  return (
    <div>
      <Controls>
        <Button variant={log ? 'default' : 'primary'} onClick={() => setLog(false)}>
          そのまま（会員数）
        </Button>
        <Button variant={log ? 'primary' : 'default'} onClick={() => setLog(true)}>
          縦軸を log₁₀（会員数）にする
        </Button>
      </Controls>
      <ResidualPlot
        xs={xs}
        ys={shown}
        xLabel="サービス開始からの月数"
        yLabel={log ? 'log₁₀（会員数）' : '会員数（人）'}
        yTickFormat={log ? (v) => v.toFixed(2) : undefined}
      />
      <p className="figure-readout">
        直線をあてはめたときの決定係数 R² = <strong>{round(r2, 3)}</strong>
      </p>
    </div>
  )
}
