import { useState } from 'react'
import { Bars, HLine, Legend, Plot } from '../../../components/charts/Plot'
import { Arrow, Choice, DText, Diagram, Line } from '../../collection/figures/svg'
import { N, acf, ar1, noiseSeries, pacfFromAcf } from './series'

const eps = noiseSeries(N, 7)
const toPts = (xs: number[]) => xs.map((y, x) => ({ x, y }))

type Kind = 'white' | 'ar' | 'trend' | 'rw' | 'diff'

const randomWalk = ar1(1, eps)

const SERIES: Record<Kind, { label: string; data: number[]; stationary: boolean; note: string }> = {
  white: {
    label: 'ホワイトノイズ',
    data: eps,
    stationary: true,
    note: '定常。自己相関も偏自己相関も、どのラグでも点線（±2/√n）の内側で小さくゆれるだけ',
  },
  ar: {
    label: 'AR(1)（φ = 0.7）',
    data: ar1(0.7, eps),
    stationary: true,
    note: '定常。自己相関はラグとともに少しずつ減る。偏自己相関はラグ1だけが大きく、ラグ2から先はほぼ0',
  },
  trend: {
    label: 'トレンド＋ノイズ',
    data: eps.map((e, t) => 0.05 * t + e),
    stationary: false,
    note: '平均が時間とともに上がるので非定常。自己相関は大きなプラスのまま、ゆっくりとしか下がらない',
  },
  rw: {
    label: 'ランダムウォーク',
    data: randomWalk,
    stationary: false,
    note: '非定常（分散が時間とともに大きくなる）。自己相関は1に近い値から、ゆっくり下がる。偏自己相関はラグ1がほぼ1',
  },
  diff: {
    label: 'ランダムウォークの階差',
    data: randomWalk.slice(1).map((x, t) => x - randomWalk[t]),
    stationary: true,
    note: '1期前との差（階差）をとると、元のホワイトノイズに戻り、定常になる',
  },
}

const LAGS = 20

/** 系列を切り替えて、元の系列・標本自己相関・標本偏自己相関を見比べる */
export function SeriesGallery() {
  const [kind, setKind] = useState<Kind>('ar')
  const s = SERIES[kind]
  const lo = Math.min(...s.data)
  const hi = Math.max(...s.data)
  const pad = (hi - lo) * 0.1
  const rho = Array.from({ length: LAGS }, (_, i) => acf(s.data, i + 1))
  const pacf = pacfFromAcf(rho)
  const band = 2 / Math.sqrt(s.data.length)
  const lagPlot = (values: number[], label: string, color: 'c1' | 'c2') => (
    <Plot x={[0, LAGS + 1]} y={[-1, 1]} height={170} xTicks={[1, 5, 10, 15, 20]} yTicks={[-1, -0.5, 0, 0.5, 1]} xLabel="ラグ k" yLabel={label}>
      <HLine y={0} color="muted" dashed={false} />
      <HLine y={band} color="c5" />
      <HLine y={-band} color="c5" />
      <Bars data={values.map((y, i) => ({ x: i + 1, y }))} width={0.55} color={color} />
    </Plot>
  )
  return (
    <div>
      <Choice options={(Object.keys(SERIES) as Kind[]).map((v) => ({ value: v, label: SERIES[v].label }))} value={kind} onChange={setKind} />
      <Plot x={[-1, N]} y={[lo - pad, hi + pad]} height={170} xTicks={[0, 30, 60, 90, 119]} xLabel="時点 t" yLabel={s.label}>
        <Line data={toPts(s.data)} color="c1" width={1.6} />
      </Plot>
      {lagPlot(rho, '自己相関 r_k', 'c1')}
      {lagPlot(pacf, '偏自己相関', 'c2')}
      <Legend
        items={[
          { color: 'c1', label: '標本自己相関' },
          { color: 'c2', label: '標本偏自己相関' },
          { color: 'c5', label: '±2/√n（ホワイトノイズならほぼこの内側）' },
        ]}
      />
      <p className="figure-readout">
        <strong style={{ color: s.stationary ? 'var(--c3)' : 'var(--c5)' }}>{s.stationary ? '定常' : '非定常'}</strong>：{s.note}
      </p>
    </div>
  )
}

/** 同じルールのランダムウォークを何本も描き、時間がたつほど広がる（分散が t に比例する）ことを見せる */
export function RandomWalkFan() {
  const T = 100
  // |φ| = 1 の ar1 は x_0 = 0 から始まる
  const paths = Array.from({ length: 24 }, (_, i) => ar1(1, noiseSeries(T, 100 + i)))
  const env = Array.from({ length: T }, (_, t) => 2 * Math.sqrt(t))
  return (
    <div>
      <Plot x={[0, T]} y={[-25, 25]} height={260} xLabel="時点 t" yLabel="x_t（x_0 = 0 から出発）">
        {paths.map((p, i) => (
          <Line key={i} data={toPts(p)} color="c1" width={1.2} opacity={0.45} />
        ))}
        <Line data={toPts(env)} color="c2" width={2.5} dashed />
        <Line data={toPts(env.map((v) => -v))} color="c2" width={2.5} dashed />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: 'ランダムウォーク 24 本（ノイズの分散 1）' },
          { color: 'c2', label: '±2√t（標準偏差 √t の2倍）' },
        ]}
      />
      <p className="figure-readout small">平均はずっと 0 のままだが、散らばりは時間とともに広がる。分散が時間で変わるので定常ではない</p>
    </div>
  )
}

/** 偏自己相関が「間の時点を通る影響」を取り除いたものであることを示す矢印図 */
export function PartialDiagram() {
  const ys = 70
  const xs = [90, 280, 470]
  const labels = ['xₜ₋₂', 'xₜ₋₁', 'xₜ']
  return (
    <Diagram width={560} height={170} ariaLabel="x_{t-2} から x_t への直接の影響と、x_{t-1} を通る間接の影響">
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 48} y={ys - 22} width={96} height={44} rx={10} fill="var(--surface-2)" stroke="var(--ink)" strokeWidth={1.5} />
          <DText x={x} y={ys}>
            {labels[i]}
          </DText>
        </g>
      ))}
      <Arrow id="pd-a1" x1={140} y1={ys} x2={230} y2={ys} color="c1" width={2.5} />
      <Arrow id="pd-a2" x1={330} y1={ys} x2={420} y2={ys} color="c1" width={2.5} />
      <path d={`M ${xs[0]} ${ys + 24} Q 280 ${ys + 95} ${xs[2]} ${ys + 26}`} fill="none" stroke="var(--c2)" strokeWidth={2.5} strokeDasharray="6 5" />
      <DText x={280} y={ys - 40} color="c1" size={12}>
        自己相関 ρ₂：青い矢印を通る間接の影響もまとめて数える
      </DText>
      <DText x={280} y={ys + 80} color="c2" size={12}>
        偏自己相関 φ₂₂：xₜ₋₁ の影響を取り除いた、直接のつながりだけ
      </DText>
    </Diagram>
  )
}
