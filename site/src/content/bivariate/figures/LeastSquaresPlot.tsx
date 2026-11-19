import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Curve, Plot, Points, Segment, colorVar, usePlot } from '../../../components/charts/Plot'
import { linearRegression, mean, round, sum } from '../../../lib/stats'

/** 各点から直線までの縦の距離（残差）と、それを1辺とする正方形（面積 = 残差の2乗） */
function ResidualSquares({ xs, ys, f }: { xs: number[]; ys: number[]; f: (x: number) => number }) {
  const s = usePlot()
  return (
    <g>
      {xs.map((x, i) => {
        const top = Math.min(s.y(ys[i]), s.y(f(x)))
        const side = Math.abs(s.y(ys[i]) - s.y(f(x)))
        return (
          <rect
            key={i}
            x={s.x(x)}
            y={top}
            width={side}
            height={side}
            fill={colorVar('c5')}
            fillOpacity={0.15}
            stroke={colorVar('c5')}
            strokeOpacity={0.6}
          />
        )
      })}
    </g>
  )
}

/**
 * 直線の傾きと高さを動かして、残差の2乗和（赤い正方形の面積の合計）がいちばん小さくなる直線を探す図。
 * 2つめのスライダーは切片ではなく「x の平均の位置での高さ」にしている。
 * 切片（x = 0 の高さ）はデータから遠く、切片を固定して傾きを変えると直線がデータから大きく外れて探しにくいため。
 */
export function LeastSquaresPlot({ xs, ys, xLabel, yLabel }: { xs: number[]; ys: number[]; xLabel: string; yLabel: string }) {
  const mx = mean(xs)
  const best = linearRegression(xs, ys)
  const bestHeight = best.a + best.b * mx
  const [b, setB] = useState(2)
  const [h, setH] = useState(95)
  const a = h - b * mx
  const f = (x: number) => a + b * x
  const sse = sum(xs.map((x, i) => (ys[i] - f(x)) ** 2))
  const minSse = sum(xs.map((x, i) => (ys[i] - (best.a + best.b * x)) ** 2))
  return (
    <div>
      <Plot x={[20, 33]} y={[60, 140]} height={360} xLabel={xLabel} yLabel={yLabel} xTicks={[20, 22, 24, 26, 28, 30, 32]}>
        <ResidualSquares xs={xs} ys={ys} f={f} />
        <Curve f={f} color="c1" width={3} />
        {xs.map((x, i) => (
          <Segment key={i} x1={x} y1={ys[i]} x2={x} y2={f(x)} color="c5" width={2} />
        ))}
        <Points data={xs.map((x, i) => ({ x, y: ys[i] }))} r={6} color="ink" opacity={0.9} />
      </Plot>
      <p className="figure-readout">
        直線：ŷ = {round(a, 1)} + {round(b, 1)}x　　残差の2乗和 = <strong>{round(sse, 1)}</strong>（いちばん小さくて {round(minSse, 1)}）
      </p>
      <Controls>
        <Slider label="傾き b" value={b} min={0} max={10} step={0.1} onChange={setB} format={(v) => v.toFixed(1)} />
        <Slider label={`高さ（x = ${mx} での ŷ）`} value={h} min={80} max={120} step={0.5} onChange={setH} format={(v) => v.toFixed(1)} />
        <Button
          onClick={() => {
            setB(round(best.b, 1))
            setH(round(bestHeight, 1))
          }}
        >
          最小二乗法の答えにする
        </Button>
      </Controls>
    </div>
  )
}
