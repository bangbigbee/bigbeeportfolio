
import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

const LifestyleBentoSlot = memo(({ items, interval, className, onImageClick }: { items: ProductCard[], interval: number, className: string, onImageClick: any }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const itemsRef = useRef(items);

    useEffect(() => { itemsRef.current = items; }, [items]);

    useEffect(() => {
        if (!items || items.length <= 1) return;
        const timer = setInterval(() => {
            const nextIdx = (currentIdx + 1) % itemsRef.current.length;
            const nextItem = itemsRef.current[nextIdx];
            if (!nextItem?.imageUrl) return;

            const img = new Image();
            img.src = getCloudinaryUrl(nextItem.imageUrl, 'grid');
            img.onload = () => {
                setPrevIdx(currentIdx);
                setCurrentIdx(nextIdx);
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 1600);
            };
        }, interval);
        return () => clearInterval(timer);
    }, [currentIdx, interval, items.length]);

    const currentPhoto = items[currentIdx];
    const previousPhoto = prevIdx !== null ? items[prevIdx] : null;
    if (!currentPhoto) return null;

    return (
        <div className={`relative overflow-hidden group cursor-pointer rounded-[6px] shadow-sm ${className} transform-gpu bg-[#f2f2f2]`} onClick={() => onImageClick(currentPhoto)} style={{ isolation: 'isolate' }}>
            {!isLoaded && <div className="absolute inset-0 shimmer-bg z-[1]" />}
            {previousPhoto && <img src={getCloudinaryUrl(previousPhoto.imageUrl, 'grid')} className="absolute inset-0 w-full h-full object-cover z-0" alt="prev" />}
            <img 
                key={currentPhoto.id}
                src={getCloudinaryUrl(currentPhoto.imageUrl, 'grid')} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transform-gpu z-10 group-hover:scale-105 ${isTransitioning ? 'animate-crossfade' : (isLoaded ? 'opacity-100' : 'opacity-0')}`}
                alt={currentPhoto.title} 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4 md:p-6">
                <p className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-tighter leading-tight">{currentPhoto.title}</p>
                <div className="w-8 h-[2px] bg-blue-500 mt-2" />
            </div>
        </div>
    );
});

const LifestyleSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    const pools = useMemo(() => {
        const slotsCount = 7;
        const p: ProductCard[][] = Array.from({ length: slotsCount }, () => []);
        if (!photos.length) return p;
        photos.forEach((item, idx) => { p[idx % slotsCount].push(item); });
        return p.map(pool => pool.length ? pool : photos);
    }, [photos]);

    return (
        <section id="lifestyle" className="py-12 md:py-24 bg-white overflow-hidden relative border-t border-gray-100">
            <ArchiveHeader number="09" title={t.nav_lifestyle} slogan={t.slogan_lifestyle} />
            <div className="w-full mb-12 md:mb-16 px-5 md:px-10 mt-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[150px] md:auto-rows-[400px]">
                    <LifestyleBentoSlot items={pools[0]} interval={5000} className="col-span-2 row-span-2" onImageClick={onImageClick} />
                    <LifestyleBentoSlot items={pools[1]} interval={5500} className="col-span-1 row-span-1" onImageClick={onImageClick} />
                    <LifestyleBentoSlot items={pools[2]} interval={5200} className="col-span-1 row-span-1" onImageClick={onImageClick} />
                    <LifestyleBentoSlot items={pools[3]} interval={4800} className="col-span-1 md:col-span-1 row-span-1 md:row-span-2" onImageClick={onImageClick} />
                    <LifestyleBentoSlot items={pools[4]} interval={5300} className="col-span-1 row-span-1" onImageClick={onImageClick} />
                    <LifestyleBentoSlot items={pools[5]} interval={6000} className="col-span-2 row-span-1 md:row-span-1" onImageClick={onImageClick} />
                    <LifestyleBentoSlot items={pools[6]} interval={5600} className="col-span-2 md:col-span-1 row-span-1" onImageClick={onImageClick} />
                </div>
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_lifestyle} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_lifestyle} onClick={onViewAll} /></div>
        </section>
    );
};

export default LifestyleSection;
