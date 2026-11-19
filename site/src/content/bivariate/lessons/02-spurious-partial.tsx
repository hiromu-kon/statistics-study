import { Link } from 'react-router-dom'
import { Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import { correlation } from '../../../lib/stats'
import type { LessonMeta } from '../../../types'
import { CausalDiagram } from '../figures/CausalDiagram'
import { CorrMatrix } from '../figures/CorrMatrix'
import { ageGroups, gradeGroups, residualsOn } from '../figures/data'
import { Scatter } from '../figures/Scatter'
import { StratifiedPlot } from '../figures/StratifiedPlot'

export const meta: LessonMeta = {
  id: 'bivariate-spurious-partial',
  chapter: 'bivariate',
  order: 2,
  title: '層別・みかけの相関・偏相関',
  summary: '第3の変数のせいで生まれる「みかけの相関」を、層別した散布図と偏相関係数で見抜く方法です。',
  minutes: 30,
  keywords: ['層別した散布図', '相関行列', 'みかけの相関（擬相関）', '偏相関係数'],
}

const heights = gradeGroups.flatMap((g) => g.xs)
const scores = gradeGroups.flatMap((g) => g.ys)
const grades = gradeGroups.flatMap((g) => g.xs.map(() => g.grade))
const heightResid = residualsOn(heights, grades)
const scoreResid = residualsOn(scores, grades)
const gradeMatrix = [
  [1, correlation(heights, scores), correlation(heights, grades)],
  [correlation(scores, heights), 1, correlation(scores, grades)],
  [correlation(grades, heights), correlation(grades, scores), 1],
]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          2つの量に相関があっても、<strong>別の第3の量が両方に影響しているだけ</strong>のことがあります。これを<strong>みかけの相関（擬相関）</strong>といいます。
          グループに分けて見る<strong>層別</strong>や、第3の量の影響を取り除いた<strong>偏相関係数</strong>で確かめます。
        </p>
      </Point>

      <Section title="アイスが売れると水の事故が増える？">
        <p>
          ある町で毎日の「アイスの売上」と「水の事故の件数」を記録すると、はっきりした正の相関があったとします（架空の例）。
          では、アイスの販売をやめれば事故は減るでしょうか。
        </p>
        <Figure caption="気温が高い日は、アイスもよく売れるし、泳ぐ人も増えて事故も増える。アイスと事故の間に直接の因果がなくても相関が出る">
          <CausalDiagram z="気温" x="アイスの売上" y="水の事故の件数" />
        </Figure>
        <p>
          そうはならないでしょう。両方とも「<strong>気温</strong>」が高い日に増えるので、アイスと事故がいっしょに増えて見えるだけです。
          このように、第3の変数のせいで生まれる相関を<strong>みかけの相関</strong>（<strong>擬相関</strong>、ぎそうかん）といいます。
          「疑似相関」と書かれることもあります。
        </p>
      </Section>

      <Section title="層別：グループに分けて見る">
        <p>
          小学校の2年生・4年生・6年生、合わせて24人の「身長」と「計算テストの点」を調べました（架空のデータ）。全体で見ると、背の高い子ほど点が高いように見えます。
        </p>
        <Figure caption="まず「全体で見る」で右上がりの直線を確認し、次に「学年ごとに見る」に切りかえる。色ごとの3本の直線がほぼ水平になり、学年の中では身長と点数にほとんど関係がないことがわかる">
          <StratifiedPlot groups={gradeGroups} xLabel="身長（cm）" yLabel="計算テスト（点）" />
        </Figure>
        <p>
          学年が上がると身長も伸び、計算の力も伸びます。全体の相関（r ≈ 0.70）は「学年」が生んだものでした。
          このように、第3の変数でデータをグループ（層）に分けて見ることを<strong>層別</strong>といい、色分けした散布図を<strong>層別した散布図</strong>といいます。
        </p>
        <Example title="関係が逆転することもある">
          <p>
            30代・50代・70代の「1週間の運動時間」と「血圧」を調べたとします（架空のデータ）。全体では「運動する人ほど血圧が高い」ように見えますが、
            年代ごとに見ると、どの年代でも<strong>運動する人ほど血圧が低い</strong>という逆の関係になっています。
          </p>
          <StratifiedPlot groups={ageGroups} xLabel="1週間の運動時間（時間）" yLabel="血圧（mmHg）" />
          <p className="small">
            見るところ：「全体で見る」の直線は右上がり、「グループごとに見る」の3本の直線はどれも右下がり。全体の r は約 0.51、年代ごとの r はどれも約 −0.79 です。
          </p>
          <p>
            年齢が上がると血圧が上がりやすく、このデータでは年齢の高い人ほど運動時間も長い、という設定です。年代を無視すると、年齢の影響が混ざって見かけの関係が逆向きになります。
          </p>
        </Example>
      </Section>

      <Section title="相関行列：たくさんの相関を1つの表に">
        <p>
          変数が3つ以上あるときは、2つずつの組み合わせの相関係数を表にまとめます。これを<strong>相関行列</strong>といいます。アイスの例を数にすると、たとえば次のようになります（架空の値）。
        </p>
        <CorrMatrix
          labels={['アイス x', '事故 y', '気温 z']}
          matrix={[
            [1, 0.6, 0.8],
            [0.6, 1, 0.75],
            [0.8, 0.75, 1],
          ]}
          caption="相関行列（色が濃いほど相関が強い）"
        />
        <ul>
          <li>行と列が交わるところが、その2つの変数の相関係数です。たとえば「アイス」の行と「事故」の列は 0.60。</li>
          <li>対角線（自分自身との相関）は必ず 1 です。</li>
          <li>「x と y」と「y と x」の相関は同じなので、表は対角線をはさんで対称になります。片側だけ書くこともあります。</li>
        </ul>
      </Section>

      <Section title="偏相関係数：第3の変数の影響を取り除いた相関">
        <p>
          「気温が同じ日どうしで比べたら、アイスと事故に相関は残るか？」を1つの数にしたのが<strong>偏相関係数</strong>（へんそうかんけいすう）です。z の影響を取り除いた x と y の相関、という意味で
          <M>{'r_{xy \\cdot z}'}</M> と書きます（右下の「xy・z」は「x と y の相関。ただし z の影響を除く」と読みます）。
          式に出てくるのは、相関行列にある3つの相関係数 <M>{'r_{xy}'}</M>（x と y）、<M>{'r_{xz}'}</M>（x と z）、<M>{'r_{yz}'}</M>（y と z）だけです。
        </p>
        <MathBlock caption="z の影響を取り除いた、x と y の相関（3つの相関係数だけで計算できる）">
          {'r_{xy\\cdot z} = \\frac{r_{xy} - r_{xz}\\,r_{yz}}{\\sqrt{1 - r_{xz}^2}\\,\\sqrt{1 - r_{yz}^2}}'}
        </MathBlock>
        <Example title="アイスと事故の偏相関を計算する">
          <Steps>
            <li>
              分子：<M>{'r_{xy} - r_{xz}\\,r_{yz} = 0.6 - 0.8 \\times 0.75 = 0.6 - 0.6 = 0'}</M>
            </li>
            <li>
              分母：<M>{'\\sqrt{1 - 0.64}\\,\\sqrt{1 - 0.5625} = 0.6 \\times 0.661 \\approx 0.397'}</M>
            </li>
            <li>
              偏相関係数：<M>{'0 \\div 0.397 = 0'}</M>
            </li>
          </Steps>
          <p>気温の影響を取り除くと、アイスと事故の相関は 0 になりました。0.6 の相関は、すべて気温を通したものだったと考えられます。</p>
        </Example>
        <Intuition title="分子の意味：「気温を通した分」を引いている">
          <p>
            <M>{'r_{xz}\\,r_{yz}'}</M> は「x と z の関係」と「z と y の関係」を掛けたもので、<strong>z を通して生まれる相関の大きさ</strong>の目安です。
            見えている相関 <M>{'r_{xy}'}</M> からそれを引いた残りが、z では説明できない x と y の関係です。分母は、目盛りを −1〜1 にそろえるための調整です。
          </p>
        </Intuition>
        <p>
          偏相関係数は「x から z で説明できる部分を取り除いた残り」と「y から z で説明できる部分を取り除いた残り」の相関と同じです。
          「z で説明できる部分」とは、z から直線で予測できる分のことで、取り除いた残りは<Link to="/lessons/bivariate-simple-regression">回帰直線のレッスン</Link>で学ぶ「残差」にあたります。
          学年のデータでこれを確かめてみます。
        </p>
        <CorrMatrix labels={['身長', '計算の点', '学年']} matrix={gradeMatrix} caption="学年のデータの相関行列" />
        <Example title="学年の影響を取り除いた、身長と点数の偏相関">
          <p>
            相関行列から <M>{'r_{xy} = 0.70'}</M>（身長と点数）、<M>{'r_{xz} = 0.91'}</M>（身長と学年）、<M>{'r_{yz} = 0.77'}</M>（点数と学年）を読みとります。
          </p>
          <Steps>
            <li>
              分子：<M>{'0.70 - 0.91 \\times 0.77 = 0.70 - 0.70 \\approx 0'}</M>
            </li>
            <li>分子がほぼ 0 なので、分母が何であっても偏相関係数はほぼ 0（丸めずに計算すると約 −0.02）</li>
          </Steps>
          <p>下の図は、実際に「残り」どうしの散布図を描いたものです。同じくほぼ 0 になります。</p>
        </Example>
        <Figure caption="身長・点数それぞれから「学年で説明できる部分」を取り除いた残りの散布図。全体では 0.70 あった相関が、ほぼ 0 になる">
          <Scatter xs={heightResid} ys={scoreResid} xLabel="身長の残り（cm）" yLabel="点数の残り（点）" meanLines showR />
        </Figure>
      </Section>

      <Section title="相関と因果は違う">
        <p>相関があることは、「x が原因で y が変わる」（因果関係）ことを意味しません。相関が出る理由には、たとえば次のようなものがあります。</p>
        <ul>
          <li>
            <strong>第3の変数</strong>が両方に影響している（気温とアイス・事故、学年と身長・点数）
          </li>
          <li>
            <strong>原因と結果が逆</strong>：「病院に行く回数が多い人ほど体調が悪い」のは、病院のせいではなく、体調が悪いから病院に行く
          </li>
          <li>
            <strong>偶然</strong>：データが少ないと、関係のないものどうしでもたまたま相関が出ることがある
          </li>
        </ul>
        <p>
          因果関係を確かめるには、条件をそろえた実験などのデータの集め方が大切です（<Link to="/lessons/collection-observational-experimental">「観察研究と実験研究」のレッスン</Link>で扱います）。
          なお、偏相関係数で第3の変数の影響を取り除いても、それだけで因果関係が示せるわけではありません（ほかにも調べていない変数があるかもしれないため）。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>相関係数が大きいから因果関係がある → 第3の変数・逆の因果・偶然を疑います。</li>
            <li>全体の相関とグループ内の相関は同じ向き → 層別すると消えたり、逆転したりすることがあります。</li>
            <li>
              偏相関係数は <M>{'r_{xy}'}</M> より必ず小さい → 計算例のように 0 になることも、符号が逆になることも、逆に大きくなることもあります。
            </li>
            <li>
              偏相関の式の分母を <M>{'(1 - r_{xz}^2)(1 - r_{yz}^2)'}</M> のまま使う → <strong>ルートをとる</strong>のを忘れないようにします。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>相関行列を読んで、3つの相関係数から偏相関係数を計算する問題。</li>
            <li>層別した散布図を見て、「全体の相関」と「グループ内の相関」について正しい記述を選ぶ問題。</li>
            <li>「〜と〜に相関があるので、〜が原因である」のような記述の誤りを見抜く問題（みかけの相関・因果との区別）。</li>
            <li>
              色分けした散布図を見て、記述を選ぶ問題では「全体の傾き」と「色ごとの傾き」を<strong>別々に</strong>読みます。2つが食い違っていたら、層（グループ）を表す変数がみかけの相関を生んでいるサインです。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
