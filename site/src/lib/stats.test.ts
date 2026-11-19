import { describe, expect, it } from 'vitest'
import { normalCdf } from './stats'

// scipy との数値の一致は scripts/verify-stats.py（npm run verify）で確かめる。ここでは端の扱いだけ
describe('正規分布の累積分布関数', () => {
  it('無限大を渡すと 0 か 1 を返す（NaN にならない）', () => {
    expect(normalCdf(Infinity)).toBe(1)
    expect(normalCdf(-Infinity)).toBe(0)
    expect(normalCdf(Infinity, 50, 10)).toBe(1)
  })
})
