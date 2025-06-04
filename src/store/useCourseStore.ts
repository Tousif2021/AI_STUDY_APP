import { create } from 'zustand';
import { Course } from '../types';

interface CourseState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<void>;
  updateCourse: (id: string, courseData: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  initialized: boolean;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,
  initialized: false,

  fetchCourses: async () => {
    // Only fetch if not already initialized
    if (get().initialized) return;
    
    try {
      set({ isLoading: true, error: null });
      // For now, we'll use local storage to persist courses
      const storedCourses = localStorage.getItem('courses');
      const courses = storedCourses ? JSON.parse(storedCourses) : [];
      set({ courses, isLoading: false, initialized: true });
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ error: 'Failed to fetch courses', isLoading: false });
    }
  },

  createCourse: async (courseData: Partial<Course>) => {
    try {
      set({ isLoading: true, error: null });

      const newCourse: Course = {
        id: crypto.randomUUID(),
        title: courseData.title || 'New Course',
        description: courseData.description || '',
        imageUrl: courseData.imageUrl || 'https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg',
        createdBy: courseData.createdBy || '',
        enrolledCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        modules: []
      };

      const updatedCourses = [...get().courses, newCourse];
      localStorage.setItem('courses', JSON.stringify(updatedCourses));

      set(state => ({
        courses: updatedCourses,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error creating course:', error);
      set({ error: 'Failed to create course', isLoading: false });
    }
  },

  updateCourse: async (id: string, courseData: Partial<Course>) => {
    try {
      set({ isLoading: true, error: null });

      const updatedCourses = get().courses.map(course => 
        course.id === id 
          ? { 
              ...course, 
              ...courseData,
              updatedAt: new Date()
            } 
          : course
      );

      localStorage.setItem('courses', JSON.stringify(updatedCourses));

      set({ courses: updatedCourses, isLoading: false });
    } catch (error) {
      console.error('Error updating course:', error);
      set({ error: 'Failed to update course', isLoading: false });
    }
  },

  deleteCourse: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const updatedCourses = get().courses.filter(course => course.id !== id);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));

      set({ courses: updatedCourses, isLoading: false });
    } catch (error) {
      console.error('Error deleting course:', error);
      set({ error: 'Failed to delete course', isLoading: false });
    }
  }
}));