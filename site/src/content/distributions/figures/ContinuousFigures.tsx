import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { binData } from '../../../components/charts/common'
import { Area, Bars, Curve, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { createRng, exponentialPdf, round } from '../../../lib/stats'

/** 連続一様分布 U(a, b)。長方形の面積が確率。区間 [c, d] の確率は「幅の割合」になる */
export function UniformExplorer() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(8)
  const [c, setC] = useState(3)
  const [d, setD] = useState(5)
  const h = 1 / (b - a)
  const lo = Math.max(a, c)
  const hi = Math.min(b, d)
  const prob = Math.max(0, hi - lo) * h
  return (
    <div>
      <Plot x={[-1, 11]} y={[0, Math.max(0.3, h * 1.3)]} xLabel="x" xTicks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
        {hi > lo && <Area f={() => h} from={lo} to={hi} color="c2" opacity={0.45} />}
        <Area f={() => h} from={a} to={b} color="c1" opacity={0.15} />
        <Segment x1={-1} y1={0} x2={a} y2={0} color="c1" width={2.5} />
        <Segment x1={a} y1={h} x2={b} y2={h} color="c1" width={2.5} />
        <Segment x1={b} y1={0} x2={11} y2={0} color="c1" width={2.5} />
        <Segment x1={a} y1={0} x2={a} y2={h} color="c1" dashed />
        <Segment x1={b} y1={0} x2={b} y2={h} color="c1" dashed />
        <Label x={(a + b) / 2} y={h} dy={-8}>{`高さ 1/(b−a) = ${round(h, 3)}`}</Label>
      </Plot>
      <p className="figure-readout">
        <M>{`P(${c} \\le X \\le ${d})`}</M> = 幅 {round(Math.max(0, hi - lo), 2)} × 高さ {round(h, 3)} = <strong>{round(prob, 3)}</strong>
        <br />
        期待値 <M>{'(a+b)/2'}</M> = <strong>{round((a + b) / 2, 2)}</strong>　分散 <M>{'(b-a)^2/12'}</M> = <strong>{round((b - a) ** 2 / 12, 3)}</strong>
      </p>
      <Controls>
        <Slider label="左端 a" value={a} min={0} max={9} step={0.5} onChange={(v) => setA(Math.min(v, b - 1))} />
        <Slider label="右端 b" value={b} min={1} max={10} step={0.5} onChange={(v) => setB(Math.max(v, a + 1))} />
        <Slider label="調べる区間の左 c" value={c} min={0} max={10} step={0.5} onChange={(v) => setC(Math.min(v, d))} />
        <Slider label="調べる区間の右 d" value={d} min={0} max={10} step={0.5} onChange={(v) => setD(Math.max(v, c))} />
      </Controls>
    </div>
  )
}

/** 指数分布。t より右の面積が「t 分以上待つ確率」= e^{−λt} */
export function ExponentialExplorer() {
  const [lambda, setLambda] = useState(0.5)
  const [t, setT] = useState(2)
  const f = (x: number) => exponentialPdf(x, lambda)
  return (
    <div>
      <Plot x={[0, 12]} y={[0, 1.6]} xLabel="待ち時間 x（分）">
        <Area f={f} from={t} to={12} color="c2" opacity={0.4} />
        <Curve f={f} from={0} />
        <VLine x={t} color="c2" label={`t = ${t}`} />
        <VLine x={1 / lambda} color="c3" label={`平均 1/λ = ${round(1 / lambda, 2)}`} />
      </Plot>
      <p className="figure-readout">
        <M>{`P(X > ${t}) = e^{-${lambda} \\times ${t}}`}</M> = <strong>{round(Math.exp(-lambda * t), 4)}</strong>
        <br />
        期待値 <M>{'1/\\lambda'}</M> = <strong>{round(1 / lambda, 3)}</strong>　分散 <M>{'1/\\lambda^2'}</M> = <strong>{round(1 / lambda ** 2, 3)}</strong>
      </p>
      <Controls>
        <Slider label="1分あたりの平均回数 λ" value={lambda} min={0.2} max={1.5} step={0.1} onChange={(v) => setLambda(round(v, 1))} format={(v) => v.toFixed(1)} />
        <Slider label="待ち時間 t" value={t} min={0} max={10} step={0.5} onChange={setT} format={(v) => `${v}分`} />
      </Controls>
    </div>
  )
}

// 同じ一様乱数の列を使い、λ を変えても「同じ偶然」を縮めたり伸ばしたりするだけにする
const ARRIVAL_U = (() => {
  const rng = createRng(7)
  return Array.from({ length: 80 }, () => 1 - rng())
})()

/** 1時間の客の到着。到着の回数はポアソン分布、到着の間隔は指数分布に従う */
export function ArrivalTimeline() {
  const [rate, setRate] = useState(6)
  const perMin = rate / 60
  const times: number[] = []
  let now = 0
  for (const u of ARRIVAL_U) {
    now += -Math.log(u) / perMin
    if (now > 60) break
    times.push(now)
  }
  const showGaps = times.length <= 10
  return (
    <div>
      <Plot x={[0, 60]} y={[0, 2]} height={140} hideY grid={false} xTicks={[0, 10, 20, 30, 40, 50, 60]} xLabel="時刻（分）">
        <Segment x1={0} y1={1} x2={60} y2={1} color="muted" />
        {showGaps &&
          times.map((x, i) => {
            const prev = i === 0 ? 0 : times[i - 1]
            return (
              <g key={i}>
                <Segment x1={prev} y1={0.45} x2={x} y2={0.45} color="c3" width={2} />
                <Label x={(prev + x) / 2} y={0.45} dy={-6}>
                  {round(x - prev, 1)}
                </Label>
              </g>
            )
          })}
        <Points data={times.map((x) => ({ x, y: 1 }))} color="c2" r={7} opacity={0.9} />
      </Plot>
      <p className="figure-readout">
        この1時間に来た客 <strong>{times.length}人</strong>（回数 → ポアソン分布、平均 {rate} 人）
        <br />
        客と客の間の時間 → 指数分布、平均 <strong>{round(60 / rate, 1)}分</strong>
        {showGaps ? '（緑の線と数字が間隔）' : '（人数が多いと間隔の数字は省略）'}
      </p>
      <Controls>
        <Slider label="1時間あたりの平均人数" value={rate} min={2} max={20} step={1} onChange={setRate} format={(v) => `${v}人`} />
      </Controls>
    </div>
  )
}

const GAPS = (() => {
  const rng = createRng(11)
  return Array.from({ length: 500 }, () => -Math.log(1 - rng()) / 0.1)
})()

/** 平均10分間隔の到着を500回分集めたヒストグラムと、指数分布の曲線 */
export function GapHistogram() {
  const width = 2.5
  const bars = binData(GAPS, 0, width, 20).map((b) => ({ x: b.x, y: b.y / (GAPS.length * width) }))
  return (
    <div>
      <Plot x={[0, 50]} y={[0, 0.11]} xLabel="間隔（分）" hideY>
        <Bars data={bars} width={width * 0.92} color="c1" opacity={0.6} />
        <Curve f={(x) => exponentialPdf(x, 0.1)} from={0} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '実際の間隔（500回分）のヒストグラム' },
          { color: 'c2', label: '指数分布 λ = 0.1（平均10分）' },
        ]}
      />
    </div>
  )
}
