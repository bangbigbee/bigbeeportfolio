import React, { useState, useMemo, memo } from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const BentoSlot = memo(({ items, interval, className, onImageClick, aspectRatio, transform = 'grid' }: { items: ProductCard[], interval: number, className: string, onImageClick: any, aspectRatio: string, transform?: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const photo = items[currentIndex] || items[0];
    const sources = items.map(p => getOptimizedUrl(p.imageUrl, transform as any));

    return (
        <div className={`${className} h-full`}>
            <SmartImage 
                src={sources.length > 0 ? sources : undefined}
                alt={photo?.title || "BigBee Interior"}
                aspectRatio={aspectRatio}
                isDark={false}
                onClick={() => photo && onImageClick(photo)}
                containerClassName="rounded-[12px] cursor-pointer shadow-sm h-full w-full group bg-[#f5f5f7]"
                className="h-full w-full"
                interval={interval}
                onIndexChange={setCurrentIndex}
                overlay={
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700 flex flex-col justify-end p-8 z-20">
                        <div className="overflow-hidden">
                            <p className="text-white/90 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-[11px] font-black uppercase tracking-[0.3em] line-clamp-1">
                                {photo?.title}
                            </p>
                        </div>
                    </div>
                }
            />
        </div>
    );
});

const InteriorBentoGrid: React.FC<{ items: ProductCard[], onImageClick: any }> = ({ items, onImageClick }) => {
    const pools = useMemo(() => {
        const slotsCount = 5;
        const p = Array.from({ length: slotsCount }, () => [] as ProductCard[]);
        if (!items || items.length === 0) return p;
        items.forEach((item, idx) => { if (item) p[idx % slotsCount].push(item); });
        return p.map(pool => pool.length ? pool : items);
    }, [items]);

    return (
        <div className="w-full grid grid-cols-4 gap-2 md:gap-4 auto-rows-fr">
            {/* Cột chính bên trái: Sử dụng transform 'default' (2000px) cho các ô lớn để tránh bị mờ */}
            <div className="col-span-3 grid grid-cols-2 gap-2 md:gap-4 row-span-2 auto-rows-fr">
                <BentoSlot items={pools[0]} interval={6500} className="col-span-2" aspectRatio="fill" onImageClick={onImageClick} transform="preview" />
                <BentoSlot items={pools[1]} interval={5500} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} transform="thumb" />
                <BentoSlot items={pools[2]} interval={5800} className="col-span-1" aspectRatio="1/1" onImageClick={onImageClick} transform="thumb" />
            </div>
            {/* Cột bên phải: Cao - Sử dụng transform 'preview' */}
            <BentoSlot items={pools[3]} interval={7500} className="col-span-1 row-span-2" aspectRatio="fill" onImageClick={onImageClick} transform="preview" />
            {/* Hàng ngang dưới cùng: Rất rộng - Sử dụng transform 'full' (1400px) để đảm bảo sắc nét tuyệt đối */}
            <BentoSlot items={pools[4]} interval={8500} className="col-span-4" aspectRatio="fill" onImageClick={onImageClick} transform="full" />
        </div>
    );
};

export default InteriorBentoGrid;