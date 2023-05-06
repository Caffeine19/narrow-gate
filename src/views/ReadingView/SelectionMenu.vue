<script setup lang="ts">
import { useReadingStore } from '@/stores/reading'
import { storeToRefs } from 'pinia'

const readingStore = useReadingStore()
const { openingSelectionMenu, selectionMenuPosition } = storeToRefs(readingStore)
</script>
<template>
  <div
    class="bg-zinc-950/60 backdrop-blur-2xl w-fit border-zinc-700 absolute flex border rounded transition-[top,left] p-2 z-10 divide-x divide-zinc-700"
    :style="{ top: selectionMenuPosition.left + 24 + 'px', left: selectionMenuPosition.top + 'px' }"
  >
    <button class="flex items-center pr-2 space-x-2">
      <i class="ri-bookmark-line" style="font-size: 24px"></i>
      <p>Mark</p>
    </button>
    <button class="flex items-center pl-2 space-x-2">
      <i class="ri-file-copy-line" style="font-size: 24px"></i>
      <p>Copy</p>
    </button>
  </div>
</template>
