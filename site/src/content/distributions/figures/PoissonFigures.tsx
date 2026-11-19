import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Bars, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { binomialPmf, poissonPmf, round } from '../../../lib/stats'
import { intTicks, range } from './discrete'

/** ポアソン分布 Po(λ) の棒グラフ。λ を大きくすると山が右へ動き、広がりも大きくなる */
export function PoissonExplorer({ lambda0 = 3 }: { lambda0?: number }) {
  const [lambda, setLambda] = useState(lambda0)
  const kmax = 25
  const data = range(0, kmax).map((k) => ({ x: k, y: poissonPmf(k, lambda) }))
  const ymax = Math.max(...data.map((d) => d.y))
  return (
    <div>
      <Plot x={[-0.7, kmax + 0.7]} y={[0, ymax * 1.2]} xTicks={intTicks(0, kmax)} xLabel="起こった回数 k">
        <Bars data={data} />
        <VLine x={lambda} label={`平均 λ = ${lambda}`} />
      </Plot>
      <p className="figure-readout">
        期待値 = 分散 = <strong>{lambda}</strong>　標準偏差 <M>{'\\sqrt{\\lambda}'}</M> = <strong>{round(Math.sqrt(lambda), 3)}</strong>
      </p>
      <Controls>
        <Slider label="平均の回数 λ" value={lambda} min={0.5} max={12} step={0.5} onChange={setLambda} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

const N_OPTIONS = [6, 10, 20, 50, 100, 500]

/** 二項分布 B(n, λ/n) とポアソン分布 Po(λ) を並べる。n が大きく p が小さいほど重なる */
export function BinomialPoissonCompare() {
  const [lambda, setLambda] = useState(3)
  const [ni, setNi] = useState(1)
  const n = N_OPTIONS[ni]
  const p = lambda / n
  const kmax = 12
  const ks = range(0, kmax)
  const binom = ks.map((k) => ({ x: k - 0.2, y: binomialPmf(k, n, p) }))
  const pois = ks.map((k) => ({ x: k + 0.2, y: poissonPmf(k, lambda) }))
  const ymax = Math.max(...binom.map((d) => d.y), ...pois.map((d) => d.y))
  const maxGap = Math.max(...ks.map((k) => Math.abs(binom[k].y - pois[k].y)))
  return (
    <div>
      <Plot x={[-0.7, kmax + 0.7]} y={[0, ymax * 1.15]} xTicks={intTicks(0, kmax)} xLabel="回数 k">
        <Bars data={binom} width={0.38} color="c1" />
        <Bars data={pois} width={0.38} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `二項分布 B(${n}, ${round(p, 4)})` },
          { color: 'c2', label: `ポアソン分布 Po(${lambda})` },
        ]}
      />
      <p className="figure-readout">
        <M>{`p = \\lambda / n = ${round(p, 4)}`}</M>　確率のずれの最大 = <strong>{round(maxGap, 4)}</strong>
      </p>
      <Controls>
        <Slider label="試行回数 n" value={ni} min={0} max={N_OPTIONS.length - 1} step={1} onChange={setNi} format={(v) => `${N_OPTIONS[v]}回`} />
        <Slider label="平均 np = λ" value={lambda} min={1} max={5} step={0.5} onChange={setLambda} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** 独立な Po(λ1) と Po(λ2) の和を実際に足し合わせて計算し、Po(λ1+λ2) と重なることを見せる */
export function PoissonSum() {
  const [l1, setL1] = useState(1.5)
  const [l2, setL2] = useState(2.5)
  const kmax = 16
  const ks = range(0, kmax)
  const conv = ks.map((k) => ({
    x: k,
    y: range(0, k).reduce((s, j) => s + poissonPmf(j, l1) * poissonPmf(k - j, l2), 0),
  }))
  const target = ks.map((k) => ({ x: k, y: poissonPmf(k, l1 + l2) }))
  const ymax = Math.max(...conv.map((d) => d.y))
  return (
    <div>
      <Plot x={[-0.7, kmax + 0.7]} y={[0, ymax * 1.2]} xTicks={intTicks(0, kmax)} xLabel="合計の回数 X + Y">
        <Bars data={conv} color="c3" />
        <Points data={target} color="c2" r={6} opacity={0.95} />
      </Plot>
      <Legend
        items={[
          { color: 'c3', label: 'X + Y の確率（組合せを全部足して計算）' },
          { color: 'c2', label: `Po(${round(l1 + l2, 1)}) の確率` },
        ]}
      />
      <Controls>
        <Slider label="X の平均 λ₁" value={l1} min={0.5} max={5} step={0.5} onChange={setL1} format={(v) => v.toFixed(1)} />
        <Slider label="Y の平均 λ₂" value={l2} min={0.5} max={5} step={0.5} onChange={setL2} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
