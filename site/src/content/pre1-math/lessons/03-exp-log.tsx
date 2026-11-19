import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { ExpLogFigure, LikelihoodFigure, LinearApproxFigure } from '../figures/ExpLogFigures'

export const meta: LessonMeta = {
  id: 'pre1-math-exp-log',
  chapter: 'pre1-math',
  order: 3,
  title: '指数・対数と微分',
  summary: '指数法則、e と自然対数 log、「積を和に変える」log の性質、e^x と log x の微分を学び、尤度を対数にして微分して最大化する流れ（最尤法）と、1次近似（デルタ法の準備）を練習します。',
  minutes: 60,
  keywords: ['指数法則', '自然対数', '対数尤度', '最尤推定', '1次近似'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>対数 log は「かけ算をたし算に変える道具」</strong>です。尤度（データが出る確率）はたくさんの確率の<strong>かけ算</strong>なので、そのままでは微分が大変です。
          log をとると<strong>たし算</strong>になり、1項ずつ微分できます。使う微分は <M>{"(e^x)' = e^x"}</M> と <M>{"(\\log x)' = \\frac{1}{x}"}</M> の2つだけです。
        </p>
      </Point>

      <Section title="指数法則のおさらい">
        <p>
          2級の<Link to="/lessons/math-function-graph-area">関数・グラフ・面積</Link>で、<M>{'2^3 = 2 \\times 2 \\times 2'}</M> のように「何回かけるか」を表すのが指数でした。ルールをまとめます。
        </p>
        <MathBlock caption="指数法則（a > 0）">{'a^m a^n = a^{m+n}, \\qquad \\frac{a^m}{a^n} = a^{m-n}, \\qquad (a^m)^n = a^{mn}, \\qquad (ab)^n = a^n b^n'}</MathBlock>
        <MathBlock caption="0乗・マイナス乗・分数乗の約束">{'a^0 = 1, \\qquad a^{-n} = \\frac{1}{a^n}, \\qquad a^{\\frac{1}{2}} = \\sqrt{a}'}</MathBlock>
        <Example title="指数分布の尤度で出てくる計算">
          <p>
            <M>{'e^{-2\\lambda} \\times e^{-3\\lambda} \\times e^{-\\lambda} = e^{-2\\lambda - 3\\lambda - \\lambda} = e^{-6\\lambda}'}</M>。
            かけ算は指数のたし算なので、「<M>{'e^{-\\lambda x_1} e^{-\\lambda x_2} \\cdots e^{-\\lambda x_n} = e^{-\\lambda (x_1 + x_2 + \\cdots + x_n)}'}</M>」とまとめられます。
          </p>
        </Example>
      </Section>

      <Section title="e と自然対数 log">
        <p>
          <M>{'e = 2.71828\\ldots'}</M>（ネイピア数）は、「<strong>微分しても形が変わらない</strong>」特別な指数関数 <M>{'e^x'}</M> の底です。
          <strong>対数</strong>は指数の逆で、<M>{'\\log x'}</M> は「<strong>e を何乗すると x になるか</strong>」を表します（e を底とする対数を<strong>自然対数</strong>といいます）。
        </p>
        <MathBlock caption="e^y = x と y = log x は同じことを言っている">{'e^y = x \\quad \\Longleftrightarrow \\quad y = \\log x \\qquad (x > 0)'}</MathBlock>
        <DataTable
          head={['x', '1', 'e ≒ 2.718', <M key="e2">{'e^2'}</M>, <M key="em">{'e^{-1} = 1/e'}</M>, '2', '3', '10']}
          rows={[['log x', '0', '1', '2', '−1', '0.6931', '1.0986', '2.3026']]}
          caption="log 1 = 0（e⁰ = 1 だから）、log e = 1。log 2 などは電卓では出せないので、試験では問題文に値が与えられる"
        />
        <MathNote title="e はどこから来た数か">
          <p>
            e は、<M>{'\\left(1 + \\frac{1}{n}\\right)^n'}</M> で n を大きくしていったときに近づく数です（n = 10 で 2.594、n = 100 で 2.705、n = 1000 で 2.717）。
            同じように <M>{'\\left(1 + \\frac{a}{n}\\right)^n \\to e^a'}</M>（n → ∞）が成り立ちます。
            この形は、<Link to="/chapters/pre1-probability">確率と確率変数</Link>の章で、二項分布がポアソン分布に近づくこと（少数法則）を示すときに使います。
          </p>
        </MathNote>
        <Note title="log の書き方は流儀が分かれる">
          <p>
            統計や大学の数学では、底を書かない <M>{'\\log x'}</M> は自然対数（底 e）を表すのがふつうです。<M>{'\\ln x'}</M> と書く本もあります。
            高校の教科書や工学では <M>{'\\log x'}</M> が常用対数（底 10）を表すこともあるので、問題文の約束を確認しましょう。このサイトの準1級コースでは、<M>{'\\log'}</M> は自然対数です。
          </p>
        </Note>
        <Figure caption="t を動かしてみよう。y = e^x の点を直線 y = x で折り返すと y = log x の点になる（逆関数）。log x は x > 0 でしか定義されない">
          <ExpLogFigure />
        </Figure>
      </Section>

      <Section title="log の性質：かけ算がたし算になる">
        <MathBlock caption="対数の3つの性質（a, b > 0）">{'\\log(ab) = \\log a + \\log b, \\qquad \\log\\frac{a}{b} = \\log a - \\log b, \\qquad \\log a^n = n \\log a'}</MathBlock>
        <p>
          理由は指数法則です。<M>{'a = e^s'}</M>、<M>{'b = e^t'}</M> とすると <M>{'ab = e^{s+t}'}</M> なので、<M>{'\\log(ab) = s + t = \\log a + \\log b'}</M>。
        </p>
        <Example title="値を組み合わせて計算する">
          <Steps>
            <li>
              <M>{'\\log 6 = \\log(2 \\times 3) = \\log 2 + \\log 3 = 0.6931 + 1.0986 = 1.7917'}</M>
            </li>
            <li>
              <M>{'\\log 8 = \\log 2^3 = 3 \\log 2 = 3 \\times 0.6931 = 2.0793'}</M>
            </li>
            <li>
              <M>{'\\log 0.5 = \\log \\frac{1}{2} = \\log 1 - \\log 2 = -0.6931'}</M>（1 より小さい数の log はマイナス）
            </li>
          </Steps>
        </Example>
        <Example title="尤度の形を log でほどく">
          <p>
            <M>{'\\log\\{p^3 (1 - p)^2\\} = \\log p^3 + \\log (1 - p)^2 = 3 \\log p + 2 \\log(1 - p)'}</M>。
            かけ算 → たし算、何乗 → 何倍、になりました。
          </p>
        </Example>
      </Section>

      <Section title="e^x と log x の微分">
        <MathBlock caption="指数関数と対数関数の微分">{"(e^x)' = e^x, \\qquad (\\log x)' = \\frac{1}{x}"}</MathBlock>
        <p>
          <M>{'e^x'}</M> は、グラフの高さとその点での傾きがいつも同じ、という関数です（上の図で確かめられます）。
          <M>{'\\log x'}</M> の傾きは <M>{'\\frac{1}{x}'}</M> で、x が大きくなるほどゆるやかになります。
          <Link to="/lessons/pre1-math-derivative">チェーンルール</Link>と組み合わせると、次の形がよく使われます。
        </p>
        <MathBlock caption="チェーンルールとの組み合わせ（内側の微分をかける）">{"(e^{ax})' = a\\,e^{ax}, \\qquad \\{\\log g(x)\\}' = \\frac{g'(x)}{g(x)}"}</MathBlock>
        <p>
          左は、外側 <M>{'e^u'}</M> の微分 <M>{'e^u'}</M> に内側 <M>{'u = ax'}</M> の微分 a をかけたもの。右は、外側 <M>{'\\log u'}</M> の微分 <M>{'\\frac{1}{u}'}</M> に内側 <M>{'u = g(x)'}</M> の微分 <M>{"g'(x)"}</M> をかけたもの（<M>{"\\frac{1}{g(x)} \\times g'(x)"}</M>）です。
        </p>
        <DataTable
          head={['関数', '微分', '考え方']}
          rows={[
            [<M key="1">{'e^{-x}'}</M>, <M key="1d">{'-e^{-x}'}</M>, '内側 −x の微分 −1 をかける'],
            [<M key="2">{'e^{-x^2/2}'}</M>, <M key="2d">{'-x\\,e^{-x^2/2}'}</M>, '内側 −x²/2 の微分は −x'],
            [<M key="3">{'\\log(1 - p)'}</M>, <M key="3d">{'-\\frac{1}{1 - p}'}</M>, '内側 1 − p の微分は −1'],
            [<M key="4">{'\\log \\lambda^n = n \\log \\lambda'}</M>, <M key="4d">{'\\frac{n}{\\lambda}'}</M>, '先に log の性質で n を前に出す'],
          ]}
        />
      </Section>

      <Section title="最尤法の流れ：尤度 → 対数 → 微分して 0">
        <p>
          コインを 10 回投げて、表が 7 回出たとします。表の出る確率 p はいくつと考えるのが自然でしょうか。
          <strong>最尤法</strong>は「<strong>いま手元にあるデータが一番出やすくなる p</strong>」を答えにする方法です（2級の<Link to="/lessons/estimation-point">点推定</Link>の続き。くわしくは<Link to="/chapters/pre1-estimation">推定</Link>の章）。
        </p>
        <p>
          どの順で表が出たかまで含めて、このデータが出る確率は <M>{'p^7 (1 - p)^3'}</M>（表の確率 p を 7 回、裏の確率 1 − p を 3 回かける。<Link to="/lessons/distributions-binomial">ベルヌーイ試行</Link>）。
          これを p の関数と見たものを<strong>尤度</strong>（ゆうど）<M>{'L(p)'}</M> といいます。
        </p>
        <Steps>
          <li>
            尤度：<M>{'L(p) = p^7 (1 - p)^3'}</M>
          </li>
          <li>
            対数をとる（<strong>対数尤度</strong>）：<M>{'\\log L(p) = 7 \\log p + 3 \\log(1 - p)'}</M>
          </li>
          <li>
            p で微分する：<M>{'\\frac{d}{dp} \\log L(p) = \\frac{7}{p} - \\frac{3}{1 - p}'}</M>
          </li>
          <li>
            0 とおいて解く：<M>{'\\frac{7}{p} = \\frac{3}{1 - p}'}</M>。両辺に <M>{'p(1 - p)'}</M> をかけて <M>{'7(1 - p) = 3p'}</M>、<M>{'7 = 10p'}</M>、<M>{'p = 0.7'}</M>
          </li>
        </Steps>
        <p>
          答えは「10 回中 7 回だから 0.7」という素直な値になりました。一般に n 回中 k 回なら、同じ計算で <M>{'\\hat{p} = \\frac{k}{n}'}</M> になります（<M>{'\\hat{p}'}</M> は「推定した p」）。
        </p>
        <Figure caption="成功の回数 k と p を動かしてみよう。上の尤度と下の対数尤度は、同じ p = k/10 で一番高くなる。そこでは対数尤度の接線が水平">
          <LikelihoodFigure />
        </Figure>
        <Intuition title="log をとっても、一番高い場所は変わらない">
          <p>
            log は「大きい数ほど log も大きい」（増加関数）なので、L(p) が一番大きい p と、log L(p) が一番大きい p は同じです。
            だから、計算しやすい log L のほうを最大化すればよいのです。尤度の値は 0.002 のようにとても小さくなりますが、log をとると扱いやすい大きさになるという利点もあります。
          </p>
        </Intuition>
        <Example title="指数分布の最尤推定">
          <p>
            待ち時間が指数分布 <M>{'f(x) = \\lambda e^{-\\lambda x}'}</M> に従うとして、データ <M>{'x_1, \\ldots, x_n'}</M> から λ を推定します。
          </p>
          <Steps>
            <li>
              尤度（各データの密度のかけ算）：<M>{'L(\\lambda) = \\lambda e^{-\\lambda x_1} \\times \\cdots \\times \\lambda e^{-\\lambda x_n} = \\lambda^n e^{-\\lambda \\sum x_i}'}</M>
            </li>
            <li>
              対数：<M>{'\\log L(\\lambda) = n \\log \\lambda - \\lambda \\sum x_i'}</M>（<M>{'\\log e^{a} = a'}</M> を使った）
            </li>
            <li>
              微分して 0：<M>{'\\frac{n}{\\lambda} - \\sum x_i = 0'}</M> より <M>{'\\hat{\\lambda} = \\frac{n}{\\sum x_i} = \\frac{1}{\\bar{x}}'}</M>
            </li>
          </Steps>
          <p>平均の待ち時間が 1/λ なので、「λ は平均の逆数」という自然な答えです。</p>
        </Example>
      </Section>

      <Section title="1次近似：接線で近くの値を見積もる（デルタ法の準備）">
        <p>
          <Link to="/lessons/pre1-math-derivative">微分の考え方</Link>で見たとおり、曲線は1点のまわりではほとんど接線と同じです。そこで、点 a の近くの x では次のように近似できます。
        </p>
        <MathBlock caption="1次近似（テイラー展開の1次の項まで）。x が a に近いほど正確">{"f(x) \\approx f(a) + f'(a)(x - a)"}</MathBlock>
        <DataTable
          head={['近似したいもの', 'f と a', '近似の計算', '本当の値']}
          rows={[
            [<M key="1">{'\\sqrt{4.1}'}</M>, <M key="1a">{'\\sqrt{x},\\ a = 4'}</M>, <M key="1b">{'2 + \\frac{1}{2\\sqrt{4}} \\times 0.1 = 2.025'}</M>, '2.0248…'],
            [<M key="2">{'\\log 1.05'}</M>, <M key="2a">{'\\log x,\\ a = 1'}</M>, <M key="2b">{'0 + 1 \\times 0.05 = 0.05'}</M>, '0.0488…'],
            [<M key="3">{'e^{0.1}'}</M>, <M key="3a">{'e^x,\\ a = 0'}</M>, <M key="3b">{'1 + 1 \\times 0.1 = 1.1'}</M>, '1.1052…'],
          ]}
          caption="「log(1 + x) ≒ x」「e^x ≒ 1 + x」（x が 0 に近いとき）はよく使う"
        />
        <Figure caption="関数を選んで x を動かしてみよう。a の近くでは接線（点線）と曲線がほとんど重なり、離れるほどずれが大きくなる">
          <LinearApproxFigure />
        </Figure>
        <Example title="デルタ法の考え方（雰囲気）">
          <p>
            標本平均 <M>{'\\bar{X}'}</M> が平均 μ = 9 のまわりに、分散 0.36 で散らばっているとします。<M>{'\\sqrt{\\bar{X}}'}</M> の分散はおよそいくつでしょうか。
          </p>
          <Steps>
            <li>
              μ = 9 のまわりで1次近似：<M>{'\\sqrt{\\bar{X}} \\approx \\sqrt{9} + \\frac{1}{2\\sqrt{9}}(\\bar{X} - 9) = 3 + \\frac{1}{6}(\\bar{X} - 9)'}</M>
            </li>
            <li>
              右辺は <M>{'\\bar{X}'}</M> の1次式なので、2級の<Link to="/lessons/random-variables-linear-transform">1次変換</Link>の公式 <M>{'V[aX + b] = a^2 V[X]'}</M> が使える
            </li>
            <li>
              <M>{'V[\\sqrt{\\bar{X}}] \\approx \\left(\\frac{1}{6}\\right)^2 \\times 0.36 = \\frac{0.36}{36} = 0.01'}</M>
            </li>
          </Steps>
          <p>
            一般に <M>{"V[g(\\bar{X})] \\approx \\{g'(\\mu)\\}^2 \\, V[\\bar{X}]"}</M>。これが<strong>デルタ法</strong>の中心の式で、準1級の<Link to="/chapters/pre1-probability">確率と確率変数</Link>の章で正式に扱います。
          </p>
        </Example>
        <MathNote title="テイラー展開（2次以上）">
          <p>
            もっと正確にしたいときは、2回微分を使った項を足します：<M>{"f(x) \\approx f(a) + f'(a)(x - a) + \\frac{f''(a)}{2}(x - a)^2"}</M>。
            これを無限に続けたものがテイラー展開です。準1級で使うのは、ほとんど1次（ときどき2次）までです。
          </p>
          <p>
            例外として、<M>{'e^x'}</M> を a = 0 のまわりで無限に続けた形はよく使います。<M>{'e^x'}</M> は何回微分しても <M>{'e^x'}</M> で、x = 0 では値がいつも 1 なので、
          </p>
          <MathBlock caption="e^x のテイラー展開（どんな x でも成り立つ）。k! は k の階乗">{'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots = \\sum_{k=0}^{\\infty} \\frac{x^k}{k!}'}</MathBlock>
          <p>
            ポアソン分布の確率の合計が 1 になること（<M>{'\\sum_{k} \\frac{\\lambda^k}{k!} = e^{\\lambda}'}</M>）や、<Link to="/chapters/pre1-probability">積率母関数</Link>の計算で出てきます。
          </p>
        </MathNote>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'\\log(a + b) = \\log a + \\log b'}</M> としてしまう → 和にできるのは<strong>積</strong>の log：<M>{'\\log(ab) = \\log a + \\log b'}</M>。
            </li>
            <li>
              <M>{'e^a \\times e^b = e^{ab}'}</M> としてしまう → かけ算は指数の<strong>たし算</strong>：<M>{'e^{a+b}'}</M>。
            </li>
            <li>
              <M>{"(e^{2x})' = e^{2x}"}</M> としてしまう → 内側の微分 2 をかける：<M>{'2e^{2x}'}</M>。
            </li>
            <li>
              <M>{"(\\log x)' = \\log x"}</M> や <M>{'x'}</M> と思う → <M>{'\\frac{1}{x}'}</M>。
            </li>
            <li>
              0 やマイナスの数の log を計算しようとする → log x は x &gt; 0 でしか決まらない。
            </li>
            <li>1次近似は、どこでも正確だと思う → a から離れるほどずれる。デルタ法も「n が大きく、ばらつきが小さい」ときの近似。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="準1級のどこで使うか">
        <ExamTip title="準1級のどこで使うか">
          <ul>
            <li>
              <strong>最尤法</strong>（<Link to="/chapters/pre1-estimation">推定</Link>）：二項・ポアソン・指数・正規分布などの最尤推定量を、対数尤度を微分して求める。
            </li>
            <li>
              <strong>尤度比検定</strong>（<Link to="/chapters/pre1-testing">検定</Link>）：尤度の比の log（対数尤度の差）を使う。
            </li>
            <li>
              <strong>デルタ法</strong>（<Link to="/chapters/pre1-probability">確率と確率変数</Link>）：1次近似で、推定量を変換したものの分散を求める。
            </li>
            <li>
              <strong>ロジスティック回帰・対数正規分布</strong>（<Link to="/chapters/pre1-regression">回帰分析</Link>・<Link to="/chapters/pre1-distributions">種々の確率分布</Link>）：<M>{'\\log\\frac{p}{1 - p}'}</M> や <M>{'\\log X'}</M> の形で log が出てくる。
            </li>
          </ul>
          <p>
            出題範囲表（2027年1月1日版）には最尤法・デルタ法・尤度比検定・ロジスティック回帰モデル・対数正規分布が載っています。
            試験で使えるのは普通の電卓だけ（関数電卓は不可。公式サイトで確認）なので、e や log の値は手元で計算できません。
            このサイトの問題では必要な値を問題文で与えます。本番でも与えられるものと考えられますが、これは推測で、確かめてはいません。
          </p>
        </ExamTip>
      </Section>
    </>
  )
}
