import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, Legend, Plot, Points, VLine, colorVar, type Color } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Choice, DText, Diagram, Txt } from '../../collection/figures/svg'

const avg = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / xs.length
/** 母集団全体の分散（N で割る） */
const popVar = (xs: number[]) => {
  const m = avg(xs)
  return avg(xs.map((v) => (v - m) ** 2))
}

function combinations<T>(xs: T[], k: number): T[][] {
  if (k === 0) return [[]]
  return xs.flatMap((x, i) => combinations(xs.slice(i + 1), k - 1).map((rest) => [x, ...rest]))
}
function sequences<T>(xs: T[], k: number): T[][] {
  if (k === 0) return [[]]
  return xs.flatMap((x) => sequences(xs, k - 1).map((rest) => [x, ...rest]))
}

// ---------- 有限修正：4つの値から n 個を選ぶ全通り ----------

const POP = [2, 4, 6, 8]

/** 母集団 {2, 4, 6, 8} から n 個を選ぶすべての標本について、標本平均の分布を描く。非復元抽出と復元抽出を比べる */
export function FpcDemo() {
  const [n, setN] = useState(2)
  const [mode, setMode] = useState<'without' | 'with'>('without')
  const samples = mode === 'without' ? combinations(POP, n) : sequences(POP, n)
  const means = samples.map(avg)
  const counts = new Map<number, number>()
  for (const m of means) counts.set(round(m, 4), (counts.get(round(m, 4)) ?? 0) + 1)
  const bars = [...counts].map(([x, c]) => ({ x, y: c / samples.length }))
  const v = popVar(means)
  const s2 = popVar(POP)
  const N = POP.length
  const formula = mode === 'without' ? ((N - n) / (N - 1)) * (s2 / n) : s2 / n
  return (
    <div>
      <Choice
        options={[
          { value: 'without' as const, label: '非復元抽出（同じ人を選び直さない）' },
          { value: 'with' as const, label: '復元抽出（選び直してよい）' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <Plot x={[1, 9]} y={[0, 1]} xTicks={[2, 3, 4, 5, 6, 7, 8]} yTicks={[0, 0.25, 0.5, 0.75, 1]} xLabel="標本平均" yLabel="確率" height={240}>
        <Bars data={bars} width={mode === 'without' || n <= 2 ? 0.45 : 0.22} color={mode === 'without' ? 'c1' : 'c3'} />
        <VLine x={5} color="c2" label="母平均 5" />
      </Plot>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={1} max={4} step={1} onChange={setN} format={(x) => `${x}（N = 4）`} />
      </Controls>
      <p className="figure-readout">
        全 {samples.length} 通りの標本平均の分散 = <strong>{round(v, 4)}</strong>　式{' '}
        {mode === 'without' ? `(N − n)/(N − 1) × σ²/n = ${N - n}/${N - 1} × ${s2}/${n}` : `σ²/n = ${s2}/${n}`} = <strong>{round(formula, 4)}</strong>
      </p>
      <p className="figure-readout small">
        {mode === 'without' && n === N
          ? '全員を調べると、標本平均はいつも母平均 5 に一致し、分散は 0 になる'
          : mode === 'without'
            ? '非復元抽出では、復元抽出より標本平均のばらつきが小さい。n を N に近づけるほど差が大きい'
            : '復元抽出では、同じ値を何度も選ぶ標本（2, 2 など）もあり、ばらつきは σ²/n のまま'}
      </p>
    </div>
  )
}

// ---------- 層化抽出：配分と分散 ----------

const W = [0.6, 0.4]
const S = [10, 30]
const NTOTAL = 100
const stratVar = (n1: number) => (W[0] ** 2 * S[0] ** 2) / n1 + (W[1] ** 2 * S[1] ** 2) / (NTOTAL - n1)

/** 2つの層への標本の配分を変えたときの、層化抽出の推定量の分散（有限修正は無視） */
export function AllocationPlot() {
  const [n1, setN1] = useState(60)
  const neyman = (NTOTAL * W[0] * S[0]) / (W[0] * S[0] + W[1] * S[1])
  const srs = 6.36
  return (
    <div>
      <Plot x={[0, 100]} y={[0, 10]} xTicks={[0, 20, 33, 40, 60, 80, 100]} xLabel="層1 に配る人数 n₁（層2 は 100 − n₁）" yLabel="平均の推定量の分散" height={280}>
        <Curve f={stratVar} from={5} to={95} color="c1" />
        <Curve f={() => srs} from={0} to={100} color="muted" dashed width={1.5} />
        <Txt x={98} y={srs} dy={-6} anchor="end" color="muted" size={12}>
          単純無作為抽出 6.36
        </Txt>
        <Points
          data={[
            { x: 60, y: stratVar(60), color: 'c3' as Color },
            { x: neyman, y: stratVar(neyman), color: 'c2' as Color },
          ]}
          r={6}
          opacity={1}
        />
        <Points data={[{ x: n1, y: stratVar(n1) }]} color="ink" r={4} opacity={1} />
        <VLine x={n1} color="ink" />
      </Plot>
      <Legend
        items={[
          { color: 'c3', label: '比例配分（60 人・40 人）：4.20' },
          { color: 'c2', label: `ネイマン配分（${round(neyman, 1)} 人・${round(100 - neyman, 1)} 人）：3.24` },
        ]}
      />
      <Controls>
        <Slider label="層1 に配る人数" value={n1} min={5} max={95} step={1} onChange={setN1} format={(v) => `${v} 人`} />
      </Controls>
      <p className="figure-readout">
        n₁ = {n1}、n₂ = {NTOTAL - n1} のとき 分散 = 0.6² × 10² ÷ {n1} ＋ 0.4² × 30² ÷ {NTOTAL - n1} = <strong>{round(stratVar(n1), 3)}</strong>
      </p>
      <p className="figure-readout small">ばらつきの大きい層2（標準偏差 30）に多めに配るネイマン配分で、分散がいちばん小さくなる。</p>
    </div>
  )
}

// ---------- 系統抽出：名簿の並び方で精度が変わる ----------

type Order = 'random' | 'trend' | 'period'
const ORDERS: Record<Order, { label: string; values: number[]; note: string }> = {
  random: {
    label: 'ばらばらの並び',
    values: [8, 4, 11, 7, 10, 9, 1, 6, 12, 3, 5, 2],
    note: '並びが値と無関係なら、系統抽出の精度は単純無作為抽出と同じくらい（並び方しだいで多少前後し、平均すると同じになる）',
  },
  trend: {
    label: '小さい順の並び',
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    note: '値が順に大きくなる並びでは、どの標本も小・中・大をまんべんなく含み（層化抽出に近い）、単純無作為抽出より精度がよい',
  },
  period: {
    label: '周期3の並び',
    values: [2, 6, 10, 2, 6, 10, 2, 6, 10, 2, 6, 10],
    note: '並びの周期が抽出間隔と同じだと、同じような値ばかりが選ばれ、単純無作為抽出よりずっと精度が悪い',
  },
}
const K = 3
const SAMPLE_COLORS: Color[] = ['c1', 'c3', 'c2']

/** 12 人の名簿から、間隔 3 で系統抽出する（スタートは 1・2・3 番の3通り）。並び方を切り替えて、標本平均のばらつきを比べる */
export function SystematicDemo() {
  const [order, setOrder] = useState<Order>('trend')
  const { values, note } = ORDERS[order]
  const means = Array.from({ length: K }, (_, s) => avg(values.filter((_, i) => i % K === s)))
  const vSys = popVar(means)
  const N = values.length
  const n = N / K
  const vSrs = ((N - n) / (N - 1)) * (popVar(values) / n)
  return (
    <div>
      <Choice options={(Object.keys(ORDERS) as Order[]).map((o) => ({ value: o, label: ORDERS[o].label }))} value={order} onChange={setOrder} />
      <Plot x={[0.3, 12.7]} y={[0, 13]} xTicks={values.map((_, i) => i + 1)} xLabel="名簿の番号" yLabel="値" height={240}>
        {[0, 1, 2].map((s) => (
          <Bars key={s} data={values.flatMap((v, i) => (i % K === s ? [{ x: i + 1, y: v }] : []))} width={0.7} color={SAMPLE_COLORS[s]} />
        ))}
      </Plot>
      <Legend items={means.map((m, s) => ({ color: SAMPLE_COLORS[s], label: `${s + 1} 番から始める標本（平均 ${round(m, 2)}）` }))} />
      <p className="figure-readout">
        系統抽出の標本平均の分散 = <strong>{round(vSys, 3)}</strong>　単純無作為抽出（n = 4）の分散 = <strong>{round(vSrs, 3)}</strong>
      </p>
      <p className="figure-readout small">{note}</p>
    </div>
  )
}

// ---------- 集落抽出：集落の中が似ているかどうか ----------

type Cluster = 'homo' | 'hetero'
const CLUSTERS: Record<Cluster, { label: string; groups: number[][]; note: string }> = {
  homo: {
    label: '集落の中が似ている',
    groups: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
    ],
    note: '集落の中が似ていると、どの集落を選ぶかで平均が大きく変わり、精度が悪い',
  },
  hetero: {
    label: '集落の中がいろいろ',
    groups: [
      [1, 6, 11],
      [2, 7, 12],
      [3, 5, 10],
      [4, 8, 9],
    ],
    note: 'どの集落も母集団の縮図に近いと、どの集落を選んでも平均がほぼ同じで、精度がよい',
  },
}

/** 3人ずつの集落4つから2つを選んで全員を調べる（6通り）。集落の作られ方で、標本平均のばらつきがどう変わるか */
export function ClusterDemo() {
  const [kind, setKind] = useState<Cluster>('homo')
  const { groups, note } = CLUSTERS[kind]
  const picks = combinations([0, 1, 2, 3], 2)
  const means = picks.map((p) => avg(p.flatMap((g) => groups[g])))
  const vCl = popVar(means)
  const all = groups.flat()
  const vSrs = ((12 - 6) / 11) * (popVar(all) / 6)
  return (
    <div>
      <Choice options={(Object.keys(CLUSTERS) as Cluster[]).map((c) => ({ value: c, label: CLUSTERS[c].label }))} value={kind} onChange={setKind} />
      <Diagram width={560} height={120} ariaLabel="4つの集落とその中の値">
        {groups.map((g, gi) => (
          <g key={gi}>
            <rect x={14 + gi * 136} y={30} width={124} height={60} rx={10} fill="none" stroke={colorVar('muted')} strokeDasharray="5 4" strokeWidth={1.5} />
            <DText x={76 + gi * 136} y={16} size={12} color="muted">
              {`集落 ${gi + 1}（平均 ${round(avg(g), 2)}）`}
            </DText>
            {g.map((v, k) => (
              <g key={k}>
                <circle cx={38 + gi * 136 + k * 38} cy={60} r={15} fill={colorVar('c1')} opacity={0.25 + v / 20} />
                <DText x={38 + gi * 136 + k * 38} y={61} size={13}>
                  {String(v)}
                </DText>
              </g>
            ))}
          </g>
        ))}
      </Diagram>
      <p className="figure-readout">
        集落2つ（6人）を選ぶ全 6 通りの標本平均：{means.map((m) => round(m, 2)).join('、')}
      </p>
      <p className="figure-readout">
        集落抽出の分散 = <strong>{round(vCl, 3)}</strong>　単純無作為抽出（6人）の分散 = <strong>{round(vSrs, 3)}</strong>
      </p>
      <p className="figure-readout small">{note}</p>
    </div>
  )
}
