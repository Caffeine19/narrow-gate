<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import dayjs from 'dayjs'

import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { useBookmarkStore } from '@/stores/bookmark'

import NarrowButton from '@/components/NarrowButton.vue'
import BookCard from '../OverviewView/BookCard.vue'

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
      <div
        class="border-zinc-800 hover:bg-zinc-50/5 text-zinc-50 group flex flex-col p-3 px-8 space-y-3 transition-colors border-b"
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
              iconStyle="ri-play-line"
              :action="() => {}"
              buttonStyle="!bg-careless-400/20 !text-careless-400 hover:!text-careless-400 hover:!bg-careless-400/20 hover:!border-careless-400/60"
            />
            <NarrowButton
              iconStyle="ri-delete-bin-line"
              :action="() => bookmarkStore.deleteBookmark(bookmark.id)"
              buttonStyle="!bg-passion-400/20 !text-passion-400 hover:!text-passion-400  hover:!bg-passion-400/20 hover:!border-passion-400/60"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
