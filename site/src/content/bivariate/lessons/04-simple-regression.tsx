import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { Curve, Plot, Points, VLine } from '../../../components/charts/Plot'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { TwoRegressionLines } from '../figures/CorrelationSlider'
import { iceData } from '../figures/data'
import { LeastSquaresPlot } from '../figures/LeastSquaresPlot'
import { PlotText } from '../figures/PlotText'
import { Scatter } from '../figures/Scatter'

export const meta: LessonMeta = {
  id: 'bivariate-simple-regression',
  chapter: 'bivariate',
  order: 4,
  title: '最小二乗法と回帰直線',
  summary: '散布図にいちばん当てはまる直線を引いて、x から y を予測する方法です。',
  minutes: 35,
  keywords: ['最小二乗法', '回帰係数', '回帰直線', '観測値と予測値', '残差'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          散布図に、点の並びをいちばんよく表す直線 <M>{'\\hat{y} = a + bx'}</M>（a が切片、b が傾き）を引くと、x から y を予測できます。これが<strong>回帰直線</strong>です。
          「いちばんよく」とは、<strong>残差（実際の値と直線のずれ）の2乗の合計がいちばん小さい</strong>という意味で、この決め方を<strong>最小二乗法</strong>といいます。
        </p>
      </Point>

      <Section title="具体例：気温からアイスの売上を予測したい">
        <p>ある店で、5日間の最高気温とアイスの売上を記録しました（架空のデータ）。</p>
        <Compare>
          <Card title="データ">
            <DataTable
              head={['日', '最高気温 x（℃）', '売上 y（個）']}
              rows={iceData.xs.map((x, i) => [`${i + 1}日目`, String(x), String(iceData.ys[i])])}
            />
          </Card>
          <Card title="散布図">
            <Scatter xs={iceData.xs} ys={iceData.ys} x={[20, 32]} y={[70, 130]} xLabel="最高気温（℃）" yLabel="売上（個）" width={360} height={260} r={7} />
          </Card>
        </Compare>
        <p>
          明日の最高気温が 27℃ と予報されたら、アイスを何個用意すればよいでしょうか。点の並びに直線を引けば、その直線から読み取れます。
          このとき、予測に使う x を<strong>説明変数</strong>、予測したい y を<strong>目的変数</strong>（被説明変数）といいます。
        </p>
        <MathNote title="直線の式 y = a + bx の読み方">
          <p>
            <strong>a（切片）</strong>は x = 0 のときの y の値、<strong>b（傾き）</strong>は x が 1 増えたときに y がいくつ増えるかです（<Link to="/lessons/math-function-graph-area">「関数・グラフ・面積」のレッスン</Link>）。
            たとえば <M>{'y = 10 + 2x'}</M> なら、x = 0 で y = 10、x = 1 で 12、x = 2 で 14 と、1 増えるごとに 2 ずつ増えます。
            回帰直線では、予測した値だということがわかるように y の上に「^」をつけて <M>{'\\hat{y}'}</M> と書きます。
          </p>
        </MathNote>
      </Section>

      <Section title="残差と最小二乗法">
        <p>
          直線を1本決めると、各日について「直線が予測する値」<M>{'\\hat{y}_i'}</M>（ワイハット、<strong>予測値</strong>）が決まります。
          実際の値 <M>{'y_i'}</M>（<strong>観測値</strong>）との差が<strong>残差</strong>です。
        </p>
        <MathBlock caption="残差：観測値 − 予測値。点が直線より上ならプラス、下ならマイナス">{'e_i = y_i - \\hat{y}_i'}</MathBlock>
        <p>
          残差をそのまま足すとプラスとマイナスが打ち消しあうので、分散のときと同じく<strong>2乗してから足します</strong>。
          この「残差の2乗和」がいちばん小さくなる直線を選ぶのが最小二乗法です。下の図で、赤い正方形の面積の合計が残差の2乗和です。
        </p>
        <Figure caption="スライダーで直線を動かして、赤い正方形の面積の合計（残差の2乗和）をできるだけ小さくしてみよう">
          <LeastSquaresPlot xs={iceData.xs} ys={iceData.ys} xLabel="最高気温（℃）" yLabel="売上（個）" />
        </Figure>
        <p>
          傾きをいろいろ変えても、2つめのスライダー（x の平均 26℃ での直線の高さ）は、いつも y の平均 100 のあたりで残差の2乗和が小さくなります。
          これが次の「回帰直線は平均の点を通る」という性質です。
        </p>
      </Section>

      <Section title="定義・式">
        <p>最小二乗法で求めた直線の傾き b と切片 a は、次の式で計算できます（導き方は省略します）。b を<strong>回帰係数</strong>ともいいます。</p>
        <MathBlock caption="傾き b：x と y の共分散を、x の分散（標準偏差の2乗）で割る">{'b = \\frac{s_{xy}}{s_x^2} = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2}'}</MathBlock>
        <MathBlock caption="同じ b を、相関係数と標準偏差で表した形">{'b = r \\, \\frac{s_y}{s_x}'}</MathBlock>
        <MathBlock caption="切片 a：直線が平均の点 (x̄, ȳ) を通るように決まる">{'a = \\bar{y} - b\\,\\bar{x}'}</MathBlock>
        <Example title="アイスのデータで計算する">
          <Steps>
            <li>
              平均：<M>{'\\bar{x} = 130 \\div 5 = 26'}</M>、<M>{'\\bar{y} = 500 \\div 5 = 100'}</M>
            </li>
            <li>
              x の偏差 −4, −2, 0, 2, 4、y の偏差 −18, −14, 4, 6, 22
            </li>
            <li>
              偏差の積の合計：<M>{'72 + 28 + 0 + 12 + 88 = 200'}</M>、x の偏差の2乗の合計：<M>{'16 + 4 + 0 + 4 + 16 = 40'}</M>
            </li>
            <li>
              傾き：<M>{'b = 200 \\div 40 = 5'}</M>
            </li>
            <li>
              切片：<M>{'a = 100 - 5 \\times 26 = -30'}</M>
            </li>
          </Steps>
          <p>
            回帰直線は <M>{'\\hat{y} = -30 + 5x'}</M>。最高気温が 27℃ なら <M>{'\\hat{y} = -30 + 5 \\times 27 = 105'}</M> 個と予測できます。
          </p>
          <DataTable
            head={['x', '観測値 y', '予測値 ŷ', '残差 y − ŷ', '残差²']}
            rows={[
              ['22', '82', '80', '+2', '4'],
              ['24', '86', '90', '−4', '16'],
              ['26', '104', '100', '+4', '16'],
              ['28', '106', '110', '−4', '16'],
              ['30', '122', '120', '+2', '4'],
              [<strong key="t">合計</strong>, '', '', '0', <strong key="s">56</strong>],
            ]}
            caption="予測値と残差。残差の合計は0、2乗和は56（これより小さくできる直線はない）"
          />
        </Example>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="傾き b は「x が1増えたときの、予測値の増え方」">
          <p>
            b = 5 は「最高気温が1℃上がると、売上の予測が5個増える」という意味です。切片 a = −30 は「0℃ のときの予測」ですが、
            0℃ のデータはないので、この例では意味のある値ではありません。直線の位置を決めるための数と考えます。
          </p>
        </Intuition>
        <Intuition title="回帰直線は、必ず平均の点 (x̄, ȳ) を通る">
          <p>
            <M>{'a = \\bar{y} - b\\bar{x}'}</M> を書きかえると <M>{'\\bar{y} = a + b\\bar{x}'}</M>。つまり x に平均 26 を入れると、予測値は y の平均 100 になります。
            また、残差の合計はいつも 0 です。
          </p>
        </Intuition>
        <Intuition title="b = r × (s_y ÷ s_x) の意味">
          <p>
            x が標準偏差1つ分（<M>{'s_x'}</M>）増えると、予測値は y の標準偏差の r 倍（<M>{'r s_y'}</M>）だけ増える、という意味です。
            r が 1 より小さいと、「標準偏差いくつ分はなれているか」で測ったとき、予測値は x よりも平均の近くに来ます。
            たとえば r = 0.5 なら、x が平均より標準偏差2つ分大きい人の予測値は、y の平均より標準偏差1つ分だけ大きい値です（<strong>平均への回帰</strong>）。アイスの例では <M>{'s_x \\approx 2.83'}</M>、<M>{'s_y \\approx 14.53'}</M>、
            <M>{'r \\approx 0.973'}</M> で、<M>{'0.973 \\times 14.53 \\div 2.83 \\approx 5'}</M> と、上の b と一致します。
          </p>
        </Intuition>
      </Section>

      <Section title="予測の注意：外挿">
        <p>
          回帰直線が信頼できるのは、だいたい<strong>データがある範囲の中</strong>です。範囲の外を予測することを<strong>外挿</strong>といい、注意が必要です。
        </p>
        <Figure caption="データは 22〜30℃ の範囲だけ。40℃ を直線で予測すると 170 個になるが、暑すぎると客が出かけなくなるなど、範囲の外では関係が変わっているかもしれない">
          <Plot x={[15, 42]} y={[40, 190]} height={300} xLabel="最高気温（℃）" yLabel="売上（個）">
            <VLine x={22} color="muted" />
            <VLine x={30} color="muted" />
            <PlotText x={26} y={180} color="muted">
              データの範囲
            </PlotText>
            <Curve f={(t) => -30 + 5 * t} from={22} to={30} color="c1" width={3} />
            <Curve f={(t) => -30 + 5 * t} from={30} to={42} color="c5" width={2.5} dashed />
            <Curve f={(t) => -30 + 5 * t} from={15} to={22} color="c5" width={2.5} dashed />
            <Points data={iceData.xs.map((x, i) => ({ x, y: iceData.ys[i] }))} r={6} color="ink" />
            <Points data={[{ x: 40, y: 170 }]} r={7} color="c5" />
            <PlotText x={40} y={170} dy={-14} anchor="end" color="c5">
              外挿：170個？
            </PlotText>
          </Plot>
        </Figure>
      </Section>

      <Section title="y を x に回帰する ≠ x を y に回帰する">
        <p>
          最小二乗法は「<strong>縦方向</strong>（y の方向）のずれ」を小さくします。逆に「売上から気温を予測したい」ときは、横方向のずれを小さくする別の直線
          （x を y に回帰した直線）になり、ふつうは y を x に回帰した直線とは重なりません。
        </p>
        <MathBlock caption="x を y に回帰した直線：傾きが r × (s_x ÷ s_y) になる">{'\\hat{x} = \\bar{x} + r\\,\\frac{s_x}{s_y}\\,(y - \\bar{y})'}</MathBlock>
        <Figure caption="2本の直線は、どちらも平均の点を通る。r が 1 のときだけ重なり、r が小さいほど開いていく">
          <TwoRegressionLines />
        </Figure>
        <p>
          アイスの例で x を y に回帰すると、傾きは <M>{'0.973 \\times 2.83 \\div 14.53 \\approx 0.19'}</M>（売上が1個増えると気温の予測が0.19℃上がる）です。
          これを y の式に直すと傾きは約 <M>{'1 \\div 0.19 \\approx 5.28'}</M> で、y を x に回帰した傾き 5 とは違います。
        </p>
        <p>
          なお、2つの傾きを掛けると標準偏差が消えて <M>{'r\\frac{s_y}{s_x} \\times r\\frac{s_x}{s_y} = r^2'}</M> になります（アイスの例では <M>{'5 \\times 0.189 \\approx 0.947'}</M>）。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>最小二乗法は「点から直線までの最短距離」を小さくする → 小さくするのは<strong>縦方向</strong>のずれ（残差）の2乗和です。</li>
            <li>
              回帰直線を逆に解けば x の予測になる → 「x を y に回帰した直線」は別の直線です。予測したい変数を y（目的変数）にして求め直します。
            </li>
            <li>
              b = r と思う → <M>{'b = r\\,s_y / s_x'}</M>。x と y の標準偏差が等しいときだけ b = r です。
            </li>
            <li>データの範囲外でも直線どおりになる → 外挿には注意します。</li>
            <li>回帰直線が引けたから x が y の原因 → 回帰は予測の道具で、因果を示すものではありません。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>平均・標準偏差・相関係数（または共分散）が与えられて、回帰直線の傾きと切片を求める問題。</li>
            <li>回帰直線を使って予測値や残差を計算する問題。</li>
            <li>「回帰直線は (x̄, ȳ) を通る」「残差の合計は0」などの性質を使う問題。</li>
            <li>y を x に回帰した傾きと x を y に回帰した傾きの関係（掛けると r² になる）を使う問題。</li>
            <li>
              回帰式の読み方（傾きの意味、外挿、因果ではないこと）について正しい記述を選ぶ問題。統計ソフトの出力表から回帰式を読みとる問題は
              <Link to="/lessons/linear-models-software-output">「統計ソフトの出力を読む」のレッスン</Link>で扱います。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
