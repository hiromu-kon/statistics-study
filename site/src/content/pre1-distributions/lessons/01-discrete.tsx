import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DiscreteMap, LimitExplorer, MultinomialScatter } from '../figures/DiscreteFigures'

export const meta: LessonMeta = {
  id: 'pre1-distributions-discrete',
  chapter: 'pre1-distributions',
  order: 1,
  title: '離散型分布の整理と多項分布',
  summary: '2級で学んだ離散型分布を「どれがどれの特殊な場合・和・極限か」でつなぎ直し、結果が3種類以上になる多項分布を学びます。',
  minutes: 40,
  keywords: ['離散一様分布', 'ベルヌーイ分布', '二項分布', '超幾何分布', 'ポアソン分布', '幾何分布', '負の二項分布', '多項分布'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          離散型の分布の多くは、「成功か失敗か」の1回の試行（<strong>ベルヌーイ試行</strong>）を組み合わせて作られています。
          足す・くり返す・回数を大きくする、という操作で分布どうしがつながっているので、関係図で覚えると忘れにくくなります。
          準1級で新しく出てくる<strong>多項分布</strong>は、二項分布の「成功・失敗」を「3種類以上の結果」に広げたもので、
          <strong>合計が n に決まっているので、ある結果が増えると他の結果は減る（共分散が負になる）</strong>のが特徴です。
        </p>
      </Point>

      <Section title="2級の復習：離散型分布の一覧">
        <p>
          まず2級で学んだ分布を並べます。忘れていたら、<Link to="/lessons/distributions-binomial">二項分布</Link>・
          <Link to="/lessons/distributions-poisson">ポアソン分布</Link>・
          <Link to="/lessons/distributions-geometric-hypergeometric">幾何分布・負の二項分布・超幾何分布</Link>のレッスンに戻ってください。
          準1級では、ここに<strong>積率母関数</strong>（<M>{'M(t) = E(e^{tX})'}</M>。<Link to="/lessons/pre1-math-derivative">微分</Link>して t = 0 を入れると <M>{'E(X)'}</M>、2回微分して t = 0 を入れると <M>{'E(X^2)'}</M> が出て、そこから平均や分散が求まる関数。<Link to="/lessons/pre1-probability-mgf">積率母関数のレッスン</Link>）が加わります。
        </p>
        <DataTable
          head={['分布', '何を数えるか', '平均', '分散']}
          rows={[
            ['離散一様 (1〜N)', '1〜N が同じ確率で出る値（公正なサイコロ）', <M key="a">{'\\frac{N+1}{2}'}</M>, <M key="b">{'\\frac{N^2-1}{12}'}</M>],
            ['ベルヌーイ Bin(1, p)', '1回の試行で成功なら 1、失敗なら 0', <M key="c">{'p'}</M>, <M key="d">{'p(1-p)'}</M>],
            ['二項 Bin(n, p)', 'n 回のうち成功した回数', <M key="e">{'np'}</M>, <M key="f">{'np(1-p)'}</M>],
            ['ポアソン Po(λ)', 'まれな出来事が一定時間に起こる回数', <M key="g">{'\\lambda'}</M>, <M key="h">{'\\lambda'}</M>],
            ['幾何 Geo(p)', '初めて成功するまでの試行回数', <M key="i">{'\\frac{1}{p}'}</M>, <M key="j">{'\\frac{1-p}{p^2}'}</M>],
            ['負の二項 NB(r, p)', 'r 回成功するまでの試行回数', <M key="k">{'\\frac{r}{p}'}</M>, <M key="l">{'\\frac{r(1-p)}{p^2}'}</M>],
            ['超幾何', 'N 本中 M 本当たりのくじを戻さず n 本引いたときの当たりの数', <M key="m">{'n\\frac{M}{N}'}</M>, <M key="n">{'np(1-p)\\frac{N-n}{N-1}'}</M>],
          ]}
          caption="幾何分布・負の二項分布は、2級のレッスンと同じく「成功した回も含めた試行回数」で数えている。超幾何分布の分散の p は当たりの割合 M/N"
        />
        <Note title="幾何分布・負の二項分布の流儀">
          <p>
            幾何分布と負の二項分布は、「成功するまでの<strong>失敗の回数</strong>」で定義する本もあります（0 から数える）。その場合は平均が
            <M>{'(1-p)/p'}</M>、<M>{'r(1-p)/p'}</M> になり、試行回数で数えたときよりちょうど 1、r だけ小さくなります（分散は同じ）。
            問題文で「何を数えているか」と「x = 0 から始まるか 1 から始まるか」を必ず確かめてください。
          </p>
        </Note>
      </Section>

      <Section title="関係図：どれがどれの特殊な場合・和・極限か">
        <p>箱を押すと、その分布の確率関数・平均・分散・積率母関数が下の表に出ます。オレンジの枠の多項分布が、このレッスンで新しく学ぶ分布です。</p>
        <Figure caption="矢印は「この操作をするとこの分布になる」。実線は和・一般化・極限、点線は特別な値を入れると一致する関係">
          <DiscreteMap />
        </Figure>
        <Steps>
          <li>
            <strong>ベルヌーイ → 二項（和）</strong>：独立なベルヌーイ試行 n 回の和（成功の数）が二項分布。だから平均も分散もベルヌーイの n 倍
            （<M>{'np'}</M>、<M>{'np(1-p)'}</M>）になり、積率母関数は n 乗 <M>{'(1-p+pe^t)^n'}</M> になります。
          </li>
          <li>
            <strong>幾何 → 負の二項（和）</strong>：「1回目の成功まで」「そこから2回目の成功まで」…はそれぞれ独立に同じ幾何分布に従うので、その r 個の和が負の二項分布。
            平均も分散も r 倍、積率母関数は r 乗です。
          </li>
          <li>
            <strong>二項 → ポアソン（極限）</strong>：平均 <M>{'np = \\lambda'}</M> を一定にしたまま、回数 n を大きく、確率 p を小さくすると、二項分布はポアソン分布に近づきます。
            「たくさんの機会があるが、1回あたりにはめったに起こらない」出来事の回数がポアソン分布になる理由です。
          </li>
          <li>
            <strong>超幾何 → 二項（極限）</strong>：くじの本数 N が非常に多ければ、引いたくじを戻しても戻さなくてもほとんど変わりません。
            当たりの割合 <M>{'M/N = p'}</M> を一定にして N を大きくすると、超幾何分布は二項分布 <M>{'Bin(n, p)'}</M> に近づきます。
          </li>
          <li>
            <strong>二項 → 多項（一般化）</strong>：結果が「成功・失敗」の2種類から、3種類以上になったもの（次の節）。
          </li>
        </Steps>
        <Figure caption="スライダーで n や N を大きくすると、2つの棒がほぼ同じ高さになる">
          <LimitExplorer />
        </Figure>
        <Intuition title="積率母関数で極限を確かめる">
          <p>
            二項分布の積率母関数に <M>{'p = \\lambda/n'}</M> を入れると、<M>{'(1 + \\lambda(e^t - 1)/n)^n'}</M> です。
            「<M>{'(1 + a/n)^n'}</M> は n を大きくすると <M>{'e^a'}</M> に近づく」（<Link to="/lessons/pre1-math-exp-log">指数・対数と微分</Link>）を使うと、
            これはポアソン分布の積率母関数 <M>{'e^{\\lambda(e^t - 1)}'}</M> に近づきます。積率母関数が近づけば分布も近づく、というのが極限を示す定番の方法です。
          </p>
        </Intuition>
        <MathBlock caption="再生性：同じ種類の独立な分布を足しても同じ種類になる（二項・負の二項は p が同じときだけ）">
          {'Bin(n_1, p) + Bin(n_2, p) = Bin(n_1 + n_2, p), \\quad Po(\\lambda_1) + Po(\\lambda_2) = Po(\\lambda_1 + \\lambda_2)'}
        </MathBlock>
      </Section>

      <Section title="多項分布：結果が3種類以上あるとき">
        <Example title="お店のアンケート">
          <p>
            あるお店では、客の評価が「満足」「ふつう」「不満」の3種類で、それぞれの確率が 0.5、0.3、0.2 だとします。客 5 人に（独立に）聞いたとき、
            「満足 3 人、ふつう 1 人、不満 1 人」になる確率を求めます。
          </p>
          <Steps>
            <li>
              並び方の1つ「満・満・満・ふ・不」が起こる確率：<M>{'0.5^3 \\times 0.3 \\times 0.2 = 0.0075'}</M>
            </li>
            <li>
              5人のうち誰が「満足」で誰が「ふつう」かの並べ方：<M>{'\\frac{5!}{3!\\,1!\\,1!} = \\frac{120}{6} = 20'}</M> 通り
            </li>
            <li>
              どの並び方も確率は同じなので、かけて <M>{'20 \\times 0.0075 = 0.15'}</M>
            </li>
          </Steps>
          <p>
            二項分布の <M>{'{}_{n}C_{k}'}</M>（n 個から成功の k 個を選ぶ）が、「n 個を 3 つのグループに分ける並べ方」 <M>{'n!/(x_1!\\,x_2!\\,x_3!)'}</M> に変わっただけです
            （同じものを含む順列。<Link to="/lessons/math-counting">場合の数</Link>）。
          </p>
        </Example>
        <h3>定義・式</h3>
        <p>
          1回の試行で k 種類の結果のどれか1つが起こり、それぞれの確率を <M>{'p_1, \\dots, p_k'}</M>（合計 1）とします。独立に n 回くり返し、結果 i が出た回数を
          <M>{'X_i'}</M> とすると、組 <M>{'(X_1, \\dots, X_k)'}</M> の分布が<strong>多項分布</strong> <M>{'Mn(n; p_1, \\dots, p_k)'}</M> です。
        </p>
        <MathBlock caption="多項分布の確率関数（x₁ + … + x_k = n のときだけ。それ以外の組の確率は 0）">
          {'P(X_1 = x_1, \\dots, X_k = x_k) = \\frac{n!}{x_1!\\, x_2! \\cdots x_k!}\\, p_1^{x_1} p_2^{x_2} \\cdots p_k^{x_k}'}
        </MathBlock>
        <p>
          k = 2 のときは <M>{'X_2 = n - X_1'}</M> と決まってしまうので、<M>{'X_1'}</M> だけを見れば二項分布 <M>{'Bin(n, p_1)'}</M> です。
        </p>
        <MathBlock caption="各成分の平均・分散と、2つの成分の共分散">
          {'E(X_i) = np_i, \\quad V(X_i) = np_i(1-p_i), \\quad \\mathrm{Cov}(X_i, X_j) = -np_ip_j \\ (i \\ne j)'}
        </MathBlock>
        <MathBlock caption="積率母関数（2つ以上の変数の積率母関数。t₁, …, t_k の関数）">{'M(t_1, \\dots, t_k) = (p_1e^{t_1} + \\cdots + p_ke^{t_k})^n'}</MathBlock>
        <h3>平均・分散：1つの結果だけ見れば二項分布</h3>
        <p>
          「満足」だけに注目して、それ以外（ふつう・不満）をまとめて「満足でない」とすれば、各回は「満足か、そうでないか」のベルヌーイ試行です。
          だから <M>{'X_1'}</M> だけの分布（<strong>周辺分布</strong>）は二項分布 <M>{'Bin(n, p_1)'}</M> で、平均 <M>{'np_1'}</M>、分散 <M>{'np_1(1-p_1)'}</M> です。
        </p>
        <h3>共分散が負になる理由と求め方</h3>
        <p>
          同じように「満足かふつう」と「不満」に分ければ、<M>{'X_1 + X_2'}</M> は二項分布 <M>{'Bin(n, p_1 + p_2)'}</M> です。
          和の分散の式 <M>{'V(X_1 + X_2) = V(X_1) + V(X_2) + 2\\mathrm{Cov}(X_1, X_2)'}</M>（<Link to="/lessons/random-variables-sum-covariance">和の分散</Link>）に入れると、
        </p>
        <MathBlock caption="左辺は Bin(n, p₁+p₂) の分散。右辺の2つの分散を移項して整理する">
          {'n(p_1+p_2)(1-p_1-p_2) = np_1(1-p_1) + np_2(1-p_2) + 2\\mathrm{Cov}(X_1, X_2)'}
        </MathBlock>
        <p>
          左辺を展開すると <M>{'n(p_1 + p_2) - n(p_1+p_2)^2 = np_1 + np_2 - np_1^2 - 2np_1p_2 - np_2^2'}</M>、右辺の分散の和は
          <M>{'np_1 - np_1^2 + np_2 - np_2^2'}</M>。差をとると <M>{'2\\mathrm{Cov}(X_1, X_2) = -2np_1p_2'}</M> なので、<M>{'\\mathrm{Cov}(X_1, X_2) = -np_1p_2'}</M> です。
        </p>
        <MathBlock caption="相関係数（n によらない）">{'\\rho(X_i, X_j) = \\frac{-np_ip_j}{\\sqrt{np_i(1-p_i)\\, np_j(1-p_j)}} = -\\sqrt{\\frac{p_ip_j}{(1-p_i)(1-p_j)}}'}</MathBlock>
        <Intuition title="合計が決まっているから、取り合いになる">
          <p>
            5人に聞いたら、満足・ふつう・不満の人数の合計は必ず 5 人です。満足が多ければ、残りの席は少ないので、ふつうや不満は少なくなりがちです。
            この「取り合い」が負の共分散です。下の図では、点が右下がりに並び、点線（不満が 0 人）より上には出られないことがわかります。
          </p>
        </Intuition>
        <Figure caption="同じ調査を何度もくり返したときの (満足の人数, ふつうの人数)。どの設定でも右下がりの雲になる">
          <MultinomialScatter />
        </Figure>
        <Example title="条件つき分布もわかる">
          <p>
            「満足が 3 人だった」と分かったとき、残り 2 人は「ふつう」か「不満」で、その中での「ふつう」の確率は <M>{'0.3/(0.3 + 0.2) = 0.6'}</M> です。
            だから <M>{'X_1 = 3'}</M> のときの <M>{'X_2'}</M> は <M>{'Bin(2, 0.6)'}</M> に従い、平均は <M>{'2 \\times 0.6 = 1.2'}</M> 人です。
            一般に <M>{'X_1 = x_1'}</M> のとき <M>{'X_2 \\sim Bin(n - x_1,\\ p_2/(1-p_1))'}</M>。<M>{'x_1'}</M> が大きいほど平均が下がるのも「取り合い」の表れです。
          </p>
        </Example>
        <Note title="多項分布はどこで使うか">
          <p>
            度数分布表の各階級の度数、アンケートの選択肢ごとの人数、サイコロの目ごとの回数などは、多項分布で表せます。2級の
            <Link to="/lessons/testing-chi2">適合度検定（カイ二乗検定）</Link>は、「観測した度数が、ある確率 <M>{'p_1, \\dots, p_k'}</M> の多項分布から出たと考えてよいか」を調べる検定です。
          </p>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              多項分布の各成分は独立 → 合計が n に決まっているので<strong>独立ではありません</strong>。共分散は <M>{'-np_ip_j'}</M>（負）。
            </li>
            <li>
              <M>{'V(X_1 + X_2) = V(X_1) + V(X_2)'}</M> とする → 共分散の分だけ小さくなります。<M>{'X_1 + X_2'}</M> は <M>{'Bin(n, p_1 + p_2)'}</M> として直接求めるのが安全です。
            </li>
            <li>
              二項分布をポアソン分布で近似するのに「n が大きい」だけを確かめる → <strong>p が小さい</strong>（np がほどほどの大きさ）ことも必要です。p が 0.5 に近いときは正規分布で近似します（<Link to="/lessons/sampling-normal-approximation">二項分布の正規近似</Link>）。
            </li>
            <li>
              幾何分布の平均をいつも <M>{'1/p'}</M> とする → 「失敗の回数」で数える流儀なら <M>{'(1-p)/p'}</M> です。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              出題範囲表（2027年1月1日からの版）の「種々の確率分布」には、離散一様・ベルヌーイ・二項・超幾何・ポアソン・幾何・負の二項・多項分布が並んでいます
              （<a href="https://www.toukei-kentei.jp/hubfs/files/20.grade/grade_range/grade1semi_hani_20270101.pdf" target="_blank" rel="noreferrer">統計検定準1級 出題範囲表</a>）。
            </li>
            <li>多項分布の確率の計算、各成分の平均・分散・共分散を問う問題は、上の式がそのまま使えます。</li>
            <li>積率母関数の形から分布を見抜く問題（例：<M>{'(0.7 + 0.3e^t)^{10}'}</M> なら <M>{'Bin(10, 0.3)'}</M>）や、和の分布を積率母関数のかけ算で求める問題に備えて、関係図の表を見直しておくとよいでしょう。</li>
            <li>どの形式（選択・数値入力）で、どれくらいの頻度で出るかは公式には公表されていないので、ここでは断定しません。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
