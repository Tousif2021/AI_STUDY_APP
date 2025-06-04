import { cn } from "../../lib/utils";
import {
  Brain,
  Sparkles,
  DollarSign,
  Cloud,
  GitFork,
  HelpCircle,
  Settings,
  Heart
} from 'lucide-react';

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
  title: "Instant Summaries",
  description:
    "Turn any study material into bite-sized summaries so you learn faster and smarter.",
  icon: <Brain className="h-6 w-6" />,
},
{
  title: "Effortless Study Plans",
  description:
    "AI crafts personalized study schedules based on your progress and goals.",
  icon: <Sparkles className="h-6 w-6" />,
},
{
  title: "Smart Quiz Maker",
  description:
    "Generate quizzes tailored to your courses and track your learning over time.",
  icon: <DollarSign className="h-6 w-6" />,
},
{
  title: "Collaborative Notes",
  description:
    "Take and share real-time notes with classmates, boosting group study productivity.",
  icon: <Cloud className="h-6 w-6" />,
},
{
  title: "AI Study Coach",
  description:
    "Get 24/7 tutoring, motivation, and personalized tips from your virtual AI mentor.",
  icon: <GitFork className="h-6 w-6" />,
},
{
  title: "Progress & Predictions",
  description:
    "Track your study stats and get AI-predicted grades with actionable insights.",
  icon: <HelpCircle className="h-6 w-6" />,
},
{
  title: "Spaced Repetition Flashcards",
  description:
    "Master concepts faster with AI-optimized flashcards that schedule reviews when you need them most.",
  icon: <Settings className="h-6 w-6" />,
},
{
  title: "Event & Reminder Manager",
  description:
    "Never miss a deadline — AI schedules study sessions, exams, and breaks with smart reminders.",
  icon: <Heart className="h-6 w-6" />,
},

  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};