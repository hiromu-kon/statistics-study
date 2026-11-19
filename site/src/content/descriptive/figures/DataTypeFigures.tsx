import { useState } from 'react'
import { Button } from '../../../components/blocks'
import { Bars, Label, Plot, colorVar, type Color } from '../../../components/charts/Plot'

/** データの種類の分かれ方を木の形で見せる図 */
export function DataTypeTree() {
  const W = 560
  const node = (x: number, y: number, w: number, title: string, sub: string, color: Color) => (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={54} rx={8} fill={colorVar(color)} fillOpacity={0.14} stroke={colorVar(color)} strokeWidth={2} />
      <text x={x} y={y + 22} textAnchor="middle" className="plot-annot" fill={colorVar(color)}>
        {title}
      </text>
      <text x={x} y={y + 42} textAnchor="middle" className="plot-tick">
        {sub}
      </text>
    </g>
  )
  const line = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth={1.5} />
  )
  return (
    <svg className="plot" viewBox={`0 0 ${W} 250`} role="img" aria-label="データの種類の分類図">
      {line(280, 54, 140, 96)}
      {line(280, 54, 420, 96)}
      {line(420, 150, 345, 186)}
      {line(420, 150, 495, 186)}
      {node(280, 0, 200, 'データ（変数）', '調べた項目', 'ink')}
      {node(140, 96, 230, '質的変数（カテゴリ）', '例：血液型、都道府県、満足度', 'c2')}
      {node(420, 96, 230, '量的変数（数の大きさ）', '足したり平均したりできる', 'c1')}
      {node(345, 186, 140, '離散型', '例：人数、回数', 'c3')}
      {node(495, 186, 130, '連続型', '例：身長、時間', 'c4')}
    </svg>
  )
}

type Kind = '質的' | '離散' | '連続'

const ITEMS: { name: string; kind: Kind; why: string }[] = [
  { name: '好きなスポーツ', kind: '質的', why: '答えは「サッカー」「野球」などの種類。数ではない。' },
  { name: '1週間に読んだ本の冊数', kind: '離散', why: '0冊、1冊、2冊…と数えられる。1.5冊はない。' },
  { name: '通学にかかる時間', kind: '連続', why: '12.5分、12.53分…といくらでも細かく測れる。' },
  { name: '郵便番号', kind: '質的', why: '数字だが地域の「名前」。足しても平均しても意味がない。' },
  { name: 'サイコロの出た目', kind: '離散', why: '1〜6のとびとびの値しかとらない。' },
  { name: '体重', kind: '連続', why: '測る道具しだいで、いくらでも細かい値になる。' },
]

/** 変数を見て「質的・離散・連続」を選ぶ小さな練習 */
export function TypeSorter() {
  const [picked, setPicked] = useState<Record<number, Kind>>({})
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {ITEMS.map((it, i) => {
        const p = picked[i]
        const ok = p === it.kind
        return (
          <div key={it.name} className="card" style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <strong style={{ minWidth: 180 }}>{it.name}</strong>
              {(['質的', '離散', '連続'] as Kind[]).map((k) => (
                <Button key={k} variant={p === k ? 'primary' : 'default'} onClick={() => setPicked({ ...picked, [i]: k })}>
                  {k === '質的' ? '質的変数' : `量的・${k}型`}
                </Button>
              ))}
            </div>
            {p && (
              <p style={{ margin: '6px 0 0', color: ok ? 'var(--c3)' : 'var(--c5)' }}>
                {ok ? '正解！' : `ちがいます（正解：${it.kind === '質的' ? '質的変数' : `量的・${it.kind}型`}）`}　{it.why}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

const COMMUTE = [
  { label: '徒歩', n: 12 },
  { label: '電車', n: 10 },
  { label: '自転車', n: 8 },
  { label: 'バス', n: 6 },
  { label: 'その他', n: 4 },
]

/** 質的データの棒グラフ。横軸はカテゴリの名前 */
export function CategoryBar({ data = COMMUTE }: { data?: { label: string; n: number }[] }) {
  const max = Math.max(...data.map((d) => d.n))
  return (
    <Plot
      x={[0.4, data.length + 0.6]}
      y={[0, max * 1.2]}
      height={240}
      xTicks={data.map((_, i) => i + 1)}
      xTickFormat={(v) => data[v - 1]?.label ?? ''}
      yLabel="人数"
    >
      <Bars data={data.map((d, i) => ({ x: i + 1, y: d.n }))} width={0.6} labels={(y) => `${y}人`} />
    </Plot>
  )
}

const PIE_COLORS: Color[] = ['c1', 'c2', 'c3', 'c4', 'c5']

/** 円グラフ。12時の位置から時計回りに、割合に比例した角度で扇形を描く */
export function CategoryPie({ data = COMMUTE }: { data?: { label: string; n: number }[] }) {
  const total = data.reduce((a, d) => a + d.n, 0)
  const cx = 150
  const cy = 120
  const r = 100
  // 各扇形の開始角（12時の位置 = −π/2 から、前の扇形の角度を足していく）
  const starts = data.map((_, i) => -Math.PI / 2 + (data.slice(0, i).reduce((a, d) => a + d.n, 0) / total) * Math.PI * 2)
  return (
    <svg className="plot" viewBox="0 0 300 240" role="img" aria-label="円グラフ" style={{ maxWidth: 320, margin: '0 auto' }}>
      {data.map((d, i) => {
        const start = starts[i]
        const angle = (d.n / total) * Math.PI * 2
        const end = start + angle
        const x1 = cx + r * Math.cos(start)
        const y1 = cy + r * Math.sin(start)
        const x2 = cx + r * Math.cos(end)
        const y2 = cy + r * Math.sin(end)
        const mid = start + angle / 2
        const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${angle > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`
        return (
          <g key={d.label}>
            <path d={path} fill={colorVar(PIE_COLORS[i % PIE_COLORS.length])} fillOpacity={0.8} stroke="var(--surface, #fff)" strokeWidth={2} />
            <text x={cx + r * 0.65 * Math.cos(mid)} y={cy + r * 0.65 * Math.sin(mid)} textAnchor="middle" className="plot-annot" style={{ fontSize: 12 }}>
              {d.label}
            </text>
            <text x={cx + r * 0.65 * Math.cos(mid)} y={cy + r * 0.65 * Math.sin(mid) + 15} textAnchor="middle" className="plot-annot" style={{ fontSize: 12 }}>
              {`${Math.round((d.n / total) * 100)}%`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** 幹葉図。十の位を幹、一の位を葉にして、葉を小さい順に並べる */
export function StemLeaf({ data, unit = '点' }: { data: number[]; unit?: string }) {
  const stems = new Map<number, number[]>()
  for (const v of [...data].sort((a, b) => a - b)) {
    const s = Math.floor(v / 10)
    stems.set(s, [...(stems.get(s) ?? []), v % 10])
  }
  const keys = [...stems.keys()]
  const all = Array.from({ length: Math.max(...keys) - Math.min(...keys) + 1 }, (_, i) => Math.min(...keys) + i)
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <table style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '1.05rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '2px 10px', color: 'var(--c2)', fontWeight: 600 }}>幹（十の位）</th>
            <th style={{ padding: '2px 10px', color: 'var(--c1)', fontWeight: 600, textAlign: 'left' }}>葉（一の位）</th>
          </tr>
        </thead>
        <tbody>
          {all.map((s) => (
            <tr key={s}>
              <td style={{ padding: '2px 10px', textAlign: 'right', borderRight: '2px solid var(--muted)', color: 'var(--c2)' }}>{s}</td>
              <td style={{ padding: '2px 10px', letterSpacing: '0.4em', color: 'var(--c1)' }}>{(stems.get(s) ?? []).join('')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small muted" style={{ alignSelf: 'flex-end', marginLeft: 12 }}>
        {`例：「6 | 3」は 63${unit}`}
      </p>
    </div>
  )
}

/** 棒グラフとヒストグラムの見た目の違い（すき間の有無・横軸の意味） */
export function BarVsHistogram() {
  return (
    <Plot x={[0, 60]} y={[0, 14]} height={220} xTicks={[0, 10, 20, 30, 40, 50, 60]} xLabel="通学時間（分）" yLabel="人数">
      <Bars
        data={[4, 10, 12, 8, 4, 2].map((y, i) => ({ x: i * 10 + 5, y }))}
        width={10}
        color="c3"
        opacity={0.75}
        labels={(y) => String(y)}
      />
      <Label x={45} y={11} color="c3">
        棒をすき間なく並べる
      </Label>
    </Plot>
  )
}
