import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Label, Legend, Plot, VLine } from '../../../components/charts/Plot'
import { round, tCdf, tPdf, tQuantile } from '../../../lib/stats'

/**
 * 傾きの t 検定（H0: β1 = 0、両側、有意水準 5%）の図。
 * 推定値 b1 を動かすと t = b1 / SE が動き、棄却域（赤）に入るかどうかが変わる。
 */
export function SlopeTTestPlot({ se, df, initial }: { se: number; df: number; initial: number }) {
  const [b, setB] = useState(initial)
  const crit = tQuantile(0.975, df)
  const t = b / se
  const p = 2 * (1 - tCdf(Math.abs(t), df))
  const shown = Math.max(-5.8, Math.min(5.8, t))
  const reject = Math.abs(t) >= crit
  return (
    <div>
      <Plot x={[-6, 6]} y={[0, 0.45]} hideY xTicks={[-6, -4, -2, 0, 2, 4, 6]} xLabel={`t（自由度 ${df} の t 分布）`} height={250}>
        <Area f={(x) => tPdf(x, df)} from={-6} to={-crit} color="c5" opacity={0.35} />
        <Area f={(x) => tPdf(x, df)} from={crit} to={6} color="c5" opacity={0.35} />
        <Curve f={(x) => tPdf(x, df)} color="ink" />
        <VLine x={-crit} color="c5" />
        <VLine x={crit} color="c5" label={`${round(crit, 3)}`} />
        <VLine x={shown} color="c1" dashed={false} />
        <Label x={shown} y={0.41} color="c1" anchor={shown > 3 ? 'end' : 'start'} dy={0}>
          {` t = ${round(t, 2)} `}
        </Label>
      </Plot>
      <Legend
        items={[
          { color: 'c5', label: '棄却域（両側 5%。左右に 2.5% ずつ）' },
          { color: 'c1', label: '標本から計算した t 値' },
        ]}
      />
      <p className="figure-readout">
        t = {round(b, 2)} ÷ {se} = <strong>{round(t, 2)}</strong>　両側の p 値 = <strong>{p < 0.0001 ? '0.0001 未満' : round(p, 4)}</strong>　→{' '}
        <strong style={{ color: reject ? 'var(--c5)' : 'var(--ink-2)' }}>{reject ? 'H0 を棄却（傾きは 0 ではないといえる）' : 'H0 を棄却できない'}</strong>
      </p>
      <Controls>
        <Slider label="推定した傾き b1" value={b} min={-3} max={3} step={0.05} onChange={setB} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
