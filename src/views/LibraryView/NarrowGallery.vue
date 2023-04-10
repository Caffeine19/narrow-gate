<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useBookStore } from '@/stores/book'

import NarrowButton from '@/components/NarrowButton.vue'
import GridLayout from './GridLayout.vue'
import TableLayout from './TableLayout.vue'

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
const toggleLayout = () => {
  currentLayout.value = currentLayout.value == Layout.Grid ? Layout.TABLE : Layout.Grid
}
</script>
<template>
  <div class="custom-scrollbar relative overflow-y-auto">
    <div
      style="-webkit-app-region: drag"
      class="bg-zinc-950/60 border-zinc-800 backdrop-blur-2xl sticky top-0 z-10 flex items-center justify-between px-8 py-3 border-b"
    >
      <NarrowButton iconStyle="ri-add-box-line" :action="bookStore.addBook" />
      <div class="flex items-center space-x-3">
        <NarrowButton iconStyle="ri-filter-3-line" />
        <NarrowButton iconStyle="ri-checkbox-multiple-blank-line" />
        <NarrowButton iconStyle="ri-arrow-up-down-line" />
        <NarrowButton
          :iconStyle="currentLayout == Layout.Grid ? 'ri-table-line' : 'ri-stack-line'"
          :action="toggleLayout"
        />
      </div>
    </div>
    <!-- <div class="box"></div> -->
    <component
      :is="currentLayout == Layout.Grid ? GridLayout : TableLayout"
      :bookCoverList="bookCoverList"
    ></component>
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

50-6.25
