import { PrismaClient, type Book } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io'
    }
  })
  console.log(user)
}

export const createBook = async (
  name: Book['name'],
  author: Book['author'],
  bookCoverPath: Book['bookCoverPath'],
  bookFilePath: Book['bookFilePath']
) => {
  console.log('123123213')
  const book = await prisma.book.create({ data: { name, author, bookCoverPath, bookFilePath } })
  console.log('🚀 ~ file: script.ts:22 ~ book:', book)
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
