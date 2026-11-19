import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { DiceEventExplorer } from '../figures/DiceEventExplorer'
import { MaxMinDiff } from '../figures/MaxMinDiff'
import { VennDiagram } from '../figures/VennDiagram'

export const meta: LessonMeta = {
  id: 'probability-basics',
  chapter: 'probability',
  order: 1,
  title: '事象と確率・加法定理',
  summary: '「起こりうる結果の全体」のうち、知りたい出来事がどれくらいを占めるか。「または」と「〜でない」の計算ルールを図で確かめます。',
  minutes: 30,
  keywords: ['試行', '事象', '標本空間', '和事象', '積事象', '余事象', '排反', '加法定理'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          確率は「<strong>起こりうる結果の全体</strong>のうち、知りたい出来事が占める割合」です。
          「A または B」は <strong>重なりを1回引く</strong>、「少なくとも1回」「〜でない」は <strong>全体の1から引く（余事象）</strong>
          と、数えるのがぐっと楽になります。
        </p>
      </Point>

      <Section title="言葉をそろえる：試行・標本空間・事象">
        <p>確率の問題には決まった言葉が出てきます。サイコロ1個を投げる場面で、まとめて確認しましょう。</p>
        <DataTable
          head={['用語', '意味（言い換え）', 'サイコロ1個の例']}
          rows={[
            ['試行（しこう）', '結果が偶然で決まる「やってみること」', 'サイコロを1回投げる'],
            ['標本空間', '起こりうる結果を全部集めたもの（全体）', '{1, 2, 3, 4, 5, 6}'],
            ['事象', '全体のうち、知りたい結果を集めた一部分', '偶数の目 = {2, 4, 6}'],
            ['確率', '事象が全体に占める割合（どれも同じくらい起こるとき）', 'P(偶数) = 3/6 = 1/2'],
          ]}
          caption="確率の基本用語"
        />
        <p>
          確率は英語の probability の頭文字をとって <M>{'P(A)'}</M> と書きます。「事象 A の確率」と読みます。
          どの結果も同じくらい起こりやすい（<strong>同様に確からしい</strong>）とき、
        </p>
        <MathBlock caption="A になる場合の数 ÷ 全部の場合の数">{'P(A) = \\frac{n(A)}{n(\\Omega)}'}</MathBlock>
        <p>
          <M>{'\\Omega'}</M>（オメガ）は標本空間（全体）、<M>{'n(\\;)'}</M> は「その中に結果がいくつあるか」を表す記号です。
          確率はいつも 0 以上 1 以下で、全体の確率は <M>{'P(\\Omega) = 1'}</M> です。
        </p>
      </Section>

      <Section title="「かつ」「または」「でない」を図で見る">
        <p>
          全体を四角、事象を円で描いた図を<strong>ベン図</strong>といいます。塗られた部分が、その事象です。
        </p>
        <Compare>
          <Card title="積事象 A∩B（A かつ B）">
            <VennDiagram shade="intersection" ariaLabel="AとBの重なりを塗った図" />
            <p className="small">A と B が<strong>両方</strong>起きる。重なりの部分。</p>
          </Card>
          <Card title="和事象 A∪B（A または B）">
            <VennDiagram shade="union" ariaLabel="AとBの少なくとも一方を塗った図" />
            <p className="small">A と B の<strong>少なくとも一方</strong>が起きる。両方でもよい。</p>
          </Card>
          <Card title="余事象 Ā（A でない）">
            <VennDiagram shade="notA" color="c5" ariaLabel="Aの外側を塗った図" />
            <p className="small">A が起き<strong>ない</strong>。全体から A を除いた部分。</p>
          </Card>
          <Card title="排反（同時には起きない）">
            <VennDiagram shade="none" disjoint ariaLabel="AとBが重ならない図" />
            <p className="small">A と B に重なりがない。A∩B が空っぽ。</p>
          </Card>
        </Compare>
        <MathNote title="記号の読み方">
          <p>
            <M>{'\\cap'}</M> は「かつ（キャップ）」、<M>{'\\cup'}</M> は「または（カップ）」、<M>{'\\bar{A}'}</M> は「A バー＝A でない」。
            <M>{'\\cap'}</M> は下が開いた形で「重なりだけを取る」、<M>{'\\cup'}</M> は器の形で「両方とも入れる」と覚えると混ざりにくいです。
          </p>
        </MathNote>
      </Section>

      <Section title="具体例：サイコロ2個の36マス">
        <p>
          サイコロを2個投げると、出方は <M>{'6 \\times 6 = 36'}</M> 通り。これを 6×6 のマスに並べると、事象は「塗ったマス」になり、確率は「塗ったマスの数 ÷ 36」で求まります。
          マスの数字は2つの目の和です。
        </p>
        <p>
          A を「目の和が8以上」、B を「ぞろ目（2つの目が同じ）」として、タブを切り替えてみてください。
        </p>
        <Figure caption="A∪B を数えるとき、A にも B にも入っている紫のマスを2回数えないように注意">
          <DiceEventExplorer />
        </Figure>
        <Example title="数えてみると">
          <p>
            A は15マス、B は6マス、両方（A∩B）は (4,4), (5,5), (6,6) の3マス。A∪B は <M>{'15 + 6 - 3 = 18'}</M> マスなので、
            <M>{'P(A \\cup B) = 18/36 = 1/2'}</M> です。単純に <M>{'15 + 6 = 21'}</M> とすると、紫の3マスを2回数えてしまいます。
          </p>
        </Example>
      </Section>

      <Section title="定義・式：加法定理と余事象">
        <MathBlock caption="加法定理：A または B の確率。重なりを2回数えた分を1回引く">
          {'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)'}
        </MathBlock>
        <p>
          A と B が<strong>排反</strong>（重ならない）なら <M>{'P(A \\cap B) = 0'}</M> なので、ただの足し算になります。
        </p>
        <MathBlock caption="排反のときだけ使える形">{'P(A \\cup B) = P(A) + P(B)'}</MathBlock>
        <MathBlock caption="余事象：A でない確率は、全体の 1 から A の確率を引く">{'P(\\bar{A}) = 1 - P(A)'}</MathBlock>
        <Example title="「少なくとも1回」は余事象で">
          <p>
            サイコロを3回投げて、6の目が<strong>少なくとも1回</strong>出る確率。「1回だけ」「2回」「3回」と場合分けするのは大変です。
            反対の「<strong>1回も6が出ない</strong>」は、毎回6以外（5通り）なので <M>{'(5/6)^3 = 125/216'}</M>。
          </p>
          <MathBlock>{'P = 1 - \\left(\\frac{5}{6}\\right)^3 = 1 - \\frac{125}{216} = \\frac{91}{216} \\approx 0.42'}</MathBlock>
        </Example>
      </Section>

      <Section title="もう一歩：最大値と最小値の差を数える">
        <p>
          少し手ごわいタイプにも挑戦します。<strong>サイコロを3回投げて、出た目の最大値と最小値の差がちょうど1になる確率</strong>を考えます。
          いきなり公式を探さず、「差がちょうど1」とはどういう状態かを言い換えるのがコツです。
        </p>
        <Steps>
          <li>
            <strong>言い換える：</strong>差がちょうど1 ⇔ 出た目が「隣り合う2つの目 k と k+1」だけで、しかも<strong>両方とも1回以上出ている</strong>。
            例：1, 2, 2 は OK（最大2・最小1）。1, 1, 1 は差0なのでダメ。1, 2, 3 は差2なのでダメ。
          </li>
          <li>
            <strong>まず k = 1 に固定する：</strong>3回とも「1か2」になる出方は、毎回2通りなので <M>{'2^3 = 8'}</M> 通り。
          </li>
          <li>
            <strong>余事象の考えで、ダメな分を引く：</strong>8通りのうち「全部1」「全部2」の2通りは差が0。残りは <M>{'8 - 2 = 6'}</M> 通り
            （112, 121, 211, 122, 212, 221）。
          </li>
          <li>
            <strong>k を動かす：</strong>隣り合う2つの目の選び方は {'{1,2}'}, {'{2,3}'}, {'{3,4}'}, {'{4,5}'}, {'{5,6}'} の5通り。
            どの目が出たかで組は1つに決まるので、重複はありません。合計 <M>{'5 \\times 6 = 30'}</M> 通り。
          </li>
          <li>
            <strong>全体で割る：</strong>全体は <M>{'6^3 = 216'}</M> 通りなので、<M>{'30 / 216 = 5/36'}</M>。
          </li>
        </Steps>
        <p>
          回数を n 回にしても、考え方はまったく同じです。手順2の「8」が <M>{'2^n'}</M>、全体の「216」が <M>{'6^n'}</M> に変わるだけです。
        </p>
        <MathBlock caption="n 回投げて、最大値と最小値の差がちょうど 1 になる確率">{'P = \\frac{5 \\times (2^n - 2)}{6^n}'}</MathBlock>
        <Figure caption="n と k を動かして、数え方の流れを確かめる。下の棒グラフは n ごとの確率">
          <MaxMinDiff />
        </Figure>
        <Intuition title="「全部 k」と「全部 k+1」を引くのは、包除の考え方">
          <p>
            「k と k+1 だけでできた出方」から「k しか出ない」「k+1 しか出ない」を除く、というのは加法定理と同じ発想です。
            「1 と 6 が両方とも出る確率」のように「両方とも出る」を数えたいときも、
            <M>{'1 - P(\\text{no } 1) - P(\\text{no } 6) + P(\\text{no } 1, 6)'}</M> のように「引きすぎた重なりを足し戻す」形になります（問題で練習します）。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              「または」はいつも足し算 → 足すだけでよいのは<strong>排反</strong>のときだけ。重なりがあれば <M>{'P(A \\cap B)'}</M> を引きます。
            </li>
            <li>
              「少なくとも1回」を「1回出る確率 × 回数」で計算する → <M>{'1/6 \\times 3 = 1/2'}</M> は間違い。重なり（2回以上出る場合）を何度も数えています。余事象を使いましょう。
            </li>
            <li>
              サイコロ2個の (1,2) と (2,1) を同じものとして数える → 2個を区別して36通りで数えないと、「同様に確からしい」が成り立ちません。
            </li>
            <li>
              「差がちょうど1」を「k と k+1 だけ」とだけ数えて、全部同じ目の場合を引き忘れる。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>サイコロ・コイン・くじで、加法定理や余事象を使って確率を求める問題。</li>
            <li>「少なくとも1つ」「どれか1つ以上」は、まず余事象を疑う。</li>
            <li>ベン図や表を描いて、重なりを数え間違えないようにするのが一番の近道です。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
