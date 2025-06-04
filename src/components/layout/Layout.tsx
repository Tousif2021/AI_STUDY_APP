import React from 'react';
import { NavBar } from '../ui/tubelight-navbar';
import { Home, Book, Calendar, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Courses', url: '/courses', icon: Book },
    { name: 'Documents', url: '/documents', icon: FileText },
    { name: 'Calendar', url: '/calendar', icon: Calendar },
    { name: 'Profile', url: '/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavBar items={navItems} />
      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20" // Added pt-20 for navbar spacing
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
};