import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DeltaMethodPlot } from '../figures/DeltaMethodPlot'
import { MaxGumbel } from '../figures/MaxGumbel'
import { SmallNumbers } from '../figures/SmallNumbers'

export const meta: LessonMeta = {
  id: 'pre1-probability-limits',
  chapter: 'pre1-probability',
  order: 6,
  title: '極限定理と漸近理論',
  summary: '「n を大きくすると、どう近づくか」を扱います。3種類の収束（概収束・確率収束・分布収束）の違い、大数の弱法則、少数法則、中心極限定理と正規近似、連続写像定理・スルツキーの補題・デルタ法、極値分布の雰囲気を学びます。',
  minutes: 55,
  keywords: [
    '概収束',
    '確率収束',
    '大数の弱法則',
    '分布収束',
    '少数法則',
    '中心極限定理',
    '二項分布の正規近似',
    'ポアソン分布の正規近似',
    '連続修正',
    '極値分布',
    '連続写像定理',
    'スルツキーの補題',
    'デルタ法',
  ],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          推定量や検定統計量の正確な分布は、たいてい複雑で求められません。そこで「<strong>標本の大きさ n が大きいとき、どんな分布に近づくか</strong>」を使って近似します。
          これが<strong>漸近理論</strong>です。道具は次の3段です。
        </p>
        <ol>
          <li>
            <strong>大数の法則</strong>：標本平均は母平均に近づく（確率収束）。
          </li>
          <li>
            <strong>中心極限定理</strong>：標本平均のずれを <M>{'\\sqrt{n}'}</M> 倍すると、正規分布に近づく（分布収束）。
          </li>
          <li>
            <strong>連続写像定理・スルツキーの補題・デルタ法</strong>：近づくことがわかった量を、関数に入れたり、組み合わせたりしても、近づく先がわかる。
          </li>
        </ol>
      </Point>

      <Section title="3つの収束">
        <p>
          数の列なら「<M>{'a_n \\to a'}</M>」の意味は1つですが、確率変数の列 <M>{'X_1, X_2, \\dots'}</M> では「近づく」の意味がいくつかあります。
        </p>
        <MathBlock caption="概収束（ほとんど確実な収束）：ほぼすべての「結果の道筋」で、数列として X に近づく">{'P\\left(\\lim_{n \\to \\infty} X_n = X\\right) = 1'}</MathBlock>
        <MathBlock caption="確率収束：どんな小さな幅 ε を決めても、ε より離れる確率が 0 に近づく">{'\\lim_{n \\to \\infty} P(|X_n - X| > \\varepsilon) = 0 \\quad (\\text{for every } \\varepsilon > 0)'}</MathBlock>
        <MathBlock caption="分布収束（法則収束）：累積分布関数が近づく（F が連続な点で）。値どうしは近くなくてよい">{'\\lim_{n \\to \\infty} F_{X_n}(x) = F_X(x)'}</MathBlock>
        <DataTable
          head={['収束', '何が近づくか', '例']}
          rows={[
            ['概収束', '1つ1つの結果の道筋（実現値の数列）', '大数の強法則：標本平均の道筋が μ に近づく'],
            ['確率収束', '「大きく外れる確率」が 0 に', '大数の弱法則：標本平均が μ に確率収束'],
            ['分布収束', '分布の形（累積分布関数）', '中心極限定理：標準化した標本平均が N(0, 1) に'],
          ]}
        />
        <MathBlock caption="強さの関係（矢印の向きにだけ言える）">{'\\text{a.s.} \\ \\Rightarrow\\ \\text{in probability} \\ \\Rightarrow\\ \\text{in distribution}'}</MathBlock>
        <p>
          逆向きは一般には成り立ちません。ただし<strong>定数 c への分布収束は、c への確率収束と同じ</strong>です
          （<a href="https://bookdown.org/egarpor/NP-UC3M/intro-stoch.html" target="_blank" rel="noreferrer">E. García-Portugués「Stochastic convergence review」</a>などの講義資料で確認）。
        </p>
        <Compare>
          <Card title="分布収束しても、確率収束しない例">
            <p>
              Z を標準正規分布として、すべての n で <M>{'X_n = -Z'}</M> とします。<M>{'-Z'}</M> も標準正規分布なので、<M>{'X_n'}</M> の分布は Z の分布とまったく同じ（分布収束）。
              しかし <M>{'|X_n - Z| = 2|Z|'}</M> は n をいくら大きくしても小さくならないので、Z には確率収束しません。<strong>分布収束は「形」だけの話</strong>です。
            </p>
          </Card>
          <Card title="確率収束しても、概収束しない例（読み飛ばしてよい）">
            <p>
              <M>{'X_n'}</M> を、確率 1/n で 1、それ以外で 0 になる独立な確率変数とします。<M>{'P(|X_n| > \\varepsilon) = 1/n \\to 0'}</M> なので 0 に確率収束します。
              しかし 1/n の和は無限大なので、ほとんどすべての道筋で 1 が「いつまでもときどき」出てしまい、数列として 0 に収束しません。
            </p>
          </Card>
        </Compare>
      </Section>

      <Section title="大数の弱法則（チェビシェフの不等式から）">
        <p>
          平均 μ、分散 σ² の独立な確率変数の標本平均 <M>{'\\bar{X}_n'}</M> は、平均 μ、分散 <M>{'\\sigma^2/n'}</M> です。2級で学んだ<strong>チェビシェフの不等式</strong>
          <M>{'P(|X - \\mu| \\ge k) \\le V[X]/k^2'}</M>（<Link to="/lessons/sampling-lln-clt">大数の法則と中心極限定理</Link>）を、<M>{'\\bar{X}_n'}</M> に使います。
        </p>
        <MathBlock caption="大数の弱法則：右辺が n → ∞ で 0 になるので、標本平均は μ に確率収束する">{'P(|\\bar{X}_n - \\mu| \\ge \\varepsilon) \\le \\frac{\\sigma^2}{n\\varepsilon^2} \\ \\longrightarrow\\ 0'}</MathBlock>
        <p>
          たとえば σ = 1、ε = 0.1 なら、n = 10000 で右辺は <M>{'1/(10000 \\times 0.01) = 0.01'}</M>。「標本平均が μ から 0.1 以上ずれる確率は 1% 以下」と、分布の形を知らなくても言えます。
          さらに強く、標本平均の道筋そのものが μ に近づく（概収束する）ことを言うのが<strong>大数の強法則</strong>です。
        </p>
      </Section>

      <Section title="少数法則：二項分布からポアソン分布へ">
        <p>
          「1日に交差点で起きる事故の件数」のように、<strong>回数 n はとても多いが、1回あたりに起きる確率 p はとても小さい</strong>とき、件数はほぼポアソン分布にしたがいます。
          平均 <M>{'np = \\lambda'}</M> を一定にしたまま n を大きくした極限で、二項分布がポアソン分布になる、という定理を<strong>少数法則</strong>（少数の法則）といいます（<Link to="/lessons/distributions-poisson">2級のポアソン分布</Link>）。
        </p>
        <MathBlock caption="少数法則：np = λ を一定にして n → ∞ とすると、二項分布の確率がポアソン分布の確率に近づく">{'{}_n C_k \\left(\\frac{\\lambda}{n}\\right)^k \\left(1 - \\frac{\\lambda}{n}\\right)^{n-k} \\ \\longrightarrow\\ \\frac{\\lambda^k e^{-\\lambda}}{k!}'}</MathBlock>
        <MathNote title="なぜそうなるか">
          <p>
            <M>{'{}_n C_k = \\frac{n(n-1)\\cdots(n-k+1)}{k!}'}</M> と <M>{'\\left(\\frac{\\lambda}{n}\\right)^k = \\frac{\\lambda^k}{n^k}'}</M> を並べかえて、左辺を
            <M>{'\\frac{\\lambda^k}{k!} \\times \\frac{n(n-1)\\cdots(n-k+1)}{n^k} \\times \\left(1 - \\frac{\\lambda}{n}\\right)^{n} \\times \\left(1 - \\frac{\\lambda}{n}\\right)^{-k}'}</M> と分けます。
            n → ∞ で、2つ目は <M>{'1 \\times \\left(1 - \\frac{1}{n}\\right) \\times \\cdots \\times \\left(1 - \\frac{k-1}{n}\\right)'}</M> と書けるので 1 に、3つ目は <M>{'e^{-\\lambda}'}</M> に（<M>{'(1 + a/n)^n \\to e^{a}'}</M> を a = −λ で使う）、
            4つ目は k が決まった数なので 1 に近づきます。
          </p>
          <p>
            <M>{'(1 + a/n)^n \\to e^{a}'}</M> の理由：対数をとると <M>{'n\\log\\left(1 + \\frac{a}{n}\\right)'}</M>。n が大きいと a/n は 0 に近いので、
            <Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link>の近似 <M>{'\\log(1 + x) \\approx x'}</M> から <M>{'n \\times \\frac{a}{n} = a'}</M> に近づきます。対数が a に近づくので、もとの値は <M>{'e^{a}'}</M> に近づきます。
            積率母関数で見ても、<M>{'(1 - p + pe^t)^n = \\left(1 + \\frac{\\lambda(e^t - 1)}{n}\\right)^n \\to e^{\\lambda(e^t - 1)}'}</M> とポアソン分布の積率母関数になります。
          </p>
        </MathNote>
        <Figure caption="平均 λ を固定して n を増やすと、二項分布（青）がポアソン分布（オレンジ）にほとんど重なる">
          <SmallNumbers />
        </Figure>
        <Example title="不良品の数">
          <p>
            不良率 0.4% の製品を 500 個調べたときの不良品の数は <M>{'B(500, 0.004)'}</M>。平均 <M>{'\\lambda = 500 \\times 0.004 = 2'}</M> のポアソン分布で近似すると、
            不良品が 0 個の確率は <M>{'e^{-2} \\approx 0.135'}</M>。二項分布で正確に計算すると <M>{'0.996^{500} \\approx 0.135'}</M> で、ほぼ同じです。
          </p>
        </Example>
      </Section>

      <Section title="中心極限定理と正規近似">
        <MathBlock caption="中心極限定理：平均 μ・分散 σ² の独立同分布なら、どんな分布でも、標準化した標本平均は標準正規分布に分布収束する">{'\\frac{\\sqrt{n}(\\bar{X}_n - \\mu)}{\\sigma} \\ \\xrightarrow{d}\\ N(0, 1)'}</MathBlock>
        <p>
          矢印の上の d は「分布収束」の意味です。2級で学んだ<Link to="/lessons/sampling-normal-approximation">二項分布の正規近似と連続修正</Link>は、二項分布が「0 か 1 の和」であることにこの定理を使ったものでした。
          ポアソン分布も同じように正規近似できます。λ が整数なら、平均 λ のポアソン分布は「平均 1 のポアソン分布 λ 個の独立な和」と見られるので（<Link to="/lessons/pre1-probability-mgf">再生性</Link>）、
          λ が大きいと <M>{'N(\\lambda, \\lambda)'}</M> で近似できます（λ が整数でなくても、λ → ∞ で同じ近似が成り立ちます）。
        </p>
        <Example title="ポアソン分布の正規近似（連続修正つき）">
          <p>1時間あたりの問い合わせ件数 X が平均 25 のポアソン分布にしたがうとき、<M>{'P(X \\ge 30)'}</M> を近似します。</p>
          <Steps>
            <li>
              正規近似：平均 25、分散 25（標準偏差 5）の正規分布。
            </li>
            <li>
              連続修正：X は整数なので「30 以上」は、連続な値では「29.5 以上」とみなす（30 の棒は 29.5〜30.5 を受け持つ）。
            </li>
            <li>
              <M>{'P(X \\ge 30) \\approx P\\left(Z \\ge \\frac{29.5 - 25}{5}\\right) = P(Z \\ge 0.9) = 0.1841'}</M>。
            </li>
          </Steps>
          <p>
            ポアソン分布で正確に計算すると 0.1821 です。連続修正をしないと <M>{'P(Z \\ge 1.0) = 0.1587'}</M> で、ずれが大きくなります。
          </p>
        </Example>
      </Section>

      <Section title="連続写像定理とスルツキーの補題">
        <p>
          収束がわかった量を、関数に入れたり、ほかの量と組み合わせたりしたときにも、収束先がわかると便利です。そのための2つの定理です。
        </p>
        <MathBlock caption="連続写像定理：連続な関数 g に入れても、同じ種類の収束が保たれる">{'X_n \\to X \\ \\Rightarrow\\ g(X_n) \\to g(X)'}</MathBlock>
        <p>
          たとえば標準化した標本平均 <M>{'Z_n'}</M> が N(0, 1) に分布収束するなら、<M>{'Z_n^2'}</M> は <M>{'Z^2'}</M>、つまり自由度 1 のカイ二乗分布に分布収束します。
          また標本分散 <M>{'S_n^2'}</M> が <M>{'\\sigma^2'}</M> に確率収束するなら、<M>{'S_n = \\sqrt{S_n^2}'}</M> も σ に確率収束します。
        </p>
        <MathBlock caption="スルツキーの補題：分布収束するものと、定数に確率収束するものは、足したりかけたり割ったりしてよい">{'X_n \\xrightarrow{d} X,\\ \\ Y_n \\xrightarrow{p} c \\ \\Rightarrow\\ X_n + Y_n \\xrightarrow{d} X + c,\\quad X_n Y_n \\xrightarrow{d} cX,\\quad \\frac{X_n}{Y_n} \\xrightarrow{d} \\frac{X}{c}\\ (c \\ne 0)'}</MathBlock>
        <Example title="σ のかわりに S を使ってよい理由">
          <p>
            母分散が未知で n が大きいとき、2級では「<M>{'\\bar{x} \\pm 1.96\\,s/\\sqrt{n}'}</M> で近似してよい」と学びました（<Link to="/lessons/estimation-ci-mean">母平均の区間推定</Link>）。その根拠がスルツキーの補題です。
          </p>
          <MathBlock>{'\\frac{\\sqrt{n}(\\bar{X}_n - \\mu)}{S_n} = \\underbrace{\\frac{\\sqrt{n}(\\bar{X}_n - \\mu)}{\\sigma}}_{\\xrightarrow{d} N(0,1)} \\times \\underbrace{\\frac{\\sigma}{S_n}}_{\\xrightarrow{p} 1} \\ \\xrightarrow{d}\\ N(0, 1)'}</MathBlock>
          <p>
            前半は中心極限定理、後半は大数の法則と連続写像定理（<M>{'S_n \\to \\sigma'}</M> なので <M>{'\\sigma/S_n \\to 1'}</M>）。母集団が正規分布でなくても、n が大きければ標準正規分布で近似できます。
          </p>
        </Example>
      </Section>

      <Section title="デルタ法：関数に入れたときのばらつき">
        <p>
          標本平均そのものではなく、<M>{'\\log \\bar{X}'}</M> や <M>{'\\bar{X}^2'}</M>、比率の対数オッズ <M>{'\\log\\frac{\\hat{p}}{1 - \\hat{p}}'}</M> のような「関数に入れた値」の標準誤差がほしいことがよくあります。
          n が大きいと <M>{'\\bar{X}'}</M> は μ のすぐ近くにあるので、その狭い範囲では g を<strong>接線（直線）で近似</strong>できます。
        </p>
        <MathBlock caption="1次の近似（接線）。g′(μ) は μ での傾き">{"g(\\bar{X}) \\approx g(\\mu) + g'(\\mu)(\\bar{X} - \\mu)"}</MathBlock>
        <p>
          この式は、<Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link>で学んだ1次近似 <M>{"f(x) \\approx f(a) + f'(a)(x - a)"}</M> の a を μ、x を <M>{'\\bar{X}'}</M> にしたものです。
          直線で近似できれば、ばらつきは「傾き倍」になるだけです（<M>{'g(\\mu)'}</M> と <M>{"g'(\\mu)"}</M> は定数なので、<M>{'V[a + bX] = b^2V[X]'}</M> から
          <M>{"V[g(\\bar{X})] \\approx g'(\\mu)^2 V[\\bar{X}] = g'(\\mu)^2\\frac{\\sigma^2}{n}"}</M>）。ずれを √n 倍して中心極限定理と合わせ、極限の言葉で書いたのが<strong>デルタ法</strong>です。
        </p>
        <MathBlock caption="デルタ法：g が μ で微分できて g′(μ) ≠ 0 なら、g(標本平均) も正規分布に近づき、分散は g′(μ)² 倍になる">{"\\sqrt{n}\\big(g(\\bar{X}_n) - g(\\mu)\\big) \\ \\xrightarrow{d}\\ N\\big(0,\\ g'(\\mu)^2\\sigma^2\\big)"}</MathBlock>
        <Example title="比率の対数オッズの標準誤差">
          <p>
            n 人の調査で「はい」の比率 <M>{'\\hat{p}'}</M> は、平均 p・分散 <M>{'p(1-p)/n'}</M> で、n が大きいと正規分布に近い（<M>{'\\hat{p}'}</M> は 0 か 1 の標本平均）。
            ロジスティック回帰などで使う<strong>対数オッズ</strong> <M>{'g(p) = \\log\\frac{p}{1-p}'}</M> のばらつきを求めます。
          </p>
          <Steps>
            <li>
              微分：<M>{'g(p) = \\log p - \\log(1-p)'}</M> なので <M>{"g'(p) = \\frac{1}{p} + \\frac{1}{1-p} = \\frac{1}{p(1-p)}"}</M>（<Link to="/lessons/pre1-math-exp-log">対数の微分</Link>）。
            </li>
            <li>
              デルタ法：分散は <M>{'\\left(\\frac{1}{p(1-p)}\\right)^2 \\times \\frac{p(1-p)}{n} = \\frac{1}{np(1-p)}'}</M>。
            </li>
            <li>
              数値：n = 400、<M>{'\\hat{p} = 0.2'}</M> なら、標準誤差は <M>{'\\frac{1}{\\sqrt{400 \\times 0.2 \\times 0.8}} = \\frac{1}{\\sqrt{64}} = 0.125'}</M>。
            </li>
          </Steps>
        </Example>
        <Figure caption="青い横の帯（p̂ のばらつき）が、曲線 g でオレンジの縦の帯に移る。n を大きくして帯を狭くすると、曲線は帯の中でほぼ接線（破線）に重なり、縦の帯の幅 ≒ 傾き × 横の帯の幅になる">
          <DeltaMethodPlot />
        </Figure>
        <Intuition title="p が 0 や 1 に近いと、対数オッズは大きくぶれる">
          <p>
            対数オッズの曲線は p = 0.5 の近くでは傾きがゆるく（傾き 4）、p が 0 や 1 に近づくと急になります。同じ <M>{'\\hat{p}'}</M> のぶれでも、
            p = 0.1 なら傾き約 11 倍に拡大されます。上の図で p を動かすと、縦の帯の幅の変わり方が見えます。
          </p>
        </Intuition>
        <Note title="デルタ法の注意">
          <ul>
            <li>
              <M>{"g'(\\mu) = 0"}</M> のときは、右辺の分散が 0 になり、この形のままでは使えない（2次の項まで見る必要がある）。
            </li>
            <li>あくまで n が大きいときの近似。n が小さく、g の曲がりが強いところでは粗い。</li>
          </ul>
        </Note>
      </Section>

      <Section title="極値分布の雰囲気">
        <p>
          平均ではなく<strong>最大値</strong>（1年でいちばん多い雨量、いちばん大きな損失など）の分布を考えるのが極値の理論です。独立に同じ分布 F にしたがう n 個の最大値 <M>{'M_n'}</M> は、
          「全部が x 以下」のときに x 以下になるので、
        </p>
        <MathBlock caption="独立な n 個の最大値の累積分布関数">{'P(M_n \\le x) = P(X_1 \\le x, \\dots, X_n \\le x) = F(x)^n'}</MathBlock>
        <p>
          F(x) が 1 より小さければ <M>{'F(x)^n'}</M> は 0 に向かうので、そのままでは最大値は無限大へ逃げていきます。適当にずらして（縮めて）見ると、
          決まった形の分布に近づくことが知られていて、その極限の分布を<strong>極値分布</strong>といいます。
        </p>
        <Example title="指数分布の最大値とガンベル分布">
          <p>
            平均 1 の指数分布なら <M>{'F(x) = 1 - e^{-x}'}</M>。最大値を <M>{'\\log n'}</M> だけずらすと、
            <M>{'P(M_n - \\log n \\le x) = P(M_n \\le x + \\log n) = F(x + \\log n)^n'}</M>。ここで <M>{'e^{-(x + \\log n)} = e^{-x} \\times e^{-\\log n} = \\frac{e^{-x}}{n}'}</M> なので、
            <M>{'F(x + \\log n)^n = \\left(1 - \\frac{e^{-x}}{n}\\right)^n \\to \\exp(-e^{-x})'}</M>（<M>{'(1 + a/n)^n \\to e^a'}</M> を <M>{'a = -e^{-x}'}</M> で使う）。
            この極限 <M>{'\\exp(-e^{-x})'}</M> を累積分布関数とする分布が<strong>ガンベル分布</strong>です
            （<a href="https://en.wikipedia.org/wiki/Gumbel_distribution" target="_blank" rel="noreferrer">Wikipedia「Gumbel distribution」</a>）。
          </p>
        </Example>
        <Figure caption="n 個の最大値から log n を引いたものの密度（青）。n を増やすと、灰色の破線のガンベル分布に近づく">
          <MaxGumbel />
        </Figure>
        <p className="muted">
          極値分布にはガンベル分布のほかに、フレシェ分布・ワイブル分布の型があります。準1級の範囲表には「極値分布」という用語が挙がっていますが、どこまで深く問われるかは確認できていません。まずは「最大値の分布は F(x)^n」「ずらすとガンベル分布などに近づく」を押さえておけば十分と考えます（推測）。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>分布収束すれば値も近づく → 分布収束は形が近づくだけ。<M>{'X_n = -Z'}</M> の例。</li>
            <li>中心極限定理は「標本そのもの（1つ1つのデータ）が正規分布に近づく」→ 近づくのは<strong>標本平均（和）の分布</strong>。データの分布はもとのまま。</li>
            <li>
              デルタ法で分散を <M>{"g'(\\mu)\\sigma^2"}</M> にする → 傾きは<strong>2乗</strong>してかける（<M>{"g'(\\mu)^2\\sigma^2"}</M>）。
            </li>
            <li>スルツキーの補題で、Y_n の収束先が定数でないのに使う → 確率変数に収束する Y_n では、かけ算の極限は一般にはわからない。</li>
            <li>連続修正の向きをまちがえる → 「30 以上」は 29.5 から、「30 以下」は 30.5 まで。整数の棒の幅 1 の端を使う。</li>
            <li>少数法則は「データが少ないときの法則」→ 「起きる確率が小さい（まれな）事象の回数」の法則。n はむしろ大きい。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              事実：準1級の出題範囲表（2027年1月1日版）では、概収束、確率収束、大数の弱法則、分布収束、少数法則、中心極限定理、二項分布・ポアソン分布の正規近似、連続修正、極値分布、連続写像定理、スルツキーの補題、デルタ法が学習しておくべき用語に挙がっている。
            </li>
            <li>推測：収束の強さの関係や、例が「どの収束か」を選ぶ問題。</li>
            <li>推測：二項分布をポアソン分布や正規分布（連続修正つき）で近似して確率を求める計算問題。e の値は問題文で与えられる。</li>
            <li>推測：デルタ法で、比率・平均を変換した推定量（対数オッズ、対数、平方根など）の漸近分散や標準誤差を求める問題。推定の章の最尤推定量の漸近正規性とも組み合わせて出やすいと考えられる。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
