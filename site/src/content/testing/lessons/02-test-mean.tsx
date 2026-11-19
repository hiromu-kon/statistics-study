import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BatteryDots, CiTestLink, PairedPlot, TResultPlot, TvsZ } from '../figures/MeanFigures'
import { TestSteps } from '../figures/TestSteps'

export const meta: LessonMeta = {
  id: 'testing-mean',
  chapter: 'testing',
  order: 2,
  title: '母平均の検定',
  summary: '「平均は本当に基準の値と同じ？」を調べます。σ がわかっていれば z 検定、わからなければ t 検定。前後比較は差をとって t 検定にします。',
  minutes: 30,
  keywords: ['z検定', 't検定', '母分散既知', '母分散未知', '対応のあるt検定'],
}

const BATTERY = [18.6, 19.4, 20.1, 18.9, 19.7, 19.2, 18.4, 20.3, 19.0, 19.5]
const BEFORE = [62, 70, 55, 68, 74, 58]
const AFTER = [65, 75, 54, 72, 76, 63]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          標本平均 <M>{'\\bar{x}'}</M> と基準の値 <M>{'\\mu_0'}</M> の差を、「標本平均がふつうどれくらいぶれるか（標準誤差）」で割ります。
          その値が大きければ「偶然のぶれでは説明できない差」と判断します。
        </p>
      </Point>

      <Section title="検定統計量の作り方">
        <p>
          前の章で学んだように、標本平均 <M>{'\\bar{x}'}</M> は平均 <M>{'\\mu'}</M>、標準偏差 <M>{'\\sigma/\\sqrt{n}'}</M> の正規分布にしたがいます
          （母集団が正規分布、または n が大きいとき）。この <M>{'\\sigma/\\sqrt{n}'}</M> を<strong>標準誤差</strong>といいます。
        </p>
        <MathBlock caption="「差」を「ふつうのぶれ」で割る。分母が σ（既知）なら z、s（標本から計算）なら t">
          {'\\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}} \\qquad \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}'}
        </MathBlock>
        <Compare>
          <Card title="母分散 σ² がわかっている → z 検定">
            <p>
              検定統計量 <M>{'z = \\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}'}</M> は、H0 のもとで<strong>標準正規分布</strong>にしたがう。境目は 1.96（両側5%）など。
            </p>
          </Card>
          <Card title="母分散がわからない → t 検定">
            <p>
              σ の代わりに標本標準偏差 s（n − 1 で割る）を使う。<M>{'t = \\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}}'}</M> は H0 のもとで<strong>自由度 n − 1 の t 分布</strong>にしたがう。
            </p>
          </Card>
        </Compare>
      </Section>

      <Section title="例1：σ がわかっているとき（z 検定）">
        <Example title="お菓子の袋の重さ">
          <p>
            ある工場のお菓子は 1袋 200g になるように作られていて、重さの標準偏差は長年の記録から <M>{'\\sigma = 4'}</M>g とわかっています。
            今日 16袋を量ったら平均は <M>{'\\bar{x} = 202.3'}</M>g でした。機械の設定がずれているでしょうか（有意水準 5%）。
          </p>
        </Example>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'\\mu = 200'}</M>、H1: <M>{'\\mu \\ne 200'}</M>（重くても軽くても困るので両側）。
            </>
          }
          statistic={
            <>
              <M>{'z = \\frac{202.3 - 200}{4/\\sqrt{16}} = \\frac{2.3}{1} = 2.30'}</M>
            </>
          }
          compare={
            <>
              両側5%の境目は 1.96。<M>{'|z| = 2.30 > 1.96'}</M> なので棄却域に入る。p 値は <M>{'2 \\times P(Z \\ge 2.30) \\approx 2 \\times 0.0107 = 0.0214'}</M>。
            </>
          }
          conclusion={
            <>
              有意水準 5% で H0 を棄却する。「袋の平均の重さは 200g からずれているといえる」。
            </>
          }
        />
      </Section>

      <Section title="例2：σ がわからないとき（t 検定）">
        <Example title="スマホの電池の持ち">
          <p>
            メーカーは「電池が 20 時間もつ」としています。10台で測ったら次の通りでした（単位：時間）。
            {' '}{BATTERY.join(', ')}。平均の持ちは公称の 20 時間と違うといえるでしょうか（有意水準 5%、両側）。
          </p>
        </Example>
        <Figure caption="10台の結果。ほとんどが公称の 20 時間より左にある">
          <BatteryDots data={BATTERY} mu0={20} />
        </Figure>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'\\mu = 20'}</M>、H1: <M>{'\\mu \\ne 20'}</M>。母分散はわからないので t 検定。
            </>
          }
          statistic={
            <>
              <M>{'\\bar{x} = 19.31'}</M>、<M>{'s \\approx 0.615'}</M>、標準誤差 <M>{'s/\\sqrt{10} \\approx 0.195'}</M>。
              <M>{'t = \\frac{19.31 - 20}{0.195} \\approx -3.55'}</M>
            </>
          }
          compare={
            <>
              自由度 <M>{'10-1=9'}</M> の t 分布で、両側 5% の境目は <M>{'t_{0.025}(9) = 2.262'}</M>。<M>{'|t| = 3.55 > 2.262'}</M> なので棄却域に入る
              （1% の境目 3.250 も超えている）。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却する。「電池の平均の持ちは 20 時間と違う（x̄ が小さいので、短い側にずれている）といえる」。</>}
        />
        <Figure caption="t = −3.55 は左側の棄却域（赤）の中にある">
          <TResultPlot t={-3.545} df={9} />
        </Figure>
      </Section>

      <Section title="なぜ t 分布を使うの？">
        <Intuition title="s を使うと、ぶれが1つ増える">
          <p>
            σ の代わりに s を使うと、s 自体もデータによって大きくなったり小さくなったりします。そのぶん検定統計量がぶれやすくなり、
            分布のすそが正規分布より<strong>厚く</strong>なります。それが t 分布です。n が大きくなると s が σ に近づくので、t 分布は正規分布に近づきます。
          </p>
        </Intuition>
        <Figure caption="自由度を動かしてみよう。自由度が小さいと境目（赤）が 1.96 より外に広がる＝棄却されにくくなる">
          <TvsZ />
        </Figure>
      </Section>

      <Section title="対応のあるデータは「差」をとる">
        <p>
          同じ6人に、学習アプリを使う<strong>前</strong>と<strong>後</strong>でテストを受けてもらいました。前と後は同じ人のデータなので、
          ばらばらの2グループとして扱うのではなく、<strong>1人ずつ差 d = 後 − 前</strong> をとります。
        </p>
        <DataTable
          head={['人', 'A', 'B', 'C', 'D', 'E', 'F']}
          rows={[
            ['前', ...BEFORE.map(String)],
            ['後', ...AFTER.map(String)],
            [<strong key="d">差 d</strong>, ...AFTER.map((a, i) => <strong key={i}>{a - BEFORE[i] > 0 ? `+${a - BEFORE[i]}` : a - BEFORE[i]}</strong>)],
          ]}
          caption="学習アプリの前後のテストの点数"
        />
        <Figure caption="左：前後を結ぶと、人による元の点数の違い（ばらつき）が大きい。右：差だけ見ると、ほとんどがプラス">
          <PairedPlot before={BEFORE} after={AFTER} />
        </Figure>
        <TestSteps
          hypothesis={
            <>
              差の母平均を <M>{'\\mu_d'}</M> として、H0: <M>{'\\mu_d = 0'}</M>（効果なし）、H1: <M>{'\\mu_d \\ne 0'}</M>。
            </>
          }
          statistic={
            <>
              差の平均 <M>{'\\bar{d} = 3.0'}</M>、差の標準偏差 <M>{'s_d \\approx 2.280'}</M>。
              <M>{'t = \\frac{\\bar{d}}{s_d/\\sqrt{n}} = \\frac{3.0}{2.280/\\sqrt{6}} \\approx 3.22'}</M>
            </>
          }
          compare={
            <>
              自由度 <M>{'6-1=5'}</M>、両側 5% の境目は <M>{'t_{0.025}(5) = 2.571'}</M>。<M>{'3.22 > 2.571'}</M> なので棄却域に入る。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却する。「アプリの前後で点数は変わった（上がった）といえる」。</>}
        />
        <MathBlock caption="対応のある t 検定。n はペアの数、自由度は n − 1">{'t = \\frac{\\bar{d} - 0}{s_d / \\sqrt{n}}'}</MathBlock>
      </Section>

      <Section title="区間推定との関係">
        <p>
          95% 信頼区間は「データと矛盾しない μ の値の範囲」でした。だから、両側 5% の t 検定で
          <strong>棄却される μ0 は、ちょうど 95% 信頼区間の外にある値</strong>です。
        </p>
        <MathBlock caption="同じこと（両側 5%）を2通りに言っている">
          {'|t| = \\left|\\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}}\\right| > t_{0.025}(n-1) \\iff \\mu_0 \\notin \\bar{x} \\pm t_{0.025}(n-1)\\frac{s}{\\sqrt{n}}'}
        </MathBlock>
        <Figure caption="n = 25、x̄ = 50.9、s = 6.5 の例。μ0 を動かすと、区間の外に出るのと同時に「棄却」に変わる">
          <CiTestLink />
        </Figure>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>t 分布の自由度を n にしてしまう → 1標本の t 検定の自由度は <strong>n − 1</strong>。</li>
            <li>s を n で割った標準偏差で計算する → 検定では n − 1 で割った s を使う。</li>
            <li>
              分母に s をそのまま使う → 分母は <strong>標準誤差</strong> <M>{'s/\\sqrt{n}'}</M>。√n で割るのを忘れない。
            </li>
            <li>前後比較を「2つの独立なグループ」として扱う → 同じ人の前後なら差をとって1標本の t 検定にする。</li>
            <li>σ が問題文で与えられているのに t 分布を使う（またはその逆）→ 「母標準偏差は〇〇とわかっている」と書かれていれば z。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>n・x̄・s から t の値を計算し、t 分布表の値と比べて結論を選ぶ問題。</li>
            <li>前後比較のデータで、「対応のある t 検定」を選ばせる・計算させる問題。</li>
            <li>信頼区間の結果から、ある μ0 が両側検定で棄却されるかを答える問題。</li>
            <li>統計ソフトの t 検定の出力（t 値・自由度・p 値）を読む問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
