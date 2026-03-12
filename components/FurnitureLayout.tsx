
import React from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';

const FurnitureLayout: React.FC<{ items: ProductCard[] }> = ({ items }) => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => {
                    const url = getOptimizedUrl(item.imageUrl, i === 0 ? 'preview' : 'thumb');
                    return (
                        <div key={item.id} className={`group relative rounded-[6px] overflow-hidden bg-white shadow-sm ${i === 0 ? 'lg:col-span-2' : ''}`}>
                            <div className="aspect-[16/9] md:aspect-auto md:h-[400px]">
                                 <img 
                                    src={url} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                                <h4 className="text-white text-2xl font-bold uppercase tracking-tighter">{item.title}</h4>
                                <p className="text-white/80 mt-1 uppercase text-xs tracking-widest">{item.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FurnitureLayout;
