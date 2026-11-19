import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Mark, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { FitScatter } from '../figures/FitScatter'
import { cafe } from '../figures/cafeData'
import { CafeExcelOutput, CafeRSummary, OutputPuzzle, RentExcelOutput } from '../figures/OutputTables'

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
          受験記や解説記事では、2級の回帰の問題は <strong>Excel 形式の出力</strong>を見て答える形が多いと言われているので、こちらの読み方に特に慣れておきましょう。
          出力は「回帰統計」「分散分析表」「係数」の3つの表に分かれています。
        </p>
        <CafeExcelOutput />
        <DataTable
          head={['Excel', 'R', '意味']}
          rows={[
            ['重相関 R', '（出力されない）', 'R² のルート。単回帰では相関係数の絶対値'],
            ['重決定 R2', 'Multiple R-squared', '決定係数 R²'],
            ['補正 R2', 'Adjusted R-squared', '自由度調整済み決定係数'],
            ['標準誤差（回帰統計の表）', 'Residual standard error', '残差の標準誤差 s（係数の標準誤差とは別物）'],
            ['観測数', '（自由度から逆算）', 'データの数 n'],
            ['変動（分散分析表）', 'Sum Sq', '平方和（回帰・残差・合計）'],
            ['分散（分散分析表）', 'Mean Sq', '平均平方 ＝ 変動 ÷ 自由度'],
            ['観測された分散比', 'F-statistic', 'F 値'],
            ['有意 F', 'F-statistic の p-value', 'F 検定の p 値'],
            ['係数', 'Estimate', '係数の推定値'],
            ['標準誤差（係数の表）', 'Std. Error', '係数の標準誤差'],
            ['t', 't value', 't 値 ＝ 係数 ÷ 標準誤差'],
            ['P-値', 'Pr(>|t|)', '係数が 0 かどうかの両側検定の p 値'],
            ['下限 95%・上限 95%', '（confint() で出す）', '係数の 95% 信頼区間'],
          ]}
          caption="Excel と R の項目名の対応"
        />
        <Example title="Excel の出力を上から順に読む">
          <Steps>
            <li>
              <strong>観測数</strong> 12 ＝ n。分散分析表の自由度は、回帰 ＝ 説明変数の数 p ＝ 1、残差 ＝ <M>{'n - p - 1 = 10'}</M>、合計 ＝ <M>{'n - 1 = 11'}</M>。
            </li>
            <li>
              <strong>重決定 R2</strong> ＝ 回帰の変動 ÷ 合計の変動 ＝ <M>{'5181.108 \\div 6131.667 \\approx 0.845'}</M>。<strong>重相関 R</strong> ＝ <M>{'\\sqrt{0.845} \\approx 0.919'}</M>。
            </li>
            <li>
              分散分析表の<strong>分散</strong> ＝ 変動 ÷ 自由度。残差なら <M>{'950.558 \\div 10 \\approx 95.056'}</M>。そのルート <M>{'\\sqrt{95.056} \\approx 9.750'}</M> が回帰統計の<strong>標準誤差</strong>。
            </li>
            <li>
              <strong>観測された分散比</strong> ＝ 回帰の分散 ÷ 残差の分散 ＝ <M>{'5181.108 \\div 95.056 \\approx 54.51'}</M>。その p 値が<strong>有意 F</strong>（2.36E-05 ＝ 0.0000236）。
            </li>
            <li>
              係数の表の気温の行：<strong>t</strong> ＝ <M>{'4.736 \\div 0.641 \\approx 7.38'}</M>、<strong>P-値</strong> 2.36E-05 なので 1% でも有意。
              <strong>下限 95%</strong> ＝ <M>{'4.736 - t_{0.025}(10) \\times 0.641 = 4.736 - 2.228 \\times 0.641 \\approx 3.31'}</M>、上限も同様に約 6.17。
            </li>
          </Steps>
        </Example>
        <Note title="Excel の表示についての補足">
          <ul>
            <li>
              「E-05」は <M>{'\\times 10^{-5}'}</M> のこと（R の「e-05」と同じ）。
            </li>
            <li>
              実際の Excel の出力では、係数の表の右に同じ値の「下限 95.0%」「上限 95.0%」の列も並びます（信頼度を 95% 以外に指定したとき、その信頼度の区間が出る列）。
            </li>
            <li>Excel の表は小数点以下の桁が多く表示されます。ここでは読みやすいように丸めています。</li>
          </ul>
        </Note>
        <p>
          Excel の分散分析表を見ると、<Mark color="c1">変動</Mark>の列が「回帰 ＋ 残差 ＝ 合計」（5181.108 ＋ 950.558 ＝ 6131.667）になっていて、
          ここから <Mark color="c3">R²</Mark> や <Mark color="c2">F</Mark> が計算されています。
        </p>
      </Section>

      <Section title="重回帰の Excel 出力を読む">
        <p>
          <Link to="/lessons/linear-models-multiple-regression">重回帰分析</Link>の家賃の例（20件、家賃を広さと徒歩で説明）を Excel で回帰分析すると、次のようになります。
          表の形は単回帰と同じで、係数の表の行が説明変数の数だけ増えます。
        </p>
        <RentExcelOutput />
        <Steps>
          <li>
            説明変数は2つ（p = 2）なので、分散分析表の自由度は回帰 2、残差 <M>{'20 - 2 - 1 = 17'}</M>。係数の t 検定もこの 17 を使う。
          </li>
          <li>
            <strong>補正 R2</strong>：<M>{'1 - (1 - 0.861) \\times 19 \\div 17 \\approx 0.845'}</M>。重決定 R2 より小さい。
          </li>
          <li>
            <strong>有意 F</strong> 5.11E-08：「広さの係数も徒歩の係数も 0」という H0 は棄却される（少なくとも一方は役に立つ）。
          </li>
          <li>
            徒歩の行：P-値 0.0345 なので 5% で有意、1% では有意でない。下限 95% と上限 95% がどちらもマイナス（0 をまたがない）ことも、5% で有意と同じ意味。
          </li>
          <li>
            係数の読み方：「広さが同じなら、徒歩が1分長いと家賃は平均 0.165 万円安い」。重回帰の係数は「ほかの説明変数を固定したとき」の効果。
          </li>
        </Steps>
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
          列の並びが「自由度 → 平方和」の順になっている点に注意しましょう（Excel の「分散分析：一元配置」は「変動 → 自由度」の順。
          <Link to="/lessons/linear-models-anova">前のレッスン</Link>に Excel 形式の表があります）。
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
              Excel ではどちらも「標準誤差」という名前なので、<strong>回帰統計の表</strong>にあるか<strong>係数の表</strong>にあるかで区別します。
            </li>
            <li>p 値が「2.36e-05」なので大きい数だと思う → 0.0000236 というとても小さい値です。</li>
            <li>
              t 値を判定するときの自由度を n − 1 にする → 出力の「on 10 degrees of freedom」（n − p − 1）がそのまま使える自由度です。
            </li>
            <li>「重相関 R」を決定係数だと思う → 決定係数は「重決定 R2」。重相関 R はそのルートです。</li>
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
