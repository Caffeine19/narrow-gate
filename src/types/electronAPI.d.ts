export interface ReadBookFile {
  (): Promise<ArrayBuffer>
}

export interface IElectronAPI {
  readBookFile: ReadBookFile
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
