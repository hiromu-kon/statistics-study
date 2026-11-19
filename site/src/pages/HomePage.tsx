import { Link } from 'react-router-dom'
import { chapters } from '../content/chapters'
import { lessons, lessonsByChapter, problems } from '../content/registry'
import { useProgress } from '../lib/progress'

export function HomePage() {
  const { completed, attempts, mocks } = useProgress()
  const doneCount = lessons.filter((l) => completed[l.id]).length
  const next = lessons.find((l) => !completed[l.id])
  const solved = problems.filter((p) => attempts[p.id]?.lastCorrect).length
  const wrongNow = problems.filter((p) => attempts[p.id] && !attempts[p.id].lastCorrect).length
  const lastMock = mocks.at(-1)

  return (
    <div className="page">
      <section className="hero">
        <p className="hero-kicker">統計検定2級 合格に向けた自分専用の教科書</p>
        <h1>中学数学から、2級の合格ラインまで。</h1>
        <p className="hero-lead">
          図を見て、手を動かして、問題で確かめる。わからなかったところは「復習リスト」に自動でたまります。
        </p>
        <div className="hero-actions">
          {next ? (
            <Link className="btn btn-primary btn-lg" to={`/lessons/${next.id}`}>
              {doneCount === 0 ? 'はじめる' : '続きから'}：{next.title}
            </Link>
          ) : (
            <Link className="btn btn-primary btn-lg" to="/mock">
              模擬試験に挑戦する
            </Link>
          )}
          <Link className="btn btn-lg" to="/exam">
            試験と学習の進め方
          </Link>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat">
          <div className="stat-label">読み終えたレッスン</div>
          <div className="stat-value">
            {doneCount}
            <small> / {lessons.length}</small>
          </div>
          <div className="meter">
            <div style={{ width: `${(doneCount / Math.max(1, lessons.length)) * 100}%` }} />
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">正解している問題</div>
          <div className="stat-value">
            {solved}
            <small> / {problems.length}</small>
          </div>
          <div className="meter">
            <div style={{ width: `${(solved / Math.max(1, problems.length)) * 100}%` }} />
          </div>
        </div>
        <Link to="/review" className="stat stat-link">
          <div className="stat-label">復習が必要な問題</div>
          <div className="stat-value">{wrongNow}</div>
          <div className="stat-note">直近で間違えた問題 →</div>
        </Link>
        <Link to="/mock" className="stat stat-link">
          <div className="stat-label">前回の模擬試験</div>
          <div className="stat-value">{lastMock ? `${Math.round((lastMock.score / lastMock.total) * 100)}点` : '—'}</div>
          <div className="stat-note">合格ラインは60点 →</div>
        </Link>
      </section>

      <h2 className="section-title">教科書の目次</h2>
      <div className="chapter-grid">
        {chapters.map((c) => {
          const ls = lessonsByChapter(c.id)
          const d = ls.filter((l) => completed[l.id]).length
          return (
            <Link key={c.id} to={`/chapters/${c.id}`} className="chapter-card">
              <div className="chapter-card-no">{c.prep ? '準備' : `第${c.order}章`}</div>
              <div className="chapter-card-title">{c.title}</div>
              <p>{c.summary}</p>
              <div className="chapter-card-foot">
                <div className="meter small">
                  <div style={{ width: `${(d / Math.max(1, ls.length)) * 100}%` }} />
                </div>
                <span>
                  {d}/{ls.length}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
