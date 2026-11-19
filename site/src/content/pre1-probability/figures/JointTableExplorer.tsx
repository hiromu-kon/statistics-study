import { useState } from 'react'
import { Controls, DataTable } from '../../../components/blocks'
import { Bars, Legend, Plot } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Choice } from './parts'

// X: 朝食を食べるか（0: 食べない、1: 食べる）、Y: 1日に飲むコーヒーの杯数（0, 1, 2）の同時確率
const JOINT = [
  [0.1, 0.2, 0.1],
  [0.1, 0.3, 0.2],
]

const marginalX = JOINT.map((row) => row.reduce((a, b) => a + b, 0))
const marginalY = JOINT[0].map((_, j) => JOINT[0][j] + JOINT[1][j])

type View = 'marginal' | 0 | 1

/**
 * 同時確率の表から、周辺分布と条件つき分布を作る図。
 * X の値を1つ選ぶと、その行だけを取り出して行の合計で割ったもの（条件つき分布）を、周辺分布と並べて見せる。
 */
export function JointTableExplorer() {
  const [view, setView] = useState<View>(1)
  const fmt = (v: number) => String(round(v, 3))
  const cond = view === 'marginal' ? null : JOINT[view].map((p) => p / marginalX[view])
  return (
    <div>
      <DataTable
        head={['', 'Y = 0', 'Y = 1', 'Y = 2', 'X の周辺']}
        rows={[
          ['X = 0（食べない）', '0.10', '0.20', '0.10', <strong key="a">0.40</strong>],
          ['X = 1（食べる）', '0.10', '0.30', '0.20', <strong key="b">0.60</strong>],
          [<strong key="c">Y の周辺</strong>, <strong key="d">0.20</strong>, <strong key="e">0.50</strong>, <strong key="f">0.30</strong>, '1'],
        ]}
        highlight={view === 'marginal' ? [2] : [view]}
        caption="表の中は同時確率 P(X = x, Y = y)。行の合計が X の周辺確率、列の合計が Y の周辺確率"
      />
      <Controls>
        <Choice<View>
          options={[
            { value: 'marginal', label: 'Y の周辺分布だけ' },
            { value: 0, label: 'X = 0 のときの条件つき分布' },
            { value: 1, label: 'X = 1 のときの条件つき分布' },
          ]}
          value={view}
          onChange={setView}
        />
      </Controls>
      <Plot x={[-0.6, 2.6]} y={[0, 0.7]} height={230} xTicks={[0, 1, 2]} xLabel="コーヒーの杯数 y" yLabel="確率">
        <Bars data={marginalY.map((p, y) => ({ x: y - 0.18, y: p }))} width={0.32} color="muted" opacity={0.6} labels={fmt} />
        {cond && <Bars data={cond.map((p, y) => ({ x: y + 0.18, y: p }))} width={0.32} color="c1" labels={fmt} />}
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: 'Y の周辺分布 P(Y = y)' },
          ...(cond ? [{ color: 'c1' as const, label: `条件つき分布 P(Y = y | X = ${view})` }] : []),
        ]}
      />
      {cond && (
        <p className="figure-readout">
          行を取り出して行の合計 {marginalX[view as number].toFixed(2)} で割る → {cond.map(fmt).join('、')}（合計 1）
        </p>
      )}
    </div>
  )
}
