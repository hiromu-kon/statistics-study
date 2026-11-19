import { Label, Legend, Plot, Segment, colorVar, usePlot } from '../../../components/charts/Plot'
import { patients } from './survival'

function Marks() {
  const s = usePlot()
  return (
    <g>
      {patients.map((p, i) => {
        const y = s.y(patients.length - i)
        const x = s.x(p.time)
        return p.event === 1 ? (
          <g key={p.id} stroke={colorVar('c4')} strokeWidth={2.5}>
            <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} />
            <line x1={x - 6} y1={y + 6} x2={x + 6} y2={y - 6} />
          </g>
        ) : (
          <circle key={p.id} cx={x} cy={y} r={6} fill="var(--surface)" stroke={colorVar('c1')} strokeWidth={2.5} />
        )
      })}
    </g>
  )
}

/** 8人の観察期間。× は死亡を観察できた人、○ は途中で観察が終わった（打ち切り）人 */
export function CensoringPlot() {
  return (
    <div>
      <Plot x={[0, 12]} y={[0.3, 8.7]} height={300} hideY grid={false} xLabel="観察を始めてからの時間（か月）" xTicks={[0, 2, 4, 6, 8, 10, 12]}>
        {patients.map((p, i) => (
          <g key={p.id}>
            <Segment x1={0} y1={patients.length - i} x2={p.time} y2={patients.length - i} color={p.event === 1 ? 'c4' : 'c1'} width={3} />
            <Label x={p.time + 0.4} y={patients.length - i} dy={4} anchor="start">
              {`${p.id}：${p.time}${p.event === 1 ? '' : '+'}`}
            </Label>
          </g>
        ))}
        <Marks />
      </Plot>
      <Legend
        items={[
          { color: 'c4', label: '× 死亡（イベント）を観察' },
          { color: 'c1', label: '○ 打ち切り（それ以降は不明。「3+」のように書く）' },
        ]}
      />
    </div>
  )
}
