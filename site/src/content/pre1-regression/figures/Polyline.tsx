import { colorVar, usePlot, type Color } from '../../../components/charts/Plot'

/** データ座標の点列を折れ線で結ぶ（Curve は関数しか描けないため、計算済みの点列や階段グラフに使う） */
export function Polyline({ points, color = 'c1', width = 2.5, dashed }: { points: { x: number; y: number }[]; color?: Color; width?: number; dashed?: boolean }) {
  const s = usePlot()
  return (
    <polyline
      points={points.map((p) => `${s.x(p.x).toFixed(2)},${s.y(p.y).toFixed(2)}`).join(' ')}
      fill="none"
      stroke={colorVar(color)}
      strokeWidth={width}
      strokeDasharray={dashed ? '6 5' : undefined}
      strokeLinejoin="round"
    />
  )
}
