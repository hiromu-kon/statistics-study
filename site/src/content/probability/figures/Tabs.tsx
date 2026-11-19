import type { ReactNode } from 'react'

/** 図の表示を切り替えるタブ。index.css の .tabs / .tab を使う */
export function Tabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { id: T; label: ReactNode }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="tabs" role="tablist" style={{ margin: '0 0 12px' }}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === value}
          className={`tab${o.id === value ? ' on' : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
