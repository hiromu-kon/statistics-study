import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { SigmaBars, SigmaConstant } from '../figures/SigmaFigures'

export const meta: LessonMeta = {
  id: 'math-sigma',
  chapter: 'math',
  order: 4,
  title: 'Σ記号と添字',
  summary: 'x₁, x₂ … の添字と、「全部足す」を表す Σ（シグマ）記号の読み方・性質を練習し、平均や分散の式を自分で読めるようにします。',
  minutes: 30,
  keywords: ['Σ（シグマ）', '添字', '平均の式'],
}

const DATA = [6, 8, 5, 9, 7]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <M>{'\\sum'}</M>（シグマ）は「<strong>足し算をまとめて書く記号</strong>」です。
          <M>{'\\sum_{i=1}^{n} x_i'}</M> は「<M>{'x_1'}</M> から <M>{'x_n'}</M> までを全部足す」という意味で、
          統計の式の半分以上はこの記号で書かれています。読めるようになれば、式がこわくなくなります。
        </p>
      </Point>

      <Section title="添字は「何番目か」を表す背番号">
        <p>5人の小テスト（10点満点）の点数を、1人目から順に並べます。</p>
        <DataTable
          head={['何番目か（添字 i）', '1', '2', '3', '4', '5']}
          rows={[['点数 x_i', 'x₁ = 6', 'x₂ = 8', 'x₃ = 5', 'x₄ = 9', 'x₅ = 7']]}
          caption="添字つきの文字でデータを表す"
        />
        <p>
          <M>{'x_3'}</M> は「3番目の人の点数」で、値は5です。右下の小さい数（<strong>添字</strong>）は<strong>値ではなく順番</strong>です。
          何番目かを一般的に「i 番目」と書いて <M>{'x_i'}</M>、最後の番号（データの個数）を <M>{'n'}</M> と書きます。この例では <M>{'n = 5'}</M>。
        </p>
      </Section>

      <Section title="Σ の読み方">
        <MathBlock caption="下の i = 1 がスタート、上の n がゴール、右の x_i が足すもの">{'\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n'}</MathBlock>
        <Steps>
          <li>
            下の <M>{'i = 1'}</M>：「i を 1 から始める」
          </li>
          <li>
            右の <M>{'x_i'}</M>：「i 番目の値を足す」
          </li>
          <li>
            i を 1, 2, 3, … と1つずつ増やしながら足していき、上の <M>{'n'}</M> になったら終わり
          </li>
        </Steps>
        <Figure caption="Σ の上の数を動かしてみよう。色のついた棒だけが足される">
          <SigmaBars data={DATA} />
        </Figure>
        <Example title="Σ を展開する練習">
          <ul>
            <li>
              <M>{'\\sum_{i=1}^{3} i = 1 + 2 + 3 = 6'}</M>
            </li>
            <li>
              <M>{'\\sum_{i=1}^{4} i^2 = 1 + 4 + 9 + 16 = 30'}</M>
            </li>
            <li>
              <M>{'\\sum_{i=1}^{3} (2i + 1) = 3 + 5 + 7 = 15'}</M>（i に 1, 2, 3 を順に代入してから足す）
            </li>
          </ul>
        </Example>
        <MathNote title="省略した書き方">
          <p>
            「全部のデータを足す」のが明らかなときは、<M>{'\\sum x_i'}</M> や <M>{'\\sum x'}</M> のように上下を省略することがあります。
            また、i は仮の名前なので <M>{'\\sum_{j=1}^{n} x_j'}</M> と書いても意味は同じです。
          </p>
        </MathNote>
      </Section>

      <Section title="Σ の3つの性質">
        <p>Σ は「たし算」なので、たし算のルールがそのまま使えます。展開して確かめるのがいちばんの近道です。</p>
        <MathBlock caption="① 全部に同じ数 c がかかっていたら、Σ の外に出せる">{'\\sum_{i=1}^{n} c\\,x_i = c \\sum_{i=1}^{n} x_i'}</MathBlock>
        <p>
          <M>{'2x_1 + 2x_2 + 2x_3 = 2(x_1 + x_2 + x_3)'}</M>（分配法則）と同じことです。
        </p>
        <MathBlock caption="② たし算は、別々に Σ してから足してよい">{'\\sum_{i=1}^{n} (x_i + y_i) = \\sum_{i=1}^{n} x_i + \\sum_{i=1}^{n} y_i'}</MathBlock>
        <p>
          <M>{'(x_1 + y_1) + (x_2 + y_2) = (x_1 + x_2) + (y_1 + y_2)'}</M>。足す順番を並べかえただけです。
        </p>
        <MathBlock caption="③ 同じ数 c を n 回足すと n × c">{'\\sum_{i=1}^{n} c = n\\,c'}</MathBlock>
        <Figure caption="n と c を動かしてみよう。i が式に出てこないので、毎回同じ c を足すことになる">
          <SigmaConstant />
        </Figure>
        <Pitfall title="かけ算と2乗は分けられない">
          <p>
            <M>{'\\sum x_i^2'}</M>（2乗してから足す）と <M>{'\\left(\\sum x_i\\right)^2'}</M>（足してから2乗する）は<strong>別物</strong>です。
            データ 1, 2, 3 なら、前者は <M>{'1 + 4 + 9 = 14'}</M>、後者は <M>{'6^2 = 36'}</M>。
            同じように <M>{'\\sum x_i y_i \\ne \\left(\\sum x_i\\right)\\left(\\sum y_i\\right)'}</M> です。
          </p>
        </Pitfall>
      </Section>

      <Section title="平均と分散の式を Σ で読む">
        <p>上の5人のデータ（6, 8, 5, 9, 7）で、統計の式を1つずつ読んでいきます。</p>
        <MathBlock caption="平均：全部足して、個数 n で割る">{'\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i = \\frac{6 + 8 + 5 + 9 + 7}{5} = \\frac{35}{5} = 7'}</MathBlock>
        <p>
          両辺に n をかけると <M>{'\\sum x_i = n\\bar{x}'}</M>（合計 = 個数 × 平均）。この形もよく使います。
        </p>
        <Example title="偏差の合計が0になることを Σ で確かめる">
          <MathBlock>{'\\sum_{i=1}^{n} (x_i - \\bar{x}) = \\sum_{i=1}^{n} x_i - \\sum_{i=1}^{n} \\bar{x} = n\\bar{x} - n\\bar{x} = 0'}</MathBlock>
          <p>
            性質②で2つに分け、<M>{'\\bar{x}'}</M> は i によらない定数なので性質③で <M>{'n\\bar{x}'}</M> になります。
            データで確かめると、偏差は −1, +1, −2, +2, 0 で合計0です。
          </p>
        </Example>
        <MathBlock caption="分散（n で割る場合）：偏差を2乗して足し、n で割る">{'s^2 = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2'}</MathBlock>
        <DataTable
          head={['i', 'x_i', 'x_i − 7', '(x_i − 7)²', 'x_i²']}
          rows={[
            ['1', '6', '−1', '1', '36'],
            ['2', '8', '+1', '1', '64'],
            ['3', '5', '−2', '4', '25'],
            ['4', '9', '+2', '4', '81'],
            ['5', '7', '0', '0', '49'],
            [<strong key="s">Σ</strong>, '35', '0', <strong key="t">10</strong>, '255'],
          ]}
          caption="Σ は表の列を縦に合計すること"
        />
        <p>
          <M>{'\\sum (x_i - \\bar{x})^2 = 10'}</M> なので、n で割る分散は <M>{'10 \\div 5 = 2'}</M>、n − 1 で割る分散は <M>{'10 \\div 4 = 2.5'}</M> です。
        </p>
        <Example title="「2乗の平均 − 平均の2乗」を Σ で確かめる">
          <MathBlock>{'\\sum (x_i - \\bar{x})^2 = \\sum x_i^2 - n\\bar{x}^2 = 255 - 5 \\times 7^2 = 255 - 245 = 10'}</MathBlock>
          <p>
            表の右端の列（<M>{'\\sum x_i^2 = 255'}</M>）を使っても同じ10になります。
            データの合計 <M>{'\\sum x_i'}</M> と2乗の合計 <M>{'\\sum x_i^2'}</M> だけが問題文に書かれていることがあるので、この形はとても便利です。
          </p>
        </Example>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="Σ は「表の列を縦に合計する」こと">
          <p>
            Σ の右側に書かれた式で表の列を1本作り、それを縦に合計する——これが Σ のすべてです。
            式が複雑に見えても、「まず1行分を計算し、それを全部の行で足す」と分解すれば読めます。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'\\sum x_i^2'}</M> と <M>{'\\left(\\sum x_i\\right)^2'}</M> を同じだと思う → 2乗してから足すか、足してから2乗するかで答えが変わる。
            </li>
            <li>
              <M>{'\\sum_{i=1}^{n} c = c'}</M> としてしまう → 同じ数を n 回足すので <M>{'nc'}</M>。
            </li>
            <li>添字の数字を値だと思う → <M>{'x_3'}</M> の 3 は「3番目」という意味。</li>
            <li>
              <M>{'\\sum (x_i + 2) = \\sum x_i + 2'}</M> としてしまう → 2 も n 回足されるので <M>{'\\sum x_i + 2n'}</M>。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計でどう使うか">
        <ExamTip title="統計でどう使うか">
          <ul>
            <li>
              <strong>平均・分散</strong>：<M>{'\\bar{x} = \\frac{1}{n}\\sum x_i'}</M>、<M>{'s^2 = \\frac{1}{n-1}\\sum (x_i - \\bar{x})^2'}</M>。
            </li>
            <li>
              <strong>共分散・相関係数・回帰直線</strong>（2変数データ）：<M>{'\\sum (x_i - \\bar{x})(y_i - \\bar{y})'}</M> の形。1行ずつかけてから足す。
            </li>
            <li>
              <strong>期待値</strong>（確率変数）：<M>{'E[X] = \\sum x\\,P(X = x)'}</M>。「値 × 確率」を全部足す。
            </li>
            <li>
              <strong>カイ二乗統計量</strong>（適合度検定）：<M>{'\\sum \\frac{(O - E)^2}{E}'}</M>。表のマスごとに計算して合計する。
            </li>
            <li>データそのものではなく <M>{'\\sum x_i'}</M> と <M>{'\\sum x_i^2'}</M> の値だけから平均や分散を求める計算は、このサイトの問題でも練習します。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
