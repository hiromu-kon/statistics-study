import { useState } from 'react'
import { Controls, DataTable, Slider } from '../../../components/blocks'
import { Legend, Plot, Points, type Color } from '../../../components/charts/Plot'
import { fCdf, fQuantile, round } from '../../../lib/stats'
import { Line, Txt } from '../../collection/figures/svg'

// レッスン本文の例（肥料 A1〜A3 × 水やり B1・B2、各組合せ2鉢）を、平均 16 ＋ 主効果 ＋ γ ×（交互作用の形）＋ 個体差 ±1 として作る。
// γ = 1 のとき本文のデータになる。交互作用の形は行・列の合計が 0 なので、γ を変えても主効果の平方和は変わらない。
const GRAND = 16
const ALPHA = [-3, 2, 1]
const BETA = [-3, 3]
const PATTERN = [
  [1, -1],
  [-2, 2],
  [1, -1],
]
const DEV = [-1, 1]
const COLORS: Color[] = ['c1', 'c2', 'c3']
const A_NAMES = ['A1', 'A2', 'A3']

function twoWayData(gamma: number): number[][][] {
  return ALPHA.map((a, i) => BETA.map((b, j) => DEV.map((d) => GRAND + a + b + gamma * PATTERN[i][j] + d)))
}

/** 繰り返しのある2元配置の平方和。y[i][j][k] は A の i 番目・B の j 番目の k 回目 */
function twoWayAnova(y: number[][][]) {
  const a = y.length
  const b = y[0].length
  const r = y[0][0].length
  const cell = y.map((row) => row.map((c) => c.reduce((s, v) => s + v, 0) / r))
  const grand = cell.flat().reduce((s, v) => s + v, 0) / (a * b)
  const am = cell.map((row) => row.reduce((s, v) => s + v, 0) / b)
  const bm = cell[0].map((_, j) => cell.reduce((s, row) => s + row[j], 0) / a)
  const sa = b * r * am.reduce((s, v) => s + (v - grand) ** 2, 0)
  const sb = a * r * bm.reduce((s, v) => s + (v - grand) ** 2, 0)
  let sab = 0
  let se = 0
  for (let i = 0; i < a; i++)
    for (let j = 0; j < b; j++) {
      sab += r * (cell[i][j] - am[i] - bm[j] + grand) ** 2
      for (const v of y[i][j]) se += (v - cell[i][j]) ** 2
    }
  const df = { a: a - 1, b: b - 1, ab: (a - 1) * (b - 1), e: a * b * (r - 1) }
  return { cell, grand, sa, sb, sab, se, df }
}

/** 交互作用プロット。γ（交互作用の大きさ）を動かすと、線の平行さと交互作用の F 比が変わる */
export function InteractionPlot() {
  const [gamma, setGamma] = useState(1)
  const y = twoWayData(gamma)
  const { cell, sa, sb, sab, se, df } = twoWayAnova(y)
  const mse = se / df.e
  const fRow = (name: string, s: number, d: number) => {
    const F = s / d / mse
    const crit = fQuantile(0.95, d, df.e)
    return [name, round(s, 2), d, round(s / d, 2), round(F, 2), round(1 - fCdf(F, d, df.e), 4), F >= crit ? '5% で有意' : '有意でない']
  }
  return (
    <div>
      <Plot x={[-0.35, 1.35]} y={[0, 32]} xTicks={[0, 1]} xTickFormat={(v) => (v === 0 ? 'B1（水 少なめ）' : 'B2（水 多め）')} yLabel="草丈（cm）" height={300}>
        {cell.map((row, i) => (
          <g key={i}>
            <Line data={row.map((m, j) => ({ x: j, y: m }))} color={COLORS[i]} width={3} />
            <Points data={y[i].flatMap((c, j) => c.map((v) => ({ x: j + (i - 1) * 0.06, y: v })))} color={COLORS[i]} r={4} opacity={0.55} />
            <Txt x={1.06} y={row[1]} anchor="start" color={COLORS[i]} dy={4}>
              {A_NAMES[i]}
            </Txt>
          </g>
        ))}
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '肥料 A1 の平均' },
          { color: 'c2', label: '肥料 A2 の平均' },
          { color: 'c3', label: '肥料 A3 の平均' },
        ]}
      />
      <Controls>
        <Slider label="交互作用の大きさ γ" value={gamma} min={-1.5} max={3} step={0.25} onChange={setGamma} format={(v) => v.toFixed(2)} />
      </Controls>
      <p className="figure-readout">
        {gamma === 0
          ? '3本の線が平行：水を増やしたときの伸びは、どの肥料でも同じ（交互作用なし）'
          : '線が平行でない：水を増やしたときの伸びが肥料によって違う（交互作用あり）'}
      </p>
      <DataTable
        caption={`分散分析表（γ = ${gamma.toFixed(2)}。誤差の自由度 ${df.e}、F0.05(2, 6) = 5.14、F0.05(1, 6) = 5.99）`}
        head={['要因', '平方和', '自由度', '平均平方', 'F 比', 'p 値', '判定']}
        rows={[
          fRow('A（肥料）', sa, df.a),
          fRow('B（水やり）', sb, df.b),
          fRow('A×B（交互作用）', sab, df.ab),
          ['誤差', round(se, 2), df.e, round(mse, 2), '', '', ''],
          ['全体', round(sa + sb + sab + se, 2), df.a + df.b + df.ab + df.e, '', '', '', ''],
        ]}
        highlight={[2]}
      />
      <p className="figure-readout small">γ を動かしても A と B の平方和は変わらず、変わるのは交互作用の平方和だけ。</p>
    </div>
  )
}
