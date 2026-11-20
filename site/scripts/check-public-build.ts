// 公開用のビルド（dist/）に、リポジトリ直下の個人的なメモが入っていないかを確かめる。
// デプロイの直前に実行し、1行でも見つかったら止める。
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '../..')
const DIST = join(import.meta.dirname, '../dist')
const PRIVATE_DIRS = ['learning-log', 'questions', 'mistakes', 'glossary', 'roadmap', 'references']

function files(dir: string, ext: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return files(path, ext)
    return ext.test(name) ? [path] : []
  })
}

// 見出しや表の区切り、短い行は教材と重なりやすいので、本文らしい行だけで照らし合わせる
const privateLines = PRIVATE_DIRS.flatMap((d) => files(join(ROOT, d), /\.md$/)).flatMap((file) =>
  readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length >= 20 && !/^(#|\||```)/.test(line))
    .map((line) => ({ file: file.replace(`${ROOT}/`, ''), line })),
)

const built = files(DIST, /\.(js|css|html|json|txt|map)$/).map((f) => readFileSync(f, 'utf8'))
const leaked = [
  ...PRIVATE_DIRS.filter((d) => built.some((src) => src.includes(`${d}/`) && src.includes('.md'))).map((d) => `${d}/ のファイル名`),
  ...privateLines.filter(({ line }) => built.some((src) => src.includes(line))).map(({ file, line }) => `${file}: ${line}`),
]

if (leaked.length > 0) {
  console.error('公開用のビルドに個人的なメモが入っています。デプロイを止めました。')
  for (const l of leaked) console.error(`  ${l}`)
  process.exit(1)
}
console.log(`OK: ${privateLines.length} 行のメモが dist/ に入っていないことを確かめました。`)
