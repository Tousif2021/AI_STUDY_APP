import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Brain, Book, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudyModeProps {
  courseId: string;
  onComplete: () => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({ courseId, onComplete }) => {
  const [activeSection, setActiveSection] = useState<'flashcards' | 'quiz' | null>(null);
  const [progress, setProgress] = useState(0);
  const [showAITip, setShowAITip] = useState(false);

  // Mock flashcards data
  const flashcards = [
    { id: '1', front: 'What is a binary tree?', back: 'A tree data structure where each node has at most two children.' },
    { id: '2', front: 'Explain Big O Notation', back: 'A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity.' },
  ];

  // Mock quiz data
  const quizQuestions = [
    {
      id: '1',
      question: 'Which of the following is NOT a valid time complexity?',
      options: ['O(1)', 'O(n)', 'O(n²)', 'O(2n)'],
      correctAnswer: 3
    },
  ];

  // Mock AI tips
  const aiTips = [
    "Try connecting this concept with real-world examples to better understand it.",
    "Research shows that taking short breaks every 25 minutes improves retention.",
    "Consider creating a mind map to visualize how different concepts relate.",
  ];

  const showRandomAITip = () => {
    const tip = aiTips[Math.floor(Math.random() * aiTips.length)];
    setShowAITip(tip);
    setTimeout(() => setShowAITip(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Study Mode</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Interactive learning tools to help you master the material
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Study time: 45 minutes
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-1">
          <div className="w-full h-full mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
        </div>
        <Card className="relative border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Progress</CardTitle>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Brain className="h-4 w-4" />}
                onClick={showRandomAITip}
              >
                Get Study Tip
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProgressCard
                  icon={<Book className="h-6 w-6 text-blue-500" />}
                  title="Materials Covered"
                  value="3/5"
                />
                <ProgressCard
                  icon={<Brain className="h-6 w-6 text-purple-500" />}
                  title="Quiz Score"
                  value="85%"
                />
                <ProgressCard
                  icon={<CheckCircle className="h-6 w-6 text-green-500" />}
                  title="Flashcards Mastered"
                  value="12/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showAITip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 flex items-start"
          >
            <Sparkles className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                AI Study Tip: {showAITip}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flashcards.map((card) => (
                <FlashcardItem key={card.id} card={card} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Practice Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizQuestions.map((question) => (
                <QuizItem key={question.id} question={question} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ProgressCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

interface FlashcardItemProps {
  card: {
    id: string;
    front: string;
    back: string;
  };
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-40 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 backface-hidden">
          <p className="text-gray-900 dark:text-white">{card.front}</p>
        </div>
        <div
          className="absolute inset-0 w-full h-full bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="text-blue-900 dark:text-blue-100">{card.back}</p>
        </div>
      </motion.div>
    </div>
  );
};

interface QuizItemProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

const QuizItem: React.FC<QuizItemProps> = ({ question }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-gray-900 dark:text-white font-medium">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left p-3 rounded-lg border ${
              selectedAnswer === index
                ? selectedAnswer === question.correctAnswer
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedAnswer(index)}
          >
            <p className={`text-sm ${
              selectedAnswer === index
                ? selectedAnswer === question.correctAnswer
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {option}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};