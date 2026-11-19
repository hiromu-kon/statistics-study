import { useState } from 'react'
import { Legend, type Color } from '../../../components/charts/Plot'
import { DiceGrid } from './DiceGrid'
import { fractionText } from './fraction'
import { Tabs } from './Tabs'

type View = 'A' | 'B' | 'both' | 'and' | 'or' | 'notA'

const inA = (a: number, b: number) => a + b >= 8
const inB = (a: number, b: number) => a === b

const count = (f: (a: number, b: number) => boolean) => {
  let n = 0
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (f(a, b)) n++
  return n
}

const nA = count(inA)
const nB = count(inB)
const nAnd = count((a, b) => inA(a, b) && inB(a, b))
const nOr = count((a, b) => inA(a, b) || inB(a, b))
const nNotA = 36 - nA

/**
 * サイコロ2個で、A「目の和が8以上」と B「ぞろ目」を塗り分ける。
 * タブで「A」「B」「AかつB」「AまたはB」「Aでない」を切り替え、マスを数えて確率を出す。
 */
export function DiceEventExplorer() {
  const [view, setView] = useState<View>('both')
  const color = (a: number, b: number): Color | null => {
    const x = inA(a, b)
    const y = inB(a, b)
    switch (view) {
      case 'A':
        return x ? 'c1' : null
      case 'B':
        return y ? 'c3' : null
      case 'both':
        return x && y ? 'c4' : x ? 'c1' : y ? 'c3' : null
      case 'and':
        return x && y ? 'c4' : null
      case 'or':
        return x || y ? 'c2' : null
      case 'notA':
        return x ? null : 'c5'
    }
  }
  const readout: Record<View, string> = {
    A: `A（和が8以上）は ${nA} マス → P(A) = ${fractionText(nA, 36)}`,
    B: `B（ぞろ目）は ${nB} マス → P(B) = ${fractionText(nB, 36)}`,
    both: `A だけ・B だけ・両方（紫）を色分け。紫の ${nAnd} マスは A にも B にも数えられている`,
    and: `A∩B（A かつ B）は ${nAnd} マス → P(A∩B) = ${fractionText(nAnd, 36)}`,
    or: `A∪B（A または B）は ${nOr} マス = ${nA} + ${nB} − ${nAnd} → P(A∪B) = ${fractionText(nOr, 36)}`,
    notA: `A の余事象（和が7以下）は ${nNotA} マス = 36 − ${nA} → P(Aでない) = ${fractionText(nNotA, 36)}`,
  }
  return (
    <div>
      <Tabs
        value={view}
        onChange={setView}
        options={[
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'both', label: '重ねる' },
          { id: 'and', label: 'A∩B' },
          { id: 'or', label: 'A∪B' },
          { id: 'notA', label: 'Aでない' },
        ]}
      />
      <DiceGrid color={color} text={(a, b) => String(a + b)} ariaLabel="サイコロ2個の36通りのマス。数字は目の和" />
      {view === 'both' && (
        <Legend
          items={[
            { color: 'c1', label: 'A だけ' },
            { color: 'c3', label: 'B だけ' },
            { color: 'c4', label: 'A と B の両方' },
          ]}
        />
      )}
      <p className="figure-readout">{readout[view]}</p>
    </div>
  )
}
