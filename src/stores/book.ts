import { reactive } from 'vue'
import { defineStore } from 'pinia'

import ePub, { Book } from 'epubjs'

type BookCover = {
  img: string
  creator: string
  title: string
}

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
  const openBook = () => {
    const rendition = book.renderTo('viewer', {
      width: '100%',
      height: '100%',
      spread: 'always'
    })

    rendition.display()
  }
  return { bookCoverList, addBook, openBook }
})
