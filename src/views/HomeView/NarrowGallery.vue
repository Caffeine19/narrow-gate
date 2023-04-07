<script setup lang="ts">
import ePub from 'epubjs'

import { reactive } from 'vue'

type BookCover = {
  img: string
  creator: string
  title: string
}

const coverList = reactive<BookCover[]>([])
const openDialog = async () => {
  const res = await window.electronAPI.openDialog('123')
  console.log({ res })

  let book = ePub()

  await book.open(res.arrayBuffer)

  //获取元信息
  const metadata = await book.loaded.metadata
  console.log('🚀 ~ file: NarrowGallery.vue:20 ~ openDialog ~ metadata:', metadata)

  // 获取封面URL
  const coverUrl = await book.coverUrl()
  console.log('🚀 ~ file: NarrowGallery.vue:14 ~ openDialog ~ coverUrl:', coverUrl)

  if (coverUrl) {
    coverList.push({ img: coverUrl, title: metadata.title, creator: metadata.creator })
    fetch(coverUrl)
      .then((response) => {
        console.log('🚀 ~ file: NarrowGallery.vue:20 ~ .then ~ response:', response)
        return response.arrayBuffer()
      })
      .then((blob) => {
        // 将Blob对象保存为文件
        console.dir({ blob })
      })
  }

  //   var rendition = book.renderTo('viewer', {
  //     width: '25%',
  //     height: 200,
  //     spread: 'always'
  //   })

  //   rendition.display()
}
</script>
<template>
  <div class="relative overflow-y-auto">
    <div
      class="bg-zinc-900/80 border-zinc-700 backdrop-blur-2xl sticky top-0 z-10 flex items-center justify-between px-8 py-3 border-b"
    >
      <button
        @click="openDialog"
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
        v-for="(cover, index) in coverList"
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
