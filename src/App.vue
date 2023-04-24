<script setup lang="ts">
import { onMounted } from 'vue'
import { useOSStore } from './stores/os'
const osStore = useOSStore()
onMounted(() => {
  window.electronAPI.platform((event, value) => {
    console.log('🚀 ~ file: App.vue:4 ~ window.electronAPI.platform ~ value:', value)
    osStore.setPlatform(value)
  })
})
</script>

<template>
  <router-view />
</template>
