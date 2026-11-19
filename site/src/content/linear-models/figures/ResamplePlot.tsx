import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Legend, Plot, Points, Segment, VLine } from '../../../components/charts/Plot'
import { createRng, randomNormal, round } from '../../../lib/stats'
import { simpleFit } from './simpleFit'

const B0 = 2
const B1 = 0.5
const SIGMA = 1.5

function drawSample(seed: number, n: number) {
  const rng = createRng(seed * 7919 + n)
  const xs = Array.from({ length: n }, () => rng() * 10)
  const ys = xs.map((x) => B0 + B1 * x + randomNormal(rng, 0, SIGMA))
  return { xs, ys }
}

/**
 * 同じ母集団から標本を取り直すたびに、推定した直線（傾き b1）が揺れる様子を見せる図。
 * 揺れの大きさの目安が「傾きの標準誤差」で、n を増やすと小さくなる。
 */
export function ResamplePlot() {
  const [n, setN] = useState(10)
  const [seeds, setSeeds] = useState<number[]>([1])
  const fits = useMemo(
    () =>
      seeds.map((sd) => {
        const { xs, ys } = drawSample(sd, n)
        return { xs, ys, ...simpleFit(xs, ys) }
      }),
    [seeds, n],
  )
  const cur = fits[fits.length - 1]
  const changeN = (v: number) => {
    setN(v)
    setSeeds([1])
  }
  return (
    <div>
      <Plot x={[0, 10]} y={[-2, 11]} xLabel="x" yLabel="y" height={300}>
        {fits.slice(0, -1).map((f, i) => (
          <Segment key={i} x1={0} y1={f.a} x2={10} y2={f.a + 10 * f.b} color="muted" width={1.2} />
        ))}
        <Segment x1={0} y1={B0} x2={10} y2={B0 + 10 * B1} color="c2" width={2.5} dashed />
        <Points data={cur.xs.map((x, i) => ({ x, y: cur.ys[i] }))} r={4.5} color="c1" opacity={0.7} />
        <Segment x1={0} y1={cur.a} x2={10} y2={cur.a + 10 * cur.b} color="c1" width={3} />
      </Plot>
      <Legend
        items={[
          { color: 'c2', label: '本当の直線（傾き 0.5）' },
          { color: 'c1', label: '今回の標本から推定した直線' },
          { color: 'muted', label: 'これまでに推定した直線' },
        ]}
      />
      <p className="figure-readout">
        今回の傾き b1 = <strong>{round(cur.b, 3)}</strong>　標準誤差 SE = <strong>{round(cur.seB, 3)}</strong>　t = b1 ÷ SE ={' '}
        <strong>{round(cur.t, 2)}</strong>
      </p>
      <Plot x={[-0.5, 1.5]} y={[0, 1]} height={90} hideY grid={false} xTicks={[-0.5, 0, 0.5, 1, 1.5]}>
        <VLine x={B1} color="c2" />
        <VLine x={0} color="muted" />
        <Points data={fits.map((f) => ({ x: f.b, y: 0.45 }))} r={5} color="c1" opacity={0.45} />
      </Plot>
      <p className="figure-readout small">
        ↑ これまでの傾き b1 の散らばり（{fits.length} 回分）。オレンジの線が本当の傾き 0.5、灰色の線が 0
      </p>
      <Controls>
        <Button variant="primary" onClick={() => setSeeds((s) => [...s, s.length + 1])} disabled={seeds.length >= 40}>
          標本を取り直す
        </Button>
        <Button variant="ghost" onClick={() => setSeeds([1])}>
          リセット
        </Button>
        <Slider label="標本の大きさ n" value={n} min={5} max={50} step={5} onChange={changeN} />
      </Controls>
    </div>
  )
}
