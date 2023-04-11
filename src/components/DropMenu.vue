<script setup lang="ts">
import { ref, type PropType, reactive } from 'vue'
import NarrowButton from './NarrowButton.vue'
import type { MenuItem } from '@/types/menuItem'
defineProps({
  menuItemList: Array as PropType<MenuItem[]>,
  visible: { type: Boolean, defaults: false }
})

const selectedMenuItemIndex = ref(-1)

const emits = defineEmits<{ (e: 'select', index: number): void }>()
const onMenuItemClick = (index: number) => {
  if (selectedMenuItemIndex.value === index) return
  selectedMenuItemIndex.value = index
  emits('select', index)
}

const menuPosition = reactive({ top: 0, left: 0 })

const calMenuPosition = (event: MouseEvent) => {
  console.log(event.target)
  if (event.target) {
    const rect = (event.target as Element).getBoundingClientRect()

    menuPosition.top = rect.bottom + 20
    menuPosition.left = rect.left
  }
}
</script>

<template>
  <div @click.stop="calMenuPosition">
    <slot></slot>
    <Teleport to="body">
      <transition name="zoom">
        <div
          v-if="visible"
          class="bg-zinc-950/60 border-zinc-700 backdrop-blur-xl fixed z-20 flex flex-col items-stretch space-y-2 border rounded py-1.5 top-20 left-20"
          :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
        >
          <NarrowButton
            :action="() => onMenuItemClick(index)"
            v-for="(item, index) in menuItemList"
            :key="index"
            :iconStyle="item.iconStyle"
            :label="item.label"
            activeStyle="bg-apathetic-500 text-zinc-50 hover:bg-apathetic-500 hover:text-zinc-50"
            labelStyle="text-base font-normal"
            class="space-x-1.5 rounded-none px-2 py-1.5 border-0"
            :active="selectedMenuItemIndex === index"
          >
          </NarrowButton>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style>
.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
