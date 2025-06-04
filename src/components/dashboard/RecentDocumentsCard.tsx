import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { FileText, FileImage, File, Clock } from 'lucide-react';
import { Document } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface RecentDocumentsCardProps {
  documents: Document[];
}

export const RecentDocumentsCard: React.FC<RecentDocumentsCardProps> = ({ documents }) => {
  return (
    <Card className="mb-6 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border-none">
      <CardHeader className="flex items-center justify-between px-6 pt-6 pb-3">
        {/* Header Icon + Title */}
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-cyan-500" />
          <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-white">
            Recent Documents
          </CardTitle>
        </div>
        <a
          href="/documents"
          className="text-sm font-medium text-cyan-600 dark:text-cyan-300 hover:underline"
        >
          View all
        </a>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {documents.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">
            <p>No documents yet. Upload your study materials to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <DocumentItem key={doc.id} document={doc} index={idx} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DocumentItemProps {
  document: Document;
  index: number;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, index }) => {
  const getIcon = () => {
    switch (document.type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-600" />;
      default:
        return <File className="h-6 w-6 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getBorderColor = () => {
    switch (document.type) {
      case 'pdf':
        return 'border-red-500';
      case 'image':
        return 'border-blue-500';
      default:
        return 'border-slate-300 dark:border-slate-600';
    }
  };

  const absoluteDate = new Date(document.createdAt).toLocaleString();

  return (
    <motion.a
      href={`/documents/${document.id}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`
        flex items-center gap-4 py-4 px-2 
        hover:bg-slate-50 dark:hover:bg-slate-800 
        rounded-lg transition
        border-l-4 ${getBorderColor()} bg-white dark:bg-slate-800
      `}
    >
      {/* Icon Container */}
      <div className="flex-none">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 shadow-sm">
          {getIcon()}
        </div>
      </div>

      {/* Title + Meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate hover:underline">
          {document.title}
        </p>
        <div className="flex items-center mt-1 space-x-4">
          <div
            className="flex items-center text-xs text-slate-500 dark:text-slate-400"
            title={absoluteDate}
          >
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
            </span>
          </div>
          {document.pageCount && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'}
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex-none">
        <span
          className={`
            px-2 py-1 text-xs font-medium rounded-full 
            ${
              document.processed
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
            }
          `}
        >
          {document.processed ? 'Processed' : 'Processing'}
        </span>
      </div>
    </motion.a>
  );
};
