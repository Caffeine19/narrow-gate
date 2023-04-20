import { Record } from '@prisma/client'
import prisma from './main'

export const createRecord = async (
  begin: Record['begin'],
  end: Record['end'],
  bookId: Record['bookId']
) => {
  try {
    const createdRecord = await prisma.record.create({
      data: {
        begin,
        end,
        bookId
      }
    })

    return createdRecord
  } catch (error) {
    console.log('🚀 ~ file: reading.ts:20 ~ error:', error)
  }
}
