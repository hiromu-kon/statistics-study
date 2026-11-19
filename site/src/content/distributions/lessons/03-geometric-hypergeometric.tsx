import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { GeometricExplorer, GeometricMemoryless, HypergeometricCompare, NegativeBinomialExplorer } from '../figures/CountingFigures'

export const meta: LessonMeta = {
  id: 'distributions-geometric-hypergeometric',
  chapter: 'distributions',
  order: 3,
  title: '幾何分布・負の二項分布・超幾何分布',
  summary: '「初めて成功するまで何回かかるか」「r 回成功するまで何回かかるか」「戻さずに取り出したとき当たりは何本か」を表す3つの分布です。',
  minutes: 35,
  keywords: ['幾何分布', '無記憶性', '負の二項分布', '超幾何分布', '非復元抽出'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <ul>
          <li>
            <strong>幾何分布</strong>：成功確率 <M>p</M> の試行を、<strong>初めて成功するまで</strong>くり返したときの回数。期待値は <M>{'1/p'}</M>。
          </li>
          <li>
            <strong>負の二項分布</strong>：<strong>r 回成功するまで</strong>くり返したときの回数。期待値は <M>{'r/p'}</M>。
          </li>
          <li>
            <strong>超幾何分布</strong>：くじを<strong>戻さずに</strong>取り出したときの当たりの数。二項分布の「戻さない版」。
          </li>
        </ul>
      </Point>

      <Section title="3つの分布は「何を数えるか」が違う">
        <p>
          どれも<Link to="/lessons/distributions-binomial">二項分布のレッスン</Link>で見た「成功か失敗か」の試し（ベルヌーイ試行）や、くじ引きから生まれる分布です。
          違いは「回数を先に決めるか」「成功するまで続けるか」「くじを戻すか」です。
        </p>
        <DataTable
          head={['分布', '何を数える（測る）か', '例']}
          rows={[
            ['二項分布', '回数 n を決めて、成功が何回か', 'サイコロを10回振って1の目が何回出るか'],
            ['幾何分布', '初めて成功するまでに何回かかるか', '1の目が初めて出るまで何回振るか'],
            ['負の二項分布', 'r 回成功するまでに何回かかるか', '1の目が3回出るまで何回振るか'],
            ['超幾何分布', '戻さずに n 個取ったとき、当たりが何個か', '当たり3本を含む10本のくじから2本引く'],
          ]}
          caption="ベルヌーイ試行のまわりの分布"
        />
      </Section>

      <Section title="幾何分布：初めて成功するまでの回数">
        <Example title="サイコロで6の目が初めて出るまで">
          <p>
            3回目で初めて6が出るのは「×（6以外）→ ×（6以外）→ ○（6）」の1通りだけです。確率は
          </p>
          <MathBlock>{'P(X = 3) = \\left(\\tfrac{5}{6}\\right)^2 \\times \\tfrac{1}{6} = \\tfrac{25}{36} \\times \\tfrac{1}{6} = \\tfrac{25}{216} \\approx 0.1157'}</MathBlock>
          <p className="small muted">
            <M>{'\\left(\\tfrac{5}{6}\\right)^2 = \\tfrac{5 \\times 5}{6 \\times 6} = \\tfrac{25}{36}'}</M>。分数どうしのかけ算は、分子どうし・分母どうしをかけます。
          </p>
          <p>二項分布と違って並び方は1通り（最後が必ず成功）なので、<M>{'{}_{n}C_{k}'}</M> は出てきません。</p>
        </Example>
        <MathBlock caption="k − 1 回続けて失敗し、k 回目に初めて成功する確率（k = 1, 2, 3, …）">{'P(X = k) = (1-p)^{k-1}\\, p'}</MathBlock>
        <MathBlock caption="幾何分布の期待値と分散">{'E(X) = \\frac{1}{p}, \\qquad V(X) = \\frac{1-p}{p^2}'}</MathBlock>
        <p>
          サイコロなら <M>{'p = 1/6'}</M> なので、6の目が出るまで平均 <M>{'1 \\div \\tfrac{1}{6} = 6'}</M> 回。「確率が 1/6 なら、だいたい6回に1回」という感覚どおりです。
        </p>
        <Figure caption="p を動かしてみよう。見るところは棒の高さの減り方。いつも k = 1 がいちばん高く、右へ行くほど一定の割合（1 − p 倍）で低くなる。p が小さいほど右に長くのびる">
          <GeometricExplorer />
        </Figure>
        <Note title="定義の流儀に注意">
          <p>
            幾何分布は「初めて成功するまでの<strong>試行回数</strong>（k = 1, 2, …）」とする本と、「初めて成功するまでの<strong>失敗の回数</strong>（k = 0, 1, …）」とする本があります。
            後者だと <M>{'P(X = k) = (1-p)^{k}p'}</M>、期待値は <M>{'(1-p)/p'}</M> と1だけずれます（「失敗の回数 = 試行回数 − 1」なので。分散は同じ）。
            このサイトでは「試行回数」の流儀を使います（統計WEB の解説もこちら）。問題文が「何を X とするか」を必ず確認しましょう。
          </p>
        </Note>
      </Section>

      <Section title="無記憶性：これまでの失敗は「なかったこと」になる">
        <p>
          「もう5回も失敗したから、そろそろ当たるはず」と考えがちですが、幾何分布ではそうなりません。
          すでに <M>m</M> 回失敗したという条件のもとで、あと何回かかるかの分布は、<strong>最初からやり直したときとまったく同じ</strong>です。これを<strong>無記憶性</strong>といいます。
        </p>
        <MathBlock caption="m 回失敗したあと、さらに j 回より多くかかる確率は、最初から j 回より多くかかる確率と同じ">{'P(X > m + j \\mid X > m) = P(X > j)'}</MathBlock>
        <p>
          縦棒 <M>{'\\mid'}</M> は「右側がわかっているという条件のもとで」という意味です（<Link to="/lessons/probability-conditional">条件付き確率のレッスン</Link>）。
          左辺は「すでに m 回失敗したと分かっているとき、成功が m + j 回目より後になる確率」と読みます。
        </p>
        <Steps>
          <li>
            「<M>X</M> が m より大きい」＝「最初の m 回が全部失敗」なので <M>{'P(X > m) = (1-p)^m'}</M>
          </li>
          <li>
            条件付き確率は「両方起こる確率 ÷ 条件の確率」。<M>{'X > m + j'}</M> なら自動的に <M>{'X > m'}</M> なので、両方起こる確率は <M>{'(1-p)^{m+j}'}</M>
          </li>
          <li>
            割り算すると <M>{'(1-p)^{m+j} \\div (1-p)^m = (1-p)^j = P(X > j)'}</M>（同じ数を m 回分約分できる）
          </li>
        </Steps>
        <p>コインやサイコロには「これまでの結果」を覚えておく仕組みがない、ということでもあります。</p>
        <Figure caption="m 回失敗したあとの部分（オレンジ）を取り出して左にずらし、合計が1になるように拡大すると、もとの分布（青い点）とぴったり重なる">
          <GeometricMemoryless />
        </Figure>
      </Section>

      <Section title="負の二項分布：r 回成功するまでの回数">
        <p>
          幾何分布を「r 回目の成功まで」に広げたものです。<M>k</M> 回目で <M>r</M> 回目の成功が起こるのは、「最初の <M>{'k-1'}</M> 回で <M>{'r-1'}</M> 回成功し、<M>k</M> 回目に成功する」ときです。
        </p>
        <MathBlock caption="k 回目の試行でちょうど r 回目の成功が起こる確率（k = r, r+1, …）">{'P(X = k) = {}_{k-1}C_{r-1}\\, p^{r} (1-p)^{k-r}'}</MathBlock>
        <MathBlock caption="負の二項分布の期待値と分散（幾何分布を r 個足したもの）">{'E(X) = \\frac{r}{p}, \\qquad V(X) = \\frac{r(1-p)}{p^2}'}</MathBlock>
        <Intuition title="幾何分布を r 回つなげたもの">
          <p>
            「1回目の成功までの回数」「そこから2回目の成功までの回数」…は、無記憶性によってそれぞれ同じ幾何分布に従い、おたがい独立です。
            その r 個の和なので、期待値も分散も幾何分布の r 倍になります。
          </p>
        </Intuition>
        <Example title="コインで表が2回出るまで">
          <p>
            4回目でちょうど2回目の表が出る確率は、「最初の3回で表が1回」かつ「4回目が表」なので{' '}
            <M>{'{}_{3}C_{1} \\times 0.5^2 \\times 0.5^2 = 3 \\times 0.0625 = 0.1875'}</M>。平均は <M>{'2 \\div 0.5 = 4'}</M> 回です。
          </p>
        </Example>
        <Figure caption="r と p を動かしてみよう。r = 1 が幾何分布。r を大きくすると山が右へ動き、つりがね形に近づく">
          <NegativeBinomialExplorer />
        </Figure>
        <Note title="こちらも流儀がある">
          <p>
            負の二項分布も「r 回成功するまでの<strong>失敗の回数</strong>」で定義する本があり、その場合の期待値は <M>{'r(1-p)/p'}</M> です
            （試行回数 = 失敗の回数 + r なので、ちょうど r だけずれる。分散は同じ）。
          </p>
        </Note>
      </Section>

      <Section title="超幾何分布：戻さずに取り出すくじ">
        <p>
          全部で <M>N</M> 本のくじがあり、そのうち当たりが <M>M</M> 本。ここから <M>n</M> 本を<strong>戻さずに</strong>引いたとき（<strong>非復元抽出</strong>）の当たりの本数 <M>X</M> が従うのが超幾何分布です。
        </p>
        <Compare>
          <Card title="毎回戻す（復元抽出）">
            <p>毎回の当たりの確率は同じ <M>{'M/N'}</M>。→ 二項分布 <M>{'B(n, M/N)'}</M></p>
          </Card>
          <Card title="戻さない（非復元抽出）">
            <p>当たりを引くと、残りの当たりが減る。毎回の確率が変わる。→ 超幾何分布</p>
          </Card>
        </Compare>
        <MathBlock caption="N 本（当たり M 本）から n 本を戻さずに引いて、当たりがちょうど k 本の確率">{'P(X = k) = \\frac{{}_{M}C_{k} \\times {}_{N-M}C_{n-k}}{{}_{N}C_{n}}'}</MathBlock>
        <p>
          分母は「n 本の選び方の総数」、分子は「当たり M 本から k 本 × はずれ N − M 本から残り n − k 本」の選び方です。
        </p>
        <Example title="10本中当たり3本のくじから2本引く">
          <p>2本とも当たりの確率は</p>
          <Steps>
            <li>
              分母：10本から2本を選ぶ選び方 <M>{'{}_{10}C_{2} = \\dfrac{10 \\times 9}{2 \\times 1} = 45'}</M> 通り
            </li>
            <li>
              当たり3本から2本：<M>{'{}_{3}C_{2} = \\dfrac{3 \\times 2}{2 \\times 1} = 3'}</M> 通り。はずれ7本から0本：<M>{'{}_{7}C_{0} = 1'}</M> 通り（「1本も選ばない」選び方は1通り）
            </li>
            <li>
              割る：<M>{'\\dfrac{3 \\times 1}{45} = \\dfrac{1}{15}'}</M>
            </li>
          </Steps>
          <MathBlock>{'P(X=2) = \\frac{{}_{3}C_{2} \\times {}_{7}C_{0}}{{}_{10}C_{2}} = \\frac{3 \\times 1}{45} = \\frac{1}{15} \\approx 0.0667'}</MathBlock>
          <p>
            毎回戻すなら <M>{'0.3^2 = 0.09'}</M>。戻さないと1本目で当たりが減るので、2本とも当たる確率は小さくなります。
          </p>
        </Example>
        <MathBlock caption="超幾何分布の期待値と分散（p = M/N とおく）">{'E(X) = np, \\qquad V(X) = np(1-p) \\times \\frac{N-n}{N-1}'}</MathBlock>
        <Example title="10本中当たり3本から2本引くときの期待値と分散">
          <p>
            <M>{'N = 10'}</M>、<M>{'M = 3'}</M>、<M>{'n = 2'}</M>、<M>{'p = 3/10 = 0.3'}</M>。
          </p>
          <Steps>
            <li>
              期待値：<M>{'np = 2 \\times 0.3 = 0.6'}</M> 本（戻す場合と同じ）
            </li>
            <li>
              戻す場合の分散：<M>{'np(1-p) = 2 \\times 0.3 \\times 0.7 = 0.42'}</M>
            </li>
            <li>
              修正の係数：<M>{'\\dfrac{N-n}{N-1} = \\dfrac{10-2}{10-1} = \\dfrac{8}{9}'}</M>
            </li>
            <li>
              戻さない場合の分散：<M>{'0.42 \\times \\dfrac{8}{9} \\approx 0.373'}</M>
            </li>
          </Steps>
        </Example>
        <Intuition title="(N − n)/(N − 1) は「有限母集団修正」">
          <p>
            期待値は二項分布と同じ <M>np</M>。分散だけが <M>{'\\tfrac{N-n}{N-1}'}</M> 倍（1より小さい）になります。戻さずに引くと、当たりを引きすぎると残りの当たりが減って「引きすぎ」がおさえられ、
            ばらつきが小さくなるからです。この係数を<strong>有限母集団修正</strong>といいます。極端な例として、全部引く（<M>{'n = N'}</M>）と当たりの数は必ず <M>M</M> 本で、分散は0です。
          </p>
        </Intuition>
        <Figure caption="見るところは、青とオレンジの棒の高さの差と、下に出る2つの分散。N を大きくしていくと、戻さない（青）と戻す（オレンジ）の差がほとんどなくなる。N が n に比べて十分大きければ、超幾何分布は二項分布で近似できる">
          <HypergeometricCompare />
        </Figure>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>「失敗が続いたから次は成功しやすい」→ 独立な試行では無記憶性があり、これまでの失敗は次の確率に影響しません。</li>
            <li>
              幾何分布の期待値を <M>p</M> や <M>{'(1-p)/p'}</M> と答える → 試行回数の流儀では <M>{'1/p'}</M>。どちらの流儀かを確認します。
            </li>
            <li>
              有限母集団修正を <M>{'\\tfrac{N-n}{N}'}</M> とする → 分母は <M>{'N - 1'}</M> です。
            </li>
            <li>
              戻さない抽出なのに二項分布で正確な値を出そうとする → 母集団が小さいと値がずれます。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>「初めて◯◯が起こるまで」の期待値（<M>{'1/p'}</M>）や確率を問う問題。</li>
            <li>問題の場面に合う分布を、二項・ポアソン・幾何・超幾何などから選ぶ問題。</li>
            <li>
              超幾何分布の分散や、有限母集団修正 <M>{'\\tfrac{N-n}{N-1}'}</M> を問う問題（「標本調査」の非復元抽出ともつながります）。
            </li>
            <li>無記憶性を使って「すでに◯回失敗したあと」の確率を求める問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
