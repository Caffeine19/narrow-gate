<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

import ActivityCalendar from './ActivityCalendar.vue'
import AmountCard from './AmountCard.vue'
import NarrowDivider from '@/components/NarrowDivider.vue'
import BookCard from './BookCard.vue'
import ActivityChart from './ActivityChart.vue'
import DailyTimeline from './DailyTimeline.vue'

import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { useRecordStore } from '@/stores/record'
import { useBookmarkStore } from '@/stores/bookmark'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const bookStore = useBookStore()
const { bookAmount, mostReadBooks } = storeToRefs(bookStore)

const recordStore = useRecordStore()
const { recordDurationAmount } = storeToRefs(recordStore)
const formattedRecordDurationAmount = computed(() =>
  dayjs.duration(recordDurationAmount.value, 'minutes').format('HH:mm:ss')
)

const bookmarkStore = useBookmarkStore()
const { bookmarkAmount } = storeToRefs(bookmarkStore)
const AmountCardOptions = reactive([
  {
    name: 'Books',
    value: bookAmount,
    iconStyle: 'ri-book-3-line',
    textColor: 'text-apathetic-400',
    bgColor: 'bg-apathetic-400/10'
  },
  {
    name: 'Bookmarks',
    value: bookmarkAmount,
    iconStyle: 'ri-bookmark-line',
    textColor: 'text-passion-400',
    bgColor: 'bg-passion-400/10'
  },
  {
    name: 'Duration',
    value: formattedRecordDurationAmount,
    iconStyle: 'ri-timer-line',
    textColor: 'text-tea-400',
    bgColor: 'bg-tea-400/10'
  }
])

onMounted(() => {
  bookStore.getBookAmount()
  bookStore.getMostReadBooks()
  recordStore.getRecordDurationAmount()
  bookmarkStore.getBookmarkAmount()
})
</script>
<template>
  <div class="grow gap-x-8 grid grid-cols-12 p-8 overflow-hidden">
    <div class="custom-scrollbar col-span-8 pr-2 space-y-6 overflow-y-auto" name="leftGrid">
      <div class="gap-x-8 grid grid-cols-3">
        <AmountCard
          v-for="(card, index) in AmountCardOptions"
          :key="index"
          v-bind="card"
        ></AmountCard>
      </div>

      <NarrowDivider></NarrowDivider>

      <div>
        <div class="flex items-end justify-between">
          <div class="text-zinc-50 flex items-center space-x-3 text-2xl">
            <i class="ri-line-chart-line" style="font-size: 32px"></i>
            <p class="font-semibold">Read Most</p>
          </div>
        </div>
        <ActivityChart></ActivityChart>
      </div>

      <NarrowDivider></NarrowDivider>

      <div name="readMost" class="space-y-6">
        <div class="flex items-end justify-between">
          <div class="text-zinc-50 flex items-center space-x-3 text-2xl">
            <i class="ri-hearts-line" style="font-size: 32px"></i>
            <p class="font-semibold">Read Most</p>
          </div>
          <p class="text-zinc-300 italic">Top {{ mostReadBooks.length }} Book</p>
        </div>
        <div class="custom-scrollbar flex pb-2 space-x-6 overflow-x-auto">
          <BookCard
            v-for="(book, index) in mostReadBooks"
            :key="index"
            :title="book.title"
            :creator="book.creator"
            :bookCover="book.bookCover"
            :info="[
              {
                name: 'Duration',
                value: book.duration + ' minutes',
                iconStyle: 'ri-hourglass-2-line'
              },
              { name: 'Times', value: book.times + ' times', iconStyle: 'ri-functions' }
            ]"
          ></BookCard>
        </div>
      </div>
    </div>
    <div class="flex flex-col col-span-4 space-y-8 overflow-hidden" name="rightGrid">
      <ActivityCalendar></ActivityCalendar>
      <NarrowDivider></NarrowDivider>
      <DailyTimeline></DailyTimeline>
    </div>
  </div>
</template>
