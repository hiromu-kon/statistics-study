import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Legend, Plot, Points, type Color } from '../../../components/charts/Plot'
import { fCdf, fQuantile, round } from '../../../lib/stats'
import { Line } from '../../collection/figures/svg'
import { SsBar } from './SsBar'

// レッスン本文の乱塊法の例（肥料3種類 × 畑のブロック4つ、各1区画）。
// 値 = 20 + 肥料の効果 + c × ブロックの効果 + 誤差。c = 1 のとき本文のデータになる。
// 誤差は行・列の合計が 0 になるように選んであるので、c を変えても肥料と誤差の平方和は変わらない。
const TREAT = [-2, 0, 2]
const BLOCK = [-3, -1, 1, 3]
const ERR = [
  [1, -1, 0, 0],
  [-1, 0, 1, 0],
  [0, 1, -1, 0],
]
const BLOCK_COLORS: Color[] = ['c1', 'c3', 'c4', 'c2']

function blockData(c: number): number[][] {
  return TREAT.map((t, i) => BLOCK.map((b, j) => 20 + t + c * b + ERR[i][j]))
}

/** 乱塊法：ブロックの差を大きくすると、ブロックを無視した分析では誤差がふくらみ、肥料の差が見えなくなる */
export function BlockAnova() {
  const [c, setC] = useState(1)
  const y = blockData(c)
  const t = y.length
  const b = y[0].length
  const grand = y.flat().reduce((s, v) => s + v, 0) / (t * b)
  const tm = y.map((row) => row.reduce((s, v) => s + v, 0) / b)
  const bm = y[0].map((_, j) => y.reduce((s, row) => s + row[j], 0) / t)
  const sa = b * tm.reduce((s, v) => s + (v - grand) ** 2, 0)
  const sb = t * bm.reduce((s, v) => s + (v - grand) ** 2, 0)
  const st = y.flat().reduce((s, v) => s + (v - grand) ** 2, 0)
  const se = st - sa - sb
  const dfA = t - 1
  const dfE = (t - 1) * (b - 1)
  const fBlock = sa / dfA / (se / dfE)
  const fCrd = sa / dfA / ((se + sb) / (t * b - t))
  const verdict = (F: number, d1: number, d2: number) =>
    `F = ${round(F, 2)}（p = ${round(1 - fCdf(F, d1, d2), 4)}、F0.05(${d1}, ${d2}) = ${round(fQuantile(0.95, d1, d2), 3)}）→ ${F >= fQuantile(0.95, d1, d2) ? '5% で有意' : '有意でない'}`
  return (
    <div>
      <Plot x={[0.5, 3.5]} y={[8, 32]} xTicks={[1, 2, 3]} xTickFormat={(v) => `肥料 ${['A', 'B', 'C'][v - 1] ?? ''}`} yLabel="収量" height={260}>
        {BLOCK.map((_, j) => (
          <g key={j}>
            <Line data={y.map((row, i) => ({ x: i + 1, y: row[j] }))} color={BLOCK_COLORS[j]} width={1.5} dashed />
            <Points data={y.map((row, i) => ({ x: i + 1, y: row[j] }))} color={BLOCK_COLORS[j]} r={5} opacity={0.9} />
          </g>
        ))}
      </Plot>
      <Legend items={BLOCK.map((_, j) => ({ color: BLOCK_COLORS[j], label: `ブロック ${j + 1}` }))} />
      <Controls>
        <Slider label="ブロックどうしの差の大きさ" value={c} min={0} max={2} step={0.1} onChange={setC} format={(v) => `${v.toFixed(1)}倍`} />
      </Controls>
      <SsBar
        rows={[
          {
            title: 'ブロックを要因に入れる（乱塊法の分析）',
            parts: [
              { label: '肥料', value: sa, color: 'c1' },
              { label: 'ブロック', value: sb, color: 'c3' },
              { label: '誤差', value: se, color: 'muted' },
            ],
          },
          {
            title: 'ブロックを無視する（1元配置として分析）',
            parts: [
              { label: '肥料', value: sa, color: 'c1' },
              { label: '誤差', value: se + sb, color: 'muted' },
            ],
          },
        ]}
      />
      <p className="figure-readout">ブロックを入れる：{verdict(fBlock, dfA, dfE)}</p>
      <p className="figure-readout">ブロックを無視：{verdict(fCrd, dfA, t * b - t)}</p>
      <p className="figure-readout small">
        どのブロックでも、肥料 A → B → C の順に収量が上がる形は同じ。ブロックを無視すると、ブロックどうしの差がそのまま誤差に入ってしまう。
      </p>
    </div>
  )
}
