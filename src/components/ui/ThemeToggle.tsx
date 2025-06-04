import React, { useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore, applyTheme } from '../../store/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    applyTheme(theme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <div className="flex items-center space-x-2 border dark:border-gray-700 rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md ${
          theme === 'light'
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4 text-amber-500" />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md ${
          theme === 'dark'
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4 text-indigo-500" />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md ${
          theme === 'system'
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-label="System mode"
      >
        <Monitor className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
};