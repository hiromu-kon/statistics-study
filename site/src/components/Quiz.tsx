import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recordAttempt, useProgress } from '../lib/progress'
import { lessonById } from '../content/registry'
import { correctAnswerLabel, isAnswered, isCorrect, parseNumber, type Response } from '../lib/answers'
import type { NumericProblem, Problem } from '../types'
import { RichText } from './Math'

const LEVEL_LABEL = { 1: '基本', 2: '標準', 3: '本番レベル' } as const

export function LevelBadge({ level }: { level: Problem['level'] }) {
  return <span className={`badge level-${level}`}>{LEVEL_LABEL[level]}</span>
}

function NumericAnswer({
  problem,
  value,
  submitted,
  onChange,
}: {
  problem: NumericProblem
  value: string
  submitted: boolean
  onChange: (v: string) => void
}) {
  const invalid = value !== '' && parseNumber(value) === null
  return (
    <div className="numeric-answer">
      <label>
        <span className="numeric-label">答え</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          disabled={submitted}
          onChange={(e) => onChange(e.target.value)}
          placeholder="数値を入力"
          className={submitted ? (isCorrect(problem, value) ? 'answer' : 'chosen-wrong') : ''}
        />
        {problem.unit && <span className="numeric-unit">{problem.unit}</span>}
      </label>
      {invalid && <span className="numeric-hint">数値として読めません（例：0.25、-1.5）</span>}
    </div>
  )
}

/** 解答欄。選択問題なら選択肢、数値入力問題なら入力欄を出す。答え合わせ後は正誤の色をつける */
export function AnswerInput({
  problem,
  response,
  submitted,
  onChange,
}: {
  problem: Problem
  response: Response | undefined
  submitted: boolean
  onChange: (r: Response) => void
}) {
  if (problem.kind === 'numeric') {
    return (
      <NumericAnswer
        problem={problem}
        value={typeof response === 'string' ? response : ''}
        submitted={submitted}
        onChange={onChange}
      />
    )
  }
  return (
    <ol className="choices">
      {problem.choices.map((c, i) => {
        const state = submitted ? (i === problem.answer ? 'answer' : i === response ? 'chosen-wrong' : '') : i === response ? 'selected' : ''
        return (
          <li key={i}>
            <button type="button" className={`choice ${state}`} disabled={submitted} onClick={() => onChange(i)}>
              <span className="choice-no">{i + 1}</span>
              <span className="choice-text">
                <RichText value={c} />
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

/** 1問ぶんの問題。答えると記録され、解説が開く */
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
  const [response, setResponse] = useState<Response | undefined>(undefined)
  const [submitted, setSubmitted] = useState(false)
  const attempt = useProgress().attempts[problem.id]
  const correct = isCorrect(problem, response)
  const lesson = lessonById.get(problem.lesson)

  const submit = () => {
    if (!isAnswered(problem, response)) return
    setSubmitted(true)
    recordAttempt(problem.id, correct)
    onAnswered?.(correct)
  }

  return (
    <article className={`problem ${submitted ? (correct ? 'is-correct' : 'is-wrong') : ''}`}>
      <header className="problem-head">
        <span className="problem-no">{index !== undefined ? `問${index + 1}` : '問題'}</span>
        <LevelBadge level={problem.level} />
        {problem.kind === 'numeric' && <span className="badge">数値入力</span>}
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
      <AnswerInput problem={problem} response={response} submitted={submitted} onChange={setResponse} />
      {!submitted ? (
        <div className="problem-actions">
          <button type="button" className="btn btn-primary" disabled={!isAnswered(problem, response)} onClick={submit}>
            答え合わせ
          </button>
        </div>
      ) : (
        <div className="explanation">
          <div className="explanation-result">{correct ? '正解！' : `不正解… 正解は ${correctAnswerLabel(problem)}`}</div>
          <RichText value={problem.explanation} />
          <div className="problem-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSubmitted(false)
                setResponse(undefined)
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
