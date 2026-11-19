// 生存時間分析のレッスンで使う架空のデータと計算。数値は numpy で計算した値と突き合わせてある。

/** 8人の患者の観察期間（か月）と、観察の終わりが死亡（event = 1）か打ち切り（0）か */
export const patients = [
  { id: 'A', time: 2, event: 1 },
  { id: 'B', time: 3, event: 0 },
  { id: 'C', time: 4, event: 1 },
  { id: 'D', time: 5, event: 1 },
  { id: 'E', time: 5, event: 1 },
  { id: 'F', time: 7, event: 0 },
  { id: 'G', time: 8, event: 1 },
  { id: 'H', time: 10, event: 0 },
]

export type KmRow = { time: number; atRisk: number; deaths: number; surv: number }

/** カプラン・マイヤー推定量。同じ時刻の打ち切りは、その時刻の死亡の後に起きたとみなす（リスク集合に含める） */
export function kaplanMeier(data: { time: number; event: number }[]): KmRow[] {
  const times = [...new Set(data.filter((d) => d.event === 1).map((d) => d.time))].sort((a, b) => a - b)
  let s = 1
  return times.map((t) => {
    const atRisk = data.filter((d) => d.time >= t).length
    const deaths = data.filter((d) => d.time === t && d.event === 1).length
    s *= 1 - deaths / atRisk
    return { time: t, atRisk, deaths, surv: s }
  })
}

/** 階段グラフの点列（t = 0 で 1 から始め、死亡のたびに下がる） */
export function stepPoints(rows: KmRow[], end: number): { x: number; y: number }[] {
  const pts = [{ x: 0, y: 1 }]
  let s = 1
  for (const r of rows) {
    pts.push({ x: r.time, y: s })
    s = r.surv
    pts.push({ x: r.time, y: s })
  }
  pts.push({ x: end, y: s })
  return pts
}
