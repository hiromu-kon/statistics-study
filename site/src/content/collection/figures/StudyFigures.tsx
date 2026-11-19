import { useMemo, useState } from 'react'
import { Button, Controls, Slider } from '../../../components/blocks'
import { colorVar, type Color } from '../../../components/charts/Plot'
import { createRng, round } from '../../../lib/stats'
import { Arrow, Choice, DText, Diagram } from './svg'
import { shuffle } from './shuffle'

/** 角の丸い箱と、その中の文字（Diagram の中で使う） */
export function NodeBox({ x, y, label, color = 'ink', sub }: { x: number; y: number; label: string; color?: Color; sub?: string }) {
  const w = Math.max(label.length * 14, (sub?.length ?? 0) * 11.5) + 28
  const h = sub ? 50 : 36
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} fill="var(--surface)" stroke={colorVar(color)} strokeWidth={2} />
      <DText x={x} y={sub ? y - 8 : y} color={color}>
        {label}
      </DText>
      {sub && (
        <DText x={x} y={y + 12} color="muted" size={11} weight={500}>
          {sub}
        </DText>
      )}
    </g>
  )
}

const POP_COLS = 20
const POP_ROWS = 10
const POP_N = POP_COLS * POP_ROWS
const POP_YES = 80

/**
 * 母集団（200人）から標本を無作為に選ぶ図。
 * 母集団の賛成率は 40%。標本の賛成率は、選ぶたびに少しずつちがう（標本誤差）。
 */
export function PopulationSample() {
  const [n, setN] = useState(20)
  const [seed, setSeed] = useState(1)
  const yes = useMemo(() => {
    const ids = shuffle(
      Array.from({ length: POP_N }, (_, i) => i),
      createRng(777),
    )
    const s = new Set(ids.slice(0, POP_YES))
    return Array.from({ length: POP_N }, (_, i) => s.has(i))
  }, [])
  const order = useMemo(
    () =>
      shuffle(
        Array.from({ length: POP_N }, (_, i) => i),
        createRng(seed),
      ),
    [seed],
  )
  const picked = order.slice(0, n)
  const pickedSet = new Set(picked)
  const sampleYes = picked.filter((i) => yes[i]).length
  const px = (i: number) => 26 + (i % POP_COLS) * 17.4
  const py = (i: number) => 52 + Math.floor(i / POP_COLS) * 18
  const sx = (j: number) => 420 + (j % 6) * 20
  const sy = (j: number) => 52 + Math.floor(j / 6) * 18
  return (
    <div>
      <Diagram width={560} height={250} ariaLabel="母集団から標本を選ぶ図">
        <rect x={12} y={26} width={358} height={210} rx={12} fill="none" stroke="var(--line)" strokeWidth={2} />
        <DText x={20} y={14} anchor="start">
          母集団（知りたい対象の全体・200人）
        </DText>
        {yes.map((y, i) => (
          <circle
            key={i}
            cx={px(i)}
            cy={py(i)}
            r={5.5}
            fill={colorVar(y ? 'c1' : 'muted')}
            opacity={pickedSet.has(i) ? 1 : 0.3}
            stroke={pickedSet.has(i) ? colorVar('c2') : 'none'}
            strokeWidth={2.5}
          />
        ))}
        <Arrow x1={374} y1={130} x2={404} y2={130} color="c2" id="pop-arrow" />
        <rect x={406} y={26} width={140} height={210} rx={12} fill="none" stroke={colorVar('c2')} strokeWidth={2} />
        <DText x={412} y={14} anchor="start" color="c2">
          標本（{n}人）
        </DText>
        {picked.map((i, j) => (
          <circle key={i} cx={sx(j)} cy={sy(j)} r={6} fill={colorVar(yes[i] ? 'c1' : 'muted')} />
        ))}
      </Diagram>
      <p className="figure-readout">
        母集団の賛成率 <strong>40%</strong>（全員に聞けばわかる）　標本の賛成率 <strong>{round((sampleYes / n) * 100, 1)}%</strong>（{n}人中 {sampleYes}人）
      </p>
      <p className="figure-readout small muted">青 = 賛成、灰色 = 反対。オレンジの輪が選ばれた人</p>
      <Controls>
        <Slider label="標本の大きさ n" value={n} min={5} max={60} step={5} onChange={setN} format={(v) => `${v}人`} />
        <Button onClick={() => setSeed((s) => s + 1)}>もう一度選び直す</Button>
      </Controls>
    </div>
  )
}

/** 観察研究で因果がいいにくい理由（交絡）を示す矢印図 */
export function ConfoundingDiagram() {
  return (
    <Diagram width={560} height={220} ariaLabel="交絡因子の図">
      <NodeBox x={280} y={40} label="生活リズム" sub="早寝早起きなど（交絡因子）" color="c5" />
      <NodeBox x={110} y={175} label="朝食を食べる" color="c1" />
      <NodeBox x={450} y={175} label="テストの成績" color="c3" />
      <Arrow x1={235} y1={66} x2={140} y2={152} color="c5" width={2.5} id="conf-a" />
      <Arrow x1={325} y1={66} x2={420} y2={152} color="c5" width={2.5} id="conf-b" />
      <Arrow x1={200} y1={175} x2={360} y2={175} color="muted" dashed id="conf-c" />
      <DText x={280} y={160} color="muted">
        本当に効果がある？
      </DText>
      <DText x={160} y={105} color="c5" size={12}>
        食べやすくする
      </DText>
      <DText x={400} y={105} color="c5" size={12}>
        成績を上げる
      </DText>
    </Diagram>
  )
}

const PEOPLE = 40

/**
 * 「本人が選ぶ（観察研究）」と「くじで割り当てる（実験研究）」で、
 * 2つの群の中身（運動習慣のある人の割合）がどう変わるかを見る図。
 */
export function AssignmentDemo() {
  const [mode, setMode] = useState<'self' | 'random'>('self')
  const [seed, setSeed] = useState(3)
  // 0〜19 番が運動習慣のある人
  const active = (i: number) => i < PEOPLE / 2
  const treated = useMemo(() => {
    const rng = createRng(seed * 31 + (mode === 'self' ? 1 : 2))
    if (mode === 'random') {
      const ids = shuffle(
        Array.from({ length: PEOPLE }, (_, i) => i),
        rng,
      )
      return new Set(ids.slice(0, PEOPLE / 2))
    }
    // 運動習慣のある人ほど、健康に気をつかってサプリを飲みたがる
    return new Set(Array.from({ length: PEOPLE }, (_, i) => i).filter((i) => rng() < (active(i) ? 0.8 : 0.2)))
  }, [mode, seed])
  const groupT = Array.from({ length: PEOPLE }, (_, i) => i).filter((i) => treated.has(i))
  const groupC = Array.from({ length: PEOPLE }, (_, i) => i).filter((i) => !treated.has(i))
  const rate = (g: number[]) => (g.length === 0 ? 0 : (g.filter(active).length / g.length) * 100)
  const dot = (g: number[], x0: number) =>
    g.map((i, j) => <circle key={i} cx={x0 + 22 + (j % 8) * 26} cy={66 + Math.floor(j / 8) * 26} r={9} fill={colorVar(active(i) ? 'c3' : 'muted')} />)
  return (
    <div>
      <Choice
        options={[
          { value: 'self', label: '本人が選ぶ（観察研究）' },
          { value: 'random', label: 'くじで割り当てる（実験研究）' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <Diagram width={560} height={230} ariaLabel="2つの群の中身">
        <rect x={10} y={40} width={250} height={180} rx={12} fill="none" stroke={colorVar('c1')} strokeWidth={2} />
        <DText x={135} y={22} color="c1">
          サプリを飲む群（{groupT.length}人）
        </DText>
        {dot(groupT, 10)}
        <rect x={300} y={40} width={250} height={180} rx={12} fill="none" stroke={colorVar('c4')} strokeWidth={2} />
        <DText x={425} y={22} color="c4">
          飲まない群（{groupC.length}人）
        </DText>
        {dot(groupC, 300)}
      </Diagram>
      <p className="figure-readout">
        運動習慣のある人（緑）の割合：飲む群 <strong>{round(rate(groupT), 0)}%</strong>　飲まない群 <strong>{round(rate(groupC), 0)}%</strong>
      </p>
      <p className="figure-readout small muted">
        {mode === 'self'
          ? '運動する人ほどサプリを選びやすいので、飲む群に運動する人が集まる。健康の差がサプリのおかげか運動のおかげか区別できない'
          : 'くじで分けると、運動する人もしない人も、だいたい半々ずつ両方の群に入る'}
      </p>
      <Controls>
        <Button onClick={() => setSeed((s) => s + 1)}>もう一度分け直す</Button>
      </Controls>
    </div>
  )
}
