
import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { ProductCard } from '../types';
import { getCloudinaryUrl } from '../App';

const BentoSlot = memo(({ items, interval, className, onImageClick }: { items: ProductCard[], interval: number, className: string, onImageClick: any }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const itemsRef = useRef(items);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

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

    const photo = items[currentIdx];
    const prevPhoto = prevIdx !== null ? items[prevIdx] : null;

    if (!photo) return <div className={`${className} bg-gray-50 rounded-[6px] animate-pulse`} />;

    return (
        <div 
            className={`relative overflow-hidden group cursor-pointer ${className} shadow-sm rounded-[6px] bg-[#f2f2f2] transform-gpu`} 
            style={{ isolation: 'isolate' }} 
            onClick={() => onImageClick(photo)}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer-bg z-[1]" />}
            
            {prevPhoto?.imageUrl && (
                <img 
                    src={getCloudinaryUrl(prevPhoto.imageUrl, 'grid')} 
                    className="absolute inset-0 w-full h-full object-cover z-0" 
                    alt="background" 
                />
            )}
            
            <img 
                key={photo.id}
                src={getCloudinaryUrl(photo.imageUrl, 'grid')} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-[2500ms] group-hover:scale-105 ${isTransitioning ? 'animate-crossfade' : (isLoaded ? 'opacity-100' : 'opacity-0')}`}
                alt={photo.title || 'Sports Visual'}
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-end p-4">
                <p className="text-white text-[10px] md:text-[11px] font-black uppercase tracking-tighter">{photo.title}</p>
            </div>
            
            <style>{`
                @keyframes crossfade {
                    0% { opacity: 0; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-crossfade {
                    animation: crossfade 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
});

const AnimatedBentoGrid: React.FC<{ items: ProductCard[], onImageClick: any, isNear: boolean }> = ({ items, onImageClick }) => {
    const pools = useMemo(() => {
        const slots = 6;
        const p = Array.from({ length: slots }, () => [] as ProductCard[]);
        if (!items || items.length === 0) return p;
        items.forEach((item, idx) => p[idx % slots].push(item));
        return p.map(pool => pool.length ? pool : items);
    }, [items]);

    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 h-[600px] md:h-[800px]">
            <BentoSlot items={pools[0]} interval={4500} className="col-span-1 row-span-1" onImageClick={onImageClick} />
            <BentoSlot items={pools[1]} interval={5200} className="col-span-1 row-span-1" onImageClick={onImageClick} />
            <BentoSlot items={pools[2]} interval={5800} className="col-span-2 row-span-1" onImageClick={onImageClick} />
            <BentoSlot items={pools[3]} interval={4800} className="col-span-2 row-span-1" onImageClick={onImageClick} />
            <BentoSlot items={pools[4]} interval={5500} className="col-span-1 row-span-1" onImageClick={onImageClick} />
            <BentoSlot items={pools[5]} interval={4700} className="col-span-1 row-span-1" onImageClick={onImageClick} />
        </div>
    );
};

export default AnimatedBentoGrid;
