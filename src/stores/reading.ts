import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import ePub, { Rendition, type NavItem } from 'epubjs'

import type Section from 'epubjs/types/section'

import type { RecordCreateParams, RecordGap } from '@/types/record'
import type { BookCover, OpenedBook } from '@/types/book'

import { useBookStore } from './book'
import dayjs from 'dayjs'
export const useReadingStore = defineStore('reading', () => {
  const bookStore = useBookStore()

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
  const openBook = async (id: BookCover['id']) => {
    rendition?.destroy()
    const bookContent = await window.electronAPI.getBookContent(id)
    console.log('🚀 ~ file: book.ts:71 ~ setOpenedBook ~ bookContent:', bookContent)

    bookStore.book = ePub()
    await bookStore.book.open(bookContent)

    bookStore.book.loaded.navigation.then((navigation) => {
      chapterList.value = navigation.toc
    })

    console.log('🚀 ~ file: book.ts:107 ~ useBookStore ~ book:', bookStore.book)
    rendition = bookStore.book.renderTo('viewer', {
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

  const record = ref<RecordCreateParams>({})
  const recordGaps = ref<RecordGap[]>([])
  const isRecording = ref(false)

  const recordDuration = computed(() => {
    return recordGaps.value.reduce((acc, cur) => {
      return acc + (cur.end.getTime() - cur.begin.getTime())
    }, 0)
  })

  const addRecordGap = () => {
    recordGaps.value.push({ begin: new Date(), end: new Date() })
  }
  const setLastRecordGapEnd = () => {
    recordGaps.value[recordGaps.value.length - 1].end = new Date()
  }

  const addRecord = () => {}
  return {
    openedBook,
    openBook,
    setOpenedBook,
    nextPage,
    prevPage,
    chapterList,
    expandedChapterList,
    expandChapter,
    collapseChapter,
    currentChapterHref,
    goChapter,
    record,
    recordDuration,
    isRecording,
    recordGaps,
    addRecordGap,
    setLastRecordGapEnd
  }
})
