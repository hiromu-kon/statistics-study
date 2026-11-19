import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { SampleMeanSim } from '../figures/SampleMeanSim'
import { SampleMeanWidth } from '../figures/SampleMeanWidth'

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
          <strong>本当の平均 μ のまわりに集まり</strong>、そのばらつきは <M>{'\\sigma/\\sqrt{n}'}</M>（<strong>標準誤差</strong>）になります。
        </p>
      </Point>

      <Section title="母集団と標本">
        <p>
          ある町の大人の平均身長を知りたいとします。町の大人全員が<strong>母集団</strong>（知りたい対象の全体）、
          実際に測るために選んだ一部の人が<strong>標本</strong>（サンプル）です。
        </p>
        <Compare>
          <Card title="母集団（全体）">
            <p>町の大人 2000 人全員。</p>
            <p>
              全員の平均を<strong>母平均</strong> <M>{'\\mu'}</M>（ミュー）、全員の分散を<strong>母分散</strong> <M>{'\\sigma^2'}</M>
              （シグマ2乗）と呼びます。こうした「母集団の性質を表す数」をまとめて<strong>母数</strong>といいます。
            </p>
            <p className="muted">ふつうは全員を測れないので、母数は「わからない数」です。</p>
          </Card>
          <Card title="標本（一部）">
            <p>そこから選んだ 5 人。</p>
            <p>
              5 人の平均が<strong>標本平均</strong> <M>{'\\bar{X}'}</M>（エックスバー）。これは測ればすぐ計算できます。
            </p>
            <p className="muted">標本平均を手がかりに、わからない母平均 μ を推し量るのが「推測統計」です。</p>
          </Card>
        </Compare>
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
        <Intuition title="図から読みとれること">
          <ul>
            <li>標本平均のヒストグラムは、母平均 μ（赤い線）を中心に山になる。→ 標本平均は「平均すると」μ に一致する。</li>
            <li>
              上の母集団（1人ずつの身長）より、下の標本平均のほうが<strong>幅がせまい</strong>。平均をとると、背の高い人と低い人が打ち消しあうから。
            </li>
            <li>n を大きくしてからためると、山がもっと細くなる。たくさんの人で平均するほど、μ からはずれにくい。</li>
          </ul>
        </Intuition>
      </Section>

      <Section title="定義・式">
        <p>
          母集団から 1 人ずつ選んで測った値を <M>{'X_1, X_2, \\dots, X_n'}</M> とします。どの人を選ぶかは前の人に左右されない
          （<strong>独立</strong>）ように選ぶとします。サイコロを何回も振るときに前の目が次の目に影響しないのと同じで、
          このような試行を<strong>独立試行</strong>といいます。それぞれの <M>{'X_i'}</M> は、平均 μ・分散 <M>{'\\sigma^2'}</M> の母集団から出てくる確率変数です。
        </p>
        <MathBlock caption="標本平均：n 個の値を足して n で割る">{'\\bar{X} = \\frac{X_1 + X_2 + \\cdots + X_n}{n}'}</MathBlock>
        <MathBlock caption="標本平均の期待値：平均すると母平均に一致する">{'E(\\bar{X}) = \\mu'}</MathBlock>
        <MathBlock caption="標本平均の分散：母分散の 1/n になる">{'V(\\bar{X}) = \\frac{\\sigma^2}{n}'}</MathBlock>
        <MathBlock caption="標準誤差：標本平均の標準偏差。標本平均がふつう μ からどれくらいずれるか">{'\\mathrm{SE} = \\sqrt{V(\\bar{X})} = \\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
        <MathNote title="なぜ σ²/n になるの？（確率変数の章の復習）">
          <Steps>
            <li>
              和の分散：独立なら分散は足し算できる。<M>{'V(X_1 + \\cdots + X_n) = \\sigma^2 + \\cdots + \\sigma^2 = n\\sigma^2'}</M>
            </li>
            <li>
              n で割る：確率変数を <M>{'a'}</M> 倍すると分散は <M>{'a^2'}</M> 倍。<M>{'1/n'}</M> 倍なので分散は <M>{'1/n^2'}</M> 倍。
            </li>
            <li>
              合わせると <M>{'n\\sigma^2 \\times \\frac{1}{n^2} = \\frac{\\sigma^2}{n}'}</M>
            </li>
          </Steps>
          <p>
            期待値のほうは、<M>{'E(X_1 + \\cdots + X_n) = n\\mu'}</M> を n で割って <M>{'\\mu'}</M> です。
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
              標準誤差：<M>{'8/\\sqrt{16} = 8/4 = 2'}</M>（cm）
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
            <li>このあと学ぶ区間推定・仮説検定は、すべてこの「標本平均の分布」が土台になっている。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
