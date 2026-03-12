
import React from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';

interface InfiniteStripProps {
    items: ProductCard[];
    onImageClick: (img: ProductCard) => void;
    speed?: number;
    height?: string;
}

const InfiniteStrip: React.FC<InfiniteStripProps> = ({ items, onImageClick, speed = 100, height = "h-[250px] md:h-[350px]" }) => {
    const stripItems = [...items, ...items, ...items];

    return (
        <div className="w-full overflow-hidden relative py-12 group select-none">
            <div 
                className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]"
                style={{ animationDuration: `${speed}s` }}
            >
                {stripItems.map((item, idx) => {
                    const url = getOptimizedUrl(item.imageUrl, 'thumb');
                    return (
                        <div 
                            key={`${item.id}-${idx}`} 
                            className={`${height} aspect-auto flex-shrink-0 cursor-pointer overflow-hidden rounded-none shadow-sm transition-transform hover:scale-105 duration-700`}
                            onClick={() => onImageClick(item)}
                        >
                            <img 
                                src={url} 
                                alt={item.title} 
                                className="h-full w-auto object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.3333%); }
                }
                .animate-marquee {
                    animation: marquee linear infinite;
                }
            `}</style>
        </div>
    );
};

export default InfiniteStrip;
