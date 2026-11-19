import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Curve, Label, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

/**
 * 正方形の1辺と面積の関係。
 * mode="square" は1辺を動かして面積（2乗）を、mode="root" は面積を動かして1辺（ルート）を見る。
 */
export function SquareArea({ mode = 'square' }: { mode?: 'square' | 'root' }) {
  const [side, setSide] = useState(3)
  const [area, setArea] = useState(9)
  const s = mode === 'square' ? side : Math.sqrt(area)
  const a = mode === 'square' ? side * side : area
  const u = 38
  const ox = 30
  const oy = 12
  const grid = 6
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 262" role="img" aria-label="正方形の1辺と面積の図">
        {Array.from({ length: grid + 1 }, (_, i) => (
          <g key={i}>
            <line x1={ox + i * u} x2={ox + i * u} y1={oy} y2={oy + grid * u} stroke="var(--line)" />
            <line x1={ox} x2={ox + grid * u} y1={oy + i * u} y2={oy + i * u} stroke="var(--line)" />
          </g>
        ))}
        <rect
          x={ox}
          y={oy + (grid - s) * u}
          width={s * u}
          height={s * u}
          fill="var(--c1)"
          fillOpacity={0.3}
          stroke="var(--c1)"
          strokeWidth={2.5}
        />
        <text className="plot-annot" x={ox + (s * u) / 2} y={oy + grid * u + 18} textAnchor="middle" fill="var(--c1)">
          {`1辺 ${round(s, 3)}`}
        </text>
        <text className="plot-annot" x={300} y={60}>
          {mode === 'square' ? '1辺を決めると…' : '面積を決めると…'}
        </text>
        <text className="plot-annot" x={300} y={92} fill="var(--c1)">
          {mode === 'square' ? `面積 = ${round(s, 2)} × ${round(s, 2)} = ${round(a, 2)}` : `1辺 = √${round(a, 2)} ${Number.isInteger(s) ? '=' : '≒'} ${round(s, 3)}`}
        </text>
        <text className="plot-tick" x={300} y={124}>
          1マス = 面積 1
        </text>
      </svg>
      <p className="figure-readout">
        {mode === 'square' ? (
          <M>{`${round(s, 2)}^2 = ${round(a, 4)}`}</M>
        ) : (
          <M>{`\\sqrt{${round(a, 2)}} ${Number.isInteger(s) ? '=' : '\\approx'} ${round(s, 4)}`}</M>
        )}
      </p>
      <Controls>
        {mode === 'square' ? (
          <Slider label="1辺の長さ" value={side} min={0} max={6} step={0.1} onChange={setSide} format={(v) => v.toFixed(1)} />
        ) : (
          <Slider label="面積" value={area} min={0} max={36} step={1} onChange={setArea} />
        )}
      </Controls>
    </div>
  )
}

/** y = x² のグラフ。x と −x が同じ高さになる（負の数の2乗も正）ことを見せる */
export function SquareCurve() {
  const [x, setX] = useState(-3)
  const y = x * x
  return (
    <div>
      <Plot x={[-4.5, 4.5]} y={[0, 24]} xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} yTicks={[0, 4, 8, 12, 16, 20, 24]} xLabel="x" yLabel="x²">
        <Curve f={(t) => t * t} color="c1" />
        <Segment x1={x} y1={0} x2={x} y2={y} color="c2" dashed />
        <Segment x1={-x} y1={0} x2={-x} y2={y} color="muted" dashed />
        <Segment x1={-4.5} y1={y} x2={4.5} y2={y} color="muted" dashed />
        <Points
          data={[
            { x, y, color: 'c2' },
            { x: -x, y, color: 'muted' },
          ]}
          r={7}
          opacity={0.95}
        />
        <Label x={x} y={y} dy={-12} anchor={x > 1 ? 'end' : x < -1 ? 'start' : 'middle'} color="c2">{`(${round(x, 1)})² = ${round(y, 2)}`}</Label>
      </Plot>
      <p className="figure-readout">
        <M>{`(${round(x, 1)})^2 = ${round(y, 2)}`}</M>　と　<M>{`(${round(-x, 1)})^2 = ${round(y, 2)}`}</M>　は同じ高さ。2乗はどちらも0以上になる
      </p>
      <Controls>
        <Slider label="x" value={x} min={-4.5} max={4.5} step={0.1} onChange={setX} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** σ/√n のグラフ。n を4倍にすると値が半分になる（標準誤差の準備） */
export function RootNPlot({ sigma = 10 }: { sigma?: number }) {
  const [n, setN] = useState(4)
  const v = sigma / Math.sqrt(n)
  const marks = [1, 4, 16, 64]
  return (
    <div>
      <Plot x={[0, 100]} y={[0, sigma * 1.15]} xTicks={[1, 4, 16, 25, 36, 49, 64, 81, 100]} xLabel="データの個数 n" yLabel="σ/√n">
        <Curve f={(t) => sigma / Math.sqrt(t)} from={1} to={100} color="c1" />
        <Points data={marks.map((m) => ({ x: m, y: sigma / Math.sqrt(m), color: 'muted' as const }))} r={4} opacity={0.9} />
        {marks.slice(1).map((m) => (
          <Label key={m} x={m} y={sigma / Math.sqrt(m)} dy={-10} anchor="start" color="muted">
            {`${round(sigma / Math.sqrt(m), 2)}`}
          </Label>
        ))}
        <Segment x1={n} y1={0} x2={n} y2={v} color="c2" dashed />
        <Points data={[{ x: n, y: v, color: 'c2' }]} r={7} opacity={0.95} />
      </Plot>
      <p className="figure-readout">
        <M>{`\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${round(Math.sqrt(n), 3)}} \\approx ${round(v, 3)}`}</M>
      </p>
      <Controls>
        <Slider label="n" value={n} min={1} max={100} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
