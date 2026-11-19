import { round } from '../../../lib/stats'

/**
 * 相関行列を、値の大きさに応じて色を塗った表で見せる（正は青、負は赤、0に近いほど薄い）。
 * DataTable ではセルの背景色を変えられないので、この章専用に作っている。
 */
export function CorrMatrix({ labels, matrix, caption }: { labels: string[]; matrix: number[][]; caption?: string }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            <th />
            {labels.map((l) => (
              <th key={l}>{l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={labels[i]}>
              <th>{labels[i]}</th>
              {row.map((v, j) => (
                <td
                  key={j}
                  style={{
                    textAlign: 'center',
                    fontWeight: i === j ? 400 : 700,
                    color: i === j ? 'var(--muted)' : undefined,
                    background:
                      i === j
                        ? undefined
                        : `color-mix(in srgb, var(${v >= 0 ? '--c1' : '--c5'}) ${Math.round(Math.abs(v) * 45)}%, transparent)`,
                  }}
                >
                  {round(v, 2).toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
