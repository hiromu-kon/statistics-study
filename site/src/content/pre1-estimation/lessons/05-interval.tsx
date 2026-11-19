import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { CoverageProportion, ExpPivot } from '../figures/Interval'

export const meta: LessonMeta = {
  id: 'pre1-estimation-interval',
  chapter: 'pre1-estimation',
  order: 5,
  title: '区間推定の構成',
  summary: '信頼区間は「母数を含むが、分布は母数によらない量（枢軸量）」から作ります。2級の区間を整理し直し、実際の被覆確率と片側信頼限界を学びます。',
  minutes: 50,
  keywords: ['信頼係数', '信頼区間の構成', '枢軸量', '被覆確率', '片側信頼限界', '母平均', '母分散', '母比率', '母分散の比', '2標本問題'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          信頼区間の作り方は1つの型にまとめられます。データと母数 θ の両方を含むのに、<strong>分布が θ によらない</strong>量（<strong>枢軸量</strong>〈すうじくりょう〉）を見つけ、
          その分布の両側 2.5% 点ではさみ、不等式を θ について解く。こうして作った区間が本当に θ を含む確率を<strong>被覆確率</strong>といい、
          近似を使った区間では名目の 95% からずれることがあります。
        </p>
      </Point>

      <Section title="2級の区間を振り返る">
        <p>
          2級では母平均の区間を「<M>{'\\bar{X}'}</M> を標準化すると標準正規分布、真ん中の 95% を ±1.96 ではさんで μ について解く」と作りました（
          <Link to="/lessons/estimation-ci-mean">母平均の区間推定</Link>）。このとき使った
        </p>
        <MathBlock caption="μ を含んでいるが、分布は N(0, 1) で μ にも σ にもよらない">{'Z = \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\sim N(0, 1)'}</MathBlock>
        <p>
          が枢軸量です。<M>{'\\bar{X}'}</M> だけでは分布が μ によって動いてしまいますが、μ を引いて標準誤差で割ると、μ がいくつでも同じ分布になります。
          「物差しの目盛り（分布の % 点）が母数によらず決まる」から、区間が作れるのです。
        </p>
      </Section>

      <Section title="枢軸量で区間を作る一般的な手順">
        <Steps>
          <li>
            データと θ を含み、分布が θ によらない量 <M>{'Q(X_1, \\dots, X_n;\\, \\theta)'}</M> を見つける（十分統計量や最尤推定量をもとに作ることが多い）。
          </li>
          <li>
            Q の分布の下側 2.5% 点 a と上側 2.5% 点 b を表で引く：<M>{'P(a \\le Q \\le b) = 0.95'}</M>
          </li>
          <li>
            不等式 <M>{'a \\le Q \\le b'}</M> を θ について解いて、<M>{'L \\le \\theta \\le U'}</M> の形にする（割り算や逆数で<strong>不等号の向きが変わる</strong>ところに注意）。
          </li>
          <li>
            データの値を入れて区間 [L, U] を計算する。信頼係数 <M>{'1 - \\alpha'}</M> にしたいときは、2.5% を <M>{'\\alpha/2'}</M> に変える。
          </li>
        </Steps>
        <Example title="新しい例：指数分布の λ（正確な区間）">
          <p>
            待ち時間 <M>{'X_1, \\dots, X_n'}</M> が率 λ の指数分布に従うとき、<M>{'\\lambda X_i'}</M> は率 1 の指数分布（λ によらない）になり、
            <M>{'2\\lambda X_i'}</M> は自由度 2 のカイ二乗分布になります。独立なカイ二乗分布の和は自由度が足されるので、
          </p>
          <MathBlock caption="指数分布の枢軸量：合計に 2λ をかけると、自由度 2n のカイ二乗分布">{'Q = 2\\lambda\\sum_{i=1}^{n} X_i \\sim \\chi^2(2n)'}</MathBlock>
          <p>n = 5、合計 Σx = 10 分のとき（λ̂ = 5/10 = 0.5）：</p>
          <Steps>
            <li>
              自由度 10 のカイ二乗分布の下側 2.5% 点 3.247、上側 2.5% 点 20.483（<Link to="/tables">分布表</Link>）
            </li>
            <li>
              <M>{'3.247 \\le 2\\lambda \\times 10 \\le 20.483'}</M>
            </li>
            <li>
              20 で割る：<M>{'0.162 \\le \\lambda \\le 1.024'}</M>
            </li>
          </Steps>
          <p>
            近似ではなく、n が小さくても信頼係数がちょうど 95% の区間です。λ̂ = 0.5 に対して右に長い（非対称な）区間になっています。
            カイ二乗分布の和の性質は<Link to="/chapters/pre1-distributions">種々の確率分布</Link>の章で扱います。
          </p>
        </Example>
        <Figure caption="上：自由度2nのカイ二乗分布の両側2.5%。下：その2点を2Σxで割ったλの95%信頼区間。nやΣxを動かして、区間の幅と非対称さを見る">
          <ExpPivot />
        </Figure>
        <Example title="もう1つ：一様分布 U(0, θ) の最大値">
          <p>
            最大値を θ で割った <M>{'Q = X_{(n)}/\\theta'}</M> は、<M>{'P(Q \\le q) = q^n'}</M>（0 ≦ q ≦ 1）で θ によりません。
            <M>{'P(Q \\ge 0.05^{1/n}) = 1 - 0.05 = 0.95'}</M> なので、
          </p>
          <MathBlock caption="一様分布の θ の 95% 信頼区間（最大値以上なのは当然なので、下側は最大値そのもの）">{'X_{(n)} \\le \\theta \\le \\frac{X_{(n)}}{0.05^{1/n}}'}</MathBlock>
          <p>
            n = 10 なら <M>{'0.05^{1/10} \\approx 0.741'}</M>。最大値が 8.0 なら <M>{'8.0 \\le \\theta \\le 8.0/0.741 \\approx 10.79'}</M>。
            両側に 2.5% ずつではなく、片側に 5% を置いています。同じ 95% でも、区間の作り方は1通りではありません（ここでは区間が最も短くなる置き方を選んだ）。
          </p>
        </Example>
      </Section>

      <Section title="よく使う区間の整理表">
        <p>2級で学んだ区間も、すべて「枢軸量 → % 点ではさむ → 母数について解く」で作られています。</p>
        <DataTable
          head={['知りたい母数', '枢軸量', '分布', '2級のレッスン']}
          rows={[
            ['母平均（σ² 既知）', <M key="a">{'\\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}}'}</M>, 'N(0, 1)', <Link key="la" to="/lessons/estimation-ci-mean">母平均</Link>],
            ['母平均（σ² 未知）', <M key="b">{'\\frac{\\bar{X} - \\mu}{s/\\sqrt{n}}'}</M>, 't(n − 1)', <Link key="lb" to="/lessons/estimation-ci-mean">母平均</Link>],
            ['母分散', <M key="c">{'\\frac{(n-1)s^2}{\\sigma^2}'}</M>, 'χ²(n − 1)', <Link key="lc" to="/lessons/estimation-ci-proportion-variance">母比率・母分散</Link>],
            ['母比率（近似）', <M key="d">{'\\frac{\\hat{p} - p}{\\sqrt{\\hat{p}(1-\\hat{p})/n}}'}</M>, 'およそ N(0, 1)', <Link key="ld" to="/lessons/estimation-ci-proportion-variance">母比率・母分散</Link>],
            ['母分散の比', <M key="e">{'\\frac{s_1^2/\\sigma_1^2}{s_2^2/\\sigma_2^2}'}</M>, 'F(m − 1, n − 1)', <Link key="le" to="/lessons/estimation-ci-two-samples">2つの母集団</Link>],
            ['母平均の差（等分散）', <M key="f">{'\\frac{(\\bar{X} - \\bar{Y}) - (\\mu_1 - \\mu_2)}{s_p\\sqrt{1/m + 1/n}}'}</M>, 't(m + n − 2)', <Link key="lf" to="/lessons/estimation-ci-two-samples">2つの母集団</Link>],
            ['母平均の差（ウェルチ）', <M key="g">{'\\frac{(\\bar{X} - \\bar{Y}) - (\\mu_1 - \\mu_2)}{\\sqrt{s_1^2/m + s_2^2/n}}'}</M>, 'およそ t（自由度は近似式）', <Link key="lg" to="/lessons/estimation-ci-two-samples">2つの母集団</Link>],
            ['母比率の差（近似）', <M key="h">{'\\frac{(\\hat{p}_1 - \\hat{p}_2) - (p_1 - p_2)}{\\sqrt{\\hat{p}_1(1-\\hat{p}_1)/m + \\hat{p}_2(1-\\hat{p}_2)/n}}'}</M>, 'およそ N(0, 1)', <Link key="lh" to="/lessons/estimation-ci-two-samples">2つの母集団</Link>],
            ['最尤推定量（近似）', <M key="i">{'(\\hat{\\theta} - \\theta)\\sqrt{nI(\\hat{\\theta})}'}</M>, 'およそ N(0, 1)', <Link key="li" to="/lessons/pre1-estimation-asymptotics">前のレッスン</Link>],
          ]}
          caption="正規母集団を仮定する行（母平均・母分散・分散比・平均の差）は正確な区間、「およそ」の行は n が大きいときの近似。s_p はプールした標準偏差。2標本はそれぞれ大きさ m と n"
        />
        <Note title="分散の比の区間は向きに注意">
          <p>
            <M>{'\\frac{s_1^2/\\sigma_1^2}{s_2^2/\\sigma_2^2} = \\frac{s_1^2}{s_2^2} \\cdot \\frac{\\sigma_2^2}{\\sigma_1^2}'}</M> なので、F の % 点ではさんで
            <M>{'\\sigma_1^2/\\sigma_2^2'}</M> について解くと、逆数をとる段階で上下が入れかわります。
            F 分布の下側の % 点は <M>{'F_{1-\\alpha/2}(m-1, n-1) = 1/F_{\\alpha/2}(n-1, m-1)'}</M>（自由度を入れかえて逆数）で求めます。
          </p>
        </Note>
      </Section>

      <Section title="被覆確率：名目の信頼係数と実際">
        <p>
          区間 [L, U] が本当の θ を含む確率 <M>{'P_\\theta(L \\le \\theta \\le U)'}</M> を<strong>被覆確率</strong>（ひふくかくりつ、カバレッジ）といいます。
          添字の θ は「本当の母数が θ のとき」の確率という意味です。ここで確率的にぶれるのはデータから計算する L と U のほうで、θ は決まった値です。
          枢軸量の分布が正確にわかっていれば被覆確率はちょうど信頼係数（<strong>名目</strong>の値）に等しくなりますが、正規近似などを使うとずれます。
        </p>
        <Example title="母比率のワルド型区間">
          <p>
            2級の <M>{'\\hat{p} \\pm 1.96\\sqrt{\\hat{p}(1-\\hat{p})/n}'}</M>（ワルド型）で、n = 20、本当の p = 0.1 のとき、実際に p を含む確率を二項分布で正確に計算すると
            約 <strong>0.876</strong> で、95% に届きません。n = 50、p = 0.1 でも約 0.879 です。
          </p>
          <ul>
            <li>表の回数 k は整数なので、作れる区間は n + 1 通りしかなく、被覆確率は p によってギザギザに上下する（ちょうど 95% にはできない）。</li>
            <li>
              p が 0 や 1 に近いと、<M>{'\\hat{p}'}</M> の分布がゆがみ正規近似が悪くなる。k = 0 なら区間の幅が 0 になってしまう。
            </li>
          </ul>
        </Example>
        <Figure caption="母比率の95%信頼区間の、実際の被覆確率（二項分布で正確に計算）。ワルド型は0.95の線を大きく下回るpがあり、とくにpが0や1に近いと悪い。ボタンで、そのpから1000回標本をとるシミュレーションも試せる">
          <CoverageProportion />
        </Figure>
        <p>
          この問題は Brown・Cai・DasGupta（2001）が詳しく調べ、n がかなり大きくてもワルド型の被覆確率が不安定であることを示し、
          ウィルソン型の区間（スコア型）などを勧めています（
          <a href="https://projecteuclid.org/euclid.ss/1009213286" target="_blank" rel="noreferrer">
            Interval Estimation for a Binomial Proportion, Statistical Science 16(2)
          </a>
          ）。
        </p>
        <Note title="ウィルソン型の区間（参考）">
          <p>
            <M>{'\\frac{|\\hat{p} - p|}{\\sqrt{p(1-p)/n}} \\le 1.96'}</M> のように、分母に <M>{'\\hat{p}'}</M> ではなく<strong>本当の p</strong> を残したまま p について解いた区間です
            （2次不等式になる）。出題範囲表の用語には直接はありませんが、「近似の枢軸量でも、どこで近似するかで被覆確率が変わる」例として知っておくとよいでしょう。
          </p>
        </Note>
        <Intuition title="被覆確率は「作り方の性能表示」">
          <p>
            2級で見たように、信頼係数は「この作り方で区間を何度も作ると、何割が θ を含むか」でした。被覆確率は、その性能表示が<strong>本当に</strong>守られているかを、
            θ の値ごとに確かめたものです。「95% と書いてあるのに、実際は 88% しか含まない作り方」は、表示に偽りがあるわけです。
          </p>
        </Intuition>
      </Section>

      <Section title="片側信頼限界">
        <p>
          「不良率は<strong>多くても</strong>この程度」「強度は<strong>少なくとも</strong>この程度」のように、片側だけが知りたいことがあります。
          そのときは、片側に α をまとめて置いた<strong>片側信頼限界</strong>を使います。
        </p>
        <Compare>
          <Card title="両側の 95% 信頼区間">
            <p>両側に 2.5% ずつ：</p>
            <MathBlock>{'\\bar{x} - 1.96\\frac{\\sigma}{\\sqrt{n}} \\le \\mu \\le \\bar{x} + 1.96\\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
          </Card>
          <Card title="95% 上側信頼限界">
            <p>片側（上）に 5% をまとめる：</p>
            <MathBlock>{'\\mu \\le \\bar{x} + 1.645\\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
          </Card>
        </Compare>
        <Example title="計算してみよう">
          <Steps>
            <li>
              母平均（σ = 8、n = 16、x̄ = 50）の 95% 上側信頼限界：<M>{'50 + 1.645 \\times 8/4 = 53.29'}</M>。両側区間の上端 53.92 より小さい（片側のほうが同じ 95% でも厳しく言える）
            </li>
            <li>
              母分散の 95% 上側信頼限界（正規母集団、n = 10、不偏分散 s² = 4）：<M>{'\\frac{(n-1)s^2}{\\sigma^2} \\ge \\chi^2_{0.95}(9) = 3.325'}</M>（下側 5% 点）を σ² について解いて
              <M>{'\\sigma^2 \\le \\frac{9 \\times 4}{3.325} \\approx 10.83'}</M>
            </li>
          </Steps>
          <p className="muted">
            <M>{'\\chi^2_{0.95}(9)'}</M> は「右側の面積が 0.95 になる点」＝下側 5% 点の意味で書いています（2級と同じ書き方）。本によって添字の意味が逆のことがあるので、値の大きさで確かめます。
          </p>
        </Example>
        <p>
          片側信頼限界は、<Link to="/lessons/testing-idea">片側検定</Link>と対応します。「μ ≦ 53.29」の外側にある μ₀ は、有意水準 5% の片側検定（対立仮説 μ &lt; μ₀）で棄却される値です。
          区間推定と検定の対応は<Link to="/chapters/pre1-testing">検定</Link>の章でも使います。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>「枢軸量は母数を含まない」→ 枢軸量は母数を<strong>含みます</strong>（含まないと母数について解けない）。母数によらないのは、その<strong>分布</strong>です。母数を含まずデータだけで計算するのは統計量。</li>
            <li>片側 95% に 1.96 を使う → 片側に 5% をまとめるので 1.645（両側 90% と同じ点）。</li>
            <li>「信頼係数 95% と書いた区間は、どんな場合も 95% の確率で含む」→ 近似の区間では被覆確率がずれます。母比率のワルド型は p が 0 や 1 に近いと大きく下回ります。</li>
            <li>割り算や逆数で不等号の向きを変え忘れる → 母分散・分散の比・指数分布の区間で、大きいほうの % 点が下限側に来ます。</li>
            <li>「信頼区間は左右対称」→ カイ二乗分布や F 分布を使う区間は、推定値に対して右に長い非対称な区間になります。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              事実：出題範囲表（2027年1月1日からの版）に、信頼係数・信頼区間の構成（母平均、母分散、母比率、母分散の比、2標本問題）・被覆確率・片側信頼限界が挙がっています。
            </li>
            <li>
              予想（公式の発表ではない）：2級と同じ形の区間を計算する問題に加え、指数分布や一様分布のように「枢軸量を自分で作る」問題、
              片側信頼限界を計算する数値入力問題、被覆確率の意味（名目の値と実際のずれ）を問う正誤問題が考えられます。
            </li>
            <li>カイ二乗・t・F の % 点は試験で与えられる表（または問題文）で引くので、「上側か下側か」「自由度はいくつか」を確実に読みとれるようにします。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
