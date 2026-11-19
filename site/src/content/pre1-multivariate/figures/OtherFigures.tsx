import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { HLine, Label, Legend, Plot, Points, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import type { Vec2 } from './linalg'

// ---------- 多次元尺度法 ----------

const TOWN_NAMES = ['駅', '学校', '病院', '公園', '図書館']

/** 本当の位置（重心が原点になるように平行移動したもの）。駅 (0,0)、学校 (4,0)、病院 (4,3)、公園 (0,3)、図書館 (2,6) */
const TRUE_POS: Vec2[] = [
  [-2, -2.4],
  [2, -2.4],
  [2, 0.6],
  [-2, 0.6],
  [0, 3.6],
]

/** 距離の表だけから古典的多次元尺度法（二重中心化 → 固有値分解）で求めた配置。numpy で計算した値 */
const MDS_POS: Vec2[] = [
  [-2.4, 2],
  [-2.4, -2],
  [0.6, -2],
  [0.6, 2],
  [3.6, 0],
]

export function MdsDemo() {
  const [deg, setDeg] = useState(0)
  const [flip, setFlip] = useState(false)
  const [showTrue, setShowTrue] = useState(false)
  const t = (deg * Math.PI) / 180
  const moved = MDS_POS.map(([x, y0]): Vec2 => {
    const y = flip ? -y0 : y0
    return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]
  })
  const gap = moved.reduce((s, p, i) => s + Math.hypot(p[0] - TRUE_POS[i][0], p[1] - TRUE_POS[i][1]), 0)
  return (
    <div>
      <Plot x={[-4.5, 4.5]} y={[-4.5, 4.5]} width={400} height={410} xLabel="第1次元" yLabel="第2次元" xTicks={[-4, -2, 0, 2, 4]} yTicks={[-4, -2, 0, 2, 4]}>
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        {showTrue && <Points data={TRUE_POS.map(([x, y]) => ({ x, y }))} color="c2" r={11} opacity={0.3} />}
        <Points data={moved.map(([x, y]) => ({ x, y }))} color="c1" r={6} opacity={0.9} />
        {moved.map(([x, y], i) => (
          <Label key={i} x={x} y={y} dy={-12} color="c1">
            {TOWN_NAMES[i]}
          </Label>
        ))}
      </Plot>
      <p className="figure-readout">
        {showTrue
          ? gap < 0.01
            ? '本当の位置とぴったり重なった（回転・裏返しをすれば、距離の表だけから地図が復元できている）'
            : `本当の位置（薄い丸）とのずれの合計 = ${round(gap, 2)}。回転と裏返しで重ねてみよう`
          : '距離の表だけから作った配置。向き（回転・裏返し）は決まらない'}
      </p>
      <Controls>
        <Slider label="回転" value={deg} min={0} max={355} step={5} onChange={setDeg} format={(v) => `${v}°`} />
        <Button onClick={() => setFlip(!flip)}>{flip ? '裏返しをやめる' : '上下を裏返す'}</Button>
        <Button variant={showTrue ? 'primary' : 'default'} onClick={() => setShowTrue(!showTrue)}>
          本当の位置を{showTrue ? '隠す' : '重ねる'}
        </Button>
      </Controls>
    </div>
  )
}

// ---------- 対応分析 ----------

const CA_ROWS = ['20代', '40代', '60代']
const CA_COLS = ['コーヒー', '紅茶', '緑茶']
/** 行・列とも主座標（numpy で、標準化残差の特異値分解から求めた値）。軸の符号は見やすい向きにそろえた */
const CA_ROW_POS: Vec2[] = [
  [-0.446, 0.09],
  [-0.106, -0.137],
  [0.553, 0.047],
]
const CA_COL_POS: Vec2[] = [
  [-0.402, 0.074],
  [-0.026, -0.139],
  [0.634, 0.063],
]

export function CaMap() {
  return (
    <div>
      <Plot x={[-0.7, 0.9]} y={[-0.3, 0.3]} width={520} height={250} xLabel="第1軸（イナーシャの 94.7%）" yLabel="第2軸（5.3%）" yTicks={[-0.2, 0, 0.2]}>
        <HLine y={0} color="muted" dashed={false} />
        <VLine x={0} color="muted" dashed={false} />
        <Points data={CA_ROW_POS.map(([x, y]) => ({ x, y }))} color="c1" r={6} opacity={0.9} />
        <Points data={CA_COL_POS.map(([x, y]) => ({ x, y }))} color="c2" r={6} opacity={0.9} />
        {CA_ROW_POS.map(([x, y], i) => (
          <Label key={`r${i}`} x={x} y={y} dy={-11} color="c1">
            {CA_ROWS[i]}
          </Label>
        ))}
        {CA_COL_POS.map(([x, y], i) => (
          <Label key={`c${i}`} x={x} y={y} dy={20} color="c2">
            {CA_COLS[i]}
          </Label>
        ))}
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '行（年代）' },
          { color: 'c2', label: '列（好きな飲み物）' },
        ]}
      />
    </div>
  )
}
