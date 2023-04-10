import type { Book } from '@prisma/client'

export type BookCover = Omit<Book, 'bookCoverPath' | 'bookFilePath'> & {
  bookCover: string
  picked: boolean
}

export type OpenedBook = Pick<BookCover, 'id' | 'creator' | 'title'>
