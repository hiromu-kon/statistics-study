import { useMemo, useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { Plot, Points, Segment } from '../../../components/charts/Plot'
import { createRng, mean, randomNormal } from '../../../lib/stats'
import { Choice, Marker } from '../../sampling/figures/parts'

const MU = 50
const SIGMA = 10
const N = 10
const COUNT = 100
const Z = { 90: 1.645, 95: 1.96, 99: 2.576 } as const
type Level = keyof typeof Z

/**
 * 同じ母集団から標本をとって信頼区間を作る、を 100 回くり返して縦に並べる図。
 * 真の値 μ を含まなかった区間を赤で示す。
 */
export function CiCoverage() {
  const [seed, setSeed] = useState(1)
  const [level, setLevel] = useState<Level>(95)
  const [history, setHistory] = useState({ made: 0, hit: 0 })

  const means = useMemo(() => {
    const rng = createRng(seed * 131 + 5)
    return Array.from({ length: COUNT }, () => mean(Array.from({ length: N }, () => randomNormal(rng, MU, SIGMA))))
  }, [seed])
  const half = (Z[level] * SIGMA) / Math.sqrt(N)
  const intervals = means.map((m, i) => ({ lo: m - half, hi: m + half, m, y: COUNT - i, hit: m - half <= MU && MU <= m + half }))
  const hits = intervals.filter((iv) => iv.hit).length

  const remake = () => {
    setHistory({ made: history.made + COUNT, hit: history.hit + hits })
    setSeed(seed + 1)
  }
  const changeLevel = (l: Level) => {
    setLevel(l)
    setHistory({ made: 0, hit: 0 })
  }

  return (
    <div>
      <Plot x={[MU - 16, MU + 16]} y={[0, COUNT + 1]} height={520} hideY grid={false} xLabel="母平均 μ の信頼区間">
        {intervals.map((iv) => (
          <Segment key={iv.y} x1={iv.lo} y1={iv.y} x2={iv.hi} y2={iv.y} color={iv.hit ? 'c1' : 'c5'} width={iv.hit ? 2 : 3} />
        ))}
        <Points data={intervals.map((iv) => ({ x: iv.m, y: iv.y, color: iv.hit ? 'c1' : 'c5' }))} r={1.8} opacity={0.9} />
        <Marker x={MU} color="ink" label="真の値 μ = 50" dashed={false} />
      </Plot>
      <p className="figure-readout">
        今回の {COUNT} 本のうち、μ を含んだ区間：<strong>{hits} 本</strong>　含まなかった区間（赤）：<strong>{COUNT - hits} 本</strong>
      </p>
      {history.made > 0 && (
        <p className="figure-readout">
          これまでの合計 {history.made + COUNT} 本のうち、含んだ割合 ≒{' '}
          <strong>{(((history.hit + hits) / (history.made + COUNT)) * 100).toFixed(1)}%</strong>（信頼係数 {level}%）
        </p>
      )}
      <Controls>
        <Button variant="primary" onClick={remake}>
          100本作り直す
        </Button>
        <Choice<Level>
          options={[
            { value: 90, label: '90%' },
            { value: 95, label: '95%' },
            { value: 99, label: '99%' },
          ]}
          value={level}
          onChange={changeLevel}
        />
      </Controls>
    </div>
  )
}
