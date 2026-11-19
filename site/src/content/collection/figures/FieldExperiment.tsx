import { useMemo, useState } from 'react'
import { Button, Controls, DataTable } from '../../../components/blocks'
import { colorVar } from '../../../components/charts/Plot'
import { createRng, mean, randomNormal, round, sd } from '../../../lib/stats'
import { Choice, DText, Diagram } from './svg'
import { shuffle } from './shuffle'

// 畑を 4列 × 4行 の16区画に分け、肥料A（新しい）と肥料B（今までの）を比べる架空の実験。
// 左の列ほど土が肥えている（収量が多い）。本当の肥料の効果は A − B = +2。

const ROWS = 4
const COLS = 4
const FERTILITY = [6, 2, -2, -6]
const EFFECT = 2
const NOISE = 1.5

type Layout = 'single' | 'replicate' | 'random' | 'block'
type Plan = ('A' | 'B' | null)[] // 区画 i = row * COLS + col

const LAYOUTS: { value: Layout; label: string; note: string }[] = [
  {
    value: 'single',
    label: '① 1区画ずつ',
    note: 'A・B を1区画ずつ。差が肥料のせいか、たまたまのぶれか判断できない。しかも A は肥えた土に置かれている',
  },
  {
    value: 'replicate',
    label: '② 反復だけ',
    note: '8区画ずつに増やした（反復）。ぶれは小さくなったが、A がすべて肥えた側にあるので、土のちがいが肥料の効果にまざる',
  },
  {
    value: 'random',
    label: '③ 反復＋無作為化',
    note: 'どの区画を A にするかをくじで決めた（無作為化）。平均すると正しい差になるが、くじの結果しだいで A が肥えた側にかたよることもある',
  },
  {
    value: 'block',
    label: '④ ＋局所管理',
    note: '土の質が同じ縦の列を1つのブロックとし、各ブロックの中で A・B を2区画ずつくじで決めた（局所管理）。土のちがいが打ち消され、ぶれも小さい',
  },
]

function makePlan(layout: Layout, rng: () => number): Plan {
  const plan: Plan = Array.from({ length: ROWS * COLS }, () => null)
  if (layout === 'single') {
    plan[0] = 'A'
    plan[COLS - 1] = 'B'
  } else if (layout === 'replicate') {
    for (let i = 0; i < ROWS * COLS; i++) plan[i] = i % COLS < COLS / 2 ? 'A' : 'B'
  } else if (layout === 'random') {
    const order = shuffle(
      Array.from({ length: ROWS * COLS }, (_, i) => i),
      rng,
    )
    order.forEach((i, k) => (plan[i] = k < (ROWS * COLS) / 2 ? 'A' : 'B'))
  } else {
    for (let c = 0; c < COLS; c++) {
      const rows = shuffle(
        Array.from({ length: ROWS }, (_, r) => r),
        rng,
      )
      rows.forEach((r, k) => (plan[r * COLS + c] = k < ROWS / 2 ? 'A' : 'B'))
    }
  }
  return plan
}

function yields(rng: () => number): number[] {
  return Array.from({ length: ROWS * COLS }, (_, i) => 50 + FERTILITY[i % COLS] + randomNormal(rng, 0, NOISE))
}

function estimate(plan: Plan, y: number[]): number {
  const a = plan.flatMap((p, i) => (p === 'A' ? [y[i] + EFFECT] : []))
  const b = plan.flatMap((p, i) => (p === 'B' ? [y[i]] : []))
  return mean(a) - mean(b)
}

/** 実験を何度もやり直したときの、推定値（A − B）の平均とばらつき */
function simulate(layout: Layout, runs = 2000) {
  const rng = createRng(4242 + layout.length)
  const est = Array.from({ length: runs }, () => estimate(makePlan(layout, rng), yields(rng)))
  return { mean: mean(est), sd: sd(est) }
}

export function FieldExperiment() {
  const [layout, setLayout] = useState<Layout>('single')
  const [seed, setSeed] = useState(1)
  const { plan, y } = useMemo(() => {
    const rng = createRng(seed * 13 + layout.length)
    return { plan: makePlan(layout, rng), y: yields(rng) }
  }, [layout, seed])
  const sims = useMemo(() => LAYOUTS.map((l) => ({ ...l, ...simulate(l.value) })), [])
  const est = estimate(plan, y)
  const x0 = 40
  const w = 120
  const h = 62
  const y0 = 36
  const note = LAYOUTS.find((l) => l.value === layout)?.note
  return (
    <div>
      <Choice options={LAYOUTS.map(({ value, label }) => ({ value, label }))} value={layout} onChange={setLayout} />
      <Diagram width={560} height={y0 + ROWS * h + 34} ariaLabel="畑の区画と肥料の割り当て">
        <DText x={x0 + 4} y={16} anchor="start" color="c3">
          ← 肥えた土
        </DText>
        <DText x={x0 + COLS * w - 4} y={16} anchor="end" color="muted">
          やせた土 →
        </DText>
        {plan.map((p, i) => {
          const c = i % COLS
          const r = Math.floor(i / COLS)
          return (
            <g key={i}>
              <rect x={x0 + c * w + 3} y={y0 + r * h + 3} width={w - 6} height={h - 6} rx={8} fill={colorVar('c3')} opacity={[0.42, 0.28, 0.16, 0.06][c]} />
              <rect
                x={x0 + c * w + 3}
                y={y0 + r * h + 3}
                width={w - 6}
                height={h - 6}
                rx={8}
                fill="none"
                stroke={p === null ? 'var(--line)' : colorVar(p === 'A' ? 'c1' : 'c2')}
                strokeWidth={p === null ? 1 : 3}
              />
              {p && (
                <DText x={x0 + c * w + w / 2} y={y0 + r * h + h / 2 - 8} color={p === 'A' ? 'c1' : 'c2'} size={18} weight={700}>
                  {p}
                </DText>
              )}
              {p && (
                <DText x={x0 + c * w + w / 2} y={y0 + r * h + h / 2 + 14} color="muted" size={11} weight={500}>
                  {`収量 ${round(y[i] + (p === 'A' ? EFFECT : 0), 1)}`}
                </DText>
              )}
            </g>
          )
        })}
        {layout === 'block' &&
          Array.from({ length: COLS }, (_, c) => (
            <g key={c}>
              <rect x={x0 + c * w} y={y0} width={w} height={ROWS * h} rx={10} fill="none" stroke="var(--ink)" strokeWidth={2} strokeDasharray="6 4" />
              <DText x={x0 + c * w + w / 2} y={y0 + ROWS * h + 16} color="ink" size={12}>
                {`ブロック${c + 1}`}
              </DText>
            </g>
          ))}
      </Diagram>
      <p className="figure-readout">
        今回の推定値：A の平均 − B の平均 = <strong>{round(est, 2)}</strong>（本当の効果は <strong>+{EFFECT}</strong>）
      </p>
      <p className="figure-readout small muted">{note}</p>
      <Controls>
        <Button onClick={() => setSeed((s) => s + 1)}>もう一度実験する</Button>
      </Controls>
      <DataTable
        head={['配置', '推定値の平均', '推定値のばらつき（標準偏差）']}
        rows={sims.map((s) => [s.label, round(s.mean, 2), round(s.sd, 2)])}
        highlight={[sims.findIndex((s) => s.value === layout)]}
        caption={`同じ配置の実験を2000回やり直したとき（本当の効果は +${EFFECT}）`}
      />
    </div>
  )
}
