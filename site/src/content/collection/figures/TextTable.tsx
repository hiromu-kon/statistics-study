import type { CSSProperties, ReactNode } from 'react'

// 共通の <DataTable> は数値の表向けに white-space: nowrap なので、文章の入る表は折り返せるこちらを使う。
const cell: CSSProperties = { whiteSpace: 'normal', textAlign: 'left', verticalAlign: 'top', lineHeight: 1.6 }

/** 文章を入れる表。1列目は見出しとして太字・折り返しなしにする */
export function TextTable({ head, rows, caption }: { head: ReactNode[]; rows: ReactNode[][]; caption?: ReactNode }) {
  return (
    <div className="table-wrap">
      <table className="data-table" style={{ width: '100%' }}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} style={{ ...cell, whiteSpace: i === 0 ? 'nowrap' : 'normal' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} style={j === 0 ? { ...cell, fontWeight: 600, whiteSpace: 'nowrap' } : cell}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
