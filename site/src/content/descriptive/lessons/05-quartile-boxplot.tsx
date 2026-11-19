import { Link } from 'react-router-dom'
import { DataTable, Example, ExamTip, Figure, Intuition, Note, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BoxPlotX, HistBox, HistBoxGallery, QuartileDots } from '../figures/BoxFigures'
import { WAIT_TIMES, summarize } from '../figures/summary'

export const meta: LessonMeta = {
  id: 'descriptive-quartile-boxplot',
  chapter: 'descriptive',
  order: 5,
  title: '範囲・四分位数・箱ひげ図',
  summary: 'データを4等分する区切りの値を使って、散らばりと分布の形を1本の図にまとめます。',
  minutes: 30,
  keywords: ['範囲（最小値・最大値）', '四分位数', '四分位範囲', '箱ひげ図', '外れ値', '2つのグラフの視覚的比較'],
}

const EVEN = [3, 5, 6, 8, 9, 11, 12, 14, 15, 30]

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          データを小さい順に並べて<strong>4等分する3つの区切り</strong>が四分位数です。最小値・第1四分位数・中央値・第3四分位数・最大値の5つの数を1本の図にしたのが
          <strong>箱ひげ図</strong>で、分布の中心・散らばり・偏りをひと目で比べられます。
        </p>
      </Point>

      <Section title="範囲：いちばん簡単な散らばりの目安">
        <p>
          <strong>範囲</strong>（レンジ）は「最大値 − 最小値」です。データ 2, 4, 5, 7, 8, 10, 12, 13, 18 の範囲は <M>{'18 - 2 = 16'}</M>。
          計算は簡単ですが、両端の2つの値しか使わないので、とびぬけた値が1つあるだけで大きく変わってしまいます。
        </p>
      </Section>

      <Section title="四分位数の求め方">
        <p>
          中央値でデータを<strong>前半と後半</strong>に分け、前半の中央値を<strong>第1四分位数 Q1</strong>、後半の中央値を<strong>第3四分位数 Q3</strong>とします。
          中央値そのものが<strong>第2四分位数 Q2</strong>です。Q は英語の quartile（クォータイル＝四分位数）の頭文字です。
          小さいほうから約25%の位置が Q1、50%が Q2、75%が Q3 になります。
        </p>
        <Steps>
          <li>データを小さい順に並べる。</li>
          <li>中央値（Q2）を求める。</li>
          <li>
            中央値より前の半分・後ろの半分に分ける。<strong>データ数が奇数のときは、真ん中の値はどちらにも入れない</strong>。
          </li>
          <li>前半の中央値が Q1、後半の中央値が Q3。</li>
        </Steps>
        <Figure caption="データの個数 n を変えて、どこで区切るかを見てみよう（青＝前半、オレンジ＝中央、緑＝後半）">
          <QuartileDots />
        </Figure>
        <Example title="奇数個（9個）：2, 4, 5, 7, 8, 10, 12, 13, 18">
          <p>
            中央値は5番目の <strong>8</strong>。前半 2, 4, 5, 7 の中央値は <M>{'(4+5) \\div 2 = 4.5'}</M>（Q1）、
            後半 10, 12, 13, 18 の中央値は <M>{'(12+13) \\div 2 = 12.5'}</M>（Q3）です。
          </p>
        </Example>
        <Example title="偶数個（10個）：3, 5, 6, 8, 9, 11, 12, 14, 15, 30">
          <p>
            中央値は5番目と6番目の平均 <M>{'(9+11) \\div 2 = 10'}</M>。前半 3, 5, 6, 8, 9 の中央値 <strong>6</strong> が Q1、
            後半 11, 12, 14, 15, 30 の中央値 <strong>14</strong> が Q3 です。
          </p>
        </Example>
        <Note title="四分位数の求め方には流儀がある">
          <p>
            ここで説明したのは、統計WEB（https://bellcurve.jp/statistics/course/5224.html 、5226.html、参照日 2026-11-19）の箱ひげ図の解説と同じ方法です。
            統計ソフトや表計算ソフトには別の決め方（間の値を比例で補う方法など）もあり、同じデータでも Q1・Q3 が少し違う値になることがあります。
            たとえば上の9個のデータでは、Python の numpy の既定の方法だと Q1 = 5、Q3 = 12 になります。試験の問題では、求め方が書かれていればそれに従いましょう。
            ヒストグラムとの対応を問う問題のように「どの階級に入るか」だけを見る問題なら、流儀の違いで答えが変わることはまずありません。
          </p>
        </Note>
      </Section>

      <Section title="四分位範囲と外れ値">
        <MathBlock caption="四分位範囲：真ん中の50%のデータが入る幅（IQR は英語 interquartile range の略）">{'IQR = Q_3 - Q_1'}</MathBlock>
        <p>
          四分位範囲（IQR）は真ん中の半分のデータだけで決まるので、範囲とちがって外れ値の影響をほとんど受けません。
          偶数個の例なら <M>{'14 - 6 = 8'}</M> です（範囲は <M>{'30 - 3 = 27'}</M> と大きく出ます）。
        </p>
        <p>
          箱ひげ図では、箱の端から <strong>四分位範囲の1.5倍</strong> より外にある値を<strong>外れ値</strong>として点で描くことがよくあります。
        </p>
        <MathBlock caption="左の値から右の値まで（〜）の外にある値を外れ値とみなす（よく使われる目安）">{'Q_1 - 1.5 \\times IQR \\quad \\sim \\quad Q_3 + 1.5 \\times IQR'}</MathBlock>
        <p>
          偶数個の例では IQR = 8 なので、その1.5倍は <M>{'1.5 \\times 8 = 12'}</M>。下の基準は <M>{'6 - 12 = -6'}</M>、上の基準は <M>{'14 + 12 = 26'}</M> です。
          −6 から 26 までの外にある 30 が外れ値になります。
        </p>
      </Section>

      <Section title="箱ひげ図の読み方">
        <Figure caption="偶数個の例（3, 5, 6, 8, 9, 11, 12, 14, 15, 30）の箱ひげ図。上は外れ値を区別しない描き方、下は外れ値を○で描く描き方">
          <BoxPlotX
            boxes={[summarize(EVEN, '最小値〜最大値までひげをのばす'), summarize(EVEN, '外れ値を○で描く', true)]}
            x={[0, 32]}
            xTicks={[0, 5, 10, 15, 20, 25, 30]}
            colors={['c1', 'c2']}
          />
        </Figure>
        <DataTable
          head={['図の部分', '表している値']}
          rows={[
            ['箱の左端', '第1四分位数 Q1（下から25%）'],
            ['箱の中の線', '中央値 Q2（50%）'],
            ['箱の右端', '第3四分位数 Q3（下から75%）'],
            ['箱の長さ', '四分位範囲 Q3 − Q1（真ん中の50%）'],
            ['ひげの両端', '最小値と最大値（外れ値を描くときは、外れ値を除いた最小値・最大値）'],
          ]}
        />
        <Intuition title="4つの区間には同じ人数が入る">
          <p>
            「左のひげ」「箱の左半分」「箱の右半分」「右のひげ」には、それぞれ<strong>約25%ずつ</strong>のデータが入ります。
            だから<strong>長い部分ほどデータがまばら</strong>、短い部分ほどぎっしり詰まっている、と読みます。
          </p>
        </Intuition>
        <p className="small muted">
          ※ 外れ値を描くかどうか、平均を「+」で描くかどうかは図によって違います。図の説明を確かめましょう。
        </p>
      </Section>

      <Section title="ヒストグラムと箱ひげ図の対応">
        <p>同じデータのヒストグラムと箱ひげ図を、横軸をそろえて上下に並べました。縦の線は Q1・中央値・Q3 の位置です。</p>
        <Figure caption="分布の形と箱ひげ図の形。裾が長い側のひげが長くなり、中央値は山の側に寄る">
          <HistBoxGallery />
        </Figure>
        <ul>
          <li>左右対称なら、中央値は箱のほぼ真ん中、ひげの長さもほぼ同じ。</li>
          <li>右に裾が長いなら、<strong>右のひげが長く</strong>、中央値は箱の<strong>左寄り</strong>。</li>
          <li>左に裾が長いなら、その逆。</li>
        </ul>
        <Example title="待ち時間 50人分">
          <p>右に裾が長いデータです。いちばん右の 30分 は外れ値として○で描いています。棒の上の数は人数です。</p>
          <HistBox
            data={WAIT_TIMES}
            x={[0, 35]}
            binWidth={5}
            xTicks={[0, 5, 10, 15, 20, 25, 30, 35]}
            withOutliers
            showLabels
          />
          <p>ヒストグラムの数だけから、Q1・中央値・Q3 がどの階級に入るかを確かめてみます。</p>
          <Steps>
            <li>
              度数を左から足して<Link to="/lessons/descriptive-histogram">累積度数</Link>をつくる：5, 23, 39, 47, 49, 49, 50（「5分未満が5人」「10分未満が23人」…）。
            </li>
            <li>
              中央値は50人の真ん中、25番目と26番目の平均。10分未満が23人なので、24番目〜39番目は 10〜15分の階級。中央値はこの階級に入る（実際は10分）。
            </li>
            <li>
              Q1 は前半25人の真ん中＝13番目。6番目〜23番目が 5〜10分なので、Q1 は 5〜10分の階級（実際は6分）。
            </li>
            <li>
              Q3 は後半25人（26番目〜50番目）の真ん中＝38番目。これも 10〜15分の階級（実際は14分）。
            </li>
          </Steps>
          <p>
            箱の左半分（6〜10分）と右半分（10〜14分）は同じ4分の幅ですが、右のひげ（14分から24分までの10分）は左のひげ（3分から6分までの3分）よりずっと長く、
            右に裾が長い形が箱ひげ図にも表れています。
          </p>
        </Example>
        <Note title="ヒストグラムには出ない情報">
          <p>
            箱ひげ図は5つの数だけで描くので、<strong>山が2つある</strong>ことなどは箱ひげ図からはわかりません。
            逆に、いくつものグループを並べて<strong>中心と散らばりを比べる</strong>のは箱ひげ図のほうが得意です。
          </p>
        </Note>
      </Section>

      <Section title="箱ひげ図で比べる（2つ以上のグラフの視覚的比較）">
        <p>
          いくつかのグループを箱ひげ図で並べたときは、次の順に見比べます。
        </p>
        <Steps>
          <li><strong>中心</strong>：中央値の線の位置（右にあるほど値が大きいグループ）。</li>
          <li><strong>散らばり</strong>：箱の長さ（四分位範囲）とひげの端から端（範囲）。</li>
          <li><strong>形</strong>：箱の中の中央値の位置と、左右のひげの長さの違い（長いほうに裾がのびている）。</li>
          <li><strong>割合</strong>：「◯点以上が半数以上」は中央値、「◯点以上が4分の1以上」は Q3 と比べて判断する。</li>
        </Steps>
        <Figure caption="3つのクラスの数学のテスト（架空のデータ）">
          <BoxPlotX
            boxes={[
              { label: '1組', min: 28, q1: 48, median: 60, q3: 70, max: 94 },
              { label: '2組', min: 40, q1: 55, median: 62, q3: 67, max: 82 },
              { label: '3組', min: 25, q1: 38, median: 44, q3: 56, max: 86 },
            ]}
            x={[0, 100]}
            colors={['c1', 'c2', 'c3']}
            xLabel="点数"
          />
        </Figure>
        <ul>
          <li>
            中央値がいちばん高いのは2組（62点）。2組は箱も短く、<strong>点数がそろっている</strong>。
          </li>
          <li>1組は範囲も四分位範囲も大きく、<strong>できる人とできない人の差が大きい</strong>。</li>
          <li>
            3組は中央値（44点）が箱の左寄りで、右のひげが長い。<strong>右に裾が長い</strong>分布だと考えられる。
          </li>
          <li>平均点は箱ひげ図からはわからない（「+」で平均が描かれていれば別）。</li>
        </ul>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>箱が長いグループは人数が多い → 箱の長さは<strong>散らばり</strong>。人数はどのグループでも各区間に約25%ずつです。</li>
            <li>ひげが長い部分にたくさんデータがある → 逆で、長い区間ほどデータが<strong>まばら</strong>です。</li>
            <li>Q1 は「最小値と中央値の真ん中の値」→ 値の真ん中ではなく、前半のデータの<strong>順番の真ん中</strong>です。</li>
            <li>中央値の線が箱の真ん中にあれば必ず左右対称 → 箱の中は対称でも、ひげの長さが違えば裾は非対称です。</li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>
              <strong>ヒストグラムと箱ひげ図の対応</strong>を選ぶ問題（2級で頻出）。中央値・Q1・Q3 がどの階級に入るかを累積度数で確かめるのが確実。
            </li>
            <li>いくつかのグループの箱ひげ図を見て、正しい記述を選ぶ問題（範囲・四分位範囲・中央値の比較、「◯点以上が半数以上」など）。</li>
            <li>少ないデータから四分位数・四分位範囲を求める問題、外れ値の基準（1.5 × IQR）を使う問題。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
