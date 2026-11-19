import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section } from '../../../components/blocks'
import { Curve, Plot } from '../../../components/charts/Plot'
import { M, MathBlock } from '../../../components/Math'
import { normalCdf } from '../../../lib/stats'
import type { LessonMeta } from '../../../types'
import { CdfStep } from '../figures/CdfStep'
import { DiscreteVsContinuous } from '../figures/DiscreteVsContinuous'
import { DistBars } from '../figures/DistBars'
import { die } from '../figures/dist'

export const meta: LessonMeta = {
  id: 'random-variables-intro',
  chapter: 'random-variables',
  order: 1,
  title: '確率変数と確率分布',
  summary: '「サイコロを振る前の、まだ決まっていない出目」が確率変数。とりうる値と確率の対応表（確率分布）をセットで考えます。',
  minutes: 30,
  keywords: ['確率変数', '確率分布', '離散型確率変数', '連続型確率変数', '確率密度関数', '累積分布関数'],
}

const coin2 = [
  { x: 0, p: 0.25 },
  { x: 1, p: 0.5 },
  { x: 2, p: 0.25 },
]

const diceSum = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => ({ x: s, p: (6 - Math.abs(s - 7)) / 36 }))

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>確率変数</strong>は「<strong>サイコロを振る前の、まだ決まっていない出目</strong>」のようなものです。
          どの値になるかはまだわからないけれど、「どの値が、どれくらいの確率で出るか」は決まっています。
          その<strong>値と確率の対応表</strong>を<strong>確率分布</strong>といいます。
        </p>
      </Point>

      <Section title="なぜ「変数」なのに確率がつくの？">
        <p>
          中学で習った変数 <M>{'x'}</M> は、「中に数が1つ入る箱」でした。<M>{'x = 3'}</M> と決めれば、それでおしまいです。
          確率変数 <M>{'X'}</M> は、<strong>中身が偶然で決まる箱</strong>です。サイコロを振るまで、中身は 1〜6 のどれになるかわかりません。
        </p>
        <Compare>
          <Card title="ふつうの変数 x">
            <p>
              中身は1つに決まっている（決めて使う）。
              <br />
              例：<M>{'x = 3'}</M> のとき <M>{'2x = 6'}</M>
            </p>
          </Card>
          <Card title="確率変数 X">
            <p>
              中身は試行の結果で決まる。決まる前から「どの値がどの確率で出るか」はわかっている。
              <br />
              例：サイコロの目 <M>{'X'}</M> は、1〜6 がそれぞれ確率 1/6
            </p>
          </Card>
        </Compare>
        <p>
          「値が変わる」から変数、「その値に確率がついている」から確率変数、と考えるとすっきりします。
          確率変数は大文字 <M>{'X'}</M>、実際に出た値（実現値）は小文字 <M>{'x'}</M> で書くのがふつうです。
          <M>{'P(X = 3)'}</M> は「確率変数 X が 3 という値をとる確率」と読みます。
        </p>
      </Section>

      <Section title="確率変数は「結果に数をつけるルール」">
        <p>
          もう少し正確にいうと、確率変数は<strong>試行の結果1つ1つに、数を1つずつ割り当てるルール</strong>です。
          コインを2枚投げて「表の枚数」を X とすると、次のように数が割り当てられます。
        </p>
        <DataTable
          head={['結果（1枚目, 2枚目）', '（表, 表）', '（表, 裏）', '（裏, 表）', '（裏, 裏）']}
          rows={[
            ['X ＝ 表の枚数', '2', '1', '1', '0'],
            ['その結果の確率', '1/4', '1/4', '1/4', '1/4'],
          ]}
          caption="結果ごとに X の値が決まる。X の値が「変数」、結果の確率が「確率」の出どころ"
        />
        <p>
          ここで <M>{'X = 1'}</M> は「（表, 裏）か（裏, 表）が出る」という<strong>事象</strong>です。
          だから <M>{'P(X = 1)'}</M> は、前の章の<Link to="/lessons/probability-basics">事象の確率</Link>と同じように
          <M>{'\\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}'}</M> と計算できます。
          <strong>確率変数の確率は、新しいものではなく「X がその値になる事象」の確率</strong>です。
        </p>
        <p>
          同じ試行から、ルールを変えれば別の確率変数が作れます。たとえば「裏の枚数」や「1枚目が表なら1、裏なら0」も確率変数です。
          どのルールで数をつけるかを決めることが、「確率変数 X を〜とする」という問題文の意味です。
        </p>
      </Section>

      <Section title="具体例：値と確率の対応表を作る">
        <Example title="コインを2枚投げたときの、表の枚数 X">
          <p>
            出方は（表,表）（表,裏）（裏,表）（裏,裏）の4通り。表の枚数は 2, 1, 1, 0 なので、X のとりうる値は 0, 1, 2 です。
          </p>
          <p>同じ値になる結果をまとめると、「値 → 確率」の表になります。</p>
          <DataTable
            head={[<M key="x">{'x'}</M>, '0', '1', '2', '合計']}
            rows={[[<M key="p">{'P(X = x)'}</M>, '1/4', '2/4 = 1/2', '1/4', <strong key="s">1</strong>]]}
            caption="X の確率分布表。確率を全部足すと必ず 1 になる"
          />
        </Example>
        <Figure caption="確率分布を棒グラフにすると、「どの値が出やすいか」がひと目でわかる">
          <DistBars dist={coin2} x={[-0.7, 2.7]} yMax={0.6} xTicks={[0, 1, 2]} xLabel="表の枚数 x" label={(_, p) => String(p)} ariaLabel="コイン2枚の表の枚数の確率分布" />
        </Figure>
        <Example title="サイコロ2個の目の和">
          <p>
            36通りの出方を数えると、和が7になるのは6通りで一番多く、2や12は1通りだけです。和を確率変数 <M>{'X'}</M> とすると、確率分布は山の形になります。
          </p>
          <DistBars
            dist={diceSum}
            x={[1.3, 12.7]}
            yMax={0.2}
            xTicks={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            xLabel="目の和 x"
            label={(x) => `${6 - Math.abs(x - 7)}/36`}
            ariaLabel="サイコロ2個の目の和の確率分布"
          />
        </Example>
      </Section>

      <Section title="離散型と連続型">
        <p>確率変数には、とりうる値のタイプで2種類あります。</p>
        <DataTable
          head={['種類', 'とりうる値', '例', '確率の見方']}
          rows={[
            ['離散型', 'とびとびの値（数えられる）', 'サイコロの目、表の枚数、1日の来客数', '棒の高さ = 確率'],
            ['連続型', 'ある範囲のどんな値でも', '身長、体重、待ち時間', '曲線の下の面積 = 確率'],
          ]}
          caption="離散型と連続型の違い"
        />
        <p>
          下の図の、左（離散型）は棒の高さ、右（連続型）は塗った部分の面積に注目してください。スライダーで連続型の区間の幅を狭めると、塗った面積がやせていきます。
        </p>
        <Figure caption="連続型のスライダーで区間の幅を狭めていくと、確率（面積）はどんどん 0 に近づく">
          <DiscreteVsContinuous />
        </Figure>
        <p>
          連続型で使う曲線を<strong>確率密度関数</strong> <M>{'f(x)'}</M> といいます。曲線の<strong>高さそのものは確率ではありません</strong>。
          ある区間の確率は、その区間で曲線の下の面積を測って求めます。
        </p>
        <MathBlock caption="連続型：a から b までの確率 = 曲線 f(x) の下の、a から b までの面積">{'P(a \\le X \\le b) = \\int_a^b f(x)\\,dx'}</MathBlock>
        <p>
          <M>{'\\int'}</M>（インテグラル）は「面積を求める」という記号だと思えば十分です。<M>{'\\int_a^b f(x)\\,dx'}</M> は「曲線 f(x) の下の、a から b までの面積」と読みます。
          2級では、三角形・長方形の面積や分布表で求められる場面がほとんどです（<Link to="/lessons/math-function-graph-area">「関数・グラフ・面積」</Link>で復習できます）。
          全体の面積は、確率の合計なので必ず 1 です。
        </p>
        <Intuition title="なぜ「ちょうど 170 cm」の確率は 0 なの？">
          <p>
            身長は 170.1 cm、170.01 cm、170.001 cm…と、いくらでも細かく分けられます。「ちょうど 170.000… cm」は幅が 0 の区間なので、面積も 0 です。
            だから連続型では「ある値ちょうど」ではなく、「170 cm 以上 171 cm 未満」のように<strong>区間の確率</strong>を考えます。
          </p>
        </Intuition>
      </Section>

      <Section title="累積分布関数：「x 以下」の確率">
        <p>
          「X が x <strong>以下</strong>になる確率」を、x の関数として表したものを<strong>累積分布関数</strong>といいます。
          「累積」は「積み重ね」という意味で、左から確率を足していったものです。
        </p>
        <MathBlock caption="累積分布関数：X が x 以下になる確率">{'F(x) = P(X \\le x)'}</MathBlock>
        <Figure caption="サイコロの目の累積分布関数。棒を左から足していくので、値のあるところで 1/6 ずつ上がる階段になる">
          <CdfStep dist={die} x={[0, 7]} xTicks={[0, 1, 2, 3, 4, 5, 6, 7]} label={() => '1/6'} initial={3.5} />
        </Figure>
        <p>
          F(x) は 0 から始まって、右へ行くほど増え（減ることはない）、最後は 1 になります。
          「2 より大きく 5 以下」の確率は、階段の高さの差で <M>{'F(5) - F(2) = 5/6 - 2/6 = 3/6 = 1/2'}</M> と求まります。
          「5 以下」から「2 以下」を取りのぞくと、残るのは 3, 4, 5 の3つの目なので、数えても <M>{'3/6'}</M> です。
        </p>
        <Compare>
          <Card title="離散型の F(x)：階段">
            <p className="small">値のあるところでだけ、その確率の分ジャンプする。</p>
          </Card>
          <Card title="連続型の F(x)：なめらかな坂">
            <Plot x={[150, 190]} y={[0, 1.05]} width={340} height={200} xTicks={[150, 160, 170, 180, 190]} yTicks={[0, 0.5, 1]} xLabel="身長 x（cm）" ariaLabel="身長の累積分布関数">
              <Curve f={(t) => normalCdf(t, 170, 6)} />
            </Plot>
            <p className="small">面積を左から足していくので、なめらかに 0 から 1 へ上がる。</p>
          </Card>
        </Compare>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              確率密度関数の高さ <M>{'f(x)'}</M> を確率だと思う → 確率は<strong>面積</strong>。高さは 1 を超えることもあります。
            </li>
            <li>
              連続型で <M>{'P(X = a)'}</M> を求めようとする → 0 です。そのため連続型では <M>{'P(X \\le a)'}</M> と <M>{'P(X < a)'}</M> は同じ値になります（離散型では違うので注意）。
            </li>
            <li>確率分布表の確率を全部足して 1 にならない → 表の読み違いか計算ミス。未知の確率を求める問題では「合計 = 1」を使います。</li>
            <li>
              <M>{'F(x)'}</M> を「ちょうど x になる確率」だと思う → <M>{'F(x)'}</M> は「x <strong>以下</strong>になる確率」。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="この先とのつながり：標本平均も確率変数">
        <Note title="「標本平均」がよくわからないときに">
          <p>
            たとえば5人を選んで身長の平均をとると、<strong>誰が選ばれるかで平均の値が変わります</strong>。選ぶ前の標本平均は、サイコロを振る前の出目と同じく「まだ決まっていない数」なので、確率変数として扱えます。
            「どの値がどれくらいの確率で出るか」（標本平均の分布）は、<Link to="/lessons/sampling-sample-mean">「母集団・標本と標本平均の分布」</Link>のレッスンで扱います。この章の期待値・分散は、そのための道具です。
          </p>
        </Note>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>確率分布表の中の未知の確率を「合計 = 1」から求める問題。</li>
            <li>確率密度関数のグラフ（三角形・長方形など）から、面積で確率を求める問題。</li>
            <li>累積分布関数 <M>{'F(x)'}</M> から、<M>{'P(a < X \\le b) = F(b) - F(a)'}</M> を使って区間の確率を求める問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
