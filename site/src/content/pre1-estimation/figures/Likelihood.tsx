import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, Points } from '../../../components/charts/Plot'
import { createRng, mean, round } from '../../../lib/stats'
import { Marker, Text } from '../../sampling/figures/parts'
import { formatSmall } from './format'

const N = 10

/**
 * コインを10回投げたデータを固定して、p を動かすと尤度 L(p) と対数尤度 log L(p) がどう変わるかを見る図。
 * どちらも同じ p（= 表の割合）で頂上になる。
 */
export function LikelihoodSlider() {
  const [k, setK] = useState(7)
  const [p, setP] = useState(0.5)
  const L = (q: number) => q ** k * (1 - q) ** (N - k)
  const logL = (q: number) => (k > 0 ? k * Math.log(q) : 0) + (N - k > 0 ? (N - k) * Math.log(1 - q) : 0)
  const pHat = k / N
  const top = L(pHat)
  return (
    <div>
      <p className="figure-readout">
        データ：10回中 <strong>表 {k} 回</strong>（これは固定）　→　尤度 L(p) = p<sup>{k}</sup>(1 − p)<sup>{N - k}</sup>
      </p>
      <Plot x={[0, 1]} y={[0, top * 1.2]} height={220} hideY xLabel="p（表の出る確率の候補）">
        <Curve f={L} color="c1" samples={300} />
        <Marker x={pHat} color="c2" label={`頂上 p = ${pHat.toFixed(1)}`} labelY={top * 1.12} />
        <Points data={[{ x: p, y: L(p) }]} color="c5" r={7} opacity={1} />
      </Plot>
      <p className="figure-readout">
        p = {p.toFixed(2)} のとき　L(p) = <strong>{formatSmall(L(p), 4)}</strong>　（頂上の値 {formatSmall(top, 4)} の {round(L(p) / top, 3)} 倍）
      </p>
      <Plot x={[0, 1]} y={[-25, 0]} height={200} xLabel="p" yLabel="対数尤度 log L(p)">
        <Curve f={logL} from={0.001} to={0.999} color="c3" samples={300} />
        <Marker x={pHat} color="c2" />
        <Points data={[{ x: p, y: logL(p) }]} color="c5" r={7} opacity={1} />
      </Plot>
      <p className="figure-readout">
        log L(p) = <strong>{round(logL(p), 3)}</strong>（log をとっても頂上の位置は同じ）
      </p>
      <Controls>
        <Slider label="p を動かす" value={p} min={0.01} max={0.99} step={0.01} onChange={setP} format={(v) => v.toFixed(2)} />
      </Controls>
      <Controls>
        <Slider label="データ：表の回数" value={k} min={0} max={N} step={1} onChange={setK} />
      </Controls>
    </div>
  )
}

const THETA = 10
const UN = 5

/**
 * 一様分布 U(0, 10) から5個とって、モーメント推定値 2x̄ と最尤推定値（最大値）をくらべる図。
 * 2x̄ はデータの最大値より小さくなることがある（ありえない θ を答えてしまう）。
 */
export function MomentVsMle() {
  const [seed, setSeed] = useState(1)
  const [tally, setTally] = useState({ made: 0, below: 0 })
  const data = useMemo(() => {
    const rng = createRng(seed * 53 + 7)
    return Array.from({ length: UN }, () => round(rng() * THETA, 2))
  }, [seed])
  const mom = 2 * mean(data)
  const mle = Math.max(...data)
  const bad = mom < mle
  const next = () => {
    setTally({ made: tally.made + 1, below: tally.below + (bad ? 1 : 0) })
    setSeed(seed + 1)
  }
  return (
    <div>
      <Plot x={[0, 16]} y={[0, 3]} height={170} hideY grid={false} xLabel="値">
        <Points data={data.map((x) => ({ x, y: 1.2 }))} color="ink" r={6} opacity={0.75} />
        <Marker x={THETA} color="muted" label="本当の θ = 10" labelY={2.8} dashed={false} />
        <Marker x={mle} color="c1" label={`最尤 ${mle.toFixed(2)}`} labelY={2.3} anchor="end" />
        <Marker x={mom} color="c2" label={`モーメント ${mom.toFixed(2)}`} labelY={1.9} />
        <Text x={0.2} y={0.4} anchor="start" color="muted">
          ● がデータ
        </Text>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '最尤推定値 = 最大値' },
          { color: 'c2', label: 'モーメント推定値 = 2 × 標本平均' },
        ]}
      />
      <p className="figure-readout">
        {bad ? (
          <>
            2x̄ = {mom.toFixed(2)} が最大値 {mle.toFixed(2)} より<strong>小さい</strong>。θ がこれなら最大値のデータは出ないはずで、矛盾している
          </>
        ) : (
          <>2x̄ = {mom.toFixed(2)} ≧ 最大値 {mle.toFixed(2)}（今回は矛盾なし）</>
        )}
      </p>
      {tally.made > 0 && (
        <p className="figure-readout">
          これまでの {tally.made} 回のうち、2x̄ が最大値より小さかった回数：<strong>{tally.below} 回</strong>
        </p>
      )}
      <Controls>
        <Button variant="primary" onClick={next}>
          別の5個をとる
        </Button>
      </Controls>
    </div>
  )
}
