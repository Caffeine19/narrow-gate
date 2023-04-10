<script setup lang="ts">
import type { PropType } from 'vue'

import { useRouter } from 'vue-router'

import { useBookStore } from '@/stores/book'

import type { BookCover } from '@/types/book'
const bookStore = useBookStore()

const router = useRouter()
const goReading = (cover: BookCover) => {
  bookStore.setOpenedBook(cover)
  router.push({ name: 'reading', query: { id: cover.id } })
}

defineProps({ bookCoverList: Array as PropType<BookCover[]> })
</script>
<template>
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
          {{ bookCover.title.length > 12 ? bookCover.title.slice(0, 12) + '...' : bookCover.title }}
        </p>
        <p class="text-zinc-400 text-center">{{ bookCover.creator }}</p>
      </div>
    </div>
  </div>
</template>
