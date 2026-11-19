import { DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import { NormalArea } from '../../../components/charts/common'
import type { LessonMeta } from '../../../types'
import { ChebyshevPlot } from '../figures/ChebyshevPlot'
import { CltDemo } from '../figures/CltDemo'
import { RunningMean } from '../figures/RunningMean'

export const meta: LessonMeta = {
  id: 'sampling-lln-clt',
  chapter: 'sampling',
  order: 2,
  title: '大数の法則と中心極限定理',
  summary: 'たくさん集めた平均は真の平均に近づき（大数の法則）、その分布はもとの形に関係なく正規分布に近づきます（中心極限定理）。',
  minutes: 35,
  keywords: ['チェビシェフの不等式', '大数の法則', '中心極限定理'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <ul>
          <li>
            <strong>大数の法則</strong>：標本の大きさ n を大きくすると、標本平均は母平均 μ に近づいていく。
          </li>
          <li>
            <strong>中心極限定理</strong>：n が大きければ、母集団がどんな形の分布でも、標本平均の分布は正規分布
            <M>{'N(\\mu, \\sigma^2/n)'}</M> で近似できる。
          </li>
          <li>
            <strong>チェビシェフの不等式</strong>：どんな分布でも「平均から標準偏差の k 倍以上はなれる確率は <M>{'1/k^2'}</M> 以下」。
          </li>
        </ul>
      </Point>

      <Section title="大数の法則：振り続けると平均は 3.5 に落ち着く">
        <p>
          サイコロの目の期待値は <M>{'(1+2+3+4+5+6)/6 = 3.5'}</M> です。でも 3 回振っただけなら、平均が 5 になることもあります。
          では、何百回も振り続けたら？
        </p>
        <Figure caption="3人がそれぞれサイコロを500回振ったときの「それまでの平均」。最初は大きく上下するが、回数が増えると3.5の線に近づいていく">
          <RunningMean />
        </Figure>
        <p>
          これが<strong>大数の法則</strong>です。前のレッスンの言葉でいうと、標本平均の分散 <M>{'\\sigma^2/n'}</M> は n を大きくすると
          0 に近づくので、標本平均はほとんど μ の近くにしか来なくなる、ということです。
        </p>
        <Example title="身近な例">
          <p>
            保険会社は、1 人ひとりの事故は予想できなくても、加入者が何万人もいれば「1 人あたりの平均の支払額」はほぼ期待値どおりになることを利用して、
            保険料を決めています。
          </p>
        </Example>
      </Section>

      <Section title="中心極限定理：平均をとるとベル型になる">
        <p>
          大数の法則は「μ に近づく」ことを言いますが、「μ のまわりにどんな形でばらつくか」までは言いません。それを教えてくれるのが
          <strong>中心極限定理</strong>です。
        </p>
        <Figure caption="もとの分布が右に長い（待ち時間）でも平ら（サイコロ）でも、n を大きくすると標本平均のヒストグラムはオレンジの正規曲線に重なっていく">
          <CltDemo />
        </Figure>
        <Intuition title="なぜベル型になるの？">
          <p>
            平均をとると、極端に大きい値と小さい値が打ち消しあい、「真ん中あたりの値」になる組み合わせがいちばん多くなります。
            サイコロ 2 個の合計で 7 がいちばん出やすいのと同じ理由です。個数を増やすほど、この「真ん中に集まる」効果が強くなり、形がなめらかな山になります。
          </p>
        </Intuition>
        <MathBlock caption="中心極限定理：n が大きいとき、標本平均はおよそ正規分布に従う（≈ は「近似的に」の意味）">{'\\bar{X} \\approx N\\left(\\mu,\\ \\frac{\\sigma^2}{n}\\right)'}</MathBlock>
        <MathBlock caption="標準化すると、およそ標準正規分布に従う">{'Z = \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\approx N(0, 1)'}</MathBlock>
        <p>
          母集団がもともと正規分布なら、n が小さくても標本平均は<strong>ぴったり</strong>正規分布に従います。中心極限定理のありがたさは、
          母集団が正規分布で<strong>なくても</strong>、n が大きければ正規分布で計算してよい、という点にあります。
        </p>
        <Example title="計算してみよう：電池の寿命">
          <p>
            ある電池の寿命は平均 500 時間・標準偏差 100 時間で、分布の形はわかりません。100 個を選んだとき、平均寿命が 515 時間以上になる確率は？
          </p>
          <Steps>
            <li>
              標準誤差：<M>{'100/\\sqrt{100} = 10'}</M> 時間
            </li>
            <li>
              中心極限定理より <M>{'\\bar{X} \\approx N(500, 10^2)'}</M>
            </li>
            <li>
              標準化：<M>{'z = (515 - 500)/10 = 1.5'}</M>
            </li>
            <li>
              正規分布表から <M>{'P(Z \\ge 1.5) = 0.0668'}</M>。約 6.7% です。
            </li>
          </Steps>
          <NormalArea from={1.5} to={10} />
        </Example>
      </Section>

      <Section title="チェビシェフの不等式：分布がわからなくても言えること">
        <p>
          正規分布なら「平均 ± 2σ の外に出る確率は約 4.6%」とわかります。では分布の形がまったくわからないときは？
          そんなときでも使える大ざっぱな上限が<strong>チェビシェフの不等式</strong>です。
        </p>
        <MathBlock caption="平均から kσ 以上はなれる確率は、どんな分布でも 1/k² 以下">{'P(|X - \\mu| \\ge k\\sigma) \\le \\frac{1}{k^2}'}</MathBlock>
        <MathBlock caption="同じことを「内側」で言うと">{'P(|X - \\mu| < k\\sigma) \\ge 1 - \\frac{1}{k^2}'}</MathBlock>
        <DataTable
          head={['k', 'チェビシェフの上限 1/k²', '正規分布なら実際は']}
          rows={[
            ['1.5', '0.444', '0.134'],
            ['2', '0.25', '0.0455'],
            ['3', '0.111', '0.0027'],
          ]}
          caption="平均から kσ 以上はなれる確率。上限は「これより大きくはならない」という保証で、実際の値よりかなり大きい"
        />
        <Figure caption="分布とkを変えて、塗った部分（実際の確率）がいつも1/k²以下になっていることを確かめよう">
          <ChebyshevPlot />
        </Figure>
        <Example title="計算してみよう">
          <p>
            平均 60、標準偏差 5 の分布（形は不明）で、45 以下または 75 以上になる確率の上限は？
          </p>
          <p>
            45 と 75 は平均から 15 はなれていて、<M>{'15 = 3 \\times 5'}</M> なので k = 3。上限は <M>{'1/3^2 = 1/9 \\approx 0.111'}</M> です。
          </p>
        </Example>
        <Intuition title="大数の法則とのつながり">
          <p>
            チェビシェフの不等式を標本平均（標準偏差 <M>{'\\sigma/\\sqrt{n}'}</M>）にあてはめると、「標本平均が μ から一定以上はなれる確率」の上限は
            n を大きくすると 0 に近づきます。これが大数の法則の理由づけになります。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「中心極限定理で、<strong>母集団</strong>が正規分布になる」→ 正規分布に近づくのは<strong>標本平均の分布</strong>です。1 人ずつのデータの分布は変わりません。
            </li>
            <li>
              「大数の法則があるから、表が続いたら次は裏が出やすい」→ コインに記憶はありません。毎回の確率は 1/2 のまま。たくさん振れば
              「割合」が 1/2 に近づくだけです（ギャンブラーの誤謬と呼ばれます）。
            </li>
            <li>
              チェビシェフの不等式の値を「確率そのもの」と思う → あくまで「これ以下」という上限です。
            </li>
            <li>
              中心極限定理の標準偏差を σ のまま使う → 標本平均なら <M>{'\\sigma/\\sqrt{n}'}</M> で割って標準化します。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>大数の法則・中心極限定理の説明として正しい文を選ぶ問題。何が何に近づくのかを正確に。</li>
            <li>分布の形がわからない母集団から n 個とったとき、標本平均（や合計）がある範囲に入る確率を正規分布で近似する問題。</li>
            <li>チェビシェフの不等式で、確率の上限（または下限）を求める問題。「平均から何σはなれているか」をまず計算する。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
