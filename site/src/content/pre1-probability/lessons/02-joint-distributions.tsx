import { Link } from 'react-router-dom'
import { Card, Compare, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { CdfSurvival } from '../figures/CdfSurvival'
import { ConditionalDensity } from '../figures/ConditionalDensity'
import { JointTableExplorer } from '../figures/JointTableExplorer'

export const meta: LessonMeta = {
  id: 'pre1-probability-joint',
  chapter: 'pre1-probability',
  order: 2,
  title: '同時分布・周辺分布・条件つき分布',
  summary: '2つの確率変数をまとめて表す同時分布から、片方だけの分布（周辺分布）と、片方を固定したときの分布（条件つき分布）を作ります。連続の場合は積分で計算します。累積分布関数と生存関数も扱います。',
  minutes: 40,
  keywords: [
    '確率関数',
    '確率密度関数',
    '同時確率関数',
    '同時確率密度関数',
    '周辺確率関数',
    '周辺確率密度関数',
    '条件つき確率関数',
    '条件つき確率密度関数',
    '累積分布関数',
    '生存関数',
  ],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          2つの確率変数 X、Y の「組み合わせごとの確率」をまとめたものが<strong>同時分布</strong>です。そこから
        </p>
        <ul>
          <li>
            <strong>周辺分布</strong>：相手（Y）のことは気にせず、X だけの分布。<strong>相手について全部足す</strong>（連続なら積分する）。
          </li>
          <li>
            <strong>条件つき分布</strong>：X = x と決まったときの Y の分布。<strong>その行（切り口）だけを取り出し、合計が 1 になるように割る</strong>。
          </li>
        </ul>
        <p>を作ります。離散（表）でも連続（密度）でも、やることは同じです。</p>
      </Point>

      <Section title="具体例：同時確率の表（離散）">
        <p>
          ある会社の社員について、X を「朝食を食べるか（0: 食べない、1: 食べる）」、Y を「1日に飲むコーヒーの杯数（0, 1, 2）」とします。
          2級では同時分布と周辺分布を表で扱いました（<Link to="/lessons/random-variables-sum-covariance">確率変数の和と共分散</Link>）。今回はそこに条件つき分布を足します。
        </p>
        <Figure caption="ボタンで X の値を選ぶと、その行だけを取り出して行の合計で割った「条件つき分布」が、周辺分布の横に出る">
          <JointTableExplorer />
        </Figure>
        <Steps>
          <li>
            <strong>周辺分布</strong>：Y について足す。<M>{'P(X = 1) = 0.10 + 0.30 + 0.20 = 0.60'}</M>。同じく列を足すと <M>{'P(Y = 2) = 0.10 + 0.20 = 0.30'}</M>。
          </li>
          <li>
            <strong>条件つき分布</strong>：X = 1 の行 0.10, 0.30, 0.20 を、行の合計 0.60 で割る。
            <M>{'P(Y = 2 \\mid X = 1) = \\frac{0.20}{0.60} = \\frac{1}{3}'}</M>。3つ合わせると <M>{'\\frac{1}{6} + \\frac{1}{2} + \\frac{1}{3} = 1'}</M>。
          </li>
          <li>
            <strong>独立か</strong>：独立なら、すべてのマスで「同時確率 = 周辺確率の積」のはず。左上のマスは 0.10 ですが、
            <M>{'P(X=0)P(Y=0) = 0.40 \\times 0.20 = 0.08'}</M> なので、<strong>独立ではありません</strong>。1マスでも違えば独立ではない、と判断できます。
          </li>
        </Steps>
      </Section>

      <Section title="定義・式（離散）">
        <p>
          X と Y の値が飛び飛び（離散）のとき、<M>{'p(x, y) = P(X = x, Y = y)'}</M> を<strong>同時確率関数</strong>といいます。X だけの確率 <M>{'p_X(x) = P(X = x)'}</M> が
          X の<strong>確率関数</strong>で、同時確率関数から作ったものを特に<strong>周辺確率関数</strong>と呼びます。
        </p>
        <MathBlock caption="周辺確率関数：Y のとりうる値すべてについて足す">{'p_X(x) = \\sum_{y} p(x, y)'}</MathBlock>
        <MathBlock caption="条件つき確率関数：X = x のときの Y の分布（p_X(x) > 0 のとき）">{'p(y \\mid x) = P(Y = y \\mid X = x) = \\frac{p(x, y)}{p_X(x)}'}</MathBlock>
        <MathBlock caption="独立：すべての x、y で、同時確率が周辺確率の積になる">{'p(x, y) = p_X(x)\\,p_Y(y)'}</MathBlock>
        <p>
          条件つき確率関数は、<Link to="/lessons/probability-conditional">条件付き確率</Link> <M>{'P(B \\mid A) = P(A \\cap B)/P(A)'}</M> の A を「X = x」、B を「Y = y」にしたものです。
        </p>
      </Section>

      <Section title="連続の場合：同時確率密度関数">
        <p>
          X と Y が連続のときは、1点の確率は 0 なので「密度」で考えます。<strong>同時確率密度関数</strong> <M>{'f(x, y)'}</M> は、
          xy 平面の上にかぶせた「山」で、ある範囲 D の上の<strong>体積</strong>がその範囲に入る確率です。
        </p>
        <MathBlock caption="同時確率密度関数：範囲 D に (X, Y) が入る確率は、D の上の体積（重積分）">{'P\\big((X, Y) \\in D\\big) = \\iint_{D} f(x, y)\\,dx\\,dy, \\qquad \\int_{-\\infty}^{\\infty}\\int_{-\\infty}^{\\infty} f(x, y)\\,dx\\,dy = 1'}</MathBlock>
        <p>
          重積分（2つの変数での積分）は、「まず y で積分し、できた x の式をさらに x で積分する」と1つずつ計算します。
          やり方は<Link to="/lessons/pre1-math-multivariable">「偏微分と重積分」</Link>、1変数の積分は<Link to="/lessons/pre1-math-integral">「積分」</Link>で確認してください。
        </p>
        <MathBlock caption="周辺確率密度関数：相手の変数について積分する（離散の Σ が ∫ になる）">{'f_X(x) = \\int_{-\\infty}^{\\infty} f(x, y)\\,dy'}</MathBlock>
        <MathBlock caption="条件つき確率密度関数：X = x の切り口を、その面積 f_X(x) で割る">{'f(y \\mid x) = \\frac{f(x, y)}{f_X(x)} \\quad (f_X(x) > 0)'}</MathBlock>
        <Example title="f(x, y) = x + y（0 ≦ x ≦ 1、0 ≦ y ≦ 1、それ以外は 0）">
          <Steps>
            <li>
              全体が 1 になるか：まず y で積分 <M>{'\\int_0^1 (x + y)\\,dy = \\left[xy + \\frac{y^2}{2}\\right]_0^1 = x + \\frac{1}{2}'}</M>。
              次に x で積分 <M>{'\\int_0^1 \\left(x + \\frac{1}{2}\\right)dx = \\left[\\frac{x^2}{2} + \\frac{x}{2}\\right]_0^1 = \\frac{1}{2} + \\frac{1}{2} = 1'}</M>。確かに密度になっている。
            </li>
            <li>
              X の周辺密度：上の1行目がそのまま答え。<M>{'f_X(x) = x + \\frac{1}{2}'}</M>（0 ≦ x ≦ 1）。同じく <M>{'f_Y(y) = y + \\frac{1}{2}'}</M>。
            </li>
            <li>
              条件つき密度：<M>{'f(y \\mid x) = \\frac{x + y}{x + 1/2}'}</M>（0 ≦ y ≦ 1）。たとえば x = 0 なら <M>{'2y'}</M> で、y が大きいほど起きやすい。
            </li>
            <li>
              確率：<M>{'P(X \\le \\tfrac{1}{2},\\ Y \\le \\tfrac{1}{2}) = \\int_0^{1/2}\\!\\int_0^{1/2} (x + y)\\,dy\\,dx'}</M>。内側（y で積分、x は定数あつかい）：
              <M>{'\\left[xy + \\frac{y^2}{2}\\right]_0^{1/2} = \\frac{x}{2} + \\frac{1}{8}'}</M>。外側（x で積分）：
              <M>{'\\left[\\frac{x^2}{4} + \\frac{x}{8}\\right]_0^{1/2} = \\frac{1}{16} + \\frac{1}{16} = \\frac{1}{8}'}</M>。
            </li>
          </Steps>
        </Example>
        <Figure caption="左の縦線の位置（x）で同時密度を切ると、切り口は右の破線。面積が 1 になるように f_X(x) で割ると、条件つき密度（右の実線）になる">
          <ConditionalDensity />
        </Figure>
        <Intuition title="周辺は「押しつぶす」、条件つきは「切って伸ばす」">
          <p>
            周辺密度 <M>{'f_X(x)'}</M> は、山を y の方向に押しつぶして x 軸の上に集めたものです（y について積分）。
            条件つき密度 <M>{'f(y \\mid x)'}</M> は、山を x の位置で縦に切った切り口の形です。切り口の面積は 1 とは限らないので、面積 <M>{'f_X(x)'}</M> で割って 1 にそろえます。
          </p>
        </Intuition>
      </Section>

      <Section title="独立の判定">
        <MathBlock caption="連続の確率変数の独立：すべての x、y で同時密度が周辺密度の積になる">{'f(x, y) = f_X(x)\\,f_Y(y)'}</MathBlock>
        <p>
          実際には、「<strong>同時密度が x だけの式 × y だけの式に分かれ、しかも値が 0 でない範囲が長方形</strong>（x の範囲が y によらない）」なら独立、と判定できます。
        </p>
        <Compare>
          <Card title="独立になる例">
            <p>
              <M>{'f(x, y) = 6xy^2'}</M>（0 ≦ x ≦ 1、0 ≦ y ≦ 1）。<M>{'f_X(x) = \\int_0^1 6xy^2\\,dy = 6x\\left[\\frac{y^3}{3}\\right]_0^1 = 2x'}</M>、<M>{'f_Y(y) = \\int_0^1 6xy^2\\,dx = 6y^2\\left[\\frac{x^2}{2}\\right]_0^1 = 3y^2'}</M>。
              積は <M>{'2x \\cdot 3y^2 = 6xy^2'}</M> で、同時密度と一致する。
            </p>
          </Card>
          <Card title="独立にならない例（範囲に注意）">
            <p>
              <M>{'f(x, y) = 2'}</M>（0 &lt; y &lt; x &lt; 1 の三角形）。式は定数で「分かれている」ように見えるが、y のとれる範囲が x で決まる。
              <M>{'f_X(x) = \\int_0^x 2\\,dy = 2x'}</M>、<M>{'f_Y(y) = \\int_y^1 2\\,dx = 2(1-y)'}</M>。積 <M>{'4x(1-y)'}</M> は 2 ではない。
            </p>
          </Card>
        </Compare>
        <p>
          <M>{'f(x, y) = x + y'}</M> も、x だけの式と y だけの式の<strong>和</strong>であって積ではないので、独立ではありません（実際 <M>{'(x + \\tfrac12)(y + \\tfrac12) \\ne x + y'}</M>）。
        </p>
      </Section>

      <Section title="累積分布関数と生存関数">
        <p>
          <strong>累積分布関数</strong> <M>{'F(x) = P(X \\le x)'}</M> は「x 以下になる確率」で、離散でも連続でも使える共通の道具です（<Link to="/lessons/random-variables-intro">2級の確率変数のレッスン</Link>）。
          その反対側、「x より大きくなる確率」が<strong>生存関数</strong>です。
        </p>
        <MathBlock caption="生存関数：x より大きい値をとる確率。寿命なら「x より長く生きのびる確率」">{'S(x) = P(X > x) = 1 - F(x)'}</MathBlock>
        <p>
          機械の寿命、病気の治療後の生存期間、会員が解約するまでの期間など、「<strong>いつまで続くか</strong>」を調べるときは F より S のほうが話しやすいので、S がよく使われます（回帰分析の章の生存時間分析でも出てきます）。
        </p>
        <Example title="寿命が指数分布にしたがう部品">
          <p>
            寿命 X（年）が平均 2 年の指数分布（<M>{'\\lambda = 0.5'}</M>）にしたがうとき、<M>{'F(x) = 1 - e^{-0.5x}'}</M>、<M>{'S(x) = e^{-0.5x}'}</M> です。
            3 年より長く持つ確率は <M>{'S(3) = e^{-1.5} \\approx 0.223'}</M>。
          </p>
          <p>
            「すでに 2 年使えた部品が、さらに 3 年以上持つ確率」は、条件付き確率で
            <M>{'P(X > 5 \\mid X > 2) = \\frac{S(5)}{S(2)} = \\frac{e^{-2.5}}{e^{-1}} = e^{-1.5} = S(3)'}</M>。
            使った年数に関係なく、新品が 3 年持つ確率と同じです。これが指数分布の<strong>無記憶性</strong>です（<Link to="/lessons/distributions-uniform-exponential">2級の指数分布</Link>）。
          </p>
        </Example>
        <Figure caption="左の青い面積が F(x)、オレンジの面積が S(x)。右のグラフで、F は 0 から 1 へ増え、S は 1 から 0 へ減る。どの x でも足すと 1">
          <CdfSurvival />
        </Figure>
        <MathNote title="累積分布関数の性質と、2変数の場合">
          <ul>
            <li>F(x) は減らない（右へ行くほど大きいか同じ）。左の端で 0、右の端で 1 に近づく。</li>
            <li>
              <M>{'P(a < X \\le b) = F(b) - F(a)'}</M>。連続なら、F を微分すると密度：<M>{'f(x) = F\'(x)'}</M>（<Link to="/lessons/pre1-math-derivative">微分</Link>）。
            </li>
            <li>
              2変数では<strong>同時累積分布関数</strong> <M>{'F(x, y) = P(X \\le x, Y \\le y)'}</M> を使う。独立なら <M>{'F(x, y) = F_X(x)F_Y(y)'}</M>。
            </li>
          </ul>
        </MathNote>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              周辺密度を求めるとき、積分の範囲をいつも 0〜1 にする → 三角形のように範囲が x によって変わるときは、y の範囲（<M>{'0 < y < x'}</M> など）に合わせる。図を描いて範囲を確かめる。
            </li>
            <li>条件つき分布を同時確率のまま使う → 行（切り口）の合計で割らないと、合計（面積）が 1 にならない。</li>
            <li>「式が x と y に分かれている」だけで独立と判定する → 0 でない範囲が長方形かどうかも確かめる。和の形（x + y）は分かれていない。</li>
            <li>
              離散の生存関数で、<M>{'P(X > x)'}</M> と <M>{'P(X \\ge x)'}</M> を区別しない → 連続なら同じだが、離散では 1 点の確率の分だけ違う。
            </li>
            <li>密度の値そのものを確率と思う → 密度は 1 を超えることもある。確率は面積（体積）。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              事実：準1級の出題範囲表（2027年1月1日版）では、同時・周辺・条件つきの確率関数と確率密度関数、累積分布関数、生存関数が学習しておくべき用語に挙がっている。
            </li>
            <li>推測：同時確率の表から、周辺分布・条件つき確率・独立かどうかを答える問題。</li>
            <li>推測：簡単な同時密度（多項式や指数関数）から定数を決める、周辺密度を積分で求める、ある範囲の確率を重積分で求める問題。範囲が三角形のものに注意。</li>
            <li>推測：寿命の分布で「t より長く持つ確率」「すでに s 持ったときに、さらに t 持つ確率」を生存関数で答える問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
