import { app, BrowserWindow, ipcMain } from 'electron'

import * as path from 'path'

import { writeFileSync, existsSync } from 'fs'

import {
  CreateBook,
  GetBookAmount,
  GetBookContent,
  GetBookCoverList,
  GetRecordDurationAmount
} from '../src/types/electronAPI'

import { createBook, deleteBook, getBookAmount, getBookContent, getBookList } from '../data/book'

import { createRecord, getMonthlyRecordActivity, getRecordDurationAmount } from '../data/record'

import { readFile } from 'fs/promises'
import { platform } from 'os'
import { BookCover } from '../src/types/book'

import type { Record } from '@prisma/client'

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
    const bookList = await getBookList()
    const bookCoverList: BookCover[] = []

    for (const book of bookList) {
      const bookCover = await readFile(book.bookCoverPath)
      bookCoverList.push({
        ...book,
        bookCover: `data:image/png;base64,${Buffer.from(bookCover).toString('base64')}`
      })
    }

    return bookCoverList
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

const onGetMonthlyRecordActivity = async () => {
  try {
    const monthlyRecordActivity = await getMonthlyRecordActivity()
    console.log(
      '🚀 ~ file: main.ts:178 ~ onGetMonthlyRecordActivity ~ monthlyRecordActivity:',
      monthlyRecordActivity
    )
    return monthlyRecordActivity
  } catch (error) {
    console.log('🚀 ~ file: main.ts:179 ~ onGetMonthlyRecordActivity ~ error:', error)
  }
}

app.whenReady().then(() => {
  ipcMain.handle('createBook', async (event, data) => {
    console.log('🚀 ~ file: main.ts:101 ~ ipcMain.handle ~ data:', data)
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
    console.log('🚀 ~ file: main.ts:126 ~ ipcMain.handle ~ data:', data)
    const bookContent = await onGetBookContent(data)
    return bookContent
  })
  ipcMain.on('deleteBook', (event, data) => {
    onDeleteBook(data)
  })
  ipcMain.handle('getBookAmount', onGetBookAmount)
  createWindow()

  ipcMain.handle('createRecord', (event, data) => {
    console.log('🚀 ~ file: main.ts:170 ~ ipcMain.handle ~ data:', data)
    onCreateRecord(data.bookId, data.end, data.begin, data.duration)
  })
  ipcMain.handle('getRecordDurationAmount', onGetRecordDurationAmount)
  ipcMain.handle('getMonthlyRecordActivity', onGetMonthlyRecordActivity)

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
