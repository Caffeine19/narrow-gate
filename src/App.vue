<script setup lang="ts">
import NarrowSider from './views/HomeView/NarrowSider.vue'
import NarrowGallery from './views/HomeView/NarrowGallery.vue'
import NarrowDetail from './views/HomeView/NarrowDetail.vue'
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <NarrowSider />
    <div class="grow flex" style="-webkit-app-region: no-drag">
      <NarrowGallery class="basis-3/4 overflow-hidden" />
      <NarrowDetail class="basis-1/4 overflow-hidden" />
    </div>
  </div>
</template>
