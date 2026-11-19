import { Card, Compare, DataTable, Example, ExamTip, Figure, Intuition, MathNote, Pitfall, Point, Section, Steps } from '../../../components/blocks'
import { M, MathBlock } from '../../../components/Math'
import type { LessonMeta } from '../../../types'
import { BinomialExplorer, SequenceList } from '../figures/BinomialFigures'

export const meta: LessonMeta = {
  id: 'distributions-binomial',
  chapter: 'distributions',
  order: 1,
  title: 'ベルヌーイ試行と二項分布',
  summary: '「成功か失敗か」を何回かくり返したとき、成功が何回起こるかの確率を表す分布です。',
  minutes: 30,
  keywords: ['ベルヌーイ試行', '二項分布', 'B(n,p)'],
}

export default function Lesson() {
  return (
    <>
      <Point>
        <p>
          結果が「成功か失敗か」の2つしかない試しを<strong>ベルヌーイ試行</strong>といいます。これを同じ条件で <M>n</M> 回くり返したとき、
          <strong>成功した回数</strong>が従う分布が<strong>二項分布</strong> <M>{'B(n, p)'}</M> です。
          確率は「並び方の数 × 1通りの並びの確率」で求まり、期待値は <M>np</M>、分散は <M>{'np(1-p)'}</M> です。
        </p>
      </Point>

      <Section title="どんな場面で使う分布か">
        <p>次のような「◯回中、何回うまくいくか」を数える場面で使います。</p>
        <ul>
          <li>コインを10回投げて、表が出る回数</li>
          <li>成功率70%の選手がフリースローを5本打って、入る本数</li>
          <li>不良品が2%の工場から製品を50個取り出したときの、不良品の個数</li>
          <li>アンケートで「はい」と答える人が30%の集団から、20人に聞いたときの「はい」の人数</li>
        </ul>
        <p>二項分布を使ってよいのは、次の3つがそろっているときです。</p>
        <Steps>
          <li>1回ごとの結果が「成功」「失敗」の2通り（これがベルヌーイ試行）</li>
          <li>成功の確率 <M>p</M> が毎回同じ</li>
          <li>各回の結果がおたがいに影響しない（独立）</li>
        </Steps>
        <Pitfall title="「成功」はよい意味でなくてよい">
          <p>
            「成功」は「数えたいほうの結果」という意味のラベルです。不良品の個数を数えるなら、不良品が出ることを「成功」と呼びます。
          </p>
        </Pitfall>
      </Section>

      <Section title="具体例：コインを3回投げて、表がちょうど1回">
        <p>表を ○、裏を × とします。3回中ちょうど1回だけ ○ になる並び方は、次の3通りです。</p>
        <DataTable
          head={['並び方', '1通りの確率']}
          rows={[
            ['○ × ×', '0.5 × 0.5 × 0.5 = 0.125'],
            ['× ○ ×', '0.5 × 0.5 × 0.5 = 0.125'],
            ['× × ○', '0.5 × 0.5 × 0.5 = 0.125'],
            [<strong key="s">合計</strong>, <strong key="t">3 × 0.125 = 0.375</strong>],
          ]}
          caption="3回中1回だけ表が出る確率"
        />
        <p>
          どの並びも確率は同じなので、<strong>「並び方の数（3通り）× 1通りの確率（0.125）」</strong>で答えが出ます。これが二項分布の式の正体です。
        </p>
        <Figure caption="4回の試行で、成功（○）がちょうど k 回になる並び方をすべて表示。右の数字が1通りの確率。どの並びも同じ確率なので、まとめてかけ算できる">
          <SequenceList n={4} />
        </Figure>
      </Section>

      <Section title="定義・式">
        <p>
          成功確率 <M>p</M> のベルヌーイ試行を <M>n</M> 回くり返したときの成功回数を <M>X</M> とすると、<M>X</M> がちょうど <M>k</M> になる確率は次の式です。
          このとき「<M>X</M> は二項分布 <M>{'B(n, p)'}</M> に従う」といい、<M>{'X \\sim B(n, p)'}</M> と書きます（<M>{'\\sim'}</M> は「〜に従う」の記号）。
        </p>
        <MathBlock caption="n 回中ちょうど k 回成功する確率（k = 0, 1, …, n）">{'P(X = k) = {}_{n}C_{k}\\, p^{k} (1-p)^{n-k}'}</MathBlock>
        <DataTable
          head={['式の部分', '意味']}
          rows={[
            [<M key="a">{'{}_{n}C_{k}'}</M>, 'n 回のうち、どの k 回が成功かの「並び方の数」'],
            [<M key="b">{'p^{k}'}</M>, '成功が k 回起こる確率（p を k 回かける）'],
            [<M key="c">{'(1-p)^{n-k}'}</M>, '残りの n − k 回が失敗する確率'],
          ]}
        />
        <MathNote title="nCk の計算（復習）">
          <p>
            <M>{'{}_{n}C_{k} = \\dfrac{n!}{k!\\,(n-k)!}'}</M>。たとえば <M>{'{}_{5}C_{2} = \\dfrac{5 \\times 4}{2 \\times 1} = 10'}</M>。
            「上から k 個かけたもの ÷ k から1までかけたもの」と覚えると計算が速いです。
          </p>
        </MathNote>
        <MathBlock caption="二項分布の期待値（平均）と分散">{'E(X) = np, \\qquad V(X) = np(1-p)'}</MathBlock>
        <p>
          パラメータ（分布の形を決める数）は2つです。<M>n</M> は「何回試すか」、<M>p</M> は「1回あたりの成功確率」。この2つが決まれば、分布の形がすべて決まります。
        </p>
      </Section>

      <Section title="具体例：フリースロー5本">
        <Example title="成功率 0.7 の選手が5本打つ">
          <p>
            入る本数を <M>X</M> とすると <M>{'X \\sim B(5, 0.7)'}</M>。ちょうど3本入る確率は
          </p>
          <MathBlock>{'P(X=3) = {}_{5}C_{3} \\times 0.7^3 \\times 0.3^2 = 10 \\times 0.343 \\times 0.09 = 0.3087'}</MathBlock>
          <p>
            平均して入る本数は <M>{'5 \\times 0.7 = 3.5'}</M> 本、分散は <M>{'5 \\times 0.7 \\times 0.3 = 1.05'}</M> です。
          </p>
        </Example>
        <DataTable
          head={['入る本数 k', '0', '1', '2', '3', '4', '5']}
          rows={[['確率', '0.00243', '0.02835', '0.1323', '0.3087', '0.36015', '0.16807']]}
          caption="B(5, 0.7) の確率（ちょうどの値。合計は1）"
        />
      </Section>

      <Section title="直感的な理解">
        <Intuition title="期待値が np になるわけ：1回ずつの「成功したら1」を足す">
          <p>
            1回のベルヌーイ試行で「成功なら1、失敗なら0」とする数を考えます。この平均は <M>{'1 \\times p + 0 \\times (1-p) = p'}</M>、
            分散は <M>{'p(1-p)'}</M> です。二項分布の <M>X</M> は、この「0か1」を <M>n</M> 回分足したものです。
          </p>
          <MathBlock caption="X は n 個のベルヌーイの和">{'X = X_1 + X_2 + \\cdots + X_n'}</MathBlock>
          <p>
            期待値は足し算できるので <M>{'p + p + \\cdots + p = np'}</M>。各回は独立なので分散も足し算できて <M>{'np(1-p)'}</M> になります。
          </p>
        </Intuition>
        <Compare>
          <Card title="1回の試行（ベルヌーイ分布）">
            <p>
              とる値は 0 か 1。平均 <M>p</M>、分散 <M>{'p(1-p)'}</M>。
            </p>
          </Card>
          <Card title="n 回の合計（二項分布）">
            <p>
              とる値は 0〜n。平均 <M>np</M>、分散 <M>{'np(1-p)'}</M>。
            </p>
          </Card>
        </Compare>
        <Figure caption="n と p を動かしてみよう。p = 0.5 なら左右対称、p が小さいと左に寄り、大きいと右に寄る。n を大きくすると山が右へ動き、なだらかな「つりがね形」に近づく">
          <BinomialExplorer />
        </Figure>
        <Intuition title="分散 np(1−p) は p = 0.5 のとき最大">
          <p>
            <M>{'p(1-p)'}</M> は <M>{'p = 0.5'}</M> で最大の 0.25 になります。成功と失敗が五分五分のときがいちばん結果がばらつき、
            <M>p</M> が 0 や 1 に近いと「ほぼ毎回失敗（成功）」で結果がそろいます。
          </p>
        </Intuition>
      </Section>

      <Section title="よくある勘違い">
        <Pitfall>
          <ul>
            <li>
              <M>{'{}_{n}C_{k}'}</M> を忘れて <M>{'p^k(1-p)^{n-k}'}</M> だけで答える → それは「ある1つの並び方」の確率です。
            </li>
            <li>
              分散を <M>np</M> や <M>{'np^2'}</M> とする → 正しくは <M>{'np(1-p)'}</M>。標準偏差はそのルート <M>{'\\sqrt{np(1-p)}'}</M>。
            </li>
            <li>
              「少なくとも1回」をひとつずつ足す → <M>{'1 - P(X = 0) = 1 - (1-p)^n'}</M>（余事象）を使うほうが速く確実です。
            </li>
            <li>
              袋から<strong>戻さずに</strong>取り出す場合にも二項分布を使う → 毎回の確率が変わるので、正確には超幾何分布です（このあとのレッスンで扱います）。
            </li>
          </ul>
        </Pitfall>
      </Section>

      <Section title="統計検定での出方">
        <ExamTip>
          <ul>
            <li>「◯回中ちょうど k 回」「k 回以上」の確率を計算させる問題。k 回以上は、少ない側を足して1から引くと楽なことが多い。</li>
            <li>期待値・分散から <M>n</M> と <M>p</M> を逆算する問題（分散 ÷ 期待値 = <M>{'1-p'}</M>）。</li>
            <li>
              成功の割合 <M>{'X/n'}</M> の期待値 <M>p</M>・分散 <M>{'p(1-p)/n'}</M> を問う問題。後の「標本分布」「母比率の推定」につながります。
            </li>
            <li>n が大きいときに正規分布で近似する問題（「標本分布」の章で扱います）。</li>
          </ul>
        </ExamTip>
      </Section>
    </>
  )
}
