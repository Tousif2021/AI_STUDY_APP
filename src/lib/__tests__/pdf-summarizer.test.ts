import { describe, it, expect, beforeEach, vi } from 'vitest';
import { pdfSummarizer } from '../pdf-summarizer';
import * as pdfjsLib from 'pdfjs-dist';

// Mock PDF.js
vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
}));

describe('PDFSummarizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate PDF files correctly', async () => {
    const validPDF = new ArrayBuffer(8);
    const view = new Uint8Array(validPDF);
    const signature = '%PDF-';
    for (let i = 0; i < signature.length; i++) {
      view[i] = signature.charCodeAt(i);
    }

    const isValid = await pdfSummarizer.validatePDF(validPDF);
    expect(isValid).toBe(true);
  });

  it('should reject invalid PDF files', async () => {
    const invalidPDF = new ArrayBuffer(8);
    const isValid = await pdfSummarizer.validatePDF(invalidPDF);
    expect(isValid).toBe(false);
  });

  it('should handle empty files', async () => {
    const result = await pdfSummarizer.summarize(new ArrayBuffer(0));
    expect(result.success).toBe(false);
    expect(result.error).toContain('Empty or invalid PDF file');
  });

  it('should handle PDF loading timeout', async () => {
    const mockLoadingTask = new Promise(() => {});
    vi.mocked(pdfjsLib.getDocument).mockReturnValue({ promise: mockLoadingTask });

    const result = await pdfSummarizer.summarize(new ArrayBuffer(100), { timeout: 100 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('PDF loading timeout');
  });

  it('should emit progress events', async () => {
    const mockPDF = {
      numPages: 3,
      getMetadata: () => Promise.resolve({}),
      getPage: (num: number) => Promise.resolve({
        getTextContent: () => Promise.resolve({
          items: [{ str: `Page ${num} content` }]
        })
      })
    };

    vi.mocked(pdfjsLib.getDocument).mockReturnValue({ promise: Promise.resolve(mockPDF) });

    const progressEvents: any[] = [];
    pdfSummarizer.on('progress', (progress) => progressEvents.push(progress));

    await pdfSummarizer.summarize(new ArrayBuffer(100));

    expect(progressEvents).toHaveLength(3);
    expect(progressEvents[0]).toEqual({
      page: 1,
      totalPages: 3,
      percentComplete: expect.any(Number)
    });
  });

  it('should include metadata in the result', async () => {
    const mockMetadata = {
      info: {
        Title: 'Test Document',
        Author: 'Test Author',
        Keywords: 'test, pdf, document'
      }
    };

    const mockPDF = {
      numPages: 1,
      getMetadata: () => Promise.resolve(mockMetadata),
      getPage: () => Promise.resolve({
        getTextContent: () => Promise.resolve({
          items: [{ str: 'Test content' }]
        })
      })
    };

    vi.mocked(pdfjsLib.getDocument).mockReturnValue({ promise: Promise.resolve(mockPDF) });

    const result = await pdfSummarizer.summarize(new ArrayBuffer(100));

    expect(result.success).toBe(true);
    expect(result.metadata).toEqual({
      pageCount: 1,
      title: 'Test Document',
      author: 'Test Author',
      keywords: ['test', 'pdf', 'document']
    });
  });

  it('should handle PDFs with no text content', async () => {
    const mockPDF = {
      numPages: 1,
      getMetadata: () => Promise.resolve({}),
      getPage: () => Promise.resolve({
        getTextContent: () => Promise.resolve({
          items: []
        })
      })
    };

    vi.mocked(pdfjsLib.getDocument).mockReturnValue({ promise: Promise.resolve(mockPDF) });

    const result = await pdfSummarizer.summarize(new ArrayBuffer(100));

    expect(result.success).toBe(false);
    expect(result.error).toContain('No text content could be extracted');
  });
});