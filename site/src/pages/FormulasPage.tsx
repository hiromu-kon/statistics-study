import { Link } from 'react-router-dom'
import { MathBlock, RichText } from '../components/Math'
import { chaptersByCourse } from '../content/chapters'
import { formulas, lessonById } from '../content/registry'
import { useCurrentCourse } from '../lib/course'

export function FormulasPage() {
  const course = useCurrentCourse()
  return (
    <div className="page">
      <h1>公式集（{course.shortTitle}）</h1>
      <p className="lead">式だけでなく「何を知りたい式か」を添えています。式を見て意味が言えるかを確認しましょう。</p>
      {chaptersByCourse(course.id).map((c) => {
        const fs = formulas.filter((f) => lessonById.get(f.lesson)?.chapter === c.id)
        if (fs.length === 0) return null
        return (
          <section key={c.id} className="lesson-section">
            <h2>
              {c.prep ? '準備' : `第${c.order}章`} {c.title}
            </h2>
            <div className="formula-grid">
              {fs.map((f) => (
                <div key={f.id} className="formula-card">
                  <div className="formula-title">{f.title}</div>
                  <MathBlock>{f.tex}</MathBlock>
                  <div className="formula-note">
                    <RichText value={f.note} />
                  </div>
                  <Link className="small" to={`/lessons/${f.lesson}`}>
                    {lessonById.get(f.lesson)?.title} →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
