import type { ReactNode } from 'react'

// レッスン本文で使う部品。AGENTS.md の「ノートを書くときの型」に対応させている。

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="lesson-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

type BoxKind = 'point' | 'example' | 'intuition' | 'pitfall' | 'exam' | 'math' | 'note'

const BOX_LABEL: Record<BoxKind, string> = {
  point: '一言でいうと',
  example: '具体例',
  intuition: '直感的な理解',
  pitfall: 'よくある勘違い',
  exam: '統計検定での出方',
  math: '数学の確認',
  note: 'メモ',
}

const BOX_ICON: Record<BoxKind, string> = {
  point: '★',
  example: '例',
  intuition: '💡',
  pitfall: '⚠',
  exam: '試',
  math: '√',
  note: '✎',
}

export function Box({ kind, title, children }: { kind: BoxKind; title?: string; children: ReactNode }) {
  return (
    <aside className={`box box-${kind}`}>
      <div className="box-head">
        <span className="box-icon" aria-hidden>
          {BOX_ICON[kind]}
        </span>
        <span>{title ?? BOX_LABEL[kind]}</span>
      </div>
      <div className="box-body">{children}</div>
    </aside>
  )
}

export const Point = (p: { title?: string; children: ReactNode }) => <Box kind="point" {...p} />
export const Example = (p: { title?: string; children: ReactNode }) => <Box kind="example" {...p} />
export const Intuition = (p: { title?: string; children: ReactNode }) => <Box kind="intuition" {...p} />
export const Pitfall = (p: { title?: string; children: ReactNode }) => <Box kind="pitfall" {...p} />
export const ExamTip = (p: { title?: string; children: ReactNode }) => <Box kind="exam" {...p} />
export const MathNote = (p: { title?: string; children: ReactNode }) => <Box kind="math" {...p} />
export const Note = (p: { title?: string; children: ReactNode }) => <Box kind="note" {...p} />

/** 計算の手順を番号つきで見せる */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="steps">{children}</ol>
}

/** 2つ（以上）を横に並べて比べる。スマホでは縦に並ぶ */
export function Compare({ children }: { children: ReactNode }) {
  return <div className="compare">{children}</div>
}

export function Card({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  )
}

/** 図とキャプション */
export function Figure({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="figure">
      <div className="figure-body">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** 表。rows の各セルは文字列でも JSX でもよい */
export function DataTable({
  head,
  rows,
  caption,
  highlight,
}: {
  head: ReactNode[]
  rows: ReactNode[][]
  caption?: ReactNode
  /** 強調する行の番号 */
  highlight?: number[]
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={highlight?.includes(i) ? 'hl' : undefined}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 色つきの強調。例: <Mark>平均</Mark> */
export function Mark({ children, color = 'c1' }: { children: ReactNode; color?: 'c1' | 'c2' | 'c3' | 'c4' }) {
  return <span className={`mark mark-${color}`}>{children}</span>
}

/** スライダー。インタラクティブな図の操作に使う */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: ReactNode
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <label className="slider">
      <span className="slider-label">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="slider-value">{format ? format(value) : value}</span>
    </label>
  )
}

export function Controls({ children }: { children: ReactNode }) {
  return <div className="controls">{children}</div>
}

export function Button({
  children,
  onClick,
  variant = 'default',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'ghost'
  disabled?: boolean
}) {
  return (
    <button type="button" className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
