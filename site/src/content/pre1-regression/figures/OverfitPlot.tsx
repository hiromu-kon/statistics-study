import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, Points } from '../../../components/charts/Plot'
import { leastSquares } from './linalg'

// 架空のデータ。本当の関係は y = sin(2.5x) で、そこに誤差を足した。学習用と、当てはめに使わない確認用に分けてある。
// 次数ごとの平均二乗誤差は numpy で計算した値と同じ（確認用の誤差は 4 次で最小、8 次以上で急に大きくなる）。
const train = {
  x: [-0.84, -0.65, -0.25, -0.05, 0.02, 0.09, 0.21, 0.6, 0.74, 0.8, 0.89, 0.95],
  y: [-0.78, -0.87, -0.96, 0.44, -0.43, 0.5, 0.42, 0.78, 0.8, 0.74, 0.89, 0.67],
}
const test = {
  x: [-0.55, -0.46, -0.3, -0.01, 0.0, 0.0, 0.04, 0.16, 0.28, 0.86, 0.88, 0.92],
  y: [-0.74, -1.16, -0.88, -0.08, 0.19, 0.21, -0.08, 0.24, 0.44, 0.69, 0.75, 0.71],
}

/** チェビシェフ多項式 T0〜Td の値（ふつうの x^k より計算が安定する） */
function cheb(x: number, d: number): number[] {
  const t = [1, x]
  for (let k = 2; k <= d; k++) t.push(2 * x * t[k - 1] - t[k - 2])
  return t.slice(0, d + 1)
}

const mse = (f: (x: number) => number, d: { x: number[]; y: number[] }) => d.x.reduce((s, x, i) => s + (f(x) - d.y[i]) ** 2, 0) / d.x.length

/** モデルの柔軟さ（ここでは多項式の次数）を上げると、学習用の誤差は下がり続けるが、確認用の誤差はある所から上がる */
export function OverfitPlot() {
  const [deg, setDeg] = useState(3)
  const b = leastSquares(
    train.x.map((x) => cheb(x, deg)),
    train.y,
  )
  const f = (x: number) => cheb(x, deg).reduce((s, v, k) => s + v * b[k], 0)
  return (
    <div>
      <Plot x={[-1, 1]} y={[-2, 2]} xLabel="x" yLabel="y" xTicks={[-1, -0.5, 0, 0.5, 1]}>
        <Curve f={(x) => Math.sin(2.5 * x)} color="muted" dashed width={2} />
        <Curve f={f} color="c1" samples={300} />
        <Points data={train.x.map((x, i) => ({ x, y: train.y[i] }))} r={5} color="ink" opacity={0.65} />
        <Points data={test.x.map((x, i) => ({ x, y: test.y[i] }))} r={5} color="c4" opacity={0.65} />
      </Plot>
      <Legend
        items={[
          { color: 'ink', label: '学習用のデータ（当てはめに使う）' },
          { color: 'c4', label: '確認用のデータ（使わない）' },
          { color: 'c1', label: `${deg} 次式の当てはめ` },
          { color: 'muted', label: '本当の関係' },
        ]}
      />
      <p className="figure-readout">
        平均二乗誤差：学習用 <strong>{mse(f, train).toFixed(3)}</strong>　／　確認用 <strong>{mse(f, test).toFixed(3)}</strong>
      </p>
      <Controls>
        <Slider label="モデルの柔軟さ（次数）" value={deg} min={1} max={10} step={1} onChange={setDeg} />
      </Controls>
    </div>
  )
}
