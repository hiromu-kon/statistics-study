import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Label, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { simpleFit } from './simpleFit'

/**
 * 散布図と最小二乗法の直線。
 * band を付けると「直線 ± 残差の標準誤差 s」の帯、predict を付けると x を動かして予測値を読むスライダーが出る。
 */
export function FitScatter({
  xs,
  ys,
  x,
  y,
  xLabel,
  yLabel,
  band = false,
  predict,
  unitY = '',
}: {
  xs: number[]
  ys: number[]
  x: [number, number]
  y: [number, number]
  xLabel: string
  yLabel: string
  band?: boolean
  predict?: { min: number; max: number; initial: number; step?: number }
  unitY?: string
}) {
  const fit = simpleFit(xs, ys)
  const [x0, setX0] = useState(predict?.initial ?? x[0])
  const f = (v: number) => fit.a + fit.b * v
  return (
    <div>
      <Plot x={x} y={y} xLabel={xLabel} yLabel={yLabel} height={300}>
        {band && (
          <>
            <Segment x1={x[0]} y1={f(x[0]) + fit.s} x2={x[1]} y2={f(x[1]) + fit.s} color="c3" dashed />
            <Segment x1={x[0]} y1={f(x[0]) - fit.s} x2={x[1]} y2={f(x[1]) - fit.s} color="c3" dashed />
          </>
        )}
        <Segment x1={x[0]} y1={f(x[0])} x2={x[1]} y2={f(x[1])} color="c1" width={2.5} />
        <Points data={xs.map((v, i) => ({ x: v, y: ys[i] }))} r={5} color="ink" opacity={0.6} />
        {predict && (
          <>
            <Segment x1={x0} y1={y[0]} x2={x0} y2={f(x0)} color="c2" dashed />
            <Segment x1={x[0]} y1={f(x0)} x2={x0} y2={f(x0)} color="c2" dashed />
            <Points data={[{ x: x0, y: f(x0) }]} r={7} color="c2" opacity={1} />
            <Label x={x0} y={f(x0)} dy={-12} color="c2" anchor="end">
              {`ŷ = ${round(f(x0), 1)}`}
            </Label>
          </>
        )}
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `ŷ = ${round(fit.a, 3)} + ${round(fit.b, 3)}x` },
          ...(band ? [{ color: 'c3' as const, label: `直線 ± s（s = ${round(fit.s, 3)}）` }] : []),
          ...(predict ? [{ color: 'c2' as const, label: '予測値' }] : []),
        ]}
      />
      {predict && (
        <>
          <p className="figure-readout">
            x = {x0} のとき　ŷ = {round(fit.a, 3)} + {round(fit.b, 3)} × {x0} ≒ <strong>{round(f(x0), 1)}</strong>
            {unitY}
          </p>
          <Controls>
            <Slider label="x の値" value={x0} min={predict.min} max={predict.max} step={predict.step ?? 1} onChange={setX0} />
          </Controls>
        </>
      )}
    </div>
  )
}
