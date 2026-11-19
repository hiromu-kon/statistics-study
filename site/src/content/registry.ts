import type { ComponentType } from 'react'
import type { Formula, GlossaryTerm, Lesson, LessonMeta, Problem } from '../types'
import { chapters } from './chapters'

// 章ごとのフォルダ（src/content/<章>/）に置いたファイルを自動で集める。
// 一覧ファイルを手で更新しなくてよいので、レッスンや問題を足すときはファイルを置くだけでよい。

type LessonModule = { meta: LessonMeta; default: ComponentType }

const lessonModules = import.meta.glob<LessonModule>('./*/lessons/*.tsx', { eager: true })
const problemModules = import.meta.glob<{ problems: Problem[] }>('./*/problems.tsx', { eager: true })
const glossaryModules = import.meta.glob<{ glossary: GlossaryTerm[] }>('./*/glossary.ts', { eager: true })
const formulaModules = import.meta.glob<{ formulas: Formula[] }>('./*/formulas.ts', { eager: true })

const chapterOrder = new Map(chapters.map((c) => [c.id, c.order]))

export const lessons: Lesson[] = Object.values(lessonModules)
  .map((m) => ({ ...m.meta, Component: m.default }))
  .sort((a, b) => (chapterOrder.get(a.chapter) ?? 99) - (chapterOrder.get(b.chapter) ?? 99) || a.order - b.order)

export const lessonById = new Map(lessons.map((l) => [l.id, l]))

export const lessonsByChapter = (chapterId: string) => lessons.filter((l) => l.chapter === chapterId)

const lessonIndex = new Map(lessons.map((l, i) => [l.id, i]))
const byLessonOrder = <T extends { lesson: string }>(a: T, b: T) =>
  (lessonIndex.get(a.lesson) ?? 9999) - (lessonIndex.get(b.lesson) ?? 9999)

export const problems: Problem[] = Object.values(problemModules)
  .flatMap((m) => m.problems)
  .sort(byLessonOrder)

export const problemById = new Map(problems.map((p) => [p.id, p]))

export const problemsByLesson = (lessonId: string) => problems.filter((p) => p.lesson === lessonId)

export const problemsByChapter = (chapterId: string) =>
  problems.filter((p) => lessonById.get(p.lesson)?.chapter === chapterId)

export const glossary: GlossaryTerm[] = Object.values(glossaryModules)
  .flatMap((m) => m.glossary)
  .sort(byLessonOrder)

export const formulas: Formula[] = Object.values(formulaModules)
  .flatMap((m) => m.formulas)
  .sort(byLessonOrder)
