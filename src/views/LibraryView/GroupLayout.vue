<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import BookCard from './BookCard.vue'
import { onMounted, ref } from 'vue'
import NarrowButton from '@/components/NarrowButton.vue'

const bookStore = useBookStore()
const { groupedBookList, collapsedGroupList } = storeToRefs(bookStore)

const groupRef = ref<null[] | HTMLElement[]>([])
const onLinkClick = (index: number) => {
  const el = groupRef.value[index]
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
const intoViewGroup = ref(0)
const bookShelfRef = document.getElementById('bookShelf')
onMounted(() => {
  if (bookShelfRef)
    bookShelfRef.addEventListener('scroll', () => {
      const scrollTop = bookShelfRef.scrollTop
      const containerHeight = bookShelfRef.clientHeight - 320
      groupRef.value.forEach((section, index) => {
        if (section) {
          const chapterTop = section.offsetTop
          const chapterBottom = chapterTop + section.offsetHeight

          if (
            chapterTop <= scrollTop + containerHeight / 2 &&
            chapterBottom > scrollTop + containerHeight / 2
          ) {
            console.log({ index })
            intoViewGroup.value = index
          }
        }
      })
    })
})

const onExpandButtonClick = (key: string) => {
  if (collapsedGroupList.value.includes(key)) {
    bookStore.expandGroup(key)
  } else {
    bookStore.collapseGroup(key)
  }
}
</script>
<template>
  <div class="flex p-8 space-x-8">
    <div class="flex-1 space-y-8">
      <div v-for="(group, index) in groupedBookList" :key="index" class="space-y-4" ref="groupRef">
        <div class="flex items-center justify-between space-x-6">
          <NarrowButton
            :iconStyle="
              !collapsedGroupList.includes(group.key)
                ? 'ri-contract-up-down-line'
                : 'ri-expand-up-down-line'
            "
            :action="() => onExpandButtonClick(group.key)"
            :active="collapsedGroupList.includes(group.key)"
            activeStyle="!text-apathetic-500 !bg-apathetic-500/10 !border-apathetic-500/20 hover:!border-apathetic-500"
            buttonStyle="border-zinc-700"
          ></NarrowButton>
          <p class="text-apathetic-50 xl:text-3xl text-lg font-semibold uppercase">
            {{ group.key }}
          </p>
          <div class="h-[1px] grow bg-zinc-700"></div>
          <p class="text-zinc-400 text-lg">
            {{ group.val.length }} book{{ group.val.length > 1 ? 's' : '' }}
          </p>
        </div>
        <div
          class="gap-y-8 gap-x-8 justify-items-stretch 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid grid-cols-1 gap-8"
          v-show="!collapsedGroupList.includes(group.key)"
        >
          <BookCard
            v-for="(bookCover, index) in group.val"
            :key="index"
            :action="() => {}"
            :bookCover="bookCover"
          ></BookCard>
        </div>
      </div>
    </div>
    <ul
      class="bg-zinc-800 border-zinc-700 h-fit top-20 sticky z-10 flex flex-col py-2 border rounded"
    >
      <li
        v-for="(group, index) in groupedBookList"
        :key="index"
        class="flex items-center min-w-[8rem] px-2 transition-colors py-2 cursor-pointer"
        :class="
          intoViewGroup == index
            ? 'text-apathetic-50 bg-apathetic-500 '
            : 'text-zinc-200 hover:bg-zinc-50/10  hover:text-zinc-50'
        "
        @click="onLinkClick(index)"
      >
        <i class="ri-checkbox-blank-circle-fill mr-2" style="font-size: 4px"></i>
        {{ group.key }}
      </li>
    </ul>
  </div>
</template>
