import { Link } from 'react-router-dom'
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
        <p className="muted">
          記号の右下の小さな A・B は「どちらのグループのものか」の印です。<M>{'\\bar{x}_A'}</M> は A の標本平均、<M>{'n_A'}</M> は A の人数、
          <M>{'s_A^2'}</M> は A の不偏分散、<M>{'\\sigma_A^2'}</M> は A の母分散。B も同じです（教科書によっては 1・2 と書きます）。
        </p>
        <Figure caption="本当はAのほうが4点高い設定。人数が少ないと区間が広く0をまたぎやすい（オレンジ）。人数を増やすと区間が狭まり、0を含まなくなりやすい（青）">
          <TwoGroupsCi />
        </Figure>
        <p>
          考え方は 1 つの母平均のときと同じで、「差の推定値 ± 係数 × 差の標準誤差」です。差の標準誤差は、
          <Link to="/lessons/random-variables-sum-covariance">「和と差・共分散と相関」</Link>で見た「独立なら、差の分散も足し算」から出てきます。
        </p>
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

      <Section title="対応のあるデータ：差をとって 1 つの標本にする">
        <p>
          同じ人の「前」と「後」のように、2 つの値が<strong>ペアになっている</strong>（対応がある）ときは、ここまでの方法は使いません。
          2 つのグループが独立ではない（体重の重い人は前も後も重い）からです。
        </p>
        <p>
          この場合は、一人ひとりの<strong>差</strong> <M>{'d_i'}</M>（i 人目の「後の値 − 前の値」）を計算して、差 d を 1 つの標本とみなします。
          あとは<Link to="/lessons/estimation-ci-mean">「母平均の区間推定」</Link>と同じで、差の平均 <M>{'\\bar{d}'}</M>、差の標準偏差 <M>{'s_d'}</M>、ペアの数 n を使います。
        </p>
        <MathBlock caption="対応のあるデータの母平均の差の 95% 信頼区間（差が正規分布に従うとき）">{'\\bar{d} \\pm t_{0.025}(n-1)\\frac{s_d}{\\sqrt{n}}'}</MathBlock>
        <p className="muted">自由度は「ペアの数 − 1」。人数の合計から 2 を引くのではありません。</p>
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

      <Section title="まとめ：どの場面でどの式・どの分布を使うか">
        <p>
          推定の章で出てきた区間推定を 1 つの表にまとめました。問題文を読んだら、まず<strong>「何の区間か」</strong>（平均・比率・分散・相関、1 つか 2 つか）、
          次に<strong>「σ がわかっているか」「等分散か」「対応があるか」</strong>を確かめて行を選びます。どれも 95% の場合で、99% などでは係数を取りかえます。
        </p>
        <DataTable
          head={['知りたいもの', '条件', '95% 信頼区間', '使う分布（自由度）']}
          rows={[
            ['母平均 μ', 'σ が既知', <M key="a">{'\\bar{x} \\pm 1.96\\dfrac{\\sigma}{\\sqrt{n}}'}</M>, '標準正規'],
            ['母平均 μ', 'σ が未知（正規母集団）', <M key="b">{'\\bar{x} \\pm t_{0.025}(n-1)\\dfrac{s}{\\sqrt{n}}'}</M>, 't（n − 1）'],
            ['母比率 p', 'n が大きい', <M key="c">{'\\hat{p} \\pm 1.96\\sqrt{\\dfrac{\\hat{p}(1-\\hat{p})}{n}}'}</M>, '標準正規（近似）'],
            ['母分散 σ²', '正規母集団', <M key="d">{'\\left[\\dfrac{(n-1)s^2}{\\chi^2_{0.025}(n-1)},\\ \\dfrac{(n-1)s^2}{\\chi^2_{0.975}(n-1)}\\right]'}</M>, 'χ²（n − 1）'],
            ['母相関係数 ρ', '2 変数が正規分布、n がある程度大きい', <M key="e">{'z \\pm \\dfrac{1.96}{\\sqrt{n-3}}'}</M>, '標準正規（z 変換してから。最後に r に戻す）'],
            ['平均の差 μA − μB', 'σA², σB² が既知', <M key="f">{'(\\bar{x}_A - \\bar{x}_B) \\pm 1.96\\sqrt{\\dfrac{\\sigma_A^2}{n_A} + \\dfrac{\\sigma_B^2}{n_B}}'}</M>, '標準正規'],
            ['平均の差 μA − μB', '未知だが等分散を仮定', <M key="g">{'(\\bar{x}_A - \\bar{x}_B) \\pm t_{0.025}(n_A+n_B-2)\\sqrt{s_p^2\\left(\\dfrac{1}{n_A} + \\dfrac{1}{n_B}\\right)}'}</M>, 't（nA + nB − 2）'],
            ['平均の差 μA − μB', '未知で等分散と言えない', <M key="h">{'(\\bar{x}_A - \\bar{x}_B) \\pm t_{0.025}(\\nu)\\sqrt{\\dfrac{s_A^2}{n_A} + \\dfrac{s_B^2}{n_B}}'}</M>, 't（ウェルチの近似自由度 ν）'],
            ['平均の差（対応あり）', '同じ人の前後など', <M key="i">{'\\bar{d} \\pm t_{0.025}(n-1)\\dfrac{s_d}{\\sqrt{n}}'}</M>, 't（ペアの数 − 1）'],
            ['分散の比 σA²/σB²', '2 つとも正規母集団', <M key="j">{'\\left[\\dfrac{s_A^2/s_B^2}{F_{0.025}(n_A-1,\\,n_B-1)},\\ \\dfrac{s_A^2}{s_B^2}F_{0.025}(n_B-1,\\,n_A-1)\\right]'}</M>, 'F（nA − 1, nB − 1）'],
            ['比率の差 pA − pB', 'nA, nB が大きい', <M key="k">{'(\\hat{p}_A - \\hat{p}_B) \\pm 1.96\\sqrt{\\dfrac{\\hat{p}_A(1-\\hat{p}_A)}{n_A} + \\dfrac{\\hat{p}_B(1-\\hat{p}_B)}{n_B}}'}</M>, '標準正規（近似）'],
          ]}
          caption="平均・比率の差の区間は「0 を含むか」、分散の比の区間は「1 を含むか」で、差があると言えるかを判断する"
        />
        <p className="muted">
          1 つの母集団についての区間は<Link to="/lessons/estimation-ci-mean">「母平均の区間推定」</Link>と
          <Link to="/lessons/estimation-ci-proportion-variance">「母比率・母分散・相関係数の区間推定」</Link>でくわしく扱っています。
        </p>
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
            <li>
              「区間が 0 を含むので、2 つの母平均は等しいと証明された」→ 言えるのは「差があるとは<strong>言い切れない</strong>」まで。差が小さすぎて見えていないだけかもしれません。
            </li>
            <li>同じ人の前後をくらべるのに、2 つの独立なグループの式を使う → 対応があるときは差をとって 1 標本の t。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>2 グループの平均・標準偏差・人数から、プールした分散と母平均の差の信頼区間を求める問題。</li>
            <li>等分散を仮定する方法・ウェルチの方法・対応のあるデータの方法のどれを使うべきかを、場面から判断させる問題。上のまとめの表を使う。</li>
            <li>区間の式を選ばせる問題。「分散を足しているか」「自由度は nA + nB − 2 か」「F の自由度の順番」を確かめる。</li>
            <li>F 分布の表を使って、母分散の比の信頼区間を求める問題（下側の点の求め方がポイント）。</li>
            <li>2 つのアンケート結果から、母比率の差の信頼区間を求める問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
