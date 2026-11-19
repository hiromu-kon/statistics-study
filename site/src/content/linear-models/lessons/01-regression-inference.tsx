import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Mark, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { FitScatter } from '../figures/FitScatter'
import { RegressionModelPlot } from '../figures/RegressionModelPlot'
import { ResamplePlot } from '../figures/ResamplePlot'
import { SlopeTTestPlot } from '../figures/SlopeTTestPlot'

export const meta: LessonMeta = {
  id: 'linear-models-regression-inference',
  chapter: 'linear-models',
  order: 1,
  title: '回帰係数の推定と検定',
  summary: '手元のデータで引いた回帰直線の傾きが「たまたま」なのかどうかを、t 検定で確かめます。',
  minutes: 35,
  keywords: ['回帰モデル', '誤差項', '回帰係数の標準誤差', 't値', 'p値', '回帰係数の検定', '予測'],
}

// 架空の10店舗（広告費[万円]と売上[万円]）。推定値・標準誤差は numpy で計算した値。
const AD = [1, 2, 3, 3, 4, 5, 6, 6, 7, 8]
const SALES = [23, 31, 34, 27, 31, 33, 40, 38, 44, 37]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          回帰直線の傾きは、<strong>たまたま手に入ったデータから計算した値</strong>なので、データを取り直すと揺れます。
          その揺れの大きさが<strong>標準誤差</strong>。「傾き ÷ 標準誤差」で <strong>t 値</strong>を作り、
          「本当の傾きは 0（x は y と関係ない）」と言えるかどうかを t 分布で判定します。
        </p>
      </Point>

      <Section title="復習：最小二乗法の回帰直線">
        <p>
          散布図にいちばんよく当てはまる直線を引く方法が<strong>最小二乗法</strong>でした（くわしくは
          <Link to="/lessons/bivariate-simple-regression">「最小二乗法と回帰直線」</Link>、当てはまりの良さは
          <Link to="/lessons/bivariate-r-squared-residual">「決定係数と残差」</Link>）。ここでは、ある会社の10店舗について、
          1か月の広告費 x（万円）と売上 y（万円）を調べた架空のデータを使います。
        </p>
        <DataTable
          head={['店舗', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          rows={[
            ['広告費 x', ...AD.map(String)],
            ['売上 y', ...SALES.map(String)],
          ]}
          caption="10店舗の広告費と売上（架空）"
        />
        <Figure caption="10店舗のデータと最小二乗法の直線">
          <FitScatter xs={AD} ys={SALES} x={[0, 9]} y={[15, 50]} xLabel="広告費 x（万円）" yLabel="売上 y（万円）" />
        </Figure>
        <p>
          直線は <M>{'\\hat{y} = 23.35 + 2.32x'}</M>。「広告費を1万円増やすと、売上は平均して約2.32万円増える」と読めます。
          でも、これは<strong>たった10店舗</strong>から出した数字です。別の10店舗なら 1.5 だったかもしれないし、3.0 だったかもしれません。
          この章では、この「揺れ」を考えに入れて判断する方法を学びます。
        </p>
      </Section>

      <Section title="回帰モデル：データの裏にある「本当の直線」">
        <p>
          統計では、データは次のようなしくみで生まれていると考えます。これを<strong>回帰モデル</strong>といいます。
        </p>
        <MathBlock caption="y は「本当の直線の値」と「誤差」の足し算でできている">{'y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i'}</MathBlock>
        <ul>
          <li>
            <M>{'\\beta_0'}</M>（ベータ・ゼロ）と <M>{'\\beta_1'}</M>（ベータ・ワン）は、母集団の本当の切片と傾き。<strong>誰にもわからない値</strong>です。
          </li>
          <li>
            <M>{'\\varepsilon_i'}</M>（イプシロン）は<strong>誤差項</strong>。広告費以外のいろいろな理由（天気、立地、たまたま）による上下のずれです。
          </li>
        </ul>
        <p>2級でよく使う前提は次の4つです。</p>
        <Steps>
          <li>誤差の平均は 0（直線の上にも下にも同じようにずれる）</li>
          <li>誤差の散らばり（分散 <M>{'\\sigma^2'}</M>）は、x の値によらず同じ</li>
          <li>誤差どうしは互いに独立（ある店のずれが、別の店のずれに影響しない）</li>
          <li>誤差は正規分布にしたがう</li>
        </Steps>
        <MathBlock caption="誤差項は平均0・分散 σ² の正規分布にしたがい、互いに独立">{'\\varepsilon_i \\sim N(0, \\sigma^2)'}</MathBlock>
        <Figure caption="本当の直線（青）のまわりに、どの x でも同じ形の正規分布の誤差（オレンジの山）がある。σ を大きくすると点がばらつく">
          <RegressionModelPlot />
        </Figure>
        <p>
          手元のデータから最小二乗法で計算した切片と傾きは、本当の値の<strong>推定値</strong>です。区別するために帽子をかぶせて{' '}
          <M>{'\\hat\\beta_0, \\hat\\beta_1'}</M>（ベータ・ハット）と書きます。広告費の例では <M>{'\\hat\\beta_1 = 2.32'}</M> です。
        </p>
      </Section>

      <Section title="推定した傾きは、標本によって揺れる">
        <p>
          下の図は、本当の直線が <M>{'y = 2 + 0.5x'}</M> だとわかっている「作りもの」の世界です。ボタンを押すたびに、同じ母集団から新しく標本をとり、
          直線を引き直します。
        </p>
        <Figure caption="「標本を取り直す」を何度か押してみよう。n を大きくすると、推定した傾きの揺れが小さくなる">
          <ResamplePlot />
        </Figure>
        <p>
          傾きの推定値 <M>{'\\hat\\beta_1'}</M> は、標本ごとに本当の値 0.5 のまわりで散らばります。この散らばり（標準偏差）を、データ1組から見積もったものが
          <strong>回帰係数の標準誤差</strong>（SE、Standard Error）です。
        </p>
        <MathBlock caption="傾きの標準誤差：s は残差の散らばり、分母は x の散らばり">{'\\mathrm{SE}(\\hat\\beta_1) = \\frac{s}{\\sqrt{\\sum_{i=1}^{n}(x_i - \\bar{x})^2}}, \\qquad s = \\sqrt{\\frac{\\sum_{i=1}^{n} e_i^2}{n-2}}'}</MathBlock>
        <p>
          <M>{'e_i = y_i - \\hat{y}_i'}</M> は<strong>残差</strong>（実際の値 − 直線の値）、<M>s</M> は<strong>残差の標準誤差</strong>で、誤差の標準偏差 <M>{'\\sigma'}</M>{' '}
          の推定値です。式から次のことが読み取れます。
        </p>
        <ul>
          <li>点が直線のまわりにばらつく（<M>s</M> が大きい）ほど、標準誤差は大きい</li>
          <li>
            x が広い範囲に散らばっている（分母が大きい）ほど、標準誤差は小さい。データ数 <M>n</M> が増えても分母が大きくなる
          </li>
        </ul>
        <MathNote title="なぜ n − 2 で割るの？">
          <p>
            残差を計算するために、データから切片と傾きの<strong>2つ</strong>を推定して使いました。その分だけ残差は直線に「合わせ込まれて」小さめになるので、
            n ではなく <M>n − 2</M> で割って補正します。この <M>n − 2</M> を<strong>残差の自由度</strong>といいます（標本分散を n − 1 で割るのと同じ考え方で、
            あちらは平均1つを推定したぶん1を引いていました）。
          </p>
        </MathNote>
      </Section>

      <Section title="傾きの検定：x は本当に y と関係があるか">
        <p>
          知りたいのは「本当の傾き <M>{'\\beta_1'}</M> は 0 ではないか」です。<M>{'\\beta_1 = 0'}</M> なら、x がいくつでも y の平均は同じ、
          つまり<strong>x は y の予測に役立たない</strong>ことになります。
        </p>
        <MathBlock caption="帰無仮説（傾きは0）と対立仮説（傾きは0ではない）">{'H_0: \\beta_1 = 0 \\qquad H_1: \\beta_1 \\ne 0'}</MathBlock>
        <p>
          推定値が標準誤差の何個分 0 から離れているかを計算します。これが <strong>t 値</strong>です。<M>{'H_0'}</M> が正しいとき、t 値は
          <strong>自由度 n − 2 の t 分布</strong>にしたがいます。
        </p>
        <MathBlock caption="t 値 = 推定値 ÷ 標準誤差（H0 のもとで自由度 n − 2 の t 分布）">{'t = \\frac{\\hat\\beta_1 - 0}{\\mathrm{SE}(\\hat\\beta_1)}'}</MathBlock>
        <Example title="広告費の例で検定する">
          <p>統計ソフトで計算すると、次の表が出てきます（表の読み方は4つ目のレッスンでくわしく扱います）。</p>
          <DataTable
            head={['', <Mark key="e" color="c1">推定値</Mark>, <Mark key="s" color="c2">標準誤差</Mark>, <Mark key="t" color="c3">t 値</Mark>, <Mark key="p" color="c4">p 値</Mark>]}
            rows={[
              ['切片', '23.348', '2.571', '9.081', '0.00002'],
              ['広告費', <Mark key="e2" color="c1">2.323</Mark>, <Mark key="s2" color="c2">0.515</Mark>, <Mark key="t2" color="c3">4.508</Mark>, <Mark key="p2" color="c4">0.0020</Mark>],
            ]}
            highlight={[1]}
          />
          <Steps>
            <li>
              t 値：<M>{'2.323 \\div 0.515 \\approx 4.51'}</M>
            </li>
            <li>
              自由度：<M>{'n - 2 = 10 - 2 = 8'}</M>
            </li>
            <li>
              t 分布表で <M>{'t_{0.025}(8) = 2.306'}</M>（両側 5% なので片側 2.5% の点）
            </li>
            <li>
              <M>{'|t| = 4.51 > 2.306'}</M> なので <M>{'H_0'}</M> を棄却。「広告費と売上には関係がある（傾きは 0 ではない）」といえます。p 値 0.0020 &lt; 0.05 とも一致します。
            </li>
          </Steps>
        </Example>
        <Figure caption="推定した傾きを動かしてみよう（標準誤差 0.515、自由度 8 のまま）。|t| が 2.306 を超えると赤い棄却域に入る">
          <SlopeTTestPlot se={0.515} df={8} initial={2.32} />
        </Figure>
        <p>
          切片についても同じように <M>{'H_0: \\beta_0 = 0'}</M> の t 値と p 値が出力されますが、「広告費0円のときの売上が0かどうか」は
          たいてい興味がないので、ふつうは傾きの行を見ます。
        </p>
      </Section>

      <Section title="傾きの信頼区間">
        <p>
          「本当の傾きはだいたいこの範囲」と幅で答えるのが信頼区間です。母平均の区間推定と同じ形で、使う t 分布の自由度が n − 2 になるだけです。
        </p>
        <MathBlock caption="傾き β1 の 95% 信頼区間">{'\\hat\\beta_1 - t_{0.025}(n-2)\\,\\mathrm{SE}(\\hat\\beta_1) \\le \\beta_1 \\le \\hat\\beta_1 + t_{0.025}(n-2)\\,\\mathrm{SE}(\\hat\\beta_1)'}</MathBlock>
        <Example title="広告費の例">
          <p>
            <M>{'2.323 \\pm 2.306 \\times 0.515 = 2.323 \\pm 1.188'}</M> なので、およそ <strong>1.13 〜 3.51</strong>。
            区間に 0 が入っていないことと、「5% で <M>{'H_0: \\beta_1 = 0'}</M> が棄却される」ことは同じ意味です。
          </p>
        </Example>
      </Section>

      <Section title="予測：x を代入して y を見積もる">
        <p>
          推定した直線に x を代入した <M>{'\\hat{y}'}</M> が<strong>予測値</strong>です。広告費 5 万円の店なら{' '}
          <M>{'\\hat{y} = 23.348 + 2.323 \\times 5 \\approx 35.0'}</M> 万円。
        </p>
        <Intuition title="予測は、データのある範囲の中で">
          <p>
            このデータの広告費は 1〜8 万円です。広告費 50 万円を代入すると約 140 万円になりますが、そんなに広告費を使った店は1つもないので、
            直線がそこまで続く保証はありません。データの範囲の外へ伸ばす予測（<strong>外挿</strong>）は慎重に。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'\\beta_1'}</M> と <M>{'\\hat\\beta_1'}</M> の混同 → 検定の仮説に書くのは本当の値 <M>{'\\beta_1'}</M>。計算に使うのは推定値 <M>{'\\hat\\beta_1'}</M>。
            </li>
            <li>
              自由度を n − 1 にしてしまう → 単回帰では切片と傾きの2つを推定するので <strong>n − 2</strong>。
            </li>
            <li>
              「有意 ＝ 効果が大きい」→ 有意は「0 ではなさそう」という意味だけ。データが多ければ、ごく小さな傾きでも有意になります。大きさは推定値と信頼区間で見ます。
            </li>
            <li>
              「有意 ＝ 原因と結果の関係がある」→ 回帰は関係の強さを測るだけ。広告費の多い店はもともと立地が良い、といった別の理由（交絡）かもしれません。
            </li>
            <li>t 値の分母を「残差の標準誤差 s」にしてしまう → 分母は<strong>その係数の標準誤差</strong>（出力の Std. Error の列）。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>回帰の出力表の推定値と標準誤差から t 値を計算し、t 分布表の値と比べて有意かどうかを判断する問題。</li>
            <li>t 値や標準誤差の欄が空欄になっていて、ほかの数値から埋める問題（t = 推定値 ÷ 標準誤差）。</li>
            <li>
              傾きの 95% 信頼区間を求める問題。自由度 n − 2 の t 分布の値を使う（分布表は
              <Link to="/tables">分布表のページ</Link>）。
            </li>
            <li>回帰式に値を代入して予測値を求める問題と、外挿の危うさを問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
