import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Plot, Points, Segment } from '../../../components/charts/Plot'
import { createRng, mean, randomNormal, round, tQuantile, variance } from '../../../lib/stats'
import { Marker, Text } from '../../sampling/figures/parts'

const MU_A = 64
const MU_B = 60
const SIGMA = 6

/**
 * 2つのグループ（例：新しい教え方 A と従来の B）の標本と、母平均の差 μA − μB の 95% 信頼区間。
 * 等分散を仮定してプールした分散と t 分布（自由度 nA + nB − 2）で区間を作る。
 */
export function TwoGroupsCi() {
  const [n, setN] = useState(10)
  const [seed, setSeed] = useState(1)
  const { a, b } = useMemo(() => {
    const rng = createRng(seed * 211 + n)
    return {
      a: Array.from({ length: n }, () => round(randomNormal(rng, MU_A, SIGMA), 1)),
      b: Array.from({ length: n }, () => round(randomNormal(rng, MU_B, SIGMA), 1)),
    }
  }, [n, seed])
  const ma = mean(a)
  const mb = mean(b)
  const sp2 = ((n - 1) * variance(a, 1) + (n - 1) * variance(b, 1)) / (2 * n - 2)
  const se = Math.sqrt(sp2 * (2 / n))
  const t = tQuantile(0.975, 2 * n - 2)
  const diff = ma - mb
  const lo = diff - t * se
  const hi = diff + t * se
  const includesZero = lo <= 0 && 0 <= hi
  return (
    <div>
      <Plot x={[40, 85]} y={[0, 3]} height={150} hideY grid={false} xLabel="テストの点数">
        <Points data={a.map((x) => ({ x, y: 2 }))} color="c1" r={5} opacity={0.6} />
        <Points data={b.map((x) => ({ x, y: 1 }))} color="c3" r={5} opacity={0.6} />
        <Segment x1={ma} y1={1.6} x2={ma} y2={2.4} color="c1" width={3} />
        <Segment x1={mb} y1={0.6} x2={mb} y2={1.4} color="c3" width={3} />
        <Text x={41} y={2} dy={-14} anchor="start" color="c1">
          A：平均 {round(ma, 1)}
        </Text>
        <Text x={41} y={1} dy={-14} anchor="start" color="c3">
          B：平均 {round(mb, 1)}
        </Text>
      </Plot>
      <Plot x={[-8, 16]} y={[0, 2]} height={110} hideY grid={false} xLabel="母平均の差 μA − μB の 95% 信頼区間">
        <Marker x={0} color="muted" label="差 0" />
        <Marker x={MU_A - MU_B} color="c5" from={0.4} to={1.6} label="本当の差 4" labelY={0.25} />
        <Segment x1={lo} y1={1} x2={hi} y2={1} color={includesZero ? 'c2' : 'c1'} width={8} />
        <Text x={diff} y={1} dy={-10}>
          {round(diff, 2)}
        </Text>
      </Plot>
      <p className="figure-readout">
        差 {round(diff, 2)} ± {t.toFixed(3)} × {round(se, 3)} = [<strong>{round(lo, 2)}</strong>, <strong>{round(hi, 2)}</strong>]　→{' '}
        {includesZero ? '0 を含む：差があるとは言い切れない' : '0 を含まない：A のほうが高いと考えられる'}
      </p>
      <Controls>
        <Button variant="primary" onClick={() => setSeed(seed + 1)}>
          標本をとり直す
        </Button>
      </Controls>
      <Controls>
        <Slider label="各グループの人数" value={n} min={4} max={60} step={1} onChange={setN} format={(v) => `${v}人`} />
      </Controls>
    </div>
  )
}
