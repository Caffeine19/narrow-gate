import type { Record } from '@prisma/client'
export type RecordCreateParams = Partial<Omit<Record, 'id'>>
export type RecordGap = Omit<Record, 'id' | 'bookId' | 'duration'>
export type RecordActivity = {
  times: number
  duration: Record['duration']
}
