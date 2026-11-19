import { DataTable, Example, ExamTip, Figure, Intuition, Mark, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { FitScatter } from '../figures/FitScatter'
import { cafe } from '../figures/cafeData'
import { CafeExcelOutput, CafeRSummary, OutputPuzzle } from '../figures/OutputTables'

export const meta: LessonMeta = {
  id: 'linear-models-software-output',
  chapter: 'linear-models',
  order: 4,
  title: '統計ソフトの出力を読む',
  summary: 'R や Excel の回帰分析・分散分析の出力表から、係数の意味・有意性・決定係数・予測値を読み取ります。',
  minutes: 35,
  keywords: ['回帰の出力', '分散分析表', '残差の標準誤差', 'F統計量', '計算出力の活用'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          回帰の出力表は、たくさんの数字が並んでいても、見る場所は決まっています。<strong>係数の行</strong>（推定値・標準誤差・t 値・p 値）と、
          <strong>下の要約</strong>（残差の標準誤差・決定係数・F 統計量）です。数字どうしには
          「<strong>t = 推定値 ÷ 標準誤差</strong>」「<strong>R² = 1 − 残差の変動 ÷ 全体の変動</strong>」などの関係があるので、空欄があっても埋められます。
        </p>
      </Point>

      <Section title="例のデータ">
        <p>あるカフェの12日間の最高気温 x（℃）と、アイスコーヒーの販売数 y（杯）です（架空のデータ）。</p>
        <DataTable
          head={['日', ...cafe.temp.map((_, i) => String(i + 1))]}
          rows={[
            ['気温 x', ...cafe.temp.map(String)],
            ['販売数 y', ...cafe.cups.map(String)],
          ]}
        />
        <Figure caption="気温を動かして予測値を読もう。緑の点線は「直線 ± 残差の標準誤差 s」で、点の多くはこの帯の付近にある">
          <FitScatter
            xs={cafe.temp}
            ys={cafe.cups}
            x={[16, 35]}
            y={[20, 130]}
            xLabel="最高気温 x（℃）"
            yLabel="販売数 y（杯）"
            band
            predict={{ min: 18, max: 33, initial: 28 }}
            unitY=" 杯"
          />
        </Figure>
      </Section>

      <Section title="R の出力を読む">
        <p>
          統計ソフト R で <code>lm(cups ~ temp)</code>（販売数を気温で回帰）を実行し、<code>summary()</code> で表示すると次のような出力になります。
        </p>
        <CafeRSummary />
        <DataTable
          head={['出力の表記', '意味', 'この例の値']}
          rows={[
            [<Mark key="e" color="c1">Estimate</Mark>, '係数の推定値（切片と傾き）', '傾き 4.7359'],
            [<Mark key="s" color="c2">Std. Error</Mark>, '係数の標準誤差（推定値の揺れの大きさ）', '0.6415'],
            [<Mark key="t" color="c3">t value</Mark>, 't 値 ＝ Estimate ÷ Std. Error（H0: 係数 = 0）', '7.383'],
            [<Mark key="p" color="c4">Pr(&gt;|t|)</Mark>, '両側検定の p 値。右の * は有意水準の目安', '2.36e-05 ＝ 0.0000236'],
            ['Residual standard error', '残差の標準誤差 s と、残差の自由度 n − p − 1', '9.75（自由度 10）'],
            ['Multiple R-squared', '決定係数 R²', '0.845'],
            ['Adjusted R-squared', '自由度調整済み決定係数', '0.8295'],
            ['F-statistic', 'モデル全体の F 検定（H0: 傾きがすべて 0）の F 値と自由度 (p, n − p − 1)、その p 値', '54.51（自由度 1, 10）'],
          ]}
        />
        <Example title="出力から読み取れること">
          <Steps>
            <li>
              <strong>回帰式</strong>：<M>{'\\hat{y} = -50.93 + 4.736x'}</M>。気温が 1℃ 上がると、販売数は平均して約 4.7 杯増える。
            </li>
            <li>
              <strong>有意性</strong>：気温の p 値は 0.0000236 で 0.01 より小さく、1% でも有意。「気温と販売数に関係はない」は棄却される。
            </li>
            <li>
              <strong>当てはまり</strong>：<M>{'R^2 = 0.845'}</M>。販売数のばらつきの約 85% を気温で説明できている。
            </li>
            <li>
              <strong>予測</strong>：28℃ の日は <M>{'-50.933 + 4.736 \\times 28 \\approx 81.7'}</M> 杯。
            </li>
            <li>
              <strong>予測のずれの目安</strong>：残差の標準誤差 <M>{'s = 9.75'}</M>。実際の販売数は直線から ±10 杯くらいずれるのがふつう。
            </li>
          </Steps>
        </Example>
        <Intuition title="e-05 って何？">
          <p>
            <code>2.36e-05</code> は <M>{'2.36 \\times 10^{-5} = 0.0000236'}</M> のこと。e のあとの数だけ小数点を左にずらします。
            p 値がとても小さいときにこう表示されます。
          </p>
        </Intuition>
      </Section>

      <Section title="Excel の出力を読む">
        <p>
          Excel の「分析ツール」の回帰分析では、同じ内容が日本語の表で出てきます。呼び方が違うだけで、数値は R と同じです。
        </p>
        <CafeExcelOutput />
        <DataTable
          head={['Excel', 'R', '意味']}
          rows={[
            ['重決定 R2', 'Multiple R-squared', '決定係数'],
            ['補正 R2', 'Adjusted R-squared', '自由度調整済み決定係数'],
            ['標準誤差（回帰統計の表）', 'Residual standard error', '残差の標準誤差 s（係数の標準誤差とは別物）'],
            ['観測された分散比', 'F-statistic', 'F 値'],
            ['有意 F', 'F-statistic の p-value', 'F 検定の p 値'],
            ['重相関 R', '（出力されない）', 'R² のルート。単回帰では相関係数の絶対値'],
          ]}
        />
        <p>
          Excel の分散分析表を見ると、<Mark color="c1">変動</Mark>の列が「回帰 ＋ 残差 ＝ 合計」（5181.108 ＋ 950.558 ＝ 6131.667）になっていて、
          ここから <Mark color="c3">R²</Mark> や <Mark color="c2">F</Mark> が計算されています。
        </p>
      </Section>

      <Section title="数値どうしの関係">
        <p>出力の数値は、次の関係でつながっています（n はデータ数、p は説明変数の数）。</p>
        <MathBlock caption="① t 値は推定値を標準誤差で割ったもの">{'t = \\frac{\\text{Estimate}}{\\text{Std. Error}}'}</MathBlock>
        <MathBlock caption="② 決定係数は、全体の変動のうち回帰で説明できた割合">{'R^2 = \\frac{S_R}{S_T} = 1 - \\frac{S_E}{S_T}, \\qquad S_T = S_R + S_E'}</MathBlock>
        <MathBlock caption="③ 残差の標準誤差は、残差の平均平方のルート">{'s = \\sqrt{\\frac{S_E}{n - p - 1}}'}</MathBlock>
        <MathBlock caption="④ F 値は、回帰の平均平方 ÷ 残差の平均平方。R² からも計算できる">{'F = \\frac{S_R / p}{S_E / (n - p - 1)} = \\frac{R^2 / p}{(1 - R^2)/(n - p - 1)}'}</MathBlock>
        <MathBlock caption="⑤ 単回帰（p = 1）では、F 値は傾きの t 値の2乗">{'F = t^2 \\qquad (7.383^2 \\approx 54.51)'}</MathBlock>
        <p>
          <M>{'S_R'}</M> は回帰の変動（回帰で説明できた平方和）、<M>{'S_E'}</M> は残差の変動、<M>{'S_T'}</M> は全体の変動です。調整済み R² は前のレッスンの式{' '}
          <M>{'1 - (1-R^2)(n-1)/(n-p-1)'}</M> です。
        </p>
        <Figure caption="ボタンで「？」にする場所を選ぼう。ほかの数値から、どうやって埋められるかが表示される">
          <OutputPuzzle />
        </Figure>
      </Section>

      <Section title="分散分析の出力">
        <p>
          前のレッスンの肥料の実験を R で分散分析すると（<code>anova(lm(height ~ fertilizer))</code>）、次の表が出ます。
          列の並びが「自由度 → 平方和」の順になっている点に注意しましょう。
        </p>
        <DataTable
          head={['', 'Df', 'Sum Sq', 'Mean Sq', 'F value', 'Pr(>F)']}
          rows={[
            ['fertilizer（群間）', <Mark key="d" color="c1">2</Mark>, '90', '45', <Mark key="f" color="c4">4.5</Mark>, <Mark key="p" color="c4">0.03482 *</Mark>],
            ['Residuals（群内）', <Mark key="d2" color="c1">12</Mark>, '120', '10', '', ''],
          ]}
          caption="R の分散分析表（Df ＝ 自由度、Sum Sq ＝ 平方和、Mean Sq ＝ 平均平方）"
        />
        <p>
          全体の行は出力されませんが、足し算（自由度 14、平方和 210）で求められます。Pr(&gt;F) が 0.03482 &lt; 0.05 なので、5% で「肥料による平均の差はない」を棄却します。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「残差の標準誤差」と「係数の標準誤差」を混同する → 前者は点が直線からどれくらいずれるか（9.75 杯）、後者は推定した係数がどれくらい揺れるか（0.6415）。
            </li>
            <li>p 値が「2.36e-05」なので大きい数だと思う → 0.0000236 というとても小さい値です。</li>
            <li>
              t 値を判定するときの自由度を n − 1 にする → 出力の「on 10 degrees of freedom」（n − p − 1）がそのまま使える自由度です。
            </li>
            <li>
              重回帰で F 検定が有意なら、どの係数も有意 → F 検定は「少なくとも1つの係数が 0 でない」を調べるだけ。個々の係数は t 検定で見ます。
            </li>
            <li>
              <M>{'F = t^2'}</M> を重回帰でも使う → 成り立つのは説明変数が1つの単回帰のときだけです。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>回帰の出力の一部（t 値、標準誤差、R²、F 値など）が空欄になっていて、ほかの数値から計算する問題。</li>
            <li>出力を見て、係数の解釈・有意水準 5% や 1% で有意かどうか・予測値を答える問題。</li>
            <li>説明変数の組合せが違う複数のモデルの出力を比べ、調整済み R² などでどのモデルが良いかを選ぶ問題。</li>
            <li>分散分析表の空欄を埋めて、F 検定の結論を選ぶ問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
