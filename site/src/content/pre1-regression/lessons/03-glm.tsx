import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Mark, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import { Curve, HLine, Plot, VLine } from '../../../components/charts/Plot'
import type { LessonMeta } from '../../../types'
import { LinearProbPlot } from '../figures/LinearProbPlot'
import { LogisticCurve } from '../figures/LogisticCurve'
import { LogisticSummary, PoissonSummary } from '../figures/GlmOutput'
import { PoissonPlot } from '../figures/PoissonPlot'

export const meta: LessonMeta = {
  id: 'pre1-regression-glm',
  chapter: 'pre1-regression',
  order: 3,
  title: 'ロジスティック回帰・ポアソン回帰と一般化線形モデル',
  summary: '合否（0/1）や件数のように、正規分布で表しにくい結果を回帰する方法です。係数は e^β（オッズ比・率の比）にして読みます。',
  minutes: 55,
  keywords: ['ロジスティック回帰モデル', 'プロビットモデル', 'ポアソン回帰モデル', '一般化線形モデル'],
}

// 出力の数値は figures/glmData.ts のデータを numpy のニュートン法で最尤推定し、scipy で p 値を計算した値。

function LogitCurvePlot() {
  return (
    <Plot x={[0, 1]} y={[-5, 5]} xLabel="確率 p" yLabel="ロジット log(p/(1−p))" xTicks={[0, 0.25, 0.5, 0.75, 1]} yTicks={[-4, -2, 0, 2, 4]}>
      <HLine y={0} color="muted" />
      <VLine x={0.5} color="muted" />
      <Curve f={(p) => Math.log(p / (1 - p))} from={0.0067} to={0.9933} color="c1" />
    </Plot>
  )
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          「合格したか（1）しなかったか（0）」「1年間の事故の件数」のような結果は、正規分布の誤差を足した直線ではうまく表せません。
          そこで、<strong>平均（確率や平均件数）を変換したもの</strong>を直線で表します。合否なら<strong>ロジット</strong> <M>{'\\log\\frac{p}{1-p}'}</M>（ロジスティック回帰）、
          件数なら<strong>対数</strong> <M>{'\\log\\mu'}</M>（ポアソン回帰）。これらをまとめた枠組みが<strong>一般化線形モデル</strong>（GLM）です。
          係数は <M>{'e^{\\beta}'}</M> にすると、「1増えるとオッズが何倍」「件数が何倍」と読めます。
        </p>
      </Point>

      <Section title="0/1 の結果に直線を当てはめると困ること">
        <p>
          20人の勉強時間 x（時間）と、資格試験の合否 y（合格 = 1、不合格 = 0）の架空のデータです。2級で学んだ最小二乗法の直線
          （<Link to="/lessons/bivariate-simple-regression">「最小二乗法と回帰直線」</Link>）をそのまま当てはめると、次のようになります。
        </p>
        <DataTable
          head={['時間', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5']}
          rows={[['合否', '0', '0', '0', '0', '0', '0', '0', '1', '0', '1']]}
        />
        <DataTable
          head={['時間', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10']}
          rows={[['合否', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1']]}
        />
        <Figure caption="直線（オレンジ）は 0.5 時間で −0.10、10 時間で 1.10 と、確率としてありえない値になる。ロジスティック回帰（青）は 0 と 1 の間におさまる S 字">
          <LinearProbPlot />
        </Figure>
        <ul>
          <li>予測値が 0 未満や 1 より大きくなる（確率として意味がない）</li>
          <li>y は 0 か 1 しかとらないので、誤差は正規分布にならない</li>
          <li>
            y が 1 になる確率を p とすると分散は <M>{'p(1-p)'}</M> で、p によって変わる（等分散でない）
          </li>
        </ul>
      </Section>

      <Section title="ロジスティック回帰：確率をオッズの対数で表す">
        <p>
          確率 p は 0 から 1 の間しかとれませんが、直線 <M>{'\\beta_0 + \\beta_1 x'}</M> はどんな値にもなります。そこで、p を <M>{'-\\infty'}</M> から <M>{'\\infty'}</M> まで広げる変換を挟みます。
        </p>
        <Steps>
          <li>
            <strong>オッズ</strong> <M>{'\\frac{p}{1-p}'}</M>：「起きる確率 ÷ 起きない確率」。p = 0.8 ならオッズは 4（4対1で起きる）。0 から <M>{'\\infty'}</M> の値をとる。
          </li>
          <li>
            <strong>ロジット</strong> <M>{'\\log\\frac{p}{1-p}'}</M>：オッズの自然対数。<M>{'-\\infty'}</M> から <M>{'\\infty'}</M> の値をとり、p = 0.5 で 0 になる。
          </li>
        </Steps>
        <Figure caption="ロジット関数。p が 0 に近いと −∞ へ、1 に近いと +∞ へ伸びる">
          <LogitCurvePlot />
        </Figure>
        <MathBlock caption="ロジスティック回帰モデル：ロジットを x の直線で表す">{'\\log\\frac{p(x)}{1 - p(x)} = \\beta_0 + \\beta_1 x'}</MathBlock>
        <MathBlock caption="p について解いた形（ロジスティック関数）。どんな x でも 0 < p < 1 になる">{'p(x) = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1 x)}} = \\frac{e^{\\beta_0 + \\beta_1 x}}{1 + e^{\\beta_0 + \\beta_1 x}}'}</MathBlock>
        <MathNote title="ロジットから p を解く（指数と対数の計算。くわしくは「指数・対数と微分」）">
          <p>
            <M>{'\\eta = \\beta_0 + \\beta_1 x'}</M> とおきます。<M>{'\\log\\frac{p}{1-p} = \\eta'}</M> の両辺を e の肩に乗せると <M>{'\\frac{p}{1-p} = e^{\\eta}'}</M>。
            分母を払って <M>{'p = e^{\\eta}(1 - p)'}</M>、p を集めて <M>{'p(1 + e^{\\eta}) = e^{\\eta}'}</M>、よって <M>{'p = \\frac{e^{\\eta}}{1 + e^{\\eta}}'}</M>。
            分子と分母を <M>{'e^{\\eta}'}</M> で割ると <M>{'\\frac{1}{1 + e^{-\\eta}}'}</M> です（<Link to="/lessons/pre1-math-exp-log">「指数・対数と微分」</Link>）。
          </p>
        </MathNote>
        <p>
          係数は最小二乗法ではなく<strong>最尤法</strong>で決めます（<Link to="/lessons/pre1-estimation-mle">「最尤法とモーメント法」</Link>）。合否を「成功確率 <M>{'p(x_i)'}</M> のベルヌーイ分布」と考えると、
          尤度は次の形です。式で解けないので、ソフトはニュートン法などの繰り返し計算で最大の点を探します。
        </p>
        <MathBlock caption="対数尤度。合格した人は log p、不合格の人は log(1 − p) を足す">{'\\log L(\\beta_0, \\beta_1) = \\sum_{i=1}^{n} \\left\\{ y_i \\log p(x_i) + (1 - y_i)\\log(1 - p(x_i)) \\right\\}'}</MathBlock>
        <Figure caption="スライダーで β0・β1 を動かしてみよう。どこに動かしても、最尤推定値（β0 = −4.57、β1 = 0.87）より対数尤度が小さくなる">
          <LogisticCurve />
        </Figure>
      </Section>

      <Section title="係数の読み方：e^β はオッズ比">
        <p>当てはめた結果は <M>{'\\log\\frac{p}{1-p} = -4.5718 + 0.8708x'}</M> でした。</p>
        <p>
          x が1増えると、ロジット（オッズの対数）が <M>{'\\beta_1'}</M> だけ増えます。対数で <M>{'\\beta_1'}</M> 増えるということは、オッズが <M>{'e^{\\beta_1}'}</M> 倍になるということです。
        </p>
        <MathBlock caption="x が1増えたときのオッズの比（オッズ比）。x がいくつのときでも同じ">{'\\frac{\\text{odds}(x + 1)}{\\text{odds}(x)} = \\frac{e^{\\beta_0 + \\beta_1(x+1)}}{e^{\\beta_0 + \\beta_1 x}} = e^{\\beta_1}'}</MathBlock>
        <Example title="勉強時間の例">
          <Steps>
            <li>
              <M>{'e^{0.8708} \\approx 2.39'}</M>：勉強時間が1時間増えると、合格の<strong>オッズ</strong>が約 2.39 倍になる。
            </li>
            <li>
              5時間なら <M>{'\\eta = -4.5718 + 0.8708 \\times 5 = -0.2178'}</M>、<M>{'p = 1/(1 + e^{0.2178}) = 1/(1 + 1.243) \\approx 0.446'}</M>。
            </li>
            <li>
              7時間なら <M>{'\\eta = 1.5238'}</M>、<M>{'p = 1/(1 + e^{-1.5238}) = 1/(1 + 0.218) \\approx 0.821'}</M>。
            </li>
            <li>
              合格の確率がちょうど 0.5 になるのは <M>{'\\eta = 0'}</M> のとき、つまり <M>{'x = 4.5718 / 0.8708 \\approx 5.25'}</M> 時間。
            </li>
          </Steps>
          <p>
            5時間 → 7時間で確率は 0.446 → 0.821 と増えますが、「確率が 2.39² 倍」にはなっていません。<strong>何倍になるのはオッズ</strong>で、確率ではありません。
          </p>
        </Example>
        <Intuition title="確率の増え方は場所によって違う">
          <p>
            S 字の曲線は、真ん中（p = 0.5 付近）では急で、端（p が 0 や 1 の近く）では平らです。だから「1時間増やすと確率がいくつ増えるか」は x によって変わります。
            どこでも同じなのは「オッズが何倍になるか」のほうです。
          </p>
        </Intuition>
      </Section>

      <Section title="プロビットモデルとの違い">
        <p>
          ロジスティック関数の代わりに、標準正規分布の分布関数 <M>{'\\Phi'}</M> で S 字を作るのが<strong>プロビットモデル</strong>です。
        </p>
        <Compare>
          <Card title="ロジスティック（ロジット）">
            <MathBlock caption="リンク関数はロジット">{'\\log\\frac{p}{1-p} = \\beta_0 + \\beta_1 x'}</MathBlock>
          </Card>
          <Card title="プロビット">
            <MathBlock caption="リンク関数は Φ の逆関数">{'\\Phi^{-1}(p) = \\beta_0 + \\beta_1 x, \\quad p = \\Phi(\\beta_0 + \\beta_1 x)'}</MathBlock>
          </Card>
        </Compare>
        <ul>
          <li>
            どちらも「見えない量 <M>{'y^* = \\beta_0 + \\beta_1 x + \\varepsilon'}</M> が 0 を超えたら y = 1」と考えられます。ε が標準正規分布ならプロビット、ロジスティック分布ならロジットです。
          </li>
          <li>
            曲線の形はよく似ていて、当てはまりもふつうはほとんど変わりません。ただしロジスティック分布の標準偏差は <M>{'\\pi/\\sqrt{3} \\approx 1.81'}</M> で正規分布より大きいので、
            同じデータでも<strong>ロジットの係数のほうが大きく</strong>出ます（およそ 1.6〜1.8 倍。この例では <M>{'0.8708 / 0.5227 \\approx 1.67'}</M>）。
          </li>
          <li>
            プロビットの係数は <M>{'e^{\\beta}'}</M> をとってもオッズ比にはなりません。オッズ比で説明したいときはロジットを使います。
          </li>
        </ul>
        <p>上の図の「プロビットと比べる」ボタンで、2本の曲線がほとんど重なることを確かめてください。</p>
      </Section>

      <Section title="ポアソン回帰：件数を対数で表す">
        <p>
          15か所の交差点（架空）の交通量 x（千台/日）と1年間の事故件数 y です。件数は 0, 1, 2, … の整数で、平均が大きいほどばらつきも大きくなるので、
          <strong>ポアソン分布</strong>（<Link to="/lessons/distributions-poisson">「ポアソン分布」</Link>）で表すのが自然です。ポアソン分布の平均 μ は正の数なので、対数をとって直線で表します。
        </p>
        <MathBlock caption="ポアソン回帰モデル：y はポアソン分布にしたがい、その平均の対数が x の直線">{'y_i \\sim \\mathrm{Po}(\\mu_i), \\qquad \\log \\mu_i = \\beta_0 + \\beta_1 x_i, \\qquad \\mu_i = e^{\\beta_0 + \\beta_1 x_i}'}</MathBlock>
        <Figure caption="交通量を動かすと、その交通量での平均件数 μ と、件数の分布（右）が変わる。平均が大きいほど分布の幅も広い">
          <PoissonPlot />
        </Figure>
        <p>
          当てはめた結果は <M>{'\\log\\mu = 0.2845 + 0.1253x'}</M>。x が1増えると <M>{'\\log\\mu'}</M> が 0.1253 増えるので、平均件数は <M>{'e^{0.1253} \\approx 1.133'}</M> 倍。
          「交通量が1千台/日増えるごとに、事故件数は平均で約 13% 増える」と読めます。<M>{'e^{\\beta}'}</M> は<strong>率の比</strong>（rate ratio）と呼ばれます。
          5千台増えるなら <M>{'e^{5 \\times 0.1253} = e^{0.6265} \\approx 1.87'}</M> 倍です（13% × 5 = 65% ではない）。
        </p>
        <Note title="観測した長さが違うとき（オフセット）">
          <p>
            交差点によって観測期間 t が違うなら、件数そのものではなく「1年あたりの率」を比べたいはずです。<M>{'\\log \\mu_i = \\log t_i + \\beta_0 + \\beta_1 x_i'}</M> のように、
            係数をつけない <M>{'\\log t_i'}</M> の項（<strong>オフセット</strong>）を入れると、<M>{'\\mu_i / t_i'}</M>（率）をモデルにできます。
          </p>
        </Note>
      </Section>

      <Section title="一般化線形モデル：3つの部品">
        <p>ここまでのモデルは、すべて次の3つの部品の組み合わせとして書けます。これが<strong>一般化線形モデル</strong>（Generalized Linear Model, GLM）です。</p>
        <DataTable
          head={['部品', '意味', '重回帰', 'ロジスティック回帰', 'ポアソン回帰']}
          rows={[
            ['① 分布（ランダム成分）', 'y がしたがう分布', '正規分布', '二項分布（ベルヌーイ）', 'ポアソン分布'],
            ['② 線形予測子', <M key="eta">{'\\eta = \\beta_0 + \\beta_1 x_1 + \\cdots + \\beta_p x_p'}</M>, '同じ', '同じ', '同じ'],
            [
              '③ リンク関数',
              <>
                平均 μ と η をつなぐ <M>{'g(\\mu) = \\eta'}</M>
              </>,
              <>
                恒等 <M>{'\\mu'}</M>
              </>,
              <>
                ロジット <M>{'\\log\\frac{\\mu}{1-\\mu}'}</M>
              </>,
              <>
                対数 <M>{'\\log\\mu'}</M>
              </>,
            ],
          ]}
        />
        <ul>
          <li>ふつうの重回帰は「正規分布 ＋ 恒等リンク」の GLM です。</li>
          <li>分布は、正規・二項・ポアソン・ガンマなどの<strong>指数型分布族</strong>から選びます。表の3つのリンクは、それぞれの分布の<strong>正準リンク</strong>と呼ばれる自然な組み合わせです。</li>
          <li>推定は最尤法。ソフトは「重みつき最小二乗法を、重みを更新しながら繰り返す」方法（反復重みつき最小二乗法。R ではフィッシャーのスコア法と呼び、出力の最後に繰り返しの回数 Number of Fisher Scoring iterations が表示される）で計算します。</li>
        </ul>
      </Section>

      <Section title="出力の読み方：z 検定・逸脱度・AIC">
        <p>統計ソフト R で、合否のデータにロジスティック回帰を当てはめると、次のような出力になります。</p>
        <LogisticSummary />
        <DataTable
          head={['出力の表記', '意味', 'この例']}
          rows={[
            [<Mark key="e" color="c1">Estimate</Mark>, '係数の推定値（ロジットの単位）', '傾き 0.8708 → オッズ比 e^0.8708 ≈ 2.39'],
            [<Mark key="s" color="c2">Std. Error</Mark>, '推定値の標準誤差（フィッシャー情報量から求める）', '0.3608'],
            [<Mark key="z" color="c3">z value</Mark>, '推定値 ÷ 標準誤差。H0: β = 0 のもとで近似的に標準正規分布', '0.8708 ÷ 0.3608 ≈ 2.414'],
            [<Mark key="p" color="c4">{'Pr(>|z|)'}</Mark>, '両側 p 値（正規分布で計算）', '0.0158 < 0.05 で 5% 有意'],
            ['Null deviance', '定数項だけのモデルの逸脱度（自由度 n − 1）', '27.726（自由度 19）'],
            ['Residual deviance', '当てはめたモデルの逸脱度（自由度 n − p − 1）', '14.369（自由度 18）'],
            ['AIC', '−2 log L + 2 ×（パラメータ数）', '18.369'],
          ]}
        />
        <Steps>
          <li>
            <strong>z 検定</strong>：線形回帰の t 値と同じ形ですが、GLM では「データが多ければ正規分布に近い」ことを使うので、t 分布ではなく<strong>標準正規分布</strong>と比べます
            （ワルド検定）。<M>{'|z| = 2.414 > 1.96'}</M> なので、5% で <M>{'H_0: \\beta_1 = 0'}</M> を棄却。
          </li>
          <li>
            <strong>オッズ比の信頼区間</strong>：まず β の区間 <M>{'0.8708 \\pm 1.96 \\times 0.3608 = (0.164, 1.578)'}</M> を作り、両端を e の肩に乗せて <M>{'(e^{0.164}, e^{1.578}) \\approx (1.18, 4.84)'}</M>。1 を含まない。
          </li>
          <li>
            <strong>逸脱度</strong>（deviance）：<M>{'D = 2(\\log L_{\\text{sat}} - \\log L)'}</M>。<M>{'L_{\\text{sat}}'}</M> は「データにぴったり合わせた」飽和モデルの尤度で、
            D は「飽和モデルからどれだけ当てはまりが悪いか」。正規分布の重回帰の残差平方和にあたります。
          </li>
          <li>
            <strong>尤度比検定</strong>：2つの逸脱度の差は、<M>{'H_0'}</M>（追加した変数の係数がすべて 0）のもとで近似的に<strong>自由度 = パラメータ数の差の χ² 分布</strong>にしたがいます。
            <M>{'27.726 - 14.369 = 13.357 > \\chi^2_{0.05}(1) = 3.841'}</M> なので、勉強時間はモデルに役立っている、と判断します。
          </li>
          <li>
            <strong>AIC</strong>：モデル選びに使います（小さいほど良い。<Link to="/lessons/pre1-regression-multiple">「重回帰の理論と変数選択・正則化」</Link>）。0/1 のデータでは飽和モデルの対数尤度が 0 なので、
            AIC = 逸脱度 + 2 × パラメータ数 = <M>{'14.369 + 2 \\times 2 = 18.369'}</M> になります。
          </li>
        </Steps>
        <p>ポアソン回帰の出力も、読み方は同じです。</p>
        <PoissonSummary />
        <ul>
          <li>
            交通量の係数 0.12530、z = 4.192、p 値 <M>{'2.76 \\times 10^{-5}'}</M>：1% でも有意。率の比は <M>{'e^{0.1253} \\approx 1.133'}</M>。
          </li>
          <li>
            逸脱度の差 <M>{'28.157 - 9.038 = 19.119 > 3.841'}</M>。尤度比検定でも有意です。
          </li>
          <li>
            残差の逸脱度 9.038 が自由度 13 と比べて大きすぎない（目安として「逸脱度 ÷ 自由度」が 1 を大きく超えない）ことも見ます。大きく超えるときは、
            ポアソン分布で想定するよりばらつきが大きい<strong>過分散</strong>を疑います。
          </li>
          <li>
            ポアソン分布では飽和モデルの対数尤度が 0 にならないので、AIC（61.338）は「逸脱度 + 2 × 2」にはなりません。
          </li>
        </ul>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「ロジスティック回帰の係数 0.87 は、1増えると確率が 0.87 増えること」→ 増えるのは<strong>ロジット</strong>（オッズの対数）。<M>{'e^{0.87} \\approx 2.39'}</M> が<strong>オッズ</strong>の倍率。
            </li>
            <li>「オッズが 2.39 倍 ＝ 確率が 2.39 倍」→ 確率が小さいときは近いが、一般には違う。p = 0.446 のオッズを 2.39 倍しても、確率は 0.66 で、2.39 倍の 1.07 にはならない。</li>
            <li>「GLM の係数の検定は t 分布」→ R の glm の出力（二項・ポアソン）は z 値と正規分布。</li>
            <li>
              「ポアソン回帰で x が5増えると件数は <M>{'5\\beta'}</M> × 100% 増える」→ 倍率は <M>{'e^{5\\beta}'}</M>。足し算ではなく掛け算で効く。
            </li>
            <li>「逸脱度は小さいほど良いので、変数を足して逸脱度が下がったら採用」→ 変数を足せば逸脱度は必ず下がる（少なくとも上がらない）。逸脱度の差の χ² 検定や AIC で比べる。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              確かめられた事実：2027年1月1日からの準1級の出題範囲表の「回帰分析」に、ロジスティック回帰モデル、プロビットモデル、ポアソン回帰モデル、一般化線形モデルが挙がっています。
            </li>
            <li>
              推測：R の glm のような出力を示して、係数の有意性（z 値）、オッズ比 <M>{'e^{\\beta}'}</M>、ある x での確率、逸脱度の差による検定を問う形が考えられます。
              普通電卓では e^x が計算できないので、必要な値は問題文で与えられるはずです。
            </li>
            <li>ロジスティック回帰の確率 <M>{'p = 1/(1 + e^{-\\eta})'}</M> を数値で答える問題（数値入力）への備えとして、η の計算 → 与えられた e の値 → 割り算、の流れに慣れておきましょう。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
