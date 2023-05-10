import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { BookmarkCreateParams } from '@/types/bookmark'
import type { Book, Bookmark } from '@prisma/client'

export const useBookmarkStore = defineStore('bookmark', () => {
  const createBookmark = async (params: BookmarkCreateParams) => {
    try {
      const createdBookmark = await window.electronAPI.createBookmark(params)
      console.log('🚀 ~ file: bookmark.ts:8 ~ createBookmark ~ createdBookmark:', createdBookmark)
    } catch (error) {
      console.log('🚀 ~ file: bookmark.ts:8 ~ createBookmark ~ error:', error)
    }
  }

  const bookmarkAmount = ref(0)
  const getBookmarkAmount = async () => {
    try {
      const res = await window.electronAPI.getBookmarkAmount()
      bookmarkAmount.value = res
    } catch (error) {
      console.log('🚀 ~ file: bookmark.ts:18 ~ getBookmarkAmount ~ error:', error)
    }
  }

  const bookmarks = ref<Bookmark[]>([])
  const getBookmarksByBook = async (bookId: Book['id'] | undefined) => {
    try {
      const res = await window.electronAPI.getBookmarksByBook(bookId)
      bookmarks.value = res
    } catch (error) {
      console.log('🚀 ~ file: bookmark.ts:32 ~ getBookmarksByBook ~ error:', error)
    }
  }

  const deleteBookmark = async (id: Bookmark['id']) => {
    try {
      await window.electronAPI.deleteBookmark(id)
      bookmarks.value = bookmarks.value.filter((bookmark) => bookmark.id !== id)
    } catch (error) {
      console.log('🚀 ~ file: bookmark.ts:41 ~ deleteBookmark ~ error:', error)
    }
  }
  return {
    createBookmark,
    bookmarkAmount,
    getBookmarkAmount,
    bookmarks,
    getBookmarksByBook,
    deleteBookmark
  }
})
