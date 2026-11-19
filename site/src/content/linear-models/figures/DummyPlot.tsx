import { useState } from 'react'
import { Button, Controls } from '../../../components/blocks'
import { Label, Legend, Plot, Points, Segment } from '../../../components/charts/Plot'

// 架空の16店舗（売り場面積[m²]と1日の売上[万円]、D = 1 が駅前店）。係数は numpy で計算した値。
const stores = {
  area: [92, 93, 42, 54, 86, 84, 82, 70, 34, 52, 51, 44, 33, 85, 62, 37],
  station: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  sales: [41, 44, 22, 30, 41, 40, 33, 31, 31, 40, 53, 36, 36, 56, 48, 38],
}
const storeSimple = { a: 28.868, b: 0.158 }
const storeDummy = { b0: 4.549, b1: 0.407, b2: 17.437 }

/**
 * ダミー変数を入れると、傾きが同じで高さだけが違う2本の直線になることを見せる図。
 * ダミーなしの1本の直線と切り替えて比べられる。
 */
export function DummyPlot() {
  const [withDummy, setWithDummy] = useState(true)
  const pts = stores.area.map((a, i) => ({ x: a, y: stores.sales[i], color: stores.station[i] === 1 ? ('c2' as const) : ('c1' as const) }))
  const d = storeDummy
  const suburb = (x: number) => d.b0 + d.b1 * x
  const station = (x: number) => d.b0 + d.b1 * x + d.b2
  return (
    <div>
      <Plot x={[25, 100]} y={[10, 70]} xLabel="売り場面積（m²）" yLabel="売上（万円）" height={320}>
        {withDummy ? (
          <>
            <Segment x1={25} y1={suburb(25)} x2={100} y2={suburb(100)} color="c1" width={2.5} />
            <Segment x1={25} y1={station(25)} x2={100} y2={station(100)} color="c2" width={2.5} />
            <Segment x1={40} y1={suburb(40)} x2={40} y2={station(40)} color="ink" width={1.5} arrow />
            <Label x={41} y={(suburb(40) + station(40)) / 2} anchor="start">
              {`差 = ${d.b2}（D の係数）`}
            </Label>
          </>
        ) : (
          <Segment x1={25} y1={storeSimple.a + storeSimple.b * 25} x2={100} y2={storeSimple.a + storeSimple.b * 100} color="c5" width={2.5} dashed />
        )}
        <Points data={pts} r={6} opacity={0.85} />
      </Plot>
      <Legend
        items={[
          { color: 'c1', label: '郊外店（D = 0）' },
          { color: 'c2', label: '駅前店（D = 1）' },
          ...(withDummy ? [] : [{ color: 'c5' as const, label: `ダミーなし：売上 = ${storeSimple.a} + ${storeSimple.b} × 面積` }]),
        ]}
      />
      <p className="figure-readout">
        {withDummy ? (
          <>
            売上 = {d.b0} + {d.b1} × 面積 + {d.b2} × D　→　郊外店は D = 0、駅前店は D = 1 を代入（傾きは同じ {d.b1}）
          </>
        ) : (
          <>店の種類を無視すると、傾きは {storeSimple.b} と小さく、点の散らばりも説明できていない</>
        )}
      </p>
      <Controls>
        <Button variant={withDummy ? 'default' : 'primary'} onClick={() => setWithDummy(false)}>
          ダミー変数なし（1本）
        </Button>
        <Button variant={withDummy ? 'primary' : 'default'} onClick={() => setWithDummy(true)}>
          ダミー変数あり（2本）
        </Button>
      </Controls>
    </div>
  )
}
