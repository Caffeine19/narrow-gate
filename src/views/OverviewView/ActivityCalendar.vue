<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { storeToRefs } from 'pinia'
import { useRecordStore } from '@/stores/record'

import type { ActivityLevel } from '@/types/ActivityLevel'

dayjs.extend(duration)

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const generateActivityColor = (duration: number) => {
  if (duration == 0) {
    return 'bg-tea-400/10'
  } else if (duration > 0 && duration < 10) {
    return 'bg-tea-700'
  } else if (duration > 10 && duration < 20) {
    return 'bg-tea-600'
  } else if (duration > 20 && duration < 30) {
    return 'bg-tea-500'
  } else {
    return 'bg-tea-400'
  }
}

const recordStore = useRecordStore()
const { monthlyRecordActivity } = storeToRefs(recordStore)
</script>
<template>
  <table class="mx-auto">
    <tr v-for="(day, i) in week" :key="i">
      <td>{{ day }}</td>
      <td v-for="(item, j) in 6" :key="j">
        <div
          class="h-7 w-12 rounded"
          :class="generateActivityColor(monthlyRecordActivity[i + (j - 1) * 6]?.val?.duration || 0)"
        ></div>
      </td>
    </tr>

    <tr>
      <td></td>
      <td>1st</td>
      <td>2nd</td>
      <td>3rd</td>
      <td>4th</td>
      <td>5th</td>
    </tr>
  </table>
</template>
<style scoped>
td {
  @apply text-zinc-300 px-1.5 py-1.5;
}
</style>
