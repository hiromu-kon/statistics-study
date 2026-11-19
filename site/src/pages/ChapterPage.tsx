import { Link, useParams } from 'react-router-dom'
import { chapterById, chapters } from '../content/chapters'
import { lessonsByChapter, problemsByChapter } from '../content/registry'
import { useProgress } from '../lib/progress'
import { NotFoundPage } from './NotFoundPage'

export function ChapterPage() {
  const { chapterId = '' } = useParams()
  const chapter = chapterById.get(chapterId)
  const { completed } = useProgress()
  if (!chapter) return <NotFoundPage />
  const ls = lessonsByChapter(chapter.id)
  const nextChapter = chapters.find((c) => c.order === chapter.order + 1)

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">ホーム</Link> / {chapter.prep ? '準備' : `第${chapter.order}章`}
      </p>
      <h1>{chapter.title}</h1>
      <p className="lead">{chapter.summary}</p>
      <p className="muted small">出題範囲表との対応：{chapter.scope}</p>
      <ol className="lesson-list">
        {ls.map((l, i) => (
          <li key={l.id}>
            <Link to={`/lessons/${l.id}`} className={`lesson-row ${completed[l.id] ? 'done' : ''}`}>
              <span className="lesson-row-no">{completed[l.id] ? '✓' : i + 1}</span>
              <span className="lesson-row-body">
                <span className="lesson-row-title">{l.title}</span>
                <span className="lesson-row-summary">{l.summary}</span>
                <span className="lesson-row-keywords">
                  {l.keywords.map((k) => (
                    <span key={k} className="chip">
                      {k}
                    </span>
                  ))}
                </span>
              </span>
              <span className="lesson-row-min">約{l.minutes}分</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="chapter-foot">
        <Link className="btn" to={`/practice?chapter=${chapter.id}`}>
          この章の問題をまとめて解く（{problemsByChapter(chapter.id).length}問）
        </Link>
        {nextChapter && (
          <Link className="btn btn-ghost" to={`/chapters/${nextChapter.id}`}>
            次の章：{nextChapter.title} →
          </Link>
        )}
      </div>
    </div>
  )
}
