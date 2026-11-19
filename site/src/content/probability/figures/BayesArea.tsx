import { useState } from 'react'
import { Controls, DataTable, Slider } from '../../../components/blocks'
import { Legend, colorVar } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { percent } from './fraction'

const X0 = 20
const W = 520
const Y0 = 28
const H = 190
const STRIP_Y = Y0 + H + 62
const STRIP_H = 44
const N = 10000

const count = (v: number) => String(round(v, 1))

/**
 * 医療検査のベイズの定理を面積で見せる図。
 * 上：全体（1万人）の四角を「病気／健康」で縦に分け、それぞれを「陽性／陰性」で横に分ける。
 * 下：陽性の人だけを集めた帯。P(病気|陽性) は、この帯の中で病気の人が占める割合。
 */
export function BayesArea({
  prevalence: prev0 = 1,
  sensitivity: se0 = 90,
  specificity: sp0 = 90,
  interactive = true,
}: {
  /** 有病率（%） */
  prevalence?: number
  /** 感度（%）：病気の人が陽性になる確率 */
  sensitivity?: number
  /** 特異度（%）：健康な人が陰性になる確率 */
  specificity?: number
  interactive?: boolean
}) {
  const [prevPct, setPrev] = useState(prev0)
  const [sePct, setSe] = useState(se0)
  const [spPct, setSp] = useState(sp0)
  const p = prevPct / 100
  const se = sePct / 100
  const sp = spPct / 100
  const tp = N * p * se
  const fn = N * p * (1 - se)
  const fp = N * (1 - p) * (1 - sp)
  const tn = N * (1 - p) * sp
  const pos = tp + fp
  const ppv = pos > 0 ? tp / pos : 0

  const sickW = Math.max(W * p, 1.5)
  const tpH = H * se
  const fpH = H * (1 - sp)
  const tpStripW = pos > 0 ? (W * tp) / pos : 0
  const sick = colorVar('c5')
  const healthy = colorVar('c3')
  const ink = colorVar('ink')

  return (
    <div>
      <svg className="plot" viewBox={`0 0 560 ${STRIP_Y + STRIP_H + 26}`} role="img" aria-label="1万人を病気と健康、陽性と陰性で分けた面積図">
        <text className="plot-label" x={X0} y={Y0 - 10}>
          全体 1万人（面積 = 人数）
        </text>
        {/* 病気の列 */}
        <rect x={X0} y={Y0} width={sickW} height={tpH} fill={sick} opacity={0.85} />
        <rect x={X0} y={Y0 + tpH} width={sickW} height={H - tpH} fill={sick} opacity={0.18} />
        {/* 健康の列 */}
        <rect x={X0 + sickW} y={Y0} width={W - sickW} height={fpH} fill={healthy} opacity={0.85} />
        <rect x={X0 + sickW} y={Y0 + fpH} width={W - sickW} height={H - fpH} fill={healthy} opacity={0.15} />
        <rect x={X0} y={Y0} width={W} height={H} fill="none" stroke={ink} strokeWidth={1.5} />
        {fpH > 18 && (
          <text className="plot-annot" x={X0 + sickW + (W - sickW) / 2} y={Y0 + fpH / 2 + 5} textAnchor="middle">
            健康なのに陽性 {count(fp)}人
          </text>
        )}
        <text className="plot-annot" x={X0 + sickW + (W - sickW) / 2} y={Y0 + fpH + (H - fpH) / 2 + 5} textAnchor="middle">
          健康で陰性 {count(tn)}人
        </text>
        <text className="plot-annot" x={X0} y={Y0 + H + 20} style={{ fill: sick }}>
          ↑ 左の赤い列が病気の人（{percent(p)} = {count(N * p)}人）
        </text>
        <text className="plot-tick" x={X0 + W} y={Y0 + H + 38} textAnchor="end">
          濃い色 = 陽性、うすい色 = 陰性
        </text>

        <text className="plot-label" x={X0} y={STRIP_Y - 10}>
          陽性の人だけを集めると {count(pos)}人（これが新しい全体 = P(陽性)）
        </text>
        <rect x={X0} y={STRIP_Y} width={tpStripW} height={STRIP_H} fill={sick} opacity={0.85} />
        <rect x={X0 + tpStripW} y={STRIP_Y} width={W - tpStripW} height={STRIP_H} fill={healthy} opacity={0.85} />
        <rect x={X0} y={STRIP_Y} width={W} height={STRIP_H} fill="none" stroke={ink} strokeWidth={1.5} />
        {tpStripW > 120 && (
          <text className="plot-annot" x={X0 + tpStripW / 2} y={STRIP_Y + STRIP_H / 2 + 5} textAnchor="middle">
            病気で陽性 {count(tp)}人
          </text>
        )}
        {W - tpStripW > 150 && (
          <text className="plot-annot" x={X0 + tpStripW + (W - tpStripW) / 2} y={STRIP_Y + STRIP_H / 2 + 5} textAnchor="middle">
            健康なのに陽性 {count(fp)}人
          </text>
        )}
        <text className="plot-annot" x={X0} y={STRIP_Y + STRIP_H + 20} style={{ fill: sick }}>
          赤い部分の割合 = P(病気|陽性) ≒ {percent(ppv)}
        </text>
      </svg>
      <Legend
        items={[
          { color: 'c5', label: '病気の人' },
          { color: 'c3', label: '健康な人' },
        ]}
      />
      <p className="figure-readout">
        陽性と出た人が本当に病気である確率（陽性的中率）＝ {count(tp)} ÷ ({count(tp)} + {count(fp)}) ≒ <strong>{percent(ppv)}</strong>
      </p>
      {interactive && (
        <Controls>
          <Slider label="有病率" value={prevPct} min={0.1} max={50} step={0.1} onChange={setPrev} format={(v) => `${v.toFixed(1)}%`} />
          <Slider label="感度" value={sePct} min={50} max={100} step={1} onChange={setSe} format={(v) => `${v}%`} />
          <Slider label="特異度" value={spPct} min={50} max={100} step={0.5} onChange={setSp} format={(v) => `${v.toFixed(1)}%`} />
        </Controls>
      )}
      <DataTable
        head={['1万人', '陽性', '陰性', '合計']}
        rows={[
          ['病気', <strong key="tp">{count(tp)}</strong>, count(fn), count(N * p)],
          ['健康', <strong key="fp">{count(fp)}</strong>, count(tn), count(N * (1 - p))],
          ['合計', <strong key="pos">{count(pos)}</strong>, count(fn + tn), '10000'],
        ]}
        caption="同じ内容を「1万人の表」にしたもの。P(病気|陽性) は「陽性」の列だけを見る"
      />
    </div>
  )
}
