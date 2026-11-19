import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Curve, Legend, Plot, Points, Segment, VLine, colorVar, usePlot, type Color } from '../../../components/charts/Plot'
import { createRng, normalPdf, randomNormal, round } from '../../../lib/stats'

/** X ~ N(5, 1²) を Y = aX + b に変換する。山の位置は aμ + b、幅は |a| 倍になる */
export function LinearTransformExplorer() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const mu = 5
  const sigma = 1
  const muY = a * mu + b
  const sdY = a * sigma
  return (
    <div>
      <Plot x={[-5, 30]} y={[0, 0.45]} hideY xLabel="値">
        <Curve f={(x) => normalPdf(x, mu, sigma)} color="c1" dashed />
        <Curve f={(x) => normalPdf(x, muY, sdY)} color="c2" />
        <VLine x={muY} color="c2" label={`aμ + b = ${round(muY, 1)}`} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'X ~ N(5, 1²)' },
          { color: 'c2', label: `Y = ${a}X ${b >= 0 ? '+' : '−'} ${Math.abs(b)} ~ N(${round(muY, 2)}, ${round(sdY, 2)}²)` },
        ]}
      />
      <p className="figure-readout">
        平均 <M>{'a\\mu + b'}</M> = <strong>{round(muY, 2)}</strong>　分散 <M>{'a^2\\sigma^2'}</M> = <strong>{round(sdY ** 2, 2)}</strong>　標準偏差{' '}
        <M>{'|a|\\sigma'}</M> = <strong>{round(sdY, 2)}</strong>
      </p>
      <Controls>
        <Slider label="かける数 a" value={a} min={0.5} max={3} step={0.5} onChange={setA} />
        <Slider label="足す数 b" value={b} min={-5} max={10} step={1} onChange={setB} />
      </Controls>
    </div>
  )
}

/** 独立な X ~ N(μ₁, σ₁²), Y ~ N(μ₂, σ₂²) の和・差。分散はどちらも「足し算」になる */
export function NormalSumExplorer() {
  const [m1, setM1] = useState(30)
  const [s1, setS1] = useState(3)
  const [m2, setM2] = useState(20)
  const [s2, setS2] = useState(4)
  const [mode, setMode] = useState<'sum' | 'diff'>('sum')
  const mw = mode === 'sum' ? m1 + m2 : m1 - m2
  const sw = Math.sqrt(s1 ** 2 + s2 ** 2)
  const lo = Math.min(m1 - 4 * s1, m2 - 4 * s2, mw - 4 * sw)
  const hi = Math.max(m1 + 4 * s1, m2 + 4 * s2, mw + 4 * sw)
  const peak = Math.max(normalPdf(0, 0, s1), normalPdf(0, 0, s2))
  const label = mode === 'sum' ? 'X + Y' : 'X − Y'
  return (
    <div>
      <Controls>
        <Button variant={mode === 'sum' ? 'primary' : 'default'} onClick={() => setMode('sum')}>
          和 X + Y
        </Button>
        <Button variant={mode === 'diff' ? 'primary' : 'default'} onClick={() => setMode('diff')}>
          差 X − Y
        </Button>
      </Controls>
      <Plot x={[lo, hi]} y={[0, peak * 1.15]} hideY xLabel="値">
        <Curve f={(x) => normalPdf(x, m1, s1)} color="c1" />
        <Curve f={(x) => normalPdf(x, m2, s2)} color="c3" />
        <Curve f={(x) => normalPdf(x, mw, sw)} color="c2" width={3} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `X ~ N(${m1}, ${s1}²)` },
          { color: 'c3', label: `Y ~ N(${m2}, ${s2}²)` },
          { color: 'c2', label: `${label} ~ N(${mw}, ${round(sw ** 2, 2)})` },
        ]}
      />
      <p className="figure-readout">
        {label} の平均 = <strong>{mw}</strong>　分散 = {s1 ** 2} + {s2 ** 2} = <strong>{round(sw ** 2, 2)}</strong>　標準偏差 ={' '}
        <strong>{round(sw, 3)}</strong>
      </p>
      <Controls>
        <Slider label="X の平均 μ₁" value={m1} min={0} max={50} step={1} onChange={setM1} />
        <Slider label="X の標準偏差 σ₁" value={s1} min={1} max={8} step={1} onChange={setS1} />
        <Slider label="Y の平均 μ₂" value={m2} min={0} max={50} step={1} onChange={setM2} />
        <Slider label="Y の標準偏差 σ₂" value={s2} min={1} max={8} step={1} onChange={setS2} />
      </Controls>
    </div>
  )
}

/** データ座標の点列を折れ線で結ぶ（楕円を描くため。Curve は y = f(x) の形しか描けない） */
function PathLine({ pts, color, width = 2, dashed }: { pts: [number, number][]; color: Color; width?: number; dashed?: boolean }) {
  const s = usePlot()
  return (
    <polyline
      points={pts.map(([x, y]) => `${s.x(x).toFixed(2)},${s.y(y).toFixed(2)}`).join(' ')}
      fill="none"
      stroke={colorVar(color)}
      strokeWidth={width}
      strokeDasharray={dashed ? '6 5' : undefined}
    />
  )
}

const Z_PAIRS = (() => {
  const rng = createRng(3)
  return Array.from({ length: 300 }, () => [randomNormal(rng), randomNormal(rng)] as const)
})()

/**
 * 標準化した2変量正規分布。等高線（楕円）と、そこから取り出した点。
 * ρ を動かすと楕円が傾き、x を決めたときの y の平均 E(Y|X=x) = ρx の直線も傾く。
 */
export function BivariateNormalContour() {
  const [rho, setRho] = useState(0.6)
  const [x0, setX0] = useState(1.5)
  const [showLine, setShowLine] = useState(true)
  const q = Math.sqrt(1 - rho ** 2)
  const pts = Z_PAIRS.map(([z1, z2]) => ({ x: z1, y: rho * z1 + q * z2 }))
  const ellipse = (c: number): [number, number][] =>
    Array.from({ length: 121 }, (_, i) => {
      const t = (2 * Math.PI * i) / 120
      return [c * Math.cos(t), c * (rho * Math.cos(t) + q * Math.sin(t))]
    })
  return (
    <div>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <Plot x={[-3.5, 3.5]} y={[-3.5, 3.5]} width={440} height={420} xTicks={[-3, -2, -1, 0, 1, 2, 3]} yTicks={[-3, -2, -1, 0, 1, 2, 3]} xLabel="X（標準化）">
          <Points data={pts} r={2.5} opacity={0.35} color="muted" />
          {[0.5, 1, 1.5, 2, 2.5].map((c) => (
            <PathLine key={c} pts={ellipse(c)} color="c1" width={c === 1 || c === 2 ? 2.2 : 1.2} />
          ))}
          {showLine && (
            <>
              <Segment x1={-3.5} y1={-3.5 * rho} x2={3.5} y2={3.5 * rho} color="c2" width={2.5} />
              <VLine x={x0} color="c3" />
              <Segment x1={x0} y1={rho * x0 - q} x2={x0} y2={rho * x0 + q} color="c3" width={6} />
              <Points data={[{ x: x0, y: rho * x0 }]} r={7} color="c2" opacity={1} />
            </>
          )}
        </Plot>
      </div>
      <Legend
        items={[
          { color: 'c1', label: '等高線（同じ高さの点を結んだ楕円）' },
          { color: 'c2', label: 'E(Y | X = x) = ρx' },
          { color: 'c3', label: 'X = x のときの Y の平均 ± 標準偏差' },
        ]}
      />
      <p className="figure-readout">
        ρ = <strong>{rho.toFixed(2)}</strong>　X = {x0} のとき Y の平均 <M>{'\\rho x'}</M> = <strong>{round(rho * x0, 2)}</strong>　標準偏差{' '}
        <M>{'\\sqrt{1-\\rho^2}'}</M> = <strong>{round(q, 3)}</strong>
      </p>
      <Controls>
        <Slider label="相関係数 ρ" value={rho} min={-0.95} max={0.95} step={0.05} onChange={(v) => setRho(round(v, 2))} format={(v) => v.toFixed(2)} />
        <Slider label="X の値 x" value={x0} min={-2.5} max={2.5} step={0.5} onChange={setX0} />
        <Button variant="ghost" onClick={() => setShowLine(!showLine)}>
          {showLine ? '直線を隠す' : '直線を表示'}
        </Button>
      </Controls>
    </div>
  )
}
