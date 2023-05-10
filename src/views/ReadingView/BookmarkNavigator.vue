<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import { useBookmarkStore } from '@/stores/bookmark'
import { useReadingStore } from '@/stores/reading'

import BookmarkItem from '@/components/BookmarkItem.vue'

const bookmarkStore = useBookmarkStore()
const { bookmarks } = storeToRefs(bookmarkStore)

const readingStore = useReadingStore()
const { openedBook } = storeToRefs(readingStore)
onMounted(() => {
  if (openedBook.value) bookmarkStore.getBookmarksByBook(openedBook.value.id)
})
</script>
<template>
  <div
    class="bg-zinc-950/60 border-zinc-800 backdrop-blur-2xl custom-scrollbar xl:w-1/2 md:w-1/2 absolute right-0 z-10 flex flex-col w-2/3 h-full max-w-lg p-8 space-y-5 overflow-y-auto border-r"
  >
    <div class="border-zinc-600 text-zinc-50 flex items-center pb-5 space-x-3 border-b">
      <i class="ri-list-unordered" style="font-size: 28px"></i>
      <p class="text-2xl italic font-semibold">Bookmark</p>
    </div>
    <ul class="text-zinc-50 flex flex-col space-y-3">
      <BookmarkItem
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        class="!border-zinc-600 border rounded"
      ></BookmarkItem>
    </ul>
  </div>
</template>
