import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Bars, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { binomialPmf, geometricPmf, round } from '../../../lib/stats'
import { hypergeometricPmf, intTicks, negativeBinomialPmf, range } from './discrete'

/** 幾何分布（初めて成功するまでの試行回数）。p が小さいほど、長く待つことになる */
export function GeometricExplorer({ p0 = 0.3 }: { p0?: number }) {
  const [p, setP] = useState(p0)
  const kmax = 25
  const data = range(1, kmax).map((k) => ({ x: k, y: geometricPmf(k, p) }))
  return (
    <div>
      <Plot x={[0.3, kmax + 0.7]} y={[0, p * 1.2]} xTicks={intTicks(0, kmax).filter((t) => t > 0)} xLabel="初めて成功した試行が何回目か k">
        <Bars data={data} />
        <VLine x={1 / p} label={`期待値 1/p = ${round(1 / p, 2)}`} />
      </Plot>
      <p className="figure-readout">
        期待値 <M>{'1/p'}</M> = <strong>{round(1 / p, 2)}</strong>　分散 <M>{'(1-p)/p^2'}</M> = <strong>{round((1 - p) / p ** 2, 2)}</strong>
      </p>
      <Controls>
        <Slider label="成功確率 p" value={p} min={0.05} max={0.9} step={0.05} onChange={setP} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

/**
 * 幾何分布の無記憶性。m 回失敗したあとの「残りの回数」の分布は、最初の分布とまったく同じ形になる。
 */
export function GeometricMemoryless() {
  const [p, setP] = useState(0.3)
  const [m, setM] = useState(3)
  const kmax = 18
  const all = range(1, kmax).map((k) => ({ x: k, y: geometricPmf(k, p) }))
  const survive = (1 - p) ** m
  const rest = range(1, kmax - m).map((j) => ({ x: j, y: geometricPmf(m + j, p) / survive }))
  const original = range(1, kmax - m).map((j) => ({ x: j, y: geometricPmf(j, p) }))
  const ticks = intTicks(0, kmax).filter((t) => t > 0)
  return (
    <div>
      <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>
        ① もとの分布：オレンジは「{m}回目まで失敗した」あとに起こりうる部分
      </p>
      <Plot x={[0.3, kmax + 0.7]} y={[0, p * 1.2]} height={200} xTicks={ticks}>
        <Bars data={all} color="muted" highlight={(k) => k > m} highlightColor="c2" />
        {m > 0 && <VLine x={m + 0.5} color="ink" label={`ここまで${m}回失敗`} />}
      </Plot>
      <p className="small muted" style={{ textAlign: 'center', margin: '8px 0 0' }}>
        ② オレンジ部分を左に{m}つずらし、合計が1になるよう {round(1 / survive, 2)} 倍に拡大したもの（点はもとの分布）
      </p>
      <Plot x={[0.3, kmax + 0.7]} y={[0, p * 1.2]} height={200} xTicks={ticks} xLabel="あと何回目で成功するか j">
        <Bars data={rest} color="c2" />
        <Points data={original} color="c1" r={6} opacity={0.95} />
      </Plot>
      <Legend
        items={[
          { color: 'c2', label: `P(X = ${m} + j | X > ${m})` },
          { color: 'c1', label: 'P(X = j)（もとの分布）' },
        ]}
      />
      <p className="figure-readout">
        <M>{`P(X > ${m}) = (1-p)^{${m}} = ${round(survive, 4)}`}</M>
      </p>
      <Controls>
        <Slider label="成功確率 p" value={p} min={0.1} max={0.6} step={0.05} onChange={setP} format={(v) => v.toFixed(2)} />
        <Slider label="すでに失敗した回数 m" value={m} min={0} max={8} step={1} onChange={setM} />
      </Controls>
    </div>
  )
}

/** 負の二項分布（r 回成功するまでの試行回数）。r = 1 のときが幾何分布 */
export function NegativeBinomialExplorer() {
  const [r, setR] = useState(3)
  const [p, setP] = useState(0.4)
  const kmax = 40
  const data = range(1, kmax).map((k) => ({ x: k, y: negativeBinomialPmf(k, r, p) }))
  const ymax = Math.max(...data.map((d) => d.y))
  return (
    <div>
      <Plot x={[0.3, kmax + 0.7]} y={[0, ymax * 1.2]} xTicks={intTicks(0, kmax).filter((t) => t > 0)} xLabel={`${r}回目の成功が何回目の試行で起こるか k`}>
        <Bars data={data} />
        <VLine x={r / p} label={`期待値 r/p = ${round(r / p, 2)}`} />
      </Plot>
      <p className="figure-readout">
        期待値 <M>{'r/p'}</M> = <strong>{round(r / p, 2)}</strong>　分散 <M>{'r(1-p)/p^2'}</M> = <strong>{round((r * (1 - p)) / p ** 2, 2)}</strong>
        {r === 1 && '　（r = 1 は幾何分布）'}
      </p>
      <Controls>
        <Slider label="目標の成功回数 r" value={r} min={1} max={6} step={1} onChange={setR} />
        <Slider label="成功確率 p" value={p} min={0.15} max={0.9} step={0.05} onChange={setP} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

/**
 * 戻さない（超幾何分布）と戻す（二項分布）の比較。当たりの割合は 30% に固定。
 * 全体の数 N が取り出す数 n に比べて大きいほど、2つはほぼ同じになる。
 */
export function HypergeometricCompare() {
  const [N, setN] = useState(20)
  const [n, setNDraw] = useState(5)
  const M_ = Math.round(N * 0.3)
  const p = M_ / N
  const ks = range(0, n)
  const hyper = ks.map((k) => ({ x: k - 0.2, y: hypergeometricPmf(k, N, M_, n) }))
  const binom = ks.map((k) => ({ x: k + 0.2, y: binomialPmf(k, n, p) }))
  const ymax = Math.max(...hyper.map((d) => d.y), ...binom.map((d) => d.y))
  const fpc = (N - n) / (N - 1)
  const vb = n * p * (1 - p)
  return (
    <div>
      <Plot x={[-0.7, n + 0.7]} y={[0, ymax * 1.15]} xTicks={intTicks(0, n)} xLabel="当たりの本数 k">
        <Bars data={hyper} width={0.38} color="c1" />
        <Bars data={binom} width={0.38} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '戻さない（超幾何分布）' },
          { color: 'c2', label: '毎回戻す（二項分布）' },
        ]}
      />
      <p className="figure-readout">
        くじ {N} 本（当たり {M_} 本）から {n} 本引く　期待値はどちらも <strong>{round(n * p, 2)}</strong>
        <br />
        分散：戻さない <strong>{round(vb * fpc, 3)}</strong>　毎回戻す <strong>{round(vb, 3)}</strong>　（修正の係数{' '}
        <M>{`\\tfrac{N-n}{N-1} = ${round(fpc, 3)}`}</M>）
      </p>
      <Controls>
        <Slider label="くじの総数 N" value={N} min={10} max={200} step={10} onChange={setN} format={(v) => `${v}本`} />
        <Slider label="引く本数 n" value={n} min={1} max={10} step={1} onChange={setNDraw} format={(v) => `${v}本`} />
      </Controls>
    </div>
  )
}
