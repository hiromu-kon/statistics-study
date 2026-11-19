import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, HLine, Legend, Plot, Points, Segment, colorVar, usePlot } from '../../../components/charts/Plot'
import { linearRegression, mean, round, sum } from '../../../lib/stats'

/** 全変動を「回帰変動」と「残差変動」に分けた帯（合計を100%として） */
function SplitBar({ ssr, sse }: { ssr: number; sse: number }) {
  const s = usePlot()
  const total = ssr + sse
  const cut = (ssr / total) * 100
  const y0 = s.y(0.8)
  const h = s.y(0.2) - y0
  return (
    <g>
      <rect x={s.x(0)} y={y0} width={s.x(cut) - s.x(0)} height={h} fill={colorVar('c1')} opacity={0.85} />
      <rect x={s.x(cut)} y={y0} width={s.x(100) - s.x(cut)} height={h} fill={colorVar('c5')} opacity={0.85} />
    </g>
  )
}

/**
 * 変動の分解を見る図。各点の「平均からのずれ」を、直線で説明できる分（青）と残差（赤）に分けて描く。
 * スライダーは残差だけを k 倍する。残差は x と無相関なので、k を変えても回帰直線と回帰変動は変わらない。
 */
export function VariationPlot({ xs, ys, xLabel, yLabel }: { xs: number[]; ys: number[]; xLabel: string; yLabel: string }) {
  const [k, setK] = useState(1)
  const fit = linearRegression(xs, ys)
  const yhat = xs.map((x) => fit.a + fit.b * x)
  const yk = yhat.map((v, i) => v + k * (ys[i] - v))
  const my = mean(yk)
  const ssr = sum(yhat.map((v) => (v - my) ** 2))
  const sse = sum(yk.map((v, i) => (v - yhat[i]) ** 2))
  const r2 = ssr / (ssr + sse)
  return (
    <div>
      <Plot x={[20, 32]} y={[60, 140]} height={340} xLabel={xLabel} yLabel={yLabel} xTicks={[20, 22, 24, 26, 28, 30, 32]}>
        <HLine y={my} color="muted" label="ȳ（平均）" />
        <Curve f={(t) => fit.a + fit.b * t} color="ink" width={2} dashed />
        {xs.map((x, i) => (
          <g key={i}>
            <Segment x1={x - 0.12} y1={my} x2={x - 0.12} y2={yhat[i]} color="c1" width={5} />
            <Segment x1={x + 0.12} y1={yhat[i]} x2={x + 0.12} y2={yk[i]} color="c5" width={5} />
          </g>
        ))}
        <Points data={xs.map((x, i) => ({ x, y: yk[i] }))} r={6} color="ink" opacity={0.9} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '直線で説明できるずれ（ŷ − ȳ）' },
          { color: 'c5', label: '残差（y − ŷ）' },
        ]}
      />
      <Plot x={[0, 100]} y={[0, 1]} height={70} hideY grid={false} xTicks={[0, 25, 50, 75, 100]} xTickFormat={(v) => `${v}%`}>
        <SplitBar ssr={ssr} sse={sse} />
      </Plot>
      <p className="figure-readout">
        全変動 {round(ssr + sse, 1)} = 回帰変動 <span className="mark mark-c1">{round(ssr, 1)}</span> + 残差変動{' '}
        <span style={{ color: 'var(--c5)', fontWeight: 700 }}>{round(sse, 1)}</span>
      </p>
      <p className="figure-readout">
        決定係数 R² = {round(ssr, 1)} ÷ {round(ssr + sse, 1)} = <strong>{round(r2, 3)}</strong>
      </p>
      <Controls>
        <Slider label="残差の大きさ k" value={k} min={0} max={3} step={0.1} onChange={setK} format={(v) => `${v.toFixed(1)}倍`} />
      </Controls>
    </div>
  )
}
