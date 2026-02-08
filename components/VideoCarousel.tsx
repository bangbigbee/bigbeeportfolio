
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../types';
import { getCloudinaryUrl } from '../App';

const VideoCard: React.FC<{ video: ProductCard; onClick: () => void; desc?: string; light?: boolean }> = ({ video, onClick, desc, light }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    // Sử dụng preset 'thumb' (600px) cho carousel items để scroll mượt nhất
    const thumbUrl = useMemo(() => video.youtubeId ? video.imageUrl : getCloudinaryUrl(video.imageUrl, 'thumb'), [video.imageUrl, video.youtubeId]);

    return (
        <article 
            className="relative aspect-video group cursor-pointer overflow-hidden rounded-[6px] shadow-sm flex-shrink-0 w-[calc((100%-8px)/2)] md:w-[calc((100%-24px)/3)] transform-gpu bg-[#111]" 
            onClick={onClick}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer-bg-dark z-0" />}

            <img 
                src={thumbUrl} 
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-[1200ms] image-load-fade ${isLoaded ? 'loaded opacity-90' : 'opacity-0'} ${video.youtubeId ? '' : 'group-hover:opacity-0'}`} 
                alt={`${video.title} - BigBee Production`}
                loading="lazy"
            />
            
            {!video.youtubeId && video.videoUrl && (
                <video 
                    src={video.videoUrl} 
                    muted loop playsInline 
                    onMouseEnter={(e) => e.currentTarget.play()} 
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} 
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
                    aria-hidden="true"
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
};

interface VideoCarouselProps {
    videos: ProductCard[];
    onVideoClick: (video: ProductCard) => void;
    description?: string;
    title?: string;
    light?: boolean;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, onVideoClick, description, title, light = false }) => {
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
                        aria-label="Previous"
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-90"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
                    </button>
                )}
                
                <div 
                    ref={scrollRef} 
                    onScroll={checkScroll} 
                    className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
                >
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} onClick={() => onVideoClick(video)} desc={description} light={light} />
                    ))}
                </div>

                {showRight && (
                    <button 
                        onClick={() => scroll('right')} 
                        aria-label="Next"
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
