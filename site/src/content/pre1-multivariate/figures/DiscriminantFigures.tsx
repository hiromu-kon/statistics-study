import { useMemo, useState } from 'react'
import { Button, Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Area, Curve, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { createRng, normalCdf, normalPdf, normalQuantile, randomNormal, round } from '../../../lib/stats'
import type { Vec2 } from './linalg'

// ---------- フィッシャーの線形判別 ----------

/**
 * 群 A：平均 (2, 3)、群 B：平均 (5, 4)、共通の分散共分散行列 [[2, 1], [1, 2]] から 25 点ずつ作る。
 * 本文の手計算と同じ設定。Σ = L Lᵀ となる L（コレスキー分解）で、独立な標準正規乱数を相関のある乱数に変える。
 */
function makeGroups(): { a: Vec2[]; b: Vec2[] } {
  const rng = createRng(21)
  const l11 = Math.sqrt(2)
  const l21 = 1 / Math.sqrt(2)
  const l22 = Math.sqrt(1.5)
  const draw = (m: Vec2): Vec2 => {
    const u = randomNormal(rng)
    const v = randomNormal(rng)
    return [m[0] + l11 * u, m[1] + l21 * u + l22 * v]
  }
  return { a: Array.from({ length: 25 }, () => draw([2, 3])), b: Array.from({ length: 25 }, () => draw([5, 4])) }
}

const meanOf = (ps: number[]) => ps.reduce((s, v) => s + v, 0) / ps.length
const varOf = (ps: number[]) => {
  const m = meanOf(ps)
  return ps.reduce((s, v) => s + (v - m) ** 2, 0) / ps.length
}

/** 射影の向き θ における「群の間の差² ÷ 群の中のばらつき」（フィッシャーの基準） */
function fisherRatio(a: Vec2[], b: Vec2[], th: number) {
  const w: Vec2 = [Math.cos(th), Math.sin(th)]
  const pa = a.map((p) => p[0] * w[0] + p[1] * w[1])
  const pb = b.map((p) => p[0] * w[0] + p[1] * w[1])
  return { w, pa, pb, ratio: (meanOf(pa) - meanOf(pb)) ** 2 / (varOf(pa) + varOf(pb)) }
}

export function FisherProjection() {
  const { a, b } = useMemo(() => makeGroups(), [])
  const best = useMemo(() => {
    let bt = 0
    let br = -1
    for (let d = 0; d < 180; d += 0.5) {
      const r = fisherRatio(a, b, (d * Math.PI) / 180).ratio
      if (r > br) {
        br = r
        bt = d
      }
    }
    return bt
  }, [a, b])
  const [deg, setDeg] = useState(90)
  const th = (deg * Math.PI) / 180
  const { w, pa, pb, ratio } = fisherRatio(a, b, th)
  const cut = (meanOf(pa) + meanOf(pb)) / 2
  const hi = meanOf(pb) > meanOf(pa)
  const miss = pa.filter((v) => (hi ? v > cut : v < cut)).length + pb.filter((v) => (hi ? v < cut : v > cut)).length
  // 判別の境界：射影した値が cut になる点の集まり（w に垂直な直線）
  const p0: Vec2 = [cut * w[0], cut * w[1]]
  const dir: Vec2 = [-w[1], w[0]]
  const lo = Math.min(...pa, ...pb) - 0.5
  const up = Math.max(...pa, ...pb) + 0.5
  return (
    <div>
      <Compare>
        <Card title="もとのデータと判別の境界">
          <Plot x={[-2, 9]} y={[-1.5, 8.5]} width={360} height={350} xLabel="変数1" yLabel="変数2">
            <Segment x1={p0[0] - 20 * dir[0]} y1={p0[1] - 20 * dir[1]} x2={p0[0] + 20 * dir[0]} y2={p0[1] + 20 * dir[1]} color="c4" width={2.5} dashed />
            <Segment x1={3.5 - 2.5 * w[0]} y1={3.5 - 2.5 * w[1]} x2={3.5 + 2.5 * w[0]} y2={3.5 + 2.5 * w[1]} color="ink" width={2.5} arrow />
            <Points data={a.map((p) => ({ x: p[0], y: p[1] }))} color="c1" r={4} />
            <Points data={b.map((p) => ({ x: p[0], y: p[1] }))} color="c2" r={4} />
          </Plot>
        </Card>
        <Card title="矢印の向きに射影した値（1次元）">
          <Plot x={[lo, up]} y={[0, 3]} width={360} height={170} hideY grid={false} xLabel="射影した値">
            <Points data={pa.map((v, i) => ({ x: v, y: 2 + ((i % 5) - 2) * 0.12 }))} color="c1" r={4} />
            <Points data={pb.map((v, i) => ({ x: v, y: 1 + ((i % 5) - 2) * 0.12 }))} color="c2" r={4} />
            <VLine x={cut} color="c4" />
            <Label x={lo} y={2.5} anchor="start" color="c1">
              群 A
            </Label>
            <Label x={lo} y={1.5} anchor="start" color="c2">
              群 B
            </Label>
          </Plot>
          <p className="figure-readout">
            フィッシャーの基準（差² ÷ ばらつき）= <strong>{round(ratio, 2)}</strong>
            <br />
            境界の反対側に入った点：<strong>{miss}</strong> / 50
          </p>
        </Card>
      </Compare>
      <Legend
        items={[
          { color: 'c1', label: '群 A' },
          { color: 'c2', label: '群 B' },
          { color: 'ink', label: '射影の向き' },
          { color: 'c4', label: '判別の境界（射影した群平均のまん中）' },
        ]}
      />
      <Controls>
        <Slider label="射影の向き" value={deg} min={0} max={179.5} step={0.5} onChange={setDeg} format={(v) => `${v.toFixed(1)}°`} />
        <Button variant="primary" onClick={() => setDeg(best)}>
          フィッシャーの向きにする
        </Button>
      </Controls>
    </div>
  )
}

// ---------- 2次判別（1次元で見る） ----------

/**
 * 群 A：N(0, 1)、群 B：N(2, s²)。事前確率が等しいとき、密度が等しくなる点が判別の境界。
 * 対数をとると (1 − s²)x² − 4x + 4 + 2s² log s = 0 という2次方程式になる。
 */
export function QuadraticBoundary1D() {
  const [s, setS] = useState(2)
  let roots: number[]
  if (Math.abs(s - 1) < 1e-9) roots = [1]
  else {
    const A = 1 - s * s
    const B = -4
    const C = 4 + 2 * s * s * Math.log(s)
    const D = Math.sqrt(B * B - 4 * A * C)
    roots = [(-B - D) / (2 * A), (-B + D) / (2 * A)].sort((p, q) => p - q)
  }
  const fa = (x: number) => normalPdf(x, 0, 1)
  const fb = (x: number) => normalPdf(x, 2, s)
  return (
    <div>
      <Plot x={[-5, 8]} y={[0, 0.45]} width={560} height={260} xLabel="x" hideY>
        <Area f={fa} from={-5} to={8} color="c1" opacity={0.15} />
        <Area f={fb} from={-5} to={8} color="c2" opacity={0.15} />
        <Curve f={fa} color="c1" />
        <Curve f={fb} color="c2" />
        {roots.map((r) => (
          <VLine key={r} x={r} color="c4" label={`境界 ${round(r, 2)}`} />
        ))}
      </Plot>
      <p className="figure-readout">
        {roots.length === 1
          ? 'ばらつきが同じなら境界は1か所（x = 1）：ここより左を A、右を B と判定する（線形判別）'
          : `境界は2か所：${round(roots[0], 2)} より左と ${round(roots[1], 2)} より右を B、その間を A と判定する（2次判別）`}
      </p>
      <Legend
        items={[
          { color: 'c1', label: '群 A：平均 0・標準偏差 1' },
          { color: 'c2', label: `群 B：平均 2・標準偏差 ${s.toFixed(1)}` },
        ]}
      />
      <Controls>
        <Slider label="群 B の標準偏差" value={s} min={1} max={3} step={0.1} onChange={setS} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

// ---------- SVM（マージン最大化） ----------

const SVM_A: Vec2[] = [
  [1, 2],
  [2, 1],
  [1.5, 3.2],
  [2.6, 2.4],
  [0.8, 0.8],
  [3, 0.6],
]
const SVM_B: Vec2[] = [
  [4, 4],
  [5, 2.6],
  [4.6, 5],
  [3.4, 4.4],
  [5.6, 4.2],
  [4.4, 3],
]

function margin(deg: number) {
  const t = (deg * Math.PI) / 180
  const w: Vec2 = [Math.cos(t), Math.sin(t)]
  const pa = SVM_A.map((p) => p[0] * w[0] + p[1] * w[1])
  const pb = SVM_B.map((p) => p[0] * w[0] + p[1] * w[1])
  const aMax = Math.max(...pa)
  const bMin = Math.min(...pb)
  return { w, pa, pb, aMax, bMin, gap: bMin - aMax }
}

export function SvmMargin() {
  const best = useMemo(() => {
    let bd = 0
    let bg = -Infinity
    for (let d = 0; d < 180; d += 0.1) {
      const g = margin(d).gap
      if (g > bg) {
        bg = g
        bd = Math.round(d * 10) / 10
      }
    }
    return bd
  }, [])
  const [deg, setDeg] = useState(80)
  const { w, pa, pb, aMax, bMin, gap } = margin(deg)
  const dir: Vec2 = [-w[1], w[0]]
  const line = (c: number) => ({ x1: c * w[0] - 20 * dir[0], y1: c * w[1] - 20 * dir[1], x2: c * w[0] + 20 * dir[0], y2: c * w[1] + 20 * dir[1] })
  const atBest = Math.abs(deg - best) < 0.05
  // 向きは 0.1° 刻みなので、最大マージンの向きでも縁の3点がぴったり同じ値にはならない（0.002 ほどずれる）。0.01 までの差は「縁にある」とみなす
  const sv = (v: number, edge: number) => gap > 0 && Math.abs(v - edge) < 0.01
  return (
    <div>
      <Plot x={[0, 6.5]} y={[0, 6]} width={400} height={390} xLabel="変数1" yLabel="変数2">
        {gap > 0 && (
          <>
            <Segment {...line(aMax)} color="muted" width={1.5} dashed />
            <Segment {...line(bMin)} color="muted" width={1.5} dashed />
          </>
        )}
        <Segment {...line((aMax + bMin) / 2)} color={gap > 0 ? 'c4' : 'c5'} width={3} />
        <Points data={SVM_A.map((p) => ({ x: p[0], y: p[1] }))} color="c1" r={6} opacity={0.85} />
        <Points data={SVM_B.map((p) => ({ x: p[0], y: p[1] }))} color="c2" r={6} opacity={0.85} />
        <Points data={SVM_A.filter((_, i) => sv(pa[i], aMax)).map((p) => ({ x: p[0], y: p[1] }))} color="ink" r={10} opacity={0.25} />
        <Points data={SVM_B.filter((_, i) => sv(pb[i], bMin)).map((p) => ({ x: p[0], y: p[1] }))} color="ink" r={10} opacity={0.25} />
      </Plot>
      <p className="figure-readout">
        {gap > 0 ? (
          <>
            マージンの幅（2本の点線の間）= <strong>{round(gap, 3)}</strong>
            {atBest && '　← これが最大（灰色の丸がサポートベクトル）'}
          </>
        ) : (
          'この向きの直線では2群を分けきれない'
        )}
      </p>
      <Legend
        items={[
          { color: 'c1', label: '群 A' },
          { color: 'c2', label: '群 B' },
          { color: 'c4', label: '境界（2本の点線のまん中）' },
        ]}
      />
      <Controls>
        <Slider label="境界の傾き（法線の向き）" value={deg} min={0} max={179.9} step={0.1} onChange={setDeg} format={(v) => `${v.toFixed(1)}°`} />
        <Button variant="primary" onClick={() => setDeg(best)}>
          マージン最大にする
        </Button>
      </Controls>
    </div>
  )
}

// ---------- ROC 曲線 ----------

/**
 * 陰性のスコア ~ N(0, 1)、陽性のスコア ~ N(d, 1)。しきい値 c 以上を「陽性」と判定する。
 * 感度 = 1 − Φ(c − d)、偽陽性率 = 1 − Φ(c)、AUC = Φ(d / √2)。
 */
export function RocDemo() {
  const [c, setC] = useState(1)
  const [d, setD] = useState(1.5)
  const tpr = 1 - normalCdf(c - d)
  const fpr = 1 - normalCdf(c)
  const auc = normalCdf(d / Math.SQRT2)
  const roc = (f: number) => 1 - normalCdf(normalQuantile(1 - f) - d)
  return (
    <div>
      <Compare>
        <Card title="スコアの分布としきい値">
          <Plot x={[-3.5, 6]} y={[0, 0.45]} width={360} height={230} hideY xLabel="スコア">
            <Area f={(x) => normalPdf(x)} from={c} to={6} color="c1" opacity={0.3} />
            <Area f={(x) => normalPdf(x, d)} from={c} to={6} color="c2" opacity={0.3} />
            <Curve f={(x) => normalPdf(x)} color="c1" />
            <Curve f={(x) => normalPdf(x, d)} color="c2" />
            <VLine x={c} color="c4" label="しきい値" />
          </Plot>
          <Legend
            items={[
              { color: 'c1', label: '陰性（病気なし）' },
              { color: 'c2', label: '陽性（病気あり）' },
            ]}
          />
        </Card>
        <Card title="ROC 曲線">
          <Plot x={[0, 1]} y={[0, 1]} width={300} height={300} xLabel="偽陽性率（1 − 特異度）" yLabel="感度" xTicks={[0, 0.5, 1]} yTicks={[0, 0.5, 1]}>
            <Area f={roc} from={0.0005} to={0.9995} color="c2" opacity={0.12} />
            <Segment x1={0} y1={0} x2={1} y2={1} color="muted" dashed />
            <Curve f={roc} from={0.0005} to={0.9995} color="c2" />
            <Points data={[{ x: fpr, y: tpr }]} color="c4" r={7} opacity={1} />
          </Plot>
        </Card>
      </Compare>
      <p className="figure-readout">
        感度（陽性を陽性と当てる割合）= <strong>{round(tpr, 3)}</strong>、特異度 = <strong>{round(1 - fpr, 3)}</strong>、偽陽性率 = <strong>{round(fpr, 3)}</strong>
        <br />
        AUC（ROC 曲線の下の面積）= <strong>{round(auc, 3)}</strong>
      </p>
      <Controls>
        <Slider label="しきい値" value={c} min={-3} max={5} step={0.1} onChange={setC} format={(v) => v.toFixed(1)} />
        <Slider label="2つの山の離れ具合" value={d} min={0} max={3.5} step={0.1} onChange={setD} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
