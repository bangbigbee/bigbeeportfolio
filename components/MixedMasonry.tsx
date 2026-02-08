
import React from 'react';
import { ProductCard } from '../types';

const MixedMasonry: React.FC<{ items: ProductCard[] }> = ({ items }) => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 columns-1 md:columns-2 lg:columns-3 gap-8">
            {items.map((item, idx) => (
                <div key={item.id} className="mb-8 break-inside-avoid">
                    <div className="relative overflow-hidden rounded-none group shadow-lg bg-white">
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="p-8">
                            <span className="text-[#86868b] text-xs font-black uppercase tracking-widest">{item.category}</span>
                            <h3 className="text-2xl font-black text-[#1d1d1f] mt-1 uppercase tracking-tighter">{item.title}</h3>
                            <p className="text-[#86868b] mt-2 font-medium italic">{item.subtitle}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MixedMasonry;
