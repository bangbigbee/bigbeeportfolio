
import React from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';

interface CinematicScrollProps {
    items: ProductCard[];
    onImageClick: (img: ProductCard) => void;
}

const CinematicScroll: React.FC<CinematicScrollProps> = ({ items, onImageClick }) => {
    return (
        <div className="relative group">
            <div className="flex overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory gap-8 px-6 md:px-12">
                {items.map((item) => {
                    const url = getOptimizedUrl(item.imageUrl, 'preview');
                    return (
                        <div 
                            key={item.id} 
                            className="flex-shrink-0 w-[80vw] md:w-[700px] h-[320px] md:h-[380px] rounded-none overflow-hidden snap-center cursor-pointer shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-white/5"
                            onClick={() => onImageClick(item)}
                        >
                            <div className="relative w-full h-full">
                                <img 
                                    src={url} 
                                    className="w-full h-full object-cover" 
                                    alt={item.title} 
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase mb-2 block">{item.category}</span>
                                    <h4 className="text-lg font-bold uppercase tracking-tighter">{item.title}</h4>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="flex-shrink-0 w-12 md:w-48" />
            </div>
            <div className="mt-8 px-6 md:px-12 flex items-center gap-4 text-[9px] font-black tracking-[0.4em] uppercase text-white/20 animate-pulse">
                Drag to explore archive —
            </div>
        </div>
    );
};

export default CinematicScroll;
