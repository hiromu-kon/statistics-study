import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BalanceBeam, OutlierEffect } from '../figures/CenterFigures'
import { ShapeHist } from '../figures/HistogramFigures'

export const meta: LessonMeta = {
  id: 'descriptive-center',
  chapter: 'descriptive',
  order: 3,
  title: '代表値（平均値・中央値・最頻値）',
  summary: 'データの「真ん中あたり」を1つの数で表す3つの方法と、その使い分けを学びます。',
  minutes: 25,
  keywords: ['平均値', '中央値', '最頻値（モード）'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          データの中心を表す数を<strong>代表値</strong>といいます。<strong>平均値</strong>は「釣り合う点」、<strong>中央値</strong>は「順番の真ん中」、
          <strong>最頻値</strong>は「いちばん多い値」。分布の形や外れ値の有無によって、どれがふさわしいかが変わります。
        </p>
      </Point>

      <Section title="3つの代表値を求めてみる">
        <p>7人が1か月に読んだ本の冊数です：<strong>2, 0, 3, 1, 3, 9, 3</strong></p>
        <Steps>
          <li>
            <strong>平均値</strong>：全部足して人数で割る。<M>{'(2+0+3+1+3+9+3) \\div 7 = 21 \\div 7 = 3'}</M> 冊
          </li>
          <li>
            <strong>中央値</strong>：小さい順に並べる → 0, 1, 2, <strong>3</strong>, 3, 3, 9。真ん中（4番目）の 3 冊
          </li>
          <li>
            <strong>最頻値</strong>：いちばん多く出てくる値。3 が3回出てくるので 3 冊
          </li>
        </Steps>
        <p>
          データが偶数個のときは真ん中が2つあるので、その<strong>2つの平均</strong>を中央値にします。たとえば 1, 4, 6, 10 なら <M>{'(4+6) \\div 2 = 5'}</M> です。
        </p>
        <MathBlock caption="平均値：n 個のデータ x₁, …, xₙ を全部足して n で割る">{'\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i = \\frac{x_1 + x_2 + \\cdots + x_n}{n}'}</MathBlock>
        <p>式の記号の読み方です。</p>
        <ul>
          <li>
            <M>{'x_1, x_2, \\dots, x_n'}</M>：1番目、2番目、…、n 番目のデータ。右下の小さい数（<strong>添字</strong>）は「何番目か」を表す背番号で、値ではありません。<M>{'n'}</M> はデータの個数です。
          </li>
          <li>
            <M>{'\\bar{x}'}</M>：「<strong>エックスバー</strong>」と読み、x の平均を表します。文字の上の横棒（バー）が「平均」の印です。
          </li>
          <li>
            <M>{'\\sum_{i=1}^{n} x_i'}</M>：「<M>{'x_1'}</M> から <M>{'x_n'}</M> まで全部足す」という意味の記号（Σ はシグマと読む）。
            くわしくは<Link to="/lessons/math-sigma">「Σ記号と添字」</Link>で練習できます。
          </li>
        </ul>
        <p>
          本の冊数の例なら <M>{'n = 7'}</M>、<M>{'x_1 = 2, x_2 = 0, \\dots, x_7 = 3'}</M> で、<M>{'\\sum x_i = 21'}</M>、<M>{'\\bar{x} = 21 \\div 7 = 3'}</M> です。
        </p>
      </Section>

      <Section title="平均値は「やじろべえの釣り合う点」">
        <p>
          数直線を1本の棒だと思い、データの位置に同じ重さのおもりを置きます。支点をどこに置けば棒が水平になるでしょうか。
          スライダーで支点を動かしてみてください。
        </p>
        <Figure caption="支点を3に置くと釣り合う。そこが平均値">
          <BalanceBeam />
        </Figure>
        <Intuition title="なぜ平均で釣り合うの？">
          <p>
            支点より右にあるおもりは右に、左にあるおもりは左に棒を傾けます。その強さは「支点からの距離」に比例します。
            平均からの距離（偏差）は、プラスとマイナスを合計すると<strong>ちょうど0</strong>になるので、平均の位置では左右の傾ける力が打ち消しあうのです。
          </p>
        </Intuition>
      </Section>

      <Section title="外れ値に強いのは中央値">
        <p>7個のデータのうち、1つ（赤い点）だけを大きくしていきます。</p>
        <Figure caption="赤い点を右にずらすと平均はどんどん引っぱられるが、中央値は5のまま">
          <OutlierEffect />
        </Figure>
        <p>
          平均は全部の値を使うので、とびぬけた値（<strong>外れ値</strong>）があるとそちらに引っぱられます。
          中央値は「順番の真ん中」なので、いちばん大きい値がどれだけ大きくなっても変わりません。このような性質を「外れ値に<strong>頑健（がんけん）</strong>」といいます。
        </p>
        <Example title="貯蓄額や年収の「平均」">
          <p>
            ごく一部のとても大きな値が平均を押し上げるので、平均値は「ふつうの人」の感覚より大きく出がちです。
            そのため、所得や貯蓄の統計では平均値と一緒に中央値が示されることがよくあります。
          </p>
        </Example>
      </Section>

      <Section title="分布の形と3つの代表値の位置">
        <Compare>
          <Card title="右に裾が長い">
            <ShapeHist shape="right" centers />
          </Card>
          <Card title="左右対称">
            <ShapeHist shape="symmetric" centers />
          </Card>
          <Card title="左に裾が長い">
            <ShapeHist shape="left" centers />
          </Card>
        </Compare>
        <ul>
          <li>
            <strong>左右対称</strong>な単峰の分布では、3つはほぼ同じ位置にきます。
          </li>
          <li>
            <strong>右に裾が長い</strong>分布では、右の裾の大きな値に平均が引っぱられ、<strong>最頻値 &lt; 中央値 &lt; 平均値</strong>となることが多いです。
          </li>
          <li>
            <strong>左に裾が長い</strong>分布では逆に、<strong>平均値 &lt; 中央値 &lt; 最頻値</strong>となることが多いです。
          </li>
        </ul>
        <Intuition title="覚え方">
          <p>平均値は「裾のほうへ引っぱられる」。最頻値は山のてっぺん。中央値はその間にくる。裾の側から見ると「平均値 → 中央値 → 最頻値」の順に並びます。</p>
        </Intuition>
        <p className="small muted">
          ※「多い」と書いたのは、必ずそうなるとは限らないからです。山が2つある分布などでは、この順番にならないこともあります。
        </p>
      </Section>

      <Section title="度数分布表から平均値を求める">
        <p>
          生データ（一人ひとりの値）がなく度数分布表しかないときは、「その階級の人は全員<strong>階級値</strong>（階級の真ん中の値）だった」とみなして計算します。
          <Link to="/lessons/descriptive-histogram">前のレッスン</Link>の通学時間の表を使います。
        </p>
        <DataTable
          head={['階級（分）', '階級値 x', '度数 f', 'x × f']}
          rows={[
            ['0〜10', '5', '4', '20'],
            ['10〜20', '15', '10', '150'],
            ['20〜30', '25', '12', '300'],
            ['30〜40', '35', '8', '280'],
            ['40〜50', '45', '4', '180'],
            ['50〜60', '55', '2', '110'],
            [<strong key="t">合計</strong>, '', '40', <strong key="s">1040</strong>],
          ]}
          highlight={[2]}
          caption="度数分布表からの平均値の計算"
        />
        <p>
          たとえば 20〜30分の階級には12人いて、全員 25分とみなすので、合計は <M>{'25 \\times 12 = 300'}</M> 分。これを全部の階級について足すと 1040分です。
        </p>
        <MathBlock caption="度数分布表からの平均：（階級値 × 度数）の合計 ÷ 全体の個数。x_k は k 番目の階級の階級値、f_k はその度数">{'\\bar{x} = \\frac{1}{n}\\sum_{k} x_k f_k = \\frac{1040}{40} = 26'}</MathBlock>
        <p>
          通学時間の平均はおよそ <strong>26分</strong>。最頻値は度数がいちばん多い階級（20〜30分）の階級値で <strong>25分</strong> です。
          中央値は、40人を小さい順に並べたときの20番目と21番目の人が入る階級を探します。累積度数（上から足した人数）は、20分未満までで14人、30分未満までで26人。
          20番目・21番目は「15番目〜26番目」の中にあるので、中央値は 20〜30分の階級に入ります。
        </p>
        <p className="small muted">
          ※ 度数分布表からの平均は、階級値で代わりに計算した<strong>近似値</strong>です。元のデータから計算した平均とは少しずれることがあります。
        </p>
        <p>平均（26分）が最頻値（25分）より少し大きいのは、この分布の右の裾が少し長いからです。</p>
      </Section>

      <Section title="グループを合わせた平均">
        <p>
          平均がわかっている2つのグループを1つにまとめるときは、平均どうしをそのまま平均してはいけません。<strong>合計 ＝ 平均 × 人数</strong> に戻してから計算します。
        </p>
        <Example title="A組とB組を合わせる">
          <p>A組30人の平均が60点、B組10人の平均が80点のとき、</p>
          <Steps>
            <li>
              A組の合計：<M>{'60 \\times 30 = 1800'}</M> 点、B組の合計：<M>{'80 \\times 10 = 800'}</M> 点
            </li>
            <li>
              全体の合計：<M>{'1800 + 800 = 2600'}</M> 点、全体の人数：40人
            </li>
            <li>
              全体の平均：<M>{'2600 \\div 40 = 65'}</M> 点
            </li>
          </Steps>
          <p>
            平均どうしの平均 <M>{'(60 + 80) \\div 2 = 70'}</M> 点にはなりません。人数の多いA組のほうに引き寄せられます。
            これは<strong>人数を重みにした平均</strong>（加重平均）で、度数分布表からの平均も同じ考え方です。
          </p>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>中央値は「最大値と最小値の真ん中」→ ちがいます。小さい順に並べたときの<strong>順番の真ん中</strong>です。</li>
            <li>並べ替えずに真ん中を選ぶ → 必ず小さい順（または大きい順）に並べてから。</li>
            <li>データが偶数個のとき、真ん中の2つのどちらかを選ぶ → 2つの<strong>平均</strong>をとります。</li>
            <li>「平均点より上の人が半分いる」→ 半分なのは<strong>中央値</strong>より上の人。右に裾が長いと、平均より上の人は半分より少なくなります。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>少ないデータの平均値・中央値・最頻値を求める問題。</li>
            <li>ヒストグラムを見て、平均値・中央値・最頻値の大小関係を選ぶ問題（右に裾が長い・左に裾が長い）。</li>
            <li>度数分布表から平均値を計算したり、中央値や最頻値が入る階級を答えたりする問題。</li>
            <li>1つの値を外れ値に変えたとき、平均値と中央値のどちらが大きく変わるかを問う問題。</li>
            <li>点数ごとの人数を表した棒グラフ（ヒストグラム）から、平均値・中央値・最頻値を読み取る問題。中央値は「何番目の人か」を数えて探す。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
