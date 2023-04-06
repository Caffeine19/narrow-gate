import { app, BrowserWindow, ipcRenderer, dialog, ipcMain } from 'electron'

import * as path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, '../dist/preload.js')
    },
    titleBarStyle: 'hidden'
  })

  const isDev = process.env.NODE_ENV?.trim() === 'development'
  console.log('🚀 ~ file: main.ts:15 ~ createWindow ~ isDev:', isDev)
  if (isDev) {
    win.loadURL('http://localhost:5173/#/')
  } else {
    win.loadFile('dist/index.html')
  }
}

app.whenReady().then(() => {
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
