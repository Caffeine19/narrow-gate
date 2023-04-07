<script setup lang="ts">
import NarrowSider from './NarrowSider.vue'
import NarrowGallery from './NarrowGallery.vue'
import NarrowDetail from './NarrowDetail.vue'
</script>
<template>
  <NarrowSider />
  <div class="grow flex" style="-webkit-app-region: no-drag">
    <NarrowGallery class="basis-8/12 overflow-hidden" />
    <NarrowDetail class="basis-4/12 overflow-hidden" />
  </div>
</template>
