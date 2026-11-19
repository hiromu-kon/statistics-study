import katex from 'katex'
import { Fragment, useMemo, type ReactNode } from 'react'

function render(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, { displayMode, throwOnError: false, strict: false })
}

/** 文中の数式。例: <M>\bar{x}</M> */
export function M({ children }: { children: string }) {
  const html = useMemo(() => render(children, false), [children])
  return <span className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />
}

/** 1行を使う数式。caption に「何を知りたい式か」を添えられる */
export function MathBlock({ children, caption }: { children: string; caption?: ReactNode }) {
  const html = useMemo(() => render(children, true), [children])
  return (
    <figure className="math-block">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

// $$...$$（ブロック数式）、$...$（文中の数式）、**...**（太字）を順に切り出す
const TOKEN = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$|\*\*[^*]+?\*\*)/g

/** 問題文などの文字列を、数式・太字・改行つきで表示する */
export function RichText({ value }: { value: ReactNode }) {
  if (typeof value !== 'string') return <>{value}</>
  const parts = value.split(TOKEN)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('$$')) return <MathBlock key={i}>{p.slice(2, -2)}</MathBlock>
        if (p.startsWith('$')) return <M key={i}>{p.slice(1, -1)}</M>
        if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
        return (
          <Fragment key={i}>
            {p.split('\n').map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </Fragment>
        )
      })}
    </>
  )
}
