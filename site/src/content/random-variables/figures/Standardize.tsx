import { useState } from 'react'
import { Bars, Plot, Segment, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Tabs } from '../../probability/figures/Tabs'
import { die, expectation, transform, varianceOf } from './dist'

type Stage = 'x' | 'shift' | 'z'

const MU = expectation(die)
const SIGMA = Math.sqrt(varianceOf(die))

/** 標準化 Z = (X − μ)/σ を2段階に分けて見せる。① μ を引いて中心を0へ、② σ で割って幅を1へ */
export function Standardize() {
  const [stage, setStage] = useState<Stage>('x')
  const d = stage === 'x' ? die : stage === 'shift' ? transform(die, 1, -MU) : transform(die, 1 / SIGMA, -MU / SIGMA)
  const m = expectation(d)
  const sd = Math.sqrt(varianceOf(d))
  const w = stage === 'z' ? 0.85 / SIGMA : 0.85
  const readout: Record<Stage, string> = {
    x: `X：サイコロの目。期待値 μ = 3.5、標準偏差 σ ≒ ${round(SIGMA, 3)}`,
    shift: `X − μ：全体を 3.5 だけ左へずらした。期待値は 0、標準偏差は ${round(sd, 3)} のまま`,
    z: `(X − μ)/σ：さらに ${round(SIGMA, 3)} で割って幅を縮めた。期待値 0、標準偏差 ${round(sd, 3)}`,
  }
  return (
    <div>
      <Tabs
        value={stage}
        onChange={setStage}
        options={[
          { id: 'x', label: '① もとの X' },
          { id: 'shift', label: '② μ を引く' },
          { id: 'z', label: '③ σ で割る' },
        ]}
      />
      <Plot x={[-3, 7]} y={[0, 0.25]} height={240} xTicks={[-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]} yTicks={[0, 0.1, 0.2]} xLabel="値" yLabel="確率">
        <Bars data={d.map((v) => ({ x: v.x, y: v.p }))} width={w} color="c1" />
        <VLine x={m} color="c2" label={`期待値 ${round(m, 2)}`} />
        <Segment x1={m} y1={0.2} x2={m + sd} y2={0.2} color="c3" width={2.5} arrow />
        <Segment x1={m} y1={0.2} x2={m - sd} y2={0.2} color="c3" width={2.5} arrow />
      </Plot>
      <p className="figure-readout">{readout[stage]}（緑の矢印 = 標準偏差 1 つ分）</p>
    </div>
  )
}
