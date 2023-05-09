import prisma from './main'
import type { BookmarkCreateParams } from '../src/types/bookmark'
export const createBookmark = async (params: BookmarkCreateParams) => {
  const createdBookmark = await prisma.bookmark.create({ data: params })
  console.log('🚀 ~ file: bookmark.ts:5 ~ createBookmark ~ createdBookmark:', createdBookmark)
  return createBookmark
}

export const getBookmarkAmount = async () => {
  try {
    const bookmarkAmount = await prisma.bookmark.count()
    return bookmarkAmount
  } catch (error) {
    console.log('🚀 ~ file: bookmark.ts:13 ~ getBookmarkAmount ~ error:', error)
  }
}
