import { app, BrowserWindow, ipcMain } from 'electron'

import * as path from 'path'

import { writeFileSync, existsSync } from 'fs'

import {
  CreateBook,
  CreateBookmark,
  GetBookAmount,
  GetBookContent,
  GetBookCoverList,
  GetBookmarksByBook,
  GetDailyRecords,
  GetHasBookmarkBooks,
  GetMonthlyRecordActivity,
  GetMostReadBooks,
  GetRecordDurationAmount
} from '../src/types/electronAPI'

import {
  createBook,
  deleteBook,
  getBookAmount,
  getBookContent,
  getBookList,
  getHasBookmarkBooks,
  getMostReadBooks
} from '../data/book'

import {
  createRecord,
  getDailyRecords,
  getMonthlyRecordActivity,
  getRecordDurationAmount
} from '../data/record'

import { readFile } from 'fs/promises'
import { platform } from 'os'

import type { Record } from '@prisma/client'
import { createBookmark, getBookmarkAmount, getBookmarksByBook } from '../data/bookmark'

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 1024,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../electron/preload.js')
    },
    trafficLightPosition: { x: 10, y: 20 },
    titleBarStyle: 'hidden'
  })

  const isDev = process.env.NODE_ENV?.trim() === 'development'
  console.log('🚀 ~ file: main.ts:15 ~ createWindow ~ isDev:', isDev)
  if (isDev) {
    win.loadURL('http://localhost:5177/#/')
  } else {
    win.loadFile('dist/index.html')
  }

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('platform', platform()) // 将操作系统信息传递到渲染进程
  })
}

const onCreateBook: CreateBook = async (
  title,
  creator,
  bookFile,
  bookCoverFile,
  size,
  identifier,
  pubdate,
  publisher,
  language
) => {
  console.log('🚀 ~ file: main.ts:52 ~ constonCreateBook:CreateBook= ~ onCreateBook:', onCreateBook)
  try {
    const bookFilePath = `./static/book/${title}.book`
    const bookCoverPath = `./static/bookCover/${title}.bookCover`
    if (!existsSync(bookFilePath)) {
      writeFileSync(bookFilePath, '')
    }

    if (!existsSync(bookCoverPath)) {
      writeFileSync(bookCoverPath, '')
    }

    writeFileSync(bookFilePath, Buffer.from(bookFile))
    writeFileSync(bookCoverPath, Buffer.from(bookCoverFile))

    const createdBook = await createBook(
      title,
      creator,
      bookCoverPath,
      bookFilePath,
      size,
      identifier,
      pubdate,
      publisher,
      language
    )
    return createdBook
  } catch (error) {
    console.log('🚀 ~ file: main.ts:74 ~ constonCreateBook:CreateBook= ~ error:', error)
  }
}

const onGetBookCoverList: GetBookCoverList = async () => {
  try {
    const books = await getBookList()

    const covers = await Promise.all(books.map((book) => readFile(book.bookCoverPath)))
    const bookCovers = books.map((book, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { bookCoverPath, ...rest } = book
      return {
        ...rest,
        bookCover: `data:image/png;base64,${Buffer.from(covers[index]).toString('base64')}`
      }
    })
    return bookCovers
  } catch (error) {
    console.log('🚀 ~ file: main.ts:78 ~ onGetBookList ~ error:', error)
  }
}
const onGetBookContent: GetBookContent = async (id) => {
  try {
    const res = await getBookContent(id)
    const data = await readFile(res.bookFilePath)
    const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    console.log(
      '🚀 ~ file: main.ts:102 ~ constonGetBookContent:GetBookContent= ~ arrayBuffer:',
      arrayBuffer
    )

    return arrayBuffer
  } catch (error) {
    console.log('🚀 ~ file: main.ts:101 ~ onGetBookContent ~ error:', error)
  }
}
const onDeleteBook = async (idList: number[]) => {
  try {
    await deleteBook(idList)
  } catch (error) {
    console.log('🚀 ~ file: main.ts:141 ~ onDeleteBook ~ error:', error)
  }
}

const onCreateRecord = async (
  bookId: Record['bookId'],
  end: Record['end'],
  begin: Record['begin'],
  duration: Record['duration']
) => {
  try {
    const createdRecord = await createRecord(bookId, begin, end, duration)
    console.log('🚀 ~ file: main.ts:137 ~ createdRecord:', createdRecord)
  } catch (error) {
    console.log('🚀 ~ file: main.ts:136 ~ error:', error)
  }
}

const onGetBookAmount: GetBookAmount = async () => {
  try {
    const bookAmount = await getBookAmount()
    console.log(
      '🚀 ~ file: main.ts:151 ~ constonGetBookAmount:GetBookAmount= ~ bookAmount:',
      bookAmount
    )
    return bookAmount
  } catch (error) {
    console.log('🚀 ~ file: main.ts:152 ~ constonGetBookAmount:GetBookAmount= ~ error:', error)
  }
}

const onGetMostReadBooks: GetMostReadBooks = async (begin: string, end: string) => {
  try {
    const books = await getMostReadBooks(begin, end)

    const covers = await Promise.all(books.map((book) => readFile(book.bookCoverPath)))

    const mostReadBooksWithCover = books.map((book, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { bookCoverPath, ...rest } = book
      return {
        ...rest,
        bookCover: `data:image/png;base64,${Buffer.from(covers[index]).toString('base64')}`
      }
    })

    return mostReadBooksWithCover
  } catch (error) {
    console.log(
      '🚀 ~ file: main.ts:176 ~ constonGetMostReadBooks:GetMostReadBooks= ~ error:',
      error
    )
  }
}

const onGetHasBookmarkBooks: GetHasBookmarkBooks = async () => {
  try {
    const books = await getHasBookmarkBooks()
    const covers = await Promise.all(books.map((book) => readFile(book.bookCoverPath)))

    const hasBookmarkBooks = books.map((book, index) => {
      const { bookCoverPath, ...rest } = book
      return {
        ...rest,
        bookCover: `data:image/png;base64,${Buffer.from(covers[index]).toString('base64')}`
      }
    })
    return hasBookmarkBooks
  } catch (error) {
    console.log('🚀 ~ file: main.ts:220 ~ error:', error)
  }
}

const onGetRecordDurationAmount: GetRecordDurationAmount = async () => {
  try {
    const durationAmount = await getRecordDurationAmount()
    console.log(
      '🚀 ~ file: main.ts:165 ~ constonGetRecordDurationAmount:GetRecordDurationAmount= ~ durationAmount:',
      durationAmount
    )
    return durationAmount
  } catch (error) {
    console.log('🚀 ~ file: main.ts:166 ~ onGetRecordDurationAmount ~ error:', error)
  }
}

const onGetMonthlyRecordActivity: GetMonthlyRecordActivity = async (month: string) => {
  try {
    const monthlyRecordActivity = await getMonthlyRecordActivity(month)
    console.log(
      '🚀 ~ file: main.ts:178 ~ onGetMonthlyRecordActivity ~ monthlyRecordActivity:',
      monthlyRecordActivity
    )
    return monthlyRecordActivity
  } catch (error) {
    console.log('🚀 ~ file: main.ts:179 ~ onGetMonthlyRecordActivity ~ error:', error)
  }
}

const onGetDailyRecords: GetDailyRecords = async (begin, end) => {
  try {
    const dailyRecords = await getDailyRecords(begin, end)
    console.log(
      '🚀 ~ file: main.ts:229 ~ constonGetDailyRecords:GetDailyRecords= ~ dailyRecords:',
      dailyRecords
    )
    return dailyRecords
  } catch (error) {
    console.log('🚀 ~ file: main.ts:225 ~ constonGetDailyRecords:GetDailyRecords= ~ error:', error)
  }
}

const onCreateBookmark: CreateBookmark = async (params) => {
  try {
    const createdBookmark = await createBookmark(params)
    console.log(
      '🚀 ~ file: main.ts:244 ~ constonCreateBookmark:CreateBookmark= ~ createdBookmark:',
      createdBookmark
    )
  } catch (error) {
    console.log('🚀 ~ file: main.ts:244 ~ constonCreateBookmark:CreateBookmark= ~ error:', error)
  }
}

const onGetBookmarkAmount = async () => {
  try {
    const bookmarkAmount = await getBookmarkAmount()
    console.log('🚀 ~ file: main.ts:256 ~ onGetBookmarkAmount ~ bookmarkAmount:', bookmarkAmount)
    return bookmarkAmount
  } catch (error) {
    console.log('🚀 ~ file: main.ts:257 ~ onGetBookmarkAmount ~ error:', error)
  }
}

const onGetBookmarksByBook: GetBookmarksByBook = async (bookId) => {
  try {
    const bookmarks = await getBookmarksByBook(bookId)
    return bookmarks
  } catch (error) {
    console.log('🚀 ~ file: main.ts:286 ~ onGetBookmarksByBook ~ error:', error)
  }
}
app.whenReady().then(() => {
  //book
  ipcMain.handle('createBook', async (event, data) => {
    const createdBook = await onCreateBook(
      data.title,
      data.creator,
      data.bookFile,
      data.bookCoverFile,
      data.size,
      data.identifier,
      data.pubdate,
      data.publisher,
      data.language
    )
    return createdBook
  })
  ipcMain.handle('getBookCoverList', onGetBookCoverList)
  ipcMain.handle('getBookContent', async (event, data) => {
    const bookContent = await onGetBookContent(data)
    return bookContent
  })
  ipcMain.on('deleteBook', (event, data) => {
    onDeleteBook(data)
  })
  ipcMain.handle('getBookAmount', onGetBookAmount)
  createWindow()
  ipcMain.handle('getHasBookmarkBooks', onGetHasBookmarkBooks)

  //record
  ipcMain.handle('createRecord', (event, data) => {
    onCreateRecord(data.bookId, data.end, data.begin, data.duration)
  })
  ipcMain.handle('getRecordDurationAmount', onGetRecordDurationAmount)
  ipcMain.handle('getMonthlyRecordActivity', (event, data) => onGetMonthlyRecordActivity(data))
  ipcMain.handle('getMostReadBooks', (event, data) => onGetMostReadBooks(data.begin, data.end))
  ipcMain.handle('getDailyRecords', (event, data) => onGetDailyRecords(data.begin, data.end))

  //bookmark
  ipcMain.handle('createBookmark', (event, data) => onCreateBookmark(data))
  ipcMain.handle('getBookmarkAmount', onGetBookmarkAmount)
  ipcMain.handle('getBookmarksByBook', (event, data) => onGetBookmarksByBook(data))

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
