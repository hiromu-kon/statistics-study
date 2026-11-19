import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Legend, Plot, Segment, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { die, expectation, transform, varianceOf } from './dist'

const EX = expectation(die)
const VX = varianceOf(die)

/**
 * サイコロの目 X を Y = aX + b に変換する。
 * b を動かすと分布は横に平行移動するだけ（散らばりは同じ）。a を動かすと間隔が |a| 倍に伸び縮みする。
 */
export function LinearTransform() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(0)
  const y = transform(die, a, b)
  const ey = expectation(y)
  const sdy = Math.sqrt(varianceOf(y))
  const w = Math.min(1, Math.abs(a)) * 0.85
  const barTop = 0.215
  return (
    <div>
      <Plot x={[-18, 21]} y={[0, 0.25]} height={260} xTicks={[-15, -10, -5, 0, 5, 10, 15, 20]} yTicks={[0, 0.1, 0.2]} xLabel="値" yLabel="確率">
        <Bars data={die.map((d) => ({ x: d.x, y: d.p }))} width={0.85} color="muted" opacity={0.35} />
        <Bars data={y.map((d) => ({ x: d.x, y: d.p }))} width={w} color="c1" opacity={0.8} />
        <VLine x={EX} color="muted" />
        <VLine x={ey} color="c2" />
        <Segment x1={ey} y1={barTop} x2={ey + sdy} y2={barTop} color="c3" width={2.5} arrow />
        <Segment x1={ey} y1={barTop} x2={ey - sdy} y2={barTop} color="c3" width={2.5} arrow />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: 'もとの X（サイコロの目）' },
          { color: 'c1', label: `Y = ${a}X ${b >= 0 ? '+' : '−'} ${Math.abs(b)}` },
          { color: 'c2', label: 'Y の期待値' },
          { color: 'c3', label: 'Y の期待値 ± 標準偏差' },
        ]}
      />
      <p className="figure-readout">
        E(Y) = {a} × 3.5 {b >= 0 ? '+' : '−'} {Math.abs(b)} = <strong>{round(ey, 3)}</strong>　V(Y) = {a < 0 ? `(${a})` : a}² × {round(VX, 3)} ={' '}
        <strong>{round(a * a * VX, 3)}</strong>　標準偏差 = |{a}| × {round(Math.sqrt(VX), 3)} = <strong>{round(sdy, 3)}</strong>
      </p>
      <Controls>
        <Slider
          label="かける数 a"
          value={a}
          min={-2}
          max={2.5}
          step={0.5}
          onChange={(v) => setA(v === 0 ? (a > 0 ? -0.5 : 0.5) : v)}
          format={(v) => String(v)}
        />
        <Slider label="足す数 b" value={b} min={-5} max={5} step={1} onChange={setB} format={(v) => String(v)} />
      </Controls>
    </div>
  )
}
