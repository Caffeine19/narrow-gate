<script setup lang="ts">
defineProps<{
  name: string
  value: string | number
  textColor: string
  bgColor: string
  iconStyle: string
}>()
</script>
<template>
  <div
    class="bg-zinc-800 hover:bg-zinc-800/80 border-zinc-700 flex justify-between px-5 py-4 transition-colors border rounded"
  >
    <div class="space-y-1.5">
      <p class="text-zinc-300 text-xl font-medium">{{ name }}</p>
      <p class="text-zinc-50 text-3xl font-semibold">{{ value }}</p>
      <p class="text-zinc-400"><span :class="textColor">+ 12</span> from last week</p>
    </div>
    <div
      :class="[textColor, bgColor]"
      class="w-14 h-14 flex items-center justify-center rounded-full"
    >
      <i :class="iconStyle" style="font-size: 36px"></i>
    </div>
  </div>
</template>
