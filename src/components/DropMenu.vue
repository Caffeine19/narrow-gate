<script setup lang="ts">
import {
  ref,
  type PropType,
  reactive,
  useSlots,
  h,
  Fragment,
  computed,
  nextTick,
  type VNodeArrayChildren,
  watch
} from 'vue'
import NarrowButton from './NarrowButton.vue'
import type { MenuItem } from '@/types/menuItem'
const props = defineProps({
  menuItemList: Array as PropType<MenuItem[]>,
  selectedMenuItemIndex: Number,
  visible: { type: Boolean, defaults: false }
})

const selectedMenuItemIndex = ref(
  props.selectedMenuItemIndex === undefined ? -1 : props.selectedMenuItemIndex
)

const emits = defineEmits<{ (e: 'select', index: number): void }>()
const onMenuItemClick = (index: number) => {
  if (selectedMenuItemIndex.value === index) return
  selectedMenuItemIndex.value = index
  emits('select', index)
}

const menuRef = ref<null | HTMLElement>()
const menuPosition = reactive({ top: 0, left: 0 })

const slots = useSlots()

const TriggerSlotRenderer = computed<any>(() => h(Fragment, slots.trigger ? slots.trigger() : []))

watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) return
    nextTick(() => {
      if (TriggerSlotRenderer.value.children) {
        const triggerSlot = (TriggerSlotRenderer.value.children as VNodeArrayChildren)[0]

        const menuRect = menuRef.value?.getBoundingClientRect()

        if (triggerSlot && menuRect) {
          const triggerEl = (triggerSlot as any).el
          const triggerRect = triggerEl.getBoundingClientRect()
          console.log('🚀 ~ file: DropMenu.vue:54 ~ onMounted ~ rect:', triggerRect)
          menuPosition.top = triggerRect.bottom + 20

          if (triggerRect.left + menuRect.width > window.innerWidth - 40) {
            menuPosition.left = triggerRect.right - menuRect.width
          } else {
            menuPosition.left = triggerRect.left
          }
        }
      }
    })
  }
)
</script>

<template>
  <div>
    <TriggerSlotRenderer />
    <Teleport to="body">
      <transition name="zoom">
        <div
          v-if="visible"
          class="bg-zinc-950/60 border-zinc-700 backdrop-blur-xl fixed z-20 flex flex-col items-stretch space-y-2 border rounded py-1.5 top-20 left-20 max-h-64 overflow-y-auto custom-scrollbar"
          :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
          ref="menuRef"
        >
          <NarrowButton
            :action="() => onMenuItemClick(index)"
            v-for="(item, index) in menuItemList"
            :key="index"
            :iconStyle="item.iconStyle"
            :label="item.label"
            :activeStyle="
              item.activeStyle ||
              'bg-apathetic-500 text-zinc-50 hover:!bg-apathetic-500/80 hover:!text-zinc-50'
            "
            labelStyle="text-base font-normal"
            class="space-x-1.5 rounded-none px-2 py-1.5 border-0"
            :active="selectedMenuItemIndex === index"
            :class="item.buttonStyle"
          >
          </NarrowButton>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: opacity 0.2s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
}
</style>
