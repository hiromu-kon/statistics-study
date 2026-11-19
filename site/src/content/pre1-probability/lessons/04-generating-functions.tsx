import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DiceSumPgf } from '../figures/DiceSumPgf'
import { MgfTangent } from '../figures/MgfTangent'

export const meta: LessonMeta = {
  id: 'pre1-probability-mgf',
  chapter: 'pre1-probability',
  order: 4,
  title: '積率母関数と確率母関数',
  summary: '分布の情報を1つの関数にまとめた「母関数」を学びます。微分するとモーメントが出てくること、独立な和の分布が「かけ算」で求まることが、この道具を使う理由です。',
  minutes: 45,
  keywords: ['モーメント母関数（積率母関数）', '確率母関数', 'モーメント'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>積率母関数</strong>（モーメント母関数）<M>{'M(t) = E[e^{tX}]'}</M> は、分布の情報を1つの関数に詰めこんだものです。使う理由は3つあります。
        </p>
        <ol>
          <li>
            <strong>t = 0 で微分するとモーメントが出てくる</strong>：<M>{"M'(0) = E[X]"}</M>、<M>{"M''(0) = E[X^2]"}</M>、…。積分や和を何度も計算しなくてよい。
          </li>
          <li>
            <strong>独立な和の分布がかけ算で求まる</strong>：<M>{'M_{X+Y}(t) = M_X(t)\\,M_Y(t)'}</M>。
          </li>
          <li>
            <strong>積率母関数が同じなら分布も同じ</strong>：かけ算してできた関数の形を見れば、和の分布がわかる。
          </li>
        </ol>
        <p>
          0, 1, 2, … の値をとる確率変数には、よく似た<strong>確率母関数</strong> <M>{'G(s) = E[s^X]'}</M> もあります。
        </p>
      </Point>

      <Section title="なぜ「母関数」なのか：モーメントが詰まっている">
        <p>
          指数関数は <M>{'e^{u} = 1 + u + \\frac{u^2}{2!} + \\frac{u^3}{3!} + \\cdots'}</M> と展開できます。
          これは<Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link>の1次近似 <M>{'e^u \\approx 1 + u'}</M> を、2次、3次、…と無限に続けたもの（テイラー展開）です。
          <M>{'e^u'}</M> は何回微分しても <M>{'e^u'}</M> で、u = 0 での値がいつも 1 なので、k 次の項の係数が <M>{'\\frac{1}{k!}'}</M>（<M>{'k! = k \\times (k-1) \\times \\cdots \\times 1'}</M>）になります。
        </p>
        <p>
          u に tX を入れると <M>{'e^{tX} = 1 + tX + \\frac{t^2X^2}{2!} + \\cdots'}</M>。t はただの数なので、期待値をとると各項の X の部分だけが E[ ] の中に残ります。
        </p>
        <MathBlock caption="積率母関数を t のべき（t, t², t³, …）で展開すると、係数にモーメント E[X^k] が並ぶ">
          {'M(t) = E[e^{tX}] = 1 + E[X]\\,t + \\frac{E[X^2]}{2!}t^2 + \\frac{E[X^3]}{3!}t^3 + \\cdots'}
        </MathBlock>
        <p>
          この式を t で1回微分すると（<M>{'t^k'}</M> の微分は <M>{'kt^{k-1}'}</M>）、
          <M>{"M'(t) = E[X] + E[X^2]\\,t + \\frac{E[X^3]}{2!}t^2 + \\cdots"}</M>。t = 0 を入れると、t を含む項が全部消えて <M>{'E[X]'}</M> だけが残ります。
          もう1回微分すると <M>{"M''(t) = E[X^2] + E[X^3]\\,t + \\cdots"}</M> なので、t = 0 なら <M>{'E[X^2]'}</M>。
          モーメント（積率）を次々に生み出す（母になる）関数なので、積率母関数と呼びます（微分は<Link to="/lessons/pre1-math-derivative">「微分」</Link>）。
        </p>
        <MathBlock caption="k 回微分して t = 0 を入れると、原点のまわりの k 次モーメント">{'M^{(k)}(0) = E[X^k]'}</MathBlock>
        <Figure caption="どの分布でも M(0) = 1（e⁰ = 1 の平均）。t = 0 での傾き（オレンジの接線）が平均 E[X] になる。分布やパラメータを変えて確かめる">
          <MgfTangent />
        </Figure>
      </Section>

      <Section title="定義・式">
        <MathBlock caption="積率母関数の定義（離散なら和、連続なら積分）。0 を含むある範囲の t で値が有限のときに使う">
          {'M_X(t) = E[e^{tX}] = \\sum_{x} e^{tx}\\,p(x) \\quad \\text{or} \\quad \\int_{-\\infty}^{\\infty} e^{tx} f(x)\\,dx'}
        </MathBlock>
        <DataTable
          head={['分布', '積率母関数 M(t)', '平均', '分散']}
          rows={[
            ['ベルヌーイ（成功確率 p）', <M key="b">{'1 - p + pe^{t}'}</M>, 'p', 'p(1 − p)'],
            ['二項分布 B(n, p)', <M key="bi">{'(1 - p + pe^{t})^{n}'}</M>, 'np', 'np(1 − p)'],
            ['ポアソン分布（平均 λ）', <M key="p">{'\\exp\\{\\lambda(e^{t} - 1)\\}'}</M>, 'λ', 'λ'],
            ['指数分布（平均 1/λ）', <M key="e">{'\\frac{\\lambda}{\\lambda - t} \\quad (t < \\lambda)'}</M>, '1/λ', '1/λ²'],
            ['正規分布 N(μ, σ²)', <M key="n">{'\\exp\\left(\\mu t + \\frac{\\sigma^2 t^2}{2}\\right)'}</M>, 'μ', 'σ²'],
          ]}
          caption="exp{a} は e^a のこと。ガンマ分布（形状 k・尺度 θ）なら (1 − θt)^(−k)（t < 1/θ）で、「種々の確率分布」の章で使う"
        />
        <Example title="ポアソン分布の積率母関数を作る">
          <Steps>
            <li>
              定義どおり和をとる：<M>{'M(t) = \\sum_{k=0}^{\\infty} e^{tk}\\,\\frac{\\lambda^k e^{-\\lambda}}{k!} = e^{-\\lambda}\\sum_{k=0}^{\\infty} \\frac{(\\lambda e^{t})^k}{k!}'}</M>
            </li>
            <li>
              <M>{'\\sum_{k=0}^{\\infty} \\frac{a^k}{k!} = e^{a}'}</M>（指数関数の展開）を <M>{'a = \\lambda e^t'}</M> で使う：<M>{'M(t) = e^{-\\lambda} e^{\\lambda e^t} = \\exp\\{\\lambda(e^t - 1)\\}'}</M>
            </li>
            <li>
              1回微分：<M>{'M(t) = e^{u}'}</M>、<M>{'u = \\lambda(e^t - 1)'}</M> とみると、合成関数の微分で「<M>{'e^u'}</M> の微分 × u の微分」。
              <M>{"\\frac{du}{dt} = \\lambda e^t"}</M> なので <M>{"M'(t) = e^{u} \\times \\lambda e^{t} = \\lambda e^{t} M(t)"}</M>。t = 0 で <M>{"M'(0) = \\lambda \\times 1 \\times 1 = \\lambda"}</M>（M(0) = 1）。
            </li>
            <li>
              2回微分：<M>{"\\lambda e^t"}</M> と <M>{'M(t)'}</M> の積なので、積の微分「(前の微分) × 後 + 前 × (後の微分)」を使う。
              <M>{"M''(t) = \\lambda e^t M(t) + \\lambda e^t M'(t) = \\lambda e^t M(t) + \\lambda e^t \\cdot \\lambda e^t M(t) = (\\lambda e^t + \\lambda^2 e^{2t})M(t)"}</M>。t = 0 で <M>{'\\lambda + \\lambda^2'}</M>。
            </li>
            <li>
              分散：<M>{'E[X^2] - E[X]^2 = \\lambda + \\lambda^2 - \\lambda^2 = \\lambda'}</M>。2級で覚えた「ポアソン分布は平均 = 分散」が出てくる。
            </li>
          </Steps>
        </Example>
        <Example title="指数分布の積率母関数を作る（積分）">
          <Steps>
            <li>
              <M>{'M(t) = \\int_0^{\\infty} e^{tx}\\,\\lambda e^{-\\lambda x}\\,dx = \\lambda \\int_0^{\\infty} e^{-(\\lambda - t)x}\\,dx'}</M>（<M>{'e^{tx}e^{-\\lambda x} = e^{tx - \\lambda x}'}</M>）
            </li>
            <li>
              <M>{'c = \\lambda - t'}</M> とおく。<M>{'t < \\lambda'}</M>（c &gt; 0）なら <M>{'\\int_0^{\\infty} e^{-cx}\\,dx = \\left[-\\frac{1}{c}e^{-cx}\\right]_0^{\\infty} = 0 - \\left(-\\frac{1}{c}\\right) = \\frac{1}{c}'}</M> を使って <M>{'M(t) = \\frac{\\lambda}{\\lambda - t}'}</M>。
              <M>{'t \\ge \\lambda'}</M> では積分が無限大になり、M(t) は存在しない。
            </li>
            <li>
              微分：<M>{'M(t) = \\lambda(\\lambda - t)^{-1}'}</M> と書くと、合成関数の微分で <M>{"M'(t) = \\lambda \\times (-1)(\\lambda - t)^{-2} \\times (-1) = \\frac{\\lambda}{(\\lambda - t)^2}"}</M>
              （最後の (−1) は <M>{'\\lambda - t'}</M> を t で微分したもの）。同じように <M>{"M''(t) = \\lambda \\times (-2)(\\lambda - t)^{-3} \\times (-1) = \\frac{2\\lambda}{(\\lambda - t)^3}"}</M>。t = 0 で <M>{'E[X] = \\frac{1}{\\lambda}'}</M>、<M>{'E[X^2] = \\frac{2}{\\lambda^2}'}</M>。
            </li>
            <li>
              分散：<M>{'\\frac{2}{\\lambda^2} - \\frac{1}{\\lambda^2} = \\frac{1}{\\lambda^2}'}</M>。
            </li>
          </Steps>
        </Example>
        <Note title="正規分布の積率母関数（読み飛ばしてよい）">
          <p>
            標準正規分布 Z では、指数の中を <M>{'tz - \\frac{z^2}{2} = -\\frac{(z - t)^2}{2} + \\frac{t^2}{2}'}</M> と平方完成すると、
            <M>{'E[e^{tZ}] = e^{t^2/2}\\int \\frac{1}{\\sqrt{2\\pi}}e^{-(z-t)^2/2}\\,dz = e^{t^2/2}'}</M>（積分は平均 t の正規分布の密度の全体なので 1）。
            <M>{'X = \\mu + \\sigma Z'}</M> なら <M>{'E[e^{tX}] = e^{\\mu t}E[e^{(\\sigma t)Z}] = \\exp(\\mu t + \\sigma^2 t^2/2)'}</M>。
          </p>
        </Note>
      </Section>

      <Section title="独立な和の分布：かけ算で求まる">
        <p>X と Y が独立なら、<M>{'e^{t(X+Y)} = e^{tX}e^{tY}'}</M> の期待値は、それぞれの期待値の積に分かれます。</p>
        <MathBlock caption="独立な確率変数の和の積率母関数は、それぞれの積率母関数の積">{'M_{X+Y}(t) = E[e^{tX}e^{tY}] = E[e^{tX}]\\,E[e^{tY}] = M_X(t)\\,M_Y(t)'}</MathBlock>
        <p>
          かけ算してできた関数が、表のどれかと同じ形なら、和はその分布にしたがいます（積率母関数が同じなら分布も同じ、という性質を使います。証明は準1級の範囲をこえるので、ここでは使い方だけ）。
        </p>
        <Example title="ポアソン分布の和はポアソン分布（再生性）">
          <p>
            X がポアソン分布（平均 2）、Y がポアソン分布（平均 3）で独立なら、
            <M>{'M_{X+Y}(t) = e^{2(e^t - 1)} \\cdot e^{3(e^t - 1)} = e^{5(e^t - 1)}'}</M>。これは平均 5 のポアソン分布の積率母関数なので、<strong>X + Y は平均 5 のポアソン分布</strong>です。
            1日目の来客数と2日目の来客数の合計、のような場面で使えます。
          </p>
        </Example>
        <ul>
          <li>
            二項分布：<M>{'B(m, p)'}</M> と <M>{'B(n, p)'}</M>（p が同じ）の独立な和は <M>{'B(m + n, p)'}</M>。<M>{'(1-p+pe^t)^m (1-p+pe^t)^n = (1-p+pe^t)^{m+n}'}</M>。
          </li>
          <li>
            正規分布：<M>{'N(\\mu_1, \\sigma_1^2)'}</M> と <M>{'N(\\mu_2, \\sigma_2^2)'}</M> の独立な和は <M>{'N(\\mu_1 + \\mu_2, \\sigma_1^2 + \\sigma_2^2)'}</M>（指数の中の足し算になる）。
          </li>
          <li>
            指数分布：平均 1/λ の指数分布 n 個の独立な和は <M>{'\\left(\\frac{\\lambda}{\\lambda - t}\\right)^n'}</M> で、ガンマ分布（形状 n・尺度 1/λ）になる。
          </li>
        </ul>
        <MathNote title="1次式に変えたときの積率母関数">
          <p>
            <M>{'Y = aX + b'}</M> なら <M>{'M_Y(t) = E[e^{t(aX+b)}] = e^{bt}M_X(at)'}</M>。変数変換のレッスンで、正規分布の1次式がまた正規分布になることを確かめるのに使います。
          </p>
        </MathNote>
      </Section>

      <Section title="確率母関数">
        <p>
          0, 1, 2, … の整数の値をとる確率変数（個数・回数など）には、<M>{'e^t'}</M> の代わりに s を使った<strong>確率母関数</strong>が便利です。
        </p>
        <MathBlock caption="確率母関数：s^k の係数に、ちょうど P(X = k) が並ぶ">{'G(s) = E[s^X] = \\sum_{k=0}^{\\infty} P(X = k)\\,s^k = P(X=0) + P(X=1)s + P(X=2)s^2 + \\cdots'}</MathBlock>
        <ul>
          <li>
            係数がそのまま確率なので、展開すれば分布がわかる（<M>{'P(X = k) = G^{(k)}(0)/k!'}</M>）。
          </li>
          <li>
            <M>{'G(1) = 1'}</M>（確率の合計）。<M>{"G'(s) = \\sum_k k\\,P(X = k)\\,s^{k-1}"}</M> に s = 1 を入れると <M>{"G'(1) = \\sum_k k\\,P(X = k) = E[X]"}</M>。
            もう1回微分すると <M>{"G''(1) = \\sum_k k(k-1)P(X = k) = E[X(X-1)]"}</M>。<M>{'E[X^2] = E[X(X-1)] + E[X]'}</M> なので、分散は <M>{"G''(1) + G'(1) - G'(1)^2"}</M>。微分して入れるのは s = 1（積率母関数は t = 0）。
          </li>
          <li>
            <M>{'s = e^t'}</M> とおくと積率母関数になる：<M>{'M(t) = G(e^t)'}</M>。独立な和は、こちらもかけ算：<M>{'G_{X+Y}(s) = G_X(s)G_Y(s)'}</M>。
          </li>
        </ul>
        <Example title="サイコロ2個の目の和">
          <p>
            サイコロ1個は <M>{'G(s) = \\frac{1}{6}(s + s^2 + s^3 + s^4 + s^5 + s^6)'}</M>。2個の和は <M>{'G(s)^2'}</M> で、展開すると
            <M>{'\\frac{1}{36}(s^2 + 2s^3 + 3s^4 + 4s^5 + 5s^6 + 6s^7 + 5s^8 + \\cdots + s^{12})'}</M>。<M>{'s^7'}</M> の係数から、和が 7 になる確率は 6/36 = 1/6 です。
          </p>
        </Example>
        <Figure caption="サイコロ n 個の和の分布を、確率母関数の n 乗（多項式のかけ算）で計算した。n を増やすと山の形が正規分布に近づく（中心極限定理の入口）">
          <DiceSumPgf />
        </Figure>
        <Intuition title="なぜかけ算で和の分布になるのか">
          <p>
            <M>{'s^a \\times s^b = s^{a+b}'}</M> なので、多項式をかけると「1個目が a、2個目が b」の組の確率が <M>{'s^{a+b}'}</M> の係数に集まります。
            つまり、和が同じになる組の確率を全部足す計算を、多項式のかけ算が自動でやってくれます。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              積率母関数を微分したあと、t = 1 を入れる → 積率母関数は <strong>t = 0</strong>、確率母関数は <strong>s = 1</strong>。
            </li>
            <li>
              <M>{"M''(0)"}</M> を分散だと思う → <M>{"M''(0) = E[X^2]"}</M>。分散は <M>{"M''(0) - M'(0)^2"}</M>。
            </li>
            <li>独立でないのに積率母関数をかけ算する → かけ算できるのは独立なときだけ。</li>
            <li>
              どの分布にも積率母関数がある → コーシー分布は 0 以外のどんな t でも <M>{'E[e^{tX}]'}</M> が無限大になり、対数正規分布もすべての正の t で無限大になるので、積率母関数がない。指数分布も <M>{'t < \\lambda'}</M> でだけ存在する。
            </li>
            <li>
              二項分布なら何でも足せる → <M>{'B(m, p_1) + B(n, p_2)'}</M> は、<M>{'p_1 \\ne p_2'}</M> だと二項分布にならない（積が二項分布の形にならない）。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>事実：準1級の出題範囲表（2027年1月1日版）では、モーメント母関数（積率母関数）と確率母関数が学習しておくべき用語に挙がっている。</li>
            <li>推測：積率母関数の式が与えられて、平均や分散を微分で求める問題。どの分布の積率母関数かを見抜けると、微分せずに答えられることも多い。</li>
            <li>推測：独立な確率変数の和の分布を、積率母関数のかけ算で判断する問題（ポアソン・二項・正規・ガンマの再生性）。</li>
            <li>推測：確率母関数から確率や平均を読みとる問題。微分して s = 1 を入れるのか、係数を読むのかを区別する。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
