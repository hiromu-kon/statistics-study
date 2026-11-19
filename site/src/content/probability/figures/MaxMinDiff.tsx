import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Plot, colorVar } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'

const probDiff1 = (n: number) => (5 * (2 ** n - 2)) / 6 ** n

/**
 * 「サイコロを n 回投げて、最大値と最小値の差がちょうど1」の数え方。
 * 使う目を隣り合う2つ {k, k+1} にしぼり、2^n 通りから「片方しか出ない」2通りを引く。
 */
export function MaxMinDiff() {
  const [n, setN] = useState(3)
  const [k, setK] = useState(1)
  const per = 2 ** n - 2
  const total = 5 * per
  const all = 6 ** n
  return (
    <div>
      <svg className="plot" viewBox="0 0 400 74" role="img" aria-label="1から6の目のうち、隣り合う2つを選んだところ" style={{ maxWidth: 420, margin: '0 auto' }}>
        {[1, 2, 3, 4, 5, 6].map((f) => {
          const on = f === k || f === k + 1
          const x = 20 + (f - 1) * 62
          return (
            <g key={f}>
              <rect
                x={x}
                y={10}
                width={50}
                height={50}
                rx={9}
                fill={on ? colorVar('c2') : 'transparent'}
                fillOpacity={on ? 0.5 : 0}
                stroke={colorVar(on ? 'c2' : 'muted')}
                strokeWidth={on ? 3 : 1.5}
              />
              <text className="plot-annot" x={x + 25} y={41} textAnchor="middle" style={{ fontSize: 18 }}>
                {f}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="figure-readout">
        使ってよい目は <strong>{k}</strong> と <strong>{k + 1}</strong> だけ。{n} 回とも「{k}か{k + 1}」になる出方は 2<sup>{n}</sup> = {2 ** n} 通り。
        <br />
        そのうち「全部 {k}」「全部 {k + 1}」の2通りは差が0なので除いて、<strong>{per} 通り</strong>。
      </p>
      <p className="figure-readout">
        隣り合う2つの選び方は {'{1,2}'} 〜 {'{5,6}'} の5通り → 5 × {per} = <strong>{total}</strong> 通り。全体は 6<sup>{n}</sup> = {all} 通りなので、確率は{' '}
        <strong>
          {total}/{all} ≒ {round(probDiff1(n), 4)}
        </strong>
      </p>
      <Controls>
        <Slider label="投げる回数 n" value={n} min={2} max={8} step={1} onChange={setN} format={(v) => `${v}回`} />
        <Slider label="小さいほうの目 k" value={k} min={1} max={5} step={1} onChange={setK} format={(v) => `${v}と${v + 1}`} />
      </Controls>
      <Plot x={[1.4, 8.6]} y={[0, 0.34]} height={220} xTicks={[2, 3, 4, 5, 6, 7, 8]} yTicks={[0, 0.1, 0.2, 0.3]} xLabel="投げる回数 n" yLabel="確率">
        <Bars
          data={[2, 3, 4, 5, 6, 7, 8].map((m) => ({ x: m, y: probDiff1(m) }))}
          width={0.6}
          color="muted"
          highlight={(x) => x === n}
          highlightColor="c2"
          labels={(y) => String(round(y, 3))}
        />
      </Plot>
      <p className="figure-readout">回数が増えると、3種類以上の目が混ざりやすくなるので、差がちょうど1になる確率は小さくなっていく</p>
    </div>
  )
}
