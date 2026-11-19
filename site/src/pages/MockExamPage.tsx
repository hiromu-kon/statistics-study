import { useEffect, useEffectEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RichText } from '../components/Math'
import { LevelBadge } from '../components/Quiz'
import { chapterById } from '../content/chapters'
import { courseById } from '../content/courses'
import { lessonById, problems, problemsByCourse } from '../content/registry'
import { recordAttempt, recordMock, useProgress } from '../lib/progress'
import type { CourseExam, CourseMeta, Problem } from '../types'
import { NotFoundPage } from './NotFoundPage'


function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 模擬試験に出せる問題。標準・本番レベルで、数学の準備などの範囲外の章は除く */
function examPool(courseId: string): Problem[] {
  return problemsByCourse(courseId).filter((p) => p.level >= 2 && !chapterById.get(lessonById.get(p.lesson)?.chapter ?? '')?.prep)
}

/** 章が偏らないように、章ごとに順番に1問ずつ取り出す */
function pickProblems(courseId: string, count: number): Problem[] {
  const pool = examPool(courseId)
  const byChapter = new Map<string, Problem[]>()
  for (const p of shuffle(pool)) {
    const c = lessonById.get(p.lesson)!.chapter
    byChapter.set(c, [...(byChapter.get(c) ?? []), p])
  }
  const queues = [...byChapter.values()]
  const picked: Problem[] = []
  while (picked.length < count && queues.some((q) => q.length)) {
    for (const q of queues) if (q.length && picked.length < count) picked.push(q.shift()!)
  }
  return picked.sort((a, b) => problems.indexOf(a) - problems.indexOf(b))
}

function formatTime(sec: number) {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function MockExamPage() {
  const { courseId = '' } = useParams()
  const course = courseById.get(courseId)
  if (!course) return <NotFoundPage />
  if (!course.mockExam)
    return (
      <div className="page">
        <h1>模擬試験</h1>
        <p className="lead">{course.title}の模擬試験は準備中です。</p>
      </div>
    )
  // コースを切り替えたら、解いている途中の試験は捨てる
  return <MockExam key={course.id} course={course} config={course.mockExam} />
}

function MockExam({ course, config }: { course: CourseMeta; config: CourseExam }) {
  // 問題数を減らしても、1問あたりの時間は本番と同じにする
  const secondsPerProblem = (config.minutes * 60) / config.problems
  const passRate = config.passPercent / 100
  const [exam, setExam] = useState<{ problems: Problem[]; startedAt: number; limit: number } | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const mocks = useProgress().mocks.filter((m) => (m.course ?? 'grade2') === course.id)

  useEffect(() => {
    if (!exam || finished !== null) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [exam, finished])

  const elapsed = exam ? (now - exam.startedAt) / 1000 : 0

  const finish = () => {
    if (!exam) return
    const sec = (Date.now() - exam.startedAt) / 1000
    let score = 0
    for (const p of exam.problems) {
      const ok = answers[p.id] === p.answer
      if (ok) score++
      recordAttempt(p.id, ok)
    }
    recordMock({ at: new Date().toISOString(), score, total: exam.problems.length, seconds: Math.round(sec), course: course.id })
    setFinished(score)
    window.scrollTo(0, 0)
  }
  const finishOnTimeout = useEffectEvent(() => finish())

  useEffect(() => {
    if (!exam || finished !== null) return
    const t = setTimeout(() => finishOnTimeout(), exam.startedAt + exam.limit * 1000 - Date.now())
    return () => clearTimeout(t)
  }, [exam, finished])

  if (!exam) {
    const available = examPool(course.id).length
    const sizes = [...new Set([10, 20, config.problems])].sort((a, b) => a - b)
    const perProblem = formatTime(secondsPerProblem)
    return (
      <div className="page">
        <h1>模擬試験（{course.shortTitle}）</h1>
        <p className="lead">
          標準・本番レベルの問題から、章が偏らないように出題します。1問あたりの制限時間は本番と同じ約{perProblem}（{config.minutes}分÷
          {config.problems}問）です。最後にまとめて採点され、合格ラインは<strong>{config.passPercent}点</strong>（正答率{config.passPercent}%）です。
        </p>
        <div className="controls">
          {sizes.map((n) => (
            <button
              key={n}
              type="button"
              className={`btn ${n === config.problems ? 'btn-primary' : ''}`}
              disabled={available < n}
              onClick={() => {
                setAnswers({})
                setFinished(null)
                setNow(Date.now())
                setExam({ problems: pickProblems(course.id, n), startedAt: Date.now(), limit: n * secondsPerProblem })
              }}
            >
              {n}問（{Math.round((n * secondsPerProblem) / 60)}分）{n === config.problems && '＝本番と同じ'}
            </button>
          ))}
        </div>
        <p className="muted small">出題できる問題：{available}問</p>
        {mocks.length > 0 && (
          <>
            <h2 className="section-title">これまでの結果</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>日時</th>
                  <th>点数</th>
                  <th>正解</th>
                  <th>かかった時間</th>
                </tr>
              </thead>
              <tbody>
                {[...mocks].reverse().map((m) => (
                  <tr key={m.at}>
                    <td>{new Date(m.at).toLocaleString('ja-JP')}</td>
                    <td>{Math.round((m.score / m.total) * 100)}点</td>
                    <td>
                      {m.score}/{m.total}
                    </td>
                    <td>{formatTime(m.seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    )
  }

  const answeredCount = exam.problems.filter((p) => answers[p.id] !== undefined).length
  const remaining = exam.limit - elapsed

  return (
    <div className="page">
      <div className="mock-bar">
        {finished === null ? (
          <>
            <span>
              解答 {answeredCount}/{exam.problems.length}
            </span>
            <span className={remaining < 300 ? 'danger' : ''}>残り {formatTime(remaining)}</span>
            <button type="button" className="btn btn-primary" onClick={finish}>
              採点する
            </button>
          </>
        ) : (
          <>
            <span>
              結果：<strong>{Math.round((finished / exam.problems.length) * 100)}点</strong>（{finished}/{exam.problems.length}）
              {finished / exam.problems.length >= passRate
                ? ' 合格ライン到達！'
                : ` 合格ライン（${config.passPercent}点）まであと${config.passPercent - Math.round((finished / exam.problems.length) * 100)}点`}
            </span>
            <button type="button" className="btn" onClick={() => setExam(null)}>
              終了
            </button>
          </>
        )}
      </div>
      <h1>模擬試験</h1>
      {finished !== null && <p className="lead">間違えた問題は復習リストに入りました。解説を読んで、元のレッスンに戻って確認しましょう。</p>}
      <div className="problem-list">
        {exam.problems.map((p, i) => {
          const chosen = answers[p.id]
          const done = finished !== null
          const ok = chosen === p.answer
          return (
            <article key={p.id} className={`problem ${done ? (ok ? 'is-correct' : 'is-wrong') : ''}`}>
              <header className="problem-head">
                <span className="problem-no">問{i + 1}</span>
                <LevelBadge level={p.level} />
                {done && (
                  <Link className="problem-lesson" to={`/lessons/${p.lesson}`}>
                    {lessonById.get(p.lesson)?.title}
                  </Link>
                )}
              </header>
              <div className="problem-question">
                <RichText value={p.question} />
              </div>
              <ol className="choices">
                {p.choices.map((c, j) => {
                  const state = done ? (j === p.answer ? 'answer' : j === chosen ? 'chosen-wrong' : '') : j === chosen ? 'selected' : ''
                  return (
                    <li key={j}>
                      <button type="button" className={`choice ${state}`} disabled={done} onClick={() => setAnswers((a) => ({ ...a, [p.id]: j }))}>
                        <span className="choice-no">{j + 1}</span>
                        <span className="choice-text">
                          <RichText value={c} />
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
              {done && (
                <div className="explanation">
                  <div className="explanation-result">{ok ? '正解！' : chosen === undefined ? `未解答（正解は ${p.answer + 1}）` : `不正解（正解は ${p.answer + 1}）`}</div>
                  <RichText value={p.explanation} />
                </div>
              )}
            </article>
          )
        })}
      </div>
      {finished === null && (
        <div className="lesson-complete">
          <button type="button" className="btn btn-primary btn-lg" onClick={finish}>
            採点する
          </button>
        </div>
      )}
    </div>
  )
}
