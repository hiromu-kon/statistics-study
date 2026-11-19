import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, HLine, Label, Legend, Plot, Points, Segment, colorVar, usePlot, type Color } from '../../../components/charts/Plot'
import { normalPdf, round } from '../../../lib/stats'
import { chiSquareUniform, gini, lorenzPoints } from './summary'

function Gap({ pts, color }: { pts: { x: number; y: number }[]; color: Color }) {
  const s = usePlot()
  // 対角線（0,0）→（1,1）と、ローレンツ曲線を逆向きにたどって囲む
  const d = `M${s.x(0)},${s.y(0)} L${s.x(1)},${s.y(1)} ` + [...pts].reverse().map((p) => `L${s.x(p.x)},${s.y(p.y)}`).join(' ') + ' Z'
  return <path d={d} fill={colorVar(color)} opacity={0.22} />
}

/** ローレンツ曲線。values は各グループ（各世帯）の所得 */
export function LorenzPlot({
  curves,
  shade = true,
  height = 360,
  showPoints = true,
  showGini = true,
}: {
  curves: { values: number[]; color: Color; label: string }[]
  shade?: boolean
  height?: number
  showPoints?: boolean
  /** 凡例にジニ係数を出す。問題で答えが見えてしまうときは false */
  showGini?: boolean
}) {
  return (
    <div style={{ maxWidth: 460, margin: '0 auto' }}>
      <Plot
        x={[0, 1]}
        y={[0, 1]}
        width={420}
        height={height}
        xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        yTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        xLabel="所得の低い順に並べた世帯の累積比率"
        yLabel="所得の累積比率"
      >
        {shade && curves.map((c) => <Gap key={c.label} pts={lorenzPoints(c.values)} color={c.color} />)}
        <Segment x1={0} y1={0} x2={1} y2={1} color="muted" dashed />
        <Label x={0.62} y={0.7} color="muted">
          完全平等線
        </Label>
        {curves.map((c) => {
          const pts = lorenzPoints(c.values)
          return (
            <g key={c.label}>
              {pts.slice(1).map((p, i) => (
                <Segment key={i} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y} color={c.color} width={2.5} />
              ))}
              {showPoints && <Points data={pts} color={c.color} r={4.5} opacity={1} />}
            </g>
          )
        })}
      </Plot>
      <Legend items={curves.map((c) => ({ color: c.color, label: showGini ? `${c.label}（ジニ係数 ${round(gini(c.values), 3)}）` : c.label }))} />
    </div>
  )
}

/** 格差の大きさを動かして、ローレンツ曲線とジニ係数の変化を見る */
export function LorenzInteractive() {
  const [k, setK] = useState(0.5)
  // 5つの世帯の所得を「1つ上のグループほど e^k 倍」にする。k = 0 なら全員同じ
  const values = [0, 1, 2, 3, 4].map((i) => round(100 * Math.exp(k * i), 0))
  return (
    <div>
      <LorenzPlot curves={[{ values, color: 'c1', label: '5世帯' }]} />
      <p className="figure-readout">所得：{values.join('、')}（万円）</p>
      <Controls>
        <Slider label="格差の大きさ" value={k} min={0} max={1.5} step={0.05} onChange={setK} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

const gamma4 = (x: number) => (x <= 0 ? 0 : (x ** 3 * Math.exp(-x)) / 6)

/** 歪度の符号と形の対応 */
export function SkewnessGallery() {
  const items: { title: string; f: (x: number) => number; color: Color }[] = [
    { title: '歪度 < 0（左に裾が長い）', f: (x) => gamma4(14 - x), color: 'c3' },
    { title: '歪度 = 0（左右対称）', f: (x) => normalPdf(x, 7, 2), color: 'c1' },
    { title: '歪度 > 0（右に裾が長い）', f: gamma4, color: 'c2' },
  ]
  return (
    <Compare>
      {items.map((it) => (
        <Card key={it.title} title={it.title}>
          <Plot x={[0, 14]} y={[0, 0.24]} height={140} hideY grid={false} xTicks={[]}>
            <Curve f={it.f} color={it.color} />
          </Plot>
        </Card>
      ))}
    </Compare>
  )
}

/** 平均0・分散1をそろえた3つの分布で、尖度（とがり具合と裾の重さ）を比べる */
export function KurtosisCompare() {
  const b = 1 / Math.SQRT2
  const r3 = Math.sqrt(3)
  return (
    <div>
      <Plot x={[-4, 4]} y={[0, 0.75]} height={240} hideY grid={false} xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]}>
        <Curve f={(x) => (Math.abs(x) <= r3 ? 1 / (2 * r3) : 0)} color="c3" samples={400} />
        <Curve f={(x) => normalPdf(x)} color="c1" />
        <Curve f={(x) => Math.exp(-Math.abs(x) / b) / (2 * b)} color="c2" samples={400} />
      </Plot>
      <Legend
        items={[
          { color: 'c2', label: 'とがっていて裾が重い（尖度が大きい）' },
          { color: 'c1', label: '正規分布（基準）' },
          { color: 'c3', label: '平ら（一様分布・尖度が小さい）' },
        ]}
      />
    </div>
  )
}

/** サイコロを60回ふった結果と、一様な場合の期待度数とのずれ */
export function ChiSquareDice({ observed, title }: { observed: number[]; title: string }) {
  const { expected, total } = chiSquareUniform(observed)
  return (
    <Card title={title}>
      <Plot x={[0.4, 6.6]} y={[0, 24]} height={190} xTicks={[1, 2, 3, 4, 5, 6]} yTicks={[0, 5, 10, 15, 20]} xLabel="出た目">
        <Bars data={observed.map((o, i) => ({ x: i + 1, y: o }))} width={0.6} labels={(y) => String(y)} />
        <HLine y={expected} color="c2" label={`期待度数 ${expected}`} />
      </Plot>
      <p className="figure-readout">
        カイ二乗値 = <strong>{round(total, 2)}</strong>
      </p>
    </Card>
  )
}
