import { useState } from 'react'
import { Button, Card, Controls } from '../../../components/blocks'

const CHOICES = ['二項分布', 'ポアソン分布', '幾何分布', '負の二項分布', '超幾何分布', '一様分布', '指数分布', '正規分布'] as const
type Choice = (typeof CHOICES)[number]

const SCENES: { scene: string; answer: Choice; reason: string }[] = [
  {
    scene: 'コールセンターで、電話が鳴ってから次の電話が鳴るまでの時間（平均3分）',
    answer: '指数分布',
    reason: '「次の出来事までの待ち時間」。時刻表がなく、バラバラに起こる出来事の間隔。',
  },
  {
    scene: '成功率 0.6 の選手がPKを8本蹴ったときの、決まった本数',
    answer: '二項分布',
    reason: '回数（8本）が先に決まっていて、毎回の成功確率が同じ。数えるのは成功の回数 → B(8, 0.6)。',
  },
  {
    scene: '赤玉4個・白玉6個の袋から、同時に3個取り出したときの赤玉の個数',
    answer: '超幾何分布',
    reason: '「同時に取り出す」は戻さずに取り出すのと同じ。取るたびに確率が変わる。',
  },
  {
    scene: '工場で作ったボルトの長さのばらつき（狙った長さの前後に左右対称に散らばる）',
    answer: '正規分布',
    reason: '連続した量で、平均のまわりに左右対称のつりがね形に散らばる。',
  },
  {
    scene: 'ある交差点で1週間に起こる事故の件数（平均1.2件）',
    answer: 'ポアソン分布',
    reason: '決まった期間（1週間）の中で、まれな出来事が起こる回数。試した回数 n がはっきりしない → Po(1.2)。',
  },
  {
    scene: 'サイコロを、1の目が3回出るまで振り続けたときの、振った回数',
    answer: '負の二項分布',
    reason: '「r 回（ここでは3回）成功するまで」の回数。r = 1 なら幾何分布。',
  },
  {
    scene: '5分おきに時刻どおり来る電車のホームに、時刻を見ずに着いたときの待ち時間',
    answer: '一様分布',
    reason: '0〜5分のどの待ち時間も同じくらい起こりやすい → U(0, 5)。',
  },
  {
    scene: 'くじ引きで、初めて当たりが出るまでに引いた回数（毎回くじは戻す）',
    answer: '幾何分布',
    reason: '「初めて成功するまで」の回数。戻すので毎回の確率は同じ。',
  },
]

/** 場面を読んで、どの分布が当てはまるかを選ぶ練習。答えを選ぶと理由が出る */
export function ChooseDistribution() {
  const [picked, setPicked] = useState<(Choice | null)[]>(() => SCENES.map(() => null))
  const correct = picked.filter((p, i) => p === SCENES[i].answer).length
  const answered = picked.filter((p) => p !== null).length
  return (
    <div>
      {SCENES.map((s, i) => {
        const p = picked[i]
        return (
          <Card key={i} title={`(${i + 1}) ${s.scene}`}>
            <Controls>
              {CHOICES.map((c) => (
                <Button
                  key={c}
                  variant={p === c ? 'primary' : 'default'}
                  onClick={() => setPicked((prev) => prev.map((v, j) => (j === i ? c : v)))}
                >
                  {c}
                </Button>
              ))}
            </Controls>
            {p && (
              <p className="small">
                {p === s.answer ? <strong>正解！</strong> : <strong>ちがいます（答え：{s.answer}）</strong>} {s.reason}
              </p>
            )}
          </Card>
        )
      })}
      <p className="figure-readout">
        答えた数 {answered} / {SCENES.length}　正解 <strong>{correct}</strong>
      </p>
    </div>
  )
}
