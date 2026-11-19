import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Area, Curve, Plot } from '../../../components/charts/Plot'
import { chi2Pdf, chi2Quantile, fPdf, fQuantile, tPdf, tQuantile } from '../../../lib/stats'
import { Choice, Marker } from './parts'

type Kind = 't' | 'chi2'
const ALPHAS = [0.1, 0.05, 0.025, 0.01] as const

/**
 * 上側 α 点（それより右の面積が α になる点）を、面積を塗って見せる図。
 * 値はサイトの分布表と同じ計算（lib/stats.ts）で出している。
 */
export function UpperPoint({ initial = 't' }: { initial?: Kind }) {
  const [kind, setKind] = useState<Kind>(initial)
  const [alpha, setAlpha] = useState<number>(0.025)
  const [df, setDf] = useState(9)
  const point = kind === 't' ? tQuantile(1 - alpha, df) : chi2Quantile(1 - alpha, df)
  const f = kind === 't' ? (x: number) => tPdf(x, df) : (x: number) => chi2Pdf(x, df)
  const domain: [number, number] = kind === 't' ? [-5, 5] : [0, Math.max(20, chi2Quantile(0.999, df))]
  const yMax = kind === 't' ? 0.45 : df <= 2 ? 0.5 : chi2Pdf(df - 2, df) * 1.25
  const symbol = kind === 't' ? 't' : '\\chi^2'
  return (
    <div>
      <Controls>
        <Choice<Kind>
          options={[
            { value: 't', label: 't 分布' },
            { value: 'chi2', label: 'カイ二乗分布' },
          ]}
          value={kind}
          onChange={setKind}
        />
      </Controls>
      <Plot x={domain} y={[0, yMax]} height={240} hideY>
        <Area f={f} from={point} to={domain[1]} color="c5" opacity={0.45} />
        <Curve f={f} samples={400} color={kind === 't' ? 'c1' : 'c3'} />
        <Marker x={point} color="c5" label={point.toFixed(3)} labelY={yMax * 0.75} />
      </Plot>
      <p className="figure-readout">
        <M>{`${symbol}_{${alpha}}(${df}) = ${point.toFixed(3)}`}</M>　（赤い部分の面積が {alpha}）
      </p>
      <Controls>
        <Choice<number> options={ALPHAS.map((a) => ({ value: a, label: `α = ${a}` }))} value={alpha} onChange={setAlpha} />
      </Controls>
      <Controls>
        <Slider label="自由度" value={df} min={1} max={30} step={1} onChange={setDf} />
      </Controls>
    </div>
  )
}

/**
 * F 分布の上側 5% 点と下側 5% 点（＝上側 95% 点）。
 * 下側の点は、自由度を入れ替えた F 分布の上側の点の逆数になっていることを数で確かめる。
 */
export function FLowerPoint({ initialM1 = 5, initialM2 = 10, alpha = 0.05 }: { initialM1?: number; initialM2?: number; alpha?: number }) {
  const [m1, setM1] = useState(initialM1)
  const [m2, setM2] = useState(initialM2)
  const upper = fQuantile(1 - alpha, m1, m2)
  const lower = fQuantile(alpha, m1, m2)
  const swapped = fQuantile(1 - alpha, m2, m1)
  let peak = 0
  for (let i = 1; i <= 200; i++) peak = Math.max(peak, fPdf((i / 200) * 6, m1, m2))
  const yMax = Math.min(2.5, peak * 1.25)
  const f = (x: number) => fPdf(x, m1, m2)
  const lo = (1 - alpha).toFixed(2)
  return (
    <div>
      <Plot x={[0, 6]} y={[0, yMax]} height={240} hideY>
        <Area f={f} from={0} to={lower} color="c3" opacity={0.45} />
        <Area f={f} from={upper} to={6} color="c5" opacity={0.45} />
        <Curve f={f} samples={400} color="c4" />
        <Marker x={lower} color="c3" label={lower.toFixed(3)} labelY={yMax * 0.85} anchor="end" />
        <Marker x={upper} color="c5" label={upper.toFixed(3)} labelY={yMax * 0.85} />
      </Plot>
      <p className="figure-readout">
        上側 {alpha} 点 <M>{`F_{${alpha}}(${m1},${m2}) = ${upper.toFixed(3)}`}</M>　下側 {alpha} 点{' '}
        <M>{`F_{${lo}}(${m1},${m2}) = ${lower.toFixed(3)}`}</M>
      </p>
      <p className="figure-readout">
        自由度を入れ替えた上側の点の逆数：<M>{`1/F_{${alpha}}(${m2},${m1}) = 1/${swapped.toFixed(3)} = ${(1 / swapped).toFixed(3)}`}</M>
      </p>
      <Controls>
        <Slider label="分子の自由度 m₁" value={m1} min={1} max={30} step={1} onChange={setM1} />
        <Slider label="分母の自由度 m₂" value={m2} min={1} max={30} step={1} onChange={setM2} />
      </Controls>
    </div>
  )
}
