import type { Book } from '@prisma/client'

export type BookSortParams =
  | Extract<keyof Book, 'title' | 'creator' | 'size' | 'pubdate' | 'addedDate' | 'lastOpenedDate'>
  | 'clear'
