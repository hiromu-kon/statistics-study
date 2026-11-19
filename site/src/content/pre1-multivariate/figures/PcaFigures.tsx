import { useMemo, useState } from 'react'
import { Controls, DataTable, Slider } from '../../../components/blocks'
import { Bars, HLine, Label, Plot, Points, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { eigenSym2, whitenedPair } from './linalg'

/**
 * 標準化した2変数の散布図に、主成分の軸を重ねる。
 * 相関係数 ρ の相関行列の固有値は 1 ± ρ、固有ベクトルは (1, 1)/√2 と (1, −1)/√2 なので、
 * 軸の長さ（± 2 × 主成分の標準偏差）がスライダーで変わる様子を見せられる。
 */
export function PcaAxes() {
  const [rho, setRho] = useState(0.7)
  const { z1, z2 } = useMemo(() => whitenedPair(60, 11), [])
  const pts = z1.map((a, i) => ({ x: a, y: rho * a + Math.sqrt(1 - rho * rho) * z2[i] }))
  const { values, vectors } = eigenSym2(1, rho, 1)
  const [l1, l2] = values
  const [v1, v2] = vectors
  const len1 = 2 * Math.sqrt(l1)
  const len2 = 2 * Math.sqrt(Math.max(l2, 0))
  return (
    <div>
      <Plot x={[-3.2, 3.2]} y={[-3.2, 3.2]} width={420} height={410} xLabel="変数1（標準化）" yLabel="変数2" xTicks={[-3, -2, -1, 0, 1, 2, 3]} yTicks={[-3, -2, -1, 0, 1, 2, 3]}>
        <Points data={pts} color="muted" r={3.5} opacity={0.6} />
        <Segment x1={-len1 * v1[0]} y1={-len1 * v1[1]} x2={len1 * v1[0]} y2={len1 * v1[1]} color="c1" width={4} arrow />
        <Segment x1={-len2 * v2[0]} y1={-len2 * v2[1]} x2={len2 * v2[0]} y2={len2 * v2[1]} color="c2" width={4} arrow />
        <Label x={len1 * v1[0]} y={len1 * v1[1]} dy={-10} color="c1">
          第1主成分
        </Label>
        <Label x={len2 * v2[0]} y={len2 * v2[1]} dy={-10} color="c2">
          第2主成分
        </Label>
      </Plot>
      <p className="figure-readout">
        固有値（主成分の分散）λ₁ = <strong>{round(l1, 2)}</strong>、λ₂ = <strong>{round(l2, 2)}</strong>　／　第1主成分の寄与率 ={' '}
        <strong>{round((l1 / 2) * 100, 1)}%</strong>
        <br />
        <span className="small muted">
          {Math.abs(rho) < 0.001
            ? 'ρ = 0 では2つの固有値が等しく、どの向きも同じだけ広がっている（軸の向きが1つに決まらない）'
            : `第1主成分の向き (${round(v1[0], 3)}, ${round(v1[1], 3)})。矢印の長さは ±2 × 主成分の標準偏差（√λ）`}
        </span>
      </p>
      <Controls>
        <Slider label="相関係数 ρ" value={rho} min={-0.95} max={0.95} step={0.05} onChange={setRho} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

/**
 * 2つめの変数の単位を変える（k 倍する）と、分散共分散行列から求めた第1主成分は
 * 分散の大きい変数のほうへ傾くが、相関行列から求めたものは変わらない。
 * もとの分散共分散行列は本文の例 [[2, 1.2], [1.2, 2]]（n で割ったもの）。
 */
export function ScaleEffect() {
  const [k, setK] = useState(1)
  const cov = eigenSym2(2, 1.2 * k, 2 * k * k)
  const cor = eigenSym2(1, 0.6, 1)
  const share = (v: [number, number]) => `${round((v[0] / (v[0] + v[1])) * 100, 1)}%`
  const arrow = (v: [number, number]) => `(${round(v[0], 3)}, ${round(v[1], 3)})`
  return (
    <div>
      <Plot x={[-0.2, 1.2]} y={[-0.2, 1.2]} width={360} height={350} xLabel="数学の成分" yLabel="理科の成分" xTicks={[0, 0.5, 1]} yTicks={[0, 0.5, 1]}>
        <Segment x1={0} y1={0} x2={cor.vectors[0][0]} y2={cor.vectors[0][1]} color="c2" width={3} arrow dashed />
        <Segment x1={0} y1={0} x2={cov.vectors[0][0]} y2={cov.vectors[0][1]} color="c1" width={4} arrow />
        <Label x={cor.vectors[0][0]} y={cor.vectors[0][1]} dy={-10} color="c2">
          相関行列
        </Label>
        <Label x={cov.vectors[0][0]} y={cov.vectors[0][1]} dy={18} anchor="end" color="c1">
          分散共分散行列
        </Label>
      </Plot>
      <DataTable
        head={['使う行列', '第1主成分の係数（数学, 理科）', '第1主成分の寄与率']}
        rows={[
          ['分散共分散行列', arrow(cov.vectors[0]), share(cov.values)],
          ['相関行列', arrow(cor.vectors[0]), share(cor.values)],
        ]}
      />
      <Controls>
        <Slider label="理科の点数を k 倍して記録" value={k} min={0.2} max={5} step={0.1} onChange={setK} format={(v) => `${v.toFixed(1)}倍`} />
      </Controls>
    </div>
  )
}

/** 固有値を大きい順に並べた棒グラフ（スクリープロット）。固有値 1 の線を引く */
export function ScreePlot({ values }: { values: number[] }) {
  const total = values.reduce((s, v) => s + v, 0)
  const cums = values.map((_, i) => values.slice(0, i + 1).reduce((s, v) => s + v, 0))
  return (
    <div>
      <Plot x={[0.4, values.length + 0.6]} y={[0, Math.ceil(Math.max(...values) + 0.5)]} width={420} height={240} xTicks={values.map((_, i) => i + 1)} xLabel="主成分の番号" yLabel="固有値">
        <Bars data={values.map((v, i) => ({ x: i + 1, y: v }))} width={0.55} color="c1" labels={(v) => String(round(v, 2))} highlight={(x) => values[x - 1] >= 1} highlightColor="c2" />
        <HLine y={1} color="c4" label="固有値 1" />
      </Plot>
      <p className="figure-readout small">
        累積寄与率：
        {cums.map((cum, i) => (
          <span key={i}>
            {i > 0 && '　'}第{i + 1}まで <strong>{round((cum / total) * 100, 1)}%</strong>
          </span>
        ))}
      </p>
    </div>
  )
}
