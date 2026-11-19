import { useMemo, useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { binData } from '../../../components/charts/common'
import { createRng, mean, randomNormal, round } from '../../../lib/stats'

/** Box-Cox 変換。λ = 0 のときは対数 */
function boxCox(y: number, lambda: number): number {
  return Math.abs(lambda) < 1e-9 ? Math.log(y) : (y ** lambda - 1) / lambda
}

function skewness(xs: number[]): number {
  const m = mean(xs)
  const m2 = mean(xs.map((x) => (x - m) ** 2))
  const m3 = mean(xs.map((x) => (x - m) ** 3))
  return m3 / m2 ** 1.5
}

// 右に裾の長いデータの例：対数をとると正規分布になる値（対数正規分布、log の平均 0・標準偏差 0.6）を 600 個
const SAMPLE = (() => {
  const rng = createRng(20261120)
  return Array.from({ length: 600 }, () => Math.exp(randomNormal(rng, 0, 0.6)))
})()

const REF = [-1, 0, 0.5, 1, 2]

/**
 * Box-Cox 変換の形（左）と、右に裾の長いデータを変換したときのヒストグラム（右）。
 * λ を 1 から小さくしていくと右の裾が縮み、このデータでは λ = 0（対数）のあたりで歪度がほぼ 0 になる。
 */
export function BoxCoxPlot() {
  const [lambda, setLambda] = useState(0.5)
  const { bars, lo, hi, width, skew } = useMemo(() => {
    const t = SAMPLE.map((y) => boxCox(y, lambda))
    const lo0 = Math.min(...t)
    const hi0 = Math.max(...t)
    const w = (hi0 - lo0) / 24
    const b = binData(t, lo0, w, 24).map((d) => ({ x: d.x, y: d.y / (t.length * w) }))
    return { bars: b, lo: lo0, hi: hi0, width: w, skew: skewness(t) }
  }, [lambda])
  const yMax = Math.max(...bars.map((b) => b.y)) * 1.15
  return (
    <div>
      <Compare>
        <Card title="変換の形（どれも y = 1 で 0、傾き 1）">
          <Plot x={[0, 4]} y={[-3, 4]} width={300} height={260} xLabel="もとの値 y" xTicks={[0, 1, 2, 3, 4]} yTicks={[-3, -2, -1, 0, 1, 2, 3, 4]}>
            {REF.map((l) => (
              <Curve key={l} f={(y) => boxCox(y, l)} from={0.05} to={4} color="muted" width={1.2} />
            ))}
            <Curve f={(y) => boxCox(y, lambda)} from={0.05} to={4} color="c1" width={3} />
          </Plot>
        </Card>
        <Card title={`変換したデータ（λ = ${lambda}）`}>
          <Plot x={[lo - width, hi + width]} y={[0, yMax]} width={300} height={260} xLabel="変換後の値" hideY>
            <Bars data={bars} width={width * 0.95} color="c1" opacity={0.7} />
          </Plot>
        </Card>
      </Compare>
      <Legend
        items={[
          { color: 'c1', label: `いまの λ = ${lambda}` },
          { color: 'muted', label: '参考：λ = −1, 0（対数）, 0.5, 1, 2' },
        ]}
      />
      <p className="figure-readout">
        変換後のデータの歪度 = <strong>{round(skew, 2)}</strong>（0 に近いほど左右対称）
      </p>
      <Controls>
        <Slider label="λ" value={lambda} min={-1} max={2} step={0.25} onChange={setLambda} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
