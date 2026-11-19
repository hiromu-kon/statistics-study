import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, HLine, Legend, Plot, Points } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { MONTHS, autocorrelation, movingAverage, noise, sales, seasonal, trend } from './monthlyData'
import { Choice, Line, Txt } from './svg'

const yearTicks = [0, 12, 24, 36, 47]
const yearTickFormat = (t: number) => (t === 47 ? '4年目12月' : `${t / 12 + 1}年目1月`)
const toPts = (xs: (number | null)[]) => xs.flatMap((y, x) => (y === null ? [] : [{ x, y }]))

const WINDOWS = [1, 3, 5, 7, 9, 12]

const WINDOW_NOTE: Record<number, string> = {
  1: '移動平均なし（元のデータそのまま）',
  3: '細かいギザギザ（不規則変動）は少しならされるが、夏の山・冬の谷はまだ残る',
  5: 'ギザギザはかなり減ったが、季節の波は残る',
  7: '波が小さくなるが、まだ消えない',
  9: '波はさらに小さいが、12か月周期の波を完全には消せない',
  12: '1年分（12か月）を平均すると、季節変動がほぼ消えて右上がりのトレンドだけが残る',
}

/** 月次データに移動平均を重ねる。区間の長さをスライダーで変えられる */
export function MovingAverageChart() {
  const [idx, setIdx] = useState(1)
  const k = WINDOWS[idx]
  const ma = movingAverage(sales, k)
  const missing = k === 1 ? 0 : k % 2 === 1 ? (k - 1) / 2 : k / 2
  return (
    <div>
      <Plot x={[-1, MONTHS]} y={[60, 160]} xTicks={yearTicks} xTickFormat={yearTickFormat} yLabel="売上（万円）">
        <Line data={toPts(sales)} color="c1" width={1.5} dots opacity={0.55} />
        {k > 1 && <Line data={toPts(ma)} color="c2" width={3.5} />}
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '元のデータ（原系列）' },
          { color: 'c2', label: k === 12 ? '中心化12か月移動平均' : `${k}項移動平均` },
        ]}
      />
      <p className="figure-readout">{WINDOW_NOTE[k]}</p>
      {missing > 0 && <p className="figure-readout small muted">両端の {missing} か月ずつは、前後のデータが足りないので計算できない</p>}
      <Controls>
        <Slider
          label="平均する区間の長さ"
          value={idx}
          min={0}
          max={WINDOWS.length - 1}
          step={1}
          onChange={setIdx}
          format={(i) => (WINDOWS[i] === 1 ? 'なし' : WINDOWS[i] === 12 ? '12か月（中心化）' : `${WINDOWS[i]}か月`)}
        />
      </Controls>
    </div>
  )
}

/** 原系列を トレンド・季節変動・不規則変動 に分けて縦に並べる */
export function DecompositionChart() {
  const rows: { label: string; data: number[]; y: [number, number]; color: 'c1' | 'c2' | 'c3' | 'c4' }[] = [
    { label: '原系列（実際のデータ）', data: sales, y: [60, 160], color: 'c1' },
    { label: 'トレンド（長い目で見た傾き）', data: trend, y: [90, 130], color: 'c2' },
    { label: '季節変動（毎年くり返す波）', data: seasonal, y: [-25, 25], color: 'c3' },
    { label: '不規則変動（残りのでこぼこ）', data: noise, y: [-10, 10], color: 'c4' },
  ]
  return (
    <div>
      {rows.map((r) => (
        <Plot key={r.label} x={[-1, MONTHS]} y={r.y} height={130} xTicks={yearTicks} xTickFormat={yearTickFormat} yLabel={r.label} yTicks={[r.y[0], (r.y[0] + r.y[1]) / 2, r.y[1]]}>
          <Line data={toPts(r.data)} color={r.color} width={2} />
        </Plot>
      ))}
    </div>
  )
}

/** x_t と k か月後の x_{t+k} の散布図。ラグ k をスライダーで変えられる */
export function LagScatter() {
  const [k, setK] = useState(1)
  const pts = sales.slice(0, MONTHS - k).map((x, t) => ({ x, y: sales[t + k] }))
  const r = autocorrelation(sales, k)
  return (
    <div>
      <Plot x={[60, 160]} y={[60, 160]} width={420} height={400} xLabel={`今月の売上 x_t`} yLabel={`${k}か月後の売上 x_(t+${k})`}>
        <Points data={pts} r={5} opacity={0.7} color={r >= 0 ? 'c1' : 'c5'} />
      </Plot>
      <p className="figure-readout">
        ラグ {k} の自己相関 r<sub>{k}</sub> = <strong>{round(r, 2)}</strong>（{pts.length} 組の点）
      </p>
      <Controls>
        <Slider label="ラグ k（何か月ずらすか）" value={k} min={1} max={24} step={1} onChange={setK} format={(v) => `${v}か月`} />
      </Controls>
    </div>
  )
}

type SeriesKind = 'both' | 'trend' | 'season' | 'noise'

const SERIES: Record<SeriesKind, { label: string; data: number[]; note: string }> = {
  both: {
    label: 'この売上データ',
    data: sales,
    note: 'ラグ12で大きな山、ラグ24でも山。半年ずれたラグ6・18では谷（マイナス）。12か月周期の季節変動があるサイン',
  },
  trend: {
    label: 'トレンド＋ノイズ',
    data: trend.map((v, t) => v + noise[t]),
    note: '右上がりの傾向があると、ラグが小さいほど大きなプラスで、ゆっくり下がっていく',
  },
  season: {
    label: '季節変動＋ノイズ',
    data: seasonal.map((v, t) => 100 + v + noise[t]),
    note: '12か月周期の波があると、ラグ12・24で山（プラス）、ラグ6・18で谷（マイナス）',
  },
  noise: {
    label: 'ノイズだけ',
    data: noise.map((v) => 100 + v),
    note: 'でたらめな系列では、どのラグでも 0 の近くで小さくゆれるだけ',
  },
}

/** コレログラム（ラグごとの自己相関の棒グラフ）。系列の種類を切り替えて形を比べる */
export function Correlogram() {
  const [kind, setKind] = useState<SeriesKind>('both')
  const s = SERIES[kind]
  const lo = Math.min(...s.data)
  const hi = Math.max(...s.data)
  const pad = (hi - lo) * 0.08
  const bars = Array.from({ length: 24 }, (_, i) => ({ x: i + 1, y: autocorrelation(s.data, i + 1) }))
  return (
    <div>
      <Choice
        options={(Object.keys(SERIES) as SeriesKind[]).map((v) => ({ value: v, label: SERIES[v].label }))}
        value={kind}
        onChange={setKind}
      />
      <Plot x={[-1, MONTHS]} y={[lo - pad, hi + pad * 3]} height={130} xTicks={yearTicks} xTickFormat={yearTickFormat} hideY>
        <Line data={toPts(s.data)} color="c1" width={1.5} />
        <Txt x={0} y={hi + pad * 3} dy={14} anchor="start" color="muted" size={12}>
          {`元の系列：${s.label}`}
        </Txt>
      </Plot>
      <Plot x={[0, 25]} y={[-1, 1]} xTicks={[1, 6, 12, 18, 24]} yTicks={[-1, -0.5, 0, 0.5, 1]} xLabel="ラグ k（か月）" yLabel="自己相関 r_k">
        <HLine y={0} color="muted" dashed={false} />
        <Bars data={bars} width={0.6} color="c1" highlight={(x) => x === 12 || x === 24} highlightColor="c2" />
      </Plot>
      <p className="figure-readout">{s.note}</p>
    </div>
  )
}

