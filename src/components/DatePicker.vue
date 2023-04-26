<script setup lang="ts">
import { reactive, ref } from 'vue'

import DropMenu from './DropMenu.vue'

import type { MenuItem } from '@/types/menuItem'

const monthMenu = reactive<MenuItem[]>([
  {
    label: 'title',
    value: 'title'
  },
  {
    label: 'creator',
    value: 'creator'
  },
  {
    label: 'size',
    value: 'size'
  },
  {
    label: 'pubdate',
    value: 'pubdate'
  },
  {
    label: 'addedDate',
    value: 'addedDate'
  },
  {
    label: 'lastOpenedDate',
    value: 'lastOpenedDate'
  },
  {
    iconStyle: 'ri-eraser-line',
    label: 'clear',
    value: 'clear',
    buttonStyle: '!text-passion-500/80 hover:!text-passion-500 mt-0.5 border-zinc-700 border-t',
    activeStyle: 'bg-transparent'
  }
])
const monthMenuVisible = ref(false)
const toggleMonthMenu = (flag: boolean) => {
  monthMenuVisible.value = flag
}
</script>
<template>
  <div
    class="bg-zinc-800 space-x-1.5 border-zinc-700 flex items-stretch rounded text-zinc-50 py-1 px-1.5 border"
  >
    <DropMenu :menuItemList="monthMenu" :visible="monthMenuVisible">
      <template #trigger
        ><button @click="toggleMonthMenu(!monthMenuVisible)">2023</button></template
      >
    </DropMenu>

    <div class="w-[1px] border-zinc-700 border-r"></div>
    <button>04</button>
  </div>
</template>
