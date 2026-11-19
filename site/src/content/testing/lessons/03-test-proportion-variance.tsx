import { Link } from 'react-router-dom'
import { Card, Compare, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BinomNormal, Chi2Region, VarianceTestFigure } from '../figures/PropVarFigures'
import { TestSteps } from '../figures/TestSteps'

export const meta: LessonMeta = {
  id: 'testing-proportion-variance',
  chapter: 'testing',
  order: 3,
  title: '母比率と母分散の検定',
  summary: '「不良品の割合は基準どおり？」は正規近似の z 検定、「ばらつきは基準どおり？」は χ² 検定。検定の型はそのままです。',
  minutes: 30,
  keywords: ['母比率の検定', '正規近似', '母分散の検定', 'カイ二乗検定'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>比率</strong>の検定は「標本の比率 <M>{'\\hat{p}'}</M>（ピー・ハット）と基準の比率 <M>{'p_0'}</M>（ピー・ゼロ）の差 ÷ ふつうのぶれ」で z を作ります。
          <strong>分散</strong>の検定は「標本の分散 <M>{'s^2'}</M> が基準の分散 <M>{'\\sigma_0^2'}</M>（シグマ・ゼロの2乗）の何倍か」を χ²（カイ二乗）にして調べます。
        </p>
      </Point>

      <Section title="母比率の検定">
        <Example title="不良品の割合">
          <p>
            ある部品の不良品率は、これまで 10% でした。新しい工程で作った 400個を調べたら、不良品は 52個（13%）でした。不良品率は変わったといえるでしょうか（有意水準 5%、両側）。
          </p>
        </Example>
        <p>
          H0（不良品率 0.1）が正しいとすると、400個中の不良品の数は二項分布 <M>{'B(400,\\ 0.1)'}</M> にしたがいます。n が大きいので、
          これは平均 <M>{'np_0 = 400 \\times 0.1 = 40'}</M>、標準偏差 <M>{'\\sqrt{np_0(1-p_0)} = \\sqrt{400 \\times 0.1 \\times 0.9} = \\sqrt{36} = 6'}</M> の正規分布でよく近似できます
          （<strong>正規近似</strong>。<Link to="/lessons/sampling-normal-approximation">二項分布の正規近似</Link>）。<M>{'np_0'}</M> と <M>{'n(1-p_0)'}</M> がどちらも 5 以上（10 以上とする本もある）
          なら近似してよい、という目安がよく使われます。
        </p>
        <Figure caption="H0 のもとでの不良品の数の分布。棒（二項分布）と曲線（正規分布）はほぼ重なる。観測した 52個は右の棄却域にぎりぎり入る">
          <BinomNormal />
        </Figure>
        <p>個数のままでも検定できますが、ふつうは比率に直して z を作ります。</p>
        <MathBlock caption="母比率の検定統計量。分母の p は H0 の値 p0 を使う">{'z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}}'}</MathBlock>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'p = 0.1'}</M>、H1: <M>{'p \\ne 0.1'}</M>。
            </>
          }
          statistic={
            <>
              <M>{'\\hat{p} = 52/400 = 0.13'}</M>。分母は <M>{'\\sqrt{0.1 \\times 0.9 / 400} = \\sqrt{0.000225} = 0.015'}</M>。
              <br />
              <M>{'z = \\frac{0.13 - 0.1}{0.015} = \\frac{0.03}{0.015} = 2.00'}</M>
            </>
          }
          compare={
            <>
              両側 5% の境目 1.96 より大きいので棄却域に入る。p 値は <M>{'2 \\times P(Z \\ge 2.00) \\approx 2 \\times 0.0228 = 0.0455'}</M>。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却する。「不良品率は 10% から変わったといえる」。ただし 1% では棄却できない、きわどい結果。</>}
        />
        <Intuition title="なぜ分母は p0？">
          <p>
            検定はいつも「<strong>H0 が正しいと仮定したら</strong>」から始まります。H0 が正しい世界では、比率のぶれ（標準誤差）は
            <M>{'\\sqrt{p_0(1-p_0)/n}'}</M> です。区間推定では p0 がないので <M>{'\\hat{p}'}</M> を使いますが、検定では p0 がわかっているのでそれを使います。
          </p>
        </Intuition>
      </Section>

      <Section title="母分散の検定">
        <Example title="機械の精度">
          <p>
            ある機械で作るネジの長さの分散は <M>{'\\sigma_0^2 = 4'}</M>（mm²）でした。古くなってばらつきが大きくなっていないか、15本を測ると
            <Link to="/lessons/estimation-point">不偏分散</Link>（偏差の2乗の合計を n − 1 で割った分散）は <M>{'s^2 = 7.2'}</M> でした（母集団は正規分布とする）。
          </p>
        </Example>
        <p>
          分散は「差」ではなく「何倍か」で比べます。H0 が正しく母集団が正規分布なら、次の χ² は<strong>自由度 n − 1 のカイ二乗分布</strong>
          （<Link to="/lessons/sampling-chi2-t-f">χ² 分布のレッスン</Link>）にしたがいます。分布表の <M>{'\\chi^2_{0.05}(14)'}</M> は「自由度 14 で、右側の面積が 0.05 になる点」です。
        </p>
        <MathBlock caption="母分散の検定統計量。s² が σ0² の何倍かに、自由度 n − 1 をかけた形">{'\\chi^2 = \\frac{(n-1)s^2}{\\sigma_0^2}'}</MathBlock>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'\\sigma^2 = 4'}</M>。ばらつきが「大きくなった」かを知りたいので H1: <M>{'\\sigma^2 > 4'}</M>（右片側）。
            </>
          }
          statistic={
            <>
              <M>{'\\chi^2 = \\frac{(15-1) \\times 7.2}{4} = \\frac{100.8}{4} = 25.2'}</M>
            </>
          }
          compare={
            <>
              自由度 14 の χ² 分布の上側 5% 点は <M>{'\\chi^2_{0.05}(14) = 23.685'}</M>。<M>{'25.2 > 23.685'}</M> なので棄却域に入る。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却する。「ばらつきは大きくなったといえる」。</>}
        />
        <Figure caption="同じ χ² = 25.2 でも、両側検定にすると上側の境目が 26.119 に動き、棄却できなくなる">
          <VarianceTestFigure />
        </Figure>
        <p>
          もし H1 を <M>{'\\sigma^2 \\ne 4'}</M>（両側）にしていたら、境目は下側 <M>{'\\chi^2_{0.975}(14) = 5.629'}</M> と上側
          <M>{'\\chi^2_{0.025}(14) = 26.119'}</M>。25.2 はその間なので棄却できません。H1 の立て方で結論が変わる例です。
          だからこそ、片側か両側かは<strong>データを見る前に</strong>目的から決めます（「大きくなっていないか」が知りたいなら右片側）。
        </p>
        <p>
          逆に「新しい機械でばらつきが<strong>小さくなった</strong>か」を調べるなら H1: <M>{'\\sigma^2 < \\sigma_0^2'}</M>（左片側）で、χ² が<strong>下側</strong>の境目
          <M>{'\\chi^2_{0.95}(n-1)'}</M>（右側の面積が 0.95 ＝ 左側の面積が 0.05 になる点）より小さいときに棄却します。
        </p>
      </Section>

      <Section title="χ² 分布の棄却域は左右非対称">
        <p>
          正規分布や t 分布は左右対称なので、両側検定の境目は「±同じ値」でした。χ² 分布は<strong>右に長くすそを引いた形</strong>なので、
          左右の境目は別々に表から読みます。
        </p>
        <Figure caption="自由度を動かしてみよう。左右の赤い部分の面積はどちらも 0.025 だが、境目の位置は非対称">
          <Chi2Region />
        </Figure>
        <Compare>
          <Card title="下側の境目">
            <p>
              <M>{'\\chi^2_{0.975}(n-1)'}</M>。「上側確率 0.975」の列を読む（＝左側の面積が 0.025）。分散が<strong>小さすぎる</strong>ことを見つける側。
            </p>
          </Card>
          <Card title="上側の境目">
            <p>
              <M>{'\\chi^2_{0.025}(n-1)'}</M>。「上側確率 0.025」の列を読む。分散が<strong>大きすぎる</strong>ことを見つける側。
            </p>
          </Card>
        </Compare>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              比率の検定の分母に <M>{'\\hat{p}'}</M> を使う → 検定では H0 の値 <M>{'p_0'}</M> を使う（区間推定と混同しやすい）。
            </li>
            <li>
              比率の分母で √ を忘れる・n で割るのを忘れる → 標準誤差は <M>{'\\sqrt{p_0(1-p_0)/n}'}</M>。
            </li>
            <li>
              母分散の χ² で、分子に n を使う → <M>{'(n-1)s^2'}</M>（s² が n − 1 で割った不偏分散のとき）。n で割った分散 <M>{'S^2'}</M> なら <M>{'nS^2'}</M> になる。どちらも「偏差の2乗の合計」。
            </li>
            <li>χ² の両側検定で、左の境目を「マイナス右の境目」にする → χ² は負にならず、左右非対称。表から別々に読む。</li>
            <li>母分散の検定は母集団が正規分布であることが前提。比率の検定は n が十分大きいことが前提（正規近似のため）。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>支持率・不良品率などの比率について、z の値を計算して 5%・1% で棄却されるかを選ぶ問題。</li>
            <li>標本分散から χ² の値を計算し、χ² 分布表の上側・下側の値と比べる問題。</li>
            <li>片側検定か両側検定かで結論が変わる、きわどい数値の問題。</li>
            <li>検定統計量を<strong>求める式</strong>（分母が p0 か p̂ か、分子が n − 1 か n か）を選ばせる問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
