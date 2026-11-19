import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BetaExplorer, CauchyMeanSim, CauchyShape, GammaExplorer, GammaSumSim, LogNormalExplorer } from '../figures/ContinuousFigures'

export const meta: LessonMeta = {
  id: 'pre1-distributions-continuous',
  chapter: 'pre1-distributions',
  order: 2,
  title: 'ガンマ・ベータ・コーシー・対数正規分布',
  summary: '待ち時間の合計を表すガンマ分布、0〜1 の割合を表すベータ分布、平均が存在しないコーシー分布、積で増えるものを表す対数正規分布を学びます。',
  minutes: 50,
  keywords: ['連続一様分布', '正規分布', '指数分布', 'ガンマ分布', 'ベータ分布', 'コーシー分布', '対数正規分布'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          準1級で新しく出てくる連続型の分布は、2級の分布とつながっています。<strong>ガンマ分布</strong>は指数分布（待ち時間）を足したもの、
          <strong>ベータ分布</strong>は一様分布を 0〜1 の範囲のまま形を変えられるようにしたもの、<strong>コーシー分布</strong>は自由度 1 の t 分布、
          <strong>対数正規分布</strong>は「log をとると正規分布」になるものです。コーシー分布だけは<strong>平均が存在しない</strong>という、ほかと違う性質をもちます。
        </p>
      </Point>

      <Section title="2級の復習：連続一様・指数・正規分布">
        <DataTable
          head={['分布', '何を表すか', '平均', '分散', '積率母関数']}
          rows={[
            ['一様 U(a, b)', 'a〜b のどこも同じくらい出る', <M key="a">{'\\frac{a+b}{2}'}</M>, <M key="b">{'\\frac{(b-a)^2}{12}'}</M>, <M key="c">{'\\frac{e^{bt} - e^{at}}{(b-a)t}'}</M>],
            ['指数 Exp(λ)', '次の出来事までの待ち時間（λ は単位時間あたりの平均回数）', <M key="d">{'\\frac{1}{\\lambda}'}</M>, <M key="e">{'\\frac{1}{\\lambda^2}'}</M>, <M key="f">{'\\frac{\\lambda}{\\lambda - t}\\ (t < \\lambda)'}</M>],
            ['正規 N(μ, σ²)', '多くの小さな要因が足し合わさった量', <M key="g">{'\\mu'}</M>, <M key="h">{'\\sigma^2'}</M>, <M key="i">{'e^{\\mu t + \\sigma^2t^2/2}'}</M>],
          ]}
          caption="2級のレッスン：「一様分布と指数分布」「正規分布」"
        />
        <p className="small muted">
          復習は<Link to="/lessons/distributions-uniform-exponential">一様分布と指数分布</Link>、<Link to="/lessons/distributions-normal">正規分布</Link>へ。
          密度を積分して確率や平均を出す計算は<Link to="/lessons/pre1-math-integral">積分</Link>のレッスンで練習します。
        </p>
      </Section>

      <Section title="ガンマ分布：待ち時間を足したもの">
        <Example title="窓口の3人目の客">
          <p>
            ある窓口には、客が平均 2 分に 1 人（1分あたり 0.5 人）の割合でばらばらに来ます。客と客の間の時間は平均 2 分の指数分布です（<Link to="/lessons/distributions-uniform-exponential">2級</Link>）。
            では、開店から <strong>3人目の客が来るまでの時間</strong> T はどんな分布でしょうか。
          </p>
          <p>
            T は「1人目までの時間＋1人目から2人目までの時間＋2人目から3人目までの時間」で、平均 2 分の独立な指数分布 3 つの和です。
            平均は <M>{'2 + 2 + 2 = 6'}</M> 分、分散は <M>{'4 + 4 + 4 = 12'}</M>（独立なので分散も足せる）。この T が従う分布が<strong>ガンマ分布</strong> <M>{'Ga(3, 2)'}</M> です（このレッスンでは、2つめの数を「1個あたりの平均の待ち時間」＝尺度として書きます。本によって書き方が違うことは、下の「パラメータの書き方」の注意で扱います）。
          </p>
        </Example>
        <Figure caption="指数分布を k 個足した値のヒストグラムは、ガンマ分布の曲線に重なる。k を増やすと山が右へ動き、左右対称に近づく（中心極限定理）">
          <GammaSumSim />
        </Figure>
        <h3>定義・式</h3>
        <p>
          ガンマ分布は<strong>形状</strong>（shape）k と<strong>尺度</strong>（scale）θ の2つのパラメータで決まります。k は「何個分の待ち時間を足すか」、θ は「1個あたりの平均の待ち時間」にあたります
          （ただし k は整数でなくてもよい）。
        </p>
        <MathBlock caption="ガンマ分布 Ga(k, θ) の密度（x > 0）">{'f(x) = \\frac{1}{\\Gamma(k)\\,\\theta^{k}}\\, x^{k-1} e^{-x/\\theta}'}</MathBlock>
        <MathBlock caption="平均・分散・積率母関数">{'E(X) = k\\theta, \\quad V(X) = k\\theta^2, \\quad M(t) = (1 - \\theta t)^{-k}\\ \\ (t < 1/\\theta)'}</MathBlock>
        <MathNote title="ガンマ関数 Γ(k)">
          <p>
            <M>{'\\Gamma(k) = \\int_0^{\\infty} x^{k-1} e^{-x}\\, dx'}</M> は、密度の面積を 1 にそろえるための数です。覚えておくのは次の3つで十分です。
          </p>
          <MathBlock>{'\\Gamma(k+1) = k\\,\\Gamma(k), \\qquad \\Gamma(n) = (n-1)!\\ \\ (n = 1, 2, \\dots), \\qquad \\Gamma(1/2) = \\sqrt{\\pi}'}</MathBlock>
          <p>例：<M>{'\\Gamma(4) = 3! = 6'}</M>、<M>{'\\Gamma(3/2) = \\frac{1}{2}\\Gamma(1/2) = \\frac{\\sqrt{\\pi}}{2}'}</M>。</p>
        </MathNote>
        <Figure caption="k を変えると形が、θ を変えると横方向の伸び方が変わる。θ = 2 にすると、自由度 2k の χ² 分布（オレンジの点線）とぴったり重なる">
          <GammaExplorer />
        </Figure>
        <h3>ほかの分布とのつながり</h3>
        <Steps>
          <li>
            <strong>k = 1 は指数分布</strong>：<M>{'Ga(1, \\theta)'}</M> の密度は <M>{'\\frac{1}{\\theta}e^{-x/\\theta}'}</M>。平均 θ の指数分布（λ = 1/θ）です。
          </li>
          <li>
            <strong>再生性</strong>：θ が同じなら、独立なガンマ分布の和もガンマ分布で、形状が足し算になります：<M>{'Ga(k_1, \\theta) + Ga(k_2, \\theta) = Ga(k_1 + k_2, \\theta)'}</M>。
            積率母関数で見ると <M>{'(1-\\theta t)^{-k_1}(1-\\theta t)^{-k_2} = (1-\\theta t)^{-(k_1+k_2)}'}</M>。
          </li>
          <li>
            <strong>χ² 分布はガンマ分布の仲間</strong>：<M>{'\\chi^2(m) = Ga(m/2,\\ 2)'}</M>。平均 <M>{'(m/2) \\times 2 = m'}</M>、分散 <M>{'(m/2) \\times 4 = 2m'}</M> が2級で覚えた値と一致します。
            特に <M>{'\\chi^2(2)'}</M> は平均 2 の指数分布です。
          </li>
        </Steps>
        <Pitfall title="パラメータの書き方が本によって違う">
          <p>
            ガンマ分布は、尺度 θ の代わりに<strong>率</strong>（rate）<M>{'\\lambda = 1/\\theta'}</M> で書く流儀もあります。文字もばらばらで、率を β と書く本もあれば、同じ β を尺度の意味で使う本やソフトもあります（たとえば Wolfram の <code>GammaDistribution[α, β]</code> は β が尺度）。そのときの密度・平均・分散は次のとおりです。
          </p>
          <MathBlock caption="率 λ で書いた Ga(k, λ)。尺度で書いた式の θ を 1/λ に置きかえたもの">{'f(x) = \\frac{\\lambda^{k}}{\\Gamma(k)}\\, x^{k-1} e^{-\\lambda x}, \\quad E(X) = \\frac{k}{\\lambda}, \\quad V(X) = \\frac{k}{\\lambda^2}'}</MathBlock>
          <p>
            <M>{'Ga(3, 2)'}</M> と書いてあっても、尺度 2（平均 6）なのか率 2（平均 1.5）なのかで答えが変わります。問題文に密度の式があれば、
            <strong><M>{'e^{-x/\\theta}'}</M> か <M>{'e^{-\\lambda x}'}</M> かを式で確かめる</strong>のが確実です（参考：
            <a href="https://en.wikipedia.org/wiki/Gamma_distribution" target="_blank" rel="noreferrer">Wikipedia「Gamma distribution」</a>は両方の書き方を並べています）。
          </p>
        </Pitfall>
      </Section>

      <Section title="ベータ分布：0 から 1 の値（割合・確率）の分布">
        <p>
          打率、合格率、ある商品を買う人の割合など、<strong>0 から 1 の間の値</strong>をとる量のばらつきを表したいときに使うのがベータ分布です。
          一様分布 <M>{'U(0, 1)'}</M> は「0〜1 のどこも同じ」でしたが、ベータ分布は 2 つのパラメータ a, b で、0 寄り・1 寄り・真ん中に集まる・両端に集まる、と形を変えられます。
        </p>
        <MathBlock caption="ベータ分布 Be(a, b) の密度（0 < x < 1）。B(a, b) は面積を 1 にするための数（ベータ関数）">
          {'f(x) = \\frac{1}{B(a, b)}\\, x^{a-1}(1-x)^{b-1}, \\qquad B(a, b) = \\frac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a+b)}'}
        </MathBlock>
        <MathBlock caption="平均と分散">{'E(X) = \\frac{a}{a+b}, \\qquad V(X) = \\frac{ab}{(a+b)^2(a+b+1)}'}</MathBlock>
        <p>
          積率母関数は簡単な形にならないので、平均や分散は密度を直接積分して求めます。ベータ関数の積分 <M>{'\\int_0^1 x^{a-1}(1-x)^{b-1} dx = B(a, b)'}</M> を使うと、
          <M>{'E(X) = B(a+1, b)/B(a, b)'}</M> となり、ガンマ関数で書き直して <M>{'\\Gamma(a+1) = a\\Gamma(a)'}</M>、<M>{'\\Gamma(a+b+1) = (a+b)\\Gamma(a+b)'}</M> を使うと <M>{'a/(a+b)'}</M> が出ます。
        </p>
        <MathBlock caption="ベータ分布の平均：x を掛けると x^a(1−x)^(b−1) になり、これはパラメータ (a+1, b) のベータ関数の積分">
          {'\\begin{aligned} E(X) &= \\frac{1}{B(a, b)}\\int_0^1 x \\cdot x^{a-1}(1-x)^{b-1}\\, dx = \\frac{B(a+1, b)}{B(a, b)} \\\\ &= \\frac{\\Gamma(a+1)\\Gamma(b)}{\\Gamma(a+b+1)} \\cdot \\frac{\\Gamma(a+b)}{\\Gamma(a)\\Gamma(b)} = \\frac{a\\Gamma(a)}{(a+b)\\Gamma(a+b)} \\cdot \\frac{\\Gamma(a+b)}{\\Gamma(a)} = \\frac{a}{a+b} \\end{aligned}'}
        </MathBlock>
        <Figure caption="a は「1 寄りにする力」、b は「0 寄りにする力」のようにはたらく。a = b なら 0.5 を中心に左右対称">
          <BetaExplorer />
        </Figure>
        <Intuition title="a − 1 回の成功と b − 1 回の失敗">
          <p>
            密度の形 <M>{'x^{a-1}(1-x)^{b-1}'}</M> は、成功の確率が x のときに「成功 a − 1 回、失敗 b − 1 回」が起こる確率（二項分布の式）と同じ形です。
            だから a が大きいほど「成功が多かった」＝ x は 1 寄り、と読めます。この見方は、ベイズ統計でベータ分布を「成功確率の分布」として使うときに役立ちます。
          </p>
        </Intuition>
        <Example title="Be(2, 3) の平均と分散">
          <p>
            <M>{'E(X) = 2/5 = 0.4'}</M>、<M>{'V(X) = \\frac{2 \\times 3}{5^2 \\times 6} = \\frac{6}{150} = 0.04'}</M>、標準偏差は 0.2 です。
            <M>{'Be(1, 1)'}</M> は密度が 1 の一様分布で、平均 1/2、分散 <M>{'\\frac{1}{4 \\times 3} = \\frac{1}{12}'}</M> と一様分布の式に一致します。
          </p>
        </Example>
        <Note title="このあと出てくる場面">
          <p>
            一様分布から取った n 個を小さい順に並べたときの k 番目は、ベータ分布 <M>{'Be(k, n - k + 1)'}</M> に従います（<Link to="/lessons/pre1-distributions-sampling">標本分布と順序統計量</Link>）。
          </p>
        </Note>
      </Section>

      <Section title="コーシー分布：平均が存在しない分布">
        <p>
          コーシー分布は、見た目は正規分布に似た山形ですが、すそ（両はし）が非常に厚く、とんでもなく大きな値がときどき出ます。標準コーシー分布の密度と累積分布関数は次のとおりです。
        </p>
        <MathBlock caption="標準コーシー分布の密度と累積分布関数。位置 x₀・尺度 γ をつけると (x − x₀)/γ が標準コーシー分布に従う">
          {'f(x) = \\frac{1}{\\pi(1 + x^2)}, \\qquad F(x) = \\frac{1}{2} + \\frac{1}{\\pi}\\arctan x'}
        </MathBlock>
        <Figure caption="真ん中の形は似ているが、|x| が大きいところでコーシー分布（赤）はなかなか 0 に近づかない">
          <CauchyShape />
        </Figure>
        <h3>なぜ平均が存在しないのか</h3>
        <p>
          期待値は <M>{'E(X) = \\int x f(x)\\, dx'}</M> ですが、これが意味をもつには <M>{'\\int |x| f(x)\\, dx'}</M> が有限でなければなりません。
          コーシー分布では <M>{'|x| f(x) = \\frac{|x|}{\\pi(1+x^2)}'}</M> が、x が大きいところで <M>{'\\frac{1}{\\pi |x|}'}</M> くらいにしか小さくならず、
          <M>{'\\int_1^{\\infty} \\frac{1}{x} dx = \\infty'}</M> と同じように積分が無限大になります。だから<strong>平均も分散も存在しません</strong>。積率母関数も存在しません。
        </p>
        <Intuition title="左右対称なのに、平均が 0 とはいえない">
          <p>
            山は 0 を中心に左右対称なので「平均は 0」と思いがちです。しかし、ときどき出る巨大な値が平均を大きく引っぱるので、データの平均をとっても 0 に落ち着きません。
            実際、標準コーシー分布に従う独立な n 個の<strong>標本平均もまた標準コーシー分布</strong>に従います。n をいくら増やしても、標本平均のばらつきはまったく小さくなりません。
          </p>
        </Intuition>
        <Figure caption="n を増やしながら標本平均を計算した線。正規分布（青）は 0 に落ち着くが、コーシー分布（赤）は大きな値が出るたびに跳ねる。ボタンで乱数を変えて何度か試そう">
          <CauchyMeanSim />
        </Figure>
        <p>
          これは<Link to="/lessons/sampling-lln-clt">大数の法則・中心極限定理</Link>の「平均（や分散）が存在する」という前提が成り立たない例です。
          中心を知りたいときは、平均ではなく<strong>中央値</strong>を使います（標準コーシー分布の中央値は 0、四分位数は ±1。<M>{'F(1) = \\frac{1}{2} + \\frac{1}{\\pi}\\cdot\\frac{\\pi}{4} = \\frac{3}{4}'}</M>）。
        </p>
        <Note title="コーシー分布が出てくる場面">
          <ul>
            <li>
              自由度 1 の t 分布 <M>{'t(1)'}</M> は標準コーシー分布です（t 分布の密度で m = 1 とおくと一致する）。
            </li>
            <li>独立な2つの標準正規分布の比 <M>{'Z_1/Z_2'}</M> は標準コーシー分布に従います。</li>
          </ul>
        </Note>
      </Section>

      <Section title="対数正規分布：積で増えるものの分布">
        <p>
          所得、資産、株価、病気の潜伏期間などは、0 より大きく、右に長いすそをもつことが多い量です。こうした量は、毎回「何 % 増える・減る」という
          <strong>かけ算</strong>の積み重ねで決まることがよくあります。かけ算は log をとると足し算になるので（<M>{'\\log(ab) = \\log a + \\log b'}</M>）、
          たくさんのかけ算の結果 X は、<M>{'\\log X'}</M> が足し算の積み重ね＝正規分布に近くなります。
        </p>
        <MathBlock caption="対数正規分布 LN(μ, σ²) の定義。μ, σ² は X ではなく log X の平均と分散">{'\\log X \\sim N(\\mu, \\sigma^2) \\quad \\Longleftrightarrow \\quad X = e^{Y},\\ Y \\sim N(\\mu, \\sigma^2)'}</MathBlock>
        <MathBlock caption="密度（x > 0）">{'f(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma x} \\exp\\left(-\\frac{(\\log x - \\mu)^2}{2\\sigma^2}\\right)'}</MathBlock>
        <MathBlock caption="中央値・平均・分散">{'\\mathrm{median} = e^{\\mu}, \\quad E(X) = e^{\\mu + \\sigma^2/2}, \\quad V(X) = e^{2\\mu + \\sigma^2}(e^{\\sigma^2} - 1)'}</MathBlock>
        <Intuition title="中央値は e^μ、平均はそれより大きい">
          <p>
            log は大小の順番を変えないので、Y の中央値 μ は X では <M>{'e^{\\mu}'}</M> になります。ところが平均は、右のすその大きな値に引っぱられて
            中央値の <M>{'e^{\\sigma^2/2}'}</M> 倍に大きくなります。「平均年収は中央値より高い」のと同じ現象です（<Link to="/lessons/descriptive-center">平均値・中央値・最頻値</Link>）。
          </p>
        </Intuition>
        <Figure caption="σ を大きくすると、最頻値・中央値・平均の差が広がる">
          <LogNormalExplorer />
        </Figure>
        <Example title="平均を正規分布の積率母関数から出す">
          <p>
            <M>{'E(X) = E(e^{Y})'}</M> は、正規分布 Y の積率母関数 <M>{'M_Y(t) = E(e^{tY}) = e^{\\mu t + \\sigma^2t^2/2}'}</M> に t = 1 を入れたものです。
            だから <M>{'E(X) = e^{\\mu + \\sigma^2/2}'}</M>。同じく <M>{'E(X^2) = E(e^{2Y}) = M_Y(2) = e^{2\\mu + 2\\sigma^2}'}</M> なので、
          </p>
          <MathBlock>{'V(X) = e^{2\\mu + 2\\sigma^2} - (e^{\\mu + \\sigma^2/2})^2 = e^{2\\mu + \\sigma^2}(e^{\\sigma^2} - 1)'}</MathBlock>
          <p>
            数値例：<M>{'\\mu = 1,\\ \\sigma = 0.5'}</M> なら中央値 <M>{'e^{1} \\approx 2.718'}</M>、平均 <M>{'e^{1.125} \\approx 3.080'}</M> です。
          </p>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              ガンマ分布 <M>{'Ga(k, \\theta)'}</M> の第2パラメータを、いつも尺度（または率）と決めつける → 本や問題によって違います。密度の式で確かめます。
            </li>
            <li>
              コーシー分布は左右対称だから平均 0 → 平均は<strong>存在しません</strong>。中央値なら 0 です。標本平均を集めても中心極限定理は使えません。
            </li>
            <li>
              対数正規分布の平均を <M>{'e^{\\mu}'}</M> とする → それは中央値。平均は <M>{'e^{\\mu + \\sigma^2/2}'}</M> です。
            </li>
            <li>
              対数正規分布の μ, σ² を X の平均・分散と思う → <M>{'\\log X'}</M> の平均・分散です。
            </li>
            <li>
              ベータ分布の平均を <M>{'a/b'}</M> とする → 分母は <M>{'a + b'}</M> です。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              出題範囲表（2027年1月1日からの版）の「種々の確率分布」には、連続一様・正規・指数・ガンマ・ベータ・コーシー・対数正規分布が並んでいます
              （<a href="https://www.toukei-kentei.jp/hubfs/files/20.grade/grade_range/grade1semi_hani_20270101.pdf" target="_blank" rel="noreferrer">統計検定準1級 出題範囲表</a>）。
            </li>
            <li>
              本番は普通電卓だけで、e や log の値は計算できません（<a href="https://www.toukei-kentei.jp/grade/grade_pre-1" target="_blank" rel="noreferrer">統計検定準1級の公式ページ</a>）。
              対数正規分布の問題で <M>{'e^{0.4}'}</M> などが必要なら、問題文で値が与えられると考えられます。
            </li>
            <li>「指数分布の和 → ガンマ分布」「χ² 分布 = ガンマ分布」「t(1) = コーシー分布」のような分布どうしの関係は、選択肢の正誤を判断する問題で役に立ちます。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
