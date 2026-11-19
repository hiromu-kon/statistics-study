import { useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { HLine, Plot, Points, VLine, colorVar, usePlot } from '../../../components/charts/Plot'
import { correlation, mean, round, sum } from '../../../lib/stats'
import { quadrantData } from './data'
import { PlotText } from './PlotText'

const CHOICES = [
  { key: 'pos', label: '右上がり' },
  { key: 'neg', label: '右下がり' },
  { key: 'none', label: 'ばらばら' },
] as const

type Key = (typeof CHOICES)[number]['key']

/** 平均の線で区切った4つの部屋と、平均の点から各点までの長方形（面積 = 偏差の積）を描く */
function Rooms({ xs, ys, mx, my }: { xs: number[]; ys: number[]; mx: number; my: number }) {
  const s = usePlot()
  const [x0, x1] = s.xDomain
  const [y0, y1] = s.yDomain
  const room = (ax: number, bx: number, ay: number, by: number, positive: boolean) => (
    <rect
      x={s.x(Math.min(ax, bx))}
      y={s.y(Math.max(ay, by))}
      width={Math.abs(s.x(bx) - s.x(ax))}
      height={Math.abs(s.y(ay) - s.y(by))}
      fill={colorVar(positive ? 'c3' : 'c5')}
      opacity={0.07}
    />
  )
  return (
    <g>
      {room(mx, x1, my, y1, true)}
      {room(x0, mx, y0, my, true)}
      {room(x0, mx, my, y1, false)}
      {room(mx, x1, y0, my, false)}
      {xs.map((x, i) => {
        const positive = (x - mx) * (ys[i] - my) >= 0
        const c = colorVar(positive ? 'c3' : 'c5')
        return (
          <rect
            key={i}
            x={Math.min(s.x(x), s.x(mx))}
            y={Math.min(s.y(ys[i]), s.y(my))}
            width={Math.abs(s.x(x) - s.x(mx))}
            height={Math.abs(s.y(ys[i]) - s.y(my))}
            fill={c}
            fillOpacity={0.12}
            stroke={c}
            strokeOpacity={0.5}
          />
        )
      })}
    </g>
  )
}

/**
 * 共分散の直感をつかむ図。
 * 右上・左下の部屋（緑）にある点は偏差の積がプラス、左上・右下の部屋（赤）はマイナス。
 */
export function QuadrantPlot() {
  const [key, setKey] = useState<Key>('pos')
  const { xs, ys } = quadrantData[key]
  const mx = mean(xs)
  const my = mean(ys)
  const products = xs.map((x, i) => (x - mx) * (ys[i] - my))
  const plus = sum(products.filter((p) => p > 0))
  const minus = sum(products.filter((p) => p < 0))
  return (
    <div>
      <Controls>
        {CHOICES.map((c) => (
          <Button key={c.key} variant={c.key === key ? 'primary' : 'default'} onClick={() => setKey(c.key)}>
            {c.label}
          </Button>
        ))}
      </Controls>
      <Plot x={[10, 90]} y={[10, 90]} height={360} xLabel="x" yLabel="y">
        <Rooms xs={xs} ys={ys} mx={mx} my={my} />
        <VLine x={mx} color="muted" label="x の平均" />
        <HLine y={my} color="muted" label="y の平均" />
        <PlotText x={84} y={84} dy={8} color="c3" size={26}>＋</PlotText>
        <PlotText x={16} y={16} dy={8} color="c3" size={26}>＋</PlotText>
        <PlotText x={16} y={84} dy={8} color="c5" size={26}>−</PlotText>
        <PlotText x={84} y={16} dy={8} color="c5" size={26}>−</PlotText>
        <Points data={xs.map((x, i) => ({ x, y: ys[i], color: products[i] >= 0 ? 'c3' : 'c5' }))} r={5} opacity={0.9} />
      </Plot>
      <p className="figure-readout">
        偏差の積の合計 = <span className="mark mark-c3">{round(plus, 0)}</span> + (<span style={{ color: 'var(--c5)', fontWeight: 700 }}>{round(minus, 0)}</span>) ={' '}
        <strong>{round(plus + minus, 0)}</strong>
      </p>
      <p className="figure-readout">
        共分散 = 合計 ÷ {xs.length} = <strong>{round((plus + minus) / xs.length, 1)}</strong>　相関係数 r ={' '}
        <strong>{round(correlation(xs, ys), 2)}</strong>
      </p>
    </div>
  )
}
