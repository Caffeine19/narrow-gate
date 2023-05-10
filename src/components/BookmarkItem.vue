<script setup lang="ts">
import type { PropType } from 'vue';

import type { Bookmark } from '@prisma/client';

import dayjs from 'dayjs'

import {useBookmarkStore} from '@/stores/bookmark'

defineProps({bookmark:{type:Object as PropType<Bookmark>,required:true}})

const bookmarkStore = useBookmarkStore()

const copyBookmark = async (content: Bookmark['content']) => {
  try {
    await navigator.clipboard.writeText(content)
  } catch (error) {
    console.log('🚀 ~ file: BookmarkVIew.vue:38 ~ copyBookmark ~ error:', error)
  }
}
</script>
<template>
  <div
    class="border-zinc-800 hover:bg-zinc-50/5 text-zinc-50 group flex flex-col p-3 px-8 space-y-3 transition-colors border-b"
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
          iconStyle="ri-clipboard-line"
          :action="() => copyBookmark(bookmark.content)"
          buttonStyle="!bg-apathetic-400/20 !text-apathetic-400 hover:!text-apathetic-400 hover:!bg-apathetic-400/20 hover:!border-apathetic-400/60"
        />
        <NarrowButton
          iconStyle="ri-delete-bin-line"
          :action="() => bookmarkStore.deleteBookmark(bookmark.id)"
          buttonStyle="!bg-passion-400/20 !text-passion-400 hover:!text-passion-400  hover:!bg-passion-400/20 hover:!border-passion-400/60"
        />
      </div>
    </div>
  </div>
</template>
