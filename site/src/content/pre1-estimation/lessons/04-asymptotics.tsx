import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { KlDivergence, LogLikCurvature, MleAsymptotic } from '../figures/Asymptotics'

export const meta: LessonMeta = {
  id: 'pre1-estimation-asymptotics',
  chapter: 'pre1-estimation',
  order: 4,
  title: 'フィッシャー情報量と漸近的性質',
  summary: '対数尤度の山の「とがり具合」がフィッシャー情報量です。n が大きいと最尤推定量は正規分布 N(θ, 1/(nI(θ))) に近づき、近似の信頼区間が作れます。ジャックナイフ法とカルバック・ライブラー情報量も学びます。',
  minutes: 60,
  keywords: ['フィッシャー情報量', 'スコア関数', '最尤推定量の漸近正規性', '漸近分散', '漸近有効性', 'ジャックナイフ法', 'カルバック・ライブラー情報量'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>フィッシャー情報量</strong> <M>{'I(\\theta)'}</M> は、対数尤度の山の頂上がどれくらい<strong>とがっているか</strong>（曲がり具合）です。
          とがっているほど θ の候補がしぼれる＝情報が多い。n が大きいと、最尤推定量 <M>{'\\hat{\\theta}'}</M> はおよそ正規分布
          <M>{'N\\!\\left(\\theta,\\ \\frac{1}{nI(\\theta)}\\right)'}</M> に従い（<strong>漸近正規性</strong>）、これを使って
          <M>{'\\hat{\\theta} \\pm 1.96/\\sqrt{nI(\\hat{\\theta})}'}</M> という近似の 95% 信頼区間が作れます。
        </p>
      </Point>

      <Section title="山がとがっていると、推定がぶれにくい">
        <p>
          <Link to="/lessons/pre1-estimation-mle">最尤法</Link>では対数尤度の山の頂上を探しました。同じ「表の割合 0.3」でも、10 回中 3 回と 400 回中 120 回では信頼度がまるで違います。
          その違いは、山の<strong>形</strong>に表れます。
        </p>
        <Figure caption="ベルヌーイ分布で表の割合が0.3のときの対数尤度（頂上を0にそろえた）。nを増やすと山が細く、とがっていく。点線の2次式が−1.92まで下がる幅が、p̂ ± 1.96 × 標準誤差">
          <LogLikCurvature />
        </Figure>
        <p>
          頂上のまわりの対数尤度は、およそ2次式（放物線）<M>{'-\\frac{1}{2}c(\\theta - \\hat{\\theta})^2'}</M> の形です。c が大きい（とがっている）ほど、
          頂上から少し離れただけで対数尤度が大きく下がる＝その θ ではデータが出にくい、とはっきり言えます。この c にあたるのが <M>{'nI(\\theta)'}</M> です。
        </p>
      </Section>

      <Section title="定義：スコア関数とフィッシャー情報量">
        <p>
          1個のデータの対数密度を θ で微分したものを<strong>スコア関数</strong>といいます。対数尤度の「傾き」です。
        </p>
        <MathBlock caption="スコア関数（1個分）。n 個なら足し合わせたものが、対数尤度の傾き">{'U(\\theta) = \\frac{\\partial}{\\partial \\theta}\\log f(X;\\theta)'}</MathBlock>
        <p>
          <M>{'\\frac{\\partial}{\\partial \\theta}'}</M> は「x（データ）を定数とみて θ だけで微分する」という偏微分の記号です。
          X は確率変数なので、スコア U(θ) も確率変数（データが変わるたびに値が変わる量）です。
        </p>
        <p>
          ここから先の期待値 E は、「X が母数 θ の分布 <M>{'f(x;\\theta)'}</M> に従うとしてとる期待値」で、正確には <M>{'E_{\\theta}'}</M> と書きます（添字は省くことが多い）。
          「θ で微分する」のと「その同じ θ の分布で平均する」のが組になっている、という点が大事です。
        </p>
        <p>
          本当の θ のところでは、スコアの期待値は 0 です（平均すると傾きがない＝本当の θ のあたりが頂上）。そのばらつき（分散）がフィッシャー情報量です。
          期待値が 0 なので、分散は「2乗の期待値」そのものになります（<M>{'V(U) = E(U^2) - \\{E(U)\\}^2 = E(U^2)'}</M>）。
        </p>
        <MathBlock caption="フィッシャー情報量（1個分）。2つの式は正則条件のもとで等しい">
          {'I(\\theta) = E_{\\theta}\\left[\\left(\\frac{\\partial}{\\partial \\theta}\\log f(X;\\theta)\\right)^2\\right] = -E_{\\theta}\\left[\\frac{\\partial^2}{\\partial \\theta^2}\\log f(X;\\theta)\\right]'}
        </MathBlock>
        <MathNote title="スコアの期待値が 0 になる理由（読み飛ばしてよい・連続の場合）">
          <p>
            log の微分から <M>{'\\frac{\\partial}{\\partial \\theta}\\log f = \\frac{1}{f}\\frac{\\partial f}{\\partial \\theta}'}</M>。これに f をかけて x で積分すると、
          </p>
          <MathBlock>{'E_{\\theta}[U] = \\int \\frac{1}{f(x;\\theta)}\\frac{\\partial f(x;\\theta)}{\\partial \\theta}\\, f(x;\\theta)\\,dx = \\int \\frac{\\partial f(x;\\theta)}{\\partial \\theta}\\,dx = \\frac{d}{d\\theta}\\int f(x;\\theta)\\,dx = \\frac{d}{d\\theta}1 = 0'}</MathBlock>
          <p>
            3つ目の等号で「微分」と「積分」の順序を入れかえています。これが正則条件の中身で、x の範囲が θ で変わる一様分布 U(0, θ) などでは、この入れかえができません。
            同じ式をもう一度 θ で微分すると、2つの式 <M>{'E[U^2] = -E[\\partial^2 \\log f/\\partial\\theta^2]'}</M> が等しいことも導けます。
          </p>
        </MathNote>
        <Compare>
          <Card title="1つ目の式：傾きの2乗の平均">
            <p>データが θ に敏感に反応する（スコアが大きくぶれる）ほど、データから θ がよくわかる。</p>
          </Card>
          <Card title="2つ目の式：曲がり具合の平均">
            <p>2回微分は「傾きの変わり方」＝曲がり具合。山の頂上では負なので、マイナスをつけて正の量にする。<strong>計算はふつうこちらが楽</strong>。</p>
          </Card>
        </Compare>
        <p>
          独立な n 個のデータでは、対数尤度が n 個の和なので、情報量も <strong>n 倍</strong>の <M>{'nI(\\theta)'}</M> になります。
          2回微分と偏微分は <Link to="/lessons/pre1-math-derivative">微分</Link>・<Link to="/lessons/pre1-math-multivariable">偏微分と重積分</Link> で確認できます。
        </p>
      </Section>

      <Section title="計算してみよう">
        <Example title="ベルヌーイ分布">
          <Steps>
            <li>
              <M>{'\\log f(x;p) = x\\log p + (1-x)\\log(1-p)'}</M>
            </li>
            <li>
              1回微分 <M>{'\\frac{x}{p} - \\frac{1-x}{1-p}'}</M>、2回微分 <M>{'-\\frac{x}{p^2} - \\frac{1-x}{(1-p)^2}'}</M>（<Link to="/lessons/pre1-estimation-properties">前のレッスン</Link>と同じ計算）
            </li>
            <li>
              x を X にして期待値（<M>{'E(X) = p'}</M>、<M>{'E(1-X) = 1-p'}</M>）をとり、マイナスをつける：<M>{'I(p) = \\frac{p}{p^2} + \\frac{1-p}{(1-p)^2} = \\frac{1}{p} + \\frac{1}{1-p} = \\frac{1}{p(1-p)}'}</M>
            </li>
          </Steps>
          <p className="muted">p が 0 や 1 に近いほど I(p) は大きい。表がほとんど出ないコインは、少しのデータで「ほとんど出ない」とわかる、という意味です。</p>
        </Example>
        <Example title="ポアソン分布">
          <Steps>
            <li>
              <M>{'\\log f(x;\\lambda) = x\\log\\lambda - \\lambda - \\log x!'}</M>
            </li>
            <li>
              1回微分 <M>{'\\frac{x}{\\lambda} - 1'}</M>、2回微分 <M>{'-\\frac{x}{\\lambda^2}'}</M>
            </li>
            <li>
              <M>{'E(X) = \\lambda'}</M> を入れてマイナス：<M>{'I(\\lambda) = \\frac{\\lambda}{\\lambda^2} = \\frac{1}{\\lambda}'}</M>
            </li>
          </Steps>
        </Example>
        <Example title="正規分布（σ² 既知、μ について）">
          <p>
            <M>{'\\log f = -\\frac{1}{2}\\log(2\\pi\\sigma^2) - \\frac{(x-\\mu)^2}{2\\sigma^2}'}</M>。μ で1回微分すると、<M>{'(x-\\mu)^2'}</M> の微分が <M>{'-2(x-\\mu)'}</M> なので
            <M>{'-\\frac{-2(x-\\mu)}{2\\sigma^2} = \\frac{x-\\mu}{\\sigma^2}'}</M>、
            2回微分 <M>{'-\\frac{1}{\\sigma^2}'}</M>（x を含まないので期待値もそのまま）。よって <M>{'I(\\mu) = \\frac{1}{\\sigma^2}'}</M>。ばらつきが小さいほど情報が多い。
          </p>
        </Example>
        <Example title="指数分布（率 λ）">
          <p>
            <M>{'\\log f = \\log\\lambda - \\lambda x'}</M>。1回微分 <M>{'\\frac{1}{\\lambda} - x'}</M>、2回微分 <M>{'-\\frac{1}{\\lambda^2}'}</M>（x を含まないので期待値もそのまま）。よって <M>{'I(\\lambda) = \\frac{1}{\\lambda^2}'}</M>。
          </p>
        </Example>
        <DataTable
          head={['分布', 'I(θ)（1個分）', '漸近分散 1/(nI)', '最尤推定量']}
          rows={[
            ['ベルヌーイ', <M key="a">{'\\frac{1}{p(1-p)}'}</M>, <M key="b">{'\\frac{p(1-p)}{n}'}</M>, <M key="c">{'\\hat{p}'}</M>],
            ['ポアソン', <M key="d">{'\\frac{1}{\\lambda}'}</M>, <M key="e">{'\\frac{\\lambda}{n}'}</M>, <M key="f">{'\\bar{X}'}</M>],
            ['正規（μ）', <M key="g">{'\\frac{1}{\\sigma^2}'}</M>, <M key="h">{'\\frac{\\sigma^2}{n}'}</M>, <M key="i">{'\\bar{X}'}</M>],
            ['正規（σ²、μ も未知）', <M key="j">{'\\frac{1}{2\\sigma^4}'}</M>, <M key="k">{'\\frac{2\\sigma^4}{n}'}</M>, <M key="l">{'\\hat{\\sigma}^2'}</M>],
            ['指数（率 λ）', <M key="m">{'\\frac{1}{\\lambda^2}'}</M>, <M key="n">{'\\frac{\\lambda^2}{n}'}</M>, <M key="o">{'1/\\bar{X}'}</M>],
          ]}
          caption="よく使うフィッシャー情報量。正規分布の σ² の行は、μ と σ² の2母数のフィッシャー情報行列の σ² の成分（μ と σ² をまたぐ成分が0なので、逆数がそのまま漸近分散になる）"
        />
      </Section>

      <Section title="最尤推定量の漸近正規性">
        <p>
          n が大きいとき、最尤推定量は次の性質をもちます（正則条件のもと）。<strong>漸近</strong>（ぜんきん）は「n → ∞ に近づけたとき」という意味です。
        </p>
        <MathBlock caption="最尤推定量の漸近正規性：n が大きいと、θ̂ はおよそ平均 θ・分散 1/(nI(θ)) の正規分布に従う">
          {'\\hat{\\theta} \\approx N\\!\\left(\\theta,\\ \\frac{1}{nI(\\theta)}\\right) \\qquad \\left(\\sqrt{n}(\\hat{\\theta} - \\theta) \\xrightarrow{d} N\\!\\left(0,\\ \\frac{1}{I(\\theta)}\\right)\\right)'}
        </MathBlock>
        <p>
          かっこの中は同じことを正確に書いたもので、<M>{'\\xrightarrow{d}'}</M> は「n → ∞ のとき、左の量の分布が右の分布に近づく」（分布収束）という意味です。
          θ̂ そのものの分散は 0 に縮んでしまうので、<M>{'\\sqrt{n}'}</M> 倍して形を見ています。ここでの正則条件は、
          <Link to="/lessons/pre1-estimation-properties">クラーメル・ラオの不等式</Link>の条件（データの範囲が θ によらない、微分と積分を入れかえられる、<M>{'0 < I(\\theta) < \\infty'}</M> など）
          とほぼ同じもので、「本当の θ が端ではない」ことなども加わります。
        </p>
        <ul>
          <li><strong>一致性</strong>：n → ∞ で θ̂ は θ に近づく。</li>
          <li>
            <strong>漸近有効性</strong>：漸近分散 <M>{'1/(nI(\\theta))'}</M> は、<Link to="/lessons/pre1-estimation-properties">クラーメル・ラオの下限</Link>と同じ。
            n が大きいとき、最尤推定量は（正則な場合）いちばん効率のよい推定量になります。これが最尤法がよく使われる理由です。
          </li>
        </ul>
        <Figure caption="指数分布（λ = 2）の最尤推定値 λ̂ = 1/x̄ の分布。n = 5 では右に裾を引き、平均も2より大きい。nが大きくなると点線の正規分布 N(λ, λ²/n) にほぼ重なる">
          <MleAsymptotic />
        </Figure>
        <Intuition title="なぜ正規分布になるのか（直感）">
          <p>
            スコア（対数尤度の傾き）は n 個の独立な量の和なので、<Link to="/lessons/sampling-lln-clt">中心極限定理</Link>で正規分布に近づきます。
            頂上のまわりで対数尤度が放物線なら、傾きは直線で、「傾きが 0 になる場所」θ̂ も傾きと同じように正規分布でぶれます。
            ぶれの大きさは「傾きのぶれ ÷ 曲がり具合」で、n 個分の傾きの標準偏差 <M>{'\\sqrt{nI(\\theta)}'}</M> を曲がり具合 <M>{'nI(\\theta)'}</M> で割ると <M>{'1/\\sqrt{nI(\\theta)}'}</M> になります。
          </p>
        </Intuition>
        <Note title="正則でない例：一様分布 U(0, θ)">
          <p>
            U(0, θ) の最尤推定量 <M>{'X_{(n)}'}</M> は、データの範囲が θ で決まるので正則条件を満たさず、漸近正規性は成り立ちません。
            <M>{'X_{(n)}'}</M> はつねに θ 以下で、θ との差は 1/n の速さで縮み、その分布は正規分布ではなく片側だけに広がる形（指数分布に近い形）になります。
            「最尤推定量ならいつでも正規近似」ではないことに注意します。
          </p>
        </Note>
      </Section>

      <Section title="近似の信頼区間を作る">
        <p>
          漸近正規性から、標準化した <M>{'(\\hat{\\theta} - \\theta)\\sqrt{nI(\\theta)}'}</M> がおよそ標準正規分布に従います。
          I(θ) の中の θ はわからないので θ̂ を入れて、2級の母比率の区間と同じ形の区間が作れます。
        </p>
        <MathBlock caption="最尤推定量による近似の 95% 信頼区間（ワルド型の区間とよばれる）">{'\\hat{\\theta} \\pm 1.96 \\times \\frac{1}{\\sqrt{nI(\\hat{\\theta})}}'}</MathBlock>
        <DataTable
          head={['分布', '近似の 95% 信頼区間']}
          rows={[
            ['ベルヌーイ', <M key="a">{'\\hat{p} \\pm 1.96\\sqrt{\\hat{p}(1-\\hat{p})/n}'}</M>],
            ['ポアソン', <M key="b">{'\\bar{x} \\pm 1.96\\sqrt{\\bar{x}/n}'}</M>],
            ['指数（率 λ）', <M key="c">{'\\hat{\\lambda} \\pm 1.96\\,\\hat{\\lambda}/\\sqrt{n}'}</M>],
          ]}
          caption="ベルヌーイの行は、2級で学んだ母比率の信頼区間そのもの"
        />
        <Example title="計算してみよう：指数分布の λ">
          <p>ある窓口の客の到着間隔を 100 回測ったら、平均が 2.5 分でした。到着の率 λ（1分あたり）の近似 95% 信頼区間を求めます。</p>
          <Steps>
            <li>
              最尤推定値：<M>{'\\hat{\\lambda} = 1/2.5 = 0.4'}</M>
            </li>
            <li>
              標準誤差：<M>{'1/\\sqrt{nI(\\hat{\\lambda})} = \\hat{\\lambda}/\\sqrt{n} = 0.4/10 = 0.04'}</M>
            </li>
            <li>
              区間：<M>{'0.4 \\pm 1.96 \\times 0.04 = 0.4 \\pm 0.0784'}</M> より <M>{'[0.3216,\\ 0.4784]'}</M>
            </li>
          </Steps>
        </Example>
        <p className="muted">
          2級の<Link to="/lessons/estimation-ci-proportion-variance">母比率の区間推定</Link>は、この方法の特別な場合だったわけです。
          近似なので n が小さいと実際の信頼係数（被覆確率）が 95% からずれます。これは<Link to="/lessons/pre1-estimation-interval">次のレッスン</Link>で確かめます。
          θ̂ の関数 g(θ̂) の標準誤差は、デルタ法（<Link to="/chapters/pre1-probability">確率と確率変数</Link>の章）で <M>{'|g^{\\prime}(\\hat{\\theta})|/\\sqrt{nI(\\hat{\\theta})}'}</M> と近似できます。
        </p>
      </Section>

      <Section title="ジャックナイフ法：1個ずつ抜いて計算し直す">
        <p>
          推定量のバイアスや分散を式で計算できないとき、データだけから見積もる方法が<strong>ジャックナイフ法</strong>です。
          「1個抜いたデータで推定量を計算し直す」を n 回くり返し、その<strong>ばらつき</strong>からバイアスと分散を推測します。
        </p>
        <Steps>
          <li>
            全部のデータで推定値 <M>{'\\hat{\\theta}'}</M> を計算する。
          </li>
          <li>
            i 番目のデータだけ抜いた n − 1 個で計算した値を <M>{'\\hat{\\theta}_{(i)}'}</M> とする（i = 1, …, n）。その平均を <M>{'\\hat{\\theta}_{(\\cdot)} = \\frac{1}{n}\\sum \\hat{\\theta}_{(i)}'}</M> とする。
          </li>
          <li>
            バイアスの推定値：<M>{'(n-1)\\big(\\hat{\\theta}_{(\\cdot)} - \\hat{\\theta}\\big)'}</M>
          </li>
          <li>
            バイアスを補正した推定値：<M>{'\\hat{\\theta}_{J} = \\hat{\\theta} - (n-1)\\big(\\hat{\\theta}_{(\\cdot)} - \\hat{\\theta}\\big) = n\\hat{\\theta} - (n-1)\\hat{\\theta}_{(\\cdot)}'}</M>
          </li>
          <li>
            分散の推定値：<M>{'\\frac{n-1}{n}\\sum_{i=1}^{n}\\big(\\hat{\\theta}_{(i)} - \\hat{\\theta}_{(\\cdot)}\\big)^2'}</M>
          </li>
        </Steps>
        <Example title="小さなデータで計算：n で割る分散のバイアス補正">
          <p>
            データ 1, 2, 4, 5（n = 4）で、<M>{'\\hat{\\theta} = \\hat{\\sigma}^2'}</M>（n で割る分散）を考えます。平均 3、偏差の2乗和 4 + 1 + 1 + 4 = 10 なので <M>{'\\hat{\\theta} = 2.5'}</M>。
          </p>
          <DataTable
            head={['抜いたデータ', '残り', '残りの平均', '残りの n で割る分散', <M key="h">{'\\hat{\\theta}_{(i)} - \\hat{\\theta}_{(\\cdot)}'}</M>]}
            rows={[
              ['1', '2, 4, 5', '11/3', '14/9 ≒ 1.556', '−0.667'],
              ['2', '1, 4, 5', '10/3', '26/9 ≒ 2.889', '+0.667'],
              ['4', '1, 2, 5', '8/3', '26/9 ≒ 2.889', '+0.667'],
              ['5', '1, 2, 4', '7/3', '14/9 ≒ 1.556', '−0.667'],
            ]}
            caption="1個ずつ抜いて計算し直す。平均は (14 + 26 + 26 + 14)/36 = 80/36 ≒ 2.222"
          />
          <Steps>
            <li>
              <M>{'\\hat{\\theta}_{(\\cdot)} = 20/9 \\approx 2.222'}</M>
            </li>
            <li>
              バイアスの推定値：<M>{'3 \\times (2.222 - 2.5) \\approx -0.833'}</M>（小さめにずれている、と推測）
            </li>
            <li>
              補正した推定値：<M>{'4 \\times 2.5 - 3 \\times 2.222 = 10 - 6.667 \\approx 3.333'}</M>
            </li>
            <li>
              分散の推定値：<M>{'\\frac{3}{4} \\times 4 \\times 0.667^2 \\approx 1.333'}</M>
            </li>
          </Steps>
          <p>
            補正した 3.333 は、偏差の2乗和 10 を n − 1 = 3 で割った<strong>不偏分散</strong>とぴったり同じです。
            ジャックナイフ法は、n で割る分散の「小さめのずれ」を自動で直してくれました（一般の n でも、この推定量のジャックナイフ補正は不偏分散になります）。
          </p>
        </Example>
        <Note title="いつ使うか">
          <ul>
            <li>推定量が複雑で、期待値や分散を式で求めにくいとき（比の推定量、相関係数など）。</li>
            <li>
              標本平均に使うと、分散の推定値は <M>{'s^2/n'}</M>（不偏分散 ÷ n）になり、2級の標準誤差の2乗と一致します。
            </li>
            <li>
              似た方法に、データから復元抽出をくり返すブートストラップ法があります。式は
              <a href="https://arxiv.org/abs/1606.00497" target="_blank" rel="noreferrer">
                「The Jackknife Estimation Method」（arXiv:1606.00497）
              </a>
              などで確かめられます。
            </li>
          </ul>
        </Note>
      </Section>

      <Section title="カルバック・ライブラー情報量：分布の近さ">
        <p>
          2つの分布がどれくらい違うかを測る量が<strong>カルバック・ライブラー情報量</strong>（KL 情報量、KL ダイバージェンス）です。
          本当の分布 g と、モデルの分布 f の「ずれ」を表します。
          記号 <M>{'D(g\\,\\|\\,f)'}</M> は「g から見た f のずれ」と読み、<M>{'E_g'}</M> は「X が分布 g に従うとしてとる期待値」です。
        </p>
        <MathBlock caption="KL 情報量（離散のとき）。連続なら和を積分にする">{'D(g \\,\\|\\, f) = \\sum_{x} g(x)\\log\\frac{g(x)}{f(x)} = E_{g}\\left[\\log\\frac{g(X)}{f(X)}\\right]'}</MathBlock>
        <ul>
          <li>
            <strong>非負</strong>：<M>{'D(g\\,\\|\\,f) \\ge 0'}</M> で、0 になるのは g と f が同じ分布のときだけ。
          </li>
          <li>
            <strong>対称でない</strong>：一般に <M>{'D(g\\,\\|\\,f) \\ne D(f\\,\\|\\,g)'}</M>。そのため「距離」とはよばず、「ダイバージェンス」などとよぶ。
          </li>
        </ul>
        <Example title="コインで計算">
          <p>本当は公平なコイン（表の確率 0.5）を、表の確率 0.7 のモデルで表したときのずれ：</p>
          <MathBlock>{'D = 0.5\\log\\frac{0.5}{0.7} + 0.5\\log\\frac{0.5}{0.3} \\approx 0.5 \\times (-0.336) + 0.5 \\times 0.511 \\approx 0.087'}</MathBlock>
          <p>
            向きを逆にすると <M>{'0.7\\log\\frac{0.7}{0.5} + 0.3\\log\\frac{0.3}{0.5} \\approx 0.082'}</M>。値が少し違い、対称でないことがわかります。
          </p>
        </Example>
        <p>
          正規分布どうしでは式で書けて、分散が同じなら <M>{'D\\big(N(\\mu_1, \\sigma^2)\\,\\|\\,N(\\mu_2, \\sigma^2)\\big) = \\frac{(\\mu_1 - \\mu_2)^2}{2\\sigma^2}'}</M> です。
        </p>
        <Figure caption="本当の分布 p = N(0, 1) とモデル q = N(m, s²)。重なると0、ずれるほど大きい。分散が違うと D(p‖q) と D(q‖p) の値が分かれる">
          <KlDivergence />
        </Figure>
        <MathNote title="非負になる理由（読み飛ばしてよい）">
          <p>
            log は上に凸な関数なので、<M>{'\\log t \\le t - 1'}</M>（等号は t = 1 のとき）。<M>{'t = f(x)/g(x)'}</M> を入れて g で期待値をとると
            <M>{'-D(g\\,\\|\\,f) = E_g\\left[\\log\\frac{f}{g}\\right] \\le E_g\\left[\\frac{f}{g} - 1\\right] = \\sum f(x) - \\sum g(x) = 1 - 1 = 0'}</M>。
          </p>
        </MathNote>
        <Intuition title="最尤法との関係">
          <p>KL 情報量を2つに分けると、</p>
          <MathBlock>{'D(g\\,\\|\\,f_\\theta) = \\underbrace{E_g[\\log g(X)]}_{\\mathrm{const}} - E_g[\\log f(X;\\theta)]'}</MathBlock>
          <p>
            1項目はモデルの母数 θ によらない定数です。だから「本当の分布にいちばん近い（KL 最小の）θ を選ぶ」ことは、2項目
            <M>{'E_g[\\log f(X;\\theta)]'}</M> を最大にすることと同じ。本当の分布 g はわからないので、期待値をデータの平均
            <M>{'\\frac{1}{n}\\sum \\log f(x_i;\\theta)'}</M> で置きかえると、それは<strong>対数尤度 ÷ n</strong>です。
            つまり最尤法は「データから見て、本当の分布に KL の意味でいちばん近いモデルを選ぶ方法」と解釈できます。
            モデル選びの AIC もこの考え方から作られています（<Link to="/chapters/pre1-regression">回帰分析</Link>の章）。
          </p>
        </Intuition>
        <p className="muted">
          また、θ を少しだけずらした分布との KL 情報量は <M>{'D(f_\\theta\\,\\|\\,f_{\\theta+\\delta}) \\approx \\frac{1}{2}I(\\theta)\\delta^2'}</M> で、フィッシャー情報量は
          「θ を動かしたとき分布がどれだけ速く変わるか」とも読めます。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>「フィッシャー情報量は推定量の分散」→ 逆数の関係です。情報量が大きいほど、推定量の（漸近）分散 1/(nI) は小さい。</li>
            <li>2回微分にマイナスをつけ忘れる → 山の頂上では2回微分が負なので、−E[…] で正の値にします。</li>
            <li>n 倍を忘れる → I(θ) は1個分。n 個なら nI(θ)。漸近分散は 1/(nI(θ))。</li>
            <li>「漸近正規性は小さな n でも成り立つ」→ n が小さいと、図の n = 5 のように偏りやゆがみが残ります。近似の信頼区間も n が小さいと精度が落ちます。</li>
            <li>ジャックナイフの係数を忘れる → バイアスは平均のずれに (n − 1) をかける。分散は (n − 1)/n をかける（1/n や 1/(n − 1) ではない）。</li>
            <li>「KL 情報量は距離」→ 対称でなく、三角不等式も成り立たないので距離ではありません。非負で、同じ分布のとき 0、は成り立ちます。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              事実：出題範囲表（2027年1月1日からの版）に、フィッシャー情報量・最尤推定量の漸近正規性・ジャックナイフ法・カルバック・ライブラー情報量が挙がっています。
            </li>
            <li>
              予想（公式の発表ではない）：分布の密度からフィッシャー情報量を計算し、最尤推定量の漸近分散や近似の信頼区間を求める問題。
              小さなデータでジャックナイフのバイアス補正値・分散推定値を計算する数値入力問題。KL 情報量の性質（非負・非対称・最尤法との関係）を問う正誤問題。
            </li>
            <li>2回微分の計算が中心なので、log と分数の微分を手で速く正確にできるようにしておきます。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
