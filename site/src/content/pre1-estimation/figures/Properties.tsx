import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { binData } from '../../../components/charts/common'
import { Bars, Curve, Legend, Plot, Points } from '../../../components/charts/Plot'
import { createRng, mean, median, normalPdf, randomNormal, round, variance } from '../../../lib/stats'
import { Choice, Marker } from '../../sampling/figures/parts'

/** 標本平均の分散 σ²/n。図では σ = 4、n = 4 として 4 に固定する */
const VAR_XBAR = 4

/**
 * 標本平均を a 倍した推定量 a·x̄ の、バイアス²・分散・MSE を a の関数として描く図（バイアス・バリアンス分解）。
 * a を 1 より小さくすると、ねらいはずれるが、ばらつきが減って MSE が小さくなることがある。
 */
export function BiasVarianceTradeoff() {
  const [a, setA] = useState(1)
  const [mu, setMu] = useState(3)
  const bias2 = (t: number) => (t - 1) ** 2 * mu * mu
  const vari = (t: number) => t * t * VAR_XBAR
  const mse = (t: number) => bias2(t) + vari(t)
  const best = (mu * mu) / (mu * mu + VAR_XBAR)
  return (
    <div>
      <Plot x={[0, 1.3]} y={[0, 12]} height={240} xLabel="a（標本平均にかける数）" yLabel="値">
        <Curve f={bias2} color="c2" width={2} />
        <Curve f={vari} color="c3" width={2} />
        <Curve f={mse} color="c1" width={3} />
        <Marker x={best} color="muted" label={`MSE 最小 a = ${best.toFixed(2)}`} labelY={11.2} anchor="end" />
        <Points
          data={[
            { x: a, y: bias2(a), color: 'c2' },
            { x: a, y: vari(a), color: 'c3' },
            { x: a, y: mse(a), color: 'c1' },
          ]}
          r={6}
          opacity={1}
        />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'MSE = バイアス² + 分散' },
          { color: 'c2', label: 'バイアス² = (a − 1)²μ²' },
          { color: 'c3', label: '分散 = a² × σ²/n' },
        ]}
      />
      <p className="figure-readout">
        a = {a.toFixed(2)}：バイアス² {round(bias2(a), 2)} ＋ 分散 {round(vari(a), 2)} ＝ MSE <strong>{round(mse(a), 2)}</strong>
        （a = 1 の標本平均なら MSE = {VAR_XBAR}）
      </p>
      <p className="figure-readout">推定量 a·x̄ の分布（実線）と、標本平均 x̄ の分布（点線）</p>
      <Plot x={[-6, 12]} y={[0, 0.42]} height={180} hideY xLabel="推定値">
        <Curve f={(x) => normalPdf(x, mu, Math.sqrt(VAR_XBAR))} color="muted" dashed width={1.5} />
        <Curve f={(x) => normalPdf(x, a * mu, Math.max(a, 0.05) * Math.sqrt(VAR_XBAR))} color="c1" samples={300} />
        <Marker x={mu} color="c5" label={`本当の μ = ${mu}`} labelY={0.4} dashed={false} />
      </Plot>
      <Controls>
        <Slider label="a" value={a} min={0.2} max={1.3} step={0.01} onChange={setA} format={(v) => v.toFixed(2)} />
      </Controls>
      <Controls>
        <Slider label="本当の μ（実際はわからない）" value={mu} min={1} max={6} step={0.5} onChange={setMu} />
      </Controls>
    </div>
  )
}

const N = 21
const REPS = 2000
type Dist = 'normal' | 'laplace'

/**
 * 同じ母集団から 21 個とって標本平均と標本中央値を計算する、を 2000 回くり返したヒストグラム。
 * 正規分布では平均のほうがばらつきが小さく、ラプラス分布（裾が重い）では中央値のほうが小さい。
 * どちらの分布も平均 0・分散 1 にそろえてある。
 */
export function MeanVsMedian() {
  const [dist, setDist] = useState<Dist>('normal')
  const [seed, setSeed] = useState(1)
  const sim = useMemo(() => {
    const rng = createRng(seed * 101 + (dist === 'normal' ? 0 : 7))
    const b = 1 / Math.sqrt(2) // ラプラス分布の尺度。分散 2b² = 1
    const draw = () => {
      if (dist === 'normal') return randomNormal(rng)
      const u = rng() - 0.5
      return -b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u))
    }
    const means: number[] = []
    const medians: number[] = []
    for (let r = 0; r < REPS; r++) {
      const xs = Array.from({ length: N }, draw)
      means.push(mean(xs))
      medians.push(median(xs))
    }
    return { means, medians }
  }, [dist, seed])
  const vMean = variance(sim.means)
  const vMed = variance(sim.medians)
  return (
    <div>
      <Plot x={[-1, 1]} y={[0, 300]} height={240} hideY xLabel="推定値（本当の値は 0）">
        <Bars data={binData(sim.means, -1, 0.05, 40)} width={0.05} color="c1" opacity={0.5} />
        <Bars data={binData(sim.medians, -1, 0.05, 40)} width={0.05} color="c2" opacity={0.5} />
        <Marker x={0} color="ink" dashed={false} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '標本平均' },
          { color: 'c2', label: '標本中央値' },
        ]}
      />
      <p className="figure-readout">
        分散：標本平均 {vMean.toFixed(4)}（理論値 1/21 ≒ 0.0476）、標本中央値 <strong>{vMed.toFixed(4)}</strong>
      </p>
      <p className="figure-readout">
        平均に対する中央値の相対効率 = 平均の分散 ÷ 中央値の分散 ≒ <strong>{round(vMean / vMed, 2)}</strong>
        {dist === 'normal' ? '（理論的には n が大きいと 2/π ≒ 0.64）' : '（理論的には n が大きいと 2）'}
      </p>
      <Controls>
        <Choice<Dist>
          options={[
            { value: 'normal', label: '正規分布' },
            { value: 'laplace', label: 'ラプラス分布（裾が重い）' },
          ]}
          value={dist}
          onChange={setDist}
        />
        <Button onClick={() => setSeed(seed + 1)}>やり直す</Button>
      </Controls>
    </div>
  )
}
