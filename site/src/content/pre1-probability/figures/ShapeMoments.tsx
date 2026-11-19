import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot } from '../../../components/charts/Plot'
import { gammaPdf, normalPdf, round, tPdf } from '../../../lib/stats'
import { Choice } from './parts'

type Family = 'gamma' | 't'

/**
 * 歪度と尖度を、標準化した（平均 0・分散 1 にそろえた）分布の形で見せる図。
 * ガンマ分布（形状 k）は右に裾が長く、歪度 2/√k・尖度 3 + 6/k。
 * t 分布（自由度 ν）は左右対称で歪度 0、裾が重く尖度 3 + 6/(ν − 4)（ν > 4）。
 * どちらも、パラメータを大きくすると標準正規分布（歪度 0・尖度 3）に近づく。
 */
export function ShapeMoments() {
  const [family, setFamily] = useState<Family>('gamma')
  const [k, setK] = useState(2)
  const [nu, setNu] = useState(6)
  let f: (z: number) => number
  let skew: number
  let kurt: number
  if (family === 'gamma') {
    // X ~ Gamma(k, 1) は平均 k・分散 k。Z = (X − k)/√k の密度は √k · f_X(k + z√k)
    const s = Math.sqrt(k)
    f = (z) => s * gammaPdf(k + z * s, k, 1)
    skew = 2 / Math.sqrt(k)
    kurt = 3 + 6 / k
  } else {
    // t(ν) の分散は ν/(ν − 2)。Z = T / √(ν/(ν − 2)) の密度は c · f_T(c z)、c = √(ν/(ν − 2))
    const c = Math.sqrt(nu / (nu - 2))
    f = (z) => c * tPdf(c * z, nu)
    skew = 0
    kurt = 3 + 6 / (nu - 4)
  }
  let peak = 0.4
  for (let z = -3.5; z <= 4.5; z += 0.02) peak = Math.max(peak, f(z))
  const yMax = Math.min(peak, 1.2) * 1.1
  return (
    <div>
      <Controls>
        <Choice<Family>
          options={[
            { value: 'gamma', label: 'ガンマ分布（右に裾が長い）' },
            { value: 't', label: 't 分布（裾が重い）' },
          ]}
          value={family}
          onChange={setFamily}
        />
      </Controls>
      <Plot x={[-3.5, 4.5]} y={[0, yMax]} height={250} xLabel="標準化した値 z" hideY>
        <Curve f={(z) => normalPdf(z)} color="muted" dashed />
        <Curve f={f} color="c1" samples={400} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: family === 'gamma' ? `ガンマ分布（形状 k = ${k}）を標準化` : `t 分布（自由度 ν = ${nu}）を標準化` },
          { color: 'muted', label: '標準正規分布（歪度 0、尖度 3）' },
        ]}
      />
      <p className="figure-readout">
        歪度 = <strong>{round(skew, 3)}</strong>　尖度 = <strong>{round(kurt, 3)}</strong>（3 を引いた値 = {round(kurt - 3, 3)}）
      </p>
      <Controls>
        {family === 'gamma' ? (
          <Slider label="形状 k" value={k} min={1} max={30} step={1} onChange={setK} />
        ) : (
          <Slider label="自由度 ν" value={nu} min={5} max={40} step={1} onChange={setNu} />
        )}
      </Controls>
    </div>
  )
}
