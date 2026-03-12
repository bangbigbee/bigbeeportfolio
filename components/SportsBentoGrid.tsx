import React, { useState, useMemo, memo } from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const BentoSlot = memo(({ items, interval, className, onImageClick }: { items: ProductCard[], interval: number, className: string, onImageClick: any }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const photo = items[currentIndex] || items[0]; // Primary photo for metadata/click
    const sources = items.map(p => getOptimizedUrl(p.imageUrl, 'thumb'));

    return (
        <div className={`${className} h-full w-full`}>
            <SmartImage 
                src={sources.length > 0 ? sources : undefined}
                alt={photo?.title || "BigBee Sports"}
                aspectRatio="fill"
                isDark={false}
                onClick={() => photo && onImageClick(photo)}
                containerClassName="rounded-[12px] cursor-pointer shadow-sm overflow-hidden group w-full h-full bg-[#f5f5f7]"
                className="h-full w-full"
                interval={interval}
                onIndexChange={setCurrentIndex}
                overlay={
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700 flex flex-col justify-end p-6 z-20">
                        <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-[10px] font-black uppercase tracking-[0.2em] line-clamp-1">
                            {photo?.title}
                        </p>
                    </div>
                }
            />
        </div>
    );
});

const SportsBentoGrid: React.FC<{ items: ProductCard[], onImageClick: any }> = ({ items, onImageClick }) => {
    const pools = useMemo(() => {
        const slotsCount = 6;
        const p = Array.from({ length: slotsCount }, () => [] as ProductCard[]);
        if (!items || items.length === 0) return p;
        items.forEach((item, idx) => { if (item) p[idx % slotsCount].push(item); });
        return p.map(pool => pool.length ? pool : items);
    }, [items]);

    return (
        <div className="w-full grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 items-stretch">
            {/* ROW 1: Mobile: Full width (3 cols) | Desktop: Small square (1/1) */}
            <BentoSlot items={pools[0]} interval={4500} className="col-span-3 md:col-span-1 aspect-[16/9] md:aspect-square" onImageClick={onImageClick} />
            
            {/* ROW 2: Mobile: 1/3 width | Desktop: Small square (1/1) */}
            <BentoSlot items={pools[1]} interval={5000} className="col-span-1 md:col-span-1 aspect-[3/4] md:aspect-square" onImageClick={onImageClick} />
            
            {/* ROW 2: Mobile: 2/3 width | Desktop: Wide slot (spans 2 columns) */}
            <BentoSlot items={pools[2]} interval={5500} className="col-span-2 md:col-span-2 h-full" onImageClick={onImageClick} />
            
            {/* ROW 3: Mobile: Full width (3 cols) | Desktop: Wide slot (spans 2) */}
            <BentoSlot items={pools[3]} interval={4800} className="col-span-3 md:col-span-2 aspect-[16/9] md:aspect-auto md:h-full" onImageClick={onImageClick} />
            
            {/* ROW 4: Mobile: 2/3 width | Desktop: Square (1/1) */}
            <BentoSlot items={pools[4]} interval={5200} className="col-span-2 md:col-span-1 h-full md:aspect-square" onImageClick={onImageClick} />
            
            {/* ROW 4: Mobile: 1/3 width | Desktop: Square (1/1) */}
            <BentoSlot items={pools[5]} interval={6000} className="col-span-1 md:col-span-1 aspect-[3/4] md:aspect-square" onImageClick={onImageClick} />
        </div>
    );
};

export default SportsBentoGrid;