import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { ShapeMoments } from '../figures/ShapeMoments'
import { VarianceDecomposition } from '../figures/VarianceDecomposition'

export const meta: LessonMeta = {
  id: 'pre1-probability-moments',
  chapter: 'pre1-probability',
  order: 3,
  title: '分布の特性値と条件つき期待値',
  summary: 'モーメント・歪度・尖度・変動係数・分位点関数で分布の形を数で表し、条件つき期待値・条件つき分散と「繰り返し期待値の法則」「分散の分解」を学びます。相関係数と偏相関係数も復習します。',
  minutes: 45,
  keywords: ['モーメント', '歪度', '尖度', '変動係数', '相関係数', '偏相関係数', '分位点関数', '条件つき期待値', '条件つき分散'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          平均（中心）と分散（散らばり）に加えて、<strong>歪度</strong>は「左右のかたより」、<strong>尖度</strong>は「裾の重さ」を表します。どれも
          <strong>モーメント</strong>（<M>{'E[X^k]'}</M> のような「k 乗の平均」）から作ります。
          また、<strong>条件つき期待値</strong> <M>{'E[Y \\mid X]'}</M> を使うと、「グループごとの平均の平均は全体の平均」
          「全体の分散 = グループの中の分散の平均 + グループの平均の分散」という2つの便利な式が成り立ちます。
        </p>
      </Point>

      <Section title="モーメント：k 乗の平均">
        <p>
          期待値 <M>{'E[X]'}</M> と分散 <M>{'V[X] = E[(X-\\mu)^2]'}</M> は、2級で学びました（<Link to="/lessons/random-variables-expectation-variance">期待値と分散</Link>）。
          これを k 乗に広げたものが<strong>モーメント</strong>（積率）です。
        </p>
        <MathBlock caption="原点のまわりの k 次モーメント（そのまま k 乗して平均）と、平均のまわりの k 次モーメント（中心モーメント）">
          {"\\mu'_k = E[X^k], \\qquad \\mu_k = E[(X - \\mu)^k] \\quad (\\mu = E[X])"}
        </MathBlock>
        <ul>
          <li>
            原点のまわりの1次モーメント <M>{"\\mu'_1 = E[X]"}</M> が平均。
          </li>
          <li>
            中心モーメントの2次 <M>{'\\mu_2'}</M> が分散。2級の「2乗の平均 − 平均の2乗」は <M>{"\\mu_2 = \\mu'_2 - \\mu^2"}</M> のことです。
          </li>
          <li>
            3次・4次の中心モーメントも、展開すると原点のモーメントで書けます。<M>{'(X - \\mu)^3 = X^3 - 3\\mu X^2 + 3\\mu^2 X - \\mu^3'}</M> の期待値をとると、
            <M>{"E[X] = \\mu"}</M> なので <M>{"\\mu_3 = \\mu'_3 - 3\\mu\\mu'_2 + 3\\mu^3 - \\mu^3 = \\mu'_3 - 3\\mu\\mu'_2 + 2\\mu^3"}</M>。
          </li>
        </ul>
        <p>
          原点のまわりのモーメントは、次のレッスンの<Link to="/lessons/pre1-probability-mgf">積率母関数</Link>を微分すると機械的に求まります。
        </p>
      </Section>

      <Section title="歪度・尖度・変動係数">
        <p>
          3次・4次の中心モーメントは単位が「データの単位の3乗・4乗」で比べにくいので、標準偏差 σ の3乗・4乗で割って、単位のない数にします。
        </p>
        <MathBlock caption="歪度：右に裾が長いと正、左に裾が長いと負、左右対称なら 0">{'\\gamma_1 = \\frac{E[(X-\\mu)^3]}{\\sigma^3}'}</MathBlock>
        <MathBlock caption="尖度：裾の重さ（平均から遠い値の出やすさ）。正規分布で 3">{'\\beta_2 = \\frac{E[(X-\\mu)^4]}{\\sigma^4}'}</MathBlock>
        <Note title="尖度は「3 を引く」流儀もある">
          <p>
            正規分布の尖度が 0 になるように <M>{'\\beta_2 - 3'}</M> を尖度と呼ぶ本やソフトもあります（「超過尖度」とも呼ぶ）。
            問題文や出力が「正規分布で 0」なのか「正規分布で 3」なのかを、定義から確かめてください。このサイトでは、3 を引かないものを尖度と書きます。
          </p>
        </Note>
        <DataTable
          head={['分布', '歪度', '尖度（3 を引かない）', '形']}
          rows={[
            ['正規分布', '0', '3', '基準'],
            ['一様分布', '0', '1.8', '裾がない（平ら）'],
            ['指数分布', '2', '9', '右に裾が長い'],
            ['t 分布（自由度 ν > 4）', '0', <M key="t">{'3 + \\frac{6}{\\nu - 4}'}</M>, '左右対称だが裾が重い'],
            ['ガンマ分布（形状 k）', <M key="g1">{'2/\\sqrt{k}'}</M>, <M key="g2">{'3 + 6/k'}</M>, 'k が大きいほど正規分布に近い'],
          ]}
          caption="代表的な分布の歪度と尖度（ガンマ分布・t 分布は「種々の確率分布」の章で詳しく扱う）"
        />
        <Figure caption="平均 0・分散 1 にそろえて形だけを比べる。ガンマ分布は右に裾が伸び（歪度が正）、t 分布は左右対称のまま裾が高い（尖度が 3 より大きい）。パラメータを大きくすると、どちらも点線の正規分布に近づく">
          <ShapeMoments />
        </Figure>
        <Example title="0 か 1 をとる確率変数（ベルヌーイ分布）の歪度">
          <p>X = 1 の確率が p = 0.1、X = 0 の確率が 0.9 とします。0 と 1 は何乗しても 0 と 1 なので、<M>{'E[X^k] = p'}</M>（どの k でも）です。</p>
          <Steps>
            <li>
              平均 <M>{'\\mu = 0.1'}</M>、分散 <M>{'\\sigma^2 = p(1-p) = 0.09'}</M>、<M>{'\\sigma = 0.3'}</M>。
            </li>
            <li>
              3次の中心モーメント：<M>{"\\mu_3 = \\mu'_3 - 3\\mu\\mu'_2 + 2\\mu^3 = 0.1 - 3(0.1)(0.1) + 2(0.001) = 0.072"}</M>。
            </li>
            <li>
              歪度：<M>{'0.072 \\div 0.3^3 = 0.072 \\div 0.027 \\approx 2.67'}</M>。まれに 1 が出る（右に1本だけ離れた値がある）ので、大きな正の値になる。
            </li>
          </Steps>
          <p className="small muted">
            一般には <M>{'\\mu_3 = p(1-p)(1-2p)'}</M> で、歪度は <M>{'\\frac{1-2p}{\\sqrt{p(1-p)}}'}</M>。p = 0.5 なら左右対称で 0 になります。
          </p>
        </Example>
        <p>
          <strong>変動係数</strong>は、標準偏差を平均で割ったものです。平均の大きさがまるで違うものの「ばらつきの大きさ」を比べるときに使います。
        </p>
        <MathBlock caption="変動係数：平均に対して、標準偏差が何倍か（単位がない）">{'CV = \\frac{\\sigma}{\\mu}'}</MathBlock>
        <Compare>
          <Card title="ゾウの体重">
            <p>平均 5000 kg、標準偏差 500 kg。CV = 500 ÷ 5000 = 0.10</p>
          </Card>
          <Card title="ネズミの体重">
            <p>平均 20 g、標準偏差 4 g。CV = 4 ÷ 20 = 0.20</p>
          </Card>
        </Compare>
        <p>
          標準偏差はゾウのほうがずっと大きいですが、平均に対する割合で見ると、ネズミのほうが体重のばらつきが大きいといえます。
          変動係数は、身長・体重・金額のように<strong>値が正で、0 に意味がある</strong>量で使います（気温の摂氏のように 0 が便宜的な量では意味がありません）。
        </p>
      </Section>

      <Section title="分位点関数：確率から値を引く">
        <p>
          累積分布関数 F は「値 x → その値以下になる確率」でした。その逆向き、「確率 p → 下から p の割合のところの値」を返すのが<strong>分位点関数</strong>です。
        </p>
        <MathBlock caption="分位点関数：F(x) が p 以上になる最小の x（連続で F が増え続けるなら、F の逆関数）">{'Q(p) = F^{-1}(p) = \\min\\{x : F(x) \\ge p\\} \\quad (0 < p < 1)'}</MathBlock>
        <ul>
          <li>
            <M>{'Q(0.5)'}</M> が中央値、<M>{'Q(0.25)'}</M> と <M>{'Q(0.75)'}</M> が四分位点です。
          </li>
          <li>
            標準正規分布なら <M>{'Q(0.975) = 1.96'}</M>。2級の「上側 2.5% 点」は <M>{'Q(1 - 0.025)'}</M> のことです。
          </li>
        </ul>
        <Example title="指数分布の分位点関数">
          <p>
            <M>{'F(x) = 1 - e^{-\\lambda x}'}</M> を p とおいて x について解きます：<M>{'e^{-\\lambda x} = 1 - p'}</M>、両辺の対数をとって
            <M>{'-\\lambda x = \\log(1 - p)'}</M>、よって <M>{'Q(p) = -\\frac{\\log(1-p)}{\\lambda}'}</M>（log は自然対数。<Link to="/lessons/pre1-math-exp-log">指数・対数</Link>）。
            中央値は <M>{'Q(0.5) = \\frac{\\log 2}{\\lambda} \\approx \\frac{0.693}{\\lambda}'}</M> で、平均 <M>{'1/\\lambda'}</M> より小さくなります（右に裾が長いため）。
          </p>
        </Example>
        <p className="muted">
          分位点関数は、一様乱数から好きな分布の乱数を作るとき（<Link to="/lessons/pre1-probability-transformation">変数変換のレッスン</Link>）にも使います。
        </p>
      </Section>

      <Section title="条件つき期待値と条件つき分散">
        <p>
          <strong>条件つき期待値</strong> <M>{'E[Y \\mid X = x]'}</M> は、「X = x とわかったときの Y の平均」です。条件つき分布（<Link to="/lessons/pre1-probability-joint">前のレッスン</Link>）で平均をとるだけです。
        </p>
        <MathBlock caption="条件つき期待値：条件つき分布での平均（離散なら Σ、連続なら ∫）">{'E[Y \\mid X = x] = \\sum_{y} y\\,p(y \\mid x) \\quad \\text{or} \\quad \\int y\\,f(y \\mid x)\\,dy'}</MathBlock>
        <MathBlock caption="条件つき分散：条件つき分布での分散">{'V[Y \\mid X = x] = E[Y^2 \\mid X = x] - \\big(E[Y \\mid X = x]\\big)^2'}</MathBlock>
        <Example title="朝食とコーヒーの表で計算する">
          <p>
            前のレッスンの表（X：朝食、Y：コーヒーの杯数）では、X = 0 のときの Y の条件つき分布が 0.25, 0.50, 0.25、X = 1 のときが 1/6, 1/2, 1/3 でした。
          </p>
          <Steps>
            <li>
              <M>{'E[Y \\mid X = 0] = 0 \\times 0.25 + 1 \\times 0.5 + 2 \\times 0.25 = 1'}</M>
            </li>
            <li>
              <M>{'E[Y \\mid X = 1] = 0 \\times \\tfrac{1}{6} + 1 \\times \\tfrac{1}{2} + 2 \\times \\tfrac{1}{3} = \\tfrac{7}{6}'}</M>
            </li>
            <li>
              これを X の確率（0.4 と 0.6）で平均すると <M>{'0.4 \\times 1 + 0.6 \\times \\tfrac{7}{6} = 0.4 + 0.7 = 1.1'}</M>。
              周辺分布から直接 <M>{'E[Y] = 0 \\times 0.2 + 1 \\times 0.5 + 2 \\times 0.3 = 1.1'}</M> と一致する。
            </li>
          </Steps>
        </Example>
        <p>
          X の値がまだ決まっていないと思えば、<M>{'E[Y \\mid X]'}</M> は「X が 0 なら 1、X が 1 なら 7/6」という <strong>X で決まる確率変数</strong>です。
          その平均が <M>{'E[Y]'}</M> になる、というのが次の法則です。
        </p>
        <MathBlock caption="繰り返し期待値の法則：グループごとの平均を、グループの割合で平均すると、全体の平均">{'E\\big[E[Y \\mid X]\\big] = E[Y]'}</MathBlock>
        <MathBlock caption="分散の分解：全体の分散 = グループの中の分散の平均 + グループの平均の散らばり">{'V[Y] = E\\big[V[Y \\mid X]\\big] + V\\big[E[Y \\mid X]\\big]'}</MathBlock>
        <p>
          記号の読み方：<M>{'E[V[Y \\mid X]]'}</M> は「X ごとの Y の分散（グループの中の分散）を、X の確率で平均したもの」、
          <M>{'V[E[Y \\mid X]]'}</M> は「X ごとの Y の平均（グループの平均）が、X によってどれだけ散らばるか」です。外側の E や V は、X について計算します。
        </p>
        <Note title="なぜ成り立つか（離散の場合。読み飛ばしてよい）">
          <p>
            繰り返し期待値の法則：<M>{'E[Y \\mid X = x] = \\sum_y y\\,\\frac{p(x, y)}{p_X(x)}'}</M> を、X の確率 <M>{'p_X(x)'}</M> で平均すると、
            <M>{'p_X(x)'}</M> が約分されて
          </p>
          <MathBlock>{'E\\big[E[Y \\mid X]\\big] = \\sum_x p_X(x) \\sum_y y\\,\\frac{p(x, y)}{p_X(x)} = \\sum_x \\sum_y y\\,p(x, y) = E[Y]'}</MathBlock>
          <p>
            分散の分解：<M>{'V[Y \\mid X] = E[Y^2 \\mid X] - (E[Y \\mid X])^2'}</M> の平均をとると、繰り返し期待値の法則（Y² でも同じく成り立つ）から
            <M>{'E[V[Y \\mid X]] = E[Y^2] - E[(E[Y \\mid X])^2]'}</M>。一方、<M>{'E[Y \\mid X]'}</M> の平均は E[Y] なので
            <M>{'V[E[Y \\mid X]] = E[(E[Y \\mid X])^2] - (E[Y])^2'}</M>。2つを足すと <M>{'E[(E[Y \\mid X])^2]'}</M> が消えて、
            <M>{'E[Y^2] - (E[Y])^2 = V[Y]'}</M> になります。
          </p>
        </Note>
        <Example title="2つの工場の製品">
          <p>
            製品の 60% は工場 A（重さの平均 10、分散 4）、40% は工場 B（平均 15、分散 9）で作られます。工場をまぜた製品全体の重さ Y の平均と分散は？
          </p>
          <Steps>
            <li>
              平均：<M>{'E[Y] = 0.6 \\times 10 + 0.4 \\times 15 = 12'}</M>
            </li>
            <li>
              工場の中の分散の平均：<M>{'E[V[Y \\mid X]] = 0.6 \\times 4 + 0.4 \\times 9 = 6'}</M>
            </li>
            <li>
              工場の平均の分散：<M>{'V[E[Y \\mid X]] = 0.6 \\times (10 - 12)^2 + 0.4 \\times (15 - 12)^2 = 2.4 + 3.6 = 6'}</M>
            </li>
            <li>
              全体の分散：<M>{'V[Y] = 6 + 6 = 12'}</M>。工場の中の分散（4 や 9）の平均 6 だけでは、半分しか説明できない。
            </li>
          </Steps>
        </Example>
        <Figure caption="スライダーで工場の割合・平均・散らばりを変えると、緑（工場の中の散らばり）と紫（工場の平均どうしのずれ）の長さが変わる。全体の分散はいつも2つの和">
          <VarianceDecomposition />
        </Figure>
        <Intuition title="分散分析と同じ形">
          <p>
            「全体の散らばり = グループの中の散らばり + グループの間の散らばり」は、2級の<Link to="/lessons/linear-models-anova">分散分析</Link>の「全変動 = 級内変動 + 級間変動」と同じ形です。
            <M>{'V[E[Y \\mid X]]'}</M> が大きいほど、X（どのグループか）を知ることで Y がよく予想できる、ということです。
          </p>
        </Intuition>
        <MathNote title="使いどころ：個数もランダムな和">
          <p>
            1日の保険金の請求件数 N が平均 3・分散 3 のポアソン分布、1件の金額 X（万円）が平均 2・分散 1 で、件数と金額、金額どうしが独立だとします。1日の合計
            <M>{'S = X_1 + \\cdots + X_N'}</M> は、件数 N を条件にすると考えやすくなります。
          </p>
          <ul>
            <li>
              N = n のとき：<M>{'E[S \\mid N = n] = 2n'}</M>、<M>{'V[S \\mid N = n] = 1 \\times n'}</M>（独立な n 個の和）。
            </li>
            <li>
              平均：<M>{'E[S] = E\\big[E[S \\mid N]\\big] = E[2N] = 2 \\times 3 = 6'}</M>
            </li>
            <li>
              分散：グループの中の分散の平均は <M>{'E[V[S \\mid N]] = E[1 \\times N] = 3'}</M>、グループの平均の分散は <M>{'V[E[S \\mid N]] = V[2N] = 2^2 \\times V[N] = 4 \\times 3 = 12'}</M>。
              合わせて <M>{'V[S] = 3 + 12 = 15'}</M>。一般に <M>{'V[S] = E[N]V[X] + V[N](E[X])^2'}</M>。
            </li>
          </ul>
        </MathNote>
        <Example title="連続の例：三角形の上の一様分布">
          <p>
            <M>{'f(x, y) = 2'}</M>（0 &lt; y &lt; x &lt; 1）では、X = x のとき Y は 0 から x までの一様分布になります（切り口が平らなため）。
            よって <M>{'E[Y \\mid X = x] = \\frac{x}{2}'}</M>、<M>{'V[Y \\mid X = x] = \\frac{x^2}{12}'}</M>。X の周辺密度 <M>{'f_X(x) = 2x'}</M> から <M>{'E[X] = \\int_0^1 x \\cdot 2x\\,dx = \\frac{2}{3}'}</M> なので、
            <M>{'E[Y] = E[X/2] = \\frac{1}{3}'}</M> です。
          </p>
        </Example>
      </Section>

      <Section title="相関係数と偏相関係数（復習）">
        <p>
          2級で学んだ相関係数を、確率変数の言葉で書くと次のとおりです（<Link to="/lessons/random-variables-sum-covariance">確率変数の共分散と相関</Link>）。
        </p>
        <MathBlock caption="相関係数：共分散を2つの標準偏差で割ったもの。−1 以上 1 以下">{'\\rho_{XY} = \\frac{\\mathrm{Cov}(X, Y)}{\\sqrt{V[X]\\,V[Y]}}, \\qquad \\mathrm{Cov}(X, Y) = E[XY] - E[X]E[Y]'}</MathBlock>
        <p>
          第3の変数 Z の影響を取り除いた X と Y の相関が<strong>偏相関係数</strong>です（<Link to="/lessons/bivariate-spurious-partial">2級の偏相関</Link>）。
        </p>
        <MathBlock caption="偏相関係数：3つの相関係数だけで計算できる">{'\\rho_{XY \\cdot Z} = \\frac{\\rho_{XY} - \\rho_{XZ}\\,\\rho_{YZ}}{\\sqrt{(1 - \\rho_{XZ}^2)(1 - \\rho_{YZ}^2)}}'}</MathBlock>
        <p>
          偏相関係数は「X を Z で直線的に予測した残り」と「Y を Z で直線的に予測した残り」の相関です。(X, Y, Z) が多変量正規分布にしたがうときは、
          Z の値を固定したときの X と Y の条件つき分布の相関と一致することが知られています（多変量正規分布は「種々の確率分布」の章で扱います）。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'E[Y \\mid X]'}</M> をただの数だと思う → X の値によって変わる、<strong>X の関数（確率変数）</strong>。X = x を代入したものが数。
            </li>
            <li>
              全体の分散を「グループの中の分散の平均」だけで計算する → グループの平均どうしのずれ <M>{'V[E[Y \\mid X]]'}</M> を足し忘れている。
            </li>
            <li>尖度の定義（3 を引くか引かないか）を確かめずに、正規分布と比べる。</li>
            <li>歪度が正なら山の頂上が右にある → 逆。歪度が正のときは<strong>右に裾が長く</strong>、山の頂上は左寄りになることが多い。</li>
            <li>平均が負や 0 に近いデータで変動係数を使う → 割り算が意味をなさない。</li>
            <li>相関係数が 0 なら独立 → 相関は直線的な関係だけを見る。独立なら相関は 0 だが、逆は成り立たない。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              事実：準1級の出題範囲表（2027年1月1日版）では、モーメント、歪度、尖度、変動係数、相関係数、偏相関係数、分位点関数、条件つき期待値、条件つき分散が学習しておくべき用語に挙がっている。
            </li>
            <li>推測：簡単な分布（ベルヌーイ・指数など）の歪度・尖度を、モーメントから計算する問題。尖度の定義は問題文で確認する。</li>
            <li>推測：グループに分かれた母集団（混合分布）の平均と分散を、繰り返し期待値の法則と分散の分解で求める問題。</li>
            <li>推測：相関行列から偏相関係数を計算する問題（電卓で平方根が使える）。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
