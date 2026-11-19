import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DiceGrid } from '../figures/DiceGrid'
import { PeopleGrid } from '../figures/PeopleGrid'
import { TreeDiagram } from '../figures/TreeDiagram'
import { VennDiagram } from '../figures/VennDiagram'

export const meta: LessonMeta = {
  id: 'probability-conditional',
  chapter: 'probability',
  order: 2,
  title: '条件付き確率と独立',
  summary: '「B が起きたとわかっているとき」の確率は、見る範囲を B だけにしぼって考えます。独立と排反の違いもここで整理します。',
  minutes: 30,
  keywords: ['条件付き確率', '乗法定理', '独立', '樹形図'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          条件付き確率 <M>{'P(A \\mid B)'}</M>（「B のもとでの A の確率」と読む）は、「<strong>B が起きた人（場合）だけを新しい全体として見たとき</strong>、その中で A が占める割合」です。
          条件 ＝ <strong>見る範囲をしぼること</strong>。だから分母が全体ではなく B になります。
        </p>
      </Point>

      <Section title="具体例：100人の社員">
        <p>ある会社の社員100人を、「眼鏡をかけているか（A）」と「電車で通勤しているか（B）」で分けました。</p>
        <DataTable
          head={['', '電車通勤（B）', '電車通勤でない', '合計']}
          rows={[
            ['眼鏡あり（A）', <strong key="ab">10</strong>, '20', '30'],
            ['眼鏡なし', '30', '40', '70'],
            ['合計', <strong key="b">40</strong>, '60', '100'],
          ]}
          caption="100人の内訳"
        />
        <p>
          タブを切り替えて、「どの範囲を全体として見ているか」を確かめてください。うすくなった点は「いまは数えない人」、はっきり見えている点が「新しい全体」です。
        </p>
        <Figure caption="条件付き確率は、条件に合わない人をいったん消して、残った人の中で割合を数える">
          <PeopleGrid />
        </Figure>
        <Compare>
          <Card title="P(A|B)：電車通勤の人のうち、眼鏡の人">
            <p>
              見る範囲は B の40人。その中の眼鏡の人は10人。
              <br />
              <M>{'P(A \\mid B) = 10/40 = 1/4'}</M>
            </p>
          </Card>
          <Card title="P(B|A)：眼鏡の人のうち、電車通勤の人">
            <p>
              見る範囲は A の30人。その中の電車通勤の人は10人。
              <br />
              <M>{'P(B \\mid A) = 10/30 = 1/3'}</M>
            </p>
          </Card>
        </Compare>
        <p>
          分子はどちらも「両方に当てはまる10人」ですが、<strong>分母（見る範囲）が違う</strong>ので値が変わります。
          <M>{'P(A \\mid B)'}</M> と <M>{'P(B \\mid A)'}</M> は別物です。
        </p>
      </Section>

      <Section title="問題文の言葉を記号に直す">
        <p>
          <M>{'P(A \\mid B)'}</M> の縦棒「|」は「〜という条件のもとで」と読みます。<strong>| の右側が条件（見る範囲＝分母）</strong>、左側が知りたいこと（分子）です。
          問題文では、条件は次のような言い方で出てきます。<strong>「〜のうち」「〜の中で」「〜だったとき」「〜とわかった」の直前が、| の右側</strong>です。
        </p>
        <DataTable
          head={['問題文の言い方', '見る範囲（| の右）', '記号', '値']}
          rows={[
            ['電車通勤の人のうち、眼鏡の人の割合', '電車通勤の40人', <M key="1">{'P(A \\mid B)'}</M>, '10/40'],
            ['眼鏡の人の中で、電車通勤の人の割合', '眼鏡の30人', <M key="2">{'P(B \\mid A)'}</M>, '10/30'],
            ['1人選んだら電車通勤だった。その人が眼鏡である確率', '電車通勤の40人', <M key="3">{'P(A \\mid B)'}</M>, '10/40'],
            ['1人選んだとき、眼鏡で、しかも電車通勤である確率', '全体の100人（条件なし）', <M key="4">{'P(A \\cap B)'}</M>, '10/100'],
          ]}
          caption="「どこを見る範囲（分母）にするか」を先に決めると、向きを取り違えにくい"
        />
        <p>
          最後の行のように「かつ」「しかも」は条件ではありません。範囲をしぼらずに全体から見るので、<M>{'P(A \\cap B)'}</M> になります。
        </p>
      </Section>

      <Section title="定義・式">
        <p>人数ではなく確率で書くと、条件付き確率は次の式になります。</p>
        <MathBlock caption="条件付き確率：B の中で A も起きている割合">{'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}'}</MathBlock>
        <Intuition title="なぜ P(B) で割るの？　「割合 ＝ 部分 ÷ 全体」だから">
          <p>
            「クラス40人のうち、眼鏡の人が10人」なら、眼鏡の割合は <M>{'10 \\div 40'}</M> です。割合はいつも<strong>「部分 ÷ 全体」</strong>で、割る数（分母）は「全体」です。
          </p>
          <p>
            条件付き確率では、<strong>全体を B にしぼった</strong>ので、割る数は B の大きさ <M>{'P(B)'}</M> になります。部分は「B の中にいる A」つまり <M>{'A \\cap B'}</M> です。
            P(B) で割るのは「B を新しい 100% にする」ためです。
          </p>
        </Intuition>
        <p>
          100人の例で、確率どうしで割っても人数どうしで割っても同じになることを確かめます。<M>{'P(A \\cap B) = 10/100'}</M>、<M>{'P(B) = 40/100'}</M> です。
        </p>
        <Steps>
          <li>
            <M>{'P(A \\mid B) = \\frac{10}{100} \\div \\frac{40}{100}'}</M>
          </li>
          <li>
            分数で割るのは、ひっくり返してかけるのと同じ：<M>{'\\frac{10}{100} \\times \\frac{100}{40}'}</M>
          </li>
          <li>
            100 が分子と分母で消えて <M>{'\\frac{10}{40} = \\frac{1}{4}'}</M>。人数で数えた答えと同じです。
          </li>
        </Steps>
        <MathNote title="分数のわり算を忘れていたら">
          <p>
            「÷ 分数」は「× ひっくり返した分数」です。くわしくは<Link to="/lessons/math-fraction-percent">「分数・小数・割合」</Link>で復習できます。
          </p>
        </MathNote>
        <p>
          この式の両辺に <M>{'P(B)'}</M> をかけると、右辺の分母が消えて「両方起きる確率」を求める式になります。これを<strong>乗法定理</strong>といいます。
          A と B の役割を入れかえた <M>{'P(B \\mid A) = P(A \\cap B) / P(A)'}</M> からも同じように作れるので、2通りの書き方があります。
        </p>
        <MathBlock caption="乗法定理：まず B が起き、その中でさらに A が起きる">{'P(A \\cap B) = P(B)\\,P(A \\mid B) = P(A)\\,P(B \\mid A)'}</MathBlock>
      </Section>

      <Section title="樹形図で「順番に起きる」を計算する">
        <p>
          10本のうち当たりが3本のくじを、1人目・2人目の順に<strong>引いたくじを戻さずに</strong>引きます。
          1人目が当たると、残りは9本で当たりは2本に減ります。この「前の結果で次の確率が変わる」様子を描いたのが<strong>樹形図</strong>です。
        </p>
        <Figure caption="枝の確率は「それまでの結果がわかったときの条件付き確率」。右端は枝の確率のかけ算（乗法定理）">
          <TreeDiagram
            root="引く前"
            ariaLabel="くじを2人が順に引く樹形図"
            branches={[
              {
                label: '当たり',
                p: '3/10',
                children: [
                  { label: '当たり', p: '2/9', result: '3/10 × 2/9 = 6/90', highlight: true },
                  { label: 'はずれ', p: '7/9', result: '3/10 × 7/9 = 21/90' },
                ],
              },
              {
                label: 'はずれ',
                p: '7/10',
                children: [
                  { label: '当たり', p: '3/9', result: '7/10 × 3/9 = 21/90', highlight: true },
                  { label: 'はずれ', p: '6/9', result: '7/10 × 6/9 = 42/90' },
                ],
              },
            ]}
          />
        </Figure>
        <Example title="樹形図から読み取れること">
          <ul>
            <li>
              2人とも当たる確率：<M>{'\\frac{3}{10} \\times \\frac{2}{9} = \\frac{6}{90} = \\frac{1}{15}'}</M>
            </li>
            <li>
              2人目が当たる確率：オレンジの2本の枝を足して <M>{'\\frac{6}{90} + \\frac{21}{90} = \\frac{27}{90} = \\frac{3}{10}'}</M>。
              1人目と同じです。くじは先に引いても後に引いても、当たる確率は変わりません。
            </li>
            <li>右端の4つを全部足すと <M>{'90/90 = 1'}</M>。検算に使えます。</li>
          </ul>
        </Example>
      </Section>

      <Section title="独立：条件をつけても確率が変わらない">
        <p>
          B が起きたと知っても A の確率が変わらないとき、A と B は<strong>独立</strong>であるといいます。
        </p>
        <MathBlock caption="独立の定義（どちらの形でもよい）">{'P(A \\mid B) = P(A) \\quad \\Longleftrightarrow \\quad P(A \\cap B) = P(A)\\,P(B)'}</MathBlock>
        <p>
          100人の例では <M>{'P(A) = 30/100 = 0.3'}</M> ですが、<M>{'P(A \\mid B) = 0.25'}</M>。電車通勤とわかると眼鏡の割合が変わるので、
          A と B は<strong>独立ではありません</strong>。かけ算の形で確かめても、<M>{'P(A)P(B) = 0.3 \\times 0.4 = 0.12'}</M> で、<M>{'P(A \\cap B) = 0.10'}</M> と一致しません。
        </p>
        <Example title="サイコロ2個は独立になる">
          <p>
            A「1個目が偶数」、B「2個目が5以上」。1個目の結果は2個目に影響しないので独立です。
            マスで見ると、A は3列、B は2行で、A∩B は <M>{'3 \\times 2 = 6'}</M> マス。
            <M>{'P(A \\cap B) = 6/36 = 1/6'}</M>、<M>{'P(A)P(B) = (1/2)(1/3) = 1/6'}</M> で一致します。
          </p>
        </Example>
        <Figure caption="独立なら、A（青の列）と B（緑の行）の重なり（紫）はちょうど「縦の割合 × 横の割合」の大きさになる">
          <DiceGrid
            ariaLabel="1個目が偶数の列と2個目が5以上の行を塗ったマス"
            color={(a, b) => {
              const inA = a % 2 === 0
              const inB = b >= 5
              return inA && inB ? 'c4' : inA ? 'c1' : inB ? 'c3' : null
            }}
          />
        </Figure>
      </Section>

      <Section title="直感的な理解：独立と排反はまったく別物">
        <p>名前の雰囲気が似ているので混ざりやすいですが、見ているものが違います。</p>
        <Compare>
          <Card title="排反：同時に起きない">
            <VennDiagram shade="none" disjoint ariaLabel="重ならない2つの円" />
            <p className="small">
              図で<strong>重なりがない</strong>。<M>{'P(A \\cap B) = 0'}</M>。
              <br />
              例：1回のサイコロで「1の目」と「2の目」。
            </p>
          </Card>
          <Card title="独立：影響しあわない">
            <VennDiagram shade="intersection" ariaLabel="重なりのある2つの円" />
            <p className="small">
              重なりが<strong>ちょうど P(A)×P(B) の大きさ</strong>ある。
              <br />
              例：1個目のサイコロと2個目のサイコロ。
            </p>
          </Card>
        </Compare>
        <Intuition title="排反なら、むしろ強く影響しあっている">
          <p>
            「1の目」と「2の目」は排反です。「1の目が出た」とわかった瞬間、「2の目」の確率は 1/6 から <strong>0</strong> に変わります。
            確率が変わるので、独立ではありません。確率が0でない2つの事象は、<strong>排反なら独立になれない</strong>のです。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'P(A \\mid B)'}</M> と <M>{'P(B \\mid A)'}</M> を同じだと思う → 分母（見る範囲）が違います。「| の右が見る範囲」と覚えましょう。
            </li>
            <li>
              「かつ」ならいつでも <M>{'P(A)P(B)'}</M> → かけ算だけでよいのは<strong>独立</strong>のとき。そうでなければ乗法定理 <M>{'P(A)P(B \\mid A)'}</M> を使います。
            </li>
            <li>
              「排反」と「独立」を同じ意味だと思う → 排反は「重ならない」、独立は「影響しない」。
            </li>
            <li>
              くじを「戻す」か「戻さない」かを読み落とす → 戻すなら毎回同じ確率（独立）、戻さないなら2回目の確率が変わります。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              クロス集計表（2つの項目で分けた表）から、条件付き確率を読み取る問題。分母になる行・列を正しく選べるかが問われます
              （クロス集計表は<Link to="/lessons/bivariate-cross-table">「クロス集計表」</Link>のレッスンでも扱います）。
            </li>
            <li>
              <M>{'P(A)'}</M>、<M>{'P(B)'}</M>、<M>{'P(A \\cup B)'}</M> などが数字で与えられ、加法定理で <M>{'P(A \\cap B)'}</M> を出してから条件付き確率を求める問題。
            </li>
            <li>戻さないくじ・取り出しの問題を、樹形図と乗法定理で解く問題。</li>
            <li>「独立かどうか」を <M>{'P(A \\cap B) = P(A)P(B)'}</M> で確かめる問題や、独立と排反の違いを問う選択肢。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
