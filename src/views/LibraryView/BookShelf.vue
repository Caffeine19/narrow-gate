<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useBookStore } from '@/stores/book'

import NarrowButton from '@/components/NarrowButton.vue'
import GridLayout from './GridLayout.vue'
import TableLayout from './TableLayout.vue'
import GroupLayout from './GroupLayout.vue'
import DropMenu from '@/components/DropMenu.vue'

import type { MenuItem } from '@/types/menuItem'

const bookStore = useBookStore()
const { bookCoverList } = storeToRefs(bookStore)
onMounted(() => {
  bookStore.getBookCoverList()
})

const enum Layout {
  TABLE,
  Grid
}
const currentLayout = ref(Layout.Grid)
const toggleLayout = (newVal: Layout) => {
  currentLayout.value = newVal
}

const sortMenu = reactive<MenuItem[]>([
  {
    iconStyle: 'ri-attachment-line',
    label: 'title',
    value: 'title',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-user-smile-line',
    label: 'creator',
    value: 'creator',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-file-zip-line',
    label: 'size',
    value: 'size',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-calendar-check-line',
    label: 'pubdate',
    value: 'pubdate',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-inbox-archive-line',
    label: 'addedDate',
    value: 'addedDate',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-folder-open-line',
    label: 'lastOpenedDate',
    value: 'lastOpenedDate',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-eraser-line',
    label: 'clear',
    value: 'clear',
    action: () => console.log(''),
    buttonStyle: '!text-passion-500/80 hover:!text-passion-500 mt-0.5 border-zinc-700 border-t',
    activeStyle: 'bg-transparent'
  }
])
const sortMenuVisible = ref(false)
const toggleSortMenu = (flag: boolean) => {
  sortMenuVisible.value = flag
}
const onSortMenuSelect = (index: number) => {
  console.log('🚀 ~ file: NarrowGallery.vue:59 ~ onSortMenuSelect ~ index:', index)

  bookStore.sortBook(sortMenu[index].value)
  toggleSortMenu(false)
}
const { isBookSorted } = storeToRefs(bookStore)

const { checkedBookList } = storeToRefs(bookStore)

const { isBookGrouped } = storeToRefs(bookStore)
const groupMenu = reactive<MenuItem[]>([
  {
    iconStyle: 'ri-attachment-line',
    label: 'title',
    value: 'title',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-user-smile-line',
    label: 'creator',
    value: 'creator',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-mail-send-line',
    label: 'publisher',
    value: 'publisher',
    action: () => console.log('')
  },
  {
    iconStyle: 'ri-eraser-line',
    label: 'clear',
    value: 'clear',
    action: () => console.log(''),
    buttonStyle: '!text-passion-500/80 hover:!text-passion-500 mt-0.5 border-zinc-700 border-t',
    activeStyle: 'bg-transparent'
  }
])
const groupMenuVisible = ref(false)
const toggleGroupMenu = (flag: boolean) => {
  groupMenuVisible.value = flag
}
const onGroupMenuSelect = (index: number) => {
  bookStore.groupBook(groupMenu[index].value)
  toggleGroupMenu(false)
}
</script>
<template>
  <div class="custom-scrollbar relative overflow-y-auto">
    <div
      class="bg-zinc-950/80 border-zinc-800 backdrop-blur-2xl sticky top-0 z-10 flex items-center justify-between px-8 py-3 border-b"
      style="-webkit-app-region: drag"
    >
      <div class="flex items-center space-x-3">
        <div class="border-zinc-700 flex p-1 space-x-1 border rounded">
          <NarrowButton
            :action="() => toggleLayout(Layout.Grid)"
            iconStyle="ri-stack-line"
            :active="currentLayout == Layout.Grid"
            buttonStyle=" border-0"
            activeStyle="!bg-zinc-600 text-zinc-50"
          />
          <NarrowButton
            :action="() => toggleLayout(Layout.TABLE)"
            iconStyle="ri-table-line"
            :active="currentLayout == Layout.TABLE"
            buttonStyle=" border-0"
            activeStyle="!bg-zinc-600 text-zinc-50"
          />
        </div>
        <NarrowButton iconStyle="ri-filter-3-line" />
        <NarrowButton iconStyle="ri-checkbox-multiple-blank-line" />

        <DropMenu :menuItemList="sortMenu" :visible="sortMenuVisible" @select="onSortMenuSelect">
          <template #trigger>
            <NarrowButton
              iconStyle="ri-arrow-up-down-line"
              :action="() => toggleSortMenu(!sortMenuVisible)"
              :class="
                isBookSorted
                  ? '!bg-apathetic-500/20 !text-apathetic-500 hover:!border-apathetic-500/80'
                  : ''
              "
            />
          </template>
        </DropMenu>
        <DropMenu :menuItemList="groupMenu" :visible="groupMenuVisible" @select="onGroupMenuSelect">
          <template #trigger>
            <NarrowButton
              iconStyle="ri-archive-drawer-line"
              :action="() => toggleGroupMenu(!groupMenuVisible)"
              :active="isBookGrouped"
              :class="
                isBookGrouped
                  ? '!bg-apathetic-500/20 !text-apathetic-500 hover:!border-apathetic-500/80'
                  : ''
              "
            ></NarrowButton
          ></template>
        </DropMenu>
      </div>
      <div class="flex items-center space-x-3">
        <NarrowButton
          iconStyle="ri-add-line"
          :action="bookStore.addBook"
          label="Add"
          buttonStyle="bg-apathetic-500 hover:!bg-apathetic-500/90 !text-apathetic-50 pr-1.5 hover:!border-apathetic-500 border-apathetic-600 hover:!text-apathetic-50"
        />
        <NarrowButton
          v-if="checkedBookList.length > 0"
          iconStyle="ri-fire-line"
          :action="
            () => {
              bookStore.deleteBook(checkedBookList)
              bookStore.uncheckAllBook()
            }
          "
          label="Delete"
          buttonStyle="bg-passion-500 hover:!bg-passion-500/90 !text-passion-50 pr-1.5 hover:!border-passion-500 border-passion-600 hover:!text-passion-50"
        />
      </div>
    </div>

    <keep-alive>
      <component
        :is="currentLayout == Layout.TABLE ? TableLayout : isBookGrouped ? GroupLayout : GridLayout"
        :bookCoverList="bookCoverList"
      ></component>
    </keep-alive>
  </div>
</template>
<style>
.box {
  background: linear-gradient(135deg, #f57325, #313ef0, #7479d1, #ddd9f3);
  background-size: 400% 400%;
  animation: gradient 6s ease infinite;
  height: 200px;
  width: 160px;
  clip-path: polygon(
    43.75% 0%,
    56.25% 0%,
    56.25% 30%,
    100% 30%,
    100% 40%,
    56.25% 40%,
    56.25% 100%,
    43.75% 100%,
    43.75% 40%,
    0% 40%,
    0% 30%,
    43.75% 30%
  );
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>