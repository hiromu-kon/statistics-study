import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Area, Curve, HLine, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { fCdf, fPdf, fQuantile, mean, round, sum } from '../../../lib/stats'

// 3種類の肥料 A・B・C を5鉢ずつに与えたときの草丈（cm）の、群の平均からのずれ。
// 既定値（平均 17・20・23、ばらつき 1 倍）でレッスン本文の例のデータになる。
const DEVIATIONS = [
  [-2, 2, 0, -4, 4],
  [0, 4, -2, 2, -4],
  [0, -4, 4, -2, 2],
]
const NAMES = ['A', 'B', 'C']
const OFFSETS = [-0.2, -0.1, 0, 0.1, 0.2]

/**
 * 一元配置分散分析の図。群の平均を動かすと群間変動が、ばらつきを動かすと群内変動が変わり、
 * F 比 =（群間の平均平方）÷（群内の平均平方）がどう動くかを見せる。
 */
export function AnovaPlot() {
  const [means, setMeans] = useState([17, 20, 23])
  const [k, setK] = useState(1)
  const [mode, setMode] = useState<'within' | 'between'>('within')
  const groups = DEVIATIONS.map((devs, g) => devs.map((d) => means[g] + k * d))
  const all = groups.flat()
  const grand = mean(all)
  const sa = sum(groups.map((g) => g.length * (mean(g) - grand) ** 2))
  const se = sum(groups.map((g) => sum(g.map((v) => (v - mean(g)) ** 2))))
  const dfA = groups.length - 1
  const dfE = all.length - groups.length
  const F = se === 0 ? Infinity : sa / dfA / (se / dfE)
  const crit = fQuantile(0.95, dfA, dfE)
  const p = Number.isFinite(F) ? 1 - fCdf(F, dfA, dfE) : 0
  const setMean = (g: number) => (v: number) => setMeans((m) => m.map((x, i) => (i === g ? v : x)))

  return (
    <div>
      <Plot
        x={[0.4, 3.6]}
        y={[0, 40]}
        xTicks={[1, 2, 3]}
        xTickFormat={(v) => `肥料 ${NAMES[v - 1] ?? ''}`}
        yLabel="草丈（cm）"
        height={320}
      >
        <HLine y={grand} color="c3" label={`全体の平均 ${round(grand, 2)}`} />
        {groups.map((g, gi) => (
          <g key={gi}>
            <Segment x1={gi + 1 - 0.32} y1={mean(g)} x2={gi + 1 + 0.32} y2={mean(g)} color="c2" width={3} />
            {mode === 'within' &&
              g.map((v, j) => <Segment key={j} x1={gi + 1 + OFFSETS[j]} y1={mean(g)} x2={gi + 1 + OFFSETS[j]} y2={v} color="c1" width={2} />)}
            {mode === 'between' && <Segment x1={gi + 1.34} y1={grand} x2={gi + 1.34} y2={mean(g)} color="c2" width={4} />}
            <Points data={g.map((v, j) => ({ x: gi + 1 + OFFSETS[j], y: v }))} r={5.5} color="ink" opacity={0.65} />
          </g>
        ))}
      </Plot>
      <Legend
        items={[
          { color: 'c3', label: '全体の平均' },
          { color: 'c2', label: '各群の平均' },
          mode === 'within' ? { color: 'c1', label: '群内のずれ（データ − 群の平均）' } : { color: 'c2', label: '群間のずれ（群の平均 − 全体の平均）' },
        ]}
      />
      <Controls>
        <Button variant={mode === 'within' ? 'primary' : 'default'} onClick={() => setMode('within')}>
          群内のずれを見る
        </Button>
        <Button variant={mode === 'between' ? 'primary' : 'default'} onClick={() => setMode('between')}>
          群間のずれを見る
        </Button>
      </Controls>
      <Controls>
        {NAMES.map((name, g) => (
          <Slider key={name} label={`${name} の平均`} value={means[g]} min={10} max={30} step={0.5} onChange={setMean(g)} />
        ))}
        <Slider label="群内のばらつき" value={k} min={0.25} max={2} step={0.05} onChange={setK} format={(v) => `${v.toFixed(2)}倍`} />
      </Controls>
      <p className="figure-readout">
        群間変動 = <strong>{round(sa, 2)}</strong>（自由度 {dfA}）　群内変動 = <strong>{round(se, 2)}</strong>（自由度 {dfE}）
      </p>
      <p className="figure-readout">
        F = ({round(sa, 2)} ÷ {dfA}) ÷ ({round(se, 2)} ÷ {dfE}) = <strong>{round(F, 2)}</strong>　p 値 ={' '}
        <strong>{p < 0.0001 ? '0.0001 未満' : round(p, 4)}</strong>　→{' '}
        <strong style={{ color: F >= crit ? 'var(--c5)' : 'var(--ink-2)' }}>
          {F >= crit ? '5% で有意（どこかの群の平均が違う）' : '5% で有意でない'}
        </strong>
      </p>
      <Plot x={[0, 12]} y={[0, 1]} hideY height={170} xLabel={`F（自由度 ${dfA}, ${dfE} の F 分布）`} xTicks={[0, 2, 4, 6, 8, 10, 12]}>
        <Area f={(x) => fPdf(x, dfA, dfE)} from={crit} to={12} color="c5" opacity={0.35} />
        <Curve f={(x) => fPdf(x, dfA, dfE)} from={0.01} to={12} color="ink" />
        <VLine x={crit} color="c5" label={`F0.05 = ${round(crit, 3)}`} />
        <VLine x={Math.min(F, 11.9)} color="c1" dashed={false} />
      </Plot>
      <p className="figure-readout small">青い線が今の F。赤い部分（上側 5%）に入ると「群の平均はすべて等しい」を棄却します。</p>
    </div>
  )
}
