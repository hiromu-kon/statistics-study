import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot } from '../../../components/charts/Plot'
import { chi2Pdf, fPdf, normalPdf, tPdf } from '../../../lib/stats'
import { Choice, Marker } from './parts'

type Kind = 't' | 'chi2' | 'f'

function TShape() {
  const [df, setDf] = useState(2)
  return (
    <>
      <Plot x={[-4.5, 4.5]} y={[0, 0.45]} height={250} hideY xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]}>
        <Curve f={(x) => normalPdf(x)} color="muted" dashed />
        <Curve f={(x) => tPdf(x, df)} color="c1" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `t 分布（自由度 ${df}）` },
          { color: 'muted', label: '標準正規分布' },
        ]}
      />
      <p className="figure-readout">自由度が小さいほど山が低く、すそ（両はし）が厚い。自由度を大きくすると、点線の標準正規分布にほぼ重なる。</p>
      <Controls>
        <Slider label="自由度" value={df} min={1} max={30} step={1} onChange={setDf} />
      </Controls>
    </>
  )
}

function Chi2Shape() {
  const [df, setDf] = useState(3)
  const yMax = df <= 2 ? 0.5 : chi2Pdf(df - 2, df) * 1.25
  return (
    <>
      <Plot x={[0, 50]} y={[0, yMax]} height={250} hideY>
        <Curve f={(x) => chi2Pdf(x, df)} color="c3" samples={400} />
        <Marker x={df} color="c5" label={`平均 = 自由度 = ${df}`} />
      </Plot>
      <p className="figure-readout">
        0 より小さい値はとらず、右にすそが長い。自由度を大きくすると山が右へ動き、左右対称に近づく（平均 {df}、分散 {2 * df}）。
      </p>
      <Controls>
        <Slider label="自由度" value={df} min={1} max={30} step={1} onChange={setDf} />
      </Controls>
    </>
  )
}

function FShape() {
  const [d1, setD1] = useState(5)
  const [d2, setD2] = useState(10)
  let peak = 0
  for (let i = 1; i <= 200; i++) peak = Math.max(peak, fPdf((i / 200) * 5, d1, d2))
  const yMax = Math.min(2.5, peak * 1.2)
  return (
    <>
      <Plot x={[0, 5]} y={[0, yMax]} height={250} hideY>
        <Curve f={(x) => fPdf(x, d1, d2)} color="c4" samples={400} />
        <Marker x={1} color="muted" label="1" />
      </Plot>
      <p className="figure-readout">
        F({d1}, {d2})。0 以上の値だけをとり、1 のあたりに山がある（分散の比なので「同じくらいなら1」）。
      </p>
      <Controls>
        <Slider label="分子の自由度" value={d1} min={1} max={30} step={1} onChange={setD1} />
        <Slider label="分母の自由度" value={d2} min={1} max={30} step={1} onChange={setD2} />
      </Controls>
    </>
  )
}

/** t・χ²・F 分布の形が自由度でどう変わるかを見る図 */
export function DistShapes({ initial = 't' }: { initial?: Kind }) {
  const [kind, setKind] = useState<Kind>(initial)
  return (
    <div>
      <Controls>
        <Choice<Kind>
          options={[
            { value: 't', label: 't 分布' },
            { value: 'chi2', label: 'カイ二乗分布' },
            { value: 'f', label: 'F 分布' },
          ]}
          value={kind}
          onChange={setKind}
        />
      </Controls>
      {kind === 't' && <TShape />}
      {kind === 'chi2' && <Chi2Shape />}
      {kind === 'f' && <FShape />}
    </div>
  )
}

