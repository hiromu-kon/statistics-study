import type { CSSProperties, ReactNode } from 'react'

// 統計ソフトの出力をそのままの桁ぞろえで見せるための枠（2級コースの OutputTables と同じ見た目）

const preStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: '0.8rem',
  lineHeight: 1.55,
  background: 'var(--surface-2)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '12px 14px',
  overflowX: 'auto',
  margin: '14px 0',
  whiteSpace: 'pre',
}

export function ROutput({ label, children }: { label: string; children: ReactNode }) {
  return (
    <pre style={preStyle} aria-label={label}>
      {children}
    </pre>
  )
}

/** 出力の中の数字に色を付けて、本文の説明と対応させる */
export const C = ({ c, children }: { c: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'; children: ReactNode }) => (
  <span style={{ color: `var(--${c})`, fontWeight: 700 }}>{children}</span>
)
