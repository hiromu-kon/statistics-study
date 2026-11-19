import { Curve, HLine, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { linearProbFit, logitFit, passData } from './glmData'

/** 0/1 のデータに直線を当てはめると、確率なのに 0 未満や 1 より大きい値が出てしまう */
export function LinearProbPlot() {
  const { b0, b1 } = linearProbFit
  return (
    <div>
      <Plot x={[0, 12]} y={[-0.3, 1.3]} xLabel="勉強時間 x（時間）" yLabel="合格の確率" yTicks={[-0.25, 0, 0.25, 0.5, 0.75, 1, 1.25]}>
        <HLine y={0} color="c4" label="0" />
        <HLine y={1} color="c4" label="1" />
        <Segment x1={0} y1={b0} x2={12} y2={b0 + b1 * 12} color="c2" width={2.5} />
        <Curve f={(x) => 1 / (1 + Math.exp(-(logitFit.b0 + logitFit.b1 * x)))} color="c1" />
        <Points data={passData.hours.map((x, i) => ({ x, y: passData.pass[i] }))} r={5} color="ink" opacity={0.55} />
      </Plot>
      <Legend
        items={[
          { color: 'c2', label: `直線（最小二乗法）ŷ = ${b0} + ${b1}x` },
          { color: 'c1', label: 'ロジスティック回帰' },
        ]}
      />
    </div>
  )
}
