import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { LinearTransform } from '../figures/LinearTransform'
import { Standardize } from '../figures/Standardize'

export const meta: LessonMeta = {
  id: 'random-variables-linear-transform',
  chapter: 'random-variables',
  order: 3,
  title: '確率変数の1次変換',
  summary: 'X を a 倍して b を足すと、期待値・分散・標準偏差はどう変わるか。足した数が散らばりに効かない理由を図で確かめ、標準化につなげます。',
  minutes: 25,
  keywords: ['E(aX+b)', 'V(aX+b)', '標準化'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <M>{'Y = aX + b'}</M> のとき、期待値は同じ計算で <M>{'aE(X) + b'}</M>。分散は <M>{'a^2 V(X)'}</M> で、<strong>足した b は分散に関係しません</strong>。
          全体を横にずらしても、散らばり方は変わらないからです。標準偏差は <M>{'|a|'}</M> 倍になります。
        </p>
      </Point>

      <Section title="具体例：お店の利益">
        <p>
          ある店で、1日に売れるケーキの数を <M>{'X'}</M> 個とします。ケーキ1個の利益は300円、1日の固定費（家賃など）は2000円です。
          1日の利益 <M>{'Y'}</M> 円は
        </p>
        <MathBlock caption="利益 = 300 × 売れた数 − 固定費">{'Y = 300X - 2000'}</MathBlock>
        <p>
          のように、<M>{'X'}</M> を <strong>a 倍して b を足した形</strong>（1次変換）になります。売れる数の期待値が40個、標準偏差が5個なら、利益の期待値と標準偏差はいくらでしょうか。
        </p>
        <Steps>
          <li>
            期待値：<M>{'E(Y) = 300 \\times 40 - 2000 = 10000'}</M> 円。売れる数の平均を式に入れるだけです。
          </li>
          <li>
            標準偏差：1個売れる数がずれると利益は300円ずれるので、<M>{'300 \\times 5 = 1500'}</M> 円。固定費の2000円は毎日同じなので、ばらつきには影響しません。
          </li>
          <li>
            分散：<M>{'300^2 \\times 5^2 = 2250000'}</M>（<M>{'= 1500^2'}</M>）。
          </li>
        </Steps>
      </Section>

      <Section title="定義・式">
        <MathBlock caption="期待値：X の期待値に、同じ変換をすればよい">{'E(aX + b) = aE(X) + b'}</MathBlock>
        <MathBlock caption="分散：a の2乗倍になる。b は消える">{'V(aX + b) = a^2\\,V(X)'}</MathBlock>
        <MathBlock caption="標準偏差：|a| 倍になる（マイナスでも散らばりはマイナスにならない）">{'\\sigma_{aX+b} = |a|\\,\\sigma_X'}</MathBlock>
        <MathNote title="なぜこうなるのか（式で確かめる）">
          <p>
            期待値：<M>{'E(aX + b) = \\sum (a x_i + b) p_i = a \\sum x_i p_i + b \\sum p_i = aE(X) + b'}</M>。最後は確率の合計 <M>{'\\sum p_i = 1'}</M> を使いました。
          </p>
          <p>
            分散：Y の値から Y の期待値を引くと、<M>{'(a x_i + b) - (a\\mu + b) = a(x_i - \\mu)'}</M>。<strong>b が引き算で消えます</strong>。
            2乗すると <M>{'a^2 (x_i - \\mu)^2'}</M> なので、分散は <M>{'a^2'}</M> 倍です。
          </p>
        </MathNote>
      </Section>

      <Section title="直感的な理解：平行移動と拡大">
        <p>
          サイコロの目 <M>{'X'}</M>（灰色）を <M>{'Y = aX + b'}</M>（青）に変換します。b を動かすと分布が<strong>そのまま横にずれる</strong>だけ、
          a を動かすと棒の<strong>間隔が |a| 倍に伸び縮み</strong>するのを確かめてください。
        </p>
        <Figure caption="b を動かしても緑の矢印（標準偏差）の長さは変わらない。a を2倍にすると矢印も2倍、a をマイナスにすると左右が反転するが長さは |a| 倍">
          <LinearTransform />
        </Figure>
        <Intuition title="全員に10点足しても、散らばりは同じ">
          <p>
            テストで全員に10点のおまけをしても、点数の「差」は1点も変わりません。分散は「平均からのずれ」で測るので、全員と平均が一緒に10点ずれれば、ずれは同じです。
            一方、点数を2倍にすると、差も2倍に開きます。ずれが2倍なので、2乗した分散は4倍です。
          </p>
        </Intuition>
      </Section>

      <Section title="標準化：平均0・標準偏差1にそろえる">
        <p>
          期待値 <M>{'\\mu'}</M>、標準偏差 <M>{'\\sigma'}</M> の確率変数 <M>{'X'}</M> から、次の <M>{'Z'}</M> を作ることを<strong>標準化</strong>といいます。
        </p>
        <MathBlock caption="標準化：期待値を引いて中心を0にし、標準偏差で割って幅を1にする">{'Z = \\frac{X - \\mu}{\\sigma}'}</MathBlock>
        <p>
          これは <M>{'a = 1/\\sigma'}</M>、<M>{'b = -\\mu/\\sigma'}</M> の1次変換なので、上の式から
        </p>
        <MathBlock>{'E(Z) = \\frac{E(X) - \\mu}{\\sigma} = 0, \\qquad V(Z) = \\frac{V(X)}{\\sigma^2} = \\frac{\\sigma^2}{\\sigma^2} = 1'}</MathBlock>
        <Figure caption="① → ② で中心が0に、② → ③ で幅（標準偏差）が1になる。形は変わらない">
          <Standardize />
        </Figure>
        <Example title="標準化すると「平均から標準偏差何個分か」がわかる">
          <p>
            平均60点・標準偏差10点のテストで75点なら、<M>{'z = (75 - 60)/10 = 1.5'}</M>。「平均より標準偏差1.5個分上」です。
            単位や平均が違うものどうしでも、標準化すれば位置を比べられます。
            ちなみに偏差値は、標準化した値をさらに <M>{'50 + 10z'}</M> と1次変換したもので、この例では65です。
          </p>
        </Example>
        <DataTable
          head={['変換', '期待値', '分散', '標準偏差']}
          rows={[
            [<M key="a">{'X + b'}</M>, <M key="b">{'E(X) + b'}</M>, <M key="c">{'V(X)'}</M>, <M key="d">{'\\sigma'}</M>],
            [<M key="e">{'aX'}</M>, <M key="f">{'aE(X)'}</M>, <M key="g">{'a^2 V(X)'}</M>, <M key="h">{'|a|\\sigma'}</M>],
            [<M key="i">{'-X'}</M>, <M key="j">{'-E(X)'}</M>, <M key="k">{'V(X)'}</M>, <M key="l">{'\\sigma'}</M>],
            [<M key="m">{'(X - \\mu)/\\sigma'}</M>, '0', '1', '1'],
          ]}
          caption="1次変換のまとめ"
        />
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'V(aX + b) = aV(X) + b'}</M> としてしまう → 正しくは <M>{'a^2 V(X)'}</M>。b は消え、a は2乗されます。
            </li>
            <li>
              <M>{'V(-X) = -V(X)'}</M> としてしまう → 分散はマイナスになりません。<M>{'(-1)^2 = 1'}</M> なので <M>{'V(-X) = V(X)'}</M>。
            </li>
            <li>
              標準偏差も <M>{'a^2'}</M> 倍にしてしまう → 標準偏差は <M>{'|a|'}</M> 倍。2乗するのは分散だけです。
            </li>
            <li>
              <M>{'2X'}</M>（1回の結果を2倍）と、<M>{'X_1 + X_2'}</M>（2回分の合計）を同じだと思う → 分散は <M>{'4V(X)'}</M> と <M>{'2V(X)'}</M>（独立のとき）で違います。次のレッスンで扱います。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>単位の変換（円→ドル、℃→℉）や得点の調整で、期待値・分散・標準偏差がどう変わるかを問う問題。</li>
            <li>標準化して、正規分布表を引く問題（「確率分布」の章で何度も使います）。</li>
            <li>「平均0・分散1にするには a, b をいくつにするか」を問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
