import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { mean, normalPdf, normalQuantile, round, sd, tPdf, tQuantile } from '../../../lib/stats'
import { ColorText, Mark, TestDistPlot, Verdict } from './parts'

/** t 分布と標準正規分布を重ね、両側5%の境目がどう変わるかを見せる */
export function TvsZ() {
  const [df, setDf] = useState(4)
  const tc = tQuantile(0.975, df)
  const zc = normalQuantile(0.975)
  return (
    <div>
      <Plot x={[-5, 5]} y={[0, 0.45]} hideY xTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]} xLabel="検定統計量の値">
        <Curve f={(x) => normalPdf(x)} color="muted" dashed />
        <Curve f={(x) => tPdf(x, df)} color="c1" />
        <Mark x={tc} color="c5" />
        <Mark x={-tc} color="c5" />
        <Mark x={zc} color="muted" />
        <Mark x={-zc} color="muted" />
        <ColorText x={tc} y={0.3} color="c5" anchor="start">
          {` ${round(tc, 3)}`}
        </ColorText>
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `t 分布（自由度 ${df}）` },
          { color: 'muted', label: '標準正規分布（境目 1.96）' },
        ]}
      />
      <p className="figure-readout">
        両側 5% の境目：t 分布なら <strong>{round(tc, 3)}</strong>、正規分布なら 1.96。自由度が小さいほど境目が外に広がる
      </p>
      <Controls>
        <Slider label="自由度 n − 1" value={df} min={1} max={30} step={1} onChange={setDf} />
      </Controls>
    </div>
  )
}

/** 電池の持ち時間の例：10個のデータを数直線に並べる */
export function BatteryDots({ data, mu0 }: { data: number[]; mu0: number }) {
  const m = mean(data)
  const sorted = [...data].sort((a, b) => a - b)
  const pts = sorted.map((x, i) => ({ x, y: 1 + (i % 2) * 0.6 }))
  return (
    <div>
      <Plot x={[18, 20.8]} y={[0, 3]} hideY grid={false} height={160} xTicks={[18, 18.5, 19, 19.5, 20, 20.5]} xLabel="電池の持ち時間（時間）">
        <Mark x={mu0} color="c5" />
        <Mark x={m} color="c2" dashed={false} />
        <Points data={pts} r={6} />
        <ColorText x={mu0} y={2.6} color="c5" anchor="end">
          {`公称 ${mu0} `}
        </ColorText>
        <ColorText x={m} y={2.6} color="c2" anchor="end">
          {`平均 ${round(m, 2)} `}
        </ColorText>
      </Plot>
      <p className="figure-readout">
        標本平均 {round(m, 2)}、標本標準偏差 s ≒ {round(sd(data, 1), 3)}（n − 1 で割る）
      </p>
    </div>
  )
}

/**
 * 95% 信頼区間と両側 5% の t 検定が同じ判定になることを見せる。
 * μ0 を動かすと、「区間の外」と「棄却域に入る」が必ず同時に起きる。
 */
export function CiTestLink({ xbar = 50.9, s = 6.5, n = 25 }: { xbar?: number; s?: number; n?: number }) {
  const [mu0, setMu0] = useState(54)
  const se = s / Math.sqrt(n)
  const tc = tQuantile(0.975, n - 1)
  const lo = xbar - tc * se
  const hi = xbar + tc * se
  const t = (xbar - mu0) / se
  const outside = mu0 < lo || mu0 > hi
  return (
    <div>
      <Plot x={[45, 57]} y={[0, 2]} hideY grid={false} height={150} xTicks={[45, 47, 49, 51, 53, 55, 57]} xLabel="母平均 μ の値">
        <Segment x1={lo} y1={1} x2={hi} y2={1} color="c1" width={8} />
        <Points data={[{ x: xbar, y: 1 }]} r={7} color="ink" opacity={1} />
        <Mark x={mu0} color={outside ? 'c5' : 'c3'} dashed={false} width={3} />
        <ColorText x={(lo + hi) / 2} y={1} dy={-14} color="c1">
          {`95% 信頼区間 ${round(lo, 2)} 〜 ${round(hi, 2)}`}
        </ColorText>
        <ColorText x={mu0} y={1.75} color={outside ? 'c5' : 'c3'} anchor="start">
          {` μ0 = ${mu0.toFixed(1)}`}
        </ColorText>
      </Plot>
      <p className="figure-readout">
        μ0 は区間の<strong>{outside ? '外' : '中'}</strong>　／　t = ({xbar} − {mu0.toFixed(1)}) ÷ {round(se, 2)} ≒ <strong>{round(t, 3)}</strong>、
        |t| {Math.abs(t) > tc ? '>' : '≦'} {round(tc, 3)} → <Verdict reject={Math.abs(t) > tc} />
      </p>
      <Controls>
        <Slider label="帰無仮説の値 μ0" value={mu0} min={45.5} max={56.5} step={0.1} onChange={setMu0} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}

/** 対応のあるデータ：前後を線で結んだ図と、差だけを取り出した図 */
export function PairedPlot({ before, after }: { before: number[]; after: number[] }) {
  const lo = Math.min(...before, ...after) - 3
  const hi = Math.max(...before, ...after) + 3
  const diffs = after.map((a, i) => a - before[i])
  return (
    <div className="compare">
      <div>
        <Plot x={[-0.4, 1.4]} y={[lo, hi]} height={260} xTicks={[0, 1]} xTickFormat={(v) => (v === 0 ? '前' : '後')} yLabel="点数">
          {before.map((b, i) => (
            <Segment key={i} x1={0} y1={b} x2={1} y2={after[i]} color={after[i] >= b ? 'c3' : 'c5'} width={2} />
          ))}
          <Points data={before.map((y) => ({ x: 0, y }))} r={5} color="muted" opacity={1} />
          <Points data={after.map((y) => ({ x: 1, y }))} r={5} color="c1" opacity={1} />
        </Plot>
        <p className="figure-readout">1人ずつ前後を結ぶ（緑は上がった人）</p>
      </div>
      <div>
        <Plot x={[-3, 7]} y={[0, 2]} hideY grid={false} height={260} xTicks={[-2, 0, 2, 4, 6]} xLabel="差 d = 後 − 前">
          <Mark x={0} color="c5" />
          <Points data={diffs.map((x, i) => ({ x, y: 0.6 + (i % 3) * 0.35 }))} r={7} color="c3" />
          <Mark x={mean(diffs)} color="c2" dashed={false} />
          <ColorText x={mean(diffs)} y={1.8} color="c2" anchor="start">
            {` 差の平均 ${round(mean(diffs), 2)}`}
          </ColorText>
          <ColorText x={0} y={1.8} color="c5" anchor="end">
            {'H0: 0 '}
          </ColorText>
        </Plot>
        <p className="figure-readout">差だけを見れば「1つのデータ」になる</p>
      </div>
    </div>
  )
}

/** 1標本の t 検定の結果を t 分布の上に描く */
export function TResultPlot({ t, df, sided = 'two' }: { t: number; df: number; sided?: 'two' | 'right' }) {
  const c = tQuantile(sided === 'two' ? 0.975 : 0.95, df)
  const reach = Math.max(4.5, Math.abs(t) + 0.8)
  return (
    <TestDistPlot
      pdf={(x) => tPdf(x, df)}
      x={[-reach, reach]}
      yMax={0.45}
      reject={sided === 'two' ? [[-Infinity, -c], [c, Infinity]] : [[c, Infinity]]}
      criticals={sided === 'two' ? [{ x: -c, label: `−${round(c, 3)} ` }, { x: c, label: ` ${round(c, 3)}` }] : [{ x: c, label: ` ${round(c, 3)}` }]}
      observed={t}
      observedLabel={` t = ${round(t, 2)} `}
      xLabel={`t 分布（自由度 ${df}）`}
    />
  )
}
