import { Link, useParams } from 'react-router-dom'
import { ProblemList } from '../components/Quiz'
import { chapterById } from '../content/chapters'
import { lessonById, lessons, problemsByLesson } from '../content/registry'
import { toggleCompleted, useProgress } from '../lib/progress'
import { NotFoundPage } from './NotFoundPage'

export function LessonPage() {
  const { lessonId = '' } = useParams()
  const lesson = lessonById.get(lessonId)
  const { completed } = useProgress()
  if (!lesson) return <NotFoundPage />
  const chapter = chapterById.get(lesson.chapter)!
  const idx = lessons.indexOf(lesson)
  const prev = lessons[idx - 1]
  const next = lessons[idx + 1]
  const qs = problemsByLesson(lesson.id)
  const done = Boolean(completed[lesson.id])
  const { Component } = lesson

  return (
    <article className="page lesson">
      <p className="breadcrumb">
        <Link to="/">ホーム</Link> / <Link to={`/chapters/${chapter.id}`}>{chapter.title}</Link>
      </p>
      <h1>{lesson.title}</h1>
      <p className="lead">{lesson.summary}</p>
      <div className="lesson-meta">
        <span>約{lesson.minutes}分</span>
        {lesson.keywords.map((k) => (
          <span key={k} className="chip">
            {k}
          </span>
        ))}
      </div>

      <div className="lesson-body">
        <Component />
      </div>

      {qs.length > 0 && (
        <section className="lesson-section">
          <h2>確認問題</h2>
          <p className="muted">答え合わせの結果は記録され、間違えた問題は「復習リスト」に入ります。</p>
          <ProblemList problems={qs} />
        </section>
      )}

      <div className="lesson-complete">
        <button type="button" className={`btn btn-lg ${done ? '' : 'btn-primary'}`} onClick={() => toggleCompleted(lesson.id)}>
          {done ? '✓ 読み終えた（取り消す）' : 'このレッスンを読み終えた'}
        </button>
      </div>

      <nav className="pager">
        {prev ? (
          <Link to={`/lessons/${prev.id}`} className="pager-link">
            <small>← 前のレッスン</small>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/lessons/${next.id}`} className="pager-link pager-next">
            <small>次のレッスン →</small>
            {next.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
