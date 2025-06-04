import React from 'react';
import { Layout } from '../components/layout/Layout';
import { UploadForm } from '../components/documents/UploadForm';

export const UploadPage: React.FC = () => {
  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Study Materials</h1>
      </div>
      
      <UploadForm />
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
        <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">How it works</h2>
        <ul className="list-disc list-inside text-blue-700 dark:text-blue-400 space-y-1 text-sm">
          <li>Upload PDFs, documents, presentations, images, or text files</li>
          <li>Our AI extracts and processes the content</li>
          <li>Get automatically generated summaries, flashcards, and quizzes</li>
          <li>Create notes linked to your documents</li>
          <li>Ask the AI tutor questions about your materials</li>
        </ul>
      </div>
    </Layout>
  );
};