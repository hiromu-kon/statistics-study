import { useState } from 'react'
import { Legend, colorVar } from '../../../components/charts/Plot'
import { Tabs } from './Tabs'

type View = 'all' | 'B' | 'A'

const COLS = 10
const ROWS = 10
const B_COLS = 4 // 左の4列（40人）が B
const R = 9
const GAP = 26
const LEFT = 20
const TOP = 30

// A の人を各ブロックの上から順に並べる。B の中に10人、B の外に20人。
function isA(col: number, row: number): boolean {
  if (col < B_COLS) return row * B_COLS + col < 10
  return row * (COLS - B_COLS) + (col - B_COLS) < 20
}

/**
 * 100人を点で並べた図。条件付き確率は「見る範囲をしぼる」ことだと見せる。
 * A：眼鏡をかけている（30人）、B：電車で通勤している（40人）、A∩B：10人。
 */
export function PeopleGrid() {
  const [view, setView] = useState<View>('all')
  const inView = (col: number, row: number) => (view === 'all' ? true : view === 'B' ? col < B_COLS : isA(col, row))
  const bx = LEFT - GAP / 2 + 4
  const bw = B_COLS * GAP - 8
  const readout: Record<View, string> = {
    all: '全体100人のうち、A かつ B（オレンジで、青い枠の中）は10人 → P(A∩B) = 10/100',
    B: 'B の40人だけが「新しい全体」。その中の A は10人 → P(A|B) = 10/40 = 1/4',
    A: 'A の30人だけが「新しい全体」。その中の B は10人 → P(B|A) = 10/30 = 1/3',
  }
  return (
    <div>
      <Tabs
        value={view}
        onChange={setView}
        options={[
          { id: 'all', label: '全体100人を見る' },
          { id: 'B', label: 'B の中だけを見る' },
          { id: 'A', label: 'A の中だけを見る' },
        ]}
      />
      <svg className="plot" viewBox={`0 0 ${LEFT + COLS * GAP} ${TOP + ROWS * GAP}`} role="img" aria-label="100人を点で並べた図" style={{ maxWidth: 420, margin: '0 auto' }}>
        <rect
          x={bx}
          y={TOP - GAP / 2 - 2}
          width={bw}
          height={ROWS * GAP}
          rx={8}
          fill={colorVar('c1')}
          fillOpacity={view === 'A' ? 0.05 : 0.12}
          stroke={colorVar('c1')}
          strokeWidth={view === 'B' ? 3 : 1.5}
        />
        <text className="plot-annot" x={bx + bw / 2} y={TOP - GAP / 2 - 8} textAnchor="middle" style={{ fill: colorVar('c1') }}>
          B：電車通勤 40人
        </text>
        <text className="plot-annot" x={LEFT + (B_COLS + 3) * GAP} y={TOP - GAP / 2 - 8} textAnchor="middle" style={{ fill: colorVar('muted') }}>
          B でない 60人
        </text>
        {Array.from({ length: COLS }, (_, col) =>
          Array.from({ length: ROWS }, (_, row) => {
            const a = isA(col, row)
            const on = inView(col, row)
            return (
              <circle
                key={`${col}-${row}`}
                cx={LEFT + col * GAP}
                cy={TOP + row * GAP}
                r={R}
                fill={a ? colorVar('c2') : 'transparent'}
                stroke={colorVar(a ? 'c2' : 'muted')}
                strokeWidth={2}
                opacity={on ? 1 : 0.12}
              />
            )
          }),
        )}
      </svg>
      <Legend
        items={[
          { color: 'c2', label: 'A：眼鏡をかけている（30人）' },
          { color: 'c1', label: 'B：電車通勤（40人）' },
        ]}
      />
      <p className="figure-readout">{readout[view]}</p>
    </div>
  )
}
