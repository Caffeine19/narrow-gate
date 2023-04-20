import type { Record } from '@prisma/client'
export type RecordCreateParams = Partial<Omit<Record, 'id'>>
