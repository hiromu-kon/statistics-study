import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { SlopeSignFigure, SquaredErrorFigure, TangentFigure } from '../figures/DerivativeFigures'

export const meta: LessonMeta = {
  id: 'pre1-math-derivative',
  chapter: 'pre1-math',
  order: 1,
  title: '微分の考え方',
  summary: '「その瞬間の変化の割合」＝接線の傾きを求めるのが微分です。x^n・積・合成関数の微分を練習し、「微分して 0 とおく」と山の頂上が見つかること（最尤法の準備）を確かめます。',
  minutes: 60,
  keywords: ['微分', '導関数', '接線の傾き', '合成関数の微分', '極値'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>微分</strong>は「<strong>その点での傾き</strong>（その瞬間の変化の割合）」を求める計算です。グラフでいえば<strong>接線の傾き</strong>です。
          統計では、「一番当てはまりのよい値」「一番ありそうな値」を探すときに使います。山の頂上では傾きが 0 になるので、
          <strong>微分して 0 とおいた式を解けば頂上が見つかる</strong>、というのが最尤法や最小二乗法の計算の中心です。
        </p>
      </Point>

      <Section title="変化の割合から始める">
        <p>
          2級の<Link to="/lessons/math-function-graph-area">関数・グラフ・面積</Link>で、直線の傾きは「y の増えた分 ÷ x の増えた分」でした。
          直線はどこでも傾きが同じですが、曲線は場所によって傾きが変わります。
        </p>
        <p>
          ボールを転がして、x 秒後に <M>{'y = x^2'}</M> メートル進んだとします。1 秒後から 3 秒後までの<strong>平均の速さ</strong>は
          <M>{'\\frac{3^2 - 1^2}{3 - 1} = \\frac{8}{2} = 4'}</M>（メートル毎秒）です。では「ちょうど 1 秒の瞬間の速さ」は？
          時間の幅 h を小さくしていくと、次のようになります。
        </p>
        <DataTable
          head={['幅 h', '1 秒から 1 + h 秒までの平均の速さ', '計算']}
          rows={[
            ['2', '4', <M key="a">{'\\frac{9 - 1}{2}'}</M>],
            ['1', '3', <M key="b">{'\\frac{4 - 1}{1}'}</M>],
            ['0.1', '2.1', <M key="c">{'\\frac{1.21 - 1}{0.1}'}</M>],
            ['0.01', '2.01', <M key="d">{'\\frac{1.0201 - 1}{0.01}'}</M>],
          ]}
          caption="h を小さくすると、平均の速さは 2 に近づく。これが「1 秒の瞬間の速さ」"
        />
        <p>
          この「幅を 0 に近づけたときの変化の割合」が<strong>微分係数</strong>です。グラフの上では、2点を通る直線（割線）が、1点で接する直線（<strong>接線</strong>）に近づいていきます。
        </p>
        <Figure caption="横の幅 h を小さくしてみよう。割線（実線）が接線（点線）に重なり、傾きが接線の傾きに近づく。点 A も動かせる">
          <TangentFigure />
        </Figure>
      </Section>

      <Section title="定義・式">
        <MathBlock caption="点 a での微分係数：幅 h を 0 に近づけたときの「変化の割合」">{"f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}"}</MathBlock>
        <p>
          <M>{'\\lim_{h \\to 0}'}</M>（リミット）は「h を 0 にどんどん近づけたときに、近づいていく先の値」という意味です。h = 0 を直接入れると 0 ÷ 0 になってしまうので、「近づける」と言います。
        </p>
        <Example title="y = x² の傾きを式で求める">
          <Steps>
            <li>
              分子を計算する：<M>{'(a + h)^2 - a^2 = a^2 + 2ah + h^2 - a^2 = 2ah + h^2'}</M>（展開は<Link to="/lessons/math-algebra">文字式と方程式</Link>）
            </li>
            <li>
              h で割る：<M>{'\\frac{2ah + h^2}{h} = 2a + h'}</M>
            </li>
            <li>
              h を 0 に近づける：<M>{'2a + h \\to 2a'}</M>。a = 1 なら 2 で、上の表と一致する
            </li>
          </Steps>
        </Example>
        <p>
          どの点 a でも傾きは 2a なので、「x を入れると、その点での傾きを返す関数」<M>{"f'(x) = 2x"}</M> ができます。これを<strong>導関数</strong>といい、導関数を求めることを「<strong>微分する</strong>」といいます。
          書き方はいくつかあり、どれも同じ意味です。
        </p>
        <MathBlock caption="導関数の書き方。dy/dx は「y の変化 ÷ x の変化」を、幅を 0 に近づけたもの">{"f'(x), \\qquad \\frac{dy}{dx}, \\qquad \\frac{d}{dx} f(x)"}</MathBlock>
        <p>
          <M>{"f'(x)"}</M> は「エフ ダッシュ エックス」（「エフ プライム」とも）、<M>{'\\frac{dy}{dx}'}</M> は「ディーワイ ディーエックス」と読みます。
          <M>{'\\frac{d}{dx}'}</M> は「x で微分する」という操作を表す記号で、分数のように見えますが割り算ではありません。
        </p>
      </Section>

      <Section title="微分の公式（これだけで多くの式が微分できる）">
        <p>毎回 lim を計算するのは大変なので、結果を公式として使います。</p>
        <MathBlock caption="x の n 乗：指数を前に下ろして、指数を 1 減らす">{"(x^n)' = n x^{n-1}"}</MathBlock>
        <MathBlock caption="定数は微分すると 0。定数倍はそのまま外に出せる。足し算はそれぞれ微分して足す">{"(c)' = 0, \\qquad (c\\,f(x))' = c\\,f'(x), \\qquad (f(x) + g(x))' = f'(x) + g'(x)"}</MathBlock>
        <DataTable
          head={['関数', '微分した結果', 'メモ']}
          rows={[
            [<M key="1">{'x'}</M>, <M key="1d">{'1'}</M>, '直線 y = x の傾きは 1'],
            [<M key="2">{'x^2'}</M>, <M key="2d">{'2x'}</M>, ''],
            [<M key="3">{'x^3'}</M>, <M key="3d">{'3x^2'}</M>, ''],
            [<M key="4">{'\\frac{1}{x} = x^{-1}'}</M>, <M key="4d">{'-x^{-2} = -\\frac{1}{x^2}'}</M>, '分数は「マイナス乗」に直す'],
            [<M key="5">{'\\sqrt{x} = x^{\\frac{1}{2}}'}</M>, <M key="5d">{'\\frac{1}{2}x^{-\\frac{1}{2}} = \\frac{1}{2\\sqrt{x}}'}</M>, 'ルートは「1/2 乗」に直す'],
            [<M key="6">{'5'}</M>, <M key="6d">{'0'}</M>, '平らな直線 y = 5 の傾きは 0'],
          ]}
          caption="n が負の数や分数でも同じ公式が使える"
        />
        <MathNote title="マイナス乗・分数乗の意味">
          <p>
            <M>{'x^{-1} = \\frac{1}{x}'}</M>、<M>{'x^{-2} = \\frac{1}{x^2}'}</M>（「マイナス乗は逆数」）、<M>{'x^{\\frac{1}{2}} = \\sqrt{x}'}</M>（「2 回かけると x になる数」）。
            2級の<Link to="/lessons/math-function-graph-area">指数のルール</Link>と<Link to="/lessons/math-square-root">平方根</Link>の続きです。
            くわしくは<Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link>で見ます。
          </p>
        </MathNote>
        <Example title="多項式を微分する">
          <p>
            <M>{'f(x) = 3x^2 - 4x + 5'}</M> を微分し、x = 2 での傾きを求めます。
          </p>
          <Steps>
            <li>
              1 つずつ微分する：<M>{"(3x^2)' = 3 \\times 2x = 6x"}</M>、<M>{"(-4x)' = -4"}</M>、<M>{"(5)' = 0"}</M>
            </li>
            <li>
              足す：<M>{"f'(x) = 6x - 4"}</M>
            </li>
            <li>
              x = 2 を代入：<M>{"f'(2) = 12 - 4 = 8"}</M>。x = 2 のあたりでは、x が少し増えると、f はその増えた分のおよそ 8 倍だけ増える
            </li>
          </Steps>
        </Example>
      </Section>

      <Section title="積の微分と合成関数の微分（チェーンルール）">
        <p>
          尤度（あとで出てきます）は <M>{'p^3 (1 - p)^2'}</M> のような「かけ算」や「かっこの何乗」の形をしています。これを微分するための2つの公式です。
        </p>
        <MathBlock caption="積の微分：片方ずつ微分して足す">{"\\{f(x)\\,g(x)\\}' = f'(x)\\,g(x) + f(x)\\,g'(x)"}</MathBlock>
        <Example title="積の微分を、展開して確かめる">
          <p>
            <M>{'x^2 (x + 1)'}</M> を微分します。<M>{'f = x^2'}</M>、<M>{'g = x + 1'}</M> とすると、
            <M>{"f' = 2x"}</M>、<M>{"g' = 1"}</M> なので
          </p>
          <MathBlock>{"\\{x^2 (x + 1)\\}' = 2x(x + 1) + x^2 \\times 1 = 3x^2 + 2x"}</MathBlock>
          <p>
            確かめ：先に展開すると <M>{'x^3 + x^2'}</M> で、微分すると <M>{'3x^2 + 2x'}</M>。同じになりました。
          </p>
        </Example>
        <p>
          次に <M>{'(2x + 1)^3'}</M> のような「かっこの中に式が入った関数」です。かっこの中を <M>{'u = 2x + 1'}</M> とおくと、
          <M>{'y = u^3'}</M>（外側）と <M>{'u = 2x + 1'}</M>（内側）の2段階になっています。
        </p>
        <MathBlock caption="合成関数の微分（チェーンルール）：外側を微分して、内側の微分をかける">{'\\frac{dy}{dx} = \\frac{dy}{du} \\times \\frac{du}{dx}'}</MathBlock>
        <Example title="(2x + 1)³ を微分する">
          <Steps>
            <li>
              外側 <M>{'y = u^3'}</M> を u で微分：<M>{'\\frac{dy}{du} = 3u^2'}</M>
            </li>
            <li>
              内側 <M>{'u = 2x + 1'}</M> を x で微分：<M>{'\\frac{du}{dx} = 2'}</M>
            </li>
            <li>
              かける：<M>{'\\frac{dy}{dx} = 3u^2 \\times 2 = 6(2x + 1)^2'}</M>
            </li>
          </Steps>
          <p>
            確かめ：展開すると <M>{'(2x + 1)^3 = 8x^3 + 12x^2 + 6x + 1'}</M>、微分すると <M>{'24x^2 + 24x + 6 = 6(4x^2 + 4x + 1) = 6(2x + 1)^2'}</M>。一致します。
          </p>
        </Example>
        <p>
          統計でよく出るのは <M>{'(1 - p)^k'}</M> の形です。内側 <M>{'1 - p'}</M> を微分すると <M>{'-1'}</M> なので、マイナスがつきます。
        </p>
        <MathBlock caption="(1 − p) の k 乗の微分。内側の微分 −1 を忘れやすい">{"\\{(1 - p)^k\\}' = k(1 - p)^{k-1} \\times (-1) = -k(1 - p)^{k-1}"}</MathBlock>
        <Note title="dy/du × du/dx の見た目">
          <p>
            <M>{'\\frac{dy}{du} \\times \\frac{du}{dx}'}</M> は、分数の約分のように du が消えて <M>{'\\frac{dy}{dx}'}</M> になる見た目をしています。
            厳密には分数ではありませんが、覚え方としては役に立ちます。
          </p>
        </Note>
      </Section>

      <Section title="増減と極値：微分して 0 とおく">
        <p>
          導関数 <M>{"f'(x)"}</M> は各点での傾きなので、その<strong>符号</strong>を見ると、グラフが上っているか下っているかがわかります。
        </p>
        <ul>
          <li>
            <M>{"f'(x) > 0"}</M>：右へ進むと上る（<strong>増加</strong>）
          </li>
          <li>
            <M>{"f'(x) < 0"}</M>：右へ進むと下る（<strong>減少</strong>）
          </li>
          <li>
            <M>{"f'(x) = 0"}</M>：その点では平ら。上りから下りに変わる点が<strong>極大</strong>（山の頂上）、下りから上りに変わる点が<strong>極小</strong>（谷の底）。2つ合わせて<strong>極値</strong>という
          </li>
        </ul>
        <Figure caption="x を動かしてみよう。上は f(x) = x³ − 3x と接線、下は導関数 f′(x) = 3x² − 3。f′ が 0 になる x = −1, 1 で、f は山の頂上・谷の底になる">
          <SlopeSignFigure />
        </Figure>
        <MathNote title="2次式を 0 とおいて解く（因数分解）">
          <p>
            <M>{"f'(x) = 3x^2 - 3 = 0"}</M> は、両辺を 3 で割って <M>{'x^2 = 1'}</M>、よって <M>{'x = 1'}</M> または <M>{'x = -1'}</M>。
          </p>
          <p>
            <M>{'x^2 - 4x + 3 = 0'}</M> のような形は、「<strong>かけて 3、足して −4</strong>」になる2つの数（−1 と −3）を探して
            <M>{'(x - 1)(x - 3) = 0'}</M> と書き直します（<strong>因数分解</strong>）。かけて 0 になるのはどちらかが 0 のときなので、<M>{'x = 1'}</M> または <M>{'x = 3'}</M>。
            展開すると元に戻ることで確かめられます：<M>{'(x - 1)(x - 3) = x^2 - 3x - x + 3 = x^2 - 4x + 3'}</M>。
          </p>
        </MathNote>
        <p>増え方・減り方を表にまとめたものを<strong>増減表</strong>といいます。</p>
        <DataTable
          head={['x', 'x < −1', '−1', '−1 < x < 1', '1', 'x > 1']}
          rows={[
            ["f′(x) の符号", '+', '0', '−', '0', '+'],
            ['f(x)', '↗ 増加', '2（極大）', '↘ 減少', '−2（極小）', '↗ 増加'],
          ]}
          caption="f(x) = x³ − 3x の増減表。f(−1) = −1 + 3 = 2、f(1) = 1 − 3 = −2"
        />
        <Example title="データからのずれの2乗和を最小にする a（最小二乗法の準備）">
          <p>
            データ 3, 5, 10 に対して、「1つの数 a で代表させたときのずれの2乗和」<M>{'g(a) = (3 - a)^2 + (5 - a)^2 + (10 - a)^2'}</M> を最小にする a を求めます。
          </p>
          <Steps>
            <li>
              チェーンルールで各項を微分：<M>{"\\{(3 - a)^2\\}' = 2(3 - a) \\times (-1) = -2(3 - a)"}</M>
            </li>
            <li>
              足す：<M>{"g'(a) = -2(3 - a) - 2(5 - a) - 2(10 - a) = -2\\{(3 + 5 + 10) - 3a\\} = -2(18 - 3a) = 6a - 36"}</M>（−2 でくくって、かっこの中の数どうし・a どうしをまとめた）
            </li>
            <li>
              0 とおく：<M>{'6a - 36 = 0'}</M> より <M>{'a = 6'}</M>。これは平均 <M>{'\\frac{3 + 5 + 10}{3} = 6'}</M> と同じ
            </li>
          </Steps>
          <p>
            「平均は、ずれの2乗和を最小にする値」だとわかりました。回帰直線の<Link to="/lessons/bivariate-simple-regression">最小二乗法</Link>も、同じ「2乗和を微分して 0」の計算です。
          </p>
        </Example>
        <Figure caption="a を動かしてみよう。接線が水平（傾き 0）になる a = 6 で、2乗和 g(a) が一番小さい">
          <SquaredErrorFigure />
        </Figure>
        <Example title="p(1 − p) を最大にする p（最尤法の準備）">
          <p>
            0 ≤ p ≤ 1 で <M>{'f(p) = p(1 - p) = p - p^2'}</M> を最大にする p を求めます（ベルヌーイ分布の分散の形です）。
          </p>
          <Steps>
            <li>
              微分：<M>{"f'(p) = 1 - 2p"}</M>
            </li>
            <li>
              0 とおく：<M>{'1 - 2p = 0'}</M> より <M>{'p = \\frac{1}{2}'}</M>
            </li>
            <li>
              確かめ：p が 1/2 より小さいと <M>{"f'(p) > 0"}</M>（上り）、大きいと <M>{"f'(p) < 0"}</M>（下り）なので、p = 1/2 は頂上。最大値は <M>{'\\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}'}</M>
            </li>
          </Steps>
        </Example>
        <MathNote title="2回微分（頂上か谷底かの見分け方）">
          <p>
            導関数をもう一度微分したものを <M>{"f''(x)"}</M>（2回微分、2階導関数）と書きます。<M>{"f'(a) = 0"}</M> で <M>{"f''(a) < 0"}</M> なら、傾きが「プラス → 0 → マイナス」と減っていくので頂上（極大）、
            <M>{"f''(a) > 0"}</M> なら谷底（極小）です。上の例では <M>{"f''(p) = -2 < 0"}</M> なので頂上。
            準1級では、対数尤度の2回微分が<strong>フィッシャー情報量</strong>として出てきます。
          </p>
        </MathNote>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="曲線も、うんと拡大すれば直線">
          <p>
            どんな（なめらかな）曲線も、1点のまわりを虫めがねでうんと拡大すると、ほとんどまっすぐに見えます。その「まっすぐに見える線」が接線で、その傾きが微分です。
            だから「x が少しだけ増えると、f はおよそ（傾き）×（増えた分）だけ増える」と読めます。この見方は<Link to="/lessons/pre1-math-exp-log">1次近似（デルタ法の準備）</Link>につながります。
          </p>
        </Intuition>
        <Intuition title="頂上では、どちらへ一歩動いても高さはほぼ変わらない">
          <p>
            山の頂上に立つと、足もとは平らです。少し動いても高さがほとんど変わらない＝傾きが 0。だから「傾きが 0 の点」を探せば頂上（や谷底）の候補が見つかります。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{"(x^3)' = 3x^3"}</M> としてしまう → 指数を前に下ろしたら、指数を 1 減らす：<M>{'3x^2'}</M>。
            </li>
            <li>
              定数を微分しても残すと思う → <M>{"(5)' = 0"}</M>。ただし定数<strong>倍</strong>は残る：<M>{"(5x)' = 5"}</M>。
            </li>
            <li>
              積の微分を「微分どうしのかけ算」<M>{"f'g'"}</M> にしてしまう → <M>{"f'g + fg'"}</M>。
            </li>
            <li>
              <M>{'(1 - p)^k'}</M> の微分で、内側の微分 −1 をかけ忘れる → マイナスがつく。
            </li>
            <li>
              「微分して 0 なら必ず最大」と思う → 谷底（最小）や、平らなだけの点のこともある。増減表か2回微分で確かめる。範囲の端の値も比べる。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="準1級のどこで使うか">
        <ExamTip title="準1級のどこで使うか">
          <ul>
            <li>
              <strong>最尤法</strong>（<Link to="/chapters/pre1-estimation">推定</Link>）：尤度（の対数）を、パラメータで微分して 0 とおき、最尤推定量を求める。準備は<Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link>で。
            </li>
            <li>
              <strong>フィッシャー情報量・クラーメル・ラオの不等式</strong>（<Link to="/chapters/pre1-estimation">推定</Link>）：対数尤度の2回微分を使う。
            </li>
            <li>
              <strong>積率母関数</strong>（<Link to="/chapters/pre1-probability">確率と確率変数</Link>）：積率母関数を t で微分して t = 0 を代入すると、期待値などが出てくる。
            </li>
            <li>
              <strong>最小二乗法</strong>（<Link to="/chapters/pre1-regression">回帰分析</Link>）：残差の2乗和を係数で微分して 0 とおく。係数が2つ以上なら<Link to="/lessons/pre1-math-multivariable">偏微分</Link>を使う。
            </li>
          </ul>
          <p>
            出題範囲表（2027年1月1日版）には「微分」そのものは項目として載っていません。ただ、上の最尤法・積率母関数などは範囲表の項目で、その計算には微分が欠かせません。
            本番の問題でどの程度の微分計算が求められるかは、公式の資料からは確かめていません。
          </p>
        </ExamTip>
      </Section>
    </>
  )
}
