import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Plot, Points, VLine, colorVar, usePlot } from '../../../components/charts/Plot'
import { mean, median, round, sum } from '../../../lib/stats'

function Beam({ data, pivot }: { data: number[]; pivot: number }) {
  const s = usePlot()
  const torque = sum(data.map((x) => x - pivot))
  // 傾きは見た目の目安。偏差の合計に比例させ、大きくなりすぎないように止める
  const angle = Math.max(-10, Math.min(10, torque))
  const px = s.x(pivot)
  const beamY = s.y(1)
  const counts = new Map<number, number>()
  return (
    <g>
      <polygon points={`${px},${beamY + 3} ${px - 14},${beamY + 30} ${px + 14},${beamY + 30}`} fill={colorVar('c2')} />
      <g transform={`rotate(${angle} ${px} ${beamY})`}>
        <line x1={s.x(s.xDomain[0])} x2={s.x(s.xDomain[1])} y1={beamY} y2={beamY} stroke={colorVar('ink')} strokeWidth={4} strokeLinecap="round" />
        {data.map((x, i) => {
          const k = counts.get(x) ?? 0
          counts.set(x, k + 1)
          return <circle key={i} cx={s.x(x)} cy={beamY - 11 - k * 20} r={9} fill={colorVar('c1')} opacity={0.9} />
        })}
      </g>
    </g>
  )
}

/** やじろべえ。支点を動かして、釣り合う位置が平均であることを確かめる */
export function BalanceBeam({ data = [1, 2, 2, 4, 6] }: { data?: number[] }) {
  const [pivot, setPivot] = useState(5)
  const torque = sum(data.map((x) => x - pivot))
  const m = mean(data)
  return (
    <div>
      <Plot x={[0, 8]} y={[0, 3]} height={190} hideY grid={false} xTicks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}>
        <Beam data={data} pivot={pivot} />
      </Plot>
      <p className="figure-readout">
        支点の位置 = <strong>{pivot}</strong>　偏差（値 − 支点）の合計 = <strong>{round(torque, 2)}</strong>
        {Math.abs(torque) < 1e-9 ? '　→ 釣り合った！（ここが平均）' : torque > 0 ? '　→ 右が重い' : '　→ 左が重い'}
      </p>
      <Controls>
        <Slider label="支点" value={pivot} min={0} max={8} step={0.2} onChange={(v) => setPivot(round(v, 1))} format={(v) => v.toFixed(1)} />
      </Controls>
      <p className="small muted" style={{ textAlign: 'center' }}>
        データ {data.join(', ')}（平均 {round(m, 2)}）
      </p>
    </div>
  )
}

/** 1つの値を大きくしていくと、平均は引っぱられるが中央値はほとんど動かない */
export function OutlierEffect() {
  const [big, setBig] = useState(9)
  const data = [3, 4, 5, 5, 6, 8, big]
  const m = mean(data)
  const md = median(data)
  return (
    <div>
      <Plot x={[0, 42]} y={[0, 2]} height={150} hideY grid={false} xTicks={[0, 5, 10, 15, 20, 25, 30, 35, 40]} xLabel="値">
        <VLine x={md} color="c3" label={`中央値 ${round(md, 2)}`} />
        <VLine x={m} color="c2" label={`平均 ${round(m, 2)}`} />
        <Points data={data.map((x, i) => ({ x, y: 0.6 + (data.slice(0, i).filter((y) => y === x).length * 0.35), color: i === data.length - 1 ? 'c5' : 'c1' }))} r={7} opacity={0.9} />
      </Plot>
      <p className="figure-readout">
        データ：3, 4, 5, 5, 6, 8, <strong style={{ color: 'var(--c5)' }}>{big}</strong>　→　平均 <strong>{round(m, 2)}</strong>、中央値 <strong>{md}</strong>
      </p>
      <Controls>
        <Slider label="赤い点の値" value={big} min={9} max={40} step={1} onChange={setBig} />
      </Controls>
    </div>
  )
}
