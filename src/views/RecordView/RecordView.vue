<script setup lang="ts">
import { reactive } from 'vue'

import GridCalendar from './GridCalendar.vue'

const summaryOptions = reactive([
  {
    name: 'Books',
    value: 326,
    iconStyle: 'ri-book-3-line',
    textColor: 'text-apathetic-400',
    bgColor: 'bg-apathetic-400/10'
  },
  {
    name: 'Bookmarks',
    value: 326,
    iconStyle: 'ri-bookmark-line',
    textColor: 'text-passion-400',
    bgColor: 'bg-passion-400/10'
  },
  {
    name: 'Duration',
    value: 326,
    iconStyle: 'ri-timer-line',
    textColor: 'text-tea-400',
    bgColor: 'bg-tea-400/10'
  }
])
</script>
<template>
  <div class="grow gap-x-8 grid grid-cols-12 p-8 overflow-hidden">
    <div class="col-span-8">
      <div class="gap-x-8 grid grid-cols-3">
        <div
          class="bg-zinc-800 border-zinc-700 flex justify-between px-5 py-4 border rounded"
          v-for="(summary, index) in summaryOptions"
          :key="index"
        >
          <div class="space-y-1.5">
            <p class="text-zinc-300 text-xl font-medium">{{ summary.name }}</p>
            <p class="text-zinc-50 text-3xl font-semibold">{{ summary.value }}</p>
            <p class="text-zinc-400"><span :class="summary.textColor">+ 12</span> from last week</p>
          </div>
          <div
            :class="[summary.textColor, summary.bgColor]"
            class="w-14 h-14 flex items-center justify-center rounded-full"
          >
            <i :class="summary.iconStyle" style="font-size: 36px"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-4 space-y-8 overflow-hidden">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="text-zinc-50 flex items-end space-x-3 text-2xl">
            <i class="ri-polaroid-2-line" style="font-size: 32px"></i>
            <p class="font-semibold">Monthly Activity</p>
          </div>
          <div
            class="bg-zinc-800 space-x-1.5 border-zinc-700 flex items-stretch rounded text-zinc-50 py-1 px-1.5 border"
          >
            <button>2023</button>
            <div class="w-[1px] border-zinc-700 border-r"></div>
            <button>04</button>
          </div>
        </div>
        <div><GridCalendar></GridCalendar></div>
      </div>
      <div class="h-[1px] w-full border-b border-zinc-700"></div>

      <div class="space-y-6">
        <div class="flex items-end justify-between">
          <div class="text-zinc-50 flex items-center space-x-3 text-2xl">
            <i class="ri-film-line" style="font-size: 32px"></i>
            <p class="font-semibold">Daily Timeline</p>
          </div>
          <p class="text-zinc-300">4Hours 32Minutes</p>
        </div>
      </div>
    </div>
  </div>
</template>
