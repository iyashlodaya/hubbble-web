import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  initials?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  alt = 'Avatar',
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // If we have an image src and no error, show image
  const showImage = src && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full shadow-sm ring-2 ring-white ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: showImage ? 'transparent' : 'var(--accent, var(--accent-color, #00A8E8))',
        color: showImage ? 'inherit' : '#ffffff',
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-opacity duration-300 ease-in-out"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-medium uppercase tracking-wider scale-110">
          {initials || '?'}
        </span>
      )}
    </div>
  );
};
