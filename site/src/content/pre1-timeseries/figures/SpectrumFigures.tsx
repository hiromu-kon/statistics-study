import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Bars, Curve, HLine, Legend, Plot, VLine } from '../../../components/charts/Plot'
import { round } from '../../../lib/stats'
import { Line } from '../../collection/figures/svg'
import { acf, ar1, durbinWatson, localLevelFilter, noiseSeries, periodogram } from './series'

const toPts = (xs: number[]) => xs.map((y, x) => ({ x, y }))

const WN = 96
const waveNoise = noiseSeries(WN, 31)
const WAVES = [
  { period: 24, color: 'c1' as const },
  { period: 8, color: 'c3' as const },
  { period: 3, color: 'c4' as const },
]

/** 周期の違う3つの波とノイズを足した系列と、そのペリオドグラム。山の位置が「含まれている周期」を表す */
export function WaveSum() {
  const [amps, setAmps] = useState([3, 1.5, 0])
  const [noise, setNoise] = useState(0.5)
  const comps = WAVES.map((w, i) => Array.from({ length: WN }, (_, t) => amps[i] * Math.cos((2 * Math.PI * (t + 1)) / w.period)))
  const xs = Array.from({ length: WN }, (_, t) => comps.reduce((s, c) => s + c[t], 0) + noise * waveNoise[t])
  const pg = periodogram(xs)
  const top = Math.max(10, ...pg.map((d) => d.I)) * 1.1
  const peak = pg.reduce((a, b) => (b.I > a.I ? b : a))
  const lim = Math.max(3, ...xs.map(Math.abs)) * 1.1
  const setAmp = (i: number) => (v: number) => setAmps((a) => a.map((x, j) => (j === i ? v : x)))
  return (
    <div>
      {WAVES.map((w, i) => (
        <Plot key={w.period} x={[0, WN]} y={[-4, 4]} height={78} xTicks={[]} yTicks={[0]} hideY grid={false}>
          <HLine y={0} color="muted" />
          <Line data={toPts(comps[i])} color={w.color} width={1.6} />
        </Plot>
      ))}
      <Plot x={[0, WN]} y={[-lim, lim]} height={170} xTicks={[0, 24, 48, 72, 96]} xLabel="時点 t" yLabel="足した系列 x_t">
        <HLine y={0} color="muted" />
        <Line data={toPts(xs)} color="ink" width={1.6} />
      </Plot>
      <Plot x={[0, 0.5]} y={[0, top]} height={200} xTicks={[0, 1 / 24, 1 / 8, 0.25, 1 / 3, 0.5]} xTickFormat={(v) => (v === 0 ? '0' : v === 0.5 ? '1/2' : v === 0.25 ? '1/4' : `1/${Math.round(1 / v)}`)} xLabel="周波数 f（1時点あたり何回くり返すか）" yLabel="ペリオドグラム I(f)">
        <Bars data={pg.map((d) => ({ x: d.f, y: d.I }))} width={0.6 / WN} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '周期 24 の波（f = 1/24）' },
          { color: 'c3', label: '周期 8 の波（f = 1/8）' },
          { color: 'c4', label: '周期 3 の波（f = 1/3）' },
        ]}
      />
      <Controls>
        {WAVES.map((w, i) => (
          <Slider key={w.period} label={`周期 ${w.period} の波の振幅`} value={amps[i]} min={0} max={3} step={0.5} onChange={setAmp(i)} />
        ))}
        <Slider label="ノイズの標準偏差" value={noise} min={0} max={2} step={0.25} onChange={setNoise} />
      </Controls>
      <p className="figure-readout">
        いちばん高い山：f = {peak.f.toFixed(3)}（周期 {round(1 / peak.f, 1)}）。振幅 A の波は、山の高さがおよそ n·A²/4（n = {WN}）になる
      </p>
    </div>
  )
}

/** AR(1) のスペクトル密度 σ² / (1 − 2φ cos 2πf + φ²)。φ の符号で、低い周波数と高い周波数のどちらが大きいかが入れかわる */
export function Ar1Spectrum() {
  const [phi, setPhi] = useState(0.6)
  const p = (f: number) => 1 / (1 - 2 * phi * Math.cos(2 * Math.PI * f) + phi * phi)
  const top = Math.max(p(0), p(0.5)) * 1.1
  return (
    <div>
      <Plot x={[0, 0.5]} y={[0, top]} height={220} xTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} xLabel="周波数 f" yLabel="スペクトル密度 p(f)">
        <HLine y={1} color="muted" label="ホワイトノイズ（σ² = 1 で平ら）" />
        <Curve f={p} color="c2" />
      </Plot>
      <Controls>
        <Slider label="φ" value={phi} min={-0.9} max={0.9} step={0.1} onChange={setPhi} format={(v) => v.toFixed(1)} />
      </Controls>
      <p className="figure-readout">
        p(0) = {round(p(0), 2)}、p(1/2) = {round(p(0.5), 2)}。
        {phi > 0 ? ' φ > 0：ゆっくりした変動（低い周波数）が多い' : phi < 0 ? ' φ < 0：細かく上下する変動（高い周波数）が多い' : ' φ = 0：ホワイトノイズで、どの周波数も同じ'}
      </p>
    </div>
  )
}

const LN = 80
const levelNoise = noiseSeries(LN, 41)
const obsNoise = noiseSeries(LN, 42)
// 本当の水準は、分散 0.3 のランダムウォーク（図の上では「観測されない」もの）
const trueLevel = levelNoise.reduce<number[]>((acc, e, t) => [...acc, (t === 0 ? 10 : acc[t - 1]) + Math.sqrt(0.3) * e], [])
const observed = trueLevel.map((a, t) => a + obsNoise[t])
const Q_STEPS = [0.01, 0.03, 0.1, 0.3, 1, 3, 10]

/** ローカルレベルモデルとカルマンフィルタ。フィルタが仮定する q（状態のノイズ ÷ 観測のノイズ）を変えると追いかけ方が変わる */
export function LocalLevelDemo() {
  const [qi, setQi] = useState(3)
  const q = Q_STEPS[qi]
  const { level, gain } = localLevelFilter(observed, q)
  const lo = Math.floor(Math.min(...observed, ...trueLevel)) - 1
  const hi = Math.ceil(Math.max(...observed, ...trueLevel)) + 1
  return (
    <div>
      <Plot x={[-1, LN]} y={[lo, hi]} height={260} xTicks={[0, 20, 40, 60, 79]} xLabel="時点 t" yLabel="値">
        <Line data={toPts(trueLevel)} color="muted" width={2} dashed />
        <Line data={toPts(observed)} color="c1" width={1} dots opacity={0.5} />
        <Line data={toPts(level)} color="c2" width={3} />
      </Plot>
      <Legend
        items={[
          { color: 'muted', label: '本当の水準 α_t（ふつうは見えない）' },
          { color: 'c1', label: '観測 y_t = α_t + ノイズ' },
          { color: 'c2', label: 'カルマンフィルタの推定' },
        ]}
      />
      <Controls>
        <Slider label="q = 状態のノイズの分散 ÷ 観測のノイズの分散" value={qi} min={0} max={Q_STEPS.length - 1} step={1} onChange={setQi} format={(i) => String(Q_STEPS[i])} />
      </Controls>
      <p className="figure-readout">
        落ち着いたあとのカルマンゲイン K ≈ <strong>{round(gain[LN - 1], 2)}</strong>（新しい観測をどれだけ信じるか）。
        {q < 0.3 ? ' q が小さい：水準はあまり動かないと考えるので、なめらかだが変化への反応が遅い' : q > 0.3 ? ' q が大きい：水準がよく動くと考えるので、観測にぴったりついていき、ノイズまで拾う' : ' データを作ったときと同じ q = 0.3 で、ほどよく追いかける'}
      </p>
    </div>
  )
}

const DN = 60
const dwNoise = noiseSeries(DN, 53)

/** 回帰の残差に系列相関があるとき、残差の並び方とダービン・ワトソン比がどう変わるか */
export function DwDemo() {
  const [rho, setRho] = useState(0.7)
  // 定数項のある回帰の残差は合計 0 になるので、作った系列から平均を引いて残差らしくする
  const raw = ar1(rho, dwNoise)
  const m = raw.reduce((a, b) => a + b, 0) / raw.length
  const e = raw.map((x) => x - m)
  const dw = durbinWatson(e)
  const r1 = acf(e, 1)
  const lim = Math.max(3, ...e.map(Math.abs)) * 1.1
  return (
    <div>
      <Plot x={[-1, DN]} y={[-lim, lim]} height={220} xTicks={[0, 15, 30, 45, 59]} xLabel="時点 t" yLabel="残差 e_t">
        <HLine y={0} color="muted" dashed={false} />
        <Line data={toPts(e)} color="c1" width={1.5} dots />
      </Plot>
      <Plot x={[0, 4]} y={[0, 1]} height={80} hideY grid={false} xTicks={[0, 1, 2, 3, 4]}>
        <VLine x={2} color="muted" />
        <VLine x={Math.min(3.98, Math.max(0.02, dw))} color="c2" dashed={false} label={`DW = ${dw.toFixed(2)}`} />
      </Plot>
      <Controls>
        <Slider label="残差の系列相関 ρ（データを作るときの値）" value={rho} min={-0.9} max={0.9} step={0.1} onChange={setRho} format={(v) => v.toFixed(1)} />
      </Controls>
      <p className="figure-readout">
        r₁ = {r1.toFixed(2)}、2(1 − r₁) = {(2 * (1 - r1)).toFixed(2)}、DW = <strong>{dw.toFixed(2)}</strong>。
        {rho > 0 ? ' 正の系列相関：同じ符号の残差が続き、波のようにゆっくり動く → DW は 2 より小さい' : rho < 0 ? ' 負の系列相関：残差が + と − を交互にくり返す → DW は 2 より大きい' : ' 系列相関なし：DW は 2 の近く'}
      </p>
    </div>
  )
}
