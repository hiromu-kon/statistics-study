import { useState } from 'react'
import { Button, Controls, DataTable, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { HLine, Legend, Plot, Points, type Color } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Choice, Polyline } from './parts'
import { step, WEATHER, WEATHER_PI, type ChainSpec } from './chains'
import { StateDiagram } from './StateDiagram'

function unitVector(n: number, i: number): number[] {
  return Array.from({ length: n }, (_, k) => (k === i ? 1 : 0))
}

/** ボタンで1日ずつ進め、天気の分布が定常分布に近づく様子を見る */
export function MarkovStepper() {
  const [start, setStart] = useState(0)
  const [history, setHistory] = useState<number[][]>([unitVector(3, 0)])
  const dist = history[history.length - 1]
  const day = history.length - 1
  const prev = history.length >= 2 ? history[history.length - 2] : null
  const advance = (k: number) =>
    setHistory((h) => {
      const next = [...h]
      for (let i = 0; i < k && next.length <= 40; i++) next.push(step(next[next.length - 1], WEATHER.P))
      return next
    })
  const restart = (s: number) => {
    setStart(s)
    setHistory([unitVector(3, s)])
  }
  const [a, b, c] = prev ?? [0, 0, 0]
  const sunnyCalc = `0.6 \\times ${round(a, 3)} + 0.3 \\times ${round(b, 3)} + 0.2 \\times ${round(c, 3)} = ${round(dist[0], 3)}`
  return (
    <div>
      <Controls>
        <span className="small muted">0日目の天気：</span>
        <Choice options={WEATHER.labels.map((l, i) => ({ value: i, label: l }))} value={start} onChange={restart} />
      </Controls>
      <StateDiagram chain={WEATHER} dist={dist} />
      <p className="figure-readout">
        <strong>{day}日目</strong>の天気の確率：晴 {round(dist[0], 3)}、曇 {round(dist[1], 3)}、雨 {round(dist[2], 3)}
        <br />
        {prev ? (
          <span className="small">
            晴の確率の計算（前の日の晴・曇・雨から晴へ来る矢印を足す）：<M>{sunnyCalc}</M>
          </span>
        ) : (
          <span className="small muted">「1日進める」を押すと、矢印の確率にしたがって分布が動く。</span>
        )}
      </p>
      <Plot x={[0, Math.max(10, day)]} y={[0, 1]} height={200} xLabel="日数 n" yLabel="確率">
        {WEATHER_PI.map((p, i) => (
          <HLine key={i} y={p} color={WEATHER.colors[i]} />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Polyline points={history.map((d, n) => ({ x: n, y: d[i] }))} color={WEATHER.colors[i]} />
            <Points data={history.map((d, n) => ({ x: n, y: d[i] }))} color={WEATHER.colors[i]} r={3} opacity={0.9} />
          </g>
        ))}
      </Plot>
      <Legend
        items={[
          ...WEATHER.labels.map((l, i) => ({ color: WEATHER.colors[i], label: `${l}の確率` })),
          { color: 'muted' as Color, label: '点線：定常分布（7/18, 6/18, 5/18）' },
        ]}
      />
      <Controls>
        <Button variant="primary" onClick={() => advance(1)} disabled={day >= 40}>
          1日進める
        </Button>
        <Button onClick={() => advance(10)} disabled={day >= 40}>
          10日進める
        </Button>
        <Button variant="ghost" onClick={() => restart(start)}>
          0日目に戻す
        </Button>
      </Controls>
    </div>
  )
}

/** 2状態（晴・雨）の連鎖。a = P(晴→雨)、b = P(雨→晴) を動かし、晴の確率が定常分布に近づく速さを見る */
export function TwoStateConvergence() {
  const [a, setA] = useState(0.2)
  const [b, setB] = useState(0.4)
  const pi = b / (a + b)
  const r = 1 - a - b
  const days = Array.from({ length: 21 }, (_, n) => n)
  // 晴の確率は p_n = π + (1−a−b)^n (p_0 − π) になる（本文の式）
  const fromSunny = days.map((n) => ({ x: n, y: pi + r ** n * (1 - pi) }))
  const fromRainy = days.map((n) => ({ x: n, y: pi + r ** n * (0 - pi) }))
  const periodic = a === 1 && b === 1
  return (
    <div>
      <Plot x={[0, 20]} y={[0, 1]} height={240} xLabel="日数 n" yLabel="晴の確率">
        <HLine y={pi} color="c5" label={`定常分布の晴 = ${round(pi, 3)}`} />
        <Polyline points={fromSunny} color="c2" />
        <Points data={fromSunny} color="c2" r={3.5} opacity={0.9} />
        <Polyline points={fromRainy} color="c1" />
        <Points data={fromRainy} color="c1" r={3.5} opacity={0.9} />
      </Plot>
      <Legend
        items={[
          { color: 'c2', label: '0日目が晴' },
          { color: 'c1', label: '0日目が雨' },
        ]}
      />
      <p className="figure-readout">
        定常分布：晴 <M>{'b/(a+b)'}</M> = <strong>{round(pi, 3)}</strong>、雨 <M>{'a/(a+b)'}</M> = <strong>{round(1 - pi, 3)}</strong>
        <br />
        定常分布とのずれは、1日ごとに <M>{'1-a-b'}</M> = <strong>{round(r, 2)}</strong> 倍になる
        {periodic
          ? '。a = b = 1 だと晴と雨が毎日入れかわり、ずれは −1 倍（向きが反転するだけ）で、いつまでも近づかない（周期 2）。'
          : Math.abs(r) < 0.3
            ? '。0 に近いので、すぐに定常分布に近づく。'
            : '。1（または −1）に近いほど、近づくのに時間がかかる。'}
      </p>
      <Controls>
        <Slider label="晴→雨の確率 a" value={a} min={0.05} max={1} step={0.05} onChange={(v) => setA(round(v, 2))} format={(v) => v.toFixed(2)} />
        <Slider label="雨→晴の確率 b" value={b} min={0.05} max={1} step={0.05} onChange={(v) => setB(round(v, 2))} format={(v) => v.toFixed(2)} />
      </Controls>
    </div>
  )
}

type GalleryItem = {
  key: string
  name: string
  chain: ChainSpec
  props: [string, string][]
  note: string
}

const GALLERY: GalleryItem[] = [
  {
    key: 'good',
    name: '既約・非周期',
    chain: WEATHER,
    props: [
      ['既約か', 'はい（どの天気からどの天気へも行ける）'],
      ['周期', '1（非周期。自分への矢印があるので1日で戻れる）'],
      ['再帰性', 'すべて再帰的'],
      ['定常分布', 'ただ1つ（7/18, 6/18, 5/18）'],
    ],
    note: 'どこから始めても、ステップを増やすと同じ定常分布に近づく。',
  },
  {
    key: 'absorb',
    name: '吸収状態がある',
    chain: {
      labels: ['A', 'B', 'C'],
      P: [
        [0.5, 0.3, 0.2],
        [0.3, 0.5, 0.2],
        [0, 0, 1],
      ],
      pos: [
        { x: 100, y: 100 },
        { x: 320, y: 100 },
        { x: 210, y: 240 },
      ],
      colors: ['c1', 'c2', 'c5'],
    },
    props: [
      ['既約か', 'いいえ（C から A・B へは行けない）'],
      ['周期', 'A・B・C とも 1'],
      ['再帰性', 'A・B は一時的（過渡的。いつか C に落ちて二度と戻らない）、C は再帰的'],
      ['定常分布', '(0, 0, 1) の1つ'],
    ],
    note: 'C に入ると出られない（吸収状態）。n を大きくすると、どこから始めても確率はすべて C に集まる。',
  },
  {
    key: 'periodic',
    name: '周期 2',
    chain: {
      labels: ['A', 'B', 'C'],
      P: [
        [0, 1, 0],
        [0.5, 0, 0.5],
        [0, 1, 0],
      ],
      pos: [
        { x: 70, y: 160 },
        { x: 210, y: 160 },
        { x: 350, y: 160 },
      ],
      colors: ['c1', 'c4', 'c3'],
    },
    props: [
      ['既約か', 'はい'],
      ['周期', '2（B に戻れるのは 2, 4, 6, … ステップ後だけ）'],
      ['再帰性', 'すべて再帰的'],
      ['定常分布', 'ただ1つ（0.25, 0.5, 0.25）'],
    ],
    note: '定常分布はあるのに、決まった状態から始めると、偶数ステップと奇数ステップで分布が入れかわり続けて、近づかない。',
  },
  {
    key: 'split',
    name: '2つに分かれている',
    chain: {
      labels: ['A', 'B', 'C', 'D'],
      P: [
        [0.5, 0.5, 0, 0],
        [0.5, 0.5, 0, 0],
        [0, 0, 0.4, 0.6],
        [0, 0, 0.6, 0.4],
      ],
      pos: [
        { x: 100, y: 90 },
        { x: 100, y: 240 },
        { x: 320, y: 90 },
        { x: 320, y: 240 },
      ],
      colors: ['c1', 'c1', 'c3', 'c3'],
    },
    props: [
      ['既約か', 'いいえ（A・B と C・D の間を行き来できない）'],
      ['周期', 'すべて 1'],
      ['再帰性', 'すべて再帰的'],
      ['定常分布', '1つに決まらない（(0.5, 0.5, 0, 0) も (0, 0, 0.5, 0.5) も、その混ぜ合わせも定常分布）'],
    ],
    note: 'A から始めると A・B の中だけ、C から始めると C・D の中だけを動く。行き着く先が出発点で変わる。',
  },
]

/** 既約性・周期・再帰性を、4つの例で見くらべる */
export function ChainGallery() {
  const [key, setKey] = useState('good')
  const [start, setStart] = useState(0)
  const [n, setN] = useState(0)
  const item = GALLERY.find((g) => g.key === key) ?? GALLERY[0]
  let dist = unitVector(item.chain.labels.length, Math.min(start, item.chain.labels.length - 1))
  for (let i = 0; i < n; i++) dist = step(dist, item.chain.P)
  return (
    <div>
      <Controls>
        <Choice
          options={GALLERY.map((g) => ({ value: g.key, label: g.name }))}
          value={key}
          onChange={(k) => {
            setKey(k)
            setStart(0)
            setN(0)
          }}
        />
      </Controls>
      <StateDiagram chain={item.chain} dist={dist} />
      <p className="figure-readout">
        {item.chain.labels[Math.min(start, item.chain.labels.length - 1)]} から始めて <strong>{n} ステップ後</strong>の分布：
        {item.chain.labels.map((l, i) => `${l} ${round(dist[i], 3)}`).join('、')}
      </p>
      <Controls>
        <span className="small muted">出発する状態：</span>
        <Choice options={item.chain.labels.map((l, i) => ({ value: i, label: l }))} value={start} onChange={setStart} />
      </Controls>
      <Controls>
        <Slider label="ステップ数 n" value={n} min={0} max={30} step={1} onChange={setN} />
      </Controls>
      <DataTable head={['性質', 'この例では']} rows={item.props.map(([k, v]) => [k, v])} />
      <p className="small">{item.note}</p>
    </div>
  )
}
