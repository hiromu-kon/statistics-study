import { useState } from 'react'
import { Controls } from '../../../components/blocks'
import { colorVar } from '../../../components/charts/Plot'
import { Choice } from './parts'

// コインを2回投げたときの4通り。A: 1回目が表、B: 2回目が表、C: 2回とも同じ面
const OUTCOMES = [
  { label: '表・表', a: true, b: true, c: true },
  { label: '表・裏', a: true, b: false, c: false },
  { label: '裏・表', a: false, b: true, c: false },
  { label: '裏・裏', a: false, b: false, c: true },
]

type Pick = 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BC' | 'ABC'

const NEEDS: Record<Pick, ('a' | 'b' | 'c')[]> = {
  A: ['a'],
  B: ['b'],
  C: ['c'],
  AB: ['a', 'b'],
  AC: ['a', 'c'],
  BC: ['b', 'c'],
  ABC: ['a', 'b', 'c'],
}

const LABEL: Record<Pick, string> = {
  A: 'A',
  B: 'B',
  C: 'C',
  AB: 'A かつ B',
  AC: 'A かつ C',
  BC: 'B かつ C',
  ABC: 'A かつ B かつ C',
}

/**
 * 「対ごとに独立でも、3つ同時に独立とは限らない」をコイン2回の4通りで確かめる図。
 * どの2つの組も「同時に起きる確率 = 確率の積」を満たすが、3つ全部では満たさない。
 */
export function CoinIndependence() {
  const [pick, setPick] = useState<Pick>('AB')
  const needs = NEEDS[pick]
  const hit = OUTCOMES.map((o) => needs.every((k) => o[k]))
  const count = hit.filter(Boolean).length
  const product = 0.5 ** needs.length
  const ok = Math.abs(count / 4 - product) < 1e-9
  const ink = colorVar('ink')
  return (
    <div>
      <Controls>
        <Choice<Pick>
          options={(Object.keys(NEEDS) as Pick[]).map((p) => ({ value: p, label: LABEL[p] }))}
          value={pick}
          onChange={setPick}
        />
      </Controls>
      <svg className="plot" viewBox="0 0 480 120" role="img" aria-label="コインを2回投げた4通りのうち、選んだ事象に当てはまるものを塗った図">
        {OUTCOMES.map((o, i) => (
          <g key={o.label}>
            <rect
              x={12 + i * 116}
              y={12}
              width={104}
              height={96}
              rx={8}
              fill={colorVar(hit[i] ? 'c1' : 'muted')}
              fillOpacity={hit[i] ? 0.35 : 0.08}
              stroke={ink}
              strokeWidth={1.5}
            />
            <text className="plot-annot" x={64 + i * 116} y={50} textAnchor="middle">
              {o.label}
            </text>
            <text className="plot-tick" x={64 + i * 116} y={78} textAnchor="middle">
              {[o.a && 'A', o.b && 'B', o.c && 'C'].filter(Boolean).join('・') || '（どれでもない）'}
            </text>
          </g>
        ))}
      </svg>
      <p className="figure-readout">
        P({LABEL[pick]}) = {count}/4　／　確率の積 = {needs.map(() => '1/2').join(' × ')} = 1/{2 ** needs.length}　→{' '}
        <strong style={{ color: colorVar(ok ? 'c3' : 'c5') }}>{ok ? '等しい' : '等しくない'}</strong>
      </p>
    </div>
  )
}
