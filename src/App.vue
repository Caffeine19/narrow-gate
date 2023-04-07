<script setup lang="ts">
import ePub from 'epubjs'

const openDialog = async () => {
  const res = await window.electronAPI.openDialog('123')
  console.log({ res })

  let book = ePub()

  book.open(res.arrayBuffer)
  console.log('🚀 ~ file: App.vue:25 ~ openDialog ~ book:', book)
  var rendition = book.renderTo('viewer', {
    width: '100%',
    height: 600,
    spread: 'always'
  })

  rendition.display()
}
</script>

<template>
  <button @click="openDialog">choose book</button>

  <div style="width: 800px; height: 800px" id="viewer"></div>
</template>

<style>
body {
  /* -webkit-app-region: drag; */
}
</style>
