import type { Book } from '@prisma/client'

export type BookGroupParams = Extract<keyof Book, 'title' | 'creator' | 'publisher'> | 'clear'
