import { useState } from 'react'
import { DataTable } from '../../../components/blocks'
import { colorVar } from '../../../components/charts/Plot'
import { Choice, DText, Diagram } from '../../collection/figures/svg'

// 3つの要因 A・B・C（各2水準、−1 と +1）の 2^3 = 8 通りを立方体の頂点に置く。
type Mode = 'full' | 'plus' | 'minus'

const RUNS = [-1, 1].flatMap((c) => [-1, 1].flatMap((b) => [-1, 1].map((a) => ({ a, b, c }))))
const inFraction = (r: { a: number; b: number; c: number }, mode: Mode) => mode === 'full' || r.a * r.b * r.c === (mode === 'plus' ? 1 : -1)
const sign = (v: number) => (v > 0 ? '+' : '−')
const name = (r: { a: number; b: number; c: number }) => (r.a > 0 ? 'a' : '') + (r.b > 0 ? 'b' : '') + (r.c > 0 ? 'c' : '') || '(1)'

// 立方体を斜めから見た図のピクセル座標
const pos = (r: { a: number; b: number; c: number }) => ({
  x: 150 + r.a * 80 + r.c * 45,
  y: 145 - r.b * 80 - r.c * 35,
})

const NOTES: Record<Mode, string> = {
  full: '8通りすべてを行う（完全実施）。A・B・C の主効果も、すべての交互作用も別々に推定できる',
  plus: 'ABC = + の4通りだけを行う（I = ABC の 1/2 実施）。どの2つの頂点も辺でつながっていない「互い違い」の4点',
  minus: 'ABC = − の残り4通りを行う（I = −ABC の 1/2 実施）。こちらを選んでもよい',
}

/** 2^3 の完全実施と 1/2 実施。選ばれた4回の実験では、A の列と BC の列が同じになることを表で確かめる */
export function HalfFraction() {
  const [mode, setMode] = useState<Mode>('plus')
  const edges: [number, number][] = []
  RUNS.forEach((r, i) =>
    RUNS.forEach((s, j) => {
      if (j > i && Math.abs(r.a - s.a) + Math.abs(r.b - s.b) + Math.abs(r.c - s.c) === 2) edges.push([i, j])
    }),
  )
  const chosen = RUNS.filter((r) => inFraction(r, mode))
  return (
    <div>
      <Choice
        options={[
          { value: 'full' as Mode, label: '完全実施（8回）' },
          { value: 'plus' as Mode, label: '1/2 実施（I = ABC）' },
          { value: 'minus' as Mode, label: '1/2 実施（I = −ABC）' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <Diagram width={420} height={300} ariaLabel="2の3乗の実験を立方体の頂点で表した図">
        {edges.map(([i, j]) => {
          const p = pos(RUNS[i])
          const q = pos(RUNS[j])
          return <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={colorVar('muted')} strokeWidth={1.5} />
        })}
        {RUNS.map((r) => {
          const p = pos(r)
          const on = inFraction(r, mode)
          return (
            <g key={name(r)}>
              <circle cx={p.x} cy={p.y} r={on ? 13 : 7} fill={colorVar(on ? 'c1' : 'muted')} opacity={on ? 0.9 : 0.5} />
              <DText x={p.x + 20} y={p.y - 12} anchor="start" size={12} color={on ? 'ink' : 'muted'}>
                {name(r)}
              </DText>
            </g>
          )
        })}
        <DText x={150} y={288} size={12} color="muted">
          右へ：A が +　上へ：B が +　奥へ：C が +
        </DText>
      </Diagram>
      <p className="figure-readout">{NOTES[mode]}</p>
      <DataTable
        caption="選んだ実験の符号。色の付いた2列（A と BC）が、どの行でも同じになっているか見てみよう"
        head={['実験', 'A', 'B', 'C', 'AB', 'AC', <span key="bc" className="mark mark-c2">BC</span>, 'ABC']}
        rows={chosen.map((r) => [
          name(r),
          <span key="a" className="mark mark-c2">{sign(r.a)}</span>,
          sign(r.b),
          sign(r.c),
          sign(r.a * r.b),
          sign(r.a * r.c),
          <span key="bc" className="mark mark-c2">{sign(r.b * r.c)}</span>,
          sign(r.a * r.b * r.c),
        ])}
      />
      <p className="figure-readout small">
        {mode === 'full'
          ? '完全実施では A と BC の列は違う並びになり、別々に推定できる。'
          : mode === 'plus'
            ? '4行とも A ＝ BC（同様に B ＝ AC、C ＝ AB）。A の効果を計算すると、BC の交互作用と区別できない（A と BC は別名）。'
            : '4行とも A ＝ −BC。符号が逆なだけで、やはり A と BC は区別できない。'}
      </p>
    </div>
  )
}
