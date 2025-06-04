import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { DocumentGrid } from '../components/documents/DocumentGrid';
import { AITutorChat } from '../components/documents/AITutorChat';
import { CollaborativeNoteEditor } from '../components/courses/CollaborativeNoteEditor';
import { StudyMode } from '../components/courses/StudyMode';
import { Button } from '../components/ui/Button';
import { Upload, Book, Brain, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CoursePage: React.FC = () => {
  const { courseId } = useParams();
  const [isStudyMode, setIsStudyMode] = useState(false);

  // Mock course data
  const course = {
    id: courseId,
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science and programming.',
    modules: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    createdBy: '1',
    enrolledCount: 156,
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    progress: 65
  };

  // Mock documents data
  const documents = [
    {
      id: '1',
      title: 'Introduction to Programming Concepts',
      type: 'pdf',
      url: '/documents/1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      uploadedBy: '1',
      processed: true,
      pageCount: 24
    },
    {
      id: '2',
      title: 'Data Structures Overview',
      type: 'pdf',
      url: '/documents/2',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      uploadedBy: '1',
      processed: true,
      pageCount: 15
    }
  ];

  const handleSaveNotes = (title: string, content: string) => {
    console.log('Saving collaborative note:', { title, content });
  };

  const handleStudyComplete = () => {
    console.log('Study session completed');
    setIsStudyMode(false);
  };

  return (
    <Layout>
      <div className="relative h-64 -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-gray-200">{course.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                <div className="text-sm opacity-80">Progress</div>
                <div className="text-2xl font-semibold">{course.progress}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Materials</h2>
            <div className="flex gap-2">
              <Link to={`/courses/${courseId}/upload`}>
                <Button leftIcon={<Upload className="h-4 w-4" />}>
                  Upload
                </Button>
              </Link>
              <Button
                variant={isStudyMode ? 'primary' : 'outline'}
                leftIcon={isStudyMode ? <CheckCircle className="h-4 w-4" /> : <Book className="h-4 w-4" />}
                onClick={() => setIsStudyMode(!isStudyMode)}
              >
                {isStudyMode ? 'Exit Study Mode' : 'Study Mode'}
              </Button>
            </div>
          </div>

          {isStudyMode ? (
            <StudyMode courseId={courseId!} onComplete={handleStudyComplete} />
          ) : (
            <>
              <DocumentGrid documents={documents} />
              <CollaborativeNoteEditor
                courseId={courseId!}
                onSave={handleSaveNotes}
              />
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Brain className="h-5 w-5 text-purple-500 mr-2" />
                AI Study Assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Ask questions about the course materials or get help with specific topics.
              </p>
            </div>
            <AITutorChat />
          </div>
        </div>
      </div>
    </Layout>
  );
};