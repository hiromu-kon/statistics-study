import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { CorrNullDemo, FisherZDemo } from '../figures/CorrFigures'

export const meta: LessonMeta = {
  id: 'pre1-testing-normal',
  chapter: 'pre1-testing',
  order: 3,
  title: '正規分布に関する検定',
  summary: '母平均・母分散・2標本の検定を1枚の表にまとめ直し、それらが尤度比検定から出てくることを確かめます。新しく母相関係数の検定（t 検定とフィッシャーの z 変換）を学びます。',
  minutes: 40,
  keywords: ['母平均・母分散に関する検定', '2標本問題に関する検定', '母相関係数に関する検定'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          正規分布を仮定した検定は、2級で使った z・t・χ²・F の4つの分布でほとんど片づきます。準1級で新しく加わるのは<strong>母相関係数の検定</strong>です。
          「ρ = 0（無相関）か」は <M>{'t = r\\sqrt{n-2}/\\sqrt{1-r^2}'}</M> の t 検定で、「ρ = 0.4 か」のように 0 以外の値と比べるときは<strong>フィッシャーの z 変換</strong>で正規分布に直して検定します。
        </p>
      </Point>

      <Section title="2級の復習：正規母集団の検定の一覧">
        <p>
          くわしくは2級の <Link to="/lessons/testing-mean">母平均の検定</Link>、<Link to="/lessons/testing-proportion-variance">母比率・母分散の検定</Link>、
          <Link to="/lessons/testing-two-samples">2標本の検定</Link> を見てください。ここでは「何を調べたいか → 統計量 → 分布」を1枚にまとめます。
        </p>
        <DataTable
          head={['調べたいこと', '条件', '検定統計量', 'H0 のもとでの分布']}
          rows={[
            ['母平均 μ = μ0', 'σ 既知', <M key="1">{'z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}'}</M>, 'N(0, 1)'],
            ['母平均 μ = μ0', 'σ 未知', <M key="2">{'t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}'}</M>, 't(n − 1)'],
            ['母分散 σ² = σ0²', '', <M key="3">{'\\chi^2 = \\frac{(n-1)s^2}{\\sigma_0^2}'}</M>, 'χ²(n − 1)'],
            ['対応のある2標本の平均の差', '差 d をとる', <M key="4">{'t = \\frac{\\bar{d}}{s_d/\\sqrt{n}}'}</M>, 't(n − 1)'],
            ['2標本の平均の差', 'σ1, σ2 既知', <M key="5">{'z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}}'}</M>, 'N(0, 1)'],
            ['2標本の平均の差', '未知だが等しい', <M key="6">{'t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p\\sqrt{1/n_1 + 1/n_2}}'}</M>, 't(n1 + n2 − 2)'],
            ['2標本の平均の差', '未知で等しいとは限らない', <M key="7">{'t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}'}</M>, '近似的に t(ν)（ウェルチ）'],
            ['2標本の分散の比 σ1² = σ2²', '', <M key="8">{'F = \\frac{s_1^2}{s_2^2}'}</M>, 'F(n1 − 1, n2 − 1)'],
          ]}
          caption="正規母集団についての検定（s² は n − 1 で割る不偏分散、sp² はプールした分散）"
        />
        <MathBlock caption="プールした分散（2群をまとめた分散の推定）とウェルチの近似自由度 ν">
          {'s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}, \\qquad \\nu = \\frac{\\left(s_1^2/n_1 + s_2^2/n_2\\right)^2}{\\frac{(s_1^2/n_1)^2}{n_1 - 1} + \\frac{(s_2^2/n_2)^2}{n_2 - 1}}'}
        </MathBlock>
        <Example title="ウェルチの自由度の計算">
          <p>
            <M>{'n_1 = n_2 = 10'}</M>、<M>{'s_1^2 = 40'}</M>、<M>{'s_2^2 = 10'}</M> のとき、<M>{'s_1^2/n_1 = 4'}</M>、<M>{'s_2^2/n_2 = 1'}</M> なので
          </p>
          <MathBlock>{'\\nu = \\frac{(4 + 1)^2}{4^2/9 + 1^2/9} = \\frac{25}{17/9} = \\frac{225}{17} \\approx 13.24'}</MathBlock>
          <p>
            等分散なら自由度は 10 + 10 − 2 = 18 でした。分散が大きく違うほど、ν は小さくなります（t 分布の裾が重くなり、棄却しにくくなる）。
            t 分布表は整数の自由度しかないので、ν に近い整数の値（切り捨てると安全側）を使います。
          </p>
        </Example>
      </Section>

      <Section title="これらの検定はどこから来たのか">
        <p>
          <Link to="/lessons/pre1-testing-derivation">前のレッスン</Link>で、σ 既知の z 検定が尤度比検定そのものであることを見ました。σ が未知の t 検定も同じです。
        </p>
        <Steps>
          <li>
            制限なしの最尤推定：<M>{'\\hat{\\mu} = \\bar{x}'}</M>、<M>{'\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i - \\bar{x})^2'}</M>。
          </li>
          <li>
            H0: <M>{'\\mu = \\mu_0'}</M> のもとでの最尤推定：<M>{'\\hat{\\sigma}_0^2 = \\frac{1}{n}\\sum(x_i - \\mu_0)^2'}</M>。
          </li>
          <li>
            正規分布の尤度の最大値は <M>{'(\\hat{\\sigma}^2)^{-n/2}'}</M> に比例するので、
            <MathBlock>{'\\Lambda = \\left(\\frac{\\hat{\\sigma}^2}{\\hat{\\sigma}_0^2}\\right)^{n/2} = \\left(1 + \\frac{t^2}{n-1}\\right)^{-n/2}'}</MathBlock>
          </li>
        </Steps>
        <p>
          Λ は <M>{'t^2'}</M> が大きいほど小さくなります。つまり「Λ が小さければ棄却」は「|t| が大きければ棄却」と同じで、<strong>t 検定は尤度比検定</strong>です。
          しかも t 分布という<strong>正確な</strong>分布がわかるので、ウィルクスの近似（χ²）を使う必要がありません。母分散の χ² 検定、分散比の F 検定も、同じように尤度比から導けます。
        </p>
        <MathNote title="最後の等号の確かめ方">
          <p>
            偏差平方和の分解 <M>{'\\sum(x_i - \\mu_0)^2 = \\sum(x_i - \\bar{x})^2 + n(\\bar{x} - \\mu_0)^2'}</M> の両辺を <M>{'\\sum(x_i - \\bar{x})^2 = (n-1)s^2'}</M> で割ると
            <M>{'\\hat{\\sigma}_0^2/\\hat{\\sigma}^2 = 1 + \\frac{n(\\bar{x} - \\mu_0)^2}{(n-1)s^2} = 1 + \\frac{t^2}{n-1}'}</M>。
          </p>
        </MathNote>
      </Section>

      <Section title="母相関係数の検定（H0: ρ = 0）">
        <Example title="勉強時間とテストの点数">
          <p>
            27 人を調べたら、勉強時間と点数の相関係数（<Link to="/lessons/bivariate-scatter-correlation">2級の相関係数</Link>）は r = 0.4 でした。
            母集団でも相関がある（ρ ≠ 0）といえるでしょうか。偶然 r = 0.4 くらいになることはないのでしょうか。
          </p>
        </Example>
        <p>
          (X, Y) が2変量正規分布にしたがい、母相関係数（母集団での相関係数）を ρ（ロー）と書きます。H0: ρ = 0 のもとで次の統計量は t 分布にしたがいます。
        </p>
        <MathBlock caption="無相関の検定。r は標本相関係数、n は組の数">{'t = \\frac{r\\sqrt{n - 2}}{\\sqrt{1 - r^2}} \\sim t(n - 2)'}</MathBlock>
        <Steps>
          <li>
            <M>{'t = \\frac{0.4 \\times \\sqrt{25}}{\\sqrt{1 - 0.16}} = \\frac{2}{\\sqrt{0.84}} \\approx \\frac{2}{0.9165} \\approx 2.18'}</M>
          </li>
          <li>
            自由度 <M>{'27 - 2 = 25'}</M> の両側 5% 点は <M>{'t_{0.025}(25) = 2.060'}</M>。
          </li>
          <li>
            <M>{'2.18 > 2.060'}</M> なので、有意水準 5% で「無相関」を棄却。勉強時間と点数には相関があるといえる。
          </li>
        </Steps>
        <Figure caption="母相関が 0 のときの r の分布と、両側 5% の棄却域（赤）。n が小さいと、かなり大きな r でも偶然出てしまう">
          <CorrNullDemo />
        </Figure>
        <Intuition title="自由度が n − 2 なのはなぜ？">
          <p>
            この t は、Y を X で回帰したときの<strong>傾きの t 値</strong>（<Link to="/lessons/linear-models-regression-inference">2級の回帰係数の検定</Link>）とまったく同じ値になります。
            回帰直線を引くには切片と傾きの2つを推定するので、残差の自由度が n − 2 になる、というのと同じ理由です。
          </p>
        </Intuition>
        <MathNote title="傾きの t 値と一致することの確かめ（読み飛ばしてよい）">
          <p>
            傾きは <M>{'\\hat{b} = r\\,s_y/s_x'}</M>、残差平方和は <M>{'(1 - r^2)\\sum(y_i - \\bar{y})^2'}</M>。傾きの標準誤差は
            <M>{'\\mathrm{SE}(\\hat{b}) = \\sqrt{\\frac{(1 - r^2)\\sum(y_i - \\bar{y})^2/(n-2)}{\\sum(x_i - \\bar{x})^2}} = \\frac{s_y}{s_x}\\sqrt{\\frac{1 - r^2}{n - 2}}'}</M> なので、
            <M>{'\\hat{b}/\\mathrm{SE}(\\hat{b}) = r\\sqrt{n-2}/\\sqrt{1 - r^2}'}</M>。
          </p>
        </MathNote>
      </Section>

      <Section title="フィッシャーの z 変換（H0: ρ = ρ0）">
        <p>
          「ρ = 0.4 と言われているが本当か」「2つの集団で相関の強さは同じか」のように、0 以外の値と比べたいときは上の t 検定は使えません。
          ρ ≠ 0 のとき、r の分布は<strong>左右対称でなく</strong>、ばらつきも ρ によって変わるからです。そこで r を次のように変換します。
        </p>
        <MathBlock caption="フィッシャーの z 変換（log は自然対数）。n が大きいとき、z は近似的に平均 artanh ρ、分散 1/(n − 3) の正規分布にしたがう">
          {'z = \\frac{1}{2}\\log\\frac{1 + r}{1 - r} \\ \\approx\\ N\\left(\\frac{1}{2}\\log\\frac{1 + \\rho}{1 - \\rho},\\ \\frac{1}{n - 3}\\right)'}
        </MathBlock>
        <p>
          この変換は双曲線正接の逆関数 <M>{'\\mathrm{artanh}\\, r'}</M>（<M>{'\\tanh^{-1} r'}</M>）と同じものです。ポイントは<strong>分散が ρ によらず 1/(n − 3)</strong> になることです。
        </p>
        <Figure caption="n = 20 の標本で r と z を 2000 回ずつ計算したヒストグラム。ρ を大きくすると r は右に詰まって歪むが、z は正規曲線（黒）によく合う">
          <FisherZDemo />
        </Figure>
        <Example title="ρ = 0.4 と言われている関係を、103 組のデータで確かめたら r = 0.6">
          <p>
            H0: ρ = 0.4、H1: ρ ≠ 0.4、有意水準 5%。<M>{'\\log 4 = 1.3863'}</M>、<M>{'\\log(7/3) = 0.8473'}</M> とします。
          </p>
          <Steps>
            <li>
              <M>{'z = \\frac{1}{2}\\log\\frac{1.6}{0.4} = \\frac{1}{2}\\log 4 = 0.6931'}</M>
            </li>
            <li>
              <M>{'\\zeta_0 = \\frac{1}{2}\\log\\frac{1.4}{0.6} = \\frac{1}{2}\\log\\frac{7}{3} = 0.4236'}</M>（ζ は「ゼータ」）
            </li>
            <li>
              標準化：<M>{'Z = (z - \\zeta_0)\\sqrt{n - 3} = (0.6931 - 0.4236) \\times \\sqrt{100} = 2.695'}</M>
            </li>
            <li>
              <M>{'|Z| = 2.70 > 1.96'}</M> なので、有意水準 5% で H0: ρ = 0.4 を棄却する。
            </li>
          </Steps>
        </Example>
        <Note title="区間推定と2群の比較にも使える">
          <p>
            z の 95% 信頼区間 <M>{'z \\pm 1.96/\\sqrt{n - 3}'}</M> を作り、両端を逆変換 <M>{'r = \\tanh z = \\frac{e^{2z} - 1}{e^{2z} + 1}'}</M> で戻すと、ρ の信頼区間になります
            （上の例では約 0.46〜0.71。0.6 を中心に左右非対称）。
            2つの独立な集団の相関を比べるときは、<M>{'(z_1 - z_2)/\\sqrt{1/(n_1 - 3) + 1/(n_2 - 3)}'}</M> を標準正規分布と比べます。
          </p>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              無相関の検定の自由度は <strong>n − 2</strong>（n − 1 ではない）。n − 3 はフィッシャーの z 変換の分散の分母。混ぜないこと。
            </li>
            <li>
              「無相関の検定で有意 ＝ 強い相関がある」→ 違います。n が大きいと小さな r でも有意になります。n = 402 なら r = 0.1 でも t ≒ 2.01 で 5% 有意です。
            </li>
            <li>
              <M>{'t = r\\sqrt{n-2}/\\sqrt{1-r^2}'}</M> は <strong>ρ = 0 の検定専用</strong>。ρ = 0.4 などと比べるときはフィッシャーの z 変換を使う。
            </li>
            <li>どれも2変量正規分布を前提にした方法。外れ値に弱く、曲がった関係は見のがす（順位相関は <Link to="/lessons/pre1-testing-nonparametric">ノンパラメトリック法のレッスン</Link>）。</li>
            <li>
              ウェルチの自由度は整数とは限らない。分散が等しいときの <M>{'n_1 + n_2 - 2'}</M> より大きくなることはない。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <p>
            <strong>確かめられること：</strong>出題範囲表（2027年1月版）の検定の項目に「母平均・母分散に関する検定」「2標本問題に関する検定」「母相関係数に関する検定」があります
            （<a href="https://www.toukei-kentei.jp/hubfs/files/20.grade/grade_range/grade1semi_hani_20270101.pdf">出題範囲表</a>）。2級の内容はすべて準1級の範囲に含まれます。
          </p>
          <p>
            <strong>出そうな形（推測）：</strong>r と n から t 値を計算して無相関を判定する問題、フィッシャーの z 変換で ρ = ρ0 を検定する・信頼区間を作る問題（対数の値は与えられる）、
            ウェルチの自由度を計算する数値入力問題などが考えられます。
          </p>
        </ExamTip>
      </Section>
    </>
  )
}
