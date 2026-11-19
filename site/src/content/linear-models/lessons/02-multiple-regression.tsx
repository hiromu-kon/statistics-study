import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Mark, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { AdjustedR2Plot } from '../figures/AdjustedR2Plot'
import { CollinearityPlot } from '../figures/CollinearityPlot'
import { DummyPlot } from '../figures/DummyPlot'
import { PartialEffectPlot } from '../figures/PartialEffectPlot'

export const meta: LessonMeta = {
  id: 'linear-models-multiple-regression',
  chapter: 'linear-models',
  order: 2,
  title: '重回帰分析',
  summary: '説明変数を2つ以上使う回帰です。係数の意味が「ほかの変数をそろえたときの効果」に変わります。',
  minutes: 40,
  keywords: ['重回帰モデル', '偏回帰係数', '多重共線性', 'ダミー変数', '自由度調整済み決定係数', '変数選択'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>重回帰分析</strong>（じゅうかいきぶんせき）は、y を2つ以上の x で説明する回帰です。それぞれの係数（<strong>偏回帰係数</strong>〈へんかいきけいすう〉）は、
          「<strong>ほかの説明変数を同じ値に固定したとき</strong>、その変数が1増えると y が平均していくつ変わるか」を表します。
        </p>
      </Point>

      <Section title="重回帰モデル">
        <p>
          予測したい y を<strong>目的変数</strong>、説明に使う x を<strong>説明変数</strong>といいます。説明変数が p 個あるとき、モデルは単回帰を素直に広げた形です。
          この章の p は<strong>説明変数の個数</strong>で、p 値の p とは別物です（どちらもよく使う文字なので、文脈で区別します）。
        </p>
        <MathBlock caption="y を p 個の説明変数の足し算で説明する（ε は誤差項）">{'y_i = \\beta_0 + \\beta_1 x_{1i} + \\beta_2 x_{2i} + \\cdots + \\beta_p x_{pi} + \\varepsilon_i'}</MathBlock>
        <p>
          係数の決め方は単回帰と同じ<strong>最小二乗法</strong>（残差の2乗の合計が最小になるように選ぶ）です。手計算はたいへんなので、
          試験では統計ソフトの出力を読む形で出ます。
        </p>
        <Example title="家賃を2つの変数で説明する">
          <p>
            ある地域の賃貸物件20件（架空）について、家賃 y（万円）を、広さ <M>{'x_1'}</M>（m²）と駅からの徒歩 <M>{'x_2'}</M>（分）で説明します。
          </p>
        </Example>
      </Section>

      <Section title="偏回帰係数：ほかの変数をそろえたときの効果">
        <p>まず徒歩だけで単回帰をすると、次のようになりました。</p>
        <Compare>
          <Card title="単回帰（徒歩だけ）">
            <DataTable
              head={['', '推定値', '標準誤差', 't 値', 'p 値']}
              rows={[
                ['切片', '2.987', '0.756', '3.950', '0.0009'],
                ['徒歩', <Mark key="w" color="c2">+0.247</Mark>, '0.054', '4.529', '0.0003'],
              ]}
            />
          </Card>
          <Card title="重回帰（広さ＋徒歩）">
            <DataTable
              head={['', '推定値', '標準誤差', 't 値', 'p 値']}
              rows={[
                ['切片', '0.541', '0.573', '0.945', '0.3580'],
                ['広さ', '0.224', '0.035', '6.346', '0.0000073'],
                ['徒歩', <Mark key="w" color="c1">−0.165</Mark>, '0.072', '−2.298', '0.0345'],
              ]}
            />
          </Card>
        </Compare>
        <p>
          単回帰では「駅から遠いほど家賃が<strong>高い</strong>」（+0.247）という、ふつうの感覚と逆の結果です。ところが広さも入れた重回帰では、
          徒歩の係数は <strong>−0.165</strong> とマイナスになりました。
        </p>
        <Figure caption="広さを固定する値を動かしてみよう。広さが近い物件（青）だけを見ると、どの広さでも右下がりになっている">
          <PartialEffectPlot />
        </Figure>
        <Intuition title="なぜ符号が逆になったの？">
          <p>
            このデータでは、駅から遠い物件ほど広い傾向があります（徒歩と広さの相関係数は 0.90）。単回帰の +0.247 には、
            「遠い → 広い → 高い」という<strong>広さの効果がまぎれ込んで</strong>いました。重回帰の −0.165 は、広さを同じにそろえたうえでの比較なので、
            「同じ広さなら、駅から1分遠くなるごとに家賃は平均 0.165 万円（約1,650円）安い」と読めます。
          </p>
        </Intuition>
        <MathBlock caption="推定された重回帰式（家賃[万円]、広さ x1[m²]、徒歩 x2[分]）">{'\\hat{y} = 0.541 + 0.224\\,x_1 - 0.165\\,x_2'}</MathBlock>
        <p>
          予測は、それぞれの値を代入するだけです。広さ 30 m²・徒歩 10 分なら <M>{'0.541 + 0.224 \\times 30 - 0.165 \\times 10 = 0.541 + 6.72 - 1.65 \\approx 5.61'}</M> 万円。
        </p>
      </Section>

      <Section title="係数の検定と、モデル全体の検定">
        <p>
          それぞれの係数の検定は単回帰と同じく <strong>t = 推定値 ÷ 標準誤差</strong> です。違うのは自由度で、推定するパラメータが
          切片と p 個の係数で <M>p + 1</M> 個あるので、<strong>残差の自由度は n − p − 1</strong> になります。
        </p>
        <MathBlock caption="各係数の t 検定（H0: βj = 0）。自由度 n − p − 1 の t 分布を使う">{'t = \\frac{\\hat\\beta_j}{\\mathrm{SE}(\\hat\\beta_j)}, \\qquad \\text{df} = n - p - 1'}</MathBlock>
        <Example title="徒歩の係数は有意か">
          <Steps>
            <li>
              自由度：<M>{'n - p - 1 = 20 - 2 - 1 = 17'}</M>
            </li>
            <li>
              <M>{'t = -0.165 \\div 0.072 \\approx -2.29'}</M>（出力の −2.298 は、丸める前の推定値と標準誤差で計算した値）
            </li>
            <li>
              <M>{'t_{0.025}(17) = 2.110'}</M>、<M>{'t_{0.005}(17) = 2.898'}</M>。<M>{'2.110 < 2.298 < 2.898'}</M> なので、
              <strong>5% では有意、1% では有意でない</strong>（p 値 0.0345 とも一致）。
            </li>
          </Steps>
        </Example>
        <p>
          「説明変数が全部役に立たない」<M>{'(H_0: \\beta_1 = \\beta_2 = \\cdots = \\beta_p = 0)'}</M> をまとめて調べるのが <strong>F 検定</strong>で、
          R の出力の F-statistic、Excel の分散分析表の「観測された分散比」と「有意 F」がそれです（4つ目のレッスンで扱います）。
          F 検定で有意でも、「少なくとも1つの係数は 0 でない」とわかるだけで、どの係数が有意かは t 検定で1つずつ見ます。
        </p>
      </Section>

      <Section title="多重共線性：説明変数どうしが似すぎていると">
        <p>
          説明変数どうしの相関がとても強い状態を<strong>多重共線性</strong>（マルチコ）といいます。たとえば「身長」と「座高」を同時に入れると、
          どちらの効果なのかデータから区別しにくくなります。
        </p>
        <Figure caption="相関 r を 0.9 以上にしてみよう。説明変数どうしがほぼ一直線に並び、係数の標準誤差が何倍にも膨らむ">
          <CollinearityPlot />
        </Figure>
        <MathBlock caption="説明変数が2つのとき、x1 の係数の分散は相関 r が高いほど大きくなる">{'\\mathrm{Var}(\\hat\\beta_1) = \\frac{\\sigma^2}{\\sum (x_{1i} - \\bar{x}_1)^2} \\times \\frac{1}{1 - r^2}'}</MathBlock>
        <p>
          右の <M>{'1/(1-r^2)'}</M> を <strong>VIF</strong>（Variance Inflation Factor、分散拡大係数）といいます。「係数の分散が何倍にふくらむか」という意味です。
          家賃の例では徒歩と広さの相関が 0.90 なので、<M>{'1 \\div (1 - 0.90^2) = 1 \\div 0.19 \\approx 5.3'}</M>（丸める前の相関 0.905 で計算すると約 5.5）。
          説明変数が3つ以上のときは、<M>{'x_j'}</M> をほかの説明変数で回帰したときの決定係数 <M>{'R_j^2'}</M> を使って <M>{'\\mathrm{VIF}_j = 1/(1 - R_j^2)'}</M> と定義します。
          VIF が 10 を超えると多重共線性を疑う、という目安がよく紹介されます（5 を目安にする本もあります）。
        </p>
        <p>多重共線性があるときに起こりやすいこと：</p>
        <ul>
          <li>係数の標準誤差が大きくなり、t 値が小さくなる（R² は高いのに、どの係数も有意にならない）</li>
          <li>データを少し入れ替えるだけで係数が大きく変わったり、符号が逆になったりする</li>
        </ul>
        <p>対策は、似た変数の片方を外す、2つを合わせた1つの指標にする、などです。</p>
      </Section>

      <Section title="ダミー変数：「駅前か郊外か」を回帰に入れる">
        <p>
          「駅前店か郊外店か」のような数でない情報は、<strong>0 と 1 の変数</strong>にすると回帰に入れられます。これを<strong>ダミー変数</strong>といいます。
          16店舗（架空）の売上 y（万円）を、売り場面積 x（m²）と、駅前店なら D = 1・郊外店なら D = 0 とするダミー変数で説明します。
        </p>
        <MathBlock caption="D = 0（郊外）なら β0 + β1x、D = 1（駅前）なら (β0 + β2) + β1x">{'y = \\beta_0 + \\beta_1 x + \\beta_2 D + \\varepsilon'}</MathBlock>
        <Figure caption="ボタンで切り替えて比べよう。ダミー変数を入れると、傾きが同じで高さが β2 だけ違う平行な2本の直線になる">
          <DummyPlot />
        </Figure>
        <DataTable
          caption="ダミー変数ありの重回帰の出力（n = 16）"
          head={['', '推定値', '標準誤差', 't 値', 'p 値']}
          rows={[
            ['切片', '4.549', '4.642', '0.980', '0.3450'],
            ['面積', '0.407', '0.059', '6.936', '0.000010'],
            ['駅前 D', <Mark key="d" color="c2">17.437</Mark>, '2.486', '7.015', '0.0000091'],
          ]}
        />
        <p>
          D の係数 17.437 は「<strong>同じ面積なら</strong>、駅前店は郊外店より売上が平均して約17.4万円多い」という意味です。
          ダミー変数を入れないと、面積の傾きは 0.158（p 値 0.13 で有意でない）で、面積の効果まで見えなくなっていました。
        </p>
        <MathNote title="3つ以上のグループはどうする？">
          <p>
            「北・中・南」の3地域なら、「中なら1」「南なら1」の<strong>2つ</strong>のダミー変数を作ります（両方 0 のときが北＝基準）。
            3つ全部作ると、3つの合計がいつも 1 になって切片と区別できなくなる（完全な多重共線性）ので、<strong>グループ数 − 1 個</strong>にします。
          </p>
        </MathNote>
      </Section>

      <Section title="自由度調整済み決定係数">
        <p>
          決定係数 <M>{'R^2'}</M> は「y のばらつきのうち、回帰で説明できた割合」でした。ところが <M>{'R^2'}</M> には、
          <strong>説明変数を増やすと、それがでたらめな数でも必ず増える（減らない）</strong>という性質があります。
        </p>
        <Figure caption="本当に効く変数は1つだけ。2つ目からは乱数を足していくと、R² は上がり続けるが、調整済み R² は下がっていく">
          <AdjustedR2Plot />
        </Figure>
        <p>そこで、変数の数 p が増えるとペナルティがかかるように直したのが<strong>自由度調整済み決定係数</strong>（修正済み決定係数）です。</p>
        <MathBlock caption="自由度調整済み決定係数（n はデータ数、p は説明変数の数）">{'\\bar{R}^2 = 1 - (1 - R^2)\\,\\frac{n - 1}{n - p - 1}'}</MathBlock>
        <p>
          分子の <M>n − 1</M> と分母の <M>n − p − 1</M> は、それぞれ全体と残差の自由度です。家賃の重回帰では <M>{'R^2 = 0.861'}</M>、n = 20、p = 2 なので、
          <M>{'1 - R^2 = 0.139'}</M>、<M>{'19 \\div 17 \\approx 1.118'}</M>、<M>{'1 - 0.139 \\times 1.118 \\approx 1 - 0.155 = 0.845'}</M> になります。
          Excel の出力では「<strong>補正 R2</strong>」、R では「Adjusted R-squared」という名前で出てきます（<Link to="/lessons/bivariate-r-squared-residual">決定係数の復習</Link>）。
        </p>
        <Intuition title="変数選択の目安に使う">
          <p>
            どの説明変数を使うか選ぶこと（<strong>変数選択</strong>）では、<M>{'R^2'}</M> ではなく調整済み <M>{'R^2'}</M> の大きいモデルを選ぶ、というのが基本の考え方です。
            ほかにも AIC などの基準があります。調整済み <M>{'R^2'}</M> は常に <M>{'R^2'}</M> 以下で、マイナスになることもあります。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              偏回帰係数を単回帰の傾きと同じように読む → 重回帰の係数は「<strong>ほかの変数を固定したとき</strong>」の効果。単回帰と符号が変わることもあります。
            </li>
            <li>係数の大きさで「どの変数が大事か」を比べる → 単位が違う（m² と分）ので、そのままでは比べられません。</li>
            <li>R² が上がったから良いモデル → 変数を増やせば R² は必ず上がる。調整済み R² で比べます。</li>
            <li>
              残差の自由度を n − 2 のままにする → 重回帰では <strong>n − p − 1</strong>。
            </li>
            <li>
              多重共線性 ＝ 目的変数 y と説明変数の相関が強いこと → 違います。<strong>説明変数どうし</strong>の相関が強いことです。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>重回帰の出力表を見て、係数の意味・有意かどうか・予測値を答える問題。</li>
            <li>単回帰と重回帰で係数の符号が変わった理由を選ぶ問題（説明変数どうしの相関）。</li>
            <li>R² から自由度調整済み R² を計算する問題、どのモデルを選ぶべきかを答える問題。</li>
            <li>ダミー変数の係数の解釈（グループ間の平均の差）を問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
