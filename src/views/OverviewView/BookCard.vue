<script setup lang="ts">
type BookCard = {
  title: string
  creator: string
  bookCover: string
  info: {
    name: string
    value: any
    iconStyle: string
  }[]
}

defineProps<BookCard>()
</script>

<template>
  <div
    class="bg-zinc-800 border-zinc-700 w-fit hover:bg-zinc-800/80 flex items-stretch p-3 space-x-3 transition-colors border rounded"
  >
    <div class="w-32"><img :src="bookCover" class="h-40 rounded" alt="" /></div>

    <div class="flex flex-col justify-between space-y-1">
      <ul class="flex flex-col space-y-2">
        <li class="text-apathetic-400 text-xl font-medium">
          {{ title.length > 12 ? title.slice(0, 12) + '...' : title }}
        </li>
        <li class="text-zinc-200">
          {{ creator.length > 12 ? creator.slice(0, 12) + '...' : creator }}
        </li>
      </ul>

      <ul class="flex flex-col space-y-1">
        <li
          class="flex items-center justify-between space-x-8"
          v-for="(i, index) in info"
          :key="index"
        >
          <div class="text-zinc-50 flex items-center space-x-2">
            <i :class="i.iconStyle" style="font-size: 24px"></i>
            <p>{{ i.name }}</p>
          </div>
          <p class="text-zinc-300 whitespace-nowrap">{{ i.value }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
