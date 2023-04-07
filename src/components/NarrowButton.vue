<script setup lang="ts">
withDefaults(defineProps<{ action?: Function; iconStyle: string }>(), {
  action: () => console.log('narrow-button-clicked')
})
</script>
<template>
  <button
    @click="() => action()"
    class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 w-9 h-9 flex items-center justify-center transition-colors rounded"
  >
    <i :class="iconStyle" style="font-size: 28px"></i>
  </button>
</template>
