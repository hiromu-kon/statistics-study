import { useEffect, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { chapterById } from '../content/chapters'
import { courseById, defaultCourse } from '../content/courses'
import { lessonById } from '../content/registry'
import type { CourseMeta } from '../types'

// 最後に見ていたコースを覚えておく。分布表などコースに属さないページでも、メニューをそのコースのままにするため。
const KEY = 'stats-current-course-v1'

function load(): string {
  try {
    const id = localStorage.getItem(KEY)
    return id && courseById.has(id) ? id : defaultCourse.id
  } catch {
    return defaultCourse.id
  }
}

let saved = load()
const listeners = new Set<() => void>()

export function selectCourse(id: string) {
  if (!courseById.has(id) || id === saved) return
  saved = id
  try {
    localStorage.setItem(KEY, id)
  } catch {
    // 保存できなくても、このタブの中では切り替わる
  }
  listeners.forEach((l) => l())
}

/** URL からわかるコース。わからないページでは null */
function courseFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/(courses|chapters|lessons)\/([^/]+)/)
  if (!m) return null
  if (m[1] === 'courses') return courseById.has(m[2]) ? m[2] : null
  const chapterId = m[1] === 'chapters' ? m[2] : lessonById.get(m[2])?.chapter
  return chapterById.get(chapterId ?? '')?.course ?? null
}

/** いま見ているコース。URL で決まればそれを、決まらなければ最後に見ていたコースを返す */
export function useCurrentCourse(): CourseMeta {
  const { pathname } = useLocation()
  const fromPath = courseFromPath(pathname)
  const savedId = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => saved,
  )
  useEffect(() => {
    if (fromPath) selectCourse(fromPath)
  }, [fromPath])
  return courseById.get(fromPath ?? savedId) ?? defaultCourse
}
