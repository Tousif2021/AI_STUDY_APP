import React, { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { CourseGrid } from '../components/courses/CourseGrid';
import { Button } from '../components/ui/Button';
import { PlusCircle, Search, X } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { useCourseStore } from '../store/useCourseStore';
import { useAuthStore } from '../store/useAuthStore';

export const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const { courses, isLoading, error, fetchCourses, createCourse } = useCourseStore();
  const { user } = useAuthStore();
  
  const [newCourse, setNewCourse] = React.useState({
    title: '',
    description: '',
    imageUrl: 'https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg'
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCourse = () => {
    if (!user) return;
    
    createCourse({
      title: newCourse.title,
      description: newCourse.description,
      imageUrl: newCourse.imageUrl,
      createdBy: user.id
    });
    setShowCreateModal(false);
    setNewCourse({
      title: '',
      description: '',
      imageUrl: 'https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg'
    });
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
          {error && (
            <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
          )}
        </div>
        
        <Button 
          leftIcon={<PlusCircle className="h-4 w-4" />}
          onClick={() => setShowCreateModal(true)}
          disabled={!user}
        >
          Create Course
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          fullWidth
        />
      </div>
      
      <CourseGrid courses={filteredCourses} isLoading={isLoading} />

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Course</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="Enter course title"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Enter course description"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  rows={4}
                />
              </div>

              <Input
                label="Image URL"
                value={newCourse.imageUrl}
                onChange={(e) => setNewCourse({ ...newCourse, imageUrl: e.target.value })}
                placeholder="Enter image URL"
              />

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCourse}
                  disabled={!newCourse.title}
                >
                  Create Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};