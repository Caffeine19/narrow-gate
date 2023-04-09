import { type Book } from '@prisma/client'
import type { BookCover } from './book'
export interface ReadBookFile {
  (): Promise<ArrayBuffer>
}

export interface CreateBook {
  (
    title: Book['title'],
    creator: Book['creator'],
    bookFile: ArrayBuffer,
    bookCoverFile: ArrayBuffer
  ): Promise<Pick<Book, 'id'>>
}

export interface GetBookCoverList {
  (): Promise<BookCover[]>
}

export interface GetBookContent {
  (id: Book['id']): Promise<ArrayBuffer>
}

export interface IElectronAPI {
  readBookFile: ReadBookFile
  createBook: CreateBook
  getBookCoverList: GetBookCoverList
  getBookContent: GetBookContent
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
