import type { ComponentType } from 'react'
import { Grade2Guide } from './grade2'
import { Pre1Guide } from './pre1'

// コースごとの「試験と学習の進め方」。ないコースは試験案内ページで準備中と表示する。
export const guides: Record<string, ComponentType> = {
  grade2: Grade2Guide,
  pre1: Pre1Guide,
}
