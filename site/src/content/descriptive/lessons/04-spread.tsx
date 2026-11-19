import { Compare, Card, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DeviationPlot } from '../figures/DeviationPlot'

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
          <strong>分散</strong>は「平均からのはなれ具合を2乗して、平均したもの」。<strong>標準偏差</strong>はそのルートで、
          「データは平均からだいたい何点くらいはなれているか」を表します。
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
          データを <M>{'x_1, x_2, \\dots, x_n'}</M>、平均を <M>{'\\bar{x}'}</M>（エックスバー）と書くと、分散 <M>{'s^2'}</M> は次の式です。
        </p>
        <MathBlock caption="偏差の2乗を全部足して、n で割る">{'s^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2'}</MathBlock>
        <p>
          ただし統計検定2級の出題範囲表では、分散は「<strong>n − 1 で割る</strong>」ものとされています。n − 1 で割ったものは
          <strong>不偏分散</strong>とも呼ばれます（なぜ n − 1 なのかは「推定」の章で説明します）。
        </p>
        <MathBlock caption="n − 1 で割る分散（不偏分散）">{'s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2'}</MathBlock>
        <p>
          B班なら <M>{'20 \\div 3 \\approx 6.67'}</M>、標準偏差は <M>{'\\sqrt{6.67} \\approx 2.58'}</M> になります。
          標準偏差はどちらの場合も「分散のルート」です。
        </p>
        <MathBlock caption="計算を楽にする式：2乗の平均 − 平均の2乗（n で割る分散のとき）">{'s^2 = \\overline{x^2} - \\bar{x}^2'}</MathBlock>
        <p>
          B班で確かめると、2乗の平均は <M>{'(4+16+36+64) \\div 4 = 30'}</M>、平均の2乗は <M>{'5^2 = 25'}</M> で、差は 5。上の結果と一致します。
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
            <li>ヒストグラムや箱ひげ図を見て、どちらのグループの標準偏差が大きいかを選ぶ問題。</li>
            <li>データを「a倍してbを足す」変換をしたときの、平均・分散・標準偏差の変化を問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
