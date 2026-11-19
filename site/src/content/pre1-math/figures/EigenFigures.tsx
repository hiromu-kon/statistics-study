import { useMemo, useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { HLine, Label, Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { createRng, randomNormal } from '../../../lib/stats'
import { Choice, Polyline } from './parts'
import { fix } from './format'

type MatKey = 'sym' | 'tri'

const MATS: Record<MatKey, { m: [[number, number], [number, number]]; tex: string; eig: { deg: number; lambda: number }[] }> = {
  // 固有値 3（(1, 1) の向き）と 1（(1, −1) の向き）。2つの向きは直角
  sym: { m: [[2, 1], [1, 2]], tex: '\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}', eig: [{ deg: 45, lambda: 3 }, { deg: 135, lambda: 1 }] },
  // 固有値 3（(1, 0) の向き）と 2（(1, −1) の向き）。2つの向きは直角ではない
  tri: { m: [[3, 1], [0, 2]], tex: '\\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}', eig: [{ deg: 0, lambda: 3 }, { deg: 135, lambda: 2 }] },
}

const apply = (m: [[number, number], [number, number]], v: { x: number; y: number }) => ({ x: m[0][0] * v.x + m[0][1] * v.y, y: m[1][0] * v.x + m[1][1] * v.y })

/**
 * 行列 A を「ベクトルを動かす操作」として見る図。長さ 1 のベクトル v を回すと Av も動くが、
 * 特別な向きでは v と Av が同じ直線に乗る（向きが変わらない）。それが固有ベクトルで、伸びた倍率が固有値。
 */
export function EigenFigure() {
  const [key, setKey] = useState<MatKey>('sym')
  const [deg, setDeg] = useState(20)
  const { m, tex, eig } = MATS[key]
  const th = (deg * Math.PI) / 180
  const v = { x: Math.cos(th), y: Math.sin(th) }
  const av = apply(m, v)
  // v と Av のなす角（0° か 180° なら同じ直線の上）
  const cross = v.x * av.y - v.y * av.x
  const hit = eig.find((e) => e.deg % 180 === deg % 180)
  const circle = Array.from({ length: 121 }, (_, i) => {
    const t = (2 * Math.PI * i) / 120
    return { x: Math.cos(t), y: Math.sin(t) }
  })
  const image = circle.map((p) => apply(m, p))
  return (
    <div>
      <Plot x={[-4, 4]} y={[-4, 4]} width={420} height={410} xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} yTicks={[-4, -2, 0, 2, 4]} xLabel="1番目の成分">
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        {eig.map((e) => {
          const r = (e.deg * Math.PI) / 180
          return <Segment key={e.deg} x1={-5 * Math.cos(r)} y1={-5 * Math.sin(r)} x2={5 * Math.cos(r)} y2={5 * Math.sin(r)} color="c4" dashed width={1} />
        })}
        <Polyline points={circle} color="muted" width={1} dashed />
        <Polyline points={image} color="c1" width={1.2} opacity={0.5} />
        <Segment x1={0} y1={0} x2={av.x} y2={av.y} color="c2" width={3} arrow />
        <Segment x1={0} y1={0} x2={v.x} y2={v.y} color="ink" width={3} arrow />
        <Label x={v.x} y={v.y} dy={-8} anchor="end" color="ink">
          {'v '}
        </Label>
        <Label x={av.x} y={av.y} dy={-8} anchor="start" color="c2">
          {' Av'}
        </Label>
        {hit && <Points data={[{ x: av.x, y: av.y, color: 'c4' }]} r={7} opacity={0.9} />}
      </Plot>
      <Legend
        items={[
          { color: 'ink', label: 'v（長さ 1）' },
          { color: 'c2', label: 'Av（A で動かした先）' },
          { color: 'c1', label: '長さ 1 の円を A で動かした形' },
          { color: 'c4', label: '固有ベクトルの向き（点線）' },
        ]}
      />
      <p className="figure-readout">
        <M>{`A = ${tex},\\quad v = (${fix(v.x, 2)}, ${fix(v.y, 2)}),\\quad Av = (${fix(av.x, 2)}, ${fix(av.y, 2)})`}</M>
        <br />
        {hit ? (
          <strong>
            向きが変わらない！ Av = {hit.lambda}v（固有値 {hit.lambda}）
          </strong>
        ) : (
          `Av は v から ${fix(Math.abs((Math.atan2(cross, v.x * av.x + v.y * av.y) * 180) / Math.PI), 0)}° ずれた向き`
        )}
      </p>
      <Controls>
        <Choice<MatKey>
          options={[
            { value: 'sym', label: '対称行列' },
            { value: 'tri', label: '対称でない行列' },
          ]}
          value={key}
          onChange={setKey}
        />
      </Controls>
      <Controls>
        <Slider label="v の角度" value={deg} min={0} max={180} step={5} onChange={setDeg} format={(x) => `${x}°`} />
      </Controls>
    </div>
  )
}

/** 2×2 の対称行列 [[a, c], [c, b]] の固有値（大きい順）と、大きいほうの固有値の固有ベクトル（長さ 1） */
function eigenSym(a: number, b: number, c: number) {
  const mid = (a + b) / 2
  const rad = Math.sqrt(((a - b) / 2) ** 2 + c * c)
  const l1 = mid + rad
  const l2 = mid - rad
  let u = Math.abs(c) < 1e-12 ? (a >= b ? { x: 1, y: 0 } : { x: 0, y: 1 }) : { x: c, y: l1 - a }
  const n = Math.hypot(u.x, u.y)
  u = { x: u.x / n, y: u.y / n }
  return { l1, l2, u }
}

const POINTS = (() => {
  const rng = createRng(11)
  return Array.from({ length: 160 }, () => ({ z1: randomNormal(rng), z2: randomNormal(rng) }))
})()

/**
 * 分散共分散行列 Σ の固有値分解と主成分分析のつながり。
 * 方向 u にデータを落とした値の分散は u′Σu で、u を回すと、最大固有値の固有ベクトルの向きで最大（= 最大固有値）になる。
 */
export function PcaFigure() {
  const [vx, setVx] = useState(2)
  const [rho, setRho] = useState(0.6)
  const [deg, setDeg] = useState(0)
  const vy = 1
  const cov = rho * Math.sqrt(vx * vy)
  const { l1, l2, u } = eigenSym(vx, vy, cov)
  // 標準正規の点を Σ に合う形に変換する（コレスキー分解）
  const pts = useMemo(
    () => POINTS.map(({ z1, z2 }) => ({ x: Math.sqrt(vx) * z1, y: rho * Math.sqrt(vy) * z1 + Math.sqrt(vy * (1 - rho * rho)) * z2 })),
    [vx, rho],
  )
  const th = (deg * Math.PI) / 180
  const w = { x: Math.cos(th), y: Math.sin(th) }
  const varW = vx * w.x * w.x + 2 * cov * w.x * w.y + vy * w.y * w.y
  const u2 = { x: -u.y, y: u.x }
  const s1 = 2 * Math.sqrt(l1)
  const s2 = 2 * Math.sqrt(Math.max(l2, 0))
  const firstDeg = (((Math.atan2(u.y, u.x) * 180) / Math.PI) % 180 + 180) % 180
  return (
    <div>
      <Plot x={[-4.5, 4.5]} y={[-4.5, 4.5]} width={420} height={410} xTicks={[-4, -2, 0, 2, 4]} yTicks={[-4, -2, 0, 2, 4]} xLabel="X" yLabel="Y">
        <Points data={pts} color="muted" r={3} opacity={0.5} />
        <Segment x1={-6 * w.x} y1={-6 * w.y} x2={6 * w.x} y2={6 * w.y} color="c2" dashed width={1.5} />
        <Segment x1={-s1 * u.x} y1={-s1 * u.y} x2={s1 * u.x} y2={s1 * u.y} color="c1" width={4} />
        <Segment x1={-s2 * u2.x} y1={-s2 * u2.y} x2={s2 * u2.x} y2={s2 * u2.y} color="c3" width={4} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '第1主成分の向き（最大固有値の固有ベクトル）' },
          { color: 'c3', label: '第2主成分の向き' },
          { color: 'c2', label: '自分で選んだ向き u（点線）' },
        ]}
      />
      <p className="figure-readout">
        <M>{`\\Sigma = \\begin{pmatrix} ${fix(vx, 2)} & ${fix(cov, 2)} \\\\ ${fix(cov, 2)} & 1 \\end{pmatrix},\\quad \\lambda_1 = ${fix(l1, 3)},\\ \\lambda_2 = ${fix(l2, 3)}`}</M>
        <br />
        第1主成分の寄与率 <M>{`\\frac{\\lambda_1}{\\lambda_1 + \\lambda_2} = ${fix(l1 / (l1 + l2), 3)}`}</M>、第1主成分の向きは {fix(firstDeg, 0)}°
        <br />
        向き u（{deg}°）に落とした値の分散 <M>{`u'\\Sigma u = ${fix(varW, 3)}`}</M>（最大は <M>{`\\lambda_1`}</M>、最小は <M>{`\\lambda_2`}</M>）
      </p>
      <Controls>
        <Slider label="X の分散" value={vx} min={0.5} max={3} step={0.1} onChange={setVx} format={(x) => x.toFixed(1)} />
        <Slider label="相関係数 ρ" value={rho} min={-0.9} max={0.9} step={0.1} onChange={setRho} format={(x) => x.toFixed(1)} />
        <Slider label="向き u の角度" value={deg} min={0} max={175} step={5} onChange={setDeg} format={(x) => `${x}°`} />
      </Controls>
    </div>
  )
}
