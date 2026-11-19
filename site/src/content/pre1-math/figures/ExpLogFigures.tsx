import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Curve, HLine, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { Choice } from './parts'
import { fix } from './format'

/**
 * y = e^x と y = log x は、直線 y = x で折り返した関係（逆関数）。
 * 点 (t, e^t) を折り返すと (e^t, t) になり、log(e^t) = t が読み取れる。
 */
export function ExpLogFigure() {
  const [t, setT] = useState(1)
  const et = Math.exp(t)
  return (
    <div>
      <Plot x={[-3, 5]} y={[-3, 5]} width={420} height={410} xTicks={[-3, -2, -1, 0, 1, 2, 3, 4, 5]} yTicks={[-3, -2, -1, 0, 1, 2, 3, 4, 5]} xLabel="x" yLabel="y">
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        <Curve f={(x) => x} color="muted" dashed width={1.5} />
        <Curve f={Math.exp} color="c1" />
        <Curve f={Math.log} from={0.01} to={5} color="c2" samples={400} />
        <Segment x1={t} y1={et} x2={et} y2={t} color="c4" dashed />
        <Points
          data={[
            { x: t, y: et, color: 'c1' },
            { x: et, y: t, color: 'c2' },
          ]}
          r={6}
          opacity={0.95}
        />
        <Label x={1} y={1} dy={-8} anchor="end" color="muted">
          {'y = x '}
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'y = e^x' },
          { color: 'c2', label: 'y = log x' },
        ]}
      />
      <p className="figure-readout">
        <M>{`e^{${fix(t, 1)}} \\approx ${fix(et, 3)} \\quad\\Longleftrightarrow\\quad \\log ${fix(et, 3)} \\approx ${fix(t, 1)}`}</M>
        <br />
        傾き：<M>{`(e^x)' = e^x`}</M> なので x = {fix(t, 1)} での傾きは {fix(et, 3)}、<M>{`(\\log x)' = \\frac{1}{x}`}</M> なので x = {fix(et, 3)} での傾きは {fix(1 / et, 3)}
      </p>
      <Controls>
        <Slider label="t" value={t} min={-2} max={1.6} step={0.1} onChange={setT} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

const N = 10

/**
 * 10 回中 k 回成功したときの尤度 L(p) = p^k (1 − p)^(10−k) と、その対数 log L(p)。
 * 2つのグラフは同じ p で一番高くなり、そこでは log L の接線が水平（微分が 0）になる。
 */
export function LikelihoodFigure() {
  const [k, setK] = useState(7)
  const [p, setP] = useState(0.5)
  const L = (q: number) => q ** k * (1 - q) ** (N - k)
  const logL = (q: number) => k * Math.log(q) + (N - k) * Math.log(1 - q)
  const dlogL = (q: number) => k / q - (N - k) / (1 - q)
  const peak = L(k / N)
  const slope = dlogL(p)
  return (
    <div>
      <Plot x={[0, 1]} y={[0, peak * 1.2]} height={200} xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]} hideY>
        <Curve f={L} color="c1" from={0.001} to={0.999} samples={300} />
        <VLine x={k / N} color="c4" label={`p = ${k}/${N}`} />
        <Points data={[{ x: p, y: L(p), color: 'c2' }]} r={6} opacity={0.95} />
        <Label x={0.02} y={peak * 1.08} anchor="start" color="c1">
          尤度 L(p)
        </Label>
      </Plot>
      <Plot x={[0, 1]} y={[-20, 0]} height={220} xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]} yTicks={[-20, -15, -10, -5, 0]} xLabel="p" yLabel="log L(p)">
        <Curve f={logL} color="c3" from={0.01} to={0.99} samples={300} />
        <Curve f={(q) => logL(p) + slope * (q - p)} from={Math.max(0.01, p - 0.12)} to={Math.min(0.99, p + 0.12)} color="c2" width={3} />
        <VLine x={k / N} color="c4" />
        <Points data={[{ x: p, y: logL(p), color: 'c2' }]} r={6} opacity={0.95} />
      </Plot>
      <p className="figure-readout">
        <M>{`\\frac{d}{dp}\\log L(p) = \\frac{${k}}{p} - \\frac{${N - k}}{1-p} = \\frac{${k}}{${fix(p, 2)}} - \\frac{${N - k}}{${fix(1 - p, 2)}} = ${fix(slope, 2)}`}</M>
        <br />
        {Math.abs(p - k / N) < 1e-6 ? '傾きが 0：ここが一番高い（最尤推定値）' : slope > 0 ? '傾きがプラス：p を大きくすると高くなる' : '傾きがマイナス：p を小さくすると高くなる'}
      </p>
      <Controls>
        <Slider label="成功の回数 k（10回中）" value={k} min={1} max={9} step={1} onChange={setK} />
        <Slider label="p" value={p} min={0.05} max={0.95} step={0.05} onChange={setP} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

type ApproxKey = 'sqrt' | 'log' | 'exp'

const APPROX: Record<ApproxKey, { f: (x: number) => number; df: (x: number) => number; a: number; range: [number, number]; y: [number, number]; ftex: string; linetex: string }> = {
  sqrt: { f: Math.sqrt, df: (x) => 1 / (2 * Math.sqrt(x)), a: 4, range: [0, 9], y: [0, 3.5], ftex: '\\sqrt{x}', linetex: '2 + \\frac{1}{4}(x - 4)' },
  log: { f: Math.log, df: (x) => 1 / x, a: 1, range: [0.1, 3], y: [-2.5, 2], ftex: '\\log x', linetex: 'x - 1' },
  exp: { f: Math.exp, df: Math.exp, a: 0, range: [-2, 2], y: [-1, 7], ftex: 'e^x', linetex: '1 + x' },
}

/**
 * 1次近似（接線で近似する）f(x) ≒ f(a) + f′(a)(x − a)。
 * a の近くでは接線と曲線がほとんど重なり、離れるほどずれる。デルタ法の準備。
 */
export function LinearApproxFigure() {
  const [key, setKey] = useState<ApproxKey>('sqrt')
  const s = APPROX[key]
  const [x, setX] = useState(5)
  const line = (t: number) => s.f(s.a) + s.df(s.a) * (t - s.a)
  const change = (k: ApproxKey) => {
    setKey(k)
    setX(k === 'sqrt' ? 5 : k === 'log' ? 1.2 : 0.3)
  }
  const step = key === 'sqrt' ? 0.1 : 0.05
  return (
    <div>
      <Plot x={s.range} y={s.y} xLabel="x" yLabel="y">
        <Curve f={s.f} color="c1" samples={300} />
        <Curve f={line} color="c3" dashed />
        <VLine x={s.a} color="muted" />
        <Segment x1={x} y1={s.f(x)} x2={x} y2={line(x)} color="c2" width={3} />
        <Points
          data={[
            { x: s.a, y: s.f(s.a), color: 'ink' },
            { x, y: s.f(x), color: 'c1' },
            { x, y: line(x), color: 'c3' },
          ]}
          r={5}
          opacity={0.95}
        />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: <M>{`y = ${s.ftex}`}</M> },
          { color: 'c3', label: <M>{`y = ${s.linetex}`}</M> },
          { color: 'c2', label: 'ずれ' },
        ]}
      />
      <p className="figure-readout">
        本当の値 {fix(s.f(x), 4)}、接線での近似 {fix(line(x), 4)}、ずれ {fix(line(x) - s.f(x), 4)}
      </p>
      <Controls>
        <Choice<ApproxKey>
          options={[
            { value: 'sqrt', label: '√x（a = 4）' },
            { value: 'log', label: 'log x（a = 1）' },
            { value: 'exp', label: 'e^x（a = 0）' },
          ]}
          value={key}
          onChange={change}
        />
      </Controls>
      <Controls>
        <Slider label="x" value={x} min={s.range[0] + step} max={s.range[1]} step={step} onChange={setX} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
