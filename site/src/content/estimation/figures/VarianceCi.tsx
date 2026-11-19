import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Area, Curve, Plot, Segment } from '../../../components/charts/Plot'
import { chi2Pdf, chi2Quantile, round } from '../../../lib/stats'
import { Marker, Text } from '../../sampling/figures/parts'

const S2 = 4

/**
 * 母分散の 95% 信頼区間を作る図。
 * 上：カイ二乗分布の両側 2.5% 点。下：それで割って作った区間。s² に対して右に長い（左右非対称）。
 */
export function VarianceCi() {
  const [n, setN] = useState(10)
  const df = n - 1
  const upper = chi2Quantile(0.975, df) // 上側 2.5% 点
  const lower = chi2Quantile(0.025, df) // 上側 97.5% 点（下側 2.5% 点）
  const lo = (df * S2) / upper
  const hi = (df * S2) / lower
  const xMax = Math.max(20, chi2Quantile(0.999, df))
  const yMax = df <= 2 ? 0.5 : chi2Pdf(df - 2, df) * 1.3
  const f = (x: number) => chi2Pdf(x, df)
  return (
    <div>
      <p className="figure-readout">
        自由度 {df} のカイ二乗分布（左右に 2.5% ずつ）
      </p>
      <Plot x={[0, xMax]} y={[0, yMax]} height={200} hideY>
        <Area f={f} from={0} to={lower} color="c5" opacity={0.45} />
        <Area f={f} from={upper} to={xMax} color="c5" opacity={0.45} />
        <Curve f={f} color="c3" samples={400} />
        <Marker x={lower} color="c5" label={lower.toFixed(3)} anchor="end" labelY={yMax * 0.85} />
        <Marker x={upper} color="c5" label={upper.toFixed(3)} labelY={yMax * 0.85} />
      </Plot>
      <p className="figure-readout">
        <M>{`\\left(\\frac{${df} \\times ${S2}}{${upper.toFixed(3)}},\\ \\frac{${df} \\times ${S2}}{${lower.toFixed(3)}}\\right) = (${lo.toFixed(2)},\\ ${hi.toFixed(2)})`}</M>
      </p>
      <Plot x={[0, 36]} y={[0, 2]} height={110} hideY grid={false} xLabel="母分散 σ² の 95% 信頼区間">
        <Segment x1={lo} y1={1} x2={hi} y2={1} color="c1" width={8} />
        <Marker x={S2} color="c2" from={0.5} to={1.5} dashed={false} />
        <Text x={S2} y={1.5} dy={-6} color="c2">
          s² = {S2}
        </Text>
        <Text x={(S2 + Math.min(hi, 36)) / 2} y={1} dy={-10} color="c1">
          右に {round(hi - S2, 2)}
        </Text>
        <Text x={lo} y={1} dy={22} color="c1">
          左に {round(S2 - lo, 2)}
        </Text>
      </Plot>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={5} max={40} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
