
import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

const InteriorBentoSlot = memo(({ items, interval, className, onImageClick }: { items: ProductCard[], interval: number, className: string, onImageClick: any }) => {
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

    const currentImg = items[currentIdx];
    const prevImg = prevIdx !== null ? items[prevIdx] : null;

    if (!currentImg) return <div className={`${className} bg-gray-50 rounded-[6px] animate-pulse`} />;

    return (
        <div className={`relative overflow-hidden group cursor-pointer ${className} shadow-sm transform-gpu rounded-[6px] bg-[#f2f2f2]`} onClick={() => onImageClick(currentImg)} style={{ isolation: 'isolate' }}>
            {!isLoaded && <div className="absolute inset-0 shimmer-bg z-[1]" />}
            {prevImg?.imageUrl && <img src={getCloudinaryUrl(prevImg.imageUrl, 'grid')} className="absolute inset-0 w-full h-full object-cover z-0" alt="prev" />}
            <img 
                key={currentImg.id}
                src={getCloudinaryUrl(currentImg.imageUrl, 'grid')} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transform-gpu z-10 group-hover:scale-105 ${isTransitioning ? 'animate-crossfade' : (isLoaded ? 'opacity-100' : 'opacity-0')}`}
                alt={currentImg.title}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4 md:p-6">
                <p className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-tighter leading-tight">{currentImg.title}</p>
                <div className="w-8 h-[2px] bg-blue-500 mt-2" />
            </div>
        </div>
    );
});

const InteriorSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, customHospitality: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, customHospitality = [], videos = [] }) => {
    const pools = useMemo(() => {
        const slotsCount = 5;
        const p: ProductCard[][] = Array.from({ length: slotsCount }, () => []);
        if (!customHospitality.length) return p;
        customHospitality.forEach((item, idx) => { p[idx % slotsCount].push(item); });
        return p.map(pool => pool.length ? pool : customHospitality);
    }, [customHospitality]);

    return (
        <section id="interior" className="py-12 md:py-24 bg-[#faf9f6] text-black overflow-hidden relative">
            <ArchiveHeader number="04" title={t.nav_interior} slogan={t.slogan_interior} />
            <div className="w-full mb-12 md:mb-16 px-5 md:px-10 mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 auto-rows-[300px] md:auto-rows-[400px]">
                    <InteriorBentoSlot items={pools[0]} interval={5000} className="md:col-span-5 md:row-span-2" onImageClick={onImageClick} />
                    <InteriorBentoSlot items={pools[1]} interval={5500} className="md:col-span-7 md:row-span-1" onImageClick={onImageClick} />
                    <InteriorBentoSlot items={pools[2]} interval={5200} className="md:col-span-3 md:row-span-1" onImageClick={onImageClick} />
                    <InteriorBentoSlot items={pools[3]} interval={5800} className="md:col-span-4 md:row-span-1" onImageClick={onImageClick} />
                    <InteriorBentoSlot items={pools[4]} interval={5400} className="md:col-span-12 md:row-span-1" onImageClick={onImageClick} />
                </div>
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_interior} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_interior} onClick={onViewAll} /></div>
        </section>
    );
};

export default InteriorSection;
