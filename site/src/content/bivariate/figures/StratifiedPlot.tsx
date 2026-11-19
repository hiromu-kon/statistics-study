import { useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { Legend, Plot, Points, Segment, type Color } from '../../../components/charts/Plot'
import { correlation, linearRegression, round } from '../../../lib/stats'
import { extent } from './data'

const GROUP_COLORS: Color[] = ['c1', 'c2', 'c3', 'c4']

type Group = { label: string; xs: number[]; ys: number[] }

/** 直線を、そのデータの x の範囲だけに引く */
function FitSegment({ xs, ys, color }: { xs: number[]; ys: number[]; color: Color }) {
  const { a, b } = linearRegression(xs, ys)
  const lo = Math.min(...xs)
  const hi = Math.max(...xs)
  return <Segment x1={lo} y1={a + b * lo} x2={hi} y2={a + b * hi} color={color} width={3} />
}

/**
 * 層別の図。「全体で見る」と1色の散布図と全体の直線、「グループごとに見る」と色分けとグループごとの直線になる。
 * 全体の相関とグループ内の相関が食い違う様子を見せる。
 */
export function StratifiedPlot({ groups, xLabel, yLabel }: { groups: Group[]; xLabel: string; yLabel: string }) {
  const [split, setSplit] = useState(false)
  const allX = groups.flatMap((g) => g.xs)
  const allY = groups.flatMap((g) => g.ys)
  return (
    <div>
      <Controls>
        <Button variant={split ? 'default' : 'primary'} onClick={() => setSplit(false)}>
          全体で見る
        </Button>
        <Button variant={split ? 'primary' : 'default'} onClick={() => setSplit(true)}>
          グループごとに見る（層別）
        </Button>
      </Controls>
      <Plot x={extent(allX)} y={extent(allY)} height={340} xLabel={xLabel} yLabel={yLabel}>
        {split ? (
          groups.map((g, i) => <FitSegment key={g.label} xs={g.xs} ys={g.ys} color={GROUP_COLORS[i]} />)
        ) : (
          <FitSegment xs={allX} ys={allY} color="ink" />
        )}
        {groups.map((g, i) => (
          <Points key={g.label} data={g.xs.map((x, j) => ({ x, y: g.ys[j] }))} color={split ? GROUP_COLORS[i] : 'muted'} r={5} opacity={0.85} />
        ))}
      </Plot>
      {split && <Legend items={groups.map((g, i) => ({ color: GROUP_COLORS[i], label: g.label }))} />}
      <p className="figure-readout">
        {split ? (
          groups.map((g, i) => (
            <span key={g.label} style={{ marginRight: 12 }}>
              {g.label}の r = <strong style={{ color: `var(--${GROUP_COLORS[i]})` }}>{round(correlation(g.xs, g.ys), 2)}</strong>
            </span>
          ))
        ) : (
          <>
            全体（{allX.length}人）の r = <strong>{round(correlation(allX, allY), 2)}</strong>
          </>
        )}
      </p>
    </div>
  )
}
