import { Record } from '@prisma/client'

import * as dayjs from 'dayjs'

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

export const getRecordDurationAmount = async () => {
  try {
    const recordDuration = await prisma.record.findMany({ select: { duration: true } })

    const recordDurationAmount = recordDuration.reduce((acc, cur) => {
      return acc + cur.duration
    }, 0)
    return recordDurationAmount
    return
  } catch (error) {
    console.log('🚀 ~ file: record.ts:31 ~ getRecordDurationAmount ~ error:', error)
  }
}

type RecordGroupedByDay = {
  [key: string]: Record[]
}

export const getMonthlyRecordActivity = async (month: string) => {
  console.log('🚀 ~ file: record.ts:48 ~ getMonthlyRecordActivity ~ month:', month)
  try {
    const begin = dayjs(month).format('YYYY-MM-DD')
    const end = dayjs(month).add(1, 'month').format('YYYY-MM-DD')
    const recordList = await prisma.record.findMany({
      where: {
        begin: {
          lte: new Date(end),
          gte: new Date(begin)
        }
      }
    })

    console.log('🚀 ~ file: record.ts:50 ~ getMonthlyRecordActivity ~ recordList:', recordList)

    const a = recordList.reduce((acc, cur) => {
      const key = dayjs(cur.begin).format('YYYY-MM-DD')
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(cur)
      return acc
    }, {} as RecordGroupedByDay)
    console.log('🚀 ~ file: record.ts:66 ~ a ~ a:', a)

    const b = Object.entries(a).map(([key, value]) => {
      return { key: key, val: value }
    })
    console.log('🚀 ~ file: record.ts:71 ~ b ~ b:', b)

    const c = b.map((day) => {
      const val = day.val.reduce(
        (acc, cur) => {
          acc.duration = acc.duration + cur.duration
          acc.times++
          return acc
        },
        { times: 0, duration: 0 }
      )
      return { key: day.key, val }
    })
    console.log('🚀 ~ file: record.ts:84 ~ c ~ c:', c)

    return c
  } catch (error) {
    console.log('🚀 ~ file: record.ts:44 ~ getMonthlyRecordActivity ~ error:', error)
  }
}

export const getDailyRecords = async (begin: string, end: string) => {
  try {
    const dailyRecords = await prisma.record.findMany({
      where: {
        begin: { lte: new Date(end), gte: new Date(begin) }
      },
      include: {
        book: {
          select: {
            title: true,
            creator: true
          }
        }
      }
    })
    console.log('🚀 ~ file: record.ts:112 ~ getDailyRecords ~ dailyRecords:', dailyRecords)

    return dailyRecords
  } catch (error) {
    console.log('🚀 ~ file: record.ts:101 ~ getDailyRecords ~ error:', error)
  }
}
