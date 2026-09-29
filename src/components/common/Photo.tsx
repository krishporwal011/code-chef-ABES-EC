import React, { useState } from 'react';

interface PhotoProps {
  src?: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2';
  placeholderLabel?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const Photo: React.FC<PhotoProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  placeholderLabel = 'PHOTO: Event Archive, 16:9',
  className = '',
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!src);

  const aspectClassMap = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]',
  };

  const selectedAspect = aspectClassMap[aspectRatio] || 'aspect-[16/9]';

  // TODO real content: user can drop real images into /public/photos/ and reference their path
  if (!src || hasError) {
    return (
      <div
        className={`w-full ${selectedAspect} bg-[#FAF6EC] dark:bg-[#181715] border-2 border-dashed border-[#DDD2C1] dark:border-[#38342D] rounded-xl flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden relative group ${className}`}
        role="img"
        aria-label={alt || placeholderLabel}
      >
        {/* Subtle cross-grid watermark */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1B1A17_1px,transparent_1px)] dark:bg-[radial-gradient(#EDE6DA_1px,transparent_1px)] [background-size:12px_12px]" />

        <div className="relative z-10 flex flex-col items-center gap-1.5 text-stone-500 dark:text-stone-400">
          <div className="w-8 h-8 rounded-full bg-tomato/10 flex items-center justify-center text-tomato font-mono text-xs font-bold">
            📷
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-light dark:text-ink-dark">
            {placeholderLabel}
          </span>
          <span className="font-mono text-[10px] text-stone-400 dark:text-stone-500">
            // TODO real content: drop into /public/photos
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${selectedAspect} overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800 ${className}`}
    >
      {/* Blur-up placeholder skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-300 dark:bg-stone-700 animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-xs'
        }`}
      />
    </div>
  );
};
