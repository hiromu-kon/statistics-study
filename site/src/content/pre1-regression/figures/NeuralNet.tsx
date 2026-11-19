import { useState } from 'react'
import { Controls, Slider } from '../../../components/blocks'
import { Curve, Legend, Plot } from '../../../components/charts/Plot'

const sigmoid = (t: number) => 1 / (1 + Math.exp(-t))

/** 入力層 → 隠れ層 → 出力層のつながりの図（入力3・隠れ4・出力1） */
export function NetworkDiagram() {
  const layers = [
    { x: 70, n: 3, label: '入力層', names: ['x1', 'x2', 'x3'] },
    { x: 260, n: 4, label: '隠れ層', names: ['z1', 'z2', 'z3', 'z4'] },
    { x: 450, n: 1, label: '出力層', names: ['ŷ'] },
  ]
  const ys = (n: number) => Array.from({ length: n }, (_, i) => 50 + ((i + 0.5) * 200) / n)
  return (
    <svg className="plot" viewBox="0 0 520 280" role="img" aria-label="ニューラルネットワークの層の図">
      {layers.slice(0, -1).map((L, li) =>
        ys(L.n).flatMap((y1, i) =>
          ys(layers[li + 1].n).map((y2, j) => (
            <line key={`${li}-${i}-${j}`} x1={L.x} y1={y1} x2={layers[li + 1].x} y2={y2} stroke="var(--muted)" strokeWidth={1.2} opacity={0.7} />
          )),
        ),
      )}
      {layers.map((L, li) => (
        <g key={L.label}>
          <text className="plot-label" x={L.x} y={28} textAnchor="middle">
            {L.label}
          </text>
          {ys(L.n).map((y, i) => (
            <g key={i}>
              <circle cx={L.x} cy={y} r={19} fill="var(--surface)" stroke={`var(--${['c3', 'c1', 'c2'][li]})`} strokeWidth={2.5} />
              <text className="plot-annot" x={L.x} y={y + 4} textAnchor="middle">
                {L.names[i]}
              </text>
            </g>
          ))}
        </g>
      ))}
      <text className="plot-annot" x={165} y={268} textAnchor="middle">
        重みを掛けて足す → 活性化関数
      </text>
      <text className="plot-annot" x={355} y={268} textAnchor="middle">
        重みを掛けて足す
      </text>
    </svg>
  )
}

/**
 * 隠れ層が2つのシグモイドだけのネットワーク ŷ = v1 σ(w(x − c1)) − v2 σ(w(x − c2))。
 * S 字を2つ組み合わせると、直線やロジスティック曲線では表せない「山」の形が作れる。
 */
export function TwoUnitNet() {
  const [c1, setC1] = useState(-1)
  const [c2, setC2] = useState(1.5)
  const [w, setW] = useState(3)
  const z1 = (x: number) => sigmoid(w * (x - c1))
  const z2 = (x: number) => sigmoid(w * (x - c2))
  return (
    <div>
      <Plot x={[-4, 4]} y={[-1.1, 1.1]} xLabel="入力 x" yTicks={[-1, -0.5, 0, 0.5, 1]}>
        <Curve f={z1} color="c3" dashed width={2} />
        <Curve f={(x) => -z2(x)} color="c2" dashed width={2} />
        <Curve f={(x) => z1(x) - z2(x)} color="c1" width={3} />
      </Plot>
      <Legend
        items={[
          { color: 'c3', label: '隠れユニット1：σ(w(x − c1))' },
          { color: 'c2', label: '隠れユニット2（重み −1 を掛けたもの）' },
          { color: 'c1', label: '出力 = 2つの和' },
        ]}
      />
      <Controls>
        <Slider label="c1（1つめの段差の位置）" value={c1} min={-3} max={3} step={0.1} onChange={setC1} format={(v) => v.toFixed(1)} />
        <Slider label="c2（2つめの段差の位置）" value={c2} min={-3} max={3} step={0.1} onChange={setC2} format={(v) => v.toFixed(1)} />
        <Slider label="w（段差の急さ）" value={w} min={0.5} max={10} step={0.1} onChange={setW} format={(v) => v.toFixed(1)} />
      </Controls>
    </div>
  )
}
