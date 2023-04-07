<script setup lang="ts">
import NarrowButton from '@/components/NarrowButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goLibrary = () => {
  router.push({ name: 'library' })
}
</script>
<template>
  <div class="bg-zinc-900 flex flex-col items-stretch justify-between w-full h-full">
    <div class="bg-zinc-950 border-zinc-800 grid items-center grid-cols-3 px-8 py-3 pl-24 border-b">
      <NarrowButton
        iconStyle="ri-logout-circle-line"
        :action="goLibrary"
        class="justify-self-start"
      />
      <p class="text-zinc-400 justify-self-center text-xl italic font-medium">帷幕 | 米兰昆德拉</p>
      <NarrowButton iconStyle="ri-equalizer-line" class="justify-self-end" />
    </div>
    <div class="grow"></div>
    <div class="bg-zinc-950 border-zinc-800 flex items-center justify-between px-8 py-3 border-b">
      <NarrowButton iconStyle="ri-side-bar-line" :action="goLibrary" class="justify-self-start" />
      <p class="text-zinc-400 justify-self-center text-xl italic font-medium">4 | 366</p>
    </div>
  </div>
</template>
