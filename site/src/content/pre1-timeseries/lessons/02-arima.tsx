import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { TextTable } from '../../collection/figures/TextTable'
import { AcfPacfPatterns, Ar1Explorer, ForecastFan } from '../figures/ArimaFigures'

export const meta: LessonMeta = {
  id: 'pre1-timeseries-arima',
  chapter: 'pre1-timeseries',
  order: 2,
  title: 'AR・MA・ARMA・ARIMA モデル',
  summary: '「過去の値を引き継ぐ」AR モデルと「過去のショックを引き継ぐ」MA モデル、その組合せの ARMA、階差をとってから ARMA を当てはめる ARIMA を学び、自己相関・偏自己相関の形から次数を見分け、予測する方法を身につけます。',
  minutes: 55,
  keywords: ['ARIMAモデル', 'ARモデル', 'MAモデル', 'ARMAモデル', '定常性', '単位根', '予測'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>AR</strong>（自己回帰）モデルは「今の値 ＝ 過去の値の何倍か ＋ 新しいノイズ」、<strong>MA</strong>（移動平均）モデルは「今の値 ＝ 新しいノイズ ＋ 過去のノイズの何倍か」。
          AR は自己相関がゆっくり減り、MA は自己相関がある次数でぷっつり 0 になります。偏自己相関ではこの関係が逆になるので、
          <strong>2つのグラフの「減衰」と「切断」</strong>から、どのモデルを何次で使うかの見当をつけます。
          非定常な系列は、階差をとってから ARMA を当てはめます（<strong>ARIMA</strong>）。
        </p>
      </Point>

      <Section title="AR(1)：1期前の値を引き継ぐ">
        <p>
          たとえば「毎日の気温の平年からのずれ」を考えます。暖かい日の翌日はやはり暖かめになりやすいですが、そのずれは日がたつと薄れていきます。
          これを「今日のずれ ＝ 昨日のずれの φ 倍 ＋ 今日の新しいゆらぎ」と表したのが <strong>1次の自己回帰モデル AR(1)</strong> です。
        </p>
        <MathBlock caption="AR(1)：c は定数、φ（ファイ）は1期前をどれだけ引き継ぐか、ε_t は平均 0・分散 σ² のホワイトノイズ">
          {'x_t = c + \\phi x_{t-1} + \\varepsilon_t'}
        </MathBlock>
        <Figure caption="φ を動かしてみよう（σ² = 1、c = 0）。φ が 1 に近いほど系列はゆっくり大きく波打ち、自己相関もゆっくり減る。φ が負だと、系列は細かく上下し、自己相関は符号を交互に変える。φ = 1 はランダムウォーク">
          <Ar1Explorer />
        </Figure>
        <h3>|φ| &lt; 1 なら定常で、平均・分散・自己相関が求まる</h3>
        <p>
          定常なら、平均 <M>{'\\mu'}</M> と分散 <M>{'\\gamma(0)'}</M> はどの時点も同じです。それを使うと、式の両辺から3つの性質が出てきます。
        </p>
        <Steps>
          <li>
            <strong>平均</strong>：両辺の期待値をとると <M>{'\\mu = c + \\phi\\mu'}</M>。よって <M>{'\\mu = \\dfrac{c}{1 - \\phi}'}</M>。
          </li>
          <li>
            <strong>分散</strong>：<M>{'\\varepsilon_t'}</M> は過去の <M>{'x_{t-1}'}</M> と無相関なので、<M>{'\\gamma(0) = \\phi^2\\gamma(0) + \\sigma^2'}</M>。よって <M>{'\\gamma(0) = \\dfrac{\\sigma^2}{1 - \\phi^2}'}</M>。
          </li>
          <li>
            <strong>自己共分散</strong>：<M>{'x_t - \\mu = \\phi(x_{t-1} - \\mu) + \\varepsilon_t'}</M> の両辺に <M>{'x_{t-k} - \\mu'}</M> を掛けて期待値をとると
            <M>{'\\gamma(k) = \\phi\\gamma(k-1)'}</M>。これをくり返して <M>{'\\gamma(k) = \\phi^k\\gamma(0)'}</M>。
          </li>
        </Steps>
        <MathBlock caption="定常な AR(1) の性質：自己相関は φ を k 回掛けたもので、指数的に減衰する">
          {'\\mu = \\frac{c}{1-\\phi}, \\qquad \\gamma(0) = \\frac{\\sigma^2}{1-\\phi^2}, \\qquad \\rho(k) = \\phi^k'}
        </MathBlock>
        <p>
          分散の式は、<M>{'\\phi^2 < 1'}</M> でないと正の値になりません。<M>{'|\\phi| \\geq 1'}</M> のときは定常にならず、φ = 1 は前のレッスンのランダムウォーク、
          <M>{'|\\phi| > 1'}</M> では値がどんどん大きくなって発散します。
        </p>
        <Example title="数値で確かめる">
          <p>
            <M>{'x_t = 3 + 0.4x_{t-1} + \\varepsilon_t'}</M>、<M>{'\\sigma^2 = 0.84'}</M> なら、
            平均 <M>{'3/(1 - 0.4) = 5'}</M>、分散 <M>{'0.84/(1 - 0.16) = 1'}</M>、自己相関 <M>{'\\rho(1) = 0.4'}</M>、<M>{'\\rho(2) = 0.16'}</M>、<M>{'\\rho(3) = 0.064'}</M> です。
          </p>
        </Example>
      </Section>

      <Section title="AR(p)：p 期前までの値を引き継ぐ">
        <MathBlock caption="AR(p)：過去 p 個の値の重みつきの和にノイズを足す">
          {'x_t = c + \\phi_1 x_{t-1} + \\phi_2 x_{t-2} + \\cdots + \\phi_p x_{t-p} + \\varepsilon_t'}
        </MathBlock>
        <p>定常になる条件は、次の方程式（特性方程式）の解 z が、すべて絶対値 1 より大きいことです（複素数の解なら、その絶対値）。</p>
        <MathBlock caption="AR(p) の特性方程式。解がすべて |z| > 1 なら定常">{'1 - \\phi_1 z - \\phi_2 z^2 - \\cdots - \\phi_p z^p = 0'}</MathBlock>
        <p>
          AR(1) なら <M>{'1 - \\phi z = 0'}</M> で <M>{'z = 1/\\phi'}</M>。<M>{'|1/\\phi| > 1'}</M> は <M>{'|\\phi| < 1'}</M> と同じで、上の条件に一致します。
          解に <M>{'z = 1'}</M> が含まれる場合（<M>{'\\phi_1 + \\cdots + \\phi_p = 1'}</M>）を<strong>単位根</strong>があるといい、ランダムウォークと同じく非定常です。
          AR(2) の場合は、<M>{'\\phi_1 + \\phi_2 < 1'}</M>、<M>{'\\phi_2 - \\phi_1 < 1'}</M>、<M>{'|\\phi_2| < 1'}</M> の3つがそろうことと同じになります。
        </p>
        <h3>ユール・ウォーカー方程式：係数から自己相関を求める</h3>
        <p>
          AR(1) と同じように、<M>{'x_t - \\mu'}</M> の式に <M>{'x_{t-k} - \\mu'}</M> を掛けて期待値をとり、<M>{'\\gamma(0)'}</M> で割ると、自己相関が満たす式が出ます。
        </p>
        <MathBlock caption="AR(2) のユール・ウォーカー方程式（k = 1, 2）。k ≥ 3 も同じ形 ρ(k) = φ₁ρ(k−1) + φ₂ρ(k−2) で続く">
          {'\\rho(1) = \\phi_1 + \\phi_2\\rho(1), \\qquad \\rho(2) = \\phi_1\\rho(1) + \\phi_2'}
        </MathBlock>
        <Example title="AR(2)：φ₁ = 0.5、φ₂ = 0.3">
          <Steps>
            <li>
              1つめの式を <M>{'\\rho(1)'}</M> について解くと <M>{'\\rho(1) = \\dfrac{\\phi_1}{1 - \\phi_2} = \\dfrac{0.5}{0.7} \\approx 0.714'}</M>。
            </li>
            <li>
              2つめの式から <M>{'\\rho(2) = 0.5 \\times 0.714 + 0.3 \\approx 0.657'}</M>。
            </li>
            <li>
              偏自己相関は <M>{'\\phi_{22} = \\dfrac{0.657 - 0.714^2}{1 - 0.714^2} = 0.3'}</M> で、ちょうど <M>{'\\phi_2'}</M> に一致します。ラグ3から先の偏自己相関は 0 です。
            </li>
          </Steps>
        </Example>
        <p>
          逆に、データから自己相関 <M>{'r_1, r_2'}</M> を計算し、この式を <M>{'\\phi_1, \\phi_2'}</M> について解けば、AR モデルの係数の推定値になります（ユール・ウォーカー推定）。
        </p>
      </Section>

      <Section title="MA(1)：1期前のショックを引き継ぐ">
        <p>
          今度は「値」ではなく「ショック（ノイズ）」を引き継ぐモデルです。たとえば、ある日の特売（ショック）が、その日と翌日の売上だけに効き、2日後にはもう効かない、という状況です。
        </p>
        <MathBlock caption="MA(1)：μ は平均、θ（シータ）は1期前のショックをどれだけ引き継ぐか">{'x_t = \\mu + \\varepsilon_t + \\theta\\varepsilon_{t-1}'}</MathBlock>
        <Steps>
          <li>平均：<M>{'E(x_t) = \\mu'}</M>。</li>
          <li>
            分散：<M>{'\\varepsilon_t'}</M> と <M>{'\\varepsilon_{t-1}'}</M> は独立なので <M>{'\\gamma(0) = \\sigma^2 + \\theta^2\\sigma^2 = (1 + \\theta^2)\\sigma^2'}</M>。
          </li>
          <li>
            ラグ1の共分散：<M>{'x_t'}</M> と <M>{'x_{t-1} = \\mu + \\varepsilon_{t-1} + \\theta\\varepsilon_{t-2}'}</M> が共有しているのは <M>{'\\varepsilon_{t-1}'}</M> だけなので、
            <M>{'\\gamma(1) = \\theta\\sigma^2'}</M>。
          </li>
          <li>ラグ2以上：共有するノイズがないので <M>{'\\gamma(k) = 0'}</M>。</li>
        </Steps>
        <MathBlock caption="MA(1) の自己相関：ラグ1だけが 0 でなく、ラグ2から先は 0（切断）">
          {'\\rho(1) = \\frac{\\theta}{1 + \\theta^2}, \\qquad \\rho(k) = 0 \\ (k \\geq 2)'}
        </MathBlock>
        <p>
          MA モデルは、θ がどんな値でも平均・分散・自己共分散が t によらないので、<strong>いつも定常</strong>です。
          また <M>{'|\\rho(1)|'}</M> は最大でも 0.5（θ = ±1 のとき）で、それより大きなラグ1の自己相関は MA(1) では作れません。
        </p>
        <Note title="符号の流儀に注意">
          <p>
            教科書やソフトによって、MA(1) を <M>{'x_t = \\mu + \\varepsilon_t - \\theta\\varepsilon_{t-1}'}</M> とマイナスで書くことがあります（ボックス・ジェンキンスの本など）。
            その場合は <M>{'\\rho(1) = -\\theta/(1 + \\theta^2)'}</M> になります。問題では、<strong>与えられた式の符号</strong>に合わせて計算してください。
          </p>
        </Note>
        <Note title="反転可能性">
          <p>
            θ と <M>{'1/\\theta'}</M> は同じ <M>{'\\rho(1)'}</M> を与えます（例：θ = 0.5 と θ = 2 はどちらも 0.4）。自己相関だけでは区別できないので、
            ふつうは <M>{'|\\theta| < 1'}</M> のほうを選びます。この条件を<strong>反転可能性</strong>（可逆性）といい、MA モデルを「過去の x の無限の AR」に書き直せる条件になっています。
          </p>
        </Note>
        <p>
          q 期前までのショックを引き継ぐ <strong>MA(q)</strong>：<M>{'x_t = \\mu + \\varepsilon_t + \\theta_1\\varepsilon_{t-1} + \\cdots + \\theta_q\\varepsilon_{t-q}'}</M> では、
          q 時点より離れると共有するノイズがなくなるので、<strong>ラグ q より先の自己相関がすべて 0</strong> になります。
        </p>
      </Section>

      <Section title="ARMA と、次数の見分け方">
        <p>AR と MA を足し合わせたのが <strong>ARMA(p, q)</strong> です。少ない係数で、いろいろな自己相関の形を表せます。</p>
        <MathBlock caption="ARMA(p, q)：過去 p 個の値と、過去 q 個のショックを引き継ぐ">
          {'x_t = c + \\sum_{i=1}^{p}\\phi_i x_{t-i} + \\varepsilon_t + \\sum_{j=1}^{q}\\theta_j\\varepsilon_{t-j}'}
        </MathBlock>
        <p>定常かどうかは AR の部分（φ）だけで決まり、条件は AR(p) と同じです。下の図で、モデルごとの理論上の自己相関と偏自己相関を見比べてください。</p>
        <Figure caption="理論上の自己相関（上）と偏自己相関（下）。見るところは「どちらのグラフが、どのラグでぷっつり 0 になるか（切断）」と「どちらが少しずつ小さくなるか（減衰）」">
          <AcfPacfPatterns />
        </Figure>
        <DataTable
          caption="次数を見分ける目安"
          head={['モデル', '自己相関（ACF）', '偏自己相関（PACF）']}
          rows={[
            ['AR(p)', '減衰する（指数的に、または波打ちながら）', <strong key="a">ラグ p の後で切断</strong>],
            ['MA(q)', <strong key="m">ラグ q の後で切断</strong>, '減衰する'],
            ['ARMA(p, q)', '減衰する', '減衰する'],
          ]}
        />
        <Intuition title="なぜ AR は偏自己相関で、MA は自己相関で切れるのか">
          <p>
            AR(p) の式には p 期前までの値しか出てこないので、間の p 個の値の影響を取り除くと、それより遠い値との直接のつながりは残りません（偏自己相関が切断）。
            MA(q) は q 期前までのショックしか共有しないので、q より離れた2つの値はまったく相関しません（自己相関が切断）。
          </p>
        </Intuition>
        <p>
          実際のデータでは標本の値がぶれるので、「<M>{'\\pm 2/\\sqrt{n}'}</M> の内側に入ったら 0 とみなす」と読みます。候補がいくつか残ったら、
          <strong>AIC</strong>（赤池情報量規準：当てはまりの悪さ（−2 × 最大対数尤度）に、パラメータの数のぶんの罰（2 × パラメータの数）を足した指標。小さいほどよい）を比べたり、
          当てはめた後の<strong>残差がホワイトノイズになっているか</strong>（残差の自己相関が残っていないか）を確かめたりして決めます。
        </p>
      </Section>

      <Section title="ARIMA：階差をとってから ARMA">
        <p>
          トレンドやランダムウォークのような非定常な系列には、ARMA をそのまま当てはめられません。<Link to="/lessons/pre1-timeseries-stationarity">前のレッスン</Link>のとおり、まず階差をとって定常にします。
          d 回階差をとった系列が ARMA(p, q) にしたがうとき、元の系列は <strong>ARIMA(p, d, q)</strong>（自己回帰和分移動平均モデル）にしたがうといいます。I は Integrated（和分：階差の逆、足し上げ）の頭文字です。
        </p>
        <TextTable
          head={['モデル', '意味']}
          rows={[
            ['ARIMA(0, 1, 0)', <>1階の階差がホワイトノイズ → <M key="rw">{'x_t = x_{t-1} + \\varepsilon_t'}</M>（ランダムウォーク）</>],
            ['ARIMA(1, 1, 0)', <>1階の階差 <M key="d">{'\\Delta x_t'}</M> が AR(1)：<M key="d2">{'\\Delta x_t = \\phi\\Delta x_{t-1} + \\varepsilon_t'}</M></>],
            ['ARIMA(0, 1, 1)', '1階の階差が MA(1)'],
            ['ARIMA(p, 0, q)', 'ARMA(p, q) と同じ（階差をとらない）'],
          ]}
        />
        <MathNote title="ラグ作用素で書くと（読み飛ばしてよい）">
          <p>
            1期ずらす記号 <M>{'Bx_t = x_{t-1}'}</M>（ラグ作用素、後退作用素）を使うと、階差は <M>{'\\Delta x_t = (1 - B)x_t'}</M>。ARIMA(p, d, q) はまとめて
            <M>{'\\phi(B)(1 - B)^d x_t = \\theta(B)\\varepsilon_t'}</M> と書けます。ここで <M>{'\\phi(B) = 1 - \\phi_1 B - \\cdots - \\phi_p B^p'}</M>、
            <M>{'\\theta(B) = 1 + \\theta_1 B + \\cdots + \\theta_q B^q'}</M>。<M>{'(1 - B)^d'}</M> の部分が単位根を d 個持つ、という見方もできます。
          </p>
        </MathNote>
        <p>季節変動のある系列には、季節階差 <M>{'x_t - x_{t-12}'}</M> や季節の AR・MA 項を加えた<strong>季節 ARIMA（SARIMA）</strong>が使われます。</p>
      </Section>

      <Section title="予測：先へ行くほど平均に戻り、幅が広がる">
        <p>
          AR(1) で、最後に観測した値 <M>{'x_n'}</M> から先を予測します。将来のノイズは平均 0 なので、予測では 0 とおきます。
        </p>
        <MathBlock caption="AR(1) の h 期先の予測：平均からのずれが、毎期 φ 倍ずつ縮む">{'\\hat{x}_{n+h} = \\mu + \\phi^h(x_n - \\mu)'}</MathBlock>
        <MathBlock caption="h 期先の予測誤差の分散：h を大きくすると、系列そのものの分散 σ²/(1 − φ²) に近づく">
          {'\\sigma^2(1 + \\phi^2 + \\phi^4 + \\cdots + \\phi^{2(h-1)}) = \\sigma^2\\frac{1 - \\phi^{2h}}{1 - \\phi^2}'}
        </MathBlock>
        <Example title="μ = 50、φ = 0.6、σ² = 1、最後の値 x_n = 60">
          <Steps>
            <li>
              1期先：<M>{'50 + 0.6 \\times 10 = 56'}</M>。予測誤差の分散は <M>{'\\sigma^2 = 1'}</M>。
            </li>
            <li>
              2期先：<M>{'50 + 0.6^2 \\times 10 = 53.6'}</M>。予測誤差の分散は <M>{'1 + 0.36 = 1.36'}</M>。
            </li>
            <li>3期先：<M>{'50 + 0.216 \\times 10 = 52.16'}</M>。こうして予測値は平均 50 に近づいていきます。</li>
          </Steps>
          <p>
            1期ずつ計算してもかまいません：<M>{'c = \\mu(1 - \\phi) = 20'}</M> なので、<M>{'\\hat{x}_{n+1} = 20 + 0.6 \\times 60 = 56'}</M>、<M>{'\\hat{x}_{n+2} = 20 + 0.6 \\times 56 = 53.6'}</M>。
          </p>
        </Example>
        <Figure caption="オレンジの線が予測値、点線が 95% 予測区間（σ = 2）。φ を 1 にすると（ランダムウォーク）予測値は最後の値のまま横ばいで、区間は広がり続ける">
          <ForecastFan />
        </Figure>
        <p>
          ランダムウォーク <M>{'x_t = x_{t-1} + \\varepsilon_t'}</M> では、h 期先の予測値は <M>{'x_n'}</M> のまま、予測誤差の分散は <M>{'h\\sigma^2'}</M> で、h とともに限りなく大きくなります。
          非定常な系列の遠い先の予測が難しいことを表しています。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>AR(1) の分散を <M>{'\\sigma^2/(1 - \\phi)'}</M> とする → 正しくは <M>{'\\sigma^2/(1 - \\phi^2)'}</M>（分散の式では φ が2乗で効く）。平均の <M>{'c/(1 - \\phi)'}</M> と混同しやすいので注意。</li>
            <li>AR(1) の平均を c とする → 定数項 c と平均 μ は別物で、<M>{'\\mu = c/(1 - \\phi)'}</M>。</li>
            <li>MA(1) の <M>{'\\rho(1)'}</M> を θ とする → 分母に <M>{'1 + \\theta^2'}</M> が入ります。式の符号（+θ か −θ か）も確認します。</li>
            <li>「AR は自己相関で切断」と逆に覚える → AR は<strong>偏自己相関</strong>が切断、MA は<strong>自己相関</strong>が切断。</li>
            <li>ARIMA(p, d, q) の d を「d 期前の値」と読む → d は<strong>階差をとる回数</strong>です。</li>
            <li>MA モデルにも定常性の条件がある → MA（有限次）はいつも定常。MA で気にするのは反転可能性 <M>{'|\\theta| < 1'}</M>。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <p>
            <strong>確かめられた事実</strong>：準1級の出題範囲表（2027年1月1日版）の「時系列解析」に、ARIMA モデル・自己相関・偏自己相関・定常性が「学習しておくべき用語」として挙がっています。
          </p>
          <p>
            <strong>推測（このサイトの見立て）</strong>：
          </p>
          <ul>
            <li>AR(1) の平均 <M>{'c/(1-\\phi)'}</M>・分散 <M>{'\\sigma^2/(1-\\phi^2)'}</M>・自己相関 <M>{'\\phi^k'}</M>、MA(1) の <M>{'\\rho(1)'}</M> を計算する問題（数値入力の形も考えられる）。</li>
            <li>係数を見て定常かどうかを判定する問題（AR(1) なら <M>{'|\\phi| < 1'}</M>）。</li>
            <li>自己相関・偏自己相関のグラフから、AR か MA か、次数はいくつかを選ぶ問題。</li>
            <li>AR(1) の1期先・2期先の予測値を計算する問題。</li>
            <li>ソフトウェアの出力（推定された係数・AIC）を読んでモデルを選ぶ問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
