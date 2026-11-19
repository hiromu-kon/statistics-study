import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Curve, HLine, Label, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { Choice } from './parts'
import { fix } from './format'

type FnKey = 'square' | 'cubic'

const FNS: Record<FnKey, { f: (x: number) => number; df: (x: number) => number; tex: string; dtex: string; y: [number, number] }> = {
  square: { f: (x) => x * x, df: (x) => 2 * x, tex: 'f(x) = x^2', dtex: "f'(x) = 2x", y: [-2, 9] },
  cubic: { f: (x) => x ** 3 - 3 * x, df: (x) => 3 * x * x - 3, tex: 'f(x) = x^3 - 3x', dtex: "f'(x) = 3x^2 - 3", y: [-6, 6] },
}

/**
 * 2点を通る直線（割線）の傾きが、2点を近づけると接線の傾きに近づく様子。
 * 横の幅 h を小さくすると、割線（実線）が接線（点線）に重なっていく。
 */
export function TangentFigure() {
  const [key, setKey] = useState<FnKey>('square')
  const [a, setA] = useState(1)
  const [h, setH] = useState(1.5)
  const { f, df, tex, dtex, y } = FNS[key]
  const secant = (f(a + h) - f(a)) / h
  const tangent = df(a)
  return (
    <div>
      <Plot x={[-3, 3]} y={y} xTicks={[-3, -2, -1, 0, 1, 2, 3]} xLabel="x" yLabel="y">
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        <Curve f={f} color="c1" />
        <Curve f={(x) => f(a) + tangent * (x - a)} color="c3" dashed width={2} />
        <Curve f={(x) => f(a) + secant * (x - a)} color="c2" width={2} />
        <Points
          data={[
            { x: a, y: f(a), color: 'ink' },
            { x: a + h, y: f(a + h), color: 'c2' },
          ]}
          r={6}
          opacity={0.95}
        />
        <Label x={a} y={f(a)} dy={-12} anchor="end" color="ink">
          {'A '}
        </Label>
        <Label x={a + h} y={f(a + h)} dy={-12} anchor="start" color="c2">
          {' B'}
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: <M>{tex}</M> },
          { color: 'c2', label: 'A と B を通る直線（割線）' },
          { color: 'c3', label: 'A での接線（点線）' },
        ]}
      />
      <p className="figure-readout">
        割線の傾き <M>{`\\frac{f(${fix(a + h, 2)}) - f(${fix(a, 1)})}{${fix(h, 2)}} = ${fix(secant, 3)}`}</M>
        {'　'}→ h を 0 に近づけると、接線の傾き（導関数 <M>{dtex}</M> に a を代入した値）<M>{`f'(${fix(a, 1)}) = ${fix(tangent, 3)}`}</M> に近づく
      </p>
      <Controls>
        <Choice<FnKey>
          options={[
            { value: 'square', label: 'x²' },
            { value: 'cubic', label: 'x³ − 3x' },
          ]}
          value={key}
          onChange={setKey}
        />
      </Controls>
      <Controls>
        <Slider label="点 A の位置 a" value={a} min={-2} max={2} step={0.1} onChange={setA} format={(v) => v.toFixed(1)} />
        <Slider label="横の幅 h" value={h} min={0.01} max={2} step={0.01} onChange={setH} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

/**
 * f(x) = x³ − 3x と、その導関数 f'(x) = 3x² − 3 を上下に並べる。
 * f' が正のところで f は上り、負のところで下り、0 のところで山の頂上・谷の底になる。
 */
export function SlopeSignFigure() {
  const [a, setA] = useState(0.5)
  const f = FNS.cubic.f
  const df = FNS.cubic.df
  const slope = df(a)
  const state = Math.abs(slope) < 0.05 ? '傾き 0：山の頂上か谷の底（極値の候補）' : slope > 0 ? '傾きがプラス：右へ進むと上る（増加）' : '傾きがマイナス：右へ進むと下る（減少）'
  return (
    <div>
      <Plot x={[-2.5, 2.5]} y={[-5, 5]} height={220} xTicks={[-2, -1, 0, 1, 2]} yLabel="f(x)">
        <HLine y={0} color="muted" dashed={false} />
        <Curve f={f} color="c1" />
        <Curve f={(x) => f(a) + slope * (x - a)} from={a - 0.6} to={a + 0.6} color="c2" width={3} />
        <Points data={[{ x: a, y: f(a), color: 'c2' }]} r={6} opacity={0.95} />
        <Label x={-1} y={2} dy={-10} color="c4">
          極大 2
        </Label>
        <Label x={1} y={-2} dy={20} color="c4">
          極小 −2
        </Label>
      </Plot>
      <Plot x={[-2.5, 2.5]} y={[-4, 12]} height={200} xTicks={[-2, -1, 0, 1, 2]} yTicks={[-4, 0, 4, 8, 12]} xLabel="x" yLabel="f′(x)">
        <HLine y={0} color="ink" dashed={false} />
        <Curve f={df} color="c3" />
        <VLine x={a} color="c2" />
        <Points data={[{ x: a, y: slope, color: 'c2' }]} r={6} opacity={0.95} />
        <Points
          data={[
            { x: -1, y: 0, color: 'c4' },
            { x: 1, y: 0, color: 'c4' },
          ]}
          r={5}
        />
      </Plot>
      <p className="figure-readout">
        <M>{`x = ${fix(a, 1)}:\\quad f'(x) = 3 \\times (${fix(a, 1)})^2 - 3 = ${fix(slope, 2)}`}</M>　{state}
      </p>
      <Controls>
        <Slider label="x" value={a} min={-2.2} max={2.2} step={0.1} onChange={setA} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

const DATA = [3, 5, 10]

/**
 * 「データ 3, 5, 10 からのずれの2乗和」 g(a) = Σ(xᵢ − a)² を a の関数として描く。
 * 接線が水平になる a（g′(a) = 0）が、2乗和を最小にする a で、それは平均 6 になる。
 */
export function SquaredErrorFigure() {
  const [a, setA] = useState(3)
  const g = (t: number) => DATA.reduce((s, x) => s + (x - t) ** 2, 0)
  const dg = (t: number) => DATA.reduce((s, x) => s - 2 * (x - t), 0)
  return (
    <div>
      <Plot x={[0, 12]} y={[0, 120]} xTicks={[0, 2, 4, 6, 8, 10, 12]} yTicks={[0, 30, 60, 90, 120]} xLabel="a" yLabel="g(a)">
        <Curve f={g} color="c1" />
        <Curve f={(t) => g(a) + dg(a) * (t - a)} from={a - 1.5} to={a + 1.5} color="c2" width={3} />
        <Points data={[{ x: a, y: g(a), color: 'c2' }]} r={6} opacity={0.95} />
        <VLine x={6} color="c4" label="平均 6" />
      </Plot>
      <p className="figure-readout">
        <M>{`g(${fix(a, 1)}) = ${fix(g(a), 2)},\\quad g'(${fix(a, 1)}) = 6 \\times ${fix(a, 1)} - 36 = ${fix(dg(a), 1)}`}</M>
      </p>
      <Controls>
        <Slider label="a" value={a} min={1} max={11} step={0.5} onChange={setA} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
