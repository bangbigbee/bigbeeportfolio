import React, { useState, useEffect, memo, useRef, useMemo } from 'react';

interface CrossfadeImageProps {
    src?: string | string[];
    alt?: string;
    objectFit?: 'cover' | 'contain';
    isDark?: boolean;
    className?: string;
    isPriority?: boolean;
    isAutoHeight?: boolean; 
    interval?: number; // Optional interval for slideshow
    onIndexChange?: (index: number) => void;
}

// Global cache to track loaded images across the entire session
const SESSION_LOADED_IMAGES = new Set<string>();

export const CrossfadeImage: React.FC<CrossfadeImageProps> = ({ 
    src, 
    alt = "", 
    objectFit = "cover", 
    isAutoHeight = false,
    isPriority = false,
    interval = 5000,
    onIndexChange
}) => {
    const sourcesStr = Array.isArray(src) ? src.join(',') : src || '';
    const sources = useMemo(() => {
        return Array.isArray(src) ? src : (src ? [src] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourcesStr]);

    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Ping-pong buffers to keep images in the DOM and avoid unmounting flashes
    const [imageA, setImageA] = useState<{ src: string | undefined, active: boolean, zIndex: number }>({ src: sources[0] || undefined, active: true, zIndex: 2 });
    const [imageB, setImageB] = useState<{ src: string | undefined, active: boolean, zIndex: number }>({ src: undefined, active: false, zIndex: 1 });

    const onIndexChangeRef = useRef(onIndexChange);
    useEffect(() => {
        onIndexChangeRef.current = onIndexChange;
    }, [onIndexChange]);

    // Reset index if sources array changes completely
    const prevSourcesRef = useRef(sources.join(','));
    useEffect(() => {
        const currentSourcesStr = sources.join(',');
        if (prevSourcesRef.current !== currentSourcesStr) {
            prevSourcesRef.current = currentSourcesStr;
            setCurrentIndex(0);
        }
    }, [sources]);

    // Handle image swapping with preloading
    useEffect(() => {
        const targetSrc = sources[currentIndex];
        if (!targetSrc) return;

        // If target is already active, do nothing
        if ((imageA.active && imageA.src === targetSrc) || (imageB.active && imageB.src === targetSrc)) {
            return;
        }

        let isCancelled = false;

        const applySwap = () => {
            if (isCancelled) return;
            if (imageA.active) {
                setImageB({ src: targetSrc, active: true, zIndex: 2 });
                setImageA(prev => ({ ...prev, active: false, zIndex: 1 }));
            } else {
                setImageA({ src: targetSrc, active: true, zIndex: 2 });
                setImageB(prev => ({ ...prev, active: false, zIndex: 1 }));
            }
        };

        if (SESSION_LOADED_IMAGES.has(targetSrc)) {
            applySwap();
        } else {
            const img = new Image();
            img.src = targetSrc;
            img.onload = () => {
                SESSION_LOADED_IMAGES.add(targetSrc);
                applySwap();
            };
            img.onerror = () => {
                applySwap(); // Swap anyway to not get stuck
            };
        }

        return () => {
            isCancelled = true;
        };
    }, [currentIndex, sources, imageA.active, imageB.active, imageA.src, imageB.src]);

    // Slideshow logic with Random selection
    useEffect(() => {
        if (sources.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex(prev => {
                let nextIdx;
                do {
                    nextIdx = Math.floor(Math.random() * sources.length);
                } while (nextIdx === prev);
                return nextIdx;
            });
        }, interval);
        
        return () => clearInterval(timer);
    }, [sources.length, interval]);

    useEffect(() => {
        if (onIndexChangeRef.current) {
            onIndexChangeRef.current(currentIndex);
        }
    }, [currentIndex]);

    const imgClass = isAutoHeight 
        ? 'w-full h-auto block' 
        : 'absolute inset-0 w-full h-full';

    return (
        <div className={`${isAutoHeight ? 'relative w-full' : 'absolute inset-0 w-full h-full'} overflow-hidden transform-gpu bg-transparent`}>
            {/* Image A */}
            {imageA.src && (
                <img 
                    src={imageA.src} 
                    alt={alt}
                    className={`${imgClass} object-${objectFit} transition-opacity duration-1000 ease-in-out transform-gpu will-change-opacity`}
                    style={{ 
                        opacity: imageA.active ? 1 : 0,
                        zIndex: imageA.zIndex,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                    decoding="async"
                />
            )}

            {/* Image B */}
            {imageB.src && (
                <img 
                    src={imageB.src} 
                    alt={alt}
                    className={`${imgClass} object-${objectFit} transition-opacity duration-1000 ease-in-out transform-gpu will-change-opacity`}
                    style={{ 
                        opacity: imageB.active ? 1 : 0,
                        zIndex: imageB.zIndex,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                    decoding="async"
                />
            )}
        </div>
    );
};

export default memo(CrossfadeImage);
