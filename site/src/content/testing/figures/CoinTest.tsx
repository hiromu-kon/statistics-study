import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Plot } from '../../../components/charts/Plot'
import { binomialPmf, round } from '../../../lib/stats'
import { Toggle, Verdict } from './parts'

const N = 20

/**
 * 「コインはイカサマか？」の図。
 * 公平なコイン（H0: p = 0.5）を20回投げたときの表の回数の分布に、観測値より極端な結果を赤く塗る。
 * 赤い棒の確率の合計が p 値になる。
 */
export function CoinTest({ initial = 15 }: { initial?: number }) {
  const [k, setK] = useState(initial)
  const [side, setSide] = useState<'two' | 'right'>('two')
  const extreme = (x: number) => (side === 'two' ? Math.abs(x - N / 2) >= Math.abs(k - N / 2) : x >= k)
  const data = Array.from({ length: N + 1 }, (_, x) => ({ x, y: binomialPmf(x, N, 0.5) }))
  const p = data.filter((d) => extreme(d.x)).reduce((a, d) => a + d.y, 0)
  return (
    <div>
      <Plot x={[-0.5, 20.5]} y={[0, 0.2]} xTicks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]} xLabel="20回のうち表が出た回数" yLabel="確率" yTicks={[0, 0.05, 0.1, 0.15, 0.2]}>
        <Bars data={data} width={0.8} color="c1" highlight={extreme} highlightColor="c5" />
      </Plot>
      <Toggle
        options={[
          { value: 'two', label: '両側（表にも裏にもかたよる）' },
          { value: 'right', label: '片側（表が出やすい）' },
        ]}
        value={side}
        onChange={setSide}
      />
      <p className="figure-readout">
        赤い棒（観測値と同じかそれより極端）の確率の合計 = p 値 ≒ <strong>{round(p, 4)}</strong>
        <br />
        有意水準 5% なら → <Verdict reject={p <= 0.05} />
      </p>
      <Controls>
        <Slider label="表が出た回数" value={k} min={0} max={N} step={1} onChange={setK} format={(v) => `${v}回`} />
      </Controls>
    </div>
  )
}
