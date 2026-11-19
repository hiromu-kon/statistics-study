import { C, ROutput } from './ROutput'

// 数値は glmData.ts のデータを numpy（ニュートン法）と scipy で計算した値。表示の形は R の summary(glm(...)) に似せた。
// 繰り返しの回数は、R の glm.fit と同じ初期値（二項は (y + 0.5)/2、ポアソンは y + 0.1）と収束判定 |dev − devold|/(|dev| + 0.1) < 1e-8 で数えた値。

export function LogisticSummary() {
  return (
    <ROutput label="R のロジスティック回帰の出力の例">
      {'Call:\nglm(formula = pass ~ hours, family = binomial)\n\nCoefficients:\n            '}
      <C c="c1">Estimate</C> <C c="c2">Std. Error</C> <C c="c3">z value</C> <C c="c4">Pr(&gt;|z|)</C>
      {'  \n(Intercept)  '}
      <C c="c1">-4.5718</C>
      {'     '}
      <C c="c2">2.0085</C>
      {'  '}
      <C c="c3">-2.276</C>
      {'   '}
      <C c="c4">0.0228</C>
      {' *\nhours         '}
      <C c="c1">0.8708</C>
      {'     '}
      <C c="c2">0.3608</C>
      {'   '}
      <C c="c3">2.414</C>
      {'   '}
      <C c="c4">0.0158</C>
      {" *\n---\nSignif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1\n\n(Dispersion parameter for binomial family taken to be 1)\n\n    "}
      <C c="c5">Null deviance: 27.726  on 19  degrees of freedom</C>
      {'\n'}
      <C c="c5">Residual deviance: 14.369  on 18  degrees of freedom</C>
      {'\n'}
      <C c="c2">AIC: 18.369</C>
      {'\n\nNumber of Fisher Scoring iterations: 5'}
    </ROutput>
  )
}

export function PoissonSummary() {
  return (
    <ROutput label="R のポアソン回帰の出力の例">
      {'Call:\nglm(formula = count ~ traffic, family = poisson)\n\nCoefficients:\n            '}
      <C c="c1">Estimate</C> <C c="c2">Std. Error</C> <C c="c3">z value</C> <C c="c4">Pr(&gt;|z|)</C>
      {'    \n(Intercept)  '}
      <C c="c1">0.28453</C>
      {'    '}
      <C c="c2">0.35547</C>
      {'   '}
      <C c="c3">0.800</C>
      {'    '}
      <C c="c4">0.423</C>
      {'    \ntraffic      '}
      <C c="c1">0.12530</C>
      {'    '}
      <C c="c2">0.02989</C>
      {'   '}
      <C c="c3">4.192</C>
      {' '}
      <C c="c4">2.76e-05</C>
      {" ***\n---\nSignif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1\n\n(Dispersion parameter for poisson family taken to be 1)\n\n    "}
      <C c="c5">Null deviance: 28.157  on 14  degrees of freedom</C>
      {'\n'}
      <C c="c5">Residual deviance:  9.038  on 13  degrees of freedom</C>
      {'\n'}
      <C c="c2">AIC: 61.338</C>
      {'\n\nNumber of Fisher Scoring iterations: 4'}
    </ROutput>
  )
}
