import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const BentoSlot = memo(({ items, interval, className, onImageClick, aspectRatio, isDark = true }: { items: ProductCard[], interval: number, className: string, onImageClick: any, aspectRatio: string, isDark?: boolean }) => {
    const photo = items[0];

    return (
        <div className={className}>
            <SmartImage 
                src={photo ? getOptimizedUrl(photo.imageUrl, 'thumb') : undefined}
                alt={photo?.title || "BigBee"}
                aspectRatio={aspectRatio}
                isDark={isDark}
                onClick={() => photo && onImageClick(photo)}
                containerClassName="rounded-[12px] cursor-pointer shadow-sm group h-full w-full"
                className="h-full w-full"
                overlay={
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 flex flex-col justify-end p-6 z-20">
                        <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-[10px] font-black uppercase tracking-[0.2em] line-clamp-1">
                            {photo?.title}
                        </p>
                    </div>
                }
            />
        </div>
    );
});

const AnimatedBentoGrid: React.FC<{ items: ProductCard[], onImageClick: any, isDark?: boolean }> = ({ items, onImageClick, isDark = true }) => {
    const pools = useMemo(() => {
        const slots = 5;
        const p = Array.from({ length: slots }, () => [] as ProductCard[]);
        if (!items || items.length === 0) return p;
        items.forEach((item, idx) => {
            if (item) p[idx % slots].push(item);
        });
        return p.map(pool => pool.length ? pool : items);
    }, [items]);

    return (
        <div className="w-full grid grid-cols-3 gap-3 md:gap-5 items-stretch">
            <BentoSlot items={pools[0]} interval={4500} className="col-span-1 h-full" aspectRatio="fill" onImageClick={onImageClick} isDark={isDark} />
            <div className="col-span-1 flex flex-col gap-3 md:gap-5">
                <BentoSlot items={pools[1]} interval={5200} className="w-full" aspectRatio="3/2" onImageClick={onImageClick} isDark={isDark} />
                <BentoSlot items={pools[2]} interval={4800} className="w-full" aspectRatio="3/2" onImageClick={onImageClick} isDark={isDark} />
            </div>
            <BentoSlot items={pools[3]} interval={5800} className="col-span-1 h-full" aspectRatio="fill" onImageClick={onImageClick} isDark={isDark} />
        </div>
    );
};

export default AnimatedBentoGrid;
