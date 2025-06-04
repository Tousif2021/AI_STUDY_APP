import { create } from 'zustand';
import { Document } from '../types';
import { localDocumentStore } from '../lib/local-storage';
import { pdfSummarizer } from '../lib/pdf-summarizer';

interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File, courseId?: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documents = await localDocumentStore.getAllDocuments();
      set({ documents, isLoading: false });
    } catch (error) {
      console.error('Error fetching documents:', error);
      set({ error: 'Failed to fetch documents', isLoading: false });
    }
  },

  uploadDocument: async (file: File, courseId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const buffer = await file.arrayBuffer();
      
      // For PDFs, process and extract metadata
      let pageCount;
      if (file.type === 'application/pdf') {
        const result = await pdfSummarizer.summarize(buffer);
        if (result.success) {
          pageCount = result.metadata?.pageCount;
        }
      }

      const newDocument: Document = {
        id: crypto.randomUUID(),
        title: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 
              file.type.includes('image') ? 'image' : 'text',
        url: URL.createObjectURL(file),
        courseId,
        createdAt: new Date(),
        uploadedBy: 'local-user',
        processed: true,
        pageCount
      };

      await localDocumentStore.saveDocument(newDocument, buffer);

      set(state => ({
        documents: [newDocument, ...state.documents],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error uploading document:', error);
      set({ error: 'Failed to upload document', isLoading: false });
    }
  },

  deleteDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await localDocumentStore.deleteDocument(id);
      
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting document:', error);
      set({ error: 'Failed to delete document', isLoading: false });
    }
  },

  updateDocument: async (id: string, updates: Partial<Document>) => {
    set({ isLoading: true, error: null });
    try {
      const doc = await localDocumentStore.getDocument(id);
      if (!doc) throw new Error('Document not found');

      const updatedDoc = { ...doc, ...updates };
      await localDocumentStore.saveDocument(updatedDoc, doc.file);

      set(state => ({
        documents: state.documents.map(d => 
          d.id === id ? { ...d, ...updates } : d
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating document:', error);
      set({ error: 'Failed to update document', isLoading: false });
    }
  }
}));