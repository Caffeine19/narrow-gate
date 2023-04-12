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
      class="md:basis-4/12 md:max-w-md md:relative absolute bottom-0 md:z-0 z-10 overflow-hidden max-h-[50%] md:max-h-full w-full min-w-[20rem]"
      v-if="openingDetail"
    />
  </div>
</template>
