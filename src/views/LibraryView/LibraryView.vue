<script setup lang="ts">
import NarrowSider from './NarrowSider.vue'
import NarrowGallery from './NarrowGallery.vue'
import NarrowDetail from './NarrowDetail.vue'
import { ref } from 'vue'

const openingDetail = ref(false)
</script>
<template>
  <NarrowSider />
  <div class="grow flex overflow-hidden" style="-webkit-app-region: no-drag">
    <NarrowGallery class="basis-full overflow-hidden" />
    <!-- <NarrowDetail class="basis-4/12 overflow-hidden" /> -->
  </div>
</template>
