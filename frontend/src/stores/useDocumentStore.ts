import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document } from '../types';

interface DocumentState {
  documents: Document[];
  lastSync: string | null;

  addDocument: (document: Document) => void;
  addDocuments: (documents: Document[]) => void;
  getDocument: (id: string) => Document | undefined;
  setLastSync: (timestamp: string) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      lastSync: null,

      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents.filter(d => d.id !== document.id), document],
        })),
      addDocuments: (documents) =>
        set((state) => ({
          documents: [
            ...state.documents.filter(d => !documents.some(nd => nd.id === d.id)),
            ...documents,
          ],
        })),
      getDocument: (id) => get().documents.find(d => d.id === id),
      setLastSync: (timestamp) => set({ lastSync: timestamp }),
    }),
    {
      name: 'document-storage',
    }
  )
);
