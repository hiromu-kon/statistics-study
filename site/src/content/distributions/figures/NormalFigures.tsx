import { useState } from 'react'
import { Controls, DataTable, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Area, Curve, Legend, Plot, VLine } from '../../../components/charts/Plot'
import { normalCdf, normalPdf, round } from '../../../lib/stats'

/** テストの点数を N(μ, σ²) と見て、μ（山の位置）と σ（山の幅）を動かす。点線は N(60, 10²) */
export function NormalExplorer() {
  const [mu, setMu] = useState(60)
  const [sigma, setSigma] = useState(10)
  const f = (x: number) => normalPdf(x, mu, sigma)
  return (
    <div>
      <Plot x={[0, 100]} y={[0, 0.105]} xLabel="点数" hideY>
        <Area f={f} from={mu - sigma} to={mu + sigma} color="c1" opacity={0.25} />
        <Curve f={(x) => normalPdf(x, 60, 10)} color="muted" dashed width={1.8} />
        <Curve f={f} />
        <VLine x={mu} color="c2" label={`μ = ${mu}`} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `N(${mu}, ${sigma}²)（塗った部分が μ ± σ）` },
          { color: 'muted', label: '基準の N(60, 10²)' },
        ]}
      />
      <p className="figure-readout">
        山の頂上の位置 = μ = <strong>{mu}</strong>　山の幅の目安 = σ = <strong>{sigma}</strong>　頂上の高さ{' '}
        <M>{'1/(\\sigma\\sqrt{2\\pi})'}</M> = <strong>{round(normalPdf(mu, mu, sigma), 4)}</strong>
      </p>
      <Controls>
        <Slider label="平均 μ" value={mu} min={30} max={90} step={1} onChange={setMu} />
        <Slider label="標準偏差 σ" value={sigma} min={4} max={20} step={1} onChange={setSigma} />
      </Controls>
    </div>
  )
}

/** 標準正規分布表（上側確率）の一部を切り出し、z の行と列を強調する */
export function ZTableExcerpt({ z }: { z: number }) {
  const rowZ = Math.floor(round(z * 10, 6)) / 10
  const col = Math.round((z - rowZ) * 100)
  const rows = [rowZ - 0.1, rowZ, rowZ + 0.1].filter((r) => r >= 0)
  const cols = Array.from({ length: 10 }, (_, j) => j)
  return (
    <DataTable
      head={['z', ...cols.map((j) => (j === col ? <strong key={j}>.0{j}</strong> : `.0${j}`))]}
      rows={rows.map((r) => [
        <strong key="z">{r.toFixed(1)}</strong>,
        ...cols.map((j) => {
          const v = (1 - normalCdf(round(r + j / 100, 2))).toFixed(4)
          return round(r, 1) === round(rowZ, 1) && j === col ? (
            <span key={j} className="mark mark-c2">
              <strong>{v}</strong>
            </span>
          ) : (
            v
          )
        }),
      ])}
      highlight={[rows.findIndex((r) => round(r, 1) === round(rowZ, 1))]}
      caption={`上側確率 Q(z) の表（一部）。z = ${z.toFixed(2)} は「${rowZ.toFixed(1)} の行」と「.0${col} の列」`}
    />
  )
}

/** ±kσ に入る割合。k をスライダーで 0.5 刻みに動かす */
export function SigmaRule() {
  const [k, setK] = useState(1)
  const p = normalCdf(k) - normalCdf(-k)
  return (
    <div>
      <Plot x={[-4, 4]} y={[0, 0.45]} hideY xTicks={[-3, -2, -1, 0, 1, 2, 3]} xTickFormat={(v) => (v === 0 ? 'μ' : `μ${v > 0 ? '+' : '−'}${Math.abs(v)}σ`)}>
        <Area f={(x) => normalPdf(x)} from={-k} to={k} color="c1" opacity={0.35} />
        <Curve f={(x) => normalPdf(x)} />
        <VLine x={-k} color="c2" />
        <VLine x={k} color="c2" />
      </Plot>
      <p className="figure-readout">
        μ ± {k}σ の範囲に入る割合 = <strong>{round(p * 100, 1)}%</strong>　はみ出す割合 = {round((1 - p) * 100, 1)}%（左右に {round(((1 - p) / 2) * 100, 2)}% ずつ）
      </p>
      <Controls>
        <Slider label="k（σ の何個分か）" value={k} min={0.5} max={3} step={0.5} onChange={setK} format={(v) => `${v}σ`} />
      </Controls>
    </div>
  )
}

/** 両側のしっぽ P(|Z| ≥ z) を塗る（NormalArea は1つの区間しか塗れないため） */
export function TwoTails({ z }: { z: number }) {
  const f = (x: number) => normalPdf(x)
  return (
    <div>
      <Plot x={[-4, 4]} y={[0, 0.46]} hideY xTicks={[-3, -2, -1, 0, 1, 2, 3]}>
        <Area f={f} from={-4} to={-z} color="c1" opacity={0.35} />
        <Area f={f} from={z} to={4} color="c1" opacity={0.35} />
        <Curve f={f} />
        <VLine x={-z} color="c2" />
        <VLine x={z} color="c2" />
      </Plot>
      <p className="figure-readout">
        塗った部分の面積 = 確率 ≒ <strong>{round(2 * (1 - normalCdf(z)), 4)}</strong>
      </p>
    </div>
  )
}
