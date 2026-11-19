import { useState } from 'react'
import { Controls, DataTable, Slider } from '../../../components/blocks'
import { Bars, HLine, Legend, Plot } from '../../../components/charts/Plot'
import { chi2Quantile, round } from '../../../lib/stats'
import { Verdict } from './parts'

/** 観測度数（青）と期待度数（灰）を並べた棒グラフ */
export function ObsExpBars({ labels, observed, expected, yMax }: { labels: string[]; observed: number[]; expected: number[]; yMax?: number }) {
  const top = yMax ?? Math.ceil((Math.max(...observed, ...expected) * 1.2) / 5) * 5
  const xs = labels.map((_, i) => i + 1)
  return (
    <div>
      <Plot
        x={[0.4, labels.length + 0.6]}
        y={[0, top]}
        xTicks={xs}
        xTickFormat={(v) => labels[v - 1] ?? ''}
        yLabel="度数"
      >
        <Bars data={xs.map((x, i) => ({ x: x - 0.19, y: observed[i] }))} width={0.36} color="c1" labels={(y) => String(y)} />
        <Bars data={xs.map((x, i) => ({ x: x + 0.19, y: expected[i] }))} width={0.36} color="muted" opacity={0.6} labels={(y) => String(round(y, 2))} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '観測度数 O（実際の数）' },
          { color: 'muted', label: '期待度数 E（H0 が正しいときに期待される数）' },
        ]}
      />
    </div>
  )
}

const chi2Of = (o: number[], e: number[]) => o.reduce((a, oi, i) => a + (oi - e[i]) ** 2 / e[i], 0)

/** サイコロのかたよりを強くしていくと χ² が大きくなり、いつか棄却域に入る */
export function GofSlider() {
  const [k, setK] = useState(2)
  const bias = [-2, -1, 0, 0, 1, 2]
  const expected = bias.map(() => 20)
  const observed = bias.map((b) => 20 + k * b)
  const chi2 = chi2Of(observed, expected)
  const crit = chi2Quantile(0.95, 5)
  return (
    <div>
      <ObsExpBars labels={['1', '2', '3', '4', '5', '6']} observed={observed} expected={expected} yMax={40} />
      <p className="figure-readout">
        χ² = Σ(O − E)²/E = <strong>{round(chi2, 2)}</strong>　（自由度 5 の上側 5% 点 {round(crit, 3)}）→ <Verdict reject={chi2 > crit} />
      </p>
      <Controls>
        <Slider label="かたよりの強さ" value={k} min={0} max={6} step={1} onChange={setK} />
      </Controls>
    </div>
  )
}

/**
 * 2×2 のクロス表で、行・列の合計を固定したまま左上のマスだけ動かす。
 * 左上が 40（期待度数）のとき完全に独立で χ² = 0。
 */
export function IndependenceDemo() {
  const [a, setA] = useState(30)
  const rows = [100, 50]
  const cols = [60, 90]
  const total = 150
  const obs = [
    [a, 100 - a],
    [60 - a, a - 10],
  ]
  const exp = rows.map((r) => cols.map((c) => (r * c) / total))
  const chi2 = obs.reduce((s, row, i) => s + row.reduce((t, o, j) => t + (o - exp[i][j]) ** 2 / exp[i][j], 0), 0)
  const crit = chi2Quantile(0.95, 1)
  const share = [obs[0][0] / rows[0], obs[1][0] / rows[1]]
  const cell = (o: number, e: number) => (
    <span>
      <strong>{o}</strong> <span className="muted">（{round(e, 1)}）</span>
    </span>
  )
  return (
    <div>
      <DataTable
        head={['', '眠い', '眠くない', '合計']}
        rows={[
          ['朝食を食べる', cell(obs[0][0], exp[0][0]), cell(obs[0][1], exp[0][1]), '100'],
          ['朝食を食べない', cell(obs[1][0], exp[1][0]), cell(obs[1][1], exp[1][1]), '50'],
          ['合計', '60', '90', '150'],
        ]}
        caption="太字が観測度数、かっこ内が期待度数（行合計 × 列合計 ÷ 総数）"
      />
      <Plot x={[0.3, 2.7]} y={[0, 1]} height={220} xTicks={[1, 2]} xTickFormat={(v) => (v === 1 ? '朝食を食べる' : '朝食を食べない')} yLabel="眠い人の割合" yTicks={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
        <Bars data={[{ x: 1, y: share[0] }, { x: 2, y: share[1] }]} width={0.5} color="c1" labels={(y) => `${round(y * 100, 1)}%`} />
        <HLine y={0.4} color="c2" label="全体 40%" />
      </Plot>
      <p className="figure-readout">
        χ² = <strong>{round(chi2, 3)}</strong>　（自由度 1 の上側 5% 点 {round(crit, 3)}）→ <Verdict reject={chi2 > crit} />
      </p>
      <Controls>
        <Slider label="「食べる・眠い」の人数" value={a} min={10} max={60} step={1} onChange={setA} format={(v) => `${v}人`} />
      </Controls>
    </div>
  )
}
