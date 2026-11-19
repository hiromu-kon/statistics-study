import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RichText } from '../components/Math'
import type { ChoiceProblem, NumericProblem } from '../types'
import { chapterById, chapters, chaptersByCourse } from './chapters'
import { courseById, courses } from './courses'
import { formulas, glossary, lessonById, lessons, problems, problemsByCourse, problemsByLesson } from './registry'

const JAPANESE = /[぀-ヿ㐀-鿿]/

function render(node: React.ReactNode): string {
  return renderToString(<MemoryRouter>{node}</MemoryRouter>)
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx)$/.test(name) && !name.endsWith('.test.tsx') ? [path] : []
  })
}

describe('コース', () => {
  it('ID が重複しない', () => {
    expect(courseById.size).toBe(courses.length)
  })

  it('どの章も、存在するコースに属している', () => {
    for (const c of chapters) expect(courseById.has(c.course), c.id).toBe(true)
  })

  it('章の順番がコースの中で重複しない', () => {
    for (const course of courses) {
      const orders = chaptersByCourse(course.id).map((c) => c.order)
      expect(new Set(orders).size, course.id).toBe(orders.length)
    }
  })

  // 章フォルダは全コースで1つの階層に並ぶので、2級の後に足すコースの章は名前が重ならないようにする
  it('2級以外のコースの章 ID はコース ID で始まる', () => {
    for (const c of chapters) if (c.course !== 'grade2') expect(c.id.startsWith(`${c.course}-`), c.id).toBe(true)
  })

  it('教材のあるコースには章がある', () => {
    for (const course of courses) if (course.status === 'active') expect(chaptersByCourse(course.id).length, course.id).toBeGreaterThan(0)
  })

  it('模擬試験のあるコースは、本番と同じ問題数を出せるだけの標準・本番レベルの問題がある', () => {
    for (const course of courses) {
      if (!course.mockExam) continue
      const pool = problemsByCourse(course.id).filter((p) => p.level >= 2 && !chapterById.get(lessonById.get(p.lesson)!.chapter)?.prep)
      expect(pool.length, course.id).toBeGreaterThanOrEqual(course.mockExam.problems)
    }
  })
})

describe('レッスン', () => {
  it('ID が重複しない', () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length)
  })

  it('どの章にも属している', () => {
    const ids = new Set(chapters.map((c) => c.id))
    for (const l of lessons) expect(ids, l.id).toContain(l.chapter)
  })

  it('ID は「章ID-」で始まる', () => {
    for (const l of lessons) expect(l.id.startsWith(`${l.chapter}-`), l.id).toBe(true)
  })

  it.each(lessons.map((l) => [l.id, l] as const))('%s は描画でき、数式の書き間違いがない', (_, lesson) => {
    const html = render(<lesson.Component />)
    expect(html.length).toBeGreaterThan(500)
    expect(html).not.toContain('katex-error')
  })

  it.each(lessons.map((l) => [l.id] as const))('%s には基本・標準・本番レベルの問題が合わせて4問以上ある', (id) => {
    const qs = problemsByLesson(id)
    expect(qs.length).toBeGreaterThanOrEqual(4)
    expect(qs.some((q) => q.level === 1)).toBe(true)
    expect(qs.filter((q) => q.level === 2).length).toBeGreaterThanOrEqual(2)
    expect(qs.some((q) => q.level === 3)).toBe(true)
  })
})

describe('問題', () => {
  it('ID が重複しない', () => {
    expect(new Set(problems.map((p) => p.id)).size).toBe(problems.length)
  })

  it.each(problems.map((p) => [p.id, p] as const))('%s は描画でき、数式の書き間違いがない', (_, p) => {
    expect(lessonById.has(p.lesson), `存在しないレッスン ${p.lesson}`).toBe(true)
    const html = render(
      <>
        <RichText value={p.question} />
        <RichText value={p.explanation} />
      </>,
    )
    expect(html).not.toContain('katex-error')
  })

  const choiceProblems = problems.filter((p): p is ChoiceProblem => p.kind !== 'numeric')
  const numericProblems = problems.filter((p): p is NumericProblem => p.kind === 'numeric')

  it.each(choiceProblems.map((p) => [p.id, p] as const))('選択問題 %s は正解が選択肢の中にあり、選択肢が4つ以上で重複しない', (_, p) => {
    expect(p.choices.length).toBeGreaterThanOrEqual(4)
    expect(p.answer).toBeGreaterThanOrEqual(0)
    expect(p.answer).toBeLessThan(p.choices.length)
    const rendered = p.choices.map((c) => render(<RichText value={c} />))
    expect(new Set(rendered).size).toBe(rendered.length)
  })

  it.each(numericProblems.map((p) => [p.id, p] as const))('数値入力問題 %s は、答えの値と許すずれの幅が決まっていて、答え方の指示がある', (_, p) => {
    expect(Number.isFinite(p.answerValue)).toBe(true)
    expect(p.tolerance).toBeGreaterThan(0)
    // 幅が答えの大きさに比べて広すぎると、当て推量でも正解になってしまう
    expect(p.tolerance).toBeLessThan(Math.max(Math.abs(p.answerValue), 1) * 0.05)
    expect(p.unit, '小数第何位まで答えるかなどを unit に書く').toBeTruthy()
  })

  // 模擬試験や絞り込みでは問題が1問ずつばらばらに出るため
  it.each(problems.map((p) => [p.id, p] as const))('%s の問題文は他の問題に頼らない', (_, p) => {
    const text = render(<RichText value={p.question} />)
    expect(text).not.toMatch(/前の問題|前問|上の問題|問\d+と同じ|^同じ表/)
  })

  it('選択問題の正解の位置が1か所に偏らない（どの位置も4割未満）', () => {
    const counts = new Map<number, number>()
    for (const p of choiceProblems) counts.set(p.answer, (counts.get(p.answer) ?? 0) + 1)
    for (const [pos, n] of counts) expect(n / choiceProblems.length, `${pos + 1}番が正解の問題の割合`).toBeLessThan(0.4)
  })
})

describe('用語と公式', () => {
  it('参照しているレッスンが存在する', () => {
    for (const g of glossary) expect(lessonById.has(g.lesson), g.term).toBe(true)
    for (const f of formulas) expect(lessonById.has(f.lesson), f.id).toBe(true)
  })

  it('公式の ID が重複しない', () => {
    expect(new Set(formulas.map((f) => f.id)).size).toBe(formulas.length)
  })
})

describe('リンク', () => {
  it('本文・問題から張った /lessons/... のリンク先がすべて存在する', () => {
    const broken: string[] = []
    for (const file of [...sourceFiles(join(__dirname)), ...sourceFiles(join(__dirname, '../pages'))]) {
      for (const m of readFileSync(file, 'utf8').matchAll(/\/lessons\/([a-z0-9-]+)/g)) {
        if (!lessonById.has(m[1])) broken.push(`${file.replace(join(__dirname, '..'), '')}: ${m[1]}`)
      }
    }
    expect(broken).toEqual([])
  })
})

describe('数式の書き方', () => {
  // KaTeX のフォントに日本語の字形がなく、崩れて表示されるため
  it('数式の中に日本語を書かない', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(join(__dirname))) {
      const src = readFileSync(file, 'utf8')
      // テンプレートリテラルの埋め込み（${name}）だけを除く。${}_{5}C_{2} のような数式は残す
      .replace(/\$\{[A-Za-z_][^}]*\}/g, '')
      const pieces = [
        // 一重引用符・二重引用符・バッククォートのどれで書いた数式も拾う
        ...src.matchAll(/<M>\{(['"`])([\s\S]*?)\1\}<\/M>/g),
        ...src.matchAll(/<MathBlock[^>]*>\{(['"`])([\s\S]*?)\1\}<\/MathBlock>/g),
        ...src.matchAll(/tex: (['"`])([\s\S]*?)\1/g),
        ...src.matchAll(/\$\$?([^$\n]+?)\$\$?/g),
      ].map((m) => m[m.length - 1])
      for (const p of pieces) if (JAPANESE.test(p)) offenders.push(`${file.replace(__dirname, '')}: ${p}`)
    }
    expect(offenders).toEqual([])
  })
})
