import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BinomialNormal } from '../figures/BinomialNormal'
import { ContinuityCorrection } from '../figures/ContinuityCorrection'
import { ProportionSpread } from '../figures/ProportionSpread'

export const meta: LessonMeta = {
  id: 'sampling-normal-approximation',
  chapter: 'sampling',
  order: 3,
  title: '二項分布の正規近似と連続修正',
  summary: '試行回数が多い二項分布は、正規分布で近似して確率を計算できます。棒の幅の分だけ ±0.5 ずらすのが連続修正です。',
  minutes: 30,
  keywords: ['二項分布の正規近似', '連続修正', '標本比率の分布'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          二項分布 <M>{'B(n, p)'}</M>（成功確率 p の試行を n 回くり返したときの成功回数の分布）は、n が大きいと平均 <M>{'np'}</M>・分散 <M>{'np(1-p)'}</M> の<strong>正規分布でよく近似</strong>できます。
          「k 回以下」の確率を近似するときは、棒の幅を考えて <M>{'k + 0.5'}</M> まで面積をとる（<strong>連続修正</strong>）と精度が上がります。
        </p>
      </Point>

      <Section title="なぜ近似したいのか">
        <p>
          コインを 100 回投げて表が 60 回以上出る確率を考えます。表の回数 X は二項分布 <M>{'B(100, 0.5)'}</M> に従います
          （<Link to="/lessons/distributions-binomial">「ベルヌーイ試行と二項分布」</Link>）。二項分布のまま計算しようとすると、
          <M>{'P(X=60) + P(X=61) + \\cdots + P(X=100)'}</M> と 41 個もの確率を足すことになります。電卓では大変です。
        </p>
        <p>
          ところが二項分布は「成功なら 1、失敗なら 0」を n 回足したもの、つまり<strong>和</strong>なので、前のレッスンの中心極限定理により、
          n が大きいと正規分布に近づきます。正規分布なら、標準化して正規分布表を 1 回引くだけで済みます。
        </p>
        <Figure caption="n を大きくすると、棒グラフ（二項分布）の形がオレンジの正規曲線に重なっていく。p が0や1に近いと形がゆがむので、より大きな n が必要">
          <BinomialNormal />
        </Figure>
        <MathBlock caption="二項分布の正規近似：平均と分散が同じ正規分布で置きかえる（〜 は「この分布に従う」、≈ は「およそ従う」）">{'X \\sim B(n, p) \\quad \\Longrightarrow \\quad X \\approx N\\big(np,\\ np(1-p)\\big)'}</MathBlock>
        <MathBlock caption="標準化して正規分布表を使う。分母は分散 np(1−p) ではなく、そのルート（標準偏差）">{'Z = \\frac{X - np}{\\sqrt{np(1-p)}} \\approx N(0, 1)'}</MathBlock>
        <p>
          近似がよく効く目安として、「<M>{'np'}</M> と <M>{'n(1-p)'}</M> がどちらも 5 以上」がよく使われます（教科書によっては 10 以上とするものもあります）。
        </p>
      </Section>

      <Section title="連続修正：棒には幅がある">
        <p>
          二項分布は 0, 1, 2, … と<strong>とびとびの値</strong>しかとりませんが、正規分布は<strong>なめらかにつながった値</strong>をとります。
          二項分布の確率を棒グラフで描くと、値 k の棒は <M>{'k - 0.5'}</M> から <M>{'k + 0.5'}</M> まで幅 1 をもっています。
          だから「7 回以下」の棒全体は 7.5 までのびています。
        </p>
        <Figure caption="青い棒（7回以下）の面積を、正規分布で近似したい。7で区切ると最後の棒の右半分が抜けるので、7.5まで塗るとぴったり近くなる">
          <ContinuityCorrection />
        </Figure>
        <DataTable
          head={['知りたい確率', '連続修正したあと（正規分布で計算）']}
          rows={[
            [<M key="a">{'P(X \\le k)'}</M>, <M key="b">{'P(Y \\le k + 0.5)'}</M>],
            [<M key="c">{'P(X \\ge k)'}</M>, <M key="d">{'P(Y \\ge k - 0.5)'}</M>],
            [<M key="i">{'P(X > k) = P(X \\ge k+1)'}</M>, <M key="j">{'P(Y \\ge k + 0.5)'}</M>],
            [<M key="e">{'P(X < k) = P(X \\le k-1)'}</M>, <M key="f">{'P(Y \\le k - 0.5)'}</M>],
            [<M key="g">{'P(X = k)'}</M>, <M key="h">{'P(k - 0.5 \\le Y \\le k + 0.5)'}</M>],
          ]}
          caption="X は二項分布、Y は近似に使う正規分布。「その棒を含むか」を考えて ±0.5 の向きを決める"
        />
        <Example title="計算してみよう">
          <p>X が二項分布 <M>{'B(50, 0.4)'}</M> に従うとき、<M>{'P(X \\le 15)'}</M> を正規近似で求めます。</p>
          <Steps>
            <li>
              平均 <M>{'np = 50 \\times 0.4 = 20'}</M>、分散 <M>{'np(1-p) = 50 \\times 0.4 \\times 0.6 = 12'}</M>、標準偏差 <M>{'\\sqrt{12} \\approx 3.46'}</M>
            </li>
            <li>
              連続修正：15 の棒を含むので 15.5 まで。標準化すると <M>{'z = (15.5 - 20)/3.46 = -4.5/3.46 \\approx -1.30'}</M>
            </li>
            <li>
              正規分布表は右側（上側）の確率なので、左右対称を使って <M>{'P(Z \\le -1.30) = P(Z \\ge 1.30) \\approx 0.097'}</M>
            </li>
          </Steps>
          <p>
            正確な二項分布の値は 0.0955 です。連続修正をしないで 15 で区切ると約 0.074 となり、ずれが大きくなります。
          </p>
        </Example>
      </Section>

      <Section title="標本比率の分布">
        <p>
          ここで p は<strong>母比率</strong>（母集団全体での本当の割合）です。世論調査で「n 人中 X 人が賛成」なら、賛成の割合 <M>{'\\hat{p} = X/n'}</M>（ピーハット）を<strong>標本比率</strong>といいます。
          X が <M>{'B(n, p)'}</M> に従うので、n で割った <M>{'\\hat{p}'}</M> の平均と分散は次のようになります。
        </p>
        <MathBlock caption="標本比率の期待値：平均すると本当の割合 p に一致する">{'E(\\hat{p}) = \\frac{np}{n} = p'}</MathBlock>
        <MathBlock caption="標本比率の分散：n で割ると分散は 1/n² 倍">{'V(\\hat{p}) = \\frac{np(1-p)}{n^2} = \\frac{p(1-p)}{n}'}</MathBlock>
        <MathBlock caption="n が大きいとき、標本比率はおよそ正規分布に従う">{'\\hat{p} \\approx N\\left(p,\\ \\frac{p(1-p)}{n}\\right)'}</MathBlock>
        <MathBlock caption="標準化した形。推定の章の「母比率の区間推定」はこの式から作る">{'Z = \\frac{\\hat{p} - p}{\\sqrt{p(1-p)/n}} \\approx N(0, 1)'}</MathBlock>
        <Figure caption="横軸を「割合」にした二項分布。人数nを増やすと、p̂ は本当の割合pのまわりに細く集まる">
          <ProportionSpread />
        </Figure>
        <Intuition title="標本平均の特別な場合">
          <p>
            賛成を 1、反対を 0 と書くと、<M>{'\\hat{p}'}</M> は 0 と 1 の平均、つまり<strong>標本平均</strong>です。1 人ぶんの分散は <M>{'p(1-p)'}</M> なので、
            「標本平均の分散 = <M>{'\\sigma^2/n'}</M>」にあてはめると <M>{'p(1-p)/n'}</M> になります。新しい公式というより、レッスン1の式の言いかえです。
          </p>
        </Intuition>
        <Example>
          <p>
            本当の支持率が 30% のとき、100 人を調べた支持率 <M>{'\\hat{p}'}</M> の標準偏差は <M>{'\\sqrt{0.3 \\times 0.7 / 100} = \\sqrt{0.0021} \\approx 0.046'}</M>。
            調査の結果はだいたい 30% ± 4.6 ポイントくらいの幅でぶれる、ということです。
          </p>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              連続修正の向きを逆にする → 「X ≧ 60」は 60 の棒を<strong>含む</strong>ので、棒の左端 59.5 から。「X ≦ 15」は 15.5 まで。
            </li>
            <li>
              正規近似の標準偏差に <M>{'np(1-p)'}</M> をそのまま使う → それは分散。標準偏差はそのルートです。
            </li>
            <li>
              標本比率の分散を <M>{'np(1-p)'}</M> とする → それは「回数」X の分散。「割合」<M>{'\\hat{p}'}</M> の分散は <M>{'p(1-p)/n'}</M>。
            </li>
            <li>連続修正は「とびとびの分布を、つながった分布で近似するとき」だけ。もともと正規分布の量には使いません。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>「n 回中 k 回以上」の確率を正規近似で求める問題。連続修正をするかどうかは問題文の指示に従う（±0.5 の向きを含めて、式を選ばせる形もありうる）。</li>
            <li>標本比率の期待値・標準偏差を求める問題。母比率の区間推定・検定の準備になる。</li>
            <li>二項分布の平均・分散（np と np(1−p)）をすぐに出せることが前提。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
