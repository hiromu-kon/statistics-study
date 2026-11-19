import { useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { HLine, Legend, Plot, colorVar, usePlot } from '../../../components/charts/Plot'
import { Polyline } from './Polyline'
import { kaplanMeier, patients, stepPoints } from './survival'

const km = kaplanMeier(patients)
// 比べるための「まちがった」2つのやり方
const dropCensored = kaplanMeier(patients.filter((p) => p.event === 1))
const censoredAsDeath = kaplanMeier(patients.map((p) => ({ ...p, event: 1 })))

/** 打ち切りの時刻に、カプラン・マイヤー曲線の上へ小さな縦線を描く */
function CensorTicks() {
  const s = usePlot()
  return (
    <g>
      {patients
        .filter((p) => p.event === 0)
        .map((p) => {
          const before = km.filter((r) => r.time <= p.time)
          const y = before.length ? before[before.length - 1].surv : 1
          return <line key={p.id} x1={s.x(p.time)} x2={s.x(p.time)} y1={s.y(y) - 7} y2={s.y(y) + 7} stroke={colorVar('c1')} strokeWidth={2.5} />
        })}
    </g>
  )
}

export function KaplanMeierPlot() {
  const [compare, setCompare] = useState(false)
  return (
    <div>
      <Plot x={[0, 11]} y={[0, 1.05]} xLabel="時間 t（か月）" yLabel="生存率 S(t)" yTicks={[0, 0.25, 0.5, 0.75, 1]} xTicks={[0, 2, 4, 6, 8, 10]}>
        <HLine y={0.5} color="muted" label="0.5" />
        {compare && (
          <>
            <Polyline points={stepPoints(dropCensored, 10)} color="c2" dashed width={2} />
            <Polyline points={stepPoints(censoredAsDeath, 10)} color="c3" dashed width={2} />
          </>
        )}
        <Polyline points={stepPoints(km, 10)} color="c1" width={3} />
        <CensorTicks />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'カプラン・マイヤー推定量（縦の短い線は打ち切り）' },
          ...(compare
            ? [
                { color: 'c2' as const, label: '打ち切りの人を除いて計算（低すぎる）' },
                { color: 'c3' as const, label: '打ち切りを死亡とみなす（低すぎる）' },
              ]
            : []),
        ]}
      />
      <Controls>
        <Button variant={compare ? 'primary' : 'default'} onClick={() => setCompare((v) => !v)}>
          まちがった計算と比べる
        </Button>
      </Controls>
    </div>
  )
}
