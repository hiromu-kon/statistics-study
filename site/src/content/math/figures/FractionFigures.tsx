import { useState } from 'react'
import { Controls, Figure, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { round } from '../../../lib/stats'

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/**
 * テープ図で分数を見せる。分母でテープを等分し、分子の数だけ塗る。
 * 小数・百分率・約分した形を一緒に表示して「同じ量の別の書き方」だとわかるようにする。
 */
export function FractionTape({ num: num0 = 3, den: den0 = 4, interactive = false }: { num?: number; den?: number; interactive?: boolean }) {
  const [den, setDen] = useState(den0)
  const [num, setNum] = useState(num0)
  const n = Math.min(num, den)
  const left = 20
  const right = 540
  const w = (right - left) / den
  const g = gcd(n, den) || 1
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 104" role="img" aria-label={`${den}等分したテープのうち${n}つ分を塗った図`}>
        {Array.from({ length: den }, (_, i) => (
          <rect
            key={i}
            x={left + i * w}
            y={18}
            width={w}
            height={44}
            fill={i < n ? 'var(--c1)' : 'var(--surface)'}
            fillOpacity={i < n ? 0.75 : 1}
            stroke="var(--ink-2)"
            strokeWidth={1.5}
          />
        ))}
        <text className="plot-tick" x={left} y={82} textAnchor="middle">
          0
        </text>
        <text className="plot-tick" x={right} y={82} textAnchor="middle">
          1
        </text>
        {n > 0 && n < den && (
          <text className="plot-annot" x={left + n * w} y={82} textAnchor="middle" fill="var(--c1)">
            {round(n / den, 3)}
          </text>
        )}
        <text className="plot-tick" x={(left + right) / 2} y={100} textAnchor="middle">
          {`全体を ${den} 等分したうちの ${n} つ分`}
        </text>
      </svg>
      <p className="figure-readout">
        <M>{`\\frac{${n}}{${den}}`}</M> = 小数で <strong>{round(n / den, 4)}</strong> = <strong>{round((n / den) * 100, 2)}%</strong>
        {g > 1 && (
          <>
            {'　'}約分すると <M>{`\\frac{${n / g}}{${den / g}}`}</M>
          </>
        )}
      </p>
      {interactive && (
        <Controls>
          <Slider
            label="分母（何等分するか）"
            value={den}
            min={1}
            max={12}
            step={1}
            onChange={(v) => {
              setDen(v)
              setNum((x) => Math.min(x, v))
            }}
          />
          <Slider label="分子（いくつ塗るか）" value={n} min={0} max={den} step={1} onChange={setNum} />
        </Controls>
      )}
    </div>
  )
}

/**
 * 分数のかけ算の面積図。正方形（面積1）を縦に b 等分して a 列、横に d 等分して c 行を塗ると、
 * 重なった部分が a×c マス、全体が b×d マスになる。
 */
export function FractionAreaModel() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const [c, setC] = useState(3)
  const [d, setD] = useState(4)
  const size = 220
  const ox = 150
  const oy = 12
  const cw = size / b
  const rh = size / d
  const cells = []
  for (let i = 0; i < b; i++) {
    for (let j = 0; j < d; j++) {
      const inA = i < a
      const inC = j < c
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={ox + i * cw}
          y={oy + size - (j + 1) * rh}
          width={cw}
          height={rh}
          fill={inA && inC ? 'var(--c4)' : inA ? 'var(--c1)' : inC ? 'var(--c2)' : 'var(--surface)'}
          fillOpacity={inA && inC ? 0.7 : inA || inC ? 0.22 : 1}
          stroke="var(--ink-2)"
          strokeWidth={1}
        />,
      )
    }
  }
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 270" role="img" aria-label="分数のかけ算を面積で表した図">
        {cells}
        <rect x={ox} y={oy} width={size} height={size} fill="none" stroke="var(--ink)" strokeWidth={2} />
        <text className="plot-annot" x={ox + (a * cw) / 2} y={oy + size + 20} textAnchor="middle" fill="var(--c1)">
          {`横 ${a}/${b}`}
        </text>
        <text className="plot-annot" x={ox - 8} y={oy + size - (c * rh) / 2 + 4} textAnchor="end" fill="var(--c2)">
          {`縦 ${c}/${d}`}
        </text>
        <text className="plot-tick" x={ox + size + 12} y={oy + 16}>
          正方形全体 = 1
        </text>
        <text className="plot-tick" x={ox + size + 12} y={oy + 36}>
          {`マスは全部で ${b}×${d} = ${b * d} 個`}
        </text>
        <text className="plot-annot" x={ox + size + 12} y={oy + 60} fill="var(--c4)">
          {`重なり ${a}×${c} = ${a * c} 個`}
        </text>
      </svg>
      <p className="figure-readout">
        <M>{`\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}} = \\frac{${a} \\times ${c}}{${b} \\times ${d}} = \\frac{${a * c}}{${b * d}}`}</M>
        {a * c > 0 && gcd(a * c, b * d) > 1 && (
          <>
            {' '}
            = <M>{`\\frac{${(a * c) / gcd(a * c, b * d)}}{${(b * d) / gcd(a * c, b * d)}}`}</M>
          </>
        )}
        {'　'}（≒ {round((a * c) / (b * d), 3)}）
      </p>
      <Controls>
        <Slider label="横の分母" value={b} min={1} max={6} step={1} onChange={(v) => { setB(v); setA((x) => Math.min(x, v)) }} />
        <Slider label="横の分子" value={a} min={0} max={b} step={1} onChange={setA} />
        <Slider label="縦の分母" value={d} min={1} max={6} step={1} onChange={(v) => { setD(v); setC((x) => Math.min(x, v)) }} />
        <Slider label="縦の分子" value={c} min={0} max={d} step={1} onChange={setC} />
      </Controls>
    </div>
  )
}

/**
 * 「もとにする量 × 割合 = 比べる量」をテープで見せる。
 * 全体の人数と割合を動かすと、塗った部分の人数が変わる。
 */
export function PercentTape() {
  const [total, setTotal] = useState(200)
  const [pct, setPct] = useState(30)
  const left = 20
  const right = 540
  const xp = left + ((right - left) * pct) / 100
  const part = round((total * pct) / 100, 2)
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 120" role="img" aria-label="全体のうち何パーセントかをテープで表した図">
        <rect x={left} y={30} width={right - left} height={40} fill="var(--surface)" stroke="var(--ink-2)" strokeWidth={1.5} />
        <rect x={left} y={30} width={xp - left} height={40} fill="var(--c2)" fillOpacity={0.75} />
        {pct > 8 && (
          <text className="plot-annot" x={(left + xp) / 2} y={55} textAnchor="middle">
            {`${part} 人`}
          </text>
        )}
        <text className="plot-annot" x={(left + right) / 2} y={20} textAnchor="middle">
          {`全体（もとにする量）= ${total} 人 = 100%`}
        </text>
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={left + ((right - left) * t) / 100} x2={left + ((right - left) * t) / 100} y1={70} y2={76} stroke="var(--muted)" />
            <text className="plot-tick" x={left + ((right - left) * t) / 100} y={90} textAnchor="middle">
              {`${t}%`}
            </text>
          </g>
        ))}
        <text className="plot-annot" x={xp} y={110} textAnchor="middle" fill="var(--c2)">
          {`${pct}%`}
        </text>
      </svg>
      <p className="figure-readout">
        比べる量 = {total} × {round(pct / 100, 2)} = <strong>{part} 人</strong>
      </p>
      <Controls>
        <Slider label="全体の人数" value={total} min={50} max={500} step={10} onChange={setTotal} format={(v) => `${v}人`} />
        <Slider label="割合" value={pct} min={0} max={100} step={5} onChange={setPct} format={(v) => `${v}%`} />
      </Controls>
    </div>
  )
}

/** 通分のテープ図（1/2 と 1/3 を 6 等分に切り直す） */
export function CommonDenominatorTape() {
  const left = 20
  const right = 540
  const w = (right - left) / 6
  const row = (y: number, filled: number, color: string, label: string) => (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={left + i * w}
          y={y}
          width={w}
          height={28}
          fill={i < filled ? color : 'var(--surface)'}
          fillOpacity={i < filled ? 0.7 : 1}
          stroke="var(--ink-2)"
        />
      ))}
      <text className="plot-annot" x={left + 6} y={y - 6}>
        {label}
      </text>
    </g>
  )
  return (
    <Figure caption="1/2 は 6等分の3つ分、1/3 は 6等分の2つ分。同じ大きさのマスにそろえれば、マスの数を足すだけ">
      <svg className="plot" viewBox="0 0 560 190" role="img" aria-label="通分のテープ図">
        {row(22, 3, 'var(--c1)', '1/2 = 3/6')}
        {row(80, 2, 'var(--c2)', '1/3 = 2/6')}
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <rect
              key={i}
              x={left + i * w}
              y={138}
              width={w}
              height={28}
              fill={i < 3 ? 'var(--c1)' : i < 5 ? 'var(--c2)' : 'var(--surface)'}
              fillOpacity={i < 5 ? 0.7 : 1}
              stroke="var(--ink-2)"
            />
          ))}
          <text className="plot-annot" x={left + 6} y={132}>
            合計 = 5/6
          </text>
        </g>
        {[1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={left + i * w} x2={left + i * w} y1={170} y2={176} stroke="var(--muted)" />
        ))}
      </svg>
    </Figure>
  )
}
