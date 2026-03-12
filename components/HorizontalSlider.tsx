
import React from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const HorizontalSlider: React.FC<{ items: ProductCard[], onImageClick?: any }> = ({ items, onImageClick }) => {
    return (
        <div className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing">
            <div className="flex gap-10 px-6 md:px-[calc(50vw-700px+48px)] pb-12">
                {items.map((item) => (
                    <div key={item.id} className="w-[85vw] md:w-[800px] flex-shrink-0 group">
                        <div className="relative rounded-none overflow-hidden bg-gray-100 aspect-[16/10] shadow-2xl">
                            <SmartImage 
                                src={getOptimizedUrl(item.imageUrl, 'preview')} 
                                alt={item.title} 
                                aspectRatio="16/10"
                                onClick={() => onImageClick && onImageClick(item)}
                                className="transition-transform duration-1000 group-hover:scale-110"
                                overlay={
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12 z-20">
                                        <span className="text-white/60 text-sm font-bold tracking-widest uppercase mb-2">{item.category}</span>
                                        <h4 className="text-white text-3xl font-black uppercase tracking-tighter">{item.title}</h4>
                                        <p className="text-white/80 text-lg mt-2 italic">{item.subtitle}</p>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                ))}
                <div className="w-20 flex-shrink-0" /> {/* Spacer */}
            </div>
        </div>
    );
};

export default HorizontalSlider;
