
import React, { useMemo, memo, useState, useRef, useEffect } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const EventImage = memo(({ img, onClick }: { img: ProductCard, onClick: () => void }) => {
    return (
        <div 
            className="h-[120px] md:h-[220px] w-[180px] md:w-[330px] flex-shrink-0 relative cursor-pointer overflow-hidden bg-[#1a1a1c] rounded-[4px] group" 
            onClick={onClick} 
        >
            <SmartImage 
                src={getOptimizedUrl(img.imageUrl, 'thumb')}
                alt={img.title}
                aspectRatio="fill"
                containerClassName="h-full w-full"
                objectFit="cover"
                isDark={true}
                overlay={
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-3">
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-tight">{img.title}</p>
                    </div>
                }
            />
        </div>
    );
});

const EventSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, customEventPhotos?: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, customEventPhotos = [], videos = [] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { 
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.01, rootMargin: '1000px' }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        
        // Failsafe: force visible after 1.5s
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, []);

    const rows = useMemo(() => {
        if (!customEventPhotos || customEventPhotos.length === 0) return [];
        const filtered = customEventPhotos.filter(p => p && p.imageUrl);
        if (filtered.length === 0) return [];

        const r: ProductCard[][] = [[], [], [], []];
        filtered.forEach((p, i) => { 
            r[i % 4].push(p); 
        });
        
        return r.map((row) => {
            let finalRow = row.length > 0 ? row : filtered;
            let extended = [...finalRow];
            while (extended.length < 12) extended = [...extended, ...finalRow];
            return [...extended, ...extended];
        });
    }, [customEventPhotos]);

    const hasData = rows.length > 0 && rows.some(r => r.length > 0);

    return (
        <section ref={sectionRef} id="event" className="py-12 md:py-20 bg-[#0a0a0a] text-white overflow-hidden relative min-h-[400px]">
            <ArchiveHeader number="06" title={t.nav_event} slogan={t.slogan_event} light={true} bgText="ENERGY" bgTextColor="text-white/[0.04]" />
            
            <div className={`relative flex flex-col gap-3 md:gap-4 mb-8 md:mb-12 select-none w-full px-5 md:px-10 z-10 mt-6 md:mt-10 min-h-[250px] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {hasData ? (
                    rows.map((row, idx) => (
                        <div key={idx} className="flex overflow-hidden w-full">
                            <div 
                                className={`flex w-max gap-3 md:gap-4 ${idx % 2 === 0 ? 'animate-marquee-rtl' : 'animate-marquee-ltr'} hover:[animation-play-state:paused]`} 
                                style={{ animationDuration: `${35 + idx * 8}s` }}
                            >
                                {row.map((img, i) => (
                                    <EventImage key={`${idx}-${i}-${img.id}`} img={img} onClick={() => onImageClick(img)} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full h-[300px] flex items-center justify-center opacity-20">
                         <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
            
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_event} light={true} />}
            <div className="flex flex-col items-center mt-8"><BigAlbumButton label={t.cta_event} onClick={onViewAll} dark={true} /></div>
        </section>
    );
};

export default EventSection;
