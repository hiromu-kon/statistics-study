import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Curve, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { Choice, Polyline, Rect } from './parts'
import { fix } from './format'

// f(x, y) = 10 − (x − 2)² − 2(y − 1)²。頂上は (2, 1) で高さ 10
const peakF = (x: number, y: number) => 10 - (x - 2) ** 2 - 2 * (y - 1) ** 2
const LEVELS = [9, 7, 5, 3, 1]

function ellipse(level: number) {
  // (x − 2)² + 2(y − 1)² = 10 − level の楕円
  const r = Math.sqrt(10 - level)
  return Array.from({ length: 121 }, (_, i) => {
    const t = (2 * Math.PI * i) / 120
    return { x: 2 + r * Math.cos(t), y: 1 + (r / Math.SQRT2) * Math.sin(t) }
  })
}

/**
 * 2変数関数を等高線（同じ高さを結んだ線）で描き、点 (x₀, y₀) での偏微分を見せる。
 * 下の図は「y を y₀ に固定して x だけ動かした断面」で、その接線の傾きが ∂f/∂x。
 */
export function ContourFigure() {
  const [x0, setX0] = useState(0.5)
  const [y0, setY0] = useState(2)
  const fx = -2 * (x0 - 2)
  const fy = -4 * (y0 - 1)
  const slice = (x: number) => peakF(x, y0)
  return (
    <div>
      <Plot x={[-1, 5]} y={[-1.5, 3.5]} width={480} height={401} xTicks={[-1, 0, 1, 2, 3, 4, 5]} yTicks={[-1, 0, 1, 2, 3]} xLabel="x" yLabel="y">
        {LEVELS.map((c, i) => (
          <Polyline key={c} points={ellipse(c)} color="c1" width={1.5} opacity={0.35 + i * 0.12} />
        ))}
        {LEVELS.map((c) => (
          <Label key={c} x={2} y={1 + Math.sqrt(10 - c) / Math.SQRT2} dy={-4} color="c1">
            {c}
          </Label>
        ))}
        <Segment x1={-1} y1={y0} x2={5} y2={y0} color="c2" dashed />
        <Segment x1={x0} y1={-1.5} x2={x0} y2={3.5} color="c3" dashed />
        <Segment x1={x0} y1={y0} x2={x0 + 0.12 * fx} y2={y0} color="c2" width={3} arrow />
        <Segment x1={x0} y1={y0} x2={x0} y2={y0 + 0.12 * fy} color="c3" width={3} arrow />
        <Points
          data={[
            { x: 2, y: 1, color: 'c4' },
            { x: x0, y: y0, color: 'ink' },
          ]}
          r={6}
          opacity={0.95}
        />
        <Label x={2} y={1} dy={18} color="c4">
          頂上 (2, 1)
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '等高線（数字は高さ）' },
          { color: 'c2', label: 'x 方向の傾き ∂f/∂x（矢印）' },
          { color: 'c3', label: 'y 方向の傾き ∂f/∂y（矢印）' },
        ]}
      />
      <Plot x={[-1, 5]} y={[-6, 11]} height={200} xTicks={[-1, 0, 1, 2, 3, 4, 5]} yTicks={[-5, 0, 5, 10]} xLabel="x" yLabel={`y = ${fix(y0, 1)} での断面`}>
        <Curve f={slice} color="c2" />
        <Curve f={(x) => slice(x0) + fx * (x - x0)} from={x0 - 0.8} to={x0 + 0.8} color="ink" width={2.5} />
        <VLine x={x0} color="c3" />
        <Points data={[{ x: x0, y: slice(x0), color: 'ink' }]} r={6} opacity={0.95} />
      </Plot>
      <p className="figure-readout">
        <M>{`f(${fix(x0, 1)}, ${fix(y0, 1)}) = ${fix(peakF(x0, y0), 2)},\\quad \\frac{\\partial f}{\\partial x} = -2(x - 2) = ${fix(fx, 1)},\\quad \\frac{\\partial f}{\\partial y} = -4(y - 1) = ${fix(fy, 1)}`}</M>
        {fx === 0 && fy === 0 && <><br />両方の偏微分が 0：ここが頂上</>}
      </p>
      <Controls>
        <Slider label="x₀" value={x0} min={-0.5} max={4.5} step={0.5} onChange={setX0} format={(v) => v.toFixed(1)} />
        <Slider label="y₀" value={y0} min={-1} max={3} step={0.5} onChange={setY0} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

type JointKey = 'sum' | 'product'

const JOINTS: Record<JointKey, { f: (x: number, y: number) => number; max: number; tex: string; prob: (a: number, b: number) => number; probTex: (a: string, b: string) => string }> = {
  sum: {
    f: (x, y) => x + y,
    max: 2,
    tex: 'f(x, y) = x + y',
    prob: (a, b) => (a * b * (a + b)) / 2,
    probTex: (a, b) => `\\frac{${a} \\times ${b} \\times (${a} + ${b})}{2}`,
  },
  product: {
    f: (x, y) => 4 * x * y,
    max: 4,
    tex: 'f(x, y) = 4xy',
    prob: (a, b) => a * a * b * b,
    probTex: (a, b) => `${a}^2 \\times ${b}^2`,
  },
}

const CELLS = 20

/**
 * 正方形 0 ≤ x ≤ 1, 0 ≤ y ≤ 1 の上の同時確率密度を色の濃さで描き、
 * 長方形 0 ≤ x ≤ a, 0 ≤ y ≤ b に入る確率（その上の体積）を重積分で求める。
 */
export function DoubleIntegralFigure() {
  const [key, setKey] = useState<JointKey>('sum')
  const [a, setA] = useState(0.5)
  const [b, setB] = useState(0.5)
  const j = JOINTS[key]
  const w = 1 / CELLS
  const cells = []
  for (let i = 0; i < CELLS; i++)
    for (let k = 0; k < CELLS; k++) cells.push({ x0: i * w, y0: k * w, v: j.f((i + 0.5) * w, (k + 0.5) * w) / j.max })
  return (
    <div>
      <Plot x={[0, 1]} y={[0, 1]} width={400} height={390} xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[0, 0.25, 0.5, 0.75, 1]} xLabel="x" yLabel="y" grid={false}>
        {cells.map((c) => (
          <Rect key={`${c.x0}-${c.y0}`} x0={c.x0} x1={c.x0 + w} y0={c.y0} y1={c.y0 + w} color="c1" opacity={0.08 + 0.7 * c.v} />
        ))}
        <Rect x0={0} x1={a} y0={0} y1={b} color="c2" opacity={0.25} stroke="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: <span>濃いほど密度 <M>{j.tex}</M> が大きい</span> },
          { color: 'c2', label: '確率を求める長方形' },
        ]}
      />
      <p className="figure-readout">
        <M>{`P(X \\le ${fix(a, 2)},\\ Y \\le ${fix(b, 2)}) = \\int_0^{${fix(a, 2)}} \\int_0^{${fix(b, 2)}} f(x, y)\\,dy\\,dx = ${j.probTex(fix(a, 2), fix(b, 2))} = ${fix(j.prob(a, b), 4)}`}</M>
      </p>
      <Controls>
        <Choice<JointKey>
          options={[
            { value: 'sum', label: 'x + y' },
            { value: 'product', label: '4xy' },
          ]}
          value={key}
          onChange={setKey}
        />
      </Controls>
      <Controls>
        <Slider label="a（x の上限）" value={a} min={0.05} max={1} step={0.05} onChange={setA} format={(v) => v.toFixed(2)} />
        <Slider label="b（y の上限）" value={b} min={0.05} max={1} step={0.05} onChange={setB} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

/**
 * X が 0〜1 の一様分布のとき、Y = cX の密度。横に c 倍に伸ばすと、
 * 面積 1 を保つために高さは 1/c 倍になる。この「1/c」が |dx/dy|（ヤコビアンの1変数版）。
 */
export function StretchFigure() {
  const [c, setC] = useState(2)
  const fx = (x: number) => (x >= 0 && x <= 1 ? 1 : 0)
  const fy = (y: number) => (y >= 0 && y <= c ? 1 / c : 0)
  return (
    <div>
      <Plot x={[-0.2, 3.2]} y={[0, 2.2]} xTicks={[0, 0.5, 1, 1.5, 2, 2.5, 3]} yTicks={[0, 0.5, 1, 1.5, 2]} xLabel="値" yLabel="密度">
        <Rect x0={0} x1={1} y0={0} y1={1} color="muted" opacity={0.2} stroke="muted" />
        <Rect x0={0} x1={c} y0={0} y1={1 / c} color="c1" opacity={0.3} stroke="c1" />
        <Curve f={fx} color="muted" samples={600} dashed />
        <Curve f={fy} color="c1" samples={600} />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: 'X の密度（0〜1 で高さ 1）' },
          { color: 'c1', label: `Y = ${c}X の密度` },
        ]}
      />
      <p className="figure-readout">
        <M>{`f_Y(y) = f_X\\!\\left(\\frac{y}{${c}}\\right) \\times \\left|\\frac{dx}{dy}\\right| = 1 \\times \\frac{1}{${c}} = ${fix(1 / c, 3)}`}</M>
        {'　'}面積は <M>{`${c} \\times \\frac{1}{${c}} = 1`}</M> のまま
      </p>
      <Controls>
        <Slider label="伸ばす倍率 c" value={c} min={0.5} max={3} step={0.25} onChange={setC} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
