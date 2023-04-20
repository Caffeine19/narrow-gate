import { type Book, type Record } from '@prisma/client'
import type { BookCover } from './book'

export interface CreateBook {
  (
    title: Book['title'],
    creator: Book['creator'],
    bookFile: ArrayBuffer,
    bookCoverFile: ArrayBuffer,
    size: Book['size'],
    identifier: Book['identifier'],
    pubdate: Book['pubdate'],
    publisher: Book['publisher'],
    language: Book['language']
  ): Promise<Pick<Book, 'id' | 'addedDate' | 'lastOpenedDate'>>
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

export interface CreateRecord {
  (
    bookId: Record['bookId'],
    end: Record['end'],
    begin: Record['begin'],
    duration: Record['duration']
  ): Promise<void>
}

export interface IElectronAPI {
  createBook: CreateBook
  getBookCoverList: GetBookCoverList
  getBookContent: GetBookContent
  platform: IPlatform
  deleteBook: DeleteBook
  createRecord: CreateRecord
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
