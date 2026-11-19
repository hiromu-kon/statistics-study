import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DistBars } from '../figures/DistBars'
import { LoadedDie } from '../figures/LoadedDie'
import { SpreadSlider } from '../figures/SpreadSlider'
import { die } from '../figures/dist'

export const meta: LessonMeta = {
  id: 'random-variables-expectation-variance',
  chapter: 'random-variables',
  order: 2,
  title: '期待値・分散・標準偏差',
  summary: '確率変数の「平均的な値」と「散らばり」。データの平均・分散と同じ計算を、相対度数の代わりに確率で重みづけして行います。',
  minutes: 30,
  keywords: ['期待値', '分散', '標準偏差'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>期待値</strong>は「値 × 確率」を全部足したもの。何度もくり返したときの平均で、確率分布の<strong>釣り合いの点</strong>です。
          <strong>分散</strong>は「期待値からのずれの2乗」の期待値で、値がどれくらい散らばるかを表します。
        </p>
      </Point>

      <Section title="具体例：くじの期待値">
        <p>100本のくじがあります。1等（1000円）が1本、2等（100円）が10本、残り89本ははずれ（0円）です。1本引いたときの賞金を <M>{'X'}</M> 円とします。</p>
        <DataTable
          head={['賞金 x（円）', '本数', '確率 P(X = x)', 'x × 確率']}
          rows={[
            ['1000', '1', '0.01', '10'],
            ['100', '10', '0.10', '10'],
            ['0', '89', '0.89', '0'],
            [<strong key="s">合計</strong>, '100', '1', <strong key="e">20</strong>],
          ]}
          caption="賞金の確率分布と期待値の計算"
        />
        <p>
          期待値は <M>{'1000 \\times 0.01 + 100 \\times 0.1 + 0 \\times 0.89 = 20'}</M> 円。
          これは「100本<strong>全部</strong>を買ったら賞金の合計は <M>{'1000 + 100 \\times 10 = 2000'}</M> 円、1本あたり <M>{'2000 \\div 100 = 20'}</M> 円」と同じです。
          くじ1本の値段が20円より高ければ、くり返し買うほど損をする計算になります。
        </p>
      </Section>

      <Section title="定義・式：期待値">
        <MathBlock caption="期待値：とりうる値に、その確率をかけて全部足す">{'E(X) = \\sum_{i} x_i\\,P(X = x_i) = x_1 p_1 + x_2 p_2 + \\cdots + x_k p_k'}</MathBlock>
        <p>
          <M>{'E'}</M> は expectation（期待）の頭文字です。期待値は <M>{'\\mu'}</M>（ミュー）という記号で表すことも多いです。
          サイコロの目なら <M>{'(1 + 2 + 3 + 4 + 5 + 6) \\times \\frac{1}{6} = 3.5'}</M> です。
        </p>
        <Figure caption="サイコロの確率分布。棒を重りだと思うと、ちょうど 3.5 の位置の支点で釣り合う">
          <DistBars dist={die} x={[0.3, 6.7]} yMax={0.2} xTicks={[1, 2, 3, 4, 5, 6]} xLabel="出る目 x" label={() => '1/6'} showMean ariaLabel="サイコロの確率分布と、期待値3.5の支点" />
        </Figure>
        <Intuition title="期待値は「釣り合いの点」">
          <p>
            棒の高さ（確率）を重さだと思って、横棒に乗せたシーソーを想像してください。期待値は、そのシーソーが<strong>ちょうど釣り合う支点の位置</strong>です。
            下の図で6の目の確率を上げると、右側が重くなり、釣り合う点（期待値）が右へ動きます。
          </p>
        </Intuition>
        <Figure caption="6の目が出やすいサイコロ。6の確率を 1/2 にすると、期待値は 4.5 になる">
          <LoadedDie />
        </Figure>
      </Section>

      <Section title="データの平均との対応">
        <p>
          期待値の式は、記述統計で習った「度数分布表からの平均」とまったく同じ形です。<strong>相対度数（割合）が確率に置きかわった</strong>だけです。
        </p>
        <DataTable
          head={['', 'データ（記述統計）', '確率変数']}
          rows={[
            ['平均', <M key="a">{'\\bar{x} = \\sum x_i \\times (f_i / n)'}</M>, <M key="b">{'E(X) = \\sum x_i\\,p_i'}</M>],
            ['分散', <M key="c">{'s^2 = \\sum (x_i - \\bar{x})^2 \\times (f_i / n)'}</M>, <M key="d">{'V(X) = \\sum (x_i - \\mu)^2\\,p_i'}</M>],
            ['重み', '相対度数 f/n（実際に出た割合）', '確率 p（理論上の割合）'],
          ]}
          caption="f は度数、n はデータの個数。確率変数の分散は n で割る分散に対応する"
        />
        <p>
          サイコロを何千回も振ると、各目の相対度数は 1/6 に近づき、データの平均は 3.5 に近づきます。期待値は「無限にくり返したときのデータの平均」だと考えられます。
        </p>
      </Section>

      <Section title="定義・式：分散と標準偏差">
        <p>期待値だけでは、散らばりがわかりません。次の2つは、どちらも期待値が 3.5 です。</p>
        <Compare>
          <Card title="3 か 4 が 1/2 ずつ">
            <DistBars
              dist={[
                { x: 3, p: 0.5 },
                { x: 4, p: 0.5 },
              ]}
              x={[0.3, 6.7]}
              yMax={0.6}
              xTicks={[1, 2, 3, 4, 5, 6]}
              label={() => '1/2'}
              showMean
              width={340}
              height={200}
            />
            <p className="small">期待値の近くに集まっている。分散 0.25</p>
          </Card>
          <Card title="1 か 6 が 1/2 ずつ">
            <DistBars
              dist={[
                { x: 1, p: 0.5 },
                { x: 6, p: 0.5 },
              ]}
              x={[0.3, 6.7]}
              yMax={0.6}
              xTicks={[1, 2, 3, 4, 5, 6]}
              label={() => '1/2'}
              showMean
              color="c4"
              width={340}
              height={200}
            />
            <p className="small">期待値から遠い値ばかり。分散 6.25</p>
          </Card>
        </Compare>
        <MathBlock caption="分散：期待値 μ からのずれを2乗し、確率で重みづけして足す">{'V(X) = E\\left[(X - \\mu)^2\\right] = \\sum_i (x_i - \\mu)^2\\,p_i'}</MathBlock>
        <MathBlock caption="計算を楽にする式：2乗の期待値から、期待値の2乗を引く">{'V(X) = E(X^2) - \\{E(X)\\}^2'}</MathBlock>
        <MathBlock caption="標準偏差：分散の正のルート。X と同じ単位にもどる">{'\\sigma = \\sqrt{V(X)}'}</MathBlock>
        <Example title="サイコロの分散を2通りで計算する">
          <Steps>
            <li>
              定義どおり：ずれは −2.5, −1.5, −0.5, 0.5, 1.5, 2.5。2乗は 6.25, 2.25, 0.25, 0.25, 2.25, 6.25 で合計 17.5。
              それぞれ確率 1/6 なので <M>{'V(X) = 17.5 / 6 = 35/12 \\approx 2.92'}</M>。
            </li>
            <li>
              楽な式：<M>{'E(X^2) = (1 + 4 + 9 + 16 + 25 + 36)/6 = 91/6'}</M>。
              <M>{'V(X) = 91/6 - 3.5^2 = 91/6 - 49/4 = 35/12'}</M>。同じになります。
            </li>
            <li>
              標準偏差：<M>{'\\sqrt{35/12} \\approx 1.71'}</M>。「出る目は、平均 3.5 からだいたい 1.7 くらいずれる」と読めます。
            </li>
          </Steps>
        </Example>
        <Figure caption="期待値は 3 のまま、両はしの確率だけを増やすと、分散（散らばり）が大きくなる">
          <SpreadSlider />
        </Figure>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              期待値は「一番出やすい値」だと思う → サイコロの期待値 3.5 は、実際には一度も出ません。「くり返したときの平均」です。
            </li>
            <li>
              <M>{'E(X^2)'}</M> と <M>{'\\{E(X)\\}^2'}</M> を同じだと思う → サイコロでは 91/6 ≒ 15.17 と 12.25 で、違います。その差が分散です。
            </li>
            <li>分散の計算で確率をかけ忘れて、ずれの2乗をただ足してしまう。</li>
            <li>分散と標準偏差を取り違える → 単位が X と同じなのは標準偏差。分散は「単位の2乗」になります。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>確率分布表から期待値・分散を計算する問題。<M>{'V(X) = E(X^2) - \\{E(X)\\}^2'}</M> を使うと速い。</li>
            <li>くじやゲームの賞金の期待値を求め、損か得かを判断する問題。</li>
            <li>未知の確率を含む分布表で、「確率の合計 = 1」と「期待値の値」の2つの条件から確率を決めてから分散を求める問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
