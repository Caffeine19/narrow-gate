<script setup lang="ts">
import { onMounted } from 'vue'

import dayjs from 'dayjs'

import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { useBookmarkStore } from '@/stores/bookmark'

import NarrowButton from '@/components/NarrowButton.vue'

const bookmarkStore = useBookmarkStore()
const { bookmarks } = storeToRefs(bookmarkStore)
onMounted(() => {
  bookmarkStore.getBookmarksByBook(12)
})

const bookStore = useBookStore()
const { hasBookmarkBooks } = storeToRefs(bookStore)
onMounted(() => {
  bookStore.getHasBookmarkBooks()
})
</script>
<template>
  <div class="grow relative flex overflow-hidden">
    <div class="bg-red-200/10 backdrop-blur-lg absolute top-0 left-0 z-10 w-full h-32"></div>
    <div
      class="border-zinc-800 custom-scrollbar flex flex-col items-center px-8 pt-6 space-y-6 overflow-y-auto border-r"
    >
      <div
        v-for="book in hasBookmarkBooks"
        :key="book.id"
        class="bg-zinc-800 border-zinc-700 w-fit hover:bg-zinc-800/80 flex items-stretch p-3 space-x-3 transition-colors border rounded"
      >
        <div class="w-32"><img :src="book.bookCover" class="h-40 rounded" alt="" /></div>

        <ul class="flex flex-col justify-between space-y-1">
          <ul class="space-y-1">
            <li class="text-apathetic-400 text-xl font-medium">
              {{ book.title.length > 12 ? book.title.slice(0, 12) + '...' : book.title }}
            </li>
            <li class="text-zinc-200">
              {{ book.creator.length > 12 ? book.creator.slice(0, 12) + '...' : book.creator }}
            </li>
          </ul>
          <li class="flex items-center justify-between space-x-8">
            <div class="text-zinc-50 flex items-center space-x-2">
              <i class="ri-functions" style="font-size: 24px"></i>
              <p>Count</p>
            </div>
            <p class="text-zinc-300 whitespace-nowrap">{{ book._count.Bookmark }} bookmarks</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="custom-scrollbar flex flex-col flex-1 overflow-y-auto">
      <div
        class="border-zinc-800 hover:bg-zinc-50/5 text-zinc-50 group flex flex-col p-3 space-y-3 transition-colors border-b"
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
      >
        <p>{{ bookmark.content }}</p>
        <div class="flex justify-between">
          <div class="text-zinc-400 flex items-center space-x-3">
            <i class="ri-time-line" style="font-size: 24px"></i>
            <p>{{ dayjs(bookmark.createdDate).format('YYYY-MM-DD HH:mm:ss') }}</p>
          </div>
          <div class="group-hover:flex items-center hidden space-x-3">
            <NarrowButton
              icon-style="ri-play-line"
              :action="() => {}"
              button-style="!bg-careless-400/20 !text-careless-400 hover:!text-careless-400 hover:!bg-careless-400/20 hover:!border-careless-400/60"
            />
            <NarrowButton
              icon-style="ri-delete-bin-line"
              :action="() => {}"
              button-style="!bg-passion-400/20 !text-passion-400 hover:!text-passion-400  hover:!bg-passion-400/20 hover:!border-passion-400/60"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
