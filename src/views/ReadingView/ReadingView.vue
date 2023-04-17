<script setup lang="ts">
import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

import NarrowButton from '@/components/NarrowButton.vue'
import ChapterNavigator from './ChapterNavigator.vue'

import { storeToRefs } from 'pinia'
import { useOSStore } from '@/stores/os'
import { useReadingStore } from '@/stores/reading'

import { useRoute, useRouter } from 'vue-router'

const { platform } = storeToRefs(useOSStore())

const router = useRouter()
const goLibrary = () => {
  router.push({ name: 'library' })
}

const readingStore = useReadingStore()
const { openedBook } = storeToRefs(readingStore)
onActivated(() => {
  const route = useRoute()
  if (route.query.id) readingStore.openBook(Number(route.query.id))
})

const onKeyDown = (event: KeyboardEvent) => {
  // console.log('🚀 ~ file: ReadingView.vue:24 ~ onKeyDown ~ event:', event)
  switch (event.key) {
    case 'ArrowUp':
      readingStore.prevPage()
      break
    case 'ArrowDown':
      readingStore.nextPage()
      break
    case 'ArrowLeft':
      readingStore.prevPage()
      break
    case 'ArrowRight':
      readingStore.nextPage()
      break
  }
}
onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onBeforeMount(() => {
  window.removeEventListener('keydown', onKeyDown)
})

const openingChapterNavigator = ref(false)
const toggleChapterNavigator = (flag: boolean) => {
  openingChapterNavigator.value = flag
}
</script>
<template>
  <div class="bg-zinc-900 flex flex-col items-stretch justify-between w-full h-full">
    <div
      class="bg-zinc-950 border-zinc-800 grid items-center px-8 py-3 border-b"
      style="grid-template-columns: 1fr min-content 1fr"
      :class="platform == 'darwin' ? 'pl-24' : ''"
    >
      <NarrowButton
        iconStyle="ri-logout-circle-line"
        :action="goLibrary"
        class="justify-self-start"
      />
      <p
        class="text-apathetic-500 justify-self-center whitespace-nowrap text-xl italic font-medium"
      >
        {{
          (openedBook?.title?.length || 0) > 12
            ? openedBook?.title.slice(0, 12) + '...'
            : openedBook?.title
        }}
        | {{ openedBook?.creator }}
      </p>

      <NarrowButton iconStyle="ri-equalizer-line" class="justify-self-end" />
    </div>
    <div
      class="grow text-slate-50 relative flex justify-between"
      style="-webkit-app-region: no-drag"
    >
      <Transition name="slide">
        <ChapterNavigator v-show="openingChapterNavigator" />
      </Transition>

      <button
        @click="readingStore.prevPage"
        class="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-50/5 shrink-0 p-2 transition-colors"
      >
        <i class="ri-skip-left-line" style="font-size: 32px"></i>
      </button>
      <div id="viewer" class="!text-zinc-50 h-full grow container overflow-hidden"></div>
      <button
        @click="readingStore.nextPage"
        class="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-50/5 shrink-0 p-2 transition-colors"
      >
        <i class="ri-skip-right-line" style="font-size: 32px"></i>
      </button>
    </div>
    <div
      class="bg-zinc-950 border-zinc-800 grid items-center px-8 py-3 border-t"
      style="grid-template-columns: 1fr min-content 1fr"
    >
      <NarrowButton
        iconStyle="ri-compass-3-line"
        :active="openingChapterNavigator"
        activeStyle="!bg-apathetic-500/20 !text-apathetic-500 hover:!border-apathetic-500/80"
        :action="() => toggleChapterNavigator(!openingChapterNavigator)"
        class="justify-self-start"
      />
      <p class="text-zinc-400 justify-self-center whitespace-nowrap text-xl italic font-medium">
        4 | 366
      </p>
      <NarrowButton
        iconStyle="ri-bookmark-line"
        :active="openingChapterNavigator"
        activeStyle="!bg-apathetic-500/20 !text-apathetic-500 hover:!border-apathetic-500/80"
        :action="() => toggleChapterNavigator(!openingChapterNavigator)"
        class="justify-self-end"
      />
    </div>
  </div>
</template>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-400px);
}
</style>
