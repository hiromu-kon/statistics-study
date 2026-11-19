import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { normalCdf, normalPdf, normalQuantile, round } from '../../../lib/stats'
import { TestDistPlot, Toggle, Verdict, type Range } from './parts'

type Side = 'two' | 'right' | 'left'

const SIDES: { value: Side; label: string }[] = [
  { value: 'two', label: '両側' },
  { value: 'right', label: '右片側' },
  { value: 'left', label: '左片側' },
]

const ALPHAS = [
  { value: 0.1, label: 'α = 10%' },
  { value: 0.05, label: 'α = 5%' },
  { value: 0.01, label: 'α = 1%' },
]

function regions(side: Side, alpha: number): { reject: Range[]; crit: number[] } {
  if (side === 'two') {
    const c = normalQuantile(1 - alpha / 2)
    return { reject: [[-Infinity, -c], [c, Infinity]], crit: [-c, c] }
  }
  const c = normalQuantile(1 - alpha)
  return side === 'right' ? { reject: [[c, Infinity]], crit: [c] } : { reject: [[-Infinity, -c]], crit: [-c] }
}

const Z_TICKS = [-3, -2, -1, 0, 1, 2, 3]

/** 標準正規分布の上に棄却域を塗る。両側・片側と有意水準を切り替えられる */
export function RejectionDemo() {
  const [side, setSide] = useState<Side>('two')
  const [alpha, setAlpha] = useState(0.05)
  const { reject, crit } = regions(side, alpha)
  return (
    <div>
      <TestDistPlot
        pdf={(t) => normalPdf(t)}
        x={[-3.8, 3.8]}
        yMax={0.46}
        reject={reject}
        criticals={crit.map((c) => ({ x: c, label: String(round(c, 3)) }))}
        xTicks={Z_TICKS}
        xLabel="検定統計量 z（H0 が正しければ標準正規分布）"
      />
      <Toggle options={SIDES} value={side} onChange={setSide} />
      <Toggle options={ALPHAS} value={alpha} onChange={setAlpha} />
      <p className="figure-readout">
        赤い部分が<strong>棄却域</strong>。面積の合計はちょうど α = {alpha}
        {side === 'two' && `（左右に ${alpha / 2} ずつ）`}
      </p>
    </div>
  )
}

/** 観測した z の値を動かすと、p 値（オレンジの面積）が変わる */
export function PValueDemo({ initial = 2.2 }: { initial?: number }) {
  const [z, setZ] = useState(initial)
  const [side, setSide] = useState<Side>('two')
  let p: number
  let area: Range[]
  if (side === 'two') {
    const a = Math.abs(z)
    p = 2 * (1 - normalCdf(a))
    area = [[-Infinity, -a], [a, Infinity]]
  } else if (side === 'right') {
    p = 1 - normalCdf(z)
    area = [[z, Infinity]]
  } else {
    p = normalCdf(z)
    area = [[-Infinity, z]]
  }
  const { reject, crit } = regions(side, 0.05)
  return (
    <div>
      <TestDistPlot
        pdf={(t) => normalPdf(t)}
        x={[-3.8, 3.8]}
        yMax={0.46}
        reject={reject}
        pArea={area}
        criticals={crit.map((c) => ({ x: c, label: String(round(c, 3)) }))}
        observed={z}
        observedLabel={`z = ${z.toFixed(2)}`}
        xTicks={Z_TICKS}
        xLabel="検定統計量 z"
      />
      <Toggle options={SIDES} value={side} onChange={setSide} />
      <p className="figure-readout">
        p 値（オレンジの面積）≒ <strong>{round(p, 4)}</strong>　→　有意水準 5% なら <Verdict reject={p <= 0.05} />
      </p>
      <Controls>
        <Slider label="観測した z" value={z} min={-3.5} max={3.5} step={0.05} onChange={setZ} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
