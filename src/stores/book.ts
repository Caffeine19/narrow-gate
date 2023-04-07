import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import ePub, { Book, Rendition } from 'epubjs'

import type { BookCover, OpenedBook } from '@/types/book'

export const useBookStore = defineStore('book', () => {
  let book: Book

  const bookCoverList = reactive<BookCover[]>([])
  const addBook = async () => {
    book = ePub()
    const res = await window.electronAPI.readBookFile()
    await book.open(res)

    //获取元信息
    const metadata = await book.loaded.metadata
    console.log('🚀 ~ file: NarrowGallery.vue:20 ~ openDialog ~ metadata:', metadata)

    // 获取封面URL
    const coverUrl = await book.coverUrl()
    console.log('🚀 ~ file: NarrowGallery.vue:14 ~ openDialog ~ coverUrl:', coverUrl)

    if (coverUrl) {
      bookCoverList.push({ img: coverUrl, title: metadata.title, creator: metadata.creator })

      fetch(coverUrl)
        .then((response) => {
          console.log('🚀 ~ file: NarrowGallery.vue:20 ~ .then ~ response:', response)
          return response.arrayBuffer()
        })
        .then((blob) => {
          // 将Blob对象保存为文件
          console.dir({ blob })
        })
    }
  }

  const openedBook = ref<OpenedBook>()
  const setOpenedBook = (cover: BookCover) => {
    openedBook.value = { title: cover.title, creator: cover.creator }
  }

  let rendition: Rendition
  const openBook = () => {
    rendition = book.renderTo('viewer', {
      width: '100%',
      height: '100%'
      // spread: 'always'
    })
    rendition.themes.default({
      p: { color: '#fafafa', 'font-family': 'misans !important' },
      a: { color: '#818cf8' },
      h1: { color: '#fafafa' },
      hr: { 'border-color': '#52525b' }
    })

    // rendition.themes.register(`${getStreamHost()}/static/epub.css`)
    // rendition.themes.select('book-theme')

    rendition.display()
  }

  const nextPage = () => {
    rendition.next()
  }
  const prevPage = () => {
    rendition.prev()
  }
  return { bookCoverList, addBook, openedBook, openBook, setOpenedBook, nextPage, prevPage }
})
