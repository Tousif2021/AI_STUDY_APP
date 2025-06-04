import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Clock, BookOpen, Award, BookMarked } from 'lucide-react';
import { ProgressData } from '../../types';

interface StatisticsCardProps {
  progress: ProgressData;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ progress }) => {
  const averageQuizScore = progress.quizScores.length
    ? Math.round(progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length)
    : 0;

  return (
    <Card className="mb-6 border-none shadow-xl bg-white dark:bg-slate-900 rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-3">
        <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
          Your Study Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem
            icon={<Clock className="h-5 w-5 text-blue-600" />}
            label="Study Time"
            value={`${progress.studyTime} hrs`}
          />
          <StatItem
            icon={<BookOpen className="h-5 w-5 text-purple-600" />}
            label="Materials Read"
            value={`${progress.documentsRead}`}
          />
          <StatItem
            icon={<Award className="h-5 w-5 text-green-600" />}
            label="Quiz Avg."
            value={`${averageQuizScore}%`}
          />
          <StatItem
            icon={<BookMarked className="h-5 w-5 text-amber-600" />}
            label="Notes Created"
            value={`${progress.notesCreated}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex items-center justify-center rounded-full bg-white dark:bg-slate-700 p-3 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};
