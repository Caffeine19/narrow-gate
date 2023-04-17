import type { Reading } from '@prisma/client'
export type ReadingCreateParams = Partial<Omit<Reading, 'id'>>
