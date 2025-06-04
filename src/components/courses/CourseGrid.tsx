import React from 'react';
import { Course } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Users, Clock, FolderOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface CourseGridProps {
  courses: Course[];
  isLoading?: boolean;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first course to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link key={course.id} to={`/courses/${course.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={course.imageUrl || 'https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-200 line-clamp-2">
                  {course.description}
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.enrolledCount} enrolled</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Updated {formatDistanceToNow(course.updatedAt, { addSuffix: true })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
      <div className="p-4 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
};