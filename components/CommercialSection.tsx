import React, { useMemo, memo, useState, useEffect, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import SmartImage from './SmartImage';
import { ProductCard, Language } from '../types';
import { getOptimizedUrl } from '../App';

const CommercialImage = memo(({ photo, onClick }: { photo: ProductCard, onClick: () => void }) => {
    if (!photo) return <div className="relative w-[140px] md:w-[280px] aspect-square rounded-[4px] bg-gray-900" />;

    return (
        <div 
            onClick={onClick} 
            className="relative w-[140px] md:w-[280px] overflow-hidden group cursor-pointer shadow-none transform-gpu rounded-[4px] flex-shrink-0 will-change-transform aspect-square" 
            style={{ isolation: 'isolate' }}
        >
            <SmartImage 
                src={getOptimizedUrl(photo.imageUrl, 'thumb')}
                alt={photo.title}
                aspectRatio="1/1"
                containerClassName="w-full h-full"
                overlay={
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-3 md:p-4">
                        <p className="text-[8px] md:text-[11px] font-black text-white uppercase tracking-tighter leading-tight truncate">{photo.title}</p>
                        <div className="w-6 h-[1.5px] bg-blue-500 mt-1.5 md:mt-2" />
                    </div>
                }
            />
        </div>
    );
});

const CommercialSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        const observer = new IntersectionObserver(
            ([entry]) => { 
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: '400px' }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
            observer.disconnect();
        };
    }, []);

    const columns = useMemo(() => {
        const colCount = isMobile ? 4 : 7;
        const cols: ProductCard[][] = Array.from({ length: colCount }, () => []);
        if (!photos || photos.length === 0) return cols;

        for (let i = 0; i < colCount; i++) {
            const startIdx = (i * 2) % photos.length; 
            const pool = [];
            for (let j = 0; j < 8; j++) {
                const item = photos[(startIdx + j) % photos.length];
                if (item) pool.push(item);
            }
            cols[i] = [...pool, ...pool]; 
        }
        return cols;
    }, [photos, isMobile]);

    return (
        <section ref={sectionRef} id="commercial" className="py-12 md:py-24 bg-[#050505] text-white overflow-hidden relative">
            <ArchiveHeader 
                number="08" 
                title={t.nav_commercial} 
                slogan={t.slogan_commercial} 
                light={true} 
                bgText="DESIRE"
                bgTextColor="text-white/[0.04]"
            />
            
            <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[80vh] md:h-[130vh] bg-black overflow-hidden border-y border-white/5 mb-16 mt-10 md:mt-20">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex gap-2 md:gap-6 transform rotate-[-10deg] scale-125 md:scale-[1.3] origin-center will-change-transform pointer-events-auto">
                        {isVisible && columns.map((col, idx) => (
                            <div 
                                key={`comm-col-${idx}`} 
                                className="flex flex-col gap-2 md:gap-6 animate-comm-diag-stream hover:[animation-play-state:paused] will-change-transform" 
                                style={{ 
                                    animationDuration: `${isMobile ? 20 + idx * 4 : 60 + idx * 12}s`, 
                                    animationDelay: `${idx * -2.5}s` 
                                }}
                            >
                                {col.map((photo, pIdx) => (
                                    <CommercialImage 
                                        key={`comm-${idx}-${pIdx}-${photo?.id || pIdx}`} 
                                        photo={photo} 
                                        onClick={() => photo && onImageClick(photo)} 
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_commercial} light={true} />}
            <div className="flex flex-col items-center mt-10 px-5 md:px-10"><BigAlbumButton dark={true} label={t.cta_commercial} onClick={onViewAll} /></div>
        </section>
    );
};

export default CommercialSection;