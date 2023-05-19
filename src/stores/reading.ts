import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import ePub, { Rendition, type NavItem } from 'epubjs'
import type Section from 'epubjs/types/section'

import type { BookCover, OpenedBook } from '@/types/book'

import { useBookStore } from './book'
import { useRecordStore } from './record'
import { useBookmarkStore } from './bookmark'

export const useReadingStore = defineStore('reading', () => {
  const bookStore = useBookStore()
  const bookmarkStore = useBookmarkStore()
  const recordStore = useRecordStore()

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
    // rendition.themes.fontSize('120%')
    //set fontsize会在下一章节切换到上一章节时出现页面晃动闪烁的问题

    rendition.themes.default({
      body: { 'background-color': 'transparent !important', color: '#fafafa !important' },
      html: { 'background-color': 'transparent !important' },
      p: {
        color: '#fafafa !important',
        'font-family': 'misans !important',
        'border-color': '#818cf8 !important'
      },
      '*::selection': {
        color: '#8b91ee !important',
        background: 'rgba(139, 145, 238,0.1) !important'
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
    rendition.on('rendered', (section: Section, i: any) => {
      currentChapterHref.value = section.href

      //IframeView
      i.document.documentElement.addEventListener('mouseup', () => {
        let selection

        if (i.window.getSelection) {
          selection = i.window.getSelection()
        } else if (i.document.selection) {
          selection = i.document.selection.createRange()
        }

        //判断是否是select事件
        if (selection && selection.toString()) {
          onTextSelected()
        }
      })
    })

    rendition.on('keyup', onKeyUp)

    rendition.on('selected', async (cfiRange: string, contents: any) => {
      // console.log('🚀 ~ file: reading.ts:108 ~ rendition.on ~ cfiRange:', cfiRange)
      const range = (await bookStore.book.getRange(cfiRange)).toString()
      console.log('🚀 ~ file: reading.ts:110 ~ rendition.on ~ range:', range)

      selectedRange.content = range
      selectedRange.location = cfiRange

      // contents.window.getSelection().removeAllRanges()
    })
  }

  const nextPage = () => {
    rendition.next()
  }
  const prevPage = () => {
    rendition.prev()
  }

  const { isRecording } = storeToRefs(recordStore)
  const onKeyUp = (event: KeyboardEvent) => {
    if (!isRecording.value) return
    switch (event.key) {
      case 'ArrowUp':
        prevPage()
        break
      case 'ArrowDown':
        nextPage()
        break
      case 'ArrowLeft':
        prevPage()
        break
      case 'ArrowRight':
        nextPage()
        break
    }
  }

  const openingSelectionMenu = ref(false)
  const onTextSelected = () => {
    openingSelectionMenu.value = true
  }
  const selectedRange: { content?: string; location?: string } = {
    content: undefined,
    location: undefined
  }
  const highlightSelection = (cfiRange: string) => {
    rendition.annotations.add('highlight', cfiRange, {}, undefined, 'hl', {
      color: '#8b91ee !important',
      background: 'rgba(139, 145, 238,0.1) !important',
      fill: 'rgba(139, 145, 238)',
      'fill-opacity': '0.3',
      'mix-blend-mode': 'multiply'
    })
    // setTimeout(() => {
    //   rendition.annotations.remove(cfiRange, 'highlight')
    // }, 2000)
  }
  const createBookmark = () => {
    if (!openedBook.value?.id || !selectedRange.content || !selectedRange.location) return
    bookmarkStore.createBookmark({
      bookId: openedBook.value?.id,
      content: selectedRange.content,
      location: selectedRange.location
    })
    highlightSelection(selectedRange.location)
  }
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
    onKeyUp,
    openingSelectionMenu,
    createBookmark,
    selectedRange,
    highlightSelection
  }
})
