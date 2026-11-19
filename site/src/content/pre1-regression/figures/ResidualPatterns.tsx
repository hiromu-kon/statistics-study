import { useMemo, useState } from 'react'
import { Button, Card, Compare, Controls } from '../../../components/blocks'
import { HLine, Plot, Points, Segment } from '../../../components/charts/Plot'
import { createRng, randomNormal } from '../../../lib/stats'
import { leastSquares } from './linalg'

type Pattern = 'ok' | 'curve' | 'funnel'

const LABEL: Record<Pattern, string> = { ok: '問題なし', curve: '曲がっている', funnel: '扇形（不均一分散）' }

const TRUTH: Record<Pattern, (x: number, z: number) => number> = {
  ok: (x, z) => 3 + 0.8 * x + z,
  curve: (x, z) => 1 + 0.15 * (x - 2) ** 2 + 0.6 * z,
  funnel: (x, z) => 3 + 0.8 * x + 0.25 * x * z,
}

/** 直線を当てはめたあとの残差を、予測値に対してプロットする。パターンを切り替えて比べる */
export function ResidualPatterns() {
  const [pattern, setPattern] = useState<Pattern>('curve')
  const data = useMemo(() => {
    const rng = createRng(21)
    const xs = Array.from({ length: 40 }, (_, i) => 0.5 + i * 0.25)
    const ys = xs.map((x) => TRUTH[pattern](x, randomNormal(rng)))
    const [a, b] = leastSquares(
      xs.map((x) => [1, x]),
      ys,
    )
    const fitted = xs.map((x) => a + b * x)
    return { xs, ys, a, b, fitted, resid: ys.map((y, i) => y - fitted[i]) }
  }, [pattern])
  const rMax = Math.max(...data.resid.map(Math.abs)) * 1.2
  const fMin = Math.min(...data.fitted)
  const fMax = Math.max(...data.fitted)
  const yMax = Math.max(...data.ys) * 1.1
  return (
    <div>
      <Controls>
        {(Object.keys(LABEL) as Pattern[]).map((p) => (
          <Button key={p} variant={pattern === p ? 'primary' : 'default'} onClick={() => setPattern(p)}>
            {LABEL[p]}
          </Button>
        ))}
      </Controls>
      <Compare>
        <Card title="データと当てはめた直線">
          <Plot x={[0, 10.5]} y={[Math.min(0, ...data.ys), yMax]} width={300} height={240} xLabel="x" yLabel="y">
            <Segment x1={0} y1={data.a} x2={10.5} y2={data.a + data.b * 10.5} color="c1" width={2.5} />
            <Points data={data.xs.map((x, i) => ({ x, y: data.ys[i] }))} r={3.5} color="ink" opacity={0.55} />
          </Plot>
        </Card>
        <Card title="残差プロット（横軸は予測値）">
          <Plot x={[fMin - 0.5, fMax + 0.5]} y={[-rMax, rMax]} width={300} height={240} xLabel="予測値 ŷ" yLabel="残差 e">
            <HLine y={0} color="c1" dashed={false} />
            <Points data={data.fitted.map((f, i) => ({ x: f, y: data.resid[i] }))} r={3.5} color="c2" opacity={0.7} />
          </Plot>
        </Card>
      </Compare>
    </div>
  )
}
