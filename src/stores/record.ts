import { computed, ref } from 'vue'

import { defineStore } from 'pinia'

import type { BookCover } from '@/types/book'
import type { RecordActivity, RecordCreateParams, RecordGap } from '@/types/record'

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
        recordDuration.value
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
  const getMonthlyRecordActivity = async () => {
    try {
      const res = await window.electronAPI.getMonthlyRecordActivity()
      console.log('🚀 ~ file: record.ts:55 ~ getMonthlyRecordActivity ~ res:', res)
    } catch (error) {
      console.log('🚀 ~ file: record.ts:56 ~ getMonthlyRecordActivity ~ error:', error)
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
