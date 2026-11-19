import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Plot, Points } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

const N = 1000

/**
 * 有限母集団修正 (N − n)/(N − 1) が、抜きとる割合 n/N によってどう変わるかの図。
 * 母集団に比べて標本が小さければほぼ 1（修正しなくてよい）、全員に近づくと 0 に近づく。
 */
export function FpcPlot() {
  const [n, setN] = useState(100)
  const fpc = (N - n) / (N - 1)
  return (
    <div>
      <Plot x={[0, N]} y={[0, 1.05]} height={240} xLabel={`標本の大きさ n（母集団 N = ${N}）`} yLabel="修正の係数">
        <Curve f={(x) => (N - x) / (N - 1)} color="c4" />
        <Points data={[{ x: n, y: fpc }]} color="c2" r={7} opacity={1} />
      </Plot>
      <p className="figure-readout">
        n = {n}（母集団の {round((n / N) * 100, 1)}%）のとき、(N − n)/(N − 1) = <strong>{round(fpc, 3)}</strong>　→ 標本平均の分散は σ²/n の{' '}
        {round(fpc, 3)} 倍、標準誤差は √{round(fpc, 3)} ≒ <strong>{round(Math.sqrt(fpc), 3)}</strong> 倍
      </p>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={10} max={1000} step={10} onChange={setN} />
      </Controls>
    </div>
  )
}
