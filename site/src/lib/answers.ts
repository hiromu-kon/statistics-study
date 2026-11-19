import type { Problem } from '../types'

/** 選択問題は選んだ番号（0 始まり）、数値入力問題は入力した文字列 */
export type Response = number | string

/** 全角数字・全角記号・カンマ区切りを、計算できる半角の数値に直す */
export function parseNumber(input: string): number | null {
  const normalized = input
    .replace(/[０-９．－＋]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[−ー]/g, '-')
    .replace(/,/g, '')
    .trim()
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(normalized)) return null
  return Number(normalized)
}

export function isAnswered(problem: Problem, response: Response | undefined): boolean {
  if (response === undefined) return false
  return problem.kind === 'numeric' ? parseNumber(String(response)) !== null : typeof response === 'number'
}

export function isCorrect(problem: Problem, response: Response | undefined): boolean {
  if (response === undefined) return false
  if (problem.kind === 'numeric') {
    const v = parseNumber(String(response))
    // 浮動小数点の誤差で境目ちょうどの値が不正解にならないように、ほんの少しだけ幅を足す
    return v !== null && Math.abs(v - problem.answerValue) <= problem.tolerance + 1e-12
  }
  return response === problem.answer
}

export function correctAnswerLabel(problem: Problem): string {
  return problem.kind === 'numeric' ? `${problem.answerValue}` : `${problem.answer + 1}`
}
