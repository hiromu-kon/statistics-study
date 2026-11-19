import { colorVar, type Color } from '../../../components/charts/Plot'
import { DText, Diagram } from '../../collection/figures/svg'

export type SsPart = { label: string; value: number; color: Color }

const W = 560
const LEFT = 8
const RIGHT = W - 8
const ROW = 74

/**
 * 全体の平方和を、要因ごとの平方和に分けた横長の帯。行ごとに同じ全体の長さで描くので、
 * 「同じ全変動を、どう分けたか」を比べられる。
 */
export function SsBar({ rows }: { rows: { title: string; parts: SsPart[] }[] }) {
  const height = rows.length * ROW + 8
  return (
    <Diagram width={W} height={height} ariaLabel="平方和の分解">
      {rows.map((row, ri) => {
        const total = row.parts.reduce((s, p) => s + p.value, 0)
        const top = ri * ROW + 22
        let x = LEFT
        return (
          <g key={row.title}>
            <DText x={LEFT} y={top - 11} anchor="start" size={13}>
              {`${row.title}（全体 ${Number(total.toFixed(2))}）`}
            </DText>
            {row.parts.map((p) => {
              const w = total === 0 ? 0 : ((RIGHT - LEFT) * p.value) / total
              const x0 = x
              x += w
              return (
                <g key={p.label}>
                  <rect x={x0} y={top} width={Math.max(0, w)} height={34} fill={colorVar(p.color)} opacity={0.8} stroke="var(--bg)" strokeWidth={1.5} />
                  {w > 54 && (
                    <DText x={x0 + w / 2} y={top + 17} color="ink" size={12}>
                      {`${p.label} ${Number(p.value.toFixed(2))}`}
                    </DText>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
    </Diagram>
  )
}
