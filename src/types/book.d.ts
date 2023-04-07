export type BookCover = {
  img: string
  creator: string
  title: string
}

export type OpenedBook = Omit<BookCover, 'img'>
