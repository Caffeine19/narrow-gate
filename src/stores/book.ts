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
    console.log('🚀 ~ file: book.ts:107 ~ useBookStore ~ book:', book)
    rendition = book.renderTo('viewer', {
      width: '100%',
      height: '100%',
      spread: 'always'
    })

    rendition.themes.override('background', 'none', true)
    rendition.themes.override('color', '#fafafa', true)
    // rendition.themes.register('dark', 'themes.css')
    // rendition.themes.register('light', 'themes.css')
    // rendition.themes.register('tan', 'themes.css')

    // rendition.themes.select('tan')
    // rendition.themes.fontSize('140%')

    rendition.themes.default({
      body: { 'background-color': 'transparent !important', color: '#fafafa !important' },
      html: { 'background-color': 'transparent !important' },
      p: {
        color: '#fafafa !important',
        'font-family': 'misans !important',
        'border-color': 'red !important'
      },
      a: { color: '#818cf8 !important' },
      h1: { color: '#fafafa !important' },
      h2: { color: '#fafafa !important' },
      h3: { color: '#fafafa !important' },
      hr: { 'border-color': '#52525b !important' },
      span: { color: '#e4e4e7 !important' },
      code: { color: '#818cf8 !important' },
      pre: {
        'background-color': '#1A1B25 !important',
        'border-color': '#111122 !important'
      },
      li: {
        color: '#fafafa !important',
        'font-family': 'misans !important'
      }
    })

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
