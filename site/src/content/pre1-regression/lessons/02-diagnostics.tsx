import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { InfluencePlot, LeverageBars } from '../figures/InfluencePlot'
import { QQPlot } from '../figures/QQPlot'
import { ResidualPatterns } from '../figures/ResidualPatterns'

export const meta: LessonMeta = {
  id: 'pre1-regression-diagnostics',
  chapter: 'pre1-regression',
  order: 2,
  title: '回帰診断',
  summary: '当てはめた回帰を信じてよいかを、残差プロット・正規 Q-Q プロット・てこ比・Cook の距離で確かめます。',
  minutes: 45,
  keywords: ['残差分析', '外れ値', '残差プロット', '正規Q-Qプロット', 'leverage（てこ比）', 'Cookの距離'],
}

// 図と例の数値（てこ比・標準化残差・Cook の距離）は figures/influence.ts と同じ計算を numpy で行って確かめた値。

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          回帰の出力は、「直線の形でよい」「誤差は等分散で正規分布」といった<strong>仮定が正しければ</strong>信じられる数字です。
          当てはめたあとに<strong>残差</strong>を調べて、仮定が崩れていないか、結果を1点だけで動かしている点がないかを確かめる作業を<strong>回帰診断</strong>（残差分析）といいます。
          道具は4つ：<strong>残差プロット</strong>（形と分散）、<strong>正規 Q-Q プロット</strong>（正規性）、<strong>てこ比</strong>（x が端にある点）、<strong>Cook の距離</strong>（1点の影響の大きさ）です。
        </p>
      </Point>

      <Section title="復習：残差と残差プロット">
        <p>
          残差は「実際の値 − 回帰式の値」<M>{'e_i = y_i - \\hat{y}_i'}</M> でした。2級では、残差を横軸に並べて形を見ることを学びました
          （<Link to="/lessons/bivariate-r-squared-residual">「決定係数と残差」</Link>）。重回帰では横軸を x の代わりに<strong>予測値 <M>{'\\hat{y}'}</M></strong> にすると、
          説明変数が何個あっても1枚の図で見られます。行列の書き方は前のレッスン<Link to="/lessons/pre1-regression-multiple">「重回帰の理論と変数選択・正則化」</Link>を参照してください。
        </p>
      </Section>

      <Section title="残差プロットのパターン">
        <p>仮定が正しければ、残差は 0 の線のまわりに<strong>同じ幅で、形をもたずに</strong>散らばるはずです。よく見る崩れ方は2つです。</p>
        <Figure caption="ボタンで切り替えて比べよう。左の散布図では気づきにくい曲がりや広がりが、右の残差プロットでははっきり見える">
          <ResidualPatterns />
        </Figure>
        <DataTable
          head={['残差プロットの形', '疑われること', '対策の例']}
          rows={[
            ['0 のまわりに一様に散らばる', '特に問題なし', '—'],
            ['U 字・逆 U 字に曲がる', '直線（線形）の関係ではない', 'x² の項を足す、対数をとる'],
            ['右に行くほど広がる（扇形・ラッパ形）', '誤差の分散が一定でない（不均一分散）', 'y の対数をとる、重みつき最小二乗法'],
            ['時間順に並べると波打つ', '誤差どうしに相関がある', '時系列のモデル、一般化最小二乗法'],
          ]}
        />
        <p>
          不均一分散や誤差の相関への対処（重みつき最小二乗法・一般化最小二乗法）は、前のレッスンで扱いました。
        </p>
      </Section>

      <Section title="標準化残差：残差を「標準偏差何個分か」にそろえる">
        <p>
          残差の大きさは y の単位に左右されるので、標準偏差で割ってそろえます。ただし残差の分散は点ごとに少し違い、<M>{'\\mathrm{Var}(e_i) = \\sigma^2(1 - h_{ii})'}</M> です
          （<M>{'h_{ii}'}</M> はこのあと出てくるてこ比）。そこで次のように割ります。
        </p>
        <MathBlock caption="標準化残差（内部スチューデント化残差）。|ri| が 2〜3 を超えると外れ値の候補">{'r_i = \\frac{e_i}{s\\sqrt{1 - h_{ii}}}'}</MathBlock>
        <p>
          ここで <M>s</M> は残差の標準誤差（<M>{'s^2 = \\sum e_i^2 / (n - p - 1)'}</M>）。正規分布なら ±2 の外に出るのはおよそ 5% なので、|r| が 2 を超える点は「少し珍しい」、
          3 を超える点は「かなり珍しい」と考えます。<M>s</M> をその点を除いて計算したものを<strong>外部スチューデント化残差</strong>といい、ソフトによってはこちらを使います。
        </p>
        <p>
          y の値が回帰の傾向から大きく外れた点を<strong>外れ値</strong>といいます。外れ値は、入力の間違いのこともあれば、モデルが見落としている大事な情報のこともあります。
        </p>
      </Section>

      <Section title="正規 Q-Q プロット：残差は正規分布か">
        <p>
          係数の t 検定や信頼区間は、誤差が正規分布にしたがうことを前提にしています。それを目で確かめるのが<strong>正規 Q-Q プロット</strong>です。
        </p>
        <Steps>
          <li>標準化した残差を小さい順に並べる（n 個）</li>
          <li>
            「正規分布から n 個とったら、小さいほうから i 番目はだいたいこのくらい」という値 <M>{'\\Phi^{-1}\\left(\\frac{i - 0.5}{n}\\right)'}</M> を計算する
            （<M>{'\\Phi^{-1}'}</M> は標準正規分布の下側確率から値に戻す関数）
          </li>
          <li>横軸に「正規分布なら来るはずの値」、縦軸に「実際の値」をとって点を打つ</li>
        </Steps>
        <p>
          正規分布なら点は<strong>ほぼ一直線</strong>に並びます。（i − 0.5）/n の部分はソフトによって少し違う式を使いますが、見方は同じです。
        </p>
        <Figure caption="形を切り替えて比べよう。裾が重いと両端が直線から外れて S 字を寝かせた形に、右に裾が長いと全体が下に凸の弓なりになる">
          <QQPlot />
        </Figure>
        <DataTable
          head={['Q-Q プロットの形', '分布の特徴']}
          rows={[
            ['ほぼ一直線', '正規分布に近い'],
            ['左端が直線より下、右端が直線より上', '両側の裾が重い（極端な値が正規分布より出やすい）'],
            ['左端が直線より上、右端が直線より下', '両側の裾が軽い'],
            ['下に凸の弓なり（両端が上に反る）', '右に裾が長い（右に歪んでいる）'],
            ['上に凸の弓なり', '左に裾が長い'],
          ]}
        />
        <Intuition title="なぜ裾が重いと両端が外れるのか">
          <p>
            裾が重い分布では、いちばん小さい値は正規分布で予想されるよりも<strong>もっと小さく</strong>、いちばん大きい値は<strong>もっと大きく</strong>出ます。
            だから左端の点は直線より下に、右端の点は直線より上に外れます。
          </p>
        </Intuition>
      </Section>

      <Section title="てこ比：x が端にある点は直線を引っぱる力が強い">
        <p>
          重回帰の予測値は、<M>{'\\hat{\\boldsymbol y} = X\\hat{\\boldsymbol\\beta} = X(X^\\top X)^{-1}X^\\top \\boldsymbol y'}</M> と書けます。y に掛かっている行列を
          <strong>ハット行列</strong>（y に帽子をかぶせる行列）といいます。
        </p>
        <MathBlock caption="ハット行列。予測値は観測値に H を掛けたもの">{'H = X(X^\\top X)^{-1}X^\\top, \\qquad \\hat{\\boldsymbol y} = H\\boldsymbol y'}</MathBlock>
        <p>
          H の対角成分 <M>{'h_{ii}'}</M> が<strong>てこ比</strong>（leverage）です。「<M>{'y_i'}</M> を1だけ動かすと、自分の予測値 <M>{'\\hat{y}_i'}</M> が <M>{'h_{ii}'}</M> だけ動く」という意味で、
          0 から 1 の値をとります。1に近い点は、直線を自分のほうへ強く引き寄せられます。
        </p>
        <MathBlock caption="単回帰のてこ比。x が平均から離れているほど大きい">{'h_{ii} = \\frac{1}{n} + \\frac{(x_i - \\bar{x})^2}{\\sum_{j=1}^{n} (x_j - \\bar{x})^2}'}</MathBlock>
        <MathBlock caption="てこ比の合計はパラメータの数（切片を含む）、平均は (p+1)/n">{'\\sum_{i=1}^{n} h_{ii} = p + 1'}</MathBlock>
        <p>
          てこ比は <strong>x だけで決まり、y には関係しません</strong>。平均の2倍（<M>{'2(p+1)/n'}</M>）や3倍を超える点を「てこ比が大きい」とする目安がよく使われます。
        </p>
        <Example title="x = 1, 2, …, 9 と、ひとつだけ離れた x = 15 の10点">
          <Steps>
            <li>
              <M>{'\\bar{x} = (45 + 15) / 10 = 6'}</M>
            </li>
            <li>
              <M>{'\\sum (x_j - 6)^2 = (25 + 16 + 9 + 4 + 1 + 0 + 1 + 4 + 9) + 81 = 69 + 81 = 150'}</M>
            </li>
            <li>
              x = 15 の点：<M>{'h = \\frac{1}{10} + \\frac{(15 - 6)^2}{150} = 0.1 + 0.54 = 0.64'}</M>
            </li>
            <li>
              平均は <M>{'2/10 = 0.2'}</M>（単回帰なので p + 1 = 2）。0.64 は平均の3倍以上です。
            </li>
          </Steps>
        </Example>
        <Figure caption="10点のてこ比。x = 6（平均）の点がいちばん小さく、離れた x = 15 の点だけが飛び抜けて大きい">
          <LeverageBars />
        </Figure>
      </Section>

      <Section title="Cook の距離：その点を除くと、当てはめがどれだけ変わるか">
        <p>
          外れ値（y が外れる）とてこ比（x が外れる）を合わせて、「その1点が結果をどれだけ動かしているか」を測るのが<strong>Cook の距離</strong>です。
          定義は「i 番目の点を除いて当てはめ直したときの、予測値の変化の大きさ」です。
        </p>
        <MathBlock caption="定義：i 番目を除いた当てはめの予測値 ŷj(i) と、全部で当てはめた予測値 ŷj のずれ">{'D_i = \\frac{\\sum_{j=1}^{n} (\\hat{y}_j - \\hat{y}_{j(i)})^2}{(p + 1)\\, s^2}'}</MathBlock>
        <MathBlock caption="同じものを、残差とてこ比で書いた形（当てはめ直さなくても計算できる）">{'D_i = \\frac{e_i^2}{(p + 1)\\, s^2} \\cdot \\frac{h_{ii}}{(1 - h_{ii})^2} = \\frac{r_i^2}{p + 1} \\cdot \\frac{h_{ii}}{1 - h_{ii}}'}</MathBlock>
        <p>
          「残差が大きい」と「てこ比が大きい」の<strong>掛け算</strong>になっているのがポイントです。どちらか一方だけでは大きくなりにくく、両方そろうと大きくなります。
          <M>{'D_i > 1'}</M>（本によっては 0.5、あるいは <M>{'4/n'}</M>）を目安に「影響の大きい点」として調べます。
        </p>
        <Figure caption="赤い点を上下に動かしてみよう。端（x = 15）にあると、少し外れるだけで直線が大きく傾き、Cook の距離が 1 を大きく超える。真ん中（x = 5）にあると、大きく外れても傾きは変わらない">
          <InfluencePlot />
        </Figure>
        <Compare>
          <Card title="端の点が外れる（x = 15, y = 4）">
            <ul>
              <li>てこ比 0.64、標準化残差 −2.70</li>
              <li>Cook の距離 6.49（目安 1 を大きく超える）</li>
              <li>傾きは 0.487（除いたとき）→ 0.164 に</li>
            </ul>
          </Card>
          <Card title="真ん中の点が外れる（x = 5, y = 8）">
            <ul>
              <li>てこ比 0.10、標準化残差 2.71</li>
              <li>Cook の距離 0.41</li>
              <li>傾きは 0.487 のまま（切片だけ少し上がる）</li>
            </ul>
          </Card>
        </Compare>
        <MathNote title="2つめの式の確かめ（端の点が外れる場合）">
          <p>
            残差 <M>{'e = -1.936'}</M>、<M>{'s^2 = 1.426'}</M>、<M>{'h = 0.64'}</M>、パラメータは切片と傾きの2個なので、
          </p>
          <MathBlock caption="残差の部分 × てこ比の部分">{'D = \\frac{1.936^2}{2 \\times 1.426} \\times \\frac{0.64}{(1 - 0.64)^2} = 1.314 \\times 4.938 \\approx 6.49'}</MathBlock>
        </MathNote>
      </Section>

      <Section title="診断の手順">
        <Steps>
          <li>残差プロット（横軸は予測値）を見る：曲がり → モデルの形を見直す。扇形 → 変換や重みつき最小二乗法。</li>
          <li>正規 Q-Q プロットを見る：両端の外れや弓なり → 変換を考える。データが多ければ、多少の崩れは検定への影響が小さい。</li>
          <li>標準化残差が ±2〜3 を超える点（外れ値の候補）を探す。</li>
          <li>てこ比と Cook の距離で、結果を大きく動かしている点を探す。</li>
          <li>見つけた点は、まず記録の間違いがないか調べる。正しいデータなら勝手に消さず、「その点あり・なし」の両方の結果を報告する。</li>
        </Steps>
        <Note title="R の plot(lm(...)) で出る4枚の図">
          <p>
            R で回帰の結果に <code>plot()</code> を使うと、既定で次の4枚が出ます：① Residuals vs Fitted（残差プロット）、② Normal Q-Q（正規 Q-Q プロット。新しい版の R では見出しが Q-Q Residuals）、
            ③ Scale-Location（標準化残差の絶対値のルートと予測値。分散が一定かを見る）、④ Residuals vs Leverage（横軸がてこ比、縦軸が標準化残差。Cook の距離 0.5 と 1 の等高線つき）。
          </p>
        </Note>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>「てこ比が大きい点は悪い点」→ てこ比は x の位置だけで決まる。直線の上にのっていれば、むしろ傾きの推定を安定させる良い点。</li>
            <li>「残差が大きい点ほど結果への影響が大きい」→ 真ん中の x の点は、大きく外れても傾きをほとんど動かさない。影響は Cook の距離で見る。</li>
            <li>「影響の大きい点・外れ値は削除する」→ まず原因を調べる。理由なく消すと、都合のよい結果を作ることになる。</li>
            <li>「正規 Q-Q プロットは y（や x）の分布を見る」→ 回帰で確かめたいのは<strong>誤差（残差）</strong>の分布。y そのものが正規分布である必要はない。</li>
            <li>「影響の大きい点は残差がとても大きいはず」→ 端の点は直線を自分に引き寄せるので、残差が意外と小さく出ることがある。だから残差だけでなくてこ比も見る。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              確かめられた事実：2027年1月1日からの準1級の出題範囲表では、「回帰分析」の用語に、外れ値、残差プロット、正規 Q-Q プロット、leverage（てこ比）、Cook の距離が挙がっています。
            </li>
            <li>推測：残差プロットや Q-Q プロットの図を見て「どの仮定が崩れているか」を選ぶ形が考えられます。図の典型的な形（曲がり・扇形・S 字・弓なり）を覚えておきましょう。</li>
            <li>
              てこ比（単回帰の <M>{'1/n + (x_i - \\bar{x})^2/S_{xx}'}</M>、合計が p + 1）や Cook の距離を、与えられた残差・てこ比から計算する問題にも備えておくとよいでしょう。
            </li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
