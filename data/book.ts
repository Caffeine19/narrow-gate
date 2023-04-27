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

export const getBookAmount = async () => {
  try {
    const bookAmount = await prisma.book.count()
    return bookAmount
  } catch (error) {
    console.log('🚀 ~ file: book.ts:77 ~ getBookAmount ~ error:', error)
  }
}

export const getReadMostBooks = async (begin: string, end: string) => {
  const res = await prisma.record.groupBy({
    by: ['bookId'],
    _count: {
      bookId: true
    },
    orderBy: {
      _count: {
        bookId: 'desc'
      }
    },
    take: 12
  })

  const res2 = (
    await prisma.book.findMany({
      include: {
        _count: {
          select: { recording: true }
        }
      },
      orderBy: {}
    })
  )
    .sort((prev, next) => {
      return next._count.recording - prev._count.recording
    })
    .slice(0, 12)

  const c = await Promise.all(res2.map((r) => prisma.record.findMany({ where: { bookId: r.id } })))
  c.map((cc) => {
    const d = cc.reduce(
      (acc, cur) => {
        acc.duration = acc.duration + cur.duration
        acc.times++
        return acc
      },
      { times: 0, duration: 0 }
    )
    return d
  })
  console.log('🚀 ~ file: book.ts:122 ~ c.map ~ c:', c)
}
getReadMostBooks('2023-03-04', '2023-06-06')
