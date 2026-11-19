import { Link, useParams } from 'react-router-dom'
import { chaptersByCourse } from '../content/chapters'
import { courseById, courses } from '../content/courses'
import { lessonsByChapter, lessonsByCourse, problemsByCourse } from '../content/registry'
import { useProgress } from '../lib/progress'
import { NotFoundPage } from './NotFoundPage'

export function HomePage() {
  const { courseId = '' } = useParams()
  const course = courseById.get(courseId)
  const { completed, attempts, mocks } = useProgress()
  if (!course) return <NotFoundPage />

  const lessons = lessonsByCourse(course.id)
  const problems = problemsByCourse(course.id)
  const chapters = chaptersByCourse(course.id)
  const doneCount = lessons.filter((l) => completed[l.id]).length
  const next = lessons.find((l) => !completed[l.id])
  const solved = problems.filter((p) => attempts[p.id]?.lastCorrect).length
  const wrongNow = problems.filter((p) => attempts[p.id] && !attempts[p.id].lastCorrect).length
  const lastMock = mocks.filter((m) => (m.course ?? 'grade2') === course.id).at(-1)

  return (
    <div className="page">
      <section className="hero">
        <p className="hero-kicker">{course.title} 合格に向けた自分専用の教科書</p>
        <h1>{course.headline}</h1>
        <p className="hero-lead">{course.summary}</p>
        {course.status === 'active' ? (
          <div className="hero-actions">
            {next ? (
              <Link className="btn btn-primary btn-lg" to={`/lessons/${next.id}`}>
                {doneCount === 0 ? 'はじめる' : '続きから'}：{next.title}
              </Link>
            ) : (
              course.mockExam && (
                <Link className="btn btn-primary btn-lg" to={`/courses/${course.id}/mock`}>
                  模擬試験に挑戦する
                </Link>
              )
            )}
            <Link className="btn btn-lg" to={`/courses/${course.id}/exam`}>
              試験と学習の進め方
            </Link>
          </div>
        ) : (
          <div className="box box-note">
            <div className="box-body">
              <p>
                このコースは準備中です。試験の形式は
                <a href={course.officialUrl} target="_blank" rel="noreferrer">
                  公式サイト
                </a>
                で確認できます。
              </p>
            </div>
          </div>
        )}
      </section>

      {lessons.length > 0 && (
        <section className="stats-row">
          <div className="stat">
            <div className="stat-label">読み終えたレッスン</div>
            <div className="stat-value">
              {doneCount}
              <small> / {lessons.length}</small>
            </div>
            <div className="meter">
              <div style={{ width: `${(doneCount / lessons.length) * 100}%` }} />
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
          {course.mockExam && (
            <Link to={`/courses/${course.id}/mock`} className="stat stat-link">
              <div className="stat-label">前回の模擬試験</div>
              <div className="stat-value">{lastMock ? `${Math.round((lastMock.score / lastMock.total) * 100)}点` : '—'}</div>
              <div className="stat-note">合格ラインは{course.mockExam.passPercent}点 →</div>
            </Link>
          )}
        </section>
      )}

      {chapters.length > 0 && (
        <>
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
        </>
      )}

      <h2 className="section-title">コース</h2>
      <div className="chapter-grid">
        {courses.map((c) => (
          <Link key={c.id} to={`/courses/${c.id}`} className={`chapter-card ${c.id === course.id ? 'is-current' : ''}`}>
            <div className="chapter-card-no">{c.status === 'planned' ? '準備中' : c.id === course.id ? 'いま見ているコース' : 'コース'}</div>
            <div className="chapter-card-title">{c.title}</div>
            <p>{c.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
