import { Record } from '@prisma/client'
import prisma from './main'

export const createRecord = async (
  bookId: Record['bookId'],
  begin: Record['begin'],
  end: Record['end'],
  duration: Record['duration']
) => {
  try {
    const createdRecord = await prisma.record.create({
      data: {
        begin,
        end,
        duration,
        bookId
      }
    })

    return createdRecord
  } catch (error) {
    console.log('🚀 ~ file: reading.ts:20 ~ error:', error)
  }
}
