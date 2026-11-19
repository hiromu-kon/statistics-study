import { useState } from 'react'
import { ProblemList } from '../components/Quiz'
import { problems } from '../content/registry'
import { useProgress } from '../lib/progress'

export function ReviewPage() {
  const { attempts } = useProgress()
  // 開いたときの一覧で固定する。解き直して正解しても、解説を読む前に消えないようにするため
  const [{ wrong, shaky }] = useState(() => ({
    wrong: problems
      .filter((p) => attempts[p.id] && !attempts[p.id].lastCorrect)
      .sort((a, b) => attempts[b.id].wrong - attempts[a.id].wrong),
    shaky: problems.filter((p) => attempts[p.id]?.lastCorrect && attempts[p.id].wrong > 0),
  }))

  return (
    <div className="page">
      <h1>復習リスト</h1>
      <p className="lead">直近で間違えた問題が、間違えた回数の多い順に並びます。解き直して正解すると、次に開いたときに一覧から消えます。</p>
      <h2 className="section-title">直近で間違えた問題（{wrong.length}問）</h2>
      {wrong.length === 0 ? <p className="muted">いまは復習が必要な問題はありません。</p> : <ProblemList problems={wrong} showLessonLink />}
      {shaky.length > 0 && (
        <>
          <h2 className="section-title">一度間違えたが、いまは正解している問題（{shaky.length}問）</h2>
          <p className="muted">本番前にもう一度確認しておくと安心です。</p>
          <ProblemList problems={shaky} showLessonLink />
        </>
      )}
    </div>
  )
}
