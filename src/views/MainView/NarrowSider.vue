<script setup lang="ts">
import { useOSStore } from '@/stores/os'
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'

const { platform } = storeToRefs(useOSStore())

type RouteLink = {
  iconStyle: string
  to: string
}

const routeLinkOptions = reactive<RouteLink[]>([
  { to: 'library', iconStyle: 'ri-book-open-line' },
  // { to: 'bookmark', iconStyle: 'ri-bookmark-line' },
  { to: 'record', iconStyle: 'ri-hourglass-2-line' }
])
</script>
<template>
  <div
    class="bg-zinc-950 border-zinc-800 flex flex-col items-center justify-between h-full p-4 border-r"
    :class="platform == 'darwin' ? 'pt-16' : 'pt-4'"
    style="-webkit-app-region: drag"
  >
    <div class="flex flex-col items-center space-y-6">
      <div class="w-12 h-12"><img src="@/assets/img/Logo.svg" alt="" /></div>

      <div class="flex flex-col items-center space-y-6">
        <RouterLink
          v-for="(link, index) in routeLinkOptions"
          :key="index"
          :to="{ name: link.to }"   style="-webkit-app-region: no-drag"
          activeClass="!text-apathetic-400"
          class="text-zinc-400 flex items-center justify-center transition-colors"
        >
          <i style="font-size: 28px" :class="link.iconStyle"></i>
        </RouterLink>
      </div>
    </div>

    <button class="text-zinc-50"    style="-webkit-app-region: no-drag">
      <i class="ri-settings-4-line" style="font-size: 28px"></i>
    </button>
  </div>
</template>
