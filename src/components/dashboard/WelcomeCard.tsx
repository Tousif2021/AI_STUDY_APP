import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload, PlusCircle, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';

export const WelcomeCard: React.FC = () => {
  const { user } = useAuthStore();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Card className="mb-6 overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-xl">
        <div className="relative px-8 py-10 sm:px-14 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
              Good {getTimeOfDay()}, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="mt-3 text-slate-300 text-lg leading-relaxed">
              Welcome to <span className="text-white font-semibold">VisualStudy</span> — your AI-powered learning space. What’s your next move?
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/documents/upload">
                <Button
                  leftIcon={<Upload className="h-4 w-4" />}
                  className="bg-cyan-500 text-white hover:bg-cyan-600 transition duration-200 shadow-md"
                >
                  Upload Material
                </Button>
              </Link>

              <Link to="/courses">
                <Button
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 transition duration-200 shadow-md"
                >
                  Browse Courses
                </Button>
              </Link>

              <Link to="/ai-tutor">
                <Button
                  leftIcon={<Book className="h-4 w-4" />}
                  variant="outline"
                  className="border-white bg-white/10 hover:bg-white/20 text-white transition duration-200 shadow-md"
                >
                  Ask AI Tutor
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Glow Blob */}
          <div className="absolute right-[-50px] bottom-[-50px] opacity-25 pointer-events-none blur-xl">
            <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#22d3ee"
                d="M41.5,-65.3C55.9,-56.7,71.2,-48.6,78.9,-35.8C86.6,-23,86.8,-5.5,82.3,9.6C77.9,24.6,69,37.2,58.2,48.1C47.5,59,35,68.1,20.4,73.4C5.8,78.6,-10.9,80,-25.2,75.3C-39.6,70.7,-51.6,60.1,-57.9,47.1C-64.2,34.1,-64.8,18.8,-66.5,3.1C-68.2,-12.6,-71,-28.6,-65.5,-40.9C-60,-53.3,-46.3,-61.9,-32.6,-70.6C-18.9,-79.3,-5.1,-88,6.8,-87.9C18.7,-87.8,27.2,-74,41.5,-65.3Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
