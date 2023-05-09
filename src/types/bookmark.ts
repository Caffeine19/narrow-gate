import type { Bookmark } from '@prisma/client'
export type BookmarkCreateParams = Omit<Bookmark, 'id' | 'deleted' | 'createdDate'>
