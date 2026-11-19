import { useMemo, useState } from 'react'
import { Button, Card, Compare, Controls } from '../../../components/blocks'
import { binData } from '../../../components/charts/common'
import { Bars, Plot, Points, Segment } from '../../../components/charts/Plot'
import { createRng, mean, normalQuantile, randomNormal, sd } from '../../../lib/stats'

type Shape = 'normal' | 'heavy' | 'skew'

const LABEL: Record<Shape, string> = { normal: '正規分布', heavy: '裾が重い', skew: '右に裾が長い' }

/** 残差（標準化したもの）の正規 Q-Q プロット。分布の形を切り替えて、点の並び方の違いを見る */
export function QQPlot() {
  const [shape, setShape] = useState<Shape>('heavy')
  const z = useMemo(() => {
    const rng = createRng(5)
    const n = 60
    const raw = Array.from({ length: n }, () => {
      const a = randomNormal(rng)
      if (shape === 'normal') return a
      // 自由度3の t 分布：正規分布 ÷ √(χ²(3)/3)
      if (shape === 'heavy') {
        const c = randomNormal(rng) ** 2 + randomNormal(rng) ** 2 + randomNormal(rng) ** 2
        return a / Math.sqrt(c / 3)
      }
      // 自由度2のχ²分布（指数分布）は右に裾が長い
      return -2 * Math.log(1 - rng())
    })
    const m = mean(raw)
    const s = sd(raw, 1)
    return raw.map((v) => (v - m) / s).sort((p, q) => p - q)
  }, [shape])
  const n = z.length
  const theo = z.map((_, i) => normalQuantile((i + 0.5) / n))
  const lim = Math.max(3, ...z.map(Math.abs)) + 0.3
  return (
    <div>
      <Controls>
        {(Object.keys(LABEL) as Shape[]).map((s) => (
          <Button key={s} variant={shape === s ? 'primary' : 'default'} onClick={() => setShape(s)}>
            {LABEL[s]}
          </Button>
        ))}
      </Controls>
      <Compare>
        <Card title="標準化した残差のヒストグラム">
          <Plot x={[-lim, lim]} y={[0, 22]} width={300} height={240} xLabel="標準化した残差">
            <Bars data={binData(z, -6, 0.5, 24)} width={0.5} color="c3" opacity={0.7} />
          </Plot>
        </Card>
        <Card title="正規 Q-Q プロット">
          <Plot x={[-3, 3]} y={[-lim, lim]} width={300} height={240} xLabel="正規分布なら来るはずの値" yLabel="実際の値">
            <Segment x1={-3} y1={-3} x2={3} y2={3} color="c1" width={2} />
            <Points data={theo.map((t, i) => ({ x: t, y: z[i] }))} r={3.5} color="c2" opacity={0.75} />
          </Plot>
        </Card>
      </Compare>
    </div>
  )
}
