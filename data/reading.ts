import { Reading } from '@prisma/client'
import prisma from './main'

export const createReading = async (
  begin: Reading['begin'],
  end: Reading['end'],
  bookId: Reading['bookId']
) => {
  try {
    const createdReading = await prisma.reading.create({
      data: {
        begin,
        end,
        bookId
      }
    })

    return createdReading
  } catch (error) {
    console.log('🚀 ~ file: reading.ts:20 ~ error:', error)
  }
}
