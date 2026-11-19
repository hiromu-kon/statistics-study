import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import { NormalArea } from '../../../components/charts/common'
import type { LessonMeta } from '../../../types'
import { ChooseDistribution } from '../figures/ChooseDistribution'
import { BivariateNormalContour, LinearTransformExplorer, NormalSumExplorer } from '../figures/NormalPropertyFigures'

export const meta: LessonMeta = {
  id: 'distributions-normal-properties',
  chapter: 'distributions',
  order: 6,
  title: '正規分布の性質と2変量正規分布',
  summary: '正規分布は「何倍かして足す」「独立なものどうしを足し引きする」をしても正規分布のまま。2つの量が組になった2変量正規分布も見ておきます。',
  minutes: 35,
  keywords: ['正規分布の再生性', '線形変換', '2変量正規分布', '相関係数'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <ul>
          <li>
            <M>{'X \\sim N(\\mu, \\sigma^2)'}</M> なら <M>{'aX + b \\sim N(a\\mu + b,\\ a^2\\sigma^2)'}</M>。<strong>正規分布は線形変換しても正規分布</strong>。
          </li>
          <li>
            独立な正規分布の<strong>和も差も正規分布</strong>。平均は足し引き、<strong>分散はどちらも足し算</strong>（再生性）。
          </li>
          <li>
            2つの量の組 <M>{'(X, Y)'}</M> が<strong>2変量正規分布</strong>に従うとき、確率の山の等高線は楕円になり、相関係数 <M>{'\\rho'}</M>（「ロー」と読むギリシャ文字）が楕円の傾きと細さを決める。
          </li>
          <li>最後に、この章で出てきた分布を「場面からどれを使うか」で整理します。</li>
        </ul>
      </Point>

      <Section title="線形変換：何倍かして足しても正規分布">
        <p>
          温度の単位を摂氏から華氏に変える（<M>{'F = 1.8C + 32'}</M>）、点数を「2倍して10点足す」ように調整する、などが線形変換です。
          正規分布に従う量を線形変換すると、<strong>形はつりがね形のまま</strong>、位置と幅だけが変わります。
          平均と分散の変わり方は<Link to="/lessons/random-variables-linear-transform">確率変数の線形変換のレッスン</Link>と同じです。
        </p>
        <MathBlock caption="平均は同じ計算、分散は a² 倍（b は散らばりに影響しない）">{'X \\sim N(\\mu, \\sigma^2) \\ \\Rightarrow\\ aX + b \\sim N(a\\mu + b,\\ a^2\\sigma^2)'}</MathBlock>
        <Example title="気温を摂氏から華氏に">
          <p>
            ある日の正午の気温（摂氏）<M>C</M> が <M>{'N(20, 5^2)'}</M> に従うとき、華氏 <M>{'F = 1.8C + 32'}</M> の分布は？（<M>{'a = 1.8'}</M>、<M>{'b = 32'}</M>）
          </p>
          <Steps>
            <li>
              平均：<M>{'1.8 \\times 20 + 32 = 36 + 32 = 68'}</M>
            </li>
            <li>
              分散：<M>{'1.8^2 \\times 5^2 = 3.24 \\times 25 = 81'}</M>（足した 32 は関係ない）
            </li>
            <li>
              標準偏差：<M>{'\\sqrt{81} = 9'}</M>（<M>{'1.8 \\times 5 = 9'}</M> と、標準偏差を直接 a 倍しても同じ）
            </li>
            <li>
              答え：<M>{'F \\sim N(68, 9^2)'}</M>
            </li>
          </Steps>
        </Example>
        <p>
          標準化 <M>{'Z = (X - \\mu)/\\sigma'}</M> も、<M>{'a = 1/\\sigma'}</M>、<M>{'b = -\\mu/\\sigma'}</M> の線形変換です。
          平均は <M>{'\\mu/\\sigma - \\mu/\\sigma = 0'}</M>、分散は <M>{'\\sigma^2/\\sigma^2 = 1'}</M> になるので、<M>{'N(0, 1)'}</M> になるわけです。
        </p>
        <Figure caption="見るところは、点線（もとの X）と実線（Y）の山の位置と幅。X ~ N(5, 1²)（点線）を Y = aX + b に変換する。a で幅が a 倍になり（高さは低くなる）、b で左右に動く">
          <LinearTransformExplorer />
        </Figure>
      </Section>

      <Section title="独立な正規分布の和と差">
        <p>
          「独立」は「片方の結果が、もう片方の確率に影響しない」という意味です（<Link to="/lessons/random-variables-sum-covariance">確率変数の和のレッスン</Link>）。
          添字の1と2は「1つめの量」「2つめの量」の区別です。
        </p>
        <MathBlock caption="X ~ N(μ₁, σ₁²) と Y ~ N(μ₂, σ₂²) が独立なとき">{'X + Y \\sim N(\\mu_1 + \\mu_2,\\ \\sigma_1^2 + \\sigma_2^2), \\qquad X - Y \\sim N(\\mu_1 - \\mu_2,\\ \\sigma_1^2 + \\sigma_2^2)'}</MathBlock>
        <p>
          平均・分散の足し算のルール自体は「確率変数」の章と同じです。正規分布の場合はそれに加えて、<strong>結果もまた正規分布になる</strong>ので、
          標準化して表を引けます。これが<strong>正規分布の再生性</strong>です。
        </p>
        <Example title="2つの部品をつなげた長さ">
          <p>
            部品Aの長さは <M>{'N(30, 0.3^2)'}</M>、部品Bの長さは <M>{'N(20, 0.4^2)'}</M>（単位 mm、独立）。つなげた長さが 51 mm を超える確率は？
          </p>
          <Steps>
            <li>
              合計の平均：<M>{'30 + 20 = 50'}</M>
            </li>
            <li>
              合計の分散：<M>{'0.3^2 + 0.4^2 = 0.09 + 0.16 = 0.25'}</M>、標準偏差 <M>{'\\sqrt{0.25} = 0.5'}</M>
            </li>
            <li>
              標準化：<M>{'z = (51 - 50) / 0.5 = 2.00'}</M>
            </li>
            <li>
              表を引く：<M>{'P(Z > 2.00) = 0.0228'}</M>
            </li>
          </Steps>
          <NormalArea mu={50} sigma={0.5} from={51} to={1000} xLabel="つなげた長さ（mm）" />
        </Example>
        <Figure caption="見るところは、太い線（和または差）の幅が、もとの2本のどちらよりも広いこと。和と差を切りかえて、平均と分散がどう変わるか見てみよう。差にしても、分散は「引き算」ではなく「足し算」になる">
          <NormalSumExplorer />
        </Figure>
        <Intuition title="差なのに分散が足し算になるのはなぜ？">
          <p>
            <M>{'X - Y = X + (-1)Y'}</M> と考えると、<M>{'(-1)Y'}</M> の分散は <M>{'(-1)^2 \\sigma_2^2 = \\sigma_2^2'}</M>。
            それを足すので、分散は <M>{'\\sigma_1^2 + \\sigma_2^2'}</M>。どちらの量も「ぶれ」をもっているので、差をとるとぶれは打ち消されるどころか合わさります。
          </p>
        </Intuition>
      </Section>

      <Section title="同じものを n 個足す場合と、n 倍する場合">
        <p>ここは特に間違えやすいところです。1個の重さが <M>{'N(25, 2^2)'}</M> の部品を考えます。</p>
        <DataTable
          head={['', '式', '平均', '分散', '標準偏差']}
          rows={[
            ['独立な4個の合計', <M key="a">{'X_1 + X_2 + X_3 + X_4'}</M>, '100', '4 × 4 = 16', '4'],
            ['1個の重さを4倍', <M key="b">{'4X'}</M>, '100', '4² × 4 = 64', '8'],
          ]}
          caption="平均は同じだが、分散が違う"
        />
        <p>
          別々の4個を足すと、重いものと軽いものが混ざってぶれが少し打ち消しあいます。1個を4倍すると、その1個のぶれがそのまま4倍になります。
        </p>
      </Section>

      <Section title="2変量正規分布：2つの量の組の分布">
        <p>
          身長と体重、数学と理科の点数のように、<strong>2つの量が組になっていて、どちらも正規分布に従い、関係（相関）がある</strong>とき、
          その組 <M>{'(X, Y)'}</M> の分布を<strong>2変量正規分布</strong>といいます。パラメータは5つです。
        </p>
        <DataTable
          head={['パラメータ', '意味']}
          rows={[
            [<M key="a">{'\\mu_X, \\sigma_X^2'}</M>, 'X だけを見たときの平均と分散（X だけ見ると正規分布）'],
            [<M key="b">{'\\mu_Y, \\sigma_Y^2'}</M>, 'Y だけを見たときの平均と分散'],
            [<M key="c">{'\\rho'}</M>, 'X と Y の相関係数（−1 から 1）'],
          ]}
        />
        <p>
          確率の山は、平らな地面の上にできた「丘」のような形です。上から見て同じ高さの点を結ぶと（地図の等高線のように）<strong>楕円</strong>になります。
        </p>
        <Figure caption="見るところは、楕円の傾きと細さ、緑の直線の傾き。標準化した2変量正規分布（平均0・標準偏差1）。ρ = 0 だと等高線は円、ρ を大きくすると右上がりの細い楕円、マイナスにすると右下がりになる。灰色の点はこの分布から取り出した300組">
          <BivariateNormalContour />
        </Figure>
        <Intuition title="X を決めたときの Y の平均は直線になる">
          <p>
            「X = 1.5 の人たちだけ」を集めると、その人たちの Y も正規分布になり、平均は <M>{'\\rho \\times 1.5'}</M> です（標準化した場合）。
            X の値を動かすと、この平均は直線 <M>{'y = \\rho x'}</M> の上を動きます。もとの単位にもどすと次の式になり、これは「線形モデル」の章で学ぶ<strong>回帰直線</strong>と同じ形です。
          </p>
          <p className="small muted">
            <M>{'E(Y \\mid X = x)'}</M> は「X が x だと分かったときの Y の期待値（平均）」と読みます（<strong>条件付き期待値</strong>）。添字の X, Y は「X の」「Y の」という意味です。
          </p>
          <MathBlock caption="X = x のときの Y の平均（条件付き期待値）。傾きは ρσ_Y/σ_X">{'E(Y \\mid X = x) = \\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X)'}</MathBlock>
          <p>
            また、そのときの Y のばらつき（条件付き分散）は <M>{'\\sigma_Y^2(1 - \\rho^2)'}</M> で、X の値によらず一定です。<M>{'|\\rho|'}</M> が1に近いほど、X を知ると Y がよく当てられます。
          </p>
        </Intuition>
        <Example title="数学と理科の点数">
          <p>
            数学 X は平均60・標準偏差10、理科 Y は平均50・標準偏差20、相関係数 0.5 の2変量正規分布とします。数学が70点の人たちの理科の平均は
          </p>
          <Steps>
            <li>
              X が平均からどれだけ離れているか：<M>{'70 - 60 = 10'}</M>
            </li>
            <li>
              傾き：<M>{'\\rho \\times \\dfrac{\\sigma_Y}{\\sigma_X} = 0.5 \\times \\dfrac{20}{10} = 1'}</M>
            </li>
            <li>
              Y の平均からの上乗せ：<M>{'1 \\times 10 = 10'}</M>
            </li>
            <li>
              答え：<M>{'50 + 10 = 60'}</M> 点
            </li>
          </Steps>
          <MathBlock>{'E(Y \\mid X = 70) = 50 + 0.5 \\times \\frac{20}{10} \\times (70 - 60) = 60'}</MathBlock>
          <p>
            この人たちの理科の標準偏差は <M>{'\\sigma_Y\\sqrt{1 - \\rho^2} = 20 \\times \\sqrt{1 - 0.25} = 20 \\times \\sqrt{0.75} \\approx 17.3'}</M> 点で、全体の20点より少し小さくなります。
            理科の点数は <M>{'N(60, 17.3^2)'}</M> くらいの正規分布になるので、ここからさらに標準化して確率を求めることもできます。
          </p>
          <p>
            数学が平均より標準偏差1個分上でも、理科の平均は標準偏差 <M>{'0.5'}</M> 個分（10点）しか上がりません。これが「平均への回帰」と呼ばれる現象です。
          </p>
        </Example>
        <Intuition title="2変量正規分布では「無相関 ⇔ 独立」">
          <p>
            一般には「相関係数が0（無相関）」でも独立とは限りません（曲線的な関係があるかもしれない）。しかし2変量正規分布では、<M>{'\\rho = 0'}</M> なら X と Y は<strong>独立</strong>になります。
            図で ρ = 0 にすると等高線が円になり、X を決めても Y の平均が変わらない（直線が水平になる）ことからも確かめられます。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              差 <M>{'X - Y'}</M> の分散を <M>{'\\sigma_1^2 - \\sigma_2^2'}</M> とする → 独立なら差でも分散は<strong>足し算</strong>です。
            </li>
            <li>
              標準偏差を足す（<M>{'\\sigma_1 + \\sigma_2'}</M>）→ 足すのは分散。標準偏差は足したあとでルートをとります（0.3 + 0.4 = 0.7 ではなく 0.5）。
            </li>
            <li>
              独立な n 個の和と、1個の n 倍を混同する → 和の分散は <M>{'n\\sigma^2'}</M>、n 倍の分散は <M>{'n^2\\sigma^2'}</M>。
            </li>
            <li>どんな分布でも「無相関なら独立」と思う → それが言えるのは2変量正規分布のような特別な場合です。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="章のまとめ：場面から分布を選ぶ">
        <p>
          試験では「この場面ではどの分布を使うか」を自分で判断する必要があります。次の順に問いかけると、たいてい見分けられます。
        </p>
        <Steps>
          <li>数える量（とびとびの値）か、測る量（時間・長さなど連続の値）か</li>
          <li>数える量なら：回数が先に決まっているか（二項・超幾何）、成功するまで続けるか（幾何・負の二項）、決まった時間の中の回数か（ポアソン）</li>
          <li>くじや玉を戻さずに取り出すなら超幾何、戻す（毎回同じ確率）なら二項</li>
          <li>測る量なら：どの値も同じくらいか（一様）、次の出来事までの待ち時間か（指数）、平均のまわりに左右対称か（正規）</li>
        </Steps>
        <DataTable
          head={['場面のキーワード', '分布', '期待値', '分散']}
          rows={[
            ['1回だけの成功（1）か失敗（0）か', 'ベルヌーイ分布', <M key="a1">p</M>, <M key="a2">{'p(1-p)'}</M>],
            ['n 回中の成功の回数（毎回同じ確率・独立）', <Link key="b" to="/lessons/distributions-binomial">二項分布 B(n, p)</Link>, <M key="b1">np</M>, <M key="b2">{'np(1-p)'}</M>],
            ['決まった時間・広さの中で、まれな出来事が起こる回数', <Link key="c" to="/lessons/distributions-poisson">ポアソン分布 Po(λ)</Link>, <M key="c1">{'\\lambda'}</M>, <M key="c2">{'\\lambda'}</M>],
            ['初めて成功するまでの試行回数', <Link key="d" to="/lessons/distributions-geometric-hypergeometric">幾何分布</Link>, <M key="d1">{'1/p'}</M>, <M key="d2">{'(1-p)/p^2'}</M>],
            ['r 回成功するまでの試行回数', '負の二項分布', <M key="e1">{'r/p'}</M>, <M key="e2">{'r(1-p)/p^2'}</M>],
            ['戻さずに n 個取り出したときの当たりの数', '超幾何分布', <M key="f1">np</M>, <M key="f2">{'np(1-p)\\frac{N-n}{N-1}'}</M>],
            ['a から b のどの値も同じくらい', <Link key="g" to="/lessons/distributions-uniform-exponential">一様分布 U(a, b)</Link>, <M key="g1">{'\\frac{a+b}{2}'}</M>, <M key="g2">{'\\frac{(b-a)^2}{12}'}</M>],
            ['次の出来事までの待ち時間・寿命', '指数分布', <M key="h1">{'1/\\lambda'}</M>, <M key="h2">{'1/\\lambda^2'}</M>],
            ['平均のまわりに左右対称・測定誤差・多くの値の平均', <Link key="i" to="/lessons/distributions-normal">正規分布 N(μ, σ²)</Link>, <M key="i1">{'\\mu'}</M>, <M key="i2">{'\\sigma^2'}</M>],
          ]}
          caption="場面 → 分布の対応表（幾何・負の二項は試行回数の流儀。超幾何の p は M/N）"
        />
        <Figure caption="練習：場面を読んで、当てはまる分布のボタンを押してみよう。押すと正解かどうかと理由が出る">
          <ChooseDistribution />
        </Figure>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>部品の合計・2つのグループの差などを正規分布で表し、標準化して確率を求める問題。</li>
            <li>
              <M>{'aX + b'}</M> の分布（平均・分散）を答える問題。
            </li>
            <li>独立な n 個の和・平均の分布（「標本分布」の章の標本平均の分布につながる）。</li>
            <li>2変量正規分布の等高線の図から相関の正負や強さを読み取る問題、条件付き期待値の式を使う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
