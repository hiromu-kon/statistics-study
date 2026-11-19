import { marked } from 'marked'
import { useMemo, useState } from 'react'

// 学習ログはサイトの外（リポジトリ直下）の Markdown をそのまま正とする。
// サイト側にコピーすると、エディタで書いたログと二重管理になるため。
const files = import.meta.glob<string>(
  [
    '../../../learning-log/**/*.md',
    '../../../questions/*.md',
    '../../../mistakes/*.md',
    '../../../glossary/*.md',
    '../../../roadmap/*.md',
    '../../../references/*.md',
  ],
  { query: '?raw', import: 'default', eager: true },
)

type Doc = { path: string; group: string; name: string; body: string }

const GROUP_LABEL: Record<string, string> = {
  'learning-log': '学習ログ',
  questions: '疑問メモ',
  mistakes: 'ミスの記録',
  glossary: '自分の言い換え',
  roadmap: '目標',
  references: '使った教材',
}

const GROUP_ORDER = ['learning-log', 'questions', 'mistakes', 'glossary', 'roadmap', 'references']

const NAME_LABEL: Record<string, string> = {
  unresolved: '未解決の疑問',
  resolved: '解決した疑問',
  grade2: '2級',
  README: '書き方',
  terms: '用語の言い換え',
  'easy-explanations': 'やさしい言い換え',
  goals: '目標と到達ライン',
  books: '書籍',
  websites: 'Webサイト',
  youtube: 'YouTube',
}

const docs: Doc[] = Object.entries(files)
  .map(([path, body]) => {
    const rel = path.replace('../../../', '')
    const group = rel.split('/')[0]
    const base = rel.split('/').pop()!.replace(/\.md$/, '')
    return { path: rel, group, name: NAME_LABEL[base] ?? base, body }
  })
  .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || b.path.localeCompare(a.path))

export function LogPage() {
  const [current, setCurrent] = useState(docs[0]?.path ?? '')
  const doc = docs.find((d) => d.path === current)
  const html = useMemo(() => (doc ? (marked.parse(doc.body) as string) : ''), [doc])
  const groups = [...new Set(docs.map((d) => d.group))]

  return (
    <div className="page">
      <h1>学習ログ</h1>
      <p className="lead">
        リポジトリの <code>learning-log/</code>・<code>questions/</code>・<code>mistakes/</code>・<code>glossary/</code>・<code>roadmap/</code>・<code>references/</code> にある Markdown を表示しています。
        書き足すときはエディタでファイルを編集してください（開発サーバーなら保存するとすぐ反映されます）。
      </p>
      <div className="log-layout">
        <aside className="log-files">
          {groups.map((g) => (
            <div key={g}>
              <div className="nav-heading">{GROUP_LABEL[g] ?? g}</div>
              {docs
                .filter((d) => d.group === g)
                .map((d) => (
                  <button key={d.path} type="button" className={`log-file ${d.path === current ? 'on' : ''}`} onClick={() => setCurrent(d.path)}>
                    {d.name}
                  </button>
                ))}
            </div>
          ))}
        </aside>
        <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}
