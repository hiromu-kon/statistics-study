import { useSearchParams } from 'react-router-dom'
import { ProblemList } from '../components/Quiz'
import { chapters } from '../content/chapters'
import { lessonById, problems } from '../content/registry'
import { useProgress } from '../lib/progress'

type Status = 'all' | 'unanswered' | 'wrong'

export function PracticePage() {
  const [params, setParams] = useSearchParams()
  const chapter = params.get('chapter') ?? 'all'
  const level = params.get('level') ?? 'all'
  const status = (params.get('status') ?? 'all') as Status
  const { attempts } = useProgress()

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const list = problems.filter((p) => {
    if (chapter !== 'all' && lessonById.get(p.lesson)?.chapter !== chapter) return false
    if (level !== 'all' && String(p.level) !== level) return false
    const a = attempts[p.id]
    if (status === 'unanswered' && a) return false
    if (status === 'wrong' && !(a && !a.lastCorrect)) return false
    return true
  })

  return (
    <div className="page">
      <h1>問題演習</h1>
      <p className="lead">章・難しさ・解いた状況で絞り込んで練習できます。問題はすべてこのサイトのオリジナルです。</p>
      <div className="filters">
        <label>
          章
          <select value={chapter} onChange={(e) => set('chapter', e.target.value)}>
            <option value="all">すべて</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.prep ? '準備' : `第${c.order}章`} {c.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          難しさ
          <select value={level} onChange={(e) => set('level', e.target.value)}>
            <option value="all">すべて</option>
            <option value="1">基本</option>
            <option value="2">標準</option>
            <option value="3">本番レベル</option>
          </select>
        </label>
        <label>
          状況
          <select value={status} onChange={(e) => set('status', e.target.value)}>
            <option value="all">すべて</option>
            <option value="unanswered">まだ解いていない</option>
            <option value="wrong">直近で間違えた</option>
          </select>
        </label>
        <span className="muted">{list.length}問</span>
      </div>
      {/* 絞り込みを変えたら解答状態をリセットするため key を付ける */}
      <ProblemList key={`${chapter}-${level}-${status}`} problems={list} showLessonLink />
    </div>
  )
}
