import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DeterminantFigure, InnerProductFigure, MatrixProductStepper } from '../figures/MatrixFigures'

export const meta: LessonMeta = {
  id: 'pre1-math-matrix',
  chapter: 'pre1-math',
  order: 5,
  title: 'ベクトルと行列',
  summary: 'ベクトル・内積・行列の積・転置・単位行列・逆行列（2×2）・行列式を、1マスずつの計算で練習し、連立方程式を行列で書く形（回帰の正規方程式 X′Xβ = X′y）と分散共分散行列につなげます。',
  minutes: 60,
  keywords: ['ベクトル', '内積', '行列の積', '逆行列', '行列式', '正規方程式', '分散共分散行列'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>行列</strong>は「数を長方形に並べた表」で、<strong>たくさんの式をまとめて1つの式で書くための記号</strong>です。
          計算の中心は<strong>行列の積</strong>で、その中身は「<strong>横の行と縦の列を、かけて足す</strong>」（内積）をくり返すだけです。
          準1級では、重回帰の式 <M>{'\\boldsymbol{y} = X\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}'}</M>、係数を求める正規方程式 <M>{"X'X\\boldsymbol{\\beta} = X'\\boldsymbol{y}"}</M>、分散共分散行列で使います。
        </p>
      </Point>

      <Section title="ベクトル：数を縦に並べたもの">
        <p>
          3人のテストの点数 60, 70, 80 を、縦に並べて1つのものとして扱ったのが<strong>ベクトル</strong>です。統計では、太字の小文字で書くことが多いです。
        </p>
        <MathBlock caption="縦に並べたものを列ベクトル、横に並べたものを行ベクトルという">{'\\boldsymbol{x} = \\begin{pmatrix} 60 \\\\ 70 \\\\ 80 \\end{pmatrix}, \\qquad \\boldsymbol{x} + \\boldsymbol{y} = \\begin{pmatrix} x_1 + y_1 \\\\ x_2 + y_2 \\\\ x_3 + y_3 \\end{pmatrix}, \\qquad c\\,\\boldsymbol{x} = \\begin{pmatrix} c x_1 \\\\ c x_2 \\\\ c x_3 \\end{pmatrix}'}</MathBlock>
        <p>足し算は同じ位置どうしを足し、定数倍は全部の成分を c 倍します。2つの成分のベクトルは、平面の上の矢印（原点から点 (x₁, x₂) へ）として描けます。</p>
      </Section>

      <Section title="内積：かけて足す">
        <p>
          同じ長さの2つのベクトルの、同じ位置どうしをかけて全部足したものを<strong>内積</strong>といいます。
          <Link to="/lessons/math-sigma">Σ記号</Link>で書くと <M>{'\\sum x_i y_i'}</M> で、2級の共分散の計算に出てきた「積の和」そのものです。
        </p>
        <MathBlock caption="内積。a·b とも、転置（下で説明）を使って a′b とも書く">{"\\boldsymbol{a} \\cdot \\boldsymbol{b} = \\boldsymbol{a}'\\boldsymbol{b} = a_1 b_1 + a_2 b_2 + \\cdots + a_n b_n = \\sum_{i=1}^{n} a_i b_i"}</MathBlock>
        <Example title="内積の計算">
          <p>
            <M>{'(1, 2, 3) \\cdot (4, 5, 6) = 1 \\times 4 + 2 \\times 5 + 3 \\times 6 = 4 + 10 + 18 = 32'}</M>。
            自分自身との内積 <M>{'\\boldsymbol{a} \\cdot \\boldsymbol{a} = \\sum a_i^2'}</M> は「2乗和」で、その平方根 <M>{'|\\boldsymbol{a}| = \\sqrt{\\sum a_i^2}'}</M> が矢印の<strong>長さ</strong>です（三平方の定理）。
          </p>
        </Example>
        <p>
          内積は、2つの矢印の<strong>向きのそろい具合</strong>を表します。同じ向きならプラスで大きく、<strong>直角なら 0</strong>、反対向きならマイナスです。
          内積が 0 のとき、2つのベクトルは<strong>直交する</strong>といいます。
        </p>
        <Figure caption="b の角度と長さを動かしてみよう。内積は「b を a の向きに落とした影の長さ × a の長さ」。直角（90°）でちょうど 0 になる">
          <InnerProductFigure />
        </Figure>
        <MathBlock caption="内積と角度 θ の関係（cos θ は、角度が 0° で 1、90° で 0、180° で −1 になる数）">{'\\boldsymbol{a} \\cdot \\boldsymbol{b} = |\\boldsymbol{a}|\\,|\\boldsymbol{b}| \\cos\\theta'}</MathBlock>
        <Note title="相関係数は「偏差ベクトルの角度」">
          <p>
            各データから平均を引いた偏差を並べたベクトルを2つ作ると、2級の<Link to="/lessons/bivariate-scatter-correlation">相関係数</Link>は
            <M>{'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2}\\sqrt{\\sum (y_i - \\bar{y})^2}}'}</M>、つまり2つの偏差ベクトルの <M>{'\\cos\\theta'}</M> と同じ式です。
            相関が 0 ＝ 偏差ベクトルが直交、と読めます。
          </p>
        </Note>
      </Section>

      <Section title="行列と行列の積">
        <p>
          数を縦横に並べたものが<strong>行列</strong>です。横の並びを<strong>行</strong>、縦の並びを<strong>列</strong>といい、m 行 n 列の行列を「m × n 行列」といいます。
          i 行目・j 列目の数を <M>{'(i, j)'}</M> 成分といい、<M>{'a_{ij}'}</M> と書きます。
        </p>
        <MathBlock caption="2 × 3 行列の例。a₂₃ は 2 行目・3 列目の 6">{'A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}'}</MathBlock>
        <Note title="行と列の覚え方">
          <p>「行」という漢字の右側には横線が2本ある → 行は横。「列」という漢字の右側（りっとう）には縦線が2本ある → 列は縦。</p>
        </Note>
        <p>
          行列の積 AB の <M>{'(i, j)'}</M> 成分は、<strong>A の i 行目と B の j 列目の内積</strong>です。
          そのため、<strong>A の列の数と B の行の数が同じ</strong>でないと計算できません。
        </p>
        <MathBlock caption="(m × n) と (n × p) の積は m × p。内側の n がそろっている必要がある">{'(AB)_{ij} = \\sum_{k=1}^{n} a_{ik} b_{kj}'}</MathBlock>
        <Figure caption="「次のマス」を押してみよう。塗った行（A）と塗った列（B）をかけて足したものが、AB の塗ったマスに入る">
          <MatrixProductStepper />
        </Figure>
        <Example title="2 × 2 の積と、順番を入れかえた積">
          <p>
            <M>{'A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}'}</M>、<M>{'B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}'}</M> とします。
          </p>
          <Steps>
            <li>
              1 行 1 列：A の 1 行目 (1, 2) と B の 1 列目 (5, 7) の内積 <M>{'1 \\times 5 + 2 \\times 7 = 19'}</M>
            </li>
            <li>
              1 行 2 列：(1, 2) と (6, 8) で <M>{'6 + 16 = 22'}</M>。2 行 1 列：(3, 4) と (5, 7) で <M>{'15 + 28 = 43'}</M>。2 行 2 列：(3, 4) と (6, 8) で <M>{'18 + 32 = 50'}</M>
            </li>
            <li>
              まとめて <M>{'AB = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}'}</M>
            </li>
          </Steps>
          <p>
            一方 <M>{'BA = \\begin{pmatrix} 23 & 34 \\\\ 31 & 46 \\end{pmatrix}'}</M> で、AB と違います。<strong>行列の積は、順番を入れかえると一般に結果が変わります</strong>。
          </p>
        </Example>
        <h3>行列 × ベクトル ＝ 連立方程式</h3>
        <p>ベクトルは「1列の行列」なので、行列とベクトルの積も同じルールで計算できます。すると連立方程式が1つの式で書けます。</p>
        <MathBlock caption="左の連立方程式と、右の行列の式は同じ意味">{'\\begin{cases} 2x + y = 5 \\\\ x + 3y = 10 \\end{cases} \\quad \\Longleftrightarrow \\quad \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 10 \\end{pmatrix}'}</MathBlock>
      </Section>

      <Section title="転置・単位行列・逆行列・行列式">
        <p>
          <strong>転置</strong> <M>{"A'"}</M>（<M>{'A^{\\top}'}</M> とも書く。流儀が分かれます）は、行と列を入れかえた行列です。1 行目が 1 列目になります。
          行列やベクトルにつく ′ は転置の印で、<Link to="/lessons/pre1-math-derivative">微分</Link>の <M>{"f'(x)"}</M> の ′ とは別の意味です（数や関数につくと微分、行列・ベクトルにつくと転置）。
        </p>
        <MathBlock caption="転置。積の転置は、順番が逆になる">{"\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}' = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}, \\qquad (AB)' = B'A'"}</MathBlock>
        <p>
          転置しても変わらない行列（<M>{"A' = A"}</M>、つまり <M>{'a_{ij} = a_{ji}'}</M>）を<strong>対称行列</strong>といいます。分散共分散行列は対称行列です。
        </p>
        <p>
          <strong>単位行列</strong> I は、左上から右下への対角線が 1、ほかが 0 の正方行列で、数の「1」の役割をします：<M>{'AI = IA = A'}</M>。
        </p>
        <MathBlock caption="2 × 2 の単位行列">{'I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}'}</MathBlock>
        <p>
          <strong>逆行列</strong> <M>{'A^{-1}'}</M>（「A インバース」と読む）は、かけると単位行列になる行列です（数の「逆数」の役割）：<M>{'A^{-1}A = AA^{-1} = I'}</M>。
          右上の −1 は「−1 乗」の形をしていますが、成分ごとの逆数ではありません。逆行列があるのは、行の数と列の数が同じ<strong>正方行列</strong>だけです。
          2 × 2 なら次の公式で求まります。分母の <M>{'ad - bc'}</M> を<strong>行列式</strong>（<M>{'\\det A'}</M> または <M>{'|A|'}</M>）といいます。
        </p>
        <MathBlock caption="2 × 2 の逆行列：対角を入れかえ、残りの符号を変えて、行列式で割る">{'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\qquad \\det A = ad - bc, \\qquad A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}'}</MathBlock>
        <p>
          <strong>行列式が 0 のときは逆行列がありません</strong>（0 では割れない）。図で見ると、行列式は「正方形を行列で移したときに、面積が何倍になるか」で、0 は「平面がつぶれて線になる」ことを表します。
        </p>
        <Figure caption="a, b, c, d を動かしてみよう。行列の2つの列が作る平行四辺形の面積が行列式。2つの列が同じ直線に乗る（たとえば a = 2, b = 1, c = 1, d = 0.5）と面積 0 になり、逆行列がなくなる">
          <DeterminantFigure />
        </Figure>
        <Example title="逆行列で連立方程式を解く">
          <p>
            上の <M>{'\\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 10 \\end{pmatrix}'}</M> を解きます。
          </p>
          <Steps>
            <li>
              行列式：<M>{'2 \\times 3 - 1 \\times 1 = 5'}</M>（0 でないので逆行列がある）
            </li>
            <li>
              逆行列：<M>{'\\frac{1}{5}\\begin{pmatrix} 3 & -1 \\\\ -1 & 2 \\end{pmatrix}'}</M>
            </li>
            <li>
              両辺に左から逆行列をかける：<M>{'\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\frac{1}{5}\\begin{pmatrix} 3 \\times 5 - 1 \\times 10 \\\\ -1 \\times 5 + 2 \\times 10 \\end{pmatrix} = \\frac{1}{5}\\begin{pmatrix} 5 \\\\ 15 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix}'}</M>
            </li>
            <li>確かめ：2 × 1 + 3 = 5、1 + 3 × 3 = 10 ✓</li>
          </Steps>
        </Example>
        <MathNote title="逆行列の公式の確かめ方">
          <p>
            <M>{'\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = \\begin{pmatrix} ad - bc & 0 \\\\ 0 & ad - bc \\end{pmatrix}'}</M>
            なので、ad − bc で割れば単位行列になります。公式を忘れたら、この積を計算すれば思い出せます。
          </p>
        </MathNote>
      </Section>

      <Section title="回帰の正規方程式 X′Xβ = X′y">
        <p>
          単回帰 <M>{'y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i'}</M>（i = 1, …, n）を、n 本まとめて行列で書きます。1 列目が全部 1 の行列 X を使うのがポイントです。
        </p>
        <MathBlock caption="単回帰を行列で書く。X は n × 2、β は係数を縦に並べたもの">{'\\begin{pmatrix} y_1 \\\\ y_2 \\\\ \\vdots \\\\ y_n \\end{pmatrix} = \\begin{pmatrix} 1 & x_1 \\\\ 1 & x_2 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{pmatrix} \\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix} + \\begin{pmatrix} \\varepsilon_1 \\\\ \\varepsilon_2 \\\\ \\vdots \\\\ \\varepsilon_n \\end{pmatrix}, \\qquad \\boldsymbol{y} = X\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}'}</MathBlock>
        <p>
          最小二乗法は、残差の2乗和 <M>{'S = \\sum (y_i - \\beta_0 - \\beta_1 x_i)^2'}</M> を最小にします。<Link to="/lessons/pre1-math-multivariable">偏微分</Link>して 0 とおくと、2本の式が出てきます。
        </p>
        <Steps>
          <li>
            β₀ で偏微分（チェーンルールで、かっこの中を β₀ で微分した −1 がかかる）：<M>{'\\frac{\\partial S}{\\partial \\beta_0} = -2\\sum (y_i - \\beta_0 - \\beta_1 x_i) = 0'}</M>。
            −2 で割って Σ を項ごとに分けると <M>{'\\sum y_i - n\\beta_0 - \\beta_1 \\sum x_i = 0'}</M>（β₀ を n 回足すと nβ₀）。移項して <M>{'n\\beta_0 + \\left(\\sum x_i\\right)\\beta_1 = \\sum y_i'}</M>
          </li>
          <li>
            β₁ で偏微分（かっこの中を β₁ で微分すると <M>{'-x_i'}</M>）：<M>{'\\frac{\\partial S}{\\partial \\beta_1} = -2\\sum x_i (y_i - \\beta_0 - \\beta_1 x_i) = 0'}</M>。
            同じように分けると <M>{'\\sum x_i y_i - \\beta_0 \\sum x_i - \\beta_1 \\sum x_i^2 = 0'}</M>、移項して <M>{'\\left(\\sum x_i\\right)\\beta_0 + \\left(\\sum x_i^2\\right)\\beta_1 = \\sum x_i y_i'}</M>
          </li>
          <li>
            行列で書くと <M>{"\\begin{pmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{pmatrix}\\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_i y_i \\end{pmatrix}"}</M>。
            左の行列はちょうど <M>{"X'X"}</M>、右辺は <M>{"X'\\boldsymbol{y}"}</M> です。X′ は「1 行目が全部 1、2 行目が <M>{'x_1, \\ldots, x_n'}</M>」の 2 × n 行列なので、
            <M>{"X'X"}</M> の (1, 1) 成分は (1, …, 1) と (1, …, 1) の内積で n、(1, 2) 成分は (1, …, 1) と (x₁, …, xₙ) の内積で <M>{'\\sum x_i'}</M>、(2, 2) 成分は <M>{'\\sum x_i^2'}</M>。
            同じように <M>{"X'\\boldsymbol{y}"}</M> は <M>{'(\\sum y_i, \\sum x_i y_i)'}</M> を縦に並べたものになります
          </li>
        </Steps>
        <MathBlock caption="正規方程式と最小二乗推定量（X′X に逆行列があるとき）">{"X'X\\boldsymbol{\\beta} = X'\\boldsymbol{y}, \\qquad \\hat{\\boldsymbol{\\beta}} = (X'X)^{-1}X'\\boldsymbol{y}"}</MathBlock>
        <Example title="4 点のデータで正規方程式を解く">
          <DataTable head={['x', '1', '2', '3', '4']} rows={[['y', '2', '3', '5', '6']]} />
          <Steps>
            <li>
              必要な和：n = 4、<M>{'\\sum x = 10'}</M>、<M>{'\\sum x^2 = 30'}</M>、<M>{'\\sum y = 16'}</M>、<M>{'\\sum xy = 2 + 6 + 15 + 24 = 47'}</M>
            </li>
            <li>
              <M>{"X'X = \\begin{pmatrix} 4 & 10 \\\\ 10 & 30 \\end{pmatrix}"}</M>、<M>{"X'\\boldsymbol{y} = \\begin{pmatrix} 16 \\\\ 47 \\end{pmatrix}"}</M>
            </li>
            <li>
              行列式 <M>{'4 \\times 30 - 10 \\times 10 = 20'}</M>、逆行列 <M>{'\\frac{1}{20}\\begin{pmatrix} 30 & -10 \\\\ -10 & 4 \\end{pmatrix}'}</M>
            </li>
            <li>
              <M>{'\\hat{\\boldsymbol{\\beta}} = \\frac{1}{20}\\begin{pmatrix} 30 \\times 16 - 10 \\times 47 \\\\ -10 \\times 16 + 4 \\times 47 \\end{pmatrix} = \\frac{1}{20}\\begin{pmatrix} 10 \\\\ 28 \\end{pmatrix} = \\begin{pmatrix} 0.5 \\\\ 1.4 \\end{pmatrix}'}</M>
            </li>
          </Steps>
          <p>
            回帰直線は <M>{'\\hat{y} = 0.5 + 1.4x'}</M>。2級の<Link to="/lessons/bivariate-simple-regression">最小二乗法と回帰直線</Link>の公式（傾き = 共分散 ÷ x の分散）で計算しても同じ値になります。
            説明変数が増えた<Link to="/lessons/linear-models-multiple-regression">重回帰</Link>でも、X の列が増えるだけで同じ式が使えるのが、行列で書く利点です。
          </p>
        </Example>
      </Section>

      <Section title="分散共分散行列">
        <p>
          2つの確率変数 X, Y の分散と共分散（2級の<Link to="/lessons/random-variables-sum-covariance">和と差・共分散と相関</Link>）を、行列にまとめたものが<strong>分散共分散行列</strong>です。
          対角に分散、それ以外に共分散が並び、<M>{'\\mathrm{Cov}(X, Y) = \\mathrm{Cov}(Y, X)'}</M> なので対称行列です。
        </p>
        <MathBlock caption="分散共分散行列（Σ は大文字のシグマ。ここでは和の記号ではなく行列の名前）">{'\\Sigma = \\begin{pmatrix} V[X] & \\mathrm{Cov}(X, Y) \\\\ \\mathrm{Cov}(Y, X) & V[Y] \\end{pmatrix}'}</MathBlock>
        <p>係数を並べたベクトル (a, b) を使うと、2級で覚えた「和の分散」の公式が、行列の積で書けます。</p>
        <MathBlock caption="aX + bY の分散。行ベクトル × 行列 × 列ベクトルの形">{"V[aX + bY] = \\begin{pmatrix} a & b \\end{pmatrix} \\Sigma \\begin{pmatrix} a \\\\ b \\end{pmatrix} = a^2 V[X] + 2ab\\,\\mathrm{Cov}(X, Y) + b^2 V[Y]"}</MathBlock>
        <p>
          右から計算すると、<M>{'\\Sigma \\begin{pmatrix} a \\\\ b \\end{pmatrix} = \\begin{pmatrix} aV[X] + b\\,\\mathrm{Cov}(X, Y) \\\\ a\\,\\mathrm{Cov}(X, Y) + bV[Y] \\end{pmatrix}'}</M>。
          これと (a, b) の内積をとると <M>{'a^2 V[X] + ab\\,\\mathrm{Cov}(X, Y) + ab\\,\\mathrm{Cov}(X, Y) + b^2 V[Y]'}</M> で、共分散の項が2回出てくるので 2ab になります。
        </p>
        <Example title="分散共分散行列から、和の分散を求める">
          <p>
            <M>{'\\Sigma = \\begin{pmatrix} 4 & 3 \\\\ 3 & 9 \\end{pmatrix}'}</M> のとき（V[X] = 4、V[Y] = 9、共分散 3。相関係数は <M>{'\\frac{3}{2 \\times 3} = 0.5'}</M>）、
          </p>
          <Steps>
            <li>
              <M>{'\\Sigma \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 4 + 3 \\\\ 3 + 9 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 12 \\end{pmatrix}'}</M>
            </li>
            <li>
              <M>{'V[X + Y] = \\begin{pmatrix} 1 & 1 \\end{pmatrix} \\begin{pmatrix} 7 \\\\ 12 \\end{pmatrix} = 19'}</M>（公式なら <M>{'4 + 2 \\times 3 + 9 = 19'}</M>）
            </li>
          </Steps>
        </Example>
        <p>
          この「<M>{"\\boldsymbol{a}'\\Sigma\\boldsymbol{a}"}</M>」の形を<strong>2次形式</strong>といい、次の<Link to="/lessons/pre1-math-eigen">固有値と固有ベクトル</Link>で主成分分析につなげます。
        </p>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="行列は「表」であり「操作」でもある">
          <p>
            行列は、データの表（X）や、分散・共分散の一覧表（Σ）として使われます。同時に、ベクトルにかけると別のベクトルに移す<strong>操作</strong>でもあります（上の平行四辺形の図）。
            「表」として見ると正規方程式や分散共分散行列が、「操作」として見ると行列式や固有値がわかりやすくなります。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>行列の積で、同じ位置どうしをかけてしまう → (i, j) 成分は「i 行目 と j 列目」の内積。</li>
            <li>AB と BA は同じだと思う → 一般に違う。そもそも片方しか計算できないこともある（2 × 3 と 3 × 4 なら AB だけ）。</li>
            <li>
              逆行列で、対角を入れかえずに符号だけ変える → <M>{'\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}'}</M>：対角（a と d）は入れかえ、もう一方の対角（b と c）は符号を変える。
            </li>
            <li>
              行列式を <M>{'ad + bc'}</M> や <M>{'ab - cd'}</M> にしてしまう → 「右下がりの対角の積 − 右上がりの対角の積」で <M>{'ad - bc'}</M>。
            </li>
            <li>
              <M>{"(AB)' = A'B'"}</M> としてしまう → 順番が逆になって <M>{"B'A'"}</M>。
            </li>
            <li>
              「行列で割る」と考える → 割り算はなく、逆行列を<strong>左から</strong>（または右から）かける。どちらからかけるかで結果が変わる。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="準1級のどこで使うか">
        <ExamTip title="準1級のどこで使うか">
          <ul>
            <li>
              <strong>重回帰分析</strong>（<Link to="/chapters/pre1-regression">回帰分析</Link>）：<M>{"\\hat{\\boldsymbol{\\beta}} = (X'X)^{-1}X'\\boldsymbol{y}"}</M>、係数の分散 <M>{"\\sigma^2 (X'X)^{-1}"}</M> など、行列の式で書かれる。
            </li>
            <li>
              <strong>確率変数の線形結合の分布・多変量正規分布</strong>（<Link to="/chapters/pre1-probability">確率と確率変数</Link>・<Link to="/chapters/pre1-distributions">種々の確率分布</Link>）：平均ベクトルと分散共分散行列で表す。
            </li>
            <li>
              <strong>主成分分析・判別分析</strong>（<Link to="/chapters/pre1-multivariate">多変量解析</Link>）：分散共分散行列（相関行列）の計算が出発点。
            </li>
            <li>
              <strong>マルコフ連鎖</strong>（<Link to="/chapters/pre1-stochastic">マルコフ連鎖と確率過程</Link>）：推移確率を行列に並べ、行列の積で数ステップ後の確率を求める。
            </li>
          </ul>
          <p>
            出題範囲表（2027年1月1日版）には、確率変数の線形結合の分布・多変量正規分布・重回帰モデル・主成分分析・推移確率が載っています。
            行列そのものは項目にありませんが、これらの式は行列で書かれることが多いです。
          </p>
        </ExamTip>
      </Section>
    </>
  )
}
