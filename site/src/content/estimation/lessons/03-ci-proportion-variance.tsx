import { Link } from 'react-router-dom'
import { Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { FisherZ } from '../figures/FisherZ'
import { MarginOfError } from '../figures/MarginOfError'
import { VarianceCi } from '../figures/VarianceCi'

export const meta: LessonMeta = {
  id: 'estimation-ci-proportion-variance',
  chapter: 'estimation',
  order: 3,
  title: '母比率・母分散・相関係数の区間推定',
  summary: '割合（支持率など）、ばらつき（分散）、相関係数についても、信頼区間を作れます。分散と相関係数の区間は左右非対称になります。',
  minutes: 40,
  keywords: ['母比率の区間推定', '母分散の区間推定', 'カイ二乗分布', '相関係数の区間推定', 'フィッシャーのz変換'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <ul>
          <li>
            <strong>母比率</strong>：<M>{'\\hat{p} \\pm 1.96\\sqrt{\\hat{p}(1-\\hat{p})/n}'}</M>。母平均と同じ「推定値 ± 1.96 × 標準誤差」の形。
          </li>
          <li>
            <strong>母分散</strong>：カイ二乗分布を使い、<M>{'(n-1)s^2'}</M> を 2 つの点で割る。区間は s² に対して右に長い。
          </li>
          <li>
            <strong>相関係数</strong>：そのままでは扱いにくいので、<strong>フィッシャーの z 変換</strong>で正規分布に近い量にしてから区間を作り、もとに戻す。
          </li>
        </ul>
      </Point>

      <Section title="母比率の区間推定">
        <p>
          <Link to="/lessons/sampling-normal-approximation">前の章</Link>で、n が大きいとき標本比率 <M>{'\\hat{p}'}</M>（標本の中の割合、ピーハット）は
          およそ <M>{'N(p, p(1-p)/n)'}</M> に従うことを見ました。p は母比率（母集団全体での本当の割合）です。
          あとは母平均と同じで「推定値 ± 1.96 × 標準誤差」を作りますが、標準誤差 <M>{'\\sqrt{p(1-p)/n}'}</M> の中の p こそ知りたい数でわからないので、
          推定値 <M>{'\\hat{p}'}</M> で代用します。
        </p>
        <MathBlock caption="母比率 p の 95% 信頼区間（n が大きいとき）">{'\\hat{p} - 1.96\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}} \\le p \\le \\hat{p} + 1.96\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}'}</MathBlock>
        <Example title="世論調査の「誤差」">
          <p>1000 人に聞いたところ、420 人がある政策に賛成でした。</p>
          <Steps>
            <li>
              標本比率：<M>{'\\hat{p} = 420/1000 = 0.42'}</M>
            </li>
            <li>
              標準誤差：<M>{'\\sqrt{0.42 \\times 0.58/1000} = \\sqrt{0.0002436} \\approx 0.0156'}</M>
            </li>
            <li>
              幅の半分：<M>{'1.96 \\times 0.0156 \\approx 0.031'}</M>
            </li>
            <li>
              95% 信頼区間：<M>{'0.389 \\le p \\le 0.451'}</M>。「賛成は 42% ± 約 3 ポイント」
            </li>
          </Steps>
          <p className="muted">報道で「誤差は ±3 ポイント程度」と言われるのは、このような計算です。</p>
        </Example>
        <Figure caption="誤差（区間の幅の半分）は支持率が50%のときに最大になる。人数を増やすと全体が下がるが、4倍にしてやっと半分">
          <MarginOfError />
        </Figure>
        <Example title="必要な人数を見積もる">
          <p>
            誤差を ±5 ポイント（0.05）以下にしたい。支持率の見当がつかないときは、誤差が最大になる <M>{'p = 0.5'}</M> で計算しておけば安全です。
          </p>
          <Steps>
            <li>
              条件：<M>{'1.96\\sqrt{0.5 \\times 0.5/n} \\le 0.05'}</M>
            </li>
            <li>
              変形：<M>{'n \\ge (1.96/0.05)^2 \\times 0.25 = 39.2^2 \\times 0.25 = 384.16'}</M>
            </li>
            <li>切り上げて 385 人以上。</li>
          </Steps>
        </Example>
      </Section>

      <Section title="母分散の区間推定">
        <p>
          製品の品質など、「ばらつき」そのものを知りたいこともあります。正規母集団から大きさ n の標本をとると、
          <M>{'(n-1)s^2/\\sigma^2'}</M> は自由度 n − 1 のカイ二乗分布に従いました。その真ん中 95% をとると、次のようになります。
        </p>
        <MathBlock caption="カイ二乗分布の両側 2.5% 点ではさむ">{'\\chi^2_{0.975}(n-1) \\le \\frac{(n-1)s^2}{\\sigma^2} \\le \\chi^2_{0.025}(n-1)'}</MathBlock>
        <p className="muted">
          <M>{'\\chi^2_{0.975}(n-1)'}</M> は右側の面積が 0.975（＝左側が 0.025）の小さいほうの点、<M>{'\\chi^2_{0.025}(n-1)'}</M> は右側が 0.025 の大きいほうの点です。
          カイ二乗分布は左右対称でないので、2 つを別々に表で引きます。
        </p>
        <MathNote title="σ² について解く手順">
          <Steps>
            <li>
              3 か所の逆数をとる。逆数にすると大小が入れかわる（2 &lt; 4 でも 1/2 &gt; 1/4）ので、不等号の向きが逆になる：
              <M>{'\\frac{1}{\\chi^2_{0.025}} \\le \\frac{\\sigma^2}{(n-1)s^2} \\le \\frac{1}{\\chi^2_{0.975}}'}</M>（向きをそろえて書き直した）
            </li>
            <li>
              3 か所に <M>{'(n-1)s^2'}</M>（正の数）をかける：<M>{'\\frac{(n-1)s^2}{\\chi^2_{0.025}} \\le \\sigma^2 \\le \\frac{(n-1)s^2}{\\chi^2_{0.975}}'}</M>
            </li>
          </Steps>
          <p>結果として、<strong>大きいほうの点で割ったほうが下限</strong>になります。</p>
        </MathNote>
        <p>まとめると、</p>
        <MathBlock caption="母分散 σ² の 95% 信頼区間（母集団が正規分布のとき）">{'\\frac{(n-1)s^2}{\\chi^2_{0.025}(n-1)} \\le \\sigma^2 \\le \\frac{(n-1)s^2}{\\chi^2_{0.975}(n-1)}'}</MathBlock>
        <Example title="計算してみよう">
          <p>正規母集団から 15 個をとり、不偏分散が <M>{'s^2 = 4'}</M> でした。</p>
          <Steps>
            <li>
              自由度 14。表から <M>{'\\chi^2_{0.025}(14) = 26.119'}</M>、<M>{'\\chi^2_{0.975}(14) = 5.629'}</M>
            </li>
            <li>
              <M>{'(n-1)s^2 = 14 \\times 4 = 56'}</M>
            </li>
            <li>
              下限 <M>{'56/26.119 \\approx 2.14'}</M>、上限 <M>{'56/5.629 \\approx 9.95'}</M>
            </li>
          </Steps>
          <p>
            s² = 4 から下へは約 1.9、上へは約 5.9。<strong>左右対称ではありません</strong>。
          </p>
          <p>
            母<strong>標準偏差</strong> σ の区間がほしいときは、両はしのルートをとるだけです：<M>{'\\sqrt{2.14} \\approx 1.46 \\le \\sigma \\le \\sqrt{9.95} \\approx 3.15'}</M>。
          </p>
        </Example>
        <Figure caption="上：カイ二乗分布は左右非対称なので、両側2.5%点も中心から等距離ではない。下：それで割った区間は、s²に対して右に長くなる。nを増やすと短く、対称に近づく">
          <VarianceCi />
        </Figure>
      </Section>

      <Section title="相関係数の区間推定（フィッシャーの z 変換）">
        <p>
          相関係数 r は −1 から 1 の間にしかなく、真の相関 ρ（ロー）が 1 に近いと、r の分布は 1 の側がつまって左右非対称になります。
          そのまま「r ± 1.96 × 標準誤差」とすると、1 を超えるおかしな区間ができることもあります。
        </p>
        <p>
          そこで、r を次の式で <strong>z</strong> に変換します。z は、n がある程度大きいとき、およそ正規分布に従い、標準誤差は
          <M>{'1/\\sqrt{n-3}'}</M> になることが知られています。
        </p>
        <MathBlock caption="フィッシャーの z 変換（log は自然対数。数学の準備の「関数・グラフ・面積」）">{'z = \\frac{1}{2}\\log\\frac{1 + r}{1 - r}'}</MathBlock>
        <MathBlock caption="z の世界で区間を作る">{'z \\pm \\frac{1.96}{\\sqrt{n - 3}}'}</MathBlock>
        <p>できた z の区間の両はしを、逆の変換でもとの r の目盛りに戻せば、母相関係数 ρ の信頼区間になります。</p>
        <MathBlock caption="逆の変換（z から r に戻す。e は自然対数の底 2.718…）">{'r = \\frac{e^{2z} - 1}{e^{2z} + 1}'}</MathBlock>
        <Figure caption="r を z に変換する曲線。z の世界で左右対称な区間（青）を r に戻すと、1に近い側がつまった非対称な区間（オレンジ）になる">
          <FisherZ />
        </Figure>
        <Example title="計算の流れ">
          <p>53 組のデータで r = 0.5 でした。</p>
          <Steps>
            <li>
              変換：<M>{'z = \\frac{1}{2}\\log\\frac{1.5}{0.5} = \\frac{1}{2}\\log 3 \\approx 0.549'}</M>
            </li>
            <li>
              標準誤差：<M>{'1/\\sqrt{53 - 3} = 1/\\sqrt{50} \\approx 0.141'}</M>
            </li>
            <li>
              z の区間：<M>{'0.549 \\pm 1.96 \\times 0.141'}</M> より約 <M>{'[0.272,\\ 0.826]'}</M>
            </li>
            <li>
              r に戻す：約 <M>{'[0.266,\\ 0.679]'}</M>。0.5 から下へ 0.23、上へ 0.18 と非対称。
            </li>
          </Steps>
        </Example>
        <Intuition title="どこまで覚える？">
          <p>
            2級では「z 変換の式」「標準誤差 <M>{'1/\\sqrt{n-3}'}</M>」「z の世界で区間を作って戻す」という流れを知っていれば十分です。
            試験で使えるのは四則演算と √ ができる普通電卓だけ（<a href="https://www.toukei-kentei.jp/exam/grade2/" target="_blank" rel="noreferrer">公式ページ</a>）で log や e の計算はできないので、
            z の値や r に戻した値は問題文で与えられると考えられます（推測です。確認できた過去の出題にもとづくものではありません）。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              母分散の区間で、割る点を逆にする → <strong>大きい点</strong> <M>{'\\chi^2_{0.025}'}</M> で割ったほうが<strong>下限</strong>（分母が大きいと値は小さい）。
            </li>
            <li>
              母分散の区間を「s² ± 何か」と左右対称に作る → カイ二乗分布は対称ではないので、区間も非対称。
            </li>
            <li>母比率の必要な人数で、p の見当がないのに小さい p を使う → p = 0.5 が最も安全（誤差が最大になるので）。</li>
            <li>
              z 変換の標準誤差を <M>{'1/\\sqrt{n}'}</M> にする → 正しくは <M>{'1/\\sqrt{n - 3}'}</M>。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>アンケート結果から母比率の 95% 信頼区間を求める問題、誤差を ○ ポイント以下にする人数を求める問題。</li>
            <li>標本の不偏分散とカイ二乗分布の表から、母分散（や母標準偏差）の信頼区間を求める問題。</li>
            <li>フィッシャーの z 変換を使った相関係数の区間推定の手順を問う問題。「z の区間の幅は <M>{'1/\\sqrt{n-3}'}</M> で決まる」「戻した区間は r に対して非対称」が要点。</li>
            <li>
              区間の式を選ぶ問題では、母比率なら「<M>{'\\hat{p}'}</M> を使っているか・ルートがあるか・n で割っているか」、母分散なら「自由度 n − 1・割る点の向き」を確かめる。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
