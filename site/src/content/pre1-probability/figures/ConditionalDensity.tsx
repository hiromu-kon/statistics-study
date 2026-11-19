import { useState } from 'react'
import { Card, Compare, Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, Segment } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Rect } from './parts'

const GRID = 16
const joint = (x: number, y: number) => x + y

/**
 * 同時確率密度 f(x, y) = x + y（0 ≦ x, y ≦ 1）を濃淡で描き、x を1つ決めたときの縦の切り口を
 * 条件つき確率密度 f(y | x) として右に描く図。切り口の形を、面積が 1 になるように f_X(x) で割ったものが条件つき密度。
 */
export function ConditionalDensity() {
  const [x0, setX0] = useState(0.2)
  const fx = x0 + 0.5
  const cells = []
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const cx = (i + 0.5) / GRID
      const cy = (j + 0.5) / GRID
      cells.push(
        <Rect key={`${i}-${j}`} x0={i / GRID} x1={(i + 1) / GRID} y0={j / GRID} y1={(j + 1) / GRID} color="c1" opacity={0.05 + 0.4 * (joint(cx, cy) / 2)} />,
      )
    }
  }
  return (
    <div>
      <Compare>
        <Card title="同時密度 f(x, y) = x + y（濃いほど大きい）">
          <Plot x={[0, 1]} y={[0, 1]} width={300} height={280} xLabel="x" yLabel="y" xTicks={[0, 0.5, 1]} yTicks={[0, 0.5, 1]} grid={false}>
            {cells}
            <Segment x1={x0} y1={0} x2={x0} y2={1} color="c2" width={3} />
          </Plot>
        </Card>
        <Card title={`x = ${x0.toFixed(2)} で切ったときの y の密度`}>
          <Plot x={[0, 1]} y={[0, 2]} width={300} height={280} xLabel="y" xTicks={[0, 0.5, 1]} yTicks={[0, 0.5, 1, 1.5, 2]}>
            <Curve f={(y) => joint(x0, y)} color="c2" dashed />
            <Curve f={(y) => joint(x0, y) / fx} color="c2" />
            <Curve f={(y) => y + 0.5} color="muted" dashed />
          </Plot>
        </Card>
      </Compare>
      <Legend
        items={[
          { color: 'c2', label: '実線：条件つき密度 f(y | x) = (x + y) / (x + 1/2)　破線：切り口 f(x, y) そのまま' },
          { color: 'muted', label: 'y の周辺密度 f_Y(y) = y + 1/2' },
        ]}
      />
      <p className="figure-readout">
        切り口の面積 = f_X({x0.toFixed(2)}) = {x0.toFixed(2)} + 0.5 = <strong>{round(fx, 2)}</strong>。これで割ると面積が 1 になる
      </p>
      <Controls>
        <Slider label="x の値" value={x0} min={0} max={1} step={0.05} onChange={setX0} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}
