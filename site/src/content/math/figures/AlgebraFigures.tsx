import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { round } from '../../../lib/stats'

type Piece = { label: string; units: number; kind: 'x' | 'num' | 'gone' }

const UNIT = 40

function Tape({ y, pieces, title }: { y: number; pieces: Piece[]; title: string }) {
  const starts = pieces.map((_, i) => 90 + pieces.slice(0, i).reduce((acc, p) => acc + p.units * UNIT, 0))
  return (
    <g>
      <text className="plot-annot" x={10} y={y + 26}>
        {title}
      </text>
      {pieces.map((p, i) => {
        const w = p.units * UNIT
        const x = starts[i]
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={w}
              height={40}
              rx={4}
              fill={p.kind === 'x' ? 'var(--c1)' : p.kind === 'num' ? 'var(--c2)' : 'var(--surface)'}
              fillOpacity={p.kind === 'gone' ? 1 : 0.7}
              stroke={p.kind === 'gone' ? 'var(--muted)' : 'var(--ink-2)'}
              strokeDasharray={p.kind === 'gone' ? '5 4' : undefined}
              strokeWidth={1.5}
            />
            <text
              className="plot-annot"
              x={x + w / 2}
              y={y + 26}
              textAnchor="middle"
              fill={p.kind === 'gone' ? 'var(--muted)' : 'var(--ink)'}
            >
              {p.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

const STEPS: { left: Piece[]; right: Piece[]; eq: string; note: string }[] = [
  {
    left: [
      { label: 'x', units: 4, kind: 'x' },
      { label: 'x', units: 4, kind: 'x' },
      { label: '3', units: 3, kind: 'num' },
    ],
    right: [{ label: '11', units: 11, kind: 'num' }],
    eq: '2x + 3 = 11',
    note: '左右のテープの長さが同じ（つり合っている）。x の長さを知りたい。',
  },
  {
    left: [
      { label: 'x', units: 4, kind: 'x' },
      { label: 'x', units: 4, kind: 'x' },
      { label: '−3', units: 3, kind: 'gone' },
    ],
    right: [
      { label: '8', units: 8, kind: 'num' },
      { label: '−3', units: 3, kind: 'gone' },
    ],
    eq: '2x = 11 - 3 = 8',
    note: '両方から 3 を取りのぞく。長さは同じまま。これが「+3 を右へ移項して −3 にする」こと。',
  },
  {
    left: [{ label: 'x', units: 4, kind: 'x' }],
    right: [{ label: '4', units: 4, kind: 'num' }],
    eq: 'x = 8 \\div 2 = 4',
    note: '両方を半分にする（2で割る）。x の長さは 4 とわかった。',
  },
]

/** 一次方程式 2x + 3 = 11 を、長さの同じ2本のテープで解いていく図 */
export function EquationTapes() {
  const [step, setStep] = useState(0)
  const s = STEPS[step]
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 130" role="img" aria-label="方程式をテープ図で解く様子">
        <Tape y={10} pieces={s.left} title="左辺" />
        <Tape y={70} pieces={s.right} title="右辺" />
      </svg>
      <p className="figure-readout">
        手順 {step + 1}/3：<M>{s.eq}</M>
      </p>
      <p className="figure-readout small">{s.note}</p>
      <Controls>
        <Button onClick={() => setStep((v) => Math.max(0, v - 1))} disabled={step === 0}>
          ← 前へ
        </Button>
        <Button variant="primary" onClick={() => setStep((v) => Math.min(STEPS.length - 1, v + 1))} disabled={step === STEPS.length - 1}>
          次へ →
        </Button>
      </Controls>
    </div>
  )
}

/** 分配法則 a(b+c) = ab + ac を、長方形の面積で見せる */
export function DistributiveArea() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [c, setC] = useState(2)
  const u = 36
  const ox = 40
  const oy = 26
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 250" role="img" aria-label="分配法則を長方形の面積で表した図">
        <rect x={ox} y={oy} width={b * u} height={a * u} fill="var(--c1)" fillOpacity={0.35} stroke="var(--ink-2)" strokeWidth={1.5} />
        <rect x={ox + b * u} y={oy} width={c * u} height={a * u} fill="var(--c2)" fillOpacity={0.35} stroke="var(--ink-2)" strokeWidth={1.5} />
        <text className="plot-annot" x={ox + (b * u) / 2} y={oy - 8} textAnchor="middle" fill="var(--c1)">
          {`b = ${b}`}
        </text>
        <text className="plot-annot" x={ox + b * u + (c * u) / 2} y={oy - 8} textAnchor="middle" fill="var(--c2)">
          {`c = ${c}`}
        </text>
        <text className="plot-annot" x={ox - 8} y={oy + (a * u) / 2 + 4} textAnchor="end">
          {`a = ${a}`}
        </text>
        <text className="plot-annot" x={ox + (b * u) / 2} y={oy + (a * u) / 2 + 4} textAnchor="middle">
          {b >= 2 ? `ab = ${a * b}` : a * b}
        </text>
        <text className="plot-annot" x={ox + b * u + (c * u) / 2} y={oy + (a * u) / 2 + 4} textAnchor="middle">
          {c >= 2 ? `ac = ${a * c}` : a * c}
        </text>
      </svg>
      <p className="figure-readout">
        <M>{`${a} \\times (${b} + ${c}) = ${a} \\times ${b} + ${a} \\times ${c} = ${a * b} + ${a * c} = ${a * (b + c)}`}</M>
      </p>
      <Controls>
        <Slider label="a（縦）" value={a} min={1} max={5} step={1} onChange={setA} />
        <Slider label="b" value={b} min={1} max={8} step={1} onChange={setB} />
        <Slider label="c" value={c} min={1} max={5} step={1} onChange={setC} />
      </Controls>
    </div>
  )
}

/**
 * 標準化 z = (x − μ)/σ を、上下2本の数直線で見せる。
 * 上が元の点数、下が z。同じ位置どうしが対応する。
 */
export function ZScoreLines() {
  const [x, setX] = useState(75)
  const [mu, setMu] = useState(60)
  const [sigma, setSigma] = useState(10)
  const left = 40
  const right = 520
  const zMax = 3.5
  const pos = (z: number) => left + ((Math.max(-zMax, Math.min(zMax, z)) + zMax) / (2 * zMax)) * (right - left)
  const z = (x - mu) / sigma
  const out = Math.abs(z) > zMax
  const ticks = [-3, -2, -1, 0, 1, 2, 3]
  const yTop = 50
  const yBot = 140
  return (
    <div>
      <svg className="plot" viewBox="0 0 560 180" role="img" aria-label="元の値と標準化した値を対応させた数直線">
        <text className="plot-label" x={left} y={18}>
          元の点数 x
        </text>
        <text className="plot-label" x={left} y={yBot + 34}>
          標準化した値 z
        </text>
        <line x1={left} x2={right} y1={yTop} y2={yTop} stroke="var(--muted)" />
        <line x1={left} x2={right} y1={yBot} y2={yBot} stroke="var(--muted)" />
        {ticks.map((k) => (
          <g key={k}>
            <line x1={pos(k)} x2={pos(k)} y1={yTop - 4} y2={yTop + 4} stroke="var(--muted)" />
            <text className="plot-tick" x={pos(k)} y={yTop - 9} textAnchor="middle">
              {round(mu + k * sigma, 1)}
            </text>
            <line x1={pos(k)} x2={pos(k)} y1={yBot - 4} y2={yBot + 4} stroke="var(--muted)" />
            <text className="plot-tick" x={pos(k)} y={yBot + 18} textAnchor="middle">
              {k}
            </text>
            <line x1={pos(k)} x2={pos(k)} y1={yTop + 6} y2={yBot - 6} stroke="var(--line)" strokeDasharray="3 4" />
          </g>
        ))}
        <line x1={pos(0)} x2={pos(z)} y1={yTop + 18} y2={yTop + 18} stroke="var(--c2)" strokeWidth={3} />
        <text className="plot-annot" x={(pos(0) + pos(z)) / 2} y={yTop + 36} textAnchor="middle" fill="var(--c2)">
          {`x − μ = ${round(x - mu, 1)}`}
        </text>
        <line x1={pos(z)} x2={pos(z)} y1={yTop} y2={yBot} stroke="var(--c1)" strokeWidth={2} />
        <circle cx={pos(z)} cy={yTop} r={7} fill="var(--c1)" />
        <circle cx={pos(z)} cy={yBot} r={7} fill="var(--c1)" />
        <text className="plot-annot" x={pos(z) + 10} y={yBot - 12} textAnchor="start" fill="var(--c1)">
          {`z = ${round(z, 2)}`}
        </text>
      </svg>
      <p className="figure-readout">
        <M>{`z = \\frac{x - \\mu}{\\sigma} = \\frac{${x} - ${mu}}{${sigma}} = ${round(z, 2)}`}</M>
        {'　'}逆に <M>{`x = \\mu + z\\sigma = ${mu} + ${round(z, 2)} \\times ${sigma} = ${round(mu + z * sigma, 2)}`}</M>
        {out && <span className="small muted">（図の範囲外）</span>}
      </p>
      <Controls>
        <Slider label="点数 x" value={x} min={20} max={100} step={1} onChange={setX} />
        <Slider label="平均 μ" value={mu} min={40} max={70} step={1} onChange={setMu} />
        <Slider label="標準偏差 σ" value={sigma} min={5} max={20} step={1} onChange={setSigma} />
      </Controls>
    </div>
  )
}
