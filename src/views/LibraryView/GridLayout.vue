<script setup lang="ts">
import type { PropType } from 'vue'

import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'

import type { BookCover } from '@/types/book'

import BookCard from './BookCard.vue'
const bookStore = useBookStore()

const router = useRouter()
const goReading = (cover: BookCover) => {
  // bookStore.setOpenedBook(cover)
  // router.push({ name: 'reading', query: { id: cover.id } })
  bookStore.setSelectedBook(cover), bookStore.toggleDetail(true)
}

defineProps({ bookCoverList: Array as PropType<BookCover[]> })

const { selectedBook } = storeToRefs(bookStore)
</script>
<template>
  <div class="@container">
    <div
      class="gap-y-8 gap-x-8 justify-items-stretch grid grid-cols-1 gap-8 p-8 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @9xl:grid-cols-5"
    >
      <BookCard
        v-for="(bookCover, index) in bookCoverList"
        :key="index"
        :bookCover="bookCover"
        :action="() => goReading(bookCover)"
        :selected="bookCover.id == selectedBook?.id"
      ></BookCard>
    </div>
  </div>
</template>
<style>
.card {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>
