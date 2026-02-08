
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ProductCard } from '../types';
import { getCloudinaryUrl } from '../App';

interface LightboxProps {
    items: ProductCard[];
    initialIndex: number;
    onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isHighResLoaded, setIsHighResLoaded] = useState(false);
    const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const activeItem = items[currentIndex];

    const preloadImage = (url: string) => {
        const img = new Image();
        img.src = url;
    };

    useEffect(() => {
        if (!items || items.length <= 1) return;
        const nextIdx = (currentIndex + 1) % items.length;
        const prevIdx = (currentIndex - 1 + items.length) % items.length;
        // Tải trước bản preview (1200px) cho ảnh lân cận để chuyển ảnh mượt mà
        if (items[nextIdx].imageUrl) preloadImage(getCloudinaryUrl(items[nextIdx].imageUrl, 'preview'));
        if (items[prevIdx].imageUrl) preloadImage(getCloudinaryUrl(items[prevIdx].imageUrl, 'preview'));
    }, [currentIndex, items]);

    useEffect(() => {
        setIsHighResLoaded(false);
        setIsPreviewLoaded(false);
        
        if (!activeItem?.youtubeId && activeItem?.videoUrl && videoRef.current) {
            const v = videoRef.current;
            v.load();
            v.play().catch(() => {
                v.muted = true;
                v.play();
            });
        }
    }, [currentIndex, activeItem]);

    const navigate = useCallback((direction: 'next' | 'prev') => {
        if (direction === 'next') setCurrentIndex((prev) => (prev + 1) % items.length);
        else setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, navigate]);

    if (!activeItem) return null;

    const isVideo = activeItem.resourceType === 'video' || !!activeItem.videoUrl || !!activeItem.youtubeId;

    const youtubeUrl = activeItem.youtubeId 
        ? `https://www.youtube-nocookie.com/embed/${activeItem.youtubeId}?autoplay=1&rel=0&enablejsapi=1&widgetid=1` 
        : '';

    return (
        <div 
            className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-500 overflow-hidden"
            onClick={onClose}
        >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-5">
                <img 
                    src={activeItem.youtubeId ? activeItem.imageUrl : getCloudinaryUrl(activeItem.imageUrl, 'thumb')} 
                    className="w-full h-full object-cover blur-[120px] scale-150"
                    alt=""
                />
            </div>

            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-black/5 hover:bg-black/10 rounded-full transition-all z-[220] group">
                <X className="w-5 h-5 md:w-6 md:h-6 text-black group-hover:scale-110" />
            </button>

            {items.length > 1 && (
                <>
                    <button onClick={(e) => { e.stopPropagation(); navigate('prev'); }} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 md:p-6 bg-white/60 backdrop-blur-2xl border border-black/5 hover:bg-black hover:text-white rounded-full transition-all z-[220] group shadow-xl">
                        <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate('next'); }} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 md:p-6 bg-white/60 backdrop-blur-2xl border border-black/5 hover:bg-black hover:text-white rounded-full transition-all z-[220] group shadow-xl">
                        <ChevronRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                    </button>
                </>
            )}

            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-[220] pointer-events-none max-w-xl">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-black text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                        {currentIndex + 1} / {items.length}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-black/30 uppercase">{activeItem.category}</span>
                </div>
                <h4 className="text-xl md:text-4xl font-black uppercase tracking-tighter text-black leading-none">{activeItem.title}</h4>
                <p className="text-[10px] md:text-[13px] font-medium text-black/40 uppercase tracking-widest mt-2">{activeItem.subtitle}</p>
            </div>

            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 lg:p-24 z-10" onClick={(e) => e.stopPropagation()}>
                {activeItem.youtubeId ? (
                    <div className="relative w-full max-w-[1280px] aspect-video shadow-[0_40px_120px_rgba(0,0,0,0.15)] bg-black">
                        <iframe 
                            src={youtubeUrl} 
                            title={activeItem.title}
                            className="w-full h-full"
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        {!isPreviewLoaded && !isVideo && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 pointer-events-none">
                                <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-blue-600 animate-spin opacity-30" />
                            </div>
                        )}
                        
                        {activeItem.videoUrl ? (
                            <video 
                                ref={videoRef} 
                                src={activeItem.videoUrl} 
                                controls 
                                autoPlay 
                                playsInline 
                                onLoadedData={() => setIsHighResLoaded(true)} 
                                className="max-w-full max-h-full shadow-[0_40px_120px_rgba(0,0,0,0.15)] bg-black" 
                            />
                        ) : (
                            <>
                                {/* Lớp 1: Bản Preview sắc nét (1200px) - Tải cực nhanh */}
                                <img 
                                    src={getCloudinaryUrl(activeItem.imageUrl, 'preview')} 
                                    onLoad={() => setIsPreviewLoaded(true)} 
                                    className={`absolute max-w-full max-h-full object-contain transition-opacity duration-300 transform-gpu ${isPreviewLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
                                    alt="" 
                                />
                                
                                {/* Lớp 2: Bản High-res (1920px) - Tải đè lên khi hoàn tất để cực kỳ chi tiết */}
                                <img 
                                    src={getCloudinaryUrl(activeItem.imageUrl, 'high')} 
                                    alt={activeItem.title} 
                                    onLoad={() => setIsHighResLoaded(true)} 
                                    className={`relative max-w-full max-h-full object-contain shadow-[0_40px_120px_rgba(0,0,0,0.15)] transition-opacity duration-700 transform-gpu ${isHighResLoaded ? 'opacity-100' : 'opacity-0'}`} 
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lightbox;
