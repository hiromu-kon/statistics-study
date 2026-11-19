import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ChapterPage } from './pages/ChapterPage'
import { DataPage } from './pages/DataPage'
import { ExamInfoPage } from './pages/ExamInfoPage'
import { FormulasPage } from './pages/FormulasPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { HomePage } from './pages/HomePage'
import { LessonPage } from './pages/LessonPage'
import { LogPage } from './pages/LogPage'
import { MockExamPage } from './pages/MockExamPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { ReviewPage } from './pages/ReviewPage'
import { TablesPage } from './pages/TablesPage'

// HashRouter にしているのは、GitHub Pages やファイルを直接開く場合でも
// サーバー側の設定なしでページを再読み込みできるようにするため。
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="exam" element={<ExamInfoPage />} />
          <Route path="chapters/:chapterId" element={<ChapterPage />} />
          <Route path="lessons/:lessonId" element={<LessonPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="mock" element={<MockExamPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="formulas" element={<FormulasPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="log" element={<LogPage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
