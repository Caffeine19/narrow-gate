<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import BookCard from './BookCard.vue'

const bookStore = useBookStore()
const { groupedBookList } = storeToRefs(bookStore)
</script>
<template>
  <div class="p-8 space-y-8">
    <div v-for="(group, key) in groupedBookList" :key="key" class="space-y-4">
      <div class="flex items-center justify-between space-x-6">
        <p class="text-apathetic-50 text-3xl font-semibold uppercase">{{ key }}</p>
        <div class="h-[1px] grow bg-zinc-700"></div>
        <p class="text-zinc-400 text-lg">
          {{ group.length }} book{{ group.length > 1 ? 's' : '' }}
        </p>
      </div>
      <div
        class="gap-y-8 gap-x-8 justify-items-stretch 2xl:grid-cols-4 xl:grid-cols-3 grid grid-cols-2 gap-8"
      >
        <BookCard
          v-for="(bookCover, index) in group"
          :key="index"
          :action="() => {}"
          :bookCover="bookCover"
        ></BookCard>
      </div>
    </div>
  </div>
</template>
