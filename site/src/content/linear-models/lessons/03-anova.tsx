import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Mark, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { AnovaPlot } from '../figures/AnovaPlot'
import { MultipleComparisonPlot } from '../figures/MultipleComparisonPlot'

export const meta: LessonMeta = {
  id: 'linear-models-anova',
  chapter: 'linear-models',
  order: 3,
  title: '実験計画と一元配置分散分析',
  summary: '3つ以上のグループの平均に差があるかを、「グループ間のばらつき」と「グループ内のばらつき」の比で判定します。',
  minutes: 40,
  keywords: ['実験', '処理群と対照群', '反復', 'ブロック化', '一元配置実験', '分散分析', '群間変動', '群内変動', 'F比', '分散分析表'],
}

const A = [15, 19, 17, 13, 21]
const B = [20, 24, 18, 22, 16]
const C = [23, 19, 27, 21, 25]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>分散分析</strong>は、3つ以上のグループの平均に差があるかを調べる方法です。「グループの平均どうしの散らばり（群間）」が
          「グループの中のふつうの散らばり（群内）」に比べて十分大きければ、「どこかのグループの平均が違う」と判断します。その比が <strong>F 比</strong>です。
        </p>
      </Point>

      <Section title="実験の基本（復習）">
        <p>
          薬や肥料などの効果を調べるには、効果を調べたい処理をする<strong>処理群</strong>と、処理をしない（または従来の方法の）<strong>対照群</strong>をつくって比べます。
          実験を正しく計画するための考え方として、<strong>フィッシャーの3原則</strong>があります（くわしくは
          <Link to="/chapters/collection">「時系列とデータの集め方」の章</Link>）。
        </p>
        <DataTable
          head={['原則', '何をするか', 'ねらい']}
          rows={[
            ['反復', '同じ処理を複数の個体（鉢・人・畑の区画）に行う', '偶然のばらつき（誤差）の大きさを見積もれるようにする'],
            ['無作為化', 'どの個体にどの処理をするかをくじで決める', '気づいていない偏りが、特定の処理に集中しないようにする'],
            ['局所管理（ブロック化）', '条件の似た個体をまとめた「ブロック」の中で処理を比べる', '日当たりなどの違いによるばらつきを、比較から取り除く'],
          ]}
        />
        <Example title="ブロック化の例">
          <p>
            畑の日当たりが北・中央・南で違うとき、畑を3つのブロックに分け、各ブロックの中で肥料 A・B・C の位置をくじで決めます。
            こうすると、どの肥料も日当たりの良い場所と悪い場所を同じように使うことになります。
          </p>
          <DataTable
            head={['ブロック', '区画1', '区画2', '区画3']}
            rows={[
              ['北（日当たり 弱）', <Mark key="1" color="c2">B</Mark>, <Mark key="2" color="c1">A</Mark>, <Mark key="3" color="c3">C</Mark>],
              ['中央', <Mark key="1" color="c3">C</Mark>, <Mark key="2" color="c2">B</Mark>, <Mark key="3" color="c1">A</Mark>],
              ['南（日当たり 強）', <Mark key="1" color="c1">A</Mark>, <Mark key="2" color="c3">C</Mark>, <Mark key="3" color="c2">B</Mark>],
            ]}
            caption="各ブロックに A・B・C が1回ずつ（並び順はくじで決める）"
          />
        </Example>
      </Section>

      <Section title="一元配置実験">
        <p>
          調べたい要因（<strong>因子</strong>）が1つだけで、その種類（<strong>水準</strong>）をいくつか用意して比べる実験を<strong>一元配置実験</strong>といいます。
          ここでは「肥料」という1つの因子に A・B・C の3水準があり、それぞれ5鉢ずつ（反復5回）育てて草丈（cm）を測りました（架空のデータ）。
        </p>
        <DataTable
          head={['肥料', '草丈（cm）', '平均']}
          rows={[
            [<Mark key="a" color="c1">A</Mark>, A.join(', '), '17'],
            [<Mark key="b" color="c2">B</Mark>, B.join(', '), '20'],
            [<Mark key="c" color="c3">C</Mark>, C.join(', '), '23'],
          ]}
          caption="全体（15鉢）の平均は 20"
        />
        <p>平均は 17・20・23 とずれていますが、各肥料の中でも 13〜27 とかなりばらついています。この差は肥料のせいでしょうか、たまたまでしょうか。</p>
      </Section>

      <Section title="なぜ t 検定をくり返さないのか">
        <p>
          2群の平均の差なら t 検定でした。A と B、A と C、B と C……と3回 t 検定をすればよさそうですが、それには問題があります。
          有意水準 5% の検定を1回するたびに、本当は差がないのに「差がある」と言ってしまう（<strong>第1種の過誤</strong>）可能性が 5% あります。
          何度もくり返すと、<strong>どこかで1回は間違える確率</strong>がどんどん増えていきます。
        </p>
        <Figure caption="群の数を増やすと、2群ずつの組合せの数が増え、少なくとも1回間違える確率が 5% を大きく超える（検定どうしを独立とみなした近似）">
          <MultipleComparisonPlot />
        </Figure>
        <p>
          3群なら組合せは3通りで、<M>{'1 - 0.95^3 \\approx 0.143'}</M>。全体として 14% も間違えやすくなります。この問題を<strong>多重比較の問題</strong>といいます。
          分散分析は、「すべての群の平均が等しい」を<strong>1回の検定</strong>で調べるので、有意水準を 5% に保てます。
        </p>
      </Section>

      <Section title="分散分析の考え方：ばらつきを2つに分ける">
        <p>データ1つ1つの「全体の平均からのずれ」は、次の2つの足し算に分けられます。</p>
        <MathBlock caption="（データ − 全体の平均）＝（群の平均 − 全体の平均）＋（データ − 群の平均）">{'x_{ij} - \\bar{x} = (\\bar{x}_j - \\bar{x}) + (x_{ij} - \\bar{x}_j)'}</MathBlock>
        <p>
          ここで <M>{'x_{ij}'}</M> は j 番目の群の i 番目のデータ、<M>{'\\bar{x}_j'}</M> は j 番目の群の平均、<M>{'\\bar{x}'}</M> は全体の平均です。
          前半が<strong>群間のずれ</strong>（肥料の違いによるずれ）、後半が<strong>群内のずれ</strong>（同じ肥料の中での個体差）です。
        </p>
        <Figure caption="群の平均や群内のばらつきを動かしてみよう。平均どうしを離すと F が大きくなり、群内のばらつきを大きくすると F が小さくなる">
          <AnovaPlot />
        </Figure>
        <p>それぞれのずれを2乗して全部足したものを<strong>変動</strong>（平方和）といい、全変動はきれいに2つに分かれます。</p>
        <MathBlock caption="全変動 ST ＝ 群間変動 SA ＋ 群内変動 SE">{'\\underbrace{\\sum_{j}\\sum_{i}(x_{ij} - \\bar{x})^2}_{S_T} = \\underbrace{\\sum_{j} n_j(\\bar{x}_j - \\bar{x})^2}_{S_A} + \\underbrace{\\sum_{j}\\sum_{i}(x_{ij} - \\bar{x}_j)^2}_{S_E}'}</MathBlock>
        <p>
          <M>{'n_j'}</M> は j 番目の群のデータ数です。群間変動 <M>{'S_A'}</M> は、群の平均のずれを、その群のデータ数ぶん足すので <M>{'n_j'}</M> 倍になっています。
        </p>
      </Section>

      <Section title="F 比で判定する">
        <p>
          変動はデータが多いほど大きくなるので、そのままでは比べられません。<strong>自由度で割って「平均平方」</strong>（1自由度あたりの変動、分散にあたるもの）にしてから比べます。
          群の数を k、データの総数を N とすると：
        </p>
        <DataTable
          head={['', '自由度', 'なぜその数か']}
          rows={[
            ['群間', <strong key="a">k − 1</strong>, '群の平均 k 個のうち、全体の平均が決まると自由に動けるのは k − 1 個'],
            ['群内', <strong key="e">N − k</strong>, 'データ N 個から、群の平均 k 個を推定したぶんを引く'],
            ['全体', <strong key="t">N − 1</strong>, '群間と群内の合計'],
          ]}
        />
        <MathBlock caption="F 比 ＝ 群間の平均平方 ÷ 群内の平均平方">{'F = \\frac{S_A / (k - 1)}{S_E / (N - k)}'}</MathBlock>
        <p>
          「すべての群の母平均が等しい」（<M>{'H_0: \\mu_1 = \\mu_2 = \\cdots = \\mu_k'}</M>）が正しいとき、F は<strong>自由度 (k − 1, N − k) の F 分布</strong>にしたがいます。
          F が上側 5% 点より大きければ <M>{'H_0'}</M> を棄却します。
        </p>
        <Intuition title="なぜ比をとるの？">
          <p>
            群内の平均平方は「肥料に関係ない、ふつうの個体差」の大きさです。<M>{'H_0'}</M> が正しければ、群の平均どうしのずれもこの個体差くらいしか生まれないので、
            F はだいたい 1 前後になります。F が 1 よりずっと大きいなら「個体差だけでは説明できないほど、群の平均がずれている」と考えます。
            差が大きいときだけ棄却するので、F 検定は<strong>上側だけを見る片側検定</strong>です。
          </p>
        </Intuition>
      </Section>

      <Section title="分散分析表を作る">
        <Example title="肥料の例で計算する">
          <Steps>
            <li>
              群間変動：<M>{'S_A = 5 \\times \\{(17-20)^2 + (20-20)^2 + (23-20)^2\\} = 5 \\times 18 = 90'}</M>
            </li>
            <li>
              群内変動：A は <M>{'(-2)^2 + 2^2 + 0^2 + (-4)^2 + 4^2 = 40'}</M>、B と C も同様に 40 で、<M>{'S_E = 120'}</M>
            </li>
            <li>
              全変動：<M>{'S_T = 90 + 120 = 210'}</M>
            </li>
            <li>
              自由度：群間 <M>{'3 - 1 = 2'}</M>、群内 <M>{'15 - 3 = 12'}</M>、全体 <M>{'15 - 1 = 14'}</M>
            </li>
            <li>
              平均平方：<M>{'90 \\div 2 = 45'}</M>、<M>{'120 \\div 12 = 10'}</M>
            </li>
            <li>
              F 比：<M>{'45 \\div 10 = 4.5'}</M>
            </li>
          </Steps>
        </Example>
        <DataTable
          caption="分散分析表（肥料の例）"
          head={['要因', '平方和（変動）', '自由度', '平均平方', 'F 比', 'p 値']}
          rows={[
            ['群間（肥料）', <Mark key="sa" color="c2">90</Mark>, <Mark key="da" color="c1">2</Mark>, <Mark key="ma" color="c2">45</Mark>, <Mark key="f" color="c4">4.5</Mark>, '0.035'],
            ['群内（誤差）', <Mark key="se" color="c3">120</Mark>, <Mark key="de" color="c1">12</Mark>, <Mark key="me" color="c3">10</Mark>, '', ''],
            ['全体', '210', '14', '', '', ''],
          ]}
        />
        <p>
          F 分布表で <M>{'F_{0.05}(2, 12) = 3.885'}</M>。<M>{'4.5 > 3.885'}</M> なので、有意水準 5% で「3種類の肥料の平均草丈はすべて等しい」を棄却します。
          ただし <M>{'F_{0.01}(2, 12) = 6.927'}</M> よりは小さいので、1% では有意ではありません。
        </p>
        <MathNote title="表を埋めるときの3つのルール">
          <ul>
            <li>平方和と自由度は、それぞれ「群間 ＋ 群内 ＝ 全体」になる（足し算で空欄を埋められる）</li>
            <li>平均平方 ＝ 平方和 ÷ 自由度（全体の行には書かないことが多い）</li>
            <li>F 比 ＝ 群間の平均平方 ÷ 群内の平均平方</li>
          </ul>
        </MathNote>
        <p>
          群が2つ（k = 2）のときの分散分析は、等分散を仮定した2標本の t 検定と同じ結論になります（<M>{'F = t^2'}</M> の関係がある）。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              有意になったら「全部の群が違う」→ わかるのは「<strong>少なくとも1つ</strong>の群の平均が違う」ことだけ。どの群とどの群が違うかは、別の方法（多重比較法）で調べます。
            </li>
            <li>
              群間の自由度を k、群内の自由度を N − 1 にする → 正しくは <strong>k − 1</strong> と <strong>N − k</strong>。
            </li>
            <li>平方和どうしで F を計算する（90 ÷ 120）→ 必ず自由度で割った<strong>平均平方どうし</strong>で比べます。</li>
            <li>F 検定を両側で考える → 群間のずれが大きいときだけ棄却するので、上側の片側だけを見ます。</li>
            <li>「分散」分析だから分散が等しいかを調べている → 調べているのは<strong>平均</strong>の差。ばらつきを分けて比べる方法なのでこの名前です。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>空欄のある分散分析表を埋める問題（自由度・平均平方・F 比）。</li>
            <li>F 比と F 分布表の値（自由度の組に注意）を比べて結論を選ぶ問題。</li>
            <li>t 検定をくり返すと第1種の過誤の確率が大きくなる理由を問う問題。</li>
            <li>処理群と対照群、反復・無作為化・ブロック化の意味を問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
