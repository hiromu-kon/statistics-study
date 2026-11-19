import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { SampleMeanWidth } from '../../sampling/figures/SampleMeanWidth'
import { FpcPlot } from '../figures/FpcPlot'
import { TargetPlot } from '../figures/TargetPlot'
import { DeviationFromMean, DivisorSim } from '../figures/VarianceBias'

export const meta: LessonMeta = {
  id: 'estimation-point',
  chapter: 'estimation',
  order: 1,
  title: '点推定と推定量の性質',
  summary: '母平均などの「わからない数」を、標本から1つの値で言い当てるのが点推定です。よい推定のルールの条件（不偏性・一致性・有効性）を見ます。',
  minutes: 35,
  keywords: ['点推定', '推定量と推定値', '不偏性', '一致性', '有効性', '有限母集団'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>点推定</strong>は、母数（母平均 μ など）を標本から「たぶんこの値」と1つの数で言い当てること。計算の<strong>ルール</strong>が
          <strong>推定量</strong>、実際に出た数が<strong>推定値</strong>です。よい推定量は、平均すると的の真ん中に当たり（<strong>不偏性</strong>）、
          ばらつきが小さく（<strong>有効性</strong>）、n を増やすと真の値に近づく（<strong>一致性</strong>）ものです。
        </p>
      </Point>

      <Section title="推定量と推定値">
        <Compare>
          <Card title="推定量（ルール）">
            <p>
              「n 個の値を足して n で割る」：<M>{'\\bar{X} = (X_1 + \\cdots + X_n)/n'}</M>
            </p>
            <p className="muted">標本をとる前のルールなので、値はまだ決まっていない＝確率変数。大文字で書くことが多い。</p>
          </Card>
          <Card title="推定値（結果の数）">
            <p>
              実際に 5 人を測って計算したら <M>{'\\bar{x} = 162.0'}</M>（cm）
            </p>
            <p className="muted">標本をとったあとの、1つの決まった数。小文字で書くことが多い。</p>
          </Card>
        </Compare>
        <p>
          料理にたとえると、推定量は<strong>レシピ</strong>、推定値はそのレシピで作った<strong>今日の料理</strong>です。
          「よいレシピかどうか」は、1 回作った料理ではなく、何度も作ったときにどうなるかで判断します。推定量の性質も同じで、
          「標本を何度もとり直したら推定値がどう散らばるか」（前の章の標本分布）で考えます。
        </p>
      </Section>

      <Section title="的当てで見る「よい推定量」">
        <p>
          赤い中心が本当の値（母数）、青い点が「標本をとり直すたびに出る推定値」、オレンジの × が推定値の平均です。
        </p>
        <Figure caption="左上が理想。中心のずれ（偏り）とばらつきは別の性質で、どちらも小さいほどよい">
          <TargetPlot />
        </Figure>
        <DataTable
          head={['性質', '意味', '的当てでいうと']}
          rows={[
            [<strong key="u">不偏性</strong>, <span key="u2">推定量の期待値が母数に等しい：<M>{'E(\\hat{\\theta}) = \\theta'}</M></span>, '× が中心に重なる（偏りがない）'],
            [<strong key="e">有効性</strong>, '不偏推定量の中で、分散がより小さい', '点がより中心の近くに集まる'],
            [<strong key="c">一致性</strong>, 'n を大きくすると、推定量が母数に近い値をとる確率が 1 に近づく', '練習を重ねる（n を増やす）と、点が中心に集まっていく'],
          ]}
          caption="θ（シータ）は母数、θ̂（シータハット）はその推定量を表す記号"
        />
      </Section>

      <Section title="不偏性：標本平均は不偏推定量">
        <p>
          前の章で <M>{'E(\\bar{X}) = \\mu'}</M> を見ました。標本平均は平均すると母平均に一致するので、<strong>母平均の不偏推定量</strong>です。
          同じように、標本比率 <M>{'\\hat{p}'}</M> も <M>{'E(\\hat{p}) = p'}</M> なので母比率の不偏推定量です。
        </p>
        <Example title="不偏かどうかを調べる">
          <p>
            同じ母集団から独立にとった <M>{'X_1, X_2, X_3'}</M>（どれも期待値 μ）で、次の 2 つのルールを考えます。
          </p>
          <ul>
            <li>
              <M>{'(X_1 + X_2 + X_3)/3'}</M>：期待値は <M>{'(\\mu + \\mu + \\mu)/3 = \\mu'}</M> → 不偏
            </li>
            <li>
              <M>{'(X_1 + X_2 + X_3)/4'}</M>：期待値は <M>{'3\\mu/4'}</M> → μ より小さく偏る（不偏でない）
            </li>
          </ul>
        </Example>
      </Section>

      <Section title="なぜ分散は n − 1 で割るのか">
        <p>
          母分散 <M>{'\\sigma^2'}</M> を推定したいとき、すなおに「偏差の2乗の平均（n で割る）」を使うと、<strong>平均的に σ² より小さく</strong>なってしまいます。
          理由は、偏差を<strong>本当の平均 μ</strong> ではなく<strong>標本平均</strong>から測っているからです。
        </p>
        <Figure caption="赤の線が μ からのずれ、オレンジの線が標本平均からのずれ。標本平均は5人のちょうど真ん中にあるので、オレンジの2乗和はいつも赤以下になる">
          <DeviationFromMean />
        </Figure>
        <Example title="小さな例で確かめる">
          <p>
            データ 4, 6, 8（標本平均 6）で、本当の平均が μ = 5 だったとします。標本平均からのずれの2乗和は <M>{'4 + 0 + 4 = 8'}</M>、
            μ からのずれの2乗和は <M>{'1 + 1 + 9 = 11'}</M>。標本平均で測ると、ばらつきが小さめに出ます。
          </p>
        </Example>
        <p>この「小さめに出る分」を補うために、n ではなく 1 つ少ない n − 1 で割ります。実際に何千回もやって平均をとると、次のようになります。</p>
        <Figure caption="母分散100の正規母集団から何度も標本をとって分散を計算し、平均した値。nで割ると(n−1)/n倍に小さくなり、n−1で割るとほぼ100に一致する">
          <DivisorSim />
        </Figure>
        <MathBlock caption="n で割る分散の期待値：σ² より小さい">{'E\\left[\\frac{1}{n}\\sum_{i=1}^{n}(X_i - \\bar{X})^2\\right] = \\frac{n-1}{n}\\sigma^2'}</MathBlock>
        <MathBlock caption="n − 1 で割る分散（不偏分散）は、母分散の不偏推定量">{'s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(X_i - \\bar{X})^2, \\qquad E(s^2) = \\sigma^2'}</MathBlock>
        <MathNote title="式の気持ち（覚えなくてよい）">
          <p>
            μ からのずれの2乗和は、標本平均からのずれの2乗和より、ちょうど <M>{'n(\\bar{X} - \\mu)^2'}</M> だけ大きくなります。この期待値は
            <M>{'n \\times \\sigma^2/n = \\sigma^2'}</M>、つまり「1 人ぶんの分散」。全部で <M>{'n\\sigma^2'}</M> あるはずのものから 1 人ぶん減るので、
            <M>{'(n-1)\\sigma^2'}</M> になり、n − 1 で割るとちょうど σ² になります。
          </p>
        </MathNote>
      </Section>

      <Section title="有効性と一致性">
        <Intuition title="有効性：ばらつきが小さいほうがよい">
          <p>
            <M>{'X_1'}</M>（最初の 1 人の値だけ）も、<M>{'E(X_1) = \\mu'}</M> なので不偏推定量です。しかし分散は <M>{'\\sigma^2'}</M> で、標本平均の
            <M>{'\\sigma^2/3'}</M>（n = 3 のとき）より大きい。どちらも不偏なら、分散が小さい標本平均のほうが<strong>有効</strong>です。
          </p>
        </Intuition>
        <Intuition title="一致性：n を増やすと真の値に近づく">
          <p>
            標本平均の分散 <M>{'\\sigma^2/n'}</M> は n を大きくすると 0 に近づくので、標本平均は真の値 μ に近い値ばかりをとるようになります
            （前の章の大数の法則）。このような推定量を<strong>一致推定量</strong>といいます。n で割る分散も、偏りの (n−1)/n が 1 に近づくので一致推定量です。
          </p>
        </Intuition>
        <Figure caption="n を大きくすると、標本平均の分布が真の値 μ のまわりに集まっていく（一致性）">
          <SampleMeanWidth mu={50} sigma={10} maxN={100} initialN={5} xLabel="標本平均" />
        </Figure>
      </Section>

      <Section title="有限母集団修正">
        <p>
          ここまでは、母集団がとても大きい（または同じ人を選び直してよい）と考えてきました。母集団の大きさ N が有限で、
          同じ人を 2 度選ばない（<strong>非復元抽出</strong>）ときは、標本平均の分散が少し小さくなります。
        </p>
        <MathBlock caption="大きさ N の母集団から n 個を非復元抽出したときの標本平均の分散">{'V(\\bar{X}) = \\frac{N - n}{N - 1} \\cdot \\frac{\\sigma^2}{n}'}</MathBlock>
        <p>
          <M>{'(N - n)/(N - 1)'}</M> を<strong>有限母集団修正</strong>といいます。全員を調べる（n = N）と 0 になり、標本平均は母平均そのものになって
          ばらつきません。逆に、母集団に比べて標本がずっと小さければほぼ 1 で、修正は無視できます。
        </p>
        <Figure caption="母集団1000人から抜きとる人数を変えると、修正の係数がどう変わるか">
          <FpcPlot />
        </Figure>
        <Example>
          <p>
            N = 500 人の学年から n = 50 人を非復元抽出します。修正の係数は <M>{'(500 - 50)/(500 - 1) = 450/499 \\approx 0.902'}</M>。
            標本平均の分散は <M>{'\\sigma^2/n'}</M> の約 0.902 倍、標準誤差は <M>{'\\sqrt{0.902} \\approx 0.950'}</M> 倍になります。
          </p>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>「不偏推定量なら、いつも真の値に一致する」→ 一致するのは<strong>平均すると</strong>。1 回ごとの推定値はぶれます。</li>
            <li>「n で割る分散はまちがい」→ データの散らばりを記述するだけなら n で割ってもよい。母分散を<strong>推定する</strong>ときに不偏になるのが n − 1 です。</li>
            <li>
              「不偏分散 <M>{'s^2'}</M> のルート s は σ の不偏推定量」→ 実は s は平均的に σ より少し小さく、不偏ではありません（2級ではそれでも s を使います）。
            </li>
            <li>有限母集団修正は (N − n)/(N − 1)。分母が N ではなく N − 1 である点、標準誤差にはそのルートがかかる点に注意。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              <M>{'X_1, X_2, X_3'}</M> の組み合わせ（<M>{'(X_1 + 2X_2)/3'}</M> など）が不偏かどうか、どれが最も有効（分散が小さい）かを選ぶ問題。
              期待値は「係数の合計 × μ」、分散は「係数の2乗の合計 × σ²」で計算する。
            </li>
            <li>n で割る分散の期待値が (n−1)σ²/n になることを使う問題。</li>
            <li>非復元抽出の標本平均の分散・標準誤差を、有限母集団修正を使って求める問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
