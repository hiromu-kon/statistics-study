import { useState } from 'react'
import { M } from '../components/Math'
import { NormalArea } from '../components/charts/common'
import {
  chi2Cdf,
  chi2Quantile,
  fCdf,
  fQuantile,
  normalCdf,
  normalQuantile,
  tCdf,
  tQuantile,
} from '../lib/stats'

type Tab = 'normal' | 't' | 'chi2' | 'f' | 'calc'

const T_DF = [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 60, 120, Infinity]
const T_ALPHA = [0.1, 0.05, 0.025, 0.01, 0.005]
const CHI_DF = [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 50, 60, 80, 100]
const CHI_ALPHA = [0.995, 0.99, 0.975, 0.95, 0.9, 0.1, 0.05, 0.025, 0.01, 0.005]
const F_D1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]
const F_D2 = [...Array.from({ length: 20 }, (_, i) => i + 1), 25, 30, 40, 60, 120]

const tUpper = (alpha: number, df: number) => (df === Infinity ? normalQuantile(1 - alpha) : tQuantile(1 - alpha, df))

function NormalTable() {
  return (
    <>
      <p>
        表の値は <strong>上側確率</strong> <M>{'Q(z) = P(Z \\ge z)'}</M> です（<M>Z</M> は標準正規分布）。行が <M>z</M>{' '}
        の小数第1位まで、列が小数第2位です。例：<M>z = 1.96</M> は「1.9 の行」と「.06 の列」が交わるところで 0.0250。
      </p>
      <NormalArea from={1.96} to={10} />
      <div className="table-wrap">
        <table className="data-table dist-table">
          <thead>
            <tr>
              <th>z</th>
              {Array.from({ length: 10 }, (_, j) => (
                <th key={j}>.0{j}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 35 }, (_, i) => (
              <tr key={i}>
                <th>{(i / 10).toFixed(1)}</th>
                {Array.from({ length: 10 }, (_, j) => (
                  <td key={j}>{(1 - normalCdf(i / 10 + j / 100)).toFixed(4)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function TTable() {
  return (
    <>
      <p>
        表の値は、自由度 <M>m</M> の t 分布の <strong>上側 α 点</strong> <M>{'t_\\alpha(m)'}</M>（それより右の面積が α になる点）です。
        両側 95% の区間なら α = 0.025 の列を使います。
      </p>
      <div className="table-wrap">
        <table className="data-table dist-table">
          <thead>
            <tr>
              <th>自由度 m</th>
              {T_ALPHA.map((a) => (
                <th key={a}>α={a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {T_DF.map((df) => (
              <tr key={df}>
                <th>{df === Infinity ? '∞' : df}</th>
                {T_ALPHA.map((a) => (
                  <td key={a}>{tUpper(a, df).toFixed(3)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function ChiTable() {
  return (
    <>
      <p>
        表の値は、自由度 <M>m</M> のカイ二乗分布の <strong>上側 α 点</strong> <M>{'\\chi^2_\\alpha(m)'}</M> です。
        カイ二乗分布は左右対称ではないので、母分散の区間推定では「上側 0.975 点」と「上側 0.025 点」の両方を使います。
      </p>
      <div className="table-wrap">
        <table className="data-table dist-table">
          <thead>
            <tr>
              <th>自由度 m</th>
              {CHI_ALPHA.map((a) => (
                <th key={a}>α={a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHI_DF.map((df) => (
              <tr key={df}>
                <th>{df}</th>
                {CHI_ALPHA.map((a) => (
                  <td key={a}>{chi2Quantile(1 - a, df).toFixed(df < 3 && a > 0.9 ? 5 : 3)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function FTable() {
  const [alpha, setAlpha] = useState(0.05)
  return (
    <>
      <p>
        表の値は、自由度 <M>{'(m_1, m_2)'}</M> の F 分布の <strong>上側 α 点</strong> <M>{'F_\\alpha(m_1, m_2)'}</M> です。列が分子の自由度{' '}
        <M>m_1</M>、行が分母の自由度 <M>m_2</M>。下側の点は <M>{'F_{1-\\alpha}(m_1,m_2) = 1/F_\\alpha(m_2,m_1)'}</M> で求めます。
      </p>
      <div className="controls">
        {[0.05, 0.025, 0.01].map((a) => (
          <button key={a} type="button" className={`btn ${a === alpha ? 'btn-primary' : ''}`} onClick={() => setAlpha(a)}>
            α = {a}
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="data-table dist-table">
          <thead>
            <tr>
              <th>m₂＼m₁</th>
              {F_D1.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {F_D2.map((d2) => (
              <tr key={d2}>
                <th>{d2}</th>
                {F_D1.map((d1) => (
                  <td key={d1}>{fQuantile(1 - alpha, d1, d2).toFixed(2)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Calculator() {
  const [dist, setDist] = useState<'normal' | 't' | 'chi2' | 'f'>('normal')
  const [df1, setDf1] = useState(10)
  const [df2, setDf2] = useState(10)
  const [x, setX] = useState(1.96)
  const [alpha, setAlpha] = useState(0.025)
  const upperProb = {
    normal: () => 1 - normalCdf(x),
    t: () => 1 - tCdf(x, df1),
    chi2: () => 1 - chi2Cdf(x, df1),
    f: () => 1 - fCdf(x, df1, df2),
  }[dist]()
  const upperPoint = {
    normal: () => normalQuantile(1 - alpha),
    t: () => tQuantile(1 - alpha, df1),
    chi2: () => chi2Quantile(1 - alpha, df1),
    f: () => fQuantile(1 - alpha, df1, df2),
  }[dist]()
  const ok = alpha > 0 && alpha < 1 && df1 > 0 && df2 > 0
  return (
    <>
      <p>表にない値を調べたいときに使います（本番では使えないので、表の読み方も練習しておきましょう）。</p>
      <div className="filters">
        <label>
          分布
          <select value={dist} onChange={(e) => setDist(e.target.value as typeof dist)}>
            <option value="normal">標準正規分布</option>
            <option value="t">t 分布</option>
            <option value="chi2">カイ二乗分布</option>
            <option value="f">F 分布</option>
          </select>
        </label>
        {dist !== 'normal' && (
          <label>
            自由度{dist === 'f' ? ' m₁' : ''}
            <input type="number" min={1} value={df1} onChange={(e) => setDf1(Number(e.target.value))} />
          </label>
        )}
        {dist === 'f' && (
          <label>
            自由度 m₂
            <input type="number" min={1} value={df2} onChange={(e) => setDf2(Number(e.target.value))} />
          </label>
        )}
      </div>
      <div className="calc-grid">
        <div className="card">
          <div className="card-title">値 → 上側確率</div>
          <label className="calc-input">
            値 x
            <input type="number" step={0.01} value={x} onChange={(e) => setX(Number(e.target.value))} />
          </label>
          <p className="calc-result">
            P(X ≥ {x}) = <strong>{ok ? upperProb.toFixed(5) : '—'}</strong>
          </p>
        </div>
        <div className="card">
          <div className="card-title">上側確率 α → 値（上側 α 点）</div>
          <label className="calc-input">
            α
            <input type="number" step={0.005} min={0} max={1} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          </label>
          <p className="calc-result">
            上側 {alpha} 点 = <strong>{ok ? upperPoint.toFixed(4) : '—'}</strong>
          </p>
        </div>
      </div>
    </>
  )
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'normal', label: '標準正規分布表' },
  { id: 't', label: 't 分布表' },
  { id: 'chi2', label: 'カイ二乗分布表' },
  { id: 'f', label: 'F 分布表' },
  { id: 'calc', label: '計算機' },
]

export function TablesPage() {
  const [tab, setTab] = useState<Tab>('normal')
  return (
    <div className="page">
      <h1>分布表・計算機</h1>
      <p className="lead">本番では、必要な統計数値表が試験会場で配られます（公式サイトより）。どの表のどこを読むかに慣れておきましょう。</p>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'normal' && <NormalTable />}
      {tab === 't' && <TTable />}
      {tab === 'chi2' && <ChiTable />}
      {tab === 'f' && <FTable />}
      {tab === 'calc' && <Calculator />}
    </div>
  )
}
