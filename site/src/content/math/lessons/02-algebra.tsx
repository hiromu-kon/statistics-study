import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DistributiveArea, EquationTapes, InequalityLine, ZScoreLines } from '../figures/AlgebraFigures'

export const meta: LessonMeta = {
  id: 'math-algebra',
  chapter: 'math',
  order: 2,
  title: '文字式と方程式',
  summary: '文字を使う意味、代入、分配法則と (x − a)² の展開、一次方程式、標準化の式を「x について解く」変形、信頼区間で使う不等式の変形を練習します。',
  minutes: 40,
  keywords: ['文字式', '代入', '展開', '一次方程式', '移項', '不等式'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          文字（<M>{'x'}</M> や <M>{'\\mu'}</M>〈ミュー〉）は、<strong>まだ決まっていない数・いろいろな数が入る「入れ物」</strong>です。
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
        <p>
          <strong>標準偏差</strong>は「データが平均からどれくらい散らばっているか」を表す数です（くわしくは
          <Link to="/lessons/descriptive-spread">分散と標準偏差</Link>）。この章では「ばらつきの大きさを表す、決まった1つの数」と思って読めば十分です。
        </p>
        <Pitfall title="σ と Σ は別の記号">
          <p>
            小文字の <M>{'\\sigma'}</M>（シグマ）は標準偏差、大文字の <M>{'\\Sigma'}</M>（これもシグマ）は「全部足す」という記号です。
            読み方は同じでも意味はまったく違います。Σ は<Link to="/lessons/math-sigma">Σ記号と添字</Link>のレッスンで練習します。
          </p>
        </Pitfall>
        <DataTable
          head={['意味', '文字式の書き方', 'ルール']}
          rows={[
            ['x × 3', <M key="a">{'3x'}</M>, '× は書かない。数字を前に'],
            ['1 × x', <M key="b">{'x'}</M>, '1 は書かない'],
            ['a × b', <M key="ab">{'ab'}</M>, '文字どうしの × も書かない'],
            ['z × σ', <M key="zs">{'z\\sigma'}</M>, 'ギリシャ文字でも同じ。zσ は「z かける σ」'],
            ['x × x', <M key="c">{'x^2'}</M>, '同じ文字を2回かけたもの。右上の2は「2乗」と読む'],
            ['a ÷ 4', <M key="d">{'\\frac{a}{4}'}</M>, '÷ は分数で書く'],
            ['(x − μ) ÷ σ', <M key="e">{'\\frac{x-\\mu}{\\sigma}'}</M>, '分子のかたまりは横線の上にまとめる'],
          ]}
          caption="文字式の書き方のルール"
        />
        <p>
          <M>{'x^2'}</M>（エックスの2乗）のような累乗は、<Link to="/lessons/math-square-root">2乗と平方根</Link>のレッスンでくわしく扱います。
          ここでは「同じ数を2回かける」とだけ覚えておけば読めます。
        </p>
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
            テストの平均が <M>{'\\mu = 60'}</M> 点、標準偏差が <M>{'\\sigma = 5'}</M> 点のとき、70点の人の「標準化した値」z は次のように計算します
            （標準化は「平均から標準偏差いくつ分はなれているか」に直すこと。くわしくは<Link to="/lessons/descriptive-standardize">標準化と変動係数</Link>）。
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
        <Example title="かっこ2つのかけ算と、(x − a)² の展開">
          <p>
            かっこどうしのかけ算は、分配法則を2回使います。左のかっこの1つずつを、右のかっこの全部にかけます。
          </p>
          <MathBlock>{'(a + b)(c + d) = ac + ad + bc + bd'}</MathBlock>
          <p>
            統計でいちばんよく使うのは、同じかっこを2回かける <M>{'(x - a)^2 = (x - a)(x - a)'}</M> です。1行ずつ追ってみます。
          </p>
          <Steps>
            <li>
              左の x を右の全部にかける：<M>{'x \\times x + x \\times (-a) = x^2 - ax'}</M>
            </li>
            <li>
              左の −a を右の全部にかける：<M>{'(-a) \\times x + (-a) \\times (-a) = -ax + a^2'}</M>
            </li>
            <li>
              合わせて同類項をまとめる：<M>{'x^2 - ax - ax + a^2 = x^2 - 2ax + a^2'}</M>
            </li>
          </Steps>
          <MathBlock caption="2乗の展開。真ん中の −2ax を忘れやすい">{'(x - a)^2 = x^2 - 2ax + a^2'}</MathBlock>
          <p>
            数で確かめます。<M>{'x = 5,\\ a = 2'}</M> なら、左辺は <M>{'3^2 = 9'}</M>、右辺は <M>{'25 - 20 + 4 = 9'}</M> で一致します。
            <M>{'(x - a)^2 = x^2 - a^2'}</M>（= 21）とするのは間違いです。この展開は、分散の式を変形するとき（Σ のレッスン）に使います。
          </p>
        </Example>
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
              データの合計を <M>{'T'}</M>、個数を <M>{'n'}</M>、平均を <M>{'\\bar{x}'}</M>（エックスバー。x の上の横棒は「平均」の印。<Link to="/lessons/descriptive-center">代表値</Link>で扱う）とすると、
              平均の式は <M>{'\\bar{x} = \\frac{T}{n}'}</M>。両辺に n をかけて T について解くと <M>{'T = n\\bar{x}'}</M>（「平均 × 人数 = 合計」）
            </li>
            <li>
              直線の式 <M>{'y = a + bx'}</M> → x について解くと <M>{'x = \\frac{y - a}{b}'}</M>（「y をこの値にするには x をいくつにすればよいか」）
            </li>
          </ul>
        </Example>
      </Section>

      <Section title="不等式：「〜以上」「〜以下」を式で書く">
        <p>
          統計では「z が −1.96 から 1.96 のあいだ」のように、<strong>範囲</strong>を式で書くことがよくあります。そのときに使うのが不等号です。
        </p>
        <DataTable
          head={['記号', '読み方', '意味', '例']}
          rows={[
            [<M key="a">{'a < b'}</M>, 'a 小なり b', 'a は b より小さい（b 未満）', '3 < 5'],
            [<M key="b">{'a > b'}</M>, 'a 大なり b', 'a は b より大きい', '5 > 3'],
            [<M key="c">{'a \\le b'}</M>, 'a 小なりイコール b', 'a は b 以下（等しくてもよい）', '5 ≤ 5 も正しい'],
            [<M key="d">{'a \\ge b'}</M>, 'a 大なりイコール b', 'a は b 以上（等しくてもよい）', 'x ≥ 0'],
            [<M key="e">{'a \\ne b'}</M>, 'a ノットイコール b', 'a と b は等しくない', '3 ≠ 5'],
          ]}
          caption="不等号の読み方。開いているほうが大きい"
        />
        <p>
          日本の教科書では ≤ を <strong>≦</strong>、≥ を <strong>≧</strong> と書くことが多いですが、意味は同じです。
          「以上・以下」は等しい場合を<strong>含み</strong>、「より大きい・未満」は<strong>含みません</strong>。
        </p>
        <p>不等式も、方程式とほとんど同じように変形できます。違うのは1か所だけです。</p>
        <Steps>
          <li>両辺に同じ数を足しても・引いても、向きはそのまま</li>
          <li>両辺に同じ<strong>正の数</strong>をかけても・割っても、向きはそのまま</li>
          <li>
            両辺に<strong>負の数</strong>をかけたり割ったりすると、<strong>向きが逆になる</strong>（例：<M>{'3 < 5'}</M> に −1 をかけると <M>{'-3 > -5'}</M>）
          </li>
        </Steps>
        <Example title="3つ並んだ不等式を x について解く">
          <p>
            平均 50、標準偏差 5 のとき、「z が −2 以上 2 以下」になる点数 x の範囲を求めます。
          </p>
          <MathBlock>{'-2 \\le \\frac{x - 50}{5} \\le 2'}</MathBlock>
          <Steps>
            <li>
              3か所すべてに 5 をかける（正の数なので向きはそのまま）：<M>{'-10 \\le x - 50 \\le 10'}</M>
            </li>
            <li>
              3か所すべてに 50 を足す：<M>{'40 \\le x \\le 60'}</M>
            </li>
          </Steps>
          <p>
            「40点以上60点以下」です。<M>{'x = \\mu + z\\sigma'}</M> に z = −2 と z = 2 を入れた値（40 と 60）と一致します。
          </p>
        </Example>
        <Figure caption="k を動かしてみよう（平均 50、標準偏差 5）。青い範囲が「−k ≤ z ≤ k」になる x。k が大きいほど範囲が広がる">
          <InequalityLine />
        </Figure>
        <Example title="マイナスがついた文字について解く（推定の準備）">
          <p>
            <M>{'-1.96 \\le \\frac{52 - \\mu}{2} \\le 1.96'}</M> を <M>{'\\mu'}</M> について解きます。
          </p>
          <Steps>
            <li>
              3か所に 2 をかける：<M>{'-3.92 \\le 52 - \\mu \\le 3.92'}</M>
            </li>
            <li>
              3か所から 52 を引く：<M>{'-55.92 \\le -\\mu \\le -48.08'}</M>
            </li>
            <li>
              3か所に −1 をかける。<strong>向きが逆になる</strong>：<M>{'55.92 \\ge \\mu \\ge 48.08'}</M>
            </li>
            <li>
              小さいほうを左に書き直す：<M>{'48.08 \\le \\mu \\le 55.92'}</M>
            </li>
          </Steps>
          <p>
            これは<Link to="/lessons/estimation-ci-mean">母平均の区間推定</Link>で信頼区間を求めるときと同じ変形です。
            結果は「52 ± 3.92」（52 から 3.92 を引いた値から、足した値まで）と書くこともできます。± は「プラスマイナス」と読みます。
          </p>
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
            <li>
              <M>{'(x - a)^2 = x^2 - a^2'}</M> としてしまう → 真ん中の <M>{'-2ax'}</M> を忘れている。正しくは <M>{'x^2 - 2ax + a^2'}</M>。
            </li>
            <li>不等式で負の数をかけたのに、向きを変え忘れる → −1 をかけたら ≤ と ≥ が入れかわる。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計でどう使うか">
        <ExamTip title="統計でどう使うか">
          <ul>
            <li>
              <strong>標準化</strong>（<Link to="/lessons/descriptive-standardize">1変数データ</Link>・<Link to="/lessons/distributions-normal">正規分布</Link>）：<M>{'z = \\frac{x - \\mu}{\\sigma}'}</M> で計算し、正規分布表を使ったあと
              <M>{'x = \\mu + z\\sigma'}</M> で元の単位に戻す。
            </li>
            <li>
              <strong>偏差値</strong>：偏差値 = <M>{'50 + 10z'}</M>。偏差値から元の点数を求めるには、z について解いてから x に戻す。
            </li>
            <li>
              <strong>変数の変換</strong>（<Link to="/lessons/random-variables-linear-transform">確率変数の1次変換</Link>）：「全員の点数を a 倍して b を足す」＝ <M>{'y = ax + b'}</M>。平均も同じ式で変わる。
            </li>
            <li>
              <strong>回帰直線</strong>（<Link to="/lessons/bivariate-simple-regression">最小二乗法と回帰直線</Link>）：<M>{'y = a + bx'}</M> に x を代入して予測値を求める。
            </li>
            <li>
              <strong>信頼区間・検定</strong>：「<M>{'-1.96 \\le z \\le 1.96'}</M>」のような不等式を、知りたい文字について解く。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
