import { Link } from 'react-router-dom'
import { chapters } from '../chapters'
import { lessonById } from '../registry'

// 試験形式は公式サイト（2026-11-19 参照）の記載のみを書く。
const FORMAT = [
  ['受験方法', 'CBT方式（パソコンで受験。全国の会場で随時受けられる）'],
  ['出題形式', '4〜5肢選択問題。選択肢を1つ選ぶ方式と、正解の番号を入力する方式がある'],
  ['問題数', '35問程度'],
  ['試験時間', '90分（1問あたり約2.5分）'],
  ['合格基準', '100点満点で60点以上'],
  ['電卓', '四則演算・百分率・平方根（√）が計算できる普通の電卓のみ1台。関数電卓は使えない'],
  ['統計数値表', '解答に必要な数値表（正規分布表など）は試験会場で配られ、試験後に回収される'],
]

const PLAN = [
  {
    phase: '1. 土台づくり',
    weeks: '1〜2週目',
    body: '「数学の準備」で分数・2乗・ルート・Σ記号を思い出す。ここを飛ばすと後の章で式が読めなくなるので、焦らず。',
    chapters: ['math'],
  },
  {
    phase: '2. データをまとめる',
    weeks: '3〜5週目',
    body: '平均・分散・標準偏差・相関・回帰直線。計算問題が多く、得点源になりやすい範囲。電卓を使って手を動かす。',
    chapters: ['descriptive', 'bivariate', 'collection'],
  },
  {
    phase: '3. 確率と分布',
    weeks: '6〜9週目',
    body: '確率 → 確率変数 → 確率分布 → 標本分布。推定・検定の「道具」になる部分。正規分布表の読み方はここで完璧にする。',
    chapters: ['probability', 'random-variables', 'distributions', 'sampling'],
  },
  {
    phase: '4. 推測統計',
    weeks: '10〜13週目',
    body: '区間推定・仮説検定・回帰分析・分散分析。どの場面でどの分布（z・t・χ²・F）を使うかを整理する。',
    chapters: ['estimation', 'testing', 'linear-models'],
  },
  {
    phase: '5. 仕上げ',
    weeks: '14週目〜',
    body: '模擬試験で時間を計って解き、間違えた問題を復習リストで潰す。公式の問題集（紙の試験の過去問と解説を収録）にも取り組む。CBT の過去問は公開されていない。',
    chapters: [],
  },
]

// 受験記や解説サイトの記述をまとめたもの。公式の発表ではないので、出典つきで「傾向」として扱う。
const TRENDS = [
  {
    point: '仮説検定・回帰分析・推定の出題が多い',
    detail: '回帰分析は試験の後半に2〜4問ほど、Excel などの出力表を読んで答える形が多いとされる。',
    lessons: ['testing-idea', 'linear-models-software-output', 'estimation-ci-mean'],
    sources: [
      { label: 'data-viz-lab', url: 'https://data-viz-lab.com/toukeikentei2' },
      { label: 'Qiita の整理記事', url: 'https://qiita.com/kakl_kakler_kaklest/items/cba5a5fef534dfe1f40a' },
    ],
  },
  {
    point: 'CBT では小問の誘導がなく、1問ずつ独立して出る',
    detail: '紙の試験のように前の小問で手順を誘導してくれないので、いきなり核心を問われても解けるようにしておく。',
    lessons: [],
    sources: [
      { label: '受験記（note）', url: 'https://note.com/bbk108/n/n85173c018a7f' },
      { label: '受験記（ブログ）', url: 'https://minarai-engi.com/toukei2-retry/' },
    ],
  },
  {
    point: '推定・検定では「正しい式を選ぶ」問題が多い',
    detail: '計算結果ではなく、求める過程の式が選択肢に並ぶ形。どの場面でどの式・どの分布を使うかを判定できるようにする。',
    lessons: ['estimation-ci-mean', 'testing-mean'],
    sources: [{ label: '受験記（note）', url: 'https://note.com/bbk108/n/n85173c018a7f' }],
  },
  {
    point: '結果を正しく解釈できるかを問う問題が増えている',
    detail: '区間推定・仮説検定の結果や、統計ソフトの出力の意味を正しく言えるか。図表を読み取る問題も多い。',
    lessons: ['estimation-ci-mean', 'testing-idea', 'descriptive-quartile-boxplot'],
    sources: [{ label: '傾向の分析記事', url: 'https://starpentagon.net/analytics/stat_certificate_2nd_grade_trend/' }],
  },
  {
    point: 'ベイズの定理・カイ二乗検定・F検定も油断しない',
    detail: 'F検定を飛ばして不合格になった、という受験記がある。どの分野もまんべんなく出るので、苦手な単元を残さない。',
    lessons: ['probability-bayes', 'testing-chi2', 'testing-two-samples'],
    sources: [{ label: '受験記（ブログ）', url: 'https://minarai-engi.com/toukei2-retry/' }],
  },
]

const LINKS = [
  {
    title: '統計検定 2級（公式サイト）',
    url: 'https://www.toukei-kentei.jp/exam/grade2/',
    note: '試験の形式・申込方法。受験前に必ず最新情報を確認する。',
  },
  {
    title: '統計検定2級 出題範囲表（PDF）',
    url: 'https://www.toukei-kentei.jp/hubfs/files/grade_range/grade2_hani_20181214.pdf',
    note: 'このサイトの章立てはこの表に合わせています。',
  },
  {
    title: '過去問題・公式問題集の案内（公式サイト）',
    url: 'https://www.toukei-kentei.jp/preparation/kakomon/',
    note: '2級の過去問は公式問題集に収録。CBT 方式の過去問は掲載されていない。',
  },
  {
    title: '統計WEB「統計学の時間」',
    url: 'https://bellcurve.jp/statistics/course/',
    note: '無料のWeb講座。このサイトの説明で足りないときの別解説として。',
  },
  {
    title: '『改訂版 日本統計学会公式認定 統計検定2級対応 統計学基礎』（東京図書）',
    url: 'https://ci.nii.ac.jp/ncid/BB08958899',
    note: '公式テキスト。用語の正式な定義を確認したいときに。',
  },
]

/** 2級コースの「試験と学習の進め方」 */
export function Grade2Guide() {
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
          出典：<a href="https://www.toukei-kentei.jp/exam/grade2/">統計検定公式サイト</a>（2026-11-19 参照）。変更されることがあるので、申し込む前に公式サイトを確認してください。
        </p>
      </section>

      <section className="lesson-section">
        <h2>おすすめの進め方（約3〜4か月）</h2>
        <div className="plan">
          {PLAN.map((p) => (
            <div key={p.phase} className="plan-step">
              <div className="plan-head">
                <strong>{p.phase}</strong>
                <span className="muted">{p.weeks}</span>
              </div>
              <p>{p.body}</p>
              <div className="plan-links">
                {p.chapters.map((id) => {
                  const c = chapters.find((x) => x.id === id)!
                  return (
                    <Link key={id} className="chip chip-link" to={`/chapters/${id}`}>
                      {c.title}
                    </Link>
                  )
                })}
                {p.chapters.length === 0 && (
                  <>
                    <Link className="chip chip-link" to="/courses/grade2/mock">
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
        <p>
          各レッスンは「一言でいうと → 具体例 → 式 → 直感的な理解 → よくある勘違い → 統計検定での出方」の順に書いています。
          式がわからなくても、まずは図と具体例で「何を知りたいのか」をつかめば十分です。
        </p>
      </section>

      <section className="lesson-section">
        <h2>よく出ると言われていること（非公式）</h2>
        <p className="muted small">受験記や解説サイトの記述をまとめたものです。公式の発表ではありません（2026-11-19 参照）。</p>
        <div className="plan">
          {TRENDS.map((t) => (
            <div key={t.point} className="plan-step">
              <strong>{t.point}</strong>
              <p>{t.detail}</p>
              <div className="plan-links">
                {t.lessons.map((id) => {
                  const l = lessonById.get(id)
                  return (
                    l && (
                      <Link key={id} className="chip chip-link" to={`/lessons/${id}`}>
                        {l.title}
                      </Link>
                    )
                  )
                })}
                {t.sources.map((src) => (
                  <a key={src.url} className="chip chip-link" href={src.url} target="_blank" rel="noreferrer">
                    出典：{src.label}
                  </a>
                ))}
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
        <p className="muted small">このサイトの問題はすべてオリジナルです。過去問の本文は転載していません。</p>
      </section>
    </>
  )
}
