
import React, { useState, useMemo, memo } from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const BentoSlot = memo(({ items, interval, className, onImageClick, aspectRatio = "1/1" }: { items: ProductCard[], interval: number, className: string, onImageClick: any, aspectRatio?: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const photo = items[currentIndex] || items[0];
    const sources = items.map(p => getOptimizedUrl(p.imageUrl, 'thumb'));

    return (
        <div className={`${className} h-full`}>
            <SmartImage 
                src={sources.length > 0 ? sources : undefined}
                alt={photo?.title || "BigBee Lifestyle"}
                aspectRatio={aspectRatio}
                isDark={false}
                onClick={() => photo && onImageClick(photo)}
                containerClassName="rounded-[12px] cursor-pointer shadow-sm overflow-hidden group h-full w-full bg-[#f5f5f7]"
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

const LifestyleBentoGrid: React.FC<{ items: ProductCard[], onImageClick: any }> = ({ items, onImageClick }) => {
    const pools = useMemo(() => {
        const slotsCount = 8;
        const p = Array.from({ length: slotsCount }, () => [] as ProductCard[]);
        if (!items || items.length === 0) return p;
        items.forEach((item, idx) => { if (item) p[idx % slotsCount].push(item); });
        return p.map(pool => pool.length ? pool : items);
    }, [items]);

    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-fr">
            {/* Slot Featured: Lớn và Vuông */}
            <BentoSlot items={pools[0]} interval={5000} className="col-span-2 row-span-2" aspectRatio="fill" onImageClick={onImageClick} />
            
            <BentoSlot items={pools[1]} interval={4200} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} />
            <BentoSlot items={pools[2]} interval={4800} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} />
            
            {/* Slot Dài: Tỷ lệ 2/1 để khớp chiều cao với 2 ô vuông bên cạnh */}
            <BentoSlot items={pools[3]} interval={5500} className="col-span-2" aspectRatio="fill" onImageClick={onImageClick} />
            
            <BentoSlot items={pools[4]} interval={4600} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} />
            <BentoSlot items={pools[5]} interval={5200} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} />
            <BentoSlot items={pools[6]} interval={4900} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} />
            <BentoSlot items={pools[7]} interval={5100} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} />
        </div>
    );
};

export default LifestyleBentoGrid;
