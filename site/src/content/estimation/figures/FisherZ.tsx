import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

const X_LEFT = -0.97
const Y_BOTTOM = -2.6

/**
 * フィッシャーの z 変換 z = ½ log((1 + r)/(1 − r)) のグラフ。
 * z の世界で左右対称な区間（縦の太線）を r に戻すと、r の世界では非対称な区間（横の太線）になる。
 */
export function FisherZ() {
  const [r, setR] = useState(0.6)
  const [n, setN] = useState(28)
  const z = Math.atanh(r)
  const half = 1.96 / Math.sqrt(n - 3)
  const zl = z - half
  const zu = z + half
  const rl = Math.tanh(zl)
  const ru = Math.tanh(zu)
  return (
    <div>
      <Plot x={[-1, 1]} y={[-2.7, 2.7]} height={320} xLabel="相関係数 r" yLabel="z" xTicks={[-1, -0.5, 0, 0.5, 1]}>
        <Curve f={(x) => Math.atanh(x)} from={-0.995} to={0.995} color="c4" samples={400} />
        <Segment x1={X_LEFT} y1={zl} x2={X_LEFT} y2={zu} color="c1" width={7} />
        <Segment x1={X_LEFT} y1={zl} x2={rl} y2={zl} color="muted" dashed />
        <Segment x1={X_LEFT} y1={zu} x2={ru} y2={zu} color="muted" dashed />
        <Segment x1={rl} y1={zl} x2={rl} y2={Y_BOTTOM} color="muted" dashed />
        <Segment x1={ru} y1={zu} x2={ru} y2={Y_BOTTOM} color="muted" dashed />
        <Segment x1={rl} y1={Y_BOTTOM} x2={ru} y2={Y_BOTTOM} color="c2" width={7} />
        <Points data={[{ x: r, y: z }]} color="c5" r={6} opacity={1} />
      </Plot>
      <p className="figure-readout">
        r = {r} → z = <strong>{round(z, 3)}</strong>。z の区間 {round(z, 3)} ± {round(half, 3)} = [{round(zl, 3)}, {round(zu, 3)}]（青）
      </p>
      <p className="figure-readout">
        r に戻すと [<strong>{round(rl, 3)}</strong>, <strong>{round(ru, 3)}</strong>]（オレンジ）：r から左へ {round(r - rl, 3)}、右へ {round(ru - r, 3)}
      </p>
      <Controls>
        <Slider label="標本の相関係数 r" value={r} min={-0.9} max={0.9} step={0.05} onChange={(v) => setR(round(v, 2))} format={(v) => v.toFixed(2)} />
        <Slider label="標本の大きさ n" value={n} min={10} max={200} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
