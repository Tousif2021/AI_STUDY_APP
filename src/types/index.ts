export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'pro';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  enrolledCount: number;
  imageUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  order: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'quiz' | 'flashcards' | 'notes';
  url?: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'pptx' | 'image' | 'text';
  url: string;
  content?: string;
  courseId?: string;
  createdAt: Date;
  uploadedBy: string;
  processed: boolean;
  pageCount?: number;
  thumbnail?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  documentId?: string;
  courseId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  collaborators?: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  documentId?: string;
  courseId?: string;
  createdAt: Date;
  lastReviewed?: Date;
  nextReview?: Date;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  documentId?: string;
  courseId?: string;
  createdAt: Date;
  timeLimit?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: 'study' | 'exam' | 'meeting' | 'deadline';
  reminder?: Date;
  courseId?: string;
  createdBy: string;
}

export interface StudySession {
  id: string;
  userId: string;
  courseId?: string;
  documentId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

export interface ProgressData {
  quizScores: number[];
  flashcardPerformance: number;
  studyTime: number;
  documentsRead: number;
  coursesCompleted: number;
  notesCreated: number;
}