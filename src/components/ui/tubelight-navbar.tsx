import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { DivideIcon as LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "./Avatar";
import { useAuthStore } from "../../store/useAuthStore";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const currentItem = items.find(item => item.url === location.pathname);
    if (currentItem) {
      setActiveTab(currentItem.name);
    }
  }, [location.pathname, items]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
                <span className="text-xl font-bold">VisualStudy</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;

                  return (
                    <Link
                      key={item.name}
                      to={item.url}
                      onClick={() => setActiveTab(item.name)}
                      className={twMerge(
                        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                        isActive && "text-gray-900 dark:text-white"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={user?.avatar}
                    name={user?.name}
                    size="sm"
                    status="online"
                  />
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Add padding for mobile bottom navigation */}
      {isMobile && <div className="h-16" />}

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-4">
          <div className="flex justify-around">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={twMerge(
                    "flex flex-col items-center gap-1 px-3 py-2",
                    "text-gray-600 dark:text-gray-400",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-indicator"
                      className="absolute top-0 h-0.5 w-12 bg-blue-600 dark:bg-blue-400"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}