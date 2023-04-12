<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useRouter } from 'vue-router'

import dayjs from 'dayjs'

import { useBookStore } from '@/stores/book'

import NarrowButton from '@/components/NarrowButton.vue'
import type { BookCover } from '@/types/book'

const bookStore = useBookStore()
const { selectedBook } = storeToRefs(bookStore)

const router = useRouter()
const goReading = (cover: BookCover) => {
  bookStore.setOpenedBook(cover)
  router.push({ name: 'reading', query: { id: cover.id } })
}

const onReadingButtonClick = () => {
  if (!selectedBook.value) return
  goReading(selectedBook.value)
}

const onDeleteButtonClick = () => {
  if (!selectedBook.value) return
  bookStore.deleteBook([selectedBook.value.id])
  bookStore.setSelectedBook(undefined)
}
</script>
<template>
  <div class="border-zinc-800 custom-scrollbar relative overflow-y-auto border-l">
    <div
      class="bg-zinc-950/60 border-zinc-800 backdrop-blur-2xl sticky top-0 z-10 flex items-center justify-between px-8 py-3 border-b h-[67px]"
    >
      <NarrowButton iconStyle="ri-side-bar-fill" :action="() => bookStore.toggleDetail(false)" />
      <div class="flex items-center space-x-3">
        <NarrowButton
          icon-style="ri-play-line"
          :action="onReadingButtonClick"
          button-style="!bg-careless-400/20 !text-careless-400 hover:!text-careless-400 hover:!bg-careless-400/20 hover:!border-careless-400/60"
        />
        <NarrowButton
          icon-style="ri-ball-pen-line"
          :action="onDeleteButtonClick"
          button-style="!bg-tea-400/20 !text-tea-400 hover:!text-tea-400  hover:!bg-tea-400/20 hover:!border-tea-400/60"
        />
        <NarrowButton
          icon-style="ri-delete-bin-line"
          :action="onDeleteButtonClick"
          button-style="!bg-passion-400/20 !text-passion-400 hover:!text-passion-400  hover:!bg-passion-400/20 hover:!border-passion-400/60"
        />
      </div>
    </div>
    <div class="flex flex-col p-8 space-y-8">
      <img :src="selectedBook?.bookCover" alt="" class="rounded" />
      <div class="space-y-2.5">
        <p class="text-zinc-50 text-2xl font-semibold">{{ selectedBook?.title }}</p>
        <p class="text-zinc-200 text-xl font-medium">{{ selectedBook?.creator }}</p>
      </div>
      <div class="bg-zinc-800/80 border-zinc-700 flex flex-col p-3 space-y-4 border rounded">
        <div class="text-apathetic-400 space-x-3 text-lg font-medium">
          <i style="font-size: 24px" class="ri-lightbulb-flash-line"></i>
          <span>Metadata</span>
        </div>
        <ul class="text-zinc-300 flex flex-col space-y-2">
          <li class="flex items-start justify-between space-x-3">
            <span class="flex items-center space-x-3">
              <i class="ri-at-line" style="font-size: 20px"></i> <span>identifier:</span>
            </span>
            <span>{{ selectedBook?.identifier }}</span>
          </li>
          <li class="flex items-start justify-between space-x-3">
            <span class="flex items-center space-x-3">
              <i class="ri-user-smile-line" style="font-size: 20px"></i>
              <span>creator:</span>
            </span>
            <span>{{ selectedBook?.creator }}</span>
          </li>
          <li class="flex items-start justify-between space-x-3">
            <span class="flex items-center space-x-3">
              <i class="ri-calendar-check-line" style="font-size: 20px"></i><span>pubdate:</span>
            </span>
            <span>{{ dayjs(selectedBook?.pubdate).format('YYYY-MM-DD') }}</span>
          </li>
          <li class="flex items-start justify-between space-x-3">
            <span class="flex items-center space-x-3">
              <i class="ri-global-line" style="font-size: 20px"></i><span>language:</span>
            </span>
            <span>{{ selectedBook?.creator }}</span>
          </li>
        </ul>
        <div class="h-[1px] w-full bg-apathetic-400"></div>
        <ul class="text-zinc-300 flex flex-col space-y-2">
          <li class="flex items-start justify-between space-x-3">
            <span class="flex items-center space-x-3">
              <i class="ri-file-zip-line" style="font-size: 20px"></i><span>size:</span>
            </span>
            <span>{{ (selectedBook?.size || 1 / 1024).toFixed(2) }}KB</span>
          </li>
          <li class="flex items-start justify-between space-x-3">
            <span class="flex items-center space-x-3">
              <i class="ri-inbox-archive-line" style="font-size: 20px"></i><span>addedDate:</span>
            </span>
            <span>{{ dayjs(selectedBook?.addedDate).format('YYYY-MM-DD') }}</span>
          </li>
          <li class="flex items-start justify-between space-x-3">
            <span class="flex items-center space-x-3">
              <i class="ri-folder-open-line" style="font-size: 20px"></i
              ><span>lastOpenedDate:</span>
            </span>
            <span>{{
              selectedBook?.lastOpenedDate
                ? dayjs(selectedBook.lastOpenedDate).format('YYYY-MM-DD')
                : 'not opened yet'
            }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
