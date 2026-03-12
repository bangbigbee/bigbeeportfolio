
import React, { useEffect, useRef } from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';

const AutoSlider: React.FC<{ items: ProductCard[] }> = ({ items }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        let start = 0;

        const step = () => {
            start += 0.4; // Speed of scroll
            if (scrollContainer) {
                scrollContainer.scrollLeft = start;
                if (start >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
                    start = 0;
                }
            }
            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div 
            ref={scrollRef}
            className="w-full overflow-x-hidden hide-scrollbar cursor-grab active:cursor-grabbing py-8"
        >
            <div className="flex gap-4 md:gap-6 px-6 md:px-12 min-w-max">
                {items.map((item) => {
                    const url = getOptimizedUrl(item.imageUrl, 'thumb');
                    return (
                        <div 
                            key={item.id} 
                            className="w-[70vw] md:w-[400px] flex-shrink-0 group relative rounded-none overflow-hidden aspect-[16/10] shadow-xl transition-all"
                        >
                            <img 
                                src={url} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                 <h4 className="text-lg font-black tracking-tighter uppercase leading-none">{item.title}</h4>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AutoSlider;
