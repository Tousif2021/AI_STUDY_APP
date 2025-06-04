import React, { useState } from 'react';
import { Document } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { FileText, FileImage, File, Clock, FolderOpen, History, Tag, Eye, CheckCircle, Brain } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { PDFViewer } from './PDFViewer';

interface DocumentGridProps {
  documents: Document[];
  isLoading?: boolean;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, isLoading = false }) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  
  const handleSelectDocument = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleBatchProcess = () => {
    console.log('Processing documents:', selectedDocs);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <DocumentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Upload study materials to get started with AI-powered learning tools.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedDocs.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-700 dark:text-blue-300">
              {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              leftIcon={<Brain className="h-4 w-4" />}
              onClick={handleBatchProcess}
            >
              Process Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedDocs([])}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            isSelected={selectedDocs.includes(document.id)}
            onSelect={handleSelectDocument}
            onPreview={() => setPreviewDoc(document)}
          />
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 transition-opacity" onClick={() => setPreviewDoc(null)}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl mx-auto shadow-xl min-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {previewDoc.title}
                </h3>
                <Button size="sm" variant="ghost" onClick={() => setPreviewDoc(null)}>
                  Close
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                {previewDoc.type === 'pdf' ? (
                  <PDFViewer 
                    url={previewDoc.url} 
                    onLoadError={(error) => console.error('PDF load error:', error)}
                  />
                ) : previewDoc.type === 'image' ? (
                  <div className="h-full flex items-center justify-center p-4">
                    <img
                      src={previewDoc.url}
                      alt={previewDoc.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-4">
                    <p>Preview not available for this file type.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPreview: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, isSelected, onSelect, onPreview }) => {
  const getDocumentIcon = () => {
    switch (document.type) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-500" />;
      case 'image':
        return <FileImage className="h-12 w-12 text-blue-500" />;
      default:
        return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  const handleGenerateSummary = () => {
    console.log('Generating summary for:', document.title);
  };

  const handleGenerateFlashcards = () => {
    console.log('Generating flashcards for:', document.title);
  };

  const handleGenerateQuiz = () => {
    console.log('Generating quiz for:', document.title);
  };

  const handleAskQuestion = () => {
    console.log('Asking question about:', document.title);
  };

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 border ${
      isSelected ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="relative">
              {document.thumbnail ? (
                <img 
                  src={document.thumbnail} 
                  alt={document.title} 
                  className="w-24 h-32 object-cover object-center rounded border border-gray-200 dark:border-gray-700" 
                />
              ) : (
                <div className="w-24 h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  {getDocumentIcon()}
                </div>
              )}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(document.id)}
                className="absolute top-2 left-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {document.title}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={onPreview}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                Preview
              </Button>
            </div>
            <div className="flex items-center mt-2 mb-3">
              <Clock className="h-3 w-3 text-gray-500 mr-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
              </p>
              {document.pageCount && (
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                  {document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={document.type === 'pdf' ? 'danger' : document.type === 'image' ? 'primary' : 'default'}>
                {document.type.toUpperCase()}
              </Badge>
              {document.processed ? (
                <Badge variant="success">Processed</Badge>
              ) : (
                <Badge variant="warning">Processing</Badge>
              )}
              <Badge variant="secondary" leftIcon={<History className="h-3 w-3 mr-1" />}>
                v1.2
              </Badge>
              <Badge variant="info" leftIcon={<Tag className="h-3 w-3 mr-1" />}>
                Physics
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileText className="h-4 w-4" />}
            onClick={handleGenerateSummary}
            disabled={!document.processed}
            fullWidth
          >
            Summarize
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Brain className="h-4 w-4" />}
            onClick={handleGenerateFlashcards}
            disabled={!document.processed}
            fullWidth
          >
            Flashcards
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileText className="h-4 w-4" />}
            onClick={handleGenerateQuiz}
            disabled={!document.processed}
            fullWidth
          >
            Generate Quiz
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={handleAskQuestion}
            disabled={!document.processed}
            fullWidth
          >
            Ask Questions
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface VersionItemProps {
  version: string;
  date: Date;
  description: string;
}

const VersionItem: React.FC<VersionItemProps> = ({ version, date, description }) => {
  return (
    <div className="flex items-start space-x-3 text-sm">
      <div className="flex-shrink-0">
        <History className="h-5 w-5 text-gray-400" />
      </div>
      <div>
        <div className="font-medium text-gray-900 dark:text-white">
          Version {version}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
        <div className="text-gray-600 dark:text-gray-300 mt-1">
          {description}
        </div>
      </div>
    </div>
  );
};

const DocumentCardSkeleton: React.FC = () => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 mb-1 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 mt-2 mb-3 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </Card>
  );
};