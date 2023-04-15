import { computed, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'

import ePub, { Book, Rendition, type NavItem } from 'epubjs'
import type Section from 'epubjs/types/section'

import type { Book as IBook } from '@prisma/client'

import dayjs from 'dayjs'

import pinyin from 'pinyin'

import type { BookCover, OpenedBook } from '@/types/book'
import type { BookSortParams } from '@/types/bookSortParams'
import type { BookGroupParams } from '@/types/bookGroupParams'

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
        metadata.publisher,
        metadata.language
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
        language: metadata.language,
        addedDate: createdBook.addedDate,
        lastOpenedDate: createdBook.lastOpenedDate
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

  const checkedBookList = ref<BookCover['id'][]>([])
  const toggleCheckBook = (id: BookCover['id']) => {
    if (checkedBookList.value.includes(id)) {
      checkedBookList.value = checkedBookList.value.filter((checkedId) => {
        return checkedId !== id
      })
    } else {
      checkedBookList.value.push(id)
    }
  }

  const allBookChecked = computed(() => bookCoverList.value.length === checkedBookList.value.length)

  const uncheckAllBook = () => {
    checkedBookList.value.length = 0
  }
  const checkAllBook = () => {
    checkedBookList.value = bookCoverList.value.map((book) => book.id)
  }

  const deleteBook = (idList: BookCover['id'][]) => {
    console.log('🚀 ~ file: book.ts:87 ~ deleteBook ~ idList:', idList)
    window.electronAPI.deleteBook(toRaw(idList))

    bookCoverList.value = bookCoverList.value.filter((book) => {
      return !idList.includes(book.id)
    })
  }

  const isBookSorted = ref(false)
  const sortBook = (params: BookSortParams) => {
    console.log('🚀 ~ file: book.ts:90 ~ sortBook ~ params:', params)

    switch (params) {
      case 'title':
        bookCoverList.value.sort((a, b) => {
          return a.title.localeCompare(b.title, 'zh-Hans-CN', { sensitivity: 'accent' })
        })
        isBookSorted.value = true
        break
      case 'creator':
        bookCoverList.value.sort((a, b) => {
          return a.creator.localeCompare(b.creator, 'zh-Hans-CN', { sensitivity: 'accent' })
        })
        isBookSorted.value = true
        break
      case 'size':
        bookCoverList.value.sort((a, b) => {
          return a.size - b.size
        })
        isBookSorted.value = true
        break
      case 'pubdate':
        bookCoverList.value.sort((a, b) => {
          return dayjs(a.pubdate).valueOf() - dayjs(b.pubdate).valueOf()
        })
        isBookSorted.value = true
        break

      case 'addedDate':
        bookCoverList.value.sort((a, b) => {
          return dayjs(a.addedDate).valueOf() - dayjs(b.addedDate).valueOf()
        })
        isBookSorted.value = true
        break

      case 'lastOpenedDate':
        bookCoverList.value.sort((a, b) => {
          return dayjs(a.lastOpenedDate).valueOf() - dayjs(b.lastOpenedDate).valueOf()
        })
        isBookSorted.value = true
        break

      case 'clear':
        bookCoverList.value.sort((a, b) => {
          return a.id - b.id
        })
        isBookSorted.value = false
        break
    }
  }

  const isBookGrouped = ref(false)
  type GroupedBook = {
    [key: string]: BookCover[]
  }
  type GroupedSortedBook = {
    key: string
    val: BookCover[]
  }
  const groupedBookList = ref<GroupedSortedBook[]>([])
  const groupBook = (params: BookGroupParams) => {
    isBookGrouped.value = true

    // collapsedGroupList.value.length = 0

    switch (params) {
      case 'clear':
        isBookGrouped.value = false
        break
      case 'title':
        groupedBookList.value = Object.entries(
          bookCoverList.value.reduce((acc, cur) => {
            if (!acc[pinyin(cur[params])[0][0][0]]) {
              acc[pinyin(cur[params])[0][0][0]] = []
            }
            acc[pinyin(cur[params])[0][0][0]].push(cur)
            return acc
          }, {} as GroupedBook)
        )
          .map(([key, value]) => {
            return { key: key, val: value }
          })
          .sort((a, b) => {
            return a.key.localeCompare(b.key, 'zh-Hans-CN', { sensitivity: 'accent' })
          })
        break
      default:
        groupedBookList.value = Object.entries(
          bookCoverList.value.reduce((acc, cur) => {
            if (!acc[cur[params]]) {
              acc[cur[params]] = []
            }
            acc[cur[params]].push(cur)
            return acc
          }, {} as GroupedBook)
        )
          .map(([key, value]) => {
            return { key: key, val: value }
          })
          .sort((a, b) => {
            return a.key.localeCompare(b.key, 'zh-Hans-CN', { sensitivity: 'accent' })
          })
    }
  }
  const collapsedGroupList = ref<string[]>([])
  const expandGroup = (key: string) => {
    collapsedGroupList.value = collapsedGroupList.value.filter(
      (collapsedKey) => collapsedKey !== key
    )
  }
  const collapseGroup = (key: string) => {
    collapsedGroupList.value.push(key)
  }

  const openingDetail = ref(false)
  const toggleDetail = (flag: boolean) => {
    openingDetail.value = flag
  }
  const selectedBook = ref<BookCover>()
  const setSelectedBook = (book: BookCover | undefined) => {
    selectedBook.value = book
  }

  const openedBook = ref<OpenedBook>()
  const setOpenedBook = async (cover: BookCover) => {
    openedBook.value = { id: cover.id, title: cover.title, creator: cover.creator }
  }

  const chapterList = ref<NavItem[]>([])
  const expandedChapterList = ref<NavItem['id'][]>([])
  const expandChapter = (id: NavItem['id']) => {
    expandedChapterList.value?.push(id)
  }
  const collapseChapter = (id: NavItem['id']) => {
    expandedChapterList.value = expandedChapterList.value.filter((expandedId) => expandedId !== id)
  }

  const currentChapterHref = ref<NavItem['href']>()

  const goChapter = (href: NavItem['href']) => {
    rendition.display(href)
  }
  let rendition: Rendition
  const openBook = async (id: IBook['id']) => {
    rendition?.destroy()
    const bookContent = await window.electronAPI.getBookContent(id)
    console.log('🚀 ~ file: book.ts:71 ~ setOpenedBook ~ bookContent:', bookContent)

    book = ePub()
    await book.open(bookContent)

    book.loaded.navigation.then((navigation) => {
      chapterList.value = navigation.toc
    })

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

    await rendition.display()
    rendition.on('rendered', (section: Section) => {
      currentChapterHref.value = section.href
    })
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
    openedBook,
    openBook,
    setOpenedBook,
    nextPage,
    prevPage,
    getBookCoverList,
    sortBook,
    deleteBook,
    selectedBook,
    setSelectedBook,
    isBookSorted,
    openingDetail,
    toggleDetail,
    toggleCheckBook,
    checkedBookList,
    uncheckAllBook,
    checkAllBook,
    allBookChecked,
    chapterList,
    expandedChapterList,
    expandChapter,
    collapseChapter,
    currentChapterHref,
    goChapter,
    groupedBookList,
    groupBook,
    isBookGrouped,
    collapsedGroupList,
    expandGroup,
    collapseGroup
  }
})
