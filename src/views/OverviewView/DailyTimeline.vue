<script setup lang="ts">
import { useRecordStore } from '@/stores/record'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'

const recordStore = useRecordStore()
const { dailyRecordDate, dailyRecords } = storeToRefs(recordStore)
</script>
<template>
  <div class="flex flex-col space-y-6 overflow-hidden">
    <div class="flex items-end justify-between">
      <div class="text-zinc-50 flex items-center space-x-3 text-2xl">
        <i class="ri-film-line" style="font-size: 32px"></i>
        <p class="font-semibold">Daily Timeline</p>
      </div>
      <p class="text-zinc-300">{{ dailyRecordDate }}</p>
    </div>
    <div class="custom-scrollbar flex flex-col pr-4 overflow-auto">
      <div v-for="(day, index) in dailyRecords" :key="index" class="relative">
        <div class="left-4 absolute top-0 z-0 bottom-0 w-[1px] border-l border-zinc-700"></div>
        <ul class="relative z-10 flex flex-col py-4 space-y-2">
          <li class="flex items-center space-x-3">
            <div
              class="text-zinc-500 bg-zinc-800 flex items-center justify-center w-8 h-8 rounded-full"
            >
              <i class="ri-flight-takeoff-line" style="font-size: 24px"></i>
            </div>
            <p class="text-zinc-50">{{ dayjs(day.begin).format('MM-DD HH:mm') }}</p>
          </li>
          <li class="flex items-center justify-between">
            <p class="text-apathetic-400 pl-12 text-xl font-medium">
              {{ day.book.title }}
              <span class="text-zinc-200 pl-1 text-base font-normal">/ {{ day.book.creator }}</span>
            </p>
            <p class="text-zinc-400">{{ day.duration }} minutes</p>
          </li>
          <li class="flex items-center space-x-3">
            <div
              class="text-zinc-500 bg-zinc-800 flex items-center justify-center w-8 h-8 rounded-full"
            >
              <i class="ri-flight-land-line" style="font-size: 24px"></i>
            </div>
            <p class="text-zinc-50">{{ dayjs(day.end).format('MM-DD HH:mm') }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
