import { useState } from 'react'
import { Controls } from '../../../components/blocks'
import { colorVar, type Color } from '../../../components/charts/Plot'
import { Choice } from './parts'

// 100人のアンケート（英語・数学・統計を「好き」と答えた人）を、重なりのない7つの部分に分けた人数。
// 英語 50、数学 40、統計 30、英数 20、英統 15、数統 10、3つとも 5 になるように決めている。
type Region = 'e' | 'm' | 's' | 'em' | 'es' | 'ms' | 'ems'

const REGIONS: { id: Region; people: number; x: number; y: number; sets: number }[] = [
  { id: 'e', people: 20, x: 98, y: 82, sets: 1 },
  { id: 'm', people: 15, x: 222, y: 82, sets: 1 },
  { id: 's', people: 10, x: 160, y: 186, sets: 1 },
  { id: 'em', people: 15, x: 160, y: 66, sets: 2 },
  { id: 'es', people: 10, x: 120, y: 140, sets: 2 },
  { id: 'ms', people: 5, x: 200, y: 140, sets: 2 },
  { id: 'ems', people: 5, x: 160, y: 116, sets: 3 },
]

type Step = 0 | 1 | 2 | 3

/** 各ステップまでで、その部分の人を何回数えたか */
function timesCounted(sets: number, step: Step): number {
  if (step === 0) return 1
  const add1 = sets // 1つずつ足すと、入っている円の数だけ数える
  const sub2 = (sets * (sets - 1)) / 2 // 2つの重なりは、入っている円から2つ選ぶ組の数だけ引く
  const add3 = sets === 3 ? 1 : 0
  if (step === 1) return add1
  if (step === 2) return add1 - sub2
  return add1 - sub2 + add3
}

const TOTALS: Record<Step, string> = {
  0: '7つの部分の人数を足すと 80 人（どれか1つ以上が好きな人）',
  1: '① 英語 + 数学 + 統計 = 50 + 40 + 30 = 120　（重なりを2回・3回数えている）',
  2: '② 120 − (20 + 15 + 10) = 75　（今度は真ん中を0回にしてしまった）',
  3: '③ 75 + 5 = 80　（すべての部分がちょうど1回ずつ）',
}

const colorOf = (k: number): Color => (k === 1 ? 'c1' : k === 0 ? 'c5' : 'c2')

/**
 * 3つの事象の包除原理を、ベン図の各部分を「何回数えたか」で見せる図。
 * ステップを進めると、足す → 引く → 足す でどの部分もちょうど1回になることがわかる。
 */
export function ThreeSetVenn() {
  const [step, setStep] = useState<Step>(0)
  const ink = colorVar('ink')
  const circles = [
    { cx: 130, cy: 100, label: '英語', lx: 70, ly: 40 },
    { cx: 190, cy: 100, label: '数学', lx: 250, ly: 40 },
    { cx: 160, cy: 150, label: '統計', lx: 160, ly: 232 },
  ]
  return (
    <div>
      <Controls>
        <Choice<Step>
          options={[
            { value: 0, label: '人数' },
            { value: 1, label: '① 1つずつ足す' },
            { value: 2, label: '② 2つの重なりを引く' },
            { value: 3, label: '③ 3つの重なりを足す' },
          ]}
          value={step}
          onChange={setStep}
        />
      </Controls>
      <svg className="plot" viewBox="0 0 320 246" role="img" aria-label="英語・数学・統計の3つの円のベン図。各部分に人数または数えた回数を書いている">
        <rect x={4} y={4} width={312} height={238} rx={8} fill="none" stroke={ink} strokeWidth={1.5} />
        <text className="plot-tick" x={12} y={22}>
          全体 100 人（どれも好きでない 20 人）
        </text>
        {circles.map((c) => (
          <circle key={c.label} cx={c.cx} cy={c.cy} r={62} fill={colorVar('c1')} fillOpacity={0.07} stroke={ink} strokeWidth={2} />
        ))}
        {circles.map((c) => (
          <text key={`l${c.label}`} className="plot-annot" x={c.lx} y={c.ly} textAnchor="middle">
            {c.label}
          </text>
        ))}
        {REGIONS.map((r) => {
          const k = timesCounted(r.sets, step)
          return (
            <text
              key={r.id}
              className="plot-annot"
              x={r.x}
              y={r.y + 5}
              textAnchor="middle"
              fill={colorVar(step === 0 ? 'ink' : colorOf(k))}
              style={{ fontSize: step === 0 ? 14 : 16 }}
            >
              {step === 0 ? `${r.people}人` : `×${k}`}
            </text>
          )
        })}
      </svg>
      <p className="figure-readout">{TOTALS[step]}</p>
    </div>
  )
}
