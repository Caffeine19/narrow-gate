<script setup lang="ts">
import type { MostReadBook } from '@/types/book'
import type { PropType } from 'vue'

defineProps({
  mostReadBook: { type: Object as PropType<MostReadBook>, required: true }
})
</script>
<template>
  <div
    class="bg-zinc-800 border-zinc-700 w-fit hover:bg-zinc-800/80 flex items-stretch p-3 space-x-3 transition-colors border rounded"
  >
    <div class="w-32"><img :src="mostReadBook.bookCover" class="h-40 rounded" alt="" /></div>

    <ul class="flex flex-col justify-between space-y-1">
      <li class="text-apathetic-400 text-xl font-medium">
        {{
          mostReadBook.title.length > 12
            ? mostReadBook.title.slice(0, 12) + '...'
            : mostReadBook.title
        }}
      </li>
      <li class="text-zinc-200">
        {{
          mostReadBook.creator.length > 12
            ? mostReadBook.creator.slice(0, 12) + '...'
            : mostReadBook.creator
        }}
      </li>
      <li class="flex items-center justify-between space-x-8">
        <div class="text-zinc-50 flex items-center space-x-2">
          <i class="ri-hourglass-2-line" style="font-size: 24px"></i>
          <p>Duration</p>
        </div>
        <p class="text-zinc-300 whitespace-nowrap">{{ mostReadBook?.duration }} minutes</p>
      </li>
      <li class="flex items-center justify-between space-x-8">
        <div class="text-zinc-50 flex items-center space-x-2">
          <i class="ri-functions" style="font-size: 24px"></i>
          <p>Times</p>
        </div>
        <p class="text-zinc-300 whitespace-nowrap">{{ mostReadBook?.times }} times</p>
      </li>
    </ul>
  </div>
</template>
