import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DiceGrid } from '../../probability/figures/DiceGrid'
import { BubblePlot } from '../figures/BubblePlot'
import { DistBars } from '../figures/DistBars'
import { JointMixer } from '../figures/JointMixer'

export const meta: LessonMeta = {
  id: 'random-variables-sum-covariance',
  chapter: 'random-variables',
  order: 4,
  title: '和と差・共分散と相関',
  summary: '2つの確率変数をまとめて考える同時分布と、和・差の期待値と分散。分散には「一緒に動く度合い」＝共分散が入ってきます。',
  minutes: 40,
  keywords: ['同時分布', '周辺分布', '独立', '和の期待値', '和の分散', '共分散', '相関係数'],
}

const diceSum = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => ({ x: s, p: (6 - Math.abs(s - 7)) / 36 }))

const rain = [
  { x: 0, y: 0, p: 0.4 },
  { x: 0, y: 1, p: 0.1 },
  { x: 1, y: 0, p: 0.1 },
  { x: 1, y: 1, p: 0.4 },
]

const uncorrelated = [
  { x: -1, y: 1, p: 1 / 3 },
  { x: 0, y: 0, p: 1 / 3 },
  { x: 1, y: 1, p: 1 / 3 },
]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>和の期待値はいつでも足し算</strong>です。分散はそうはいかず、2つが「一緒に動く度合い」である<strong>共分散</strong>が入ってきます。
          独立なら共分散は0になり、<strong>差 X − Y の分散でも「足し算」</strong>になります。
        </p>
      </Point>

      <Section title="同時分布：2つの確率変数をまとめて見る">
        <p>
          サイコロを2個投げ、1個目の目を <M>{'X'}</M>、2個目の目を <M>{'Y'}</M> とします。
          「X = 3 かつ Y = 4」のように、<strong>2つの値の組と、その確率</strong>をまとめたものを<strong>同時分布</strong>といいます。
          サイコロ2個なら36マスそれぞれが確率 1/36 です。
        </p>
        <Figure caption="マスの数字は X + Y。同じ和のマスは斜めに並ぶ。和が7（オレンジ）は6マスで一番多い">
          <DiceGrid text={(a, b) => String(a + b)} color={(a, b) => (a + b === 7 ? 'c2' : null)} ariaLabel="サイコロ2個の和を書いた36マス" />
        </Figure>
        <p>斜めのマスを数えて棒グラフにしたものが、和 <M>{'X + Y'}</M> の確率分布です。</p>
        <Figure caption="X + Y の確率分布。期待値は 7 = 3.5 + 3.5、分散は 35/6 = 35/12 + 35/12">
          <DistBars
            dist={diceSum}
            x={[1.3, 12.7]}
            yMax={0.2}
            xTicks={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            xLabel="X + Y"
            label={(x) => `${6 - Math.abs(x - 7)}/36`}
            showMean
            ariaLabel="サイコロ2個の和の確率分布"
          />
        </Figure>
      </Section>

      <Section title="具体例：2日続けて雨が降るか">
        <p>
          ある町で、今日雨なら <M>{'X = 1'}</M>、降らなければ <M>{'X = 0'}</M>。明日について同じように <M>{'Y'}</M> を決めます。
          天気は続きやすいので、「今日も明日も同じ天気」の確率が高くなっています。
        </p>
        <DataTable
          head={['', 'Y = 0（明日晴れ）', 'Y = 1（明日雨）', <strong key="m">X の周辺分布</strong>]}
          rows={[
            ['X = 0（今日晴れ）', '0.4', '0.1', <strong key="a">0.5</strong>],
            ['X = 1（今日雨）', '0.1', '0.4', <strong key="b">0.5</strong>],
            [<strong key="c">Y の周辺分布</strong>, <strong key="d">0.5</strong>, <strong key="e">0.5</strong>, '1'],
          ]}
          caption="同時分布表。行や列の合計（表の周辺に書く）が、X だけ・Y だけの分布になる"
        />
        <p>
          行の合計を見れば X だけの分布（今日雨の確率 0.5）、列の合計を見れば Y だけの分布（明日雨の確率 0.5）がわかります。
          表の<strong>周辺</strong>に書くので<strong>周辺分布</strong>と呼びます。
        </p>
      </Section>

      <Section title="確率変数の独立">
        <p>
          すべてのマスで「同時確率 = 周辺確率のかけ算」が成り立つとき、<M>{'X'}</M> と <M>{'Y'}</M> は<strong>独立</strong>です。
        </p>
        <MathBlock caption="すべての x, y の組について成り立つこと">{'P(X = x,\\ Y = y) = P(X = x)\\,P(Y = y)'}</MathBlock>
        <Compare>
          <Card title="サイコロ2個：独立">
            <p>
              どのマスも <M>{'1/36 = (1/6) \\times (1/6)'}</M>。1個目の結果は2個目に影響しません。
            </p>
          </Card>
          <Card title="2日の天気：独立ではない">
            <p>
              <M>{'P(X = 1, Y = 1) = 0.4'}</M> ですが、<M>{'0.5 \\times 0.5 = 0.25'}</M>。今日雨だと明日も雨になりやすい。
            </p>
          </Card>
        </Compare>
      </Section>

      <Section title="和の期待値：いつでも足し算">
        <MathBlock caption="独立でなくても、いつでも成り立つ">{'E(X + Y) = E(X) + E(Y)'}</MathBlock>
        <Example title="2日の天気で確かめる">
          <p>
            2日のうち雨の日数 <M>{'X + Y'}</M> は、0日（確率 0.4）、1日（0.1 + 0.1 = 0.2）、2日（0.4）。
            期待値は <M>{'0 \\times 0.4 + 1 \\times 0.2 + 2 \\times 0.4 = 1'}</M> で、<M>{'E(X) + E(Y) = 0.5 + 0.5 = 1'}</M> と一致します。
            X と Y は独立ではありませんが、期待値の足し算は成り立っています。
          </p>
        </Example>
        <Intuition title="なぜいつでも成り立つの？">
          <p>
            期待値は「くり返したときの平均」です。何日分も記録をとって「雨の日数の合計」を平均しても、「今日の分の平均」と「明日の分の平均」を足しても同じになります。
            足し算の順番を変えているだけなので、2つがどう関係していても関係ありません。
          </p>
        </Intuition>
      </Section>

      <Section title="共分散と相関係数">
        <p>
          分散を考えるには、<strong>2つが一緒に動く度合い</strong>が必要です。それを表すのが<strong>共分散</strong>です。
          記述統計の共分散と同じく、「X のずれ × Y のずれ」の平均（期待値）です。
        </p>
        <MathBlock caption="共分散：X のずれと Y のずれのかけ算を、確率で重みづけして足す">{'\\mathrm{Cov}(X, Y) = E\\left[(X - \\mu_X)(Y - \\mu_Y)\\right]'}</MathBlock>
        <MathBlock caption="計算を楽にする式：かけ算の期待値から、期待値どうしのかけ算を引く">{'\\mathrm{Cov}(X, Y) = E(XY) - E(X)\\,E(Y)'}</MathBlock>
        <MathBlock caption="相関係数：共分散を、それぞれの標準偏差で割って −1 〜 1 にそろえたもの">{'\\rho = \\frac{\\mathrm{Cov}(X, Y)}{\\sigma_X\\,\\sigma_Y}'}</MathBlock>
        <Figure caption="同時分布表を、円の面積 = 確率で描いた図。点線が期待値 0.5。青（右上・左下）が大きいので共分散はプラス">
          <BubblePlot joint={rain} x={[-0.5, 1.5]} y={[-0.5, 1.5]} xTicks={[0, 1]} yTicks={[0, 1]} xLabel="X（今日）" yLabel="Y（明日）" ariaLabel="2日の天気の同時分布" />
        </Figure>
        <Steps>
          <li>
            <M>{'XY'}</M> は「両方とも雨」のときだけ1、それ以外は0なので、<M>{'E(XY) = 1 \\times 0.4 = 0.4'}</M>。
          </li>
          <li>
            <M>{'\\mathrm{Cov}(X, Y) = 0.4 - 0.5 \\times 0.5 = 0.15'}</M>。プラスなので「一緒に動く」傾向がある。
          </li>
          <li>
            <M>{'V(X) = E(X^2) - \\{E(X)\\}^2 = 0.5 - 0.25 = 0.25'}</M>（Y も同じ）なので、標準偏差はどちらも 0.5。
          </li>
          <li>
            相関係数 <M>{'\\rho = 0.15 / (0.5 \\times 0.5) = 0.6'}</M>。
          </li>
        </Steps>
      </Section>

      <Section title="和と差の分散">
        <MathBlock caption="和の分散：それぞれの分散に、共分散の2倍を足す">{'V(X + Y) = V(X) + V(Y) + 2\\,\\mathrm{Cov}(X, Y)'}</MathBlock>
        <MathBlock caption="差の分散：共分散の2倍を引く。V(X) と V(Y) は足すことに注意">{'V(X - Y) = V(X) + V(Y) - 2\\,\\mathrm{Cov}(X, Y)'}</MathBlock>
        <p>
          2日の天気なら <M>{'V(X + Y) = 0.25 + 0.25 + 2 \\times 0.15 = 0.8'}</M>。
          分布から直接計算しても <M>{'E\\{(X+Y)^2\\} - 1^2 = (1 \\times 0.2 + 4 \\times 0.4) - 1 = 0.8'}</M> で一致します。
        </p>
        <p>
          X と Y が<strong>独立</strong>なら共分散は0なので、
        </p>
        <MathBlock caption="独立のとき：和でも差でも、分散は足し算">{'V(X + Y) = V(X - Y) = V(X) + V(Y)'}</MathBlock>
        <p>
          下の図で「関係の強さ」を動かしてみてください。X と Y がそれぞれ 1, 2, 3 を 1/3 ずつとるのは変えずに（周辺分布は固定）、
          一緒に動く度合いだけを変えます。共分散がプラスだと和の分散が大きく、差の分散が小さくなり、マイナスだとその逆になります。
        </p>
        <Figure caption="右上がりに並ぶと X + Y は両はし（2 や 6）に散らばり、X − Y は 0 に集まる。0 にすると独立で、和と差の分散は同じ 4/3">
          <JointMixer />
        </Figure>
        <Intuition title="差なのに、なぜ分散を「足す」の？">
          <p>
            独立な部品 A と B の長さの差を考えます。A が長めに出て B が短めに出ると、差は大きく出ます。A が短めで B が長めだと、差は小さく（マイナスに）出ます。
            どちらの部品のぶれも、差のぶれを<strong>増やす方向</strong>にしか働きません。
            式で見ても、<M>{'X - Y = X + (-1)Y'}</M> で、前のレッスンの <M>{'V(-Y) = (-1)^2 V(Y) = V(Y)'}</M> から、ぶれは足し算です。
          </p>
        </Intuition>
        <Example title="部品の長さの差">
          <p>
            独立に作られる部品 A, B の長さの標準偏差が 0.3 mm と 0.4 mm のとき、長さの差 A − B の分散は <M>{'0.3^2 + 0.4^2 = 0.25'}</M>、
            標準偏差は <M>{'\\sqrt{0.25} = 0.5'}</M> mm。<M>{'0.4 - 0.3 = 0.1'}</M> mm ではありません。
          </p>
        </Example>
      </Section>

      <Section title="独立なら共分散0。でも逆は成り立たない">
        <p>
          独立なら <M>{'E(XY) = E(X)E(Y)'}</M> が成り立つので、共分散は0です。ところが、<strong>共分散が0でも独立とは限りません</strong>。
        </p>
        <Example title="Y = X² の例">
          <p>
            X は −1, 0, 1 を 1/3 ずつとり、<M>{'Y = X^2'}</M> とします。Y は X で完全に決まるので、まったく独立ではありません（X = 0 なら必ず Y = 0）。
            しかし <M>{'E(X) = 0'}</M>、<M>{'E(XY) = E(X^3) = (-1 + 0 + 1)/3 = 0'}</M> なので、
          </p>
          <MathBlock>{'\\mathrm{Cov}(X, Y) = E(XY) - E(X)E(Y) = 0 - 0 \\times \\frac{2}{3} = 0'}</MathBlock>
        </Example>
        <Figure caption="V 字に並んでいる。右上（青）と左上（赤）が打ち消しあって共分散は0。共分散は「直線的な」関係しかとらえない">
          <BubblePlot joint={uncorrelated} x={[-1.6, 1.6]} y={[-0.5, 1.5]} xTicks={[-1, 0, 1]} yTicks={[0, 1]} xLabel="X" yLabel="Y = X²" ariaLabel="Y = X² の同時分布" />
        </Figure>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              差の分散を <M>{'V(X) - V(Y)'}</M> と引き算してしまう → 独立なら <M>{'V(X - Y) = V(X) + V(Y)'}</M>。分散がマイナスになることはありません。
            </li>
            <li>
              標準偏差を足してしまう → 独立な和・差で足せるのは<strong>分散</strong>。標準偏差は、分散を足してからルートをとります（0.3 と 0.4 なら 0.5）。
            </li>
            <li>
              <M>{'E(X + Y) = E(X) + E(Y)'}</M> は独立のときだけ、と思う → 期待値はいつでも足せます。独立が必要なのは分散のほう（正確には共分散が0であること）。
            </li>
            <li>「共分散が0なら独立」と思う → 上の Y = X² のように、逆は成り立ちません。</li>
            <li>
              <M>{'V(2X)'}</M> と <M>{'V(X_1 + X_2)'}</M> を混同する → 同じ X を2倍すると <M>{'4V(X)'}</M>、独立な2つを足すと <M>{'2V(X)'}</M>。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>同時確率分布表から、周辺分布・期待値・共分散・相関係数を計算する問題。</li>
            <li>
              「独立な X, Y について <M>{'V(2X - 3Y)'}</M> を求めよ」のような問題。<M>{'4V(X) + 9V(Y)'}</M> のように係数を2乗して<strong>足す</strong>。
            </li>
            <li>「共分散が0 ⇒ 独立」が正しいかを問う選択肢。</li>
            <li>この考え方は、標本平均の分散 <M>{'\\sigma^2 / n'}</M>（「標本分布」の章）を導くときの土台になります。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
