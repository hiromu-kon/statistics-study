import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recordAttempt, useProgress } from '../lib/progress'
import { lessonById } from '../content/registry'
import type { Problem } from '../types'
import { RichText } from './Math'

const LEVEL_LABEL = { 1: '基本', 2: '標準', 3: '本番レベル' } as const

export function LevelBadge({ level }: { level: Problem['level'] }) {
  return <span className={`badge level-${level}`}>{LEVEL_LABEL[level]}</span>
}

/** 1問ぶんの選択問題。答えると記録され、解説が開く */
export function ProblemCard({
  problem,
  index,
  showLessonLink = false,
  onAnswered,
}: {
  problem: Problem
  index?: number
  showLessonLink?: boolean
  onAnswered?: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const attempt = useProgress().attempts[problem.id]
  const correct = selected === problem.answer
  const lesson = lessonById.get(problem.lesson)

  const submit = () => {
    if (selected === null) return
    setSubmitted(true)
    recordAttempt(problem.id, selected === problem.answer)
    onAnswered?.(selected === problem.answer)
  }

  return (
    <article className={`problem ${submitted ? (correct ? 'is-correct' : 'is-wrong') : ''}`}>
      <header className="problem-head">
        <span className="problem-no">{index !== undefined ? `問${index + 1}` : '問題'}</span>
        <LevelBadge level={problem.level} />
        {attempt && (
          <span className="problem-history" title="これまでの記録">
            ○{attempt.correct} ×{attempt.wrong}
          </span>
        )}
        {showLessonLink && lesson && (
          <Link className="problem-lesson" to={`/lessons/${lesson.id}`}>
            {lesson.title}
          </Link>
        )}
      </header>
      <div className="problem-question">
        <RichText value={problem.question} />
      </div>
      <ol className="choices">
        {problem.choices.map((c, i) => {
          const state = submitted ? (i === problem.answer ? 'answer' : i === selected ? 'chosen-wrong' : '') : i === selected ? 'selected' : ''
          return (
            <li key={i}>
              <button type="button" className={`choice ${state}`} disabled={submitted} onClick={() => setSelected(i)}>
                <span className="choice-no">{i + 1}</span>
                <span className="choice-text">
                  <RichText value={c} />
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      {!submitted ? (
        <div className="problem-actions">
          <button type="button" className="btn btn-primary" disabled={selected === null} onClick={submit}>
            答え合わせ
          </button>
        </div>
      ) : (
        <div className="explanation">
          <div className="explanation-result">{correct ? '正解！' : `不正解… 正解は ${problem.answer + 1}`}</div>
          <RichText value={problem.explanation} />
          <div className="problem-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSubmitted(false)
                setSelected(null)
              }}
            >
              もう一度解く
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export function ProblemList({ problems, showLessonLink }: { problems: Problem[]; showLessonLink?: boolean }) {
  if (problems.length === 0) return <p className="muted">問題はまだありません。</p>
  return (
    <div className="problem-list">
      {problems.map((p, i) => (
        <ProblemCard key={p.id} problem={p} index={i} showLessonLink={showLessonLink} />
      ))}
    </div>
  )
}
