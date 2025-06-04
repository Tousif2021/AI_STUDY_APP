import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload, X, CheckCircle, File, FileText, FileImage, AlertCircle } from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore';

export const UploadForm: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { uploadDocument, isLoading } = useDocumentStore();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setError(null);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'text/plain': ['.txt']
    },
    maxSize: 10485760, // 10MB
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }
    
    setError(null);
    
    try {
      // Upload files one by one
      for (const file of files) {
        await uploadDocument(file);
      }
      
      // Clear files after successful upload
      setFiles([]);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload one or more files. Please try again.');
    }
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (type.includes('image')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Card className="mb-6 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl">Upload Study Materials</CardTitle>
        <CardDescription>
          Upload PDF, DOCX, PPTX, images, or plain text files to get AI-powered summaries, flashcards, and quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or <span className="text-blue-600 dark:text-blue-400">browse from your computer</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: PDF, DOCX, PPTX, images, TXT (max. 10MB each)
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
            <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            isLoading={isLoading}
          >
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};