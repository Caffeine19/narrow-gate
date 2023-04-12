<script setup lang="ts">
withDefaults(
  defineProps<{
    action?: Function
    iconStyle: string
    label?: string
    buttonStyle?: string
    labelStyle?: string
    active?: boolean
    activeStyle?: string
  }>(),
  {
    action: () => console.log('narrow-button-clicked')
  }
)


</script>
<template>
  <button
    @click="() => action()"
    class="text-zinc-400 hover:bg-zinc-50/10 hover:text-zinc-50 hover:border-zinc-700 flex items-center h-8 px-1 transition-colors border border-transparent rounded"
    :class="[buttonStyle, active ? activeStyle : '']"
  >
    <i :class="iconStyle" style="font-size: 24px"></i>
    <p v-if="label" class="text-lg" :class="labelStyle">{{ label }}</p>
  </button>
</template>
