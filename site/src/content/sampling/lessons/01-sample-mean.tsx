import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { SampleMeanSim } from '../figures/SampleMeanSim'
import { SampleMeanWidth } from '../figures/SampleMeanWidth'
import { ThreeDistributions } from '../figures/ThreeDistributions'

export const meta: LessonMeta = {
  id: 'sampling-sample-mean',
  chapter: 'sampling',
  order: 1,
  title: '母集団・標本と標本平均の分布',
  summary: '標本平均は「とり直すたびに値が変わる数」＝確率変数です。その分布の中心と広がりを調べます。',
  minutes: 30,
  keywords: ['母集団', '母数（母平均・母分散）', '独立試行', '標本平均の期待値・分散', '標準誤差'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          全員を調べられないとき、一部の人（<strong>標本</strong>）を選んで平均を出します。この<strong>標本平均</strong>は、
          選ぶ人が変わるたびに値が変わる<strong>確率変数</strong>です。とり直しをくり返すと、標本平均の値は
          <strong>全員の本当の平均 μ（ミュー）のまわりに集まり</strong>、そのばらつきは <M>{'\\sigma/\\sqrt{n}'}</M>（<strong>標準誤差</strong>）になります。
          σ（シグマ）は 1 人ずつの値のばらつき（標準偏差）、n は選ぶ人数です。
        </p>
      </Point>

      <Section title="母集団と標本">
        <p>
          ある町の大人の平均身長を知りたいとします。町の大人全員が<strong>母集団</strong>（知りたい対象の全体）、
          実際に測るために選んだ一部の人が<strong>標本</strong>（サンプル）です。選んだ人数を<strong>標本の大きさ</strong>といい、
          記号 <M>{'n'}</M> で表します（「標本の数」とは言わないので注意。5 人を 1 回選んだら、標本は 1 つで、大きさが 5 です）。
        </p>
        <Compare>
          <Card title="母集団（全体）">
            <p>町の大人 2000 人全員。</p>
            <p>
              全員の平均を<strong>母平均</strong> <M>{'\\mu'}</M>（ミュー）、全員の分散を<strong>母分散</strong> <M>{'\\sigma^2'}</M>
              （シグマ2乗）、そのルートを<strong>母標準偏差</strong> <M>{'\\sigma'}</M> と呼びます。こうした「母集団の性質を表す数」をまとめて<strong>母数</strong>といいます。
            </p>
            <p className="muted">ふつうは全員を測れないので、母数は「わからない数」です。</p>
          </Card>
          <Card title="標本（一部）">
            <p>そこから選んだ 5 人。</p>
            <p>
              5 人の平均が<strong>標本平均</strong> <M>{'\\bar{x}'}</M>（エックスバー。x の上の横棒が「平均」の印）。これは測ればすぐ計算できます。
            </p>
            <p className="muted">標本平均を手がかりに、わからない母平均 μ を推し量るのが「推測統計」です。</p>
          </Card>
        </Compare>
      </Section>

      <Section title="「ふつうの平均」と「標本平均」はどこがちがう？">
        <p>
          <strong>計算のしかたは同じ</strong>です。どちらも「足して個数で割る」だけ。ちがうのは次の 2 点です。
        </p>
        <ul>
          <li>
            <strong>何の平均か</strong>：知りたい全体（母集団）の平均が母平均 μ、たまたま選んだ一部（標本）の平均が標本平均です。
          </li>
          <li>
            <strong>どう見るか</strong>：母平均 μ は 1 つに決まった数（ただしわからない）。標本平均は「どの人が選ばれるか」で値が変わる数です。
          </li>
        </ul>
        <p>
          では、なぜわざわざ「標本平均が変わる」ことを考えるのでしょうか。私たちが本当に知りたいのは μ ですが、手もとにあるのは標本平均だけです。
          「標本平均は μ からふつうどれくらいずれるのか」がわかれば、「μ はだいたいこの範囲」と言えるようになります（これが次の章の<strong>推定</strong>）。
          そのために、標本平均がどう散らばるかを調べるのがこの章です。
        </p>
        <DataTable
          head={['登場するもの', '中身', '記号', '決まっている？']}
          rows={[
            ['母集団', '知りたい全体（町の大人 2000 人全員）', '', 'ー'],
            ['母平均・母標準偏差', '全員の平均と、1 人ずつの値のばらつき', <M key="m">{'\\mu,\\ \\sigma'}</M>, '決まった数（でも、わからない）'],
            ['標本', '実際に選んだ一部（5 人）。人数が標本の大きさ', <span key="n">大きさ <M>{'n'}</M></span>, '選ぶたびに変わる'],
            ['標本平均（今回の値）', '選んだ 5 人で計算した平均（162.0 cm）', <M key="x">{'\\bar{x}'}</M>, '計算したあとは 1 つの数'],
            ['標本平均（とり直したら？）', 'これから選ぶ n 人の平均。どんな値になるかはまだわからない', <M key="X">{'\\bar{X}'}</M>, '確率で値が決まる数（確率変数）'],
            ['標本平均の分布', '「選んで平均を出す」を何度もくり返したときの、標本平均の散らばり方', '', 'ー'],
            ['標準誤差', '標本平均の分布の標準偏差。標本平均が μ からふつうどれくらいずれるか', <M key="se">{'\\sigma/\\sqrt{n}'}</M>, '決まった数'],
          ]}
          caption="この章で出てくるものの整理。大文字の X̄ は「とる前の、まだ決まっていない標本平均」、小文字の x̄ は「計算した結果の値」"
          highlight={[4]}
        />
      </Section>

      <Section title="具体例：選び直すと標本平均が変わる">
        <p>同じ町から 5 人を選ぶことを 3 回やってみました（数字は説明のための例です）。</p>
        <DataTable
          head={['', '選んだ 5 人の身長（cm）', '標本平均']}
          rows={[
            ['1回目', '152, 158, 163, 166, 171', '162.0'],
            ['2回目', '149, 155, 157, 160, 164', '157.0'],
            ['3回目', '155, 159, 161, 162, 168', '161.0'],
          ]}
          caption="選ぶ人が変わると、標本平均も変わる"
        />
        <p>
          母平均 μ は 1 つの決まった数ですが、標本平均は<strong>やるたびに違う値</strong>になります。サイコロの出る目が振るたびに変わるのと同じで、
          標本平均も「確率によって値が決まる数」＝<strong>確率変数</strong>です。だから「標本平均がどんな値をどれくらいの確率でとるか」、
          つまり<strong>標本平均の分布</strong>を考えることができます。
        </p>
        <Figure caption="ボタンを押すたびに 2000 人から n 人を選び、標本平均を下のヒストグラムに1つ積む。200回押すと、標本平均の分布が見えてくる">
          <SampleMeanSim />
        </Figure>
        <p>
          ここで<strong>3 つの「分布」</strong>を区別しておきます。名前が似ていて混ざりやすいので、同じ目盛りで並べました。
        </p>
        <Figure caption="横軸はどれも身長（cm）。②の 25 人のデータは①とほぼ同じ幅に散らばるが、③の「25 人の平均」はずっとせまい範囲に集まる">
          <ThreeDistributions />
        </Figure>
        <Intuition title="上の 2 つの図から読みとれること">
          <ul>
            <li>標本平均のヒストグラムは、母平均 μ（赤い線）を中心に山になる。→ 標本平均は「平均すると」μ に一致する。</li>
            <li>
              標本のデータ（②）の散らばりは、人数を増やしても母集団（①）とほぼ同じ。<strong>せまくなるのは標本平均（③）だけ</strong>です。
            </li>
            <li>
              上の母集団（1人ずつの身長）より、下の標本平均のほうが<strong>幅がせまい</strong>。平均をとると、背の高い人と低い人が打ち消しあうから。
            </li>
            <li>n を大きくしてからためると、山がもっと細くなる。たくさんの人で平均するほど、μ からはずれにくい。</li>
          </ul>
        </Intuition>
      </Section>

      <Section title="定義・式">
        <p>
          母集団から 1 人ずつ選んで測った値を <M>{'X_1, X_2, \\dots, X_n'}</M> とします（<M>{'X_1'}</M> は 1 人目、<M>{'X_2'}</M> は 2 人目、…、
          <M>{'X_n'}</M> は n 人目の値。まとめて <M>{'X_i'}</M>「i 人目の値」とも書きます）。どの人を選ぶかは前の人に左右されない
          （<strong>独立</strong>）ように選ぶとします。サイコロを何回も振るときに前の目が次の目に影響しないのと同じで、
          このような試行を<strong>独立試行</strong>といいます。それぞれの <M>{'X_i'}</M> は、平均 μ・分散 <M>{'\\sigma^2'}</M> の母集団から出てくる確率変数です。
        </p>
        <p className="muted">
          厳密に独立になるのは、選んだ人を戻してから次を選ぶ（<strong>復元抽出</strong>）か、母集団が標本よりずっと大きいときです。
          小さな母集団から戻さずに選ぶときの調整は、推定の章の<Link to="/lessons/estimation-point">「有限母集団修正」</Link>で扱います。
        </p>
        <p>
          記号 <M>{'E(\\ \\ )'}</M> は<strong>期待値</strong>（何度もくり返したときの平均）、<M>{'V(\\ \\ )'}</M> は<strong>分散</strong>（ばらつき）を表します
          （<Link to="/lessons/random-variables-expectation-variance">「期待値・分散・標準偏差」</Link>の復習）。
        </p>
        <MathBlock caption="標本平均：n 個の値を足して n で割る">{'\\bar{X} = \\frac{X_1 + X_2 + \\cdots + X_n}{n}'}</MathBlock>
        <MathBlock caption="標本平均の期待値：平均すると母平均に一致する">{'E(\\bar{X}) = \\mu'}</MathBlock>
        <MathBlock caption="標本平均の分散：母分散の 1/n になる">{'V(\\bar{X}) = \\frac{\\sigma^2}{n}'}</MathBlock>
        <MathBlock caption="標準誤差：標本平均の標準偏差。標本平均がふつう μ からどれくらいずれるか">{'\\mathrm{SE} = \\sqrt{V(\\bar{X})} = \\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
        <MathNote title="なぜ σ²/n になるの？（確率変数の章の復習）">
          <Steps>
            <li>
              和の分散：独立なら分散は足し算できる（<Link to="/lessons/random-variables-sum-covariance">「和と差・共分散と相関」</Link>）。<M>{'V(X_1 + \\cdots + X_n) = \\sigma^2 + \\cdots + \\sigma^2 = n\\sigma^2'}</M>
            </li>
            <li>
              n で割る：確率変数を <M>{'a'}</M> 倍すると分散は <M>{'a^2'}</M> 倍（<Link to="/lessons/random-variables-linear-transform">「確率変数の1次変換」</Link>）。<M>{'1/n'}</M> 倍なので分散は <M>{'1/n^2'}</M> 倍。
            </li>
            <li>
              合わせると <M>{'n\\sigma^2 \\times \\frac{1}{n^2} = \\frac{\\sigma^2}{n}'}</M>
            </li>
          </Steps>
          <p>
            期待値のほうは、<M>{'E(X_1 + \\cdots + X_n) = \\mu + \\cdots + \\mu = n\\mu'}</M> を n で割って <M>{'\\mu'}</M> です。
          </p>
          <p>
            ついでに<strong>合計</strong> <M>{'X_1 + \\cdots + X_n'}</M> は、期待値 <M>{'n\\mu'}</M>・分散 <M>{'n\\sigma^2'}</M> です。
            「平均」と「合計」のどちらを聞かれているかで答えが変わるので、問題文をよく読みます。
          </p>
        </MathNote>
        <Example title="計算してみよう">
          <p>母平均 160 cm、母標準偏差 8 cm の町から、16 人を選んで標本平均を出すとします。</p>
          <ul>
            <li>
              期待値：<M>{'E(\\bar{X}) = 160'}</M>（cm）
            </li>
            <li>
              分散：<M>{'V(\\bar{X}) = 8^2 / 16 = 64/16 = 4'}</M>
            </li>
            <li>
              標準誤差：分散のルートなので <M>{'\\sqrt{4} = 2'}</M>。式で書くと <M>{'8/\\sqrt{16} = 8/4 = 2'}</M>（cm）
            </li>
          </ul>
          <p>
            1 人の身長は平均から 8 cm くらいずれるのがふつうですが、16 人の平均なら 2 cm くらいしかずれない、ということです。
          </p>
        </Example>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="n を 4 倍にすると、ずれは半分">
          <p>
            標準誤差は <M>{'\\sqrt{n}'}</M> で割るので、n を 4 倍にすると標準誤差は <M>{'1/\\sqrt{4} = 1/2'}</M> 倍、
            n を 100 倍にすると 1/10 倍です。人数を増やすほど精度は上がりますが、「2 倍の人数で 2 倍正確」にはなりません。
          </p>
        </Intuition>
        <Figure caption="点線が母集団（1人ぶん）の分布、実線が標本平均の分布。n を動かすと、実線の山が μ のまわりに細くなる">
          <SampleMeanWidth />
        </Figure>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「標本平均は 1 つの決まった数」→ 計算した<strong>あと</strong>の値（例：162.0 cm）は 1 つの数ですが、
              「標本をとる前」に考えると、とり方しだいで変わる確率変数です。この章ではこちらの見方をします。
            </li>
            <li>
              母集団の標準偏差 σ と、標準誤差 <M>{'\\sigma/\\sqrt{n}'}</M> を混同する → σ は「1 人ずつの値のばらつき」、
              標準誤差は「標本平均のばらつき」です。
            </li>
            <li>
              分散と標準偏差の取り違え：<M>{'V(\\bar{X})'}</M> は <M>{'\\sigma^2/n'}</M>（n で割る）、標準誤差は <M>{'\\sigma/\\sqrt{n}'}</M>（√n で割る）。
            </li>
            <li>
              「n を大きくすると母集団のばらつきが小さくなる」→ 母集団は変わりません。小さくなるのは標本平均のばらつきです。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>母平均・母分散と n が与えられて、標本平均の期待値・分散・標準誤差を求める問題。</li>
            <li>「標準誤差を ○○ 以下にするには n をいくつ以上にすればよいか」を逆算する問題。</li>
            <li>サイコロやくじのように母集団の分布がわかっているとき、何回かの平均の期待値と分散を求める問題。</li>
            <li>
              「標本平均の分散を表す式はどれか」のように、<strong>式そのものを選ばせる</strong>形もありうる。<M>{'\\sigma^2/n'}</M>（分散）と
              <M>{'\\sigma/\\sqrt{n}'}</M>（標準誤差）、「平均」と「合計」を取り違えないこと。
            </li>
            <li>このあと学ぶ区間推定・仮説検定は、すべてこの「標本平均の分布」が土台になっている。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
