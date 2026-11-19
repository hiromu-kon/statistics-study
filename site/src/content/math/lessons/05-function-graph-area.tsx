import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { NormalArea } from '../../../components/charts/common'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { AreaUnderCurve, BellShape, ExpDecay, ExpGrowth, LinePlot } from '../figures/GraphFigures'

export const meta: LessonMeta = {
  id: 'math-function-graph-area',
  chapter: 'math',
  order: 5,
  title: '関数・グラフ・面積',
  summary: '一次関数の傾きと切片（回帰直線の準備）、グラフの下の面積が確率になる考え方（連続分布の準備）、指数 2^x・e^x・e^{-x} の形を見ます。',
  minutes: 35,
  keywords: ['関数', '一次関数', '傾き', '面積', '指数'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>関数</strong>は「x を決めると y が1つに決まる」きまりで、<strong>グラフ</strong>はそれを絵にしたものです。
          統計では、直線（回帰直線）の<strong>傾き</strong>を読むことと、曲線の<strong>下の面積</strong>を確率として読むことが特に大切です。
        </p>
      </Point>

      <Section title="関数とは">
        <p>
          スマホの料金が「基本料金500円 + 1GBごとに300円」だとします。使ったデータ量を x（GB）、料金を y（円）とすると
          <M>{'y = 500 + 300x'}</M>。x を決めれば y がただ1つに決まるので、y は x の<strong>関数</strong>です。
        </p>
        <DataTable
          head={['x（GB）', '0', '1', '2', '3', '4']}
          rows={[['y（円）', '500', '800', '1100', '1400', '1700']]}
          caption="x が1増えるごとに y は300ずつ増える"
        />
      </Section>

      <Section title="一次関数 y = a + bx：切片と傾き">
        <p>
          <M>{'y = a + bx'}</M> の形の関数を<strong>一次関数</strong>といい、グラフは直線になります。
        </p>
        <ul>
          <li>
            <strong>切片 a</strong>：x = 0 のときの y の値。グラフが縦の軸と交わる高さ（上の例では500）。
          </li>
          <li>
            <strong>傾き b</strong>：x が 1 増えたときに y がどれだけ増えるか（上の例では300）。b がマイナスなら右下がり。
          </li>
        </ul>
        <Figure caption="切片と傾きを動かしてみよう。三角形の横が1、縦が傾き b">
          <LinePlot />
        </Figure>
        <Pitfall title="中学と統計で a と b が逆になる">
          <p>
            中学では <M>{'y = ax + b'}</M>（a が傾き、b が切片）と習いますが、統計の回帰直線では <M>{'y = a + bx'}</M>（<strong>a が切片、b が傾き</strong>）と書くことが多いです。
            文字ではなく「x にかかっているほうが傾き」と覚えましょう。
          </p>
        </Pitfall>
        <Example title="2点から直線の式を求める">
          <p>
            直線が点 (2, 7) と (5, 13) を通るとき、<M>{'y = a + bx'}</M> の a と b を求めます。
          </p>
          <Steps>
            <li>
              傾き = y の増えた分 ÷ x の増えた分：<M>{'b = \\frac{13 - 7}{5 - 2} = \\frac{6}{3} = 2'}</M>
            </li>
            <li>
              どちらかの点を代入して a を求める：<M>{'7 = a + 2 \\times 2'}</M> より <M>{'a = 3'}</M>
            </li>
            <li>
              答え：<M>{'y = 3 + 2x'}</M>（確かめ：x = 5 なら 3 + 10 = 13 ✓）
            </li>
          </Steps>
        </Example>
        <MathBlock caption="傾きは「y の変化 ÷ x の変化」">{'b = \\frac{y_2 - y_1}{x_2 - x_1}'}</MathBlock>
      </Section>

      <Section title="グラフの下の面積が「割合」になる">
        <p>
          ヒストグラムで、棒の面積を「その階級に入るデータの割合」にそろえておくと、全部の棒の面積の合計は 1 になります。
          階級の幅をどんどん細かくしていくと、棒のでこぼこはなめらかな<strong>曲線</strong>になります。
          このとき「曲線の下の、ある範囲の面積」が「その範囲に入る割合（確率）」です。
        </p>
        <p>まずは面積がかんたんに計算できる長方形の形で試してみましょう。0 から 10 のどこかがでたらめに選ばれる場合で、高さはどこでも 0.1 です。</p>
        <Figure caption="左端と右端を動かしてみよう。面積 = 横 × 縦（0.1）。全体（0〜10）の面積は 10 × 0.1 = 1">
          <AreaUnderCurve shape="uniform" />
        </Figure>
        <p>次は右上がりの三角形です。大きい値ほど出やすい形で、0 から x までの面積は三角形の面積 <M>{'\\frac{1}{2} \\times x \\times \\frac{x}{50} = \\frac{x^2}{100}'}</M> です。</p>
        <Figure caption="同じ幅でも、右のほう（高いところ）の面積は大きい。面積は「大きい三角形 − 小さい三角形」で求まる">
          <AreaUnderCurve shape="triangle" />
        </Figure>
        <p>
          正規分布のような曲がった形でも考え方は同じで、塗った部分の面積が確率です（曲線の面積は分布表で読み取ります）。
        </p>
        <Figure caption="左端・右端を動かしてみよう（標準正規分布）。−1 から 1 の面積は約 0.68">
          <NormalArea from={-1} to={1} interactive />
        </Figure>
        <MathNote title="積分という言葉">
          <p>
            曲線 <M>{'f(x)'}</M> の下の、a から b までの面積を求める操作を<strong>積分</strong>といい、<M>{'\\int_a^b f(x)\\,dx'}</M> と書きます。
            「<M>{'\\int'}</M> は Σ（足し算）をなめらかにしたもの」「a から b までの面積」と読めれば、まずは先に進めます。
          </p>
        </MathNote>
      </Section>

      <Section title="指数：倍々で増える・減る">
        <p>
          <M>{'2^x'}</M> は「2 を x 回かける」数です。x が1増えるごとに <strong>2倍</strong>になります：<M>{'2^1 = 2,\\ 2^2 = 4,\\ 2^3 = 8,\\ 2^4 = 16'}</M>。
          逆に1減るごとに半分になるので、<M>{'2^0 = 1'}</M>、<M>{'2^{-1} = \\frac{1}{2}'}</M>、<M>{'2^{-2} = \\frac{1}{4}'}</M> と決められています。
        </p>
        <DataTable
          head={['x', '−2', '−1', '0', '1', '2', '3']}
          rows={[[<M key="p">{'2^x'}</M>, '1/4', '1/2', '1', '2', '4', '8']]}
          caption="右へ1つ進むごとに2倍、左へ1つ進むごとに半分"
        />
        <p>
          統計では2の代わりに <M>{'e = 2.71828\\ldots'}</M>（<strong>ネイピア数</strong>）という特別な数がよく使われます。
          <M>{'e^x'}</M> は <M>{'2^x'}</M> より少し急に増えるだけで、形は同じ仲間です。
        </p>
        <Figure caption="x を動かしてみよう。どちらも x = 0 で 1 を通り、右へ行くほど急に大きくなる">
          <ExpGrowth />
        </Figure>
        <p>
          <M>{'e^{-x} = \\frac{1}{e^x}'}</M> は逆に、x が増えるとどんどん小さくなります。ただし、どれだけ小さくなっても<strong>0 にはならず、負にもなりません</strong>。
          「時間がたつほど起こりにくくなる」ような形で、指数分布の式に出てきます。
        </p>
        <Figure caption="k を動かしてみよう。k が大きいほど速く減る">
          <ExpDecay />
        </Figure>
        <p>
          指数の中に2乗が入った <M>{'e^{-x^2/2}'}</M> は、左右対称の<strong>つりがね型</strong>になります。これが正規分布の形の正体です。
        </p>
        <Figure caption="広がり s を動かしてみよう。s を大きくすると横に広がる（正規分布の標準偏差の役割）">
          <BellShape />
        </Figure>
        <MathBlock caption="指数のルール（かけ算は指数のたし算）">{'a^m \\times a^n = a^{m+n}, \\qquad a^{-n} = \\frac{1}{a^n}, \\qquad a^0 = 1'}</MathBlock>
      </Section>

      <Section title="対数（ごく軽く）">
        <p>
          <strong>対数</strong>は指数の逆で、「何乗すればその数になるか」を表します。
          <M>{'10^2 = 100'}</M> なので <M>{'\\log_{10} 100 = 2'}</M>、<M>{'10^3 = 1000'}</M> なので <M>{'\\log_{10} 1000 = 3'}</M>。
          e を使った対数 <M>{'\\log_e x'}</M> は <M>{'\\ln x'}</M> とも書きます。
        </p>
        <p>
          対数をとると、10, 100, 1000 のように「桁ちがいに広がった数」が 1, 2, 3 と等間隔になります。
          年収や人口のように右に長くのびたデータを見やすくする<strong>対数変換</strong>で使われます。まずはこの雰囲気がわかれば先に進めます。
        </p>
      </Section>

      <Section title="直感的な理解">
        <Intuition title="連続な分布では「高さ」ではなく「面積」が確率">
          <p>
            身長がちょうど 170.000… cm の人の割合は、ほとんど0です。意味があるのは「169.5〜170.5 cm の人の割合」のような<strong>範囲</strong>の割合で、
            それがグラフの下の<strong>面積</strong>です。グラフの高さそのものは確率ではなく、「そのあたりの集まり具合（密度）」を表します。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'y = a + bx'}</M> の a を傾きだと思う → x にかかっている b が傾き、a は切片。
            </li>
            <li>連続な分布のグラフの高さを確率だと思う → 確率は面積。高さは1を超えることもある。</li>
            <li>
              <M>{'2^3 = 6'}</M> としてしまう → <M>{'2^3 = 2 \\times 2 \\times 2 = 8'}</M>。指数は「かける回数」。
            </li>
            <li>
              <M>{'e^{-x}'}</M> は負の数だと思う → 指数がマイナスでも値は正（<M>{'\\frac{1}{e^x}'}</M>）。
            </li>
            <li>
              <M>{'2^0 = 0'}</M> と思う → <M>{'2^0 = 1'}</M>（どんな数でも0乗は1）。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計でどう使うか">
        <ExamTip title="統計でどう使うか">
          <ul>
            <li>
              <strong>回帰直線</strong>（2変数データ・線形モデル）：<M>{'\\hat{y} = a + bx'}</M>。傾き b は「x が1増えると y が平均して b 増える」と読む。
            </li>
            <li>
              <strong>連続分布</strong>（確率分布）：一様分布・指数分布・正規分布の確率は、グラフの下の面積。全体の面積は1。
            </li>
            <li>
              <strong>指数分布</strong>：<M>{'f(x) = \\lambda e^{-\\lambda x}'}</M>。上の「k を動かす図」と同じ、右下がりの形（k が λ の役割）。
            </li>
            <li>
              <strong>正規分布</strong>：<M>{'f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}'}</M>。式を覚えるより、つりがね型で面積が確率、と読めればよい。
            </li>
            <li>
              <strong>ポアソン分布</strong>：<M>{'P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}'}</M>。<M>{'e^{-\\lambda}'}</M> の値を電卓や表で使う。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
