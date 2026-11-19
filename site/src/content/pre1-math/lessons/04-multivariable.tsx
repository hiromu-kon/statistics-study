import { Link } from 'react-router-dom'
import { Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { ContourFigure, DoubleIntegralFigure, StretchFigure } from '../figures/MultivariableFigures'

export const meta: LessonMeta = {
  id: 'pre1-math-multivariable',
  chapter: 'pre1-math',
  order: 4,
  title: '偏微分と重積分',
  summary: '変数が2つある関数を等高線で見て、1つずつ動かして微分する偏微分、2つのパラメータの最尤推定、同時密度を2回積分して確率・周辺密度を求める重積分、変数変換のヤコビアンを学びます。',
  minutes: 60,
  keywords: ['偏微分', '重積分', '同時確率密度関数', '周辺確率密度関数', 'ヤコビアン'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          変数が2つあっても、やることは「<strong>1つずつ</strong>」です。<strong>偏微分</strong>は「ほかの変数を定数とみなして、1つの変数で微分する」こと、
          <strong>重積分</strong>は「1つの変数で積分してから、もう1つの変数で積分する」ことです。
          統計では、正規分布の μ と σ² を同時に推定する（偏微分）、2つの確率変数の同時密度から確率を出す（重積分）、という場面で使います。
        </p>
      </Point>

      <Section title="2変数関数を地図の等高線で見る">
        <p>
          <M>{'f(x, y)'}</M> は「x と y の2つを決めると値が1つ決まる」関数です。地図にたとえると、x が東西、y が南北の位置、f がその場所の<strong>高さ</strong>です。
          同じ高さの場所を結んだ線が<strong>等高線</strong>です。
        </p>
        <p>
          たとえば <M>{'f(x, y) = 10 - (x - 2)^2 - 2(y - 1)^2'}</M> は、(2, 1) が頂上（高さ 10）で、そこから離れるほど低くなる山です。
          等高線は頂上を囲む楕円になります。
        </p>
        <Figure caption="点 (x₀, y₀) を動かしてみよう。上は等高線の地図、矢印はその点での x 方向・y 方向の傾き。下は「y を y₀ に固定して x だけ動かした断面」で、その接線の傾きが ∂f/∂x">
          <ContourFigure />
        </Figure>
      </Section>

      <Section title="偏微分：1つの変数だけ動かす">
        <p>
          山の斜面に立って「東（x の向き）へ一歩進むとどれだけ上るか」を考えます。このとき南北の位置 y は動かさないので、y は<strong>定数</strong>として扱います。
          こうして x だけで微分したものを <M>{'\\frac{\\partial f}{\\partial x}'}</M>（「ラウンド f ラウンド x」などと読む）と書き、<strong>x についての偏微分</strong>といいます。
        </p>
        <MathBlock caption="偏微分：y を止めて x で微分／x を止めて y で微分">{'\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h, y) - f(x, y)}{h}, \\qquad \\frac{\\partial f}{\\partial y} = \\lim_{h \\to 0} \\frac{f(x, y + h) - f(x, y)}{h}'}</MathBlock>
        <p>計算は、<Link to="/lessons/pre1-math-derivative">1変数の微分</Link>の公式がそのまま使えます。止めた変数は、5 や 3 のような数と同じ扱いです。</p>
        <Example title="偏微分を計算する">
          <p>
            <M>{'f(x, y) = x^2 y + 3y^2'}</M> を偏微分します。
          </p>
          <Steps>
            <li>
              x で偏微分（y は定数）：<M>{'x^2 y'}</M> は「<M>{'y \\times x^2'}</M>」なので <M>{'2xy'}</M>。<M>{'3y^2'}</M> は x を含まない定数なので 0。よって <M>{'\\frac{\\partial f}{\\partial x} = 2xy'}</M>
            </li>
            <li>
              y で偏微分（x は定数）：<M>{'x^2 y'}</M> は「<M>{'x^2 \\times y'}</M>」なので <M>{'x^2'}</M>。<M>{'3y^2'}</M> は <M>{'6y'}</M>。よって <M>{'\\frac{\\partial f}{\\partial y} = x^2 + 6y'}</M>
            </li>
            <li>
              点 (1, 2) では <M>{'\\frac{\\partial f}{\\partial x} = 2 \\times 1 \\times 2 = 4'}</M>、<M>{'\\frac{\\partial f}{\\partial y} = 1 + 12 = 13'}</M>
            </li>
          </Steps>
        </Example>
        <p>
          山の頂上では、どちらの方向にも平らです。だから<strong>頂上を探すには、2つの偏微分を両方 0 とおいた連立方程式を解きます</strong>。
          上の山 <M>{'f(x, y) = 10 - (x - 2)^2 - 2(y - 1)^2'}</M> なら、x で偏微分するとき <M>{'2(y - 1)^2'}</M> は定数なので 0、<M>{'(x - 2)^2'}</M> は<Link to="/lessons/pre1-math-derivative">チェーンルール</Link>で <M>{'2(x - 2) \\times 1'}</M> です。
          よって <M>{'\\frac{\\partial f}{\\partial x} = -2(x - 2) = 0'}</M>、同じように <M>{'\\frac{\\partial f}{\\partial y} = -2 \\times 2(y - 1) = -4(y - 1) = 0'}</M> より、頂上は (2, 1) です。
        </p>
      </Section>

      <Section title="2つのパラメータの最尤推定：正規分布の μ と σ²">
        <p>
          データ <M>{'x_1, \\ldots, x_n'}</M> が正規分布 <M>{'N(\\mu, \\sigma^2)'}</M> に従うとして、μ と σ² の両方を<Link to="/lessons/pre1-math-exp-log">最尤法</Link>で推定します。
          計算を見やすくするため、<M>{'v = \\sigma^2'}</M> と1文字で書きます。
        </p>
        <MathBlock caption="正規分布の対数尤度（各データの密度の log を足したもの）">{'\\log L(\\mu, v) = -\\frac{n}{2} \\log(2\\pi v) - \\frac{1}{2v} \\sum_{i=1}^{n} (x_i - \\mu)^2'}</MathBlock>
        <MathNote title="この式の出どころ">
          <p>
            正規分布の密度は <M>{'f(x) = \\frac{1}{\\sqrt{2\\pi v}} e^{-\\frac{(x - \\mu)^2}{2v}}'}</M>。log をとると <M>{'-\\frac{1}{2}\\log(2\\pi v) - \\frac{(x - \\mu)^2}{2v}'}</M>
            （<M>{'\\frac{1}{\\sqrt{a}} = a^{-\\frac{1}{2}}'}</M> と <M>{'\\log e^{b} = b'}</M> を使った）。これを n 個足すと上の式です。
          </p>
        </MathNote>
        <Steps>
          <li>
            μ で偏微分（v は定数）：<M>{'(x_i - \\mu)^2'}</M> を μ で微分すると <M>{'-2(x_i - \\mu)'}</M>（チェーンルール）なので
            <M>{'\\frac{\\partial}{\\partial \\mu} \\log L = -\\frac{1}{2v} \\sum \\{-2(x_i - \\mu)\\} = \\frac{1}{v} \\sum (x_i - \\mu)'}</M>（1項目 <M>{'-\\frac{n}{2}\\log(2\\pi v)'}</M> は μ を含まないので 0）。
            0 とおくと、<M>{'\\sum (x_i - \\mu) = \\sum x_i - n\\mu'}</M>（μ を n 回引く）なので <M>{'\\sum x_i - n\\mu = 0'}</M>、<M>{'\\hat{\\mu} = \\frac{1}{n}\\sum x_i = \\bar{x}'}</M>
          </li>
          <li>
            v で偏微分（μ は定数）：<M>{'\\log(2\\pi v) = \\log 2\\pi + \\log v'}</M> で <M>{'\\log 2\\pi'}</M> は定数なので、<M>{'-\\frac{n}{2}\\log(2\\pi v)'}</M> の微分は <M>{'-\\frac{n}{2} \\times \\frac{1}{v} = -\\frac{n}{2v}'}</M>。
            <M>{'-\\frac{1}{2v} = -\\frac{1}{2} v^{-1}'}</M> の微分は <M>{'-\\frac{1}{2} \\times (-1) v^{-2} = \\frac{1}{2v^2}'}</M>（<M>{'\\sum (x_i - \\mu)^2'}</M> は v を含まないので定数倍として残る）なので
            <M>{'\\frac{\\partial}{\\partial v} \\log L = -\\frac{n}{2v} + \\frac{1}{2v^2} \\sum (x_i - \\mu)^2'}</M>
          </li>
          <li>
            0 とおいて両辺に <M>{'2v^2'}</M> をかける：<M>{'-nv + \\sum (x_i - \\mu)^2 = 0'}</M>。μ に <M>{'\\hat{\\mu} = \\bar{x}'}</M> を入れて <M>{'\\hat{v} = \\frac{1}{n}\\sum (x_i - \\bar{x})^2'}</M>
          </li>
        </Steps>
        <Example title="数値で確かめる">
          <p>
            データ 4, 6, 8 なら、<M>{'\\hat{\\mu} = 6'}</M>、<M>{'\\hat{\\sigma}^2 = \\frac{(4 - 6)^2 + 0^2 + (8 - 6)^2}{3} = \\frac{8}{3} \\approx 2.67'}</M>。
          </p>
        </Example>
        <Pitfall title="最尤推定量の σ² は n で割る">
          <p>
            正規分布の σ² の最尤推定量は <strong>n で割った</strong>分散（標本分散）で、2級の<Link to="/lessons/estimation-point">不偏分散</Link>（n − 1 で割る）とは違います。
            最尤推定量は不偏とは限らない、という準1級の大事な例です。
            なお「標本分散」という言葉は、本によって n で割るものを指したり n − 1 で割るもの（不偏分散）を指したりするので、式で確かめましょう。
          </p>
        </Pitfall>
      </Section>

      <Section title="重積分：同時密度から確率を求める">
        <p>
          2つの連続な確率変数 X, Y を組で考えるときは、<strong>同時確率密度関数</strong> <M>{'f(x, y)'}</M> を使います（2級の<Link to="/lessons/random-variables-sum-covariance">同時分布</Link>の連続版）。
          1変数では「曲線の下の<strong>面積</strong>」が確率でしたが、2変数では「曲面の下の<strong>体積</strong>」が確率です。
        </p>
        <MathBlock caption="長方形の範囲に入る確率は、y で積分してから x で積分する（内側から計算）">{'P(a \\le X \\le b,\\ c \\le Y \\le d) = \\int_a^b \\left( \\int_c^d f(x, y)\\,dy \\right) dx'}</MathBlock>
        <p>
          内側の <M>{'\\int_c^d f(x, y)\\,dy'}</M> は「x を止めて、y の方向に積分する」ので、偏微分と同じく x を定数として扱います。結果は x だけの式になり、それを x で積分します。
          かっこを省いて <M>{'\\int_a^b \\int_c^d f(x, y)\\,dy\\,dx'}</M> とも書きます。このときは、内側の ∫ と内側の dy が組になり、外側の ∫ と外側の dx が組になります。
        </p>
        <Example title="f(x, y) = x + y（0 ≤ x ≤ 1, 0 ≤ y ≤ 1）">
          <p>まず、全体の体積が 1 になっていることを確かめます。</p>
          <Steps>
            <li>
              内側（x は定数）：<M>{'\\int_0^1 (x + y)\\,dy = \\Big[\\,xy + \\frac{y^2}{2}\\,\\Big]_0^1 = x + \\frac{1}{2}'}</M>
            </li>
            <li>
              外側：<M>{'\\int_0^1 \\left(x + \\frac{1}{2}\\right) dx = \\Big[\\,\\frac{x^2}{2} + \\frac{x}{2}\\,\\Big]_0^1 = \\frac{1}{2} + \\frac{1}{2} = 1'}</M>
            </li>
          </Steps>
          <p>
            次に <M>{'P(X \\le \\frac{1}{2},\\ Y \\le \\frac{1}{2})'}</M> を求めます。
          </p>
          <Steps>
            <li>
              内側：<M>{'\\int_0^{1/2} (x + y)\\,dy = \\Big[\\,xy + \\frac{y^2}{2}\\,\\Big]_0^{1/2} = \\frac{x}{2} + \\frac{1}{8}'}</M>
            </li>
            <li>
              外側：<M>{'\\int_0^{1/2} \\left(\\frac{x}{2} + \\frac{1}{8}\\right) dx = \\Big[\\,\\frac{x^2}{4} + \\frac{x}{8}\\,\\Big]_0^{1/2} = \\frac{1}{16} + \\frac{1}{16} = \\frac{1}{8}'}</M>
            </li>
          </Steps>
        </Example>
        <Figure caption="a と b を動かしてみよう。濃いところほど密度が高い。長方形の上の体積が確率。x + y は右上ほど濃いので、同じ広さでも右上の長方形のほうが確率が大きい">
          <DoubleIntegralFigure />
        </Figure>
        <Note title="独立なら、積分が2つに分かれる">
          <p>
            <M>{'f(x, y) = 4xy = 2x \\times 2y'}</M> のように「x だけの式 × y だけの式」に分かれるとき、X と Y は<strong>独立</strong>で、
            確率も <M>{'P(X \\le a, Y \\le b) = \\int_0^a 2x\\,dx \\times \\int_0^b 2y\\,dy = a^2 b^2'}</M> とかけ算に分かれます。
            ただし、値をとる範囲も「x の範囲 × y の範囲」の長方形（ここでは 0 ≤ x ≤ 1, 0 ≤ y ≤ 1）になっている必要があります。範囲が三角形（たとえば 0 ≤ y ≤ x ≤ 1）だと、式が分かれて見えても独立ではありません。
          </p>
        </Note>
        <h3>周辺密度：もう一方の変数で積分して消す</h3>
        <p>
          X だけの密度（<strong>周辺確率密度関数</strong>）は、y について全部の範囲で積分すると求まります。
          2級の<Link to="/lessons/bivariate-cross-table">クロス集計表</Link>で、行ごとに横に足して「合計」の列を作ったのと同じ考え方です。
        </p>
        <MathBlock caption="周辺密度：y について全部積分して、y を消す">{'f_X(x) = \\int_{-\\infty}^{\\infty} f(x, y)\\,dy'}</MathBlock>
        <p>
          上の <M>{'f(x, y) = x + y'}</M> なら、1つ目の計算そのままで <M>{'f_X(x) = x + \\frac{1}{2}'}</M>（0 ≤ x ≤ 1）。0 から 1 まで積分すると 1 になり、確かに密度になっています。
        </p>
        <h3>範囲が長方形でないとき</h3>
        <p>
          「Y ≤ X となる確率」のように範囲が三角形のときは、<strong>内側の積分の範囲が x によって変わります</strong>。
          <M>{'f(x, y) = 4xy'}</M>（0 ≤ x, y ≤ 1）で <M>{'P(Y \\le X)'}</M> を求めると、x を止めたとき y は 0 から x まで動くので
        </p>
        <MathBlock>{'\\int_0^1 \\left( \\int_0^x 4xy\\,dy \\right) dx = \\int_0^1 \\Big[\\,2xy^2\\,\\Big]_0^x\\,dx = \\int_0^1 2x^3\\,dx = \\Big[\\,\\frac{x^4}{2}\\,\\Big]_0^1 = \\frac{1}{2}'}</MathBlock>
        <p>X と Y が同じ分布で独立なので、どちらが大きいかは五分五分、という直感どおりです。</p>
      </Section>

      <Section title="変数変換とヤコビアン（直感だけ）">
        <p>
          X の密度がわかっているとき、<M>{'Y = 2X'}</M> のように変換した Y の密度はどうなるでしょうか。X が 0〜1 の一様分布なら、Y は 0〜2 に広がります。
          全体の面積は 1 のままなので、<strong>横に 2 倍に伸ばすと高さは 1/2 倍</strong>になります。
        </p>
        <Figure caption="倍率 c を動かしてみよう。横に c 倍に伸ばすと、面積 1 を保つために高さは 1/c 倍になる">
          <StretchFigure />
        </Figure>
        <p>
          この「高さの調整の倍率」を式で書いたのが次の公式です。y から x に戻す式 <M>{'x = h(y)'}</M> を使い、<M>{'f_X'}</M> の x にも <M>{'h(y)'}</M> を代入して、y だけの式にします。
          この形で使えるのは、<M>{'Y = X^2'}</M>（X &gt; 0）のように、x が増えると y もいつも増える（またはいつも減る）、つまり y から x がただ1つに決まる変換のときです。
        </p>
        <MathBlock caption="1変数の変数変換。|dx/dy| が「伸び縮みの調整」">{'f_Y(y) = f_X(h(y)) \\left| \\frac{dx}{dy} \\right| \\qquad (x = h(y))'}</MathBlock>
        <Example title="X の密度が 2x（0 < x < 1）のとき、Y = X² の密度">
          <Steps>
            <li>
              y から x に戻す：<M>{'x = \\sqrt{y}'}</M>（0 &lt; y &lt; 1）
            </li>
            <li>
              微分する：<M>{'\\frac{dx}{dy} = \\frac{1}{2\\sqrt{y}}'}</M>（<M>{'\\sqrt{y} = y^{1/2}'}</M> の微分）
            </li>
            <li>
              公式に入れる：<M>{'f_Y(y) = 2\\sqrt{y} \\times \\frac{1}{2\\sqrt{y}} = 1'}</M>
            </li>
          </Steps>
          <p>Y は 0〜1 の一様分布になりました。密度 2x は右ほど高い形でしたが、2乗すると右のほうが引き伸ばされて、ちょうど平らになります。</p>
        </Example>
        <p>
          2変数 <M>{'(X, Y) \\to (U, V)'}</M> の変換では、<M>{'\\frac{dx}{dy}'}</M> の代わりに、偏微分を並べた行列の<Link to="/lessons/pre1-math-matrix">行列式</Link>（<strong>ヤコビアン</strong> J）を使います。
          行列式は「面積が何倍になるか」を表すので、1変数の「長さが何倍になるか」の2次元版です。
        </p>
        <MathBlock caption="2変数の変数変換。x, y を u, v で表して、ヤコビアンの絶対値をかける">{'f_{U,V}(u, v) = f_{X,Y}(x, y)\\,|J|, \\qquad J = \\det \\begin{pmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\[4pt] \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{pmatrix}'}</MathBlock>
        <Example title="U = X + Y, V = X − Y のヤコビアン">
          <p>
            x, y について解くと（2式を足して 2 で割る、引いて 2 で割る）<M>{'x = \\frac{u + v}{2}'}</M>、<M>{'y = \\frac{u - v}{2}'}</M>。
            偏微分は <M>{'\\frac{\\partial x}{\\partial u} = \\frac{1}{2}'}</M>、<M>{'\\frac{\\partial x}{\\partial v} = \\frac{1}{2}'}</M>、<M>{'\\frac{\\partial y}{\\partial u} = \\frac{1}{2}'}</M>、<M>{'\\frac{\\partial y}{\\partial v} = -\\frac{1}{2}'}</M>。
            2 × 2 の行列式は <M>{'\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc'}</M> なので
            <M>{'J = \\det \\begin{pmatrix} 1/2 & 1/2 \\\\ 1/2 & -1/2 \\end{pmatrix} = \\frac{1}{2} \\times \\left(-\\frac{1}{2}\\right) - \\frac{1}{2} \\times \\frac{1}{2} = -\\frac{1}{2}'}</M>
            なので、<M>{'|J| = \\frac{1}{2}'}</M> をかけます。行列式の計算は<Link to="/lessons/pre1-math-matrix">ベクトルと行列</Link>で練習します。
          </p>
        </Example>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="偏微分は「断面の傾き」、重積分は「薄切りの面積を足す」">
          <p>
            偏微分は、山を東西にまっすぐ切った断面（上の下側の図）の傾きです。重積分は、山を薄く切って、各断面の面積（内側の積分）を足し合わせて体積にする（外側の積分）計算です。
            どちらも「2次元のものを、1次元に切って考える」という同じ発想です。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              偏微分で、止めているほうの変数まで微分してしまう → <M>{'\\frac{\\partial}{\\partial x}(x^2 y) = 2xy'}</M>。y は数と同じ。
            </li>
            <li>
              重積分の内側の結果に、積分したほうの変数が残る → 内側を y で積分したら、y には範囲の端の値を代入して消す。
            </li>
            <li>範囲が三角形なのに、内側の範囲を 0〜1 の定数にしてしまう → 内側の範囲は外側の変数（x）で表す。</li>
            <li>
              変数変換で <M>{'\\frac{dy}{dx}'}</M> をかけてしまう → かけるのは「y から x に戻す」向きの <M>{'\\left|\\frac{dx}{dy}\\right|'}</M>。絶対値も忘れない。
            </li>
            <li>正規分布の σ² の最尤推定量を n − 1 で割る → 最尤推定量は n で割る。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="準1級のどこで使うか">
        <ExamTip title="準1級のどこで使うか">
          <ul>
            <li>
              <strong>同時・周辺・条件つき密度、変数変換</strong>（<Link to="/chapters/pre1-probability">確率と確率変数</Link>）：重積分で確率や周辺密度を求め、ヤコビアンで変換後の密度を求める。
            </li>
            <li>
              <strong>正規分布などの最尤推定</strong>（<Link to="/chapters/pre1-estimation">推定</Link>）：パラメータが2つ以上なら、それぞれで偏微分して 0 とおく。
            </li>
            <li>
              <strong>多変量正規分布</strong>（<Link to="/chapters/pre1-distributions">種々の確率分布</Link>）：等高線が楕円になる同時密度。
            </li>
            <li>
              <strong>重回帰の最小二乗法</strong>（<Link to="/chapters/pre1-regression">回帰分析</Link>）：残差の2乗和を各係数で偏微分して 0 とおくと、<Link to="/lessons/pre1-math-matrix">正規方程式</Link>になる。
            </li>
          </ul>
          <p>出題範囲表（2027年1月1日版）には、同時確率密度関数・周辺確率密度関数・条件つき確率密度関数・変数変換・最尤法・多変量正規分布が載っています。</p>
        </ExamTip>
      </Section>
    </>
  )
}
