import React, { useState } from 'react';
import { User as UserIcon, Camera } from 'lucide-react';

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const AvatarPlaceholder: React.FC<AvatarProps> = ({
  name,
  avatar,
  size = 'md',
  className = '',
  showBorder = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Derive initials from name
  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  };

  const initials = getInitials(name);

  if (avatar && !imageError) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImageError(true)}
        className={`${sizeClasses[size]} rounded-2xl object-cover ${
          showBorder ? 'border border-neutral-200 shadow-2xs' : ''
        } ${className}`}
      />
    );
  }

  // Placeholder when photo is not added (optional)
  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-display tracking-wider select-none shrink-0 ${
        showBorder ? 'border-2 border-emerald-100 shadow-2xs' : ''
      } ${className}`}
      title={name || 'User Profile'}
    >
      <span>{initials}</span>
    </div>
  );
};
