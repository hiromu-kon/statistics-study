import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Bars, Plot, VLine } from '../../../components/charts/Plot'
import { binomialPmf, combination, round } from '../../../lib/stats'
import { intTicks, range } from './discrete'

/** 二項分布 B(n, p) の棒グラフ。n と p を動かすと山の位置と広がりが変わる */
export function BinomialExplorer({ n0 = 10, p0 = 0.5 }: { n0?: number; p0?: number }) {
  const [n, setN] = useState(n0)
  const [p, setP] = useState(p0)
  const data = range(0, n).map((k) => ({ x: k, y: binomialPmf(k, n, p) }))
  const ymax = Math.max(...data.map((d) => d.y))
  return (
    <div>
      <Plot x={[-0.7, n + 0.7]} y={[0, ymax * 1.25]} xTicks={intTicks(0, n)} xLabel="成功の回数 k">
        <Bars data={data} labels={n <= 10 ? (y) => y.toFixed(3) : undefined} />
        <VLine x={n * p} label={`期待値 np = ${round(n * p, 2)}`} />
      </Plot>
      <p className="figure-readout">
        期待値 <M>np</M> = <strong>{round(n * p, 2)}</strong>　分散 <M>{'np(1-p)'}</M> = <strong>{round(n * p * (1 - p), 3)}</strong>　標準偏差 ={' '}
        <strong>{round(Math.sqrt(n * p * (1 - p)), 3)}</strong>
      </p>
      <Controls>
        <Slider label="試行回数 n" value={n} min={1} max={40} step={1} onChange={setN} />
        <Slider label="成功確率 p" value={p} min={0.05} max={0.95} step={0.05} onChange={setP} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

function Chip({ success }: { success: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 28,
        height: 28,
        lineHeight: '28px',
        margin: 2,
        borderRadius: '50%',
        textAlign: 'center',
        fontWeight: 700,
        background: success ? 'var(--c1)' : 'var(--surface-2)',
        color: success ? 'var(--surface)' : 'var(--ink-2)',
        border: '1px solid var(--line)',
      }}
    >
      {success ? '○' : '×'}
    </span>
  )
}

/**
 * n 回中ちょうど k 回成功する「並び方」を全部並べる図。
 * 二項分布の式が「並び方の数 × 1通りの確率」になっていることを見せる。
 */
export function SequenceList({ n = 4 }: { n?: number }) {
  const [k, setK] = useState(2)
  const [p, setP] = useState(0.7)
  const seqs = range(0, 2 ** n - 1)
    .map((mask) => range(0, n - 1).map((i) => ((mask >> (n - 1 - i)) & 1) === 1))
    .filter((s) => s.filter(Boolean).length === k)
  const one = p ** k * (1 - p) ** (n - k)
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', justifyContent: 'center', margin: '8px 0' }}>
        {seqs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>
              {s.map((b, j) => (
                <Chip key={j} success={b} />
              ))}
            </span>
            <span className="small muted">{one.toFixed(4)}</span>
          </div>
        ))}
      </div>
      <p className="figure-readout">
        並び方 <M>{`{}_{${n}}C_{${k}} = ${combination(n, k)}`}</M> 通り × 1通りの確率 <M>{`${p.toFixed(1)}^{${k}} \\times ${(1 - p).toFixed(1)}^{${n - k}}`}</M>{' '}
        = <strong>{round(combination(n, k) * one, 4)}</strong>
      </p>
      <Controls>
        <Slider label="成功の回数 k" value={k} min={0} max={n} step={1} onChange={setK} />
        <Slider label="成功確率 p" value={p} min={0.1} max={0.9} step={0.1} onChange={(v) => setP(round(v, 1))} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
