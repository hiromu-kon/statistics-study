import { useMemo, useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Legend, Plot } from '../../../components/charts/Plot'
import { binData } from '../../../components/charts/common'
import { exponentialPdf, normalPdf, round } from '../../../lib/stats'
import { Choice } from './parts'
import { randomExp, rollDie, simulateMeans } from './sim'

type Pop = 'die' | 'exp'

const POP = {
  die: { label: 'サイコロの目', mu: 3.5, sigma: Math.sqrt(35 / 12), draw: rollDie },
  exp: { label: '待ち時間（指数分布・平均1分）', mu: 1, sigma: 1, draw: (rng: () => number) => randomExp(rng, 1) },
} as const

const REPS = 4000

/** 母集団の分布の形（もとの1個ぶん） */
function PopulationShape({ pop }: { pop: Pop }) {
  if (pop === 'die') {
    return (
      <Plot x={[0.5, 6.5]} y={[0, 0.25]} height={130} hideY xTicks={[1, 2, 3, 4, 5, 6]}>
        <Bars data={[1, 2, 3, 4, 5, 6].map((x) => ({ x, y: 1 / 6 }))} width={0.8} color="muted" opacity={0.6} />
      </Plot>
    )
  }
  return (
    <Plot x={[0, 5]} y={[0, 1.1]} height={130} hideY>
      <Curve f={(x) => exponentialPdf(x, 1)} color="muted" />
    </Plot>
  )
}

/**
 * 偏った分布からとった標本平均のヒストグラムに、正規分布 N(μ, σ²/n) を重ねる図（中心極限定理）。
 * n を大きくすると、もとの分布の形に関係なくベル型に近づく。
 */
export function CltDemo() {
  const [pop, setPop] = useState<Pop>('exp')
  const [n, setN] = useState(1)
  const { mu, sigma, draw } = POP[pop]
  const se = sigma / Math.sqrt(n)

  const { bars, width, lo, hi } = useMemo(() => {
    const means = simulateMeans(draw, n, REPS, 4242 + n)
    if (pop === 'die') {
      // 出目の平均は 1/n 刻みの値しかとらないので、棒の幅を 1/n にして値ごとに数える
      const w = 1 / n
      const counts = binData(means, 1 - w / 2, w, 5 * n + 1)
      return {
        bars: counts.map((b) => ({ x: b.x, y: b.y / (REPS * w) })),
        width: w,
        lo: Math.max(0.5, mu - 4.2 * se),
        hi: Math.min(6.5, mu + 4.2 * se),
      }
    }
    const l = Math.max(0, mu - 4 * se)
    const h = mu + 4.5 * se
    const w = (h - l) / 40
    return { bars: binData(means, l, w, 40).map((b) => ({ x: b.x, y: b.y / (REPS * w) })), width: w, lo: l, hi: h }
  }, [pop, n, draw, mu, se])

  const yMax = Math.max(normalPdf(mu, mu, se), ...bars.map((b) => b.y)) * 1.15

  return (
    <div>
      <Controls>
        <Choice<Pop>
          options={[
            { value: 'exp', label: '待ち時間（右に長い）' },
            { value: 'die', label: 'サイコロ（平ら）' },
          ]}
          value={pop}
          onChange={setPop}
        />
      </Controls>
      <p className="figure-readout">もとの分布（{POP[pop].label}）</p>
      <PopulationShape pop={pop} />
      <p className="figure-readout">
        {n} 個の平均を {REPS} 回くり返したときのヒストグラム
      </p>
      <Plot x={[lo, hi]} y={[0, yMax]} height={240} hideY xLabel={`${n} 個の平均`}>
        <Bars data={bars} width={width * 0.92} color="c1" opacity={0.7} />
        <Curve f={(x) => normalPdf(x, mu, se)} color="c2" samples={300} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'シミュレーションした標本平均' },
          { color: 'c2', label: `正規分布 N(${round(mu, 2)}, ${round(se * se, 3)})` },
        ]}
      />
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={1} max={40} step={1} onChange={setN} />
      </Controls>
    </div>
  )
}
