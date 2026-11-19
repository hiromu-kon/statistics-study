import type { ComponentType, ReactNode } from 'react'

/** 文字列なら $...$ を数式、**...** を太字として表示する。JSX も渡せる */
export type Rich = ReactNode

export type CourseExam = {
  /** 本番の問題数 */
  problems: number
  /** 本番の試験時間（分） */
  minutes: number
  /** 合格ライン（正答率 %） */
  passPercent: number
}

export type CourseMeta = {
  id: string
  order: number
  /** 例: 統計検定2級 */
  title: string
  /** メニューなどで使う短い名前。例: 2級 */
  shortTitle: string
  summary: string
  /** ホームの見出し */
  headline: string
  /** planned は枠だけで、まだ教材がないコース */
  status: 'active' | 'planned'
  officialUrl: string
  /** 模擬試験の設定。本番の形式を公式サイトで確かめるまでは null にして、模擬試験を出さない */
  mockExam: CourseExam | null
}

export type ChapterMeta = {
  id: string
  /** どのコース（級）の章か */
  course: string
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

type ProblemBase = {
  /** 全体で一意。例: descriptive-mean-01 */
  id: string
  lesson: string
  /** 1: 基本（用語・意味の確認） 2: 標準（計算） 3: 本番レベル */
  level: ProblemLevel
  question: Rich
  explanation: Rich
}

/** 選択肢から1つ選ぶ問題（kind を省略するとこちら） */
export type ChoiceProblem = ProblemBase & {
  kind?: 'choice'
  choices: Rich[]
  /** choices の何番目が正解か（0 始まり） */
  answer: number
}

/** 数値を入力して答える問題（準1級の数値入力問題に合わせたもの） */
export type NumericProblem = ProblemBase & {
  kind: 'numeric'
  answerValue: number
  /** この幅までのずれは正解にする（四捨五入の違いを許すため）。例: 小数第2位まで答えるなら 0.005 */
  tolerance: number
  /** 入力欄の横に出す単位や、答え方の指示。例: 「小数第2位まで」 */
  unit?: string
}

export type Problem = ChoiceProblem | NumericProblem

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
