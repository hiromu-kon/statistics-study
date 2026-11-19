import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { CommonDenominatorTape, FractionAreaModel, FractionTape, PercentTape } from '../figures/FractionFigures'

export const meta: LessonMeta = {
  id: 'math-fraction-percent',
  chapter: 'math',
  order: 1,
  title: '分数・小数・割合',
  summary: '分数の計算、小数や百分率との言いかえ、四捨五入と ≒、「全体のうちどれだけか」を表す割合と増加率を、テープ図と面積図で復習します。',
  minutes: 30,
  keywords: ['分数の計算', '割合', '百分率'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          分数・小数・百分率（%）は、<strong>同じ量の別の書き方</strong>です。<M>{'\\frac{3}{4}'}</M> も 0.75 も 75% も、
          「全体を1としたときの、4つに分けたうちの3つ分」を表しています。統計では「全体のうちどれだけか」を毎回これで表します。
        </p>
      </Point>

      <Section title="分数は「全体を何等分したうちのいくつ分」">
        <p>
          分数 <M>{'\\frac{3}{4}'}</M> の下の数（<strong>分母</strong>）は「全体を何等分するか」、上の数（<strong>分子</strong>）は「そのうちいくつ分か」です。
          テープで見てみましょう。
        </p>
        <Figure caption="分母と分子を動かしてみよう。塗った長さが、分数・小数・%のどれで表しても同じ量になる">
          <FractionTape interactive />
        </Figure>
        <p>
          分母を2倍、分子も2倍にすると（<M>{'\\frac{3}{4} \\to \\frac{6}{8}'}</M>）、テープの塗った長さは変わりません。
          逆に、分母と分子を同じ数で割って小さくすることを<strong>約分</strong>といいます（<M>{'\\frac{6}{8} = \\frac{3}{4}'}</M>）。
        </p>
      </Section>

      <Section title="分数のたし算・ひき算：分母をそろえてから">
        <p>
          <M>{'\\frac{1}{2} + \\frac{1}{3}'}</M> は、分けた大きさ（分母）がちがうので、そのままでは足せません。
          同じ大きさのマスに切り直して（<strong>通分</strong>して）から足します。
        </p>
        <Steps>
          <li>
            2と3のどちらでも割り切れる数（6）を分母にする：<M>{'\\frac{1}{2} = \\frac{3}{6}, \\quad \\frac{1}{3} = \\frac{2}{6}'}</M>
          </li>
          <li>
            分子どうしを足す：<M>{'\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}'}</M>
          </li>
        </Steps>
        <CommonDenominatorTape />
        <Pitfall title="よくある間違い">
          <p>
            <M>{'\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}'}</M> のように、分子どうし・分母どうしを足すのは間違いです。
            <M>{'\\frac{2}{5} = 0.4'}</M> は <M>{'\\frac{1}{2} = 0.5'}</M> より小さく、「足したのに減る」おかしな答えになります。
          </p>
        </Pitfall>
      </Section>

      <Section title="分数のかけ算・わり算">
        <p>
          かけ算は<strong>分子どうし・分母どうしをかける</strong>だけです。なぜそうなるのかは、面積で見るとわかります。
          「横 <M>{'\\frac{2}{3}'}</M>、縦 <M>{'\\frac{3}{4}'}</M> の長方形の面積」が <M>{'\\frac{2}{3} \\times \\frac{3}{4}'}</M> です。
        </p>
        <Figure caption="面積1の正方形のうち、重なった紫の部分が答え。マスの数を数えると「分子×分子 / 分母×分母」になる">
          <FractionAreaModel />
        </Figure>
        <MathBlock caption="かけ算：分子どうし・分母どうし">{'\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}'}</MathBlock>
        <p>
          わり算は「<strong>割る数をひっくり返してかける</strong>」です。<M>{'\\frac{3}{4} \\div \\frac{1}{2}'}</M> は
          「<M>{'\\frac{3}{4}'}</M> の中に <M>{'\\frac{1}{2}'}</M> がいくつ入るか」という意味で、答えは <M>{'\\frac{3}{4} \\times \\frac{2}{1} = \\frac{3}{2} = 1.5'}</M>（1.5個分）です。
        </p>
        <p>
          なぜひっくり返すのかは、整数で考えるとわかります。「1 の中に <M>{'\\frac{1}{2}'}</M> は2つ入る」ので、<M>{'\\div \\frac{1}{2}'}</M> は「2倍する」と同じです。
          つまり <M>{'\\div \\frac{1}{2}'}</M> と <M>{'\\times \\frac{2}{1}'}</M> は同じ計算になります。
        </p>
        <MathBlock caption="わり算：割る数の上下を入れかえてかける">{'\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}'}</MathBlock>
      </Section>

      <Section title="分数と小数の変換">
        <p>
          分数 → 小数は「分子 ÷ 分母」を電卓で計算するだけです。よく出る値は覚えておくと速くなります。
        </p>
        <DataTable
          head={['分数', '小数', '百分率']}
          rows={[
            [<M key="a">{'\\frac{1}{2}'}</M>, '0.5', '50%'],
            [<M key="b">{'\\frac{1}{4}'}</M>, '0.25', '25%'],
            [<M key="c">{'\\frac{1}{5}'}</M>, '0.2', '20%'],
            [<M key="d">{'\\frac{1}{8}'}</M>, '0.125', '12.5%'],
            [<M key="e">{'\\frac{1}{10}'}</M>, '0.1', '10%'],
            [<M key="f">{'\\frac{1}{3}'}</M>, '0.333…（割り切れない）', '約33.3%'],
          ]}
          caption="よく使う分数・小数・百分率"
        />
        <p>
          小数 → 分数は、0.1 が <M>{'\\frac{1}{10}'}</M>、0.01 が <M>{'\\frac{1}{100}'}</M> であることを使います。
          例：<M>{'0.35 = \\frac{35}{100} = \\frac{7}{20}'}</M>（分母と分子を5で割って約分）。
        </p>
      </Section>

      <Section title="四捨五入と「≒」">
        <p>
          <M>{'\\frac{1}{3} = 0.333\\ldots'}</M> のように割り切れない数は、どこかで切って<strong>四捨五入</strong>します。
          四捨五入は「切る位置のすぐ右の数字が 0〜4 なら切り捨て、5〜9 なら切り上げ」です。
        </p>
        <Example title="四捨五入の例">
          <ul>
            <li>0.3333… を小数第2位までにする → 第3位の「3」を見て切り捨て → 0.33</li>
            <li>2.5826… を小数第2位までにする → 第3位の「2」を見て切り捨て → 2.58</li>
            <li>0.6667… を小数第2位までにする → 第3位の「6」を見て切り上げ → 0.67</li>
          </ul>
        </Example>
        <p>
          四捨五入した値は、もとの値と「ほぼ等しい」だけで、ぴったり同じではありません。そこで = の代わりに
          <strong>≒</strong> や <M>{'\\approx'}</M>（どちらも「ニアリーイコール」「ほぼ等しい」と読む）を使います。
          例：<M>{'\\frac{1}{3} \\approx 0.33'}</M>。日本の教科書では ≒、外国の本や数式では <M>{'\\approx'}</M> が多く、意味は同じです。このサイトでも両方出てきます。
        </p>
        <MathNote title="四捨五入は最後に1回だけ">
          <p>
            途中の計算で四捨五入をくり返すと、答えが少しずつずれていきます。電卓では途中の値をなるべくそのまま使い、
            <strong>最後の答えだけを四捨五入</strong>しましょう。2級の選択肢は近い値が並ぶことがあるので、このずれで迷うことがあります。
          </p>
        </MathNote>
      </Section>

      <Section title="割合と百分率">
        <p>
          <strong>割合</strong>は「もとにする量を1としたとき、比べる量がどれくらいか」です。割合を100倍したものが<strong>百分率（%）</strong>です。
        </p>
        <p>
          割合を <M>{'p'}</M>、比べる量を <M>{'A'}</M>、もとにする量を <M>{'B'}</M> と書くと、次の2つの式になります。
          2つ目は、1つ目の式の左右（<strong>両辺</strong>）に B をかけたものです（式の変形は次のレッスン「文字式と方程式」で練習します）。
        </p>
        <MathBlock caption="割合 p = 比べる量 A ÷ もとにする量 B">{'p = \\frac{A}{B}'}</MathBlock>
        <MathBlock caption="比べる量 A = もとにする量 B × 割合 p（「B の 30%」は B × 0.3）">{'A = B \\times p'}</MathBlock>
        <MathNote title="% を小数に直す：100 で割る">
          <p>計算するときは、% をいったん小数に直してからかけます。「% の数字 ÷ 100」です。</p>
          <ul>
            <li>30% = 0.3　　5% = 0.05　　0.5% = 0.005　　120% = 1.2</li>
            <li>5% を 0.5 としてしまう間違いが多いので注意（0.5 は 50%）。</li>
          </ul>
          <p>
            電卓の % キーは、機種によって動き方が違うことがあります。迷ったら % キーを使わず、「× 0.05」のように小数でかけるのが確実です。
          </p>
        </MathNote>
        <Figure caption="全体の人数と割合を動かしてみよう。オレンジの長さが「比べる量」。「200人の30%」は 200 × 0.3 = 60人">
          <PercentTape />
        </Figure>
        <Example title="3つの向きの問題">
          <ul>
            <li>200人の30%は何人？ → <M>{'200 \\times 0.3 = 60'}</M> 人</li>
            <li>60人は200人の何%？ → <M>{'60 \\div 200 = 0.3'}</M> → 30%</li>
            <li>ある人数の30%が60人。全体は？ → <M>{'60 \\div 0.3 = 200'}</M> 人</li>
          </ul>
        </Example>
        <Example title="割合の割合">
          <p>
            ある学校の生徒のうち40%が運動部で、運動部のうち25%がサッカー部です。サッカー部は全体の何%でしょう。
            「割合の割合」はかけ算です：<M>{'0.4 \\times 0.25 = 0.1'}</M> → <strong>10%</strong>。
            これは確率の「かけ算のルール」（<Link to="/lessons/probability-conditional">条件付き確率と独立</Link>で出てくる乗法定理）とまったく同じ形です。
          </p>
        </Example>
        <Example title="何%増えたか（増加率）">
          <p>
            お客さんが 80人 から 100人 に増えました。増えた分は 20人。「何%増えたか」は、<strong>前の値（80人）をもとにする量</strong>にして割ります。
          </p>
          <MathBlock caption="増加率 = 増えた分 ÷ 前の値">{'\\frac{100 - 80}{80} = \\frac{20}{80} = 0.25'}</MathBlock>
          <p>
            答えは <strong>25%増</strong>。逆に 100人 から 80人 に減ったときは <M>{'\\frac{80 - 100}{100} = -0.2'}</M> で <strong>20%減</strong>（マイナスは減ったという意味）。
            同じ「20人の差」でも、もとにする量が違うので%が変わります。時系列の章の
            <Link to="/lessons/collection-growth-rate">成長率</Link>は、この計算そのものです。
          </p>
        </Example>
      </Section>

      <Section title="比">
        <p>
          <strong>比</strong> 3 : 2 は「3と2の割合で」という意味です。全体を 3 + 2 = 5 等分して、3つ分と2つ分に分けます。
          つまり全体の <M>{'\\frac{3}{5}'}</M> と <M>{'\\frac{2}{5}'}</M> です。
        </p>
        <Example>
          <p>
            100個のくじを 当たり : はずれ = 1 : 4 で作るとき、当たりは <M>{'100 \\times \\frac{1}{1+4} = 20'}</M> 個。
            「当たりの割合」は <M>{'\\frac{1}{5} = 0.2'}</M> で、これがくじを1回引いて当たる確率です。
          </p>
        </Example>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="「全体を1とする」がすべての出発点">
          <p>
            割合も確率も相対度数も、「全体を1（=100%）としたとき、その部分はどれだけか」を表す数です。
            だから<strong>0から1のあいだ</strong>の数になり、全部を足すと<strong>ちょうど1</strong>になります。
            計算の答えが1を超えたら、どこかで間違えていないか疑いましょう。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>分数のたし算で、分子どうし・分母どうしを足してしまう → 通分してから分子だけを足す。</li>
            <li>
              「20%増えたあと20%減ると元に戻る」→ 戻りません。100 → 120 → <M>{'120 \\times 0.8 = 96'}</M>。
              減るときの「もとにする量」が120に変わっているからです。
            </li>
            <li>
              「%」と「%ポイント」を混同する → 支持率が 20% から 30% になったら「10<strong>ポイント</strong>増えた」。
              「10%増えた」と言うと 20% × 1.1 = 22% の意味になってしまいます。
            </li>
            <li>何が「もとにする量」なのかを確認しない → 「AのうちBの割合」では、Aが分母です。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計でどう使うか">
        <ExamTip title="統計でどう使うか">
          <ul>
            <li>
              <strong>相対度数</strong>（<Link to="/lessons/descriptive-histogram">度数分布表とヒストグラム</Link>）：その階級の人数 ÷ 全体の人数。「40人中12人」なら <M>{'12 \\div 40 = 0.3'}</M>。
            </li>
            <li>
              <strong>確率</strong>（<Link to="/lessons/probability-basics">事象と確率</Link>）：「全部で6通りのうち2通り」なら <M>{'\\frac{2}{6} = \\frac{1}{3}'}</M>。確率のかけ算は分数のかけ算そのもの。
            </li>
            <li>
              <strong>標本比率</strong>（<Link to="/lessons/estimation-ci-proportion-variance">母比率の区間推定</Link>など）：調べた人の中での割合。「500人中200人が賛成」なら <M>{'\\hat{p} = 200 \\div 500 = 0.4'}</M>。
              <M>{'\\hat{p}'}</M> は「ピーハット」と読み、「データから計算した p」という意味の記号です。
            </li>
            <li>
              <strong>成長率</strong>（<Link to="/lessons/collection-growth-rate">時系列</Link>）：「前年より何%増えたか」を割合で計算する。増減を続けたときの変化はかけ算で考える。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
