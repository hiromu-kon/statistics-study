import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, VLine, colorVar } from '../../../components/charts/Plot'
import { normalPdf, round } from '../../../lib/stats'

/**
 * 2つの工場 A・B の製品をまぜたときの重さ Y の分布で、分散の分解 V[Y] = E[V[Y|X]] + V[E[Y|X]] を見せる図。
 * 工場ごとの散らばり（工場の中の分散の平均）と、工場ごとの平均のずれ（平均の分散）を足すと、全体の分散になる。
 */
export function VarianceDecomposition() {
  const [w, setW] = useState(0.6)
  const [muB, setMuB] = useState(15)
  const [sdA, setSdA] = useState(2)
  const [sdB, setSdB] = useState(3)
  const muA = 10
  const mean = w * muA + (1 - w) * muB
  const within = w * sdA ** 2 + (1 - w) * sdB ** 2
  const between = w * (muA - mean) ** 2 + (1 - w) * (muB - mean) ** 2
  const total = within + between
  const fA = (y: number) => w * normalPdf(y, muA, sdA)
  const fB = (y: number) => (1 - w) * normalPdf(y, muB, sdB)
  let peak = 0
  for (let y = 0; y <= 28; y += 0.1) peak = Math.max(peak, fA(y) + fB(y))
  const barW = 520
  const scale = barW / 40
  return (
    <div>
      <Plot x={[0, 28]} y={[0, peak * 1.25]} height={240} xLabel="重さ Y" hideY>
        <Curve f={fA} color="c1" dashed />
        <Curve f={fB} color="c2" dashed />
        <Curve f={(y) => fA(y) + fB(y)} color="ink" />
        <VLine x={mean} color="muted" label={`全体の平均 ${round(mean, 2)}`} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `工場 A（割合 ${round(w, 2)}、平均 ${muA}、標準偏差 ${sdA}）` },
          { color: 'c2', label: `工場 B（割合 ${round(1 - w, 2)}、平均 ${muB}、標準偏差 ${sdB}）` },
          { color: 'ink', label: 'まぜた全体の分布' },
        ]}
      />
      <svg className="plot" viewBox="0 0 560 64" role="img" aria-label="全体の分散を、工場の中の分散の平均と、工場の平均の分散に分けた帯">
        <rect x={20} y={10} width={within * scale} height={26} fill={colorVar('c3')} opacity={0.7} />
        <rect x={20 + within * scale} y={10} width={between * scale} height={26} fill={colorVar('c4')} opacity={0.7} />
        <text className="plot-tick" x={20} y={56}>
          緑：E[V[Y|X]] = {round(within, 2)}　紫：V[E[Y|X]] = {round(between, 2)}　合計 V[Y] = {round(total, 2)}
        </text>
      </svg>
      <Controls>
        <Slider label="工場 A の割合" value={w} min={0.1} max={0.9} step={0.1} onChange={(v) => setW(round(v, 1))} format={(v) => v.toFixed(1)} />
        <Slider label="工場 B の平均" value={muB} min={10} max={20} step={1} onChange={setMuB} />
        <Slider label="工場 A の標準偏差" value={sdA} min={1} max={4} step={0.5} onChange={setSdA} />
        <Slider label="工場 B の標準偏差" value={sdB} min={1} max={4} step={0.5} onChange={setSdB} />
      </Controls>
    </div>
  )
}
