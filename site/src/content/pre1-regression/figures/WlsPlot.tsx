import { useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { Legend, Plot, Segment, colorVar, usePlot } from '../../../components/charts/Plot'
import { leastSquares } from './linalg'

// 架空のデータ。本当の直線は y = 5 + 2x で、誤差の標準偏差が x に比例する（x が大きいほどばらつく）ように作った
const wlsData = {
  x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  y: [6.0, 7.4, 8.6, 12.2, 8.1, 16.3, 15.0, 25.3, 28.2, 33.4, 32.1, 28.6, 37.7, 45.6, 29.1],
}

function WeightedPoints({ show }: { show: boolean }) {
  const s = usePlot()
  return (
    <g>
      {wlsData.x.map((x, i) => (
        <circle
          key={i}
          cx={s.x(x)}
          cy={s.y(wlsData.y[i])}
          // 重みは 1/x²。見やすいように半径を重みの平方根（1/x）に比例させる
          r={show ? 3 + 9 / x : 5}
          fill={colorVar('ink')}
          opacity={0.55}
        />
      ))}
    </g>
  )
}

export function WlsPlot() {
  const [showWeights, setShowWeights] = useState(true)
  const X = wlsData.x.map((x) => [1, x])
  const ols = leastSquares(X, wlsData.y)
  const wls = leastSquares(
    X,
    wlsData.y,
    wlsData.x.map((x) => 1 / (x * x)),
  )
  const line = (b: number[]) => ({ x1: 0, y1: b[0], x2: 16, y2: b[0] + b[1] * 16 })
  return (
    <div>
      <Plot x={[0, 16]} y={[0, 50]} xLabel="x" yLabel="y">
        <Segment {...line([5, 2])} color="muted" dashed />
        <Segment {...line(ols)} color="c2" width={2.5} />
        <Segment {...line(wls)} color="c1" width={2.5} />
        <WeightedPoints show={showWeights} />
      </Plot>
      <Legend
        items={[
          { color: 'c2', label: `ふつうの最小二乗法 ŷ = ${ols[0].toFixed(2)} + ${ols[1].toFixed(2)}x` },
          { color: 'c1', label: `重みつき最小二乗法 ŷ = ${wls[0].toFixed(2)} + ${wls[1].toFixed(2)}x` },
          { color: 'muted', label: '本当の直線 y = 5 + 2x' },
        ]}
      />
      <Controls>
        <Button variant={showWeights ? 'primary' : 'default'} onClick={() => setShowWeights((v) => !v)}>
          点の大きさで重みを表す：{showWeights ? 'オン' : 'オフ'}
        </Button>
      </Controls>
    </div>
  )
}
