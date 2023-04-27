<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import NarrowButton from '@/components/NarrowButton.vue'
import ChapterNavigator from './ChapterNavigator.vue'

import { storeToRefs } from 'pinia'
import { useOSStore } from '@/stores/os'
import { useReadingStore } from '@/stores/reading'
import { useRecordStore } from '@/stores/record'

dayjs.extend(duration)

const { platform } = storeToRefs(useOSStore())

const readingStore = useReadingStore()
const { openedBook } = storeToRefs(readingStore)

const recordStore = useRecordStore()
const { recordDuration, isRecording, recordGaps } = storeToRefs(recordStore)

// eslint-disable-next-line no-undef
let setLastRecordGapEndTimer: string | number | undefined | NodeJS.Timer
const route = useRoute()
onMounted(() => {
  if (route.query.id) {
    isRecording.value = true
    readingStore.openBook(Number(route.query.id))
    recordGaps.value = []
    recordStore.addRecordGap()
    setLastRecordGapEndTimer = setInterval(() => recordStore.setLastRecordGapEnd(), 1000)
  }
})

const formattedDuration = computed(() => dayjs.duration(recordDuration.value).format('HH:mm:ss'))

const onTimerButtonClick = () => {
  if (isRecording.value) {
    clearInterval(setLastRecordGapEndTimer)
    isRecording.value = false
  } else {
    isRecording.value = true
    recordStore.addRecordGap()
    setLastRecordGapEndTimer = setInterval(() => recordStore.setLastRecordGapEnd(), 1000)
  }
}

const router = useRouter()
const goLibrary = () => {
  clearInterval(setLastRecordGapEndTimer)
  recordStore.createRecord(Number(route.query.id))
  router.push({ name: 'library' })
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!isRecording.value) return
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
onBeforeUnmount(() => {
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
      style="grid-template-columns: 1fr min-content 1fr; -webkit-app-region: drag"
      :class="platform == 'darwin' ? 'pl-24' : ''"
    >
      <NarrowButton
        iconStyle="ri-logout-circle-line"
        :action="goLibrary"
        class="justify-self-start"
        style="-webkit-app-region: no-drag"
      />
      <p class="text-zinc-200 justify-self-center whitespace-nowrap text-xl italic font-medium">
        {{
          (openedBook?.title?.length || 0) > 12
            ? openedBook?.title.slice(0, 12) + '...'
            : openedBook?.title
        }}
        | {{ openedBook?.creator }}
      </p>
      <div class="justify-self-end flex items-center space-x-3">
        <NarrowButton
          :iconStyle="isRecording ? 'ri-stop-circle-line' : 'ri-play-circle-line'"
          class="bg-zinc-800 px-3 py-1 space-x-2"
          :class="
            isRecording
              ? '!text-passion-400 hover:!text-passion-400'
              : '!text-tea-400 hover:!text-tea-400'
          "
          labelStyle="text-zinc-50"
          :label="formattedDuration"
          :action="onTimerButtonClick"
          style="-webkit-app-region: no-drag"
        >
          ></NarrowButton
        >

        <NarrowButton iconStyle="ri-equalizer-line" style="-webkit-app-region: no-drag" />
      </div>
    </div>
    <div
      class="grow text-slate-50 relative flex justify-between"
      style="-webkit-app-region: no-drag"
    >
      <div
        class="bg-zinc-950/60 backdrop-blur-2xl absolute top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center w-full h-full"
        v-if="!isRecording"
      >
        <div class="animate-pulse flex flex-col items-center justify-center space-y-1">
          <i style="font-size: 64px" class="ri-play-circle-fill text-tea-400"></i>
          <p class="text-tea-50">Stopping</p>
        </div>
      </div>
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
