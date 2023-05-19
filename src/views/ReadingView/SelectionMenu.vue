<script setup lang="ts">
import { useReadingStore } from '@/stores/reading'
import { storeToRefs } from 'pinia'

const readingStore = useReadingStore()
const { openingSelectionMenu } = storeToRefs(readingStore)

const copySelection = () => {
  if (readingStore.selectedRange.content)
    window.navigator.clipboard.writeText(readingStore.selectedRange.content)
}
</script>
<template>
  <Transition name="fade-up">
    <div
      v-if="openingSelectionMenu"
      class="bottom-8 absolute left-0 right-0 z-10 flex items-center justify-center"
    >
      <div
        class="bg-zinc-950/60 backdrop-blur-2xl border-zinc-700 divide-zinc-700 flex border divide-x rounded"
      >
        <button
          class="flex items-center py-2 pl-3 pr-3 space-x-2"
          @click="readingStore.createBookmark"
        >
          <i class="ri-bookmark-line" style="font-size: 24px"></i>
          <p>Mark</p>
        </button>
        <button class="flex items-center py-2 pl-3 pr-3 space-x-2" @click="copySelection">
          <i class="ri-file-copy-line" style="font-size: 24px"></i>
          <p>Copy</p>
        </button>
      </div>
    </div>
  </Transition>
</template>
<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(80px);
}
</style>
