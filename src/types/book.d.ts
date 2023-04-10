import type { Book } from '@prisma/client'

export type BookCover = Omit<Book, 'bookCoverPath' | 'bookFilePath'> & { bookCover: string }

export type OpenedBook = Pick<BookCover, 'id' | 'creator' | 'title'>
