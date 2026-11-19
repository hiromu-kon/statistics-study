import { Card, Compare } from '../../../components/blocks'
import { Plot, Points, colorVar, usePlot } from '../../../components/charts/Plot'
import { createRng, randomNormal } from '../../../lib/stats'

/** 的の同心円と、真ん中（真の値）の印 */
function Rings() {
  const s = usePlot()
  const cx = s.x(0)
  const cy = s.y(0)
  return (
    <g>
      {[1, 2, 3].map((r) => (
        <ellipse key={r} cx={cx} cy={cy} rx={s.x(r) - cx} ry={cy - s.y(r)} fill="none" stroke={colorVar('muted')} strokeWidth={1.2} opacity={0.6} />
      ))}
      <circle cx={cx} cy={cy} r={5} fill={colorVar('c5')} />
    </g>
  )
}

/** 当たった点の平均の位置に「×」を描く */
function CenterMark({ x, y }: { x: number; y: number }) {
  const s = usePlot()
  const px = s.x(x)
  const py = s.y(y)
  const d = 7
  return (
    <g stroke={colorVar('c2')} strokeWidth={3} strokeLinecap="round">
      <line x1={px - d} y1={py - d} x2={px + d} y2={py + d} />
      <line x1={px - d} y1={py + d} x2={px + d} y2={py - d} />
    </g>
  )
}

function Target({ bias, spread, seed }: { bias: number; spread: number; seed: number }) {
  const rng = createRng(seed)
  const pts = Array.from({ length: 20 }, () => ({ x: randomNormal(rng, bias, spread), y: randomNormal(rng, bias * 0.6, spread) }))
  const mx = pts.reduce((a, p) => a + p.x, 0) / pts.length
  const my = pts.reduce((a, p) => a + p.y, 0) / pts.length
  return (
    <Plot x={[-3.4, 3.4]} y={[-3.4, 3.4]} width={260} height={250} hideY grid={false} xTicks={[]}>
      <Rings />
      <Points data={pts} color="c1" r={4.5} opacity={0.75} />
      <CenterMark x={mx} y={my} />
    </Plot>
  )
}

/**
 * 推定量のよしあしを「的当て」で見る図。
 * 赤い中心が真の値（母数）、青い点が標本ごとの推定値、オレンジの×が推定値の平均。
 */
export function TargetPlot() {
  return (
    <Compare>
      <Card title="偏りなし・ばらつき小（理想）">
        <Target bias={0} spread={0.45} seed={11} />
      </Card>
      <Card title="偏りなし・ばらつき大">
        <Target bias={0} spread={1.25} seed={12} />
      </Card>
      <Card title="偏りあり・ばらつき小">
        <Target bias={1.6} spread={0.45} seed={13} />
      </Card>
      <Card title="偏りあり・ばらつき大">
        <Target bias={1.6} spread={1.25} seed={14} />
      </Card>
    </Compare>
  )
}
