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
          生データがなく度数分布表しかないときは、「その階級の人は全員<strong>階級値</strong>だった」とみなして計算します。前のレッスンの通学時間の表を使います。
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
        <MathBlock caption="度数分布表からの平均：（階級値 × 度数）の合計 ÷ 全体の個数">{'\\bar{x} = \\frac{1}{n}\\sum_{k} x_k f_k = \\frac{1040}{40} = 26'}</MathBlock>
        <p>
          通学時間の平均はおよそ <strong>26分</strong>。最頻値は度数がいちばん多い階級（20〜30分）の階級値で <strong>25分</strong> です。
          中央値は20番目と21番目の人が入る階級を探します。累積度数は 20〜30分の階級で 14 → 26 になるので、中央値はこの階級に入ります。
        </p>
        <p>平均（26分）が最頻値（25分）より少し大きいのは、この分布の右の裾が少し長いからです。</p>
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
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
