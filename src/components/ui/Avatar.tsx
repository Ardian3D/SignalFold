import React, { useState } from 'react';

export interface AvatarProps {
  name: string; // Accessible name
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (n[0] || 'U').toUpperCase();
  };

  return (
    <div
      role="img"
      aria-label={name}
      className={`inline-flex items-center justify-center shrink-0 rounded-full font-mono font-bold bg-[#0A0A0A] text-[#D6FF3F] dark:bg-[#F3F1EA] dark:text-[#0A0A0A] border border-[#242522] overflow-hidden select-none ${sizeMap[size]} ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
