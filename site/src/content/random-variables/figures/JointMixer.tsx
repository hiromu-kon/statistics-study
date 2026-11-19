import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Legend } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { BubblePlot, type Joint } from './BubblePlot'
import { DistBars } from './DistBars'
import type { Dist } from './dist'

const VALUES = [1, 2, 3]

/** t > 0 なら「X = Y」の対角線に、t < 0 なら「X + Y = 4」の逆対角線に確率を |t| の割合だけ寄せる。どちらに寄せても周辺分布は一様のまま */
function jointOf(t: number): Joint {
  return VALUES.flatMap((x) =>
    VALUES.map((y) => {
      const onLine = t >= 0 ? x === y : x + y === 4
      return { x, y, p: (1 - Math.abs(t)) / 9 + (onLine ? Math.abs(t) / 3 : 0) }
    }),
  )
}

function distOf(joint: Joint, f: (x: number, y: number) => number): Dist {
  const map = new Map<number, number>()
  for (const d of joint) map.set(f(d.x, d.y), (map.get(f(d.x, d.y)) ?? 0) + d.p)
  return [...map.entries()].map(([x, p]) => ({ x, p })).sort((a, b) => a.x - b.x)
}

/**
 * X, Y はどちらも 1, 2, 3 を 1/3 ずつとる（周辺分布は固定）。
 * スライダーで「関係の強さ」を変えると、同時分布だけが変わる。
 * 共分散が変わると、X + Y と X − Y の分散が逆向きに変わる。
 */
export function JointMixer() {
  const [t, setT] = useState(0.5)
  const joint = jointOf(t)
  const v = 2 / 3
  const cov = joint.reduce((s, d) => s + (d.x - 2) * (d.y - 2) * d.p, 0)
  const sum = distOf(joint, (x, y) => x + y)
  const diff = distOf(joint, (x, y) => x - y)
  return (
    <div>
      <BubblePlot joint={joint} x={[0.4, 3.6]} y={[0.4, 3.6]} xTicks={VALUES} yTicks={VALUES} ariaLabel="X と Y の同時分布。円の面積が確率" />
      <Legend
        items={[
          { color: 'c1', label: '(x − 2)(y − 2) > 0：共分散をプラスにする' },
          { color: 'c5', label: '(x − 2)(y − 2) < 0：共分散をマイナスにする' },
        ]}
      />
      <Controls>
        <Slider label="関係の強さ" value={t} min={-1} max={1} step={0.05} onChange={setT} format={(v) => v.toFixed(2)} />
      </Controls>
      <p className="figure-readout">
        Cov(X, Y) = <strong>{round(cov, 3)}</strong>　相関係数 = <strong>{round(cov / v, 3)}</strong>
        <br />
        V(X + Y) = {round(v, 3)} + {round(v, 3)} + 2 × ({round(cov, 3)}) = <strong>{round(2 * v + 2 * cov, 3)}</strong>　V(X − Y) = {round(v, 3)} + {round(v, 3)} − 2 × ({round(cov, 3)}) ={' '}
        <strong>{round(2 * v - 2 * cov, 3)}</strong>
      </p>
      <Compare>
        <Card title="X + Y の分布">
          <DistBars dist={sum} x={[1.3, 6.7]} yMax={1} xTicks={[2, 3, 4, 5, 6]} xLabel="X + Y" width={340} height={200} label={(_, p) => String(round(p, 2))} />
        </Card>
        <Card title="X − Y の分布">
          <DistBars dist={diff} x={[-2.7, 2.7]} yMax={1} xTicks={[-2, -1, 0, 1, 2]} xLabel="X − Y" color="c4" width={340} height={200} label={(_, p) => String(round(p, 2))} />
        </Card>
      </Compare>
    </div>
  )
}
