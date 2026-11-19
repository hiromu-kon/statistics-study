import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="page">
      <h1>ページが見つかりません</h1>
      <p>
        <Link to="/">ホームへ戻る</Link>
      </p>
    </div>
  )
}
