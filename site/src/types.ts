import type { ComponentType, ReactNode } from 'react'

/** 文字列なら $...$ を数式、**...** を太字として表示する。JSX も渡せる */
export type Rich = ReactNode

export type ChapterMeta = {
  id: string
  order: number
  title: string
  /** 一言での説明 */
  summary: string
  /** 出題範囲表の大項目との対応 */
  scope: string
  /** 中学数学の復習など、2級の出題範囲外の章 */
  prep?: boolean
}

export type LessonMeta = {
  id: string
  chapter: string
  order: number
  title: string
  summary: string
  /** 目安の学習時間（分） */
  minutes: number
  /** 出題範囲表の「学習しておくべき用語」のうち、このレッスンで扱うもの */
  keywords: string[]
}

export type Lesson = LessonMeta & { Component: ComponentType }

export type ProblemLevel = 1 | 2 | 3

export type Problem = {
  /** 全体で一意。例: descriptive-mean-01 */
  id: string
  lesson: string
  /** 1: 基本（用語・意味の確認） 2: 標準（計算） 3: 本番レベル */
  level: ProblemLevel
  question: Rich
  choices: Rich[]
  /** choices の何番目が正解か（0 始まり） */
  answer: number
  explanation: Rich
}

export type GlossaryTerm = {
  term: string
  reading?: string
  lesson: string
  /** 正式な意味 */
  meaning: Rich
  /** 中学生にもわかる言い換え */
  easy: Rich
}

export type Formula = {
  id: string
  lesson: string
  title: string
  tex: string
  /** 何を知りたい式か・どんな場面で使うか */
  note: Rich
}
