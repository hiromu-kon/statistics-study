import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Bars, Plot, Points } from '../../../components/charts/Plot'
import { binData } from '../../../components/charts/common'
import { mean, round, sd } from '../../../lib/stats'
import { Marker } from './parts'
import { drawFrom, heightMu, heightPopulation, heightSigma } from './sim'

const popBars = binData(heightPopulation, 130, 2, 30).map((b) => ({ x: b.x, y: b.y / (heightPopulation.length * 2) }))
const popMax = Math.max(...popBars.map((b) => b.y))

/**
 * 母集団から n 人を選んで平均を出す、を何度もくり返す図。
 * 標本平均が毎回変わること、その値をためると「標本平均の分布」ができることを体感する。
 */
export function SampleMeanSim() {
  const [n, setN] = useState(5)
  const [count, setCount] = useState(0)
  const [means, setMeans] = useState<number[]>([])
  const [last, setLast] = useState<number[]>([])

  const draw = (times: number) => {
    const next = [...means]
    let sample: number[] = last
    for (let t = 0; t < times; t++) {
      sample = drawFrom(heightPopulation, n, 7919 * (count + t + 1) + n)
      next.push(mean(sample))
    }
    setMeans(next)
    setLast(sample)
    setCount(count + times)
  }

  const reset = (newN = n) => {
    setN(newN)
    setMeans([])
    setLast([])
  }

  const meanBars = binData(means, 130, 1, 60)
  const yMax = Math.max(5, ...meanBars.map((b) => b.y)) * 1.15
  const lastMean = last.length > 0 ? mean(last) : undefined
  const se = heightSigma / Math.sqrt(n)

  return (
    <div>
      <p className="figure-readout">
        <strong>母集団</strong>（2000人の身長）。点が「いま選んだ {n} 人」
      </p>
      <Plot x={[130, 190]} y={[0, popMax * 1.2]} height={170} hideY xLabel="身長（cm）">
        <Bars data={popBars} width={1.8} color="muted" opacity={0.45} />
        <Marker x={heightMu} color="c5" label={`母平均 μ ≒ ${round(heightMu, 1)}`} />
        <Points data={last.map((v) => ({ x: v, y: popMax * 0.08 }))} color="c1" r={5} opacity={0.8} />
        {lastMean !== undefined && <Marker x={lastMean} color="c2" dashed={false} to={popMax * 0.6} label={`標本平均 ${round(lastMean, 1)}`} labelY={popMax * 0.66} />}
      </Plot>

      <p className="figure-readout">
        <strong>標本平均をためたヒストグラム</strong>（{means.length} 回ぶん）
      </p>
      <Plot x={[130, 190]} y={[0, yMax]} height={200} xLabel="標本平均（cm）" yLabel="回数">
        <Bars data={meanBars} width={0.9} color="c1" highlight={lastMean === undefined ? undefined : (x) => Math.abs(x - lastMean) < 0.5} highlightColor="c2" />
        <Marker x={heightMu} color="c5" />
      </Plot>

      <p className="figure-readout">
        {means.length >= 2 ? (
          <>
            標本平均の平均 ≒ <strong>{round(mean(means), 2)}</strong>（μ ≒ {round(heightMu, 2)}）　標本平均の標準偏差 ≒{' '}
            <strong>{round(sd(means), 2)}</strong>（理論値 <M>{'\\sigma/\\sqrt{n}'}</M> ≒ {round(se, 2)}）
          </>
        ) : (
          '「抽出する」を押して、何度も標本をとってみよう'
        )}
      </p>

      <Controls>
        <Button variant="primary" onClick={() => draw(1)}>
          1回抽出する
        </Button>
        <Button onClick={() => draw(10)}>10回</Button>
        <Button onClick={() => draw(200)}>200回</Button>
        <Button variant="ghost" onClick={() => reset()}>
          リセット
        </Button>
      </Controls>
      <Controls>
        <Slider label="1回に選ぶ人数 n" value={n} min={1} max={30} step={1} onChange={(v) => reset(v)} format={(v) => `${v}人`} />
      </Controls>
    </div>
  )
}
