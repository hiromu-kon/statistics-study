import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section } from '../../../components/blocks'
import type { LessonMeta } from '../../../types'
import { BarVsHistogram, CategoryBar, CategoryPie, DataTypeTree, StemLeaf, TypeSorter } from '../figures/DataTypeFigures'

export const meta: LessonMeta = {
  id: 'descriptive-data-types',
  chapter: 'descriptive',
  order: 1,
  title: 'データの種類とグラフ',
  summary: 'データはどこから手に入るのか、どんな種類があるのか、種類ごとにどのグラフを使えばよいのかを整理します。',
  minutes: 20,
  keywords: ['データソース', '公的統計', '質的変数', '量的変数（離散型・連続型）', '棒グラフ', '円グラフ', '幹葉図'],
}

const SCORES = [52, 58, 60, 63, 65, 67, 71, 71, 74, 76, 79, 82, 85, 90]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          データには、<strong>種類を表すもの（質的変数）</strong>と<strong>数の大きさを表すもの（量的変数）</strong>があります。
          種類によって、使える計算もふさわしいグラフも変わります。分析の最初の一歩は「これはどっちのデータ？」と見分けることです。
        </p>
      </Point>

      <Section title="データはどこから来るのか（データソース）">
        <p>
          データの出どころを<strong>データソース</strong>といいます。自分でアンケートをとったり測ったりして集める方法のほかに、
          国や自治体がつくる<strong>公的統計</strong>を使う方法があります。
        </p>
        <DataTable
          head={['公的統計の例', 'どんな調査か']}
          rows={[
            ['国勢調査', '日本に住んでいるすべての人と世帯が対象。5年ごとに行われる（全数調査）'],
            ['労働力調査', '毎月の完全失業率などを明らかにする、世帯を対象にした標本調査'],
          ]}
          caption="出典：総務省統計局「国勢調査 よくあるご質問」https://www.stat.go.jp/data/kokusei/2020/qa-1.html（参照日 2026-11-19）"
        />
        <p>
          日本の公的統計は、政府統計の総合窓口 <strong>e-Stat</strong>（https://www.e-stat.go.jp/）でまとめて探したり、表やファイルで入手したりできます。
        </p>
        <Note title="全数調査と標本調査">
          <p>
            国勢調査のように<strong>全員</strong>を調べるのが全数調査、労働力調査のように<strong>一部</strong>を選んで調べるのが標本調査です。
            標本調査のくわしい話は「時系列とデータの集め方」の章でします。
          </p>
        </Note>
      </Section>

      <Section title="データの種類を見分ける">
        <p>クラスでアンケートをとったとします。集まった項目（変数）は、大きく次のように分かれます。</p>
        <Figure caption="データの種類の分かれ方">
          <DataTypeTree />
        </Figure>
        <Compare>
          <Card title="質的変数（カテゴリカル・データ）">
            <p>
              「どれに当てはまるか」を表すデータ。血液型、好きな教科、都道府県など。<strong>足したり平均したりしても意味がない</strong>。
              数えられるのは「それぞれ何人いるか」だけ。
            </p>
          </Card>
          <Card title="量的変数">
            <p>
              「どれくらいの大きさか」を表すデータ。身長、点数、人数など。<strong>平均や差を計算できる</strong>。
            </p>
            <ul>
              <li>
                <strong>離散型</strong>：1, 2, 3…と<strong>とびとび</strong>の値（人数、回数、サイコロの目）
              </li>
              <li>
                <strong>連続型</strong>：いくらでも細かく測れる値（身長、時間、重さ）
              </li>
            </ul>
          </Card>
        </Compare>
        <Intuition title="見分けるコツ">
          <p>
            「その値どうしを<strong>足して平均したら意味があるか</strong>」を考えます。平均身長は意味がありますが、
            「平均郵便番号」は意味がありません。だから郵便番号は、数字で書かれていても<strong>質的変数</strong>です。
            量的変数なら、次に「<strong>途中の値（1.5人など）がありうるか</strong>」で離散型か連続型かを分けます。
          </p>
        </Intuition>
        <Figure caption="やってみよう：それぞれの変数の種類を選ぶ">
          <TypeSorter />
        </Figure>
      </Section>

      <Section title="種類ごとのグラフ">
        <p>40人に通学手段を聞いた結果（質的変数）を、2つのグラフで表してみます。</p>
        <Compare>
          <Card title="棒グラフ：人数の大小を比べる">
            <CategoryBar />
          </Card>
          <Card title="円グラフ：全体に占める割合を見る">
            <CategoryPie />
          </Card>
        </Compare>
        <p>
          <strong>棒グラフ</strong>は「どれが多いか」を比べるのが得意で、<strong>円グラフ</strong>は「全体のうち何%か」（構成比）を見るのが得意です。
          棒グラフはカテゴリの順番を入れかえても意味が変わらないので、多い順に並べると読みやすくなります。
        </p>
        <p>
          量的変数の分布を見るときは、<strong>ヒストグラム</strong>を使います。見た目は棒グラフに似ていますが、横軸が<strong>数の目盛り</strong>で、
          棒を<strong>すき間なく</strong>並べます（くわしくは次のレッスン）。
        </p>
        <Figure caption="ヒストグラムは横軸が数の大きさ。棒の間をあけない">
          <BarVsHistogram />
        </Figure>
      </Section>

      <Section title="幹葉図：データの値を残したまま分布を見る">
        <p>14人のテストの点数を、十の位（幹）と一の位（葉）に分けて書いたのが<strong>幹葉図</strong>です。</p>
        <Example title="14人の点数">
          <p>{SCORES.join(', ')}</p>
        </Example>
        <Figure caption="幹葉図。横に倒すとヒストグラムのような形が見え、しかも元の値も読み取れる">
          <StemLeaf data={SCORES} />
        </Figure>
        <p>
          70点台が5人でいちばん多く、50点台と90点台は少ないことが一目でわかります。ヒストグラムと違って<strong>1つ1つの値が消えない</strong>のが長所です。
          データが多すぎると葉が長くなりすぎるので、数十個くらいまでのデータに向いています。
        </p>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>数字で書かれていれば量的変数 → 郵便番号・出席番号・背番号は「名前の代わり」なので質的変数です。</li>
            <li>
              5段階の満足度（1〜5）は量的変数 → 順序はありますが、「1と2の差」と「4と5の差」が同じとは限らないので、ふつうは<strong>順序のある質的変数</strong>として扱います。
              平均をとることもありますが、その意味には注意が必要です。
            </li>
            <li>棒グラフとヒストグラムは同じもの → 棒グラフは質的変数（カテゴリ）、ヒストグラムは量的変数（数の区間）に使います。</li>
            <li>円グラフで「量の大きさ」を比べる → 円グラフは割合を見るもの。合計が違う2つの円グラフの扇の大きさを比べても、人数の比較にはなりません。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>いくつかの変数を示して、質的変数・量的変数（離散型・連続型）を正しく分類した組合せを選ぶ問題。</li>
            <li>目的（割合を見たい、変化を見たい、分布を見たい）に合ったグラフを選ぶ問題。</li>
            <li>幹葉図から、最大値・最小値・中央値・ある点数以上の人数などを読み取る問題。</li>
            <li>国勢調査など公的統計の説明（全数調査か標本調査か、など）の正誤を問う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
