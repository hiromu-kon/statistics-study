import { useState } from 'react'
import { Controls, DataTable, Slider } from '../../../components/blocks'
import { M } from '../../../components/Math'
import { Bars, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'
import { binomialPmf, combination, covariance, correlation, createRng, poissonPmf, round } from '../../../lib/stats'
import { Choice, RelationDiagram, type DiagramEdge, type DiagramNode } from './parts'

// ---------- 離散分布の関係図 ----------

type NodeId = 'uniform' | 'bernoulli' | 'binomial' | 'multinomial' | 'hyper' | 'poisson' | 'geometric' | 'negbin'

const NODES: Record<NodeId, DiagramNode> = {
  uniform: { label: '離散一様', x: 90, y: 45 },
  bernoulli: { label: 'ベルヌーイ', x: 90, y: 150 },
  binomial: { label: '二項', x: 280, y: 150 },
  multinomial: { label: '多項', x: 470, y: 45, accent: true },
  hyper: { label: '超幾何', x: 470, y: 150 },
  poisson: { label: 'ポアソン', x: 470, y: 255 },
  geometric: { label: '幾何', x: 90, y: 255 },
  negbin: { label: '負の二項', x: 280, y: 255 },
}

const EDGES: DiagramEdge[] = [
  { from: 'bernoulli', to: 'uniform', label: 'p = 1/2 なら {0, 1} の一様', dashed: true },
  { from: 'bernoulli', to: 'binomial', label: 'n 個の和' },
  { from: 'binomial', to: 'multinomial', label: '結果を3種類以上に' },
  { from: 'hyper', to: 'binomial', label: 'N → ∞', dy: -8 },
  { from: 'binomial', to: 'poisson', label: 'n → ∞, np = λ' },
  { from: 'bernoulli', to: 'geometric', label: '初めて成功するまで' },
  { from: 'geometric', to: 'negbin', label: 'r 個の和' },
]

type Info = { what: string; param: string; pmf: string; mean: string; variance: string; mgf: string }

// 幾何分布・負の二項分布は2級のレッスンと同じく「試行回数」で数える流儀で書く
const INFO: Record<NodeId, Info> = {
  uniform: {
    what: '1, 2, …, N のどれもが同じ確率で出る（公正なサイコロ）',
    param: 'N',
    pmf: 'P(X = k) = \\frac{1}{N}\\ (k = 1, \\dots, N)',
    mean: '\\frac{N+1}{2}',
    variance: '\\frac{N^2 - 1}{12}',
    mgf: '\\frac{1}{N}\\sum_{k=1}^{N} e^{kt}',
  },
  bernoulli: {
    what: '1回だけの試行で、成功なら 1、失敗なら 0',
    param: 'p（成功の確率）',
    pmf: 'P(X = 1) = p,\\ P(X = 0) = 1 - p',
    mean: 'p',
    variance: 'p(1-p)',
    mgf: '1 - p + pe^{t}',
  },
  binomial: {
    what: 'n 回の独立な試行での成功の回数',
    param: 'n, p',
    pmf: '{}_{n}C_{k}\\, p^{k}(1-p)^{n-k}',
    mean: 'np',
    variance: 'np(1-p)',
    mgf: '(1 - p + pe^{t})^{n}',
  },
  multinomial: {
    what: 'n 回の独立な試行で、k 種類の結果がそれぞれ何回出たか（回数の組）',
    param: 'n, p₁, …, p_k（合計 1）',
    pmf: '\\frac{n!}{x_1! \\cdots x_k!} p_1^{x_1} \\cdots p_k^{x_k}',
    mean: 'E(X_i) = np_i',
    variance: 'V(X_i) = np_i(1-p_i),\\ \\mathrm{Cov}(X_i, X_j) = -np_ip_j',
    mgf: '(p_1e^{t_1} + \\cdots + p_ke^{t_k})^{n}',
  },
  hyper: {
    what: 'N 本中 M 本が当たりのくじから、戻さずに n 本引いたときの当たりの本数',
    param: 'N, M, n',
    pmf: '\\frac{{}_{M}C_{k}\\, {}_{N-M}C_{n-k}}{{}_{N}C_{n}}',
    mean: 'np\\ (p = M/N)',
    variance: 'np(1-p)\\frac{N-n}{N-1}',
    mgf: '',
  },
  poisson: {
    what: '一定の時間・範囲にまれな出来事が起こる回数',
    param: 'λ（平均の回数）',
    pmf: '\\frac{\\lambda^{k} e^{-\\lambda}}{k!}',
    mean: '\\lambda',
    variance: '\\lambda',
    mgf: 'e^{\\lambda(e^{t} - 1)}',
  },
  geometric: {
    what: '初めて成功するまでの試行回数（成功した回も数える）',
    param: 'p',
    pmf: '(1-p)^{k-1}p\\ (k = 1, 2, \\dots)',
    mean: '\\frac{1}{p}',
    variance: '\\frac{1-p}{p^2}',
    mgf: '\\frac{pe^{t}}{1 - (1-p)e^{t}}',
  },
  negbin: {
    what: 'r 回成功するまでの試行回数',
    param: 'r, p',
    pmf: '{}_{k-1}C_{r-1}\\, p^{r}(1-p)^{k-r}\\ (k = r, r+1, \\dots)',
    mean: '\\frac{r}{p}',
    variance: '\\frac{r(1-p)}{p^2}',
    mgf: '\\left(\\frac{pe^{t}}{1 - (1-p)e^{t}}\\right)^{r}',
  },
}

/** 離散分布どうしの関係（特殊な場合・和・極限）。箱を押すとその分布の式が出る */
export function DiscreteMap() {
  const [selected, setSelected] = useState<NodeId>('binomial')
  const info = INFO[selected]
  return (
    <div>
      <RelationDiagram
        nodes={NODES}
        edges={EDGES}
        height={300}
        selected={selected}
        onSelect={(id) => setSelected(id as NodeId)}
        ariaLabel="離散型分布の関係図"
      />
      <Controls>
        <Choice<NodeId>
          options={(Object.keys(NODES) as NodeId[]).map((id) => ({ value: id, label: NODES[id].label }))}
          value={selected}
          onChange={setSelected}
        />
      </Controls>
      <DataTable
        head={['項目', `${NODES[selected].label}分布`]}
        rows={[
          ['何を表すか', info.what],
          ['パラメータ', info.param],
          ['確率関数', <M key="p">{info.pmf}</M>],
          ['平均', <M key="m">{info.mean}</M>],
          ['分散', <M key="v">{info.variance}</M>],
          ['積率母関数', selected === 'hyper' ? '簡単な形にならない' : <M key="g">{info.mgf}</M>],
        ]}
      />
    </div>
  )
}

// ---------- 極限の図 ----------

function BinomialToPoisson() {
  const [n, setN] = useState(10)
  const [lambda, setLambda] = useState(3)
  const p = lambda / n
  const ks = Array.from({ length: 13 }, (_, k) => k)
  const bin = ks.map((k) => ({ x: k - 0.18, y: k <= n ? binomialPmf(k, n, p) : 0 }))
  const poi = ks.map((k) => ({ x: k + 0.18, y: poissonPmf(k, lambda) }))
  const maxDiff = Math.max(...ks.map((k) => Math.abs((k <= n ? binomialPmf(k, n, p) : 0) - poissonPmf(k, lambda))))
  return (
    <>
      <Plot x={[-0.7, 12.7]} y={[0, 0.45]} height={250} xTicks={ks} xLabel="成功の回数 k" yLabel="確率">
        <Bars data={bin} width={0.34} color="c1" />
        <Bars data={poi} width={0.34} color="c2" />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: `二項分布 B(${n}, ${round(p, 3)})` },
          { color: 'c2', label: `ポアソン分布 Po(${lambda})` },
        ]}
      />
      <p className="figure-readout">
        平均 np = λ = {lambda} にそろえたまま n を大きくする（p = λ/n は小さくなる）。確率の差の最大 = <strong>{round(maxDiff, 4)}</strong>
      </p>
      <Controls>
        <Slider label="試行の回数 n" value={n} min={4} max={200} step={1} onChange={setN} />
        <Slider label="平均 λ = np" value={lambda} min={1} max={4} step={1} onChange={setLambda} />
      </Controls>
    </>
  )
}

function hyperPmf(k: number, N: number, Mwin: number, n: number): number {
  return (combination(Mwin, k) * combination(N - Mwin, n - k)) / combination(N, n)
}

function HyperToBinomial() {
  const [N, setN] = useState(20)
  const n = 8
  const p = 0.3
  const Mwin = Math.round(N * p)
  const ks = Array.from({ length: n + 1 }, (_, k) => k)
  const hyp = ks.map((k) => ({ x: k - 0.18, y: hyperPmf(k, N, Mwin, n) }))
  const bin = ks.map((k) => ({ x: k + 0.18, y: binomialPmf(k, n, p) }))
  const fpc = (N - n) / (N - 1)
  return (
    <>
      <Plot x={[-0.7, 8.7]} y={[0, 0.45]} height={250} xTicks={ks} xLabel="当たりの本数 k" yLabel="確率">
        <Bars data={hyp} width={0.34} color="c3" />
        <Bars data={bin} width={0.34} color="c1" />
      </Plot>
      <Legend
        items={[
          { color: 'c3', label: `超幾何（${N} 本中 ${Mwin} 本当たり、戻さず 8 本）` },
          { color: 'c1', label: '二項分布 B(8, 0.3)（戻して 8 本）' },
        ]}
      />
      <p className="figure-readout">
        超幾何分布の分散は二項分布の <M>{'\\frac{N-n}{N-1}'}</M> 倍 = <strong>{round(fpc, 3)}</strong> 倍。くじの本数 N が多いと 1 に近づき、2つの分布はほぼ重なる
      </p>
      <Controls>
        <Slider label="くじの本数 N" value={N} min={10} max={400} step={10} onChange={setN} />
      </Controls>
    </>
  )
}

/** 二項分布 → ポアソン分布、超幾何分布 → 二項分布 の極限を見る図 */
export function LimitExplorer() {
  const [kind, setKind] = useState<'poisson' | 'hyper'>('poisson')
  return (
    <div>
      <Controls>
        <Choice
          options={[
            { value: 'poisson' as const, label: '二項 → ポアソン' },
            { value: 'hyper' as const, label: '超幾何 → 二項' },
          ]}
          value={kind}
          onChange={setKind}
        />
      </Controls>
      {kind === 'poisson' ? <BinomialToPoisson /> : <HyperToBinomial />}
    </div>
  )
}

// ---------- 多項分布の散布図 ----------

const SIMS = 400
const MAX_N = 40
// n や確率を変えても同じ乱数を使い、点が「同じ偶然」のまま動くようにする
const MULTI_U = (() => {
  const rng = createRng(11)
  return Array.from({ length: SIMS * MAX_N }, () => rng())
})()
const JITTER = (() => {
  const rng = createRng(5)
  return Array.from({ length: SIMS }, () => [rng() - 0.5, rng() - 0.5])
})()

/** 多項分布の (X₁, X₂) を何度も作って散布図にする。合計が n に決まっているので右下がりになる */
export function MultinomialScatter() {
  const [n, setN] = useState(20)
  const [p1, setP1] = useState(0.5)
  const [p2, setP2] = useState(0.3)
  const p3 = round(1 - p1 - p2, 2)
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i < SIMS; i++) {
    let a = 0
    let b = 0
    for (let j = 0; j < n; j++) {
      const u = MULTI_U[i * MAX_N + j]
      if (u < p1) a++
      else if (u < p1 + p2) b++
    }
    xs.push(a)
    ys.push(b)
  }
  const sampleCov = covariance(xs, ys, 1)
  const sampleCorr = correlation(xs, ys)
  const theoryCorr = -Math.sqrt((p1 * p2) / ((1 - p1) * (1 - p2)))
  return (
    <div>
      <Plot x={[-1, n + 1]} y={[-1, n + 1]} width={420} height={380} xLabel="満足の人数 X₁" yLabel="ふつうの人数 X₂">
        <Segment x1={0} y1={n} x2={n} y2={0} color="muted" dashed />
        <Points data={xs.map((x, i) => ({ x: x + JITTER[i][0] * 0.5, y: ys[i] + JITTER[i][1] * 0.5 }))} r={3} opacity={0.35} />
        <Points data={[{ x: n * p1, y: n * p2 }]} color="c2" r={6} opacity={1} />
      </Plot>
      <p className="figure-readout">
        点は {SIMS} 回分の調査結果（重ならないよう少しずらしている）。オレンジは平均 (np₁, np₂) = ({round(n * p1, 1)}, {round(n * p2, 1)})。点線は X₁ + X₂ = n（不満が 0 人）
        <br />
        共分散：理論 <M>{'-np_1p_2'}</M> = <strong>{round(-n * p1 * p2, 2)}</strong>、この {SIMS} 回では {round(sampleCov, 2)}
        <br />
        相関係数：理論 <strong>{round(theoryCorr, 3)}</strong>、この {SIMS} 回では {round(sampleCorr, 3)}
      </p>
      <Controls>
        <Slider label="回答者の数 n" value={n} min={5} max={MAX_N} step={1} onChange={setN} />
        <Slider label="満足の確率 p₁" value={p1} min={0.1} max={0.8} step={0.05} onChange={(v) => {
            const w = round(v, 2)
            setP1(w)
            if (w + p2 > 0.95) setP2(round(0.95 - w, 2))
          }} format={(v) => v.toFixed(2)} />
        <Slider label="ふつうの確率 p₂" value={p2} min={0.05} max={round(0.95 - p1, 2)} step={0.05} onChange={(v) => setP2(round(v, 2))} format={(v) => v.toFixed(2)} />
      </Controls>
      <p className="small muted">不満の確率 p₃ = 1 − p₁ − p₂ = {p3}</p>
    </div>
  )
}
