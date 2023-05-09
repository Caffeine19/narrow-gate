import type { BookmarkCreateParams } from '@/types/bookmark'
import { defineStore } from 'pinia'
import { ref } from 'vue'

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
  return {
    createBookmark,
    bookmarkAmount,
    getBookmarkAmount
  }
})
