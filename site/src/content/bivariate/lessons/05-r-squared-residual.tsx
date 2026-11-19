import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { funnelData, goodLinearData, growthData, iceData } from '../figures/data'
import { LogTransformPlot, ResidualPlot } from '../figures/ResidualPlot'
import { VariationPlot } from '../figures/VariationPlot'

export const meta: LessonMeta = {
  id: 'bivariate-r-squared-residual',
  chapter: 'bivariate',
  order: 5,
  title: '決定係数・残差プロット・変数変換',
  summary: '回帰直線がどれくらい当てはまっているかを、決定係数と残差プロットで確かめ、曲線の関係は変数変換で直線に直します。',
  minutes: 35,
  keywords: ['変動の分解', '決定係数', '分散分析表（回帰）', '残差プロット', '標準誤差', '変数変換'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          y のばらつき（<strong>全変動</strong>）は、回帰直線で説明できる分（<strong>回帰変動</strong>）と、説明できない残り（<strong>残差変動</strong>）に分けられます。
          説明できた割合が<strong>決定係数 R²</strong> です。数だけでなく<strong>残差プロット</strong>で残差の並び方も確かめ、曲線の関係なら対数などで<strong>変数変換</strong>します。
        </p>
      </Point>

      <Section title="変動の分解：ずれを2つに分ける">
        <p>
          前のレッスンのアイスのデータ（回帰直線 <M>{'\\hat{y} = -30 + 5x'}</M>）を使います。
          各日の売上が平均 100 個からどれだけずれているかを、「直線で説明できる分」と「残差」の2つに分けてみます。
        </p>
        <MathBlock caption="平均からのずれ ＝ 直線で説明できるずれ ＋ 残差">{'y_i - \\bar{y} = (\\hat{y}_i - \\bar{y}) + (y_i - \\hat{y}_i)'}</MathBlock>
        <p>たとえば 30℃ の日は、122 − 100 = 22 個のずれのうち、直線で 120 − 100 = 20 個が説明でき、残りの 2 個が残差です。</p>
        <p>それぞれを2乗して全部の日で足すと、ふしぎなことに足し算がそのまま成り立ちます（最小二乗法で直線を決めたときに成り立つ性質です）。</p>
        <MathBlock caption="全変動 ＝ 回帰変動 ＋ 残差変動">
          {'\\sum (y_i - \\bar{y})^2 = \\sum (\\hat{y}_i - \\bar{y})^2 + \\sum (y_i - \\hat{y}_i)^2'}
        </MathBlock>
        <DataTable
          head={['x', 'y', 'ŷ', '(y − ȳ)²', '(ŷ − ȳ)²', '(y − ŷ)²']}
          rows={[
            ['22', '82', '80', '324', '400', '4'],
            ['24', '86', '90', '196', '100', '16'],
            ['26', '104', '100', '16', '0', '16'],
            ['28', '106', '110', '36', '100', '16'],
            ['30', '122', '120', '484', '400', '4'],
            [<strong key="t">合計</strong>, '', '', <strong key="a">1056</strong>, <strong key="b">1000</strong>, <strong key="c">56</strong>],
          ]}
          caption="アイスのデータの変動の分解：1056 = 1000 + 56"
        />
        <Figure caption="青は直線で説明できるずれ、赤は残差。スライダーで残差だけを大きくすると、回帰変動は変わらず残差変動だけが増え、決定係数が下がる">
          <VariationPlot xs={iceData.xs} ys={iceData.ys} xLabel="最高気温（℃）" yLabel="売上（個）" />
        </Figure>
      </Section>

      <Section title="決定係数 R²：説明できた割合">
        <MathBlock caption="決定係数：全変動のうち、回帰直線で説明できた割合">{'R^2 = \\frac{\\sum (\\hat{y}_i - \\bar{y})^2}{\\sum (y_i - \\bar{y})^2} = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}'}</MathBlock>
        <p>
          アイスの例では <M>{'R^2 = 1000 \\div 1056 \\approx 0.947'}</M>。「売上のばらつきの約95%は気温で説明できる」と読みます。R² は 0 から 1 の値で、1 に近いほど直線がよく当てはまっています。
        </p>
        <Intuition title="単回帰では R² = r²">
          <p>
            説明変数が1つの回帰（<strong>単回帰</strong>）では、決定係数は相関係数の2乗と一致します。アイスの例では <M>{'r \\approx 0.973'}</M>、<M>{'r^2 \\approx 0.947'}</M> です。
            r = −0.9 でも R² = 0.81 で、右下がりの関係も同じように「よく当てはまる」と評価されます。
          </p>
        </Intuition>
      </Section>

      <Section title="分散分析表（回帰）">
        <p>
          変動の分解は、<strong>分散分析表</strong>という形でまとめられます。統計ソフトの回帰の出力にもよく出てきます。
        </p>
        <DataTable
          head={['要因', '平方和', '自由度', '平均平方（平方和 ÷ 自由度）', 'F 値']}
          rows={[
            ['回帰', '1000', '1', '1000', '1000 ÷ 18.67 ≈ 53.6'],
            ['残差', '56', 'n − 2 = 3', '56 ÷ 3 ≈ 18.67', ''],
            ['全体', '1056', 'n − 1 = 4', '', ''],
          ]}
          caption="アイスのデータの分散分析表"
        />
        <ul>
          <li>
            <strong>平方和</strong>：上で計算した回帰変動・残差変動・全変動です。
          </li>
          <li>
            <strong>自由度</strong>：回帰は説明変数の数（単回帰なら 1）、残差は n − 2、全体は n − 1。回帰と残差を足すと全体になります。
          </li>
          <li>
            <strong>F 値</strong>：回帰の平均平方 ÷ 残差の平均平方。「この直線に意味があるか」の検定に使います（「線形モデル」の章で扱います）。
          </li>
        </ul>
      </Section>

      <Section title="回帰の標準誤差：予測はだいたい何個ずれるか">
        <p>残差がだいたいどれくらいの大きさかを表すのが<strong>回帰の標準誤差</strong>（残差の標準偏差）です。</p>
        <MathBlock caption="残差の2乗和を n − 2 で割って、ルートをとる">{'s = \\sqrt{\\frac{\\sum (y_i - \\hat{y}_i)^2}{n - 2}}'}</MathBlock>
        <Example title="アイスのデータでは">
          <Steps>
            <li>残差の2乗和 = 56、n = 5 なので n − 2 = 3</li>
            <li>
              <M>{'56 \\div 3 \\approx 18.67'}</M>（分散分析表の「残差の平均平方」と同じ）
            </li>
            <li>
              <M>{'s = \\sqrt{18.67} \\approx 4.32'}</M> 個
            </li>
          </Steps>
          <p>直線による予測は、だいたい ±4 個くらいずれる、という目安になります。</p>
        </Example>
        <Intuition title="なぜ n − 2 で割るの？">
          <p>
            分散で n − 1 で割ったのは、平均という1つの値をデータから決めたからでした。回帰直線では傾き b と切片 a の<strong>2つ</strong>をデータから決めているので、n − 2 で割ります。
          </p>
        </Intuition>
      </Section>

      <Section title="残差プロット：残差に模様がないかを見る">
        <p>
          横軸に x（または予測値）、縦軸に残差をとった図が<strong>残差プロット</strong>です。直線がうまく当てはまっていれば、残差は 0 のまわりに<strong>模様なくばらばら</strong>に散らばります。
        </p>
        <Compare>
          <Card title="① 模様がない（よい）">
            <ResidualPlot xs={goodLinearData.xs} ys={goodLinearData.ys} width={360} />
            <p className="small">残差は 0 の上下にばらばら。直線で十分。</p>
          </Card>
          <Card title="② U字の模様（曲線の関係）">
            <ResidualPlot xs={growthData.xs} ys={growthData.ys} width={360} />
            <p className="small">両端がプラス、中央がマイナス。本当は曲線の関係なので、変数変換などを考える。</p>
          </Card>
          <Card title="③ ラッパ形（散らばりが変わる）">
            <ResidualPlot xs={funnelData.xs} ys={funnelData.ys} width={360} />
            <p className="small">x が大きいほど残差の幅が広がる。予測のずれの大きさが x によって違う。</p>
          </Card>
        </Compare>
        <p>
          ② のデータの R² は約 0.82 と高めですが、残差プロットを見ると直線では表しきれていないことがわかります。<strong>R² が高いだけで安心しない</strong>ことが大切です。
        </p>
      </Section>

      <Section title="変数変換：曲線の関係を直線にする">
        <p>
          ② のデータは、あるサービスの会員数を毎月記録したものです（架空のデータ）。毎月だいたい同じ<strong>倍率</strong>で増えているので、カーブを描いて急に増えていきます。
          このように「かけ算で増える」データは、y の<strong>対数</strong>をとると直線に近づきます。
        </p>
        <Figure caption="ボタンで縦軸を log₁₀（会員数）に切りかえると、点がほぼ一直線に並び、残差プロットの U 字の模様も消える">
          <LogTransformPlot />
        </Figure>
        <Example title="対数をとった回帰直線の読み方">
          <p>
            対数をとったデータに回帰直線を当てはめると、およそ <M>{'\\log_{10} \\hat{y} = 2.336 + 0.127x'}</M> になります。
          </p>
          <ul>
            <li>
              x が1増えると <M>{'\\log_{10}\\hat{y}'}</M> が 0.127 増える → <M>{'\\hat{y}'}</M> は <M>{'10^{0.127} \\approx 1.34'}</M> 倍になる。つまり「1か月で約1.34倍」に増えている。
            </li>
            <li>
              x = 0 のとき <M>{'\\log_{10}\\hat{y} = 2.336'}</M> → <M>{'\\hat{y} = 10^{2.336} \\approx 217'}</M> 人。
            </li>
          </ul>
        </Example>
        <Intuition title="なぜ対数で直線になるの？">
          <p>
            対数には「かけ算を足し算に変える」性質があります（<M>{'\\log_{10}(A \\times B) = \\log_{10}A + \\log_{10}B'}</M>）。
            毎月 1.34 倍になる量は、対数の世界では毎月 <M>{'\\log_{10}1.34 \\approx 0.127'}</M> ずつ<strong>足される</strong>量になるので、直線で表せます。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>R² が高いから直線のモデルで正しい → 残差プロットに模様があれば、曲線の関係を見落としているかもしれません。</li>
            <li>R² = r² はいつでも成り立つ → 説明変数が1つの単回帰での話です。</li>
            <li>r = −0.9 なら R² = −0.81 → 2乗なので R² はマイナスになりません（0.81）。</li>
            <li>回帰の標準誤差を n や n − 1 で割る → 単回帰では <strong>n − 2</strong> で割ります。</li>
            <li>
              対数変換した式の傾き 0.127 を「1か月で 0.127 人増える」と読む → 対数の傾きは<strong>倍率</strong>（<M>{'10^{0.127}'}</M> 倍）で読みます。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>全変動・残差変動（または回帰変動）から決定係数を計算する問題。相関係数から R² を求める問題。</li>
            <li>分散分析表（回帰）の空欄（自由度・平均平方・F 値）を埋める問題。</li>
            <li>残差プロットを見て、モデルの問題点（曲線の関係・散らばりの変化）を指摘する選択肢を選ぶ問題。</li>
            <li>対数変換したデータの回帰式から、「x が1増えると y は何倍になるか」を読み取る問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
