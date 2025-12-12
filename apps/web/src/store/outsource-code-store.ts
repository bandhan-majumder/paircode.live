import { createStore, type StoreApi } from 'zustand/vanilla'

export type OutSourceCodeState = {
  code: string,
  language: string
}

export type OutSourceCodeActions = {
  setCode: (code: string) => void
  setLanguage: (language: string) => void
}

export type OutSourceCodeActionsStore = OutSourceCodeState & OutSourceCodeActions

export const defaultInitState: OutSourceCodeState = {
  code: '',
  language: ''
}

export const createOutSourceCodeStore = (
  initState: OutSourceCodeState = defaultInitState,
): StoreApi<OutSourceCodeActionsStore> => {
  return createStore<OutSourceCodeActionsStore>()((set) => ({
    ...initState,
    setCode: (code) => set(() => ({ code })),
    setLanguage: (language) => set(() => ({ language })),
  }))
}