import { app, BrowserWindow, clipboard } from 'electron'

import * as path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../dist/preload.js')
    },
    titleBarStyle: 'hidden'
  })
  
  const isDev = process.env.NODE_ENV?.trim() === 'development'
  console.log("🚀 ~ file: main.ts:15 ~ createWindow ~ isDev:", isDev)
  if (isDev) {
    win.loadURL('http://localhost:5173/#/')
  } else {
    win.loadFile('dist/index.html')
  }

  // clipboard.on('text-changed', () => {
  //   const text = clipboard.readText()
  //   console.log('剪贴板文本内容变化：', text)
  // })

  // clipboard.on('image-changed', () => {
  //   const image = clipboard.readImage()
  //   console.log('剪贴板图像内容变化：', image)
  // })
}

app.whenReady().then(() => {
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
