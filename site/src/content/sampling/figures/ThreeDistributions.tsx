import { Bars, Curve, Plot, Points } from '../../../components/charts/Plot'
import { binData } from '../../../components/charts/common'
import { mean, normalPdf, round, sd } from '../../../lib/stats'
import { Marker } from './parts'
import { drawFrom, heightMu, heightPopulation, heightSigma } from './sim'

const N = 25
const REPS = 1000

const popBars = binData(heightPopulation, 130, 2, 30).map((b) => ({ x: b.x, y: b.y / (heightPopulation.length * 2) }))
const popMax = Math.max(...popBars.map((b) => b.y))

const oneSample = drawFrom(heightPopulation, N, 2026)
const oneMean = mean(oneSample)

const sampleMeans = Array.from({ length: REPS }, (_, r) => mean(drawFrom(heightPopulation, N, 5003 * (r + 1))))
const meanBars = binData(sampleMeans, 130, 0.5, 120).map((b) => ({ x: b.x, y: b.y / (REPS * 0.5) }))
const se = heightSigma / Math.sqrt(N)
const meanMax = Math.max(normalPdf(heightMu, heightMu, se), ...meanBars.map((b) => b.y))

/**
 * 「母集団の分布」「1回の標本のデータ」「標本平均の分布」を同じ目盛りで縦に並べる図。
 * 3つを取り違えやすいので、横軸をそろえて散らばりの違いを見比べられるようにしている。
 */
export function ThreeDistributions() {
  return (
    <div>
      <p className="figure-readout">
        <strong>① 母集団の分布</strong>（町の大人 2000 人、1 人ずつの身長）：中心は μ ≒ {round(heightMu, 1)}、散らばり σ ≒ {round(heightSigma, 1)}
      </p>
      <Plot x={[130, 190]} y={[0, popMax * 1.2]} height={130} hideY>
        <Bars data={popBars} width={1.8} color="muted" opacity={0.5} />
        <Marker x={heightMu} color="c5" label="μ" />
      </Plot>
      <p className="figure-readout">
        <strong>② 1 回の標本のデータ</strong>（選んだ {N} 人の身長）：散らばりは {round(sd(oneSample, 1), 1)} くらいで、母集団と<strong>ほぼ同じ</strong>。この {N}
        人の平均が標本平均 x̄ = {round(oneMean, 1)}
      </p>
      <Plot x={[130, 190]} y={[0, 2]} height={90} hideY grid={false}>
        <Points data={oneSample.map((v, i) => ({ x: v, y: 0.7 + (i % 3) * 0.3 }))} color="c1" r={5} opacity={0.7} />
        <Marker x={oneMean} color="c2" dashed={false} label="x̄" />
      </Plot>
      <p className="figure-readout">
        <strong>③ 標本平均の分布</strong>（「{N} 人を選んで平均を出す」を {REPS} 回くり返した x̄ のヒストグラム）：中心は μ、散らばりは σ/√{N} ≒{' '}
        {round(se, 1)} と<strong>ずっとせまい</strong>
      </p>
      <Plot x={[130, 190]} y={[0, meanMax * 1.15]} height={150} hideY xLabel="身長（cm）">
        <Bars data={meanBars} width={0.45} color="c1" opacity={0.6} />
        <Curve f={(x) => normalPdf(x, heightMu, se)} color="c2" samples={300} />
        <Marker x={heightMu} color="c5" label="μ" />
      </Plot>
    </div>
  )
}
