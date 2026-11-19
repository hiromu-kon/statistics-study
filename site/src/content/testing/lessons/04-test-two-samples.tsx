import { DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { TResultPlot } from '../figures/MeanFigures'
import { TestSteps } from '../figures/TestSteps'
import { FTestPlot, TwoGroupsDemo } from '../figures/TwoSampleFigures'

export const meta: LessonMeta = {
  id: 'testing-two-samples',
  chapter: 'testing',
  order: 4,
  title: '2つの母集団の検定',
  summary: '2つのグループの平均・分散・比率に差があるかを調べます。平均の差は分散の情報によって z／プールした t／ウェルチの t を使い分けます。',
  minutes: 35,
  keywords: ['母平均の差の検定', 'プールした分散', 'ウェルチのt検定', '母分散の比の検定（F検定）', '母比率の差の検定'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          2つのグループの比較も、型は同じです。平均なら「<strong>平均の差 ÷ 差のふつうのぶれ</strong>」、分散なら「<strong>分散の比</strong>」、
          比率なら「<strong>比率の差 ÷ 差のふつうのぶれ</strong>」を検定統計量にします。
        </p>
      </Point>

      <Section title="差が同じでも、ばらつきで結論が変わる">
        <p>
          2つのクラスの平均点が3点違っても、みんなの点数がぎゅっと集まっていれば「はっきり違う」と言えそうですし、ばらばらなら「たまたま」かもしれません。
          t はこの感覚を数にしたものです。
        </p>
        <Figure caption="平均の差と標準偏差を動かしてみよう。差が同じでも、標準偏差が大きいと山が重なって t が小さくなる">
          <TwoGroupsDemo />
        </Figure>
      </Section>

      <Section title="平均の差の検定：3つのパターン">
        <p>
          H0 はどれも <M>{'\\mu_1 = \\mu_2'}</M>（差がない）。違うのは、<strong>分母の「差のぶれ」をどう見積もるか</strong>です。
        </p>
        <DataTable
          head={['母分散について', '検定統計量', 'H0 のもとでの分布']}
          rows={[
            [
              '両方わかっている（σ1², σ2²）',
              <M key="a">{'z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}}'}</M>,
              '標準正規分布',
            ],
            [
              'わからないが、等しい（σ1² = σ2²）と考えてよい',
              <M key="b">{'t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_p^2\\,(1/n_1 + 1/n_2)}}'}</M>,
              <>
                t 分布（自由度 <M>{'n_1+n_2-2'}</M>）
              </>,
            ],
            [
              'わからず、等しいとは限らない',
              <M key="c">{'t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}'}</M>,
              '近似的に t 分布（ウェルチの方法。自由度は近似式）',
            ],
          ]}
          caption="2つの母平均の差の検定の使い分け"
        />
        <Intuition title="差のぶれは「分散の足し算」">
          <p>
            確率変数の章で、独立な X と Y について <M>{'V(X - Y) = V(X) + V(Y)'}</M> でした。<M>{'\\bar{x}_1'}</M> の分散は <M>{'\\sigma_1^2/n_1'}</M>、
            <M>{'\\bar{x}_2'}</M> の分散は <M>{'\\sigma_2^2/n_2'}</M> なので、差の分散はその和。引き算でも分散は<strong>足す</strong>のがポイントです。
          </p>
        </Intuition>
      </Section>

      <Section title="プールした分散">
        <p>
          2つの母分散が等しいなら、2つの標本の不偏分散 <M>{'s_1^2, s_2^2'}</M> は同じものを推定しています。そこで2つを<strong>まとめて（プールして）</strong>
          1つの推定値にします。データが多い方を重く見る「重みつき平均」です。
        </p>
        <MathBlock caption="プールした分散。分子は「両グループの偏差の2乗の合計」、分母は自由度の合計">
          {'s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}'}
        </MathBlock>
        <Example title="2つの教え方のテスト結果">
          <p>
            教え方Aで学んだ8人と、教え方Bで学んだ10人に同じテストをしました。
          </p>
          <DataTable
            head={['', '人数 n', '平均 x̄', '不偏分散 s²']}
            rows={[
              ['教え方A', '8', '72.0', '36'],
              ['教え方B', '10', '66.0', '30'],
            ]}
          />
        </Example>
        <p>まず「等分散と考えてよいか」を F 検定で確かめ（下で説明）、問題なければプールした t 検定を使います。</p>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'\\mu_A = \\mu_B'}</M>、H1: <M>{'\\mu_A \\ne \\mu_B'}</M>（有意水準 5%）。
            </>
          }
          statistic={
            <>
              <M>{'s_p^2 = \\frac{7 \\times 36 + 9 \\times 30}{8 + 10 - 2} = \\frac{522}{16} = 32.625'}</M>。
              <br />
              <M>{'t = \\frac{72.0 - 66.0}{\\sqrt{32.625 \\times (1/8 + 1/10)}} = \\frac{6.0}{\\sqrt{7.341}} \\approx \\frac{6.0}{2.709} \\approx 2.21'}</M>
            </>
          }
          compare={
            <>
              自由度 <M>{'8+10-2 = 16'}</M>、両側 5% の境目は <M>{'t_{0.025}(16) = 2.120'}</M>。<M>{'2.21 > 2.120'}</M> なので棄却域に入る。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却する。「2つの教え方で平均点に差があるといえる」。</>}
        />
        <Figure caption="t ≒ 2.21 は右側の棄却域にぎりぎり入る">
          <TResultPlot t={2.215} df={16} />
        </Figure>
        <Note title="ウェルチの t 検定">
          <p>
            等分散と考えにくいときは、プールせずに分母を <M>{'\\sqrt{s_1^2/n_1 + s_2^2/n_2}'}</M> にします（ウェルチの t 検定）。
            この例なら <M>{'\\sqrt{36/8 + 30/10} = \\sqrt{7.5} \\approx 2.739'}</M>、<M>{'t \\approx 2.19'}</M>。自由度は次の近似式で求め、整数でないこともあります（この例で約 14.4）。
          </p>
          <MathBlock caption="ウェルチの近似自由度（ウェルチ・サタースウェイトの式）">
            {'\\nu \\approx \\frac{\\left(s_1^2/n_1 + s_2^2/n_2\\right)^2}{\\dfrac{(s_1^2/n_1)^2}{n_1-1} + \\dfrac{(s_2^2/n_2)^2}{n_2-1}}'}
          </MathBlock>
        </Note>
      </Section>

      <Section title="母分散の比の検定（F 検定）">
        <p>
          2つの母集団の<strong>ばらつきが同じか</strong>を調べます。分散は「差」でなく「比」で比べます。2つの母集団が正規分布で H0（<M>{'\\sigma_1^2 = \\sigma_2^2'}</M>）が正しければ、
          不偏分散の比は F 分布にしたがいます。
        </p>
        <MathBlock caption="分散の比。自由度は（分子の n − 1, 分母の n − 1）の順">{'F = \\frac{s_1^2}{s_2^2} \\sim F(n_1 - 1,\\ n_2 - 1)'}</MathBlock>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'\\sigma_A^2 = \\sigma_B^2'}</M>、H1: <M>{'\\sigma_A^2 \\ne \\sigma_B^2'}</M>（有意水準 5%、両側）。
            </>
          }
          statistic={
            <>
              大きい方の分散を分子にして <M>{'F = 36 / 30 = 1.2'}</M>（分子 A は自由度 7、分母 B は自由度 9）。
            </>
          }
          compare={
            <>
              両側 5% なので、上側 2.5% 点 <M>{'F_{0.025}(7, 9) = 4.20'}</M> と比べる。<M>{'1.2 < 4.20'}</M> なので棄却域に入らない。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却できない。「分散が異なるとはいえない」ので、上の例でプールした t 検定を使うのは自然。</>}
        />
        <Figure caption="F = 1.2 は分布の真ん中あたり。右の赤い部分（上側 2.5%）からは遠い">
          <FTestPlot F={1.2} d1={7} d2={9} />
        </Figure>
        <Intuition title="なぜ大きい方を分子にするの？">
          <p>
            両側検定なら、本当は左側（F が 1 よりずっと小さい側）の棄却域も考える必要があります。でも大きい方を分子にすれば F ≧ 1 になるので、
            <strong>右側の境目 <M>{'F_{\\alpha/2}'}</M> だけを見ればよい</strong>。F 分布表はふつう上側の値しか載っていないので、この方法がよく使われます。
            左側の境目が必要なときは <M>{'F_{1-\\alpha/2}(m, n) = 1 / F_{\\alpha/2}(n, m)'}</M>（自由度の順番を入れかえて逆数）で求めます。
          </p>
        </Intuition>
      </Section>

      <Section title="母比率の差の検定">
        <Example title="2つの広告のクリック率">
          <p>広告Aを 400人に見せたら 120人（30%）、広告Bを 400人に見せたら 90人（22.5%）がクリックしました。クリック率に差はあるでしょうか（有意水準 5%、両側）。</p>
        </Example>
        <p>
          H0（<M>{'p_1 = p_2'}</M>）が正しいなら、2つの比率は同じ値のはずです。そこで2つを合わせた比率 <M>{'\\hat{p}'}</M>（<strong>プールした比率</strong>）で分母を計算します。
        </p>
        <MathBlock caption="母比率の差の検定。p̂ = (x1 + x2) ÷ (n1 + n2)">
          {'z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}'}
        </MathBlock>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'p_A = p_B'}</M>、H1: <M>{'p_A \\ne p_B'}</M>。
            </>
          }
          statistic={
            <>
              <M>{'\\hat{p} = \\frac{120 + 90}{400 + 400} = 0.2625'}</M>。
              <br />
              <M>{'z = \\frac{0.300 - 0.225}{\\sqrt{0.2625 \\times 0.7375 \\times (1/400 + 1/400)}} \\approx \\frac{0.075}{0.0311} \\approx 2.41'}</M>
            </>
          }
          compare={
            <>
              両側 5% の境目 1.96 より大きい（1% の境目 2.576 よりは小さい）。p 値は約 0.016。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却する。「2つの広告のクリック率には差があるといえる」。</>}
        />
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              差の分散を引き算する → <M>{'\\sigma_1^2/n_1 + \\sigma_2^2/n_2'}</M>。差でも分散は<strong>足す</strong>。
            </li>
            <li>
              プールした分散を「2つの分散の単純平均」にする → n が違うときは <M>{'(n_1-1)'}</M>・<M>{'(n_2-1)'}</M> で重みをつける。
            </li>
            <li>
              プールした t の自由度を <M>{'n_1 + n_2 - 1'}</M> にする → 正しくは <M>{'n_1 + n_2 - 2'}</M>（平均を2つ推定した分、2を引く）。
            </li>
            <li>F 分布の自由度の順番を逆にする → （分子の自由度, 分母の自由度）の順。</li>
            <li>比率の差の検定で、分母を2つの比率別々に計算する → H0 のもとでは同じ比率なので、プールした <M>{'\\hat{p}'}</M> を使う。</li>
            <li>同じ人の前後比較に2標本の検定を使う → それは対応のあるデータ。差をとって1標本の t 検定にする（前のレッスン）。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>2群の n・平均・分散から、プールした分散と t の値を計算させる問題。</li>
            <li>状況（分散既知か、等分散か）を読んで、どの検定統計量を使うかを選ぶ問題。</li>
            <li>分散の比 F を計算し、F 分布表の値と比べて等分散かを判断する問題。</li>
            <li>2つの比率の差の検定で、プールした比率を使って z を計算する問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
