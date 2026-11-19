import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot } from '../../../components/charts/Plot'

/** 平均 1 の指数分布 n 個の最大値から log n を引いたものの密度 */
function maxDensity(x: number, n: number): number {
  if (x <= -Math.log(n)) return 0
  const e = Math.exp(-x)
  return (1 - e / n) ** (n - 1) * e
}

const gumbel = (x: number) => Math.exp(-x - Math.exp(-x))

/**
 * 極値分布の図：独立に平均 1 の指数分布にしたがう n 個の最大値 M_n について、M_n − log n の密度が
 * n を大きくするとガンベル分布 exp(−x − e^(−x)) に近づく。
 */
export function MaxGumbel() {
  const [n, setN] = useState(3)
  return (
    <div>
      <Plot x={[-3, 6]} y={[0, 1.05]} height={240} xLabel="最大値 − log n" hideY>
        <Curve f={gumbel} color="muted" dashed />
        <Curve f={(x) => maxDensity(x, n)} color="c1" samples={400} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `n = ${n} 個の最大値 − log n の密度` },
          { color: 'muted', label: 'ガンベル分布' },
        ]}
      />
      <Controls>
        <Slider label="個数 n" value={n} min={1} max={50} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
