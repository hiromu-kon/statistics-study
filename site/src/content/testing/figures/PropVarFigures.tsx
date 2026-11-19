import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { binomialPmf, chi2Pdf, chi2Quantile, normalPdf, round } from '../../../lib/stats'
import { ColorText, Mark, TestDistPlot, Toggle, Verdict } from './parts'
import { peakOf } from './peak'

/**
 * 母比率の検定：H0（p0 = 0.1）のもとで 400 個中の不良品の数は二項分布 B(400, 0.1)。
 * n が大きいので正規分布 N(40, 6²) でよく近似でき、両側 5% の境目は 40 ± 1.96 × 6。
 */
export function BinomNormal({ n = 400, p0 = 0.1, observed = 52 }: { n?: number; p0?: number; observed?: number }) {
  const mu = n * p0
  const sigma = Math.sqrt(n * p0 * (1 - p0))
  const lo = Math.floor(mu - 3.5 * sigma)
  const hi = Math.ceil(mu + 3.5 * sigma)
  const upper = mu + 1.96 * sigma
  const lower = mu - 1.96 * sigma
  const data = Array.from({ length: hi - lo + 1 }, (_, i) => ({ x: lo + i, y: binomialPmf(lo + i, n, p0) }))
  const peak = normalPdf(mu, mu, sigma)
  return (
    <div>
      <Plot x={[lo - 1, hi + 1]} y={[0, peak * 1.3]} hideY xLabel={`${n} 個のうちの不良品の数（H0: p = ${p0} のとき）`}>
        <Bars data={data} width={0.8} color="c1" opacity={0.6} highlight={(x) => x >= upper || x <= lower} highlightColor="c5" />
        <Curve f={(x) => normalPdf(x, mu, sigma)} color="ink" />
        <Mark x={upper} color="c5" />
        <Mark x={lower} color="c5" />
        <Mark x={observed} color="c2" dashed={false} width={3} />
        <ColorText x={observed} y={peak * 1.15} color="c2" anchor="start">
          {` 観測 ${observed} 個`}
        </ColorText>
        <ColorText x={lower} y={peak * 1.15} color="c5" anchor="end">
          {`${round(lower, 2)} `}
        </ColorText>
        <ColorText x={upper} y={peak * 0.95} color="c5" anchor="start">
          {` ${round(upper, 2)}`}
        </ColorText>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '二項分布（棒）' },
          { color: 'ink', label: `正規近似 N(${mu}, ${round(sigma, 2)}²)` },
          { color: 'c5', label: '両側 5% の棄却域' },
        ]}
      />
    </div>
  )
}

/** 母分散の検定の例（自由度 14、χ² = 25.2）。両側と片側で結論が変わる */
export function VarianceTestFigure({ df = 14, observed = 25.2 }: { df?: number; observed?: number }) {
  const [side, setSide] = useState<'two' | 'right'>('two')
  const lower = chi2Quantile(0.025, df)
  const upper = side === 'two' ? chi2Quantile(0.975, df) : chi2Quantile(0.95, df)
  const xMax = chi2Quantile(0.999, df)
  const pdf = (x: number) => chi2Pdf(x, df)
  const reject = observed >= upper
  return (
    <div>
      <TestDistPlot
        pdf={pdf}
        x={[0, xMax]}
        yMax={peakOf(pdf, 0.01, xMax) * 1.25}
        reject={side === 'two' ? [[0, lower], [upper, Infinity]] : [[upper, Infinity]]}
        criticals={
          side === 'two'
            ? [
                { x: lower, label: `${round(lower, 3)} ` },
                { x: upper, label: ` ${round(upper, 3)}` },
              ]
            : [{ x: upper, label: ` ${round(upper, 3)}` }]
        }
        observed={observed}
        observedLabel={` χ² = ${observed}`}
        xLabel={`χ² 分布（自由度 ${df}）`}
      />
      <Toggle
        options={[
          { value: 'two', label: '両側 5%（H1: σ² ≠ σ0²）' },
          { value: 'right', label: '右片側 5%（H1: σ² > σ0²）' },
        ]}
        value={side}
        onChange={setSide}
      />
      <p className="figure-readout">
        χ² = {observed} {reject ? '≧' : '<'} {round(upper, 3)} → <Verdict reject={reject} />
      </p>
    </div>
  )
}

/** χ² 分布は左右非対称なので、両側検定の境目は左右で別々に読む */
export function Chi2Region() {
  const [df, setDf] = useState(9)
  const lower = chi2Quantile(0.025, df)
  const upper = chi2Quantile(0.975, df)
  const xMax = Math.max(12, chi2Quantile(0.999, df))
  const pdf = (x: number) => chi2Pdf(x, df)
  return (
    <div>
      <TestDistPlot
        pdf={pdf}
        x={[0, xMax]}
        yMax={peakOf(pdf, 0.05, xMax) * 1.25}
        reject={[
          [0, lower],
          [upper, Infinity],
        ]}
        criticals={[
          { x: lower, label: `${round(lower, 3)} ` },
          { x: upper, label: ` ${round(upper, 3)}` },
        ]}
        extra={
          <ColorText x={df} y={0} dy={-6} color="muted">
            {`平均 = 自由度 ${df}`}
          </ColorText>
        }
        xLabel={`χ² 分布（自由度 ${df}）`}
      />
      <p className="figure-readout">
        左の境目 {round(lower, 3)} と 右の境目 {round(upper, 3)}。真ん中（自由度 {df}）からの距離が左右で違う
      </p>
      <Controls>
        <Slider label="自由度 n − 1" value={df} min={2} max={30} step={1} onChange={setDf} />
      </Controls>
    </div>
  )
}
