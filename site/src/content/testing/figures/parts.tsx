import type { ReactNode } from 'react'
import { Button } from '../../../components/blocks'
import { Area, Curve, Plot, colorVar, usePlot, type Color } from '../../../components/charts/Plot'

/**
 * 色つきの文字。
 * 共通の <Label> に色が付かなかった時期に作った部品。今は Label でも同じ表示になるが、
 * この章の図はこの部品で位置を調整しているので置き換えていない。
 */
export function ColorText({
  x,
  y,
  children,
  color = 'ink',
  anchor = 'middle',
  dy = 0,
}: {
  x: number
  y: number
  children: ReactNode
  color?: Color
  anchor?: 'start' | 'middle' | 'end'
  dy?: number
}) {
  const s = usePlot()
  return (
    <text className="plot-annot" x={s.x(x)} y={s.y(y) + dy} textAnchor={anchor} style={{ fill: colorVar(color) }}>
      {children}
    </text>
  )
}

/** 縦線（ラベルなし）。文字は ColorText で別に置く */
export function Mark({ x, color = 'c5', dashed = true, width = 2 }: { x: number; color?: Color; dashed?: boolean; width?: number }) {
  const s = usePlot()
  return (
    <line
      x1={s.x(x)}
      x2={s.x(x)}
      y1={s.top}
      y2={s.bottom}
      stroke={colorVar(color)}
      strokeWidth={width}
      strokeDasharray={dashed ? '6 4' : undefined}
    />
  )
}

export type Range = [number, number]

/**
 * 検定統計量の分布と、棄却域（赤）・p 値の面積（オレンジ）・観測値の位置を1枚に描く。
 * z・t・χ²・F のどの検定でも同じ見た目にして、「型」が同じだと感じられるようにしている。
 */
export function TestDistPlot({
  pdf,
  x,
  yMax,
  reject = [],
  pArea = [],
  criticals = [],
  observed,
  observedLabel,
  xTicks,
  xLabel,
  height = 260,
  extra,
}: {
  pdf: (x: number) => number
  x: Range
  yMax: number
  /** 棄却域（赤で塗る） */
  reject?: Range[]
  /** p 値の面積（オレンジで塗る） */
  pArea?: Range[]
  /** 棄却域の境目（臨界値）。値の文字も添える */
  criticals?: { x: number; label: string }[]
  observed?: number
  observedLabel?: string
  xTicks?: number[]
  xLabel?: string
  height?: number
  extra?: ReactNode
}) {
  return (
    <Plot x={x} y={[0, yMax]} hideY xTicks={xTicks} xLabel={xLabel} height={height}>
      {reject.map(([a, b], i) => (
        <Area key={`r${i}`} f={pdf} from={a} to={b} color="c5" opacity={0.3} />
      ))}
      {pArea.map(([a, b], i) => (
        <Area key={`p${i}`} f={pdf} from={a} to={b} color="c2" opacity={0.55} />
      ))}
      <Curve f={pdf} />
      {criticals.map((c, i) => (
        <g key={`c${i}`}>
          <Mark x={c.x} color="c5" />
          <ColorText x={c.x} y={yMax * 0.9} color="c5" anchor={c.x < (x[0] + x[1]) / 2 ? 'end' : 'start'} dy={0}>
            {c.label}
          </ColorText>
        </g>
      ))}
      {observed !== undefined && (
        <g>
          <Mark x={observed} color="c2" dashed={false} width={3} />
          <ColorText x={observed} y={yMax * 0.75} color="c2" anchor={observed < (x[0] + x[1]) / 2 ? 'end' : 'start'}>
            {observedLabel ?? `観測値 ${observed}`}
          </ColorText>
        </g>
      )}
      {extra}
    </Plot>
  )
}

/** 切り替えボタンの並び（両側／片側など） */
export function Toggle<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label?: string
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
      {label && <span className="small muted">{label}</span>}
      {options.map((o) => (
        <Button key={String(o.value)} variant={o.value === value ? 'primary' : 'default'} onClick={() => onChange(o.value)}>
          {o.label}
        </Button>
      ))}
    </div>
  )
}

/** 判定の表示。棄却なら赤、棄却できないなら青 */
export function Verdict({ reject }: { reject: boolean }) {
  return (
    <strong style={{ color: reject ? 'var(--c5)' : 'var(--c1)' }}>{reject ? '帰無仮説を棄却する' : '帰無仮説を棄却できない'}</strong>
  )
}
