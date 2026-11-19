import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { ExpectationFigure, IntegralAreaFigure } from '../figures/IntegralFigures'

export const meta: LessonMeta = {
  id: 'pre1-math-integral',
  chapter: 'pre1-math',
  order: 2,
  title: '積分の考え方',
  summary: '積分はグラフの下の面積で、確率密度の面積が確率でした。微分の逆を使って面積を計算する方法と、確率・期待値・分散を ∫ で求める計算を練習します。',
  minutes: 60,
  keywords: ['積分', '不定積分', '定積分', '置換積分', '部分積分', '確率密度関数'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>積分</strong>は「<strong>グラフの下の面積</strong>」を求める計算です。2級で学んだとおり、連続な分布では<strong>確率密度の下の面積が確率</strong>でした。
          面積は「<strong>微分すると f になる関数 F</strong>」を見つけて <M>{'F(b) - F(a)'}</M> と引き算すれば求まります。
          期待値も分散も「<M>{'\\Sigma'}</M>（足し算）」を「<M>{'\\int'}</M>（積分）」に置きかえるだけで、同じ形の式になります。
        </p>
      </Point>

      <Section title="面積を細い長方形で求める">
        <p>
          2級の<Link to="/lessons/math-function-graph-area">関数・グラフ・面積</Link>では、長方形や三角形の面積の公式で確率を求めました。
          曲線の下の面積は、<strong>細い長方形に切って足す</strong>と近づけられます。長方形を細くするほど、すき間やはみ出しが減って、本当の面積に近づきます。
        </p>
        <Figure caption="長方形の本数を増やしてみよう。長方形の面積の合計（Σ）が、積分で求めた面積に近づく。左端・右端も動かせる">
          <IntegralAreaFigure />
        </Figure>
        <p>
          長方形の横幅を <M>{'\\Delta x'}</M>（デルタ x、「少しの幅」）とすると、面積の合計は <M>{'\\sum f(x_i)\\,\\Delta x'}</M>（<Link to="/lessons/math-sigma">Σ記号</Link>）。
          幅を 0 に近づけた極限を <M>{'\\int_a^b f(x)\\,dx'}</M> と書きます。<M>{'\\int'}</M>（インテグラル）は S（sum ＝ 合計）をのばした字で、<M>{'dx'}</M> は「とても細い幅」です。
        </p>
        <MathBlock caption="定積分：a から b までの、曲線 f(x) の下の面積">{'\\int_a^b f(x)\\,dx = \\lim_{\\Delta x \\to 0} \\sum f(x_i)\\,\\Delta x'}</MathBlock>
      </Section>

      <Section title="微分の逆で面積を計算する">
        <p>
          長方形を何百本も足すのは大変です。そこで次の事実を使います（理由は下の「直感的な理解」）。
        </p>
        <MathBlock caption="微分すると f(x) になる関数 F(x) を見つければ、面積は引き算で求まる">{"\\int_a^b f(x)\\,dx = F(b) - F(a) = \\Big[\\,F(x)\\,\\Big]_a^b \\qquad (F'(x) = f(x))"}</MathBlock>
        <p>
          微分すると f になる関数 F を、f の<strong>原始関数</strong>（または<strong>不定積分</strong>）といい、<M>{'\\int f(x)\\,dx'}</M> と書きます。
          定数は微分すると 0 なので、F に好きな定数 C を足しても原始関数です。そこで <M>{'+ C'}</M>（<strong>積分定数</strong>）をつけて書きます。
          面積を求めるとき（<strong>定積分</strong>）は、引き算で C が消えるので気にしなくて大丈夫です。
        </p>
        <MathBlock caption="x の n 乗の積分：指数を 1 増やして、増やした数で割る（微分の逆）">{'\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\qquad (n \\ne -1)'}</MathBlock>
        <MathBlock caption="e^(−x) の積分。e^x は微分しても e^x（次のレッスン）なので、内側の −1 の分だけ符号が変わる">{'\\int e^{-x}\\,dx = -e^{-x} + C, \\qquad \\int e^{-\\lambda x}\\,dx = -\\frac{1}{\\lambda} e^{-\\lambda x} + C'}</MathBlock>
        <DataTable
          head={['f(x)', '原始関数 F(x)', '確かめ（F を微分すると f）']}
          rows={[
            [<M key="1">{'1'}</M>, <M key="1F">{'x'}</M>, <M key="1c">{"(x)' = 1"}</M>],
            [<M key="2">{'x'}</M>, <M key="2F">{'\\frac{x^2}{2}'}</M>, <M key="2c">{"\\left(\\frac{x^2}{2}\\right)' = \\frac{2x}{2} = x"}</M>],
            [<M key="3">{'3x^2'}</M>, <M key="3F">{'x^3'}</M>, <M key="3c">{"(x^3)' = 3x^2"}</M>],
            [<M key="4">{'x^3'}</M>, <M key="4F">{'\\frac{x^4}{4}'}</M>, <M key="4c">{"\\left(\\frac{x^4}{4}\\right)' = x^3"}</M>],
            [<M key="5">{'e^{-x}'}</M>, <M key="5F">{'-e^{-x}'}</M>, <M key="5c">{"(-e^{-x})' = -e^{-x} \\times (-1) = e^{-x}"}</M>],
            [<M key="6">{'\\lambda e^{-\\lambda x}'}</M>, <M key="6F">{'-e^{-\\lambda x}'}</M>, <M key="6c">{"(-e^{-\\lambda x})' = -e^{-\\lambda x} \\times (-\\lambda) = \\lambda e^{-\\lambda x}"}</M>],
          ]}
          caption="積分の答えは、微分して元に戻るかで必ず確かめられる（C は省略）"
        />
        <Example title="定積分を計算する">
          <p>
            <M>{'\\int_{0.5}^{1} 3x^2\\,dx'}</M> を求めます（上の図の最初の設定です）。
          </p>
          <Steps>
            <li>
              原始関数を見つける：<M>{'3x^2'}</M> の原始関数は <M>{'x^3'}</M>
            </li>
            <li>
              上端と下端を代入して引く：<M>{'\\Big[\\,x^3\\,\\Big]_{0.5}^{1} = 1^3 - 0.5^3 = 1 - 0.125 = 0.875'}</M>
            </li>
          </Steps>
          <p>
            0 から 1 までなら <M>{'1^3 - 0^3 = 1'}</M>。全体の面積が 1 なので、<M>{'f(x) = 3x^2'}</M>（0 ≤ x ≤ 1）は確率密度関数として使えます。
          </p>
        </Example>
      </Section>

      <Section title="確率密度から確率・期待値・分散を求める">
        <p>
          連続な確率変数 X の確率密度関数 <M>{'f(x)'}</M> は、2級の<Link to="/lessons/distributions-uniform-exponential">一様分布と指数分布</Link>で見たとおり、「面積が確率」になる関数です。
          積分を使うと、どんな形の密度でも計算できます。
        </p>
        <MathBlock caption="確率は面積。全体の面積は必ず 1">{'P(a \\le X \\le b) = \\int_a^b f(x)\\,dx, \\qquad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1'}</MathBlock>
        <p>
          期待値と分散は、2級の<Link to="/lessons/random-variables-expectation-variance">期待値・分散</Link>の「値 × 確率 を全部足す」を、そのまま積分に置きかえます。
        </p>
        <Compare>
          <Card title="とびとびの値（離散）">
            <MathBlock>{'E[X] = \\sum_x x\\,p(x)'}</MathBlock>
            <MathBlock>{'E[X^2] = \\sum_x x^2\\,p(x)'}</MathBlock>
          </Card>
          <Card title="連続な値（連続）">
            <MathBlock>{'E[X] = \\int x\\,f(x)\\,dx'}</MathBlock>
            <MathBlock>{'E[X^2] = \\int x^2\\,f(x)\\,dx'}</MathBlock>
          </Card>
        </Compare>
        <MathBlock caption="分散は「2乗の期待値 − 期待値の2乗」で計算するのが楽">{'V[X] = E[X^2] - (E[X])^2'}</MathBlock>
        <p>
          「確率 <M>{'p(x)'}</M>」が「<M>{'f(x)\\,dx'}</M>（高さ × 細い幅 ＝ 細い長方形の面積 ＝ そのあたりに入る確率）」に変わっただけです。
        </p>
        <Example title="f(x) = 3x²（0 ≤ x ≤ 1）の期待値と分散">
          <Steps>
            <li>
              期待値：<M>{'E[X] = \\int_0^1 x \\cdot 3x^2\\,dx = \\int_0^1 3x^3\\,dx = \\Big[\\,\\frac{3x^4}{4}\\,\\Big]_0^1 = \\frac{3}{4}'}</M>
            </li>
            <li>
              2乗の期待値：<M>{'E[X^2] = \\int_0^1 x^2 \\cdot 3x^2\\,dx = \\int_0^1 3x^4\\,dx = \\Big[\\,\\frac{3x^5}{5}\\,\\Big]_0^1 = \\frac{3}{5}'}</M>
            </li>
            <li>
              分散：<M>{'V[X] = \\frac{3}{5} - \\left(\\frac{3}{4}\\right)^2 = \\frac{3}{5} - \\frac{9}{16} = \\frac{48 - 45}{80} = \\frac{3}{80} = 0.0375'}</M>
            </li>
          </Steps>
        </Example>
        <Figure caption="密度を切りかえてみよう。期待値は「x f(x) のグラフの下の面積」。右に重みがある密度ほど期待値が大きい">
          <ExpectationFigure />
        </Figure>
        <Example title="全体の面積が 1 になるように定数を決める">
          <p>
            <M>{'f(x) = c\\,x(1 - x)'}</M>（0 ≤ x ≤ 1、それ以外では 0）が確率密度関数になるような c を求めます。
          </p>
          <Steps>
            <li>
              展開して積分：<M>{'\\int_0^1 (x - x^2)\\,dx = \\Big[\\,\\frac{x^2}{2} - \\frac{x^3}{3}\\,\\Big]_0^1 = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}'}</M>
            </li>
            <li>
              全体を 1 にする：<M>{'c \\times \\frac{1}{6} = 1'}</M> より <M>{'c = 6'}</M>
            </li>
          </Steps>
          <p>この c のような「全体を 1 にするためにかける数」を<strong>正規化定数</strong>といいます。準1級のベータ分布やガンマ分布の式にも出てきます。</p>
        </Example>
      </Section>

      <Section title="∞ までの積分">
        <p>
          指数分布のように x が 0 から ∞ までのどこでもとれる場合は、上端 b を大きくしていったときに近づく値を <M>{'\\int_0^{\\infty}'}</M> と書きます。
          <M>{'e^{-\\lambda b}'}</M> は b を大きくすると 0 に近づくので、次のように計算できます。
        </p>
        <MathBlock caption="指数分布（λ > 0）の全体の面積は 1、X が t より大きい確率は e^(−λt)">{'\\int_0^{\\infty} \\lambda e^{-\\lambda x}\\,dx = \\Big[\\,-e^{-\\lambda x}\\,\\Big]_0^{\\infty} = 0 - (-1) = 1, \\qquad P(X > t) = \\Big[\\,-e^{-\\lambda x}\\,\\Big]_t^{\\infty} = e^{-\\lambda t}'}</MathBlock>
      </Section>

      <Section title="置換積分と部分積分（基本形だけ）">
        <p>この2つは、微分の「チェーンルール」と「積の微分」を逆向きに使ったものです。準1級の計算では、次の基本形が使えれば十分なことが多いです。</p>
        <MathBlock caption="置換積分の一番よく使う形：かっこの中が ax + b なら、a で割る（F は f の原始関数、a ≠ 0）">{'\\int f(ax + b)\\,dx = \\frac{1}{a} F(ax + b) + C'}</MathBlock>
        <Example title="(2x + 1)³ の積分">
          <p>
            <M>{'\\int (2x + 1)^3\\,dx = \\frac{1}{2} \\times \\frac{(2x + 1)^4}{4} + C = \\frac{(2x + 1)^4}{8} + C'}</M>。
            確かめ：微分すると <M>{'\\frac{4(2x + 1)^3 \\times 2}{8} = (2x + 1)^3'}</M>（チェーンルールで内側の 2 が出て、割った 2 と打ち消し合う）。
          </p>
        </Example>
        <p>
          もう少し一般には、「<M>{'u = g(x)'}</M> とおくと、<M>{"du = g'(x)\\,dx"}</M>」と書きかえます（<M>{"\\frac{du}{dx} = g'(x)"}</M> の両辺に dx をかけた形）。
        </p>
        <Example title="置換積分：正規分布に出てくる形">
          <p>
            <M>{'\\int_0^{\\infty} x\\,e^{-x^2/2}\\,dx'}</M> を求めます。
          </p>
          <Steps>
            <li>
              <M>{'u = \\frac{x^2}{2}'}</M> とおく。微分すると <M>{'\\frac{du}{dx} = x'}</M>、つまり <M>{'du = x\\,dx'}</M>
            </li>
            <li>
              範囲も置きかえる：x = 0 のとき u = 0、x → ∞ のとき u → ∞
            </li>
            <li>
              書きかえる：<M>{'e^{-x^2/2}'}</M> は <M>{'e^{-u}'}</M> に、<M>{'x\\,dx'}</M> はまとめて <M>{'du'}</M> に置きかわる。式の中の x が全部消えるのがポイント
            </li>
            <li>
              計算：<M>{'\\int_0^{\\infty} e^{-u}\\,du = \\Big[\\,-e^{-u}\\,\\Big]_0^{\\infty} = 0 - (-1) = 1'}</M>
            </li>
          </Steps>
        </Example>
        <MathBlock caption="部分積分：かけ算の積分で、片方を微分し、もう片方を積分する">{"\\int_a^b f(x)\\,g'(x)\\,dx = \\Big[\\,f(x)\\,g(x)\\,\\Big]_a^b - \\int_a^b f'(x)\\,g(x)\\,dx"}</MathBlock>
        <Example title="部分積分：指数分布の期待値">
          <p>
            指数分布 <M>{'f(x) = \\lambda e^{-\\lambda x}'}</M>（x ≥ 0）の期待値 <M>{'E[X] = \\int_0^{\\infty} x \\cdot \\lambda e^{-\\lambda x}\\,dx'}</M> を求めます。
          </p>
          <Steps>
            <li>
              微分すると簡単になる <M>{'x'}</M> を f、積分できる <M>{'\\lambda e^{-\\lambda x}'}</M> を g′ とする。<M>{"f' = 1"}</M>、<M>{'g = -e^{-\\lambda x}'}</M>
            </li>
            <li>
              公式に入れる：<M>{'\\Big[\\,x \\times (-e^{-\\lambda x})\\,\\Big]_0^{\\infty} - \\int_0^{\\infty} 1 \\times (-e^{-\\lambda x})\\,dx = \\Big[\\,-x\\,e^{-\\lambda x}\\,\\Big]_0^{\\infty} + \\int_0^{\\infty} e^{-\\lambda x}\\,dx'}</M>（マイナスとマイナスでプラスになる）
            </li>
            <li>
              1つ目は 0（x → ∞ で <M>{'x e^{-\\lambda x} \\to 0'}</M>、x = 0 でも 0）。2つ目は <M>{'\\Big[\\,-\\frac{1}{\\lambda} e^{-\\lambda x}\\,\\Big]_0^{\\infty} = 0 - \\left(-\\frac{1}{\\lambda}\\right) = \\frac{1}{\\lambda}'}</M>
            </li>
          </Steps>
          <p>
            よって <M>{'E[X] = \\frac{1}{\\lambda}'}</M>。2級で覚えた「指数分布の期待値は 1/λ」が計算で確かめられました。
          </p>
        </Example>
        <Note title="x × e^(−λx) が 0 に近づく理由（事実として使ってよい）">
          <p>
            x が大きくなると x は大きくなりますが、<M>{'e^{-\\lambda x}'}</M> はそれよりずっと速く 0 に近づきます（「指数の減り方は、どんな x の何乗の増え方にも勝つ」）。
            たとえば λ = 1、x = 20 で <M>{'20 \\times e^{-20} \\approx 0.000000041'}</M>。
          </p>
        </Note>
        <MathNote title="覚えておくと便利な積分（ガンマ関数）">
          <p>
            部分積分をくり返すと、0 以上の整数 n について次の式が成り立つことがわかります（n! は<Link to="/lessons/math-counting">階乗</Link>）。
          </p>
          <MathBlock>{'\\int_0^{\\infty} x^n e^{-x}\\,dx = n!'}</MathBlock>
          <p>
            たとえば <M>{'\\int_0^{\\infty} x^3 e^{-x}\\,dx = 3! = 6'}</M>、<M>{'\\int_0^{\\infty} e^{-x}\\,dx = 0! = 1'}</M>（0! は 1 と決めておく）。
            指数の n を整数でない数にも広げたものが<strong>ガンマ関数</strong>です（Γ は「ガンマ」と読むギリシャ文字の大文字）。
          </p>
          <MathBlock caption="ガンマ関数の定義（α > 0）。整数なら階乗と同じ">{'\\Gamma(\\alpha) = \\int_0^{\\infty} x^{\\alpha - 1} e^{-x}\\,dx, \\qquad \\Gamma(n + 1) = n!, \\qquad \\Gamma(\\alpha + 1) = \\alpha\\,\\Gamma(\\alpha)'}</MathBlock>
          <p>
            指数が <M>{'\\alpha - 1'}</M> と 1 ずれているので、<M>{'\\Gamma(4) = 3! = 6'}</M> のように「1 つ手前の階乗」になる点に注意します。
            右の <M>{'\\Gamma(\\alpha + 1) = \\alpha\\,\\Gamma(\\alpha)'}</M> は部分積分を1回使うと出てくる関係です。
            準1級の<Link to="/chapters/pre1-distributions">ガンマ分布・ベータ分布</Link>の式に出てきます。
          </p>
        </MathNote>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="面積の関数を微分すると、もとの高さに戻る">
          <p>
            「0 から x までの面積」を <M>{'S(x)'}</M> とします。x を少しだけ（幅 h）右へ動かすと、面積は「高さ <M>{'f(x)'}</M> × 幅 h」の細い長方形の分だけ増えます。
            増え方の割合は <M>{'\\frac{S(x + h) - S(x)}{h} \\approx f(x)'}</M> で、h を 0 に近づけると <M>{"S'(x) = f(x)"}</M>。
            つまり<strong>面積の関数は f の原始関数</strong>で、だから「微分の逆」で面積が求まります。
          </p>
          <p>
            統計では、「x 以下になる確率」<M>{'F(x) = P(X \\le x)'}</M>（<strong>累積分布関数</strong>）がこの面積の関数です。だから <M>{"F'(x) = f(x)"}</M>（累積分布関数を微分すると密度）。準1級でよく使う関係です。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'\\int x^3\\,dx = x^4'}</M> としてしまう → 指数を 1 増やしたら、その数で割る：<M>{'\\frac{x^4}{4}'}</M>。微分して確かめる習慣をつける。
            </li>
            <li>
              定積分で <M>{'F(a) - F(b)'}</M> と逆に引く → 上端（b）から下端（a）を引く。
            </li>
            <li>
              密度が 0 のところまで積分範囲に入れてしまう → <M>{'f(x) = 3x^2'}</M>（0 ≤ x ≤ 1）なら、0 から 1 までだけ積分する。
            </li>
            <li>
              <M>{'E[X^2]'}</M> と <M>{'(E[X])^2'}</M> を混同する → 前者は「x² f(x) を積分」、後者は「期待値を計算してから2乗」。差が分散。
            </li>
            <li>密度の値（高さ）を確率だと思う → 確率は面積。高さは 1 を超えてもよい（3x² は x = 1 で 3）。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="準1級のどこで使うか">
        <ExamTip title="準1級のどこで使うか">
          <ul>
            <li>
              <strong>連続分布の期待値・分散・累積分布関数</strong>（<Link to="/chapters/pre1-distributions">種々の確率分布</Link>）：ガンマ分布・ベータ分布などの期待値や分散を ∫ で求める。正規化定数の計算もある。
            </li>
            <li>
              <strong>積率母関数</strong>（<Link to="/chapters/pre1-probability">確率と確率変数</Link>）：<M>{'E[e^{tX}] = \\int e^{tx} f(x)\\,dx'}</M> を計算する。
            </li>
            <li>
              <strong>同時密度・周辺密度・条件つき密度</strong>（<Link to="/chapters/pre1-probability">確率と確率変数</Link>）：2変数の積分を使う。<Link to="/lessons/pre1-math-multivariable">偏微分と重積分</Link>で準備する。
            </li>
            <li>
              <strong>順序統計量</strong>（<Link to="/chapters/pre1-distributions">種々の確率分布</Link>）：最大値・最小値の分布を、累積分布関数から求める。
            </li>
          </ul>
          <p>出題範囲表（2027年1月1日版）には、確率密度関数・累積分布関数・積率母関数が項目として載っています。どれも積分で定義される量です。</p>
        </ExamTip>
      </Section>
    </>
  )
}
