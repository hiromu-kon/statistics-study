import type { CourseMeta } from '../types'

// 1級は枠だけ用意している。試験の形式は公式サイトで確かめてから mockExam に書く。
export const courses: CourseMeta[] = [
  {
    id: 'grade2',
    order: 0,
    title: '統計検定2級',
    shortTitle: '2級',
    summary: '中学数学の復習から、記述統計・確率分布・推定・検定・回帰分析まで。大学基礎レベルの統計学。',
    headline: '中学数学から、2級の合格ラインまで。',
    status: 'active',
    officialUrl: 'https://www.toukei-kentei.jp/exam/grade2/',
    // 公式サイト（2026-11-19 参照）: 35問程度・90分・100点満点で60点以上
    mockExam: { problems: 35, minutes: 90, passPercent: 60 },
  },
  {
    id: 'pre1',
    order: 1,
    title: '統計検定準1級',
    shortTitle: '準1級',
    summary: '2級の知識を土台に、確率分布の理論・最尤法・検定の理論・回帰・多変量解析・時系列解析まで。微分・積分・行列の準備から始めます。',
    headline: '2級の次の一歩へ。',
    status: 'active',
    officialUrl: 'https://www.toukei-kentei.jp/grade/grade_pre-1',
    // 公式サイト（2026-11-20 参照）: 25〜30問・90分・100点満点で60点以上。
    // 問題数は多いほうの30問にして、1問あたりの時間を本番の短いほう（3分）にそろえる
    mockExam: { problems: 30, minutes: 90, passPercent: 60 },
  },
  {
    id: 'grade1',
    order: 2,
    title: '統計検定1級',
    shortTitle: '1級',
    summary: '数理統計と応用統計。教材はこれから作ります。',
    headline: '統計検定の最上位へ。',
    status: 'planned',
    officialUrl: 'https://www.toukei-kentei.jp/exam/grade1/',
    mockExam: null,
  },
]

export const courseById = new Map(courses.map((c) => [c.id, c]))

export const defaultCourse = courses.find((c) => c.status === 'active')!
