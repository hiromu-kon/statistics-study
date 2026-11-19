import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { LinearTransform, StandardizeCompare } from '../figures/StandardizeFigures'

export const meta: LessonMeta = {
  id: 'descriptive-standardize',
  chapter: 'descriptive',
  order: 6,
  title: '標準化と変動係数',
  summary: '平均や単位が違うデータを、同じものさしで比べる方法を学びます。',
  minutes: 25,
  keywords: ['偏差', '標準化（z得点）', '偏差値', '変動係数', '指数化', 'データの1次変換'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>標準化</strong>は「平均から標準偏差何個ぶんはなれているか」に直すこと。こうすると、平均や散らばりが違うテストの点数どうしでも比べられます。
          <strong>変動係数</strong>は「標準偏差が平均の何倍か」で、大きさの違うものの散らばりを比べるときに使います。
        </p>
      </Point>

      <Section title="国語の75点と数学の85点、どちらがすごい？">
        <p>Aさんの成績です。点数だけ見ると数学のほうが高いですが、テストの難しさや点のばらつきが違います。</p>
        <DataTable
          head={['教科', 'Aさんの点', 'クラス平均', '標準偏差']}
          rows={[
            ['国語', '75', '60', '10'],
            ['数学', '85', '50', '20'],
          ]}
        />
        <p>
          国語は平均より15点上。標準偏差が10点なので、「標準偏差 <strong>1.5個ぶん</strong>」上です。
          数学は平均より35点上で、標準偏差20点の <strong>1.75個ぶん</strong>。だからクラスの中での位置は、数学のほうが少し上だといえます。
        </p>
        <Figure caption="スライダーで点数を変えると、下の「そろえた目盛り（z 得点）」の上で2教科の位置を比べられる">
          <StandardizeCompare />
        </Figure>
      </Section>

      <Section title="定義・式">
        <MathBlock caption="z 得点：偏差（x − x̄）を標準偏差 s で割る">{'z = \\frac{x - \\bar{x}}{s}'}</MathBlock>
        <p>
          どんなデータでも、全員の値を標準化すると<strong>平均 0・標準偏差 1</strong>になります。z が正なら平均より上、負なら下です。
        </p>
        <MathBlock caption="偏差値：z 得点を「平均50・標準偏差10」の目盛りに直したもの">{'T = 50 + 10z'}</MathBlock>
        <p>
          Aさんの国語は <M>{'50 + 10 \\times 1.5 = 65'}</M>、数学は <M>{'50 + 10 \\times 1.75 = 67.5'}</M> です。
        </p>
        <Intuition title="なぜ標準偏差で割るの？">
          <p>
            みんなの点がそろっているテストで平均より15点上なのは目立ちますが、点がばらばらのテストではそれほど目立ちません。
            標準偏差で割ると「そのテストでのふつうのずれ」を1とした目盛りになり、どのテストでも同じ感覚で読めます。
          </p>
        </Intuition>
      </Section>

      <Section title="データの1次変換：y = ax + b">
        <p>
          全員の値を「a 倍して b を足す」と、平均・標準偏差はどう変わるでしょうか。温度の単位を℃から°Fに直す <M>{'F = 1.8C + 32'}</M> もこの形です。
        </p>
        <Figure caption="a と b を動かすと、平均は a × x̄ + b、標準偏差は |a| 倍になる。b は散らばりに関係しない">
          <LinearTransform />
        </Figure>
        <MathBlock caption="平均は同じ変換を受け、分散は a² 倍、標準偏差は |a| 倍">{'\\bar{y} = a\\bar{x} + b, \\qquad s_y^2 = a^2 s_x^2, \\qquad s_y = |a|\\, s_x'}</MathBlock>
        <Example title="℃ から °F へ">
          <p>
            ある月の最高気温が平均 20℃、標準偏差 5℃ だったとします。°F では平均 <M>{'1.8 \\times 20 + 32 = 68'}</M>°F、標準偏差 <M>{'1.8 \\times 5 = 9'}</M>°F。
            足した 32 は全員を同じだけずらすだけなので、標準偏差には効きません。
          </p>
        </Example>
        <p>
          なお、標準化 <M>{'z = (x - \\bar{x}) / s'}</M> も「<M>{'1/s'}</M> 倍して <M>{'-\\bar{x}/s'}</M> を足す」1次変換です。だから平均が 0、標準偏差が 1 になるのです。
        </p>
      </Section>

      <Section title="変動係数：大きさの違うものの散らばりを比べる">
        <Compare>
          <Card title="大人の体重">
            <p>平均 60kg、標準偏差 6kg</p>
            <p>
              変動係数 <M>{'6 \\div 60 = 0.10'}</M>
            </p>
          </Card>
          <Card title="生まれたばかりの赤ちゃんの体重">
            <p>平均 3kg、標準偏差 0.45kg</p>
            <p>
              変動係数 <M>{'0.45 \\div 3 = 0.15'}</M>
            </p>
          </Card>
        </Compare>
        <p>（数値は説明用の架空のものです）</p>
        <p>
          標準偏差だけ見ると大人のほうがずっと大きいですが、そもそもの体重が20倍も違います。「平均に対してどれくらいばらつくか」で比べると、赤ちゃんのほうが散らばりは大きいといえます。
        </p>
        <MathBlock caption="変動係数：標準偏差が平均の何倍か（単位がなくなる）">{'CV = \\frac{s}{\\bar{x}}'}</MathBlock>
        <p>
          kg どうしを割るので単位が消え、<strong>単位の違うデータ</strong>（身長 cm と体重 kg など）の散らばりも比べられます。
          ただし、平均が 0 に近いデータや、マイナスの値をとるデータ（℃など）では意味をもちません。
        </p>
      </Section>

      <Section title="指数化：基準を100にして変化を比べる">
        <p>
          ある時点の値を 100 として、ほかの時点の値を「基準の何倍か × 100」で表すのが<strong>指数化</strong>です。値の大きさが違うものの<strong>変化の割合</strong>を比べやすくなります。
        </p>
        <DataTable
          head={['年', 'パンの値段', '指数（2020年 = 100）', '家賃', '指数（2020年 = 100）']}
          rows={[
            ['2020', '200円', '100', '80,000円', '100'],
            ['2023', '230円', '115', '84,000円', '105'],
            ['2026', '250円', '125', '88,000円', '110'],
          ]}
          caption="架空の例。値上がりの金額は家賃のほうがずっと大きいが、割合ではパンのほうが大きく上がっている"
        />
        <MathBlock caption="指数：比べたい時点の値 x を、基準の時点の値 x₀ で割って100倍">{'I = \\frac{x}{x_0} \\times 100'}</MathBlock>
        <p>
          パンの2026年は <M>{'250 \\div 200 \\times 100 = 125'}</M>。基準より25%上がった、と読みます。消費者物価指数なども、この考え方で作られています。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>点数が高いほうが「クラスの中で上」→ 平均と標準偏差が違えば、z 得点で比べないとわかりません。</li>
            <li>全員に10点足すと標準偏差も変わる → 変わりません（全員が同じだけずれるだけ）。ただし<strong>変動係数は変わります</strong>（平均が変わるため）。</li>
            <li>2倍すると分散も2倍 → 分散は <strong>4倍</strong>、標準偏差が2倍です。</li>
            <li>偏差値60は「上位60%」→ 偏差値60は z = 1。分布が正規分布に近ければ上位およそ16%です。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>平均と標準偏差が違う2つのテストの点数を、z 得点（標準化）で比べる問題。</li>
            <li>単位変換（℃→°F、円→ドルなど）や「a倍してbを足す」変換をしたあとの平均・分散・標準偏差を求める問題。</li>
            <li>平均の大きさが違う2つのデータの散らばりを、変動係数で比べる問題。</li>
            <li>基準年を100とした指数を計算する問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
