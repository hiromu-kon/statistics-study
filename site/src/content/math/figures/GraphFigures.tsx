import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Area, Curve, HLine, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

const signed = (v: number) => (v < 0 ? `- ${Math.abs(v)}` : `+ ${v}`)

/** 一次関数 y = a + bx。切片 a と傾き b を動かし、「x が1増えると y が b 増える」三角形を見せる */
export function LinePlot() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(1.5)
  const f = (x: number) => a + b * x
  return (
    <div>
      <Plot x={[-1, 6]} y={[-8, 16]} xTicks={[-1, 0, 1, 2, 3, 4, 5, 6]} yTicks={[-8, -4, 0, 4, 8, 12, 16]} xLabel="x" yLabel="y">
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        <Curve f={f} color="c1" />
        <Segment x1={2} y1={f(2)} x2={3} y2={f(2)} color="c2" width={2.5} />
        <Segment x1={3} y1={f(2)} x2={3} y2={f(3)} color="c3" width={2.5} />
        <Label x={2.5} y={f(2)} dy={b >= 0 ? 16 : -8} color="c2">
          1
        </Label>
        <Label x={3} y={(f(2) + f(3)) / 2} dy={4} anchor="start" color="c3">
          {` 傾き b = ${b}`}
        </Label>
        <Points data={[{ x: 0, y: a, color: 'c5' }]} r={7} opacity={0.95} />
        <Label x={0} y={a} dy={-12} anchor="start" color="c5">
          {` 切片 a = ${a}`}
        </Label>
      </Plot>
      <p className="figure-readout">
        <M>{`y = ${a} ${signed(b)}x`}</M>　（x = 0 のとき y = {a}、x が 1 増えるごとに y が {b} {b >= 0 ? '増える' : '減る（マイナス分増える）'}）
      </p>
      <Controls>
        <Slider label="切片 a" value={a} min={-5} max={10} step={0.5} onChange={setA} format={(v) => v.toFixed(1)} />
        <Slider label="傾き b" value={b} min={-3} max={3} step={0.5} onChange={setB} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/**
 * グラフの下の面積 = 確率。全体の面積が1になる2つの形（長方形・三角形）で、
 * 区間の左端と右端を動かして面積を求める。
 */
export function AreaUnderCurve({ shape }: { shape: 'uniform' | 'triangle' }) {
  const [from, setFrom] = useState(shape === 'uniform' ? 2 : 4)
  const [to, setTo] = useState(shape === 'uniform' ? 5 : 8)
  const f = shape === 'uniform' ? (x: number) => (x >= 0 && x <= 10 ? 0.1 : 0) : (x: number) => (x >= 0 && x <= 10 ? x / 50 : 0)
  const area = shape === 'uniform' ? (to - from) * 0.1 : (to * to - from * from) / 100
  return (
    <div>
      <Plot x={[-1, 11]} y={[0, shape === 'uniform' ? 0.16 : 0.24]} xTicks={[0, 2, 4, 6, 8, 10]} xLabel="x" yLabel="高さ">
        <Area f={f} from={from} to={to} color="c1" opacity={0.4} samples={200} />
        <Curve f={f} color="c1" samples={600} />
        <VLine x={from} color="c2" />
        <VLine x={to} color="c2" />
      </Plot>
      <p className="figure-readout">
        {shape === 'uniform' ? (
          <>
            面積 = 横 × 縦 = <M>{`(${to} - ${from}) \\times 0.1 = ${round(area, 3)}`}</M>
          </>
        ) : (
          <>
            面積 = 大きい三角形 − 小さい三角形 = <M>{`\\frac{${to}^2 - ${from}^2}{100} = ${round(area, 3)}`}</M>
          </>
        )}
        {'　'}（全体の面積は 1）
      </p>
      <Controls>
        <Slider label="左端" value={from} min={0} max={10} step={0.5} onChange={(v) => setFrom(Math.min(v, to))} format={(v) => v.toFixed(1)} />
        <Slider label="右端" value={to} min={0} max={10} step={0.5} onChange={(v) => setTo(Math.max(v, from))} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** 2^x と e^x。x が1増えるごとに何倍にもなる「倍々」の増え方 */
export function ExpGrowth() {
  const [x, setX] = useState(2)
  return (
    <div>
      <Plot x={[-3, 3]} y={[0, 12]} xTicks={[-3, -2, -1, 0, 1, 2, 3]} yTicks={[0, 2, 4, 6, 8, 10, 12]} xLabel="x" yLabel="y">
        <Curve f={(t) => 2 ** t} color="c1" />
        <Curve f={(t) => Math.exp(t)} color="c2" />
        <HLine y={1} color="muted" label="1" />
        <VLine x={x} color="muted" />
        <Points
          data={[
            { x, y: 2 ** x, color: 'c1' },
            { x, y: Math.exp(x), color: 'c2' },
          ]}
          r={6}
          opacity={0.95}
        />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'y = 2^x' },
          { color: 'c2', label: 'y = e^x（e ≒ 2.718）' },
        ]}
      />
      <p className="figure-readout">
        <M>{`2^{${x}} \\approx ${round(2 ** x, 3)}, \\quad e^{${x}} \\approx ${round(Math.exp(x), 3)}`}</M>
      </p>
      <Controls>
        <Slider label="x" value={x} min={-3} max={3} step={0.5} onChange={setX} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** e^{-kx}。k を大きくすると速く減るが、0 にはならない（指数分布の準備） */
export function ExpDecay() {
  const [k, setK] = useState(1)
  return (
    <div>
      <Plot x={[0, 5]} y={[0, 1.1]} xTicks={[0, 1, 2, 3, 4, 5]} yTicks={[0, 0.25, 0.5, 0.75, 1]} xLabel="x" yLabel="y">
        <Curve f={(t) => Math.exp(-t)} color="muted" dashed />
        <Curve f={(t) => Math.exp(-k * t)} color="c1" />
        <Points data={[{ x: 1, y: Math.exp(-k), color: 'c2' }]} r={6} opacity={0.95} />
        <Label x={1} y={Math.exp(-k)} dy={-10} anchor="start" color="c2">
          {` x = 1 のとき ${round(Math.exp(-k), 3)}`}
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `y = e^(−${k}x)` },
          { color: 'muted', label: 'y = e^(−x)（k = 1）' },
        ]}
      />
      <p className="figure-readout">
        <M>{`e^{-${k} \\times 1} = \\frac{1}{e^{${k}}} \\approx ${round(Math.exp(-k), 4)}`}</M>
      </p>
      <Controls>
        <Slider label="減り方 k" value={k} min={0.2} max={3} step={0.1} onChange={setK} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** e^{-x²/(2σ²)}。指数の中に2乗が入ると、正規分布と同じつりがね型になる */
export function BellShape() {
  const [s, setS] = useState(1)
  return (
    <div>
      <Plot x={[-4, 4]} y={[0, 1.15]} xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} yTicks={[0, 0.5, 1]} xLabel="x">
        <Curve f={(t) => Math.exp(-(t * t) / 2)} color="muted" dashed />
        <Curve f={(t) => Math.exp(-(t * t) / (2 * s * s))} color="c4" />
      </Plot>
      <p className="figure-readout">
        <M>{`y = e^{-\\frac{x^2}{2 \\times ${s}^2}}`}</M>　（点線は s = 1）
      </p>
      <Controls>
        <Slider label="広がり s" value={s} min={0.5} max={2} step={0.1} onChange={setS} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
