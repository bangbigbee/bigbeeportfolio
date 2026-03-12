
import React, { useRef, useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';

const VideoCard = memo(({ video, onClick, light }: { video: ProductCard; onClick: () => void; light?: boolean }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const url = video.imageUrl ? getOptimizedUrl(video.imageUrl, 'thumb') : undefined;

    return (
        <article 
            className="relative aspect-video group cursor-pointer overflow-hidden rounded-[6px] shadow-sm flex-shrink-0 w-[calc((100%-8px)/2)] md:w-[calc((100%-24px)/3)] transform-gpu bg-[#111]" 
            onClick={onClick}
            style={{ isolation: 'isolate' }}
        >
            <div className={`absolute inset-0 z-0 ${light ? 'shimmer-premium-dark' : 'shimmer-premium'} transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
            
            {url && (
                <img 
                    src={url} 
                    onLoad={(e) => {
                        setIsLoaded(true);
                    }}
                    decoding="async"
                    className={`w-full h-full object-cover transition-all duration-[1200ms] ${isLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-105'}`} 
                    alt={video.title}
                    loading="lazy"
                />
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-3 md:p-4 z-10">
                <h4 className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-tighter mb-1 line-clamp-1">{video.title}</h4>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-500 z-20">
                <div className="w-8 h-6 md:w-12 md:h-8 rounded-lg bg-red-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all shadow-xl">
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5 md:border-t-[6px] md:border-l-[10px] md:border-b-[6px] md:ml-1" />
                </div>
            </div>
        </article>
    );
});

interface VideoCarouselProps {
    videos: ProductCard[];
    onVideoClick: (video: ProductCard) => void;
    title?: string;
    light?: boolean;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, onVideoClick, title, light = false }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeft(scrollLeft > 10);
            setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [videos]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const clientWidth = scrollRef.current.clientWidth;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!videos || videos.length === 0) return null;

    return (
        <div className="w-full px-5 md:px-10">
            {title && (
                <div className="reveal active reveal-up mb-4 md:mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`h-[1px] w-6 md:w-12 ${light ? 'bg-white/20' : 'bg-blue-200'}`} />
                        <h3 className={`text-[10px] md:text-xl font-black uppercase tracking-tighter italic ${light ? 'text-white' : 'text-black/60'}`}>
                            {title}
                        </h3>
                    </div>
                </div>
            )}
            
            <div className="relative group/carousel">
                {showLeft && (
                    <button 
                        onClick={() => scroll('left')} 
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-90"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
                    </button>
                )}
                
                <div 
                    ref={scrollRef} 
                    onScroll={checkScroll} 
                    className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-4 transform-gpu"
                >
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} onClick={() => onVideoClick(video)} light={light} />
                    ))}
                </div>

                {showRight && (
                    <button 
                        onClick={() => scroll('right')} 
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-90"
                    >
                        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoCarousel;
