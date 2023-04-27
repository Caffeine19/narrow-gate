import { computed, ref } from 'vue'

import { defineStore } from 'pinia'

import type { BookCover } from '@/types/book'
import type { RecordActivity, RecordCreateParams, RecordGap } from '@/types/record'
import dayjs from 'dayjs'

export const useRecordStore = defineStore('record', () => {
  const record = ref<RecordCreateParams>({})
  const recordGaps = ref<RecordGap[]>([])
  const isRecording = ref(false)

  const recordDuration = computed(() => {
    return recordGaps.value.reduce((acc, cur) => {
      return acc + (cur.end.getTime() - cur.begin.getTime())
    }, 0)
  })

  const addRecordGap = () => {
    recordGaps.value.push({ begin: new Date(), end: new Date() })
  }
  const setLastRecordGapEnd = () => {
    recordGaps.value[recordGaps.value.length - 1].end = new Date()
  }

  const createRecord = (id: BookCover['id']) => {
    try {
      window.electronAPI.createRecord(
        id,
        recordGaps.value[0].begin,
        recordGaps.value[recordGaps.value.length - 1].end,
        Math.round(dayjs.duration(recordDuration.value).asMinutes())
      )
    } catch (error) {
      console.log('🚀 ~ file: reading.ts:125 ~ addRecord ~ error:', error)
    }
  }

  const recordDurationAmount = ref(0)
  const getRecordDurationAmount = async () => {
    try {
      const res = await window.electronAPI.getRecordDurationAmount()
      console.log('🚀 ~ file: record.ts:43 ~ getRecordDurationAmount ~ res:', res)

      recordDurationAmount.value = res
    } catch (error) {
      console.log('🚀 ~ file: record.ts:44 ~ getRecordDurationAmount ~ error:', error)
    }
  }

  const monthlyRecordActivity = ref<RecordActivity[]>([])
  const getMonthlyRecordActivity = async (month: string): Promise<RecordActivity[]> => {
    try {
      const res = await window.electronAPI.getMonthlyRecordActivity(month)
      console.log('🚀 ~ file: record.ts:55 ~ getMonthlyRecordActivity ~ res:', res)

      const curMonthLen = dayjs(month).daysInMonth()
      const curMonth = Array.from({ length: curMonthLen }, (day, index) =>
        dayjs('2023-04').add(index, 'day').format('YYYY-MM-DD')
      )

      const prevMonthLen = dayjs('2023-04').day() - 1
      const prevMonth = Array.from({ length: prevMonthLen }, (day, index) =>
        dayjs('2023-04')
          .subtract(index + 1, 'day')
          .format('YYYY-MM-DD')
      ).reverse()

      const nextMonthLen = 42 - curMonthLen - prevMonthLen
      const nextMonth = Array.from({ length: nextMonthLen }, (day, index) =>
        dayjs('2023-04')
          .add(index + curMonthLen, 'day')
          .format('YYYY-MM-DD')
      )

      const fullMonth = [...prevMonth, ...curMonth, ...nextMonth]

      const fullMonthVal = fullMonth.map((day) => {
        let val
        res.forEach((d) => {
          if (d.key == day) {
            val = d.val
          }
        })
        return { key: day, val }
      }) as RecordActivity[]
      return fullMonthVal
    } catch (error) {
      console.log('🚀 ~ file: record.ts:56 ~ getMonthlyRecordActivity ~ error:', error)
      throw error
    }
  }
  return {
    record,
    recordDuration,
    isRecording,
    recordGaps,
    addRecordGap,
    setLastRecordGapEnd,
    createRecord,
    recordDurationAmount,
    getRecordDurationAmount,
    monthlyRecordActivity,
    getMonthlyRecordActivity
  }
})
