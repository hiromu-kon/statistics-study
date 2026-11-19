import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

// 基準のハザードは形状 1.5・尺度 10 のワイブル型（時間とともに上がる）にした。形はどれでも比例ハザードの性質は同じ
const h0 = (t: number) => (1.5 / 10) * (t / 10) ** 0.5
const S0 = (t: number) => Math.exp(-((t / 10) ** 1.5))

/**
 * 比例ハザードモデルの図。新しい治療（x = 1）のハザードは、いつでも基準（x = 0）の e^β 倍。
 * そのとき生存関数は S1(t) = S0(t)^(e^β) になる。
 */
export function HazardPlot() {
  const [beta, setBeta] = useState(-0.69)
  const hr = Math.exp(beta)
  return (
    <div>
      <Compare>
        <Card title="ハザード h(t)（その時点で生きている人が、すぐ後に死亡する率）">
          <Plot x={[0, 20]} y={[0, 0.5]} width={320} height={250} xLabel="時間 t" yTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]}>
            <Curve f={h0} from={0.01} color="c2" />
            <Curve f={(t) => hr * h0(t)} from={0.01} color="c1" />
          </Plot>
        </Card>
        <Card title="生存関数 S(t)（時刻 t まで生きている確率）">
          <Plot x={[0, 20]} y={[0, 1.02]} width={320} height={250} xLabel="時間 t" yTicks={[0, 0.25, 0.5, 0.75, 1]}>
            <Curve f={S0} color="c2" />
            <Curve f={(t) => S0(t) ** hr} color="c1" />
          </Plot>
        </Card>
      </Compare>
      <Legend
        items={[
          { color: 'c2', label: '基準（x = 0）' },
          { color: 'c1', label: 'x = 1' },
        ]}
      />
      <p className="figure-readout">
        β = <strong>{beta.toFixed(2)}</strong>　→　ハザード比 e^β = <strong>{round(hr, 2)}</strong>　／　t = 10 の生存率：基準 {round(S0(10), 3)}、x = 1 は{' '}
        {round(S0(10), 3)}^{round(hr, 2)} = <strong>{round(S0(10) ** hr, 3)}</strong>
      </p>
      <Controls>
        <Slider label="β" value={beta} min={-1.5} max={1.5} step={0.01} onChange={setBeta} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
