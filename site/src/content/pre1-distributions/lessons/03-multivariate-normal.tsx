import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { ConditionalSlice, LinearTransform, MvnContour } from '../figures/MvnFigures'

export const meta: LessonMeta = {
  id: 'pre1-distributions-mvn',
  chapter: 'pre1-distributions',
  order: 3,
  title: '多変量正規分布',
  summary: 'いくつもの量をまとめて扱う正規分布です。平均ベクトルと分散共分散行列で決まり、周辺分布・条件つき分布・線形変換がすべて正規分布になります。',
  minutes: 50,
  keywords: ['多変量正規分布', '平均ベクトル', '分散共分散行列', '条件つき分布', '線形変換'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>多変量正規分布</strong>は、身長・体重・胸囲のように、いくつもの量の組をまとめて扱う正規分布です。
          パラメータは、各変数の平均を並べた<strong>平均ベクトル μ</strong> と、分散と共分散を並べた<strong>分散共分散行列 Σ</strong> だけ。
          その「一部だけを見る（周辺分布）」「一部が分かったときに残りを見る（条件つき分布）」「足したり引いたりする（線形変換）」のどれをしても、
          結果がまた正規分布になるのが最大の特徴です。
        </p>
      </Point>

      <Section title="2級の復習：2変量正規分布">
        <p>
          2級の<Link to="/lessons/distributions-normal-properties">「正規分布の性質」</Link>では、2つの量 <M>{'(X, Y)'}</M> の2変量正規分布を学びました。
          パラメータは <M>{'\\mu_X, \\mu_Y, \\sigma_X^2, \\sigma_Y^2, \\rho'}</M> の5つで、等高線は楕円、X を決めたときの Y の平均は回帰直線
          <M>{'\\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X)'}</M> になるのでした。このレッスンでは、これを<strong>ベクトルと行列</strong>で書き直し、3つ以上の変数に広げます。
          ベクトル・行列の計算（かけ算、転置、逆行列、行列式）は<Link to="/lessons/pre1-math-matrix">ベクトルと行列</Link>のレッスンで確認してください。
        </p>
      </Section>

      <Section title="平均ベクトルと分散共分散行列">
        <Example title="3教科のテスト">
          <p>ある学年の数学 X₁・理科 X₂・英語 X₃ の点数が、次の平均・標準偏差・相関係数をもつとします。</p>
          <DataTable
            head={['', '数学 X₁', '理科 X₂', '英語 X₃']}
            rows={[
              ['平均', '60', '55', '70'],
              ['標準偏差', '10', '12', '8'],
              ['X₁ との相関係数', '1', '0.6', '0.3'],
              ['X₂ との相関係数', '0.6', '1', '0.2'],
            ]}
          />
          <p>
            共分散は「相関係数 × 標準偏差 × 標準偏差」なので、たとえば <M>{'\\mathrm{Cov}(X_1, X_2) = 0.6 \\times 10 \\times 12 = 72'}</M>、
            <M>{'\\mathrm{Cov}(X_1, X_3) = 0.3 \\times 10 \\times 8 = 24'}</M>、<M>{'\\mathrm{Cov}(X_2, X_3) = 0.2 \\times 12 \\times 8 = 19.2'}</M>。これを並べると次のようになります。
          </p>
          <MathBlock caption="平均ベクトル μ（縦に並べる）と分散共分散行列 Σ（対角に分散、それ以外に共分散）">
            {'\\boldsymbol{\\mu} = \\begin{pmatrix} 60 \\\\ 55 \\\\ 70 \\end{pmatrix}, \\qquad \\Sigma = \\begin{pmatrix} 100 & 72 & 24 \\\\ 72 & 144 & 19.2 \\\\ 24 & 19.2 & 64 \\end{pmatrix}'}
          </MathBlock>
        </Example>
        <p>
          一般に、p 個の確率変数を縦に並べたベクトル <M>{'\\boldsymbol{X} = (X_1, \\dots, X_p)^{\\top}'}</M>（<M>{'\\top'}</M> は転置。横を縦にする記号）について、
        </p>
        <MathBlock caption="平均ベクトル：各成分の期待値を並べたもの">{'\\boldsymbol{\\mu} = E(\\boldsymbol{X}) = (E(X_1), \\dots, E(X_p))^{\\top}'}</MathBlock>
        <MathBlock caption="分散共分散行列：i 行 j 列に Xᵢ と Xⱼ の共分散（i = j なら分散）を置いたもの">
          {'\\Sigma = E\\left[(\\boldsymbol{X} - \\boldsymbol{\\mu})(\\boldsymbol{X} - \\boldsymbol{\\mu})^{\\top}\\right], \\qquad \\Sigma_{ij} = \\mathrm{Cov}(X_i, X_j)'}
        </MathBlock>
        <p>
          <M>{'\\mathrm{Cov}(X_i, X_j) = \\mathrm{Cov}(X_j, X_i)'}</M> なので Σ は<strong>対称行列</strong>です。また、どんな足し方 <M>{'a_1X_1 + \\cdots + a_pX_p'}</M> の分散も 0 以上になることから、
          Σ は<strong>正定値</strong>（0 でないどんなベクトル a でも <M>{'\\boldsymbol{a}^{\\top}\\Sigma\\boldsymbol{a} > 0'}</M>）であることが求められます（ちょうど 0 になる組み合わせがある場合は除いて考える）。
        </p>
      </Section>

      <Section title="定義・式：密度関数">
        <p>1次元の正規分布の密度と並べて見ると、何が対応しているかがわかります。</p>
        <MathBlock caption="1次元の正規分布 N(μ, σ²)">{'f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{1}{2}\\cdot\\frac{(x-\\mu)^2}{\\sigma^2}\\right)'}</MathBlock>
        <MathBlock caption="p 次元の多変量正規分布 N_p(μ, Σ)。|Σ| は行列式、Σ⁻¹ は逆行列">
          {'f(\\boldsymbol{x}) = \\frac{1}{(2\\pi)^{p/2}|\\Sigma|^{1/2}} \\exp\\left(-\\frac{1}{2}(\\boldsymbol{x}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\boldsymbol{x}-\\boldsymbol{\\mu})\\right)'}
        </MathBlock>
        <Steps>
          <li>
            <M>{'(x-\\mu)^2/\\sigma^2'}</M>（「平均から標準偏差何個分はなれているか」の2乗）が、<M>{'(\\boldsymbol{x}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\boldsymbol{x}-\\boldsymbol{\\mu})'}</M> に変わっています。
            これを<strong>マハラノビス距離</strong>の2乗といい、「ばらつきと相関を考えに入れた、平均からのはなれ具合」です。
          </li>
          <li>
            <M>{'\\sigma^2'}</M> が <M>{'|\\Sigma|'}</M> に、<M>{'2\\pi'}</M> が <M>{'(2\\pi)^p'}</M> に変わっているのは、全体の体積を 1 にするためです。
          </li>
        </Steps>
        <Example title="2変量で書き下すと">
          <p>
            p = 2 で <M>{'\\Sigma = \\begin{pmatrix} \\sigma_1^2 & \\rho\\sigma_1\\sigma_2 \\\\ \\rho\\sigma_1\\sigma_2 & \\sigma_2^2 \\end{pmatrix}'}</M> のとき、
            行列式は <M>{'|\\Sigma| = \\sigma_1^2\\sigma_2^2 - \\rho^2\\sigma_1^2\\sigma_2^2 = \\sigma_1^2\\sigma_2^2(1-\\rho^2)'}</M>、逆行列は
          </p>
          <MathBlock caption="2×2 行列の逆行列：対角を入れかえ、それ以外の符号を変えて、行列式で割る">
            {'\\Sigma^{-1} = \\frac{1}{\\sigma_1^2\\sigma_2^2(1-\\rho^2)} \\begin{pmatrix} \\sigma_2^2 & -\\rho\\sigma_1\\sigma_2 \\\\ -\\rho\\sigma_1\\sigma_2 & \\sigma_1^2 \\end{pmatrix}'}
          </MathBlock>
          <p>
            <M>{'d_i = x_i - \\mu_i'}</M> とおいて、指数の中の <M>{'(\\boldsymbol{x}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\boldsymbol{x}-\\boldsymbol{\\mu})'}</M> を計算します。
            まず行列とベクトルのかけ算、次に横ベクトルとのかけ算です（<Link to="/lessons/pre1-math-matrix">ベクトルと行列</Link>）。
          </p>
          <MathBlock caption="(d₁, d₂) と Σ⁻¹ と (d₁, d₂)ᵀ のかけ算を順に展開する。最後に分子・分母を σ₁²σ₂² で割って z_i = d_i/σ_i にそろえる">
            {'\\begin{aligned} (d_1, d_2)\\begin{pmatrix} \\sigma_2^2 & -\\rho\\sigma_1\\sigma_2 \\\\ -\\rho\\sigma_1\\sigma_2 & \\sigma_1^2 \\end{pmatrix}\\begin{pmatrix} d_1 \\\\ d_2 \\end{pmatrix} &= (d_1, d_2)\\begin{pmatrix} \\sigma_2^2 d_1 - \\rho\\sigma_1\\sigma_2 d_2 \\\\ -\\rho\\sigma_1\\sigma_2 d_1 + \\sigma_1^2 d_2 \\end{pmatrix} = \\sigma_2^2 d_1^2 - 2\\rho\\sigma_1\\sigma_2 d_1 d_2 + \\sigma_1^2 d_2^2 \\\\ (\\boldsymbol{x}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\boldsymbol{x}-\\boldsymbol{\\mu}) &= \\frac{\\sigma_2^2 d_1^2 - 2\\rho\\sigma_1\\sigma_2 d_1 d_2 + \\sigma_1^2 d_2^2}{\\sigma_1^2\\sigma_2^2(1-\\rho^2)} = \\frac{z_1^2 - 2\\rho z_1 z_2 + z_2^2}{1-\\rho^2} \\end{aligned}'}
          </MathBlock>
          <p>
            前の係数は、p = 2 なので <M>{'(2\\pi)^{2/2} = 2\\pi'}</M>、<M>{'|\\Sigma|^{1/2} = \\sigma_1\\sigma_2\\sqrt{1-\\rho^2}'}</M>。まとめると、2級で見た2変量正規分布の密度になります。
          </p>
          <MathBlock>{'f(x_1, x_2) = \\frac{1}{2\\pi\\sigma_1\\sigma_2\\sqrt{1-\\rho^2}} \\exp\\left(-\\frac{z_1^2 - 2\\rho z_1z_2 + z_2^2}{2(1-\\rho^2)}\\right)'}</MathBlock>
        </Example>
        <Figure caption="等高線は「マハラノビス距離が同じ点」を結んだ楕円。ρ を動かすと傾き、σ を動かすと縦横に伸びる">
          <MvnContour />
        </Figure>
        <Note title="楕円の向きと固有ベクトル">
          <p>
            楕円の長い軸・短い軸の向きは、Σ の<strong>固有ベクトル</strong>の向きで、軸の長さは固有値の平方根に比例します（<Link to="/lessons/pre1-math-eigen">固有値と固有ベクトル</Link>）。
            この見方は、多変量解析の章の主成分分析でそのまま使います。また、マハラノビス距離の2乗 <M>{'(\\boldsymbol{X}-\\boldsymbol{\\mu})^{\\top}\\Sigma^{-1}(\\boldsymbol{X}-\\boldsymbol{\\mu})'}</M> は
            自由度 p の χ² 分布に従います。図の楕円の中に入る確率 0.393、0.865 は、<M>{'\\chi^2(2)'}</M> で 1 以下・4 以下になる確率 <M>{'1 - e^{-1/2}'}</M>、<M>{'1 - e^{-2}'}</M> です。
          </p>
        </Note>
      </Section>

      <Section title="性質1：周辺分布は正規分布">
        <p>
          多変量正規分布から一部の変数だけを取り出すと、その分布（<strong>周辺分布</strong>）も正規分布で、平均ベクトルと分散共分散行列は<strong>その変数の部分を抜き出すだけ</strong>です。
          3教科の例なら、数学 X₁ だけなら <M>{'N(60, 100)'}</M>、数学と英語の組 <M>{'(X_1, X_3)'}</M> なら
        </p>
        <MathBlock caption="Σ の 1 行目・3 行目と 1 列目・3 列目だけを残す">{'\\begin{pmatrix} X_1 \\\\ X_3 \\end{pmatrix} \\sim N_2\\left(\\begin{pmatrix} 60 \\\\ 70 \\end{pmatrix}, \\begin{pmatrix} 100 & 24 \\\\ 24 & 64 \\end{pmatrix}\\right)'}</MathBlock>
      </Section>

      <Section title="性質2：条件つき分布も正規分布">
        <p>
          ある変数の値が分かったとき、残りの変数の分布（<strong>条件つき分布</strong>）も正規分布です。2変量のときは2級で見た式と同じです。
        </p>
        <MathBlock caption="X₁ = x₁ が分かったときの X₂ の分布。平均は回帰直線の上、分散は x₁ によらない">
          {'X_2 \\mid X_1 = x_1 \\ \\sim\\ N\\left(\\mu_2 + \\rho\\frac{\\sigma_2}{\\sigma_1}(x_1 - \\mu_1),\\ \\ \\sigma_2^2(1-\\rho^2)\\right)'}
        </MathBlock>
        <Figure caption="上の図の縦線の上にある点だけを集めると、下の図のオレンジの正規分布になる。x を動かしても山の幅（条件つき分散）は変わらず、位置（条件つき平均）だけが動く">
          <ConditionalSlice />
        </Figure>
        <Example title="数学が 75 点の人の理科">
          <p>3教科の例で、数学 X₁ = 75 点の人たちの理科 X₂ の分布を求めます（<M>{'\\mu_1 = 60, \\sigma_1 = 10, \\mu_2 = 55, \\sigma_2 = 12, \\rho = 0.6'}</M>）。</p>
          <Steps>
            <li>
              条件つき平均：<M>{'55 + 0.6 \\times \\frac{12}{10} \\times (75 - 60) = 55 + 0.72 \\times 15 = 65.8'}</M> 点
            </li>
            <li>
              条件つき分散：<M>{'144 \\times (1 - 0.36) = 92.16'}</M>、標準偏差は <M>{'\\sqrt{92.16} = 9.6'}</M> 点
            </li>
          </Steps>
          <p>数学を知ると、理科の予想の幅が 12 点から 9.6 点に狭まります。</p>
        </Example>
        <Note title="3変数以上の一般の式（読み飛ばしてよい）">
          <p>
            変数を2つのグループ <M>{'\\boldsymbol{X}_1'}</M>（知りたい側）と <M>{'\\boldsymbol{X}_2'}</M>（分かった側）に分け、μ と Σ もそれに合わせて
            <M>{'\\boldsymbol{\\mu} = (\\boldsymbol{\\mu}_1, \\boldsymbol{\\mu}_2)'}</M>、<M>{'\\Sigma = \\begin{pmatrix} \\Sigma_{11} & \\Sigma_{12} \\\\ \\Sigma_{21} & \\Sigma_{22} \\end{pmatrix}'}</M> と区切ると、
          </p>
          <MathBlock>{'\\boldsymbol{X}_1 \\mid \\boldsymbol{X}_2 = \\boldsymbol{x}_2 \\ \\sim\\ N\\left(\\boldsymbol{\\mu}_1 + \\Sigma_{12}\\Sigma_{22}^{-1}(\\boldsymbol{x}_2 - \\boldsymbol{\\mu}_2),\\ \\ \\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}\\right)'}</MathBlock>
          <p>
            1変数どうしなら <M>{'\\Sigma_{12}\\Sigma_{22}^{-1} = \\rho\\sigma_1\\sigma_2/\\sigma_2^2 = \\rho\\sigma_1/\\sigma_2'}</M> で、上の2変量の式（添字の役割を入れかえたもの）と一致します。
          </p>
        </Note>
      </Section>

      <Section title="性質3：無相関なら独立（多変量正規分布のときだけ）">
        <p>
          一般には、共分散が 0（無相関）でも独立とは限りません（<Link to="/lessons/random-variables-sum-covariance">2級</Link>）。しかし多変量正規分布では、
          Σ の非対角成分が 0 なら、密度が各変数の正規分布の密度の積に分かれるので、<strong>無相関と独立が同じ</strong>になります。
        </p>
        <MathBlock caption="ρ = 0 なら 2変量の密度は、X₁ の密度 × X₂ の密度">{'f(x_1, x_2) = \\frac{1}{\\sqrt{2\\pi}\\sigma_1}e^{-z_1^2/2} \\times \\frac{1}{\\sqrt{2\\pi}\\sigma_2}e^{-z_2^2/2}'}</MathBlock>
        <Pitfall title="「どちらも正規分布」だけでは足りない">
          <p>
            X が <M>{'N(0, 1)'}</M> に従い、S が X と独立に ±1 を半々でとるとき、<M>{'Y = SX'}</M> も <M>{'N(0, 1)'}</M> に従い、<M>{'\\mathrm{Cov}(X, Y) = E(S)E(X^2) = 0'}</M> です。
            しかし <M>{'|Y| = |X|'}</M> なので X と Y は独立ではありません。これは、X と Y はそれぞれ正規分布でも、<strong>組 (X, Y) が2変量正規分布ではない</strong>からです
            （X + Y は確率 1/2 で 0 になり、正規分布ではない）。「無相関なら独立」が使えるのは、組全体が多変量正規分布のときだけです。
          </p>
        </Pitfall>
      </Section>

      <Section title="性質4：線形変換も正規分布">
        <p>
          多変量正規分布 <M>{'\\boldsymbol{X} \\sim N_p(\\boldsymbol{\\mu}, \\Sigma)'}</M> に、q 行 p 列の行列 A をかけてベクトル b を足した <M>{'\\boldsymbol{Y} = A\\boldsymbol{X} + \\boldsymbol{b}'}</M> は、また多変量正規分布に従います。
        </p>
        <MathBlock caption="線形変換の平均と分散共分散行列。1次元の aX + b ~ N(aμ + b, a²σ²) の行列版">
          {'A\\boldsymbol{X} + \\boldsymbol{b} \\ \\sim\\ N_q\\left(A\\boldsymbol{\\mu} + \\boldsymbol{b},\\ A\\Sigma A^{\\top}\\right)'}
        </MathBlock>
        <Intuition title="AΣAᵀ は「和の分散」をまとめて計算したもの">
          <p>
            A が1行 <M>{'\\boldsymbol{a}^{\\top} = (a_1, \\dots, a_p)'}</M> だけなら、<M>{'\\boldsymbol{a}^{\\top}\\Sigma\\boldsymbol{a} = \\sum_i\\sum_j a_ia_j\\mathrm{Cov}(X_i, X_j)'}</M> で、
            これは2級で学んだ「和の分散 = 分散の和 + 2 × 共分散」をすべての組について書いたものです。たとえば <M>{'\\boldsymbol{a} = (1, 1)^{\\top}'}</M> なら
            <M>{'V(X_1 + X_2) = \\sigma_1^2 + \\sigma_2^2 + 2\\sigma_{12}'}</M>。行列にすると、何本もの和をまとめて計算できます。
          </p>
        </Intuition>
        <Example title="和と差">
          <p>
            <M>{'\\Sigma = \\begin{pmatrix} 4 & 1 \\\\ 1 & 9 \\end{pmatrix}'}</M> の2変量正規分布で、和 <M>{'Y_1 = X_1 + X_2'}</M> と差 <M>{'Y_2 = X_1 - X_2'}</M> の分散共分散行列を求めます。
            <M>{'A = \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}'}</M> とおくと（<M>{'\\boldsymbol{Y} = A\\boldsymbol{X}'}</M> の1行目が和、2行目が差）、まず <M>{'A\\Sigma'}</M> を、次に右から <M>{'A^{\\top}'}</M> を掛けます。
            ここでは A が対称なので <M>{'A^{\\top} = A'}</M> です。行列の積の i 行 j 列は「左の i 行目と右の j 列目の、成分どうしの積の和」でした。
          </p>
          <MathBlock caption="AΣ の各成分：A の行と Σ の列を掛けて足す">
            {'A\\Sigma = \\begin{pmatrix} 1 \\cdot 4 + 1 \\cdot 1 & 1 \\cdot 1 + 1 \\cdot 9 \\\\ 1 \\cdot 4 + (-1) \\cdot 1 & 1 \\cdot 1 + (-1) \\cdot 9 \\end{pmatrix} = \\begin{pmatrix} 5 & 10 \\\\ 3 & -8 \\end{pmatrix}'}
          </MathBlock>
          <MathBlock caption="(AΣ)Aᵀ の各成分：AΣ の行と Aᵀ の列を掛けて足す">
            {'(A\\Sigma)A^{\\top} = \\begin{pmatrix} 5 \\cdot 1 + 10 \\cdot 1 & 5 \\cdot 1 + 10 \\cdot (-1) \\\\ 3 \\cdot 1 + (-8) \\cdot 1 & 3 \\cdot 1 + (-8) \\cdot (-1) \\end{pmatrix} = \\begin{pmatrix} 15 & -5 \\\\ -5 & 11 \\end{pmatrix}'}
          </MathBlock>
          <p>まとめて書くと次のとおりです。</p>
          <MathBlock>{'A\\Sigma = \\begin{pmatrix} 5 & 10 \\\\ 3 & -8 \\end{pmatrix}, \\qquad A\\Sigma A^{\\top} = \\begin{pmatrix} 5 & 10 \\\\ 3 & -8 \\end{pmatrix}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix} = \\begin{pmatrix} 15 & -5 \\\\ -5 & 11 \\end{pmatrix}'}</MathBlock>
          <p>
            <M>{'V(Y_1) = 4 + 9 + 2 = 15'}</M>、<M>{'V(Y_2) = 4 + 9 - 2 = 11'}</M>、<M>{'\\mathrm{Cov}(Y_1, Y_2) = V(X_1) - V(X_2) = -5'}</M> と、和の分散の式で求めたものと一致します。
            なお <M>{'V(X_1) = V(X_2)'}</M> なら和と差の共分散は 0 になり、多変量正規分布なので<strong>和と差は独立</strong>になります。
          </p>
        </Example>
        <Figure caption="独立な標準正規分布の組（灰色、等高線は円）に行列 A をかけると、分散共分散行列 AAᵀ の楕円の雲（青）になる。逆に、どんな Σ も Σ = AAᵀ となる A を選べば作れる">
          <LinearTransform />
        </Figure>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「どの成分も正規分布なら、組は多変量正規分布」→ 成り立ちません（上の Y = SX の例）。逆に「組が多変量正規分布なら、どの成分も・どの1次結合も正規分布」は成り立ちます。
            </li>
            <li>
              線形変換の分散共分散行列を <M>{'A^{\\top}\\Sigma A'}</M> や <M>{'A^2\\Sigma'}</M> とする → 正しくは <M>{'A\\Sigma A^{\\top}'}</M>（A が左、転置が右）。大きさ（行と列の数）が合うかで確かめられます。
            </li>
            <li>
              条件つき分散が、分かった値 x によって変わると思う → 多変量正規分布では x によらず一定です（平均だけが動く）。
            </li>
            <li>
              Σ の非対角成分に相関係数を書く → 置くのは<strong>共分散</strong>（相関係数 × 標準偏差 × 標準偏差）です。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              出題範囲表（2027年1月1日からの版）の「種々の確率分布」に多変量正規分布が含まれています
              （<a href="https://www.toukei-kentei.jp/hubfs/files/20.grade/grade_range/grade1semi_hani_20270101.pdf" target="_blank" rel="noreferrer">統計検定準1級 出題範囲表</a>）。
            </li>
            <li>平均ベクトルと分散共分散行列から、1次結合（和・差・重みつきの和）の平均と分散を計算し、正規分布の確率を求める問題は、標準的な計算問題として準備しておきたい形です。</li>
            <li>2変量の条件つき平均・条件つき分散の計算、「無相関なら独立」が成り立つ条件を問う問題にも備えておきましょう。</li>
            <li>回帰分析・多変量解析・時系列解析の章でも、多変量正規分布の性質が前提として使われます。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
