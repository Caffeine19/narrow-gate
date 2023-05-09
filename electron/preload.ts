import { Book, Record } from '@prisma/client'
import { contextBridge, ipcRenderer } from 'electron'
import { BookmarkCreateParams } from '../src/types/bookmark'

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
  platform: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('platform', callback),

  //book
  readBookFile: () => ipcRenderer.invoke('readBookFile'),
  createBook: (
    title: Book['title'],
    creator: Book['creator'],
    bookFile: ArrayBuffer,
    bookCoverFile: ArrayBuffer,
    size: Book['size'],
    identifier: Book['identifier'],
    pubdate: Book['pubdate'],
    publisher: Book['publisher'],
    language: Book['language']
  ) =>
    ipcRenderer.invoke('createBook', {
      title,
      creator,
      bookFile,
      bookCoverFile,
      size,
      identifier,
      pubdate,
      publisher,
      language
    }),
  getBookCoverList: () => ipcRenderer.invoke('getBookCoverList'),
  getBookContent: (id: Book['id']) => ipcRenderer.invoke('getBookContent', id),
  deleteBook: (idList: Book['id'][]) => ipcRenderer.send('deleteBook', idList),
  createRecord: (
    bookId: Record['bookId'],
    end: Record['end'],
    begin: Record['begin'],
    duration: Record['duration']
  ) => ipcRenderer.invoke('createRecord', { bookId, end, begin, duration }),
  getBookAmount: () => ipcRenderer.invoke('getBookAmount'),
  getMostReadBooks: (begin: string, end: string) =>
    ipcRenderer.invoke('getMostReadBooks', { begin, end }),
  getHasBookmarkBooks: () => ipcRenderer.invoke('getHasBookmarkBooks'),

  //record
  getRecordDurationAmount: () => ipcRenderer.invoke('getRecordDurationAmount'),
  getMonthlyRecordActivity: (month: string) =>
    ipcRenderer.invoke('getMonthlyRecordActivity', month),
  getDailyRecords: (begin: string, end: string) =>
    ipcRenderer.invoke('getDailyRecords', { begin, end }),

  //bookmark
  createBookmark: (params: BookmarkCreateParams) => ipcRenderer.invoke('createBookmark', params),
  getBookmarkAmount: () => ipcRenderer.invoke('getBookmarkAmount'),
  getBookmarksByBook: (bookId: Book['id']) => ipcRenderer.invoke('getBookmarksByBook', bookId)
})
