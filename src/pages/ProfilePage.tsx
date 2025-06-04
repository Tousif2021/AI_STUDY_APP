import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Clock, 
  Upload,
  LogOut,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'subscription' | 'notifications' | 'security'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    aiMessages: true,
    twoFactorEnabled: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload
      console.log('Uploading file:', file);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Handle account deletion
        await logout();
      } catch (error) {
        setErrorMessage('Failed to delete account');
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <AnimatePresence>
          {(successMessage || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg mb-6 flex items-center ${
                successMessage 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}
            >
              {successMessage ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{successMessage || errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-4 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={user?.avatar || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg cursor-pointer">
                      <Upload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </CardContent>
            </Card>

            <nav className="space-y-2">
              <NavButton
                icon={<User />}
                label="Personal Information"
                active={activeTab === 'personal'}
                onClick={() => setActiveTab('personal')}
              />
              <NavButton
                icon={<CreditCard />}
                label="Subscription"
                active={activeTab === 'subscription'}
                onClick={() => setActiveTab('subscription')}
              />
              <NavButton
                icon={<Bell />}
                label="Notifications"
                active={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
              />
              <NavButton
                icon={<Shield />}
                label="Security"
                active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
              />
            </nav>

            <div className="space-y-2">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<LogOut className="h-4 w-4" />}
                onClick={logout}
              >
                Sign Out
              </Button>
              <Button
                variant="danger"
                fullWidth
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            {activeTab === 'personal' && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <div className="flex justify-end">
                    {isEditing ? (
                      <div className="space-x-2">
                        <Button variant="outline\" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'subscription' && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                        Current Plan: Free
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 mt-1">
                        Upgrade to Pro for advanced features
                      </p>
                    </div>
                    <Button fullWidth>
                      Upgrade to Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <NotificationToggle
                      label="Email Notifications"
                      description="Receive updates and reminders via email"
                      checked={formData.emailNotifications}
                      onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: 'emailNotifications' } })}
                    />
                    <NotificationToggle
                      label="Push Notifications"
                      description="Get instant notifications in your browser"
                      checked={formData.pushNotifications}
                      onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: 'pushNotifications' } })}
                    />
                    <NotificationToggle
                      label="Study Reminders"
                      description="Daily reminders to maintain your study schedule"
                      checked={formData.studyReminders}
                      onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: 'studyReminders' } })}
                    />
                    <NotificationToggle
                      label="AI Tutor Messages"
                      description="Receive messages from your AI study assistant"
                      checked={formData.aiMessages}
                      onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: 'aiMessages' } })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <Input
                        type="password"
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                      <Input
                        type="password"
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                      />
                      <Input
                        type="password"
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <Button>
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">
                          Add an extra layer of security to your account
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formData.twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                        </p>
                      </div>
                      <Button
                        variant={formData.twoFactorEnabled ? 'outline' : 'primary'}
                        onClick={() => setFormData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                      >
                        {formData.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};