import { Link } from 'react-router-dom'
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
  minutes: 30,
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
        <p>
          分散も標準偏差も「データの散らばり具合」を表す数で、<Link to="/lessons/descriptive-spread">分散と標準偏差</Link>のレッスンでくわしく扱います。
          このレッスンでは、その計算に必要な2乗とルートだけを練習します。
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
        <Example title="0と1のあいだの数は、2乗すると小さくなる">
          <p>
            <M>{'0.5^2 = 0.5 \\times 0.5 = 0.25'}</M>。0と1のあいだの数は、2乗すると<strong>もとよりも小さく</strong>なります（「半分の半分」なので4分の1）。
            スライダーを 1 より小さくして確かめてみましょう。
          </p>
          <p>
            小数でも、1より大きければ2乗すると大きくなります（<M>{'1.5^2 = 2.25'}</M>）。「小数だから小さくなる」のではなく、「1より小さいから小さくなる」のです。
          </p>
          <p>
            小数のかけ算は、小数点を無視してかけてから、小数点以下の桁数を合わせます。<M>{'0.3 \\times 0.3'}</M> なら
            <M>{'3 \\times 3 = 9'}</M>、小数点以下の桁数は 1 + 1 = 2 桁なので <strong>0.09</strong>（0.9 ではない）。
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
            「どちら向きか」は消えて「どれだけはなれているか」だけが残ります。だから分散は負になりません
            （<Link to="/lessons/descriptive-spread">分散と標準偏差</Link>で、実際のデータで計算します）。
          </p>
        </MathNote>
      </Section>

      <Section title="ルート：面積から1辺を求める">
        <p>
          「2乗すると9になる正の数」は3です。これを <M>{'\\sqrt{9} = 3'}</M> と書き、「ルート9」と読みます。
          2乗して2になる数は整数ではなく、<M>{'\\sqrt{2} = 1.41421\\ldots'}</M> とどこまでも続く小数です（「…」は「まだ続く」という印）。
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
            ['0.25', '0.5', '0と1のあいだの数のルートは、元より大きい'],
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

      <Section title="ルートの見当をつける">
        <p>
          電卓で計算する前に、答えがだいたいいくつになるか見当をつけておくと、押し間違いに気づけます。
          使うのは「2乗するといくつになるか」の表です（<M>{'7^2 = 49,\\ 8^2 = 64'}</M> など）。
        </p>
        <Example title="√50 はいくつくらい？">
          <Steps>
            <li>
              50 をはさむ2乗の数を探す：<M>{'49 < 50 < 64'}</M>、つまり <M>{'7^2 < 50 < 8^2'}</M>
            </li>
            <li>
              だから <M>{'\\sqrt{50}'}</M> は 7 と 8 のあいだ。50 は 49 にとても近いので、7 より少しだけ大きい
            </li>
            <li>
              電卓で確かめる：<M>{'\\sqrt{50} \\approx 7.07'}</M>（≈ は「ほぼ等しい」）
            </li>
          </Steps>
        </Example>
        <p>
          小数でも同じです。<M>{'\\sqrt{0.0024}'}</M> なら、<M>{'0.04^2 = 0.0016'}</M>、<M>{'0.05^2 = 0.0025'}</M> なので 0.04 と 0.05 のあいだ（実際は約 0.049）です。
        </p>
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
            <M>{'\\sqrt{a + b} \\ne \\sqrt{a} + \\sqrt{b}'}</M>（≠ は「等しくない」）。分散は足せても、標準偏差はそのまま足せない、という話につながります
            （<Link to="/lessons/random-variables-sum-covariance">和と差・共分散と相関</Link>）。
          </p>
        </Pitfall>
      </Section>

      <Section title="√n で割る（標準誤差の準備）">
        <p>
          統計では <M>{'\\frac{\\sigma}{\\sqrt{n}}'}</M>（標準偏差 σ ÷ データの個数 n のルート）という形が何度も出てきます。
          これは「n 個のデータの平均が、どれくらいぶれるか」を表す量で、<strong>n を大きくすると小さくなります</strong>。
        </p>
        <p>
          たとえば、ある町の大人から n 人を選んで身長の平均を出すとします。選び直すたびに平均は少しずつ違う値になります。
          この「選んだ人たちの平均」を<strong>標本平均</strong>といい、そのぶれの大きさが <M>{'\\frac{\\sigma}{\\sqrt{n}}'}</M> です
          （くわしくは<Link to="/lessons/sampling-sample-mean">母集団・標本と標本平均の分布</Link>）。ここでは計算だけ練習します。
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
          統計検定の試験で使えるのは、四則演算（＋−×÷）・百分率（%）・平方根（√）の計算ができる普通の電卓（一般電卓）か事務用電卓です。
          関数電卓は使えません（<a href="https://www.toukei-kentei.jp/info/other_grades_apply/" target="_blank" rel="noreferrer">統計検定 準1級〜4級試験要項</a>、2026年11月19日参照）。
          つまり、2乗のキーも、かっこのキーも、累乗のキーもない前提で計算します。
        </p>
        <p>
          多くの電卓では、<strong>数字を入れてから √ を押す</strong>と、画面の数のルートになります。
          電卓によって操作が違うことがあるので、自分の電卓で √9 = 3 になるか確かめておきましょう。
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
        <Example title="2級でよく出る形を電卓で計算する">
          <p>
            <strong>① <M>{'\\sqrt{\\frac{0.4 \\times 0.6}{100}}'}</M></strong>（比率の推定で出てくる形）
          </p>
          <Steps>
            <li>ルートの中を先に計算：「0.4 × 0.6 =」で 0.24、続けて「÷ 100 =」で 0.0024</li>
            <li>「√」を押す → 0.04898…（見当どおり 0.04 と 0.05 のあいだ）</li>
          </Steps>
          <p>
            <strong>② <M>{'1.96 \\times \\frac{10}{\\sqrt{25}}'}</M></strong>（平均の推定で出てくる形）
          </p>
          <Steps>
            <li>
              分母のルートを先に：「25 √」で 5（このくらいなら暗算でもよい）
            </li>
            <li>「1.96 × 10 ÷ 5 =」→ 3.92</li>
          </Steps>
          <p>
            分母のルートが割り切れないとき（<M>{'\\sqrt{30} \\approx 5.477'}</M> など）は、出てきた値を紙にメモしてから割ります。
            M+ や MR のような<strong>メモリーキー</strong>がある電卓なら、そこに値をしまっておく方法もあります（キーの名前や動きは機種によります）。
          </p>
        </Example>
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
              <strong>分散・標準偏差</strong>（<Link to="/lessons/descriptive-spread">1変数データ</Link>）：偏差を2乗して平均したものが分散 <M>{'s^2'}</M>、そのルートが標準偏差 <M>{'s = \\sqrt{s^2}'}</M>。
            </li>
            <li>
              <strong>標準誤差</strong>（<Link to="/lessons/sampling-sample-mean">標本分布</Link>・<Link to="/lessons/estimation-ci-mean">推定</Link>）：標本平均のぶれは <M>{'\\frac{\\sigma}{\\sqrt{n}}'}</M>。信頼区間の幅や検定統計量に毎回出てくる。
            </li>
            <li>
              <strong>確率変数の和</strong>（<Link to="/lessons/random-variables-sum-covariance">和と差</Link>）：<M>{'V[X]'}</M> は「X の分散」と読む記号。
              X と Y が独立なら分散は足せる（<M>{'V[X+Y] = V[X] + V[Y]'}</M>）が、標準偏差は足せない。
            </li>
            <li>
              <strong>相関係数</strong>（<Link to="/lessons/bivariate-scatter-correlation">2変数データ</Link>）：<M>{'r = \\frac{s_{xy}}{s_x s_y}'}</M>（共分散 ÷ x の標準偏差 ÷ y の標準偏差）。分母の標準偏差の計算にルートを使う。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
