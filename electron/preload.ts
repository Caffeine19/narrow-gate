import { Book } from '@prisma/client'
import { contextBridge, ipcRenderer } from 'electron'

import { GetBookCoverList } from '../src/types/electronAPI'
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
    title: Book['title'],
    creator: Book['creator'],
    bookFile: ArrayBuffer,
    bookCoverFile: ArrayBuffer
  ) => ipcRenderer.invoke('createBook', { title, creator, bookFile, bookCoverFile }),
  getBookCoverList: () => ipcRenderer.invoke('getBookCoverList')
})
