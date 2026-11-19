import { Link } from 'react-router-dom'
import { chapterById } from '../chapters'

// 試験形式は公式サイト（2026-11-20 参照）の記載のみを書く。
// 120分と書いている解説サイトもあるが、公式ページの「試験時間 90分」を正とする。
const FORMAT = [
  ['受験方法', 'CBT方式（パソコンで受験）'],
  ['出題形式', '5肢選択問題と数値入力問題'],
  ['問題数', '25〜30問'],
  ['試験時間', '90分（1問あたり3〜3.6分）'],
  ['合格基準', '100点満点で60点以上'],
  ['電卓', '四則演算・百分率・平方根（√）が計算できる普通の電卓または事務用電卓を1台。関数電卓・金融電卓は使えない'],
  ['統計数値表', '解答に必要な数値表（付表1〜4）は試験会場で配られ、試験後に回収される。問題は配られる数値表だけで正答が出せるように作られている'],
  ['出題範囲', '2級の内容をすべて含む。2027年1月1日から新しい出題範囲表になる'],
]

const PLAN = [
  {
    phase: '0. 2級の内容が前提',
    body: '準1級は2級の内容をすべて含む。2級コースの推定・検定・回帰がすらすら読めない場合は、先にそちらを復習する。',
    chapters: [],
    grade2: true,
  },
  {
    phase: '1. 数学の準備',
    body: '微分・積分・指数と対数・行列。最尤法、積率母関数、主成分分析などで必ず使う。ここを固めてから先に進む。',
    chapters: ['pre1-math'],
  },
  {
    phase: '2. 確率と分布の理論',
    body: '同時分布と条件つき分布、積率母関数、変数変換、極限定理。ガンマ分布・ベータ分布・多変量正規分布。推定と検定の理論の土台になる。',
    chapters: ['pre1-probability', 'pre1-distributions', 'pre1-stochastic'],
  },
  {
    phase: '3. 推定と検定の理論',
    body: '最尤法、十分統計量、フィッシャー情報量、尤度比検定、ノンパラメトリック法。2級では「使う」だけだった推定・検定を「なぜそうなるか」から学ぶ。',
    chapters: ['pre1-estimation', 'pre1-testing'],
  },
  {
    phase: '4. 応用の手法',
    body: '回帰分析（一般化線形モデル・正則化・生存時間分析）、実験計画法、標本調査法、多変量解析、時系列解析。どの場面でどの手法を使うかと、出力の読み方を押さえる。',
    chapters: ['pre1-regression', 'pre1-design', 'pre1-multivariate', 'pre1-timeseries'],
  },
  {
    phase: '5. 仕上げ',
    body: '模擬試験で時間を計って解き、数値入力問題にも慣れる。公式テキストの例題にも取り組む。',
    chapters: [],
  },
]

const LINKS = [
  {
    title: '統計検定準1級（公式サイト）',
    url: 'https://www.toukei-kentei.jp/grade/grade_pre-1',
    note: '試験の形式・申込方法。受験前に必ず最新情報を確認する。',
  },
  {
    title: '準1級 出題範囲表（2027年1月1日以降）（PDF）',
    url: 'https://www.toukei-kentei.jp/hubfs/files/20.grade/grade_range/grade1semi_hani_20270101.pdf',
    note: 'このコースの章立てはこの表に合わせています。2026年12月31日までは別の範囲表なので注意。',
  },
  {
    title: '『増補版 日本統計学会公式認定 統計検定準1級対応 統計学実践ワークブック』（学術図書出版社、2026年8月）',
    url: 'https://www.maruzenjunkudo.co.jp/products/9784780614756',
    note: '公式テキスト。増補版で統計的因果推論の章が加わった。',
  },
]

/** 準1級コースの「試験と学習の進め方」 */
export function Pre1Guide() {
  return (
    <>
      <section className="lesson-section">
        <h2>試験の形式</h2>
        <div className="table-wrap">
          <table className="data-table">
            <tbody>
              {FORMAT.map(([k, v]) => (
                <tr key={k}>
                  <th>{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          出典：<a href="https://www.toukei-kentei.jp/grade/grade_pre-1">統計検定公式サイト</a>（2026-11-20 参照）。
          変更されることがあるので、申し込む前に公式サイトを確認してください。
        </p>
        <p>
          2級との大きな違いは、<strong>数値入力問題</strong>があることです。選択肢から当てはめて確かめることができないので、計算を最後までやり切る必要があります。
          このサイトの問題も、一部を数値入力にしています。
        </p>
      </section>

      <section className="lesson-section">
        <h2>おすすめの進め方</h2>
        <div className="plan">
          {PLAN.map((p) => (
            <div key={p.phase} className="plan-step">
              <div className="plan-head">
                <strong>{p.phase}</strong>
              </div>
              <p>{p.body}</p>
              <div className="plan-links">
                {p.chapters.map((id) => {
                  const c = chapterById.get(id)
                  return (
                    c && (
                      <Link key={id} className="chip chip-link" to={`/chapters/${id}`}>
                        {c.title}
                      </Link>
                    )
                  )
                })}
                {p.grade2 && (
                  <Link className="chip chip-link" to="/courses/grade2">
                    2級コース
                  </Link>
                )}
                {p.chapters.length === 0 && !p.grade2 && (
                  <>
                    <Link className="chip chip-link" to="/courses/pre1/mock">
                      模擬試験
                    </Link>
                    <Link className="chip chip-link" to="/review">
                      復習リスト
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lesson-section">
        <h2>あわせて使える外部の教材</h2>
        <ul className="link-list">
          {LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer">
                {l.title}
              </a>
              <span className="muted"> — {l.note}</span>
            </li>
          ))}
        </ul>
        <p className="muted small">このサイトの問題はすべてオリジナルです。過去問や公式テキストの本文は転載していません。</p>
      </section>
    </>
  )
}
