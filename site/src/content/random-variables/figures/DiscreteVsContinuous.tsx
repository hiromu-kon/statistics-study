import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Plot, VLine } from '../../../components/charts/Plot'
import { normalCdf, normalPdf, round } from '../../../lib/stats'
import { DistBars } from './DistBars'

const MU = 170
const SIGMA = 6

/**
 * 離散型（棒の高さ = 確率）と連続型（面積 = 確率）を並べる。
 * 連続型では区間の幅を 0 に近づけると、塗った面積（確率）も 0 に近づく。
 */
export function DiscreteVsContinuous() {
  const [w, setW] = useState(6)
  const lo = MU - w / 2
  const hi = MU + w / 2
  const p = w > 0 ? normalCdf(hi, MU, SIGMA) - normalCdf(lo, MU, SIGMA) : 0
  return (
    <div>
      <Compare>
        <Card title="離散型：コイン2枚の表の枚数">
          <DistBars
            dist={[
              { x: 0, p: 0.25 },
              { x: 1, p: 0.5 },
              { x: 2, p: 0.25 },
            ]}
            x={[-0.7, 2.7]}
            yMax={0.6}
            xTicks={[0, 1, 2]}
            xLabel="表の枚数 x"
            label={(_, q) => String(q)}
            width={340}
            height={230}
            ariaLabel="コイン2枚の表の枚数の確率分布"
          />
          <p className="small">棒の<strong>高さ</strong>がそのまま確率。P(X = 1) = 0.5。</p>
        </Card>
        <Card title="連続型：大人の身長（cm）">
          <Plot x={[150, 190]} y={[0, 0.075]} width={340} height={230} hideY xTicks={[150, 160, 170, 180, 190]} xLabel="身長 x（cm）">
            <Area f={(t) => normalPdf(t, MU, SIGMA)} from={lo} to={hi} color="c1" opacity={0.45} />
            <Curve f={(t) => normalPdf(t, MU, SIGMA)} />
            <VLine x={lo} color="c2" />
            <VLine x={hi} color="c2" />
          </Plot>
          <p className="small">
            曲線の下の<strong>面積</strong>が確率。{round(lo, 2)}〜{round(hi, 2)} cm の確率 ≒ <strong>{round(p, 4)}</strong>
          </p>
        </Card>
      </Compare>
      <Controls>
        <Slider label="区間の幅（連続型）" value={w} min={0} max={20} step={0.1} onChange={setW} format={(v) => `${v.toFixed(1)} cm`} />
      </Controls>
      <p className="figure-readout">幅を 0 にすると面積も 0。連続型では「ちょうど 170 cm」の確率は 0 になる</p>
    </div>
  )
}
