'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useStore, type StoreApi } from 'zustand'

import { createOutSourceCodeStore, type OutSourceCodeActionsStore } from '@/store/outsource-code-store'

export type OutSourceCodeActionsStoreApi = StoreApi<OutSourceCodeActionsStore>

export const OutSourceCodeActionsStoreContext =
    createContext<OutSourceCodeActionsStoreApi | undefined>(undefined)

export const OutSourceCodeActionsStoreProvider = ({ children }: { children: ReactNode }) => {
    const [store] = useState(() => createOutSourceCodeStore())
    return (
        <OutSourceCodeActionsStoreContext.Provider value={store}>
            {children}
        </OutSourceCodeActionsStoreContext.Provider>
    )
}

export const useOutSourceCodeActionsStore = <T,>(
    selector: (state: OutSourceCodeActionsStore) => T,
): T => {
    const store = useContext(OutSourceCodeActionsStoreContext)
    if (!store) {
        throw new Error('useOutSourceCodeActionsStore must be used within OutSourceCodeActionsStoreProvider')
    }

    return useStore(store, selector)
}
