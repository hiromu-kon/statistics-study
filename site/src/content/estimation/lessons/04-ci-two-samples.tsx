import { DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { FLowerPoint } from '../../sampling/figures/UpperPoint'
import { TwoGroupsCi } from '../figures/TwoGroupsCi'

export const meta: LessonMeta = {
  id: 'estimation-ci-two-samples',
  chapter: 'estimation',
  order: 4,
  title: '2つの母集団の区間推定',
  summary: '2つのグループの平均の差、分散の比、比率の差についての信頼区間です。差の区間が 0 をまたぐかどうかがポイントになります。',
  minutes: 40,
  keywords: ['母平均の差の区間推定', 'プールした分散', '母分散の比の区間推定', '母比率の差の区間推定'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          2 つのグループをくらべるときは、「差」（平均・比率）や「比」（分散）について区間を作ります。形はいつもの
          <strong>「推定値 ± 係数 × 標準誤差」</strong>で、差の標準誤差は<strong>それぞれの分散を足して</strong>ルートをとります。
          平均の差の区間が <strong>0 を含まなければ</strong>、2 つのグループに差があると考えられます。
        </p>
      </Point>

      <Section title="2つのグループをくらべる">
        <p>
          新しい教え方（A）と従来の教え方（B）でテストの点をくらべます。標本の平均がちがっても、それが本当の差なのか、たまたまのぶれなのかはわかりません。
          そこで母平均の差 <M>{'\\mu_A - \\mu_B'}</M> の信頼区間を作ります。
        </p>
        <Figure caption="本当はAのほうが4点高い設定。人数が少ないと区間が広く0をまたぎやすい（オレンジ）。人数を増やすと区間が狭まり、0を含まなくなりやすい（青）">
          <TwoGroupsCi />
        </Figure>
        <MathBlock caption="差の分散は、それぞれの分散の和（独立なとき）。引き算でも分散は足し算">{'V(\\bar{X}_A - \\bar{X}_B) = \\frac{\\sigma_A^2}{n_A} + \\frac{\\sigma_B^2}{n_B}'}</MathBlock>
      </Section>

      <Section title="母平均の差：母分散が既知のとき">
        <MathBlock caption="母平均の差の 95% 信頼区間（σA², σB² が既知）">{'(\\bar{x}_A - \\bar{x}_B) \\pm 1.96\\sqrt{\\frac{\\sigma_A^2}{n_A} + \\frac{\\sigma_B^2}{n_B}}'}</MathBlock>
        <p>n が大きいときは、σ² の代わりに標本の分散を入れて同じ式で近似することもあります。</p>
      </Section>

      <Section title="母平均の差：等分散を仮定するとき（プールした分散）">
        <p>
          σ がわからないとき、2 つの母分散が<strong>等しい</strong>と仮定できるなら、2 つの標本をまとめて共通の分散を推定します。
          これを<strong>プールした分散</strong>（合併した分散）といいます。
        </p>
        <MathBlock caption="プールした分散：それぞれの偏差の2乗和を足して、自由度の合計で割る">{'s_p^2 = \\frac{(n_A - 1)s_A^2 + (n_B - 1)s_B^2}{n_A + n_B - 2}'}</MathBlock>
        <MathBlock caption="母平均の差の 95% 信頼区間（等分散を仮定、自由度 nA + nB − 2 の t 分布）">{'(\\bar{x}_A - \\bar{x}_B) \\pm t_{0.025}(n_A + n_B - 2)\\sqrt{s_p^2\\left(\\frac{1}{n_A} + \\frac{1}{n_B}\\right)}'}</MathBlock>
        <Intuition title="なぜ「重みつき」の平均なの？">
          <p>
            人数の多いグループの分散のほうが信頼できるので、自由度（n − 1）で重みをつけて平均します。自由度はそれぞれから 1 ずつ減るので、
            合わせて <M>{'n_A + n_B - 2'}</M> です。
          </p>
        </Intuition>
        <Example title="計算してみよう">
          <DataTable
            head={['', '人数', '平均', '不偏分散']}
            rows={[
              ['A', '8', '30', '12'],
              ['B', '10', '26', '9'],
            ]}
          />
          <Steps>
            <li>
              プールした分散：<M>{'s_p^2 = (7 \\times 12 + 9 \\times 9)/16 = 165/16 \\approx 10.31'}</M>
            </li>
            <li>
              標準誤差：<M>{'\\sqrt{10.31 \\times (1/8 + 1/10)} = \\sqrt{10.31 \\times 0.225} \\approx 1.523'}</M>
            </li>
            <li>
              自由度 16 の t：<M>{'t_{0.025}(16) = 2.120'}</M>。幅の半分 <M>{'2.120 \\times 1.523 \\approx 3.23'}</M>
            </li>
            <li>
              95% 信頼区間：<M>{'4 \\pm 3.23'}</M> より約 <M>{'[0.77,\\ 7.23]'}</M>。0 を含まないので、A のほうが平均が高いと考えられる。
            </li>
          </Steps>
        </Example>
      </Section>

      <Section title="等分散を仮定しないとき（ウェルチの方法）">
        <p>
          2 つの母分散が等しいとは言えないときは、<strong>ウェルチの方法</strong>を使います。標準誤差はそれぞれの標本分散のまま足し、
          t 分布の自由度を次の近似式で決めます（自由度は整数にならないこともあります）。
        </p>
        <MathBlock caption="ウェルチの方法の標準誤差">{'\\sqrt{\\frac{s_A^2}{n_A} + \\frac{s_B^2}{n_B}}'}</MathBlock>
        <MathBlock caption="自由度の近似式（ウェルチ・サタースウェイトの式）">{'\\nu \\approx \\frac{\\left(\\dfrac{s_A^2}{n_A} + \\dfrac{s_B^2}{n_B}\\right)^2}{\\dfrac{(s_A^2/n_A)^2}{n_A - 1} + \\dfrac{(s_B^2/n_B)^2}{n_B - 1}}'}</MathBlock>
        <p className="muted">
          上の例（A：8 人・分散 12、B：10 人・分散 9）であてはめると、自由度は約 14 になります。2級では、式の形と「等分散でないときに使う」ことを知っておけば十分でしょう。
        </p>
      </Section>

      <Section title="母分散の比の区間推定（F 分布）">
        <p>
          「2 つの機械の製品のばらつきは同じか」を知りたいときは、分散の<strong>比</strong> <M>{'\\sigma_A^2/\\sigma_B^2'}</M> を推定します。
          前の章で見たとおり、<M>{'(s_A^2/\\sigma_A^2)/(s_B^2/\\sigma_B^2)'}</M> は <M>{'F(n_A - 1, n_B - 1)'}</M> に従います。
        </p>
        <MathBlock caption="母分散の比の 95% 信頼区間（両方とも正規母集団）">{'\\frac{s_A^2/s_B^2}{F_{0.025}(n_A - 1, n_B - 1)} \\le \\frac{\\sigma_A^2}{\\sigma_B^2} \\le \\frac{s_A^2/s_B^2}{F_{0.975}(n_A - 1, n_B - 1)}'}</MathBlock>
        <p>
          右はしの分母の下側の点は、前の章の「入れ替えて逆数」を使うと <M>{'1/F_{0.975}(n_A - 1, n_B - 1) = F_{0.025}(n_B - 1, n_A - 1)'}</M> なので、上限は
          <M>{'(s_A^2/s_B^2) \\times F_{0.025}(n_B - 1, n_A - 1)'}</M> と「かけ算」で書けます。
        </p>
        <Figure caption="F分布の両側の点。95%区間なら α = 0.025 の点を使う（初期値は自由度(9, 9)）">
          <FLowerPoint initialM1={9} initialM2={9} alpha={0.025} />
        </Figure>
        <Example title="計算してみよう">
          <p>
            各 10 個の標本で <M>{'s_A^2 = 12'}</M>、<M>{'s_B^2 = 6'}</M>。比は 2。<M>{'F_{0.025}(9, 9) = 4.026'}</M> なので、
          </p>
          <p>
            下限 <M>{'2/4.026 \\approx 0.497'}</M>、上限 <M>{'2 \\times 4.026 \\approx 8.05'}</M>。区間が 1 を含むので、ばらつきに差があるとは言い切れません。
          </p>
        </Example>
      </Section>

      <Section title="母比率の差の区間推定">
        <MathBlock caption="母比率の差の 95% 信頼区間（nA, nB が大きいとき）">{'(\\hat{p}_A - \\hat{p}_B) \\pm 1.96\\sqrt{\\frac{\\hat{p}_A(1-\\hat{p}_A)}{n_A} + \\frac{\\hat{p}_B(1-\\hat{p}_B)}{n_B}}'}</MathBlock>
        <Example title="計算してみよう">
          <p>ある商品を「買いたい」と答えた人が、20代 300 人中 150 人（0.5）、50代 200 人中 80 人（0.4）でした。</p>
          <Steps>
            <li>
              差：<M>{'0.5 - 0.4 = 0.1'}</M>
            </li>
            <li>
              標準誤差：<M>{'\\sqrt{0.5 \\times 0.5/300 + 0.4 \\times 0.6/200} = \\sqrt{0.000833 + 0.0012} \\approx 0.0451'}</M>
            </li>
            <li>
              95% 信頼区間：<M>{'0.1 \\pm 1.96 \\times 0.0451 = 0.1 \\pm 0.088'}</M> より約 <M>{'[0.012,\\ 0.188]'}</M>
            </li>
          </Steps>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              差の標準誤差で分散を<strong>引く</strong> → 差でも分散は<strong>足す</strong>。どちらのぶれも差のぶれになるから。
            </li>
            <li>
              標準誤差を「それぞれの標準誤差の和」<M>{'\\sigma_A/\\sqrt{n_A} + \\sigma_B/\\sqrt{n_B}'}</M> にする → 足すのは分散で、そのあとルート。
            </li>
            <li>
              プールした分散を単純な平均 <M>{'(s_A^2 + s_B^2)/2'}</M> にする → 人数がちがうときは自由度で重みをつける。
            </li>
            <li>
              等分散の t の自由度を <M>{'n_A + n_B - 1'}</M> にする → 正しくは <M>{'n_A + n_B - 2'}</M>。
            </li>
            <li>分散の比の区間は「1 を含むか」、平均や比率の差の区間は「0 を含むか」を見る。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>2 グループの平均・標準偏差・人数から、プールした分散と母平均の差の信頼区間を求める問題。</li>
            <li>等分散を仮定する方法とウェルチの方法のどちらを使うべきかを問う問題。</li>
            <li>F 分布の表を使って、母分散の比の信頼区間を求める問題（下側の点の求め方がポイント）。</li>
            <li>2 つのアンケート結果から、母比率の差の信頼区間を求める問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
