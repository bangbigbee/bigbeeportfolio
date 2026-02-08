
import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

const RealEstateImage = memo(({ photo, onClick }: { photo: ProductCard; onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const thumbUrl = useMemo(() => getCloudinaryUrl(photo.imageUrl, 'grid'), [photo.imageUrl]);

    return (
        <div className="flex-shrink-0 relative overflow-hidden group cursor-pointer aspect-[3/4] shadow-sm rounded-[6px] transform-gpu bg-[#f2f2f2]" style={{ width: '100%', isolation: 'isolate' }} onClick={onClick}>
            {!isLoaded && <div className="absolute inset-0 shimmer-bg z-[1]" />}
            <img 
                src={thumbUrl} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-out z-10 group-hover:scale-105 image-load-fade ${isLoaded ? 'loaded' : ''}`} 
                alt={photo.title}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4">
                <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-tight">{photo.title}</p>
                <div className="w-6 h-[2px] bg-blue-500 mt-2" />
            </div>
        </div>
    );
});

const RealEstateSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, videos: ProductCard[], photos: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, videos = [], photos = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(6.5);
    const sectionRef = useRef<HTMLElement>(null);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsToShow(1.8);
            else if (window.innerWidth < 1024) setItemsToShow(4.5);
            else setItemsToShow(6.5);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = useMemo(() => Math.max(0, photos.length - Math.floor(itemsToShow)), [photos.length, itemsToShow]);
    
    useEffect(() => {
        if (photos.length <= itemsToShow || isHovered) return;
        const timer = setInterval(() => { 
            setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1); 
        }, 5500);
        return () => clearInterval(timer);
    }, [photos.length, itemsToShow, maxIndex, isHovered]);

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
            <ArchiveHeader number="07" title={t.nav_real_estate} slogan={t.slogan_real_estate} />
            
            <div className="w-full mb-12 md:mb-16 relative group/slider px-5 md:px-10 z-10 mt-8" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                
                {/* Nút điều hướng - Luôn hiển thị trên mobile, hover trên desktop */}
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

                <div className="overflow-hidden">
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
