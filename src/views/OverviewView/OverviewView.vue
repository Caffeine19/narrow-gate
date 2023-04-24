<script setup lang="ts">
import { reactive } from 'vue'

import ActivityCalendar from './ActivityCalendar.vue'
import AmountCard from './AmountCard.vue'
import NarrowDivider from '@/components/NarrowDivider.vue'
import BookCard from './BookCard.vue'

const AmountCardOptions = reactive([
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
    <div class="col-span-8 space-y-6" name="leftGrid">
      <div class="gap-x-8 grid grid-cols-3">
        <AmountCard
          v-for="(card, index) in AmountCardOptions"
          :key="index"
          v-bind="card"
        ></AmountCard>
      </div>
      <NarrowDivider></NarrowDivider>
      <div name="readMost" class="space-y-6">
        <div class="flex items-end justify-between">
          <div class="text-zinc-50 flex items-center space-x-3 text-2xl">
            <i class="ri-hearts-line" style="font-size: 32px"></i>
            <p class="font-semibold">Read Most</p>
          </div>
        </div>
        <div class="custom-scrollbar flex pb-2 space-x-6 overflow-x-auto">
          <BookCard v-for="(card, index) in 10" :key="index"></BookCard>
        </div>
      </div>
      <NarrowDivider></NarrowDivider>
    </div>
    <div class="col-span-4 space-y-8 overflow-hidden" name="rightGrid">
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
        <div><ActivityCalendar></ActivityCalendar></div>
      </div>
      <NarrowDivider></NarrowDivider>

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
