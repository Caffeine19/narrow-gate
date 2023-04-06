import { app, BrowserWindow, ipcRenderer, dialog, ipcMain } from 'electron'

import * as path from 'path'

import { readFileSync } from 'fs'

import ePub from 'epubjs'
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 1024,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../dist/preload.js')
    },
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

const openDialog = async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] })
  console.log(result)
  if (result.filePaths.length > 0) {
    const path = result.filePaths[0]
    console.log({ path })
    const data = readFileSync(path)
    console.log(data)

    const buffer = readFileSync(path)
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    )
    return { path, arrayBuffer }
  }
}
app.whenReady().then(() => {
  ipcMain.handle('open-dialog', openDialog)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// ipcMain.on('openFile', (event, path) => {
//   const { dialog } = require('electron')
//   const fs = require('fs')
//   dialog
//     .showOpenDialog({})
//     .then((fileNames) => {
//       if (fileNames === undefined) {
//         console.log('No file selected')
//       } else {
//         readFile(fileNames[0])
//       }
//     })
//     .catch(() => {})

//   function readFile(filepath) {
//     fs.readFile(filepath, 'utf-8', (err, data) => {
//       if (err) {
//         alert('An error ocurred reading the file :' + err.message)
//         return
//       }

//       // handle the file content
//       event.sender.send('fileData', data)
//     })
//   }
// })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
