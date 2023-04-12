<script setup lang="ts">
import NarrowSider from './NarrowSider.vue'
import NarrowGallery from './NarrowGallery.vue'
import NarrowDetail from './NarrowDetail.vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'

const { openingDetail } = storeToRefs(useBookStore())
</script>
<template>
  <NarrowSider />
  <div class="grow relative flex overflow-hidden" style="-webkit-app-region: no-drag">
    <NarrowGallery class="basis-7/12 grow overflow-hidden" />
    <NarrowDetail
      class="xl:basis-4/12 xl:max-w-md xl:relative absolute bottom-0 xl:z-0 z-10 overflow-hidden max-h-[50%] xl:max-h-full w-full"
      v-if="openingDetail"
    />
  </div>
</template>
