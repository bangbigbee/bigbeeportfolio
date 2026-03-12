import React, { useMemo, memo, useState, useEffect, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import SmartImage from './SmartImage';
import { ProductCard, Language } from '../types';
import { getOptimizedUrl } from '../App';

const FoodImage = memo(({ photo, onClick, isPriority }: { photo: ProductCard; onClick: () => void; isPriority?: boolean }) => {
    if (!photo) return <div className="relative rounded-[6px] bg-gray-50 aspect-[3/4]" />;

    return (
        <div 
            onClick={onClick}
            className="group relative rounded-[6px] overflow-hidden cursor-pointer transform-gpu shadow-sm"
            style={{ 
                isolation: 'isolate',
                aspectRatio: '3/4'
            }}
        >
            <SmartImage 
                src={getOptimizedUrl(photo.imageUrl, 'thumb')}
                alt={photo.title}
                aspectRatio="3/4"
                isPriority={isPriority}
                containerClassName="w-full h-full"
                overlay={
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4">
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{photo.title}</p>
                    </div>
                }
            />
        </div>
    );
});

const FoodSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
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
            { rootMargin: '400px' } 
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const columns = useMemo(() => {
        const colCount = 5; 
        const cols: ProductCard[][] = Array.from({ length: colCount }, () => []);
        if (!photos || photos.length === 0) return cols;
        const filteredPhotos = photos.filter(Boolean);
        const enrichedPhotos = filteredPhotos.length < 15 ? [...filteredPhotos, ...filteredPhotos, ...filteredPhotos] : filteredPhotos;
        enrichedPhotos.forEach((p, idx) => { if (p) cols[idx % colCount].push(p); });
        return cols.map(col => {
            let res = [...col];
            while (res.length < 15 && enrichedPhotos.length > 0) { res = [...res, ...col]; }
            return res;
        });
    }, [photos]);

    return (
        <section ref={sectionRef} id="food-beverage" className="py-12 md:py-24 bg-white text-black overflow-hidden relative">
            <ArchiveHeader number="01" title={t.nav_food_beverage} slogan={t.slogan_food_beverage} bgText="GASTRONOMY" bgTextColor="text-blue-500/[0.04]" />
            <div className="w-full mb-8 md:mb-12 h-[750px] md:h-[1100px] relative overflow-hidden px-5 md:px-10 z-10 transform-gpu mt-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-2 h-full mask-fade-edges-v">
                    {columns.map((col, idx) => (
                        <div 
                            key={idx} 
                            className="flex flex-col gap-2 md:gap-2 animate-scroll-v will-change-transform" 
                            style={{ animationDuration: `${22 + idx * 6}s` }}
                        >
                            {[...col, ...col].map((p, i) => (
                                <FoodImage key={`${idx}-${i}`} photo={p} onClick={() => p && onImageClick(p)} isPriority={i < 4} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_food} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_food_beverage} onClick={onViewAll} /></div>
        </section>
    );
};

export default FoodSection;