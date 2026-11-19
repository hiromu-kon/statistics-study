import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Mark, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { SseValley } from '../figures/SseValley'
import { ShrinkagePlot } from '../figures/ShrinkagePlot'
import { WlsPlot } from '../figures/WlsPlot'

export const meta: LessonMeta = {
  id: 'pre1-regression-multiple',
  chapter: 'pre1-regression',
  order: 1,
  title: '重回帰の理論と変数選択・正則化',
  summary: '重回帰を行列 y = Xβ + ε で書き、β̂ = (X⊤X)⁻¹X⊤y を導きます。多重共線性、AIC・Mallows の Cp による変数選択、一般化最小二乗法、リッジとラッソも扱います。',
  minutes: 60,
  keywords: ['重回帰モデル', '決定係数', '自由度調整済み決定係数', '変数選択', '多重共線性', 'Mallows\' Cp規準', '一般化最小二乗推定', 'L1-正則化法', 'L2-正則化法'],
}

// 中古車の表の数値（係数・標準誤差・R²・Cp・AIC）は figures/carData.ts のデータを numpy で計算した値。

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          重回帰は、行列を使うと <M>{'\\boldsymbol{y} = X\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}'}</M> の1本で書けます。最小二乗法の答えは
          <M>{'\\hat{\\boldsymbol\\beta} = (X^\\top X)^{-1} X^\\top \\boldsymbol{y}'}</M>。説明変数が何個でも同じ式です。
          この式を見ると、<strong>説明変数どうしが似すぎると逆行列が不安定になる</strong>（多重共線性）こともわかります。
          さらに「どの変数を入れるか」を AIC や Mallows の <M>{'C_p'}</M> で選ぶ方法（変数選択）と、係数をわざと 0 の方へ縮める方法（正則化）を学びます。
        </p>
      </Point>

      <Section title="復習：2級で学んだ重回帰">
        <p>
          2級では、y を2つ以上の x で説明する重回帰を学びました（<Link to="/lessons/linear-models-multiple-regression">「重回帰分析」</Link>）。要点は次のとおりです。
        </p>
        <ul>
          <li>係数（偏回帰係数）は「ほかの説明変数を固定したとき、その変数が1増えると y が平均いくつ変わるか」</li>
          <li>係数の決め方は、残差の2乗の合計を最小にする<strong>最小二乗法</strong>（<Link to="/lessons/bivariate-simple-regression">単回帰の最小二乗法</Link>）</li>
          <li>
            係数の t 検定の自由度は <M>{'n - p - 1'}</M>（p は説明変数の個数。<Link to="/lessons/linear-models-regression-inference">回帰係数の検定</Link>）
          </li>
          <li>出力の読み方は <Link to="/lessons/linear-models-software-output">「統計ソフトの出力を読む」</Link></li>
        </ul>
        <p>
          準1級では、これを<strong>行列</strong>で書き直して「なぜそうなるか」を見ます。行列の掛け算・転置・逆行列は
          <Link to="/lessons/pre1-math-matrix">「ベクトルと行列」</Link>で復習してください。このレッスンでも p は説明変数の個数とします（切片を入れるとパラメータは p + 1 個）。
        </p>
      </Section>

      <Section title="行列で書く：y = Xβ + ε">
        <p>
          データが n 個、説明変数が p 個あるとき、n 本の式 <M>{'y_i = \\beta_0 + \\beta_1 x_{i1} + \\cdots + \\beta_p x_{ip} + \\varepsilon_i'}</M> を、縦に並べてまとめます。
        </p>
        <MathBlock caption="y は n 行の縦ベクトル、X は n 行 (p+1) 列の行列（1列目はすべて1で、切片の分）、β は (p+1) 行の縦ベクトル">
          {'\\underbrace{\\begin{pmatrix} y_1 \\\\ y_2 \\\\ \\vdots \\\\ y_n \\end{pmatrix}}_{\\boldsymbol{y}} = \\underbrace{\\begin{pmatrix} 1 & x_{11} & \\cdots & x_{1p} \\\\ 1 & x_{21} & \\cdots & x_{2p} \\\\ \\vdots & \\vdots & & \\vdots \\\\ 1 & x_{n1} & \\cdots & x_{np} \\end{pmatrix}}_{X} \\underbrace{\\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\\\ \\vdots \\\\ \\beta_p \\end{pmatrix}}_{\\boldsymbol\\beta} + \\underbrace{\\begin{pmatrix} \\varepsilon_1 \\\\ \\varepsilon_2 \\\\ \\vdots \\\\ \\varepsilon_n \\end{pmatrix}}_{\\boldsymbol\\varepsilon}'}
        </MathBlock>
        <p>
          X を<strong>計画行列</strong>（デザイン行列）といいます。行列の掛け算 <M>{'X\\boldsymbol\\beta'}</M> の i 行目は <M>{'\\beta_0 + \\beta_1 x_{i1} + \\cdots + \\beta_p x_{ip}'}</M> になるので、
          確かに n 本の式を1本で書けています。
        </p>
        <p>誤差についての仮定も、ベクトルで書けます。</p>
        <MathBlock caption="誤差の平均は0、分散はどれも σ²、異なる誤差どうしは無相関（I は単位行列）">{'E[\\boldsymbol\\varepsilon] = \\boldsymbol{0}, \\qquad \\mathrm{Var}[\\boldsymbol\\varepsilon] = \\sigma^2 I'}</MathBlock>
        <p>
          <M>{'\\mathrm{Var}[\\boldsymbol\\varepsilon]'}</M> は<strong>分散共分散行列</strong>で、対角に各誤差の分散、対角の外に共分散が並びます。<M>{'\\sigma^2 I'}</M> は
          「対角はすべて <M>{'\\sigma^2'}</M>、対角の外はすべて 0」という意味です。この仮定が崩れたときの方法を、あとで「一般化最小二乗法」として扱います。
        </p>
      </Section>

      <Section title="正規方程式と β̂ = (X⊤X)⁻¹X⊤y">
        <p>
          最小二乗法は、残差の2乗の合計 <M>{'S(\\boldsymbol\\beta) = \\sum (y_i - \\hat{y}_i)^2'}</M> を最小にする β を選ぶ方法でした。行列で書くと次の形です。
        </p>
        <MathBlock caption="残差ベクトル y − Xβ の長さの2乗">{'S(\\boldsymbol\\beta) = (\\boldsymbol{y} - X\\boldsymbol\\beta)^\\top (\\boldsymbol{y} - X\\boldsymbol\\beta)'}</MathBlock>
        <p>
          これを <M>{'\\beta_0, \\beta_1, \\ldots, \\beta_p'}</M> のそれぞれで偏微分して 0 とおくと（偏微分は
          <Link to="/lessons/pre1-math-multivariable">「偏微分と重積分」</Link>）、次の連立方程式が出てきます。これを<strong>正規方程式</strong>といいます。
        </p>
        <MathBlock caption="正規方程式。X⊤X は (p+1)×(p+1) の正方行列">{'X^\\top X \\hat{\\boldsymbol\\beta} = X^\\top \\boldsymbol{y}'}</MathBlock>
        <p>
          <M>{'X^\\top X'}</M> に逆行列があれば、両辺に左から <M>{'(X^\\top X)^{-1}'}</M> を掛けて答えが出ます。
        </p>
        <MathBlock caption="最小二乗推定量。何個の説明変数でもこの1つの式で求まる">{'\\hat{\\boldsymbol\\beta} = (X^\\top X)^{-1} X^\\top \\boldsymbol{y}'}</MathBlock>
        <MathNote title="単回帰で正規方程式を確かめる（式を追う練習。読み飛ばしてもよい）">
          <p>
            単回帰 <M>{'S(\\beta_0, \\beta_1) = \\sum (y_i - \\beta_0 - \\beta_1 x_i)^2'}</M> を偏微分します。合成関数の微分で、<M>{'(\\cdots)^2'}</M> の微分は <M>{'2(\\cdots)'}</M> × 中身の微分です。
          </p>
          <MathBlock caption="β0 で偏微分すると中身の微分は −1、β1 で偏微分すると −x_i">{'\\frac{\\partial S}{\\partial \\beta_0} = -2\\sum (y_i - \\beta_0 - \\beta_1 x_i) = 0, \\qquad \\frac{\\partial S}{\\partial \\beta_1} = -2\\sum x_i (y_i - \\beta_0 - \\beta_1 x_i) = 0'}</MathBlock>
          <p>−2 で割って整理すると、</p>
          <MathBlock caption="2本の連立方程式">{'n\\beta_0 + \\left(\\sum x_i\\right)\\beta_1 = \\sum y_i, \\qquad \\left(\\sum x_i\\right)\\beta_0 + \\left(\\sum x_i^2\\right)\\beta_1 = \\sum x_i y_i'}</MathBlock>
          <p>これを行列で書いたものが、ちょうど正規方程式です。</p>
          <MathBlock caption="単回帰の X⊤X と X⊤y">{'\\underbrace{\\begin{pmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{pmatrix}}_{X^\\top X} \\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix} = \\underbrace{\\begin{pmatrix} \\sum y_i \\\\ \\sum x_i y_i \\end{pmatrix}}_{X^\\top \\boldsymbol{y}}'}</MathBlock>
        </MathNote>
        <Example title="4点のデータで計算してみる">
          <p>
            x = 1, 2, 3, 4、y = 2, 3, 5, 6 の4点で、<M>{'y = \\beta_0 + \\beta_1 x'}</M> を当てはめます。
          </p>
          <Steps>
            <li>
              計画行列と y：
              <M>{'X = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\\\ 1 & 4 \\end{pmatrix}, \\ \\boldsymbol{y} = \\begin{pmatrix} 2 \\\\ 3 \\\\ 5 \\\\ 6 \\end{pmatrix}'}</M>
            </li>
            <li>
              <M>{'X^\\top X = \\begin{pmatrix} 4 & 10 \\\\ 10 & 30 \\end{pmatrix}'}</M>（n = 4、Σx = 10、Σx² = 1 + 4 + 9 + 16 = 30）
            </li>
            <li>
              <M>{'X^\\top \\boldsymbol{y} = \\begin{pmatrix} 16 \\\\ 47 \\end{pmatrix}'}</M>（Σy = 16、Σxy = 2 + 6 + 15 + 24 = 47）
            </li>
            <li>
              2×2 の逆行列は <M>{'\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}'}</M>。
              行列式は <M>{'4 \\times 30 - 10 \\times 10 = 20'}</M> なので
              <M>{'(X^\\top X)^{-1} = \\frac{1}{20}\\begin{pmatrix} 30 & -10 \\\\ -10 & 4 \\end{pmatrix} = \\begin{pmatrix} 1.5 & -0.5 \\\\ -0.5 & 0.2 \\end{pmatrix}'}</M>
            </li>
            <li>
              <M>{'\\hat{\\boldsymbol\\beta} = \\begin{pmatrix} 1.5 & -0.5 \\\\ -0.5 & 0.2 \\end{pmatrix}\\begin{pmatrix} 16 \\\\ 47 \\end{pmatrix} = \\begin{pmatrix} 24 - 23.5 \\\\ -8 + 9.4 \\end{pmatrix} = \\begin{pmatrix} 0.5 \\\\ 1.4 \\end{pmatrix}'}</M>
            </li>
          </Steps>
          <p>
            回帰式は <M>{'\\hat{y} = 0.5 + 1.4x'}</M>。2級の公式「傾き = <M>{'S_{xy}/S_{xx}'}</M>」でも、<M>{'S_{xy} = 7'}</M>、<M>{'S_{xx} = 5'}</M> より傾き 1.4、
            切片 <M>{'\\bar{y} - 1.4\\bar{x} = 4 - 3.5 = 0.5'}</M> で、同じ答えになります。
          </p>
        </Example>
        <p>行列の形にすると、最小二乗推定量の性質も一度に書けます（誤差の仮定 <M>{'\\mathrm{Var}[\\boldsymbol\\varepsilon] = \\sigma^2 I'}</M> のもとで）。</p>
        <MathBlock caption="β̂ は β の不偏推定量で、その分散共分散行列は σ²(X⊤X)⁻¹">{'E[\\hat{\\boldsymbol\\beta}] = \\boldsymbol\\beta, \\qquad \\mathrm{Var}[\\hat{\\boldsymbol\\beta}] = \\sigma^2 (X^\\top X)^{-1}'}</MathBlock>
        <ul>
          <li>
            <M>{'\\sigma^2 (X^\\top X)^{-1}'}</M> の対角成分が各係数の分散で、そのルート（σ を推定値 s に置きかえたもの）が出力の標準誤差（Std. Error）です。
          </li>
          <li>
            σ² の推定値は <M>{'s^2 = \\frac{\\sum e_i^2}{n - p - 1}'}</M>（残差平方和を残差の自由度で割る）。
          </li>
          <li>
            残差ベクトル <M>{'\\boldsymbol{e} = \\boldsymbol{y} - X\\hat{\\boldsymbol\\beta}'}</M> は <M>{'X^\\top \\boldsymbol{e} = \\boldsymbol{0}'}</M> を満たします（正規方程式を移項しただけ）。1列目が全部1なので、
            「残差の合計は0」もここから出ます。4点の例でも、残差 0.1, −0.3, 0.3, −0.1 の合計は0です。
          </li>
          <li>
            誤差の平均が0で、等分散かつ互いに無相関（上の <M>{'\\mathrm{Var}[\\boldsymbol\\varepsilon] = \\sigma^2 I'}</M>）なら、最小二乗推定量は「y の1次式で表せる（線形な）不偏推定量の中で分散が最小」になります（<strong>ガウス・マルコフの定理</strong>）。
            このような推定量を<strong>最良線形不偏推定量</strong>（英語の頭文字で BLUE）といいます。誤差が正規分布である必要も、独立である必要もありません。
          </li>
        </ul>
      </Section>

      <Section title="決定係数と自由度調整済み決定係数">
        <p>
          当てはまりの良さは<strong>決定係数</strong> <M>{'R^2'}</M> で測りました（<Link to="/lessons/bivariate-r-squared-residual">「決定係数と残差」</Link>）。
          残差平方和を <M>{'S_e = \\sum e_i^2'}</M>、全体の平方和を <M>{'S_y = \\sum (y_i - \\bar{y})^2'}</M> とすると、
        </p>
        <MathBlock caption="決定係数：y のばらつきのうち、回帰で説明できた割合">{'R^2 = 1 - \\frac{S_e}{S_y}'}</MathBlock>
        <MathBlock caption="自由度調整済み決定係数：平方和をそれぞれの自由度で割ってから比べる">{'R^{*2} = 1 - \\frac{S_e / (n - p - 1)}{S_y / (n - 1)} = 1 - (1 - R^2)\\frac{n - 1}{n - p - 1}'}</MathBlock>
        <p>
          <M>{'R^2'}</M> は、役に立たない変数を足しても<strong>決して下がりません</strong>（足した変数の係数を0にすれば元のモデルと同じなので、最小値は今より悪くならない）。
          そこで、変数の数 p が増えると <M>{'(n-1)/(n-p-1)'}</M> が大きくなって罰が入る、調整済みの <M>{'R^{*2}'}</M> を比べます。
        </p>
        <Example title="中古車の価格">
          <p>
            架空の中古車30台の価格 y（万円）を、<Mark color="c1">年数</Mark>、<Mark color="c2">走行距離</Mark>（万km）、<Mark color="c3">排気量</Mark>（L）、
            <Mark color="c4">色の番号</Mark>（1〜5。価格と関係ないはずの変数）で説明します。全部入れると <M>{'R^2 = 0.9095'}</M>、
            色を外すと <M>{'R^2 = 0.9094'}</M> でほとんど同じですが、調整済みは 0.8950 → 0.8990 と、色を外したほうが<strong>上がります</strong>。
          </p>
          <p>
            確かめ：<M>{'1 - (1 - 0.9094) \\times \\frac{29}{26} = 1 - 0.0906 \\times 1.1154 \\approx 0.899'}</M>
          </p>
        </Example>
      </Section>

      <Section title="多重共線性：X⊤X の逆行列が不安定になる">
        <p>
          <M>{'\\hat{\\boldsymbol\\beta} = (X^\\top X)^{-1}X^\\top\\boldsymbol y'}</M> には逆行列が入っています。2×2 の逆行列は「1 ÷ 行列式」を掛けるので、
          <strong>行列式が 0 に近いと、逆行列の成分がとても大きくなります</strong>。説明変数どうしの相関が強いと、まさにこれが起きます。
        </p>
        <p>
          説明変数を2つとも標準化（平均0・標準偏差1）すると、<M>{'\\frac{1}{n}X^\\top X'}</M> は相関係数 r を使って
          <M>{'\\begin{pmatrix} 1 & r \\\\ r & 1 \\end{pmatrix}'}</M> になり、行列式は <M>{'1 - r^2'}</M> です。
        </p>
        <MathBlock caption="r が 1 に近いと 1 − r² が 0 に近づき、逆行列（＝係数の分散）が大きくなる">{'\\begin{pmatrix} 1 & r \\\\ r & 1 \\end{pmatrix}^{-1} = \\frac{1}{1 - r^2}\\begin{pmatrix} 1 & -r \\\\ -r & 1 \\end{pmatrix}'}</MathBlock>
        <p>
          対角の <M>{'1/(1 - r^2)'}</M> が 2級で学んだ <strong>VIF</strong>（分散拡大係数）です。説明変数が3つ以上なら <M>{'\\mathrm{VIF}_j = 1/(1 - R_j^2)'}</M>
          （<M>{'R_j^2'}</M> は <M>{'x_j'}</M> をほかの説明変数で回帰したときの決定係数）。
        </p>
        <Figure caption="相関 r を 0.9 以上にしてみよう。残差平方和が同じになる (β1, β2) の楕円が斜めに細長くなり、「β1 を増やして β2 を減らしても、当てはまりがほとんど変わらない」状態になる">
          <SseValley />
        </Figure>
        <Intuition title="谷底が平らだと、どこが最小か決めにくい">
          <p>
            残差平方和を地形にたとえると、最小二乗推定は「谷底の一番低い点」を探すことです。x1 と x2 がほぼ同じ動きをすると、
            「x1 の効果を大きく・x2 の効果を小さく」と「その逆」で予測がほとんど変わらないので、谷が細長く平らになります。
            データが少し変わるだけで最小の点が谷に沿って大きく動く ── これが「係数が不安定」の正体です。
          </p>
        </Intuition>
        <Example title="中古車の価格で起きていること">
          <p>年数と走行距離の相関は 0.955 です。年数だけのモデルと、走行距離も入れたモデルを比べます。</p>
          <Compare>
            <Card title="年数だけ">
              <DataTable
                head={['', '推定値', '標準誤差']}
                rows={[
                  ['切片', '317.59', '10.41'],
                  ['年数', <Mark key="a" color="c1">−18.06</Mark>, <Mark key="s" color="c1">1.735</Mark>],
                ]}
              />
            </Card>
            <Card title="年数＋走行距離">
              <DataTable
                head={['', '推定値', '標準誤差']}
                rows={[
                  ['切片', '316.72', '10.45'],
                  ['年数', <Mark key="a" color="c2">−12.58</Mark>, <Mark key="s" color="c2">5.862</Mark>],
                  ['走行距離', '−5.75', '5.866'],
                ]}
              />
            </Card>
          </Compare>
          <p>
            走行距離を入れると、年数の標準誤差は 1.735 → 5.862 と約3.4倍になりました。<M>{'\\mathrm{VIF} = 1/(1 - 0.955^2) \\approx 11.4'}</M>、
            <M>{'\\sqrt{11.4} \\approx 3.4'}</M> とほぼ一致します（残差の標準誤差 s も少し変わるので、ぴったりではありません）。
            どちらの係数も t 値は約 −2.1 と −1.0 で、2つ合わせると明らかに効いているのに、1つずつ見ると「どちらの効果か」がはっきりしません。
          </p>
        </Example>
      </Section>

      <Section title="変数選択：どの説明変数を入れるか">
        <p>
          変数を入れすぎると、推定がぶれやすくなり（分散が増える）、新しいデータへの予測も悪くなりがちです。逆に必要な変数を外すと、係数がずれます（偏り）。
          そのバランスを数値で比べるのが、次のような<strong>規準</strong>です。どれも「当てはまりの良さ」と「パラメータの数への罰」の組み合わせです。
        </p>
        <Compare>
          <Card title="AIC（赤池情報量規準）">
            <MathBlock caption="小さいほど良い。L は最大尤度、k はパラメータの数">{'\\mathrm{AIC} = -2\\log L + 2k'}</MathBlock>
            <p className="small">
              最尤法（<Link to="/lessons/pre1-estimation-mle">「最尤法とモーメント法」</Link>）で当てはめたモデルならどれにも使える。誤差が正規分布の重回帰では、定数を除いて
              <M>{'n\\log(S_e/n) + 2(p+1)'}</M> と同じ順位になる。
            </p>
          </Card>
          <Card title="Mallows の Cp">
            <MathBlock caption="小さく、しかも p + 1 に近いほど良い">{'C_p = \\frac{S_e}{\\hat\\sigma^2} - n + 2(p + 1)'}</MathBlock>
            <p className="small">
              <M>{'S_e'}</M> は候補のモデルの残差平方和、<M>{'\\hat\\sigma^2'}</M> は<strong>全部の変数を入れたモデル</strong>の <M>{'s^2'}</M>。
              全部入りのモデルでは必ず <M>{'C_p = p + 1'}</M> になる。
            </p>
          </Card>
        </Compare>
        <p>
          log は自然対数です（<Link to="/lessons/pre1-math-exp-log">「指数・対数と微分」</Link>）。試験の電卓では log が計算できないので、必要な値は問題文で与えられるはずです。
        </p>
        <Example title="中古車の価格で候補のモデルを比べる">
          <p>
            全部入り（p = 4）のモデルの <M>{'\\hat\\sigma^2 = 8783.5 / (30 - 5) = 351.34'}</M> を使います。全体の平方和は <M>{'S_y = 97003.5'}</M>。
          </p>
          <DataTable
            head={['説明変数', 'p', <M key="se">{'S_e'}</M>, <M key="r2">{'R^2'}</M>, <M key="ar">{'R^{*2}'}</M>, <M key="cp">{'C_p'}</M>, 'AIC']}
            rows={[
              ['年数', '1', '19923.0', '0.7946', '0.7873', '30.71', '198.95'],
              ['年数・走行距離', '2', '19239.1', '0.8017', '0.7870', '30.76', '199.91'],
              ['年数・排気量', '2', '9967.0', '0.8973', '0.8896', '4.37', '180.18'],
              ['走行距離・排気量', '2', '10852.6', '0.8881', '0.8798', '6.89', '182.73'],
              ['年数・走行距離・排気量', '3', '8787.0', '0.9094', <Mark key="a" color="c1">0.8990</Mark>, <Mark key="c" color="c1">3.01</Mark>, <Mark key="i" color="c1">178.39</Mark>],
              ['年数・排気量・色', '3', '9955.7', '0.8974', '0.8855', '6.34', '182.14'],
              ['全部（4つ）', '4', '8783.5', <Mark key="r" color="c2">0.9095</Mark>, '0.8950', '5.00', '180.38'],
            ]}
            highlight={[4]}
            caption="AIC は n log(Se/n) + 2(p+1) で計算（R の step() が使う形）"
          />
          <Steps>
            <li>
              <M>{'R^2'}</M> だけで選ぶと、いちばん大きいのは全部入り（0.9095）。でも色の分の上がり方は 0.0001 だけです。
            </li>
            <li>調整済み <M>{'R^{*2}'}</M>・<M>{'C_p'}</M>・AIC は、そろって「年数・走行距離・排気量」を選びました。</li>
            <li>
              <M>{'C_p'}</M> の確かめ（年数・排気量）：<M>{'9967.0 / 351.34 - 30 + 2 \\times 3 = 28.37 - 24 = 4.37'}</M>。p + 1 = 3 に近い値です。
            </li>
          </Steps>
        </Example>
        <p>
          候補が多いと全部の組み合わせ（p 個なら <M>{'2^p'}</M> 通り）を調べるのは大変なので、1つずつ足し引きする<strong>ステップワイズ法</strong>がよく使われます。
        </p>
        <ul>
          <li>
            <strong>変数増加法</strong>（前進選択）：変数なしから始め、AIC が一番下がる変数を1つずつ足す。どれを足しても下がらなくなったら止める。
          </li>
          <li>
            <strong>変数減少法</strong>（後退消去）：全部入りから始め、外すと AIC が一番下がる変数を1つずつ外す。
          </li>
          <li>
            <strong>変数増減法</strong>：足す・外すの両方を毎回考える。
          </li>
        </ul>
        <p>
          中古車の例で変数増加法を行うと、「年数」（198.95）→「＋排気量」（180.18）→「＋走行距離」（178.39）→ 色を足すと 180.38 に上がるので止まる、となります。
        </p>
      </Section>

      <Section title="一般化最小二乗法：誤差の分散が一定でない・相関があるとき">
        <p>
          ここまでは <M>{'\\mathrm{Var}[\\boldsymbol\\varepsilon] = \\sigma^2 I'}</M>（等分散・無相関）を仮定していました。現実には、
        </p>
        <ul>
          <li>売上の大きい店ほど売上のぶれも大きい（<strong>分散が一定でない</strong>。不均一分散）</li>
          <li>毎月のデータで、先月のずれが今月にも残る（<strong>誤差に相関がある</strong>）</li>
        </ul>
        <p>
          ということがよくあります。誤差の分散共分散行列が <M>{'\\sigma^2 \\Sigma'}</M>（Σ はわかっている行列）のとき、次の推定量を使うのが<strong>一般化最小二乗法</strong>（GLS）です。
        </p>
        <MathBlock caption="一般化最小二乗推定量。Σ = I ならふつうの最小二乗推定量に戻る">{'\\hat{\\boldsymbol\\beta}_{\\mathrm{GLS}} = (X^\\top \\Sigma^{-1} X)^{-1} X^\\top \\Sigma^{-1} \\boldsymbol{y}'}</MathBlock>
        <p>
          考え方は「データを変換して、誤差が等分散・無相関になるようにしてから、ふつうの最小二乗法を使う」です。Σ が対角行列（相関はなく分散だけが違う）なら、
          これは各点に<strong>重み <M>{'w_i = 1/\\sigma_i^2'}</M></strong> を付けた<strong>重みつき最小二乗法</strong>（WLS）になります。
        </p>
        <MathBlock caption="重みつき最小二乗法：ばらつきの大きい点（σi² が大きい）ほど軽く扱う">{'\\sum_{i=1}^{n} \\frac{(y_i - \\beta_0 - \\beta_1 x_i)^2}{\\sigma_i^2} \\ \\to \\ \\text{min}'}</MathBlock>
        <Figure caption="誤差の標準偏差が x に比例するデータ（架空）。重み 1/x² を付けると、ばらつきの小さい左側の点を信頼する直線になる">
          <WlsPlot />
        </Figure>
        <p>
          この例では、ふつうの最小二乗法の傾きは 2.58、重みつきは 2.28（本当は 2）でした。不均一分散のとき、ふつうの最小二乗推定量も<strong>不偏</strong>ではありますが、
          分散が最小ではなくなり、出力される標準誤差も正しくなくなります。
        </p>
      </Section>

      <Section title="正則化：係数をわざと縮める">
        <p>
          多重共線性があったり、変数がデータ数に比べて多かったりすると、最小二乗推定は大きくぶれます。そこで、残差平方和に「係数が大きいことへの罰」を足して最小にする方法が
          <strong>正則化</strong>です。罰の強さを <M>{'\\lambda'}</M>（ラムダ、0 以上）で決めます。
        </p>
        <Compare>
          <Card title="リッジ回帰（L2 正則化）">
            <MathBlock caption="係数の2乗の和で罰する">{'\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 + \\lambda \\sum_{j=1}^{p} \\beta_j^2'}</MathBlock>
            <MathBlock caption="答えが式で書ける">{'\\hat{\\boldsymbol\\beta}_{\\mathrm{ridge}} = (X^\\top X + \\lambda I)^{-1} X^\\top \\boldsymbol{y}'}</MathBlock>
            <p className="small">対角に λ を足すので、X⊤X の行列式が 0 に近くても逆行列が安定する。係数は小さくなるが、ちょうど 0 にはならない。</p>
          </Card>
          <Card title="ラッソ（L1 正則化）">
            <MathBlock caption="係数の絶対値の和で罰する">{'\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 + \\lambda \\sum_{j=1}^{p} |\\beta_j|'}</MathBlock>
            <p className="small">
              答えは式で書けず、数値計算で求める。λ を大きくすると、いくつかの係数が<strong>ちょうど 0</strong> になる。つまり<strong>変数選択も同時に行う</strong>。
            </p>
          </Card>
        </Compare>
        <p>
          切片 <M>{'\\beta_0'}</M> は罰しません。また、係数の大きさは単位で変わる（円で測るか万円で測るか）ので、ふつうは<strong>説明変数を標準化してから</strong>使います。
          λ = 0 ならふつうの最小二乗法。λ はデータを分けて予測の良さを比べる<strong>交差検証</strong>（クロスバリデーション）で選ぶのが一般的です。
        </p>
        <Figure caption="中古車データ（変数をすべて標準化）。λ を動かしてみよう。ラッソでは λ ≈ 0.5 で色の番号、≈ 22 で排気量、≈ 33.5 で走行距離が 0 になり、≈ 53.5 で全部 0 になる。リッジでは小さくなるだけで 0 にはならない">
          <ShrinkagePlot />
        </Figure>
        <Intuition title="なぜラッソだけ 0 になるのか">
          <p>
            説明変数どうしが無相関で標準化してある（<M>{'X^\\top X = I'}</M>）という簡単な場合で、最小二乗推定値 <M>{'\\hat\\beta_j'}</M> と比べると、
          </p>
          <MathBlock caption="リッジは一定の割合で縮める。ラッソは一定の量だけ 0 に近づけ、届かなければ 0 で止める">{'\\hat\\beta_j^{\\mathrm{ridge}} = \\frac{\\hat\\beta_j}{1 + \\lambda}, \\qquad \\hat\\beta_j^{\\mathrm{lasso}} = \\begin{cases} \\hat\\beta_j - \\lambda/2 & (\\hat\\beta_j > \\lambda/2) \\\\ 0 & (|\\hat\\beta_j| \\le \\lambda/2) \\\\ \\hat\\beta_j + \\lambda/2 & (\\hat\\beta_j < -\\lambda/2) \\end{cases}'}</MathBlock>
          <p>
            リッジの罰 <M>{'\\beta^2'}</M> は 0 の近くで平らなので、「0 まであと少し」でも押す力が弱く、0 にはなりません。ラッソの罰 <M>{'|\\beta|'}</M> は 0 の近くでも同じ強さで押すので、
            小さい係数は 0 で止まります。
          </p>
        </Intuition>
        <Note title="リッジとラッソを混ぜる">
          <p>2種類の罰を両方足したものを<strong>エラスティックネット</strong>といいます。相関の強い変数をまとめて残しつつ、不要な変数を 0 にしたいときに使われます。</p>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「<M>{'R^2'}</M> が上がったから、その変数は役に立つ」→ <M>{'R^2'}</M> は変数を足せば必ず上がる（下がらない）。比べるなら調整済み <M>{'R^{*2}'}</M>・AIC・<M>{'C_p'}</M>。
            </li>
            <li>
              「<M>{'C_p'}</M> は小さいほど良いので、全部入りより小さければ何でも良い」→ <M>{'C_p'}</M> は p + 1 に近いことも見る。p + 1 より大きく離れていると、必要な変数が抜けて偏りがある疑い。
            </li>
            <li>
              「多重共線性があると予測が悪くなる」→ 係数の一つ一つが不安定になるのが問題で、データの範囲内の予測値そのものは安定していることが多い。
            </li>
            <li>
              「ステップワイズ法で選ばれたモデルが一番良い」→ 1つずつ足し引きするだけなので、全部の組み合わせの中の最良とは限らない。選んだ後の p 値も、選ぶ過程を考えていないぶん楽観的になる。
            </li>
            <li>
              「不均一分散だと最小二乗推定量は偏る」→ 不偏のまま。困るのは、分散が最小でなくなることと、標準誤差（だから検定や信頼区間）が正しくなくなること。
            </li>
            <li>「リッジでも係数が 0 になって変数選択ができる」→ 0 になるのはラッソ（L1）。リッジ（L2）は縮めるだけ。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              確かめられた事実：2027年1月1日からの準1級の出題範囲表では、大項目「回帰分析」に、重回帰モデル、決定係数、自由度調整済み決定係数、変数選択、残差分析、
              一般化最小二乗推定、多重共線性、L1-正則化法、L2-正則化法、Mallows' Cp 規準が「学習しておくべき用語」として挙がっています。
            </li>
            <li>
              推測：2級と同じく、統計ソフトの出力（係数表・決定係数）を読む形が中心になると考えられます。出力の一部を空欄にして、t 値・調整済み <M>{'R^2'}</M>・<M>{'C_p'}</M> などを計算させる形に備えておくとよいでしょう。
            </li>
            <li>
              候補モデルの AIC・<M>{'C_p'}</M>・調整済み <M>{'R^2'}</M> の表を見て、どのモデルが選ばれるかを答える形。log が必要な値は与えられるはずです。
            </li>
            <li>リッジとラッソの違い（どちらが係数を 0 にするか、罰の形）や、多重共線性・不均一分散のときに何が起きるかを問う知識問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
