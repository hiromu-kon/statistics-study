import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { RootNPlot, SquareArea, SquareCurve } from '../figures/SquareFigures'

export const meta: LessonMeta = {
  id: 'math-square-root',
  chapter: 'math',
  order: 3,
  title: '2乗と平方根（ルート）',
  summary: '2乗は正方形の面積、ルートは面積から1辺を求める操作。分散・標準偏差・標準誤差で毎回使う計算を、電卓の使い方まで練習します。',
  minutes: 25,
  keywords: ['累乗', '平方根', '電卓'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>2乗</strong>は「同じ数を2回かける」こと＝<strong>正方形の面積</strong>。
          <strong>ルート（平方根）</strong>はその逆で、「面積から1辺の長さを求める」ことです。
          分散（2乗の世界）から標準偏差（元の単位の世界）に戻るときに、必ずルートを使います。
        </p>
      </Point>

      <Section title="2乗は正方形の面積">
        <p>
          <M>{'3^2'}</M>（3の2乗）は <M>{'3 \\times 3 = 9'}</M>。1辺3の正方形には、1×1のマスが9個入ります。
          右上の小さい数（<strong>指数</strong>）は「何回かけるか」です。<M>{'2^3 = 2 \\times 2 \\times 2 = 8'}</M>（3乗）のように、
          同じ数をくり返しかけることをまとめて<strong>累乗</strong>といいます。
        </p>
        <Figure caption="1辺を動かしてみよう。1辺が2倍になると、面積は4倍（2²倍）になる">
          <SquareArea mode="square" />
        </Figure>
        <Example title="小数の2乗は小さくなる">
          <p>
            <M>{'0.5^2 = 0.5 \\times 0.5 = 0.25'}</M>。1より小さい数は、2乗すると<strong>もっと小さく</strong>なります。
            スライダーを 1 より小さくして確かめてみましょう（「半分の半分」なので4分の1）。
          </p>
        </Example>
      </Section>

      <Section title="負の数の2乗は正になる">
        <p>
          <M>{'(-3)^2 = (-3) \\times (-3) = 9'}</M>。マイナス×マイナスはプラスなので、負の数でも2乗すると正になります。
          つまり、<strong>2乗した値は必ず0以上</strong>です。
        </p>
        <Figure caption="x を動かしてみよう。x と −x は同じ高さになり、グラフが0より下に行くことはない">
          <SquareCurve />
        </Figure>
        <MathNote title="これが分散で2乗する理由">
          <p>
            平均からのずれ（偏差）には −3 も +3 もありますが、2乗すればどちらも 9。
            「どちら向きか」は消えて「どれだけはなれているか」だけが残ります。だから分散は負になりません。
          </p>
        </MathNote>
      </Section>

      <Section title="ルート：面積から1辺を求める">
        <p>
          「2乗すると9になる正の数」は3です。これを <M>{'\\sqrt{9} = 3'}</M> と書き、「ルート9」と読みます。
          2乗して2になる数は整数ではなく、<M>{'\\sqrt{2} = 1.41421\\ldots'}</M> とどこまでも続く小数です。
        </p>
        <Figure caption="面積を動かしてみよう。面積が4倍になっても、1辺は2倍にしかならない">
          <SquareArea mode="root" />
        </Figure>
        <DataTable
          head={['a', <M key="h">{'\\sqrt{a}'}</M>, 'ひとこと']}
          rows={[
            ['1', '1', ''],
            ['4', '2', ''],
            ['9', '3', ''],
            ['100', '10', ''],
            ['2', '1.414…', '「ひとよひとよに」'],
            ['3', '1.732…', '「ひとなみに」'],
            ['0.25', '0.5', '1より小さい数のルートは元より大きい'],
          ]}
          caption="よく使うルートの値"
        />
        <MathNote title="2乗して9になる数は2つある">
          <p>
            <M>{'3^2 = 9'}</M> も <M>{'(-3)^2 = 9'}</M> も成り立つので、2乗して9になる数は 3 と −3 の2つです（どちらも9の<strong>平方根</strong>）。
            記号 <M>{'\\sqrt{9}'}</M> は、そのうち<strong>正のほう</strong>だけを表すと決められています。標準偏差は必ず0以上の値です。
          </p>
        </MathNote>
      </Section>

      <Section title="ルートの計算ルール">
        <MathBlock caption="かけ算はルートの中でまとめられる">{'\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}'}</MathBlock>
        <MathBlock caption="わり算も同じ">{'\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}'}</MathBlock>
        <MathBlock caption="2乗とルートは打ち消しあう（a が0以上のとき）">{'\\sqrt{a^2} = a, \\qquad (\\sqrt{a})^2 = a'}</MathBlock>
        <Example>
          <ul>
            <li>
              <M>{'\\sqrt{4} \\times \\sqrt{25} = \\sqrt{100} = 10'}</M>（<M>{'2 \\times 5 = 10'}</M> と一致）
            </li>
            <li>
              <M>{'\\sqrt{\\frac{9}{16}} = \\frac{3}{4}'}</M>
            </li>
            <li>
              <M>{'\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3}'}</M>（このように外に出す変形もあるが、電卓で小数にするほうが実用的）
            </li>
          </ul>
        </Example>
        <Pitfall title="たし算はまとめられない">
          <p>
            <M>{'\\sqrt{9 + 16} = \\sqrt{25} = 5'}</M> ですが、<M>{'\\sqrt{9} + \\sqrt{16} = 3 + 4 = 7'}</M> です。
            <M>{'\\sqrt{a + b} \\ne \\sqrt{a} + \\sqrt{b}'}</M>。分散は足せても、標準偏差はそのまま足せない、という話につながります。
          </p>
        </Pitfall>
      </Section>

      <Section title="√n で割る（標準誤差の準備）">
        <p>
          統計では <M>{'\\frac{\\sigma}{\\sqrt{n}}'}</M>（標準偏差 ÷ データの個数のルート）という形が何度も出てきます。
          これは「n 個のデータの平均が、どれくらいぶれるか」を表す量で、<strong>n を大きくすると小さくなります</strong>。
        </p>
        <Figure caption="n を動かしてみよう（σ = 10）。n を4倍にすると値は半分、n を100倍にすると10分の1">
          <RootNPlot sigma={10} />
        </Figure>
        <Example>
          <p>
            <M>{'\\sigma = 10, n = 25'}</M> なら <M>{'\\frac{10}{\\sqrt{25}} = \\frac{10}{5} = 2'}</M>。
            n を4倍の100にすると <M>{'\\frac{10}{\\sqrt{100}} = 1'}</M> で、ちょうど半分になります。
            ぶれを半分にするには、データを2倍ではなく<strong>4倍</strong>集める必要があるのです。
          </p>
        </Example>
      </Section>

      <Section title="電卓でルートを計算する">
        <p>
          ふつうの電卓にも <strong>√</strong> キーがついています。多くの電卓では、<strong>数字を入れてから √ を押す</strong>と、画面の数のルートになります。
          （電卓によって操作が違うことがあるので、自分の電卓で √9 = 3 になるか確かめておきましょう。試験で使える電卓の条件は公式サイトで確認してください。）
        </p>
        <Steps>
          <li>
            <M>{'\\sqrt{6.67}'}</M>：「6.67」→「√」→ 2.5826… と表示される
          </li>
          <li>
            <M>{'\\sqrt{\\frac{20}{3}}'}</M>：「20 ÷ 3 =」で 6.666… にしてから「√」→ 2.5819…
          </li>
          <li>
            <M>{'\\frac{12}{\\sqrt{36}}'}</M>：先に「36 √」で 6 を出してメモし、「12 ÷ 6 =」で 2。
            または <M>{'\\sqrt{\\frac{12^2}{36}}'}</M> と考えて「12 × 12 ÷ 36 =」→「√」でも 2
          </li>
        </Steps>
        <Intuition title="ルートの中を先に、まとめて計算する">
          <p>
            ふつうの電卓はかっこが使えないことが多いので、「ルートの中身を先に1つの数にしてから √ を押す」のが基本です。
            <M>{'\\frac{\\sigma}{\\sqrt{n}} = \\sqrt{\\frac{\\sigma^2}{n}}'}</M> なので、「分散 ÷ n」を計算してからルートをとっても同じ答えになります。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'0.5^2 = 1'}</M> や <M>{'0.5^2 = 0.1'}</M> としてしまう → <M>{'0.5 \\times 0.5 = 0.25'}</M>。
            </li>
            <li>
              <M>{'-3^2'}</M> と <M>{'(-3)^2'}</M> を同じだと思う → 前者は −9、後者は 9。
            </li>
            <li>
              <M>{'\\sqrt{a+b} = \\sqrt{a} + \\sqrt{b}'}</M> としてしまう → たし算はルートの外に出せない。
            </li>
            <li>
              「n を2倍にすれば <M>{'\\frac{\\sigma}{\\sqrt{n}}'}</M> は半分」と思う → 半分にするには n を4倍。2倍だと約0.71倍。
            </li>
            <li>
              分散と標準偏差を取り違える → 分散 = 標準偏差の2乗、標準偏差 = 分散のルート。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計でどう使うか">
        <ExamTip title="統計でどう使うか">
          <ul>
            <li>
              <strong>分散・標準偏差</strong>：偏差を2乗して平均したものが分散、そのルートが標準偏差 <M>{'s = \\sqrt{s^2}'}</M>。
            </li>
            <li>
              <strong>標準誤差</strong>（標本分布・推定）：標本平均のぶれは <M>{'\\frac{\\sigma}{\\sqrt{n}}'}</M>。信頼区間の幅や検定統計量に毎回出てくる。
            </li>
            <li>
              <strong>確率変数の和</strong>：独立なら分散は足せる（<M>{'V[X+Y] = V[X] + V[Y]'}</M>）が、標準偏差は足せない。
            </li>
            <li>
              <strong>相関係数</strong>：<M>{'r = \\frac{s_{xy}}{s_x s_y}'}</M>。分母の標準偏差の計算にルートを使う。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
