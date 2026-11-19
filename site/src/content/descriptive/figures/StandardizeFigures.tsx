import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Label, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { mean, normalPdf, round, sd } from '../../../lib/stats'

const TESTS = [
  { name: '国語', mu: 60, sigma: 10, color: 'c1' as const },
  { name: '数学', mu: 50, sigma: 20, color: 'c2' as const },
]

/** 平均も散らばりも違う2教科の点数を、z 得点にそろえて比べる */
export function StandardizeCompare() {
  const [scores, setScores] = useState([75, 85])
  const zs = TESTS.map((t, i) => (scores[i] - t.mu) / t.sigma)
  return (
    <div>
      <Compare>
        {TESTS.map((t, i) => (
          <Card key={t.name} title={`${t.name}（平均 ${t.mu}点、標準偏差 ${t.sigma}点）`}>
            <Plot x={[0, 100]} y={[0, normalPdf(0, 0, 10) * 1.15]} height={150} hideY grid={false} xTicks={[0, 20, 40, 60, 80, 100]}>
              <Area f={(x) => normalPdf(x, t.mu, t.sigma)} from={0} to={100} color={t.color} opacity={0.2} />
              <Curve f={(x) => normalPdf(x, t.mu, t.sigma)} color={t.color} />
              <VLine x={t.mu} color="muted" />
              <VLine x={scores[i]} color={t.color} dashed={false} label={`${scores[i]}点`} />
            </Plot>
            <p className="figure-readout">
              z = ({scores[i]} − {t.mu}) ÷ {t.sigma} = <strong>{round(zs[i], 2)}</strong>　偏差値 <strong>{round(50 + 10 * zs[i], 1)}</strong>
            </p>
          </Card>
        ))}
      </Compare>
      <Plot x={[-3, 3]} y={[0, 0.46]} height={170} hideY grid={false} xTicks={[-3, -2, -1, 0, 1, 2, 3]} xLabel="z 得点（平均 0・標準偏差 1 にそろえた目盛り）">
        <Curve f={(z) => normalPdf(z)} color="muted" />
        {TESTS.map((t, i) => (
          <VLine key={t.name} x={Math.max(-3, Math.min(3, zs[i]))} color={t.color} dashed={false} />
        ))}
        {TESTS.map((t, i) => (
          <Label key={`l${t.name}`} x={Math.max(-2.7, Math.min(2.7, zs[i]))} y={0.43 - i * 0.05} color={t.color}>
            {t.name}
          </Label>
        ))}
      </Plot>
      <Controls>
        {TESTS.map((t, i) => (
          <Slider
            key={t.name}
            label={`${t.name}の点`}
            value={scores[i]}
            min={0}
            max={100}
            step={1}
            onChange={(v) => setScores(scores.map((s, j) => (j === i ? v : s)))}
            format={(v) => `${v}点`}
          />
        ))}
      </Controls>
    </div>
  )
}

const BASE = [42, 46, 50, 50, 54, 58]

/** y = ax + b の変換で、平均・標準偏差・変動係数がどう変わるか */
export function LinearTransform() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(10)
  const ys = BASE.map((x) => a * x + b)
  const mx = mean(BASE)
  const my = mean(ys)
  const sx = sd(BASE)
  const sy = sd(ys)
  return (
    <div>
      <Plot x={[-180, 240]} y={[0, 3]} height={170} hideY grid={false} xTicks={[-150, -100, -50, 0, 50, 100, 150, 200]}>
        <Label x={-175} y={2.3} anchor="start" color="c1">
          x（元のデータ）
        </Label>
        <Points data={BASE.map((x, i) => ({ x, y: 2 + (BASE.slice(0, i).includes(x) ? 0.25 : 0) }))} r={6} color="c1" opacity={0.85} />
        <Label x={-175} y={1.3} anchor="start" color="c2">
          y = ax + b
        </Label>
        <Points data={ys.map((y, i) => ({ x: y, y: 1 + (ys.slice(0, i).includes(y) ? 0.25 : 0) }))} r={6} color="c2" opacity={0.85} />
        <VLine x={mx} color="c1" />
        <VLine x={my} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `x：平均 ${round(mx, 2)}、標準偏差 ${round(sx, 2)}、変動係数 ${round(sx / mx, 3)}` },
          { color: 'c2', label: `y：平均 ${round(my, 2)}、標準偏差 ${round(sy, 2)}、変動係数 ${my === 0 ? '—' : round(sy / Math.abs(my), 3)}` },
        ]}
      />
      <p className="figure-readout">
        平均は a × {round(mx, 2)} + b = <strong>{round(a * mx + b, 2)}</strong>、標準偏差は |a| × {round(sx, 2)} = <strong>{round(Math.abs(a) * sx, 2)}</strong>（n で割った場合）
      </p>
      <Controls>
        <Slider label="a（何倍するか）" value={a} min={-2} max={3} step={0.1} onChange={(v) => setA(round(v, 1))} format={(v) => v.toFixed(1)} />
        <Slider label="b（いくつ足すか）" value={b} min={-50} max={50} step={5} onChange={setB} />
      </Controls>
    </div>
  )
}
