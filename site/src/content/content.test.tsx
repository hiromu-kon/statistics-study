import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RichText } from '../components/Math'
import { chapters } from './chapters'
import { formulas, glossary, lessonById, lessons, problems, problemsByLesson } from './registry'

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

  it.each(problems.map((p) => [p.id, p] as const))('%s は正解が選択肢の中にあり、選択肢が重複せず、描画できる', (_, p) => {
    expect(lessonById.has(p.lesson), `存在しないレッスン ${p.lesson}`).toBe(true)
    expect(p.choices.length).toBeGreaterThanOrEqual(4)
    expect(p.answer).toBeGreaterThanOrEqual(0)
    expect(p.answer).toBeLessThan(p.choices.length)
    const rendered = p.choices.map((c) => render(<RichText value={c} />))
    expect(new Set(rendered).size).toBe(rendered.length)
    const html = render(
      <>
        <RichText value={p.question} />
        <RichText value={p.explanation} />
      </>,
    )
    expect(html).not.toContain('katex-error')
  })

  // 模擬試験や絞り込みでは問題が1問ずつばらばらに出るため
  it.each(problems.map((p) => [p.id, p] as const))('%s の問題文は他の問題に頼らない', (_, p) => {
    const text = render(<RichText value={p.question} />)
    expect(text).not.toMatch(/前の問題|前問|上の問題|問\d+と同じ|^同じ表/)
  })

  it('正解の位置が1か所に偏らない（どの位置も4割未満）', () => {
    const counts = new Map<number, number>()
    for (const p of problems) counts.set(p.answer, (counts.get(p.answer) ?? 0) + 1)
    for (const [pos, n] of counts) expect(n / problems.length, `${pos + 1}番が正解の問題の割合`).toBeLessThan(0.4)
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

describe('数式の書き方', () => {
  // KaTeX のフォントに日本語の字形がなく、崩れて表示されるため
  it('数式の中に日本語を書かない', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(join(__dirname))) {
      const src = readFileSync(file, 'utf8')
      // テンプレートリテラルの埋め込み（${name}）だけを除く。${}_{5}C_{2} のような数式は残す
      .replace(/\$\{[A-Za-z_][^}]*\}/g, '')
      const pieces = [
        ...src.matchAll(/<M>\{'([^']*)'\}<\/M>/g),
        ...src.matchAll(/<MathBlock[^>]*>\{'([^']*)'\}<\/MathBlock>/g),
        ...src.matchAll(/tex: '([^']*)'/g),
        ...src.matchAll(/\$\$?([^$\n]+?)\$\$?/g),
      ].map((m) => m[1])
      for (const p of pieces) if (JAPANESE.test(p)) offenders.push(`${file.replace(__dirname, '')}: ${p}`)
    }
    expect(offenders).toEqual([])
  })
})
