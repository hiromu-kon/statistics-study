import { DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BayesArea } from '../figures/BayesArea'
import { TreeDiagram } from '../figures/TreeDiagram'

export const meta: LessonMeta = {
  id: 'probability-bayes',
  chapter: 'probability',
  order: 3,
  title: 'ベイズの定理',
  summary: '「陽性だった → 本当に病気？」のように、結果から原因の確率を逆にたどる方法。面積図と1万人の表で「どこを見ているか」を確かめます。',
  minutes: 35,
  keywords: ['ベイズの定理', '事前確率', '事後確率', '全確率の公式'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          ベイズの定理は、<strong>「原因 → 結果」の確率から、「結果 → 原因」の確率を求める</strong>方法です。
          やっていることは条件付き確率そのもので、「<strong>結果（陽性）が出た人だけを集めて、その中で原因（病気）の人が何割か</strong>」を数えているだけです。
        </p>
      </Point>

      <Section title="具体例：1万人に検査をしたら">
        <p>ある病気の検査について、次のことがわかっているとします。</p>
        <ul>
          <li>この病気にかかっている人は全体の <strong>1%</strong>（有病率）</li>
          <li>病気の人が検査を受けると <strong>90%</strong> が陽性になる（感度）</li>
          <li>病気でない人が検査を受けると <strong>90%</strong> が陰性になる。つまり 10% は「健康なのに陽性」になってしまう（特異度 90%）</li>
        </ul>
        <p>
          ある人が検査で陽性になりました。この人が本当に病気である確率は？　「90%くらい？」と思ったら、1万人で数えてみましょう。
        </p>
        <DataTable
          head={['1万人', '陽性', '陰性', '合計']}
          rows={[
            ['病気', <strong key="tp">90</strong>, '10', '100'],
            ['健康', <strong key="fp">990</strong>, '8910', '9900'],
            ['合計', <strong key="pos">1080</strong>, '8920', '10000'],
          ]}
          caption="病気100人のうち90%の90人が陽性、健康9900人のうち10%の990人が陽性"
        />
        <p>
          陽性の人は全部で <M>{'90 + 990 = 1080'}</M> 人。そのうち本当に病気なのは90人だけです。
        </p>
        <MathBlock caption="陽性の人の中で、病気の人が占める割合">{'\\frac{90}{1080} = \\frac{1}{12} \\approx 0.083'}</MathBlock>
        <p>
          陽性でも、本当に病気である確率は<strong>約8%</strong>しかありません。もともと病気の人が少ない（1%）ので、
          「健康なのに陽性」の990人のほうがずっと多くなってしまうのです。
        </p>
      </Section>

      <Section title="面積図：なぜ P(B) で割るのか">
        <p>
          同じことを面積で描きます。上の四角が全体（1万人）。左の細い赤い列が病気の人、右の緑が健康な人。
          <strong>濃い色が陽性</strong>です。下の帯は、<strong>陽性の人だけを集めて並べ直したもの</strong>です。
        </p>
        <Figure caption="陽性と出た時点で、陰性の人（うすい色）はもう考えない。残った濃い部分だけを「新しい全体」にする">
          <BayesArea interactive={false} />
        </Figure>
        <Intuition title="P(B) で割る ＝ 陽性の人だけを新しい 100% にする">
          <p>
            知りたいのは「陽性の人の<strong>中で</strong>」の割合です。だから分母は全体の1万人ではなく、陽性の人の数（確率でいえば <M>{'P(B)'}</M>）になります。
            割り算は「見る範囲を陽性の人だけにしぼって、そこを 100% として測り直す」操作です。
          </p>
        </Intuition>
      </Section>

      <Section title="定義・式">
        <p>
          A を「病気である」（原因）、B を「陽性になる」（結果）とします。前の回の条件付き確率と乗法定理から、
        </p>
        <MathBlock caption="① 知りたいもの：陽性（B）の中で病気（A）の割合">{'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}'}</MathBlock>
        <MathBlock caption="② 分子は乗法定理で、わかっている確率から作れる">{'P(A \\cap B) = P(A)\\,P(B \\mid A)'}</MathBlock>
        <p>②を①に入れたものが<strong>ベイズの定理</strong>です。</p>
        <MathBlock caption="ベイズの定理：結果 B がわかったあとの、原因 A の確率">{'P(A \\mid B) = \\frac{P(A)\\,P(B \\mid A)}{P(B)}'}</MathBlock>
        <p>
          分母の <M>{'P(B)'}</M>（陽性になる確率）は、「病気で陽性」と「健康で陽性」を足して求めます。これを<strong>全確率の公式</strong>といいます。
        </p>
        <MathBlock caption="全確率の公式：B になる道すじを全部足す">{'P(B) = P(A)\\,P(B \\mid A) + P(\\bar{A})\\,P(B \\mid \\bar{A})'}</MathBlock>
        <p>数字を入れると、1万人の表とまったく同じ計算になります。</p>
        <MathBlock>{'P(A \\mid B) = \\frac{0.01 \\times 0.9}{0.01 \\times 0.9 + 0.99 \\times 0.1} = \\frac{0.009}{0.009 + 0.099} = \\frac{0.009}{0.108} = \\frac{1}{12}'}</MathBlock>
        <DataTable
          head={['記号', '名前', 'この例での意味', '値']}
          rows={[
            [<M key="a">{'P(A)'}</M>, '事前確率', '検査を受ける前の「病気である確率」', '0.01'],
            [<M key="ba">{'P(B \\mid A)'}</M>, '（感度）', '病気の人が陽性になる確率', '0.9'],
            [<M key="bna">{'P(B \\mid \\bar{A})'}</M>, '（1 − 特異度）', '健康な人が陽性になる確率', '0.1'],
            [<M key="b">{'P(B)'}</M>, '全確率', '誰かを選んだとき陽性になる確率', '0.108'],
            [<M key="ab">{'P(A \\mid B)'}</M>, '事後確率', '陽性とわかった後の「病気である確率」', '1/12 ≒ 0.083'],
          ]}
          caption="ベイズの定理に出てくる確率"
        />
        <p>
          <strong>事前確率</strong>は「情報を得る前」、<strong>事後確率</strong>は「情報（陽性という結果）を得た後」の確率です。
          ベイズの定理は、新しい情報で確率を<strong>更新する</strong>式だともいえます。
        </p>
        <Figure caption="樹形図で書いても同じ。陽性になる2本の枝（オレンジ）を足したものが P(B)">
          <TreeDiagram
            root="1人選ぶ"
            ariaLabel="病気かどうか、陽性かどうかの樹形図"
            branches={[
              {
                label: '病気',
                p: '0.01',
                children: [
                  { label: '陽性', p: '0.9', result: '0.01 × 0.9 = 0.009', highlight: true },
                  { label: '陰性', p: '0.1', result: '0.01 × 0.1 = 0.001' },
                ],
              },
              {
                label: '健康',
                p: '0.99',
                children: [
                  { label: '陽性', p: '0.1', result: '0.99 × 0.1 = 0.099', highlight: true },
                  { label: '陰性', p: '0.9', result: '0.99 × 0.9 = 0.891' },
                ],
              },
            ]}
          />
        </Figure>
      </Section>

      <Section title="動かして確かめる：有病率を変えると">
        <p>
          有病率・感度・特異度を動かしてみてください。特に<strong>有病率</strong>を 1% → 10% → 30% と上げると、
          同じ検査でも「陽性なら病気」の確率が大きく変わります。
        </p>
        <Figure caption="感度・特異度が同じ90%でも、有病率0.1%なら約0.9%、1%なら約8%、10%なら50%、30%なら約79%">
          <BayesArea />
        </Figure>
        <Intuition title="もう一度検査して、また陽性だったら？">
          <p>
            1回目の陽性で、病気の確率は 1% → 約8.3%（1/12）に上がりました。この 1/12 を新しい事前確率にして同じ検査をもう一度受け、また陽性なら、
          </p>
          <MathBlock>{'\\frac{\\frac{1}{12} \\times 0.9}{\\frac{1}{12} \\times 0.9 + \\frac{11}{12} \\times 0.1} = \\frac{0.9}{0.9 + 1.1} = 0.45'}</MathBlock>
          <p>
            45% まで上がります（2回の検査の結果が互いに独立と仮定した場合）。事後確率が次の事前確率になる、というのがベイズの考え方です。
          </p>
        </Intuition>
      </Section>

      <Section title="問題文の、どれが A でどれが B？">
        <p>ベイズの問題で一番迷うのがここです。次の手順で決めると迷いません。</p>
        <Steps>
          <li>
            <strong>問われている確率の文を探す。</strong>「〜だったとき、〜である確率」「〜とわかった。〜である確率は？」の形になっているはずです。
          </li>
          <li>
            <strong>「わかったこと」（観察された結果）を B、「確率を知りたいこと」（原因）を A とする。</strong>
            「陽性だった人が病気である確率」なら、わかったこと＝陽性（B）、知りたいこと＝病気（A）。求めるのは <M>{'P(A \\mid B)'}</M>。
          </li>
          <li>
            <strong>問題文の数字を、どの確率か書き出す。</strong>たいてい与えられるのは逆向きの <M>{'P(B \\mid A)'}</M>（病気の人が陽性になる確率）と、
            <M>{'P(A)'}</M>（そもそも病気の割合）です。「〜のうち〜%」の「〜のうち」が条件（| の右）です。
          </li>
          <li>
            <strong>1万人の表か樹形図に数を入れる。</strong>原因（A か A でないか）で先に分けてから、結果（B か B でないか）で分けます。
          </li>
          <li>
            <strong>B の列（陽性の人）だけを見て、その中の A の割合を出す。</strong>これが答え <M>{'P(A \\mid B)'}</M> です。
          </li>
        </Steps>
        <Example title="工場の例で手順を使う">
          <p>
            ある製品は機械 X が 60%、機械 Y が 40% を作ります。不良品の割合は X が 2%、Y が 5% です。
            <strong>不良品が1つ見つかった。それが Y で作られた確率は？</strong>
          </p>
          <ul>
            <li>わかったこと＝不良品（B）、知りたいこと＝Y で作られた（A）。求めるのは <M>{'P(A \\mid B)'}</M>。</li>
            <li>
              「Y の製品<strong>のうち</strong> 5% が不良」は <M>{'P(B \\mid A) = 0.05'}</M>。「Y が 40% を作る」は <M>{'P(A) = 0.4'}</M>。
            </li>
            <li>
              1万個で考えると、X 製 6000 個のうち不良 120 個、Y 製 4000 個のうち不良 200 個。不良品は合計 320 個。
            </li>
            <li>
              不良品 320 個のうち Y 製は 200 個なので、<M>{'200 / 320 = 0.625'}</M>。
            </li>
          </ul>
          <p>Y が作るのは 40% でも、不良品に限ると 62.5% が Y 製です。</p>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「病気の人の90%が陽性」を「陽性の人の90%が病気」と読みかえてしまう → <M>{'P(B \\mid A)'}</M> と <M>{'P(A \\mid B)'}</M> の取り違え。分母（見る範囲）が違います。
            </li>
            <li>
              事前確率（有病率）を無視する → 検査の精度だけでは決まりません。もともと少ないものは、陽性でも「本当にそう」である確率が低くなりがちです。
            </li>
            <li>
              分母の <M>{'P(B)'}</M> を「病気で陽性」だけにしてしまう → 「健康なのに陽性」も陽性です。陽性になる道すじを<strong>全部</strong>足します。
            </li>
          </ul>
        </Pitfall>
        <Note title="特異度と「偽陽性」">
          <p>
            「健康なのに陽性」を<strong>偽陽性</strong>、「病気なのに陰性」を<strong>偽陰性</strong>といいます。
            特異度 90% なら、偽陽性の確率は <M>{'1 - 0.9 = 0.1'}</M> です。問題文が「特異度」と「偽陽性率」のどちらで書いているかに注意しましょう。
          </p>
        </Note>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>検査・工場の不良品・迷惑メールの判定などで、「結果がわかったときの原因の確率」を求める問題。</li>
            <li>原因が3つ以上（機械 X・Y・Z など）でも、全確率の公式で「結果になる道すじ」を全部足すだけで同じように解けます。</li>
            <li>計算の前に、1万人（1万個）の表を作ってしまうと、分母と分子を取り違えにくくなります。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
