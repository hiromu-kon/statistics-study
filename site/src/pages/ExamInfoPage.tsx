import { Link, useParams } from 'react-router-dom'
import { chaptersByCourse } from '../content/chapters'
import { courseById } from '../content/courses'
import { guides } from '../content/guides'
import { lessonsByChapter } from '../content/registry'
import { NotFoundPage } from './NotFoundPage'

export function ExamInfoPage() {
  const { courseId = '' } = useParams()
  const course = courseById.get(courseId)
  if (!course) return <NotFoundPage />
  const Guide = guides[course.id]
  const chs = chaptersByCourse(course.id)

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/courses/${course.id}`}>{course.title}</Link>
      </p>
      <h1>試験と学習の進め方</h1>
      <p className="lead">{course.title}がどんな試験か、このサイトをどの順番で使えばよいかをまとめています。</p>

      {Guide ? (
        <Guide />
      ) : (
        <section className="lesson-section">
          <h2>準備中</h2>
          <p>
            このコースの試験案内と教材はまだありません。試験の形式は{' '}
            <a href={course.officialUrl} target="_blank" rel="noreferrer">
              公式サイト
            </a>{' '}
            で確認してください。
          </p>
        </section>
      )}

      {chs.length > 0 && (
        <section className="lesson-section">
          <h2>出題範囲とこのサイトの対応</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>章</th>
                  <th>出題範囲表の大項目</th>
                  <th>レッスン数</th>
                </tr>
              </thead>
              <tbody>
                {chs.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/chapters/${c.id}`}>
                        {c.prep ? '準備' : `第${c.order}章`} {c.title}
                      </Link>
                    </td>
                    <td>{c.scope}</td>
                    <td>{lessonsByChapter(c.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
