import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { round } from '../../../lib/stats'
import { DistBars } from './DistBars'
import { expectation, type Dist } from './dist'

/**
 * 6の目が出やすい「いかさまサイコロ」。6の確率を上げると、期待値（釣り合いの点）が右へ動く。
 * 残りの確率は 1〜5 の目で等しく分ける。
 */
export function LoadedDie() {
  const [p6, setP6] = useState(1 / 6)
  const other = (1 - p6) / 5
  const dist: Dist = [1, 2, 3, 4, 5, 6].map((x) => ({ x, p: x === 6 ? p6 : other }))
  const m = expectation(dist)
  return (
    <div>
      <DistBars
        dist={dist}
        x={[0.3, 6.7]}
        yMax={0.6}
        xTicks={[1, 2, 3, 4, 5, 6]}
        xLabel="出る目 x"
        label={(_, p) => String(round(p, 2))}
        showMean
        highlight={(x) => x === 6}
        ariaLabel="いかさまサイコロの確率分布と、期待値の位置の支点"
      />
      <p className="figure-readout">
        期待値 E(X) = 1×{round(other, 3)} + 2×{round(other, 3)} + … + 6×{round(p6, 3)} = <strong>{round(m, 3)}</strong>
      </p>
      <Controls>
        <Slider label="6の目の確率" value={p6} min={1 / 6} max={0.6} step={0.01} onChange={setP6} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
