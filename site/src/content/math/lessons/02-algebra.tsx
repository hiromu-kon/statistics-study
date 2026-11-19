import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DistributiveArea, EquationTapes, ZScoreLines } from '../figures/AlgebraFigures'

export const meta: LessonMeta = {
  id: 'math-algebra',
  chapter: 'math',
  order: 2,
  title: '文字式と方程式',
  summary: '文字を使う意味、代入、分配法則、一次方程式、そして標準化の式を「x について解く」式の変形を練習します。',
  minutes: 30,
  keywords: ['文字式', '代入', '一次方程式', '移項'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          文字（<M>{'x'}</M> や <M>{'\\mu'}</M>）は、<strong>まだ決まっていない数・いろいろな数が入る「入れ物」</strong>です。
          方程式は天秤のようなもので、<strong>両側に同じことをすれば、つり合い（=）はくずれません</strong>。
        </p>
      </Point>

      <Section title="なぜ文字を使うのか">
        <p>
          1個120円のりんごを買うとき、3個なら <M>{'120 \\times 3'}</M> 円、5個なら <M>{'120 \\times 5'}</M> 円……と毎回書くのは大変です。
          個数を <M>{'x'}</M> とすれば、「代金は <M>{'120x'}</M> 円」の1つで、何個のときにも使える式になります。
        </p>
        <p>
          統計の公式も同じで、「平均 <M>{'\\mu'}</M>（ミュー）」「標準偏差 <M>{'\\sigma'}</M>（シグマ）」のように、
          どんなデータにも当てはまるように文字で書いてあります。ギリシャ文字は「読み方のちがう文字」にすぎません。
        </p>
        <DataTable
          head={['意味', '文字式の書き方', 'ルール']}
          rows={[
            ['x × 3', <M key="a">{'3x'}</M>, '× は書かない。数字を前に'],
            ['1 × x', <M key="b">{'x'}</M>, '1 は書かない'],
            ['x × x', <M key="c">{'x^2'}</M>, '同じ文字のかけ算は2乗'],
            ['a ÷ 4', <M key="d">{'\\frac{a}{4}'}</M>, '÷ は分数で書く'],
            ['(x − μ) ÷ σ', <M key="e">{'\\frac{x-\\mu}{\\sigma}'}</M>, '分子のかたまりは横線の上にまとめる'],
          ]}
          caption="文字式の書き方のルール"
        />
      </Section>

      <Section title="代入：文字に数を入れる">
        <p>
          文字に具体的な数を入れることを<strong>代入</strong>といいます。<M>{'x = 3'}</M> のとき <M>{'2x + 5 = 2 \\times 3 + 5 = 11'}</M>。
        </p>
        <Example title="負の数を代入するときは、かっこをつける">
          <p>
            <M>{'x = -3'}</M> のとき、<M>{'x^2 = (-3)^2 = (-3) \\times (-3) = 9'}</M>。
            かっこをつけずに <M>{'-3^2'}</M> と書くと「<M>{'3^2'}</M> にマイナスをつけたもの」で <M>{'-9'}</M> になってしまいます。
          </p>
        </Example>
        <Example title="統計の式に代入してみる">
          <p>
            テストの平均が <M>{'\\mu = 60'}</M> 点、標準偏差が <M>{'\\sigma = 5'}</M> 点のとき、70点の人の「標準化した値」は
          </p>
          <MathBlock>{'z = \\frac{x - \\mu}{\\sigma} = \\frac{70 - 60}{5} = \\frac{10}{5} = 2'}</MathBlock>
          <p>「平均より標準偏差2つ分だけ上」という意味です。</p>
        </Example>
      </Section>

      <Section title="分配法則とかっこのはずし方">
        <p>
          <M>{'a(b + c) = ab + ac'}</M> を<strong>分配法則</strong>といいます。かっこの外の数を、中の<strong>全部</strong>にかけます。
          長方形の面積で見ると、「全体の面積 = 左の面積 + 右の面積」というだけのことです。
        </p>
        <Figure caption="a, b, c を動かしてみよう。大きい長方形の面積は、2つの長方形の面積の合計">
          <DistributiveArea />
        </Figure>
        <MathNote title="マイナスがつくとき">
          <p>
            <M>{'-(x - 3) = -x + 3'}</M>。かっこの前のマイナスは「−1 をかける」ことなので、中の符号が<strong>全部</strong>反対になります。
          </p>
          <p>
            同じ文字の項はまとめられます（<strong>同類項</strong>）：<M>{'3x + 2x = 5x'}</M>、<M>{'5x - 10 - 2x = 3x - 10'}</M>。
          </p>
        </MathNote>
      </Section>

      <Section title="一次方程式を解く">
        <p>
          <M>{'2x + 3 = 11'}</M> のように、<M>{'x'}</M> がいくつのときに成り立つかを考える式を<strong>方程式</strong>といいます。
          左辺と右辺を、長さの同じ2本のテープだと思って解いてみましょう。
        </p>
        <Figure caption="「次へ」を押して、テープの長さを同じに保ったまま x だけを残していく">
          <EquationTapes />
        </Figure>
        <p>
          手順2の「両辺から3を引く」は、式の上では「<strong>+3 を右辺に移して −3 にする</strong>」ように見えます。これを<strong>移項</strong>といいます。
        </p>
        <Example title="かっこがある方程式">
          <p>
            <M>{'3(x - 2) = x + 8'}</M> を解きます。
          </p>
          <Steps>
            <li>
              かっこをはずす：<M>{'3x - 6 = x + 8'}</M>
            </li>
            <li>
              x を左、数を右へ移項（符号が変わる）：<M>{'3x - x = 8 + 6'}</M>
            </li>
            <li>
              まとめる：<M>{'2x = 14'}</M>
            </li>
            <li>
              両辺を2で割る：<M>{'x = 7'}</M>
            </li>
          </Steps>
          <p>
            確かめ：左辺 <M>{'3 \\times (7 - 2) = 15'}</M>、右辺 <M>{'7 + 8 = 15'}</M>。一致するので正しい。
          </p>
        </Example>
      </Section>

      <Section title="式の変形：「x について解く」">
        <p>
          統計では、数ではなく<strong>文字のままの式</strong>を変形する場面がよくあります。やることは方程式と同じで、
          「知りたい文字だけが左に残るように、両辺に同じことをする」です。
        </p>
        <Example title="標準化の式を x について解く">
          <MathBlock caption="z がわかっているとき、元の値 x を知りたい">{'z = \\frac{x - \\mu}{\\sigma}'}</MathBlock>
          <Steps>
            <li>
              両辺に <M>{'\\sigma'}</M> をかけて分数をなくす：<M>{'z\\sigma = x - \\mu'}</M>
            </li>
            <li>
              <M>{'-\\mu'}</M> を左へ移項：<M>{'z\\sigma + \\mu = x'}</M>
            </li>
            <li>
              左右を入れかえて読みやすくする：<M>{'x = \\mu + z\\sigma'}</M>
            </li>
          </Steps>
          <p>
            「平均から、標準偏差 z 個分だけ進んだ位置」と読めます。たとえば <M>{'\\mu = 60,\\ \\sigma = 10,\\ z = 1.5'}</M> なら <M>{'x = 60 + 15 = 75'}</M>。
          </p>
        </Example>
        <Figure caption="点数・平均・標準偏差を動かしてみよう。上の数直線（元の点数）と下の数直線（z）の同じ位置が対応する">
          <ZScoreLines />
        </Figure>
        <Example title="ほかにもよく出る変形">
          <ul>
            <li>
              データの合計を <M>{'T'}</M> とすると、平均の式は <M>{'\\bar{x} = \\frac{T}{n}'}</M>。T について解くと <M>{'T = n\\bar{x}'}</M>（「平均 × 人数 = 合計」）
            </li>
            <li>
              直線の式 <M>{'y = a + bx'}</M> → x について解くと <M>{'x = \\frac{y - a}{b}'}</M>（「y をこの値にするには x をいくつにすればよいか」）
            </li>
          </ul>
        </Example>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="式の変形は「やったことを逆にたどる」">
          <p>
            <M>{'z = \\frac{x - \\mu}{\\sigma}'}</M> は、x に「① μ を引く → ② σ で割る」をした結果が z だ、という式です。
            z から x に戻るには、逆の順番で逆の操作をします：「② σ をかける → ① μ を足す」。だから <M>{'x = z\\sigma + \\mu'}</M> です。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>移項するときに符号を変え忘れる → 「+3」を反対側に移したら「−3」。</li>
            <li>
              <M>{'-(x - 3)'}</M> を <M>{'-x - 3'}</M> にしてしまう → 中の<strong>全部</strong>の符号を変えて <M>{'-x + 3'}</M>。
            </li>
            <li>
              負の数をかっこなしで代入する → <M>{'(-3)^2 = 9'}</M>、<M>{'-3^2 = -9'}</M>。
            </li>
            <li>
              両辺の<strong>一部だけ</strong>にかける → <M>{'z = \\frac{x - \\mu}{\\sigma}'}</M> に σ をかけるときは、左辺の z 全体にかけて <M>{'z\\sigma'}</M>。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計でどう使うか">
        <ExamTip title="統計でどう使うか">
          <ul>
            <li>
              <strong>標準化</strong>（1変数データ・正規分布）：<M>{'z = \\frac{x - \\mu}{\\sigma}'}</M> で計算し、正規分布表を使ったあと
              <M>{'x = \\mu + z\\sigma'}</M> で元の単位に戻す。
            </li>
            <li>
              <strong>偏差値</strong>：<M>{'T = 50 + 10z'}</M>。偏差値から元の点数を求めるには、z について解いてから x に戻す。
            </li>
            <li>
              <strong>変数の変換</strong>：「全員の点数を a 倍して b を足す」＝ <M>{'y = ax + b'}</M>。平均も同じ式で変わる。
            </li>
            <li>
              <strong>回帰直線</strong>：<M>{'y = a + bx'}</M> に x を代入して予測値を求める。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
