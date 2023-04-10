import { PrismaClient, type Book } from '@prisma/client'

const prisma = new PrismaClient()

// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       name: 'Alice',
//       email: 'alice@prisma.io'
//     }
//   })
//   console.log(user)
// }

export const createBook = async (
  title: Book['title'],
  creator: Book['creator'],
  bookCoverPath: Book['bookCoverPath'],
  bookFilePath: Book['bookFilePath'],
  size: Book['size'],
  identifier: Book['identifier'],
  pubdate: Book['pubdate'],
  publisher: Book['publisher']
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
      publisher
    },
    select: { id: true }
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
      publisher: true
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
// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
