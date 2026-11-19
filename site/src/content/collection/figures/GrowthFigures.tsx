import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, HLine, Legend, Plot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Choice, Line, Txt } from './svg'

const pct = (r: number, digits = 1) => `${r >= 0 ? '+' : ''}${round(r * 100, digits)}%`

/**
 * 「+r% のあと −r%」で元に戻るか、を見せる図。
 * 算術平均では 0%（元どおり）に見えるが、実際は減っている。幾何平均で進むと実際の値に一致する。
 */
export function GrowthTrap() {
  const [r, setR] = useState(0.5)
  const v = [100, 100 * (1 + r), 100 * (1 + r) * (1 - r)]
  const g = Math.sqrt((1 + r) * (1 - r))
  const geo = [100, 100 * g, 100 * g * g]
  const names = ['最初', '1年後', '2年後']
  return (
    <div>
      <Plot x={[-0.6, 2.6]} y={[0, 175]} xTicks={[0, 1, 2]} xTickFormat={(t) => names[t] ?? ''} yTicks={[0, 50, 100, 150]} yLabel="売上">
        <Bars data={v.map((y, x) => ({ x, y }))} width={0.5} color="c1" opacity={0.75} />
        <HLine y={100} color="muted" label="算術平均 0% なら、ずっと 100 のはず" />
        <Line data={geo.map((y, x) => ({ x, y }))} color="c2" dashed dots />
        {v.map((y, x) => (
          <Txt key={x} x={x} y={y} dy={-8} color="c1">
            {round(y, 1)}
          </Txt>
        ))}
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '実際の売上' },
          { color: 'c2', label: `幾何平均（毎年 ${pct(g - 1)}）で進んだ場合` },
        ]}
      />
      <p className="figure-readout">
        成長率：{pct(r, 0)} → {pct(-r, 0)}　算術平均 = <strong>0%</strong>　幾何平均 = <strong>{pct(g - 1)}</strong>　2年間で{' '}
        <strong>{pct((1 + r) * (1 - r) - 1)}</strong>
      </p>
      <Controls>
        <Slider label="上がって下がる率 r" value={r} min={0} max={0.6} step={0.05} onChange={setR} format={(t) => `${Math.round(t * 100)}%`} />
      </Controls>
    </div>
  )
}

/** 5年間の売上と、その年の成長率 */
export function SalesGrowthBars({ years, values }: { years: number[]; values: number[] }) {
  return (
    <Plot
      x={[years[0] - 0.6, years[years.length - 1] + 0.6]}
      y={[0, Math.max(...values) * 1.25]}
      xTicks={years}
      yTicks={[0, 100, 200, 300]}
      yLabel="売上（万円）"
      height={280}
    >
      <Bars data={values.map((y, i) => ({ x: years[i], y }))} width={0.55} color="c1" opacity={0.7} labels={(y) => String(round(y, 2))} />
      {values.slice(1).map((y, i) => {
        const g = y / values[i] - 1
        return (
          <Txt key={i} x={years[i + 1]} y={y} dy={-24} color={g >= 0 ? 'c3' : 'c5'}>
            {pct(g, 0)}
          </Txt>
        )
      })}
    </Plot>
  )
}

/**
 * 規模の違う2つの系列を、元の値と指数（基準年 = 100）で見比べる図。
 * 基準年をスライダーで変えられる。
 */
export function IndexChart({
  years,
  a,
  b,
  aLabel,
  bLabel,
}: {
  years: number[]
  a: number[]
  b: number[]
  aLabel: string
  bLabel: string
}) {
  const [mode, setMode] = useState<'raw' | 'index'>('raw')
  const [baseIdx, setBaseIdx] = useState(0)
  const ia = a.map((v) => (v / a[baseIdx]) * 100)
  const ib = b.map((v) => (v / b[baseIdx]) * 100)
  const sa = mode === 'raw' ? a : ia
  const sb = mode === 'raw' ? b : ib
  const all = [...sa, ...sb]
  const yMax = mode === 'raw' ? Math.max(...all) * 1.15 : Math.ceil((Math.max(...all) + 10) / 10) * 10
  const yMin = mode === 'raw' ? 0 : Math.floor((Math.min(...all) - 10) / 10) * 10
  const toPts = (s: number[]) => s.map((y, i) => ({ x: years[i], y }))
  const last = years.length - 1
  return (
    <div>
      <Choice
        options={[
          { value: 'raw', label: '元の値（万円）' },
          { value: 'index', label: '指数（基準年 = 100）' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <Plot x={[years[0] - 0.4, years[last] + 0.4]} y={[yMin, yMax]} xTicks={years} yLabel={mode === 'raw' ? '売上（万円）' : '指数'}>
        {mode === 'index' && <HLine y={100} color="muted" label={`${years[baseIdx]}年 = 100`} />}
        <Line data={toPts(sa)} color="c1" dots />
        <Line data={toPts(sb)} color="c2" dots />
        <Txt x={years[last]} y={sa[last]} dy={-12} color="c1" anchor="end">
          {round(sa[last], 1)}
        </Txt>
        <Txt x={years[last]} y={sb[last]} dy={mode === 'raw' ? -12 : 20} color="c2" anchor="end">
          {round(sb[last], 1)}
        </Txt>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: aLabel },
          { color: 'c2', label: bLabel },
        ]}
      />
      {mode === 'index' ? (
        <p className="figure-readout">
          {years[last]}年の指数：{aLabel} <strong>{round(ia[last], 1)}</strong>、{bLabel} <strong>{round(ib[last], 1)}</strong>（{years[baseIdx]}
          年と比べて何倍か × 100）
        </p>
      ) : (
        <p className="figure-readout">元の値だと、規模の小さい {bLabel} の伸びがほとんど見えない</p>
      )}
      {mode === 'index' && (
        <Controls>
          <Slider label="基準年" value={baseIdx} min={0} max={last} step={1} onChange={setBaseIdx} format={(i) => `${years[i]}年`} />
        </Controls>
      )}
    </div>
  )
}
