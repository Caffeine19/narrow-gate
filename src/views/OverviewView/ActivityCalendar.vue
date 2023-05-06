<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

import { storeToRefs } from 'pinia'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import type { RecordActivity } from '@/types/record'

import { useRecordStore } from '@/stores/record'

import DatePicker from '@/components/DatePicker.vue'

dayjs.extend(duration)

const recordStore = useRecordStore()

const monthlyRecordActivityDate = ref({
  year: dayjs().format('YYYY'),
  month: dayjs().format('MMM')
})

const onMonthlyRecordActivityDateChange = (date: { year: string; month: string }) => {
  monthlyRecordActivityDate.value = date
}

const monthlyRecordActivity = ref<RecordActivity[]>([])
onMounted(async () => {
  monthlyRecordActivity.value = await recordStore.getMonthlyRecordActivity(
    monthlyRecordActivityDate.value.year + monthlyRecordActivityDate.value.month
  )
})

watch(
  monthlyRecordActivityDate,
  async (newVal) => {
    monthlyRecordActivity.value = await recordStore.getMonthlyRecordActivity(
      newVal.year + newVal.month
    )
  },
  { deep: true }
)

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

const hoveredDay = ref<RecordActivity>()
const gridTooltipRef = ref<null | HTMLElement>(null)

const gridToolTipPosition = reactive({ top: 0, left: 0 })
const openingGridTooltip = ref(false)
const onGridMouseEnter = (event: MouseEvent, i: number, j: number) => {
  openingGridTooltip.value = true
  const tooltipRect = gridTooltipRef.value?.getBoundingClientRect()

  if (!tooltipRect) return

  const el = event.target as HTMLElement
  const rect = el.getBoundingClientRect()

  gridToolTipPosition.left = rect.left - tooltipRect?.width + rect.width
  gridToolTipPosition.top = rect.top - tooltipRect?.height - 6
  if (gridToolTipPosition.top < 0) gridToolTipPosition.top = rect.top + rect.height + 6

  hoveredDay.value = monthlyRecordActivity.value[i + j * 7]
}

const { dailyRecordDate } = storeToRefs(recordStore)
const onGridClick = (i: number, j: number) => {
  const clickedValue = monthlyRecordActivity.value[i + j * 7]
  console.log('🚀 ~ file: ActivityCalendar.vue:54 ~ onGridClick ~ clickedValue:', clickedValue)
  const begin = clickedValue.key
  const end = dayjs(clickedValue.key).add(1, 'day').format('YYYY-MM-DD')
  dailyRecordDate.value = begin
  recordStore.getDailyRecords(begin, end)
}
</script>
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="text-zinc-50 flex items-end space-x-3 text-2xl">
        <i class="ri-polaroid-2-line" style="font-size: 32px"></i>
        <p class="font-semibold">Monthly Activity</p>
      </div>
      <DatePicker
        :dateValue="monthlyRecordActivityDate"
        @dateChange="onMonthlyRecordActivityDateChange"
      ></DatePicker>
    </div>
    <table class="mx-auto" @mouseleave="openingGridTooltip = false">
      <tr v-for="(day, i) in week" :key="i">
        <td>{{ day }}</td>
        <td v-for="(nth, j) in nthWeek" :key="j">
          <div
            class="h-7 hover:opacity-80 hover:border-tea-200 w-12 transition-[opacity,border-color,background-color] border border-transparent rounded cursor-pointer"
            :class="generateActivityColor(monthlyRecordActivity[i + j * 7]?.val?.duration || 0)"
            @mouseenter="(event) => onGridMouseEnter(event, i, j)"
            @click="onGridClick(i, j)"
          ></div>
        </td>
      </tr>
      <tr>
        <td></td>
        <td v-for="(nth, j) in nthWeek" :key="j">{{ nth }}</td>
      </tr>
    </table>
    <transition name="zoom">
      <ul
        class="bg-zinc-950/60 backdrop-blur-md text-zinc-50 w-fit border-zinc-700 fixed flex flex-col p-2 border rounded pointer-events-none transition-[top,left]"
        :style="{ top: gridToolTipPosition.top + 'px', left: gridToolTipPosition.left + 'px' }"
        ref="gridTooltipRef"
        v-show="openingGridTooltip"
      >
        <li class="text-apathetic-400 text-lg font-medium">{{ hoveredDay?.key }}</li>
        <li class="flex items-center justify-between space-x-8">
          <div class="text-zinc-50 flex items-center space-x-2">
            <i class="ri-hourglass-2-line" style="font-size: 24px"></i>
            <p>Duration</p>
          </div>
          <p class="text-zinc-300 whitespace-nowrap">
            {{ hoveredDay?.val?.duration || 0 }} minutes
          </p>
        </li>
        <li class="flex items-center justify-between space-x-8">
          <div class="text-zinc-50 flex items-center space-x-2">
            <i class="ri-functions" style="font-size: 24px"></i>
            <p>Times</p>
          </div>
          <p class="text-zinc-300 whitespace-nowrap">{{ hoveredDay?.val?.times || 0 }} times</p>
        </li>
      </ul></transition
    >
  </div>
</template>
<style scoped>
td {
  @apply text-zinc-300 px-1.5 py-1.5;
}
.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
