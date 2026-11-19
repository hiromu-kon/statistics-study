import { useMemo, useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Bars, HLine, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { binData } from '../../../components/charts/common'
import { createRng, randomNormal, round } from '../../../lib/stats'
import { SHAPE_LABEL, shapeCenters, shapeDensity, type Shape } from './shapes'

/** 分布の形の見本のヒストグラム。centers をつけると平均・中央値・最頻値の線を引く */
export function ShapeHist({ shape, centers = false, height = 170 }: { shape: Shape; centers?: boolean; height?: number }) {
  const f = shapeDensity(shape)
  const bars = Array.from({ length: 20 }, (_, i) => ({ x: i * 0.5 + 0.25, y: f(i * 0.5 + 0.25) }))
  const top = Math.max(...bars.map((b) => b.y)) * (centers ? 1.45 : 1.15)
  const c = shapeCenters(shape)
  return (
    <div>
      <Plot x={[0, 10]} y={[0, top]} height={height} hideY grid={false} xTicks={[0, 2, 4, 6, 8, 10]}>
        <Bars data={bars} width={0.5} opacity={0.7} />
        {centers && (
          <>
            <VLine x={c.mode} color="c3" />
            <VLine x={c.median} color="c4" />
            <VLine x={c.mean} color="c2" />
          </>
        )}
      </Plot>
      {centers && (
        <Legend
          items={[
            { color: 'c3', label: `最頻値 ${round(c.mode, 1)}` },
            { color: 'c4', label: `中央値 ${round(c.median, 1)}` },
            { color: 'c2', label: `平均値 ${round(c.mean, 1)}` },
          ]}
        />
      )}
    </div>
  )
}

/** 分布の形の5つの見本を並べる */
export function ShapeGallery({ shapes = ['symmetric', 'right', 'left', 'uniform', 'bimodal'] }: { shapes?: Shape[] }) {
  return (
    <Compare>
      {shapes.map((s) => (
        <Card key={s} title={SHAPE_LABEL[s]}>
          <ShapeHist shape={s} height={150} />
        </Card>
      ))}
    </Compare>
  )
}

const WIDTHS = [2, 5, 10, 20, 25]

/** 200人のテストの点数（山が2つ）。階級の幅を変えると見え方が変わる */
export function HistogramBins() {
  const [idx, setIdx] = useState(2)
  const data = useMemo(() => {
    const rng = createRng(20240)
    return Array.from({ length: 200 }, (_, i) => {
      const v = i < 110 ? randomNormal(rng, 45, 8) : randomNormal(rng, 73, 7)
      return Math.min(100, Math.max(0, Math.round(v)))
    })
  }, [])
  const w = WIDTHS[idx]
  const bars = binData(data, 0, w, 100 / w)
  const max = Math.max(...bars.map((b) => b.y))
  return (
    <div>
      <Plot x={[0, 100]} y={[0, max * 1.15]} height={260} xTicks={[0, 20, 40, 60, 80, 100]} xLabel="点数" yLabel="人数">
        <Bars data={bars} width={w} opacity={0.75} />
      </Plot>
      <p className="figure-readout">
        階級の幅 <strong>{w}点</strong>・階級の数 <strong>{100 / w}個</strong>
      </p>
      <Controls>
        <Slider label="階級の幅" value={idx} min={0} max={WIDTHS.length - 1} step={1} onChange={setIdx} format={(v) => `${WIDTHS[v]}点`} />
      </Controls>
    </div>
  )
}

/** 通学時間の度数分布表（40人）。レッスン2の表と同じ数 */
const COMMUTE_TABLE = [
  { lo: 0, hi: 10, f: 4 },
  { lo: 10, hi: 20, f: 10 },
  { lo: 20, hi: 30, f: 12 },
  { lo: 30, hi: 40, f: 8 },
  { lo: 40, hi: 50, f: 4 },
  { lo: 50, hi: 60, f: 2 },
]

/** 累積相対度数グラフ。スライダーの位置で「◯分未満の人の割合」を読み取る */
export function CumulativePlot() {
  const [t, setT] = useState(30)
  const n = COMMUTE_TABLE.reduce((a, r) => a + r.f, 0)
  const pts = [{ x: 0, y: 0 }]
  let acc = 0
  for (const r of COMMUTE_TABLE) {
    acc += r.f
    pts.push({ x: r.hi, y: acc / n })
  }
  const k = Math.min(pts.length - 2, Math.floor(t / 10))
  const p = pts[k].y + ((pts[k + 1].y - pts[k].y) * (t - pts[k].x)) / (pts[k + 1].x - pts[k].x)
  return (
    <div>
      <Plot x={[0, 60]} y={[0, 1.05]} height={280} xTicks={[0, 10, 20, 30, 40, 50, 60]} yTicks={[0, 0.25, 0.5, 0.75, 1]} xLabel="通学時間（分）" yLabel="累積相対度数">
        {pts.slice(1).map((q, i) => (
          <Segment key={i} x1={pts[i].x} y1={pts[i].y} x2={q.x} y2={q.y} color="c1" width={2.5} />
        ))}
        <Points data={pts} r={5} opacity={1} />
        <HLine y={0.5} color="muted" label="0.5（半分）" />
        <Segment x1={t} y1={0} x2={t} y2={p} color="c2" dashed />
        <Segment x1={t} y1={p} x2={0} y2={p} color="c2" dashed arrow />
        <Label x={t} y={p} dy={-10} color="c2">{`${round(p * 100, 1)}%`}</Label>
      </Plot>
      <p className="figure-readout">
        通学時間が <strong>{t}分未満</strong>の生徒は、全体のおよそ <strong>{round(p * 100, 1)}%</strong>
      </p>
      <Controls>
        <Slider label="通学時間" value={t} min={0} max={60} step={1} onChange={setT} format={(v) => `${v}分`} />
      </Controls>
    </div>
  )
}
