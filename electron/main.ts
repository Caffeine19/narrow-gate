import { app, BrowserWindow, dialog, ipcMain } from 'electron'

import * as path from 'path'

import { readFileSync, writeFileSync, existsSync } from 'fs'

import {
  CreateBook,
  GetBookContent,
  GetBookCoverList,
  ReadBookFile
} from '../src/types/electronAPI'

import { createBook, getBookContent, getBookList } from '../data/main'
import { readFile } from 'fs/promises'
import { platform } from 'os'
import { BookCover } from '../src/types/book'

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

const onReadBookFile: ReadBookFile = async () => {
  try {
    const res = await dialog.showOpenDialog({ properties: ['openFile'] })

    if (res.filePaths.length > 0) {
      const file = res.filePaths[0]
      console.log('🚀 ~ file: main.ts:40 ~ constonReadBookFile:ReadBookFile= ~ file:', file)

      const data = readFileSync(file)
      const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      return arrayBuffer
    }
  } catch (error) {
    console.log('🚀 ~ file: main.ts:49 ~ constreadBookFile:ReadBookFile= ~ error:', error)
  }
}

const onCreateBook: CreateBook = async (
  title,
  creator,
  bookFile,
  bookCoverFile,
  size,
  identifier,
  pubdate,
  publisher
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
      publisher
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
        bookCover: `data:image/png;base64,${Buffer.from(bookCover).toString('base64')}`,
        picked: false
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

app.whenReady().then(() => {
  ipcMain.handle('readBookFile', onReadBookFile)
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
      data.publisher
    )
    return createdBook
  })
  ipcMain.handle('getBookCoverList', onGetBookCoverList)
  ipcMain.handle('getBookContent', async (event, data) => {
    console.log('🚀 ~ file: main.ts:126 ~ ipcMain.handle ~ data:', data)
    const bookContent = await onGetBookContent(data)
    return bookContent
  })

  createWindow()

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
