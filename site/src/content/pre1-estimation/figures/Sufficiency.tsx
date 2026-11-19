import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Plot, Points } from '../../../components/charts/Plot'
import { binomialPmf, createRng, round } from '../../../lib/stats'
import { Marker, Text } from '../../sampling/figures/parts'
import { formatSmall } from './format'

const N = 5
const T = 3

/** 5回投げて表がちょうど3回の並び（1 = 表）。C(5,3) = 10 通り */
const PATTERNS = (() => {
  const out: string[] = []
  for (let m = 0; m < 2 ** N; m++) {
    const s = m.toString(2).padStart(N, '0')
    if ([...s].filter((c) => c === '1').length === T) out.push(s)
  }
  return out.reverse()
})()

/**
 * コイン投げで「表の回数 T」を知ったあとの並びの条件つき確率（上）と、
 * 「1回目の結果 X₁」だけを知ったあとの表の回数の条件つき確率（下）をくらべる図。
 * T を知ったあとは p を動かしても変わらない（T が十分統計量）。X₁ だけでは、残りがまだ p の情報を持つ。
 */
export function SufficiencyCoin() {
  const [p, setP] = useState(0.5)
  const each = p ** T * (1 - p) ** (N - T)
  const total = PATTERNS.length * each
  const cond = PATTERNS.map((_, i) => ({ x: i + 1, y: each / total }))
  // X₁ = 1 を知ったあと、残り4回の表の数は二項分布 B(4, p)。全体の表の数は 1 + それ
  const afterX1 = Array.from({ length: N }, (_, j) => ({ x: j + 1, y: binomialPmf(j, N - 1, p) }))
  return (
    <div>
      <p className="figure-readout">
        どの並びも確率は <strong>p³(1 − p)² = {each.toFixed(5)}</strong>、表が3回になる確率は 10 × それ = {total.toFixed(4)}
      </p>
      <p className="figure-readout">上：表が3回と知ったあと、10通りの並びの確率（条件つき確率）</p>
      <Plot
        x={[0.3, 10.7]}
        y={[0, 0.25]}
        height={200}
        xTicks={PATTERNS.map((_, i) => i + 1)}
        xTickFormat={(v) => PATTERNS[v - 1] ?? ''}
        yTicks={[0, 0.1, 0.2]}
        xLabel="並び（1 = 表、0 = 裏）"
      >
        <Bars data={cond} width={0.7} color="c1" labels={(y) => round(y, 3).toString()} />
      </Plot>
      <p className="figure-readout">下：1回目が表と知っただけのとき、5回全体の表の回数の確率</p>
      <Plot x={[0.3, 5.7]} y={[0, 0.85]} height={200} xTicks={[1, 2, 3, 4, 5]} yTicks={[0, 0.2, 0.4, 0.6, 0.8]} xLabel="5回のうちの表の回数">
        <Bars data={afterX1} width={0.6} color="c2" labels={(y) => round(y, 3).toString()} />
      </Plot>
      <Controls>
        <Slider label="表の出る確率 p" value={p} min={0.1} max={0.9} step={0.05} onChange={setP} format={(v) => v.toFixed(2)} />
      </Controls>
      <p className="figure-readout">
        p を動かしても、上の棒は <strong>どれも 0.1 のまま</strong>。下の棒は p につれて形が変わる
      </p>
    </div>
  )
}

const UN = 5
const MAX = 7.2

/**
 * 一様分布 U(0, θ) の尤度は、データの最大値だけで決まることを見る図。
 * 最大値が同じ別のデータに取りかえても、尤度のグラフはまったく変わらない。
 */
export function UniformLikelihood() {
  const [seed, setSeed] = useState(1)
  const [theta, setTheta] = useState(9)
  const data = useMemo(() => {
    const rng = createRng(seed * 37 + 11)
    const rest = Array.from({ length: UN - 1 }, () => round(rng() * MAX, 1))
    return [...rest, MAX]
  }, [seed])
  const lik = (t: number) => (t < MAX ? 0 : t ** -UN)
  const scale = lik(MAX)
  const rel = (t: number) => lik(t) / scale
  return (
    <div>
      <Plot x={[0, 12]} y={[0, 2]} height={100} hideY grid={false} xLabel="データ（5個）">
        <Points data={data.map((x) => ({ x, y: 1, color: x === MAX ? 'c2' : 'c1' }))} r={7} opacity={0.85} />
        <Text x={MAX} y={1} dy={-14} color="c2">
          最大値 {MAX}
        </Text>
        <Marker x={theta} color="c5" from={0.3} to={1.7} label={`θ = ${theta.toFixed(1)}`} labelY={1.75} />
      </Plot>
      <Plot x={[0, 12]} y={[0, 1.1]} height={220} xLabel="θ（一様分布の右はし）" yLabel="尤度（最大値での値を1とする）">
        <Curve f={rel} from={MAX} to={12} color="c1" />
        <Curve f={() => 0} from={0} to={MAX - 0.01} color="c1" />
        <Points data={[{ x: theta, y: rel(theta) }]} color="c5" r={6} opacity={1} />
        <Marker x={MAX} color="c2" label="ここで最大" labelY={1.05} />
      </Plot>
      <p className="figure-readout">
        {theta < MAX ? (
          <>
            θ = {theta.toFixed(1)} は最大値 {MAX} より小さい。区間 [0, θ] の外の値は出ないので、<strong>尤度は 0</strong>
          </>
        ) : (
          <>
            θ = {theta.toFixed(1)} のとき尤度 = 1/θ⁵ = <strong>{formatSmall(lik(theta), 3)}</strong>（最大値での値の {round(rel(theta), 3)} 倍）
          </>
        )}
      </p>
      <Controls>
        <Slider label="θ" value={theta} min={3} max={12} step={0.1} onChange={setTheta} format={(v) => v.toFixed(1)} />
        <Button onClick={() => setSeed(seed + 1)}>最大値が同じ別のデータ</Button>
      </Controls>
    </div>
  )
}
