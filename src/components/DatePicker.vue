<script setup lang="ts">
import { ref } from 'vue'

import DropMenu from './DropMenu.vue'

import type { MenuItem } from '@/types/menuItem'
import dayjs from 'dayjs'

const props = defineProps<{ dateValue: { year: string; month: string } }>()

const emits = defineEmits<{ (e: 'dateChange', date: { year: string; month: string }): void }>()

const yearMenu: MenuItem[] = [
  ...Array.from({ length: 20 }, (_, index) => {
    const year = dayjs().subtract(index, 'year').format('YYYY')
    return { label: year, value: year }
  }),
  {
    iconStyle: 'ri-eraser-line',
    label: 'clear',
    value: 'clear',
    buttonStyle: '!text-passion-500/80 hover:!text-passion-500 mt-0.5 border-zinc-700 border-t',
    activeStyle: 'bg-transparent'
  }
]

const monthMenu: MenuItem[] = [
  ...Array.from({ length: 12 }, (_, index) => {
    const month = index >= 10 ? index.toString() : '0' + index
    return { label: month, value: month }
  }),
  {
    iconStyle: 'ri-eraser-line',
    label: 'clear',
    value: 'clear',
    buttonStyle: '!text-passion-500/80 hover:!text-passion-500 mt-0.5 border-zinc-700 border-t',
    activeStyle: 'bg-transparent'
  }
]
const dateMenuVisible = ref(false)
const toggleDateMenu = (flag: boolean) => {
  dateMenuVisible.value = flag
}

const currentMenu = ref<MenuItem[]>()

const dateValue = ref({ year: dayjs().format('YYYY'), month: dayjs().format('MM') })

const currentMenuType = ref<'year' | 'month' | undefined>()
const onDateButtonClick = (menu: 'year' | 'month') => {
  if (!dateMenuVisible.value || currentMenuType.value !== menu) {
    toggleDateMenu(true)
    currentMenuType.value = menu
  } else {
    toggleDateMenu(false)
    currentMenuType.value = undefined
  }
  if (menu === 'year') currentMenu.value = yearMenu
  if (menu === 'month') currentMenu.value = monthMenu
}

const onMenuItemClick = (index: number) => {
  if (currentMenuType.value === 'year') {
    dateValue.value.year = yearMenu[index].value
  } else {
    dateValue.value.month = monthMenu[index].value
  }
  emits('dateChange', dateValue.value)
}
</script>
<template>
  <DropMenu
    :menuItemList="currentMenu"
    :visible="dateMenuVisible"
    :selectedMenuItemIndex="0"
    @select="onMenuItemClick"
  >
    <template #trigger>
      <div class="flex items-stretch">
        <button
          @click="onDateButtonClick('year')"
          :class="currentMenuType == 'year' ? ' text-apathetic-400 ' : ' text-zinc-50 '"
          class="bg-zinc-800 border-zinc-700 p-1 px-1.5 transition-colors border border-r-0 rounded-l"
        >
          {{ dateValue.year }}
        </button>
        <div class="w-[1px] border-zinc-700 border-r"></div>
        <button
          @click="onDateButtonClick('month')"
          class="bg-zinc-800 border-zinc-700 p-1 px-1.5 transition-colors border border-l-0 rounded-r"
          :class="currentMenuType == 'month' ? 'text-apathetic-400  ' : ' text-zinc-50 '"
        >
          {{ dateValue.month }}
        </button>
      </div>
    </template>
  </DropMenu>
</template>
