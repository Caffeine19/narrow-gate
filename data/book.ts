import { type Book } from '@prisma/client'
import prisma from './main'

export const createBook = async (
  title: Book['title'],
  creator: Book['creator'],
  bookCoverPath: Book['bookCoverPath'],
  bookFilePath: Book['bookFilePath'],
  size: Book['size'],
  identifier: Book['identifier'],
  pubdate: Book['pubdate'],
  publisher: Book['publisher'],
  language: Book['language']
) => {
  const createdBook = await prisma.book.create({
    data: {
      title,
      creator,
      bookCoverPath,
      bookFilePath,
      size,
      identifier,
      pubdate,
      publisher,
      language
    },
    select: { id: true, lastOpenedDate: true, addedDate: true }
  })
  console.log('🚀 ~ file: script.ts:22 ~ book:', createdBook)
  return createdBook
}

export const getBookList = async () => {
  const bookList = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      creator: true,
      bookCoverPath: true,
      size: true,
      identifier: true,
      pubdate: true,
      publisher: true,
      language: true,
      addedDate: true,
      lastOpenedDate: true
    }
  })
  console.log('🚀 ~ file: main.ts:30 ~ getBookList ~ bookList:', bookList)
  return bookList
}

export const getBookContent = async (id: Book['id']) => {
  const bookContent = await prisma.book.findUnique({
    where: { id },
    select: { bookFilePath: true }
  })
  return bookContent
}

export const deleteBook = async (idList: Book['id'][]) => {
  console.log('🚀 ~ file: main.ts:68 ~ deleteBook ~ idList:', idList)
  const task: any[] = []
  idList.forEach((id) => {
    task.push(prisma.book.delete({ where: { id } }))
  })

  const res = await Promise.all(task)
  console.log('🚀 ~ file: main.ts:74 ~ deleteBook ~ res:', res)
}
