<script setup lang="ts">
withDefaults(
  defineProps<{
    action?: Function
    iconStyle: string
    label?: string
    buttonStyle?: string
    labelStyle?: string
  }>(),
  {
    action: () => console.log('narrow-button-clicked')
  }
)
</script>
<template>
  <button
    @click="() => action()"
    class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 flex items-center justify-center h-8 px-1 transition-colors rounded"
    :class="buttonStyle"
  >
    <i :class="iconStyle" style="font-size: 24px"></i>
    <p v-if="label" class="text-lg" :class="labelStyle">{{ label }}</p>
  </button>
</template>
