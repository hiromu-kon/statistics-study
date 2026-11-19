import { useMemo, useState } from 'react'
import { Button, Controls, DataTable, Slider } from '../../../components/blocks'
import { HLine, Legend, Plot, VLine, type Color } from '../../../components/charts/Plot'
import { carData } from './carData'
import { crossProducts, solve, standardize } from './linalg'
import { Polyline } from './Polyline'

// 説明変数も目的変数も標準化してから当てはめる（正則化は係数の大きさに罰を与えるので、単位をそろえないと不公平になる）
const NAMES = ['年数', '走行距離', '排気量', '色の番号']
const COLORS: Color[] = ['c1', 'c2', 'c3', 'c5']
const cols = [carData.age, carData.dist, carData.disp, carData.color].map(standardize)
const X = carData.price.map((_, i) => cols.map((c) => c[i]))
const y = standardize(carData.price)
const { xtx, xty } = crossProducts(X, y)

/** リッジ：(X'X + λI)⁻¹ X'y */
function ridge(lambda: number): number[] {
  return solve(
    xtx.map((row, i) => row.map((v, j) => v + (i === j ? lambda : 0))),
    xty,
  )
}

/** ラッソ：残差平方和 + λΣ|βj| を座標降下法で最小にする */
function lasso(lambda: number): number[] {
  const b = [0, 0, 0, 0]
  for (let it = 0; it < 300; it++) {
    for (let j = 0; j < 4; j++) {
      // xj と「xj 以外で説明しきれなかった残り」の内積
      let rho = xty[j]
      for (let k = 0; k < 4; k++) if (k !== j) rho -= xtx[j][k] * b[k]
      const z = Math.max(Math.abs(rho) - lambda / 2, 0)
      b[j] = (Math.sign(rho) * z) / xtx[j][j]
    }
  }
  return b
}

const GRID = Array.from({ length: 121 }, (_, i) => i * 0.5)

export function ShrinkagePlot() {
  const [kind, setKind] = useState<'ridge' | 'lasso'>('lasso')
  const [lambda, setLambda] = useState(10)
  const fit = kind === 'ridge' ? ridge : lasso
  const paths = useMemo(() => GRID.map((l) => fit(l)), [fit])
  const now = fit(lambda)
  return (
    <div>
      <Controls>
        <Button variant={kind === 'ridge' ? 'primary' : 'default'} onClick={() => setKind('ridge')}>
          リッジ（L2）
        </Button>
        <Button variant={kind === 'lasso' ? 'primary' : 'default'} onClick={() => setKind('lasso')}>
          ラッソ（L1）
        </Button>
      </Controls>
      <Plot x={[0, 60]} y={[-0.6, 0.45]} xLabel="λ（罰の強さ）" yLabel="標準化した係数" yTicks={[-0.6, -0.4, -0.2, 0, 0.2, 0.4]}>
        <HLine y={0} color="muted" />
        {NAMES.map((_, j) => (
          <Polyline key={j} points={GRID.map((l, i) => ({ x: l, y: paths[i][j] }))} color={COLORS[j]} />
        ))}
        <VLine x={lambda} color="ink" />
      </Plot>
      <Legend items={NAMES.map((n, j) => ({ color: COLORS[j], label: n }))} />
      <DataTable
        head={['', ...NAMES]}
        rows={[[`λ = ${lambda} の係数`, ...now.map((v) => (Math.abs(v) < 5e-4 ? '0' : v.toFixed(3)))]]}
      />
      <Controls>
        <Slider label="λ" value={lambda} min={0} max={60} step={0.5} onChange={setLambda} />
      </Controls>
    </div>
  )
}
