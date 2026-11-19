import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Bars, HLine, Plot } from '../../../components/charts/Plot'
import { round, sum } from '../../../lib/stats'

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']
const subscript = (i: number) => String(i).split('').map((d) => SUB[Number(d)]).join('')

/**
 * Σ の「上の数（どこまで足すか）」を動かして、足す範囲の棒だけ色を変える図。
 * 添字 i が「何番目か」を表すことと、Σ が「順番に足していく」操作であることを見せる。
 */
export function SigmaBars({ data, interactive = true }: { data: number[]; interactive?: boolean }) {
  const n = data.length
  const [k, setK] = useState(n)
  const used = data.slice(0, k)
  const total = sum(used)
  const yMax = Math.max(...data) * 1.25
  return (
    <div>
      <Plot
        x={[0.4, n + 0.6]}
        y={[0, yMax]}
        height={240}
        xTicks={data.map((_, i) => i + 1)}
        xTickFormat={(v) => `x${subscript(v)}`}
        yTicks={[0, Math.round(yMax / 2), Math.round(yMax)]}
      >
        <Bars
          data={data.map((y, i) => ({ x: i + 1, y }))}
          width={0.7}
          color="muted"
          opacity={0.5}
          highlight={(x) => x <= k}
          highlightColor="c1"
          labels={(y) => String(y)}
        />
      </Plot>
      <p className="figure-readout">
        <M>{`\\sum_{i=1}^{${k}} x_i = ${used.map((_, i) => `x_{${i + 1}}`).join(' + ')} = ${used.join(' + ')} = ${total}`}</M>
      </p>
      {interactive && (
        <Controls>
          <Slider label="Σ の上の数（どこまで足すか）" value={k} min={1} max={n} step={1} onChange={setK} />
        </Controls>
      )}
    </div>
  )
}

/** Σ_{i=1}^{n} c = n × c を、高さ c の棒が n 本並ぶ図で見せる */
export function SigmaConstant() {
  const [n, setN] = useState(5)
  const [c, setC] = useState(3)
  return (
    <div>
      <Plot x={[0.4, 10.6]} y={[0, 7.4]} height={220} xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} yTicks={[0, 2, 4, 6]}>
        <Bars data={Array.from({ length: n }, (_, i) => ({ x: i + 1, y: c }))} width={0.7} color="c3" labels={(y) => String(y)} />
        <HLine y={c} color="c3" label={`c = ${c}`} />
      </Plot>
      <p className="figure-readout">
        <M>{`\\sum_{i=1}^{${n}} ${c} = ${Array.from({ length: n }, () => String(c)).join(' + ')} = ${n} \\times ${c} = ${round(n * c, 2)}`}</M>
      </p>
      <Controls>
        <Slider label="n（何個足すか）" value={n} min={1} max={10} step={1} onChange={setN} />
        <Slider label="c（足す数）" value={c} min={1} max={6} step={1} onChange={setC} />
      </Controls>
    </div>
  )
}
