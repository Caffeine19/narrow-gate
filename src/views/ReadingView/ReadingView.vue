<script setup lang="ts">
import { onActivated, onBeforeMount, onMounted } from 'vue'

import NarrowButton from '@/components/NarrowButton.vue'

import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { useOSStore } from '@/stores/os'

import { useRoute, useRouter } from 'vue-router'

const { platform } = storeToRefs(useOSStore())

const router = useRouter()
const goLibrary = () => {
  router.push({ name: 'library' })
}

const bookStore = useBookStore()
const { openedBook } = storeToRefs(bookStore)

onActivated(() => {
  const route = useRoute()
  if (route.query.id) bookStore.openBook(Number(route.query.id))
})
// onMounted(() => {

// })

const onKeyDown = (event: KeyboardEvent) => {
  // console.log('🚀 ~ file: ReadingView.vue:24 ~ onKeyDown ~ event:', event)
  switch (event.key) {
    case 'ArrowUp':
      bookStore.prevPage()
      break
    case 'ArrowDown':
      bookStore.nextPage()
      break
    case 'ArrowLeft':
      bookStore.prevPage()
      break
    case 'ArrowRight':
      bookStore.nextPage()
      break
  }
}
onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})
onBeforeMount(() => {
  document.removeEventListener('keydown', onKeyDown)
})
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
      <p class="text-zinc-400 justify-self-center whitespace-nowrap text-xl italic font-medium">
        {{
          (openedBook?.title?.length || 0) > 12
            ? openedBook?.title.slice(0, 12) + '...'
            : openedBook?.title
        }}
        | {{ openedBook?.creator }}
      </p>

      <NarrowButton iconStyle="ri-equalizer-line" class="justify-self-end" />
    </div>
    <div class="grow text-slate-50 flex justify-between" style="-webkit-app-region: no-drag">
      <button
        @click="bookStore.prevPage"
        class="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-50/5 shrink-0 p-2 transition-colors"
      >
        <i class="ri-skip-left-line" style="font-size: 32px"></i>
      </button>
      <div id="viewer" class="!text-zinc-50 h-full grow container overflow-hidden"></div>
      <button
        @click="bookStore.nextPage"
        class="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-50/5 shrink-0 p-2 transition-colors"
      >
        <i class="ri-skip-right-line" style="font-size: 32px"></i>
      </button>
    </div>
    <div class="bg-zinc-950 border-zinc-800 flex items-center justify-between px-8 py-3 border-b">
      <NarrowButton iconStyle="ri-side-bar-line" :action="goLibrary" class="justify-self-start" />
      <p class="text-zinc-400 justify-self-center text-xl italic font-medium">4 | 366</p>
    </div>
  </div>
</template>
