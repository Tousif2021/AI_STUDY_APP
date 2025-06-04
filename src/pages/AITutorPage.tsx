import React from 'react';
import { Layout } from '../components/layout/Layout';
import { AITutorChat } from '../components/documents/AITutorChat';

export const AITutorPage: React.FC = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Study Tutor</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Ask questions, get explanations, and receive personalized study recommendations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[70vh]">
          <AITutorChat />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Conversation Starters</h2>
            <div className="space-y-2">
              <SuggestionButton>
                Explain the concept of photosynthesis
              </SuggestionButton>
              <SuggestionButton>
                Create flashcards about World War II
              </SuggestionButton>
              <SuggestionButton>
                What are the key principles of object-oriented programming?
              </SuggestionButton>
              <SuggestionButton>
                Help me solve this calculus problem
              </SuggestionButton>
              <SuggestionButton>
                Generate quiz questions about cell biology
              </SuggestionButton>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface SuggestionButtonProps {
  children: React.ReactNode;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ children }) => {
  return (
    <button
      className="w-full text-left p-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {children}
    </button>
  );
};