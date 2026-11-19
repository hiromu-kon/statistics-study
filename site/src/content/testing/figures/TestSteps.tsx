import type { ReactNode } from 'react'
import { Steps } from '../../../components/blocks'

/**
 * どの検定でも同じ「4つの手順」で書くための枠。
 * 検定ごとに書き方が変わると型が身につかないので、見出しの言葉もそろえている。
 */
export function TestSteps({
  hypothesis,
  statistic,
  compare,
  conclusion,
}: {
  hypothesis: ReactNode
  statistic: ReactNode
  compare: ReactNode
  conclusion: ReactNode
}) {
  return (
    <Steps>
      <li>
        <strong>仮説を立てる</strong>
        <div>{hypothesis}</div>
      </li>
      <li>
        <strong>検定統計量を計算する</strong>
        <div>{statistic}</div>
      </li>
      <li>
        <strong>分布表と比べる（または p 値）</strong>
        <div>{compare}</div>
      </li>
      <li>
        <strong>結論を言う</strong>
        <div>{conclusion}</div>
      </li>
    </Steps>
  )
}
