import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BinomialPoissonCompare, PoissonExplorer, PoissonSum } from '../figures/PoissonFigures'

export const meta: LessonMeta = {
  id: 'distributions-poisson',
  chapter: 'distributions',
  order: 2,
  title: 'ポアソン分布',
  summary: '「一定の時間や広さの中で、まれな出来事が何回起こるか」を表す分布です。平均と分散が等しいのが特徴です。',
  minutes: 30,
  keywords: ['ポアソン分布', '稀な事象', '平均と分散が等しい'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>ポアソン分布</strong> <M>{'Po(\\lambda)'}</M>（「ピー・オー・ラムダ」と読む。Po は Poisson の略）は、「1時間に来る客の数」のように、<strong>決まった時間（や広さ）の中で出来事が起こる回数</strong>
          を表す分布です。パラメータ（分布の形を決める数）は平均の回数 <M>{'\\lambda'}</M>（ラムダ。ギリシャ文字の l）だけで、<strong>期待値も分散も <M>{'\\lambda'}</M></strong> になります。
        </p>
      </Point>

      <Section title="どんな場面で使う分布か">
        <ul>
          <li>あるお店に1時間に来る客の数（平均3人）</li>
          <li>ある交差点で1か月に起こる交通事故の件数（平均0.8件）</li>
          <li>1ページあたりの誤字の数、1日にかかってくる間違い電話の数</li>
          <li>布1平方メートルあたりのキズの数（時間ではなく「広さ」の例）</li>
        </ul>
        <p>
          共通点は、<strong>「起こるチャンスはとても多いが、1回1回の起こる確率はとても小さい（稀な事象）」</strong>こと、そして
          出来事がバラバラに（おたがい無関係に）起こることです。二項分布のように「全部で何回試したか（n）」がはっきりしないのも特徴です。
        </p>
      </Section>

      <Section title="具体例：1時間に平均3人来るお店">
        <p>
          客の数を <M>X</M> とすると <M>{'X \\sim Po(3)'}</M>。1時間に来る人数ごとの確率は次のとおりです。
        </p>
        <DataTable
          head={['人数 k', '0', '1', '2', '3', '4', '5', '6']}
          rows={[['確率', '0.0498', '0.1494', '0.2240', '0.2240', '0.1680', '0.1008', '0.0504']]}
          caption="Po(3) の確率（7人以上は合計で約0.034）"
        />
        <p>
          表を見ると、平均の3人前後（2人・3人）がいちばん起こりやすく、そこから離れるほど確率が小さくなっています。
          平均3人のお店でも、0人の時間が約5%、6人の時間も約5%あります。この確率をどう計算するかを次で見ます。
        </p>
      </Section>

      <Section title="定義・式">
        <MathBlock caption="平均 λ 回起こる出来事が、ちょうど k 回起こる確率（k = 0, 1, 2, …）">{'P(X = k) = \\frac{\\lambda^{k} e^{-\\lambda}}{k!}'}</MathBlock>
        <DataTable
          head={['記号', '意味']}
          rows={[
            [<M key="l">{'\\lambda'}</M>, '決まった時間（広さ）あたりの平均の回数。これだけで分布の形が決まる'],
            [<M key="e">e</M>, 'ネイピア数。約 2.718 の決まった数（円周率 π のような「名前のついた数」）'],
            [<M key="em">{'e^{-\\lambda}'}</M>, 'e を λ 回かけたもので 1 を割った数（例：e⁻³ = 1 ÷ e³ ≒ 1 ÷ 20.09 ≒ 0.0498）'],
            [<M key="k">{'k!'}</M>, 'k の階乗（k × (k−1) × … × 1）。0! = 1 と約束する'],
          ]}
        />
        <p className="small muted">
          <M>e</M> と指数のマイナスは<Link to="/lessons/math-function-graph-area">関数とグラフのレッスン</Link>、<M>{'k!'}</M> は
          <Link to="/lessons/math-counting">場合の数のレッスン</Link>で復習できます。試験で使えるのは普通の電卓だけで <M>{'e^{x}'}</M> は計算できないので、
          <M>{'e^{-3} = 0.0498'}</M> のような値は問題文で与えられることが多いです。
        </p>
        <MathBlock caption="ポアソン分布の期待値と分散">{'E(X) = \\lambda, \\qquad V(X) = \\lambda'}</MathBlock>
        <Example title="式に入れてみる（λ = 3 のお店）">
          <p>1人も来ない確率（k = 0）：</p>
          <Steps>
            <li>
              <M>{'\\lambda^0 = 3^0 = 1'}</M>（どんな数も0乗は1）、<M>{'0! = 1'}</M>
            </li>
            <li>
              <M>{'P(X=0) = \\dfrac{1 \\times e^{-3}}{1} = e^{-3} \\approx 0.0498'}</M>
            </li>
          </Steps>
          <p>ちょうど2人来る確率（k = 2）：</p>
          <Steps>
            <li>
              <M>{'\\lambda^2 = 3^2 = 9'}</M>、<M>{'2! = 2 \\times 1 = 2'}</M>
            </li>
            <li>
              <M>{'P(X=2) = \\dfrac{9 \\times e^{-3}}{2} = 4.5 \\times e^{-3} = 4.5 \\times 0.0498 \\approx 0.2240'}</M>
            </li>
          </Steps>
        </Example>
        <Figure caption="λ を動かしてみよう。見るところは山の位置（点線の平均 λ のあたり）と形。λ が小さいと 0 や 1 に偏った形、λ が大きくなると山が右へ動き、左右対称に近いつりがね形になる。広がり（標準偏差 √λ）も大きくなる">
          <PoissonExplorer />
        </Figure>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="二項分布の「n がとても大きく、p がとても小さい」極端な形">
          <p>
            1時間を3600秒に分けて、「各1秒に客が来るかどうか」を考えると、二項分布 <M>{'B(3600, 3/3600)'}</M> に近くなります。
            さらに細かく分けていく（<M>n</M> を大きく、<M>p</M> を小さく、ただし平均 <M>{'np = \\lambda'}</M> は一定）と、二項分布はポアソン分布に近づきます。
          </p>
          <MathBlock caption="n が大きく p が小さいとき（np = λ を一定に保つ）">{'B(n, p) \\approx Po(np)'}</MathBlock>
          <p>
            二項分布の分散 <M>{'np(1-p)'}</M> で <M>p</M> がほぼ0なら <M>{'1 - p \\approx 1'}</M> なので、分散 ≒ <M>{'np = \\lambda'}</M>。
            「平均と分散が等しい」のはここから来ています。
          </p>
        </Intuition>
        <Figure caption="同じ平均 λ のまま n を大きくすると、二項分布（青）がポアソン分布（オレンジ）にほぼ重なっていく">
          <BinomialPoissonCompare />
        </Figure>
        <Example title="近似を使う計算">
          <p>
            不良品の割合が 0.2% の製品を1000個調べたとき、不良品が2個以上ある確率。二項分布 <M>{'B(1000, 0.002)'}</M> のままだと大変なので、
            <M>{'\\lambda = 1000 \\times 0.002 = 2'}</M> のポアソン分布で近似します。
          </p>
          <Steps>
            <li>
              「2個以上」は「0個でも1個でもない」こと：<M>{'P(X \\ge 2) = 1 - P(X=0) - P(X=1)'}</M>
            </li>
            <li>
              <M>{'P(X=0) = \\dfrac{2^0 e^{-2}}{0!} = e^{-2}'}</M>、<M>{'P(X=1) = \\dfrac{2^1 e^{-2}}{1!} = 2e^{-2}'}</M>
            </li>
            <li>
              <M>{'1 - e^{-2} - 2e^{-2} = 1 - 3e^{-2} = 1 - 3 \\times 0.1353 \\approx 0.5940'}</M>（<M>{'e^{-2} \\approx 0.1353'}</M>）
            </li>
          </Steps>
          <p>二項分布で正確に計算すると 0.5943 で、ほとんど同じです。「n がどれくらい大きく、p がどれくらい小さければよいか」の目安は本によって違うので、数字で覚えるより「n が大きく p が小さい」と覚えておきましょう。</p>
        </Example>
      </Section>

      <Section title="再生性：ポアソン分布どうしの和もポアソン分布">
        <p>
          独立な <M>{'X \\sim Po(\\lambda_1)'}</M> と <M>{'Y \\sim Po(\\lambda_2)'}</M> を足すと、<M>{'X + Y \\sim Po(\\lambda_1 + \\lambda_2)'}</M> になります。
          同じ種類の分布の和が同じ種類の分布になる性質を<strong>再生性</strong>といいます。
        </p>
        <Steps>
          <li>窓口Aに来る客：1時間に平均1.5人</li>
          <li>窓口Bに来る客：1時間に平均2.5人（Aとは無関係）</li>
          <li>合わせた客の数：1時間に平均4人のポアソン分布 <M>{'Po(4)'}</M></li>
        </Steps>
        <p>
          「時間を2倍にする」のも同じ考え方です。1時間に平均1.5件なら、2時間では <M>{'Po(3)'}</M> になります。
        </p>
        <Figure caption="見るところは、棒と点がずれていないか。X と Y の組合せを全部足して計算した X + Y の確率（緑の棒）と、Po(λ₁ + λ₂) の確率（オレンジの点）が、どの λ でもぴったり重なる">
          <PoissonSum />
        </Figure>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              分散を <M>{'\\lambda^2'}</M> とする → ポアソン分布の分散は <M>{'\\lambda'}</M>。標準偏差が <M>{'\\sqrt{\\lambda}'}</M> です。
            </li>
            <li>
              <M>{'0! = 0'}</M> とする → <M>{'0! = 1'}</M> と約束します。だから <M>{'P(X=0) = e^{-\\lambda}'}</M>。
            </li>
            <li>
              時間の長さを変えたのに λ をそのまま使う → 「1時間に平均2件」を「30分」で考えるなら <M>{'\\lambda = 1'}</M> です。
            </li>
            <li>どんな「回数」でもポアソン分布だと思う → 平均と分散が大きく違うデータ（ばらつきが大きすぎる・小さすぎる）には合いません。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              「1日に平均◯件」から、ちょうど k 件・k 件以上の確率を計算させる問題（<M>{'e^{-\\lambda}'}</M> の値が与えられる）。
            </li>
            <li>二項分布をポアソン分布で近似してよい条件（n が大きく p が小さい）や、近似したときの λ を問う問題。</li>
            <li>「平均と分散が等しい」という性質から、どの分布が当てはまるかを選ぶ問題。</li>
            <li>独立なポアソン分布の和（再生性）を使う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
