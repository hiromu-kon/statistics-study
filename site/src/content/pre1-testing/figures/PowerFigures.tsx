import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, HLine, Label, Legend, Plot, Segment, VLine } from '../../../components/charts/Plot'
import { normalCdf, normalQuantile, round } from '../../../lib/stats'
import { Toggle } from './parts'

type Side = 'one' | 'two'

/** 母平均の z 検定（σ 既知）の検出力。delta は (μ − μ0)/σ */
function zPower(delta: number, n: number, alpha: number, side: Side): number {
  const shift = delta * Math.sqrt(n)
  if (side === 'one') return 1 - normalCdf(normalQuantile(1 - alpha) - shift)
  const z = normalQuantile(1 - alpha / 2)
  return normalCdf(-z + shift) + normalCdf(-z - shift)
}

const REF_N = 10

/**
 * 検出力曲線。横軸が本当の平均（μ0 からのずれを σ 単位で）、縦軸が「H0 を棄却する確率」。
 * n を増やすと曲線が急になることを、n = 10 の曲線（点線）と比べて見せる。
 */
export function PowerCurveDemo() {
  const [n, setN] = useState(25)
  const [side, setSide] = useState<Side>('one')
  const alpha = 0.05
  const at = 0.5
  return (
    <div>
      <Plot
        x={[-1, 1.5]}
        y={[0, 1]}
        xTicks={[-1, -0.5, 0, 0.5, 1, 1.5]}
        yTicks={[0, 0.05, 0.2, 0.4, 0.6, 0.8, 1]}
        xLabel="本当の平均のずれ（μ − μ0）÷ σ"
        yLabel="棄却する確率"
      >
        <HLine y={alpha} color="c5" label="α = 0.05" />
        <VLine x={0} color="muted" />
        <Curve f={(d) => zPower(d, REF_N, alpha, side)} color="muted" dashed />
        <Curve f={(d) => zPower(d, n, alpha, side)} color="c1" width={3} />
        <Segment x1={at} y1={0} x2={at} y2={zPower(at, n, alpha, side)} color="c3" dashed />
        <Label x={at} y={zPower(at, n, alpha, side)} dy={-8} color="c3" anchor="end">
          {`検出力 ${round(zPower(at, n, alpha, side), 2)}`}
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `n = ${n} の検出力曲線` },
          { color: 'muted', label: `n = ${REF_N}（くらべる用）` },
        ]}
      />
      <p className="figure-readout">
        真ん中（ずれ 0、つまり H0 が正しい点）での高さは、どの n でも α = 0.05。ずれが 0.5σ のときの検出力は <strong>{round(zPower(at, n, alpha, side), 3)}</strong>
      </p>
      <Toggle
        options={[
          { value: 'one', label: '右片側（H1: μ > μ0）' },
          { value: 'two', label: '両側（H1: μ ≠ μ0）' },
        ]}
        value={side}
        onChange={setSide}
      />
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={4} max={100} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}

/**
 * 必要なサンプルサイズ。横軸 n、縦軸 検出力。目標の検出力の線と交わる n を求める様子を見せる（右片側、α = 5%）。
 */
export function SampleSizeDemo() {
  const [d, setD] = useState(0.5)
  const [target, setTarget] = useState(0.8)
  const za = normalQuantile(0.95)
  const zb = normalQuantile(target)
  const exact = ((za + zb) / d) ** 2
  const need = Math.ceil(exact - 1e-9)
  const xMax = 160
  return (
    <div>
      <Plot x={[0, xMax]} y={[0, 1]} yTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]} xLabel="標本の大きさ n" yLabel="検出力">
        <HLine y={target} color="c3" label={`目標 ${target}`} />
        <Curve f={(m) => (m <= 0 ? 0.05 : zPower(d, m, 0.05, 'one'))} color="c1" width={3} samples={320} />
        {need <= xMax && <VLine x={need} color="c2" label={`n = ${need}`} />}
      </Plot>
      <p className="figure-readout">
        n = ((z<sub>0.05</sub> + z<sub>β</sub>) ÷ (δ/σ))² = (({round(za, 3)} + {round(zb, 3)}) ÷ {d.toFixed(2)})² ≒ {round(exact, 1)} → 切り上げて <strong>{need}</strong>
        {need > xMax && '（グラフの外）'}
      </p>
      <Toggle
        label="目標の検出力"
        options={[
          { value: 0.8, label: '0.8' },
          { value: 0.9, label: '0.9' },
        ]}
        value={target}
        onChange={setTarget}
      />
      <Controls>
        <Slider label="見つけたい差 δ ÷ σ" value={d} min={0.2} max={1.2} step={0.05} onChange={setD} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

/**
 * 検定をくり返すと「少なくとも1回は第1種の過誤」をする確率（FWER）が増えていく。
 * 各検定が独立で、すべての帰無仮説が正しいとした計算。
 */
export function FwerBars() {
  const [method, setMethod] = useState<'none' | 'bonf'>('none')
  const ms = Array.from({ length: 20 }, (_, i) => i + 1)
  const level = (m: number) => (method === 'none' ? 0.05 : 0.05 / m)
  const data = ms.map((m) => ({ x: m, y: 1 - (1 - level(m)) ** m }))
  return (
    <div>
      <Plot x={[0.3, 20.7]} y={[0, 0.7]} xTicks={[1, 5, 10, 15, 20]} yTicks={[0, 0.05, 0.2, 0.4, 0.6]} xLabel="検定の回数 m" yLabel="少なくとも1回まちがえる確率">
        <Bars data={data} width={0.7} color={method === 'none' ? 'c5' : 'c1'} />
        <HLine y={0.05} color="ink" label="0.05" />
      </Plot>
      <p className="figure-readout">
        m = 10 のとき {round(data[9].y, 3)}
        {method === 'none' ? '（1回ずつ 5% で検定）' : '（1回ずつ 0.05 ÷ 10 = 0.005 で検定）'}
      </p>
      <Toggle
        options={[
          { value: 'none', label: '補正なし' },
          { value: 'bonf', label: 'ボンフェローニ法' },
        ]}
        value={method}
        onChange={setMethod}
      />
    </div>
  )
}
