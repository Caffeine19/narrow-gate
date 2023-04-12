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
  <div class="grow flex overflow-hidden" style="-webkit-app-region: no-drag">
    <NarrowGallery class="basis-7/12 grow overflow-hidden" />
    <NarrowDetail class="basis-4/12 max-w-md overflow-hidden" v-if="openingDetail" />
  </div>
</template>
