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
    title: Book['title'],
    creator: Book['creator'],
    bookFile: ArrayBuffer,
    bookCoverFile: ArrayBuffer,
    size: Book['size'],
    identifier: Book['identifier'],
    pubdate: Book['pubdate'],
    publisher: Book['publisher']
  ) =>
    ipcRenderer.invoke('createBook', {
      title,
      creator,
      bookFile,
      bookCoverFile,
      size,
      identifier,
      pubdate,
      publisher
    }),
  getBookCoverList: () => ipcRenderer.invoke('getBookCoverList'),
  getBookContent: (id: Book['id']) => ipcRenderer.invoke('getBookContent', id),
  platform: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('platform', callback)
})
