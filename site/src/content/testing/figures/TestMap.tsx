import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, DataTable } from '../../../components/blocks'
import { M } from '../../../components/Math'

type Result = {
  name: string
  stat: string
  dist: ReactNode
  lesson: string
  note?: ReactNode
}

type Node = { question: string; options: { label: string; next: Node | Result }[] }

const isResult = (v: Node | Result): v is Result => 'stat' in v

const L_MEAN = 'testing-mean'
const L_PV = 'testing-proportion-variance'
const L_TWO = 'testing-two-samples'
const L_CHI = 'testing-chi2'

const TREE: Node = {
  question: '何について調べたい？',
  options: [
    {
      label: '平均',
      next: {
        question: 'グループはいくつ？',
        options: [
          {
            label: '1つ（基準の値 μ0 と比べる）',
            next: {
              question: '母分散 σ² はわかっている？',
              options: [
                {
                  label: 'わかっている',
                  next: { name: '母平均の z 検定', stat: 'z = \\dfrac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}', dist: '標準正規分布 N(0, 1)', lesson: L_MEAN },
                },
                {
                  label: 'わからない（s で代用）',
                  next: { name: '母平均の t 検定', stat: 't = \\dfrac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}', dist: <>t 分布（自由度 <M>{'n-1'}</M>）</>, lesson: L_MEAN },
                },
              ],
            },
          },
          {
            label: '同じ人の前後など、対応のある2つ',
            next: {
              name: '対応のある t 検定',
              stat: 't = \\dfrac{\\bar{d}}{s_d / \\sqrt{n}}',
              dist: <>t 分布（自由度 <M>{'n-1'}</M>、n はペアの数）</>,
              lesson: L_MEAN,
              note: '差 d をとって、1標本の t 検定にする',
            },
          },
          {
            label: '別々の人たちの2つ（独立な2標本）',
            next: {
              question: '2つの母分散は？',
              options: [
                {
                  label: '両方わかっている',
                  next: {
                    name: '母平均の差の z 検定',
                    stat: 'z = \\dfrac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}}',
                    dist: '標準正規分布 N(0, 1)',
                    lesson: L_TWO,
                  },
                },
                {
                  label: 'わからないが、等しいと考えてよい',
                  next: {
                    name: '2標本 t 検定（プールした分散）',
                    stat: 't = \\dfrac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_p^2 (1/n_1 + 1/n_2)}}',
                    dist: <>t 分布（自由度 <M>{'n_1+n_2-2'}</M>）</>,
                    lesson: L_TWO,
                  },
                },
                {
                  label: 'わからず、等しいとは限らない',
                  next: {
                    name: 'ウェルチの t 検定',
                    stat: 't = \\dfrac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}',
                    dist: '近似的に t 分布（自由度は近似式で求める）',
                    lesson: L_TWO,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      label: '比率（割合）',
      next: {
        question: 'グループはいくつ？',
        options: [
          {
            label: '1つ（基準の比率 p0 と比べる）',
            next: {
              name: '母比率の検定',
              stat: 'z = \\dfrac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}}',
              dist: '近似的に標準正規分布（n が大きいとき）',
              lesson: L_PV,
              note: '分母は p̂ ではなく p0 を使う',
            },
          },
          {
            label: '2つ',
            next: {
              name: '母比率の差の検定',
              stat: 'z = \\dfrac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})(1/n_1 + 1/n_2)}}',
              dist: '近似的に標準正規分布',
              lesson: L_TWO,
              note: 'p̂ は2つを合わせた（プールした）比率',
            },
          },
        ],
      },
    },
    {
      label: '分散（ばらつき）',
      next: {
        question: 'グループはいくつ？',
        options: [
          {
            label: '1つ（基準の分散 σ0² と比べる）',
            next: { name: '母分散の検定', stat: '\\chi^2 = \\dfrac{(n-1)s^2}{\\sigma_0^2}', dist: <>χ² 分布（自由度 <M>{'n-1'}</M>）</>, lesson: L_PV },
          },
          {
            label: '2つ（ばらつきが等しいか）',
            next: { name: '母分散の比の検定（F 検定）', stat: 'F = \\dfrac{s_1^2}{s_2^2}', dist: <>F 分布（自由度 <M>{'(n_1-1,\\ n_2-1)'}</M>）</>, lesson: L_TWO },
          },
        ],
      },
    },
    {
      label: '度数（何人・何回）の分布',
      next: {
        question: 'どんな表？',
        options: [
          {
            label: '1つの分類が、決まった割合に合うか',
            next: {
              name: '適合度検定',
              stat: '\\chi^2 = \\sum \\dfrac{(O - E)^2}{E}',
              dist: <>χ² 分布（自由度 = カテゴリ数 − 1 − 推定したパラメータの数）</>,
              lesson: L_CHI,
            },
          },
          {
            label: '2つの分類のクロス表で、関係があるか',
            next: {
              name: '独立性の検定',
              stat: '\\chi^2 = \\sum \\dfrac{(O - E)^2}{E}',
              dist: <>χ² 分布（自由度 <M>{'(r-1)(c-1)'}</M>）</>,
              lesson: L_CHI,
            },
          },
        ],
      },
    },
  ],
}

/** 質問に答えていくと、使う検定統計量と分布にたどりつく「検定の地図」 */
export function TestChooser() {
  const [path, setPath] = useState<number[]>([])
  let node: Node | Result = TREE
  const answered: { question: string; answer: string }[] = []
  for (const i of path) {
    if (isResult(node)) break
    answered.push({ question: node.question, answer: node.options[i].label })
    node = node.options[i].next
  }
  return (
    <div>
      {answered.map((a, i) => (
        <p key={i} style={{ margin: '4px 0' }}>
          <span className="muted">{a.question}</span> → <strong>{a.answer}</strong>
        </p>
      ))}
      {isResult(node) ? (
        <div className="card" style={{ marginTop: 10, borderLeft: '4px solid var(--c3)' }}>
          <div className="card-title">{node.name}</div>
          <div style={{ fontSize: '1.1rem', margin: '6px 0' }}>
            <M>{node.stat}</M>
          </div>
          <p style={{ margin: '4px 0' }}>H0 が正しいときの分布：{node.dist}</p>
          {node.note && <p style={{ margin: '4px 0' }}>注意：{node.note}</p>}
          <p style={{ margin: '4px 0' }}>
            <Link to={`/lessons/${node.lesson}`}>くわしいレッスンへ →</Link>
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: '4px 0' }}>
            <strong>{node.question}</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {node.options.map((o, i) => (
              <Button key={o.label} onClick={() => setPath([...path, i])}>
                {o.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      {path.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <Button variant="ghost" onClick={() => setPath(path.slice(0, -1))}>
            ← 1つ戻る
          </Button>{' '}
          <Button variant="ghost" onClick={() => setPath([])}>
            最初から
          </Button>
        </div>
      )}
    </div>
  )
}

/** 検定の地図（一覧表） */
export function TestMapTable() {
  return (
    <DataTable
      head={['調べたいこと', '検定', '検定統計量', 'H0 のもとでの分布']}
      rows={[
        ['平均（σ 既知）', '母平均の z 検定', <M key="a">{'\\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}'}</M>, 'N(0, 1)'],
        ['平均（σ 未知）', '母平均の t 検定', <M key="b">{'\\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}}'}</M>, <M key="b2">{'t(n-1)'}</M>],
        ['前後の差（対応あり）', '対応のある t 検定', <M key="c">{'\\frac{\\bar{d}}{s_d/\\sqrt{n}}'}</M>, <M key="c2">{'t(n-1)'}</M>],
        ['比率', '母比率の検定', <M key="d">{'\\frac{\\hat{p}-p_0}{\\sqrt{p_0(1-p_0)/n}}'}</M>, 'N(0, 1)（近似）'],
        ['分散', '母分散の検定', <M key="e">{'\\frac{(n-1)s^2}{\\sigma_0^2}'}</M>, <M key="e2">{'\\chi^2(n-1)'}</M>],
        ['2つの平均（σ 既知）', '平均の差の z 検定', <M key="f">{'\\frac{\\bar{x}_1-\\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1+\\sigma_2^2/n_2}}'}</M>, 'N(0, 1)'],
        ['2つの平均（等分散）', '2標本 t 検定', <M key="g">{'\\frac{\\bar{x}_1-\\bar{x}_2}{\\sqrt{s_p^2(1/n_1+1/n_2)}}'}</M>, <M key="g2">{'t(n_1+n_2-2)'}</M>],
        ['2つの平均（等分散でない）', 'ウェルチの t 検定', <M key="h">{'\\frac{\\bar{x}_1-\\bar{x}_2}{\\sqrt{s_1^2/n_1+s_2^2/n_2}}'}</M>, 't（自由度は近似）'],
        ['2つの分散', 'F 検定', <M key="i">{'s_1^2 / s_2^2'}</M>, <M key="i2">{'F(n_1-1,\\,n_2-1)'}</M>],
        ['2つの比率', '比率の差の検定', <M key="j">{'\\frac{\\hat{p}_1-\\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})(1/n_1+1/n_2)}}'}</M>, 'N(0, 1)（近似）'],
        ['度数が理論に合うか', '適合度検定', <M key="k">{'\\sum\\frac{(O-E)^2}{E}'}</M>, 'χ²（カテゴリ数 − 1 − 推定数）'],
        ['クロス表の関係', '独立性の検定', <M key="l">{'\\sum\\frac{(O-E)^2}{E}'}</M>, <M key="l2">{'\\chi^2((r-1)(c-1))'}</M>],
      ]}
      caption="検定の地図：何を調べるかで、検定統計量と分布が決まる"
    />
  )
}
