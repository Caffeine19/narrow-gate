<script setup lang="ts">
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'

import { useBookStore } from '@/stores/book'

import NarrowButton from '@/components/NarrowButton.vue'

import type { BookCover } from '@/types/book'
import { onMounted } from 'vue'
const bookStore = useBookStore()
const { bookCoverList } = storeToRefs(bookStore)

const router = useRouter()
const goReading = (cover: BookCover) => {
  bookStore.setOpenedBook(cover)
  router.push({ name: 'reading' })
}

onMounted(() => {
  bookStore.getBookCoverList()
})
</script>
<template>
  <div class="relative overflow-y-auto">
    <div
      style="-webkit-app-region: drag"
      class="bg-zinc-950/80 border-zinc-800 backdrop-blur-2xl sticky top-0 z-10 flex items-center justify-between px-8 py-3 border-b"
    >
      <NarrowButton iconStyle="ri-add-box-line" :action="bookStore.addBook" />
      <div class="flex items-center space-x-3">
        <NarrowButton iconStyle="ri-filter-3-line" />
        <NarrowButton iconStyle="ri-checkbox-multiple-blank-line" />
        <NarrowButton iconStyle="ri-arrow-up-down-line" />
        <NarrowButton iconStyle="ri-table-line" />
      </div>
    </div>
    <div
      class="gap-y-8 gap-x-8 justify-items-stretch 2xl:grid-cols-4 xl:grid-cols-3 grid grid-cols-2 p-8"
    >
      <div
        v-for="(bookCover, index) in bookCoverList"
        :key="index"
        @click="() => goReading(bookCover)"
        class="hover:border-zinc-700 hover:bg-zinc-50/5 flex flex-col items-center justify-between p-2 space-y-3 transition-colors border border-transparent rounded cursor-pointer"
      >
        <img :src="bookCover.bookCover" alt="" class="w-[164px] h-[240px] rounded" />
        <div>
          <p class="text-zinc-50 text-lg text-center">
            {{
              bookCover.title.length > 12 ? bookCover.title.slice(0, 12) + '...' : bookCover.title
            }}
          </p>
          <p class="text-zinc-400 text-center">{{ bookCover.creator }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
