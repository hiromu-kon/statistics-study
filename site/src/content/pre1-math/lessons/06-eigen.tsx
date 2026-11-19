import { Link } from 'react-router-dom'
import { Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { EigenFigure, PcaFigure } from '../figures/EigenFigures'

export const meta: LessonMeta = {
  id: 'pre1-math-eigen',
  chapter: 'pre1-math',
  order: 6,
  title: '固有値と固有ベクトル',
  summary: '行列を「ベクトルを動かす操作」として見ると、向きが変わらない特別な方向（固有ベクトル）と倍率（固有値）があります。2×2 の計算、対称行列の固有ベクトルの直交、分散共分散行列の固有値分解（主成分分析の準備）、2次形式を学びます。',
  minutes: 60,
  keywords: ['固有値', '固有ベクトル', '固有方程式', '対称行列', '固有値分解', '2次形式'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          行列 A をベクトルにかけると、ふつうは<strong>向きも長さも変わります</strong>。ところが、ある特別な向きのベクトルだけは<strong>向きが変わらず、伸び縮みするだけ</strong>です。
          その向きのベクトルを<strong>固有ベクトル</strong>、伸び縮みの倍率を<strong>固有値</strong>といいます：<M>{'A\\boldsymbol{v} = \\lambda \\boldsymbol{v}'}</M>。
          分散共分散行列の固有ベクトルは「データが一番広がっている向き」で、これが<strong>主成分分析</strong>の正体です。
        </p>
      </Point>

      <Section title="行列を「ベクトルを動かす操作」として見る">
        <p>
          <M>{'A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}'}</M> をいくつかのベクトルにかけてみます（積の計算は<Link to="/lessons/pre1-math-matrix">ベクトルと行列</Link>）。
        </p>
        <Steps>
          <li>
            <M>{'A\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}'}</M>：横向きだったのが、斜め上向きになった（向きが変わる）
          </li>
          <li>
            <M>{'A\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix} = 3\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}'}</M>：向きはそのまま、長さが 3 倍
          </li>
          <li>
            <M>{'A\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = 1\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}'}</M>：向きも長さもそのまま（1 倍）
          </li>
        </Steps>
        <p>
          (1, 1) は固有値 3 の固有ベクトル、(1, −1) は固有値 1 の固有ベクトルです。
        </p>
        <Figure caption="v の角度を動かしてみよう。ほとんどの角度では Av の向きが v からずれるが、点線の向き（45° と 135°）では v と Av が同じ直線に乗る。対称でない行列にも切りかえてみよう">
          <EigenFigure />
        </Figure>
        <MathBlock caption="固有値 λ と固有ベクトル v の定義（v は 0 ベクトルではない）">{'A\\boldsymbol{v} = \\lambda\\boldsymbol{v} \\qquad (\\boldsymbol{v} \\ne \\boldsymbol{0})'}</MathBlock>
      </Section>

      <Section title="2 × 2 の固有値・固有ベクトルの計算">
        <p>
          <M>{'A\\boldsymbol{v} = \\lambda\\boldsymbol{v}'}</M> の右辺を、単位行列 I（かけても変わらない行列）を使って <M>{'\\lambda I\\boldsymbol{v}'}</M> と書きかえてから移項すると
          <M>{'A\\boldsymbol{v} - \\lambda I\\boldsymbol{v} = (A - \\lambda I)\\boldsymbol{v} = \\boldsymbol{0}'}</M>（行列 A から数 λ は引けないので、λI という行列にしてから引く）。
          もし <M>{'A - \\lambda I'}</M> に逆行列があれば、両辺にかけて <M>{'\\boldsymbol{v} = \\boldsymbol{0}'}</M> しか答えがありません。
          0 でない v があるためには、逆行列がない、つまり<strong>行列式が 0</strong> でなければなりません。
        </p>
        <MathBlock caption="固有方程式：これを解くと固有値が出る">{'\\det(A - \\lambda I) = 0'}</MathBlock>
        <p>
          <M>{'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'}</M> なら <M>{'A - \\lambda I = \\begin{pmatrix} a - \\lambda & b \\\\ c & d - \\lambda \\end{pmatrix}'}</M> なので、
        </p>
        <MathBlock caption="2 × 2 の固有方程式。λ の係数は対角の和、定数は行列式">{'(a - \\lambda)(d - \\lambda) - bc = 0 \\quad \\Longleftrightarrow \\quad \\lambda^2 - (a + d)\\lambda + (ad - bc) = 0'}</MathBlock>
        <p>
          左の式を展開すると <M>{'ad - a\\lambda - d\\lambda + \\lambda^2 - bc'}</M> で、λ の項をまとめると右の形になります。
        </p>
        <MathNote title="2次方程式の解き方（因数分解と解の公式）">
          <p>
            <M>{'\\lambda^2 - 4\\lambda + 3 = 0'}</M> なら、「かけて 3、足して −4」になる2数 −1 と −3 を見つけて <M>{'(\\lambda - 1)(\\lambda - 3) = 0'}</M>、<M>{'\\lambda = 1, 3'}</M>
            （<Link to="/lessons/pre1-math-derivative">微分の考え方</Link>の因数分解と同じ）。
            うまく見つからないときは<strong>解の公式</strong>を使います：<M>{'x^2 + px + q = 0'}</M> の解は <M>{'x = \\frac{-p \\pm \\sqrt{p^2 - 4q}}{2}'}</M>。
          </p>
          <p>
            上の式から、<strong>2つの固有値の和 = 対角の和 a + d</strong>（<strong>トレース</strong>）、<strong>積 = 行列式 ad − bc</strong> がわかります。答えの確かめに便利です。
          </p>
        </MathNote>
        <Example title="A = [[2, 1], [1, 2]] の固有値と固有ベクトル">
          <Steps>
            <li>
              固有方程式：<M>{'(2 - \\lambda)^2 - 1 = 0'}</M>、展開して <M>{'\\lambda^2 - 4\\lambda + 3 = 0'}</M>、<M>{'(\\lambda - 1)(\\lambda - 3) = 0'}</M>。固有値は <M>{'\\lambda = 3, 1'}</M>（和 4 = 2 + 2、積 3 = 4 − 1 ✓）
            </li>
            <li>
              λ = 3 の固有ベクトル：<M>{'(A - 3I)\\boldsymbol{v} = \\begin{pmatrix} -1 & 1 \\\\ 1 & -1 \\end{pmatrix}\\begin{pmatrix} v_1 \\\\ v_2 \\end{pmatrix} = \\boldsymbol{0}'}</M> より <M>{'-v_1 + v_2 = 0'}</M>、つまり <M>{'v_1 = v_2'}</M>。たとえば (1, 1)
            </li>
            <li>
              λ = 1 の固有ベクトル：<M>{'(A - I)\\boldsymbol{v} = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}\\boldsymbol{v} = \\boldsymbol{0}'}</M> より <M>{'v_1 + v_2 = 0'}</M>。たとえば (1, −1)
            </li>
          </Steps>
          <p>
            2本の式は同じ内容になるので、「<M>{'v_1'}</M> と <M>{'v_2'}</M> の比」だけが決まります。(2, 2) や (−1, −1) も固有ベクトルです。
            長さを 1 にそろえるなら <M>{'\\frac{1}{\\sqrt{2}}(1, 1)'}</M>（<strong>正規化</strong>）。主成分分析では長さ 1 のものを使います。
          </p>
        </Example>
        <Example title="対称でない行列の例：B = [[3, 1], [0, 2]]">
          <Steps>
            <li>
              固有方程式：<M>{'(3 - \\lambda)(2 - \\lambda) - 1 \\times 0 = 0'}</M> より <M>{'\\lambda = 3, 2'}</M>
            </li>
            <li>
              λ = 3：<M>{'\\begin{pmatrix} 0 & 1 \\\\ 0 & -1 \\end{pmatrix}\\boldsymbol{v} = \\boldsymbol{0}'}</M> より <M>{'v_2 = 0'}</M>。固有ベクトルは (1, 0)
            </li>
            <li>
              λ = 2：<M>{'\\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}\\boldsymbol{v} = \\boldsymbol{0}'}</M> より <M>{'v_1 + v_2 = 0'}</M>。固有ベクトルは (1, −1)
            </li>
          </Steps>
          <p>
            2つの固有ベクトルの内積は <M>{'1 \\times 1 + 0 \\times (-1) = 1 \\ne 0'}</M> なので、直交していません（図で「対称でない行列」を選ぶと、点線が直角に交わらないのがわかります）。
          </p>
        </Example>
      </Section>

      <Section title="対称行列の固有ベクトルは直交する">
        <p>
          最初の例 A（対称行列）の固有ベクトル (1, 1) と (1, −1) の内積は <M>{'1 - 1 = 0'}</M> で、<strong>直交</strong>していました。これはたまたまではありません。
        </p>
        <MathBlock caption="対称行列（A′ = A）の性質">{"A' = A,\\quad A\\boldsymbol{u}_1 = \\lambda_1 \\boldsymbol{u}_1,\\quad A\\boldsymbol{u}_2 = \\lambda_2 \\boldsymbol{u}_2,\\quad \\lambda_1 \\ne \\lambda_2 \\ \\Longrightarrow\\ \\boldsymbol{u}_1 \\cdot \\boldsymbol{u}_2 = 0"}</MathBlock>
        <p>
          つまり、<strong>対称行列の固有値はすべて実数で、異なる固有値の固有ベクトルどうしは直交します</strong>。分散共分散行列は対称行列なので、この性質がいつも使えます。
        </p>
        <Note title="直交する理由（読み飛ばしてよい）">
          <p>
            <M>{'A\\boldsymbol{u}_1 = \\lambda_1 \\boldsymbol{u}_1'}</M>、<M>{'A\\boldsymbol{u}_2 = \\lambda_2 \\boldsymbol{u}_2'}</M> とします。
            <M>{"\\boldsymbol{u}_2' A \\boldsymbol{u}_1"}</M> を2通りに計算すると、1つは <M>{"\\lambda_1 \\boldsymbol{u}_2'\\boldsymbol{u}_1"}</M>。
            もう1つは、A が対称なので <M>{"\\boldsymbol{u}_2' A = (A\\boldsymbol{u}_2)' = \\lambda_2 \\boldsymbol{u}_2'"}</M> を使って <M>{"\\lambda_2 \\boldsymbol{u}_2'\\boldsymbol{u}_1"}</M>。
            引くと <M>{"(\\lambda_1 - \\lambda_2)\\,\\boldsymbol{u}_2'\\boldsymbol{u}_1 = 0"}</M> で、<M>{'\\lambda_1 \\ne \\lambda_2'}</M> なので内積 <M>{"\\boldsymbol{u}_2'\\boldsymbol{u}_1 = 0"}</M>。
          </p>
        </Note>
      </Section>

      <Section title="分散共分散行列の固有値分解＝主成分分析の準備">
        <p>
          <Link to="/lessons/pre1-math-matrix">ベクトルと行列</Link>で見たとおり、2つの変数 X, Y のデータを、長さ 1 の向き <M>{'\\boldsymbol{u} = (u_1, u_2)'}</M> に落とした値
          <M>{'u_1 X + u_2 Y'}</M> の分散は <M>{"\\boldsymbol{u}'\\Sigma\\boldsymbol{u}"}</M> です。
          <strong>主成分分析</strong>は「この分散が一番大きくなる向き」を探します。答えは次のとおりです。
        </p>
        <ul>
          <li>
            分散が最大になる向き u は、Σ の<strong>一番大きい固有値 λ₁ の固有ベクトル</strong>（第1主成分の向き）。そのときの分散は <M>{'\\lambda_1'}</M>
          </li>
          <li>それと直交する向き（2番目の固有値 λ₂ の固有ベクトル）が第2主成分。分散は λ₂</li>
          <li>
            固有値の合計 <M>{'\\lambda_1 + \\lambda_2'}</M> は対角の和（分散の合計）に等しいので、<M>{'\\frac{\\lambda_1}{\\lambda_1 + \\lambda_2}'}</M> は「全体の散らばりのうち第1主成分が説明する割合」（<strong>寄与率</strong>）
          </li>
        </ul>
        <Figure caption="X の分散と相関係数を動かすと、データの広がり方と主成分の向き（太線）が変わる。向き u を回すと、u に落とした分散 u′Σu は第1主成分の向きで最大（= λ₁）になる">
          <PcaFigure />
        </Figure>
        <Example title="Σ = [[1, 0.8], [0.8, 1]] の主成分">
          <Steps>
            <li>
              固有方程式：<M>{'(1 - \\lambda)^2 - 0.64 = 0'}</M> より <M>{'1 - \\lambda = \\pm 0.8'}</M>、<M>{'\\lambda_1 = 1.8,\\ \\lambda_2 = 0.2'}</M>（和 2 = 1 + 1 ✓）
            </li>
            <li>
              λ₁ = 1.8：<M>{'\\begin{pmatrix} -0.8 & 0.8 \\\\ 0.8 & -0.8 \\end{pmatrix}\\boldsymbol{v} = \\boldsymbol{0}'}</M> より <M>{'v_1 = v_2'}</M>。長さ 1 にして <M>{'\\boldsymbol{u}_1 = \\frac{1}{\\sqrt{2}}(1, 1)'}</M>
            </li>
            <li>
              確かめ：<M>{"\\boldsymbol{u}_1'\\Sigma\\boldsymbol{u}_1 = \\frac{1}{2}(1 + 2 \\times 0.8 + 1) = 1.8 = \\lambda_1"}</M>
            </li>
            <li>
              寄与率：<M>{'\\frac{1.8}{1.8 + 0.2} = 0.9'}</M>。第1主成分（X と Y の合計の方向）だけで、全体の散らばりの 90% を説明できる
            </li>
          </Steps>
        </Example>
        <MathBlock caption="固有値分解：対称行列は、直交する固有ベクトルと固有値で組み立て直せる（P は長さ 1 の固有ベクトルを列に並べた行列、Λ（ラムダの大文字）は固有値を対角に並べた行列）">{"\\Sigma = P \\Lambda P' = \\lambda_1 \\boldsymbol{u}_1 \\boldsymbol{u}_1' + \\lambda_2 \\boldsymbol{u}_2 \\boldsymbol{u}_2', \\qquad P = (\\boldsymbol{u}_1\\ \\boldsymbol{u}_2),\\ \\Lambda = \\begin{pmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{pmatrix}"}</MathBlock>
        <p>
          「どんな向きの散らばりも、直交する主成分の向きの散らばりの組み合わせで書ける」という意味です。準1級では、この分解の結果（固有値と固有ベクトル）から寄与率・主成分得点（主成分スコア）・主成分負荷量を読む問題が中心になると考えられます（<Link to="/chapters/pre1-multivariate">多変量解析</Link>の章）。
        </p>
      </Section>

      <Section title="2次形式の雰囲気">
        <p>
          <M>{"\\boldsymbol{x}'A\\boldsymbol{x}"}</M>（A は対称行列）の形の式を<strong>2次形式</strong>といいます。2 × 2 で展開すると、各変数の2乗と積の項だけが並びます。
        </p>
        <MathBlock caption="2次形式の展開。非対角の b は2回出てくるので 2b になる">{"\\begin{pmatrix} x_1 & x_2 \\end{pmatrix}\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}\\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix} = a x_1^2 + 2b\\,x_1 x_2 + c\\,x_2^2"}</MathBlock>
        <Example title="2次形式の値">
          <p>
            <M>{'A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}'}</M>、<M>{'\\boldsymbol{x} = (1, -2)'}</M> なら
            <M>{'2 \\times 1^2 + 2 \\times 1 \\times 1 \\times (-2) + 3 \\times (-2)^2 = 2 - 4 + 12 = 10'}</M>。
          </p>
        </Example>
        <ul>
          <li>
            分散共分散行列の2次形式 <M>{"\\boldsymbol{a}'\\Sigma\\boldsymbol{a}"}</M> は分散なので、いつも 0 以上です。そのため<strong>分散共分散行列の固有値は 0 以上</strong>になります（固有ベクトルの向きの分散が固有値だから）。
          </li>
          <li>
            多変量正規分布の密度には <M>{"(\\boldsymbol{x} - \\boldsymbol{\\mu})'\\Sigma^{-1}(\\boldsymbol{x} - \\boldsymbol{\\mu})"}</M> という2次形式が入っていて、これが一定になる点（等高線）は楕円です（<Link to="/lessons/pre1-math-multivariable">等高線の図</Link>）。
            楕円の軸の向きが Σ の固有ベクトルです。
          </li>
        </ul>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="固有ベクトルは、行列という操作の「軸」">
          <p>
            行列による動きは複雑に見えますが、固有ベクトルの向きに座標をとり直すと、「それぞれの軸の方向に λ 倍するだけ」の単純な操作になります。
            図で、長さ 1 の円が楕円に変わったとき、楕円の長い軸と短い軸の向きが（対称行列の）固有ベクトル、中心からそれぞれの軸の端までの長さが固有値（の絶対値）です。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>固有ベクトルは1つに決まると思う → 何倍しても固有ベクトル。比（向き）だけが決まる。主成分分析では長さ 1 にそろえる（それでも符号の ± は残る）。</li>
            <li>
              固有値は対角の成分だと思う → 対角行列や三角行列（B のように片側が 0）ならそうだが、一般には固有方程式を解く。確かめは「和 = 対角の和、積 = 行列式」。
            </li>
            <li>0 ベクトルも固有ベクトルだと思う → 0 ベクトルは除く。固有値のほうは 0 でもよい（行列式が 0 の行列は固有値 0 をもつ）。</li>
            <li>どんな行列でも固有ベクトルが直交すると思う → 直交が保証されるのは対称行列。</li>
            <li>寄与率を固有値の平方根で計算する → 寄与率は固有値（＝分散）の割合。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="準1級のどこで使うか">
        <ExamTip title="準1級のどこで使うか">
          <ul>
            <li>
              <strong>主成分分析</strong>（<Link to="/chapters/pre1-multivariate">多変量解析</Link>）：分散共分散行列（または相関行列）の固有値・固有ベクトルから、寄与率・累積寄与率・主成分スコア・主成分負荷量を求める。
            </li>
            <li>
              <strong>多変量正規分布</strong>（<Link to="/chapters/pre1-distributions">種々の確率分布</Link>）：密度の中の2次形式、等高線の楕円の向き。
            </li>
            <li>
              <strong>マルコフ連鎖の定常分布</strong>（<Link to="/chapters/pre1-stochastic">マルコフ連鎖と確率過程</Link>）：定常分布 π（横に並べた確率のベクトル）は <M>{'\\pi P = \\pi'}</M> を満たす。これは「π に右から P をかけても変わらない」という固有値 1 の式で、転置すると <M>{"P'\\pi' = \\pi'"}</M>、つまり P′ の固有値 1 の固有ベクトル。
            </li>
          </ul>
          <p>
            出題範囲表（2027年1月1日版）の主成分分析の項目は「主成分スコア，主成分負荷量，寄与率，累積寄与率」で、固有値という語は載っていません。
            固有値の計算を本番でどこまで手で求めるか（2 × 2 程度か、結果が与えられるか）は、確かめていません。
          </p>
        </ExamTip>
      </Section>
    </>
  )
}
