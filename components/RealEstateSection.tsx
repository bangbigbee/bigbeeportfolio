import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import SmartImage from './SmartImage';
import { ProductCard, Language } from '../types';
import { getOptimizedUrl } from '../App';

const RealEstateImage = memo(({ photo, onClick }: { photo: ProductCard; onClick: () => void }) => {
    return (
        <div 
            className="flex-shrink-0 relative overflow-hidden group cursor-pointer shadow-sm rounded-[6px] transform-gpu" 
            style={{ 
                width: '100%', 
                isolation: 'isolate',
                aspectRatio: '3/4'
            }} 
            onClick={onClick}
        >
            <SmartImage 
                src={getOptimizedUrl(photo.imageUrl, 'thumb')}
                alt={photo.title}
                aspectRatio="3/4"
                containerClassName="w-full h-full"
                overlay={
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4">
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-tight truncate">{photo.title}</p>
                        <div className="w-6 h-[2px] bg-blue-500 mt-2" />
                    </div>
                }
            />
        </div>
    );
});

const RealEstateSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, videos: ProductCard[], photos: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, videos = [], photos = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(6.5);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsToShow(1.8);
            else if (window.innerWidth < 1024) setItemsToShow(3.5);
            else setItemsToShow(5.5);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { rootMargin: '600px' }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const maxIndex = useMemo(() => Math.max(0, photos.length - Math.floor(itemsToShow)), [photos.length, itemsToShow]);
    
    useEffect(() => {
        // Auto-scrolling disabled to prevent continuous image loading
    }, [photos.length, itemsToShow, maxIndex, isHovered, isVisible]);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => Math.max(0, prev - 1));
        setIsHovered(true);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
        setIsHovered(true);
    };

    return (
        <section ref={sectionRef} id="realestate" className="py-12 md:py-24 bg-[#f9fbff] overflow-hidden relative border-y border-gray-100">
            <ArchiveHeader 
                number="07" 
                title={t.nav_real_estate} 
                slogan={t.slogan_real_estate} 
                bgText="ESTATE"
                bgTextColor="text-blue-500/[0.04]"
            />
            
            <div className="w-full mb-8 md:mb-12 relative group/slider z-10 mt-8" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                
                {currentIndex > 0 && (
                    <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 transition-all duration-300">
                        <button 
                            onClick={handlePrev}
                            className="w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-all transform active:scale-90"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-black hover:text-inherit" strokeWidth={2.5} />
                        </button>
                    </div>
                )}

                {currentIndex < maxIndex && (
                    <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 transition-all duration-300">
                        <button 
                            onClick={handleNext}
                            className="w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-all transform active:scale-90"
                        >
                            <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-black hover:text-inherit" strokeWidth={2.5} />
                        </button>
                    </div>
                )}

                <div className="overflow-hidden px-5 md:px-10">
                    <div className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`, gap: '10px' }}>
                        {photos.map((photo) => (
                            <div key={photo.id} style={{ width: `calc((100% - ${(Math.ceil(itemsToShow)) * 10}px) / ${itemsToShow})` }} className="flex-shrink-0">
                                <RealEstateImage photo={photo} onClick={() => onImageClick(photo)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_real_estate} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_real_estate} onClick={onViewAll} /></div>
        </section>
    );
};

export default RealEstateSection;