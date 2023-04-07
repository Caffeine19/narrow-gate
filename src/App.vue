<script setup lang="ts">
import { onMounted } from 'vue'

import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

import ePub from 'epubjs'

onMounted(() => {
  // Load the opf
  // var book = ePub('https://s3.amazonaws.com/moby-dick/moby-dick.epub')
  // var rendition = book.renderTo('viewer', {
  //   width: '100%',
  //   height: 600,
  //   spread: 'always'
  // })
  // rendition.display()
})

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
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
  <input type="file" placeholder="选择文件" id="input" />
  <button @click="openDialog">choose book</button>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <div style="width: 800px; height: 800px" id="viewer"></div>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
<style>
body {
  /* -webkit-app-region: drag; */
}
</style>
