import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useCurrentCourse } from './lib/course'
import { ChapterPage } from './pages/ChapterPage'
import { DataPage } from './pages/DataPage'
import { ExamInfoPage } from './pages/ExamInfoPage'
import { FormulasPage } from './pages/FormulasPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { HomePage } from './pages/HomePage'
import { LessonPage } from './pages/LessonPage'
import { MockExamPage } from './pages/MockExamPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { ReviewPage } from './pages/ReviewPage'
import { TablesPage } from './pages/TablesPage'

// コースに属するページ（ホーム・試験案内・模擬試験）を、コースを指定せずに開いたときの行き先。
// 本文から /mock や /exam へ張ったリンクを、コースごとのページに振り分けるため。
function ToCurrentCourse({ page }: { page?: 'exam' | 'mock' }) {
  const course = useCurrentCourse()
  return <Navigate to={`/courses/${course.id}${page ? `/${page}` : ''}`} replace />
}

// 学習ログはリポジトリ直下の個人的なメモなので、公開用のビルドには入れない。
// 静的に import すると、ページを表示しなくても Markdown の本文がバンドルに入ってしまう。
// import.meta.env.DEV はビルド時に false に置き換わり、この import ごと消える。
const LogPage = import.meta.env.DEV ? lazy(() => import('./pages/LogPage').then((m) => ({ default: m.LogPage }))) : null

// HashRouter にしているのは、GitHub Pages やファイルを直接開く場合でも
// サーバー側の設定なしでページを再読み込みできるようにするため。
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ToCurrentCourse />} />
          <Route path="courses/:courseId" element={<HomePage />} />
          <Route path="courses/:courseId/exam" element={<ExamInfoPage />} />
          <Route path="courses/:courseId/mock" element={<MockExamPage />} />
          <Route path="exam" element={<ToCurrentCourse page="exam" />} />
          <Route path="mock" element={<ToCurrentCourse page="mock" />} />
          <Route path="chapters/:chapterId" element={<ChapterPage />} />
          <Route path="lessons/:lessonId" element={<LessonPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="formulas" element={<FormulasPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="tables" element={<TablesPage />} />
          {LogPage && (
            <Route
              path="log"
              element={
                <Suspense>
                  <LogPage />
                </Suspense>
              }
            />
          )}
          <Route path="data" element={<DataPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
