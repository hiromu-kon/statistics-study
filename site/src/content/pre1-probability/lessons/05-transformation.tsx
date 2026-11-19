import { Link } from 'react-router-dom'
import { Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BoxCoxPlot } from '../figures/BoxCoxPlot'
import { ConvolutionTriangle } from '../figures/ConvolutionTriangle'
import { ProbabilityStrips } from '../figures/ProbabilityStrips'

export const meta: LessonMeta = {
  id: 'pre1-probability-transformation',
  chapter: 'pre1-probability',
  order: 5,
  title: '変数変換',
  summary: 'X の分布がわかっているとき、Y = g(X) の分布を求める方法です。累積分布関数から求める方法と、密度の公式 f_Y(y) = f_X(x)|dx/dy| を学び、確率変数の線形結合の分布、2変数の変換、Box-Cox 変換に進みます。',
  minutes: 50,
  keywords: ['変数変換', '確率変数の線形結合の分布', 'Box-Cox変換'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>変数変換</strong>は、「X の分布がわかっているとき、X から計算した Y = g(X) の分布を求める」ことです。基本は2つです。
        </p>
        <ul>
          <li>
            <strong>累積分布関数から</strong>：<M>{'F_Y(y) = P(g(X) \\le y)'}</M> を X の確率に言いかえて計算し、微分して密度にする。どんな g でも使える。
          </li>
          <li>
            <strong>密度の公式</strong>：g が増え続ける（または減り続ける）なら <M>{'f_Y(y) = f_X(x)\\left|\\frac{dx}{dy}\\right|'}</M>。
            確率は保たれたまま、幅が伸びたところでは密度が薄まり、縮んだところでは濃くなる。
          </li>
        </ul>
      </Point>

      <Section title="どんなときに使うか">
        <ul>
          <li>単位や基準を変える（摂氏 → 華氏、点数の標準化）：1次式の変換。</li>
          <li>正規分布にしたがう量を2乗する：カイ二乗分布が出てくる（標本分散の分布の出発点）。</li>
          <li>対数をとる・指数をとる：対数正規分布、Box-Cox 変換。</li>
          <li>コンピュータで乱数を作る：0〜1 の一様乱数を変換して、指数分布などの乱数にする。</li>
        </ul>
      </Section>

      <Section title="累積分布関数から求める">
        <Example title="X が 0〜1 の一様分布、Y = X² の分布">
          <Steps>
            <li>
              Y のとる範囲を確かめる：X が 0〜1 なので Y も 0〜1。
            </li>
            <li>
              累積分布関数を X の言葉に直す（0 &lt; y &lt; 1）：<M>{'F_Y(y) = P(X^2 \\le y) = P(X \\le \\sqrt{y}) = \\sqrt{y}'}</M>（X は 0 以上なので、<M>{'X^2 \\le y'}</M> は <M>{'X \\le \\sqrt{y}'}</M> と同じ）。
            </li>
            <li>
              微分して密度にする：<M>{"f_Y(y) = F_Y'(y) = \\frac{1}{2\\sqrt{y}}"}</M>（<M>{'\\sqrt{y} = y^{1/2}'}</M> を微分すると <M>{'\\frac{1}{2}y^{-1/2}'}</M>）。
            </li>
          </Steps>
          <p>
            X は 0〜1 にまんべんなく散らばるのに、Y は 0 の近くに集まります。0.1 の2乗は 0.01、0.5 の2乗は 0.25 と、小さい値ほど 0 のほうに押しこまれるからです。
          </p>
        </Example>
        <Example title="一様乱数から指数分布の乱数を作る">
          <p>
            U が 0〜1 の一様分布のとき、<M>{'Y = -\\log U'}</M> の分布を求めます（log は自然対数）。Y は 0 以上の値をとります。
          </p>
          <Steps>
            <li>
              <M>{'F_Y(y) = P(-\\log U \\le y) = P(\\log U \\ge -y) = P(U \\ge e^{-y})'}</M>。1つ目の等号は両辺に −1 をかけたので不等号の向きが逆になる。
              2つ目は両辺を「e の何乗」にした（<M>{'e^{\\log U} = U'}</M>）もので、<M>{'e^x'}</M> は増える関数なので向きはそのまま。
            </li>
            <li>
              U は一様分布なので <M>{'P(U \\ge e^{-y}) = 1 - e^{-y}'}</M>。これは平均 1 の指数分布の累積分布関数。
            </li>
          </Steps>
          <p>
            一般に、F の<Link to="/lessons/pre1-probability-moments">分位点関数</Link> Q を使って <M>{'Y = Q(U)'}</M> とすると、Y の累積分布関数は F になります（<strong>逆変換法</strong>）。
            <M>{'P(Q(U) \\le y) = P(U \\le F(y)) = F(y)'}</M> だからです。
          </p>
        </Example>
      </Section>

      <Section title="定義・式：密度の公式">
        <p>
          g が増え続ける関数のとき、<M>{'y = g(x)'}</M> を x について解いたもの（逆関数）を <M>{'x = g^{-1}(y)'}</M> とします。
          <M>{'F_Y(y) = P(X \\le g^{-1}(y)) = F_X(g^{-1}(y))'}</M> を y で微分すると、合成関数の微分（<Link to="/lessons/pre1-math-derivative">微分</Link>）で
          「<M>{'F_X'}</M> の微分 × 中身の微分」になり、<M>{"F_X' = f_X"}</M> なので <M>{'f_Y(y) = f_X(x)\\,\\frac{dx}{dy}'}</M> です。
          g が減り続ける関数なら <M>{'F_Y(y) = P(X \\ge g^{-1}(y)) = 1 - F_X(g^{-1}(y))'}</M> で、微分すると <M>{'-f_X(x)\\,\\frac{dx}{dy}'}</M>。このとき dx/dy は負なので、どちらの場合も次の式にまとまります。
        </p>
        <MathBlock caption="1変数の変数変換の公式（g が増え続けるか減り続けるとき）。減る関数のときは dx/dy が負になるので絶対値をつける">
          {'f_Y(y) = f_X\\big(g^{-1}(y)\\big)\\left|\\frac{dx}{dy}\\right|, \\qquad x = g^{-1}(y)'}
        </MathBlock>
        <p>
          Y = X²（X は 0〜1）で確かめると、<M>{'x = \\sqrt{y}'}</M>、<M>{'\\frac{dx}{dy} = \\frac{1}{2\\sqrt{y}}'}</M>、<M>{'f_X = 1'}</M> なので <M>{'f_Y(y) = \\frac{1}{2\\sqrt{y}}'}</M>。累積分布関数から求めたものと一致します。
        </p>
        <Figure caption="左：x 軸を確率 0.1 ずつの10本の帯に分け、y = x^a で y 軸に移す。右：移った区間の幅で確率 0.1 を割ると密度。帯の高さが公式の曲線に重なる。a を変えて、幅が縮むところで密度が高くなることを確かめる">
          <ProbabilityStrips />
        </Figure>
        <Intuition title="確率は「保存」される">
          <p>
            x の小さな区間 dx に入る確率 <M>{'f_X(x)\\,dx'}</M> は、変換したあとの y の区間 dy に入る確率 <M>{'f_Y(y)\\,dy'}</M> と同じです。
            同じ量の砂を、広い区間にまけば薄く（密度が低く）、狭い区間に寄せれば厚く（密度が高く）なります。<M>{'|dx/dy|'}</M> はその「伸び縮みの倍率」です。
          </p>
        </Intuition>
        <Example title="1次式と対数正規分布">
          <ul>
            <li>
              <strong>Y = aX + b</strong>（a ≠ 0）：<M>{'x = \\frac{y - b}{a}'}</M>、<M>{'\\left|\\frac{dx}{dy}\\right| = \\frac{1}{|a|}'}</M> なので <M>{'f_Y(y) = \\frac{1}{|a|}f_X\\left(\\frac{y-b}{a}\\right)'}</M>。
              X が <M>{'N(\\mu, \\sigma^2)'}</M> なら、指数の中は <M>{'\\frac{1}{\\sigma^2}\\left(\\frac{y - b}{a} - \\mu\\right)^2 = \\frac{(y - b - a\\mu)^2}{a^2\\sigma^2}'}</M>（かっこの中を通分して a でくくり出す）、
              前の係数は <M>{'\\frac{1}{|a|}\\cdot\\frac{1}{\\sqrt{2\\pi}\\,\\sigma} = \\frac{1}{\\sqrt{2\\pi}\\,|a|\\sigma}'}</M> となり、平均 <M>{'a\\mu + b'}</M>・標準偏差 <M>{'|a|\\sigma'}</M> の正規分布の密度の形です。
              つまり Y は <M>{'N(a\\mu + b, a^2\\sigma^2)'}</M>（<Link to="/lessons/random-variables-linear-transform">2級の1次変換</Link>の平均・分散と合う）。
            </li>
            <li>
              <strong>Y = e^X</strong>（X が <M>{'N(\\mu, \\sigma^2)'}</M>）：<M>{'x = \\log y'}</M>、<M>{'\\frac{dx}{dy} = \\frac{1}{y}'}</M> なので
              <M>{'f_Y(y) = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma y}\\exp\\left\\{-\\frac{(\\log y - \\mu)^2}{2\\sigma^2}\\right\\}'}</M>（y &gt; 0）。これが<strong>対数正規分布</strong>です。
            </li>
          </ul>
        </Example>
        <MathNote title="増えたり減ったりする変換：Z² はカイ二乗分布">
          <p>
            Z が標準正規分布、<M>{'Y = Z^2'}</M> のとき、y の値に対応する z が <M>{'\\pm\\sqrt{y}'}</M> の2つあるので公式はそのまま使えません。累積分布関数から求めます（y &gt; 0）。
          </p>
          <Steps>
            <li>
              <M>{'F_Y(y) = P(-\\sqrt{y} \\le Z \\le \\sqrt{y}) = \\Phi(\\sqrt{y}) - \\Phi(-\\sqrt{y})'}</M>（Φ は標準正規分布の累積分布関数）
            </li>
            <li>
              微分する（合成関数の微分。<M>{"\\Phi' = \\phi"}</M>、<M>{"(\\sqrt{y})' = \\frac{1}{2\\sqrt{y}}"}</M>、<M>{"(-\\sqrt{y})' = -\\frac{1}{2\\sqrt{y}}"}</M>）：
              <M>{'f_Y(y) = \\phi(\\sqrt{y})\\frac{1}{2\\sqrt{y}} - \\phi(-\\sqrt{y})\\left(-\\frac{1}{2\\sqrt{y}}\\right) = \\frac{\\phi(\\sqrt{y})}{\\sqrt{y}}'}</M>（φ は標準正規分布の密度で、左右対称なので <M>{'\\phi(-\\sqrt{y}) = \\phi(\\sqrt{y})'}</M>）
            </li>
            <li>
              <M>{'\\phi(\\sqrt{y}) = \\frac{1}{\\sqrt{2\\pi}}e^{-y/2}'}</M> を入れて <M>{'f_Y(y) = \\frac{1}{\\sqrt{2\\pi y}}e^{-y/2}'}</M>。これが自由度 1 のカイ二乗分布（<Link to="/lessons/sampling-chi2-t-f">2級のカイ二乗分布</Link>）。
            </li>
          </Steps>
        </MathNote>
      </Section>

      <Section title="確率変数の線形結合の分布">
        <p>
          <M>{'aX + bY'}</M> のような「定数倍して足したもの」を<strong>線形結合</strong>といいます。平均と分散は分布の形によらず次の式で求まります（<Link to="/lessons/random-variables-sum-covariance">2級の和と共分散</Link>）。
        </p>
        <MathBlock caption="線形結合の平均と分散（どんな分布でも成り立つ）。独立なら共分散の項は 0">
          {'E[aX + bY] = aE[X] + bE[Y], \\qquad V[aX + bY] = a^2V[X] + b^2V[Y] + 2ab\\,\\mathrm{Cov}(X, Y)'}
        </MathBlock>
        <p>
          分布の<strong>形</strong>までわかるのは特別な場合です。いちばん大事なのが正規分布で、<strong>独立な正規分布の線形結合はまた正規分布</strong>になります（正規分布の再生性）。
        </p>
        <MathBlock caption="独立な正規分布の線形結合の分布">
          {'X \\sim N(\\mu_1, \\sigma_1^2),\\ Y \\sim N(\\mu_2, \\sigma_2^2) \\ \\Rightarrow \\ aX + bY \\sim N(a\\mu_1 + b\\mu_2,\\ a^2\\sigma_1^2 + b^2\\sigma_2^2)'}
        </MathBlock>
        <MathNote title="積率母関数で確かめる">
          <p>
            独立なので <M>{'M_{aX+bY}(t) = E[e^{atX}]E[e^{btY}] = M_X(at)M_Y(bt)'}</M>（<Link to="/lessons/pre1-probability-mgf">積率母関数のレッスン</Link>）。正規分布の積率母関数を入れると
          </p>
          <MathBlock>{'\\exp\\left(a\\mu_1 t + \\frac{a^2\\sigma_1^2 t^2}{2}\\right)\\exp\\left(b\\mu_2 t + \\frac{b^2\\sigma_2^2 t^2}{2}\\right) = \\exp\\left((a\\mu_1 + b\\mu_2)t + \\frac{(a^2\\sigma_1^2 + b^2\\sigma_2^2)t^2}{2}\\right)'}</MathBlock>
          <p>右辺は平均 <M>{'a\\mu_1 + b\\mu_2'}</M>、分散 <M>{'a^2\\sigma_1^2 + b^2\\sigma_2^2'}</M> の正規分布の積率母関数です。</p>
        </MathNote>
        <Example title="2つの部品をつなぐ">
          <p>
            部品 A の長さ X が <M>{'N(30, 0.4^2)'}</M>、部品 B の長さ Y が <M>{'N(20, 0.3^2)'}</M> で独立です。つないだ長さ X + Y が 51 を超える確率は？
          </p>
          <Steps>
            <li>
              平均 <M>{'30 + 20 = 50'}</M>、分散 <M>{'0.16 + 0.09 = 0.25'}</M>、標準偏差 0.5。X + Y は <M>{'N(50, 0.5^2)'}</M>。
            </li>
            <li>
              <M>{'P(X + Y > 51) = P\\left(Z > \\frac{51 - 50}{0.5}\\right) = P(Z > 2) = 0.0228'}</M>。
            </li>
          </Steps>
          <p className="small muted">差 X − Y でも分散は足し算（<M>{'(-1)^2 = 1'}</M>）。標準偏差を足して 0.7 とするのはまちがいです。</p>
        </Example>
      </Section>

      <Section title="2変数の変数変換（基本形）">
        <p>
          (X, Y) から1対1に (U, V) を作るときは、1変数の <M>{'|dx/dy|'}</M> の代わりに<strong>ヤコビアン</strong>（偏微分を並べた行列の行列式）の絶対値をかけます。
          偏微分は<Link to="/lessons/pre1-math-multivariable">「偏微分と重積分」</Link>、行列式は<Link to="/lessons/pre1-math-matrix">「ベクトルと行列」</Link>で確認してください。
        </p>
        <MathBlock caption="2変数の変数変換。x = x(u, v)、y = y(u, v) は (u, v) から (x, y) へ戻す式">
          {'f_{U,V}(u, v) = f_{X,Y}\\big(x(u, v),\\, y(u, v)\\big)\\,|J|, \\qquad J = \\det\\begin{pmatrix} \\dfrac{\\partial x}{\\partial u} & \\dfrac{\\partial x}{\\partial v} \\\\[2mm] \\dfrac{\\partial y}{\\partial u} & \\dfrac{\\partial y}{\\partial v} \\end{pmatrix}'}
        </MathBlock>
        <Example title="独立な指数分布の和と比">
          <p>
            X、Y が独立に平均 1 の指数分布にしたがうとき、<M>{'U = X + Y'}</M>、<M>{'V = \\frac{X}{X + Y}'}</M> とします。
          </p>
          <Steps>
            <li>
              戻す式：<M>{'x = uv'}</M>、<M>{'y = u(1 - v)'}</M>（u &gt; 0、0 &lt; v &lt; 1）。
            </li>
            <li>
              偏微分：x = uv から <M>{'\\frac{\\partial x}{\\partial u} = v'}</M>、<M>{'\\frac{\\partial x}{\\partial v} = u'}</M>。y = u − uv から <M>{'\\frac{\\partial y}{\\partial u} = 1 - v'}</M>、<M>{'\\frac{\\partial y}{\\partial v} = -u'}</M>（偏微分は、ほかの文字を定数とみて微分する）。
            </li>
            <li>
              ヤコビアン（2 × 2 の行列式は「左上 × 右下 − 右上 × 左下」）：<M>{'J = \\det\\begin{pmatrix} v & u \\\\ 1 - v & -u \\end{pmatrix} = v(-u) - u(1 - v) = -uv - u + uv = -u'}</M>、<M>{'|J| = u'}</M>。
            </li>
            <li>
              代入：<M>{'f_{X,Y}(x, y) = e^{-x}e^{-y} = e^{-(x+y)} = e^{-u}'}</M> なので <M>{'f_{U,V}(u, v) = u\\,e^{-u}'}</M>。
            </li>
            <li>
              u だけの式 × v だけの式（定数 1）で、範囲も長方形。よって U と V は独立で、U の密度は <M>{'u\\,e^{-u}'}</M>（ガンマ分布、形状 2）、V は 0〜1 の一様分布。
            </li>
          </Steps>
        </Example>
        <p>
          和 <M>{'U = X + Y'}</M> だけがほしいときは、<M>{'V = Y'}</M> とおくと <M>{'x = u - v'}</M>、<M>{'y = v'}</M>、<M>{'|J| = 1'}</M> で、V について積分すれば U の密度が出ます。
          独立なら次の<strong>たたみこみ</strong>の式になります。
        </p>
        <MathBlock caption="独立な X と Y の和の密度（たたみこみ）">{'f_{X+Y}(u) = \\int_{-\\infty}^{\\infty} f_X(u - v)\\,f_Y(v)\\,dv'}</MathBlock>
        <Figure caption="X、Y が独立に 0〜1 の一様分布なら、積分は「2つの範囲が重なる長さ」。u を動かすと、重なりは 0 から 1 へ増え、また 0 へ減るので、和の密度は三角形になる">
          <ConvolutionTriangle />
        </Figure>
      </Section>

      <Section title="Box-Cox 変換">
        <p>
          収入・売上・反応時間のような正の値のデータは、右に裾が長いことがよくあります。そのままでは、正規分布を前提にした t 検定や回帰分析の仮定に合いにくくなります。
          そこで、<strong>データを変換して、正規分布に近い形（左右対称で、グループによって散らばりが変わらない形）にする</strong>ために使うのが Box-Cox 変換です。
        </p>
        <MathBlock caption="Box-Cox 変換（y > 0）。λ = 0 のときは対数で、λ が 0 に近づくときの極限になっている">
          {'y^{(\\lambda)} = \\begin{cases} \\dfrac{y^{\\lambda} - 1}{\\lambda} & (\\lambda \\ne 0) \\\\[2mm] \\log y & (\\lambda = 0) \\end{cases}'}
        </MathBlock>
        <ul>
          <li>λ = 1：y − 1（形は変わらない。ずらすだけ）</li>
          <li>λ = 0.5：<M>{'2(\\sqrt{y} - 1)'}</M>（平方根に近い。裾を少し縮める）</li>
          <li>λ = 0：log y（対数。裾を大きく縮める）</li>
          <li>λ = −1：<M>{'1 - 1/y'}</M>（逆数に近い。もっと強く縮める）</li>
        </ul>
        <p>
          λ = 0 を対数にする理由は、<M>{'y^{\\lambda} = e^{\\lambda \\log y} \\approx 1 + \\lambda \\log y'}</M>（λ が 0 に近いとき。<M>{'e^x \\approx 1 + x'}</M>）から
          <M>{'\\frac{y^{\\lambda} - 1}{\\lambda} \\approx \\log y'}</M> となり、λ → 0 の極限が log y になるからです。
          λ が小さいほど、大きな値を強く押し縮めます。−1 を引いて λ で割るのは、どの λ でも y = 1 で値 0・傾き 1 になるようにそろえ、λ を連続的に動かせるようにするためです。
          λ は、変換後のデータが正規分布にいちばんよく合う値を、最尤法などでデータから選ぶのがふつうです
          （<a href="https://itl.nist.gov/div898/handbook/eda/section3/boxcoxno.htm" target="_blank" rel="noreferrer">NIST/SEMATECH e-Handbook「Box-Cox Normality Plot」</a>）。
        </p>
        <Figure caption="左：λ ごとの変換の形。どれも y = 1 で 0 を通る。右：右に裾の長いデータ（対数正規分布から作った 600 個）を変換したヒストグラム。λ を 0 に近づけると左右対称に近づき、歪度が 0 に近くなる">
          <BoxCoxPlot />
        </Figure>
        <Note title="Box-Cox 変換の注意">
          <ul>
            <li>y &gt; 0 のデータにしか使えない。0 や負の値があるときは、定数を足してから使うなどの工夫がいる。</li>
            <li>変換後の平均や区間を、もとの単位に戻して解釈するときは注意がいる（たとえば log の平均を指数で戻すと、もとの平均ではなく幾何平均に近いものになる）。</li>
          </ul>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'f_Y(y) = f_X(g^{-1}(y))'}</M> と、<M>{'|dx/dy|'}</M> をかけ忘れる → 全体の面積が 1 にならなくなる。積分して 1 になるか確かめる習慣をつける。
            </li>
            <li>Y のとる範囲を書き忘れる・まちがえる（Y = X² で X が −1〜1 なら Y は 0〜1、など）。</li>
            <li>増えたり減ったりする g に公式をそのまま使う → 累積分布関数から求めるか、対応する x をすべて足す。</li>
            <li>
              ヤコビアンを (u, v) を x、y で微分した行列で計算する → 公式のヤコビアンは「x、y を u、v で微分」。逆向きで計算したなら、その逆数を使う。
            </li>
            <li>
              <M>{'V[X - Y] = V[X] - V[Y]'}</M> とする → 独立なら <M>{'V[X] + V[Y]'}</M>。
            </li>
            <li>独立でない正規分布どうしでも、正規分布の再生性の分散の式をそのまま使う → 共分散の項 <M>{'2ab\\,\\mathrm{Cov}(X, Y)'}</M> が必要。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>事実：準1級の出題範囲表（2027年1月1日版）では、変数変換、確率変数の線形結合の分布、Box-Cox 変換が学習しておくべき用語に挙がっている。</li>
            <li>推測：一様分布・指数分布・正規分布にしたがう X を変換した Y（2乗、対数、逆数、1次式など）の密度を選ぶ問題。</li>
            <li>推測：独立な正規分布の線形結合（差や平均など）の確率を、標準正規分布表で求める問題。</li>
            <li>推測：Box-Cox 変換の式や、λ = 0 が対数変換にあたること、何のために使うかを問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
