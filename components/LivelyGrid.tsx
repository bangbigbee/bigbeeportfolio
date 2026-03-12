
import React, { useState, useEffect } from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

interface LivelyGridProps {
    items: ProductCard[];
}

const LivelyGrid: React.FC<LivelyGridProps> = ({ items }) => {
    const indices = [0, 1, 2];

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {indices.map((itemIdx, slotIdx) => {
                const item = items[itemIdx];
                const url = getOptimizedUrl(item.imageUrl, 'preview');
                return (
                    <div 
                        key={slotIdx} 
                        className="relative rounded-none overflow-hidden aspect-square group shadow-xl cursor-pointer bg-gray-100 transition-all duration-1000"
                    >
                        <SmartImage 
                            src={url} 
                            alt={item.title} 
                            aspectRatio="1/1"
                            containerClassName="w-full h-full"
                            className="group-hover:scale-110 transition-transform duration-[2s]"
                            isDark={false}
                            overlay={
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                    <h4 className="text-white text-2xl font-black uppercase tracking-tighter">{item.title}</h4>
                                    <p className="text-white/80 text-lg uppercase text-xs tracking-widest">{item.category}</p>
                                </div>
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default LivelyGrid;
