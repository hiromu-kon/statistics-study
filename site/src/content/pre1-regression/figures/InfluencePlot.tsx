import { useState } from 'react'
import { Button, Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Bars, HLine, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { baseX, baseY, diagnose } from './influence'

/**
 * Cook の距離の図。赤い点を1つ動かして、「全部の点で引いた直線」と「赤い点を除いて引いた直線」がどれだけ違うかを見る。
 * 赤い点の x は「真ん中（x = 5）」と「端（x = 15）」から選べる。
 */
export function InfluencePlot() {
  const [px, setPx] = useState(15)
  const [py, setPy] = useState(4)
  const xs = [...baseX, px]
  const ys = [...baseY, py]
  const d = diagnose(xs, ys)
  const base = diagnose(baseX, baseY)
  const k = xs.length - 1
  const dMax = Math.max(1.2, ...d.D) * 1.1
  return (
    <div>
      <Controls>
        <Button variant={px === 5 ? 'primary' : 'default'} onClick={() => setPx(5)}>
          赤い点を真ん中（x = 5）に
        </Button>
        <Button variant={px === 15 ? 'primary' : 'default'} onClick={() => setPx(15)}>
          赤い点を端（x = 15）に
        </Button>
      </Controls>
      <Compare>
        <Card title="散布図と2本の直線">
          <Plot x={[0, 16]} y={[0, 12]} width={320} height={260} xLabel="x" yLabel="y">
            <Segment x1={0} y1={base.a} x2={16} y2={base.a + base.b * 16} color="muted" dashed width={2} />
            <Segment x1={0} y1={d.a} x2={16} y2={d.a + d.b * 16} color="c1" width={2.5} />
            <Points data={baseX.map((x, i) => ({ x, y: baseY[i] }))} r={4.5} color="ink" opacity={0.55} />
            <Points data={[{ x: px, y: py }]} r={7} color="c4" opacity={1} />
          </Plot>
          <Legend
            items={[
              { color: 'c1', label: '全部の点で引いた直線' },
              { color: 'muted', label: '赤い点を除いた直線' },
            ]}
          />
        </Card>
        <Card title="各点の Cook の距離">
          <Plot x={[0.3, 10.7]} y={[0, dMax]} width={320} height={260} xLabel="点の番号（10 が赤い点）" xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
            <Bars data={d.D.map((v, i) => ({ x: i + 1, y: v }))} width={0.7} color="c3" highlight={(x) => x === 10} highlightColor="c4" />
            <HLine y={1} color="c2" label="目安 1" />
          </Plot>
        </Card>
      </Compare>
      <p className="figure-readout">
        赤い点：てこ比 h = <strong>{round(d.h[k], 3)}</strong>、残差 e = <strong>{round(d.e[k], 2)}</strong>、標準化残差 = <strong>{round(d.r[k], 2)}</strong>、Cook の距離 D ={' '}
        <strong>{round(d.D[k], 2)}</strong>　／　傾き：全部 {round(d.b, 3)}、赤い点を除くと {round(base.b, 3)}
      </p>
      <Controls>
        <Slider label="赤い点の y" value={py} min={0} max={12} step={0.1} onChange={setPy} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** てこ比 hii を x の位置ごとに並べる（x = 1〜9 と x = 15 の10点） */
export function LeverageBars() {
  const xs = [...baseX, 15]
  const d = diagnose(xs, [...baseY, 9.4])
  return (
    <Plot x={[0, 16]} y={[0, 0.7]} xLabel="x の位置" yLabel="てこ比 h" yTicks={[0, 0.2, 0.4, 0.6]}>
      <Bars data={xs.map((x, i) => ({ x, y: d.h[i] }))} width={0.6} color="c1" highlight={(x) => x === 15} highlightColor="c4" labels={(v) => v.toFixed(2)} />
      <HLine y={(2 * 2) / 10} color="c2" label="平均の2倍 = 0.4" />
    </Plot>
  )
}
