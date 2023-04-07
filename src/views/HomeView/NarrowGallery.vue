<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'

const bookStore = useBookStore()
const { bookCoverList } = storeToRefs(bookStore)
</script>
<template>
  <div class="relative overflow-y-auto">
    <div
      class="bg-zinc-900/80 border-zinc-700 backdrop-blur-2xl sticky top-0 z-10 flex items-center justify-between px-8 py-3 border-b"
    >
      <button
        @click="bookStore.addBook"
        class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 w-9 h-9 flex items-center justify-center transition-colors rounded"
      >
        <i class="ri-add-box-line" style="font-size: 28px"></i>
      </button>
      <div class="flex items-center space-x-3">
        <button
          class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 w-9 h-9 flex items-center justify-center transition-colors rounded"
        >
          <i class="ri-filter-3-line" style="font-size: 28px"></i>
        </button>
        <button
          class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 w-9 h-9 flex items-center justify-center transition-colors rounded"
        >
          <i class="ri-checkbox-multiple-blank-line" style="font-size: 28px"></i>
        </button>
        <button
          class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 w-9 h-9 flex items-center justify-center transition-colors rounded"
        >
          <i class="ri-arrow-up-down-line" style="font-size: 28px"></i>
        </button>
        <button
          class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 w-9 h-9 flex items-center justify-center transition-colors rounded"
        >
          <i class="ri-table-line" style="font-size: 28px"></i>
        </button>
      </div>
    </div>
    <div class="gap-y-8 gap-x-8 justify-items-stretch grid grid-cols-4 p-8">
      <div
        v-for="(cover, index) in bookCoverList"
        :key="index"
        class="hover:border-zinc-600 hover:bg-zinc-50/5 flex flex-col items-center justify-between p-2 space-y-3 transition-colors border border-transparent rounded cursor-pointer"
      >
        <img :src="cover.img" alt="" class="w-[164px] h-[240px] rounded" />
        <div>
          <p class="text-zinc-50 text-lg text-center">
            {{ cover.title.length > 12 ? cover.title.slice(0, 12) + '...' : cover.title }}
          </p>
          <p class="text-zinc-400 text-center">{{ cover.creator }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
