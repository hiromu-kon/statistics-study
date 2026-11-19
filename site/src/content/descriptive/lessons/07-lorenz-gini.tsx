import { Compare, DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { ChiSquareDice, KurtosisCompare, LorenzInteractive, LorenzPlot, SkewnessGallery } from '../figures/InequalityFigures'

export const meta: LessonMeta = {
  id: 'descriptive-lorenz-gini',
  chapter: 'descriptive',
  order: 7,
  title: 'ローレンツ曲線・ジニ係数と分布の形の指標',
  summary: '所得の偏り（不平等さ）を図と数で表す方法と、分布の形（歪み・とがり・一様からのずれ）を数で表す方法を学びます。',
  minutes: 30,
  keywords: ['ローレンツ曲線', 'ジニ係数', '歪度', '尖度', 'カイ二乗値（一様な頻度からのずれ）'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>ローレンツ曲線</strong>は「下から◯%の人が、全体の所得の何%を持っているか」を描いた曲線で、まっすぐな対角線から離れるほど不平等です。
          その離れ具合を 0〜1 の数にしたのが<strong>ジニ係数</strong>。0 なら全員が同じ、1 に近いほど一部の人に集中しています。
        </p>
      </Point>

      <Section title="ローレンツ曲線の描き方">
        <p>5つの世帯の年収（万円）が 100, 200, 300, 400, 1000 だったとします。合計は 2000 万円です。</p>
        <Steps>
          <li>所得の<strong>低い順</strong>に並べる。</li>
          <li>世帯数の累積比率（横軸）と、所得の累積比率（縦軸）を計算する。</li>
          <li>(0, 0) から点を順につなぐ。最後は必ず (1, 1) に着く。</li>
        </Steps>
        <DataTable
          head={['世帯', '年収', '所得の割合', '世帯の累積比率（横）', '所得の累積比率（縦）']}
          rows={[
            ['1番目', '100', '0.05', '0.2', '0.05'],
            ['2番目', '200', '0.10', '0.4', '0.15'],
            ['3番目', '300', '0.15', '0.6', '0.30'],
            ['4番目', '400', '0.20', '0.8', '0.50'],
            ['5番目', '1000', '0.50', '1.0', '1.00'],
          ]}
          caption="ローレンツ曲線の点をつくる表"
        />
        <Figure caption="塗った部分（対角線とローレンツ曲線の間）が広いほど不平等">
          <LorenzPlot curves={[{ values: [100, 200, 300, 400, 1000], color: 'c1', label: '5世帯の例' }]} />
        </Figure>
        <p>
          たとえば横 0.4・縦 0.15 の点は、「所得の低いほうから40%の世帯が、全体の15%の所得しか持っていない」ことを表します。
          もし全員が同じ所得なら、40%の世帯がちょうど40%を持つので、点はすべて<strong>対角線（完全平等線）</strong>の上に乗ります。
        </p>
      </Section>

      <Section title="ジニ係数＝面積の2倍">
        <MathBlock caption="ジニ係数：対角線とローレンツ曲線にはさまれた面積 S を2倍する">{'G = 2S'}</MathBlock>
        <p>
          対角線の下の三角形の面積は <M>{'\\frac{1}{2}'}</M> なので、2倍すると「全員平等なら 0、最大で 1」という目盛りになります。
          実際の計算では、ローレンツ曲線の下の面積 <M>{'L'}</M>（台形の面積の合計）を求めて、次のようにするのが楽です。
        </p>
        <MathBlock caption="S は 1/2 − L なので、G = 1 − 2L">{'G = 2\\left(\\frac{1}{2} - L\\right) = 1 - 2L'}</MathBlock>
        <Example title="5世帯の例で計算する">
          <p>
            横幅はどれも 0.2。台形の面積は「（左の高さ + 右の高さ）× 幅 ÷ 2」なので、
          </p>
          <MathBlock>{'L = \\frac{0.2}{2}\\{(0 + 0.05) + (0.05 + 0.15) + (0.15 + 0.30) + (0.30 + 0.50) + (0.50 + 1)\\} = 0.1 \\times 3.0 = 0.3'}</MathBlock>
          <p>
            よって <M>{'G = 1 - 2 \\times 0.3 = 0.4'}</M> です。
          </p>
        </Example>
        <Figure caption="格差を大きくすると、曲線が右下にふくらみ、ジニ係数が大きくなる">
          <LorenzInteractive />
        </Figure>
        <Intuition title="どんなときに 0、どんなときに 1 に近い？">
          <p>
            全員の所得が同じなら曲線は対角線と重なり、G = 0。1人がすべての所得を持つと、曲線は右下の角に張りつき、G は 1 に近づきます
            （n 世帯なら最大は <M>{'(n-1)/n'}</M>。5世帯なら 0.8）。全員の所得を2倍にしても割合は変わらないので、ジニ係数は変わりません。
          </p>
        </Intuition>
      </Section>

      <Section title="2つのローレンツ曲線を比べる">
        <Figure caption="対角線から遠い B のほうが不平等。ジニ係数も B のほうが大きい">
          <LorenzPlot
            curves={[
              { values: [10, 15, 20, 25, 30], color: 'c3', label: 'A' },
              { values: [4, 8, 12, 20, 56], color: 'c2', label: 'B' },
            ]}
          />
        </Figure>
        <p>
          B では横 0.8 の高さが 0.44。「下から80%の世帯で44%」ということは、<strong>上位20%の世帯が残りの56%</strong>を持っています。
          縦軸は「下からの累積」なので、上位の割合は「1 − 高さ」で読むことに注意しましょう。
        </p>
      </Section>

      <Section title="分布の形を数で表す：歪度と尖度">
        <p>ヒストグラムの形（歪み・とがり）も、数で表すことができます。どちらも標準化した値 <M>{'z_i = (x_i - \\bar{x})/s'}</M> を使います。</p>
        <MathBlock caption="歪度：z の3乗の平均。左右の非対称さを表す">{'\\frac{1}{n}\\sum_{i=1}^{n} z_i^3'}</MathBlock>
        <Figure caption="歪度の符号と分布の形。右に裾が長いと正、左に裾が長いと負">
          <SkewnessGallery />
        </Figure>
        <Intuition title="なぜ3乗？">
          <p>
            3乗はマイナスの符号が残り、しかも大きな値ほど強く効きます。右の裾に平均から遠い値があると、その大きなプラスが勝って歪度は正になります。
            左右対称なら、プラスとマイナスが打ち消しあって 0 になります。
          </p>
        </Intuition>
        <MathBlock caption="尖度：z の4乗の平均。とがり具合と裾の重さを表す">{'\\frac{1}{n}\\sum_{i=1}^{n} z_i^4 - 3'}</MathBlock>
        <p>
          4乗の平均は正規分布でちょうど 3 になるので、3 を引いて「正規分布なら 0」となるように定義することが多いです（3 を引かない定義もあるので、問題文の定義を確認しましょう）。
          尖度が正なら正規分布より<strong>とがっていて裾が重い</strong>（極端な値が出やすい）、負なら<strong>平らで裾が軽い</strong>分布です。
        </p>
        <Figure caption="平均0・標準偏差1をそろえた3つの分布。尖度（3を引いた値）は、とがった分布が 3、正規分布が 0、一様分布が −1.2">
          <KurtosisCompare />
        </Figure>
      </Section>

      <Section title="一様な頻度からのずれ：カイ二乗値">
        <p>
          サイコロを60回ふると、どの目も「10回くらい」出るはずです。実際の回数が10回からどれくらいずれているかを1つの数にまとめたのが<strong>カイ二乗値</strong>です。
        </p>
        <MathBlock caption="観測度数 O と、一様なら出るはずの期待度数 E のずれを足し合わせる">{'\\chi^2 = \\sum \\frac{(O - E)^2}{E}'}</MathBlock>
        <Compare>
          <ChiSquareDice title="サイコロ A" observed={[8, 12, 9, 11, 6, 14]} />
          <ChiSquareDice title="サイコロ B" observed={[2, 5, 8, 10, 15, 20]} />
        </Compare>
        <Example title="サイコロ A の計算">
          <p>
            期待度数は <M>{'60 \\div 6 = 10'}</M>。ずれは −2, +2, −1, +1, −4, +4。2乗して 10 で割って足すと
          </p>
          <MathBlock>{'\\frac{4 + 4 + 1 + 1 + 16 + 16}{10} = 4.2'}</MathBlock>
          <p>B は 21.8 で、A よりずっと「一様からずれている」ことが数でわかります。</p>
        </Example>
        <Note title="この値はあとで検定に使う">
          <p>
            カイ二乗値がどれくらい大きければ「サイコロがゆがんでいる」と判断できるかは、「仮説検定」の章の適合度検定で学びます。ここでは「ずれが大きいほど大きくなる数」と理解できれば十分です。
          </p>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>ローレンツ曲線は所得の高い順に並べる → <strong>低い順</strong>に並べます。だから曲線は対角線より下にきます。</li>
            <li>ジニ係数は対角線とローレンツ曲線の間の面積そのもの → 面積の<strong>2倍</strong>です。</li>
            <li>縦軸の 0.44 を「上位20%の取り分」と読む → 縦軸は下からの累積。上位20%の取り分は 1 − 0.44 = 0.56 です。</li>
            <li>歪度が正なら「左に裾が長い」→ 正なら<strong>右</strong>に裾が長い（平均 &gt; 中央値になりやすい）。</li>
            <li>カイ二乗値で (O − E)² を E で割り忘れる → 期待度数で割ってから足します。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>所得や資産の分布のローレンツ曲線を読み取る問題（下位◯%の取り分、上位◯%の取り分）。</li>
            <li>簡単なデータからジニ係数を台形の面積で計算する問題、2つの曲線のジニ係数の大小を比べる問題。</li>
            <li>ヒストグラムの形と歪度の符号（正・負・0）の対応を選ぶ問題。</li>
            <li>各カテゴリの度数から、一様な頻度との違いを表すカイ二乗値を計算する問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
