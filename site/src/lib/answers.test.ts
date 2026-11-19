import { describe, expect, it } from 'vitest'
import type { ChoiceProblem, NumericProblem } from '../types'
import { correctAnswerLabel, isAnswered, isCorrect, parseNumber } from './answers'

const numeric: NumericProblem = {
  id: 'x-01',
  lesson: 'x',
  level: 2,
  kind: 'numeric',
  question: '',
  explanation: '',
  answerValue: 0.25,
  tolerance: 0.005,
  unit: '小数第2位まで',
}

const choice: ChoiceProblem = { id: 'x-02', lesson: 'x', level: 1, question: '', explanation: '', choices: ['a', 'b', 'c', 'd'], answer: 2 }

describe('数値の読み取り', () => {
  it('半角・全角の数字、負の数、カンマ区切りを数値として読む', () => {
    expect(parseNumber('0.25')).toBe(0.25)
    expect(parseNumber('０．２５')).toBe(0.25)
    expect(parseNumber('-1.5')).toBe(-1.5)
    expect(parseNumber('−1.5')).toBe(-1.5)
    expect(parseNumber('1,234')).toBe(1234)
    expect(parseNumber(' .5 ')).toBe(0.5)
  })

  it('数値でない入力は読まない', () => {
    expect(parseNumber('')).toBeNull()
    expect(parseNumber('abc')).toBeNull()
    expect(parseNumber('1/4')).toBeNull()
    expect(parseNumber('1.2.3')).toBeNull()
  })
})

describe('数値入力問題の採点', () => {
  it('許すずれの幅の中なら正解（境目ちょうども正解）', () => {
    expect(isCorrect(numeric, '0.25')).toBe(true)
    expect(isCorrect(numeric, '0.254')).toBe(true)
    expect(isCorrect(numeric, '0.245')).toBe(true)
    expect(isCorrect(numeric, '0.255')).toBe(true)
  })

  it('幅の外や、数値として読めない入力は不正解', () => {
    expect(isCorrect(numeric, '0.26')).toBe(false)
    expect(isCorrect(numeric, '1/4')).toBe(false)
    expect(isCorrect(numeric, undefined)).toBe(false)
  })

  it('数値として読める入力があるときだけ解答済みとみなす', () => {
    expect(isAnswered(numeric, '')).toBe(false)
    expect(isAnswered(numeric, 'abc')).toBe(false)
    expect(isAnswered(numeric, '0.3')).toBe(true)
  })

  it('正解の表示は答えの値', () => {
    expect(correctAnswerLabel(numeric)).toBe('0.25')
  })
})

describe('選択問題の採点', () => {
  it('正解の番号を選んだときだけ正解', () => {
    expect(isCorrect(choice, 2)).toBe(true)
    expect(isCorrect(choice, 1)).toBe(false)
    expect(isAnswered(choice, undefined)).toBe(false)
  })

  it('正解の表示は1始まりの番号', () => {
    expect(correctAnswerLabel(choice)).toBe('3')
  })
})
