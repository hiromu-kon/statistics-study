import { useState } from 'react'
import { Button, Controls, DataTable, Slider } from '../../../components/blocks'
import { Legend, Plot, colorVar, usePlot, type Color } from '../../../components/charts/Plot'
import { round, sum } from '../../../lib/stats'

const SEG_COLORS: Color[] = ['c1', 'c2', 'c3', 'c4', 'c5']

type Bar = { label: string; shares: number[]; emphasize?: boolean }

/** 横向きの帯グラフ（積み上げ100%棒）。shares は合計1の割合 */
function BandRows({ bars }: { bars: Bar[] }) {
  const s = usePlot()
  const h = 24
  return (
    <g>
      {bars.map((bar, i) => {
        const cy = s.y(bars.length - i - 0.5)
        let acc = 0
        return (
          <g key={bar.label}>
            <text x={s.left + 2} y={cy - h / 2 - 6} className="plot-annot" style={{ fill: colorVar(bar.emphasize ? 'muted' : 'ink') }}>
              {bar.label}
            </text>
            {bar.shares.map((p, j) => {
              const x0 = s.x(acc * 100)
              acc += p
              const x1 = s.x(acc * 100)
              return (
                <g key={j}>
                  <rect
                    x={x0}
                    y={cy - h / 2}
                    width={Math.max(0, x1 - x0)}
                    height={h}
                    fill={colorVar(SEG_COLORS[j])}
                    opacity={bar.emphasize ? 0.45 : 0.85}
                    stroke="var(--surface)"
                    strokeWidth={1.5}
                  />
                  {p >= 0.08 && (
                    <text x={(x0 + x1) / 2} y={cy + 5} textAnchor="middle" className="plot-annot" style={{ fill: 'var(--surface)' }}>
                      {`${round(p * 100, 1)}%`}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
    </g>
  )
}

/**
 * クロス集計表を、行パーセント・列パーセントの帯グラフで見る図。
 * 「関連の強さ」を0にすると、表を「関連がないときの度数（行の合計 × 列の合計 ÷ 総数）」に置きかえるので、
 * 帯の区切りが全部そろう様子が見える。
 */
export function CrossTableExplorer({
  rowLabels,
  colLabels,
  counts,
  rowTitle,
}: {
  rowLabels: string[]
  colLabels: string[]
  counts: number[][]
  rowTitle: string
}) {
  const [mode, setMode] = useState<'row' | 'col'>('row')
  const [t, setT] = useState(1)
  const total = sum(counts.flat())
  const rowSum0 = counts.map((r) => sum(r))
  const colSum0 = colLabels.map((_, j) => sum(counts.map((r) => r[j])))
  const cells = counts.map((r, i) => r.map((o, j) => {
    const e = (rowSum0[i] * colSum0[j]) / total
    return e + t * (o - e)
  }))
  const bars: Bar[] =
    mode === 'row'
      ? [
          ...rowLabels.map((label, i) => ({ label, shares: cells[i].map((c) => c / rowSum0[i]) })),
          { label: '全体', shares: colSum0.map((c) => c / total), emphasize: true },
        ]
      : [
          ...colLabels.map((label, j) => ({ label, shares: cells.map((r) => r[j] / colSum0[j]) })),
          { label: '全体', shares: rowSum0.map((c) => c / total), emphasize: true },
        ]
  const legendLabels = mode === 'row' ? colLabels : rowLabels
  const fmt = (v: number) => (t === 1 ? String(v) : String(round(v, 1)))
  return (
    <div>
      <Controls>
        <Button variant={mode === 'row' ? 'primary' : 'default'} onClick={() => setMode('row')}>
          行パーセント（横に割る）
        </Button>
        <Button variant={mode === 'col' ? 'primary' : 'default'} onClick={() => setMode('col')}>
          列パーセント（縦に割る）
        </Button>
      </Controls>
      <Plot
        x={[0, 100]}
        y={[0, bars.length]}
        height={bars.length * 54 + 36}
        hideY
        grid={false}
        xTicks={[0, 20, 40, 60, 80, 100]}
        xTickFormat={(v) => `${v}%`}
      >
        <BandRows bars={bars} />
      </Plot>
      <Legend items={legendLabels.map((label, j) => ({ color: SEG_COLORS[j], label }))} />
      <DataTable
        head={[rowTitle, ...colLabels, '合計']}
        rows={[
          ...rowLabels.map((label, i) => [label, ...cells[i].map(fmt), String(rowSum0[i])]),
          [<strong key="t">合計</strong>, ...colSum0.map(String), String(total)],
        ]}
        caption={t === 1 ? '実際の度数' : '関連を弱めた度数（行と列の合計は変えていない）'}
      />
      <Controls>
        <Slider label="関連の強さ" value={t} min={0} max={1} step={0.05} onChange={setT} format={(v) => (v === 0 ? '0（関連なし）' : v === 1 ? '1（実際の表）' : v.toFixed(2))} />
      </Controls>
    </div>
  )
}
