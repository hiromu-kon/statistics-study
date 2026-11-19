import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
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
          <Link to="/lessons/sampling-lln-clt">前の章</Link>で見たとおり、標本平均 <M>{'\\bar{X}'}</M> は正規分布 <M>{'N(\\mu, \\sigma^2/n)'}</M>
          （平均 μ・分散 σ²/n）に従います（母集団が正規分布のときはぴったり、そうでなくても n が大きければおよそ）。
          標準化すると標準正規分布なので、「真ん中の 95%」は <M>{'-1.96'}</M> から <M>{'1.96'}</M> の間です。
        </p>
        <NormalArea from={-1.96} to={1.96} />
        <MathBlock caption="標本平均を標準化した値が、95% の確率で ±1.96 の間に入る">{'P\\left(-1.96 \\le \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\le 1.96\\right) = 0.95'}</MathBlock>
        <p>かっこの中を μ について解くと、「μ をはさむ区間」の形になります。</p>
        <MathNote title="μ について解く手順（1 行ずつ）">
          <Steps>
            <li>
              3 か所に標準誤差 <M>{'\\sigma/\\sqrt{n}'}</M> をかける：<M>{'-1.96\\frac{\\sigma}{\\sqrt{n}} \\le \\bar{X} - \\mu \\le 1.96\\frac{\\sigma}{\\sqrt{n}}'}</M>
            </li>
            <li>
              3 か所から <M>{'\\bar{X}'}</M> を引く：<M>{'-\\bar{X} - 1.96\\frac{\\sigma}{\\sqrt{n}} \\le -\\mu \\le -\\bar{X} + 1.96\\frac{\\sigma}{\\sqrt{n}}'}</M>
            </li>
            <li>
              3 か所に −1 をかける（マイナスをかけると<strong>不等号の向きが逆</strong>になり、左右が入れかわる）：
              <M>{'\\bar{X} - 1.96\\frac{\\sigma}{\\sqrt{n}} \\le \\mu \\le \\bar{X} + 1.96\\frac{\\sigma}{\\sqrt{n}}'}</M>
            </li>
          </Steps>
          <p>
            「<M>{'\\bar{X}'}</M> が μ から 1.96 × 標準誤差以内にある」と「μ が <M>{'\\bar{X}'}</M> から 1.96 × 標準誤差以内にある」は、同じことを反対側から言っているだけです。
          </p>
        </MathNote>
        <MathBlock caption="母平均 μ の 95% 信頼区間（母分散 σ² が既知のとき）">{'\\bar{x} - 1.96\\frac{\\sigma}{\\sqrt{n}} \\le \\mu \\le \\bar{x} + 1.96\\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
        <p>
          この範囲を<strong>信頼区間</strong>、95% を<strong>信頼係数</strong>（信頼度）といいます。「標本平均 ± 1.96 × 標準誤差」と覚えると楽です。
          大文字の <M>{'\\bar{X}'}</M> を、実際に計算した値（小文字の <M>{'\\bar{x}'}</M>）に置きかえたものが、手もとで計算する区間です。
        </p>
        <p>
          95% 以外の信頼係数でも作り方は同じで、1.96 を取りかえるだけです。信頼係数を <M>{'100(1-\\alpha)\\%'}</M> と書くと、
          両側に <M>{'\\alpha/2'}</M> ずつ残すので、標準正規分布の上側 <M>{'\\alpha/2'}</M> 点 <M>{'z_{\\alpha/2}'}</M> を使います。
        </p>
        <MathBlock caption="母平均の 100(1−α)% 信頼区間（σ 既知）。z_{α/2} は「右側の面積が α/2 になる点」">{'\\bar{x} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} \\le \\mu \\le \\bar{x} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}'}</MathBlock>
        <DataTable
          head={['信頼係数', 'α', 'α/2', <M key="z">{'z_{\\alpha/2}'}</M>]}
          rows={[
            ['90%', '0.10', '0.05', '1.645'],
            ['95%', '0.05', '0.025', '1.96'],
            ['99%', '0.01', '0.005', '2.576'],
          ]}
          caption="よく使う 3 つ。99% の区間に 2.326（上側 1% 点）を使うのはまちがい。両側に分けるので 0.5% 点の 2.576"
        />
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
          標本をとり直すたびに区間が変わり、そのうち約 95% が μ を含みます
          （<a href="https://bellcurve.jp/statistics/course/8891.html" target="_blank" rel="noreferrer">統計WEB「19-3. 95％信頼区間のもつ意味」</a>も同じ説明をしています）。
        </p>
        <Compare>
          <Card title="標本をとる前（言ってよい）">
            <p>
              区間の両はしは <M>{'\\bar{X}'}</M> から作るので、まだ決まっていない確率変数です。だから
              「<strong>これから作る区間が μ を含む確率は 95%</strong>」と言えます。
            </p>
          </Card>
          <Card title="計算したあと（言ってはいけない）">
            <p>
              [54.08, 61.92] のように数が決まった区間と、決まった数 μ の関係は「含む」か「含まない」かのどちらか。
              「<strong>μ がこの区間に入る確率は 95%</strong>」とは言いません。どちらかは、わからないだけです。
            </p>
          </Card>
        </Compare>
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
        <MathBlock caption="母平均 μ の 95% 信頼区間（母分散が未知、母集団が正規分布のとき）">{'\\bar{x} - t_{0.025}(n-1)\\frac{s}{\\sqrt{n}} \\le \\mu \\le \\bar{x} + t_{0.025}(n-1)\\frac{s}{\\sqrt{n}}'}</MathBlock>
        <p className="muted">
          <M>{'t_{0.025}(n-1)'}</M> は「自由度 n − 1 の t 分布で、右側の面積が 0.025 になる点」（<Link to="/lessons/sampling-chi2-t-f">「カイ二乗分布・t分布・F分布」</Link>）。
          99% の区間なら <M>{'t_{0.005}(n-1)'}</M> に変えます。
        </p>
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

      <Section title="どちらの式を使うか（判定の手順）">
        <DataTable
          head={['問題文の手がかり', '使う式', '係数']}
          rows={[
            ['「母標準偏差（母分散）は ○○ とわかっている」', <M key="a">{'\\bar{x} \\pm z_{\\alpha/2}\\,\\sigma/\\sqrt{n}'}</M>, '標準正規分布（1.96 など）'],
            ['「母分散は未知」「標本の標準偏差（不偏分散）は ○○」・母集団は正規分布', <M key="b">{'\\bar{x} \\pm t_{\\alpha/2}(n-1)\\,s/\\sqrt{n}'}</M>, 't 分布（自由度 n − 1）'],
            ['母分散は未知だが、n がとても大きい（数百など）', <M key="c">{'\\bar{x} \\pm z_{\\alpha/2}\\,s/\\sqrt{n}'}</M>, '標準正規分布で近似してよい（t ≒ z になるため）'],
          ]}
          caption="母平均 1 つの区間推定。ほかの区間推定も含めた全体の対応表は、この章の最後のレッスン「2つの母集団の区間推定」のまとめにある"
        />
        <p className="muted">
          3 行目は「n が大きいと t 分布は標準正規分布にほぼ重なる」ことを使った近似です。問題文で t の値が与えられていれば、t を使います。
        </p>
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
            <li>σ 既知（正規分布）か σ 未知（t 分布）かを見分けて、母平均の信頼区間を計算する問題。t の値は問題文か、試験会場で配られる統計数値表で引く。</li>
            <li>
              区間を表す<strong>式</strong>が選択肢に並び、正しいものを選ぶ問題。受験した人の体験記では「推定・検定は、計算そのものより、求める式を選ばせる問題が多い」
              という声がある（公式の発表ではない）。z か t か、自由度は n か n − 1 か、<M>{'\\sqrt{n}'}</M> か n か、α か α/2 か、の 4 点を確かめる。
            </li>
            <li>信頼区間の正しい解釈を選ぶ問題。「計算した区間に μ が入る確率が 95%」は誤り、「くり返し作ると約 95% が μ を含む」が正しい。</li>
            <li>幅を ○○ 以下にするための n、n や信頼係数を変えたときの幅の変化を問う問題。</li>
            <li>統計ソフトの出力（平均・標準偏差・n）から信頼区間を読みとる問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
