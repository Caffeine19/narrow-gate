import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import ePub, { Book, Rendition } from 'epubjs'

import type { BookCover, OpenedBook } from '@/types/book'
import type { BookSortParams } from '@/types/bookSortParams'

import type { Book as IBook } from '@prisma/client'

export const useBookStore = defineStore('book', () => {
  let book: Book

  const bookCoverList = ref<BookCover[]>([])
  const addBook = async () => {
    book = ePub()
    const bookRes = await window.electronAPI.readBookFile()
    console.log('🚀 ~ file: book.ts:15 ~ addBook ~ bookRes:', bookRes)
    await book.open(bookRes)

    //获取元信息
    const metadata = await book.loaded.metadata
    console.log('🚀 ~ file: NarrowGallery.vue:20 ~ openDialog ~ metadata:', metadata)

    // 获取封面URL
    const coverUrl = await book.coverUrl()
    console.log('🚀 ~ file: NarrowGallery.vue:14 ~ openDialog ~ coverUrl:', coverUrl)

    if (coverUrl) {
      const coverFile = await (await fetch(coverUrl)).arrayBuffer()

      const createdBook = await window.electronAPI.createBook(
        metadata.title,
        metadata.creator,
        bookRes,
        coverFile,
        bookRes.byteLength,
        metadata.identifier,
        metadata.pubdate,
        metadata.publisher
      )
      console.log('🚀 ~ file: book.ts:35 ~ addBook ~ createdBook:', createdBook)

      bookCoverList.value.push({
        id: createdBook.id,
        title: metadata.title,
        creator: metadata.creator,
        bookCover: coverUrl,
        size: bookRes.byteLength,
        identifier: metadata.identifier,
        pubdate: metadata.identifier,
        publisher: metadata.publisher,

        picked: false
      })
      // .then((response) => {
      //   console.log('🚀 ~ file: NarrowGallery.vue:20 ~ .then ~ response:', response)
      //   return response.arrayBuffer()
      // })
      // .then((arrayBuffer) => {
      //   console.log('🚀 ~ file: book.ts:34 ~ .then ~ arrayBuffer:', arrayBuffer)
      // })
    }
  }

  const getBookCoverList = async () => {
    try {
      const res = await window.electronAPI.getBookCoverList()
      console.log('🚀 ~ file: book.ts:56 ~ getBookCoverList ~ res:', res)
      bookCoverList.value.length = 0
      res.forEach((bookCover) => {
        bookCoverList.value.push(bookCover)
      })
    } catch (error) {
      console.log('🚀 ~ file: book.ts:47 ~ getBookList ~ error:', error)
    }
  }

  const pickBook = (id: BookCover['id']) => {
    const index = bookCoverList.value.findIndex((bookCover) => {
      return bookCover.id == id
    })
    bookCoverList.value[index].picked = !bookCoverList.value[index].picked
  }

  const deleteBook = (idList: BookCover['id'][]) => {
    console.log('🚀 ~ file: book.ts:87 ~ deleteBook ~ idList:', idList)
    window.electronAPI.deleteBook(idList)

    bookCoverList.value = bookCoverList.value.filter((book) => {
      return !idList.includes(book.id)
    })
  }
  const sortBook = (params: BookSortParams) => {
    console.log('🚀 ~ file: book.ts:90 ~ sortBook ~ params:', params)
    // const array = ['刘一', '陈二', '张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
    switch (params) {
      case 'title':
        bookCoverList.value.sort(function (a, b) {
          return a.title.localeCompare(b.title, 'zh-Hans-CN', { sensitivity: 'accent' })
        })
        break
      case 'creator':
        bookCoverList.value.sort(function (a, b) {
          return a.creator.localeCompare(b.creator, 'zh-Hans-CN', { sensitivity: 'accent' })
        })
        break
      case 'size':
        bookCoverList.value.sort(function (a, b) {
          return a.size - b.size
        })
        break
      case 'pubdate':
        bookCoverList.value.sort(function (a, b) {
          return a.size - b.size
        })
        break
    }
  }

  const openedBook = ref<OpenedBook>()
  const setOpenedBook = async (cover: BookCover) => {
    openedBook.value = { id: cover.id, title: cover.title, creator: cover.creator }
  }

  let rendition: Rendition
  const openBook = async (id: IBook['id']) => {
    const bookContent = await window.electronAPI.getBookContent(id)
    console.log('🚀 ~ file: book.ts:71 ~ setOpenedBook ~ bookContent:', bookContent)

    book = ePub()
    await book.open(bookContent)

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
    rendition.themes.fontSize('120%')

    rendition.themes.default({
      body: { 'background-color': 'transparent !important', color: '#fafafa !important' },
      html: { 'background-color': 'transparent !important' },
      p: {
        color: '#fafafa !important',
        'font-family': 'misans !important',
        'border-color': '#818cf8 !important'
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
    console.log('🚀 ~ file: book.ts:124 ~ nextPage ~ nextPage:', nextPage)
    rendition.next()
  }
  const prevPage = () => {
    console.log('🚀 ~ file: book.ts:129 ~ prevPage ~ prevPage:', prevPage)
    rendition.prev()
  }
  return {
    bookCoverList,
    addBook,
    pickBook,
    openedBook,
    openBook,
    setOpenedBook,
    nextPage,
    prevPage,
    getBookCoverList,
    sortBook,
    deleteBook
  }
})
