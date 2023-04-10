import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOSStore = defineStore('os', () => {
  const platform = ref<NodeJS.Platform>()

  const setPlatform = (value: NodeJS.Platform) => {
    platform.value = value
  }

  return {
    platform,
    setPlatform
  }
})
