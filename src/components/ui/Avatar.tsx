import React from 'react';
import { twMerge } from 'tailwind-merge';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className,
  status,
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  // Generate initials from name
  const getInitials = () => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative inline-flex">
      <div
        className={twMerge(
          'rounded-full flex items-center justify-center overflow-hidden',
          sizeClasses[size],
          !src && 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium',
          className
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{getInitials()}</span>
        )}
      </div>
      
      {status && (
        <span 
          className={twMerge(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800',
            statusClasses[status],
            size === 'xs' ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5'
          )}
        />
      )}
    </div>
  );
};