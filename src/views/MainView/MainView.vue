<script setup lang="ts">
import { onMounted } from 'vue'

import { useOSStore } from '@/stores/os'

import NarrowSider from './NarrowSider.vue'
import { useRoute } from 'vue-router'
const osStore = useOSStore()

onMounted(() => {
  window.electronAPI.platform((event, value) => {
    console.log('🚀 ~ file: App.vue:4 ~ window.electronAPI.platform ~ value:', value)
    osStore.setPlatform(value)
  })
})

const route = useRoute()
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <NarrowSider v-show="route.name !== 'reading'" />
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
