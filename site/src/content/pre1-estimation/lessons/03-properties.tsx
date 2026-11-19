import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BiasVarianceTradeoff, MeanVsMedian } from '../figures/Properties'

export const meta: LessonMeta = {
  id: 'pre1-estimation-properties',
  chapter: 'pre1-estimation',
  order: 3,
  title: '推定量の良さ',
  summary: '推定量の良さは「平均二乗誤差 = バイアス² + 分散」で測ります。不偏性・一致性・有効性・相対効率と、ガウス・マルコフの定理、クラーメル・ラオの不等式を学びます。',
  minutes: 55,
  keywords: ['バイアス', '平均二乗誤差', 'バイアス・バリアンス分解', '不偏性', '一致性', '有効性', '相対効率', 'ガウス・マルコフの定理', 'クラーメル・ラオの不等式'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          推定量のずれの大きさは<strong>平均二乗誤差</strong>（MSE）＝「推定値と本当の値の差の2乗」の平均で測り、
          <strong>MSE = バイアス² + 分散</strong>に分けられます（バイアス・バリアンス分解）。不偏推定量（バイアス 0）どうしなら分散が小さいほど良く（有効性）、
          <strong>クラーメル・ラオの不等式</strong>は「不偏推定量の分散はこれより小さくできない」という<strong>下限</strong>を教えてくれます。
        </p>
      </Point>

      <Section title="2級の復習と、この先の問題">
        <p>
          2級では、的当てのたとえで不偏性（平均すると真ん中に当たる）・有効性（ばらつきが小さい）・一致性（n を増やすと真の値に近づく）を学びました（
          <Link to="/lessons/estimation-point">点推定と推定量の性質</Link>）。
          前のレッスンで推定量の作り方がいくつもあるとわかったので、「どれが良いか」をきちんと比べる物差しが必要です。
        </p>
        <Example title="一様分布の θ を推定する3つの推定量">
          <p>U(0, θ) から 5 個とるとき、θ = 10 として 3 つの推定量を比べます（式の導き方は下の MathNote）。</p>
          <DataTable
            head={['推定量', '期待値', 'バイアス', '分散', 'MSE']}
            rows={[
              [<M key="a">{'2\\bar{X}'}</M>, '10', '0', '6.67', '6.67'],
              [<M key="b">{'X_{(5)}'}</M>, '8.33', '−1.67', '1.98', '4.76'],
              [<M key="c">{'\\frac{6}{5}X_{(5)}'}</M>, '10', '0', '2.86', '2.86'],
            ]}
            highlight={[2]}
            caption="n = 5、θ = 10。期待値と分散は理論式から、MSE はシミュレーション（20万回）でも確かめた"
          />
          <p>
            <M>{'2\\bar{X}'}</M>（モーメント推定量）は不偏ですが分散が大きく、最大値 <M>{'X_{(5)}'}</M>（最尤推定量）は小さめにずれますがばらつきが小さく、
            最大値を少し大きく直した <M>{'\\frac{6}{5}X_{(5)}'}</M> は不偏で分散も小さい。3つ目がいちばん良さそうです。
            この「ずれ」と「ばらつき」を1つの物差しにまとめたのが MSE です。
          </p>
        </Example>
        <MathNote title="一様分布の最大値の期待値と分散（読み飛ばしてよい）">
          <p>
            最大値が m 以下 ⇔ n 個すべてが m 以下なので、<M>{'P(X_{(n)} \\le m) = (m/\\theta)^n'}</M>。微分すると密度 <M>{'n m^{n-1}/\\theta^n'}</M>（0 ≦ m ≦ θ）。
            これを積分すると <M>{'E(X_{(n)}) = \\frac{n}{n+1}\\theta'}</M>、<M>{'V(X_{(n)}) = \\frac{n\\theta^2}{(n+1)^2(n+2)}'}</M>。
            n = 5、θ = 10 なら期待値 8.33、分散 1.98。<M>{'\\frac{n+1}{n}X_{(n)}'}</M> の分散は <M>{'\\frac{\\theta^2}{n(n+2)} = \\frac{100}{35} \\approx 2.86'}</M>。
            一方 <M>{'V(2\\bar{X}) = 4 \\cdot \\frac{\\theta^2}{12n} = \\frac{100}{15} \\approx 6.67'}</M>（一様分布の分散は θ²/12）。積分は <Link to="/lessons/pre1-math-integral">積分</Link>で確認できます。
          </p>
        </MathNote>
      </Section>

      <Section title="バイアスと平均二乗誤差">
        <MathBlock caption="バイアス（偏り）：推定量の期待値が、本当の値からどれだけずれているか">{'\\operatorname{Bias}(\\hat{\\theta}) = E(\\hat{\\theta}) - \\theta'}</MathBlock>
        <MathBlock caption="平均二乗誤差（MSE）：推定値と本当の値の差の2乗の平均">{'\\operatorname{MSE}(\\hat{\\theta}) = E\\big[(\\hat{\\theta} - \\theta)^2\\big]'}</MathBlock>
        <p>MSE は次のように「ずれ」と「ばらつき」に分けられます。これを<strong>バイアス・バリアンス分解</strong>といいます（バリアンス＝分散）。</p>
        <MathBlock caption="バイアス・バリアンス分解">{'\\operatorname{MSE}(\\hat{\\theta}) = \\big\\{\\operatorname{Bias}(\\hat{\\theta})\\big\\}^2 + V(\\hat{\\theta})'}</MathBlock>
        <MathNote title="分解の導き方（3行）">
          <Steps>
            <li>
              <M>{'\\hat{\\theta} - \\theta'}</M> に <M>{'E(\\hat{\\theta})'}</M> を引いて足す：<M>{'\\hat{\\theta} - \\theta = \\{\\hat{\\theta} - E(\\hat{\\theta})\\} + \\{E(\\hat{\\theta}) - \\theta\\}'}</M>
            </li>
            <li>
              2乗して展開：<M>{'\\{\\hat{\\theta} - E(\\hat{\\theta})\\}^2 + 2\\{\\hat{\\theta} - E(\\hat{\\theta})\\}\\{E(\\hat{\\theta}) - \\theta\\} + \\{E(\\hat{\\theta}) - \\theta\\}^2'}</M>
            </li>
            <li>
              期待値をとる：1項目は分散、2項目は <M>{'E\\{\\hat{\\theta} - E(\\hat{\\theta})\\} = 0'}</M> なので消え、3項目はバイアス²（定数）。
            </li>
          </Steps>
        </MathNote>
        <Example title="計算してみよう：σ² の推定">
          <p>
            正規分布から n 個とり、偏差の2乗和 <M>{'\\sum(X_i - \\bar{X})^2'}</M> を n で割った <M>{'\\hat{\\sigma}^2'}</M>（最尤推定量）のバイアスは、
            期待値が <M>{'\\frac{n-1}{n}\\sigma^2'}</M> なので <M>{'-\\frac{\\sigma^2}{n}'}</M>（小さめにずれる）。
            正規分布では偏差の2乗和を σ² で割ったものが自由度 n − 1 のカイ二乗分布に従うので（<Link to="/lessons/sampling-chi2-t-f">カイ二乗分布</Link>）、分散も計算できます。
          </p>
          <DataTable
            head={['割る数', 'バイアス', '分散', 'MSE（σ⁴ の何倍か）', 'n = 10 のとき']}
            rows={[
              ['n − 1（不偏分散）', '0', <M key="a">{'\\frac{2}{n-1}'}</M>, <M key="b">{'\\frac{2}{n-1}'}</M>, '0.222'],
              ['n（最尤推定量）', <M key="c">{'-\\sigma^2/n'}</M>, <M key="d">{'\\frac{2(n-1)}{n^2}'}</M>, <M key="e">{'\\frac{2n-1}{n^2}'}</M>, '0.190'],
              ['n + 1', <M key="f">{'-2\\sigma^2/(n+1)'}</M>, <M key="g">{'\\frac{2(n-1)}{(n+1)^2}'}</M>, <M key="h">{'\\frac{2}{n+1}'}</M>, '0.182'],
            ]}
            caption="分散は σ⁴ の何倍かで書いた。MSE で比べると、不偏分散がいちばん悪い（正規分布のとき）"
          />
          <p>
            「不偏 = いちばん良い」とは限らない、ということです。ただし実務や検定では、不偏分散を使う式（t 分布など）に合わせて n − 1 で割るのがふつうです。
          </p>
        </Example>
        <Figure caption="標本平均をa倍した推定量 a·x̄（σ²/n = 4）。aを1より小さくするとバイアス²は増えるが分散は減り、MSEが最小になるaがある。ただし最良のaは本当のμによって変わる">
          <BiasVarianceTradeoff />
        </Figure>
        <Intuition title="ずれとばらつきの取り引き">
          <p>
            的当てで、ねらいを少し外しても手ぶれを大きく減らせるなら、平均的には真ん中に近くなります。
            ただ、図のように最良の a は本当の μ（わからない値）で変わるので、「どの μ でもいちばん良い推定量」はふつう存在しません。
            そこで「不偏推定量の中で比べる」という土俵を決めるのが、次の有効性の考え方です。
          </p>
        </Intuition>
      </Section>

      <Section title="不偏性と一致性">
        <Compare>
          <Card title="不偏性（ふへんせい）">
            <MathBlock>{'E(\\hat{\\theta}) = \\theta'}</MathBlock>
            <p>どんな θ でも、期待値が θ に等しい。n を固定した性質。</p>
          </Card>
          <Card title="一致性（いっちせい）">
            <MathBlock>{'P(|\\hat{\\theta}_n - \\theta| > \\varepsilon) \\to 0'}</MathBlock>
            <p>どんなに小さな幅 ε を決めても、n → ∞ でずれがその幅を超える確率が 0 に近づく。n を増やしたときの性質。</p>
          </Card>
        </Compare>
        <p>
          一致性を確かめるには、「バイアスも分散も、n → ∞ で 0 に近づく（MSE → 0）」を示せば十分です（チェビシェフの不等式から。
          <Link to="/lessons/sampling-lln-clt">大数の法則</Link>と同じ考え方）。
        </p>
        <DataTable
          head={['推定量', '不偏？', '一致？', '理由']}
          rows={[
            [<M key="a">{'\\bar{X}'}</M>, '○', '○', '期待値 μ、分散 σ²/n → 0'],
            [<M key="b">{'X_1'}</M>, '○', '×', '期待値は μ だが、何個とっても1個目しか使わないので分散が σ² のまま'],
            [<M key="c">{'\\hat{\\sigma}^2'}</M>, '×', '○', 'バイアス −σ²/n → 0、分散も → 0'],
            [<M key="d">{'X_{(n)}'}</M>, '×', '○', 'U(0, θ) で期待値 nθ/(n+1) → θ、分散 → 0'],
          ]}
          caption="不偏性と一致性は別の性質。片方だけ満たす推定量がある"
        />
      </Section>

      <Section title="有効性と相対効率">
        <p>
          不偏推定量どうしなら、MSE ＝ 分散なので、<strong>分散が小さいほうが良い</strong>（より有効）。2つの不偏推定量を比べる数が<strong>相対効率</strong>です。
        </p>
        <MathBlock caption="θ̂₂ に対する θ̂₁ の相対効率：1より大きければ θ̂₁ のほうが良い（分散が小さい）">
          {'\\operatorname{eff}(\\hat{\\theta}_1, \\hat{\\theta}_2) = \\frac{V(\\hat{\\theta}_2)}{V(\\hat{\\theta}_1)}'}
        </MathBlock>
        <p className="muted">
          どちらを分子にするかは本によって違うことがあります。「分散が小さいほうが効率がよい」という向きだけは共通なので、問題文の定義で確かめます。
          相対効率が 0.5 なら「同じ精度を出すのにデータが2倍要る」と読めます（分散は n に反比例するので）。
        </p>
        <Example title="標本平均と標本中央値（正規分布）">
          <p>
            正規分布は左右対称なので、標本中央値も μ の推定量として使えます。n が大きいとき、標本中央値の分散はおよそ <M>{'\\frac{\\pi\\sigma^2}{2n}'}</M> で、
            標本平均の分散 <M>{'\\frac{\\sigma^2}{n}'}</M> より大きくなります。
          </p>
          <MathBlock caption="平均に対する中央値の相対効率（正規分布、n が大きいとき）">{'\\frac{V(\\bar{X})}{V(\\text{median})} \\approx \\frac{\\sigma^2/n}{\\pi\\sigma^2/(2n)} = \\frac{2}{\\pi} \\approx 0.64'}</MathBlock>
          <p>
            中央値で平均と同じ精度を出すには、データが約 1/0.64 ≒ 1.57 倍要ります。ただし外れ値が出やすい（裾の重い）分布では逆転し、中央値のほうが有効になります。
          </p>
        </Example>
        <Figure caption="21個の標本平均と標本中央値を2000回計算したヒストグラム。正規分布では平均（青）のほうが細く、裾の重いラプラス分布では中央値（オレンジ）のほうが細い">
          <MeanVsMedian />
        </Figure>
      </Section>

      <Section title="ガウス・マルコフの定理">
        <p>
          回帰分析のような<strong>線形模型</strong> <M>{'y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i'}</M> で、誤差が次の条件を満たすとします。
        </p>
        <ul>
          <li>
            平均 0：<M>{'E(\\varepsilon_i) = 0'}</M>
          </li>
          <li>
            分散が全部同じ：<M>{'V(\\varepsilon_i) = \\sigma^2'}</M>（等分散）
          </li>
          <li>
            互いに無相関：<M>{'\\operatorname{Cov}(\\varepsilon_i, \\varepsilon_j) = 0'}</M>（i ≠ j）
          </li>
        </ul>
        <p>
          このとき、<strong>最小二乗推定量は、データ y の1次式で表せる不偏推定量（線形不偏推定量）の中で分散が最小</strong>です。これを<strong>ガウス・マルコフの定理</strong>といい、
          最小二乗推定量を <strong>BLUE</strong>（Best Linear Unbiased Estimator、最良線形不偏推定量）といいます。
        </p>
        <Example title="いちばん簡単な場合：μ を重みつき平均で推定する">
          <p>
            定数だけのモデル <M>{'y_i = \\mu + \\varepsilon_i'}</M> で、<M>{'\\hat{\\mu} = w_1 y_1 + \\cdots + w_n y_n'}</M>（線形）を考えます。
          </p>
          <Steps>
            <li>
              不偏になる条件：<M>{'E(\\hat{\\mu}) = (w_1 + \\cdots + w_n)\\mu = \\mu'}</M> より <M>{'\\sum w_i = 1'}</M>
            </li>
            <li>
              分散：無相関・等分散なので <M>{'V(\\hat{\\mu}) = \\sigma^2 \\sum w_i^2'}</M>
            </li>
            <li>
              n = 2 なら <M>{'w_1 = w,\\ w_2 = 1 - w'}</M> で <M>{'\\sigma^2\\{w^2 + (1-w)^2\\}'}</M>。w で微分して 0（<M>{'(1-w)^2'}</M> の微分は中身の微分 −1 がかかって <M>{'-2(1-w)'}</M>）：<M>{'2w - 2(1-w) = 0 \\Rightarrow 4w = 2 \\Rightarrow w = 1/2'}</M>
            </li>
            <li>どの n でも、重みを全部等しく 1/n にしたとき（＝標本平均）が最小。標本平均は μ の BLUE で、これは μ の最小二乗推定量でもある</li>
          </Steps>
        </Example>
        <Note title="条件と限界">
          <ul>
            <li>誤差の<strong>正規性は要らない</strong>（平均 0・等分散・無相関だけ）。正規性を仮定すると、線形に限らずすべての不偏推定量の中で最小になる（クラーメル・ラオの下限を達成する）ことが言えます。</li>
            <li>比べているのは「線形」かつ「不偏」の推定量だけ。中央値のような線形でない推定量や、バイアスのある推定量（回帰の章のリッジ回帰など）のほうが MSE が小さいこともあります。</li>
            <li>等分散でないとき（不均一分散）は、分散の逆数で重みをつけた重みつき最小二乗法のほうが良くなります。</li>
          </ul>
        </Note>
      </Section>

      <Section title="クラーメル・ラオの不等式：分散の下限">
        <p>
          有効性で「分散が小さいほうが良い」としましたが、どこまで小さくできるのでしょうか。それに答えるのが<strong>クラーメル・ラオの不等式</strong>です。
        </p>
        <MathBlock caption="クラーメル・ラオの不等式：独立に同じ分布からとった n 個のデータで、正則条件（下の注意）が成り立つとき、θ のどんな不偏推定量も、分散はこの値より小さくならない">{'V(\\hat{\\theta}) \\ge \\frac{1}{n I(\\theta)}'}</MathBlock>
        <p>
          <M>{'I(\\theta)'}</M> は<strong>フィッシャー情報量</strong>（1個のデータが θ について持つ情報の量）で、次のレッスンで詳しく扱います。ここでは計算のしかただけ使います。
          この不等式は<strong>不偏推定量だけ</strong>についての話で、しかも分布が「なめらか」であるという条件（正則条件）が要ります。条件はこの節の最後にまとめます。
        </p>
        <MathBlock caption="フィッシャー情報量（1個分）：対数密度を θ で2回微分して、マイナスをつけて期待値をとる">{'I(\\theta) = -E_{\\theta}\\left[\\frac{\\partial^2}{\\partial \\theta^2}\\log f(X;\\theta)\\right]'}</MathBlock>
        <ul>
          <li>
            <M>{'\\frac{\\partial^2}{\\partial \\theta^2}'}</M> は「x を定数とみて、θ で2回微分する」という意味（<M>{'\\partial'}</M> は偏微分の記号。<Link to="/lessons/pre1-math-multivariable">偏微分と重積分</Link>）。
          </li>
          <li>
            <M>{'E_{\\theta}'}</M> は「X が母数 θ の分布 <M>{'f(x;\\theta)'}</M> に従うとしてとる期待値」。微分したあとの式に残った x を確率変数 X とみて期待値をとります（添字の θ は省くことも多い）。
          </li>
        </ul>
        <Example title="ベルヌーイ分布：標本比率は下限ぴったり">
          <Steps>
            <li>
              <M>{'\\log f(x;p) = x\\log p + (1-x)\\log(1-p)'}</M>
            </li>
            <li>
              1回微分：<M>{'\\frac{x}{p} - \\frac{1-x}{1-p}'}</M>（<M>{'\\log(1-p)'}</M> の微分は中身の微分 −1 がかかって <M>{'-\\frac{1}{1-p}'}</M>）
            </li>
            <li>
              2回微分：<M>{'\\frac{1}{p}'}</M> の微分は <M>{'-\\frac{1}{p^2}'}</M>、<M>{'\\frac{1}{1-p}'}</M> の微分は <M>{'\\frac{1}{(1-p)^2}'}</M>（中身の微分 −1 がかかり符号が2回変わる）なので、
              <M>{'-\\frac{x}{p^2} - \\frac{1-x}{(1-p)^2}'}</M>
            </li>
            <li>
              x を X にして期待値をとり（<M>{'E(X) = p'}</M>、<M>{'E(1-X) = 1-p'}</M>）、マイナスをつける：<M>{'I(p) = \\frac{p}{p^2} + \\frac{1-p}{(1-p)^2} = \\frac{1}{p} + \\frac{1}{1-p} = \\frac{(1-p) + p}{p(1-p)} = \\frac{1}{p(1-p)}'}</M>
            </li>
            <li>
              下限：<M>{'\\frac{1}{nI(p)} = \\frac{p(1-p)}{n}'}</M>。標本比率 <M>{'\\hat{p}'}</M> の分散 <M>{'\\frac{p(1-p)}{n}'}</M>（2級）と<strong>ぴったり一致</strong>
            </li>
          </Steps>
          <p>
            つまり、p のどんな不偏推定量を工夫しても、標本比率より分散を小さくすることはできません。
            n = 100、p = 0.3 なら下限は 0.21/100 = 0.0021 です。
          </p>
        </Example>
        <p>
          同じように、ポアソン分布では <M>{'I(\\lambda) = 1/\\lambda'}</M> で下限 <M>{'\\lambda/n = V(\\bar{X})'}</M>、正規分布（σ² 既知）の μ では
          <M>{'I(\\mu) = 1/\\sigma^2'}</M> で下限 <M>{'\\sigma^2/n = V(\\bar{X})'}</M>。どちらも標本平均が下限を達成します。
          下限を達成する不偏推定量を<strong>有効推定量</strong>といい、それは不偏推定量の中で分散が最小（一様最小分散不偏推定量）です。
        </p>
        <Intuition title="何がうれしいのか">
          <p>
            「もっと良い推定量があるのでは？」という探索を、<strong>ここで止めてよい</strong>と保証してくれることです。
            候補の分散が下限と等しければ、それ以上は不偏推定量では改善できません。下限より大きければ、どれくらい改善の余地があるかもわかります
            （相対効率 = 下限 ÷ 分散）。
          </p>
        </Intuition>
        <Note title="成り立つための条件（正則条件）">
          <p>
            クラーメル・ラオの不等式は、次のような条件（<strong>正則条件</strong>）のもとで成り立ちます。本によって書き方は少しずつ違いますが、準1級ではこの程度をおさえれば十分です。
          </p>
          <ul>
            <li>データ <M>{'X_1, \\dots, X_n'}</M> が独立に同じ分布 <M>{'f(x;\\theta)'}</M> に従う（このとき n 個分の情報量が <M>{'nI(\\theta)'}</M> になる）。</li>
            <li><strong>データのとりうる範囲（f が正になる x の範囲）が θ によらない</strong>。</li>
            <li><M>{'f(x;\\theta)'}</M> が θ で微分でき、「θ で微分する」と「x で積分する（和をとる）」の順序を入れかえてよい。</li>
            <li>フィッシャー情報量が <M>{'0 < I(\\theta) < \\infty'}</M>（2回微分の式で計算するなら、2回微分できることも要る）。</li>
          </ul>
          <p>
            とくに<strong>データのとりうる範囲が θ によって変わる分布</strong>（一様分布 U(0, θ) など）では、順序の入れかえができず、不等式は成り立ちません。
            実際、U(0, θ) の不偏推定量 <M>{'\\frac{n+1}{n}X_{(n)}'}</M> の分散は <M>{'\\frac{\\theta^2}{n(n+2)}'}</M> で、
            1/n よりずっと速く（1/n² の速さで）小さくなります。<M>{'\\log f = -\\log\\theta'}</M> から形だけ <M>{'I(\\theta) = E[(-1/\\theta)^2] = 1/\\theta^2'}</M> と計算して
            「下限」<M>{'\\theta^2/n'}</M> を作っても、<M>{'\\frac{\\theta^2}{n(n+2)}'}</M> はそれより小さく、下限になっていません。条件の正確な書き方は
            <a href="https://home.hiroshima-u.ac.jp/wakaki/lecture/probstatB17/slide1201.pdf" target="_blank" rel="noreferrer">
              広島大学の講義資料（若木宏文「確率・統計B 一様最小分散不偏推定量」定理1）
            </a>
            などで確かめられます（そこでは微分と積分の入れかえを保証する条件と、情報量が正であることを仮定しています）。
          </p>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>「不偏推定量がいちばん良い」→ MSE で比べると、バイアスのある推定量のほうが小さいことがあります（σ² を n + 1 で割るなど）。</li>
            <li>「不偏なら一致」「一致なら不偏」→ どちらも誤り。X₁ は不偏だが一致でない、σ̂²（n で割る）は一致だが不偏でない。</li>
            <li>相対効率の分子と分母を逆にする → 「相手の分散 ÷ 自分の分散」。1より大きければ自分のほうが良い。定義の向きは問題文で確認します。</li>
            <li>「ガウス・マルコフの定理には正規分布が必要」→ 要るのは平均 0・等分散・無相関。比べる相手は線形不偏推定量だけ。</li>
            <li>「クラーメル・ラオの下限はどんな推定量にも当てはまる」→ 不偏推定量についての下限で、正則条件も必要。バイアスのある推定量の分散は下限より小さくなることがあります。</li>
            <li>下限を 1/I(θ) と書いてしまう → n 個のデータなら情報量は n 倍なので 1/(nI(θ))。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              事実：出題範囲表（2027年1月1日からの版）に、バイアス・バイアス・バリアンス分解・不偏性・一致性・十分性・有効性・推定量の相対効率・ガウス・マルコフの定理・クラーメル・ラオの不等式が挙がっています。
            </li>
            <li>
              予想（公式の発表ではない）：いくつかの推定量の期待値と分散を計算して、バイアス・MSE・相対効率を比べる問題。フィッシャー情報量からクラーメル・ラオの下限を計算し、ある推定量が有効推定量かを判断する問題。
              ガウス・マルコフの定理の条件（正規性が要らない、線形不偏の中で最良）を問う正誤問題。
            </li>
            <li>期待値と分散の計算（<M>{'E(aX + b) = aE(X) + b'}</M>、<M>{'V(aX) = a^2V(X)'}</M>、独立な和の分散）が土台なので、2級の<Link to="/lessons/random-variables-linear-transform">確率変数の変換</Link>も見直しておきます。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
