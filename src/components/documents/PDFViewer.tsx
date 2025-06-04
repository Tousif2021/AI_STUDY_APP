import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, ZoomIn, ZoomOut, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PDFViewerProps {
  url: string;
  onLoadError?: (error: Error) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, onLoadError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cache rendered pages
  const pageCache = useRef<Map<number, ImageBitmap>>(new Map());
  
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        await renderPage(1, pdfDoc);
      } catch (error) {
        console.error('Error loading PDF:', error);
        onLoadError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
    
    return () => {
      // Clear cache on unmount
      pageCache.current.forEach(bitmap => bitmap.close());
      pageCache.current.clear();
    };
  }, [url]);

  const renderPage = async (pageNum: number, pdfDoc = pdf) => {
    if (!canvasRef.current || !pdfDoc) return;

    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Check cache first
      const cachedPage = pageCache.current.get(pageNum);
      if (cachedPage) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(cachedPage, 0, 0);
        return;
      }

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Cache the rendered page
      const bitmap = await createImageBitmap(canvas);
      pageCache.current.set(pageNum, bitmap);
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.25, Math.min(4, scale + delta));
    setScale(newScale);
    renderPage(currentPage);
  };

  const handlePageChange = async (delta: number) => {
    const newPage = Math.max(1, Math.min(numPages, currentPage + delta));
    setCurrentPage(newPage);
    await renderPage(newPage);
  };

  const handleSearch = async () => {
    if (!pdf || !searchQuery) return;

    const results: any[] = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      
      if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ page: i, text });
      }
    }

    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    
    if (results.length > 0) {
      setCurrentPage(results[0].page);
      await renderPage(results[0].page);
    }
  };

  const handleCopyText = async () => {
    if (!pdf) return;

    const page = await pdf.getPage(currentPage);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');
    
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom(-0.1)}
            disabled={scale <= 0.25}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {Math.round(scale * 100)}%
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom(0.1)}
            disabled={scale >= 4}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search in document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-64"
          />
          <Button size="sm" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(-1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {numPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(1)}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyText}
            title="Copy page text"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Loading PDF...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center min-h-full">
          <canvas
            ref={canvasRef}
            className="shadow-lg"
          />
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Found {searchResults.length} results
          </p>
          <div className="mt-2 max-h-32 overflow-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  index === currentSearchIndex
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
                onClick={async () => {
                  setCurrentSearchIndex(index);
                  setCurrentPage(result.page);
                  await renderPage(result.page);
                }}
              >
                Page {result.page}: {result.text.substring(0, 100)}...
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};