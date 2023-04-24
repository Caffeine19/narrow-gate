<script setup lang="ts">
import type { ActivityLevel } from '@/types/ActivityLevel'

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const generateActivityColor = () => {
  const level = Math.floor(Math.random() * 5) as ActivityLevel
  switch (level) {
    case 0:
      return 'bg-tea-400/10'
    case 1:
      return 'bg-tea-700'
    case 2:
      return 'bg-tea-600'
    case 3:
      return 'bg-tea-500'
    case 4:
      return 'bg-tea-400'
  }
}
</script>
<template>
  <table class="mx-auto">
    <tr v-for="(day, index) in week" :key="index">
      <td>{{ day }}</td>
      <td v-for="(item, index) in 5" :key="index">
        <div class="h-7 w-12 rounded" :class="generateActivityColor()"></div>
      </td>
    </tr>

    <tr>
      <td></td>
      <td>1st</td>
      <td>2nd</td>
      <td>3rd</td>
      <td>4th</td>
      <td>5th</td>
    </tr>
  </table>
</template>
<style scoped>
td {
  @apply text-zinc-300 px-1.5 py-1.5;
}
</style>
