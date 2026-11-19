import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { SigmaBars, SigmaConstant } from '../figures/SigmaFigures'

export const meta: LessonMeta = {
  id: 'math-sigma',
  chapter: 'math',
  order: 4,
  title: 'Σ記号と添字',
  summary: 'x₁, x₂ … の添字と、「全部足す」を表す Σ（シグマ）記号の読み方・性質を練習し、平均・分散・度数分布表の平均の式を自分で読めるようにします。',
  minutes: 35,
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
          平均・分散・相関係数など、統計の式にはこの記号がとてもよく出てきます。読めるようになれば、式がこわくなくなります。
        </p>
      </Point>

      <Section title="添字は「何番目か」を表す背番号">
        <p>5人の小テスト（10点満点）の点数を、1人目から順に並べます。</p>
        <DataTable
          head={['何番目か（添字 i）', '1', '2', '3', '4', '5']}
          rows={[
            [
              <span key="h">
                点数 <M>{'x_i'}</M>
              </span>,
              <M key="1">{'x_1 = 6'}</M>,
              <M key="2">{'x_2 = 8'}</M>,
              <M key="3">{'x_3 = 5'}</M>,
              <M key="4">{'x_4 = 9'}</M>,
              <M key="5">{'x_5 = 7'}</M>,
            ],
          ]}
          caption="添字つきの文字でデータを表す"
        />
        <p>
          <M>{'x_3'}</M> は「3番目の人の点数」で、値は5です。右下の小さい数（<strong>添字</strong>）は<strong>値ではなく順番</strong>です。
          何番目かを一般的に「i 番目」と書いて <M>{'x_i'}</M>、最後の番号（データの個数）を <M>{'n'}</M> と書きます。この例では <M>{'n = 5'}</M>。
        </p>
        <p>
          読み方は、<M>{'x_1'}</M> が「エックス イチ」、<M>{'x_i'}</M> が「エックス アイ」です。
          i は「番号を入れる空欄」のようなもので、<M>{'i = 3'}</M> を入れれば <M>{'x_3'}</M>（3番目の値）になります。
        </p>
      </Section>

      <Section title="Σ の読み方">
        <p>
          <M>{'\\Sigma'}</M> はギリシャ文字の大文字で「シグマ」と読みます。標準偏差を表す小文字の <M>{'\\sigma'}</M>（これもシグマ）とは<strong>別の記号</strong>です。
          大文字の Σ は「足す」、小文字の σ は「ばらつきの大きさ」と区別しましょう。
        </p>
        <MathBlock caption="下の i = 1 がスタート、上の n がゴール、右の x_i が足すもの。「⋯」は同じように続けるという意味">{'\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n'}</MathBlock>
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
          <p>Σ の右側は <M>{'x_i'}</M> でなくてもかまいません。i そのものや、i を使った式でも、「i に 1, 2, 3, … を入れて足す」ことは同じです。</p>
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
            どこからどこまで足すか文脈でわかるとき（たいていは「データを全部」）は、<M>{'\\sum x_i'}</M> や <M>{'\\sum x'}</M> のように上下を省略することがあります。
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
        <p>
          上の5人のデータ（6, 8, 5, 9, 7）で、統計の式を1つずつ読んでいきます。平均は <M>{'\\bar{x}'}</M>（エックスバー）と書きます。
          x の上の横棒が「平均」の印です（<Link to="/lessons/descriptive-center">代表値</Link>のレッスンでも扱います）。
        </p>
        <MathBlock caption="平均：全部足して、個数 n で割る">{'\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i = \\frac{6 + 8 + 5 + 9 + 7}{5} = \\frac{35}{5} = 7'}</MathBlock>
        <p>
          <M>{'\\frac{1}{n} \\sum x_i'}</M> は「Σ で全部足してから、<M>{'\\frac{1}{n}'}</M> をかける（= n で割る）」と読みます。
          両辺に n をかけると <M>{'\\sum x_i = n\\bar{x}'}</M>（合計 = 個数 × 平均）。この形もよく使います。
        </p>
        <p>
          各データから平均を引いた値 <M>{'x_i - \\bar{x}'}</M> を<strong>偏差</strong>（平均からのずれ）といいます。
        </p>
        <Example title="偏差の合計が0になることを Σ で確かめる">
          <MathBlock>{'\\sum_{i=1}^{n} (x_i - \\bar{x}) = \\sum_{i=1}^{n} x_i - \\sum_{i=1}^{n} \\bar{x} = n\\bar{x} - n\\bar{x} = 0'}</MathBlock>
          <p>
            性質②で2つに分け、<M>{'\\bar{x}'}</M> は i によらない定数なので性質③で <M>{'n\\bar{x}'}</M> になります。
            データで確かめると、偏差は −1, +1, −2, +2, 0 で合計0です。
          </p>
        </Example>
        <p>
          <strong>分散</strong>は「偏差を2乗して足し、データの個数で割った」もので、散らばりの大きさを表します（<Link to="/lessons/descriptive-spread">分散と標準偏差</Link>）。
          割る数が n のものと n − 1 のものの2種類があります。
        </p>
        <MathBlock caption="n で割る分散">{'\\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2'}</MathBlock>
        <MathBlock caption="n − 1 で割る分散（不偏分散）">{'\\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2'}</MathBlock>
        <MathNote title="記号と呼び方は本によって違う">
          <p>
            統計検定2級の出題範囲表では、分散は「n − 1 で割る」ものとされています
            （<a href="https://www.toukei-kentei.jp/hubfs/files/grade_range/grade2_hani_20181214.pdf" target="_blank" rel="noreferrer">2級 出題範囲表</a>）。
            ただ、教科書によって n で割るものを「標本分散」と呼んだり、<M>{'s^2'}</M> という記号がどちらを指すかが違ったりします。
            問題文に式や「n − 1 で割る」などの説明があれば、それに従いましょう。なぜ n − 1 で割るのかは<Link to="/lessons/estimation-point">点推定</Link>で扱います。
          </p>
        </MathNote>
        <DataTable
          head={[
            'i',
            <M key="a">{'x_i'}</M>,
            <M key="b">{'x_i - 7'}</M>,
            <M key="c">{'(x_i - 7)^2'}</M>,
            <M key="d">{'x_i^2'}</M>,
          ]}
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
        <Example title="偏差の2乗の合計を、2乗の合計から求める">
          <p>
            次の式が成り立ちます。偏差を1つずつ計算しなくても、<M>{'\\sum x_i^2'}</M>（2乗の合計）と <M>{'\\bar{x}'}</M> だけで求められる、という式です。
          </p>
          <MathBlock>{'\\sum_{i=1}^{n} (x_i - \\bar{x})^2 = \\sum_{i=1}^{n} x_i^2 - n\\bar{x}^2'}</MathBlock>
          <p>
            なぜ成り立つのかを1行ずつ追います。使うのは、<Link to="/lessons/math-algebra">文字式と方程式</Link>の展開
            <M>{'(x - a)^2 = x^2 - 2ax + a^2'}</M> と、Σ の3つの性質だけです。
          </p>
          <Steps>
            <li>
              かっこの中を展開する（a のところが <M>{'\\bar{x}'}</M>）：<M>{'\\sum (x_i^2 - 2\\bar{x}\\,x_i + \\bar{x}^2)'}</M>
            </li>
            <li>
              性質②で3つの Σ に分ける：<M>{'\\sum x_i^2 - \\sum 2\\bar{x}\\,x_i + \\sum \\bar{x}^2'}</M>
            </li>
            <li>
              真ん中は、<M>{'2\\bar{x}'}</M> がどの i でも同じ数なので性質①で外に出す：<M>{'2\\bar{x} \\sum x_i = 2\\bar{x} \\times n\\bar{x} = 2n\\bar{x}^2'}</M>
            </li>
            <li>
              右端は、同じ数 <M>{'\\bar{x}^2'}</M> を n 回足すので性質③で <M>{'n\\bar{x}^2'}</M>
            </li>
            <li>
              まとめる：<M>{'\\sum x_i^2 - 2n\\bar{x}^2 + n\\bar{x}^2 = \\sum x_i^2 - n\\bar{x}^2'}</M>
            </li>
          </Steps>
          <p>
            5人のデータで確かめると <M>{'255 - 5 \\times 7^2 = 255 - 245 = 10'}</M> で、表の合計と一致します。
            両辺を n で割ると「n で割る分散 = <strong>2乗の平均 − 平均の2乗</strong>」（<M>{'\\frac{255}{5} - 7^2 = 51 - 49 = 2'}</M>）になります。
            データの合計 <M>{'\\sum x_i'}</M> と2乗の合計 <M>{'\\sum x_i^2'}</M> だけが問題文に書かれていることがあるので、この形はとても便利です。
          </p>
        </Example>
      </Section>

      <Section title="度数分布表の平均を Σ で書く">
        <p>
          同じ値がくり返し出てくるデータは、「値」と「その値が何回出たか（<strong>度数</strong>）」の表にまとめることがあります。
          10家庭の子どもの人数を調べた例です。
        </p>
        <DataTable
          head={['子どもの人数 x', '0', '1', '2', '3', '合計']}
          rows={[
            ['度数 f（家庭の数）', '2', '3', '4', '1', '10'],
            ['x × f', '0', '3', '8', '3', '14'],
          ]}
          caption="値 × 度数 を足すと、データ全部の合計になる"
        />
        <p>
          「1人の家庭が3つ」は、データ 1, 1, 1 を1つずつ足すかわりに <M>{'1 \\times 3'}</M> とまとめて足しているだけです。
          値を <M>{'x_k'}</M>、その度数を <M>{'f_k'}</M> と書くと、平均は次の式になります（k も i と同じ「番号」の文字）。
        </p>
        <MathBlock caption="（値 × 度数）を全部足して、データの個数で割る">{'\\bar{x} = \\frac{1}{n} \\sum_{k} x_k f_k = \\frac{14}{10} = 1.4'}</MathBlock>
        <p>
          ここで n は家庭の数の合計（<M>{'n = \\sum f_k = 10'}</M>）で、値の種類の数（4種類）ではありません。
          <M>{'\\frac{f_k}{n}'}</M>（相対度数）を「確率」に置きかえると、確率変数の<strong>期待値</strong>の式と同じ形になります
          （<Link to="/lessons/random-variables-expectation-variance">期待値・分散・標準偏差</Link>）。
        </p>
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
              <strong>平均・分散</strong>（<Link to="/lessons/descriptive-spread">1変数データ</Link>）：<M>{'\\bar{x} = \\frac{1}{n}\\sum x_i'}</M>、<M>{'s^2 = \\frac{1}{n-1}\\sum (x_i - \\bar{x})^2'}</M>（2級の範囲表どおり n − 1 で割る形）。
            </li>
            <li>
              <strong>共分散・相関係数・回帰直線</strong>（<Link to="/lessons/bivariate-scatter-correlation">2変数データ</Link>）：<M>{'\\sum (x_i - \\bar{x})(y_i - \\bar{y})'}</M> の形。1行ずつかけてから足す。
            </li>
            <li>
              <strong>期待値</strong>（<Link to="/lessons/random-variables-expectation-variance">確率変数</Link>）：<M>{'E[X] = \\sum x\\,P(X = x)'}</M>。
              <M>{'P(X = x)'}</M> は「X が x になる確率」。X がとりうる値の全部について「値 × 確率」を足す（上の度数分布表の平均と同じ形）。
            </li>
            <li>
              <strong>カイ二乗統計量</strong>（<Link to="/lessons/testing-chi2">適合度検定</Link>）：<M>{'\\sum \\frac{(O - E)^2}{E}'}</M>（O は実際の度数、E は期待される度数）。表のマスごとに計算して合計する。
            </li>
            <li>データそのものではなく <M>{'\\sum x_i'}</M> と <M>{'\\sum x_i^2'}</M> の値だけから平均や分散を求める計算は、このサイトの問題でも練習します。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
