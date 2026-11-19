import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { CoinTest } from '../figures/CoinTest'
import { PowerDemo } from '../figures/PowerDemo'
import { PValueDemo, RejectionDemo } from '../figures/RejectionDemo'
import { TestChooser, TestMapTable } from '../figures/TestMap'
import { TestSteps } from '../figures/TestSteps'

export const meta: LessonMeta = {
  id: 'testing-idea',
  chapter: 'testing',
  order: 1,
  title: '仮説検定の考え方',
  summary: '「偶然でもこれくらい起きる？」を確率で判定する方法です。帰無仮説・p値・2種類の過誤・検出力までを、コイン投げで体験します。',
  minutes: 35,
  keywords: ['帰無仮説', '対立仮説', '有意水準', '棄却域', 'p値', '両側検定', '片側検定', '第1種の過誤', '第2種の過誤', '検出力'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          仮説検定は、「もし<strong>何も特別なことが起きていない</strong>（帰無仮説が正しい）としたら、今回のデータはどれくらい珍しい？」を確率で調べる方法です。
          珍しすぎたら「やっぱり何か起きている」と判断します。
        </p>
      </Point>

      <Section title="コインはイカサマか？">
        <p>
          友だちが「このコイン、表ばかり出る気がする」と言うので、20回投げてみたら<strong>表が15回</strong>出ました。イカサマでしょうか？
        </p>
        <p>
          公平なコインでも、たまたま表が多く出ることはあります。そこで次のように考えます。
        </p>
        <Example title="背理法のような考え方">
          <ol>
            <li>まず「コインは公平（表の確率 0.5）」と<strong>仮に決める</strong>。</li>
            <li>そのとき、表が15回以上（または裏が15回以上）出る確率を計算する → 約 <strong>0.041</strong>（4.1%）。</li>
            <li>「公平なら 100回に4回くらいしか起きないこと」が起きた。これは珍しい。</li>
            <li>だから「公平」という最初の仮定が<strong>怪しい</strong>と判断する。</li>
          </ol>
        </Example>
        <Figure caption="公平なコインを20回投げたときの、表の回数の分布。観測値と同じかそれより極端な結果（赤）の確率を合計したものが p 値">
          <CoinTest />
        </Figure>
        <p>
          スライダーを14回にすると p 値は約 0.115 になり、「公平でも 1割以上の確率で起きる、よくあること」になります。どこから「珍しい」とするかの線引きが、次に出てくる
          <strong>有意水準</strong>です。
        </p>
      </Section>

      <Section title="用語を整理する">
        <DataTable
          head={['用語', '意味', 'コインの例']}
          rows={[
            ['帰無仮説 H0', '「差がない・効果がない・特別なことはない」という仮説。否定されるために立てる', 'p = 0.5（公平）'],
            ['対立仮説 H1', '本当に言いたいこと。H0 が否定されたときに採用する', 'p ≠ 0.5（公平でない）'],
            ['検定統計量', 'データから計算する、判定に使う1つの数', '表の回数（後のレッスンでは z や t）'],
            ['有意水準 α', '「これより起きにくければ珍しい」とする基準の確率。ふつう 5% か 1%', '0.05'],
            ['棄却域', '検定統計量がここに入ったら H0 を捨てる、という範囲', '表が 15回以上 または 5回以下'],
            ['p 値', 'H0 が正しいとしたとき、観測値と同じかそれより極端な値が出る確率', '約 0.041'],
          ]}
          caption="仮説検定の基本用語"
        />
        <p>
          判定のルールは1つだけです。<strong>p 値 ≦ α なら H0 を棄却</strong>（これを「有意である」ともいう）、p 値 &gt; α なら棄却できない。
          「検定統計量が棄却域に入るか」で判定しても、必ず同じ結論になります。
        </p>
      </Section>

      <Section title="検定の型（4つの手順）">
        <p>この章のどの検定も、必ずこの4つの手順で進めます。コインの例で書くとこうなります。</p>
        <TestSteps
          hypothesis={
            <>
              H0: <M>{'p = 0.5'}</M>（公平）、H1: <M>{'p \\ne 0.5'}</M>（公平でない）。有意水準は 5%。
            </>
          }
          statistic={<>表の回数 = 15回</>}
          compare={<>H0 のもとで「15回以上 または 5回以下」になる確率（p 値）≒ 0.041。これは 0.05 以下。</>}
          conclusion={
            <>
              有意水準 5% で H0 を<strong>棄却する</strong>。「コインは公平でない（表と裏の出やすさに差がある）といえる」。
            </>
          }
        />
        <Note title="ここでは二項分布をそのまま使った">
          <p>
            コインの例では二項分布の確率を直接足しました。次のレッスンからは、検定統計量を z・t・χ²・F に直して、<strong>分布表</strong>と比べる形にします。
            型は同じです。
          </p>
        </Note>
      </Section>

      <Section title="棄却域を正規曲線の上に塗る">
        <p>
          多くの検定では、H0 が正しければ検定統計量 z が<strong>標準正規分布</strong>にしたがうように作ります。すると棄却域は「曲線の端っこ」になります。
        </p>
        <Figure caption="両側・片側、有意水準を切り替えると棄却域（赤）が変わる">
          <RejectionDemo />
        </Figure>
        <Compare>
          <Card title="両側検定">
            <p>H1: <M>{'\\mu \\ne \\mu_0'}</M>。「大きい・小さいのどちらにずれても」知りたいとき。α を左右に半分ずつ置く。5% なら境目は ±1.96。</p>
          </Card>
          <Card title="片側検定">
            <p>
              H1: <M>{'\\mu > \\mu_0'}</M>（または <M>{'\\mu < \\mu_0'}</M>）。「増えたか」だけを知りたいとき。α を片方に全部置く。5% なら境目は 1.645。
            </p>
          </Card>
        </Compare>
        <p>
          両側か片側かは、<strong>データを見る前に</strong>、調べたいこと（H1）で決めます。データを見てから「片側なら有意になるから片側にしよう」と決めるのは反則です。
        </p>
      </Section>

      <Section title="p 値 ＝ 観測値より極端な側の面積">
        <MathBlock caption="両側検定の p 値（z は観測した検定統計量）">{'p = P(|Z| \\ge |z|) = 2 \\times P(Z \\ge |z|)'}</MathBlock>
        <MathBlock caption="右片側検定の p 値">{'p = P(Z \\ge z)'}</MathBlock>
        <Figure caption="観測した z を動かすと、p 値（オレンジ）が変わる。オレンジが赤い棄却域の内側に収まるとき、ちょうど p 値 ≦ 5% になる">
          <PValueDemo />
        </Figure>
        <Example title="z = 2.20 のとき">
          <p>
            標準正規分布表で <M>{'P(Z \\ge 2.20) \\approx 0.0139'}</M>。両側なら p 値は <M>{'2 \\times 0.0139 = 0.0278'}</M>。0.05 以下なので 5% で棄却、
            0.01 より大きいので 1% では棄却できません。
          </p>
        </Example>
      </Section>

      <Section title="2種類の間違い（過誤）">
        <p>検定は確率で判断するので、どうしても間違えることがあります。間違い方は2種類です。</p>
        <DataTable
          head={['', '本当は H0 が正しい', '本当は H1 が正しい']}
          rows={[
            ['H0 を棄却した', <strong key="a">第1種の過誤（確率 α）</strong>, '正しい判断（確率 1 − β ＝ 検出力）'],
            ['H0 を棄却しなかった', '正しい判断（確率 1 − α）', <strong key="b">第2種の過誤（確率 β）</strong>],
          ]}
          caption="判断と真実の組み合わせ"
        />
        <Compare>
          <Card title="第1種の過誤（あわてんぼう）">
            <p>本当は差がないのに「差がある」と言ってしまう。起きる確率は有意水準 α そのもの。火事でないのに火災報知器が鳴る。</p>
          </Card>
          <Card title="第2種の過誤（ぼんやり）">
            <p>本当は差があるのに「差があるとはいえない」で終わってしまう。確率を β と書く。火事なのに報知器が鳴らない。</p>
          </Card>
        </Compare>
        <p>
          <strong>検出力</strong> <M>{'1-\\beta'}</M> は「本当に差があるとき、それをちゃんと見つけられる確率」です。
        </p>
        <Figure caption="黒が H0 の分布、青い点線が H1 の分布（どちらも標本平均の分布）。スライダーで効果の大きさ・n・α を変えてみよう">
          <PowerDemo />
        </Figure>
        <Intuition title="図を動かしてわかること">
          <ul>
            <li>
              <strong>α を小さくする</strong>（5% → 1%）と境目が右へ動き、第1種の過誤は減るが、<strong>β は増える</strong>（検出力が下がる）。α と β はシーソーの関係。
            </li>
            <li>
              <strong>n を大きくする</strong>と2つの山が細くなって重なりが減り、α を変えずに β を小さくできる。これが「データを増やす」ことの効果。
            </li>
            <li>
              <strong>効果が大きい</strong>（2つの山が離れている）ほど、検出力は高い。
            </li>
          </ul>
        </Intuition>
        <MathBlock caption="右片側検定の検出力（σ 既知、効果 δ = μ1 − μ0）">{'1-\\beta = P\\left(Z > z_{\\alpha} - \\frac{\\delta}{\\sigma/\\sqrt{n}}\\right)'}</MathBlock>
      </Section>

      <Section title="「棄却できない」は「正しい」ではない">
        <Pitfall>
          <ul>
            <li>
              p 値が大きいとき、「H0 を<strong>採択</strong>する」「H0 が正しいことが示された」とは言いません。正しくは「H0 を<strong>棄却できない</strong>」
              「差があるとはいえない」。証拠が足りないだけかもしれない（第2種の過誤かもしれない）からです。
            </li>
            <li>
              p 値は「H0 が正しい確率」ではありません。「H0 が正しいと<strong>仮定したとき</strong>、今回くらい極端なデータが出る確率」です。
            </li>
            <li>第1種の過誤の確率は α。β ではありません。「1種＝α、2種＝β」とセットで覚える。</li>
            <li>「有意」は「差が大きい・重要」という意味ではありません。n がとても大きいと、ごく小さな差でも有意になります。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="検定の地図">
        <p>
          この章では、調べたいものに合わせていろいろな検定が出てきます。でも手順はすべて同じ4ステップで、変わるのは<strong>検定統計量の式</strong>と
          <strong>比べる分布</strong>だけです。迷ったら下の質問に答えてみてください。
        </p>
        <Figure caption="質問に答えると、使う検定統計量と分布にたどりつく">
          <TestChooser />
        </Figure>
        <TestMapTable />
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>第1種・第2種の過誤、検出力、p 値の意味を言葉で問う問題（「正しいものを選べ」）。</li>
            <li>検定統計量の値から、両側・片側の p 値の範囲や、5%・1% で棄却されるかを選ぶ問題。</li>
            <li>α・n・効果の大きさを変えたとき、検出力が上がるか下がるかを問う問題。</li>
            <li>統計ソフトの出力の p 値を読んで結論を選ぶ問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
