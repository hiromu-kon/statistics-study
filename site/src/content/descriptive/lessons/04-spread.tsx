import { Link } from 'react-router-dom'
import { Compare, Card, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DeviationPlot, SpreadShapes } from '../figures/DeviationPlot'

export const meta: LessonMeta = {
  id: 'descriptive-spread',
  chapter: 'descriptive',
  order: 4,
  title: '分散と標準偏差',
  summary: 'データが平均からどれくらい散らばっているかを、1つの数で表す方法です。',
  minutes: 25,
  keywords: ['偏差', '分散（n-1で割る）', '標準偏差'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>分散</strong>は「平均からのはなれ具合を2乗して、（ほぼ）平均したもの」。<strong>標準偏差</strong>はそのルート（平方根）で、
          「データは平均からだいたい何点くらいはなれているか」を表します。どちらも、大きいほどデータが散らばっています。
        </p>
      </Point>

      <Section title="平均だけではわからないこと">
        <p>2つの班で小テスト（10点満点）をしました。どちらも平均は5点です。</p>
        <Compare>
          <Card title="A班：4, 5, 5, 6">
            <DeviationPlot data={[4, 5, 5, 6]} width={340} />
          </Card>
          <Card title="B班：2, 4, 6, 8">
            <DeviationPlot data={[2, 4, 6, 8]} width={340} />
          </Card>
        </Compare>
        <p>
          A班はみんな5点のまわりに集まっていますが、B班はばらばらです。平均が同じでも、
          <strong>散らばり方</strong>はまったく違います。この「散らばり」を数にしたいのが分散と標準偏差です。
        </p>
      </Section>

      <Section title="計算の手順">
        <p>B班（2, 4, 6, 8）で計算してみます。</p>
        <Steps>
          <li>
            平均を求める：<M>{'(2+4+6+8) \\div 4 = 5'}</M>
          </li>
          <li>
            各データから平均を引く（これを<strong>偏差</strong>という）：−3, −1, +1, +3
          </li>
          <li>偏差を2乗する：9, 1, 1, 9</li>
          <li>
            2乗した値を平均する：<M>{'(9+1+1+9) \\div 4 = 5'}</M>　← これが<strong>分散</strong>
          </li>
          <li>
            ルートをとる：<M>{'\\sqrt{5} \\approx 2.24'}</M>　← これが<strong>標準偏差</strong>
          </li>
        </Steps>
        <p className="small muted">
          ※ <M>{'\\sqrt{5}'}</M>（ルート5）は「2乗すると 5 になる正の数」で、<M>{'2.24 \\times 2.24 \\approx 5'}</M> です。<M>{'\\approx'}</M> は「だいたい等しい」の記号。
          ルートに自信がなければ<Link to="/lessons/math-square-root">「2乗と平方根（ルート）」</Link>へ。
        </p>
        <DataTable
          head={['データ x', '偏差 x − 5', '偏差の2乗']}
          rows={[
            ['2', '−3', '9'],
            ['4', '−1', '1'],
            ['6', '+1', '1'],
            ['8', '+3', '9'],
            [<strong key="s">合計</strong>, '0', <strong key="t">20</strong>],
          ]}
          caption="B班の計算表"
        />
        <Example title="A班でも計算してみよう">
          <p>
            A班（4, 5, 5, 6）の偏差は −1, 0, 0, +1。2乗すると 1, 0, 0, 1 で合計2。分散は <M>{'2 \\div 4 = 0.5'}</M>、
            標準偏差は <M>{'\\sqrt{0.5} \\approx 0.71'}</M>。B班（2.24）よりずっと小さく、「集まっている」ことが数でわかります。
          </p>
        </Example>
      </Section>

      <Section title="定義・式">
        <p>
          データを <M>{'x_1, x_2, \\dots, x_n'}</M>（1番目から n 番目のデータ）、平均を <M>{'\\bar{x}'}</M>（エックスバー）と書きます。
          <M>{'x_i - \\bar{x}'}</M> が i 番目の偏差、<M>{'\\sum'}</M> は「全部足す」の記号です（<Link to="/lessons/math-sigma">Σ記号の復習</Link>）。
          上の手順をそのまま式にすると、次のようになります。
        </p>
        <MathBlock caption="偏差の2乗を全部足して、n で割る（n で割る分散）">{'\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2'}</MathBlock>
        <p>
          ただし統計検定2級の出題範囲表には「<strong>分散（n-1で割る）</strong>」と書かれています（統計検定2級 出題範囲表、2018年12月14日版）。
          そこでこのサイトでも、ただ「分散」と書いたときは n − 1 で割るものを指し、記号 <M>{'s^2'}</M> で表します。n − 1 で割ったものは
          <strong>不偏分散</strong>とも呼ばれます（なぜ n − 1 なのかは<Link to="/lessons/estimation-point">「点推定」のレッスン</Link>で説明します）。
        </p>
        <MathBlock caption="n − 1 で割る分散（このサイトでの s²）">{'s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2'}</MathBlock>
        <p>
          B班なら、偏差の2乗の合計 20 を <M>{'n - 1 = 3'}</M> で割って <M>{'20 \\div 3 \\approx 6.67'}</M>、標準偏差は <M>{'\\sqrt{6.67} \\approx 2.58'}</M> です（n で割ると分散 5、標準偏差 2.24）。
          標準偏差はどちらの場合も「分散のルート」です。n が大きいと、2つの差はほとんどなくなります。
        </p>
        <MathBlock caption="計算を楽にする式：2乗の平均 − 平均の2乗（n で割る分散になる）">{'\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2 = \\overline{x^2} - \\bar{x}^2'}</MathBlock>
        <p>
          <M>{'\\overline{x^2}'}</M> は「各データを2乗してから平均したもの」、<M>{'\\bar{x}^2'}</M> は「平均を2乗したもの」です。B班で確かめると、
          2乗の平均は <M>{'(4+16+36+64) \\div 4 = 30'}</M>、平均の2乗は <M>{'5^2 = 25'}</M> で、差は 5。n で割った分散と一致します。
          n − 1 で割る分散がほしいときは、これを <M>{'\\frac{n}{n-1}'}</M> 倍します（<M>{'5 \\times \\frac{4}{3} \\approx 6.67'}</M>）。
        </p>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="なぜ2乗するの？">
          <p>
            偏差をそのまま足すと、プラスとマイナスが打ち消しあって<strong>必ず0</strong>になります（上の表の合計を見てください）。
            2乗すればすべてプラスになり、「はなれ具合」を足し合わせられます。
          </p>
        </Intuition>
        <Intuition title="なぜルートをとるの？">
          <p>
            2乗したせいで、分散の単位は「点²」になっています。ルートをとると単位が「点」に戻り、
            「平均からだいたい2.2点くらいはなれている」と元のデータと同じ感覚で読めます。
          </p>
        </Intuition>
        <Figure caption="スライダーでデータを広げると、偏差は k 倍・分散は k² 倍・標準偏差は k 倍になる">
          <DeviationPlot data={[2, 4, 6, 8]} interactive />
        </Figure>
      </Section>

      <Section title="ヒストグラムから標準偏差の大小を見分ける">
        <p>
          試験では、計算せずに図を見て「どちらの標準偏差が大きいか」を答える問題も出ます。下の3つは、どれも値が 1〜9、平均 5 で、<strong>範囲（最大 − 最小）も同じ</strong>です。
        </p>
        <Figure caption="見るところ：平均（真ん中の5）から遠い値に、どれだけ人がいるか。山形 < 一様 < U字形 の順に標準偏差が大きい">
          <SpreadShapes />
        </Figure>
        <Intuition title="範囲が同じでも標準偏差は違う">
          <p>
            標準偏差は「平均からの距離」をすべてのデータで平均したようなものです。山形は多くの人が5の近くにいるので小さく、U字形は多くの人が両端（1や9）にいるので大きくなります。
            範囲は両端の2つの値しか見ないので、この違いをとらえられません。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「偏差の平均」を散らばりにしようとする → 偏差の合計は必ず0なので使えません。
            </li>
            <li>
              分散と標準偏差を取り違える → 単位がデータと同じなのは<strong>標準偏差</strong>のほう。
            </li>
            <li>
              データを全部2倍すると分散も2倍 → 実際は <strong>4倍（2²倍）</strong>。標準偏差が2倍です。
            </li>
            <li>
              n で割るか n − 1 で割るかを確認しない → 問題文で指定されることが多いので、必ず読みましょう。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>少ないデータの分散・標準偏差を電卓で計算させる問題。「2乗の平均 − 平均の2乗」を使うと速い。</li>
            <li>ヒストグラムや箱ひげ図を見て、どちらのグループの標準偏差が大きいかを選ぶ問題。「平均から遠いところにデータが多いほど大きい」で判断する。</li>
            <li>データを「a倍してbを足す」変換をしたときの、平均・分散・標準偏差の変化を問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
