import { createContext, useContext, useId, type ReactNode } from 'react'

// 図はすべてこの SVG の座標系の上に描く。
// チャートライブラリを使わないのは、「面積を塗る」「目盛りの位置に注釈を置く」など
// 教材向けの細かい描き込みを自由にしたいため。

export type Color = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'muted' | 'ink'

export const colorVar = (c: Color) => `var(--${c})`

type Scale = {
  x: (v: number) => number
  y: (v: number) => number
  xDomain: [number, number]
  yDomain: [number, number]
  left: number
  right: number
  top: number
  bottom: number
  clipId: string
}

const PlotContext = createContext<Scale | null>(null)

export function usePlot(): Scale {
  const s = useContext(PlotContext)
  if (!s) throw new Error('usePlot は <Plot> の中で使う')
  return s
}

function niceTicks(min: number, max: number, count = 6): number[] {
  const span = max - min
  const raw = span / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
  const ticks: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) ticks.push(Number(v.toFixed(10)))
  return ticks
}

function fmt(v: number): string {
  return Number.isInteger(v) ? String(v) : String(Number(v.toPrecision(4)))
}

export function Plot({
  x,
  y,
  width = 560,
  height = 300,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  xTickFormat = fmt,
  yTickFormat = fmt,
  grid = true,
  hideY = false,
  children,
  ariaLabel,
}: {
  x: [number, number]
  y: [number, number]
  width?: number
  height?: number
  /** 目盛りの位置。省略すると自動 */
  xTicks?: number[]
  yTicks?: number[]
  xLabel?: string
  yLabel?: string
  xTickFormat?: (v: number) => string
  yTickFormat?: (v: number) => string
  grid?: boolean
  /** 縦軸を描かない（確率密度の形だけ見せたいときなど） */
  hideY?: boolean
  children: ReactNode
  ariaLabel?: string
}) {
  const clipId = useId().replace(/:/g, '')
  const left = hideY ? 16 : 52
  const right = width - 16
  const top = 14
  const bottom = height - (xLabel ? 44 : 30)
  const sx = (v: number) => left + ((v - x[0]) / (x[1] - x[0])) * (right - left)
  const sy = (v: number) => bottom - ((v - y[0]) / (y[1] - y[0])) * (bottom - top)
  const xt = xTicks ?? niceTicks(x[0], x[1])
  const yt = yTicks ?? niceTicks(y[0], y[1], 4)
  const scale: Scale = { x: sx, y: sy, xDomain: x, yDomain: y, left, right, top, bottom, clipId }

  return (
    <svg className="plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
      <defs>
        {/* 描画範囲より少し広く切り取る。上端・左右端の近くに置いたラベルが切れないように */}
        <clipPath id={clipId}>
          <rect x={left - 10} y={0} width={right - left + 20} height={bottom} />
        </clipPath>
      </defs>
      {grid &&
        !hideY &&
        yt.map((v) => <line key={`gy${v}`} className="plot-grid" x1={left} x2={right} y1={sy(v)} y2={sy(v)} />)}
      <line className="plot-axis" x1={left} x2={right} y1={bottom} y2={bottom} />
      {xt.map((v) => (
        <g key={`x${v}`}>
          <line className="plot-axis" x1={sx(v)} x2={sx(v)} y1={bottom} y2={bottom + 4} />
          <text className="plot-tick" x={sx(v)} y={bottom + 17} textAnchor="middle">
            {xTickFormat(v)}
          </text>
        </g>
      ))}
      {!hideY && (
        <>
          <line className="plot-axis" x1={left} x2={left} y1={top} y2={bottom} />
          {yt.map((v) => (
            <text key={`y${v}`} className="plot-tick" x={left - 6} y={sy(v) + 4} textAnchor="end">
              {yTickFormat(v)}
            </text>
          ))}
        </>
      )}
      {xLabel && (
        <text className="plot-label" x={(left + right) / 2} y={height - 6} textAnchor="middle">
          {xLabel}
        </text>
      )}
      {yLabel && !hideY && (
        <text className="plot-label" x={left + 4} y={top + 4} textAnchor="start" dominantBaseline="hanging">
          {yLabel}
        </text>
      )}
      <PlotContext.Provider value={scale}>
        <g clipPath={`url(#${clipId})`}>{children}</g>
      </PlotContext.Provider>
    </svg>
  )
}

/** 関数のグラフ（確率密度関数など） */
export function Curve({
  f,
  from,
  to,
  color = 'c1',
  samples = 200,
  width = 2.5,
  dashed,
}: {
  f: (x: number) => number
  from?: number
  to?: number
  color?: Color
  samples?: number
  width?: number
  dashed?: boolean
}) {
  const s = usePlot()
  const a = from ?? s.xDomain[0]
  const b = to ?? s.xDomain[1]
  const pts: string[] = []
  for (let i = 0; i <= samples; i++) {
    const xv = a + ((b - a) * i) / samples
    const yv = f(xv)
    if (Number.isFinite(yv)) pts.push(`${s.x(xv).toFixed(2)},${s.y(yv).toFixed(2)}`)
  }
  return (
    <polyline
      points={pts.join(' ')}
      fill="none"
      stroke={colorVar(color)}
      strokeWidth={width}
      strokeDasharray={dashed ? '6 5' : undefined}
      strokeLinejoin="round"
    />
  )
}

/** 関数の下側の面積を塗る（確率 = 面積を見せる） */
export function Area({
  f,
  from,
  to,
  color = 'c1',
  opacity = 0.3,
  samples = 120,
}: {
  f: (x: number) => number
  from: number
  to: number
  color?: Color
  opacity?: number
  samples?: number
}) {
  const s = usePlot()
  const a = Math.max(from, s.xDomain[0])
  const b = Math.min(to, s.xDomain[1])
  if (b <= a) return null
  const base = s.y(Math.max(0, s.yDomain[0]))
  let d = `M${s.x(a)},${base}`
  for (let i = 0; i <= samples; i++) {
    const xv = a + ((b - a) * i) / samples
    d += ` L${s.x(xv).toFixed(2)},${s.y(f(xv)).toFixed(2)}`
  }
  d += ` L${s.x(b)},${base} Z`
  return <path d={d} fill={colorVar(color)} opacity={opacity} />
}

/** 棒グラフ・ヒストグラム。x は棒の中心、widthは横軸の単位で指定 */
export function Bars({
  data,
  width = 0.8,
  color = 'c1',
  opacity = 0.85,
  highlight,
  highlightColor = 'c2',
  labels,
}: {
  data: { x: number; y: number }[]
  width?: number
  color?: Color
  opacity?: number
  /** 色を変える棒の条件 */
  highlight?: (x: number) => boolean
  highlightColor?: Color
  /** 棒の上に値を表示 */
  labels?: (y: number) => string
}) {
  const s = usePlot()
  const base = s.y(Math.max(0, s.yDomain[0]))
  return (
    <g>
      {data.map((d) => {
        const x0 = s.x(d.x - width / 2)
        const x1 = s.x(d.x + width / 2)
        const yTop = s.y(d.y)
        return (
          <g key={d.x}>
            <rect
              x={x0}
              y={Math.min(yTop, base)}
              width={Math.max(0, x1 - x0)}
              height={Math.abs(base - yTop)}
              fill={colorVar(highlight?.(d.x) ? highlightColor : color)}
              opacity={opacity}
              rx={1.5}
            />
            {labels && (
              <text className="plot-annot" x={(x0 + x1) / 2} y={yTop - 5} textAnchor="middle">
                {labels(d.y)}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

/** 散布図の点 */
export function Points({
  data,
  color = 'c1',
  r = 4,
  opacity = 0.75,
}: {
  data: { x: number; y: number; color?: Color }[]
  color?: Color
  r?: number
  opacity?: number
}) {
  const s = usePlot()
  return (
    <g>
      {data.map((d, i) => (
        <circle key={i} cx={s.x(d.x)} cy={s.y(d.y)} r={r} fill={colorVar(d.color ?? color)} opacity={opacity} />
      ))}
    </g>
  )
}

/** 2点を結ぶ線分（データ座標） */
export function Segment({
  x1,
  y1,
  x2,
  y2,
  color = 'ink',
  width = 1.5,
  dashed,
  arrow,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: Color
  width?: number
  dashed?: boolean
  arrow?: boolean
}) {
  const s = usePlot()
  const id = useId().replace(/:/g, '')
  return (
    <g>
      {arrow && (
        <defs>
          <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={colorVar(color)} />
          </marker>
        </defs>
      )}
      <line
        x1={s.x(x1)}
        y1={s.y(y1)}
        x2={s.x(x2)}
        y2={s.y(y2)}
        stroke={colorVar(color)}
        strokeWidth={width}
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd={arrow ? `url(#${id})` : undefined}
      />
    </g>
  )
}

/** 縦の目印線（平均の位置など） */
export function VLine({ x, color = 'c2', label, dashed = true }: { x: number; color?: Color; label?: string; dashed?: boolean }) {
  const s = usePlot()
  return (
    <g>
      <line
        x1={s.x(x)}
        x2={s.x(x)}
        y1={s.top}
        y2={s.bottom}
        stroke={colorVar(color)}
        strokeWidth={2}
        strokeDasharray={dashed ? '6 4' : undefined}
      />
      {label && (
        <text className="plot-annot" x={s.x(x) + 5} y={s.top + 12} fill={colorVar(color)}>
          {label}
        </text>
      )}
    </g>
  )
}

export function HLine({ y, color = 'muted', label, dashed = true }: { y: number; color?: Color; label?: string; dashed?: boolean }) {
  const s = usePlot()
  return (
    <g>
      <line
        x1={s.left}
        x2={s.right}
        y1={s.y(y)}
        y2={s.y(y)}
        stroke={colorVar(color)}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '6 4' : undefined}
      />
      {label && (
        <text className="plot-annot" x={s.right - 4} y={s.y(y) - 5} textAnchor="end" fill={colorVar(color)}>
          {label}
        </text>
      )}
    </g>
  )
}

/** データ座標に文字を置く */
export function Label({
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
    <text className="plot-annot" x={s.x(x)} y={s.y(y) + dy} textAnchor={anchor} fill={colorVar(color)}>
      {children}
    </text>
  )
}

/** 凡例。図の外（下）に置く */
export function Legend({ items }: { items: { color: Color; label: ReactNode }[] }) {
  return (
    <div className="legend">
      {items.map((it, i) => (
        <span key={i} className="legend-item">
          <span className="legend-swatch" style={{ background: colorVar(it.color) }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
