import { useState, type CSSProperties, type ReactNode } from 'react'
import { Button, Controls, DataTable, Mark, Note } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'

// 出力の数値はすべて cafeData.ts のデータを numpy / scipy で計算した値。

const preStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: '0.82rem',
  lineHeight: 1.55,
  background: 'var(--surface-2)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '12px 14px',
  overflowX: 'auto',
  margin: '14px 0',
  whiteSpace: 'pre',
}

const C = ({ c, children }: { c: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'; children: ReactNode }) => (
  <span style={{ color: `var(--${c})`, fontWeight: 700 }}>{children}</span>
)

/** R の summary(lm(...)) 風の出力。列ごとに色を付けて、本文の説明と対応させる */
export function CafeRSummary() {
  return (
    <pre style={preStyle} aria-label="R の回帰出力の例">
      {'Call:\nlm(formula = cups ~ temp)\n\nResiduals:\n    Min      1Q  Median      3Q     Max \n-14.729  -5.079  -1.673   9.016  13.063 \n\nCoefficients:\n            '}
      <C c="c1">Estimate</C> <C c="c2">Std. Error</C> <C c="c3">t value</C> <C c="c4">Pr(&gt;|t|)</C>
      {'    \n(Intercept) '}
      <C c="c1">{'-50.9329'}</C>
      {'    '}
      <C c="c2">16.5981</C>
      {'  '}
      <C c="c3">-3.069</C>
      {'   '}
      <C c="c4">0.0119</C>
      {' *  \ntemp          '}
      <C c="c1">4.7359</C>
      {'     '}
      <C c="c2">0.6415</C>
      {'   '}
      <C c="c3">7.383</C>
      {' '}
      <C c="c4">2.36e-05</C>
      {" ***\n---\nSignif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1\n\n"}
      <C c="c5">Residual standard error: 9.75</C>
      {' on 10 degrees of freedom\n'}
      <C c="c3">Multiple R-squared:  0.845</C>
      {',\t'}
      <C c="c4">Adjusted R-squared:  0.8295</C>
      {' \n'}
      <C c="c2">F-statistic: 54.51 on 1 and 10 DF</C>
      {',  p-value: 2.362e-05'}
    </pre>
  )
}

/** Excel の「回帰分析」ツール風の出力（同じデータ） */
export function CafeExcelOutput() {
  return (
    <>
      <DataTable
        caption="回帰統計"
        head={['項目', '値']}
        rows={[
          ['重相関 R', '0.919'],
          ['重決定 R2', <Mark key="r2" color="c3">0.845</Mark>],
          ['補正 R2', <Mark key="adj" color="c4">0.829</Mark>],
          ['標準誤差', '9.750'],
          ['観測数', '12'],
        ]}
      />
      <DataTable
        caption="分散分析表"
        head={['', '自由度', '変動', '分散', '観測された分散比', '有意 F']}
        rows={[
          ['回帰', '1', <Mark key="ssr" color="c1">5181.108</Mark>, '5181.108', <Mark key="f" color="c2">54.506</Mark>, '2.36E-05'],
          ['残差', '10', <Mark key="sse" color="c1">950.558</Mark>, '95.056', '', ''],
          ['合計', '11', <Mark key="sst" color="c1">6131.667</Mark>, '', '', ''],
        ]}
      />
      <DataTable
        caption="係数"
        head={['', '係数', '標準誤差', 't', 'P-値', '下限 95%', '上限 95%']}
        rows={[
          ['切片', '−50.933', '16.598', '−3.069', '0.0119', '−87.916', '−13.950'],
          ['気温', '4.736', '0.641', '7.383', '2.36E-05', '3.307', '6.165'],
        ]}
        highlight={[1]}
      />
    </>
  )
}

type Cell = 'est' | 'se' | 't' | 'p' | 'r2' | 'adj' | 'f' | 's'

const PUZZLE: Record<Cell, { label: string; how: ReactNode }> = {
  t: {
    label: 't value',
    how: (
      <>
        <p>t 値は「推定値が標準誤差の何個分か」です。</p>
        <MathBlock caption="t 値 = 推定値 ÷ 標準誤差">{'t = \\frac{\\hat\\beta_1}{\\mathrm{SE}(\\hat\\beta_1)} = \\frac{4.7359}{0.6415} \\approx 7.383'}</MathBlock>
      </>
    ),
  },
  se: {
    label: 'Std. Error',
    how: (
      <>
        <p>t 値の式を逆に使います。</p>
        <MathBlock caption="標準誤差 = 推定値 ÷ t 値">{'\\mathrm{SE} = \\frac{\\hat\\beta_1}{t} = \\frac{4.7359}{7.383} \\approx 0.6415'}</MathBlock>
      </>
    ),
  },
  est: {
    label: 'Estimate',
    how: (
      <>
        <p>こちらも t 値の式から戻せます。</p>
        <MathBlock caption="推定値 = t 値 × 標準誤差">{'\\hat\\beta_1 = t \\times \\mathrm{SE} = 7.383 \\times 0.6415 \\approx 4.736'}</MathBlock>
      </>
    ),
  },
  p: {
    label: 'Pr(>|t|)',
    how: (
      <>
        <p>
          p 値そのものは電卓では出せませんが、t 分布表で「どの水準で有意か」はわかります。自由度は残差の自由度 10。
          <M>{'t_{0.005}(10) = 3.169'}</M> より <M>{'|t| = 7.383'}</M> のほうが大きいので、両側 p 値は <M>{'0.01'}</M> より小さい、とわかります。
        </p>
      </>
    ),
  },
  r2: {
    label: 'Multiple R-squared',
    how: (
      <>
        <p>分散分析表の変動（平方和）を使います。単回帰なら F 値からも戻せます。</p>
        <MathBlock caption="決定係数 = 1 − 残差の変動 ÷ 全体の変動">{'R^2 = 1 - \\frac{950.558}{6131.667} \\approx 0.845'}</MathBlock>
        <MathBlock caption="F 値と残差の自由度から戻す方法（説明変数1個のとき）">{'R^2 = \\frac{F}{F + (n-2)} = \\frac{54.51}{54.51 + 10} \\approx 0.845'}</MathBlock>
      </>
    ),
  },
  adj: {
    label: 'Adjusted R-squared',
    how: (
      <>
        <p>R²、データ数 n = 12、説明変数の数 p = 1 から計算します。</p>
        <MathBlock caption="自由度調整済み決定係数">{'1 - (1 - R^2)\\frac{n-1}{n-p-1} = 1 - (1 - 0.845)\\times\\frac{11}{10} \\approx 0.8295'}</MathBlock>
      </>
    ),
  },
  f: {
    label: 'F-statistic',
    how: (
      <>
        <p>説明変数が1個（単回帰）なら、F 値は傾きの t 値の2乗です。R² からも計算できます。</p>
        <MathBlock caption="単回帰では F = t²">{'F = t^2 = 7.383^2 \\approx 54.51'}</MathBlock>
        <MathBlock caption="R² から求める方法（p は説明変数の数）">{'F = \\frac{R^2 / p}{(1-R^2)/(n-p-1)} = \\frac{0.845/1}{0.155/10} \\approx 54.5'}</MathBlock>
      </>
    ),
  },
  s: {
    label: 'Residual standard error',
    how: (
      <>
        <p>残差の変動を残差の自由度 n − p − 1 = 10 で割ってルートをとります（分散分析表の「残差の分散」のルート）。</p>
        <MathBlock caption="残差の標準誤差">{'s = \\sqrt{\\frac{950.558}{10}} \\approx 9.750'}</MathBlock>
      </>
    ),
  },
}

const ORDER: Cell[] = ['est', 'se', 't', 'p', 's', 'r2', 'adj', 'f']

/**
 * 回帰出力のどこか1か所を「？」にして、ほかの数値から埋め戻す練習をする部品。
 * 試験では出力の一部が空欄になっていることが多いので、数値どうしの関係を確かめられるようにしている。
 */
export function OutputPuzzle() {
  const [hidden, setHidden] = useState<Cell>('t')
  const q = (cell: Cell, value: string, color: 'c1' | 'c2' | 'c3' | 'c4' = 'c1') =>
    hidden === cell ? (
      <Mark key={cell} color="c4">
        ？
      </Mark>
    ) : (
      <Mark key={cell} color={color}>
        {value}
      </Mark>
    )
  return (
    <div>
      <Controls>
        {ORDER.map((c) => (
          <Button key={c} variant={hidden === c ? 'primary' : 'default'} onClick={() => setHidden(c)}>
            {PUZZLE[c].label}
          </Button>
        ))}
      </Controls>
      <DataTable
        caption="気温 → 販売数の回帰（n = 12）"
        head={['', 'Estimate', 'Std. Error', 't value', 'Pr(>|t|)']}
        rows={[
          ['(Intercept)', '−50.9329', '16.5981', '−3.069', '0.0119'],
          ['temp', q('est', '4.7359'), q('se', '0.6415'), q('t', '7.383'), q('p', '2.36e-05')],
        ]}
      />
      <DataTable
        head={['Residual standard error', 'Multiple R-squared', 'Adjusted R-squared', 'F-statistic']}
        rows={[[q('s', '9.750（自由度 10）'), q('r2', '0.845'), q('adj', '0.8295'), q('f', '54.51（自由度 1, 10）')]]}
      />
      <p className="small muted">分散分析表より：残差の変動 950.558、全体の変動 6131.667</p>
      <Note title={`「${PUZZLE[hidden].label}」を埋めるには`}>{PUZZLE[hidden].how}</Note>
    </div>
  )
}
