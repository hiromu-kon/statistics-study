import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { Arrangements, PascalTriangle, TreeDiagram } from '../figures/CountingFigures'

export const meta: LessonMeta = {
  id: 'math-counting',
  chapter: 'math',
  order: 6,
  title: '場合の数（階乗と組合せ）',
  summary: '樹形図・積の法則・階乗・順列・組合せで「何通りあるか」を数えます。「10回中3回成功する並び方」が二項分布の準備になります。',
  minutes: 35,
  keywords: ['樹形図', '階乗', '順列', '組合せ'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          確率は「起こりうる場合の数のうち、何通りが当てはまるか」で計算します。そのための<strong>数え方の道具</strong>が、
          樹形図 → 積の法則 → 階乗 → 順列 → 組合せ です。特に組合せ <M>{'{}_nC_r'}</M> は「n 回中 r 回成功する並び方の数」として二項分布に直接出てきます。
        </p>
      </Point>

      <Section title="樹形図：もれなく、重なりなく数える">
        <p>シャツが3枚（A, B, C）、ズボンが2本（1, 2）あるとき、服の組み合わせは何通りでしょう。枝分かれの図（<strong>樹形図</strong>）で全部書き出します。</p>
        <Figure caption="シャツ1枚ごとにズボンが2通りずつ。枝の先は全部で 3 × 2 = 6 通り">
          <TreeDiagram levels={[['A', 'B', 'C'], ['1', '2']]} headers={['シャツ', 'ズボン']} />
        </Figure>
      </Section>

      <Section title="積の法則">
        <p>
          樹形図を毎回書かなくても、「1つ目の選び方が m 通り、<strong>そのそれぞれに対して</strong> 2つ目が n 通り」なら、全部で <M>{'m \\times n'}</M> 通りです。これを<strong>積の法則</strong>といいます。
        </p>
        <Example>
          <ul>
            <li>
              コインを3回投げたときの表裏の出方：<M>{'2 \\times 2 \\times 2 = 2^3 = 8'}</M> 通り
            </li>
            <li>
              サイコロを2個投げたときの目の出方：<M>{'6 \\times 6 = 36'}</M> 通り
            </li>
            <li>
              コインを10回投げたときの出方：<M>{'2^{10} = 1024'}</M> 通り
            </li>
          </ul>
        </Example>
      </Section>

      <Section title="階乗：全部を1列に並べる">
        <p>
          3人（A, B, C）を1列に並べる方法は何通りでしょう。1番目は3人から選べ、2番目は残りの2人から、3番目は残りの1人です。
        </p>
        <Figure caption="1度使った人はもう選べないので、枝が 3本 → 2本 → 1本 と減っていく。3 × 2 × 1 = 6 通り">
          <TreeDiagram items={['A', 'B', 'C']} headers={['1番目', '2番目', '3番目']} />
        </Figure>
        <p>
          このように、n から 1 まで全部かけた数を n の<strong>階乗</strong>といい、<M>{'n!'}</M> と書きます（「エヌの階乗」）。
        </p>
        <MathBlock caption="n 個のものを1列に並べる方法の数">{'n! = n \\times (n-1) \\times \\cdots \\times 2 \\times 1'}</MathBlock>
        <DataTable
          head={['n', '0', '1', '2', '3', '4', '5', '6', '10']}
          rows={[['n!', '1', '1', '2', '6', '24', '120', '720', '3628800']]}
          caption="階乗はすぐに大きくなる"
        />
        <MathNote title="0! = 1 と決めている">
          <p>
            「0個のものを並べる方法は、何もしないという1通り」と考えて <M>{'0! = 1'}</M> と決めています。
            こう決めておくと、あとで出てくる組合せの式がいつでも使えて便利です。
          </p>
        </MathNote>
      </Section>

      <Section title="順列：n 個から r 個選んで並べる">
        <p>
          5人の中から委員長と副委員長を1人ずつ選ぶ方法は、委員長が5通り、副委員長が残りの4通りで <M>{'5 \\times 4 = 20'}</M> 通りです。
          このように「選んで、<strong>順番（役割）をつけて</strong>並べる」数を<strong>順列</strong>といい、<M>{'{}_nP_r'}</M> と書きます。
        </p>
        <MathBlock caption="n 個から r 個を選んで並べる方法の数（n から始めて r 個かける）">{'{}_nP_r = n \\times (n-1) \\times \\cdots \\times (n-r+1) = \\frac{n!}{(n-r)!}'}</MathBlock>
        <p>
          例：<M>{'{}_5P_2 = 5 \\times 4 = 20'}</M>、<M>{'{}_6P_3 = 6 \\times 5 \\times 4 = 120'}</M>。
        </p>
      </Section>

      <Section title="組合せ：n 個から r 個選ぶ（順番は気にしない）">
        <p>
          5人の中から掃除当番を2人選ぶ方法は何通りでしょう。今度は役割がないので、「AさんとBさん」と「BさんとAさん」は同じ選び方です。
        </p>
        <Steps>
          <li>
            まず順番をつけて選ぶと <M>{'{}_5P_2 = 20'}</M> 通り
          </li>
          <li>
            同じ2人組を、並べ方の数（<M>{'2! = 2'}</M> 通り）だけ重ねて数えている
          </li>
          <li>
            だから <M>{'20 \\div 2 = 10'}</M> 通り
          </li>
        </Steps>
        <p>
          このように「選ぶだけで、順番は区別しない」数を<strong>組合せ</strong>といい、<M>{'{}_nC_r'}</M> と書きます。
          教科書によっては <M>{'\\binom{n}{r}'}</M> とも書きます。
        </p>
        <MathBlock caption="n 個から r 個を選ぶ方法の数（順列を、選んだ r 個の並べ方 r! で割る）">{'{}_nC_r = \\frac{{}_nP_r}{r!} = \\frac{n!}{r!\\,(n-r)!}'}</MathBlock>
        <Example title="計算の例">
          <ul>
            <li>
              <M>{'{}_5C_2 = \\frac{5 \\times 4}{2 \\times 1} = 10'}</M>
            </li>
            <li>
              <M>{'{}_{10}C_3 = \\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = \\frac{720}{6} = 120'}</M>
            </li>
            <li>
              <M>{'{}_{10}C_7 = {}_{10}C_3 = 120'}</M>（7人を「選ぶ」のは、残す3人を選ぶのと同じ）
            </li>
          </ul>
        </Example>
      </Section>

      <Section title="成功・失敗の並び方を数える">
        <p>
          シュートを4回打って、ちょうど2回入る「入り方」は何通りでしょう。「何回目に入ったか」の2つを4回の中から選ぶことなので <M>{'{}_4C_2 = 6'}</M> 通りです。
        </p>
        <Figure caption="回数と成功の回数を動かしてみよう。並び方の数が組合せの数と一致する">
          <Arrangements />
        </Figure>
        <p>
          10回中3回成功する並び方は <M>{'{}_{10}C_3 = 120'}</M> 通り。全部書き出すのは大変ですが、組合せの式ならすぐに求まります。
        </p>
      </Section>

      <Section title="パスカルの三角形">
        <p>
          組合せの数を三角形に並べると、<strong>どの数も左上と右上の数の和</strong>になっています。これを<strong>パスカルの三角形</strong>といいます。
        </p>
        <Figure caption="n と r を動かしてみよう。オレンジの数 = 青い2つの数の和。n 段目の数を全部足すと 2 の n 乗">
          <PascalTriangle />
        </Figure>
        <Intuition title="なぜ左上と右上の和になるの？">
          <p>
            n 回中 r 回成功する並び方を、<strong>最後の1回</strong>で分けて考えます。最後が成功なら、残り n − 1 回で r − 1 回成功（左上の数）。
            最後が失敗なら、残り n − 1 回で r 回成功（右上の数）。この2つを合わせたものが全部です。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              順列と組合せを取り違える → 「委員長と副委員長」のように役割・順番があれば順列、「当番を2人」のように選ぶだけなら組合せ。
            </li>
            <li>
              <M>{'0! = 0'}</M> と思う → <M>{'0! = 1'}</M>。
            </li>
            <li>
              <M>{'{}_{10}C_3 = 10 \\times 3 = 30'}</M> としてしまう → 分子は 10 から3つ、分母は 3 から1まで：<M>{'\\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = 120'}</M>。
            </li>
            <li>
              「4回中2回成功」は1通りだと思う → 成功する<strong>回</strong>の選び方が <M>{'{}_4C_2 = 6'}</M> 通りある。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計でどう使うか">
        <ExamTip title="統計でどう使うか">
          <ul>
            <li>
              <strong>確率の計算</strong>：どれも同じくらい起こりやすいとき、確率 = 当てはまる場合の数 ÷ 全部の場合の数。
              例：コインを4回投げて表がちょうど2回の確率は <M>{'\\frac{{}_4C_2}{2^4} = \\frac{6}{16} = 0.375'}</M>。
            </li>
            <li>
              <strong>二項分布</strong>（確率分布）：成功確率 p の試行を n 回くり返して k 回成功する確率は
              <M>{'P(X = k) = {}_nC_k\\, p^k (1-p)^{n-k}'}</M>。<M>{'{}_nC_k'}</M> は「成功する回の選び方」、<M>{'p^k (1-p)^{n-k}'}</M> は「1つの並び方が起こる確率」。
            </li>
            <li>
              <strong>くじ引き・抜き取り検査</strong>：「10個中3個が不良品の箱から2個取り出す」ような問題で、組合せの比として確率を求める。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
