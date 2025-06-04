import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

// Simple browser-compatible event emitter implementation
class BrowserEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, data?: any): void {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  off(event: string, callback: Function): void {
    const callbacks = this.events[event];
    if (callbacks) {
      this.events[event] = callbacks.filter(cb => cb !== callback);
    }
  }
}

export interface SummarizationResult {
  success: boolean;
  summary?: string;
  error?: string;
  metadata?: {
    pageCount: number;
    title?: string;
    author?: string;
    keywords?: string[];
  };
  stats?: {
    processingTimeMs: number;
    textLength: number;
    extractedPages: number;
  };
}

export interface SummarizationOptions {
  maxPages?: number;
  targetLength?: number;
  includeMetadata?: boolean;
  timeout?: number;
}

class PDFSummarizer extends BrowserEventEmitter {
  private readonly logger: Console;

  constructor() {
    super();
    this.logger = console;
  }

  async summarize(file: ArrayBuffer, options: SummarizationOptions = {}): Promise<SummarizationResult> {
    const startTime = Date.now();
    
    try {
      // Validate input
      if (!file || file.byteLength === 0) {
        throw new Error('Empty or invalid PDF file');
      }

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: file });
      const pdf = await Promise.race([
        loadingTask.promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF loading timeout')), options.timeout || 30000)
        )
      ]);

      // Extract metadata
      const metadata = await pdf.getMetadata().catch(() => ({}));
      
      const pageCount = pdf.numPages;
      if (pageCount === 0) {
        throw new Error('PDF contains no pages');
      }

      // Process pages
      const maxPages = options.maxPages || pageCount;
      let extractedText = '';
      let processedPages = 0;

      for (let i = 1; i <= Math.min(pageCount, maxPages); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();

        if (pageText) {
          extractedText += pageText + '\n';
          processedPages++;
          
          this.emit('progress', {
            page: i,
            totalPages: Math.min(pageCount, maxPages),
            percentComplete: (i / Math.min(pageCount, maxPages)) * 100
          });
        }
      }

      if (!extractedText.trim()) {
        throw new Error('No text content could be extracted');
      }

      // Generate summary (placeholder - replace with actual summarization logic)
      const summary = `Sample summary of ${processedPages} pages`;

      const result: SummarizationResult = {
        success: true,
        summary,
        metadata: {
          pageCount,
          title: metadata?.info?.Title,
          author: metadata?.info?.Author,
          keywords: metadata?.info?.Keywords?.split(',').map(k => k.trim())
        },
        stats: {
          processingTimeMs: Date.now() - startTime,
          textLength: extractedText.length,
          extractedPages: processedPages
        }
      };

      this.logger.info('PDF summarization completed successfully', {
        pageCount,
        processedPages,
        processingTime: result.stats?.processingTimeMs
      });

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during PDF processing';
      
      this.logger.error('PDF summarization failed', {
        error: errorMessage,
        processingTime: Date.now() - startTime
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async validatePDF(file: ArrayBuffer): Promise<boolean> {
    try {
      const signature = new Uint8Array(file.slice(0, 5));
      const header = new TextDecoder().decode(signature);
      return header.startsWith('%PDF-');
    } catch {
      return false;
    }
  }
}

export const pdfSummarizer = new PDFSummarizer();