import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Legend, Plot } from '../../../components/charts/Plot'
import { binomialPmf, poissonPmf, round } from '../../../lib/stats'

/**
 * 少数法則：平均 np = λ を一定にしたまま n を大きくすると、二項分布 B(n, λ/n) がポアソン分布（平均 λ）に近づく図。
 * 2つの分布の確率のずれの最大値も表示する。
 */
export function SmallNumbers() {
  const [n, setN] = useState(10)
  const [lambda, setLambda] = useState(2)
  const p = lambda / n
  const kMax = Math.max(8, Math.ceil(lambda + 4 * Math.sqrt(lambda)))
  const ks = Array.from({ length: kMax + 1 }, (_, k) => k)
  const bin = ks.map((k) => (k <= n ? binomialPmf(k, n, p) : 0))
  const poi = ks.map((k) => poissonPmf(k, lambda))
  const maxDiff = Math.max(...ks.map((k) => Math.abs(bin[k] - poi[k])))
  const yMax = Math.max(...bin, ...poi) * 1.2
  return (
    <div>
      <Plot x={[-0.6, kMax + 0.6]} y={[0, yMax]} height={250} xLabel="起きた回数 k" yLabel="確率">
        <Bars data={ks.map((k) => ({ x: k - 0.18, y: bin[k] }))} width={0.34} color="c1" opacity={0.75} />
        <Bars data={ks.map((k) => ({ x: k + 0.18, y: poi[k] }))} width={0.34} color="c2" opacity={0.75} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `二項分布 B(${n}, ${round(p, 4)})` },
          { color: 'c2', label: `ポアソン分布（平均 ${lambda}）` },
        ]}
      />
      <p className="figure-readout">
        確率のずれの最大値 = <strong>{round(maxDiff, 4)}</strong>（n を大きくすると 0 に近づく）
      </p>
      <Controls>
        <Slider label="試行回数 n" value={n} min={Math.ceil(lambda) + 1} max={200} step={1} onChange={setN} />
        <Slider
          label="平均 λ = np"
          value={lambda}
          min={0.5}
          max={5}
          step={0.5}
          onChange={(v) => {
            setLambda(v)
            setN((m) => Math.max(m, Math.ceil(v) + 1))
          }}
          format={(v) => v.toFixed(1)}
        />
      </Controls>
    </div>
  )
}
