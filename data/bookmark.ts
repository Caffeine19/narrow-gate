import prisma from './main'

import { Book, Bookmark } from '@prisma/client'

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

export const getBookmarksByBook = async (bookId: Book['id'] | undefined) => {
  console.log('🚀 ~ file: bookmark.ts:23 ~ getBookmarksByBook ~ bookId:', bookId)
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { bookId: bookId }
    })
    return bookmarks
  } catch (error) {
    console.log('🚀 ~ file: bookmark.ts:21 ~ getBookmarksByBook ~ error:', error)
  }
}

export const deleteBookmark = async (id: Bookmark['id']) => {
  try {
    const deletedBookmark = await prisma.bookmark.delete({ where: { id } })
    console.log('🚀 ~ file: bookmark.ts:37 ~ deleteBookmark ~ deletedBookmark:', deletedBookmark)
  } catch (error) {
    console.log('🚀 ~ file: bookmark.ts:38 ~ deleteBookmark ~ error:', error)
  }
}
