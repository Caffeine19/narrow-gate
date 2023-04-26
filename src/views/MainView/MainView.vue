<script setup lang="ts">
import NarrowSider from './NarrowSider.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden" style="-webkit-app-region: no-drag">
    <NarrowSider v-show="route.name !== 'reading'" />
    <router-view></router-view>
  </div>
</template>
