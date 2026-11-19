// 図の中で使う小さな行列計算。説明変数が数個の回帰しか扱わないので、ガウスの消去法で十分。

/** 連立方程式 A b = y を解く（部分ピボット選択つきのガウスの消去法） */
export function solve(A: number[][], y: number[]): number[] {
  const n = y.length
  const M = A.map((row, i) => [...row, y[i]])
  for (let c = 0; c < n; c++) {
    let p = c
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r
    ;[M[c], M[p]] = [M[p], M[c]]
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c]
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]
    }
  }
  const b = Array.from({ length: n }, () => 0)
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n]
    for (let k = r + 1; k < n; k++) s -= M[r][k] * b[k]
    b[r] = s / M[r][r]
  }
  return b
}

/** X'X と X'y（X は行がデータ、列が変数） */
export function crossProducts(X: number[][], y: number[]): { xtx: number[][]; xty: number[] } {
  const p = X[0].length
  const xtx = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => X.reduce((s, row) => s + row[i] * row[j], 0)))
  const xty = Array.from({ length: p }, (_, i) => X.reduce((s, row, k) => s + row[i] * y[k], 0))
  return { xtx, xty }
}

/** 重みつき最小二乗法。weights を省くと普通の最小二乗法 */
export function leastSquares(X: number[][], y: number[], weights?: number[]): number[] {
  const w = weights ?? y.map(() => 1)
  const Xw = X.map((row, k) => row.map((v) => v * Math.sqrt(w[k])))
  const yw = y.map((v, k) => v * Math.sqrt(w[k]))
  const { xtx, xty } = crossProducts(Xw, yw)
  return solve(xtx, xty)
}

/** 平均0・標準偏差1（n で割る）にそろえる */
export function standardize(v: number[]): number[] {
  const m = v.reduce((s, a) => s + a, 0) / v.length
  const sd = Math.sqrt(v.reduce((s, a) => s + (a - m) ** 2, 0) / v.length)
  return v.map((a) => (a - m) / sd)
}
