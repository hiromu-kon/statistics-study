import { useState } from 'react'
import { exportProgress, importProgress, resetProgress } from '../lib/progress'

export function DataPage() {
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')
  return (
    <div className="page">
      <h1>記録のバックアップ</h1>
      <p className="lead">
        学習の記録（読み終えたレッスン・問題の正誤・模擬試験の結果）は、このブラウザの中だけに保存されています。
        別のブラウザやパソコンに移すときは、ここで書き出して読み込んでください。
      </p>
      <div className="controls">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setText(exportProgress())
            setMessage('下の欄に書き出しました。コピーして保存してください。')
          }}
        >
          書き出す
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            try {
              importProgress(text)
              setMessage('読み込みました。')
            } catch {
              setMessage('読み込めませんでした。書き出した内容をそのまま貼り付けてください。')
            }
          }}
        >
          下の欄から読み込む
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (text === 'リセット') {
              resetProgress()
              setMessage('記録を消しました。')
            } else setMessage('消すときは、下の欄に「リセット」と入力してからもう一度押してください。')
          }}
        >
          記録をすべて消す
        </button>
      </div>
      {message && <p className="muted">{message}</p>}
      <textarea className="data-text" value={text} onChange={(e) => setText(e.target.value)} rows={14} />
    </div>
  )
}
