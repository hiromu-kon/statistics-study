import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { CorrelationSlider } from '../figures/CorrelationSlider'
import { curvedData } from '../figures/data'
import { OutlierPlot } from '../figures/OutlierPlot'
import { QuadrantPlot } from '../figures/QuadrantPlot'
import { Scatter } from '../figures/Scatter'

export const meta: LessonMeta = {
  id: 'bivariate-scatter-correlation',
  chapter: 'bivariate',
  order: 1,
  title: '散布図・共分散・相関係数',
  summary: '2つの量の「いっしょに動く度合い」を、図（散布図）と数（共分散・相関係数）で表す方法です。',
  minutes: 30,
  keywords: ['散布図', '共分散', '相関係数'],
}

const study = { xs: [1, 2, 3, 4, 5], ys: [40, 60, 50, 70, 80] }

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          2つの量の関係は、まず<strong>散布図</strong>で見ます。「片方が大きいともう片方も大きい」傾向を数にしたのが
          <strong>共分散</strong>で、それを −1 から 1 の目盛りにそろえたのが<strong>相関係数 r</strong> です。
          ただし r が測るのは<strong>直線的な</strong>関係だけです。
        </p>
      </Point>

      <Section title="散布図：2つの量を1枚の図に">
        <p>5人の「1日の勉強時間」と「小テストの点」を調べました（架空のデータ）。</p>
        <Compare>
          <Card title="データ">
            <DataTable
              head={['人', '勉強時間 x（時間）', '点数 y（点）']}
              rows={study.xs.map((x, i) => [`${'ABCDE'[i]}さん`, String(x), String(study.ys[i])])}
            />
          </Card>
          <Card title="散布図">
            <Scatter xs={study.xs} ys={study.ys} x={[0, 6]} y={[30, 90]} xLabel="勉強時間（時間）" yLabel="点数" width={360} height={260} r={7} />
          </Card>
        </Compare>
        <p>
          1人を1つの点にして、横に x、縦に y をとった図が<strong>散布図</strong>です。点が右上がりに並んでいれば
          「x が大きい人ほど y も大きい」（<strong>正の相関</strong>）、右下がりなら「x が大きい人ほど y は小さい」（<strong>負の相関</strong>）、
          はっきりした傾きがなければ「相関がない」といいます。
        </p>
      </Section>

      <Section title="共分散：4つの部屋で考える">
        <p>
          「右上がりかどうか」を1つの数にするために、x の平均と y の平均で線を引き、散布図を4つの部屋に分けます。
        </p>
        <p>
          ここで使うのが<strong>偏差</strong>（へんさ）です。偏差は「その値 − 平均」で、平均より大きければプラス、小さければマイナスになります
          （<Link to="/lessons/descriptive-spread">「分散と標準偏差」のレッスン</Link>で出てきたものと同じです）。
          たとえば平均が 3 時間のとき、5 時間勉強した人の偏差は 5 − 3 = +2、1 時間の人は 1 − 3 = −2 です。
        </p>
        <ul>
          <li>
            <strong>右上の部屋</strong>：x も y も平均より大きい → 偏差はどちらもプラス → 掛けると<strong>プラス</strong>
          </li>
          <li>
            <strong>左下の部屋</strong>：x も y も平均より小さい → 偏差はどちらもマイナス → 掛けると<strong>プラス</strong>
          </li>
          <li>
            <strong>左上・右下の部屋</strong>：片方だけ平均より大きい → 掛けると<strong>マイナス</strong>
          </li>
        </ul>
        <Figure caption="平均の点から各点までの長方形の面積が「偏差の積」。緑（プラス）が多いと共分散はプラス、赤（マイナス）が多いとマイナスになる">
          <QuadrantPlot />
        </Figure>
        <p>
          3つのボタンを切りかえてみてください。右上がりのデータは緑の長方形ばかり、右下がりは赤ばかり、ばらばらのデータは緑と赤が打ち消しあって合計がほぼ0になります。
          この「偏差の積の平均」が<strong>共分散</strong>です。
        </p>
        <MathBlock caption="共分散：x の偏差と y の偏差を掛けて、平均する">
          {'s_{xy} = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})'}
        </MathBlock>
        <ul>
          <li>
            <M>{'s_{xy}'}</M>（エス・エックスワイ）は x と y の共分散を表す記号です。
          </li>
          <li>
            <M>{'x_i'}</M> は「i 番目の人の x」、<M>{'\\bar{x}'}</M>（エックスバー）は x の平均、<M>{'\\bar{y}'}</M> は y の平均です。
          </li>
          <li>
            <M>{'\\sum_{i=1}^{n}'}</M>（シグマ）は「1番目から n 番目まで全部足す」という記号です（<Link to="/lessons/math-sigma">Σ記号のレッスン</Link>）。
            つまりこの式は「1人ずつ偏差の積を計算して、全員分を足し、人数 n で割る」と言っています。
          </li>
          <li>分散と同じく、n ではなく n − 1 で割る定義もあります。問題文の指定にしたがってください。</li>
        </ul>
      </Section>

      <Section title="相関係数：共分散の目盛りをそろえる">
        <p>
          共分散には困った点があります。勉強時間を「時間」から「分」に直すと、偏差が60倍になるので共分散も60倍になります。
          関係の強さは何も変わっていないのに、数だけが変わってしまうのです。
        </p>
        <p>
          そこで、共分散を x の標準偏差 <M>{'s_x'}</M> と y の標準偏差 <M>{'s_y'}</M> で割って、単位を消します。これが<strong>相関係数</strong>です。
          標準偏差は「平均からのはなれ方のふつうの大きさ」で、偏差の2乗の平均（分散）のルートです（<Link to="/lessons/descriptive-spread">「分散と標準偏差」のレッスン</Link>）。
          勉強時間を分に直すと、共分散も <M>{'s_x'}</M> も60倍になるので、割り算で60倍が打ち消しあいます。
        </p>
        <MathBlock caption="相関係数：共分散を、それぞれの標準偏差で割る">{'r = \\frac{s_{xy}}{s_x \\, s_y}'}</MathBlock>
        <MathBlock caption="同じことを偏差の合計で書いた形（n が消えるので計算が楽）">
          {'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2}\\,\\sqrt{\\sum (y_i - \\bar{y})^2}}'}
        </MathBlock>
        <p>r は必ず −1 以上 1 以下になります。1 に近いほど右上がりの直線に、−1 に近いほど右下がりの直線にぴったり並びます。</p>
        <Example title="上の5人で計算してみよう">
          <Steps>
            <li>
              平均を求める：<M>{'\\bar{x} = 15 \\div 5 = 3'}</M>、<M>{'\\bar{y} = 300 \\div 5 = 60'}</M>
            </li>
            <li>偏差を求めて、x の偏差 × y の偏差 を計算する（下の表）</li>
            <li>
              合計を出す：偏差の積の合計 90、x の偏差の2乗の合計 10、y の偏差の2乗の合計 1000
            </li>
            <li>
              共分散：<M>{'s_{xy} = 90 \\div 5 = 18'}</M>
            </li>
            <li>
              相関係数：<M>{'r = \\dfrac{90}{\\sqrt{10}\\,\\sqrt{1000}} = \\dfrac{90}{100} = 0.9'}</M>
            </li>
          </Steps>
          <DataTable
            head={['x', 'y', 'x − 3', 'y − 60', '積', '(x − 3)²', '(y − 60)²']}
            rows={[
              ['1', '40', '−2', '−20', '40', '4', '400'],
              ['2', '60', '−1', '0', '0', '1', '0'],
              ['3', '50', '0', '−10', '0', '0', '100'],
              ['4', '70', '+1', '+10', '10', '1', '100'],
              ['5', '80', '+2', '+20', '40', '4', '400'],
              [<strong key="s">合計</strong>, '', '0', '0', <strong key="p">90</strong>, <strong key="x">10</strong>, <strong key="y">1000</strong>],
            ]}
            caption="相関係数の計算表"
          />
          <p>
            標準偏差（n で割る）から計算しても同じです：<M>{'s_x = \\sqrt{2} \\approx 1.414'}</M>、<M>{'s_y = \\sqrt{200} \\approx 14.14'}</M> なので
            <M>{'r = 18 \\div (1.414 \\times 14.14) \\approx 0.9'}</M>。
          </p>
        </Example>
        <MathNote title="合計（Σx、Σxy など）だけから計算する方法">
          <p>
            試験では、表の代わりに「Σx = 15、Σxy = 990」のような<strong>合計だけ</strong>が与えられることがあります。そのときは次の式で偏差の合計に直します。
          </p>
          <MathBlock caption="偏差の積の合計 ＝ xy の合計 −（x の合計 × y の合計）÷ n">
            {'\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = \\sum x_i y_i - \\frac{(\\sum x_i)(\\sum y_i)}{n}'}
          </MathBlock>
          <p>y を x にすれば、偏差の2乗の合計 <M>{'\\sum (x_i - \\bar{x})^2 = \\sum x_i^2 - (\\sum x_i)^2 / n'}</M> になります。上の5人で確かめると：</p>
          <Steps>
            <li>
              <M>{'\\sum x_i y_i = 1 \\times 40 + 2 \\times 60 + 3 \\times 50 + 4 \\times 70 + 5 \\times 80 = 990'}</M>
            </li>
            <li>
              偏差の積の合計：<M>{'990 - 15 \\times 300 \\div 5 = 990 - 900 = 90'}</M>（表の合計と同じ）
            </li>
            <li>
              x の偏差の2乗の合計：<M>{'\\sum x_i^2 = 1 + 4 + 9 + 16 + 25 = 55'}</M> なので <M>{'55 - 15^2 \\div 5 = 55 - 45 = 10'}</M>
            </li>
          </Steps>
        </MathNote>
        <MathNote title="n で割っても n − 1 で割っても r は同じ">
          <p>
            共分散も標準偏差も同じ数で割るので、分子と分母で割る数が打ち消しあいます。共分散は定義によって値が変わりますが、相関係数は変わりません。
          </p>
        </MathNote>
      </Section>

      <Section title="直感的な理解">
        <Figure caption="r を動かすと、点の集まり方が変わる。r = 0 では丸い雲、|r| が1に近づくほど細長くなり、±1 で一直線になる">
          <CorrelationSlider />
        </Figure>
        <Intuition title="r は「直線へのまとまり具合」">
          <p>
            r が表すのは、点が<strong>直線のまわりにどれくらい細く集まっているか</strong>です。直線の傾きの急さではありません。
            傾きがゆるやかでも、点が直線にぴったり並んでいれば r = 1 です。
          </p>
        </Intuition>
      </Section>

      <Section title="r が苦手なもの①：曲線の関係">
        <p>
          部屋の温度と作業のはかどり具合を調べると、寒すぎても暑すぎてもはかどらず、ちょうどいい温度でいちばんはかどる、という山形の関係になったとします（架空のデータ）。
        </p>
        <Figure caption="はっきりした関係があるのに、r はほぼ 0。右上がりの部分と右下がりの部分が打ち消しあうため">
          <Scatter xs={curvedData.xs} ys={curvedData.ys} xLabel="室温（℃）" yLabel="はかどり具合（点）" meanLines showR />
        </Figure>
        <p>
          r が 0 に近いことは「<strong>直線的な関係がない</strong>」という意味で、「関係がない」という意味ではありません。だから、r を計算する前に必ず散布図を見ます。
        </p>
      </Section>

      <Section title="r が苦手なもの②：外れ値">
        <p>関係のない10点のかたまりに、遠くの1点を加えてみます。</p>
        <Figure caption="外れ値1つで、r は −0.5 くらいから 0.7 くらいまで大きく動く">
          <OutlierPlot />
        </Figure>
        <p>
          平均と同じく、r も外れ値に引っぱられやすい数です。外れ値があるときは、入力ミスではないかを確かめ、外れ値を除いた場合の r もあわせて見るとよいです。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              r ≈ 0 なら「関係がない」→ 曲線の関係かもしれません。<strong>r は直線的な関係だけ</strong>を測ります。
            </li>
            <li>r が大きいほど傾きが急 → r は傾きではなく、直線へのまとまり具合です。</li>
            <li>
              単位を変えると r も変わる → 変わるのは共分散だけ。<strong>r には単位がなく</strong>、x や y を正の数倍したり足したりしても変わりません
              （負の数を掛けると符号だけ反対になります）。
            </li>
            <li>r = 0.8 は r = 0.4 の「2倍の強さ」→ r は比べる目安にはなりますが、2倍・半分のように割り算で比べる量ではありません。</li>
            <li>相関があるなら原因と結果の関係がある → 次のレッスン「みかけの相関」で扱います。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>いくつかの散布図を見て、相関係数の値（0.9、0.5、0、−0.5 など）を対応させる問題。</li>
            <li>小さな表や、Σx・Σy・Σx²・Σy²・Σxy などの合計から、共分散や相関係数を計算する問題。</li>
            <li>
              単位の変換や「a 倍して b を足す」変換（たとえば摂氏から華氏へ：<M>{'F = 1.8C + 32'}</M>）をしたとき、共分散・相関係数がどう変わるかを問う問題。
              共分散は掛けた数の分だけ変わり（足した数は関係ない）、相関係数は変わりません。
            </li>
            <li>「r が 0 に近いので2つの変数は無関係」のような記述が正しいかを判断する問題。</li>
            <li>
              CBT では小問の誘導がなく、散布図や表を見ていきなり「正しい記述を選べ」と問われる、と受験記などで言われています。
              「向き（正か負か）」「直線へのまとまり具合」「外れ値・曲線の関係がないか」の3点を順に見る習慣をつけておきます。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
