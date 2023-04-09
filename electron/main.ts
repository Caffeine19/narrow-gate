import { app, BrowserWindow, dialog, ipcMain } from 'electron'

import * as path from 'path'

import { readFileSync, writeFileSync, existsSync } from 'fs'

import { CreateBook, ReadBookFile } from '../src/types/electronAPI'

import { createBook } from '../data/script'

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

  ipcMain.on('set-title', (event, title) => {
    console.log(title)
  })

  const isDev = process.env.NODE_ENV?.trim() === 'development'
  console.log('🚀 ~ file: main.ts:15 ~ createWindow ~ isDev:', isDev)
  if (isDev) {
    win.loadURL('http://localhost:5173/#/')
  } else {
    win.loadFile('dist/index.html')
  }
}

const readBookFile: ReadBookFile = async () => {
  const res = await dialog.showOpenDialog({ properties: ['openFile'] })
  console.log('🚀 ~ file: main.ts:34 ~ readBookFile ~ res:', res)

  if (res.filePaths.length > 0) {
    const file = res.filePaths[0]
    console.log('🚀 ~ file: main.ts:38 ~ readBookFile ~ file:', file)
    const data = readFileSync(file)
    const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    return arrayBuffer
  }
}

const onCreateBook: CreateBook = async (name, author, bookFile, bookCoverFile) => {
  console.clear()
  console.log('🚀 ~ file: main.ts:51 ~ constonCreateBook:CreateBook= ~ onCreateBook:', onCreateBook)
  console.log('123')
  try {
    const bookFilePath = `./static/book/${name}.book`
    const bookCoverPath = `./static/bookCover/${name}.bookCover`
    if (!existsSync(bookFilePath)) {
      writeFileSync(bookFilePath, '')
    }

    if (!existsSync(bookCoverPath)) {
      writeFileSync(bookCoverPath, '')
    }

    writeFileSync(bookFilePath, Buffer.from(bookFile))
    writeFileSync(bookCoverPath, Buffer.from(bookCoverFile))

    await createBook(name, author, bookCoverPath, bookFilePath)
  } catch (error) {
    console.log(error)
  }
}

app.whenReady().then(() => {
  ipcMain.handle('readBookFile', readBookFile)
  ipcMain.on('createBook', (event, data) => {
    onCreateBook(data.name, data.author, data.bookFile, data.bookCoverFile)
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
