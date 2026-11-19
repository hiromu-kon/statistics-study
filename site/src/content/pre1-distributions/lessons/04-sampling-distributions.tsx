import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { NoncentralExplorer, OrderStatExplorer, SamplingFamily } from '../figures/SamplingFigures'

export const meta: LessonMeta = {
  id: 'pre1-distributions-sampling',
  chapter: 'pre1-distributions',
  order: 4,
  title: '標本分布と順序統計量',
  summary: 't・χ²・F 分布の作り方と関係を整理し、検出力の計算に使う非心分布と、最大値・最小値・k 番目の値の分布（順序統計量）を学びます。',
  minutes: 50,
  keywords: ['t分布', 'カイ二乗分布', 'F分布', '非心分布', '順序統計量'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          t・χ²・F 分布は、どれも<strong>標準正規分布から作られる</strong>分布で、おたがいにつながっています（たとえば t 分布に従う値の2乗は F 分布に従う）。
          帰無仮説が正しくないときの検定統計量は、中心がずれた<strong>非心分布</strong>に従い、これを使うと<strong>検出力</strong>が計算できます。
          また、標本を小さい順に並べたときの最大値・最小値・k 番目の値（<strong>順序統計量</strong>）の分布も、累積分布関数から求められます。
        </p>
      </Point>

      <Section title="2級の復習：t・χ²・F 分布の作り方">
        <p>
          <M>{'Z, Z_1, \\dots, Z_m'}</M> を独立な標準正規分布 <M>{'N(0, 1)'}</M> に従う確率変数とします。2級の<Link to="/lessons/sampling-chi2-t-f">「カイ二乗分布・t分布・F分布」</Link>で学んだ作り方は次のとおりです。
        </p>
        <MathBlock caption="χ²(m)：標準正規分布の2乗を m 個足したもの">{'\\chi^2 = Z_1^2 + \\cdots + Z_m^2 \\ \\sim\\ \\chi^2(m)'}</MathBlock>
        <MathBlock caption="t(m)：標準正規分布 Z を、独立な χ²(m) を自由度で割ったもののルートで割る">{'T = \\frac{Z}{\\sqrt{V/m}} \\ \\sim\\ t(m) \\qquad (V \\sim \\chi^2(m),\\ Z \\text{ and } V \\text{ independent})'}</MathBlock>
        <MathBlock caption="F(m, n)：独立な2つの χ² を、それぞれ自由度で割ってから比をとる">{'F = \\frac{V_1/m}{V_2/n} \\ \\sim\\ F(m, n) \\qquad (V_1 \\sim \\chi^2(m),\\ V_2 \\sim \\chi^2(n))'}</MathBlock>
        <DataTable
          head={['分布', '平均', '分散', '使う場面（正規母集団のとき）']}
          rows={[
            ['χ²(m)', <M key="a">{'m'}</M>, <M key="b">{'2m'}</M>, <M key="c">{'(n-1)s^2/\\sigma^2 \\sim \\chi^2(n-1)'}</M>],
            ['t(m)', <M key="d">{'0\\ (m > 1)'}</M>, <M key="e">{'\\frac{m}{m-2}\\ (m > 2)'}</M>, <M key="f">{'(\\bar{X}-\\mu)/(s/\\sqrt{n}) \\sim t(n-1)'}</M>],
            ['F(m, n)', <M key="g">{'\\frac{n}{n-2}\\ (n > 2)'}</M>, '（式は長いので省略）', <M key="h">{'(s_1^2/\\sigma_1^2)/(s_2^2/\\sigma_2^2)'}</M>],
          ]}
          caption="t(1) は平均が存在しない（コーシー分布）。t(2) は平均 0 だが分散が存在しない"
        />
      </Section>

      <Section title="分布どうしの関係">
        <Figure caption="矢印は「この操作をするとこの分布になる」。点線は「同じ分布の別の名前」">
          <SamplingFamily />
        </Figure>
        <Steps>
          <li>
            <strong>t 分布の2乗は F(1, m)</strong>：<M>{'T^2 = \\frac{Z^2/1}{V/m}'}</M> で、分子の <M>{'Z^2'}</M> は <M>{'\\chi^2(1)'}</M> なので、定義どおり <M>{'F(1, m)'}</M> です。
            だから両側の t 検定と F 検定は同じ結論になり、パーセント点にも <M>{'F_{\\alpha}(1, m) = t_{\\alpha/2}(m)^2'}</M> の関係があります。
            例：<M>{'t_{0.025}(10)^2 = 2.228^2 \\approx 4.964'}</M>、<M>{'F_{0.05}(1, 10) = 4.965'}</M>。
          </li>
          <li>
            <strong>t(1) はコーシー分布、t(∞) は標準正規分布</strong>：自由度が大きくなると、分母の <M>{'V/m'}</M> は大数の法則で 1 に近づくので、T は Z に近づきます。
          </li>
          <li>
            <strong>χ²(m) = Ga(m/2, 2)</strong>（<Link to="/lessons/pre1-distributions-continuous">ガンマ分布</Link>）：χ²(2) は平均 2 の指数分布。χ² の再生性 <M>{'\\chi^2(m_1) + \\chi^2(m_2) = \\chi^2(m_1 + m_2)'}</M> はガンマ分布の再生性の特別な場合です。
          </li>
          <li>
            <strong>1/F も F 分布</strong>：<M>{'1/F \\sim F(n, m)'}</M>。下側のパーセント点を <M>{'F_{1-\\alpha}(m, n) = 1/F_{\\alpha}(n, m)'}</M> で求める理由です。
          </li>
          <li>
            <strong>F とベータ分布</strong>：<M>{'\\frac{mF}{mF + n} = \\frac{V_1}{V_1 + V_2}'}</M> は <M>{'Be(m/2,\\ n/2)'}</M> に従います（独立なガンマ分布 <M>{'G_1, G_2'}</M> について <M>{'G_1/(G_1+G_2)'}</M> がベータ分布になることから）。
          </li>
        </Steps>
      </Section>

      <Section title="非心分布：対立仮説が正しいときの統計量の分布">
        <p>
          検定では、「帰無仮説が正しいとき、統計量はこの分布に従う」ことを使って棄却域を決めます。では、<strong>帰無仮説が正しくないとき</strong>、統計量はどんな分布に従うでしょうか。
          それが分かれば、「本当に差があるときに、正しく棄却できる確率」＝<strong>検出力</strong>（<Link to="/lessons/testing-idea">仮説検定の考え方</Link>）が計算できます。
          このときに出てくるのが非心分布です。
        </p>
        <Example title="いちばん簡単な場合：σ が分かっている平均の検定">
          <p>
            母標準偏差 σ = 10 の正規母集団から n = 25 個取り、<M>{'H_0: \\mu = 50'}</M> 対 <M>{'H_1: \\mu > 50'}</M> を有意水準 5% で検定します。
            統計量 <M>{'Z = (\\bar{X} - 50)/(10/\\sqrt{25})'}</M> が 1.645 を超えたら棄却します。
          </p>
          <Steps>
            <li>
              本当は <M>{'\\mu = 54'}</M> だとすると、<M>{'\\bar{X} \\sim N(54, 2^2)'}</M> なので、<M>{'Z = (\\bar{X} - 50)/2'}</M> は <M>{'N(2, 1)'}</M> に従います。中心が 0 から <M>{'\\delta = (54 - 50)/2 = 2'}</M> だけずれた正規分布です。
            </li>
            <li>
              検出力は <M>{'P(Z > 1.645) = P(Z - 2 > -0.355) \\approx 0.64'}</M>（標準正規分布で −0.355 より上の確率）。
            </li>
          </Steps>
          <p>
            σ が分かっていれば「ずれた正規分布」で済みます。σ が分からず t 検定や χ² 検定・F 検定を使うときは、ずれた正規分布が t・χ²・F の作り方の中に入り込むので、
            それぞれ非心 t・非心 χ²・非心 F 分布になります。
          </p>
        </Example>
        <h3>定義・式</h3>
        <MathBlock caption="非心 χ² 分布：平均が 0 でない正規分布の2乗の和。λ を非心度という">
          {'\\sum_{i=1}^{m} X_i^2 \\ \\sim\\ \\chi^2(m, \\lambda), \\quad X_i \\sim N(\\mu_i, 1),\\ \\ \\lambda = \\sum_{i=1}^{m}\\mu_i^2'}
        </MathBlock>
        <MathBlock caption="非心 χ² 分布の平均と分散（λ = 0 なら χ²(m) の m, 2m にもどる）">{'E = m + \\lambda, \\qquad V = 2(m + 2\\lambda)'}</MathBlock>
        <MathBlock caption="非心 t 分布：分子の正規分布の中心が δ だけずれたもの">{'T = \\frac{Z + \\delta}{\\sqrt{V/m}} \\ \\sim\\ t(m, \\delta)'}</MathBlock>
        <MathBlock caption="非心 F 分布：分子の χ² が非心になったもの（分散分析の検出力で使う）">{'F = \\frac{V_1/m}{V_2/n} \\ \\sim\\ F(m, n; \\lambda) \\qquad (V_1 \\sim \\chi^2(m, \\lambda))'}</MathBlock>
        <p>
          平均の式は、<M>{'E(X_i^2) = V(X_i) + E(X_i)^2 = 1 + \\mu_i^2'}</M> を m 個足すと <M>{'m + \\lambda'}</M> になることから確かめられます。
        </p>
        <Example title="1標本の t 検定の非心度">
          <p>
            正規母集団から n 個取り、<M>{'T = (\\bar{X} - \\mu_0)/(s/\\sqrt{n})'}</M> で <M>{'H_0: \\mu = \\mu_0'}</M> を検定します。本当の平均が μ のとき、
            <M>{'\\bar{X}'}</M> を標準化した <M>{'(\\bar{X} - \\mu_0)/(\\sigma/\\sqrt{n})'}</M> は <M>{'N(\\delta, 1)'}</M> に従い、
          </p>
          <MathBlock caption="非心度 δ は「真の平均のずれが、標準誤差の何個分か」">{'\\delta = \\frac{\\mu - \\mu_0}{\\sigma/\\sqrt{n}} = \\sqrt{n}\\,\\frac{\\mu - \\mu_0}{\\sigma}, \\qquad T \\sim t(n-1, \\delta)'}</MathBlock>
          <p>
            n = 16、ずれ <M>{'(\\mu - \\mu_0)/\\sigma = 0.5'}</M> なら <M>{'\\delta = 4 \\times 0.5 = 2'}</M>。片側 5% の t 検定（境目 <M>{'t_{0.05}(15) = 1.753'}</M>）の検出力は約 0.604 です。
            σ が分かっているときの z 検定なら <M>{'P(Z > 1.645 - 2) \\approx 0.639'}</M> なので、σ を推定する分だけ検出力が少し下がります。
          </p>
        </Example>
        <Figure caption="点線が帰無仮説のもとの分布、青が対立仮説のもとの非心分布。境目より右の面積が、赤は有意水準、オレンジは検出力。n やずれを大きくすると非心分布が右へ動き、検出力が上がる">
          <NoncentralExplorer />
        </Figure>
        <Note title="非心度の書き方は本によって違う">
          <p>
            非心 χ² 分布の非心度は、ここでは <M>{'\\lambda = \\sum\\mu_i^2'}</M> としましたが、その半分 <M>{'\\sum\\mu_i^2/2'}</M> や平方根を非心度とよぶ本もあります
            （<a href="https://en.wikipedia.org/wiki/Noncentral_chi-squared_distribution" target="_blank" rel="noreferrer">Wikipedia「Noncentral chi-squared distribution」</a>にも注意書きがある）。
            平均が <M>{'m + \\lambda'}</M> になる書き方かどうかで見分けられます。非心 F 分布の非心度も、分子の非心 χ² の非心度をそのまま使うので、同じ違いがあります。
          </p>
        </Note>
        <Intuition title="非心分布の確率は表で引けない">
          <p>
            非心分布は非心度ごとに形が変わるので、ふつうの分布表には載っていません。試験で検出力を求めるときは、σ が分かっている場合のように正規分布で計算できる形や、
            正規近似が使える形で出されることが多いと考えられます。非心分布そのものは「検出力は対立仮説のもとの分布の、棄却域の面積」という考え方を支える道具だと理解しておけば十分です。
          </p>
        </Intuition>
      </Section>

      <Section title="順序統計量：最大値・最小値・k 番目の値">
        <p>
          標本 <M>{'X_1, \\dots, X_n'}</M> を小さい順に並べ替えたものを <M>{'X_{(1)} \\le X_{(2)} \\le \\cdots \\le X_{(n)}'}</M> と書き、<strong>順序統計量</strong>といいます。
          <M>{'X_{(1)}'}</M> が最小値、<M>{'X_{(n)}'}</M> が最大値、n が奇数なら真ん中の <M>{'X_{((n+1)/2)}'}</M> が中央値です。
        </p>
        <Example title="電球の寿命">
          <p>
            同じ種類の電球 3 個の寿命が独立に同じ分布に従うとします。3 個を<strong>直列</strong>につないだ照明は、どれか1つが切れたら消えるので、照明の寿命は<strong>最小値</strong>です。
            <strong>並列</strong>なら全部切れるまで点くので、寿命は<strong>最大値</strong>です。
          </p>
        </Example>
        <h3>最大値と最小値の分布</h3>
        <p>X₁, …, Xₙ が独立に同じ累積分布関数 F(x) をもつとします。</p>
        <Steps>
          <li>
            最大値が x 以下 ⇔ <strong>全員が</strong> x 以下。独立なので確率はかけ算できます：<M>{'P(X_{(n)} \\le x) = F(x)^n'}</M>。
          </li>
          <li>
            最小値が x より大きい ⇔ 全員が x より大きい：<M>{'P(X_{(1)} > x) = (1 - F(x))^n'}</M>、だから <M>{'P(X_{(1)} \\le x) = 1 - (1 - F(x))^n'}</M>。
          </li>
          <li>密度は、これを x で微分すれば得られます（<Link to="/lessons/pre1-math-derivative">微分</Link>）。</li>
        </Steps>
        <MathBlock caption="最大値と最小値の累積分布関数と密度（f は 1 個の密度）">
          {'F_{(n)}(x) = F(x)^n,\\ \\ f_{(n)}(x) = nF(x)^{n-1}f(x); \\qquad F_{(1)}(x) = 1 - (1-F(x))^n,\\ \\ f_{(1)}(x) = n(1-F(x))^{n-1}f(x)'}
        </MathBlock>
        <Example title="指数分布の最小値はまた指数分布">
          <p>
            寿命が平均 6 年の指数分布（<M>{'P(X > x) = e^{-x/6}'}</M>）の電球 3 個を直列につなぐと、<M>{'P(X_{(1)} > x) = (e^{-x/6})^3 = e^{-x/2}'}</M>。
            照明の寿命は平均 2 年の指数分布です。「3 個のうちどれかが切れる」は 3 倍の速さで起こるので、平均は 1/3 になります。
          </p>
        </Example>
        <h3>一様分布の k 番目はベータ分布</h3>
        <p>
          <M>{'U(0, 1)'}</M> では <M>{'F(x) = x'}</M> なので、最大値の密度は <M>{'nx^{n-1}'}</M>、平均は <M>{'\\int_0^1 x \\cdot nx^{n-1} dx = \\frac{n}{n+1}'}</M> です。
          一般の k 番目については、密度を次のように考えます。
        </p>
        <Intuition title="k 番目が x のあたりにある＝「下に k − 1 個、x に 1 個、上に n − k 個」">
          <p>
            n 個のそれぞれが「x より下（確率 F(x)）」「x のごく近く（確率 f(x)dx）」「x より上（確率 1 − F(x)）」のどれかに入ると考えると、これは<Link to="/lessons/pre1-distributions-discrete">多項分布</Link>です。
            「下に k − 1 個、近くに 1 個、上に n − k 個」になる確率は、多項分布の式から次のようになります。
          </p>
          <MathBlock caption="k 番目の順序統計量の密度">{'f_{(k)}(x) = \\frac{n!}{(k-1)!\\,1!\\,(n-k)!}\\, F(x)^{k-1}\\, f(x)\\, (1 - F(x))^{n-k}'}</MathBlock>
        </Intuition>
        <p>
          一様分布なら <M>{'F(x) = x,\\ f(x) = 1'}</M> を入れて <M>{'\\frac{n!}{(k-1)!(n-k)!}x^{k-1}(1-x)^{n-k}'}</M>。これはベータ分布 <M>{'Be(k, n-k+1)'}</M> の密度そのものです
          （<M>{'B(k, n-k+1) = \\frac{(k-1)!(n-k)!}{n!}'}</M>）。
        </p>
        <MathBlock caption="一様分布 U(0, 1) の k 番目の順序統計量。平均は n + 1 個の区間に等分したときの k 番目の区切り">{'U_{(k)} \\sim Be(k,\\ n - k + 1), \\qquad E(U_{(k)}) = \\frac{k}{n+1}'}</MathBlock>
        <Figure caption="n 個の一様乱数を並べたときの k 番目の値。何度もくり返したヒストグラムは、ベータ分布の曲線に重なる。k = n（最大値）にして n を増やすと、1 の近くに集まっていく">
          <OrderStatExplorer />
        </Figure>
        <Note title="推定とのつながり">
          <p>
            <M>{'U(0, \\theta)'}</M> の上端 θ を推定するとき、最大値 <M>{'X_{(n)}'}</M> は θ より必ず小さく、平均は <M>{'\\frac{n}{n+1}\\theta'}</M> です。
            そこで <M>{'\\frac{n+1}{n}X_{(n)}'}</M> とすると平均がちょうど θ になります（不偏推定量）。推定の章で、順序統計量はこうした形で出てきます。
          </p>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'T^2'}</M> の分布を <M>{'\\chi^2(1)'}</M> や <M>{'F(m, 1)'}</M> とする → 正しくは <M>{'F(1, m)'}</M>（分子が自由度 1）。
            </li>
            <li>
              <M>{'F_{0.05}(1, m) = t_{0.05}(m)^2'}</M> とする → t の側は<strong>両側</strong>の点 <M>{'t_{0.025}(m)'}</M>。<M>{'T^2 > c'}</M> は <M>{'T > \\sqrt{c}'}</M> と <M>{'T < -\\sqrt{c}'}</M> の両方を含むからです。
            </li>
            <li>
              非心 χ² の平均を <M>{'m + \\lambda/2'}</M> などと覚える → 非心度の定義の流儀で変わります。<M>{'E(X_i^2) = 1 + \\mu_i^2'}</M> から作り直すのが確実です。
            </li>
            <li>
              最大値の累積分布関数を <M>{'nF(x)'}</M> とする → 「全員が x 以下」なので<strong>かけ算</strong>の <M>{'F(x)^n'}</M> です。
            </li>
            <li>
              最小値の累積分布関数を <M>{'F(x)^n'}</M> や <M>{'(1-F(x))^n'}</M> とする → <M>{'(1-F(x))^n'}</M> は「最小値が x より大きい」確率。累積分布関数はそれを 1 から引きます。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              出題範囲表（2027年1月1日からの版）では、「種々の確率分布」に t・χ²・F 分布（非心分布を含む）が、推定の項目に順序統計量が挙げられています
              （<a href="https://www.toukei-kentei.jp/hubfs/files/20.grade/grade_range/grade1semi_hani_20270101.pdf" target="_blank" rel="noreferrer">統計検定準1級 出題範囲表</a>）。
            </li>
            <li>最大値・最小値の分布、一様分布の順序統計量の平均を求める問題は、上の「全員が x 以下」の考え方で解けます。</li>
            <li>t² = F(1, m) の関係を使ってパーセント点を読みかえる問題、検定統計量が対立仮説のもとでどの分布に従うかを問う問題に備えておきましょう。</li>
            <li>
              公式ページによると、解答に必要な統計数値表（付表1〜4）は試験会場で配布され、問題は配布される数値表だけで正答が導き出せるように作られています
              （<a href="https://www.toukei-kentei.jp/grade/grade_pre-1" target="_blank" rel="noreferrer">統計検定準1級の公式ページ</a>）。
              ふつうの数値表に非心分布は載っていないので、非心分布の確率を直接引かせる問題は考えにくい、というのがこのサイトの推測です（付表の中身までは未確認）。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
