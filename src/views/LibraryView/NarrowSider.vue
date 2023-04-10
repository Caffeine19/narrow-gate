<script setup lang="ts">
import { useOSStore } from '@/stores/os'
import { storeToRefs } from 'pinia'

const { platform } = storeToRefs(useOSStore())
</script>
<template>
  <div
    class="bg-zinc-950 border-zinc-800 flex flex-col items-center justify-between h-full p-4 border-r"
    :class="platform == 'darwin' ? 'pt-16' : 'pt-4'"
  >
    <div class="w-12 h-12"><img src="@/assets/img/Logo.svg" alt="" /></div>

    <button class="text-zinc-50">
      <i class="ri-settings-4-line" style="font-size: 28px"></i>
    </button>
  </div>
</template>
