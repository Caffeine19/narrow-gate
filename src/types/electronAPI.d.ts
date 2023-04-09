import { type Book } from '@prisma/client'

export interface ReadBookFile {
  (): Promise<ArrayBuffer>
}

export interface CreateBook {
  (
    name: Book['name'],
    author: Book['author'],
    bookFile: ArrayBuffer,
    bookCoverFile: ArrayBuffer
  ): void
}
export interface IElectronAPI {
  readBookFile: ReadBookFile
  createBook: CreateBook
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
