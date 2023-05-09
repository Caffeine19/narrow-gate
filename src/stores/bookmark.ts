import type { BookmarkCreateParams } from '@/types/bookmark'
import { defineStore } from 'pinia'

export const useBookmarkStore = defineStore('bookmark', () => {
  const createBookmark = async (params: BookmarkCreateParams) => {
    try {
      const createdBookmark = await window.electronAPI.createBookmark(params)
      console.log('🚀 ~ file: bookmark.ts:8 ~ createBookmark ~ createdBookmark:', createdBookmark)
    } catch (error) {
      console.log('🚀 ~ file: bookmark.ts:8 ~ createBookmark ~ error:', error)
    }
  }
  return {
    createBookmark
  }
})
