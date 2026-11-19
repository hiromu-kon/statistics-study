import { Button } from '../../../components/blocks'

/**
 * 切り替えボタンの並び。
 * 2級の検定の章（testing/figures/parts.tsx）に同じ部品があるが、章どうしの依存を作らないためにこの章で持つ。
 */
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
