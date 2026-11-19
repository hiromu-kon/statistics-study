import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { LikelihoodTriad, NpRegionDemo } from '../figures/DerivationFigures'

export const meta: LessonMeta = {
  id: 'pre1-testing-derivation',
  chapter: 'pre1-testing',
  order: 2,
  title: '検定の作り方（ネイマン・ピアソン・尤度比・ワルド・スコア）',
  summary: '2級で使った z 検定や t 検定は、どこから来たのか。尤度を比べて棄却域を作る「ネイマン・ピアソンの基本定理」と、そこから広がる尤度比検定・ワルド型検定・スコア検定を、対数尤度のグラフの上で見比べます。',
  minutes: 50,
  keywords: ['ネイマン・ピアソンの基本定理', '尤度比検定', 'ワルド型検定', 'スコア検定', '検定統計量', '棄却域'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          同じ有意水準 α の棄却域はいくらでも作れますが、検出力はまったく違います。<strong>いちばん検出力の高い棄却域は「尤度比が大きいところ」</strong>
          というのがネイマン・ピアソンの基本定理です。この考えを広げた<strong>尤度比検定</strong>と、その近似である<strong>ワルド型検定</strong>・<strong>スコア検定</strong>は、
          どれも「H0 の値が、データから見てどれくらい不自然か」を対数尤度のグラフの別々の場所で測っています。
        </p>
      </Point>

      <Section title="準備：尤度の復習">
        <p>
          <strong>尤度</strong>（ゆうど）<M>{'L(\\theta)'}</M> は、観測したデータを固定して「パラメータが θ だったら、このデータが出る確率（密度）はどれくらいか」を θ の関数として見たものです。
          その対数 <M>{'\\ell(\\theta) = \\log L(\\theta)'}</M> を<strong>対数尤度</strong>、それが最大になる θ を<strong>最尤推定量</strong> <M>{'\\hat{\\theta}'}</M> といいます。
          くわしくは推定の章の <Link to="/lessons/pre1-estimation-mle">最尤法のレッスン</Link> を、対数の計算は <Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link> を見てください。
        </p>
        <p>
          この章で使う性質は1つだけです。<strong>尤度が大きい θ ほど、データとよく合っている</strong>。だから「H0 の θ0 での尤度」と「H1 の θ1 での尤度」を比べれば、
          どちらの仮説がデータに合うかがわかります。
        </p>
      </Section>

      <Section title="同じ α でも、棄却域の選び方で検出力が変わる">
        <Example title="1つの観測値 X ~ N(θ, 1) で、H0: θ = 0 と H1: θ = 2 を比べる">
          <p>
            H0 のもとで確率 0.05 になる範囲なら、どれを棄却域にしても有意水準は 5% です。たとえば「X &gt; 1.645」「|X| &gt; 1.96」「|X| &lt; 0.063」は、
            どれも H0 の山の面積 0.05 です。でも H1（θ = 2）が正しいときに棄却できる確率（検出力）は、それぞれ 0.64・0.52・0.007 と大きく違います。
          </p>
        </Example>
        <Figure caption="塗った範囲が棄却域。赤（H0 の山の面積）はどれも 0.05 なのに、緑（H1 の山の面積 ＝ 検出力）は棄却域の場所で大きく変わる">
          <NpRegionDemo />
        </Figure>
        <Intuition title="「H1 の山が高く、H0 の山が低い」ところを選ぶ">
          <p>
            α という予算（H0 の面積 0.05）は決まっています。その予算で H1 の面積をできるだけ多く買いたい。だったら、<strong>H0 の高さに比べて H1 の高さが大きいところ</strong>、
            つまり比 <M>{'f_1(x)/f_0(x)'}</M> が大きいところから順に棄却域に入れていくのが得です。安くてたくさん入っている商品から買っていくのと同じです。
          </p>
        </Intuition>
      </Section>

      <Section title="ネイマン・ピアソンの基本定理">
        <p>
          H0: <M>{'\\theta = \\theta_0'}</M> と H1: <M>{'\\theta = \\theta_1'}</M> のように、どちらの仮説もパラメータを1つの値に決めているものを<strong>単純仮説</strong>といいます
          （<M>{'\\theta > \\theta_0'}</M> のように幅があるものは<strong>複合仮説</strong>）。
        </p>
        <MathBlock caption="単純仮説どうしの検定では、尤度比が定数 k を超えたら棄却する検定が、有意水準 α の検定の中で最も検出力が高い（最強力検定）。k は「H0 のもとで棄却する確率がちょうど α」になるように決める">
          {'\\frac{L(\\theta_1)}{L(\\theta_0)} = \\frac{\\prod_{i=1}^{n} f(x_i;\\ \\theta_1)}{\\prod_{i=1}^{n} f(x_i;\\ \\theta_0)} > k'}
        </MathBlock>
        <p>
          <M>{'\\prod'}</M>（パイ）は掛け算の記号です（<M>{'\\Sigma'}</M> の掛け算版）。データが独立なので、尤度は1つずつの密度の積になります。
        </p>

        <h3>正規分布の例：z 検定が出てくる</h3>
        <p>
          <M>{'X_1, \\ldots, X_n'}</M> が <M>{'N(\\mu, \\sigma^2)'}</M>（σ は既知）からの標本で、H0: <M>{'\\mu = \\mu_0'}</M>、H1: <M>{'\\mu = \\mu_1'}</M>（<M>{'\\mu_1 > \\mu_0'}</M>）とします。
        </p>
        <Steps>
          <li>
            1つの密度は <M>{'f(x;\\ \\mu) = \\frac{1}{\\sqrt{2\\pi}\\sigma}\\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)'}</M>。
          </li>
          <li>
            尤度比の対数をとる（掛け算が足し算になり、前の係数は分子と分母で消える）：
            <MathBlock>{'\\log\\frac{L(\\mu_1)}{L(\\mu_0)} = \\sum_{i=1}^{n}\\frac{(x_i - \\mu_0)^2 - (x_i - \\mu_1)^2}{2\\sigma^2}'}</MathBlock>
          </li>
          <li>
            分子を展開すると <M>{'(x_i - \\mu_0)^2 - (x_i - \\mu_1)^2 = 2(\\mu_1 - \\mu_0)x_i - (\\mu_1^2 - \\mu_0^2)'}</M>（<M>{'x_i^2'}</M> が消える）。i について足すと
            <MathBlock>{'\\log\\frac{L(\\mu_1)}{L(\\mu_0)} = \\frac{(\\mu_1 - \\mu_0)}{\\sigma^2}\\sum_{i=1}^{n} x_i - \\frac{n(\\mu_1^2 - \\mu_0^2)}{2\\sigma^2}'}</MathBlock>
          </li>
          <li>
            <M>{'\\mu_1 - \\mu_0 > 0'}</M> なので、これは <M>{'\\sum x_i'}</M>（つまり <M>{'\\bar{x}'}</M>）が大きいほど大きい。「尤度比 &gt; k」は「<M>{'\\bar{x} > c'}</M>」と同じ。
          </li>
          <li>
            c は H0 のもとで <M>{'P(\\bar{X} > c) = \\alpha'}</M> となるように決める：<M>{'c = \\mu_0 + z_{\\alpha}\\,\\sigma/\\sqrt{n}'}</M>。
          </li>
        </Steps>
        <p>
          できあがった棄却域は、2級で使った右片側の z 検定そのものです。<strong>z 検定は「最強力検定」だった</strong>ことがわかります。
        </p>
        <Note title="一様最強力検定">
          <p>
            上の c には μ1 が入っていません。つまり μ1 が μ0 より大きければ、どの μ1 に対しても同じ棄却域が最強力です。
            このように、複合仮説 H1: <M>{'\\mu > \\mu_0'}</M> のどの値に対しても最強力な検定を<strong>一様最強力検定</strong>（UMP 検定）といいます。
            一方 μ1 &lt; μ0 なら不等号の向きが逆になり、棄却域は <M>{'\\bar{x} < \\mu_0 - z_{\\alpha}\\sigma/\\sqrt{n}'}</M>。両側の H1 に対しては、一様最強力検定はふつう存在しません。
          </p>
        </Note>
        <Note title="離散分布のとき">
          <p>
            二項分布のような離散分布では、棄却する確率をちょうど α にできないことがあります（<Link to="/lessons/pre1-testing-general">一般の分布の検定のレッスン</Link>で扱う）。
            定理をそのまま成り立たせるには、境目の値が出たときにくじ引きで棄却するかを決める「確率化検定」を使います。実際の分析ではほとんど使いませんが、教科書には出てきます。
          </p>
        </Note>
      </Section>

      <Section title="尤度比検定：複合仮説にも使える形">
        <p>
          実際の仮説は「<M>{'\\mu = \\mu_0'}</M>（σ はわからない）」や「2つの比率が等しい」のように、値が1つに決まらないことがほとんどです。そこで、
          <strong>H0 の範囲での尤度の最大値</strong>と、<strong>制限なしでの尤度の最大値</strong>を比べます。
        </p>
        <MathBlock caption="尤度比。分母は全体での最大（最尤推定量での尤度）、分子は H0 の範囲に制限したときの最大。0 < Λ ≦ 1 で、小さいほど H0 が不自然">
          {'\\Lambda = \\frac{\\max_{\\theta \\in H_0} L(\\theta)}{\\max_{\\theta} L(\\theta)} = \\frac{L(\\hat{\\theta}_0)}{L(\\hat{\\theta})}'}
        </MathBlock>
        <MathBlock caption="ウィルクスの定理：H0 が正しく n が大きいとき、−2 log Λ は近似的にカイ二乗分布にしたがう。自由度は H0 で固定したパラメータの数">
          {'-2\\log\\Lambda = 2\\{\\ell(\\hat{\\theta}) - \\ell(\\hat{\\theta}_0)\\} \\ \\approx\\ \\chi^2(r)'}
        </MathBlock>
        <p>
          自由度 r は「全体のパラメータの数 − H0 のもとで自由に動けるパラメータの数」です。たとえばパラメータが (μ, σ²) の2つで、H0 が μ = μ0 なら r = 2 − 1 = 1。
          Λ が小さい（<M>{'-2\\log\\Lambda'}</M> が大きい）ほど H0 が不自然なので、<M>{'-2\\log\\Lambda > \\chi^2_{\\alpha}(r)'}</M> なら棄却します。
        </p>
        <Example title="正規分布の平均（σ 既知）：ぴったり z² になる">
          <p>
            H0: <M>{'\\mu = \\mu_0'}</M> のとき、分母の最大は <M>{'\\hat{\\mu} = \\bar{x}'}</M> で、分子は μ0 そのもの。上の計算と同じように整理すると
          </p>
          <MathBlock>{'-2\\log\\Lambda = \\frac{\\sum(x_i - \\mu_0)^2 - \\sum(x_i - \\bar{x})^2}{\\sigma^2} = \\frac{n(\\bar{x} - \\mu_0)^2}{\\sigma^2} = z^2'}</MathBlock>
          <p>
            2つめの等号は、偏差平方和の分解 <M>{'\\sum(x_i - \\mu_0)^2 = \\sum(x_i - \\bar{x})^2 + n(\\bar{x} - \\mu_0)^2'}</M> を使いました。
            z は標準正規分布なので、z² は<strong>ぴったり</strong>自由度1のカイ二乗分布（近似ではない）。<M>{'z^2 > 3.84'}</M> は <M>{'|z| > 1.96'}</M> と同じで、2級の両側 z 検定に一致します。
          </p>
        </Example>
        <Example title="ポアソン分布の平均">
          <p>
            1日の故障件数が <M>{'\\mathrm{Po}(\\lambda)'}</M> にしたがうとして、10 日間で合計 30 件でした（<M>{'\\bar{x} = 3'}</M>）。H0: <M>{'\\lambda = 2'}</M> を検定します。
          </p>
          <Steps>
            <li>
              対数尤度：<M>{'\\ell(\\lambda) = \\left(\\sum x_i\\right)\\log\\lambda - n\\lambda - \\sum\\log x_i!'}</M>。最後の項は λ を含まないので、差をとると消える。
            </li>
            <li>
              最尤推定量は <M>{'\\hat{\\lambda} = \\bar{x} = 3'}</M>。
            </li>
            <li>
              <M>{'-2\\log\\Lambda = 2\\{\\ell(3) - \\ell(2)\\} = 2\\left\\{30\\log\\frac{3}{2} - 10 \\times (3 - 2)\\right\\} = 2(30 \\times 0.4055 - 10) \\approx 4.33'}</M>
            </li>
            <li>
              自由度 1 の 5% 点 3.84 より大きいので、有意水準 5% で H0 を棄却する。
            </li>
          </Steps>
        </Example>
      </Section>

      <Section title="ワルド型検定とスコア検定">
        <p>
          尤度比検定は、H0 のもとでの最尤推定と、制限なしの最尤推定の<strong>両方</strong>が必要です。どちらか一方だけで済ませる近似が、ワルド型検定とスコア検定です。
          どちらもフィッシャー情報量 <M>{'I(\\theta)'}</M>（対数尤度の山のとがり具合。推定の章の <Link to="/lessons/pre1-estimation-asymptotics">漸近正規性のレッスン</Link>）を使います。
          n 個のデータ全体の情報量を <M>{'I_n(\\theta) = nI(\\theta)'}</M> と書くと、最尤推定量の分散はおよそ <M>{'1/I_n(\\theta)'}</M> です。
        </p>
        <Compare>
          <Card title="ワルド型検定（制限なしの推定だけ使う）">
            <MathBlock>{'W = \\frac{(\\hat{\\theta} - \\theta_0)^2}{1/I_n(\\hat{\\theta})}, \\quad z_W = \\frac{\\hat{\\theta} - \\theta_0}{\\mathrm{SE}(\\hat{\\theta})}'}</MathBlock>
            <p>
              「推定値と θ0 の差を、推定値の標準誤差で割る」。<strong>推定値 ÷ 標準誤差</strong>の形なので、回帰係数の t 値など、ソフトの出力でいちばんよく見る形です。
              標準誤差は推定値 <M>{'\\hat{\\theta}'}</M> の位置で計算します。
            </p>
          </Card>
          <Card title="スコア検定（H0 の値だけ使う）">
            <MathBlock>{'S = \\frac{U(\\theta_0)^2}{I_n(\\theta_0)}, \\quad U(\\theta) = \\frac{d\\ell(\\theta)}{d\\theta}'}</MathBlock>
            <p>
              <M>{'U(\\theta)'}</M> は対数尤度の傾きで、<strong>スコア関数</strong>といいます。山頂では傾き 0。θ0 での傾きが急なら「θ0 は山頂から遠い」と判断します。
              <strong>H0 の値だけで計算でき</strong>、推定をしなくてよいのが利点です（ラグランジュ乗数検定ともいう）。
            </p>
          </Card>
        </Compare>
        <p>3つとも、H0 が正しく n が大きいとき近似的に同じ自由度のカイ二乗分布にしたがいます（1つのパラメータなら自由度 1）。</p>
        <Example title="二項分布：100 回中 60 回成功、H0: p = 0.5">
          <p>
            対数尤度は <M>{'\\ell(p) = x\\log p + (n - x)\\log(1 - p)'}</M>、最尤推定量は <M>{'\\hat{p} = x/n = 0.6'}</M>。
            スコアは <M>{'U(p) = \\frac{x}{p} - \\frac{n - x}{1 - p} = \\frac{x - np}{p(1 - p)}'}</M>、情報量は <M>{'I_n(p) = \\frac{n}{p(1-p)}'}</M> です。
          </p>
          <DataTable
            head={['検定', '計算', '値']}
            rows={[
              [
                'ワルド型',
                <M key="w">{'\\frac{(0.6 - 0.5)^2}{0.6 \\times 0.4 / 100} = \\frac{0.01}{0.0024}'}</M>,
                '4.17',
              ],
              [
                'スコア',
                <M key="s">{'\\frac{(60 - 50)^2}{100 \\times 0.5 \\times 0.5} = \\frac{100}{25}'}</M>,
                '4.00',
              ],
              [
                '尤度比',
                <M key="l">{'2\\left(60\\log\\frac{0.6}{0.5} + 40\\log\\frac{0.4}{0.5}\\right)'}</M>,
                '4.03',
              ],
            ]}
            caption="3つの統計量はほぼ同じ値になる（どれも 3.84 を超えるので 5% で棄却）"
          />
          <p>
            スコア検定の <M>{'\\sqrt{S} = (\\hat{p} - p_0)/\\sqrt{p_0(1-p_0)/n} = 2.00'}</M> は、<Link to="/lessons/testing-proportion-variance">2級の母比率の検定</Link>の z そのものです。
            分母に H0 の値 p0 を使っていたのは、スコア検定だったからです。区間推定のときは分母に <M>{'\\hat{p}'}</M> を使いました（こちらはワルド型）。
          </p>
        </Example>
        <Figure caption="対数尤度 ℓ(p)（山頂を 0 にずらしたもの）の上で、3つの検定が測っているもの。赤は高さの差、オレンジは横の距離、緑は p0 での接線の傾き">
          <LikelihoodTriad />
        </Figure>
        <Intuition title="1つの山を3つの方法で測る">
          <ul>
            <li>
              <strong>尤度比</strong>：山頂 <M>{'\\hat{p}'}</M> と p0 の<strong>高さの差</strong>（赤い縦線）。
            </li>
            <li>
              <strong>ワルド</strong>：山頂と p0 の<strong>横の距離</strong>（オレンジ）を、山頂でのとがり具合で目盛り直ししたもの。
            </li>
            <li>
              <strong>スコア</strong>：p0 に立ったときの<strong>足もとの傾き</strong>（緑）を、p0 でのとがり具合で目盛り直ししたもの。
            </li>
          </ul>
          <p>
            山が放物線（2次関数）なら3つはぴったり一致します。n が大きいと対数尤度は山頂のまわりで放物線に近づくので、3つの値も近づきます。
            n が小さく山がゆがんでいると、値がずれて結論が分かれることもあります。
          </p>
        </Intuition>
        <Example title="結論が分かれる例（ポアソン、10 日で 30 件、H0: λ = 2）">
          <p>
            尤度比は 4.33 でした。ワルド型は <M>{'z_W = (3 - 2)/\\sqrt{3/10} \\approx 1.83'}</M>（標準誤差を <M>{'\\hat{\\lambda} = 3'}</M> で計算）で 1.96 未満、
            スコアは <M>{'z_S = (3 - 2)/\\sqrt{2/10} \\approx 2.24'}</M>（λ0 = 2 で計算）で 1.96 超え。ワルド型だけが「棄却できない」になります。
            小さい標本では、どの検定を使ったかを明記することが大切です。
          </p>
        </Example>
        <MathNote title="なぜ −2 log Λ がカイ二乗分布になるのか（読み飛ばしてよい）">
          <p>
            対数尤度を山頂 <M>{'\\hat{\\theta}'}</M> のまわりで2次式で近似します（テイラー展開。<Link to="/lessons/pre1-math-derivative">微分のレッスン</Link>）。山頂では傾きが 0 なので
          </p>
          <MathBlock>{'\\ell(\\theta_0) \\approx \\ell(\\hat{\\theta}) - \\frac{1}{2} I_n(\\hat{\\theta})(\\hat{\\theta} - \\theta_0)^2'}</MathBlock>
          <p>
            移項して2倍すると <M>{'-2\\log\\Lambda = 2\\{\\ell(\\hat{\\theta}) - \\ell(\\theta_0)\\} \\approx I_n(\\hat{\\theta})(\\hat{\\theta} - \\theta_0)^2 = W'}</M>。
            最尤推定量は近似的に <M>{'N(\\theta_0,\\ 1/I_n(\\theta_0))'}</M> なので、W は標準正規分布の2乗、つまり自由度1のカイ二乗分布に近づきます。
          </p>
        </MathNote>
      </Section>

      <Section title="3つの検定のまとめ">
        <DataTable
          head={['', '尤度比検定', 'ワルド型検定', 'スコア検定']}
          rows={[
            ['必要な推定', 'H0 のもとと制限なしの両方', '制限なしの最尤推定だけ', 'H0 の値だけ'],
            ['グラフで見ると', '高さの差', '横の距離', 'θ0 での傾き'],
            ['よく見る場面', '分割表の G 統計量、モデルの比較', '回帰係数の「推定値 ÷ 標準誤差」', '比率の z 検定、適合度の χ² 検定'],
            ['H0 のもとの分布', '近似的に χ²(r)', '近似的に χ²(r)', '近似的に χ²(r)'],
          ]}
          caption="r は H0 で固定したパラメータの数"
        />
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「ネイマン・ピアソンの基本定理は、どんな仮説にも最強力検定を与える」→ 違います。そのまま使えるのは<strong>単純仮説どうし</strong>。片側の複合仮説なら一様最強力検定が作れることもあるが、両側では一般に存在しない。
            </li>
            <li>
              尤度比 Λ は「H0 の最大尤度 ÷ 全体の最大尤度」なので 1 以下。<strong>Λ が小さいほど</strong> H0 が不自然。<M>{'-2\\log\\Lambda'}</M> は 0 以上で、<strong>大きいほど</strong>棄却。
            </li>
            <li>自由度は「データの数」ではなく、<strong>H0 で固定したパラメータの数</strong>。</li>
            <li>
              ウィルクスの定理は<strong>近似</strong>（n が大きいとき）。正規分布の平均（σ 既知）のように、たまたまぴったり成り立つ例もある。
            </li>
            <li>
              ワルド型は標準誤差を <M>{'\\hat{\\theta}'}</M> で、スコアは θ0 で計算する。逆にしない。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <p>
            <strong>確かめられること：</strong>出題範囲表（2027年1月版）の検定の項目に、ネイマン・ピアソンの基本定理、ワルド型検定、スコア検定、尤度比検定が並んでいます
            （<a href="https://www.toukei-kentei.jp/hubfs/files/20.grade/grade_range/grade1semi_hani_20270101.pdf">出題範囲表</a>）。
          </p>
          <p>
            <strong>出そうな形（推測）：</strong>正規分布や指数分布・ポアソン分布で尤度比を計算し、棄却域が「<M>{'\\bar{x} > c'}</M>」の形になることを選ぶ問題、
            <M>{'-2\\log\\Lambda'}</M> の値と自由度から棄却を判断する問題（対数の値は問題文で与えられる）、
            3つの検定の性質（どの推定量を使うか）を問う正誤問題などが考えられます。
          </p>
        </ExamTip>
      </Section>
    </>
  )
}
