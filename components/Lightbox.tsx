import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import { ImageCache } from '../utils/imageCache';
import { preloadImages } from '../utils/preloader';

interface LightboxProps {
    items: ProductCard[];
    initialIndex: number;
    onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const activeItem = items[currentIndex];

    const fullUrl = useMemo(() => {
        if (!activeItem?.imageUrl) return undefined;
        return getOptimizedUrl(activeItem.imageUrl, 'full');
    }, [activeItem]);

    const [isLoaded, setIsLoaded] = useState(() => fullUrl ? ImageCache.isLoaded(fullUrl) : false);
    const [hasError, setHasError] = useState(false);
    const touchStartX = useRef(0);

    useEffect(() => {
        const cached = fullUrl ? ImageCache.isLoaded(fullUrl) : false;
        setIsLoaded(cached);
        setHasError(false);
        
        if (activeItem?.youtubeId || activeItem?.videoUrl) {
            setIsLoaded(true);
        }
    }, [currentIndex, activeItem, fullUrl]);

    const navigate = useCallback((dir: 'next' | 'prev') => {
        if (dir === 'next') setCurrentIndex((prev) => (prev + 1) % items.length);
        else setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        // Preload all images in the album when lightbox opens
        const allUrls = items
            .map(item => getOptimizedUrl(item.imageUrl, 'full'))
            .filter((url): url is string => !!url);
        
        if (allUrls.length > 0) {
            preloadImages(allUrls, 3, 'low');
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, navigate, items]);

    if (!activeItem) return null;

    return (
        <div 
            className="fixed inset-0 z-[10000] bg-black flex flex-col select-none overflow-hidden animate-in fade-in duration-300"
            onClick={onClose}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) navigate('next');
                    else navigate('prev');
                }
            }}
        >
            {/* Header: Số thứ tự và nút đóng */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 md:p-8 z-[10020] pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 pointer-events-auto shadow-lg">
                    <span className="text-[11px] md:text-xs font-black text-white tracking-widest">
                        {currentIndex + 1} / {items.length}
                    </span>
                </div>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }} 
                    className="p-3 md:p-4 bg-white text-black rounded-full transition-all group shadow-2xl active:scale-90 pointer-events-auto border-none"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            {/* Vùng hiển thị nội dung */}
            <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
                
                {/* Nút điều hướng */}
                {items.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); navigate('prev'); }} 
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 md:p-5 bg-black/40 hover:bg-white text-white hover:text-black rounded-full transition-all z-[10020] active:scale-90 backdrop-blur-md border border-white/10 shadow-2xl"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
                        </button>

                        <button 
                            onClick={(e) => { e.stopPropagation(); navigate('next'); }} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 md:p-5 bg-black/40 hover:bg-white text-white hover:text-black rounded-full transition-all z-[10020] active:scale-90 backdrop-blur-md border border-white/10 shadow-2xl"
                        >
                            <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
                        </button>
                    </>
                )}

                <div className="w-full h-full relative flex items-center justify-center pointer-events-none">
                    {/* Loading/Error States */}
                    {!isLoaded && !hasError && (
                        <div className="absolute inset-0 flex items-center justify-center z-[10005]">
                            <Loader2 className="w-10 h-10 text-white/30 animate-spin" />
                        </div>
                    )}

                    {hasError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-[10005] text-white/20">
                            <AlertCircle className="w-10 h-10 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Resource Unavailable</p>
                        </div>
                    )}

                    {activeItem.youtubeId ? (
                        <div className="relative w-full max-w-[1280px] aspect-video shadow-2xl bg-black rounded-lg overflow-hidden pointer-events-auto">
                            <iframe 
                                src={activeItem.youtubeId ? `https://www.youtube-nocookie.com/embed/${activeItem.youtubeId}?autoplay=1&rel=0` : undefined}
                                title={activeItem.title}
                                className="w-full h-full"
                                frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen
                            ></iframe>
                        </div>
                    ) : activeItem.videoUrl ? (
                        <div className="relative w-full max-w-[1280px] aspect-video shadow-2xl bg-black rounded-lg overflow-hidden pointer-events-auto flex items-center justify-center">
                            <video 
                                src={activeItem.videoUrl || undefined} 
                                controls 
                                autoPlay 
                                className="max-w-full max-h-full"
                            />
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center pointer-events-auto p-4 md:p-0">
                            {fullUrl && (
                                <img 
                                    key={fullUrl}
                                    src={fullUrl} 
                                    alt={activeItem.title} 
                                    className={`max-w-full max-h-full w-auto h-auto object-contain transition-all duration-700 shadow-2xl ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`} 
                                    loading="eager"
                                    decoding="async"
                                    onLoad={() => {
                                        setIsLoaded(true);
                                        if (fullUrl) ImageCache.markLoaded(fullUrl);
                                    }}
                                    onError={() => setHasError(true)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-6 w-full text-center pointer-events-none opacity-20 hidden md:block">
                <span className="text-[8px] font-bold text-white uppercase tracking-[0.5em]">BIGBEE STUDIO • VISUAL ARCHIVE</span>
            </div>
        </div>
    );
};

export default Lightbox;