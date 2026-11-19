import * as s from '../src/lib/stats.ts'
const out = {
  normalCdf: [-3, -1.96, -1, 0, 0.5, 1, 1.645, 1.96, 2.576, 3.5].map((x) => s.normalCdf(x)),
  normalQ: [0.9, 0.95, 0.975, 0.995].map((p) => s.normalQuantile(p)),
  tQ: [[0.975, 1], [0.975, 5], [0.95, 10], [0.975, 29], [0.995, 120]].map(([p, d]) => s.tQuantile(p, d)),
  tCdf: [[-2, 3], [1.5, 8]].map(([x, d]) => s.tCdf(x, d)),
  chi2Q: [[0.025, 1], [0.975, 1], [0.95, 3], [0.05, 10], [0.975, 30], [0.99, 100]].map(([p, d]) => s.chi2Quantile(p, d)),
  fQ: [[0.95, 2, 10], [0.975, 5, 8], [0.99, 1, 20], [0.95, 10, 3]].map(([p, a, b]) => s.fQuantile(p, a, b)),
  binom: s.binomialPmf(3, 10, 0.3), pois: s.poissonPmf(4, 2.5),
  gammaPdf: [[1.5, 2, 1], [3, 0.5, 2], [0.7, 3.5, 0.5]].map(([x, k, t]) => s.gammaPdf(x, k, t)),
  gammaCdf: [[1.5, 2, 1], [3, 0.5, 2], [4, 3.5, 0.5]].map(([x, k, t]) => s.gammaCdf(x, k, t)),
  betaPdf: [[0.3, 2, 5], [0.8, 0.5, 0.5], [0.5, 3, 3]].map(([x, a, b]) => s.betaPdf(x, a, b)),
  betaCdf: [[0.3, 2, 5], [0.8, 0.5, 0.5], [0.5, 3, 3]].map(([x, a, b]) => s.betaCdf(x, a, b)),
  cauchyPdf: [[0, 0, 1], [2, 1, 0.5]].map(([x, a, g]) => s.cauchyPdf(x, a, g)),
  logNormalPdf: [[1, 0, 1], [2.5, 0.5, 0.8]].map(([x, m, sg]) => s.logNormalPdf(x, m, sg)),
  binomialCdf: [s.binomialCdf(3, 10, 0.3), s.binomialCdf(7, 20, 0.5)],
  poissonCdf: [s.poissonCdf(4, 2.5), s.poissonCdf(0, 1.2)],
}
console.log(JSON.stringify(out))
