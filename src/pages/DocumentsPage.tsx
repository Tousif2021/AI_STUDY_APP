import React, { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { DocumentGrid } from '../components/documents/DocumentGrid';
import { Button } from '../components/ui/Button';
import { Upload, Search, FilterX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { useDocumentStore } from '../store/useDocumentStore';

export const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'pdf' | 'docx' | 'pptx' | 'image' | 'text'>('all');
  const { documents, isLoading, error, fetchDocuments } = useDocumentStore();
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = documents
    .filter(doc => filter === 'all' || doc.type === filter)
    .filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
          {error && (
            <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link to="/documents/upload">
            <Button leftIcon={<Upload className="h-4 w-4" />}>
              Upload
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            fullWidth
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={filter === 'pdf'} 
            onClick={() => setFilter('pdf')}
          >
            PDF
          </FilterButton>
          <FilterButton 
            active={filter === 'image'} 
            onClick={() => setFilter('image')}
          >
            Images
          </FilterButton>
          {searchTerm || filter !== 'all' ? (
            <Button 
              size="sm" 
              variant="ghost" 
              leftIcon={<FilterX className="h-4 w-4" />}
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </div>
      
      <DocumentGrid documents={filteredDocuments} isLoading={isLoading} />
    </Layout>
  );
};

interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm font-medium ${
        active
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};