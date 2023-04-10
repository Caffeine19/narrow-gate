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
    bookCoverFile: ArrayBuffer,
    size: Book['size'],
    identifier: Book['identifier'],
    pubdate: Book['pubdate'],
    publisher: Book['publisher']
  ): Promise<Pick<Book, 'id'>>
}

export interface GetBookCoverList {
  (): Promise<BookCover[]>
}

export interface GetBookContent {
  (id: Book['id']): Promise<ArrayBuffer>
}

interface IPlatformCallback {
  (event, value): void
}
export interface IPlatform {
  (callback: IPlatformCallback): void
}

export interface DeleteBook {
  (idList: Book['id'][]): void
}

export interface IElectronAPI {
  readBookFile: ReadBookFile
  createBook: CreateBook
  getBookCoverList: GetBookCoverList
  getBookContent: GetBookContent
  platform: IPlatform
  deleteBook: DeleteBook
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
