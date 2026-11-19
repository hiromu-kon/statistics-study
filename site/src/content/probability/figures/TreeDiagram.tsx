import { colorVar } from '../../../components/charts/Plot'

export type TreeLeaf = {
  label: string
  /** 枝に書く確率（条件付き確率） */
  p: string
  /** 右端に書く「ここまでの確率の積」 */
  result?: string
  highlight?: boolean
}

export type TreeBranch = { label: string; p: string; children: TreeLeaf[] }

const X0 = 34
const X1 = 190
const X2 = 340
const XR = 410
const ROW = 46

/** 2段階の樹形図。枝に確率、右端にかけ算の結果を書く */
export function TreeDiagram({ root = 'スタート', branches, ariaLabel }: { root?: string; branches: TreeBranch[]; ariaLabel?: string }) {
  const leaves = branches.flatMap((b) => b.children)
  const height = leaves.length * ROW + 20
  const layout = branches.map((b, bi) => {
    const before = branches.slice(0, bi).reduce((n, prev) => n + prev.children.length, 0)
    const ys = b.children.map((_, ci) => 20 + ROW * (before + ci + 0.5))
    return { ...b, y: (ys[0] + ys[ys.length - 1]) / 2, ys }
  })
  const rootY = (layout[0].y + layout[layout.length - 1].y) / 2
  const ink = colorVar('ink')
  const muted = colorVar('muted')
  return (
    <svg className="plot" viewBox={`0 0 600 ${height}`} role="img" aria-label={ariaLabel}>
      <text className="plot-annot" x={X0} y={rootY + 4} textAnchor="middle">
        {root}
      </text>
      {layout.map((b, bi) => (
        <g key={bi}>
          <line x1={X0 + 30} y1={rootY} x2={X1 - 34} y2={b.y} stroke={muted} strokeWidth={1.8} />
          <text className="plot-tick" x={(X0 + X1) / 2} y={(rootY + b.y) / 2 - 6} textAnchor="middle" style={{ fill: colorVar('c1'), fontWeight: 700 }}>
            {b.p}
          </text>
          <text className="plot-annot" x={X1} y={b.y + 4} textAnchor="middle">
            {b.label}
          </text>
          {b.children.map((c, ci) => {
            const y = b.ys[ci]
            const hl = c.highlight
            return (
              <g key={ci}>
                <line x1={X1 + 34} y1={b.y} x2={X2 - 34} y2={y} stroke={hl ? colorVar('c2') : muted} strokeWidth={hl ? 3 : 1.8} />
                <text className="plot-tick" x={(X1 + X2) / 2 + 4} y={(b.y + y) / 2 - 6} textAnchor="middle" style={{ fill: colorVar('c1'), fontWeight: 700 }}>
                  {c.p}
                </text>
                <text className="plot-annot" x={X2} y={y + 4} textAnchor="middle" style={hl ? { fill: colorVar('c2') } : undefined}>
                  {c.label}
                </text>
                {c.result && (
                  <text className="plot-annot" x={XR} y={y + 4} style={{ fill: hl ? colorVar('c2') : ink }}>
                    {c.result}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}
