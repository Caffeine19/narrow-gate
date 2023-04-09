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

export interface IElectronAPI {
  readBookFile: ReadBookFile
  createBook: CreateBook
  getBookCoverList: GetBookCoverList
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
