// 図の読み取り欄（figure-readout）で数を表示するための書式。

/** 小数第 d 位までの表示（-0 を 0 にする） */
export const fix = (v: number, d = 2) => {
  const t = v.toFixed(d)
  return Number(t) === 0 ? (0).toFixed(d) : t
}
