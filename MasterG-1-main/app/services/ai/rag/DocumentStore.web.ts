
import { DocumentChunk, DocumentIndex } from './types';

/**
 * Document Store (Web/Memory Implementation)
 * 
 * In-memory replacement for SQLite-based storage on web.
 * NOTE: Data is NOT persistent and will be lost on page reload.
 */
export class DocumentStore {
    private static instance: DocumentStore;
    private documents: Map<string, any> = new Map();
    private chunks: Map<string, DocumentChunk[]> = new Map();
    private vocabularies: Map<string, Map<string, number>> = new Map();

    private constructor() { }

    static getInstance(): DocumentStore {
        if (!DocumentStore.instance) {
            DocumentStore.instance = new DocumentStore();
        }
        return DocumentStore.instance;
    }

    async initialize(): Promise<void> {
        console.log('📦 DocumentStore (Web/Memory) initialized');
    }

    async saveDocument(
        documentId: string,
        documentName: string,
        chunks: DocumentChunk[],
        vocabulary: Map<string, number>
    ): Promise<void> {
        const totalWords = chunks.reduce((sum, c) => sum + c.wordCount, 0);
        const totalPages = Math.max(...chunks.map(c => c.pageNumber));
        const avgChunkLength = totalWords / chunks.length;
        const now = Date.now();

        this.documents.set(documentId, {
            id: documentId,
            name: documentName,
            total_chunks: chunks.length,
            total_words: totalWords,
            total_pages: totalPages,
            avg_chunk_length: avgChunkLength,
            created_at: now,
            last_accessed_at: now
        });

        this.chunks.set(documentId, chunks);
        this.vocabularies.set(documentId, vocabulary);
        console.log(`✅ Document "${documentName}" saved to memory`);
    }

    async getChunks(documentId: string): Promise<DocumentChunk[]> {
        if (this.documents.has(documentId)) {
            // Update last accessed
            const doc = this.documents.get(documentId);
            doc.last_accessed_at = Date.now();
            this.documents.set(documentId, doc);
        }
        return this.chunks.get(documentId) || [];
    }

    async getVocabulary(documentId: string): Promise<Map<string, number>> {
        return this.vocabularies.get(documentId) || new Map();
    }

    async getDocument(documentId: string): Promise<DocumentIndex | null> {
        const doc = this.documents.get(documentId);
        if (!doc) return null;

        const vocabulary = await this.getVocabulary(documentId);
        const idf = new Map<string, number>();
        const totalChunks = doc.total_chunks;
        vocabulary.forEach((df, term) => {
            idf.set(term, Math.log((totalChunks + 1) / (df + 1)) + 1);
        });

        return {
            documentId: doc.id,
            documentName: doc.name,
            totalChunks: doc.total_chunks,
            totalWords: doc.total_words,
            totalPages: doc.total_pages,
            vocabulary,
            idf,
            avgChunkLength: doc.avg_chunk_length,
            createdAt: doc.created_at,
            lastAccessedAt: doc.last_accessed_at,
        };
    }

    async listDocuments(): Promise<Array<{
        id: string;
        name: string;
        totalChunks: number;
        totalPages: number;
        createdAt: number;
    }>> {
        return Array.from(this.documents.values()).map(doc => ({
            id: doc.id,
            name: doc.name,
            totalChunks: doc.total_chunks,
            totalPages: doc.total_pages,
            createdAt: doc.created_at
        })).sort((a, b: any) => b.createdAt - a.createdAt);
    }

    async documentExists(documentId: string): Promise<boolean> {
        return this.documents.has(documentId);
    }

    async deleteDocument(documentId: string): Promise<void> {
        this.documents.delete(documentId);
        this.chunks.delete(documentId);
        this.vocabularies.delete(documentId);
        console.log(`🗑️ Deleted document from memory: ${documentId}`);
    }

    async getStats(): Promise<{
        totalDocuments: number;
        totalChunks: number;
        totalVocabTerms: number;
    }> {
        let totalChunks = 0;
        this.chunks.forEach(chunks => totalChunks += chunks.length);
        let totalVocab = 0;
        this.vocabularies.forEach(vocab => totalVocab += vocab.size);

        return {
            totalDocuments: this.documents.size,
            totalChunks,
            totalVocabTerms: totalVocab
        };
    }

    async clearAll(): Promise<void> {
        this.documents.clear();
        this.chunks.clear();
        this.vocabularies.clear();
        console.log('🧹 All documents cleared from memory');
    }
}

export default DocumentStore.getInstance();
