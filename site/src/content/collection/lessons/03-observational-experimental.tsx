import { Card, Compare, Example, ExamTip, Figure, Intuition, Pitfall, Point, Section } from '../../../components/blocks'
import type { LessonMeta } from '../../../types'
import { TextTable } from '../figures/TextTable'
import { AssignmentDemo, ConfoundingDiagram, PopulationSample } from '../figures/StudyFigures'

export const meta: LessonMeta = {
  id: 'collection-observational-experimental',
  chapter: 'collection',
  order: 3,
  title: '観察研究と実験研究・母集団と標本',
  summary: '知りたい対象の全体（母集団）と、実際に調べる一部（標本）の関係、全数調査と標本調査、観察研究と実験研究のちがいを学びます。',
  minutes: 25,
  keywords: ['観察研究', '実験研究', '調査の設計', '母集団', '標本', '全数調査', '標本調査'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          <strong>母集団</strong>は「本当に知りたい対象の全体」、<strong>標本</strong>は「そこから選んで実際に調べる一部」。
          データの集め方には、ありのままを調べる<strong>観察研究</strong>と、調べる側が条件（処理）を割り当てる<strong>実験研究</strong>があります。
          原因と結果の関係（因果）をはっきり言えるのは、ふつう<strong>実験研究</strong>のほうです。
        </p>
      </Point>

      <Section title="母集団と標本">
        <p>
          ある市で「新しい公園をつくることに賛成か」を知りたいとします。本当に知りたいのは<strong>市民全員</strong>の賛成率で、これが<strong>母集団</strong>です。
          でも全員に聞くのは大変なので、一部の人を選んで聞きます。選ばれた人たちが<strong>標本</strong>で、選んだ人数を<strong>標本の大きさ</strong>（標本サイズ）といいます。
        </p>
        <Figure caption="標本の賛成率は、選び直すたびに少しずつちがう。標本を大きくすると、母集団の40%に近い値が出やすくなる">
          <PopulationSample />
        </Figure>
        <p>
          標本から母集団のことを推しはかるのが「推測統計」です。そのためには、標本が母集団の<strong>縮図</strong>になるように選ぶことが大切です（選び方は次のレッスン）。
        </p>
      </Section>

      <Section title="全数調査と標本調査">
        <p>
          母集団の全員（全部）を調べるのが<strong>全数調査</strong>（悉皆調査ともいう）、一部を選んで調べるのが<strong>標本調査</strong>です。
          日本の<strong>国勢調査</strong>は、国内に住むすべての人と世帯を対象にする全数調査です（<a href="https://www.stat.go.jp/data/kokusei/2020/gaiyou.html" target="_blank" rel="noreferrer">総務省統計局「令和2年国勢調査 調査の概要」</a>、2026年11月19日参照）。テレビの視聴率調査や内閣支持率の世論調査は標本調査です。
        </p>
        <Compare>
          <Card title="全数調査">
            <ul>
              <li>長所：標本の選び方による誤差（標本誤差）がない</li>
              <li>長所：細かい地域ごとの集計もできる</li>
              <li>短所：お金・時間・人手がかかる</li>
              <li>短所：結果が出るまで時間がかかる</li>
            </ul>
          </Card>
          <Card title="標本調査">
            <ul>
              <li>長所：安く、早く結果が出る</li>
              <li>長所：少人数なので、1人ずつ丁寧に調べられる</li>
              <li>長所：調べると壊れるもの（破壊検査）にも使える</li>
              <li>短所：標本誤差がある（選び方しだいで偏ることもある）</li>
            </ul>
          </Card>
        </Compare>
        <Example title="全数調査ができない・向かない場面">
          <ul>
            <li>電球の寿命の検査：最後まで点けて調べると、全部使えなくなる（破壊検査）。</li>
            <li>工場で作った缶詰の味見：全部開けたら売る物がなくなる。</li>
            <li>毎週の内閣支持率：毎週全国民に聞くことは時間的にもお金の面でもできない。</li>
          </ul>
        </Example>
      </Section>

      <Section title="観察研究と実験研究">
        <TextTable
          head={['', '観察研究', '実験研究']}
          rows={[
            ['やり方', '調べる側は手を出さず、ありのままの状態を記録する', '調べる側が、誰にどの処理（薬、肥料、教え方など）をするかを決める'],
            ['例', '朝食を食べる生徒と食べない生徒の成績を比べる', 'くじで2つの組に分け、片方にだけ新しい教え方をして成績を比べる'],
            ['因果', '関係があることはわかるが、原因とは言いにくい', '割り当てを無作為にすれば、原因と言いやすい'],
            ['向いている場面', '割り当てることができない・してはいけないこと（喫煙、性別、生活習慣など）', '割り当てられる処理（新薬、肥料、広告の見せ方など）'],
          ]}
        />
        <p>
          たとえば観察研究で「朝食を食べる生徒ほど成績がよい」ことがわかったとします。これだけで「朝食を食べれば成績が上がる」とは言えません。
          早寝早起きの生活リズムがあると、朝食も食べやすく、勉強の調子もよい、という<strong>別の原因</strong>が両方に効いているかもしれないからです。
        </p>
        <Figure caption="交絡：比べたい2つの両方に影響する別の要因（交絡因子）があると、見かけの関係が生まれる">
          <ConfoundingDiagram />
        </Figure>
        <p>
          このように、比べたいことの両方に影響する別の要因を<strong>交絡因子</strong>といい、その影響がまざってしまうことを<strong>交絡</strong>といいます。
          観察研究では、交絡を完全には取り除けません。
        </p>
      </Section>

      <Section title="直感的な理解：くじで割り当てる意味">
        <p>
          「サプリを飲むと健康になるか」を調べるとします。<strong>本人に選ばせる</strong>と、もともと運動習慣のある健康に気をつかう人ほどサプリを選びがちです。
          <strong>くじで割り当てる</strong>と、どうなるでしょうか。
        </p>
        <Figure caption="本人が選ぶと、飲む群に運動する人（緑）が集まる。くじで分けると、両方の群にほぼ同じ割合で入る">
          <AssignmentDemo />
        </Figure>
        <Intuition>
          <p>
            くじ（無作為）で割り当てると、運動習慣のような<strong>見えている要因</strong>だけでなく、遺伝や食生活のような<strong>調べていない要因</strong>まで、
            2つの群にだいたい同じように散らばります。そのため、群の差を「処理のちがい」によるものと考えやすくなります。これが実験研究の強みです。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>標本調査は全数調査より必ず劣る → 安く早く、丁寧に調べられるので、目的によっては標本調査のほうが適しています。</li>
            <li>データの数が多い観察研究なら因果がわかる → 人数を増やしても<strong>交絡は消えません</strong>。</li>
            <li>2つの群を比べていれば実験研究 → 群を<strong>調べる側が割り当てた</strong>かどうかで決まります。本人が選んだ群を比べるのは観察研究です。</li>
            <li>母集団 = 調査に答えた人 → 母集団は「結論を当てはめたい全体」。答えた人は標本です。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>調査の説明文を読み、観察研究か実験研究か、全数調査か標本調査かを判定する問題。</li>
            <li>「この調査の母集団は何か」「標本は何か」を選ぶ問題。</li>
            <li>観察研究の結果から言えること・言えないこと（因果の主張、交絡因子の可能性）を選ぶ問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
