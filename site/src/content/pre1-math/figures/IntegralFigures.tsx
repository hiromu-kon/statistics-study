import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Area, Curve, Legend, Plot, VLine } from '../../../components/charts/Plot'
import { Choice, Rect } from './parts'
import { fix } from './format'

type ShapeKey = 'power' | 'exp'

const SHAPES: Record<
  ShapeKey,
  { f: (x: number) => number; F: (x: number) => number; x: [number, number]; y: [number, number]; ticks: number[]; tex: string; Ftex: string; step: number }
> = {
  power: {
    f: (x) => (x >= 0 && x <= 1 ? 3 * x * x : 0),
    F: (x) => Math.min(Math.max(x, 0), 1) ** 3,
    x: [-0.1, 1.1],
    y: [0, 3.3],
    ticks: [0, 0.2, 0.4, 0.6, 0.8, 1],
    tex: 'f(x) = 3x^2\\ (0 \\le x \\le 1)',
    Ftex: 'F(x) = x^3',
    step: 0.05,
  },
  exp: {
    f: (x) => (x >= 0 ? Math.exp(-x) : 0),
    F: (x) => (x <= 0 ? 0 : 1 - Math.exp(-x)),
    x: [-0.25, 5],
    y: [0, 1.1],
    ticks: [0, 1, 2, 3, 4, 5],
    tex: 'f(x) = e^{-x}\\ (x \\ge 0)',
    Ftex: 'F(x) = -e^{-x}',
    step: 0.1,
  },
}

/**
 * 曲線の下の面積を、細い長方形の面積の合計（Σ）で近づける図。
 * 長方形の本数を増やすと、合計が「積分で求めた面積 F(b) − F(a)」に近づく。
 */
export function IntegralAreaFigure() {
  const [key, setKey] = useState<ShapeKey>('power')
  const [a, setA] = useState(0.5)
  const [b, setB] = useState(1)
  const [n, setN] = useState(4)
  const s = SHAPES[key]
  const exact = s.F(b) - s.F(a)
  const w = (b - a) / n
  const rects = Array.from({ length: n }, (_, i) => {
    const x0 = a + i * w
    return { x0, x1: x0 + w, h: s.f(x0 + w / 2) }
  })
  const approx = rects.reduce((t, r) => t + r.h * w, 0)
  const change = (k: ShapeKey) => {
    setKey(k)
    if (k === 'power') {
      setA(0.5)
      setB(1)
    } else {
      setA(1)
      setB(3)
    }
  }
  return (
    <div>
      <Plot x={s.x} y={s.y} xTicks={s.ticks} xLabel="x" yLabel="f(x)">
        <Area f={s.f} from={a} to={b} color="c1" opacity={0.18} samples={200} />
        {n > 0 && rects.map((r) => <Rect key={r.x0} x0={r.x0} x1={r.x1} y0={0} y1={r.h} color="c3" opacity={0.35} stroke="c3" />)}
        <Curve f={s.f} color="c1" samples={400} />
        <VLine x={a} color="c2" />
        <VLine x={b} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: <M>{s.tex}</M> },
          { color: 'c3', label: `長方形 ${n} 本（高さは各区間の真ん中の f の値）` },
        ]}
      />
      <p className="figure-readout">
        長方形の面積の合計 ≒ <strong>{fix(approx, 4)}</strong>
        {'　'}積分（<M>{s.Ftex}</M> を使う）<M>{`\\int_{${fix(a, 2)}}^{${fix(b, 2)}} f(x)\\,dx = F(${fix(b, 2)}) - F(${fix(a, 2)}) = ${fix(exact, 4)}`}</M>
      </p>
      <Controls>
        <Choice<ShapeKey>
          options={[
            { value: 'power', label: '3x²' },
            { value: 'exp', label: 'e^(−x)' },
          ]}
          value={key}
          onChange={change}
        />
      </Controls>
      <Controls>
        <Slider label="左端 a" value={a} min={0} max={s.x[1] - 0.1} step={s.step} onChange={(v) => setA(Math.min(v, b))} format={(v) => v.toFixed(2)} />
        <Slider label="右端 b" value={b} min={0} max={s.x[1] - 0.1} step={s.step} onChange={(v) => setB(Math.max(v, a))} format={(v) => v.toFixed(2)} />
        <Slider label="長方形の本数" value={n} min={1} max={50} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}

type DensityKey = 'uniform' | 'linear' | 'square'

const DENSITIES: Record<DensityKey, { f: (x: number) => number; tex: string; xftex: string; mean: string; meanValue: number }> = {
  uniform: { f: () => 1, tex: 'f(x) = 1', xftex: 'x f(x) = x', mean: '\\int_0^1 x\\,dx = \\frac{1}{2}', meanValue: 1 / 2 },
  linear: { f: (x) => 2 * x, tex: 'f(x) = 2x', xftex: 'x f(x) = 2x^2', mean: '\\int_0^1 2x^2\\,dx = \\frac{2}{3}', meanValue: 2 / 3 },
  square: { f: (x) => 3 * x * x, tex: 'f(x) = 3x^2', xftex: 'x f(x) = 3x^3', mean: '\\int_0^1 3x^3\\,dx = \\frac{3}{4}', meanValue: 3 / 4 },
}

/**
 * 期待値 E[X] = ∫ x f(x) dx を、「x f(x) のグラフの下の面積」として見せる。
 * 右のほうに重みがある密度ほど、x f(x) の面積（＝期待値）が大きくなる。
 */
export function ExpectationFigure() {
  const [key, setKey] = useState<DensityKey>('linear')
  const d = DENSITIES[key]
  const inside = (g: (x: number) => number) => (x: number) => (x >= 0 && x <= 1 ? g(x) : 0)
  return (
    <div>
      <Plot x={[-0.1, 1.1]} y={[0, 3.3]} xTicks={[0, 0.25, 0.5, 0.75, 1]} xLabel="x" yLabel="高さ">
        <Area f={inside((x) => x * d.f(x))} from={0} to={1} color="c4" opacity={0.3} samples={200} />
        <Curve f={inside(d.f)} color="c1" samples={400} />
        <Curve f={inside((x) => x * d.f(x))} color="c4" samples={400} dashed />
        <VLine x={d.meanValue} color="c2" label="E[X]" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: <M>{`${d.tex}\\ (0 \\le x \\le 1)`}</M> },
          { color: 'c4', label: <M>{d.xftex}</M> },
        ]}
      />
      <p className="figure-readout">
        塗った面積 = 期待値 <M>{`E[X] = ${d.mean}`}</M>
      </p>
      <Controls>
        <Choice<DensityKey>
          options={[
            { value: 'uniform', label: '1（一様）' },
            { value: 'linear', label: '2x' },
            { value: 'square', label: '3x²' },
          ]}
          value={key}
          onChange={setKey}
        />
      </Controls>
    </div>
  )
}
