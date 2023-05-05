import type { Book } from '@prisma/client'

import type { RecordActivity } from './record'

export type BookCover = Omit<Book, 'bookCoverPath' | 'bookFilePath' | 'deleted'> & {
  bookCover: string
}

export type OpenedBook = Pick<BookCover, 'id' | 'creator' | 'title'>

export type MostReadBook = BookCover & RecordActivity['val']
