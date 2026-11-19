import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { chapterById, chaptersByCourse } from '../content/chapters'
import { courses } from '../content/courses'
import { lessonById, lessonsByChapter } from '../content/registry'
import { useCurrentCourse } from '../lib/course'
import { useProgress } from '../lib/progress'

// コースに関係なく使う道具。問題演習・公式集・用語集は、いま選んでいるコースの分を表示する
const TOOLS = [
  { to: '/practice', label: '問題演習', icon: '✍' },
  { to: '/review', label: '復習リスト', icon: '↻' },
  { to: '/formulas', label: '公式集', icon: 'Σ' },
  { to: '/glossary', label: '用語集', icon: 'あ' },
  { to: '/tables', label: '分布表・計算機', icon: '▦' },
  { to: '/log', label: '学習ログ', icon: '✎' },
]

function ChapterNav({ chapterId, open, onToggle }: { chapterId: string; open: boolean; onToggle: () => void }) {
  const chapter = chapterById.get(chapterId)!
  const items = lessonsByChapter(chapterId)
  const { completed } = useProgress()
  const done = items.filter((l) => completed[l.id]).length
  return (
    <li className="nav-chapter">
      <button type="button" className="nav-chapter-btn" onClick={onToggle} aria-expanded={open}>
        <span className="nav-chapter-no">{chapter.prep ? '準' : chapter.order}</span>
        <span className="nav-chapter-title">{chapter.title}</span>
        <span className="nav-chapter-count">
          {done}/{items.length}
        </span>
      </button>
      {open && (
        <ul className="nav-lessons">
          <li>
            <NavLink to={`/chapters/${chapterId}`} end className="nav-lesson nav-lesson-overview">
              章のトップ
            </NavLink>
          </li>
          {items.map((l) => (
            <li key={l.id}>
              <NavLink to={`/lessons/${l.id}`} className="nav-lesson">
                <span className={`check ${completed[l.id] ? 'on' : ''}`} aria-hidden>
                  {completed[l.id] ? '✓' : ''}
                </span>
                {l.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export function Layout() {
  const location = useLocation()
  const course = useCurrentCourse()
  const [menuOpen, setMenuOpen] = useState(false)
  // 開いているレッスンの章は自動で開く。手で開閉した章はその状態を優先する
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const currentChapter = (() => {
    const m = location.pathname.match(/^\/(lessons|chapters)\/([^/]+)/)
    if (!m) return null
    return m[1] === 'chapters' ? m[2] : (lessonById.get(m[2])?.chapter ?? null)
  })()
  const isOpen = (id: string) => toggled[id] ?? id === currentChapter
  const courseChapters = chaptersByCourse(course.id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
      <header className="topbar">
        <button type="button" className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="メニュー">
          ☰
        </button>
        <NavLink to={`/courses/${course.id}`} className="brand">
          <span className="brand-mark">σ</span>
          統計検定ノート
          <span className="brand-course">{course.shortTitle}</span>
        </NavLink>
      </header>
      <nav
        className="sidebar"
        aria-label="メニュー"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setMenuOpen(false)
        }}
      >
        <NavLink to={`/courses/${course.id}`} className="brand brand-side">
          <span className="brand-mark">σ</span>
          <span>
            統計検定ノート
            <small>中学数学からはじめる</small>
          </span>
        </NavLink>
        <div className="course-switch" role="tablist" aria-label="コース">
          {courses.map((c) => (
            <NavLink
              key={c.id}
              to={`/courses/${c.id}`}
              role="tab"
              aria-selected={c.id === course.id}
              className={`course-tab ${c.id === course.id ? 'on' : ''}`}
              title={c.status === 'planned' ? `${c.title}（準備中）` : c.title}
            >
              {c.shortTitle}
              {c.status === 'planned' && <small>準備中</small>}
            </NavLink>
          ))}
        </div>
        <ul className="nav-top">
          <li>
            <NavLink to={`/courses/${course.id}`} end className="nav-item">
              <span className="nav-icon">⌂</span>ホーム
            </NavLink>
          </li>
          <li>
            <NavLink to={`/courses/${course.id}/exam`} className="nav-item">
              <span className="nav-icon">ⓘ</span>試験と学習の進め方
            </NavLink>
          </li>
        </ul>
        <div className="nav-heading">教科書</div>
        {courseChapters.length > 0 ? (
          <ul className="nav-chapters">
            {courseChapters.map((c) => (
              <ChapterNav
                key={c.id}
                chapterId={c.id}
                open={isOpen(c.id)}
                onToggle={() => setToggled((t) => ({ ...t, [c.id]: !isOpen(c.id) }))}
              />
            ))}
          </ul>
        ) : (
          <p className="nav-empty">このコースの教材はまだありません。</p>
        )}
        <div className="nav-heading">練習と道具</div>
        <ul className="nav-top">
          {course.mockExam && (
            <li>
              <NavLink to={`/courses/${course.id}/mock`} className="nav-item">
                <span className="nav-icon">⏱</span>模擬試験
              </NavLink>
            </li>
          )}
          {TOOLS.map((t) => (
            <li key={t.to}>
              <NavLink to={t.to} className="nav-item">
                <span className="nav-icon">{t.icon}</span>
                {t.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/data" className="nav-item">
              <span className="nav-icon">⚙</span>記録のバックアップ
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="backdrop" onClick={() => setMenuOpen(false)} />
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
