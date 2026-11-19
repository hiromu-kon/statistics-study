import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import { NormalArea } from '../../../components/charts/common'
import type { LessonMeta } from '../../../types'
import { CiCoverage } from '../figures/CiCoverage'
import { CiWidth } from '../figures/CiWidth'

export const meta: LessonMeta = {
  id: 'estimation-ci-mean',
  chapter: 'estimation',
  order: 2,
  title: '母平均の区間推定',
  summary: '「母平均はたぶんこの範囲」と幅をもって推定するのが区間推定です。σ がわかるときは正規分布、わからないときは t 分布を使います。',
  minutes: 40,
  keywords: ['信頼区間', '信頼係数', '母分散既知', '母分散未知', 't分布'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          点推定の「162.0 cm」は、ぴったり当たることはまずありません。そこで「<strong>この方法で作った範囲は 95% の割合で真の値を含む</strong>」
          という範囲を示すのが<strong>区間推定</strong>です。母平均なら <M>{'\\bar{x} \\pm 1.96 \\times \\sigma/\\sqrt{n}'}</M>（σ が既知）、
          σ が未知なら 1.96 の代わりに t 分布の値、σ の代わりに s を使います。
        </p>
      </Point>

      <Section title="区間を作る考え方">
        <p>
          標本平均 <M>{'\\bar{X}'}</M> は、正規分布 <M>{'N(\\mu, \\sigma^2/n)'}</M> に従います（母集団が正規分布、または n が大きいとき）。
          標準化すると標準正規分布なので、「真ん中の 95%」は <M>{'-1.96'}</M> から <M>{'1.96'}</M> の間です。
        </p>
        <NormalArea from={-1.96} to={1.96} />
        <MathBlock caption="標本平均を標準化した値が、95% の確率で ±1.96 の間に入る">{'P\\left(-1.96 \\le \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\le 1.96\\right) = 0.95'}</MathBlock>
        <p>かっこの中を μ について解くと、「μ をはさむ区間」の形になります。</p>
        <MathBlock caption="母平均 μ の 95% 信頼区間（母分散 σ² が既知のとき）">{'\\bar{x} - 1.96\\frac{\\sigma}{\\sqrt{n}} \\le \\mu \\le \\bar{x} + 1.96\\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
        <p>
          この範囲を<strong>信頼区間</strong>、95% を<strong>信頼係数</strong>（信頼度）といいます。「標本平均 ± 1.96 × 標準誤差」と覚えると楽です。
        </p>
        <Example title="計算してみよう（σ 既知）">
          <p>母標準偏差が 8 とわかっている母集団から 16 個をとり、標本平均が 58 でした。</p>
          <Steps>
            <li>
              標準誤差：<M>{'8/\\sqrt{16} = 2'}</M>
            </li>
            <li>
              幅の半分：<M>{'1.96 \\times 2 = 3.92'}</M>
            </li>
            <li>
              95% 信頼区間：<M>{'58 \\pm 3.92'}</M> より <M>{'54.08 \\le \\mu \\le 61.92'}</M>
            </li>
          </Steps>
        </Example>
      </Section>

      <Section title="「95%」の本当の意味">
        <p>
          ここがいちばん誤解されやすいところです。μ は決まった 1 つの数（わからないだけ）で、ぶれるのは<strong>区間のほう</strong>です。
          標本をとり直すたびに区間が変わり、そのうち約 95% が μ を含みます。
        </p>
        <Figure caption="同じ母集団（μ = 50, σ = 10）から10個ずつとって95%信頼区間を作る、を100回くり返した。赤い区間はμを含まなかった。何度作り直しても、含む割合はだいたい95%になる">
          <CiCoverage />
        </Figure>
        <Intuition title="輪投げにたとえると">
          <p>
            μ は地面に立っている棒、信頼区間は投げる輪です。棒は動かず、輪が毎回ちがう場所に落ちます。「95% 信頼区間」とは、
            「この投げ方なら 100 回中 95 回くらいは棒に入る」という<strong>投げ方の性能</strong>のことです。
          </p>
        </Intuition>
      </Section>

      <Section title="σ がわからないとき：t 分布を使う">
        <p>
          実際の調査では σ もわかりません。そこで σ の代わりに標本の標準偏差 s（n − 1 で割る不偏分散のルート）を使います。
          すると標準化した値は標準正規分布ではなく、<strong>自由度 n − 1 の t 分布</strong>に従うので、1.96 の代わりに t 分布の上側 2.5% 点
          <M>{'t_{0.025}(n-1)'}</M> を使います。
        </p>
        <MathBlock caption="母平均 μ の 95% 信頼区間（母分散が未知のとき）">{'\\bar{x} - t_{0.025}(n-1)\\frac{s}{\\sqrt{n}} \\le \\mu \\le \\bar{x} + t_{0.025}(n-1)\\frac{s}{\\sqrt{n}}'}</MathBlock>
        <DataTable
          head={['n', '自由度 n − 1', <M key="t">{'t_{0.025}(n-1)'}</M>, '1.96 とのちがい']}
          rows={[
            ['5', '4', '2.776', '幅が約 1.42 倍'],
            ['10', '9', '2.262', '約 1.15 倍'],
            ['16', '15', '2.131', '約 1.09 倍'],
            ['30', '29', '2.045', '約 1.04 倍'],
          ]}
          caption="n が小さいほど t の値が大きく、区間が広くなる。s のぶれの分だけ「余裕」をもたせている"
        />
        <Example title="計算してみよう（σ 未知）">
          <p>
            さきほどと同じく 16 個で標本平均 58 ですが、σ はわからず、標本の標準偏差が s = 8 だったとします。
          </p>
          <Steps>
            <li>
              自由度 <M>{'16 - 1 = 15'}</M>、<Link to="/tables">t 分布表</Link>から <M>{'t_{0.025}(15) = 2.131'}</M>
            </li>
            <li>
              幅の半分：<M>{'2.131 \\times 8/\\sqrt{16} = 2.131 \\times 2 = 4.262'}</M>
            </li>
            <li>
              95% 信頼区間：<M>{'53.738 \\le \\mu \\le 62.262'}</M>（σ 既知のときより少し広い）
            </li>
          </Steps>
        </Example>
      </Section>

      <Section title="区間の幅を決めるもの">
        <MathBlock caption="信頼区間の幅（σ 既知・95% のとき）">{'2 \\times 1.96 \\times \\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
        <ul>
          <li>
            <strong>n を大きくする</strong>と狭くなる。ただし <M>{'\\sqrt{n}'}</M> で効くので、幅を半分にするには n を 4 倍にする必要がある。
          </li>
          <li>
            <strong>信頼係数を上げる</strong>（95% → 99%）と広くなる。1.96 が 2.576 に変わるので約 1.31 倍。「より確実に含む」には輪を大きくするしかない。
          </li>
          <li>母集団のばらつき σ が大きいと広くなる。</li>
        </ul>
        <Figure caption="上：今の設定での区間。下：区間の幅とnの関係（信頼係数ごと）。nを増やすと幅は急に狭くなり、やがてゆるやかになる">
          <CiWidth />
        </Figure>
        <Example title="必要な標本の大きさを逆算する">
          <p>
            σ = 8 の母集団で、95% 信頼区間の幅の半分（誤差）を 1 以下にしたい。n はいくつ以上必要でしょうか。
          </p>
          <Steps>
            <li>
              条件：<M>{'1.96 \\times 8/\\sqrt{n} \\le 1'}</M>
            </li>
            <li>
              変形：<M>{'\\sqrt{n} \\ge 1.96 \\times 8 = 15.68'}</M>
            </li>
            <li>
              2乗：<M>{'n \\ge 15.68^2 = 245.86\\ldots'}</M> → n は整数なので <strong>246</strong> 以上（切り上げる）
            </li>
          </Steps>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「計算した区間 [54.08, 61.92] に μ が入る確率は 95%」→ 計算したあとの区間は決まった範囲で、μ も決まった数なので、
              入っているか入っていないかのどちらかです。95% は「この作り方の区間が μ を含む割合」です（試験でもよく問われます）。
            </li>
            <li>「95% 信頼区間には、データの 95% が入る」→ 区間が推定しているのは<strong>母平均</strong>で、1 つ 1 つのデータではありません。</li>
            <li>σ が未知なのに 1.96 を使う → s を使うなら t 分布。特に n が小さいと差が大きい。</li>
            <li>t 分布の自由度を n にする → 自由度は n − 1。</li>
            <li>必要な n を四捨五入する → 「以上」が条件なので、小数は<strong>切り上げ</strong>。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>σ 既知（正規分布）か σ 未知（t 分布）かを見分けて、母平均の信頼区間を計算する問題。t の値は問題文か付表で与えられる。</li>
            <li>信頼区間の正しい解釈を選ぶ問題。</li>
            <li>幅を ○○ 以下にするための n、n や信頼係数を変えたときの幅の変化を問う問題。</li>
            <li>統計ソフトの出力（平均・標準偏差・n）から信頼区間を読みとる問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
