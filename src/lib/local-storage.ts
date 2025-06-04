import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Document } from '../types';

interface DocumentDB extends DBSchema {
  documents: {
    key: string;
    value: Document & {
      file: ArrayBuffer;
    };
    indexes: {
      'by-created': Date;
      'by-type': string;
    };
  };
}

class LocalDocumentStore {
  private db: Promise<IDBPDatabase<DocumentDB>>;

  constructor() {
    this.db = openDB<DocumentDB>('visual-study', 1, {
      upgrade(db) {
        const store = db.createObjectStore('documents', { keyPath: 'id' });
        store.createIndex('by-created', 'createdAt');
        store.createIndex('by-type', 'type');
      },
    });
  }

  async saveDocument(doc: Document, file: ArrayBuffer): Promise<void> {
    const db = await this.db;
    await db.put('documents', {
      ...doc,
      file,
    });
  }

  async getDocument(id: string): Promise<(Document & { file: ArrayBuffer }) | undefined> {
    const db = await this.db;
    return db.get('documents', id);
  }

  async getAllDocuments(): Promise<Document[]> {
    const db = await this.db;
    const docs = await db.getAllFromIndex('documents', 'by-created');
    return docs.map(({ file, ...doc }) => doc);
  }

  async deleteDocument(id: string): Promise<void> {
    const db = await this.db;
    await db.delete('documents', id);
  }

  async getDocumentsByType(type: string): Promise<Document[]> {
    const db = await this.db;
    const docs = await db.getAllFromIndex('documents', 'by-type', type);
    return docs.map(({ file, ...doc }) => doc);
  }
}

export const localDocumentStore = new LocalDocumentStore();