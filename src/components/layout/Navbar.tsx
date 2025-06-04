import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Bell, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* ─── Brand & Desktop Links ───────────────────────────────────────────────────── */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                VisualStudy
              </span>
            </Link>

            <div className="hidden sm:flex sm:space-x-6 sm:ml-8">
              <DesktopLink to="/dashboard" current={location.pathname === '/dashboard'}>
                Dashboard
              </DesktopLink>
              <DesktopLink to="/documents" current={location.pathname === '/documents'}>
                Documents
              </DesktopLink>
              <DesktopLink to="/courses" current={location.pathname === '/courses'}>
                Courses
              </DesktopLink>
              <DesktopLink to="/calendar" current={location.pathname === '/calendar'}>
                Calendar
              </DesktopLink>
            </div>
          </div>

          {/* ─── Right‐Side Icons & Auth ─────────────────────────────────────────────────── */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <ThemeToggle />

            <button
              className="p-2 rounded-full text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>

            <button
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
              {/* Example badge (if you want a red dot): */}
              {/* <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" /> */}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={logout}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  title="Log out"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="md" status="online" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 px-3 py-1.5 rounded-md transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* ─── Mobile Menu Button ──────────────────────────────────────────────────────── */}
          <div className="sm:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Drawer ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="pt-4 pb-2 space-y-1">
              <MobileLink
                to="/dashboard"
                current={location.pathname === '/dashboard'}
                onClick={closeMenu}
              >
                Dashboard
              </MobileLink>
              <MobileLink
                to="/documents"
                current={location.pathname === '/documents'}
                onClick={closeMenu}
              >
                Documents
              </MobileLink>
              <MobileLink
                to="/courses"
                current={location.pathname === '/courses'}
                onClick={closeMenu}
              >
                Courses
              </MobileLink>
              <MobileLink
                to="/calendar"
                current={location.pathname === '/calendar'}
                onClick={closeMenu}
              >
                Calendar
              </MobileLink>
            </div>

            <div className="pt-3 pb-4 border-t border-gray-200 dark:border-gray-800">
              {isAuthenticated ? (
                <div className="flex items-center px-4 space-x-3">
                  <div className="flex-shrink-0">
                    <Avatar src={user?.avatar} name={user?.name} size="md" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="ml-auto p-1 rounded-full text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                    aria-label="Log out"
                  >
                    <Bell className="h-6 w-6" /> {/* reuse bell or swap icon */}
                  </button>
                </div>
              ) : (
                <div className="flex justify-around px-4">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="py-2 px-4 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 transition"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface DesktopLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const DesktopLink: React.FC<DesktopLinkProps> = ({ to, current, children }) => (
  <Link
    to={to}
    className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition
      ${current
      ? 'text-slate-900 dark:text-white after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-500'
      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:after:absolute hover:after:-bottom-1 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-slate-300 dark:hover:after:bg-slate-700'
    }`}
  >
    {children}
  </Link>
);

interface MobileLinkProps {
  to: string;
  current: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileLink: React.FC<MobileLinkProps> = ({ to, current, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition
      ${current
        ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 text-cyan-700 dark:text-cyan-300'
        : 'border-transparent text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
    }`}
  >
    {children}
  </Link>
);
