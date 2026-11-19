import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { chapters } from '../content/chapters'
import { lessonById, lessonsByChapter } from '../content/registry'
import { useProgress } from '../lib/progress'

const TOOLS = [
  { to: '/practice', label: '問題演習', icon: '✍' },
  { to: '/mock', label: '模擬試験', icon: '⏱' },
  { to: '/review', label: '復習リスト', icon: '↻' },
  { to: '/formulas', label: '公式集', icon: 'Σ' },
  { to: '/glossary', label: '用語集', icon: 'あ' },
  { to: '/tables', label: '分布表・計算機', icon: '▦' },
  { to: '/log', label: '学習ログ', icon: '✎' },
]

function ChapterNav({ chapterId, open, onToggle }: { chapterId: string; open: boolean; onToggle: () => void }) {
  const chapter = chapters.find((c) => c.id === chapterId)!
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
  const [menuOpen, setMenuOpen] = useState(false)
  // 開いているレッスンの章は自動で開く。手で開閉した章はその状態を優先する
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const currentChapter = (() => {
    const m = location.pathname.match(/^\/(lessons|chapters)\/([^/]+)/)
    if (!m) return null
    return m[1] === 'chapters' ? m[2] : (lessonById.get(m[2])?.chapter ?? null)
  })()
  const isOpen = (id: string) => toggled[id] ?? id === currentChapter

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
      <header className="topbar">
        <button type="button" className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="メニュー">
          ☰
        </button>
        <NavLink to="/" className="brand">
          <span className="brand-mark">σ</span>
          統計検定2級 ノート
        </NavLink>
      </header>
      <nav
        className="sidebar"
        aria-label="メニュー"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setMenuOpen(false)
        }}
      >
        <NavLink to="/" className="brand brand-side">
          <span className="brand-mark">σ</span>
          <span>
            統計検定2級 ノート
            <small>中学数学からはじめる</small>
          </span>
        </NavLink>
        <ul className="nav-top">
          <li>
            <NavLink to="/" end className="nav-item">
              <span className="nav-icon">⌂</span>ホーム
            </NavLink>
          </li>
          <li>
            <NavLink to="/exam" className="nav-item">
              <span className="nav-icon">ⓘ</span>試験と学習の進め方
            </NavLink>
          </li>
        </ul>
        <div className="nav-heading">教科書</div>
        <ul className="nav-chapters">
          {chapters.map((c) => (
            <ChapterNav
              key={c.id}
              chapterId={c.id}
              open={isOpen(c.id)}
              onToggle={() => setToggled((t) => ({ ...t, [c.id]: !isOpen(c.id) }))}
            />
          ))}
        </ul>
        <div className="nav-heading">練習と道具</div>
        <ul className="nav-top">
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
