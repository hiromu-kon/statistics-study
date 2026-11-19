import { DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import { chi2Pdf } from '../../../lib/stats'
import type { LessonMeta } from '../../../types'
import { GofSlider, IndependenceDemo, ObsExpBars } from '../figures/Chi2Figures'
import { TestDistPlot } from '../figures/parts'
import { TestChooser, TestMapTable } from '../figures/TestMap'
import { TestSteps } from '../figures/TestSteps'

export const meta: LessonMeta = {
  id: 'testing-chi2',
  chapter: 'testing',
  order: 5,
  title: '適合度検定と独立性の検定',
  summary: '「実際の度数」と「H0 なら期待される度数」のずれを1つの数 χ² にまとめて、理論に合うか・2つの分類に関係があるかを調べます。',
  minutes: 30,
  keywords: ['適合度検定', '独立性の検定', '期待度数', '観測度数', '自由度'],
}

const DIE = [14, 18, 25, 16, 27, 20]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          実際に数えた<strong>観測度数 O</strong> と、H0 が正しければこうなるはずという<strong>期待度数 E</strong> を並べ、
          ずれ <M>{'(O-E)^2/E'}</M> を全部足したものが χ² です。χ² が大きいほど「H0 とデータが合わない」ことを表します。
        </p>
      </Point>

      <Section title="適合度検定：サイコロは公平か">
        <Example title="サイコロを120回投げた">
          <p>公平なサイコロなら、どの目も 120 ÷ 6 = 20回ずつ出ると期待されます。実際は次のようになりました。</p>
        </Example>
        <Figure caption="観測度数（青）と期待度数（灰）。ずれはあるが、偶然の範囲だろうか？">
          <ObsExpBars labels={['1', '2', '3', '4', '5', '6']} observed={DIE} expected={DIE.map(() => 20)} yMax={35} />
        </Figure>
        <DataTable
          head={['目', '1', '2', '3', '4', '5', '6', '合計']}
          rows={[
            ['観測度数 O', ...DIE.map(String), '120'],
            ['期待度数 E', '20', '20', '20', '20', '20', '20', '120'],
            ['O − E', '−6', '−2', '+5', '−4', '+7', '0', '0'],
            ['(O − E)² / E', '1.80', '0.20', '1.25', '0.80', '2.45', '0', <strong key="s">6.50</strong>],
          ]}
          caption="χ² の計算表"
        />
        <MathBlock caption="カイ二乗統計量。k はカテゴリの数">{'\\chi^2 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i}'}</MathBlock>
        <TestSteps
          hypothesis={
            <>
              H0: どの目も確率 1/6（公平）、H1: H0 ではない（どこかの目の確率が 1/6 でない）。有意水準 5%。
            </>
          }
          statistic={<>上の表から <M>{'\\chi^2 = 6.50'}</M>。</>}
          compare={
            <>
              自由度 = カテゴリ数 − 1 = <M>{'6 - 1 = 5'}</M>。上側 5% 点は <M>{'\\chi^2_{0.05}(5) = 11.070'}</M>。<M>{'6.50 < 11.070'}</M> なので棄却域に入らない。
            </>
          }
          conclusion={<>有意水準 5% で H0 を棄却できない。「サイコロが公平でないとはいえない」。</>}
        />
        <Figure caption="χ² = 6.5 は、自由度5のカイ二乗分布の右端の棄却域（上側5%）に届かない">
          <TestDistPlot
            pdf={(x) => chi2Pdf(x, 5)}
            x={[0, 20]}
            yMax={0.19}
            reject={[[11.07, Infinity]]}
            criticals={[{ x: 11.07, label: ' 11.070' }]}
            observed={6.5}
            observedLabel="χ² = 6.5 "
            xLabel="χ² 分布（自由度 5）"
          />
        </Figure>
        <Intuition title="なぜ右側だけを見るの？">
          <p>
            χ² は「ずれの大きさ」なので、ずれが大きいときだけ H0 を疑います。<strong>χ² が大きい側（右側）だけが棄却域</strong>です（片側検定の形）。
            χ² が 0 に近いのは「期待どおり」という意味なので、棄却する理由になりません。
          </p>
        </Intuition>
        <Figure caption="かたよりを強くすると O と E のずれが広がり、χ² が 11.070 を超えたところで「棄却」に変わる">
          <GofSlider />
        </Figure>
      </Section>

      <Section title="適合度検定の自由度">
        <p>
          自由度は「自由に決められるマスの数」です。合計（120回）が決まっていると、5つの目の回数を決めれば最後の1つは自動で決まるので、
          <strong>カテゴリ数 − 1</strong>。
        </p>
        <MathBlock caption="適合度検定の自由度。m はデータから推定したパラメータの数">{'k - 1 - m'}</MathBlock>
        <p>
          たとえば「データはポアソン分布にしたがう」を調べるとき、ポアソン分布の λ が与えられておらず、データの平均から推定したなら、
          推定した1個のぶんだけさらに自由度が減って <M>{'k - 1 - 1'}</M> になります。
        </p>
      </Section>

      <Section title="独立性の検定：2つの分類に関係はあるか">
        <Example title="朝食と午前中の眠気">
          <p>150人に「朝食を食べるか」と「午前中に眠くなるか」を聞きました。</p>
          <DataTable
            head={['', '眠い', '眠くない', '合計']}
            rows={[
              ['朝食を食べる', '30', '70', '100'],
              ['朝食を食べない', '30', '20', '50'],
              ['合計', '60', '90', '150'],
            ]}
            caption="観測度数（クロス表）"
          />
        </Example>
        <p>
          H0 は「朝食と眠気は<strong>独立</strong>（関係がない）」。独立なら、朝食を食べる人の中でも食べない人の中でも、眠い人の割合は全体と同じ
          60 ÷ 150 = 40% のはずです。
        </p>
        <MathBlock caption="独立なときの期待度数。そのマスの行の合計 × 列の合計 ÷ 総数">{'E_{ij} = \\frac{R_i \\times C_j}{N}'}</MathBlock>
        <DataTable
          head={['', '眠い', '眠くない', '合計']}
          rows={[
            ['朝食を食べる', '100 × 60 ÷ 150 = 40', '100 × 90 ÷ 150 = 60', '100'],
            ['朝食を食べない', '50 × 60 ÷ 150 = 20', '50 × 90 ÷ 150 = 30', '50'],
            ['合計', '60', '90', '150'],
          ]}
          caption="期待度数（行合計 × 列合計 ÷ 総数）。行・列の合計は観測度数と同じになる"
        />
        <TestSteps
          hypothesis={<>H0: 朝食と眠気は独立、H1: 独立でない（関係がある）。有意水準 5%。</>}
          statistic={
            <>
              <M>{'\\chi^2 = \\frac{(30-40)^2}{40} + \\frac{(70-60)^2}{60} + \\frac{(30-20)^2}{20} + \\frac{(20-30)^2}{30}'}</M>
              <br />
              <M>{'= 2.5 + 1.667 + 5.0 + 3.333 = 12.5'}</M>
            </>
          }
          compare={
            <>
              自由度 <M>{'(2-1)(2-1) = 1'}</M>。上側 5% 点 <M>{'\\chi^2_{0.05}(1) = 3.841'}</M>、1% 点 6.635。<M>{'12.5'}</M> はどちらよりも大きい。
            </>
          }
          conclusion={<>有意水準 1% でも H0 を棄却する。「朝食と午前中の眠気には関係があるといえる」。</>}
        />
        <Figure caption="行・列の合計を固定して、左上のマスを動かしてみよう。40人（期待度数）のとき χ² = 0、そこから離れるほど χ² が大きくなる">
          <IndependenceDemo />
        </Figure>
        <Note title="ここでの計算について">
          <p>2×2 の表では「イェーツの補正」という修正を加える方法もあります。このサイトの計算は、補正をしない χ² で行っています。</p>
        </Note>
      </Section>

      <Section title="r × c のクロス表と自由度">
        <p>
          行が r 個、列が c 個のクロス表でも、期待度数の求め方（行合計 × 列合計 ÷ 総数）と χ² の式は同じです。自由度は次の通り。
        </p>
        <MathBlock caption="独立性の検定の自由度">{'(r-1)(c-1)'}</MathBlock>
        <Intuition title="なぜ (r − 1)(c − 1)？">
          <p>
            行と列の合計が決まっていると、各行の最後のマスと各列の最後のマスは自動で決まります。自由に決められるのは、
            最後の行と最後の列を除いた <M>{'(r-1) \\times (c-1)'}</M> マスだけです。2×2 なら1マス（上の図で動かしたのも1マスだけでした）、3×4 なら 2 × 3 = 6 マス。
          </p>
        </Intuition>
      </Section>

      <Section title="期待度数が小さいときの注意">
        <p>
          χ² 分布を使うのは近似なので、期待度数が小さいと近似が悪くなります。目安として「<strong>期待度数がおおむね 5 以上</strong>あるとよい」とよく言われます
          （厳密な決まりではなく、教科書によって表現は少しずつ違います）。小さいマスがあるときは、となりのカテゴリとまとめるなどの工夫をします。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>χ² の分母を O（観測度数）にする → 分母は <strong>E（期待度数）</strong>。</li>
            <li>(O − E) を2乗せずに足す → 合計は必ず 0 になってしまう（分散のときと同じ）。</li>
            <li>独立性の検定の自由度を「マスの数 − 1」にする → 正しくは <M>{'(r-1)(c-1)'}</M>。2×2 なら 3 ではなく 1。</li>
            <li>適合度検定でパラメータを推定したのに、自由度から引き忘れる。</li>
            <li>度数ではなく割合（%）のまま χ² を計算する → χ² は人数・回数などの<strong>度数</strong>で計算する。</li>
            <li>「関係があるといえる」を「原因と結果の関係がある」と読む → 独立性の検定でわかるのは「関係があるか」だけ。因果は言えない。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="まとめ：検定の地図">
        <p>
          この章で出てきた検定を一覧にします。どれも「① 仮説 → ② 検定統計量 → ③ 分布表と比べる → ④ 結論」の同じ型でした。
          問題を読んだら、まず「何について（平均・比率・分散・度数）」「グループはいくつ」「分散はわかっているか」を確かめましょう。
        </p>
        <Figure caption="もう一度、質問に答えて検定を選んでみよう">
          <TestChooser />
        </Figure>
        <TestMapTable />
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>クロス表から期待度数を計算させる問題。</li>
            <li>χ² の値を計算し、自由度を正しく求めて χ² 分布表と比べる問題。</li>
            <li>適合度検定で、推定したパラメータの数を引いた自由度を問う問題。</li>
            <li>統計ソフトの独立性の検定の出力（χ² 値・自由度・p 値）を読む問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
