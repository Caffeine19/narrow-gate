<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'


import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { useBookmarkStore } from '@/stores/bookmark'

import BookCard from '../OverviewView/BookCard.vue'
import BookmarkItem from '@/components/BookmarkItem.vue'

const selectedBookId = ref<number | undefined>()
const setSelectedBookId = (bookId: number | undefined) => {
  selectedBookId.value = bookId
}
watch(selectedBookId, (newVal) => {
  bookmarkStore.getBookmarksByBook(newVal)
})

const bookmarkStore = useBookmarkStore()
const { bookmarks } = storeToRefs(bookmarkStore)
onMounted(() => {
  bookmarkStore.getBookmarksByBook(selectedBookId.value)
})

const bookStore = useBookStore()
const { hasBookmarkBooks } = storeToRefs(bookStore)
onMounted(() => {
  bookStore.getHasBookmarkBooks()
})


</script>
<template>
  <div class="grow relative flex pt-10 overflow-hidden">
    <div
      class="bg-zinc-950/80 border-zinc-800 backdrop-blur-2xl absolute top-0 left-0 z-10 w-full px-8 py-3 border-b"
    >
      <div></div>
      <div class="text-zinc-50 text-lg font-medium">
        {{ hasBookmarkBooks.find((book) => book.id == selectedBookId)?.title || 'All bookmarks' }}
      </div>
    </div>
    <div
      class="border-zinc-800 custom-scrollbar flex flex-col items-center px-8 pt-6 space-y-6 overflow-y-auto border-r"
    >
      <BookCard
        class="w-full"
        v-for="book in hasBookmarkBooks"
        :key="book.id"
        :title="book.title"
        :creator="book.creator"
        :bookCover="book.bookCover"
        :info="[{ iconStyle: 'ri-functions', name: 'Count', value: book._count.Bookmark }]"
        @click="setSelectedBookId(book.id)"
        :class="
          book.id === selectedBookId
            ? '!border-apathetic-500/80 hover:!border-apathetic-500 !bg-apathetic-500/5'
            : ''
        "
      >
      </BookCard>
    </div>
    <div class="custom-scrollbar flex flex-col flex-1 overflow-y-auto">
      <BookmarkItem v-for="bookmark in bookmarks" :key="bookmark.id" :bookmark="bookmark"></BookmarkItem>
    </div>
  </div>
</template>
