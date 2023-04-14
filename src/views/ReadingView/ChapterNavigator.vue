<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'

import NarrowButton from '@/components/NarrowButton.vue'
import { onDeactivated } from 'vue'

const bookStore = useBookStore()
const { chapterList, expandedChapterList, currentChapterHref } = storeToRefs(bookStore)

const onExpandButtonClick = (id: string) => {
  if (expandedChapterList.value.includes(id)) {
    bookStore.collapseChapter(id)
  } else {
    bookStore.expandChapter(id)
  }
}
onDeactivated(() => {
  expandedChapterList.value.length = 0
})
</script>
<template>
  <div
    class="bg-zinc-900/60 border-zinc-800 backdrop-blur-2xl custom-scrollbar xl:w-1/3 md:w-1/2 absolute z-10 flex flex-col w-2/3 h-full max-w-lg p-8 space-y-5 overflow-y-auto border-r"
  >
    <div class="border-zinc-600 text-zinc-50 flex items-center pb-5 space-x-3 border-b">
      <i class="ri-list-unordered" style="font-size: 28px"></i>
      <p class="text-2xl italic font-semibold">Chapter</p>
    </div>
    <ul class="text-zinc-50 flex flex-col space-y-3">
      <li
        class="flex flex-col p-2 space-y-3 transition-colors border rounded"
        v-for="(chapter, index) in chapterList"
        :key="index"
        :class="[
          expandedChapterList.includes(chapter.id)
            ? '!bg-zinc-800 !border-zinc-700'
            : 'border-transparent',
          chapter.href.includes(currentChapterHref || '')
            ? '!bg-apathetic-500 !text-apathetic-50 hover:!bg-apathetic-500/90'
            : 'hover:bg-zinc-50/10'
        ]"
      >
        <div
          class="flex items-center justify-between space-x-3 text-lg border-b"
          :class="
            chapter.subitems &&
            chapter.subitems.length > 0 &&
            expandedChapterList.includes(chapter.id)
              ? 'border-apathetic-500 pb-2'
              : 'border-transparent'
          "
          @click="() => bookStore.goChapter(chapter.href)"
        >
          <p class="flex items-center">
            <i class="ri-checkbox-blank-circle-fill mr-2" style="font-size: 8px"></i>
            {{ chapter.label }}{{ chapter.href }}
          </p>
          <NarrowButton
            :iconStyle="
              expandedChapterList.includes(chapter.id)
                ? 'ri-contract-up-down-line'
                : 'ri-expand-up-down-line'
            "
            :action="() => onExpandButtonClick(chapter.id)"
            :active="expandedChapterList.includes(chapter.id)"
            activeStyle="!text-apathetic-500 !bg-apathetic-500/10 "
            v-if="chapter.subitems && chapter.subitems.length > 0"
          ></NarrowButton>
        </div>
        <ul
          class="flex flex-col px-5 space-y-2"
          v-show="
            chapter.subitems &&
            chapter.subitems.length > 0 &&
            expandedChapterList.includes(chapter.id)
          "
        >
          <li
            v-for="(subChapter, index) in chapter.subitems"
            :key="index"
            class="flex items-center"
            @click="() => bookStore.goChapter(subChapter.href)"
            :class="
              subChapter.href.includes(currentChapterHref || 'fuck') ? 'text-apathetic-500' : ''
            "
          >
            <i class="ri-checkbox-blank-circle-fill mr-2" style="font-size: 8px"></i>
            {{ subChapter.label }}{{ subChapter.href }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
