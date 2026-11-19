import { useSyncExternalStore } from 'react'

// 自分専用サイトなのでサーバーは持たず、ブラウザの localStorage に保存する。
const KEY = 'stats2-progress-v1'

export type Attempt = { correct: number; wrong: number; lastCorrect: boolean; at: string }
export type MockResult = { at: string; score: number; total: number; seconds: number }

export type Progress = {
  completed: Record<string, string>
  attempts: Record<string, Attempt>
  mocks: MockResult[]
}

const empty: Progress = { completed: {}, attempts: {}, mocks: [] }

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

let state: Progress = load()
const listeners = new Set<() => void>()

function save(next: Progress) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 保存できない環境（プライベートモードなど）でも画面は動かす
  }
  listeners.forEach((l) => l())
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

export function toggleCompleted(lessonId: string) {
  const completed = { ...state.completed }
  if (completed[lessonId]) delete completed[lessonId]
  else completed[lessonId] = new Date().toISOString()
  save({ ...state, completed })
}

export function recordAttempt(problemId: string, correct: boolean) {
  const prev = state.attempts[problemId] ?? { correct: 0, wrong: 0, lastCorrect: false, at: '' }
  const next: Attempt = {
    correct: prev.correct + (correct ? 1 : 0),
    wrong: prev.wrong + (correct ? 0 : 1),
    lastCorrect: correct,
    at: new Date().toISOString(),
  }
  save({ ...state, attempts: { ...state.attempts, [problemId]: next } })
}

export function recordMock(result: MockResult) {
  save({ ...state, mocks: [...state.mocks, result] })
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 2)
}

export function importProgress(json: string) {
  save({ ...empty, ...JSON.parse(json) })
}

export function resetProgress() {
  save(empty)
}
