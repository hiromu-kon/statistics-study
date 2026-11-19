import { Link } from 'react-router-dom'
import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import { NormalArea } from '../../../components/charts/common'
import type { LessonMeta } from '../../../types'
import { NormalExplorer, SigmaRule, TwoTails, ZTableExcerpt } from '../figures/NormalFigures'

export const meta: LessonMeta = {
  id: 'distributions-normal',
  chapter: 'distributions',
  order: 5,
  title: '正規分布と標準正規分布表',
  summary: '左右対称のつりがね形の分布。標準化して標準正規分布表を引けば、どんな正規分布の確率も求められます。',
  minutes: 40,
  keywords: ['正規分布', 'N(μ,σ²)', '標準化', '標準正規分布', '標準正規分布表', '68-95-99.7'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>正規分布</strong> <M>{'N(\\mu, \\sigma^2)'}</M> は、平均 <M>{'\\mu'}</M> を中心にした左右対称のつりがね形の分布です
          （N は「正規」の英語 normal の頭文字。<M>{'\\mu'}</M> は「ミュー」、<M>{'\\sigma'}</M> は「シグマ」と読むギリシャ文字で、<M>{'\\sigma^2'}</M> は分散、<M>{'\\sigma'}</M> は標準偏差）。
          <M>{'Z = (X - \\mu)/\\sigma'}</M> と<strong>標準化</strong>すると、平均0・標準偏差1の<strong>標準正規分布</strong> <M>{'N(0, 1)'}</M> になり、
          <strong>標準正規分布表</strong>から確率を読み取れます。
        </p>
      </Point>

      <Section title="どんな場面で使う分布か">
        <ul>
          <li>同じ年齢・性別の人の身長、製品の重さや長さのばらつき</li>
          <li>測定の誤差（何度も測ると、真の値のまわりに左右対称に散らばる）</li>
          <li>たくさんの人が受けるテストの点数（おおよそ）</li>
          <li>
            たくさんの値の平均や合計（「標本分布」の章で学ぶ<strong>中心極限定理</strong>により、ほぼ正規分布になる）
          </li>
        </ul>
        <p>「平均のあたりがいちばん多く、平均からはなれるほど左右同じように少なくなる」データによく合います。</p>
      </Section>

      <Section title="パラメータ μ と σ の意味">
        <MathBlock caption="平均 μ・分散 σ²（標準偏差 σ）の正規分布">{'X \\sim N(\\mu, \\sigma^2), \\qquad E(X) = \\mu, \\quad V(X) = \\sigma^2'}</MathBlock>
        <DataTable
          head={['パラメータ', '意味', '変えるとグラフは']}
          rows={[
            [<M key="m">{'\\mu'}</M>, '平均（山の頂上の位置）', '形はそのまま左右に動く'],
            [<M key="s">{'\\sigma'}</M>, '標準偏差（山の幅）', '大きいと低く横に広がり、小さいと高く細くなる（面積はいつも1）'],
          ]}
        />
        <Figure caption="テストの点数が N(μ, σ²) に従うとして、μ と σ を動かしてみよう。点線は N(60, 10²)。塗った部分が μ − σ から μ + σ の範囲">
          <NormalExplorer />
        </Figure>
        <Pitfall title="N(μ, σ²) の2つめは「分散」">
          <p>
            <M>{'N(50, 16)'}</M> と書いてあれば、分散が16で<strong>標準偏差は4</strong>です。標準偏差を2つめに書く本もあるので、問題文の書き方を確認しましょう。
          </p>
        </Pitfall>
        <p>
          グラフの式（確率密度関数）は <M>{'f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)'}</M> です（<M>{'\\exp(\\ldots)'}</M> は <M>{'e^{\\ldots}'}</M> の別の書き方、<M>{'\\pi'}</M> は円周率）。
          ただ、この式に数を入れて計算することは2級ではほとんどなく、覚える必要もありません。確率は次の「標準化して表を引く」方法で求めます。
        </p>
      </Section>

      <Section title="±1σ・±2σ・±3σ に入る割合">
        <p>どんな正規分布でも、平均から標準偏差何個分の範囲に何%が入るかは同じです。</p>
        <DataTable
          head={['範囲', '入る割合', 'はみ出す割合（片側）']}
          rows={[
            ['μ ± 1σ', '約 68.3%', '約 15.9%'],
            ['μ ± 2σ', '約 95.4%', '約 2.3%'],
            ['μ ± 3σ', '約 99.7%', '約 0.13%'],
            ['μ ± 1.96σ', 'ちょうど約 95%', '約 2.5%'],
          ]}
          caption="「68-95-99.7 ルール」と呼ばれることがある"
          highlight={[3]}
        />
        <Figure caption="k を動かすと、μ ± kσ に入る割合が変わる。見るところは塗った部分の割合の数字。k = 1, 2, 3 で上の表の値になる">
          <SigmaRule />
        </Figure>
      </Section>

      <Section title="標準化：どんな正規分布も N(0, 1) にそろえる">
        <p>
          正規分布は μ と σ の組合せが無数にあるので、全部の表を作るわけにはいきません。そこで「平均を引いて、標準偏差で割る」<strong>標準化</strong>で、
          すべてを標準正規分布 <M>{'N(0, 1)'}</M> にそろえます。
        </p>
        <MathBlock caption="X が平均から「標準偏差いくつ分」はなれているかを表す">{'Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)'}</MathBlock>
        <p>
          たとえば平均60点・標準偏差10点のテストで75点なら、平均より15点上で、15点は標準偏差10点の1.5個分。だから <M>{'z = 1.5'}</M> です。
          どんな正規分布でも「平均から標準偏差何個分か」が同じなら、その先の面積（確率）は同じになります。
        </p>
        <Example title="テストの点数 N(60, 10²) で、75点以上の確率">
          <Steps>
            <li>
              標準化する：<M>{'z = (75 - 60) / 10 = 1.50'}</M>（75点は平均より標準偏差1.5個分上）
            </li>
            <li>
              確率を言いかえる：<M>{'P(X \\ge 75) = P(Z \\ge 1.50)'}</M>
            </li>
            <li>表を引く：上側確率の表の「1.5 の行」「.00 の列」→ 0.0668</li>
            <li>答え：約 6.68%</li>
          </Steps>
        </Example>
        <Example title="同じテストで、52点以下の確率（左側・マイナスの z）">
          <Steps>
            <li>
              標準化する：<M>{'z = (52 - 60) / 10 = -0.80'}</M>（平均より標準偏差0.8個分下）
            </li>
            <li>
              確率を言いかえる：<M>{'P(X \\le 52) = P(Z \\le -0.80)'}</M>（左のしっぽ）
            </li>
            <li>
              表にはプラスの z しかないので、左右対称を使う：<M>{'P(Z \\le -0.80) = P(Z \\ge 0.80)'}</M>（右のしっぽと同じ面積）
            </li>
            <li>表を引く：「0.8 の行」「.00 の列」→ 0.2119</li>
            <li>答え：約 21.2%</li>
          </Steps>
        </Example>
        <Compare>
          <Card title="もとの分布 X ~ N(60, 10²)">
            <NormalArea mu={60} sigma={10} from={75} to={1000} xLabel="点数" />
          </Card>
          <Card title="標準化した Z ~ N(0, 1)">
            <NormalArea from={1.5} to={1000} xLabel="z" />
          </Card>
        </Compare>
        <p className="small muted">2つの図は目盛りの数字が違うだけで、塗った面積（確率）は同じです。</p>
      </Section>

      <Section title="標準正規分布表（上側確率）の読み方">
        <p>
          このサイトの<Link to="/tables">分布表ページ</Link>の正規分布表は、<strong>上側確率</strong> <M>{'Q(z) = P(Z \\ge z)'}</M>（z より右の面積）を載せています。
          行で z の小数第1位まで、列で小数第2位を選びます。
        </p>
        <Example title="z = 1.52 のとき">
          <p>「1.5 の行」と「.02 の列」が交わるところを読みます。</p>
          <ZTableExcerpt z={1.52} />
        </Example>
        <Intuition title="表には z ≥ 0 しかない。マイナスは「左右対称」で読む">
          <p>
            標準正規分布は0を中心に左右対称なので、<M>{'P(Z \\le -1.5) = P(Z \\ge 1.5)'}</M> です。左のしっぽと右のしっぽは同じ面積です。
            また全体の面積は1なので、<M>{'P(Z \\le 1.5) = 1 - Q(1.5)'}</M> です。
          </p>
        </Intuition>
      </Section>

      <Section title="計算パターン集">
        <p>表の値 <M>{'Q(\\cdot)'}</M>（「Q のかっこの中に z を入れた値」の意味）と「左右対称」「全体は1」の2つだけで、どんな範囲の確率も求められます。図の塗った部分が求めたい確率です。</p>
        <Steps>
          <li>
            分布の μ と σ を読み取る（<M>{'N(60, 100)'}</M> のように分散が書いてあれば、ルートをとって <M>{'\\sigma = 10'}</M>）
          </li>
          <li>
            範囲の端を <M>{'z = (x - \\mu)/\\sigma'}</M> で z に直す
          </li>
          <li>つりがね形の図をかいて、求めたい部分を塗る（右のしっぽ・左のしっぽ・あいだ）</li>
          <li>下の①〜⑥のどの形かを見て、表の値を足し引きする</li>
        </Steps>
        <Compare>
          <Card title="① 右側：P(Z ≥ 1.25)">
            <NormalArea from={1.25} to={1000} />
            <p>
              表をそのまま読む：<M>{'Q(1.25) = 0.1056'}</M>
            </p>
          </Card>
          <Card title="② 左側：P(Z ≤ −1.25)">
            <NormalArea from={-1000} to={-1.25} />
            <p>
              対称なので ① と同じ：<M>{'Q(1.25) = 0.1056'}</M>
            </p>
          </Card>
        </Compare>
        <Compare>
          <Card title="③ 左から：P(Z ≤ 0.80)">
            <NormalArea from={-1000} to={0.8} />
            <p>
              全体から右側を引く：<M>{'1 - Q(0.80) = 1 - 0.2119 = 0.7881'}</M>
            </p>
          </Card>
          <Card title="④ 正の区間：P(0.50 ≤ Z ≤ 1.50)">
            <NormalArea from={0.5} to={1.5} />
            <p>
              右側どうしの差：<M>{'Q(0.50) - Q(1.50) = 0.3085 - 0.0668 = 0.2417'}</M>
            </p>
          </Card>
        </Compare>
        <Compare>
          <Card title="⑤ 0をまたぐ区間：P(−1.00 ≤ Z ≤ 2.00)">
            <NormalArea from={-1} to={2} />
            <p>
              両方のしっぽを引く：<M>{'1 - Q(1.00) - Q(2.00) = 1 - 0.1587 - 0.0228 = 0.8185'}</M>
            </p>
          </Card>
          <Card title="⑥ 両側のしっぽ：P(|Z| ≥ 1.96)">
            <TwoTails z={1.96} />
            <p>
              片側の2倍：<M>{'2 \\times Q(1.96) = 2 \\times 0.0250 = 0.0500'}</M>（左右のしっぽは同じ面積）
            </p>
          </Card>
        </Compare>
        <Figure caption="左端・右端のスライダーを動かして、①〜⑥の計算の答えと、図の下に出る面積の数字が一致するか確かめてみよう">
          <NormalArea from={-1} to={2} interactive xLabel="z" />
        </Figure>
        <Example title="逆向き：上位 5% に入るには何点必要か">
          <p>
            点数が <M>{'N(500, 100^2)'}</M> のとき、表の中から 0.05 に近い値を探します。<M>{'Q(1.64) = 0.0505'}</M>、<M>{'Q(1.65) = 0.0495'}</M> なので、
            ちょうど 0.05 になる z はその間の <M>{'z = 1.645'}</M>（よく使うので覚えておく値）。
            標準化の式 <M>{'z = (x - \\mu)/\\sigma'}</M> を x について解くと <M>{'x = \\mu + z\\sigma'}</M> なので、
            <M>{'x = 500 + 1.645 \\times 100 = 664.5'}</M> 点です。
          </p>
        </Example>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              標準化で分散で割る → 割るのは<strong>標準偏差</strong> <M>{'\\sigma'}</M>。<M>{'N(60, 100)'}</M> なら <M>{'\\sigma = 10'}</M> で割ります。
            </li>
            <li>表の種類を確かめない → 「上側確率 Q(z)」の表か「0 から z までの面積」の表か「下側確率 Φ(z)」の表かで、読み方が変わります。</li>
            <li>
              <M>{'P(Z \\le 0.8)'}</M> に表の値 0.2119 をそのまま答える → それは右側の面積。左側は <M>{'1 - 0.2119'}</M>。
            </li>
            <li>マイナスの z を表で探そうとする → 対称性を使って、プラスの z に直して読みます。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              <M>{'N(\\mu, \\sigma^2)'}</M> に従う量について、ある範囲に入る確率を、標準化して表から求める問題。受験記などでは頻出とよく言われます。
              本番（CBT）では統計数値表が会場で配られるので（公式サイトの試験概要）、このサイトの<Link to="/tables">分布表ページ</Link>で表を引くことに慣れておきましょう。
            </li>
            <li>「上位◯%に入るための値」のように、確率から値を逆に求める問題。</li>
            <li>2つの確率の条件から μ と σ を求める問題。</li>
            <li>1.96 と 1.645 は推定・検定でも何度も出てくるので、ここで慣れておきましょう。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
