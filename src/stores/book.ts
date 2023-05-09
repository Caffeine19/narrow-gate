import { computed, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'

import ePub, { Book } from 'epubjs'

import dayjs from 'dayjs'

import pinyin from 'pinyin'

import type { MostReadBook, BookCover, HasBookmarkBook } from '@/types/book'
import type { BookSortParams } from '@/types/bookSortParams'
import type { BookGroupParams } from '@/types/bookGroupParams'

export const useBookStore = defineStore('book', () => {
  const book: Book = ePub()

  const bookCoverList = ref<BookCover[]>([])

  const readFileAsync = (file: File): Promise<ArrayBuffer> => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result
        if (result && result instanceof ArrayBuffer) {
          resolve(result)
        } else {
          reject(new Error('Failed to read file.'))
        }
      }

      reader.onerror = () => {
        reject(reader.error || new Error('Failed to read file.'))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  const addBook = async (event: Event) => {
    if (event.target && (event.target as HTMLInputElement).files) {
      const files = (event.target as HTMLInputElement).files
      if (!files || files.length === 0) {
        alert('Please select one or more EPUB files.')
        return
      }

      const promises = Array.from(files).map(async (file) => {
        if (!file.name.endsWith('.epub')) {
          throw new Error(`Invalid file type: ${file.name}. Please select an EPUB file.`)
        }

        const buffer = await readFileAsync(file)
        const book = ePub()
        await book.open(buffer)

        //获取元信息
        // const metadata = await book.loaded.metadata
        // console.log('🚀 ~ file: NarrowGallery.vue:20 ~ openDialog ~ metadata:', metadata)

        // 获取封面URL
        // const coverUrl = await book.coverUrl()
        // console.log('🚀 ~ file: NarrowGallery.vue:14 ~ openDialog ~ coverUrl:', coverUrl)

        const [metadata, coverUrl] = await Promise.all([book.loaded.metadata, book.coverUrl()])

        if (coverUrl) {
          const coverFile = await (await fetch(coverUrl)).arrayBuffer()

          const createdBook = await window.electronAPI.createBook(
            metadata.title,
            metadata.creator,
            buffer,
            coverFile,
            buffer.byteLength,
            metadata.identifier,
            metadata.pubdate,
            metadata.publisher,
            metadata.language
          )

          return {
            id: createdBook.id,
            title: metadata.title,
            creator: metadata.creator,
            bookCover: coverUrl,
            size: buffer.byteLength,
            identifier: metadata.identifier,
            pubdate: metadata.identifier,
            publisher: metadata.publisher,
            language: metadata.language,
            addedDate: createdBook.addedDate,
            lastOpenedDate: createdBook.lastOpenedDate
          }
        } else {
          return null
        }
      })
      const books = await Promise.all(promises)
      console.log('🚀 ~ file: book.ts:97 ~ addBook ~ books:', books)
      bookCoverList.value.push(...(books.filter((book) => book != null) as BookCover[]))
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

  const bookAmount = ref<number>(0)
  const getBookAmount = async () => {
    try {
      const res = await window.electronAPI.getBookAmount()
      console.log('🚀 ~ file: book.ts:276 ~ getBookAmount ~ res:', res)
      bookAmount.value = res
    } catch (error) {
      console.log('🚀 ~ file: book.ts:278 ~ getBookAmount ~ error:', error)
    }
  }

  const mostReadBooks = ref<MostReadBook[]>([])
  const getMostReadBooks = async () => {
    try {
      const res = await window.electronAPI.getMostReadBooks('2023-01', '2023-02')
      mostReadBooks.value = res
      console.log('🚀 ~ file: book.ts:286 ~ getMostReadBooks ~ res:', res)
    } catch (error) {
      console.log('🚀 ~ file: book.ts:288 ~ getMostReadBooks ~ error:', error)
    }
  }

  const hasBookmarkBooks = ref<HasBookmarkBook[]>([])
  const getHasBookmarkBooks = async () => {
    try {
      const res = await window.electronAPI.getHasBookmarkBooks()
      console.log('🚀 ~ file: book.ts:298 ~ getHasBookmarkBooks ~ res:', res)
      hasBookmarkBooks.value = res
    } catch (error) {
      console.log('🚀 ~ file: book.ts:299 ~ getHasBookmarkBooks ~ error:', error)
    }
  }
  return {
    bookCoverList,
    addBook,
    book,
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
    groupedBookList,
    groupBook,
    isBookGrouped,
    collapsedGroupList,
    expandGroup,
    collapseGroup,
    bookAmount,
    getBookAmount,
    getMostReadBooks,
    mostReadBooks,
    hasBookmarkBooks,
    getHasBookmarkBooks
  }
})
