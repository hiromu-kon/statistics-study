import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RichText } from '../components/Math'
import { courseOfLesson, glossary, lessonById } from '../content/registry'
import { useCurrentCourse } from '../lib/course'

export function GlossaryPage() {
  const [q, setQ] = useState('')
  const course = useCurrentCourse()
  const list = glossary.filter(
    (g) => courseOfLesson(g.lesson) === course.id && (!q || g.term.includes(q) || g.reading?.includes(q)),
  )
  return (
    <div className="page">
      <h1>用語集（{course.shortTitle}）</h1>
      <p className="lead">正式な意味と、やさしい言い換えを並べています。</p>
      <input className="search" placeholder="用語を検索（例：分散）" value={q} onChange={(e) => setQ(e.target.value)} />
      <dl className="glossary">
        {list.map((g) => (
          <div key={`${g.lesson}-${g.term}`} className="glossary-item">
            <dt>
              {g.term}
              {g.reading && <small>（{g.reading}）</small>}
            </dt>
            <dd>
              <div>
                <RichText value={g.meaning} />
              </div>
              <div className="glossary-easy">
                <span className="badge">言い換え</span> <RichText value={g.easy} />
              </div>
              <Link className="small" to={`/lessons/${g.lesson}`}>
                {lessonById.get(g.lesson)?.title} →
              </Link>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
