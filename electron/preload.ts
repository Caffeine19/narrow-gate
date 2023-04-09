import { Book } from '@prisma/client'
import { contextBridge, ipcRenderer } from 'electron'

// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }

//   // ipcRenderer.on('channel', (event: any, args: any) => {
//   //   console.log(args)

//   // })
// })

contextBridge.exposeInMainWorld('electronAPI', {
  readBookFile: () => ipcRenderer.invoke('readBookFile'),
  createBook: (
    name: Book['name'],
    author: Book['author'],
    bookFile: ArrayBuffer,
    bookCoverFile: ArrayBuffer
  ) => ipcRenderer.send('createBook', { name, author, bookFile, bookCoverFile })
})
