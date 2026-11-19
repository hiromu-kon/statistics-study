import { useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { Curve, HLine, Legend, Plot, Points } from '../../../components/charts/Plot'
import { normalCdf, round } from '../../../lib/stats'
import { logitFit, passData, probitFit } from './glmData'

const logistic = (t: number) => 1 / (1 + Math.exp(-t))

function logLik(b0: number, b1: number): number {
  return passData.hours.reduce((s, x, i) => {
    const p = logistic(b0 + b1 * x)
    return s + (passData.pass[i] === 1 ? Math.log(p) : Math.log(1 - p))
  }, 0)
}

/**
 * ロジスティック曲線を β0・β1 のスライダーで動かす図。対数尤度がいちばん大きくなる位置が最尤推定値。
 * プロビットの当てはめ（点線）とも比べられる。
 */
export function LogisticCurve() {
  const [b0, setB0] = useState(logitFit.b0)
  const [b1, setB1] = useState(logitFit.b1)
  const [probit, setProbit] = useState(false)
  const ll = logLik(b0, b1)
  const best = logLik(logitFit.b0, logitFit.b1)
  return (
    <div>
      <Plot x={[0, 10.5]} y={[-0.05, 1.05]} xLabel="勉強時間 x（時間）" yLabel="合格の確率" yTicks={[0, 0.25, 0.5, 0.75, 1]}>
        <HLine y={0.5} color="muted" />
        {probit && <Curve f={(x) => normalCdf(probitFit.b0 + probitFit.b1 * x)} color="c3" dashed />}
        <Curve f={(x) => logistic(b0 + b1 * x)} color="c1" />
        <Points data={passData.hours.map((x, i) => ({ x, y: passData.pass[i] }))} r={5} color="ink" opacity={0.55} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `ロジスティック p = 1 / (1 + e^−(${round(b0, 2)} + ${round(b1, 2)}x))` },
          ...(probit ? [{ color: 'c3' as const, label: `プロビット p = Φ(${probitFit.b0} + ${probitFit.b1}x)` }] : []),
        ]}
      />
      <p className="figure-readout">
        対数尤度 log L = <strong>{round(ll, 3)}</strong>（最尤推定値のとき {round(best, 3)} で最大）　／　確率 0.5 になる時間 x = −β0/β1 ={' '}
        <strong>{b1 !== 0 ? round(-b0 / b1, 2) : '—'}</strong>
      </p>
      <Controls>
        <Slider label="β0（切片）" value={b0} min={-9} max={1} step={0.05} onChange={setB0} format={(v) => v.toFixed(2)} />
        <Slider label="β1（傾き）" value={b1} min={0} max={2.5} step={0.01} onChange={setB1} format={(v) => v.toFixed(2)} />
        <Button
          onClick={() => {
            setB0(logitFit.b0)
            setB1(logitFit.b1)
          }}
        >
          最尤推定値に戻す
        </Button>
        <Button variant={probit ? 'primary' : 'default'} onClick={() => setProbit((v) => !v)}>
          プロビットと比べる
        </Button>
      </Controls>
    </div>
  )
}
