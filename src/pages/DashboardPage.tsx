import React from 'react';
import { Layout } from '../components/layout/Layout';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { StatisticsCard } from '../components/dashboard/StatisticsCard';
import { RecentDocumentsCard } from '../components/dashboard/RecentDocumentsCard';
import { UpcomingEventsCard } from '../components/dashboard/UpcomingEventsCard';
import { AITutorChat } from '../components/documents/AITutorChat';
import { Document, ProgressData, CalendarEvent } from '../types';

export const DashboardPage: React.FC = () => {
  // Mock data for demonstration
  const progressData: ProgressData = {
    quizScores: [85, 92, 78, 88],
    flashcardPerformance: 72,
    studyTime: 24,
    documentsRead: 7,
    coursesCompleted: 1,
    notesCreated: 12
  };
  
  const recentDocuments: Document[] = [
    {
      id: '1',
      title: 'Introduction to Quantum Mechanics',
      type: 'pdf',
      url: '/documents/1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      uploadedBy: '1',
      processed: true,
      pageCount: 24
    },
    {
      id: '2',
      title: 'Organic Chemistry Notes',
      type: 'pdf',
      url: '/documents/2',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      uploadedBy: '1',
      processed: true,
      pageCount: 15
    },
    {
      id: '3',
      title: 'World History Timeline',
      type: 'image',
      url: '/documents/3',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      uploadedBy: '1',
      processed: true
    }
  ];
  
  const upcomingEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Physics Study Session',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours from now
      type: 'study',
      createdBy: '1'
    },
    {
      id: '2',
      title: 'Chemistry Midterm Exam',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 90), // 2 days + 1.5 hours from now
      type: 'exam',
      location: 'Science Building, Room 302',
      createdBy: '1'
    }
  ];

  return (
    <Layout>
      <WelcomeCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StatisticsCard progress={progressData} />
          <RecentDocumentsCard documents={recentDocuments} />
          <UpcomingEventsCard events={upcomingEvents} />
        </div>
        
        <div className="lg:col-span-1">
          <AITutorChat />
        </div>
      </div>
    </Layout>
  );
};