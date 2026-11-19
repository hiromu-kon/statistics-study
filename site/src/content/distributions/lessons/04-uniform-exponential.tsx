import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { ArrivalTimeline, ExponentialExplorer, GapHistogram, UniformExplorer } from '../figures/ContinuousFigures'

export const meta: LessonMeta = {
  id: 'distributions-uniform-exponential',
  chapter: 'distributions',
  order: 4,
  title: '一様分布と指数分布',
  summary: '「どの値も同じくらい出やすい」一様分布と、「次の出来事が起こるまでの待ち時間」を表す指数分布。どちらも面積で確率を求める連続分布です。',
  minutes: 30,
  keywords: ['連続一様分布', '指数分布', '待ち時間', '無記憶性'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <ul>
          <li>
            <strong>連続一様分布</strong> <M>{'U(a, b)'}</M>：<M>a</M> から <M>b</M> までのどの値も同じくらい出やすい。グラフは長方形で、期待値は真ん中 <M>{'(a+b)/2'}</M>。
          </li>
          <li>
            <strong>指数分布</strong>：平均 <M>{'\\lambda'}</M> 回起こる出来事の、<strong>次が起こるまでの待ち時間</strong>。期待値は <M>{'1/\\lambda'}</M>、
            「t 以上待つ確率」は <M>{'e^{-\\lambda t}'}</M>。
          </li>
        </ul>
      </Point>

      <Section title="復習：連続分布では「面積 = 確率」">
        <p>
          身長や時間のように、とる値がとぎれなく続く確率変数（連続型）では、グラフ（<strong>確率密度関数</strong>）の<strong>下の面積</strong>が確率になります。
          グラフ全体の面積は1です。
        </p>
        <Compare>
          <Card title="離散型（二項・ポアソンなど）">
            <p>棒の高さがそのまま確率。<M>{'P(X = 3)'}</M> に意味がある。</p>
          </Card>
          <Card title="連続型（一様・指数・正規など）">
            <p>
              区間の面積が確率。ちょうど1点の確率は幅0なので <M>{'P(X = 3) = 0'}</M>。だから <M>{'P(X \\le 3) = P(X < 3)'}</M>。
            </p>
          </Card>
        </Compare>
      </Section>

      <Section title="連続一様分布：どの値も同じくらい出やすい">
        <p>使う場面の例：</p>
        <ul>
          <li>10分おきに来るバスの停留所に、時刻を気にせず行ったときの待ち時間（0〜10分で一様）</li>
          <li>ルーレットの針が止まる角度（0〜360度で一様）</li>
          <li>四捨五入したときの誤差（−0.5〜0.5で一様）</li>
        </ul>
        <MathBlock caption="a 以上 b 以下で高さが一定の長方形（それ以外は0）。高さは「面積が1」になるように決まる">{'f(x) = \\frac{1}{b-a} \\quad (a \\le x \\le b)'}</MathBlock>
        <MathBlock caption="連続一様分布の期待値と分散">{'E(X) = \\frac{a+b}{2}, \\qquad V(X) = \\frac{(b-a)^2}{12}'}</MathBlock>
        <Example title="10分おきのバス">
          <p>
            待ち時間 <M>{'X \\sim U(0, 10)'}</M>。3分以上7分以下待つ確率は、幅 4 × 高さ 1/10 = <strong>0.4</strong>。
            平均の待ち時間は <M>{'(0+10)/2 = 5'}</M> 分、分散は <M>{'10^2/12 \\approx 8.33'}</M>、標準偏差は約 2.89 分です。
          </p>
        </Example>
        <Figure caption="a, b を動かすと長方形の幅が変わり、面積が1のままになるよう高さも変わる。c, d で区間を選ぶと、その確率（オレンジの面積）は「幅の割合」になる">
          <UniformExplorer />
        </Figure>
        <Intuition title="分散の 12 はどこから？">
          <p>
            期待値が真ん中なのは長方形の形から明らか。分散 <M>{'(b-a)^2/12'}</M> は積分の計算から出てくる値で、2級では式として覚えておけば十分です。
            幅が2倍になると分散は4倍（標準偏差は2倍）になる、という点は他の分散と同じです。
          </p>
        </Intuition>
      </Section>

      <Section title="指数分布：次の出来事までの待ち時間">
        <p>使う場面の例：</p>
        <ul>
          <li>お店に客が来てから、次の客が来るまでの時間</li>
          <li>コールセンターに電話がかかってくる間隔</li>
          <li>電球や部品が壊れるまでの時間（寿命）</li>
        </ul>
        <Intuition title="ポアソン分布と「表と裏」の関係">
          <p>
            1時間に平均 <M>{'\\lambda'}</M> 人がバラバラに来るお店を考えます。「1時間に何人来るか」は<strong>ポアソン分布</strong>、
            「客と客の間が何時間あくか」は<strong>指数分布</strong>です。同じ現象を「回数」で見るか「間隔」で見るかの違いです。
            1時間に平均6人なら、平均の間隔は <M>{'1/6'}</M> 時間 = 10分です。
          </p>
        </Intuition>
        <Figure caption="1時間に来る客の到着（オレンジの点）。人数を数えるとポアソン分布、間隔（緑の線）を測ると指数分布になる。平均人数を増やすと、間隔は短くなる">
          <ArrivalTimeline />
        </Figure>
        <MathBlock caption="指数分布の確率密度関数（x ≥ 0）。λ は単位時間あたりの平均回数">{'f(x) = \\lambda e^{-\\lambda x}'}</MathBlock>
        <MathBlock caption="t 以上待つ確率（t より右の面積）">{'P(X > t) = e^{-\\lambda t}'}</MathBlock>
        <MathBlock caption="指数分布の期待値と分散">{'E(X) = \\frac{1}{\\lambda}, \\qquad V(X) = \\frac{1}{\\lambda^2}'}</MathBlock>
        <DataTable
          head={['', 'ポアソン分布', '指数分布']}
          rows={[
            ['何を表すか', '決まった時間の中で起こる回数', '次に起こるまでの時間'],
            ['とる値', '0, 1, 2, …（離散）', '0以上の実数（連続）'],
            ['期待値', <M key="a">{'\\lambda'}</M>, <M key="b">{'1/\\lambda'}</M>],
            ['分散', <M key="c">{'\\lambda'}</M>, <M key="d">{'1/\\lambda^2'}</M>],
          ]}
          caption="同じ λ を共有する2つの分布"
        />
        <Figure caption="λ と t を動かしてみよう。オレンジの面積が「t 分以上待つ確率」e^(−λt)。λ が大きい（よく起こる）ほど、グラフは左に寄り、長く待つ確率は小さくなる">
          <ExponentialExplorer />
        </Figure>
        <Example title="平均10分おきに来るバス（時刻表なし）">
          <p>
            平均の間隔が10分なので <M>{'\\lambda = 1/10 = 0.1'}</M>（1分あたり0.1台）。15分以上待つ確率は
          </p>
          <MathBlock>{'P(X > 15) = e^{-0.1 \\times 15} = e^{-1.5} \\approx 0.2231'}</MathBlock>
        </Example>
        <Figure caption="平均10分の間隔を500回分集めたヒストグラムは、指数分布の曲線に沿っている">
          <GapHistogram />
        </Figure>
      </Section>

      <Section title="指数分布の無記憶性">
        <p>
          指数分布にも、幾何分布と同じ<strong>無記憶性</strong>があります。「もう s 分待った」という条件のもとで、さらに t 分以上待つ確率は、最初から t 分以上待つ確率と同じです。
        </p>
        <MathBlock caption="すでに s 待ったあと、さらに t 以上待つ確率">{'P(X > s + t \\mid X > s) = \\frac{e^{-\\lambda(s+t)}}{e^{-\\lambda s}} = e^{-\\lambda t} = P(X > t)'}</MathBlock>
        <Example title="部品の寿命">
          <p>
            寿命が平均2000時間の指数分布に従う部品が、すでに1000時間使えたとします。さらに1000時間以上もつ確率は、使い始めの部品が1000時間以上もつ確率と同じ{' '}
            <M>{'e^{-1000/2000} = e^{-0.5} \\approx 0.6065'}</M> です。「古くなったから壊れやすい」ということがない（劣化しない）モデルです。
          </p>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              指数分布の期待値を <M>{'\\lambda'}</M> とする → λ は「単位時間あたりの回数」。待ち時間の平均はその逆数 <M>{'1/\\lambda'}</M> です。
            </li>
            <li>
              「平均10分」と書いてあるのに <M>{'\\lambda = 10'}</M> とする → <M>{'\\lambda = 1/10'}</M> です。単位（分・時間）もそろえます。
            </li>
            <li>
              一様分布の分散を <M>{'(b-a)^2/2'}</M> や <M>{'(b-a)/12'}</M> とする → 正しくは <M>{'(b-a)^2/12'}</M>。
            </li>
            <li>連続分布で「ちょうど3」の確率をグラフの高さで答える → 高さは確率ではありません。1点の確率は0です。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>一様分布の確率を面積（幅 × 高さ）で求める問題、期待値・分散を求める問題。</li>
            <li>
              「平均◯分」から λ を決めて、<M>{'P(X > t) = e^{-\\lambda t}'}</M> を計算する問題（<M>e</M> のべき乗の値は与えられることが多い）。
            </li>
            <li>ポアソン分布と指数分布の関係（回数と間隔）を問う問題。</li>
            <li>無記憶性を使って「すでに◯分待った」あとの確率を求める問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
