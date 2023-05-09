<script setup lang="ts">
import { useBookStore } from '@/stores/book'
import { useBookmarkStore } from '@/stores/bookmark'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const bookmarkStore = useBookmarkStore()

const bookStore = useBookStore()
const { hasBookmarkBooks } = storeToRefs(bookStore)
onMounted(() => {
  bookStore.getHasBookmarkBooks()
})
</script>
<template>
  <div class="grow flex overflow-hidden">
    <div class="border-zinc-800 flex flex-col items-center px-8 pt-6 space-y-6 border-r">
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
    <div class="flex-1"></div>
  </div>
</template>
