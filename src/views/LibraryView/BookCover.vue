<script setup lang="ts">
import type { BookCover } from '@/types/book'
import type { PropType } from 'vue'

defineProps({
  action: { type: Function, required: true },
  selected: Boolean,
  bookCover: { type: Object as PropType<BookCover>, required: true }
})
</script>
<template>
  <div
    @click="() => action()"
    class="hover:border-zinc-700 hover:bg-zinc-50/5 flex flex-col items-center justify-between p-4 space-y-3 transition-colors border border-transparent rounded cursor-pointer"
    :class="
      selected ? '!border-apathetic-500/80 hover:!border-apathetic-500 !bg-apathetic-500/5' : ''
    "
  >
    <img :src="bookCover.bookCover" alt="" class="w-[164px] h-[240px] rounded" />
    <div>
      <p class="text-zinc-50 text-lg text-center">
        {{ bookCover.title.length > 12 ? bookCover.title.slice(0, 12) + '...' : bookCover.title }}
      </p>
      <p class="text-zinc-400 text-center">{{ bookCover.creator }}</p>
    </div>
  </div>
</template>
