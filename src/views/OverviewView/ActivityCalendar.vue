<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { storeToRefs } from 'pinia'
import { useRecordStore } from '@/stores/record'
import { reactive, ref } from 'vue'
import type { RecordActivity } from '@/types/record'

dayjs.extend(duration)

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const nthWeek = ['1st', '2nd', '3rd', '4th', '5th', '6th']

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

const hoveredDay = ref<RecordActivity>()
const gridTooltipRef = ref<null | HTMLElement>(null)

const gridToolTipPosition = reactive({ top: 0, left: 0 })
const onGridMouseEnter = (event: MouseEvent, i: number, j: number) => {
  const tooltipRect = gridTooltipRef.value?.getBoundingClientRect()

  if (!tooltipRect) return

  const el = event.target as HTMLElement
  const rect = el.getBoundingClientRect()

  gridToolTipPosition.left = rect.left - tooltipRect?.width + rect.width
  gridToolTipPosition.top = rect.top - tooltipRect?.height - 6
  hoveredDay.value = monthlyRecordActivity.value[i + j * 7]
}
</script>
<template>
  <table class="mx-auto">
    <tr v-for="(day, i) in week" :key="i">
      <td>{{ day }}</td>
      <td
        v-for="(nth, j) in nthWeek"
        :key="j"
        @mouseenter="(event) => onGridMouseEnter(event, i, j)"
      >
        <div
          class="h-7 hover:opacity-80 w-12 transition-opacity rounded cursor-pointer"
          :class="generateActivityColor(monthlyRecordActivity[i + j * 7]?.val?.duration || 0)"
        ></div>
      </td>
    </tr>
    <tr>
      <td></td>
      <td v-for="(nth, j) in nthWeek" :key="j">{{ nth }}</td>
    </tr>
  </table>
  <ul
    class="bg-zinc-950/60 backdrop-blur-md text-zinc-50 w-fit border-zinc-700 fixed flex flex-col p-2 transition-all border rounded pointer-events-none"
    :style="{ top: gridToolTipPosition.top + 'px', left: gridToolTipPosition.left + 'px' }"
    ref="gridTooltipRef"
  >
    <li class="text-apathetic-400 text-lg font-medium">{{ hoveredDay?.key }}</li>
    <li class="flex items-center justify-between space-x-8">
      <div class="text-zinc-50 flex items-center space-x-2">
        <i class="ri-hourglass-2-line" style="font-size: 24px"></i>
        <p>Duration</p>
      </div>
      <p class="text-zinc-300 whitespace-nowrap">{{ hoveredDay?.val?.duration || 0 }} minutes</p>
    </li>
    <li class="flex items-center justify-between space-x-8">
      <div class="text-zinc-50 flex items-center space-x-2">
        <i class="ri-functions" style="font-size: 24px"></i>
        <p>Times</p>
      </div>
      <p class="text-zinc-300 whitespace-nowrap">{{ hoveredDay?.val?.times || 0 }} times</p>
    </li>
  </ul>
</template>
<style scoped>
td {
  @apply text-zinc-300 px-1.5 py-1.5;
}
</style>
