import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Bars, Curve, HLine, Legend, Plot, type Color } from '../../../components/charts/Plot'
import { createRng, poissonPmf, round } from '../../../lib/stats'
import { Choice, Polyline } from './parts'

const PATH_COLORS: Color[] = ['c1', 'c2', 'c3', 'c4', 'c5']

/** 一様乱数の列。p を変えても「同じ偶然」で比べられるように、経路ごとにシードを固定して先に作っておく */
function uniforms(seed: number, n: number): number[] {
  const rng = createRng(seed)
  return Array.from({ length: n }, () => rng())
}

/** 1次元のランダムウォーク。+1 の確率 p を動かすと、経路の傾きとばらつきの帯が変わる */
export function RandomWalkPaths() {
  const steps = 100
  const [p, setP] = useState(0.5)
  const [round0, setRound0] = useState(1)
  const us = useMemo(() => PATH_COLORS.map((_, k) => uniforms(round0 * 10 + k, steps)), [round0])
  const paths = us.map((u) => {
    const pts = [{ x: 0, y: 0 }]
    let s = 0
    u.forEach((v, i) => {
      s += v < p ? 1 : -1
      pts.push({ x: i + 1, y: s })
    })
    return pts
  })
  const q = 1 - p
  const drift = 2 * p - 1
  const meanAt = (n: number) => n * drift
  const sdAt = (n: number) => Math.sqrt(4 * n * p * q)
  const finals = paths.map((pts) => pts[pts.length - 1].y)
  return (
    <div>
      <Plot x={[0, steps]} y={[-60, 60]} height={280} xLabel="ステップ数 n" yLabel="位置 S_n">
        <HLine y={0} color="muted" dashed={false} />
        <Curve f={(n) => meanAt(n) + 2 * sdAt(Math.max(n, 0))} color="muted" dashed width={1.5} />
        <Curve f={(n) => meanAt(n) - 2 * sdAt(Math.max(n, 0))} color="muted" dashed width={1.5} />
        <Curve f={meanAt} color="ink" dashed width={2} />
        {paths.map((pts, k) => (
          <Polyline key={k} points={pts} color={PATH_COLORS[k]} width={1.8} opacity={0.85} />
        ))}
      </Plot>
      <Legend
        items={[
          { color: 'ink', label: '期待値 n(2p−1)' },
          { color: 'muted', label: '期待値 ± 2 × 標準偏差' },
        ]}
      />
      <p className="figure-readout">
        n = 100 のとき：期待値 <M>{'n(2p-1)'}</M> = <strong>{round(meanAt(steps), 1)}</strong>、分散 <M>{'4np(1-p)'}</M> ={' '}
        <strong>{round(sdAt(steps) ** 2, 1)}</strong>、標準偏差 = <strong>{round(sdAt(steps), 2)}</strong>
        <br />
        5本の経路の 100 ステップ後の位置：{finals.join('、')}
      </p>
      <Controls>
        <Slider label="+1 に進む確率 p" value={p} min={0.3} max={0.7} step={0.05} onChange={(v) => setP(round(v, 2))} format={(v) => v.toFixed(2)} />
        <Button onClick={() => setRound0((r) => r + 1)}>別の経路を引く</Button>
      </Controls>
    </div>
  )
}

/** ポアソン過程の経路。到着間隔を指数分布から引き、到着のたびに 1 段上がる階段を描く */
export function PoissonProcessPaths() {
  const horizon = 10
  const [lambda, setLambda] = useState(1)
  const [round0, setRound0] = useState(1)
  // 指数分布の乱数は −log(U)/λ。同じ U を使うので、λ を変えると同じ偶然が縮んだり伸びたりする
  const us = useMemo(() => [0, 1, 2].map((k) => uniforms(round0 * 7 + k, 200).map((u) => 1 - u)), [round0])
  const paths = us.map((u) => {
    const times: number[] = []
    let t = 0
    for (const v of u) {
      t += -Math.log(v) / lambda
      if (t > horizon) break
      times.push(t)
    }
    const pts = [{ x: 0, y: 0 }]
    times.forEach((tt, i) => {
      pts.push({ x: tt, y: i })
      pts.push({ x: tt, y: i + 1 })
    })
    pts.push({ x: horizon, y: times.length })
    return { pts, count: times.length }
  })
  const mean = lambda * horizon
  const yMax = Math.ceil(mean + 4 * Math.sqrt(mean) + 2)
  return (
    <div>
      <Plot x={[0, horizon]} y={[0, yMax]} height={260} xLabel="時刻 t（時間）" yLabel="N(t)">
        <Curve f={(t) => lambda * t} color="ink" dashed width={2} />
        {paths.map((p, k) => (
          <Polyline key={k} points={p.pts} color={PATH_COLORS[k]} width={2} />
        ))}
      </Plot>
      <Legend items={[{ color: 'ink', label: '期待値 E[N(t)] = λt' }]} />
      <p className="figure-readout">
        3本の経路の <M>{'N(10)'}</M>（10 時間で来た数）：<strong>{paths.map((p) => p.count).join('、')}</strong>（期待値 <M>{'10\\lambda'}</M> ={' '}
        {round(mean, 1)}）
        <br />
        段と段の間の横の長さ（到着間隔）は指数分布に従い、平均は <M>{'1/\\lambda'}</M> = {round(1 / lambda, 2)} 時間
      </p>
      <Controls>
        <Slider label="1時間あたりの平均回数 λ" value={lambda} min={0.5} max={3} step={0.5} onChange={setLambda} format={(v) => v.toFixed(1)} />
        <Button onClick={() => setRound0((r) => r + 1)}>別の経路を引く</Button>
      </Controls>
    </div>
  )
}

/** 長さ t の区間に来る数 N(t) の分布。λ = 2 のポアソン過程なら N(t) は平均 2t のポアソン分布 */
export function PoissonCountBars() {
  const lambda = 2
  const [t, setT] = useState(1)
  const m = lambda * t
  const data = Array.from({ length: 21 }, (_, k) => ({ x: k, y: poissonPmf(k, m) }))
  return (
    <div>
      <Plot x={[-0.5, 20.5]} y={[0, 0.4]} height={220} xLabel="区間に来た数 k" yLabel="確率" xTicks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}>
        <Bars data={data} color="c1" highlight={(k) => k === 0} highlightColor="c2" />
      </Plot>
      <p className="figure-readout">
        <M>{'N(t)'}</M> は平均 <M>{'\\lambda t'}</M> = <strong>{round(m, 1)}</strong> のポアソン分布（分散も {round(m, 1)}）
        <br />
        0 件の確率 <M>{'e^{-\\lambda t}'}</M> = <strong>{round(Math.exp(-m), 4)}</strong>（＝最初の到着まで t より長く待つ確率。オレンジの棒）
      </p>
      <Controls>
        <Slider label="区間の長さ t（時間）" value={t} min={0.5} max={5} step={0.5} onChange={setT} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** ランダムウォークの刻みを細かくすると、ブラウン運動に近づく。1 単位時間に n 歩、1歩の大きさ 1/√n */
export function BrownianScaling() {
  const horizon = 4
  const [n, setN] = useState(10)
  const [round0, setRound0] = useState(1)
  const total = n * horizon
  const us = useMemo(() => [0, 1, 2, 3].map((k) => uniforms(round0 * 13 + k, 500 * 4)), [round0])
  const size = 1 / Math.sqrt(n)
  const paths = us.map((u) => {
    const pts = [{ x: 0, y: 0 }]
    let s = 0
    for (let i = 0; i < total; i++) {
      s += u[i] < 0.5 ? size : -size
      pts.push({ x: (i + 1) / n, y: s })
    }
    return pts
  })
  return (
    <div>
      <Controls>
        <span className="small muted">1 単位時間あたりの歩数 n：</span>
        <Choice
          options={[
            { value: 10, label: '10 歩' },
            { value: 50, label: '50 歩' },
            { value: 500, label: '500 歩' },
          ]}
          value={n}
          onChange={setN}
        />
      </Controls>
      <Plot x={[0, horizon]} y={[-5, 5]} height={260} xLabel="時刻 t" yLabel="位置">
        <HLine y={0} color="muted" dashed={false} />
        <Curve f={(t) => 2 * Math.sqrt(Math.max(t, 0))} color="muted" dashed width={1.5} />
        <Curve f={(t) => -2 * Math.sqrt(Math.max(t, 0))} color="muted" dashed width={1.5} />
        {paths.map((pts, k) => (
          <Polyline key={k} points={pts} color={PATH_COLORS[k]} width={1.6} opacity={0.9} />
        ))}
      </Plot>
      <Legend items={[{ color: 'muted', label: '±2√t（時刻 t の標準偏差 √t の 2 倍）' }]} />
      <p className="figure-readout">
        1 歩の大きさ <M>{'1/\\sqrt{n}'}</M> = {round(size, 3)}、時刻 t までの歩数 nt。位置の分散は <M>{'nt \\times (1/\\sqrt{n})^2 = t'}</M> で、n によらない。
        <br />
        n を大きくすると、カクカクした折れ線が、どこを拡大してもギザギザした連続な線（ブラウン運動）に近づく。
      </p>
      <Controls>
        <Button onClick={() => setRound0((r) => r + 1)}>別の経路を引く</Button>
      </Controls>
    </div>
  )
}
