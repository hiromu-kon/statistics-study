import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { LikelihoodSlider, MomentVsMle } from '../figures/Likelihood'

export const meta: LessonMeta = {
  id: 'pre1-estimation-mle',
  chapter: 'pre1-estimation',
  order: 2,
  title: '最尤法とモーメント法',
  summary: '「手もとのデータがいちばん出やすくなる母数」を答えるのが最尤法、「標本の平均などを母集団の平均などに合わせる」のがモーメント法です。',
  minutes: 55,
  keywords: ['最尤法', '尤度関数', '対数尤度', '最尤推定量', 'モーメント法', '最小二乗法', '線形模型', '最尤推定量の不変性'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          推定量の作り方の代表が2つあります。<strong>最尤法</strong>（さいゆうほう）は、データを固定して「母数 θ がいくつなら、<strong>このデータがいちばん出やすいか</strong>」
          を探す方法で、答えを<strong>最尤推定値</strong>といいます。計算は「対数尤度を θ で微分して 0 とおく」。
          <strong>モーメント法</strong>は、「標本平均 = 母平均の式」のように、標本から計算した平均（モーメント）を、母数で表した母集団の平均に合わせて解く方法です。
        </p>
      </Point>

      <Section title="尤度：データを固定して、母数を動かす">
        <p>
          表の出る確率 p がわからないコインを 10 回投げたら、<strong>表が 7 回</strong>出ました。p はいくつだと考えるのが自然でしょうか。
        </p>
        <p>
          ある並び（たとえば 1,1,0,1,1,1,0,1,0,1）が出る確率は <M>{'p^7(1-p)^3'}</M> です。これまでは「p を決めて、いろいろなデータの確率を考える」使い方でしたが、
          ここでは逆に<strong>データ（表 7 回）を固定して、p をいろいろ変えて</strong>みます。
        </p>
        <DataTable
          head={['p の候補', <M key="h">{'p^7(1-p)^3'}</M>, '読み方']}
          rows={[
            ['0.5', '0.000977', 'p = 0.5 のコインなら、このデータはこのくらいの確率で出る'],
            ['0.6', '0.001792', '少し大きくなった'],
            ['0.7', '0.002224', 'いちばん大きい'],
            ['0.8', '0.001678', 'また小さくなる'],
          ]}
          highlight={[2]}
          caption="同じデータ（10回中7回が表）が出る確率を、pの候補ごとに計算した"
        />
        <p>
          このように、データを固定して母数の関数として見た確率（連続分布なら確率密度）を<strong>尤度</strong>（ゆうど、もっともらしさ）といい、
          <M>{'L(\\theta)'}</M> と書きます（L は英語の likelihood〈尤度〉の頭文字）。尤度が最大になる θ が<strong>最尤推定値</strong>です。コインの例では p = 0.7（表の割合そのもの）になります。
        </p>
        <p>
          2級の<Link to="/lessons/estimation-point">推定量と推定値</Link>の区別と同じく、データの数値を入れて出た数（0.7 など）を<strong>最尤推定値</strong>、
          データを確率変数のまま書いた式（<M>{'\\hat{p} = \\sum X_i / n'}</M> など）を<strong>最尤推定量</strong>とよびます。
        </p>
        <MathBlock caption="尤度関数：n 個のデータ x₁, …, xₙ を固定し、θ の関数として見る。独立なので1個ずつの確率（密度）のかけ算">
          {'L(\\theta) = \\prod_{i=1}^{n} f(x_i;\\, \\theta) = f(x_1;\\theta) \\times f(x_2;\\theta) \\times \\cdots \\times f(x_n;\\theta)'}
        </MathBlock>
        <Figure caption="上：尤度 L(p)。データ（表の回数）を固定してpを動かすと値が変わり、山の頂上が最尤推定値。下：対数尤度 log L(p)。頂上の位置は同じ">
          <LikelihoodSlider />
        </Figure>
        <Intuition title="犯人さがしにたとえると">
          <p>
            現場に残った証拠（データ）は変えられません。容疑者（θ の候補）を1人ずつ呼んで、「あなたが犯人だったとしたら、この証拠が残る確率はどれくらい？」と聞き、
            いちばん確率が高くなる容疑者を選ぶ、というのが最尤法です。
          </p>
        </Intuition>
      </Section>

      <Section title="最尤推定量を計算する手順">
        <p>
          尤度はかけ算なので、そのまま微分すると大変です。そこで<strong>対数（log）</strong>をとります。log をとると<strong>かけ算が足し算</strong>になり、
          しかも log は「大きいほど大きい」（単調増加）関数なので、<strong>最大になる θ の位置は変わりません</strong>。log L(θ) を<strong>対数尤度</strong>といいます。
          この章の log はすべて自然対数（底が e。ln と書く本もある）です。
        </p>
        <Steps>
          <li>
            尤度を書く：<M>{'L(\\theta) = \\prod f(x_i;\\theta)'}</M>
          </li>
          <li>
            対数尤度にする：<M>{'\\ell(\\theta) = \\log L(\\theta) = \\sum_{i=1}^{n} \\log f(x_i;\\theta)'}</M>（<M>{'\\ell'}</M> は小文字のエル。<M>{'\\log(ab) = \\log a + \\log b'}</M>、<M>{'\\log a^k = k\\log a'}</M>）
          </li>
          <li>
            θ で微分して 0 とおく：<M>{'\\dfrac{d\\ell}{d\\theta} = 0'}</M>（山の頂上では傾きが 0）
          </li>
          <li>θ について解く。答えを <M>{'\\hat{\\theta}'}</M>（シータハット）と書く</li>
          <li>本当に最大か確かめる（2回微分が負なら山の頂上。端や、微分できない点も確認）</li>
        </Steps>
        <p className="muted">
          微分は <Link to="/lessons/pre1-math-derivative">微分</Link>、log の微分 <M>{'\\frac{d}{dx}\\log x = \\frac{1}{x}'}</M> は <Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link>、
          母数が2つのときの偏微分は <Link to="/lessons/pre1-math-multivariable">偏微分と重積分</Link> で確認できます。
        </p>
      </Section>

      <Section title="4つの分布で計算する">
        <Example title="ベルヌーイ分布：p̂ = 表の割合">
          <p>
            n 回中 k 回が表（<M>{'k = \\sum x_i'}</M>）のとき、<M>{'L(p) = p^{k}(1-p)^{n-k}'}</M>。
          </p>
          <Steps>
            <li>
              対数尤度：<M>{'\\ell(p) = k\\log p + (n-k)\\log(1-p)'}</M>
            </li>
            <li>
              微分：<M>{'\\dfrac{d\\ell}{dp} = \\dfrac{k}{p} - \\dfrac{n-k}{1-p}'}</M>（<M>{'\\log(1-p)'}</M> の微分は、中身の微分 −1 がかかって <M>{'-\\frac{1}{1-p}'}</M>）
            </li>
            <li>
              0 とおいて両辺に <M>{'p(1-p)'}</M> をかける：<M>{'k(1-p) - (n-k)p = 0'}</M>。展開すると <M>{'k - kp - np + kp = k - np = 0'}</M>（<M>{'kp'}</M> が消える）
            </li>
            <li>
              答え：<M>{'\\hat{p} = k/n'}</M>（10回中7回なら 0.7。表の割合そのもの）
            </li>
          </Steps>
        </Example>
        <Example title="ポアソン分布：λ̂ = 標本平均">
          <p>
            1 個分の log は <M>{'\\log \\dfrac{\\lambda^{x_i}e^{-\\lambda}}{x_i!} = x_i\\log\\lambda - \\lambda - \\log x_i!'}</M>（かけ算は足し算に、割り算は引き算に、<M>{'\\log e^{-\\lambda} = -\\lambda'}</M>）。
            これを i = 1 から n まで足すと、
          </p>
          <MathBlock caption="x_i log λ を足すと (Σx_i) log λ、−λ を n 回足すと −nλ">
            {'\\ell(\\lambda) = \\left(\\sum x_i\\right)\\log\\lambda - n\\lambda - \\sum \\log x_i!'}
          </MathBlock>
          <Steps>
            <li>
              微分：<M>{'\\dfrac{d\\ell}{d\\lambda} = \\dfrac{\\sum x_i}{\\lambda} - n'}</M>（最後の項は λ を含まないので微分すると 0）
            </li>
            <li>
              0 とおく：<M>{'\\hat{\\lambda} = \\dfrac{\\sum x_i}{n} = \\bar{x}'}</M>
            </li>
            <li>例：5日間の来店数が 2, 0, 3, 1, 4 なら、λ̂ = 10/5 = 2</li>
          </Steps>
        </Example>
        <Example title="指数分布：λ̂ = 1 / 標本平均">
          <p>
            密度 <M>{'f(x;\\lambda) = \\lambda e^{-\\lambda x}'}</M> なら、1 個分は <M>{'\\log(\\lambda e^{-\\lambda x_i}) = \\log\\lambda - \\lambda x_i'}</M> で、n 個足して <M>{'\\ell(\\lambda) = n\\log\\lambda - \\lambda\\sum x_i'}</M>。
          </p>
          <Steps>
            <li>
              微分：<M>{'\\dfrac{d\\ell}{d\\lambda} = \\dfrac{n}{\\lambda} - \\sum x_i'}</M>
            </li>
            <li>
              0 とおく：<M>{'\\hat{\\lambda} = \\dfrac{n}{\\sum x_i} = \\dfrac{1}{\\bar{x}}'}</M>
            </li>
            <li>例：待ち時間（分）が 1.2, 0.8, 2.5, 1.5 なら、x̄ = 6/4 = 1.5 で λ̂ = 1/1.5 ≒ 0.667（1分あたり 0.667 回）</li>
          </Steps>
          <p className="muted">
            指数分布は「平均 θ」で <M>{'f(x;\\theta) = \\frac{1}{\\theta}e^{-x/\\theta}'}</M> と書く流儀もあり、そのときは <M>{'\\hat{\\theta} = \\bar{x}'}</M> です。問題文の式を必ず確かめます。
          </p>
        </Example>
        <Example title="正規分布：μ̂ = 標本平均、σ̂² = n で割った分散">
          <p>母数が μ と σ² の2つなので、それぞれで偏微分して 0 とおきます（もう一方は定数とみなして微分）。</p>
          <MathBlock caption="正規分布の対数尤度">
            {'\\ell(\\mu, \\sigma^2) = -\\frac{n}{2}\\log(2\\pi\\sigma^2) - \\frac{1}{2\\sigma^2}\\sum_{i=1}^{n}(x_i - \\mu)^2'}
          </MathBlock>
          <p>
            <M>{'\\partial'}</M>（ラウンドディー）は偏微分の記号で、<M>{'\\frac{\\partial \\ell}{\\partial \\mu}'}</M> は「σ² を定数とみて、μ だけで微分する」という意味です。
          </p>
          <Steps>
            <li>
              μ で偏微分：1項目は μ を含まないので 0。2項目は <M>{'(x_i - \\mu)^2'}</M> を μ で微分すると、中身の微分 −1 がかかって <M>{'-2(x_i - \\mu)'}</M>。よって
              <M>{'\\dfrac{\\partial \\ell}{\\partial \\mu} = -\\dfrac{1}{2\\sigma^2}\\sum \\{-2(x_i - \\mu)\\} = \\dfrac{1}{\\sigma^2}\\sum (x_i - \\mu)'}</M>
            </li>
            <li>
              0 とおく：<M>{'\\sum (x_i - \\mu) = \\sum x_i - n\\mu = 0 \\Rightarrow \\hat{\\mu} = \\bar{x}'}</M>
            </li>
            <li>
              σ² で偏微分（σ² を1つの文字 v とみて、<M>{'\\ell = -\\frac{n}{2}\\log(2\\pi) - \\frac{n}{2}\\log v - \\frac{1}{2v}\\sum (x_i - \\mu)^2'}</M> と書き直す）。
              <M>{'\\log v'}</M> の微分は <M>{'\\frac{1}{v}'}</M>、<M>{'\\frac{1}{v}'}</M> の微分は <M>{'-\\frac{1}{v^2}'}</M> なので、
              <M>{'\\dfrac{\\partial \\ell}{\\partial v} = -\\dfrac{n}{2v} + \\dfrac{1}{2v^2}\\sum (x_i - \\mu)^2'}</M>
            </li>
            <li>
              0 とおいて両辺に <M>{'2v^2'}</M> をかける：<M>{'-nv + \\sum (x_i - \\mu)^2 = 0 \\Rightarrow v = \\frac{1}{n}\\sum (x_i - \\mu)^2'}</M>
            </li>
            <li>
              μ に μ̂ = x̄ を入れる：<M>{'\\hat{\\sigma}^2 = \\dfrac{1}{n}\\sum (x_i - \\bar{x})^2'}</M>
            </li>
          </Steps>
          <p>
            σ² の最尤推定量は <strong>n で割った分散</strong>で、2級で学んだ不偏分散（n − 1 で割る）とは違います。最尤推定量は不偏とは限らない、という大事な例です。
          </p>
        </Example>
        <DataTable
          head={['分布', '最尤推定量', '十分統計量との関係']}
          rows={[
            ['ベルヌーイ', <M key="a">{'\\hat{p} = \\sum X_i / n'}</M>, '合計の関数'],
            ['ポアソン', <M key="b">{'\\hat{\\lambda} = \\bar{X}'}</M>, '合計の関数'],
            ['指数（率 λ）', <M key="c">{'\\hat{\\lambda} = 1/\\bar{X}'}</M>, '合計の関数'],
            ['正規', <M key="d">{'\\hat{\\mu} = \\bar{X},\\ \\hat{\\sigma}^2 = \\frac{1}{n}\\sum (X_i - \\bar{X})^2'}</M>, '合計と2乗の和の関数'],
            ['一様 U(0, θ)', <M key="e">{'\\hat{\\theta} = X_{(n)}'}</M>, '最大値そのもの（下で説明）'],
          ]}
          caption="最尤推定量は、前のレッスンの十分統計量の関数になっている"
        />
      </Section>

      <Section title="微分が使えない例：一様分布">
        <p>
          U(0, θ) の尤度は、<M>{'L(\\theta) = 1/\\theta^{n}'}</M>（θ ≧ 最大値のとき）、0（θ &lt; 最大値のとき）でした（
          <Link to="/lessons/pre1-estimation-sufficiency">十分統計量</Link>の図）。θ ≧ 最大値の範囲では θ が小さいほど大きく、
          傾きが 0 になる点はありません。グラフを見ると、<strong>いちばん左の端 θ = 最大値</strong>で最大になります。
        </p>
        <MathBlock caption="一様分布 U(0, θ) の最尤推定量">{'\\hat{\\theta} = X_{(n)} = \\max(X_1, \\dots, X_n)'}</MathBlock>
        <p>「微分して 0」は道具の1つで、目的は「尤度を最大にする θ を見つける」ことです。範囲が θ で決まる分布では、グラフを描いて考えます。</p>
      </Section>

      <Section title="モーメント法">
        <p>
          <strong>k 次のモーメント</strong>とは <M>{'X^k'}</M> の期待値 <M>{'E(X^k)'}</M> のことで、1次のモーメントは平均です。
          母集団のモーメントは母数で表せるので、それを<strong>標本のモーメント</strong> <M>{'\\frac{1}{n}\\sum x_i^k'}</M> と等しいとおいて母数について解きます。
          母数が1つなら1次だけ、2つなら1次と2次（または平均と分散）を使います。
        </p>
        <MathBlock caption="モーメント法：母数の数だけ式を立てて解く">{'E(X^k) = \\frac{1}{n}\\sum_{i=1}^{n} x_i^k \\quad (k = 1, 2, \\dots)'}</MathBlock>
        <Example title="一様分布 U(0, θ)：最尤法と答えが違う">
          <p>
            平均は <M>{'E(X) = \\theta/2'}</M>。これを標本平均に合わせて <M>{'\\theta/2 = \\bar{x}'}</M>、よってモーメント推定量は <M>{'\\tilde{\\theta} = 2\\bar{X}'}</M>
            （モーメント推定量は <M>{'\\tilde{\\theta}'}</M>〈チルダ〉で区別して書くことがある）。
          </p>
          <p>データ 1.0, 4.2, 2.5, 6.1, 3.2 なら：</p>
          <Compare>
            <Card title="モーメント法">
              <p>
                <M>{'\\bar{x} = 17/5 = 3.4'}</M> なので <M>{'\\tilde{\\theta} = 6.8'}</M>
              </p>
            </Card>
            <Card title="最尤法">
              <p>
                最大値なので <M>{'\\hat{\\theta} = 6.1'}</M>
              </p>
            </Card>
          </Compare>
          <p>
            同じデータでも方法によって答えが違います。しかもモーメント法は、データ 0.5, 0.8, 9.0 のように「最大値が飛び抜けている」と
            <M>{'2\\bar{x} = 2 \\times 3.43 = 6.87'}</M> となり、実際に出た 9.0 より小さい θ を答えてしまいます（θ = 6.87 なら 9.0 は出ないはずなのに）。
          </p>
        </Example>
        <Figure caption="一様分布 U(0, 10) から5個とったときの、最尤推定値（最大値）とモーメント推定値（2x̄）。ボタンを何度も押すと、2x̄が最大値より小さくなる（ありえない値を答える）回が混じる">
          <MomentVsMle />
        </Figure>
        <p className="muted">
          シミュレーション（scipy・numpy、20 万回）では、U(0, 10) から 5 個とったとき 2x̄ が最大値より小さくなる割合はおよそ 2 割でした。
        </p>
        <Example title="ガンマ分布：最尤法より楽に計算できる">
          <p>
            形状 k・尺度 θ のガンマ分布は、平均 <M>{'k\\theta'}</M>、分散 <M>{'k\\theta^2'}</M> です（ガンマ分布は <Link to="/chapters/pre1-distributions">種々の確率分布</Link>）。
            平均と分散（n で割った標本分散 <M>{'S^2'}</M>）に合わせると、
          </p>
          <MathBlock caption="2本の式 kθ = x̄、kθ² = S² を割り算して解く">{'\\tilde{\\theta} = \\frac{S^2}{\\bar{x}}, \\qquad \\tilde{k} = \\frac{\\bar{x}^2}{S^2}'}</MathBlock>
          <p>
            たとえば x̄ = 6、S² = 12 なら θ̃ = 2、k̃ = 3。ガンマ分布の形状 k の最尤推定量は、式で書ける形（解析解）がなく数値計算が必要になります。
            モーメント法は「とりあえず手で計算できる」のが長所です。
          </p>
        </Example>
        <DataTable
          head={['', '最尤法', 'モーメント法']}
          rows={[
            ['考え方', 'データがいちばん出やすい母数を選ぶ', '標本の平均などを母集団の平均などに合わせる'],
            ['計算', '対数尤度を微分して 0（解けないこともある）', '連立方程式を解くだけのことが多い'],
            ['答え', '十分統計量の関数になる', '十分統計量を使わないことがある（一様分布の 2x̄）'],
            ['性質', '正則条件のもとで、n が大きいといちばん効率がよい（漸近有効。後のレッスン）', '多くの場合一致性はあるが、効率は最尤法に劣ることがある'],
            ['同じになる例', '正規分布の μ と σ²（n で割る）、ポアソンの λ、指数分布の λ', '同左'],
          ]}
          caption="2つの方法のくらべ"
        />
      </Section>

      <Section title="最尤推定量の不変性">
        <p>
          最尤推定量には便利な性質があります。θ の最尤推定量が <M>{'\\hat{\\theta}'}</M> なら、θ の関数 <M>{'g(\\theta)'}</M> の最尤推定量は、
          <M>{'\\hat{\\theta}'}</M> をそのまま入れた <M>{'g(\\hat{\\theta})'}</M> です。これを<strong>不変性</strong>といいます。
        </p>
        <MathBlock caption="最尤推定量の不変性：母数を変換したら、推定値も同じように変換すればよい">{'\\widehat{g(\\theta)} = g(\\hat{\\theta})'}</MathBlock>
        <Example title="使い方">
          <ul>
            <li>
              正規分布の標準偏差 σ の最尤推定量は <M>{'\\hat{\\sigma} = \\sqrt{\\hat{\\sigma}^2}'}</M>。
            </li>
            <li>
              ポアソン分布で「1日に1人も来ない確率」<M>{'P(X = 0) = e^{-\\lambda}'}</M> の最尤推定量は <M>{'e^{-\\bar{x}}'}</M>。x̄ = 2 なら <M>{'e^{-2} \\approx 0.135'}</M>。
            </li>
            <li>
              指数分布の平均 <M>{'1/\\lambda'}</M> の最尤推定量は <M>{'1/\\hat{\\lambda} = \\bar{x}'}</M>。
            </li>
            <li>
              ベルヌーイ分布のオッズ <M>{'p/(1-p)'}</M> の最尤推定量は <M>{'\\hat{p}/(1-\\hat{p}) = k/(n-k)'}</M>。
            </li>
          </ul>
        </Example>
        <p className="muted">
          不偏性にはこの性質はありません。不偏分散 s² は σ² の不偏推定量ですが、そのルート s は σ の不偏推定量ではありません（平均すると σ より少し小さい）。
        </p>
      </Section>

      <Section title="最小二乗法と線形模型（最尤法とのつながり）">
        <p>
          2級の<Link to="/lessons/bivariate-simple-regression">回帰直線</Link>は、残差の2乗和を最小にする<strong>最小二乗法</strong>で求めました。
          <M>{'y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i'}</M> のように「母数について1次式＋誤差」で表すモデルを<strong>線形模型</strong>（線形モデル）といいます。
          誤差 <M>{'\\varepsilon_i'}</M> が独立に正規分布 <M>{'N(0, \\sigma^2)'}</M> に従うとすると、対数尤度は
        </p>
        <MathBlock caption="正規誤差の線形模型の対数尤度。β を含むのは最後の項だけ">
          {'\\ell(\\beta_0, \\beta_1, \\sigma^2) = -\\frac{n}{2}\\log(2\\pi\\sigma^2) - \\frac{1}{2\\sigma^2}\\sum_{i=1}^{n}(y_i - \\beta_0 - \\beta_1 x_i)^2'}
        </MathBlock>
        <p>
          β を動かして ℓ を最大にすることは、マイナスがついた残差の2乗和を<strong>最小</strong>にすることと同じです。
          つまり<strong>誤差が正規分布なら、最小二乗推定量と最尤推定量は一致</strong>します。
          重回帰の最小二乗法の行列による計算や性質は <Link to="/chapters/pre1-regression">回帰分析</Link>の章で扱います。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「尤度は θ の確率」→ 尤度は「θ がこの値なら、このデータが出る確率」で、θ が正しい確率ではありません。θ について足し合わせて（積分して）も 1 になるとは限りません。
            </li>
            <li>「log をとると最大の位置が変わる」→ log は単調増加なので、最大になる θ は同じです。値（高さ）は変わります。</li>
            <li>
              「最尤推定量は不偏」→ 正規分布の σ̂²（n で割る）は期待値が <M>{'\\frac{n-1}{n}\\sigma^2'}</M> で、不偏ではありません。一様分布の最大値も θ より小さめです。
            </li>
            <li>「微分して 0 とおけば必ず最尤推定値」→ 一様分布のように、端で最大になることがあります。2回微分の符号や端も確認します。</li>
            <li>指数分布の λ̂ を x̄ と答える → 率 λ（密度 λe^(−λx)）なら 1/x̄、平均 θ（密度 e^(−x/θ)/θ）なら x̄。書き方で答えが変わります。</li>
            <li>「最尤法とモーメント法はいつも同じ答え」→ 正規・ポアソン・指数では同じですが、一様分布では違います。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>事実：出題範囲表（2027年1月1日からの版）の推定の項目に、最尤法・モーメント法・最小二乗法・線形模型が用語として挙がっています。</li>
            <li>
              予想（公式の発表ではない）：分布の密度（確率関数）が与えられて、最尤推定量やモーメント推定量の式を選ぶ問題、実際のデータから推定値を計算する数値入力問題が考えられます。
              不変性を使って「P(X = 0) の最尤推定値」のように変換した量を問う形にも備えます。
            </li>
            <li>普通電卓では e や log の値が計算できないので、必要な値は問題文で与えられるはずです。式の変形（log をとって微分）を手で素早くできるようにしておきます。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
