import React, { memo } from 'react';
import CrossfadeImage from './CrossfadeImage';

interface SmartImageProps {
    src?: string | string[];
    alt?: string;
    aspectRatio: string;
    className?: string;
    containerClassName?: string;
    objectFit?: 'cover' | 'contain';
    isDark?: boolean;
    overlay?: React.ReactNode;
    onClick?: () => void;
    isPriority?: boolean;
    interval?: number;
    onIndexChange?: (index: number) => void;
}

const SmartImage: React.FC<SmartImageProps> = ({ 
    src, 
    alt = "BigBee Visual Studio", 
    aspectRatio, 
    className = "", 
    containerClassName = "",
    objectFit = "cover",
    isDark = false,
    overlay,
    onClick,
    isPriority = false,
    interval,
    onIndexChange
}) => {
    const isAuto = aspectRatio === 'auto';
    const isFill = aspectRatio === 'fill';

    return (
        <div 
            onClick={onClick}
            className={`relative overflow-hidden group transform-gpu ${containerClassName} bg-transparent will-change-transform`}
            style={{ 
                aspectRatio: (isAuto || isFill) ? 'auto' : aspectRatio, 
                height: isFill ? '100%' : 'auto',
                width: '100%',
                isolation: 'isolate',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                perspective: '1000px',
                WebkitPerspective: '1000px'
            }}
        >
            <div className={`${(isAuto) ? 'relative w-full' : 'absolute inset-0 w-full h-full'} ${className} transition-transform duration-1000 ease-out transform-gpu`}>
                <CrossfadeImage 
                    src={src} 
                    alt={alt} 
                    objectFit={objectFit} 
                    isDark={isDark} 
                    isPriority={isPriority}
                    isAutoHeight={isAuto}
                    interval={interval}
                    onIndexChange={onIndexChange}
                />
            </div>

            {overlay && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {overlay}
                </div>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-[15] pointer-events-none" />
        </div>
    );
};

export default memo(SmartImage);